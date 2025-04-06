<?php

use App\Models\WarehouseProduct;
use function Pest\Laravel\get;

test('it can display warehouse products page', function () {
    // Arrange
    $warehouseProduct = WarehouseProduct::factory()->create();

    // Act & Assert
    get(route('landing'))
        ->assertOk()
        ->assertViewIs('landing')
        ->assertViewHas('products');
});

test('it can handle ajax requests for paginated products', function () {
    // Arrange
    $warehouseProduct = WarehouseProduct::factory()->create();

    // Act & Assert
    get(route('landing'), ['X-Requested-With' => 'XMLHttpRequest'])
        ->assertOk()
        ->assertJsonStructure([
            'html',
            'hasMorePages'
        ]);
});

test('it handles exceptions gracefully', function () {
    // Mock the WarehouseProduct model to throw an exception
    $this->partialMock(WarehouseProduct::class, function ($mock) {
        $mock->shouldReceive('with')->andThrow(new \Exception('Test exception'));
    });

    // Act & Assert
    get(route('landing'))
        ->assertOk()
        ->assertViewIs('landing')
        ->assertViewHas('products');
});
