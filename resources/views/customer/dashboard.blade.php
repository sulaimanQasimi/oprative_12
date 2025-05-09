<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div class="lg:col-span-8 space-y-6">
                    <livewire:market-order-create />
                </div>
                <div class="lg:col-span-4">
                    <div class="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-lg sticky top-4">
                        <div class="flex justify-between items-center mb-6">
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Stock Movement Overview</h2>
                                    <p class="text-sm text-gray-500">Track your inventory performance</p>
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 gap-4 sm:gap-6">
                            @foreach($customerStockProducts as $stockProduct)
                                <div class="group relative transform transition-all duration-300 hover:-translate-y-1" x-data="{ expanded: false }">
                                    <div class="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-xl blur-xl transition-all duration-300 group-hover:blur-2xl"></div>
                                    <div class="relative p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-xl border border-gray-100/50 overflow-hidden"
                                        :class="{
                                            'bg-white/95': expanded,
                                            'bg-green-50/95 text-green-700': !expanded && '{{ $stockProduct["status"] }}' === 'In Stock',
                                            'bg-yellow-50/95 text-yellow-700': !expanded && '{{ $stockProduct["status"] }}' === 'Low Stock',
                                            'bg-red-50/95 text-red-700': !expanded && '{{ $stockProduct["status"] }}' === 'Out of Stock',
                                            'bg-gray-50/95 text-gray-700': !expanded && !['In Stock', 'Low Stock', 'Out of Stock'].includes('{{ $stockProduct["status"] }}')
                                        }">
                                        <!-- Header Section -->
                                        <div class="flex items-center justify-between mb-4 cursor-pointer" @click="expanded = !expanded">
                                            <div class="flex items-center gap-4">
                                                <div class="relative">
                                                    <div class="w-12 h-12 rounded-xl flex items-center justify-center {{ $this->getStatusClass($stockProduct['status']) }} shadow-lg">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                        </svg>
                                                    </div>
                                                    @if($stockProduct['net_quantity'] <= 5)
                                                        <div class="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full shadow-sm">
                                                            Low Stock
                                                        </div>
                                                    @endif
                                                </div>
                                                <div>
                                                    <h3 class="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors duration-200">{{ $stockProduct['product_name'] }}</h3>
                                                    <div class="flex items-center gap-2 mt-1">
                                                        <span class="text-sm text-gray-500">Net Qty:</span>
                                                        <span class="text-sm font-semibold text-gray-700">{{ number_format($stockProduct['net_quantity']) }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex items-center gap-3">
                                                <div class="flex gap-2">
                                                    <span class="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">W: ${{ number_format($stockProduct['wholesale_price'], 2) }}</span>
                                                    <span class="text-xs bg-purple-50 text-purple-600 px-2.5 py-1 rounded-full font-medium">R: ${{ number_format($stockProduct['retail_price'], 2) }}</span>
                                                </div>
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 transform transition-transform duration-200" :class="{ 'rotate-180': expanded }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>

                                        <!-- Expanded Content -->
                                        <div x-show="expanded"
                                            x-transition:enter="transition ease-out duration-200"
                                            x-transition:enter-start="opacity-0 transform scale-95"
                                            x-transition:enter-end="opacity-100 transform scale-100"
                                            x-transition:leave="transition ease-in duration-100"
                                            x-transition:leave-start="opacity-100 transform scale-100"
                                            x-transition:leave-end="opacity-0 transform scale-95">
                                            <div class="mb-6">
                                                <div class="flex items-center gap-2 text-xs text-gray-400 mb-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                                    </svg>
                                                    <span>Barcode: {{ $stockProduct['barcode'] }}</span>
                                                </div>
                                            </div>

                                            <div class="grid grid-cols-2 gap-4 mb-6">
                                                <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                                                    <div class="flex items-center gap-2 text-sm text-green-600 mb-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span class="font-medium">Income</span>
                                                    </div>
                                                    <div class="flex justify-between items-end">
                                                        <div>
                                                            <div class="text-2xl font-bold text-gray-800">{{ number_format($stockProduct['income_quantity']) }}</div>
                                                            <div class="text-xs text-gray-500">Quantity</div>
                                                        </div>
                                                        <div class="text-right">
                                                            <div class="text-2xl font-bold text-green-600">${{ number_format($stockProduct['income_total'], 2) }}</div>
                                                            <div class="text-xs text-gray-500">Total</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-xl border border-red-100">
                                                    <div class="flex items-center gap-2 text-sm text-red-600 mb-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                        </svg>
                                                        <span class="font-medium">Outcome</span>
                                                    </div>
                                                    <div class="flex justify-between items-end">
                                                        <div>
                                                            <div class="text-2xl font-bold text-gray-800">{{ number_format($stockProduct['outcome_quantity']) }}</div>
                                                            <div class="text-xs text-gray-500">Quantity</div>
                                                        </div>
                                                        <div class="text-right">
                                                            <div class="text-2xl font-bold text-red-600">${{ number_format($stockProduct['outcome_total'], 2) }}</div>
                                                            <div class="text-xs text-gray-500">Total</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                                                <div class="flex justify-between items-center">
                                                    <div class="flex items-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                        </svg>
                                                        <span class="text-sm font-medium text-blue-600">Profit</span>
                                                    </div>
                                                    <div class="text-right">
                                                        <div class="text-2xl font-bold {{ $stockProduct['profit'] >= 0 ? 'text-green-600' : 'text-red-600' }}">
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
            </div>
        </div>
    </div>
</x-app-layout>

@script
<script>
    $wire.on('closeModalAfterSuccess', () => {
        setTimeout(() => {
            $wire.closeScanner();
        }, 1000);
    });
</script>
@endscript
