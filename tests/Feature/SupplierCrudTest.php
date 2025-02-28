<?php

use App\Models\Supplier;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

it('can create a supplier', function () {
    $supplierData = Supplier::factory()->make()->toArray();

    DB::table('suppliers')->insert($supplierData);

    $this->assertDatabaseHas('suppliers', $supplierData);
});

it('can read a supplier', function () {
    $supplier = Supplier::factory()->create();

    $retrievedSupplier = DB::table('suppliers')->where('id', $supplier->id)->first();

    $this->assertEquals($supplier->toArray(), (array) $retrievedSupplier);
});

it('can update a supplier', function () {
    $supplier = Supplier::factory()->create();
    $updatedData = Supplier::factory()->make()->toArray();

    DB::table('suppliers')->where('id', $supplier->id)->update($updatedData);

    $this->assertDatabaseHas('suppliers', $updatedData);
});

it('can delete a supplier', function () {
    $supplier = Supplier::factory()->create();

    DB::table('suppliers')->where('id', $supplier->id)->delete();

    $this->assertSoftDeleted('suppliers', ['id' => $supplier->id]);
});
