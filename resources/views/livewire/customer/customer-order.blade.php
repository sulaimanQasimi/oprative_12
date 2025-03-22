<div>
    <div dir="rtl" x-data="{ activeTab: 'all' }">
        <x-customer-navbar />
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header Section with Animated Background -->
            <div class="bg-gradient-to-r from-purple-600/90 to-indigo-600/90 backdrop-blur-xl rounded-2xl shadow-lg p-8 mb-8 relative overflow-hidden">
                <div class="absolute inset-0 bg-grid-white/10 animate-pulse"></div>
                <div class="relative z-10">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 class="text-3xl font-bold text-white mb-2">سفارشات مشتری</h2>
                            <p class="text-indigo-100">@lang('Manage and track all your orders in one place')</p>
                        </div>
                        <div class="flex gap-3">
                            <div class="bg-white/10 backdrop-blur-md rounded-xl p-4">
                                <span class="block text-2xl font-bold text-white mb-1">{{ $orders->count() }}</span>
                                <span class="text-indigo-100 text-sm">@lang('Total Orders')</span>
                            </div>
                            <div class="bg-white/10 backdrop-blur-md rounded-xl p-4">
                                <span class="block text-2xl font-bold text-white mb-1">${{ number_format($orders->sum('total_amount'), 2) }}</span>
                                <span class="text-indigo-100 text-sm">@lang('Total Spent')</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Filter Tabs -->
            <div class="mb-6 bg-white/80 backdrop-blur-xl rounded-xl p-2 shadow-sm border border-gray-100">
                <div class="flex gap-2">
                    <button @click="activeTab = 'all'"
                            :class="{ 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white': activeTab === 'all', 'hover:bg-gray-50': activeTab !== 'all' }"
                            class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                        @lang('All Orders')
                    </button>
                    <button @click="activeTab = 'pending'"
                            :class="{ 'bg-gradient-to-r from-amber-500 to-orange-500 text-white': activeTab === 'pending', 'hover:bg-gray-50': activeTab !== 'pending' }"
                            class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                        @lang('Pending')
                    </button>
                    <button @click="activeTab = 'completed'"
                            :class="{ 'bg-gradient-to-r from-emerald-500 to-green-500 text-white': activeTab === 'completed', 'hover:bg-gray-50': activeTab !== 'completed' }"
                            class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                        @lang('Completed')
                    </button>
                </div>
            </div>

            <!-- Orders Grid -->
            <div class="grid gap-6 md:grid-cols-2">
                @forelse($orders as $order)
                    <div x-show="activeTab === 'all' || activeTab === '{{ strtolower($order->status) }}'"
                         x-transition:enter="transition ease-out duration-300"
                         x-transition:enter-start="opacity-0 transform scale-95"
                         x-transition:enter-end="opacity-100 transform scale-100"
                         class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
                         x-data="{ expanded: false }">
                        <!-- Order Header -->
                        <div class="p-6" @click="expanded = !expanded">
                            <div class="flex justify-between items-start">
                                <div class="flex items-start space-x-4 rtl:space-x-reverse">
                                    <div class="p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 class="text-lg font-semibold text-gray-800">@lang('Order') #{{ $order->id }}</h3>
                                        <p class="text-sm text-gray-500 mt-1">{{ $order->created_at->format('Y-m-d H:i') }}</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-3">
                                    <span class="px-3 py-1 text-sm font-medium rounded-full
                                        @if($order->status === 'pending') bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-700
                                        @elseif($order->status === 'processing') bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700
                                        @elseif($order->status === 'completed') bg-gradient-to-r from-emerald-500/10 to-green-500/10 text-emerald-700
                                        @else bg-gray-100 text-gray-700 @endif">
                                        {{ ucfirst($order->status) }}
                                    </span>
                                    <button class="transform transition-transform duration-200" :class="{ 'rotate-180': expanded }">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <!-- Order Summary -->
                            <div class="mt-4 grid grid-cols-2 gap-4">
                                <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4">
                                    <span class="text-sm text-gray-600">@lang('Total Amount')</span>
                                    <p class="text-lg font-semibold text-indigo-600">${{ number_format($order->total_amount, 2) }}</p>
                                </div>
                                <div class="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4">
                                    <span class="text-sm text-gray-600">@lang('Items')</span>
                                    <p class="text-lg font-semibold text-emerald-600">{{ $order->items_count }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Expandable Content -->
                        <div x-show="expanded"
                             x-collapse
                             x-cloak
                             class="border-t border-gray-100">
                            <div class="p-6 space-y-6">
                                <!-- Order Items List -->
                                <div class="space-y-4">
                                    <h4 class="font-medium text-gray-700 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        @lang('Order Items')
                                    </h4>
                                    <div class="grid grid-cols-1 gap-3">
                                        @foreach($order->items as $item)
                                            <div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-200">
                                                <div class="flex items-center gap-4">
                                                    <div class="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                                        <span class="text-lg font-semibold text-indigo-600">{{ $item->quantity }}x</span>
                                                    </div>
                                                    <div>
                                                        <h5 class="font-medium text-gray-900">{{ $item->product->name }}</h5>
                                                        <div class="flex items-center gap-3 mt-1">
                                                            <span class="text-sm text-gray-500">@lang('Unit Price'): <span class="text-indigo-600 font-medium">${{ number_format($item->price, 2) }}</span></span>
                                                            <span class="text-sm text-gray-500">•</span>
                                                            <span class="text-sm text-gray-500">@lang('Total'): <span class="text-indigo-600 font-medium">${{ number_format($item->quantity * $item->price, 2) }}</span></span>
                                                        </div>
                                                    </div>
                                                </div>
                                                @if($item->product->stock)
                                                    <span class="px-3 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700">
                                                        @lang('In Stock'): {{ $item->product->stock }}
                                                    </span>
                                                @endif
                                            </div>
                                        @endforeach
                                    </div>
                                </div>

                                <!-- Order Details -->
                                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4">
                                    <div>
                                        <span class="text-sm text-gray-500">@lang('Payment Status')</span>
                                        <p class="font-medium {{ $order->is_paid ? 'text-emerald-600' : 'text-red-600' }}">
                                            {{ $order->is_paid ? __('Paid') : __('Unpaid') }}
                                        </p>
                                    </div>
                                    <div>
                                        <span class="text-sm text-gray-500">@lang('Delivery Status')</span>
                                        <p class="font-medium text-blue-600">{{ ucfirst($order->delivery_status) }}</p>
                                    </div>
                                    <div>
                                        <span class="text-sm text-gray-500">@lang('Order Date')</span>
                                        <p class="font-medium text-gray-800">{{ $order->created_at->format('M d, Y') }}</p>
                                    </div>
                                    <div>
                                        <span class="text-sm text-gray-500">@lang('Order Time')</span>
                                        <p class="font-medium text-gray-800">{{ $order->created_at->format('H:i A') }}</p>
                                    </div>
                                </div>

                                <!-- Order Summary -->
                                <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4">
                                    <div class="space-y-2">
                                        <div class="flex justify-between items-center">
                                            <span class="text-gray-600">@lang('Subtotal')</span>
                                            <span class="font-medium text-gray-800">${{ number_format($order->total_amount - ($order->tax ?? 0), 2) }}</span>
                                        </div>
                                        @if($order->tax)
                                            <div class="flex justify-between items-center">
                                                <span class="text-gray-600">@lang('Tax')</span>
                                                <span class="font-medium text-gray-800">${{ number_format($order->tax, 2) }}</span>
                                            </div>
                                        @endif
                                        <div class="flex justify-between items-center pt-2 border-t border-gray-200">
                                            <span class="font-medium text-gray-900">@lang('Total')</span>
                                            <span class="text-lg font-bold text-indigo-600">${{ number_format($order->total_amount, 2) }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div class="flex justify-end gap-3">
                                    <button wire:click="viewOrderDetails({{ $order->id }})"
                                            class="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2">
                                        @lang('View Full Details')
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                    @if(!$order->is_paid)
                                        <button class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2">
                                            @lang('Pay Now')
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                        </button>
                                    @endif
                                </div>
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="md:col-span-2">
                        <div class="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div class="w-24 h-24 mx-auto mb-6">
                                <div class="relative">
                                    <div class="absolute inset-0 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full animate-pulse"></div>
                                    <div class="relative bg-white rounded-full p-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <h3 class="text-xl font-semibold text-gray-900 mb-2">@lang('No Orders Found')</h3>
                            <p class="text-gray-500 mb-6">@lang('You have not placed any orders yet.')</p>
                            <a href="#" class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium rounded-xl transition-all duration-200">
                                @lang('Start Shopping')
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </a>
                        </div>
                    </div>
                @endforelse
            </div>
        </div>

        <!-- Order Details Modal -->
        <div x-show="$wire.showOrderDetails"
             x-transition:enter="transition ease-out duration-300"
             x-transition:enter-start="opacity-0"
             x-transition:enter-end="opacity-100"
             x-transition:leave="transition ease-in duration-200"
             x-transition:leave-start="opacity-100"
             x-transition:leave-end="opacity-0"
             class="fixed inset-0 z-50 overflow-y-auto"
             style="display: none;">
            <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div class="absolute inset-0 bg-gray-900/75 backdrop-blur-sm"></div>
                </div>

                <div x-show="$wire.showOrderDetails"
                     x-transition:enter="transition ease-out duration-300"
                     x-transition:enter-start="opacity-0 transform translate-y-4 sm:translate-y-0 sm:scale-95"
                     x-transition:enter-end="opacity-100 transform translate-y-0 sm:scale-100"
                     x-transition:leave="transition ease-in duration-200"
                     x-transition:leave-start="opacity-100 transform translate-y-0 sm:scale-100"
                     x-transition:leave-end="opacity-0 transform translate-y-4 sm:translate-y-0 sm:scale-95"
                     class="inline-block w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-8 text-right align-middle shadow-xl transition-all">
                    @if($selectedOrder)
                        <div class="absolute top-4 right-4">
                            <button wire:click="closeOrderDetails" class="text-gray-400 hover:text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div class="mb-6">
                            <h3 class="text-2xl font-bold text-gray-900 mb-2">@lang('Order Details') #{{ $selectedOrder->id }}</h3>
                            <p class="text-gray-500">{{ $selectedOrder->created_at->format('F j, Y g:i A') }}</p>
                        </div>

                        <!-- Order Items -->
                        <div class="space-y-4">
                            @foreach($selectedOrder->items as $item)
                                <div class="bg-gray-50 rounded-xl p-4">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <h4 class="font-medium text-gray-900">{{ $item->product->name }}</h4>
                                            <p class="text-sm text-gray-500">{{ $item->quantity }} x ${{ number_format($item->price, 2) }}</p>
                                        </div>
                                        <span class="text-lg font-semibold text-indigo-600">${{ number_format($item->quantity * $item->price, 2) }}</span>
                                    </div>
                                </div>
                            @endforeach
                        </div>

                        <!-- Order Summary -->
                        <div class="mt-6 border-t border-gray-100 pt-6">
                            <div class="space-y-2">
                                <div class="flex justify-between">
                                    <span class="text-gray-500">@lang('Subtotal')</span>
                                    <span class="font-medium">${{ number_format($selectedOrder->total_amount, 2) }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-500">@lang('Tax')</span>
                                    <span class="font-medium">${{ number_format($selectedOrder->tax ?? 0, 2) }}</span>
                                </div>
                                <div class="flex justify-between text-lg font-semibold">
                                    <span class="text-gray-900">@lang('Total')</span>
                                    <span class="text-indigo-600">${{ number_format($selectedOrder->total_amount + ($selectedOrder->tax ?? 0), 2) }}</span>
                                </div>
                            </div>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
