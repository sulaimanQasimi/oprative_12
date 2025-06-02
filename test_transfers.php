<?php

require_once 'vendor/autoload.php';

use App\Models\Warehouse;
use App\Models\WarehouseTransfer;
use App\Models\Product;

// Test if models can be loaded
try {
    echo "Testing Warehouse model...\n";
    $warehouse = new Warehouse();
    echo "✓ Warehouse model loaded successfully\n";

    echo "Testing WarehouseTransfer model...\n";
    $transfer = new WarehouseTransfer();
    echo "✓ WarehouseTransfer model loaded successfully\n";

    echo "Testing Product model...\n";
    $product = new Product();
    echo "✓ Product model loaded successfully\n";

    echo "Testing warehouseTransfers relationship...\n";
    $warehouseTransfersRelation = $warehouse->warehouseTransfers();
    echo "✓ warehouseTransfers relationship exists\n";

    echo "Testing fromWarehouse relationship...\n";
    $fromWarehouseRelation = $transfer->fromWarehouse();
    echo "✓ fromWarehouse relationship exists\n";

    echo "Testing toWarehouse relationship...\n";
    $toWarehouseRelation = $transfer->toWarehouse();
    echo "✓ toWarehouse relationship exists\n";

    echo "Testing product relationship...\n";
    $productRelation = $transfer->product();
    echo "✓ product relationship exists\n";

    echo "\nAll tests passed! The warehouse transfers functionality should work correctly.\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
}
