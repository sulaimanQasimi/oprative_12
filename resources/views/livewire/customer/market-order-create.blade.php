<div class="container" dir="rtl">
<!-- Single root element wrapper -->
<x-customer-navbar />
<div class="relative">
    <!-- Three.js background container -->
    <div id="three-background" class="fixed inset-0 -z-10"></div>

    <div class="relative min-h-screen p-6">
        <!-- Main container with enhanced styling -->
        <div class="relative bg-white/80 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl border border-white/20 transition-all duration-300 hover:shadow-green-500/10">
            <!-- Decorative elements -->
            <div
                class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-2xl translate-x-16 -translate-y-16">
            </div>
            <div
                class="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-2xl -translate-x-16 translate-y-16">
            </div>

            <!-- Content -->
            <div class="relative">
                <div class="flex justify-between items-center mb-6">
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg shadow-lg animate-button">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <div>
                                <h2 class="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    @lang('Create Market Order')</h2>
                                <p class="text-sm text-gray-500">@lang('Manage your sales transactions')</p>
                            </div>
                        </div>
                        <button wire:click="createOrder" @class([
                            'animate-button px-6 py-2.5 rounded-xl font-medium shadow-lg transition-all duration-300 flex items-center gap-2',
                            'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700' => !$currentOrderId || ($currentOrderId && $amountPaid >= $total),
                            'bg-gray-300 text-gray-500 cursor-not-allowed' => $currentOrderId && (empty($orderItems) || $amountPaid < $total)
                        ])>
                            @if(!$currentOrderId)
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                @lang('Start New Order')
                            @else
                                @if(empty($orderItems))
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    @lang('Add Items to Order')
                                @elseif($amountPaid >= $total)
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    @lang('Complete Order')
                                @else
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    @lang('Enter Full Payment')
                                @endif
                            @endif
                        </button>
                    </div>
                </div>

                @if($currentOrderId)
                        <!-- Product Search with enhanced animation -->
                        <div class="mb-6 relative search-container">
                            <div class="group relative transform transition-all duration-300 hover:scale-[1.01]">
                                <div
                                    class="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-xl transition-all duration-300 group-hover:blur-2xl">
                                </div>
                                <div
                                    class="relative flex items-center bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-200/50 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20 transition-all duration-300">
                                    <div
                                        class="flex-shrink-0 pr-4 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input type="text" wire:model.live="searchQuery" wire:keydown.escape="closeDropdown"
                                        wire:keydown.tab="closeDropdown" wire:keydown.arrow-down="incrementHighlight"
                                        wire:keydown.arrow-up="decrementHighlight" wire:keydown.enter.prevent="selectProduct"
                                        class="w-full py-4 px-4 outline-none text-gray-700 placeholder-gray-400 bg-transparent text-lg font-medium"
                                        placeholder="@lang('Search products by name,or barcode...')" autofocus x-data
                                        x-init="$nextTick(() => $el.focus())">
                                    <div class="flex-shrink-0 pl-4">
                                        <div class="text-xs text-gray-400 font-medium flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            @lang('Press Enter to select')
                                        </div>
                                    </div>
                                </div>
                            </div>
                            @if($searchQuery && $showDropdown)
                                    <div
                                        class="absolute z-50 w-full mt-2 bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 max-h-96 overflow-y-auto">
                                        @forelse($searchResults as $index => $product)
                                                    <div class="search-result group relative transform transition-all duration-300">
                                                        <div
                                                            class="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        </div>
                                                        <div class="relative flex justify-between items-center w-full">
                                                            <button wire:click="selectProduct({{ $index }})" @class([
                                                                'w-full px-4 py-3 flex items-start transition-all duration-300',
                                                                'bg-green-50/80' => $highlightIndex === $index,
                                                                'hover:bg-gray-50/50' => $highlightIndex !== $index
                                                            ])>
                                                                <div class="flex-1">
                                                                    <div class="flex items-center gap-3">
                                                                        <div
                                                                            class="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center group-hover:from-green-50 group-hover:to-emerald-50 transition-all duration-300">
                                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                                class="h-6 w-6 text-gray-400 group-hover:text-green-500 transition-colors duration-300"
                                                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                            </svg>
                                                                        </div>
                                                                    </div>
                                                                    <div class="mt-2 flex items-center gap-4 text-sm">
                                                                        <span
                                                                            class="text-green-600 font-medium">${{ number_format($product['retail_price'], 2) }}</span>
                                                                        <span class="text-gray-500">@lang('Stock'): {{ $product['stock'] }}</span>
                                                                    </div>
                                                                </div>
                                                                <div class="flex-shrink-0 self-center">
                                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                                        class="h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors duration-300"
                                                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                                            d="M9 5l7 7-7 7" />
                                                                    </svg>
                                                                </div>
                                                                <button wire:click="saveToOrder"
                                                                    class="ml-4 mr-4 px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500
                                                                    text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all
                                                                    duration-300 shadow-sm hover:shadow-md flex items-center gap-2 group">
                                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                                        class="h-4 w-4 transform group-hover:scale-110 transition-transform duration-300"
                                                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                                    </svg>
                                                                    @lang('Add Item')
                                                                </button>
                                                        </div>
                                                        </button>
                                                    </div>
                                        @empty
                                            <div class="px-6 py-8 text-center">
                                                <div
                                                    class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none"
                                                        viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <p class="text-gray-500 font-medium">@lang('No products found')</p>
                                                <p class="text-sm text-gray-400 mt-1">@lang('Try adjusting your search terms')</p>
                                            </div>
                                        @endforelse
                                    </div>
                            @endif
                        </div>

                        <!-- Order Items with enhanced animation -->
                        <div class="space-y-4 mb-6">
                            @forelse($orderItems as $index => $item)
                                <div class="order-item group relative transform transition-all duration-300 hover:scale-[1.02]">
                                    <div
                                        class="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    </div>
                                    <div class="relative bg-white/90 p-5 rounded-xl shadow-sm border border-gray-100">
                                        <div class="flex justify-between items-start">
                                            <div class="flex-1">
                                                <div class="flex items-center gap-3">
                                                    <div
                                                        class="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600"
                                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h3
                                                            class="font-medium text-gray-800 group-hover:text-green-600 transition-colors duration-200">
                                                            {{ $item['name'] }}</h3>
                                                        <p class="text-sm text-gray-500">${{ number_format($item['price'], 2) }} @lang('each')
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex items-center gap-4">
                                                <div
                                                    class="flex items-center gap-2 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 rounded-xl px-3 py-1.5 border border-green-100/50 shadow-sm group hover:shadow-md transition-all duration-300">
                                                    <button wire:click="updateQuantity({{ $index }}, -1)"
                                                        class="text-gray-500 hover:text-green-600 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gradient-to-br from-green-100 to-emerald-100 transition-all duration-300 hover:shadow-sm group-hover:shadow-md transform hover:-translate-y-0.5">
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                            class="h-4 w-4 transform group-hover:-translate-y-0.5 transition-transform duration-300"
                                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                                d="M20 12H4" />
                                                        </svg>
                                                    </button>
                                                    <span
                                                        class="text-base font-semibold w-8 text-center text-gray-700 bg-gradient-to-br from-white to-green-50/50 px-2 py-1 rounded-lg shadow-sm border border-green-100/50">{{ $item['quantity'] }}</span>
                                                    <button wire:click="updateQuantity({{ $index }}, 1)"
                                                        class="text-gray-500 hover:text-green-600 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gradient-to-br from-green-100 to-emerald-100 transition-all duration-300 hover:shadow-sm group-hover:shadow-md transform hover:-translate-y-0.5">
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                            class="h-4 w-4 transform group-hover:translate-y-0.5 transition-transform duration-300"
                                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                                d="M12 4v16m8-8H4" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <button wire:click="removeItem({{ $index }})"
                                                    class="text-gray-400 hover:text-red-500 p-2.5 rounded-xl hover:bg-gradient-to-br from-red-50 to-pink-50/50 transition-all duration-300 hover:shadow-sm group-hover:shadow-md transform hover:-translate-y-0.5 border border-red-100/50">
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        class="h-5 w-5 transform group-hover:rotate-12 transition-transform duration-300"
                                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="mt-3 flex justify-between items-center">
                                            <div class="text-sm text-gray-500">@lang('Quantity'): {{ $item['quantity'] }}</div>
                                            <div class="text-right">
                                                <div class="text-sm text-gray-500">@lang('Total')</div>
                                                <div class="text-lg font-semibold text-green-600">
                                                    ${{ number_format($item['total'], 2) }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            @empty
                                <div class="text-center py-12">
                                    <div
                                        class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-500" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h3 class="text-lg font-medium text-gray-900 mb-2">@lang('No items in the order')</h3>
                                    <p class="text-gray-500">@lang('Scan products to add them to the order')</p>
                                </div>
                            @endforelse
                        </div>

                        <!-- Order Summary and Checkout with enhanced styling -->
                        @if(count($orderItems) > 0)
                                <div class="border-t border-gray-200/50 pt-6 mb-6 space-y-6">
                                    <!-- Order Summary -->
                                    <div class="bg-white/80 backdrop-blur-lg rounded-xl p-5 shadow-sm border border-gray-100">
                                        <h3 class="text-lg font-semibold text-gray-800 mb-4">@lang('Order Summary')</h3>
                                        <div class="space-y-3">
                                            <div class="flex justify-between items-center text-gray-600">
                                                <span>@lang('Subtotal')</span>
                                                <span>${{ number_format($subtotal, 2) }}</span>
                                            </div>
                                            <div
                                                class="flex justify-between items-center text-lg font-semibold text-gray-800 pt-3 border-t">
                                                <span>@lang('Total Amount')</span>
                                                <span class="text-green-600">${{ number_format($total, 2) }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Payment Section -->
                                    <div class="bg-white/80 backdrop-blur-lg rounded-xl p-5 shadow-sm border border-gray-100">
                                        <h3 class="text-lg font-semibold text-gray-800 mb-4">@lang('Payment Details')</h3>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div class="space-y-3">
                                                <label class="block text-sm font-medium text-gray-700">@lang('Payment Method')</label>
                                                <select wire:model.live="paymentMethod"
                                                    class="w-full bg-white border-gray-200 rounded-lg shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200">
                                                    <option value="cash">@lang('Cash')</option>
                                                    <option value="card">@lang('Card')</option>
                                                    <option value="bank_transfer">@lang('Transfer')</option>
                                                </select>
                                            </div>
                                            <div class="space-y-3">
                                                <label class="block text-sm font-medium text-gray-700">@lang('Amount Paid')</label>
                                                <div class="relative">
                                                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                                    <input type="number" wire:model.live="amountPaid" step="0.01" min="0"
                                                        class="w-full pr-7 bg-white border-gray-200 rounded-lg shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200"
                                                        placeholder="0.00">
                                                </div>
                                            </div>
                                        </div>

                                        @if($amountPaid < $total)
                                            <div class="mt-4 space-y-3">
                                                <label class="block text-sm font-medium text-gray-700">@lang('Select Account for Remaining Balance')</label>
                                                <div class="relative">
                                                    <input type="text" wire:model.live="accountSearchQuery"
                                                        wire:keydown.escape="showAccountDropdown = false"
                                                        wire:keydown.tab="showAccountDropdown = false"
                                                        wire:keydown.arrow-down="incrementAccountHighlight"
                                                        wire:keydown.arrow-up="decrementAccountHighlight"
                                                        wire:keydown.enter.prevent="selectAccount(accountHighlightIndex)"
                                                        class="w-full bg-white border-gray-200 rounded-lg shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200"
                                                        placeholder="@lang('Search by name, account number, or ID number...')">

                                                    @if($showAccountDropdown && count($accountSearchResults) > 0)
                                                        <div class="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                                                            @foreach($accountSearchResults as $index => $account)
                                                                <button wire:click="selectAccount({{ $index }})"
                                                                    @class([
                                                                        'w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200',
                                                                        'bg-green-50' => $accountHighlightIndex === $index
                                                                    ])>
                                                                    <div class="flex justify-between items-center">
                                                                        <div>
                                                                            <div class="font-medium text-gray-900">{{ $account['name'] }}</div>
                                                                            <div class="text-sm text-gray-500">
                                                                                @lang('Account')<span dir="ltr"> #{{ $account['account_number'] }}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="text-right">
                                                                            <div class="font-medium text-gray-900">${{ number_format($account['balance'], 2) }}</div>
                                                                            <div class="text-sm text-gray-500">
                                                                                @lang('Balance')
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            @endforeach
                                                        </div>
                                                    @endif
                                                </div>

                                                @if($selectedAccount)
                                                    <div class="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                                                        <div class="flex justify-between items-center">
                                                            <div>
                                                                <div class="font-medium text-green-800">{{ $selectedAccount['name'] }}</div>
                                                                <div class="text-sm text-green-600">
                                                                    @lang('Account') #{{ $selectedAccount['account_number'] }}
                                                                </div>
                                                            </div>
                                                            <div class="text-right">
                                                                <div class="font-medium text-green-800">${{ number_format($selectedAccount['balance'], 2) }}</div>
                                                                <div class="text-sm text-green-600">
                                                                    @lang('Current Balance')
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                @endif
                                            </div>
                                        @endif

                                        @if($changeDue > 0)
                                            <div
                                                class="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                                                <div class="flex justify-between items-center">
                                                    <span class="text-green-700 font-medium">@lang('Change Due')</span>
                                                    <span
                                                        class="text-lg font-semibold text-green-600">${{ number_format($changeDue, 2) }}</span>
                                                </div>
                                            </div>
                                        @endif

                                        <div class="mt-4 space-y-3">
                                            <label class="block text-sm font-medium text-gray-700">@lang('Order Notes')</label>
                                            <textarea wire:model="notes" rows="2"
                                                class="w-full bg-white border-gray-200 rounded-lg shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200"
                                                placeholder="@lang('Add any notes about the order...')"></textarea>
                                        </div>
                                    </div>

                                    <button wire:click="createOrder" @class([
                                        'px-6 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 flex items-center gap-2',
                                        'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700' => !$currentOrderId || ($currentOrderId && $amountPaid >= $total),
                                        'bg-gray-300 text-gray-500 cursor-not-allowed' => $currentOrderId && (empty($orderItems) || $amountPaid < $total)
                                    ])>
                                        @if($currentOrderId && $amountPaid >= $total)
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            @lang('Complete Order')
                                        @elseif($currentOrderId && $amountPaid < $total)
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            @lang('Enter Full Payment')
                                        @else
                                            @lang('Create Order First')
                                        @endif
                                    </button>
                                </div>
                        @endif

                @endif
            </div>
        </div>

        <!-- Success notification -->
        <div class="order-success fixed top-4 right-4 bg-green-500 text-white p-4 rounded-xl shadow-2xl transform scale-0 opacity-0">
            <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Order created successfully!</span>
            </div>
        </div>
    </div>

    @script
    <script>
        $wire.on('orderCreated', () => {
            // Dispatch custom event for animation
            window.dispatchEvent(new CustomEvent('orderCreated'));
        });
    </script>
    @endscript
</div>
</div>