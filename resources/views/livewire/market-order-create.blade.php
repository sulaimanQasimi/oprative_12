<div class="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
    <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-4">
            <div class="flex items-center gap-3">
                <div class="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
                <div>
                    <h2 class="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Create Market Order</h2>
                    <p class="text-sm text-gray-500">Manage your sales transactions</p>
                </div>
            </div>
            <button wire:click="createOrder" @class([
                'px-6 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 flex items-center gap-2',
                'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700' => !$currentOrderId || ($currentOrderId && $amountPaid >= $total),
                'bg-gray-300 text-gray-500 cursor-not-allowed' => $currentOrderId && (empty($orderItems) || $amountPaid < $total)
            ])>
                @if(!$currentOrderId)
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create New Order
                @else
                    @if(empty($orderItems))
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add Items to Order
                    @elseif($amountPaid >= $total)
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Complete Order
                    @else
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Enter Full Payment
                    @endif
                @endif
            </button>
        </div>
    </div>

    @if($currentOrderId)
        <!-- Product Search -->
        <div class="mb-6 relative">
            <div class="group relative">
                <div class="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-xl transition-all duration-300 group-hover:blur-2xl"></div>
                <div class="relative flex items-center bg-white/90 rounded-xl shadow-sm overflow-hidden border border-gray-200 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-all duration-200">
                    <div class="flex-shrink-0 pl-4 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input type="text"
                        wire:model.live="searchQuery"
                        wire:keydown.escape="closeDropdown"
                        wire:keydown.tab="closeDropdown"
                        wire:keydown.arrow-down="incrementHighlight"
                        wire:keydown.arrow-up="decrementHighlight"
                        wire:keydown.enter.prevent="selectProduct"
                        class="w-full py-4 px-4 outline-none text-gray-600 placeholder-gray-400 bg-transparent text-lg"
                        placeholder="Search products by name, SKU, or barcode..."
                        autofocus
                        x-data
                        x-init="$nextTick(() => $el.focus())">
                    <div class="flex-shrink-0 pr-4">
                        <div class="text-xs text-gray-400 font-medium">Press Enter to select</div>
                    </div>
                </div>
            </div>
            @if($searchQuery && $showDropdown)
                <div class="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-gray-200/50 max-h-96 overflow-y-auto transform transition-all duration-200 ease-out">
                    @forelse($searchResults as $index => $product)
                        <div class="group relative transform transition-all duration-200 hover:-translate-y-0.5">
                            <div class="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                            <div class="relative flex justify-between items-center w-full">
                                <button wire:click="selectProduct({{ $index }})" @class([
                                    'w-full px-4 py-3 flex items-start transition-all duration-200',
                                    'bg-green-50/50' => $highlightIndex === $index,
                                    'hover:bg-gray-50/50' => $highlightIndex !== $index
                                ])>
                                    <div class="flex-1">
                                        <div class="flex items-center gap-3">
                                            @if($product['image'])
                                                <div class="relative">
                                                    <img src="{{ $product['image'] }}" alt="{{ $product['name'] }}"
                                                        class="w-12 h-12 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
                                                    @if($product['stock'] <= 5)
                                                        <div class="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full shadow-sm">
                                                            Low Stock
                                                        </div>
                                                    @endif
                                                </div>
                                            @else
                                                <div class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            @endif
                                            <div>
                                                <h4 class="font-medium text-gray-800 group-hover:text-green-600 transition-colors duration-200">{{ $product['name'] }}</h4>
                                                <p class="text-sm text-gray-500">SKU: {{ $product['sku'] }}</p>
                                            </div>
                                        </div>
                                        <div class="mt-2 flex items-center gap-4 text-sm">
                                            <span class="text-green-600 font-medium">${{ number_format($product['price'], 2) }}</span>
                                            <span class="text-gray-500">Stock: {{ $product['stock'] }}</span>
                                        </div>
                                    </div>
                                    <div class="flex-shrink-0 self-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors duration-200" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </button>
                                <button wire:click="saveToOrder({{ $index }})"
                                    class="ml-4 mr-4 px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add
                                </button>
                            </div>
                        </div>
                    @empty
                        <div class="px-6 py-8 text-center">
                            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p class="text-gray-500 font-medium">No products found</p>
                            <p class="text-sm text-gray-400 mt-1">Try adjusting your search terms</p>
                        </div>
                    @endforelse
                </div>
            @endif
        </div>


        <!-- Order Items -->
        <div class="space-y-4 mb-6">
            @forelse($orderItems as $index => $item)
                <div class="group relative transform transition-all duration-200 hover:-translate-y-0.5">
                    <div class="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <div class="relative bg-white/90 p-5 rounded-xl shadow-sm border border-gray-100">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 class="font-medium text-gray-800 group-hover:text-green-600 transition-colors duration-200">{{ $item['name'] }}</h3>
                                        <p class="text-sm text-gray-500">${{ number_format($item['price'], 2) }} each</p>
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <div class="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100">
                                    <button wire:click="updateQuantity({{ $index }}, -1)"
                                        class="text-gray-500 hover:text-green-600 w-6 h-6 flex items-center justify-center rounded-md hover:bg-green-50 transition-colors duration-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                                        </svg>
                                    </button>
                                    <span class="text-sm font-medium w-8 text-center text-gray-700">{{ $item['quantity'] }}</span>
                                    <button wire:click="updateQuantity({{ $index }}, 1)"
                                        class="text-gray-500 hover:text-green-600 w-6 h-6 flex items-center justify-center rounded-md hover:bg-green-50 transition-colors duration-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                                <button wire:click="removeItem({{ $index }})"
                                    class="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="mt-3 flex justify-between items-center">
                            <div class="text-sm text-gray-500">Quantity: {{ $item['quantity'] }}</div>
                            <div class="text-right">
                                <div class="text-sm text-gray-500">Total</div>
                                <div class="text-lg font-semibold text-green-600">${{ number_format($item['total'], 2) }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            @empty
                <div class="text-center py-12">
                    <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">No items in the order</h3>
                    <p class="text-gray-500">Scan products to add them to the order</p>
                </div>
            @endforelse
        </div>

        <!-- Order Summary and Checkout -->
        @if(count($orderItems) > 0)
            <div class="border-t border-gray-200 pt-6 mb-6 space-y-6">
                <!-- Order Summary -->
                <div class="bg-white/80 backdrop-blur-lg rounded-xl p-5 shadow-sm border border-gray-100">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center text-gray-600">
                            <span>Subtotal</span>
                            <span>${{ number_format($subtotal, 2) }}</span>
                        </div>
                        <div class="flex justify-between items-center text-lg font-semibold text-gray-800 pt-3 border-t">
                            <span>Total Amount</span>
                            <span class="text-green-600">${{ number_format($total, 2) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Payment Section -->
                <div class="bg-white/80 backdrop-blur-lg rounded-xl p-5 shadow-sm border border-gray-100">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-3">
                            <label class="block text-sm font-medium text-gray-700">Payment Method</label>
                            <select wire:model.live="paymentMethod"
                                class="w-full bg-white border-gray-200 rounded-lg shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200">
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                                <option value="bank_transfer">Bank Transfer</option>
                            </select>
                        </div>
                        <div class="space-y-3">
                            <label class="block text-sm font-medium text-gray-700">Amount Paid</label>
                            <div class="relative">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input type="number" wire:model.live="amountPaid" step="0.01" min="0"
                                    class="w-full pl-7 bg-white border-gray-200 rounded-lg shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200"
                                    placeholder="0.00">
                            </div>
                        </div>
                    </div>

                    @if($changeDue > 0)
                        <div class="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                            <div class="flex justify-between items-center">
                                <span class="text-green-700 font-medium">Change Due</span>
                                <span class="text-lg font-semibold text-green-600">${{ number_format($changeDue, 2) }}</span>
                            </div>
                        </div>
                    @endif

                    <div class="mt-4 space-y-3">
                        <label class="block text-sm font-medium text-gray-700">Order Notes</label>
                        <textarea wire:model="notes" rows="2"
                            class="w-full bg-white border-gray-200 rounded-lg shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200"
                            placeholder="Add any notes about the order..."></textarea>
                    </div>
                </div>

                <button wire:click="createOrder" @class([
                    'w-full py-3.5 rounded-xl font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2',
                    'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700' => $currentOrderId && $amountPaid >= $total,
                    'bg-gray-300 text-gray-500 cursor-not-allowed' => !$currentOrderId || ($currentOrderId && $amountPaid < $total)
                ])>
                    @if($currentOrderId && $amountPaid >= $total)
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Complete Order
                    @elseif($currentOrderId && $amountPaid < $total)
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Enter Full Payment
                    @else
                        Create Order First
                    @endif
                </button>
            </div>
        @endif

    @endif
</div>

@script
<script>
    $wire.on('orderCreated', () => {
        // You can add any additional UI feedback here
    });
</script>
@endscript