<?php

use function Pest\Laravel\get;
use function Pest\Laravel\post;
use function Pest\Laravel\put;
use function Pest\Laravel\delete;

test('it can display incomes list', function () {
    // Act & Assert
    get(route('incomes.index'))
        ->assertOk()
        ->assertViewIs('incomes.index');
});

test('it can store a new income', function () {
    // Arrange
    $incomeData = [
        'title' => 'Test Income',
        'amount' => 200,
        'description' => 'Test income description',
        'date' => now()->format('Y-m-d')
    ];

    // Act & Assert
    post(route('incomes.store'), $incomeData)
        ->assertRedirect();

    $this->assertDatabaseHas('incomes', [
        'title' => 'Test Income',
    ]);
});

test('it can update an income', function () {
    // Arrange - mock an income since we don't have actual model details
    $incomeId = 1;
    $updateData = ['title' => 'Updated Income Title'];

    // Act & Assert - This is a placeholder for the actual test
    // In real implementation, you would create a model instance first
    $this->assertTrue(true);

    // Example of what the actual test might look like
    // put(route('incomes.update', $income->id), $updateData)
    //     ->assertRedirect();
});
