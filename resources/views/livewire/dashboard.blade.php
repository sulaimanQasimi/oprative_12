
<div class="container mx-auto p-4 lg:p-6">
    <!-- Header Section -->
    <header class="mb-8 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-800">POS Dashboard</h1>
        <button wire:click="openScanner" class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2m0 0H8m4 0h4m-4-8v1m-6 0a9 9 0 1018 0 9 9 0 00-18 0z" />
            </svg>
            Scan Barcode
        </button>
    </header>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Table Layout Section (3 columns) -->
        <div class="lg:col-span-3">
            <div class="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
                <h2 class="text-xl font-semibold mb-4 text-gray-700">Table Layout</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <!-- Stock Movement Cards -->
                    @foreach($customerStockProducts as $stockProduct)
                        <div class="relative group">
                            <div class="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl transition-all duration-300 group-hover:scale-105 -z-10"></div>
                            <div class="bg-white/90 p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl">
                                <div class="flex items-center justify-between mb-3">
                                    <span class="text-lg font-medium">{{ $stockProduct['customer_name'] }}</span>
                                    <span class="px-2 py-1 rounded-full text-xs {{ $this->getStatusClass($stockProduct['status']) }}">
                                        {{ ucfirst($stockProduct['status']) }}
                                    </span>
                                </div>
                                <h3 class="text-md font-medium text-gray-700 mb-2">{{ $stockProduct['product_name'] }}</h3>
                                <div class="grid grid-cols-2 gap-2 text-sm">
                                    <div class="space-y-1">
                                        <p class="text-gray-600">Income Qty: <span class="font-medium text-gray-800">{{ number_format($stockProduct['income_quantity']) }}</span></p>
                                        <p class="text-gray-600">Income Total: <span class="font-medium text-gray-800">${{ number_format($stockProduct['income_total'], 2) }}</span></p>
                                    </div>
                                    <div class="space-y-1">
                                        <p class="text-gray-600">Outcome Qty: <span class="font-medium text-gray-800">{{ number_format($stockProduct['outcome_quantity']) }}</span></p>
                                        <p class="text-gray-600">Outcome Total: <span class="font-medium text-gray-800">${{ number_format($stockProduct['outcome_total'], 2) }}</span></p>
                                    </div>
                                </div>
                                <div class="mt-3 pt-3 border-t border-gray-100">
                                    <div class="flex justify-between items-center">
                                        <p class="text-gray-600">Net Quantity: <span class="font-medium text-gray-800">{{ number_format($stockProduct['net_quantity']) }}</span></p>
                                        <p class="text-gray-600">Profit: <span class="font-medium {{ $stockProduct['profit'] >= 0 ? 'text-green-600' : 'text-red-600' }}">${{ number_format($stockProduct['profit'], 2) }}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>

        <!-- Cart Sidebar (1 column) -->
        <div class="lg:col-span-1">
            <div class="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg sticky top-4">
                <h2 class="text-xl font-semibold mb-4 text-gray-700">Cart</h2>
                <div class="space-y-4">
                    @forelse($cartItems as $index => $item)
                        <div class="bg-white/90 p-4 rounded-xl shadow-sm">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h3 class="font-medium">{{ $item['name'] }}</h3>
                                    <p class="text-sm text-gray-600">${{ $item['price'] }}</p>
                                </div>
                                <div class="flex items-center gap-2">
                                    <button class="text-gray-500 hover:text-gray-700">-</button>
                                    <span class="text-sm">{{ $item['quantity'] }}</span>
                                    <button class="text-gray-500 hover:text-gray-700">+</button>
                                </div>
                            </div>
                        </div>
                    @empty
                        <div class="text-gray-500 text-center py-8">No items in cart</div>
                    @endforelse
                </div>
                <!-- Checkout Button -->
                <button class="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1">
                    Checkout
                </button>
            </div>
        </div>
    </div>

    <!-- Barcode Scanner Modal -->
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" x-show="$wire.showScannerModal" x-cloak>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg">
            <div class="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-2xl mx-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold">Scan Barcode</h3>
                    <button wire:click="closeScanner" class="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <div class="text-center p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2m0 0H8m4 0h4m-4-8v1m-6 0a9 9 0 1018 0 9 9 0 00-18 0z" />
                        </svg>
                        <p class="text-gray-600">Place barcode in front of the scanner</p>
                        <input type="text" wire:model.live="scannedBarcode" wire:keydown.enter="processBarcode" class="sr-only" autofocus>
                    </div>
                </div>
                @if($scanSuccess)
                    <div class="mb-4 p-4 bg-green-50 rounded-lg">
                        <div class="flex items-center gap-3 text-green-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Product scanned successfully!</span>
                        </div>
                    </div>
                @endif
                <button wire:click="closeScanner" class="w-full bg-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-300 transition-colors">
                    Cancel
                </button>
            </div>
        </div>
    </div>
</div>
@script
<script>
    $wire.on('closeModalAfterSuccess', () => {
        setTimeout(() => {
            $wire.closeScanner();
        }, 1000);
    });
</script>
@endscript