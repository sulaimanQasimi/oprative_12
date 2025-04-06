<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Routing\UrlGenerator;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Fix for "Target class [url] does not exist" error in tests
        $this->app->singleton('url', function ($app) {
            return new UrlGenerator(
                $app['router']->getRoutes(),
                $app->make('request')
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Initialize Model connection resolver for tests
        if (app()->runningUnitTests()) {
            if (!Model::getConnectionResolver()) {
                Model::setConnectionResolver(app('db'));
            }
        }
    }
}
