<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SecuGenFingerprint>
 */
class SecuGenFingerprintFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $manufacturers = ['SecuGen', 'Suprema', 'HID Global', 'Crossmatch', 'Morpho'];
        $models = ['Hamster Pro 20', 'Unity 20', 'iDAT', 'Guardian 200', 'MSO 1300'];
        
        return [
            'employee_id' => Employee::factory(),
            'personal_info_id' => $this->faker->optional()->uuid(),
            'Manufacturer' => $this->faker->randomElement($manufacturers),
            'Model' => $this->faker->randomElement($models),
            'SerialNumber' => $this->faker->bothify('SN-####-????-####'),
            'ImageWidth' => $this->faker->randomElement([256, 320, 400, 512]),
            'ImageHeight' => $this->faker->randomElement([256, 320, 400, 512]),
            'ImageDPI' => $this->faker->randomElement([500, 508, 512, 1000]),
            'ImageQuality' => $this->faker->numberBetween(1, 100),
            'NFIQ' => $this->faker->numberBetween(1, 8),
            'ImageDataBase64' => base64_encode($this->faker->text(1000)),
            'BMPBase64' => base64_encode($this->faker->text(800)),
            'ISOTemplateBase64' => base64_encode($this->faker->text(600)),
            'TemplateBase64' => base64_encode($this->faker->text(400)),
        ];
    }
}
