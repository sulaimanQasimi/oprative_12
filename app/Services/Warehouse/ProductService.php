<?php

namespace App\Services\Warehouse;

use App\Exceptions\ProductNotFoundException;
use App\Models\WarehouseProduct;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductService
{
    /**
     * Cache key prefix for products
     */
    protected const PRODUCT_CACHE_PREFIX = 'warehouse_product_';

    /**
     * Cache TTL in seconds (30 minutes)
     */
    protected const CACHE_TTL = 1800;

    /**
     * Get filtered and paginated warehouse products
     *
     * @param int $perPage
     * @param string $sortBy
     * @param string $sortDirection
     * @param string|null $searchTerm
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getFilteredProducts(
        int $perPage = 9,
        string $sortBy = 'net_quantity',
        string $sortDirection = 'desc',
        ?string $searchTerm = null
    ): LengthAwarePaginator {
        // Start with a base query
        $query = WarehouseProduct::with(['product', 'warehouse']);

        // Apply search filter if provided
        if ($searchTerm) {
            $query->whereHas('product', function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('description', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('sku', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Apply sorting (with validation to prevent SQL injection)
        $allowedSortFields = ['net_quantity', 'created_at', 'updated_at', 'min_quantity', 'max_quantity'];
        $sortBy = in_array($sortBy, $allowedSortFields) ? $sortBy : 'net_quantity';

        $allowedDirections = ['asc', 'desc'];
        $sortDirection = in_array(strtolower($sortDirection), $allowedDirections) ? $sortDirection : 'desc';

        $query->orderBy($sortBy, $sortDirection);

        // Return paginated results
        return $query->paginate($perPage);
    }

    /**
     * Get a warehouse product by ID
     *
     * @param string $id
     * @return \App\Models\WarehouseProduct
     * @throws \App\Exceptions\ProductNotFoundException
     */
    public function getProductById(string $id): WarehouseProduct
    {
        try {
            // Try to get from cache first
            return Cache::remember(
                self::PRODUCT_CACHE_PREFIX . $id,
                self::CACHE_TTL,
                function () use ($id) {
                    $product = WarehouseProduct::with(['product', 'warehouse'])
                        ->findOrFail($id);

                    return $product;
                }
            );
        } catch (ModelNotFoundException $e) {
            throw new ProductNotFoundException("Warehouse product with ID {$id} not found");
        } catch (\Exception $e) {
            Log::error('Error retrieving warehouse product', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);

            throw new ProductNotFoundException("Error retrieving warehouse product");
        }
    }

    /**
     * Get product stock information
     *
     * @param string $id
     * @return array
     * @throws \App\Exceptions\ProductNotFoundException
     */
    public function getProductStockInfo(string $id): array
    {
        // Get the product first
        $product = $this->getProductById($id);

        // Get additional stock information
        $recentMovements = DB::table('stock_movements')
            ->where('warehouse_product_id', $id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $projectedStock = $this->calculateProjectedStock($product);

        // Return structured stock info
        return [
            'current_stock' => $product->net_quantity,
            'min_quantity' => $product->min_quantity,
            'max_quantity' => $product->max_quantity,
            'is_low_stock' => $product->net_quantity <= $product->min_quantity,
            'is_overstocked' => $product->net_quantity >= $product->max_quantity,
            'recent_movements' => $recentMovements,
            'projected_stock' => $projectedStock,
            'last_updated' => $product->updated_at->format('Y-m-d H:i:s')
        ];
    }

    /**
     * Calculate projected stock based on recent consumption patterns
     *
     * @param \App\Models\WarehouseProduct $product
     * @return array
     */
    protected function calculateProjectedStock(WarehouseProduct $product): array
    {
        // This would contain logic to calculate projected stock levels
        // For example, based on average consumption rate over past 30 days

        // Simplified example
        return [
            'in_30_days' => $product->net_quantity - 10, // Placeholder logic
            'in_60_days' => $product->net_quantity - 20, // Placeholder logic
            'restock_needed_in_days' => $product->net_quantity > $product->min_quantity
                ? ceil(($product->net_quantity - $product->min_quantity) / 0.33) // Avg 0.33 units consumed per day
                : 0
        ];
    }

    /**
     * Invalidate product cache
     *
     * @param string $id
     * @return void
     */
    public function invalidateProductCache(string $id): void
    {
        Cache::forget(self::PRODUCT_CACHE_PREFIX . $id);
    }
}
