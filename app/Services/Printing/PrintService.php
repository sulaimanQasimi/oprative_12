<?php

namespace App\Services\Printing;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;

class PrintService
{
    /**
     * Cache key for printer settings
     */
    protected const PRINTER_SETTINGS_CACHE_KEY = 'printer_settings';

    /**
     * Default printer settings
     */
    protected const DEFAULT_PRINTER_SETTINGS = [
        'printer_name' => 'Thermal Printer',
        'paper_width' => 80, // mm
        'paper_height' => 0, // 0 means continuous
        'margins' => [
            'top' => 5,
            'right' => 5,
            'bottom' => 5,
            'left' => 5
        ],
        'font_size' => 10,
        'logo_enabled' => true,
    ];

    /**
     * Record a print attempt for a model
     *
     * @param \Illuminate\Database\Eloquent\Model $model
     * @return void
     */
    public function recordPrintAttempt(Model $model): void
    {
        // If the model has a print_count field, increment it
        if (in_array('print_count', $model->getFillable(), true)) {
            $model->increment('print_count');
        }

        // If the model has a last_printed_at field, update it
        if (in_array('last_printed_at', $model->getFillable(), true)) {
            $model->update(['last_printed_at' => now()]);
        }
    }

    /**
     * Get printer settings
     *
     * @return array
     */
    public function getPrinterSettings(): array
    {
        // Try to get settings from cache first
        return Cache::remember(self::PRINTER_SETTINGS_CACHE_KEY, now()->addDay(), function () {
            // If not in cache, try to get from config
            $configSettings = Config::get('printing.thermal_printer', []);

            // Merge with defaults
            return array_merge(self::DEFAULT_PRINTER_SETTINGS, $configSettings);
        });
    }

    /**
     * Update printer settings
     *
     * @param array $settings
     * @return array
     */
    public function updatePrinterSettings(array $settings): array
    {
        // Get current settings
        $currentSettings = $this->getPrinterSettings();

        // Merge with new settings
        $newSettings = array_merge($currentSettings, $settings);

        // Update cache
        Cache::put(self::PRINTER_SETTINGS_CACHE_KEY, $newSettings, now()->addDay());

        return $newSettings;
    }

    /**
     * Format currency for printing
     *
     * @param float|int $amount
     * @param string $currency
     * @return string
     */
    public function formatCurrency($amount, string $currency = 'USD'): string
    {
        // You can use Laravel's money formatting or implement custom formatting
        return number_format($amount, 2) . ' ' . $currency;
    }

    /**
     * Format date for printing
     *
     * @param string|\Carbon\Carbon $date
     * @param string $format
     * @return string
     */
    public function formatDate($date, string $format = 'Y-m-d H:i:s'): string
    {
        if ($date instanceof \Carbon\Carbon) {
            return $date->format($format);
        }

        return \Carbon\Carbon::parse($date)->format($format);
    }
}
