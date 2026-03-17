<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Electronics'],
            ['name' => 'Fashion'],
            ['name' => 'Home & Garden'],
            ['name' => 'Sports'],
            ['name' => 'Books']
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}