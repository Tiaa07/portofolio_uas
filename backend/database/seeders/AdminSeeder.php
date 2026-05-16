<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            [
                'email' => 'adminbuild@gmail.com',
            ],
            [
                'name' => 'Admin Build Portfolio',
                'password' => Hash::make('adminbuild12345'),
                'role' => 'admin',
                'phone' => '081234567890',
                'status' => 'aktif',
            ]
        );
    }
}