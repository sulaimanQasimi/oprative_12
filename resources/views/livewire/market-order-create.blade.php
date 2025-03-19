<div class="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
    <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-4">
            <h2 class="text-xl font-semibold text-gray-700">Create Market Order</h2>
            <button wire:click="createOrder" @class([
                'px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1',
                'bg-gradient-to-r from-green-500 to-emerald-600 text-white' => $amountPaid >= $total,
                'bg-gray-300 text-gray-500 cursor-not-allowed' => empty($orderItems) || $amountPaid < $total
            ])>
                {{ empty($orderItems) ? 'Add Items to Order' : ($amountPaid >= $total ? 'Create Order' : 'Enter Full Payment') }}
            </button>
        </div>
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
                'bg-gradient-to-r from-blue-500 to-purple-600 text-white' => $amountPaid >= $total,
                'bg-gray-300 text-gray-500 cursor-not-allowed' => $amountPaid < $total
            ])>
                {{ $amountPaid >= $total ? 'Complete Order' : 'Enter Full Payment' }}
            </button>
        </div>
    @endif

    <!-- Barcode Scanner Modal -->
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" x-show="$wire.showScannerModal" x-cloak>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg">
            <div class="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-2xl mx-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold">Scan Product</h3>
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
                            <span>Product added successfully!</span>
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

    $wire.on('orderCreated', () => {
        // You can add any additional UI feedback here
    });
</script>
@endscript