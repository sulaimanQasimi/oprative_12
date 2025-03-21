<div dir="rtl">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Warehouse Title Section -->
                <div class="relative mb-8 overflow-hidden" x-data="{ hovered: false }">
                    <!-- Animated background gradient effect -->
                    <div class="absolute inset-0 bg-gradient-to-l from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-3xl transition-all duration-1000 animate-gradient-x"
                        :class="{ 'blur-2xl scale-105': hovered, 'blur-3xl': !hovered }">
                    </div>

                    <!-- Animated flowing gradients -->
                    <div class="absolute inset-0 overflow-hidden">
                        <div class="absolute -inset-[500px] animate-gradient-xy bg-gradient-to-l from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl"></div>
                        <div class="absolute -inset-[500px] animate-gradient-xy-reverse bg-gradient-to-l from-pink-500/10 via-purple-500/10 to-blue-500/10 blur-3xl"></div>
                    </div>

                    <!-- Main container with hover effects -->
                    <div class="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 transition-all duration-500 transform"
                        :class="{ 'scale-[1.02] shadow-2xl': hovered, 'scale-100 shadow-xl': !hovered }"
                        @mouseenter="hovered = true"
                        @mouseleave="hovered = false">
                        <!-- Animated decorative elements -->
                        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/20 to-purple-500/20 rounded-full blur-2xl transition-all duration-1000 animate-pulse"
                            :class="{ 'translate-x-0 translate-y-0 scale-110': hovered, 'translate-x-16 -translate-y-16': !hovered }">
                        </div>
                        <div class="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-bl from-purple-500/20 to-pink-500/20 rounded-full blur-2xl transition-all duration-1000 animate-pulse delay-300"
                            :class="{ 'translate-x-0 translate-y-0 scale-110': hovered, '-translate-x-16 translate-y-16': !hovered }">
                        </div>
                        <div class="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-bl from-pink-500/20 to-blue-500/20 rounded-full blur-2xl transition-all duration-1000 animate-pulse delay-700"
                            :class="{ 'scale-110': hovered, 'scale-100': !hovered }">
                        </div>

                        <!-- Content with enhanced animations -->
                        <div class="relative flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <!-- Animated Icon -->
                                <div class="w-12 h-12 rounded-xl bg-gradient-to-bl from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/20 transition-all duration-500 transform"
                                    :class="{ 'scale-110 -rotate-3': hovered, 'scale-100 rotate-0': !hovered }">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white transition-transform duration-500"
                                        :class="{ 'scale-110': hovered, 'scale-100': !hovered }"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>

                                <!-- Title and Info with enhanced animations -->
                                <div class="transition-all duration-500"
                                    :class="{ '-translate-x-2': hovered, 'translate-x-0': !hovered }">
                                    <h1 class="text-2xl font-bold bg-gradient-to-l from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent transition-all duration-500"
                                        :class="{ 'text-blue-500': hovered, 'text-blue-600': !hovered }">
                                        {{ $warehouse->name }}
                                    </h1>
                                    <p class="text-gray-500 text-sm mt-1 transition-all duration-500"
                                        :class="{ 'text-gray-600': hovered, 'text-gray-500': !hovered }">
                                        @lang('Warehouse ID'): {{ $warehouse->id }}
                                    </p>
                                </div>
                            </div>

                            <!-- Animated Status Badge -->
                            <div class="flex items-center gap-2 transition-all duration-500"
                                :class="{ '-translate-x-2': hovered, 'translate-x-0': !hovered }">
                                <div class="w-2 h-2 rounded-full bg-gradient-to-l from-blue-500 to-purple-500 animate-pulse transition-all duration-500"
                                    :class="{ 'scale-125': hovered, 'scale-100': !hovered }">
                                </div>
                                <span class="text-sm font-medium text-gray-600 transition-all duration-500"
                                    :class="{ 'text-blue-600': hovered, 'text-gray-600': !hovered }">
                                    @lang('Active')
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <!-- Left Section (span-9) -->
            <div class="lg:col-span-8 space-y-6">
                <!-- Empty section for future content -->
            </div>

            <!-- Right Section (span-3) -->
            <div class="lg:col-span-4">
                <!-- Warehouse Items Section -->
                <div class="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-lg">
                    <div class="flex justify-between items-center mb-6">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-gradient-to-bl from-blue-500 to-purple-500 rounded-lg shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 class="text-xl font-bold bg-gradient-to-l from-blue-600 to-purple-600 bg-clip-text text-transparent">@lang('Warehouse Items')</h2>
                                <p class="text-sm text-gray-500">@lang('Track your inventory items')</p>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 gap-4 sm:gap-6">
                        @foreach($warehouse->items as $item)
                            <div class="group relative transform transition-all duration-300 hover:-translate-y-1" x-data="{ expanded: false }">
                                <div class="absolute inset-0 bg-gradient-to-bl from-blue-400/20 to-purple-400/20 rounded-xl blur-xl transition-all duration-300 group-hover:blur-2xl"></div>
                                <div class="relative p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-xl border border-gray-100/50 overflow-hidden"
                                    :class="{
                                        'bg-white/95': expanded,
                                        '{{ $this->getStatusClassWithoutBg($item->product->status ?? "active") }}': !expanded
                                    }">
                                    <!-- Header Section -->
                                    <div class="flex items-center justify-between mb-4 cursor-pointer" @click="expanded = !expanded">
                                        <div class="flex items-center gap-4">
                                            <div class="relative">
                                                <div class="w-12 h-12 rounded-xl flex items-center justify-center {{ $item->quantity <= $item->minimum_quantity ? 'bg-red-500' : 'bg-green-500' }} shadow-lg">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                </div>
                                                @if($item->quantity <= $item->minimum_quantity)
                                                    <div class="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full shadow-sm">
                                                        @lang('Low Stock')
                                                    </div>
                                                @endif
                                            </div>
                                            <div>
                                                <h3 class="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors duration-200">{{ $item->product->name }}</h3>
                                                <div class="flex items-center gap-2 mt-1">
                                                    <span class="text-sm text-gray-500">@lang('Quantity'):</span>
                                                    <span class="text-sm font-semibold text-gray-700">{{ number_format($item->net_quantity) }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-3">
                                            <div class="flex gap-2">
                                                <span class="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">@lang('Min'): {{ number_format($item->minimum_quantity) }}</span>
                                                <span class="text-xs bg-purple-50 text-purple-600 px-2.5 py-1 rounded-full font-medium">@lang('Max'): {{ number_format($item->maximum_quantity) }}</span>
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
                                                <span>@lang('Product Code'): {{ $item->product->barcode }}</span>
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-2 gap-4 mb-6">
                                            <!-- Income Card -->
                                            <div class="group relative transform transition-all duration-300 hover:-translate-y-1">
                                                <div class="absolute inset-0 bg-gradient-to-bl from-green-400/10 to-emerald-400/10 rounded-xl blur-xl transition-all duration-300 group-hover:blur-2xl"></div>
                                                <div class="bg-gradient-to-bl from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 relative backdrop-blur-xl transition-all duration-300 hover:shadow-lg">
                                                    <div class="flex items-center gap-2 text-sm text-green-600 mb-3">
                                                        <div class="p-2 bg-green-100 rounded-lg transition-all duration-300 group-hover:bg-green-200">
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </div>
                                                        <span class="font-medium transition-all duration-300 group-hover:text-green-700">@lang('Income Details')</span>
                                                    </div>
                                                    <div class="space-y-2">
                                                        <div class="flex justify-between items-center">
                                                            <span class="text-sm text-gray-600">@lang('Quantity'):</span>
                                                            <span class="font-semibold">{{ number_format($item->income_quantity ?? 0, 0, '.', ',') }}</span>
                                                        </div>
                                                        <div class="flex justify-between items-center">
                                                            <span class="text-sm text-gray-600">@lang('Total'):</span>
                                                            <span class="font-semibold text-green-600">${{ number_format($item->income_total ?? 0, 2, '.', ',') }}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Outcome Card -->
                                            <div class="group relative transform transition-all duration-300 hover:-translate-y-1">
                                                <div class="absolute inset-0 bg-gradient-to-bl from-red-400/10 to-rose-400/10 rounded-xl blur-xl transition-all duration-300 group-hover:blur-2xl"></div>
                                                <div class="bg-gradient-to-bl from-red-50 to-rose-50 p-4 rounded-xl border border-red-100 relative backdrop-blur-xl transition-all duration-300 hover:shadow-lg">
                                                    <div class="flex items-center gap-2 text-sm text-red-600 mb-3">
                                                        <div class="p-2 bg-red-100 rounded-lg transition-all duration-300 group-hover:bg-red-200">
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                            </svg>
                                                        </div>
                                                        <span class="font-medium transition-all duration-300 group-hover:text-red-700">@lang('Outcome Details')</span>
                                                    </div>
                                                    <div class="space-y-2">
                                                        <div class="flex justify-between items-center">
                                                            <span class="text-sm text-gray-600">@lang('Quantity'):</span>
                                                            <span class="font-semibold">{{ number_format($item->outcome_quantity ?? 0, 0, '.', ',') }}</span>
                                                        </div>
                                                        <div class="flex justify-between items-center">
                                                            <span class="text-sm text-gray-600">@lang('Total'):</span>
                                                            <span class="font-semibold text-red-600">${{ number_format(($item->outcome_total) ?? 0, 2, '.', ',') }}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Net and Profit Card -->
                                        <div class="group relative transform transition-all duration-300 hover:-translate-y-1">
                                            <div class="absolute inset-0 bg-gradient-to-bl from-blue-400/10 to-indigo-400/10 rounded-xl blur-xl transition-all duration-300 group-hover:blur-2xl"></div>
                                            <div class="bg-gradient-to-bl from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 relative backdrop-blur-xl transition-all duration-300 hover:shadow-lg">
                                                <div class="flex items-center gap-2 text-sm text-blue-600 mb-3">
                                                    <div class="p-2 bg-blue-100 rounded-lg transition-all duration-300 group-hover:bg-blue-200">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                        </svg>
                                                    </div>
                                                    <span class="font-medium transition-all duration-300 group-hover:text-blue-700">@lang('Net & Profit Summary')</span>
                                                </div>
                                                <div class="grid grid-cols-2 gap-4">
                                                    <div class="space-y-2">
                                                        <div class="flex justify-between items-center">
                                                            <span class="text-sm text-gray-600">@lang('Net Quantity'):</span>
                                                            <span class="font-semibold">{{ number_format($item->net_quantity ?? 0, 0, '.', ',') }}</span>
                                                        </div>
                                                        <div class="flex justify-between items-center">
                                                            <span class="text-sm text-gray-600">@lang('Net Total'):</span>
                                                            <span class="font-semibold text-blue-600">${{ number_format($item->net_total ?? 0, 2, '.', ',') }}</span>
                                                        </div>
                                                    </div>
                                                    <div class="space-y-2">
                                                        <div class="flex justify-between items-center">
                                                            <span class="text-sm text-gray-600">@lang('Profit'):</span>
                                                            <span class="font-semibold {{ ($item->profit ?? 0) >= 0 ? 'text-green-600' : 'text-red-600' }}">
                                                                ${{ number_format($item->profit ?? 0, 2, '.', ',') }}
                                                            </span>
                                                        </div>
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
