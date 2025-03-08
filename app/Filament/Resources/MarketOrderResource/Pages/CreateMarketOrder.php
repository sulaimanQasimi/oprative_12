<?php

namespace App\Filament\Resources\MarketOrderResource\Pages;

use App\Filament\Resources\MarketOrderResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateMarketOrder extends CreateRecord
{
    protected static string $resource = MarketOrderResource::class;
}
