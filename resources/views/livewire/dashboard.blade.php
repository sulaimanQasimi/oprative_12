
<div class="container">

    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-9 space-y-6">
            <livewire:market-order-create />
        </div>
        <div class="lg:col-span-3">
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
                                            <h3 class="font-semibold text-gray-800">{{ $stockProduct['product_name'] }}</h3>
                                            <div class="text-sm text-gray-500">Net Qty: {{ number_format($stockProduct['net_quantity']) }}</div>
                                        </div>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform transition-transform" :class="{ 'rotate-180': expanded }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                <div x-show="expanded" x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0 transform scale-95" x-transition:enter-end="opacity-100 transform scale-100" x-transition:leave="transition ease-in duration-100" x-transition:leave-start="opacity-100 transform scale-100" x-transition:leave-end="opacity-0 transform scale-95">
                                    <div class="mb-4">
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
    </div>
    <!-- Main Content Grid -->

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