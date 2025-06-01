<?php

namespace Database\Seeders;

use App\Models\AttendanceRecord;
use App\Models\Employee;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class AttendanceRecordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing employees or create some if none exist
        $employees = Employee::all();
        
        if ($employees->isEmpty()) {
            $this->command->info('No employees found. Creating some employees first...');
            $employees = Employee::factory(5)->create();
        }

        $this->command->info('Creating attendance records...');

        // Create attendance records for the last 10 days
        $dates = collect();
        for ($i = 9; $i >= 0; $i--) {
            $dates->push(Carbon::now()->subDays($i)->format('Y-m-d'));
        }

        foreach ($employees->take(3) as $employee) { // Take first 3 employees
            foreach ($dates as $date) {
                // Skip weekends (optional)
                $carbonDate = Carbon::parse($date);
                if ($carbonDate->isWeekend()) {
                    continue;
                }

                // 90% chance of attendance
                if (rand(1, 100) <= 90) {
                    $enteredAt = $carbonDate->copy()->setTime(
                        rand(7, 9), // 7-9 AM
                        rand(0, 59),
                        rand(0, 59)
                    );

                    $exitedAt = null;
                    // 85% chance of exit if entered
                    if (rand(1, 100) <= 85) {
                        $exitedAt = $enteredAt->copy()->addHours(
                            rand(7, 9) // 7-9 hours of work
                        )->addMinutes(
                            rand(0, 59)
                        );
                    }

                    AttendanceRecord::create([
                        'employee_id' => $employee->id,
                        'date' => $date,
                        'entered_at' => $enteredAt,
                        'exited_at' => $exitedAt,
                    ]);
                }
            }
        }

        // Create some additional random records
        AttendanceRecord::factory(10)->create();

        $this->command->info('Attendance records created successfully.');
    }
} 