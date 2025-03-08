<?php

namespace TomatoPHP\FilamentUsers\Resources\UserResource\Pages;

use Filament\Resources\Pages\ManageRecords;
use TomatoPHP\FilamentUsers\Resources\UserResource;

class ManageUsers extends ManageRecords
{
    protected static string $resource = UserResource::class;

    public function getTitle(): string
    {
        return trans('Users');
    }

    protected function getActions(): array
    {
        return config('filament-users.resource.pages.list')::make($this);
    }
}
