<?php

namespace Database\Factories;

use App\Models\AttendanceRecord;
use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AttendanceRecord>
 */
class AttendanceRecordFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = AttendanceRecord::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $date = $this->faker->dateTimeBetween('-30 days', 'now');
        $enteredAt = null;
        $exitedAt = null;

        // 90% chance of having entered_at
        if ($this->faker->boolean(90)) {
            $enteredAt = Carbon::parse($date)->setTime(
                $this->faker->numberBetween(7, 9), // 7-9 AM
                $this->faker->numberBetween(0, 59),
                $this->faker->numberBetween(0, 59)
            );

            // 85% chance of having exited_at if entered_at exists
            if ($this->faker->boolean(85)) {
                $exitedAt = Carbon::parse($enteredAt)->addHours(
                    $this->faker->numberBetween(7, 10) // 7-10 hours of work
                )->addMinutes(
                    $this->faker->numberBetween(0, 59)
                );
            }
        }

        return [
            'employee_id' => Employee::factory(),
            'date' => $date->format('Y-m-d'),
            'entered_at' => $enteredAt,
            'exited_at' => $exitedAt,
        ];
    }

    /**
     * Create a complete attendance record (both entered and exited).
     */
    public function complete(): static
    {
        return $this->state(function (array $attributes) {
            $date = Carbon::parse($attributes['date'] ?? now());
            $enteredAt = $date->copy()->setTime(
                $this->faker->numberBetween(7, 9),
                $this->faker->numberBetween(0, 59)
            );
            $exitedAt = $enteredAt->copy()->addHours(
                $this->faker->numberBetween(7, 9)
            )->addMinutes(
                $this->faker->numberBetween(0, 59)
            );

            return [
                'entered_at' => $enteredAt,
                'exited_at' => $exitedAt,
            ];
        });
    }

    /**
     * Create an incomplete attendance record (only entered).
     */
    public function incomplete(): static
    {
        return $this->state(function (array $attributes) {
            $date = Carbon::parse($attributes['date'] ?? now());
            $enteredAt = $date->copy()->setTime(
                $this->faker->numberBetween(7, 9),
                $this->faker->numberBetween(0, 59)
            );

            return [
                'entered_at' => $enteredAt,
                'exited_at' => null,
            ];
        });
    }

    /**
     * Create an attendance record for today.
     */
    public function today(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'date' => now()->format('Y-m-d'),
            ];
        });
    }

    /**
     * Create an attendance record for a specific date.
     */
    public function forDate(string $date): static
    {
        return $this->state(function (array $attributes) use ($date) {
            return [
                'date' => $date,
            ];
        });
    }
} 