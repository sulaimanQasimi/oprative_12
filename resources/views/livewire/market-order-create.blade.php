<div class="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
    <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-4">
            <h2 class="text-xl font-semibold text-gray-700">Create Market Order</h2>
            <button wire:click="createOrder" @class([
                'px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1',
                'bg-gradient-to-r from-green-500 to-emerald-600 text-white' => !$currentOrderId || ($currentOrderId && $amountPaid >= $total),
                'bg-gray-300 text-gray-500 cursor-not-allowed' => $currentOrderId && (empty($orderItems) || $amountPaid < $total)
            ])>
                @if(!$currentOrderId)
                    Create New Order
                @else
                    {{ empty($orderItems) ? 'Add Items to Order' : ($amountPaid >= $total ? 'Complete Order' : 'Enter Full Payment') }}
                @endif
            </button>

        </div>
    </div>

    <!-- Product Search -->
    <div class="mb-6 relative">
        <div class="flex items-center bg-white/90 rounded-xl shadow-sm overflow-hidden border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
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
                class="w-full py-3 px-4 outline-none text-gray-600 placeholder-gray-400 bg-transparent"
                placeholder="Search products...">
        </div>
@dump($searchResults)
        @if($searchQuery && $showDropdown)
            <div class="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                @forelse($searchResults as $index => $product)
                    <div class="flex justify-between items-center w-full">
                        <button wire:click="selectProduct({{ $index }})"
                        @class([
                            'w-full px-4 py-3 flex items-start hover:bg-gray-50 transition-colors duration-150',
                            'bg-gray-50' => $highlightIndex === $index
                        ])>
                        <div class="flex-1">
                            <div class="flex items-center gap-3">
                                @if($product['image'])
                                    <img src="{{ $product['image'] }}" alt="{{ $product['name'] }}" class="w-12 h-12 object-cover rounded-lg">
                                @endif
                                <div>
                                    <h4 class="font-medium text-gray-800">{{ $product['name'] }}</h4>
                                    <p class="text-sm text-gray-500">SKU: {{ $product['sku'] }}</p>
                                </div>
                            </div>
                            <div class="mt-1 flex items-center gap-4 text-sm">
                                <span class="text-green-600 font-medium">${{ number_format($product['price'], 2) }}</span>
                                <span class="text-gray-500">Stock: {{ $product['stock'] }}</span>
                            </div>
                        </div>
                        <div class="flex-shrink-0 self-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>
                    @if($currentOrderId)
                        <button wire:click="saveToOrder({{ $index }})" class="ml-4 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200">
                            Save to Order
                        </button>
                    @endif
                    </div>
                @empty
                    <div class="px-4 py-3 text-sm text-gray-500 text-center">
                        No products found
                    </div>
                @endforelse
            </div>
        @endif
    </div>

    <!-- Order Items -->
    <div class="space-y-4 mb-6">
        @forelse($orderItems as $index => $item)
            <div class="bg-white/90 p-4 rounded-xl shadow-sm">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h3 class="font-medium text-gray-800">{{ $item['name'] }}</h3>
                        <p class="text-sm text-gray-600">${{ number_format($item['price'], 2) }}</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                            <button wire:click="updateQuantity({{ $index }}, -1)" class="text-gray-500 hover:text-gray-700 w-6 h-6 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                                </svg>
                            </button>
                            <span class="text-sm font-medium w-8 text-center">{{ $item['quantity'] }}</span>
                            <button wire:click="updateQuantity({{ $index }}, 1)" class="text-gray-500 hover:text-gray-700 w-6 h-6 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                        <button wire:click="removeItem({{ $index }})" class="text-red-500 hover:text-red-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="mt-2 text-right text-sm font-medium text-gray-700">
                    Total: ${{ number_format($item['total'], 2) }}
                </div>
            </div>
        @empty
            <div class="text-center py-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p>No items in the order</p>
                <p class="text-sm">Scan products to add them to the order</p>
            </div>
        @endforelse
    </div>

    <!-- Order Summary and Checkout -->
    @if(count($orderItems) > 0)
        <div class="border-t border-gray-200 pt-4 mb-6 space-y-4">
            <!-- Order Summary -->
            <div class="space-y-2">
                <div class="flex justify-between items-center text-gray-600">
                    <span>Subtotal:</span>
                    <span>${{ number_format($subtotal, 2) }}</span>
                </div>
                <div class="flex justify-between items-center text-gray-600">
                    <span>Tax (10%):</span>
                    <span>${{ number_format($taxAmount, 2) }}</span>
                </div>
                <div class="flex justify-between items-center text-gray-600">
                    <span>Discount:</span>
                    <span>-${{ number_format($discountAmount, 2) }}</span>
                </div>
                <div class="flex justify-between items-center text-lg font-semibold text-gray-800 pt-2 border-t">
                    <span>Total Amount:</span>
                    <span>${{ number_format($total, 2) }}</span>
                </div>
            </div>

            <!-- Payment Section -->
            <div class="bg-gray-50 p-4 rounded-xl space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">Payment Method</label>
                        <select wire:model.live="paymentMethod" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                            <option value="cash">Cash</option>
                            <option value="card">Card</option>
                            <option value="bank_transfer">Bank Transfer</option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">Amount Paid</label>
                        <input type="number" wire:model.live="amountPaid" step="0.01" min="0" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="0.00">
                    </div>
                </div>

                @if($changeDue > 0)
                    <div class="bg-green-50 p-3 rounded-lg">
                        <div class="flex justify-between items-center text-green-700 font-medium">
                            <span>Change Due:</span>
                            <span>${{ number_format($changeDue, 2) }}</span>
                        </div>
                    </div>
                @endif

                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea wire:model="notes" rows="2" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Add any notes about the order..."></textarea>
                </div>
            </div>

            <button wire:click="createOrder" @class([
                'w-full py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1',
                'bg-gradient-to-r from-blue-500 to-purple-600 text-white' => $currentOrderId && $amountPaid >= $total,
                'bg-gray-300 text-gray-500 cursor-not-allowed' => !$currentOrderId || ($currentOrderId && $amountPaid < $total)
            ])>
                {{ $currentOrderId ? ($amountPaid >= $total ? 'Complete Order' : 'Enter Full Payment') : 'Create Order First' }}
            </button>
        </div>
    @endif


</div>

@script
<script>
    $wire.on('orderCreated', () => {
        // You can add any additional UI feedback here
    });
</script>
@endscript