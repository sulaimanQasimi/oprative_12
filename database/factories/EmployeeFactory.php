<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $departments = [
            'Human Resources',
            'Information Technology',
            'Finance',
            'Marketing',
            'Operations',
            'Sales',
            'Customer Service',
            'Research & Development',
            'Quality Assurance',
            'Administration'
        ];

        return [
            'photo' => 'photos/employees/' . $this->faker->uuid() . '.jpg',
            'taskra_id' => 'TKR-' . $this->faker->unique()->numerify('######'),
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'employee_id' => 'EMP-' . $this->faker->unique()->numerify('####'),
            'department' => $this->faker->randomElement($departments),
            'contact_info' => [
                'phone' => $this->faker->phoneNumber(),
                'mobile' => $this->faker->phoneNumber(),
                'address' => $this->faker->address(),
                'emergency_contact' => [
                    'name' => $this->faker->name(),
                    'phone' => $this->faker->phoneNumber(),
                    'relationship' => $this->faker->randomElement(['Spouse', 'Parent', 'Sibling', 'Friend'])
                ]
            ],
            'email' => $this->faker->unique()->safeEmail(),
        ];
    }
}
