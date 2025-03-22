<div>
    <div dir="rtl" x-data="{ activeTab: 'all', selectedOrderId: null, showFilters: false }" class="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
        <x-customer-navbar />

        <!-- Main Container -->
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header Section -->
            <div class="bg-gradient-to-r from-purple-600/90 to-indigo-600/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 lg:p-8 mb-8 relative overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
                <div class="absolute inset-0 bg-grid-white/10 animate-pulse"></div>
                <div class="relative z-10">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h2 class="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                سفارشات مشتری
                            </h2>
                            <p class="text-indigo-100">@lang('Manage and track all your orders in one place')</p>
                        </div>
                        <div class="flex flex-wrap gap-3">
                            <div class="bg-white/10 backdrop-blur-md rounded-xl p-4 flex-1 min-w-[160px] hover:bg-white/20 transition-colors duration-200">
                                <span class="block text-2xl font-bold text-white mb-1">{{ $orders->count() }}</span>
                                <span class="text-indigo-100 text-sm">@lang('Total Orders')</span>
                            </div>
                            <div class="bg-white/10 backdrop-blur-md rounded-xl p-4 flex-1 min-w-[160px] hover:bg-white/20 transition-colors duration-200">
                                <span class="block text-2xl font-bold text-white mb-1">${{ number_format($orders->sum('total_amount'), 2) }}</span>
                                <span class="text-indigo-100 text-sm">@lang('Total Spent')</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Filters Section -->
            <div class="mb-6 bg-gradient-to-br from-white/80 to-indigo-50/50 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-100/50 overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
                <div class="p-4 border-b border-indigo-100/50 flex justify-between items-center bg-gradient-to-r from-purple-50 to-indigo-50">
                    <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <div class="p-2 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                        </div>
                        @lang('Filters')
                    </h3>
                    <button @click="showFilters = !showFilters"
                            class="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 hover:text-indigo-700 transition-all duration-200 group">
                        <svg xmlns="http://www.w3.org/2000/svg"
                             class="h-5 w-5 transform transition-transform duration-300"
                             :class="{ 'rotate-180': showFilters }"
                             fill="none"
                             viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
                <div x-show="showFilters"
                     x-transition:enter="transition ease-out duration-300"
                     x-transition:enter-start="opacity-0 transform -translate-y-4"
                     x-transition:enter-end="opacity-100 transform translate-y-0"
                     x-transition:leave="transition ease-in duration-200"
                     x-transition:leave-start="opacity-100 transform translate-y-0"
                     x-transition:leave-end="opacity-0 transform -translate-y-4"
                     class="p-6 space-y-6 bg-gradient-to-br from-white to-indigo-50/30">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <!-- Date Range Filter -->
                        <div class="group">
                            <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                @lang('Date Range')
                            </label>
                            <div class="relative">
                                <select wire:model.live="dateRange"
                                        class="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pl-4 pr-10 py-3 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-200 text-gray-700">
                                    <option value="all">@lang('All Time')</option>
                                    <option value="today">@lang('Today')</option>
                                    <option value="week">@lang('This Week')</option>
                                    <option value="month">@lang('This Month')</option>
                                    <option value="year">@lang('This Year')</option>
                                </select>
                                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-indigo-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Order Number Search -->
                        <div class="group">
                            <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                @lang('Order Number')
                            </label>
                            <div class="relative">
                                <input type="text"
                                       wire:model.live.debounce.300ms="searchQuery"
                                       placeholder="@lang('Search by order number...')"
                                       class="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pl-11 pr-4 py-3 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-200">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <div class="p-1.5 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Status Filter -->
                        <div class="group">
                            <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                @lang('Status')
                            </label>
                            <div class="relative">
                                <select wire:model.live="statusFilter"
                                        class="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pl-4 pr-10 py-3 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-200 text-gray-700">
                                    <option value="all">@lang('All Status')</option>
                                    <option value="pending">@lang('Pending')</option>
                                    <option value="processing">@lang('Processing')</option>
                                    <option value="completed">@lang('Completed')</option>
                                </select>
                                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-indigo-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Sort By -->
                        <div class="group">
                            <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                </svg>
                                @lang('Sort By')
                            </label>
                            <div class="relative">
                                <select wire:model.live="sortField"
                                        class="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pl-4 pr-10 py-3 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-200 text-gray-700">
                                    <option value="created_at">@lang('Date')</option>
                                    <option value="total_amount">@lang('Amount')</option>
                                    <option value="order_status">@lang('Status')</option>
                                </select>
                                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-indigo-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <div class="lg:grid lg:grid-cols-12 lg:gap-8">
                <!-- Left Column - Order List -->
                <div class="lg:col-span-5 xl:col-span-4">
                    <!-- Filter Tabs -->
                    <div class="sticky top-4 z-10 bg-white/80 backdrop-blur-xl rounded-xl p-2 shadow-sm border border-gray-100 mb-6">
                        <div class="flex gap-2">
                            <button @click="activeTab = 'all'"
                                    :class="{ 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md scale-[1.02]': activeTab === 'all', 'hover:bg-gray-50': activeTab !== 'all' }"
                                    class="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-[1.02]">
                                @lang('All Orders')
                            </button>
                            <button @click="activeTab = 'pending'"
                                    :class="{ 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md scale-[1.02]': activeTab === 'pending', 'hover:bg-gray-50': activeTab !== 'pending' }"
                                    class="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-[1.02]">
                                @lang('Pending')
                            </button>
                            <button @click="activeTab = 'completed'"
                                    :class="{ 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md scale-[1.02]': activeTab === 'completed', 'hover:bg-gray-50': activeTab !== 'completed' }"
                                    class="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-[1.02]">
                                @lang('Completed')
                            </button>
                        </div>
                    </div>

                    <!-- Orders List -->
                    <div class="space-y-4 overflow-y-auto max-h-[calc(100vh-20rem)] pr-2">
                        @forelse($orders as $order)
                            <div x-show="activeTab === 'all' || activeTab === '{{ strtolower($order->status) }}'"
                                 x-transition:enter="transition ease-out duration-500"
                                 x-transition:enter-start="opacity-0 transform -translate-y-4"
                                 x-transition:enter-end="opacity-100 transform translate-y-0"
                                 x-transition:leave="transition ease-in duration-300"
                                 x-transition:leave-start="opacity-100 transform translate-y-0"
                                 x-transition:leave-end="opacity-0 transform -translate-y-4"
                                 @click="selectedOrderId = {{ $order->id }}"
                                 :class="{ 'ring-2 ring-purple-500 shadow-xl scale-[1.02] bg-gradient-to-br from-white to-purple-50/50': selectedOrderId === {{ $order->id }}, 'hover:bg-gradient-to-br hover:from-white hover:to-indigo-50/30': selectedOrderId !== {{ $order->id }} }"
                                 class="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-500 cursor-pointer transform hover:scale-[1.02] group">
                                <div class="p-6">
                                    <div class="flex justify-between items-start">
                                        <div class="flex items-start space-x-4 rtl:space-x-reverse">
                                            <div class="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl group-hover:from-purple-200 group-hover:to-indigo-200 transition-all duration-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600 group-hover:text-indigo-700 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 class="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">@lang('Order') #{{ $order->id }}</h3>
                                                <p class="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {{ $order->created_at->format('Y-m-d H:i') }}
                                                </p>
                                            </div>
                                        </div>
                                        <span class="px-4 py-1.5 text-sm font-semibold rounded-full shadow-sm
                                            @if($order->status === 'pending') bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200
                                            @elseif($order->status === 'processing') bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200
                                            @elseif($order->status === 'completed') bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200
                                            @else bg-gray-100 text-gray-700 border border-gray-200 @endif">
                                            {{ ucfirst($order->status) }}
                                        </span>
                                    </div>

                                    <div class="mt-6 grid grid-cols-3 gap-6">
                                        <div class="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 group-hover:from-emerald-100 group-hover:to-green-100 transition-all duration-300">
                                            <span class="text-sm text-gray-600 flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                                @lang('Products')
                                            </span>
                                            <p class="text-2xl font-bold text-emerald-600 mt-1">{{ $order->items->count() }}</p>
                                        </div>
                                        <div class="col-span-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 group-hover:from-amber-100 group-hover:to-orange-100 transition-all duration-300">
                                            <span class="text-sm text-gray-600 flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                @lang('Order Number')
                                            </span>
                                            <p class="text-2xl font-bold text-amber-600 mt-1">{{ $order->order_number ?? '#' . str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @empty
                            <div class="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <div class="w-32 h-32 mx-auto mb-8">
                                    <div class="relative">
                                        <div class="absolute inset-0 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-full animate-pulse"></div>
                                        <div class="relative bg-white rounded-full p-6 shadow-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <h3 class="text-2xl font-bold text-gray-900 mb-3">@lang('No Orders Found')</h3>
                                <p class="text-gray-500 mb-8 max-w-md mx-auto">@lang('You have not placed any orders yet. Start your shopping journey and discover amazing products!')</p>
                                <a href="#" class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                                    @lang('Start Shopping')
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </a>
                            </div>
                        @endforelse
                    </div>
                </div>

                <!-- Right Column - Order Details -->
                <div class="hidden lg:block lg:col-span-7 xl:col-span-8">
                    <div class="sticky top-4">
                        <div x-show="selectedOrderId"
                             x-transition:enter="transition ease-out duration-300"
                             x-transition:enter-start="opacity-0 transform translate-y-4"
                             x-transition:enter-end="opacity-100 transform translate-y-0"
                             class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <template x-if="selectedOrderId">
                                <div class="space-y-6">
                                    <!-- Order Header -->
                                    <div class="flex flex-col space-y-4 border-b border-gray-100 pb-6">
                                        <div class="flex justify-between items-start">
                                            <div class="space-y-1">
                                                <div class="flex items-center gap-3">
                                                    <div class="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg px-3 py-1">
                                                        <span class="text-sm font-medium text-indigo-700">@lang('Order Number')</span>
                                                    </div>
                                                    <h3 class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent" x-text="$wire.getOrderNumber(selectedOrderId)"></h3>
                                                </div>
                                                <div class="flex items-center gap-2 text-gray-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span class="text-sm" x-text="new Date().toLocaleDateString()"></span>
                                                </div>
                                            </div>
                                            <div class="flex items-center gap-3">
                                                <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl px-4 py-2 shadow-sm border border-amber-100/50">
                                                    <span class="text-sm text-gray-600 block mb-1">@lang('Order Number')</span>
                                                    <p class="text-lg font-bold text-amber-600" x-text="$wire.getOrderNumber(selectedOrderId)"></p>
                                                </div>
                                                <span x-data="{ status: $wire.getOrderStatus(selectedOrderId) }"
                                                      :class="{
                                                        'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-700': status === 'pending',
                                                        'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700': status === 'processing',
                                                        'bg-gradient-to-r from-emerald-500/10 to-green-500/10 text-emerald-700': status === 'completed'
                                                      }"
                                                      class="px-4 py-2 rounded-full text-sm font-medium"
                                                      x-text="status ? (status.charAt ? status.charAt(0).toUpperCase() + status.slice(1) : status) : ''">
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Order Items -->
                                    <div class="space-y-4">
                                        <h4 class="font-medium text-gray-700 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            @lang('Order Items')
                                        </h4>
                                        <div class="grid gap-4"
                                             x-data="{
                                                items: [],
                                                async loadItems() {
                                                    if (selectedOrderId) {
                                                        this.items = await $wire.getOrderItems(selectedOrderId);
                                                    }
                                                },
                                                init() {
                                                    this.loadItems();
                                                    this.$watch('selectedOrderId', () => {
                                                        this.loadItems();
                                                    });
                                                }
                                             }">
                                            <template x-for="item in items" :key="item.id">
                                                <div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-200">
                                                    <div class="flex items-center gap-4">
                                                        <div class="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                                            <span class="text-lg font-semibold text-indigo-600" x-text="item.quantity + 'x'"></span>
                                                        </div>
                                                        <div>
                                                            <h5 class="font-medium text-gray-900" x-text="item.product.name"></h5>
                                                            <div class="flex items-center gap-3 mt-1">
                                                                <span class="text-sm text-gray-500">
                                                                    @lang('Unit Price'): <span class="text-indigo-600 font-medium" x-text="'$' + Number(item.price).toFixed(2)"></span>
                                                                </span>
                                                                <span class="text-sm text-gray-500">•</span>
                                                                <span class="text-sm text-gray-500">
                                                                    @lang('Total'): <span class="text-indigo-600 font-medium" x-text="'$' + (Number(item.quantity) * Number(item.price)).toFixed(2)"></span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <template x-if="item.product.stock">
                                                        <span class="px-3 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700">
                                                            @lang('In Stock'): <span x-text="item.product.stock"></span>
                                                        </span>
                                                    </template>
                                                </div>
                                            </template>
                                        </div>
                                    </div>

                                    <!-- Order Summary -->
                                    <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6">
                                        <div class="space-y-4"
                                             x-data="{
                                                subtotal: '0.00',
                                                tax: '0.00',
                                                total: '0.00',
                                                async loadSummary() {
                                                    if (selectedOrderId) {
                                                        this.subtotal = await $wire.getOrderSubtotal(selectedOrderId);
                                                        this.tax = await $wire.getOrderTax(selectedOrderId);
                                                        this.total = await $wire.getOrderTotal(selectedOrderId);
                                                    }
                                                },
                                                init() {
                                                    this.loadSummary();
                                                    this.$watch('selectedOrderId', () => {
                                                        this.loadSummary();
                                                    });
                                                }
                                             }">
                                            <div class="flex justify-between items-center">
                                                <span class="text-gray-600">@lang('Subtotal')</span>
                                                <span class="font-medium text-gray-800" x-text="'$' + subtotal"></span>
                                            </div>
                                            <div class="flex justify-between items-center">
                                                <span class="text-gray-600">@lang('Tax')</span>
                                                <span class="font-medium text-gray-800" x-text="'$' + tax"></span>
                                            </div>
                                            <div class="flex justify-between items-center pt-4 border-t border-purple-100">
                                                <span class="font-medium text-gray-900">@lang('Total')</span>
                                                <span class="text-xl font-bold text-indigo-600" x-text="'$' + total"></span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Action Buttons -->
                                    <div class="flex justify-end gap-3">
                                        <a href="{{ route('customer.orders.invoice', ['order' => $order->id]) }}" target="_blank"
                                           class="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2">
                                            @lang('View Invoice')
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </a>
                                        <button wire:click="viewOrderDetails(selectedOrderId)"
                                                class="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2">
                                            @lang('View Full Details')
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                        <template x-if="!$wire.isOrderPaid(selectedOrderId)">
                                            <button class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2">
                                                @lang('Pay Now')
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                            </button>
                                        </template>
                                    </div>
                                </div>
                            </template>

                            <!-- Empty State -->
                            <div x-show="!selectedOrderId" class="text-center py-12">
                                <div class="w-24 h-24 mx-auto mb-6">
                                    <div class="relative">
                                        <div class="absolute inset-0 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full animate-pulse"></div>
                                        <div class="relative bg-white rounded-full p-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <h3 class="text-xl font-semibold text-gray-900 mb-2">@lang('Select an Order')</h3>
                                <p class="text-gray-500">@lang('Choose an order from the list to view its details')</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
