<?php

use App\Models\Purchase;
use Illuminate\Support\Facades\Route;

Route::get('/admin/purchases/{purchase}/invoice', function (Purchase $purchase) {
    return view('components.purchase-invoice', ['purchase' => $purchase]);
})->name('filament.admin.resources.purchases.invoice');
