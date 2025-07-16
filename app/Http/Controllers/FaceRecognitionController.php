<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\{DB, Log, Storage, Validator};
use App\Models\{Employee, FaceData};
use Exception;

class FaceRecognitionController extends Controller
{
    /**
     * Register face data for an employee
     */
    public function register(Request $request): JsonResponse
    {
        Log::info('Face registration request received', ['request' => $request->all()]);
        try {
            $validator = Validator::make($request->all(), [
                'employee_id' => 'required|exists:employees,id',
                'face_descriptor' => 'required|array|min:1',
                'encoding_model' => 'string|in:ssd_mobilenetv1,tinyFaceDetector,mtcnn,faceRecognitionNet',
                'confidence_score' => 'nullable|numeric|min:0|max:1',
                'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'notes' => 'nullable|string|max:500',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            
            // Check if employee exists
            $employee = Employee::find($data['employee_id']);
            if (!$employee) {
                return response()->json([
                    'success' => false,
                    'message' => 'Employee not found'
                ], 404);
            }

            DB::beginTransaction();

            // Handle image upload if provided
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('face_images', 'public');
            }

            // Create face data record
            $faceData = FaceData::create([
                'employee_id' => $data['employee_id'],
                'face_descriptor' => $data['face_descriptor'],
                'encoding_model' => $data['encoding_model'] ?? 'ssd_mobilenetv1',
                'confidence_score' => $data['confidence_score'] ?? null,
                'image_path' => $imagePath,
                'notes' => $data['notes'] ?? null,
                'is_active' => true,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Face data registered successfully',
                'data' => [
                    'id' => $faceData->id,
                    'employee_id' => $faceData->employee_id,
                    'employee_name' => $employee->full_name,
                    'encoding_model' => $faceData->encoding_model,
                    'confidence_score' => $faceData->confidence_score,
                    'image_path' => $faceData->image_path,
                    'is_active' => $faceData->is_active,
                ]
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Face registration error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to register face data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify face against an employee's registered face data
     */
    public function verify(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'employee_id' => 'required|exists:employees,id',
                'face_descriptor' => 'required|array|min:1',
                'threshold' => 'nullable|numeric|min:0|max:1',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            $threshold = $data['threshold'] ?? 0.6;

            $employee = Employee::find($data['employee_id']);
            if (!$employee) {
                return response()->json([
                    'success' => false,
                    'message' => 'Employee not found'
                ], 404);
            }

            // Check if employee has face data
            if (!$employee->hasFaceData()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No face data registered for this employee'
                ], 404);
            }

            // Verify face
            $isMatch = $employee->verifyFace($data['face_descriptor'], $threshold);
            
            // Get additional match details
            $matchDetails = $this->getMatchDetails($employee, $data['face_descriptor'], $threshold);

            return response()->json([
                'success' => true,
                'message' => $isMatch ? 'Face verified successfully' : 'Face verification failed',
                'data' => [
                    'employee_id' => $employee->id,
                    'employee_name' => $employee->full_name,
                    'is_match' => $isMatch,
                    'threshold_used' => $threshold,
                    'match_details' => $matchDetails,
                ]
            ]);

        } catch (Exception $e) {
            Log::error('Face verification error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to verify face',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search for employee by face descriptor
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'face_descriptor' => 'required|array|min:1',
                'threshold' => 'nullable|numeric|min:0|max:1',
                'limit' => 'nullable|integer|min:1|max:10',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            $threshold = $data['threshold'] ?? 0.6;
            $limit = $data['limit'] ?? 5;

            // Find best match
            $bestMatch = FaceData::findBestMatch($data['face_descriptor'], $threshold);
            
            // Get multiple potential matches
            $matches = $this->findMultipleMatches($data['face_descriptor'], $threshold, $limit);

            return response()->json([
                'success' => true,
                'message' => $bestMatch ? 'Employee found' : 'No matching employee found',
                'data' => [
                    'best_match' => $bestMatch ? [
                        'employee_id' => $bestMatch->employee_id,
                        'employee_name' => $bestMatch->employee->full_name,
                        'employee_email' => $bestMatch->employee->email,
                        'face_data_id' => $bestMatch->id,
                        'confidence_score' => $bestMatch->confidence_score,
                        'distance' => FaceData::calculateDistance($data['face_descriptor'], $bestMatch->getDescriptorArray()),
                    ] : null,
                    'all_matches' => $matches,
                    'threshold_used' => $threshold,
                    'total_matches' => count($matches),
                ]
            ]);

        } catch (Exception $e) {
            Log::error('Face search error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to search for employee',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get employee face data
     */
    public function getEmployeeFaceData(Request $request, $employeeId): JsonResponse
    {
        try {
            $employee = Employee::find($employeeId);
            if (!$employee) {
                return response()->json([
                    'success' => false,
                    'message' => 'Employee not found'
                ], 404);
            }

            $faceData = $employee->faceData()
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($face) {
                    return [
                        'id' => $face->id,
                        'encoding_model' => $face->encoding_model,
                        'confidence_score' => $face->confidence_score,
                        'image_path' => $face->image_path,
                        'is_active' => $face->is_active,
                        'notes' => $face->notes,
                        'created_at' => $face->created_at,
                        'updated_at' => $face->updated_at,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'employee_id' => $employee->id,
                    'employee_name' => $employee->full_name,
                    'has_face_data' => $employee->hasFaceData(),
                    'face_data' => $faceData,
                ]
            ]);

        } catch (Exception $e) {
            Log::error('Get employee face data error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to get employee face data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Deactivate face data
     */
    public function deactivate(Request $request, $faceDataId): JsonResponse
    {
        try {
            $faceData = FaceData::find($faceDataId);
            if (!$faceData) {
                return response()->json([
                    'success' => false,
                    'message' => 'Face data not found'
                ], 404);
            }

            $faceData->update(['is_active' => false]);

            return response()->json([
                'success' => true,
                'message' => 'Face data deactivated successfully'
            ]);

        } catch (Exception $e) {
            Log::error('Face data deactivation error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to deactivate face data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get match details for verification
     */
    private function getMatchDetails(Employee $employee, array $inputDescriptor, float $threshold): array
    {
        $activeFaceData = $employee->activeFaceData()->get();
        $details = [];

        foreach ($activeFaceData as $faceData) {
            if ($faceData->isValidDescriptor()) {
                $distance = FaceData::calculateDistance($inputDescriptor, $faceData->getDescriptorArray());
                $details[] = [
                    'face_data_id' => $faceData->id,
                    'distance' => $distance,
                    'is_match' => $distance < $threshold,
                    'confidence_score' => $faceData->confidence_score,
                    'encoding_model' => $faceData->encoding_model,
                ];
            }
        }

        return $details;
    }

    /**
     * Find multiple potential matches
     */
    private function findMultipleMatches(array $inputDescriptor, float $threshold, int $limit): array
    {
        $activeFaceData = FaceData::active()->with('employee')->get();
        $matches = [];

        foreach ($activeFaceData as $faceData) {
            if (!$faceData->isValidDescriptor()) {
                continue;
            }

            $distance = FaceData::calculateDistance($inputDescriptor, $faceData->getDescriptorArray());
            
            if ($distance < $threshold) {
                $matches[] = [
                    'employee_id' => $faceData->employee_id,
                    'employee_name' => $faceData->employee->full_name,
                    'face_data_id' => $faceData->id,
                    'distance' => $distance,
                    'confidence_score' => $faceData->confidence_score,
                    'encoding_model' => $faceData->encoding_model,
                ];
            }
        }

        // Sort by distance (ascending) and limit results
        usort($matches, function ($a, $b) {
            return $a['distance'] <=> $b['distance'];
        });

        return array_slice($matches, 0, $limit);
    }
}
