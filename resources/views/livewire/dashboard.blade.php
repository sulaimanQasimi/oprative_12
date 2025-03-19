
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
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-semibold text-gray-700">Stock Movement Overview</h2>
                    <div class="flex gap-2">
                        <button class="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                            </svg>
                            Sort
                        </button>
                        <button class="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filter
                        </button>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    @foreach($customerStockProducts as $stockProduct)
                        <div class="group relative transform transition-all duration-300 hover:-translate-y-1" x-data="{ expanded: false }">
                            <div class="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-xl blur-xl transition-all duration-300 group-hover:blur-2xl"></div>
                            <div class="relative p-5 rounded-xl shadow-sm transition-all duration-300 hover:shadow-xl border border-gray-100/50"
                                :class="{
                                    'bg-white/95': expanded,
                                    [getStatusClassWithoutBg('{{ $stockProduct["status"] }}')]: !expanded
                                }">
                                <div class="flex items-center justify-between mb-4 cursor-pointer" @click="expanded = !expanded">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 rounded-full flex items-center justify-center {{ $this->getStatusClass($stockProduct['status']) }}">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 class="font-semibold text-gray-800">{{ $stockProduct['customer_name'] }}</h3>
                                            <div class="text-sm text-gray-500">Net Qty: {{ number_format($stockProduct['net_quantity']) }}</div>
                                        </div>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform transition-transform" :class="{ 'rotate-180': expanded }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                <div x-show="expanded" x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0 transform scale-95" x-transition:enter-end="opacity-100 transform scale-100" x-transition:leave="transition ease-in duration-100" x-transition:leave-start="opacity-100 transform scale-100" x-transition:leave-end="opacity-0 transform scale-95">
                                    <div class="mb-4">
                                        <p class="text-sm text-gray-500">{{ $stockProduct['product_name'] }}</p>
                                        <p class="text-xs text-gray-400">Barcode: {{ $stockProduct['barcode'] }}</p>
                                        <div class="flex gap-2 mt-1">
                                            <span class="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">W: ${{ number_format($stockProduct['wholesale_price'], 2) }}</span>
                                            <span class="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded">R: ${{ number_format($stockProduct['retail_price'], 2) }}</span>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-2 gap-4 mb-4">
                                        <div class="bg-gray-50/50 p-3 rounded-lg">
                                            <div class="text-sm text-gray-500 mb-1">Income</div>
                                            <div class="flex justify-between items-end">
                                                <div>
                                                    <div class="text-lg font-semibold text-gray-800">{{ number_format($stockProduct['income_quantity']) }}</div>
                                                    <div class="text-xs text-gray-500">Quantity</div>
                                                </div>
                                                <div class="text-right">
                                                    <div class="text-lg font-semibold text-green-600">${{ number_format($stockProduct['income_total'], 2) }}</div>
                                                    <div class="text-xs text-gray-500">Total</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="bg-gray-50/50 p-3 rounded-lg">
                                            <div class="text-sm text-gray-500 mb-1">Outcome</div>
                                            <div class="flex justify-between items-end">
                                                <div>
                                                    <div class="text-lg font-semibold text-gray-800">{{ number_format($stockProduct['outcome_quantity']) }}</div>
                                                    <div class="text-xs text-gray-500">Quantity</div>
                                                </div>
                                                <div class="text-right">
                                                    <div class="text-lg font-semibold text-red-600">${{ number_format($stockProduct['outcome_total'], 2) }}</div>
                                                    <div class="text-xs text-gray-500">Total</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="border-t border-gray-100 pt-4">
                                        <div class="flex justify-between items-center">
                                            <div class="text-right">
                                                <div class="text-sm text-gray-500">Profit</div>
                                                <div class="text-lg font-semibold {{ $stockProduct['profit'] >= 0 ? 'text-green-600' : 'text-red-600' }}">
                                                    ${{ number_format($stockProduct['profit'], 2) }}
                                                </div>
                                            </div>
                                        </div>
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