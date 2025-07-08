<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Electronics Category
        $electronics = Category::create([
            'name' => 'Electronics',
            'description' => 'Electronic devices and gadgets',
            'is_active' => true,
            'is_featured' => true,
            'sort_order' => 1,
        ]);

        // Electronics SubCategories
        $smartphones = Category::create([
            'name' => 'Smartphones',
            'description' => 'Mobile phones and smartphones',
            'parent_id' => $electronics->id,
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $laptops = Category::create([
            'name' => 'Laptops',
            'description' => 'Portable computers and laptops',
            'parent_id' => $electronics->id,
            'is_active' => true,
            'sort_order' => 2,
        ]);

        $tablets = Category::create([
            'name' => 'Tablets',
            'description' => 'Tablet computers and iPads',
            'parent_id' => $electronics->id,
            'is_active' => true,
            'sort_order' => 3,
        ]);

        // Smartphones Final Categories
        Category::create([
            'name' => 'iPhone',
            'description' => 'Apple iPhone smartphones',
            'parent_id' => $smartphones->id,
            'is_active' => true,
            'sort_order' => 1,
        ]);

        Category::create([
            'name' => 'Samsung',
            'description' => 'Samsung smartphones',
            'parent_id' => $smartphones->id,
            'is_active' => true,
            'sort_order' => 2,
        ]);

        Category::create([
            'name' => 'Xiaomi',
            'description' => 'Xiaomi smartphones',
            'parent_id' => $smartphones->id,
            'is_active' => true,
            'sort_order' => 3,
        ]);

        // Laptops Final Categories
        Category::create([
            'name' => 'Gaming Laptops',
            'description' => 'High-performance gaming laptops',
            'parent_id' => $laptops->id,
            'is_active' => true,
            'sort_order' => 1,
        ]);

        Category::create([
            'name' => 'Business Laptops',
            'description' => 'Professional business laptops',
            'parent_id' => $laptops->id,
            'is_active' => true,
            'sort_order' => 2,
        ]);

        Category::create([
            'name' => 'Student Laptops',
            'description' => 'Affordable laptops for students',
            'parent_id' => $laptops->id,
            'is_active' => true,
            'sort_order' => 3,
        ]);

        // Clothing Category
        $clothing = Category::create([
            'name' => 'Clothing',
            'description' => 'Fashion and apparel',
            'is_active' => true,
            'is_featured' => true,
            'sort_order' => 2,
        ]);

        // Clothing SubCategories
        $mensClothing = Category::create([
            'name' => 'Men\'s Clothing',
            'description' => 'Clothing for men',
            'parent_id' => $clothing->id,
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $womensClothing = Category::create([
            'name' => 'Women\'s Clothing',
            'description' => 'Clothing for women',
            'parent_id' => $clothing->id,
            'is_active' => true,
            'sort_order' => 2,
        ]);

        $kidsClothing = Category::create([
            'name' => 'Kids Clothing',
            'description' => 'Clothing for children',
            'parent_id' => $clothing->id,
            'is_active' => true,
            'sort_order' => 3,
        ]);

        // Men's Clothing Final Categories
        Category::create([
            'name' => 'T-Shirts',
            'description' => 'Men\'s t-shirts and casual tops',
            'parent_id' => $mensClothing->id,
            'is_active' => true,
            'sort_order' => 1,
        ]);

        Category::create([
            'name' => 'Jeans',
            'description' => 'Men\'s jeans and denim pants',
            'parent_id' => $mensClothing->id,
            'is_active' => true,
            'sort_order' => 2,
        ]);

        Category::create([
            'name' => 'Shirts',
            'description' => 'Men\'s formal and casual shirts',
            'parent_id' => $mensClothing->id,
            'is_active' => true,
            'sort_order' => 3,
        ]);

        // Women's Clothing Final Categories
        Category::create([
            'name' => 'Dresses',
            'description' => 'Women\'s dresses and gowns',
            'parent_id' => $womensClothing->id,
            'is_active' => true,
            'sort_order' => 1,
        ]);

        Category::create([
            'name' => 'Tops',
            'description' => 'Women\'s tops and blouses',
            'parent_id' => $womensClothing->id,
            'is_active' => true,
            'sort_order' => 2,
        ]);

        Category::create([
            'name' => 'Skirts',
            'description' => 'Women\'s skirts and dresses',
            'parent_id' => $womensClothing->id,
            'is_active' => true,
            'sort_order' => 3,
        ]);

        // Home & Garden Category
        $homeGarden = Category::create([
            'name' => 'Home & Garden',
            'description' => 'Home improvement and garden supplies',
            'is_active' => true,
            'is_featured' => false,
            'sort_order' => 3,
        ]);

        // Home & Garden SubCategories
        $furniture = Category::create([
            'name' => 'Furniture',
            'description' => 'Home and office furniture',
            'parent_id' => $homeGarden->id,
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $kitchen = Category::create([
            'name' => 'Kitchen & Dining',
            'description' => 'Kitchen appliances and dining items',
            'parent_id' => $homeGarden->id,
            'is_active' => true,
            'sort_order' => 2,
        ]);

        // Furniture Final Categories
        Category::create([
            'name' => 'Living Room',
            'description' => 'Living room furniture and decor',
            'parent_id' => $furniture->id,
            'is_active' => true,
            'sort_order' => 1,
        ]);

        Category::create([
            'name' => 'Bedroom',
            'description' => 'Bedroom furniture and accessories',
            'parent_id' => $furniture->id,
            'is_active' => true,
            'sort_order' => 2,
        ]);

        Category::create([
            'name' => 'Office',
            'description' => 'Office furniture and equipment',
            'parent_id' => $furniture->id,
            'is_active' => true,
            'sort_order' => 3,
        ]);

        // Kitchen Final Categories
        Category::create([
            'name' => 'Appliances',
            'description' => 'Kitchen appliances and gadgets',
            'parent_id' => $kitchen->id,
            'is_active' => true,
            'sort_order' => 1,
        ]);

        Category::create([
            'name' => 'Cookware',
            'description' => 'Cooking pots, pans, and utensils',
            'parent_id' => $kitchen->id,
            'is_active' => true,
            'sort_order' => 2,
        ]);

        Category::create([
            'name' => 'Dining',
            'description' => 'Dining tableware and accessories',
            'parent_id' => $kitchen->id,
            'is_active' => true,
            'sort_order' => 3,
        ]);
    }
} 