<?php

namespace App\Pos\Api;

use Filament\Contracts\Plugin;
use Filament\Panel;
use  App\Pos\Api\Facades\FilamentAPI;
use  App\Pos\Api\Filament\Resources\ApiResource;


class FilamentAPIPlugin implements Plugin
{
    protected array $routes = [];
    public function getId(): string
    {
        return 'filament-api';
    }

    public function register(Panel $panel): void
    {
        $panel->resources([
            ApiResource::class
        ]);
    }

    public function boot(Panel $panel): void
    {

    }

    public static function make(): static
    {
        return new static();
    }
}
