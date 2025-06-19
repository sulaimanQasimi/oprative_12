<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BioDataTable;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class BioMetricController extends Controller
{
    /**
     * Show the form for creating a new biometric record.
     */
    public function create($id)
    {
        $employee = Employee::findOrFail($id);
        
        // Check if employee already has a biometric record
        $existingBiometric = BioDataTable::where('employee_id', $employee->id)->first();
        
        if ($existingBiometric) {
            return redirect()->route('admin.employees.biometric.edit', $employee->id);
        }

        return Inertia::render('Admin/Employee/CreateBiometric', [
            'employee' => $employee->load('gate'),
            'permissions' => [
                'create_biometric' => true, // Already authorized
            ]
        ]);
    }

    /**
     * Store a newly created biometric record.
     */
    public function store(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);
        
        // Check if employee already has a biometric record
        $existingBiometric = BioDataTable::where('employee_id', $employee->id)->first();
        
        if ($existingBiometric) {
            return redirect()->route('admin.employees.biometric.edit', $employee->id)
                ->with('error', 'Employee already has a biometric record. Please edit the existing one.');
        }

        $validated = $request->validate([
            'serial_number' => 'required|string|max:255',
            'image_width' => 'required|integer|min:1',
            'image_height' => 'required|integer|min:1',
            'image_dpi' => 'required|integer|min:1',
            'image_quality' => 'required|integer|min:1|max:100',
            'nfiq' => 'required|integer|min:1|max:8',
            'bmp_base64' => 'nullable|string',
            'template_base64' => 'required|string',
            'manufacturer' => 'nullable|string|max:255',
            'model' => 'nullable|string|max:255',
        ]);

        // Map the request data to match the BioDataTable fields
        $biometricData = [
            'employee_id' => $employee->id,
            'personal_info_id' => $employee->id, // Using employee id as personal info id
            'Manufacturer' => $validated['manufacturer'] ?? 'SecuGen',
            'Model' => $validated['model'] ?? 'FDU04',
            'SerialNumber' => $validated['serial_number'],
            'ImageWidth' => $validated['image_width'],
            'ImageHeight' => $validated['image_height'],
            'ImageDPI' => $validated['image_dpi'],
            'ImageQuality' => $validated['image_quality'],
            'NFIQ' => $validated['nfiq'],
            'ImageDataBase64' => $validated['bmp_base64'],
            'BMPBase64' => $validated['bmp_base64'],
            'ISOTemplateBase64' => $validated['template_base64'],
            'TemplateBase64' => $validated['template_base64'],
        ];

        BioDataTable::create($biometricData);

        return redirect()->route('admin.employees.show', $employee->id)
            ->with('success', 'Biometric data saved successfully.');
    }

    /**
     * Show the form for editing the biometric record.
     */
    public function edit($id)
    {
        $employee = Employee::findOrFail($id);
        $biometric = BioDataTable::where('employee_id', $employee->id)->firstOrFail();

        return Inertia::render('Admin/Employee/EditBiometric', [
            'employee' => $employee->load('gate'),
            'biometric' => $biometric,
            'permissions' => [
                'update_biometric' => true, // Already authorized
                'delete_biometric' => Auth::user()->can('delete_biometric'),
            ]
        ]);
    }

    /**
     * Update the biometric record.
     */
    public function update(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);
        $biometric = BioDataTable::where('employee_id', $employee->id)->firstOrFail();

        $validated = $request->validate([
            'serial_number' => 'required|string|max:255',
            'image_width' => 'required|integer|min:1',
            'image_height' => 'required|integer|min:1',
            'image_dpi' => 'required|integer|min:1',
            'image_quality' => 'required|integer|min:1|max:100',
            'nfiq' => 'required|integer|min:1|max:8',
            'bmp_base64' => 'nullable|string',
            'template_base64' => 'required|string',
            'manufacturer' => 'nullable|string|max:255',
            'model' => 'nullable|string|max:255',
        ]);

        // Map the request data to match the BioDataTable fields
        $biometricData = [
            'Manufacturer' => $validated['manufacturer'] ?? $biometric->Manufacturer,
            'Model' => $validated['model'] ?? $biometric->Model,
            'SerialNumber' => $validated['serial_number'],
            'ImageWidth' => $validated['image_width'],
            'ImageHeight' => $validated['image_height'],
            'ImageDPI' => $validated['image_dpi'],
            'ImageQuality' => $validated['image_quality'],
            'NFIQ' => $validated['nfiq'],
            'ImageDataBase64' => $validated['bmp_base64'],
            'BMPBase64' => $validated['bmp_base64'],
            'ISOTemplateBase64' => $validated['template_base64'],
            'TemplateBase64' => $validated['template_base64'],
        ];

        $biometric->update($biometricData);

        return redirect()->route('admin.employees.show', $employee->id)
            ->with('success', 'Biometric data updated successfully.');
    }

    /**
     * Remove the biometric record.
     */
    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);
        $biometric = BioDataTable::where('employee_id', $employee->id)->firstOrFail();
        $biometric->delete();

        return redirect()->route('admin.employees.show', $employee->id)
            ->with('success', 'Biometric data deleted successfully.');
    }
}
