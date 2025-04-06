<?php

use App\Exceptions\ProductNotFoundException;
use App\Models\User;
use App\Models\Warehouse;
use App\Models\WarehouseProduct;
use App\Services\Warehouse\ProductService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Create a test user
    $this->user = User::factory()->create();

    // Mock Log facade
    Log::spy();
});

test('index displays warehouse products with pagination and sorting', function () {
    actingAs($this->user);

    $response = get('/warehouse/products?perPage=9&sortBy=net_quantity&sortDirection=desc');

    $response->assertStatus(200);
    $response->assertViewIs('warehouse.products.index');
});

test('index handles ajax requests for infinite scroll', function () {
    actingAs($this->user);

    $response = get('/warehouse/products?page=2', [
        'X-Requested-With' => 'XMLHttpRequest'
    ]);

    $response->assertStatus(200);
    $response->assertJsonStructure(['data', 'links', 'meta']);
});

test('index handles search and filtering', function () {
    actingAs($this->user);

    $response = get('/warehouse/products?search=test+search&perPage=20&sortBy=created_at&sortDirection=asc');

    $response->assertStatus(200);
});

test('index handles validation errors gracefully', function () {
    actingAs($this->user);

    // Using an invalid sort direction should trigger validation error
    $response = get('/warehouse/products?sortDirection=invalid');

    $response->assertStatus(302); // Redirect with validation error
});

test('show displays a specific warehouse product', function () {
    actingAs($this->user);

    // Create a warehouse product
    $warehouse = Warehouse::factory()->create();
    $product = WarehouseProduct::factory()->create([
        'warehouse_id' => $warehouse->id
    ]);

    $response = get("/warehouse/products/{$product->id}");

    $response->assertStatus(200);
    $response->assertViewIs('warehouse.products.show');
});

test('show handles product not found', function () {
    actingAs($this->user);

    $nonExistentId = 999999;

    $response = get("/warehouse/products/{$nonExistentId}");

    $response->assertStatus(404);
});

test('getStockStatus returns product stock information', function () {
    actingAs($this->user);

    // Create a warehouse product
    $warehouse = Warehouse::factory()->create();
    $product = WarehouseProduct::factory()->create([
        'warehouse_id' => $warehouse->id
    ]);

    $response = get("/warehouse/products/{$product->id}/stock");

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'current_stock',
        'min_quantity',
        'max_quantity',
        'is_low_stock',
        'is_overstocked'
    ]);
});

test('getStockStatus handles exceptions gracefully', function () {
    actingAs($this->user);

    $nonExistentId = 999999;

    $response = get("/warehouse/products/{$nonExistentId}/stock");

    $response->assertStatus(404);
});
