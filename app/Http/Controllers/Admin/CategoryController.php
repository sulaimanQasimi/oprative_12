<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    /**
     * Store a newly created category hierarchy.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'general_name' => 'required|string|max:255',
            'sub_name' => 'required|string|max:255',
            'final_name' => 'required|string|max:255',
        ], [
            'general_name.required' => 'General category name is required.',
            'sub_name.required' => 'Sub category name is required.',
            'final_name.required' => 'Final category name is required.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Create or find general category (level 1) - FIRST
            $generalCategory = Category::firstOrCreate(
                ['name' => $request->general_name, 'level' => 1],
                ['parent_id' => null]
            );

            // Create or find final category (level 3) - FINAL (direct child of general)
            $finalCategory = Category::firstOrCreate(
                ['name' => $request->final_name, 'level' => 3, 'parent_id' => $generalCategory->id],
                []
            );

            // Create or find sub category (level 2) - SUB (inserted between first and final)
            $subCategory = Category::firstOrCreate(
                ['name' => $request->sub_name, 'level' => 2, 'parent_id' => $generalCategory->id],
                []
            );

            // Update final category to be child of sub category (move it under sub)
            $finalCategory->update(['parent_id' => $subCategory->id]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Category hierarchy created successfully.',
                'data' => [
                    'general' => $generalCategory,
                    'sub' => $subCategory,
                    'final' => $finalCategory,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create category hierarchy.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get categories by level.
     */
    public function getByLevel(Request $request): JsonResponse
    {
        $level = $request->get('level', 1);
        $parentId = $request->get('parent_id');

        $query = Category::where('level', $level);
        
        if ($parentId) {
            $query->where('parent_id', $parentId);
        }

        $categories = $query->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Get all categories with hierarchy.
     */
    public function index(): JsonResponse
    {
        $categories = Category::with('parent')->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }
} 