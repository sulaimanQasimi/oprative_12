<?php

namespace App\Pos\Account\Services;

use Illuminate\Support\Collection;

class FilamentTypesRegister
{
    public array $types = [];

    public function register(array|string $type, string $for):void
    {
    }

    public function getFor(): Collection
    {
        return collect($this->types)->keys();
    }

    public function getTypes(string $for): Collection
    {
        return collect($this->types)->filter(fn($type, $key) => $key === $for);
    }
}
