<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'captain',
            'email' => 'admin@example.com', // You'll need an email for login
            'password' => Hash::make('12345678'),
            'is_admin' => 1,
        ]);
    }
}