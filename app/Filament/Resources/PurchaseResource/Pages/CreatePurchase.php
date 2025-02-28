<?php

namespace App\Filament\Resources\PurchaseResource\Pages;

use App\Filament\Resources\PurchaseResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreatePurchase extends CreateRecord
{
    protected static string $resource = PurchaseResource::class;
    // public  function mount(): void
    // {
    //     $this->data['user_id'] = auth()->user()->id;
    // }
    protected function afterFill(): void
    {
        // Runs before the form fields are populated with their default values.

        $this->data['user_id'] = auth()->user()->id;
    }

}
