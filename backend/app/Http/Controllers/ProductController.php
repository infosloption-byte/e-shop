<?php
namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    // --- CATEGORY FUNCTIONS ---

    public function listCategories() {
        return response()->json(Category::withCount('products')->get());
    }

    public function storeCategory(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|unique:categories',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('categories', 'public');
            $validated['image'] = $path;
        }

        $category = Category::create($validated);
        return response()->json($category, 201);
    }

    public function updateCategory(Request $request, $id) {
        $category = Category::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|unique:categories,name,' . $id,
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        if ($request->hasFile('image')) {
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }
            $path = $request->file('image')->store('categories', 'public');
            $validated['image'] = $path;
        }

        $category->update($validated);
        return response()->json($category);
    }

    public function destroyCategory($id) {
        $category = Category::findOrFail($id);

        if ($category->products()->count() > 0) {
            return response()->json(['message' => 'Cannot delete category with associated products'], 422);
        }

        if ($category->image) {
            Storage::disk('public')->delete($category->image);
        }

        $category->delete();
        return response()->json(['message' => 'Category deleted successfully']);
    }

    // --- PRODUCT FUNCTIONS ---

    public function index(Request $request) {
        $query = Product::with(['category', 'images']);

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request) {
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'category_id' => 'required|exists:categories,id',
            'images' => 'nullable|array', // Allow null or empty
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',
            'image_url' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($request) {
            $data = $request->only(['name', 'description', 'price', 'stock', 'category_id', 'image_url']);
            $data['slug'] = Str::slug($request->name) . '-' . time();

            $product = Product::create($data);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    $path = $file->store('products', 'public');
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $path
                    ]);
                }
            }

            return response()->json($product->load('images'), 201);
        });
    }

    public function show($id) {
        $product = Product::with(['category', 'images'])->findOrFail($id);
        return response()->json($product);
    }

    public function update(Request $request, $id) {
        $product = Product::findOrFail($id);
        
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'category_id' => 'required|exists:categories,id',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',
            'image_url' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($request, $product) {
            $data = $request->only(['name', 'description', 'price', 'stock', 'category_id', 'image_url']);
            
            if ($request->name !== $product->name) {
                $data['slug'] = Str::slug($request->name) . '-' . time();
            }

            $product->update($data);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    $path = $file->store('products', 'public');
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $path
                    ]);
                }
            }

            return response()->json($product->load('images'));
        });
    }

    public function destroy($id) {
        $product = Product::findOrFail($id);
        
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->image_path);
            $image->delete();
        }

        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function getByCategory($categoryId) {
        $products = Product::where('category_id', $categoryId)->with('images')->get();
        return response()->json($products);
    }

    public function destroyImage($id) {
        $image = ProductImage::findOrFail($id);
        
        // Delete file from storage
        Storage::disk('public')->delete($image->image_path);
        
        // Delete record from database
        $image->delete();
        
        return response()->json(['message' => 'Image removed successfully']);
    }
}