<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all();

        foreach ($categories as $category) {
            for ($i = 1; $i <= 10; $i++) {
                $product = Product::create([
                    'name' => "{$category->name} Item $i",
                    'description' => "This is a high-quality product from our {$category->name} collection. Durable and stylish.",
                    'price' => rand(10, 500) + (rand(0, 99) / 100),
                    'stock' => rand(0, 50),
                    'category_id' => $category->id,
                ]);

                // Create a dummy image record for each product
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => 'products/placeholder.webp', 
                ]);
            }
        }
    }
}