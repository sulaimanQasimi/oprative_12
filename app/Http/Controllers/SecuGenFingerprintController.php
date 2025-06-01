<?php

namespace App\Http\Controllers;

use App\Models\SecuGenFingerprint;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class SecuGenFingerprintController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', SecuGenFingerprint::class);

        $query = SecuGenFingerprint::with('employee');

        // Filter by employee
        if ($request->filled('employee_id')) {
            $query->where('employee_id', $request->employee_id);
        }

        // Filter by manufacturer
        if ($request->filled('manufacturer')) {
            $query->byManufacturer($request->manufacturer);
        }

        // Filter by model
        if ($request->filled('model')) {
            $query->byModel($request->model);
        }

        $fingerprints = $query->latest()->paginate(15);
        $employees = Employee::select('id', 'first_name', 'last_name', 'employee_id')->get();
        $manufacturers = SecuGenFingerprint::distinct()->pluck('Manufacturer');
        $models = SecuGenFingerprint::distinct()->pluck('Model');

        return view('fingerprints.index', compact('fingerprints', 'employees', 'manufacturers', 'models'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $this->authorize('create', SecuGenFingerprint::class);

        $employees = Employee::select('id', 'first_name', 'last_name', 'employee_id')->get();
        $selectedEmployee = $request->filled('employee_id') ? Employee::find($request->employee_id) : null;

        return view('fingerprints.create', compact('employees', 'selectedEmployee'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', SecuGenFingerprint::class);

        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'personal_info_id' => 'nullable|string|max:255',
            'Manufacturer' => 'required|string|max:255',
            'Model' => 'required|string|max:255',
            'SerialNumber' => 'required|string|max:255',
            'ImageWidth' => 'required|integer|min:1',
            'ImageHeight' => 'required|integer|min:1',
            'ImageDPI' => 'required|integer|min:1',
            'ImageQuality' => 'required|integer|min:1|max:100',
            'NFIQ' => 'required|integer|min:1|max:8',
            'ImageDataBase64' => 'required|string',
            'BMPBase64' => 'required|string',
            'ISOTemplateBase64' => 'required|string',
            'TemplateBase64' => 'required|string',
        ]);

        $fingerprint = SecuGenFingerprint::create($validated);

        return redirect()->route('fingerprints.show', $fingerprint)
            ->with('success', 'Fingerprint record created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(SecuGenFingerprint $fingerprint)
    {
        $this->authorize('view', $fingerprint);

        $fingerprint->load('employee');

        return view('fingerprints.show', compact('fingerprint'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SecuGenFingerprint $fingerprint)
    {
        $this->authorize('update', $fingerprint);

        $employees = Employee::select('id', 'first_name', 'last_name', 'employee_id')->get();

        return view('fingerprints.edit', compact('fingerprint', 'employees'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SecuGenFingerprint $fingerprint)
    {
        $this->authorize('update', $fingerprint);

        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'personal_info_id' => 'nullable|string|max:255',
            'Manufacturer' => 'required|string|max:255',
            'Model' => 'required|string|max:255',
            'SerialNumber' => 'required|string|max:255',
            'ImageWidth' => 'required|integer|min:1',
            'ImageHeight' => 'required|integer|min:1',
            'ImageDPI' => 'required|integer|min:1',
            'ImageQuality' => 'required|integer|min:1|max:100',
            'NFIQ' => 'required|integer|min:1|max:8',
            'ImageDataBase64' => 'required|string',
            'BMPBase64' => 'required|string',
            'ISOTemplateBase64' => 'required|string',
            'TemplateBase64' => 'required|string',
        ]);

        $fingerprint->update($validated);

        return redirect()->route('fingerprints.show', $fingerprint)
            ->with('success', 'Fingerprint record updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SecuGenFingerprint $fingerprint)
    {
        $this->authorize('delete', $fingerprint);

        $fingerprint->delete();

        return redirect()->route('fingerprints.index')
            ->with('success', 'Fingerprint record deleted successfully.');
    }

    /**
     * Display fingerprints for a specific employee.
     */
    public function byEmployee(Employee $employee)
    {
        $this->authorize('view', $employee);

        $fingerprints = $employee->fingerprints()->latest()->paginate(10);

        return view('fingerprints.by-employee', compact('employee', 'fingerprints'));
    }
}
