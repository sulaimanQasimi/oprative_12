<?php

namespace TomatoPHP\FilamentUsers\Resources\UserResource\Pages;

use Filament\Resources\Pages\CreateRecord;
use TomatoPHP\FilamentUsers\Resources\UserResource;

class CreateUser extends CreateRecord
{
    protected static string $resource = UserResource::class;

    public function getTitle(): string
    {
        return trans('user');
    }

    protected function getHeaderActions(): array
    {
        return config('filament-users.resource.pages.create')::make($this);
    }
}
