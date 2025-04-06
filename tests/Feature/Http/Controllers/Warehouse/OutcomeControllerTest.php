<?php

use function Pest\Laravel\get;
use function Pest\Laravel\post;
use App\Models\Outcome;
use App\Models\WarehouseOutcome;

test('it can display outcomes list', function () {
    // Act & Assert
    get(route('outcomes.index'))
        ->assertOk()
        ->assertViewIs('outcomes.index');
});

test('it can store a new outcome', function () {
    // Arrange
    $outcomeData = [
        'title' => 'Test Outcome',
        'amount' => 100,
        'description' => 'Test description',
        'date' => now()->format('Y-m-d')
    ];

    // Act & Assert
    post(route('outcomes.store'), $outcomeData)
        ->assertRedirect();

    $this->assertDatabaseHas('outcomes', [
        'title' => 'Test Outcome',
    ]);
});

test('it can show outcome details', function () {
    // Arrange
    $outcome = WarehouseOutcome::factory()->create();

    // Act & Assert
    get(route('outcomes.show', $outcome->id))
        ->assertOk()
        ->assertViewIs('outcomes.show')
        ->assertViewHas('outcome');
});
