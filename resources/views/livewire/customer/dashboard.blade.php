<div class="container">
    <!-- Navbar -->
    <nav class="bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl mb-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex">
                    <!-- Logo/Brand -->
                    <div class="flex-shrink-0 flex items-center">
                        <div class="flex items-center gap-2">
                            <div class="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Customer Portal</span>
                        </div>
                    </div>

                    <!-- Navigation Links -->
                    <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                        <a href="{{ route('customer.dashboard') }}"
                           class="inline-flex items-center px-1 pt-1 border-b-2 {{ request()->routeIs('customer.dashboard') ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700' }}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Dashboard
                        </a>
                        <a href="{{ route('customer.stock-products') }}"
                           class="inline-flex items-center px-1 pt-1 border-b-2 {{ request()->routeIs('customer.stock-products') ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700' }}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            Stock Products
                        </a>
                    </div>
                </div>

                <!-- Right side -->
                <div class="flex items-center">
                    <!-- Profile dropdown -->
                    <div class="ml-3 relative" x-data="{ open: false }">
                        <div>
                            <button @click="open = !open" class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 focus:outline-none">
                                <div class="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                    <span class="text-white font-semibold">{{ substr(auth()->guard('customer')->user()->name, 0, 1) }}</span>
                                </div>
                                <div class="hidden md:block">
                                    <div class="text-sm font-medium text-gray-700">{{ auth()->guard('customer')->user()->name }}</div>
                                    <div class="text-xs text-gray-500">{{ auth()->guard('customer')->user()->email }}</div>
                                </div>
                                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        <!-- Dropdown menu -->
                        <div x-show="open"
                             @click.away="open = false"
                             class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                             x-transition:enter="transition ease-out duration-100"
                             x-transition:enter-start="transform opacity-0 scale-95"
                             x-transition:enter-end="transform opacity-100 scale-100"
                             x-transition:leave="transition ease-in duration-75"
                             x-transition:leave-start="transform opacity-100 scale-100"
                             x-transition:leave-end="transform opacity-0 scale-95">
                            <a href="{{ route('customer.profile.show') }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                            <form method="POST" action="{{ route('customer.logout') }}">
                                @csrf
                                <button type="submit" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Logout
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Existing Content -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-8 space-y-6">
            <livewire:customer.market-order-create />
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
                                    [getStatusClassWithoutBg('{{ $stockProduct["status"] }}')]: !expanded
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
