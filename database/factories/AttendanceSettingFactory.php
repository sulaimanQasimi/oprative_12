<?php

namespace Database\Factories;

use App\Models\AttendanceSetting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AttendanceSetting>
 */
class AttendanceSettingFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = AttendanceSetting::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'enter_time' => '08:00:00',
            'exit_time' => '17:00:00',
        ];
    }

    /**
     * Create settings for early shift.
     */
    public function earlyShift(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'enter_time' => '06:00:00',
                'exit_time' => '15:00:00',
            ];
        });
    }

    /**
     * Create settings for late shift.
     */
    public function lateShift(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'enter_time' => '14:00:00',
                'exit_time' => '23:00:00',
            ];
        });
    }

    /**
     * Create settings for night shift.
     */
    public function nightShift(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'enter_time' => '22:00:00',
                'exit_time' => '07:00:00',
            ];
        });
    }
} 