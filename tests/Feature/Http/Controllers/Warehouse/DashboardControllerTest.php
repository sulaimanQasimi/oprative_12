<?php

use function Pest\Laravel\get;

test('it can display warehouse dashboard', function () {
    // Act & Assert
    get(route('warehouse.dashboard'))
        ->assertOk()
        ->assertViewIs('warehouse.dashboard');
});

test('it can load statistics data', function () {
    // Act & Assert
    get(route('warehouse.stats'))
        ->assertOk()
        ->assertJsonStructure([
            'sales',
            'inventory',
            'revenue'
        ]);
});

test('it can filter dashboard data by date range', function () {
    // Arrange
    $startDate = now()->subMonth()->format('Y-m-d');
    $endDate = now()->format('Y-m-d');

    // Act & Assert
    get(route('warehouse.dashboard', [
        'start_date' => $startDate,
        'end_date' => $endDate
    ]))
        ->assertOk()
        ->assertViewIs('warehouse.dashboard');
});
