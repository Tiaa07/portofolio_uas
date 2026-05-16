<?php

namespace Database\Factories;

use App\Models\Template;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Template>
 */
class TemplateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_template' => fake()->words(3, true),
            'kategori' => fake()->randomElement(['Developer', 'Creative', 'Professional']),
            'deskripsi' => fake()->paragraph(),
            'preview_gambar' => 'templates/placeholder.png',
            'demo_link' => fake()->url(),
            'harga_basic' => 25000,
            'harga_standard' => 50000,
            'harga_premium' => 100000,
            'status' => 'aktif',
        ];
    }
}
