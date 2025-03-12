<?php

namespace App\Filament\Inventory\Resources\ProductResource\Pages;

use App\Filament\Inventory\Resources\ProductResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateProduct extends CreateRecord
{
    protected static string $resource = ProductResource::class;
}
