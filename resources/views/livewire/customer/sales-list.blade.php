<div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header Section -->
        <div class="md:flex md:items-center md:justify-between mb-6">
            <div class="flex-1 min-w-0">
                <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                    Sales History
                </h2>
            </div>
        </div>

        <!-- Filters Section -->
        <div class="bg-white shadow rounded-lg p-6 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                        <input type="text" wire:model.live.debounce.300ms="search" id="search"
                            class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            placeholder="Search by reference...">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div>
                    <label for="dateFrom" class="block text-sm font-medium text-gray-700">From Date</label>
                    <input type="date" wire:model.live="dateFrom" id="dateFrom"
                        class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                </div>

                <div>
                    <label for="dateTo" class="block text-sm font-medium text-gray-700">To Date</label>
                    <input type="date" wire:model.live="dateTo" id="dateTo"
                        class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                </div>

                <div>
                    <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                    <select wire:model.live="status" id="status"
                        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Sales Table -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                wire:click="sortBy('reference')">
                                <div class="flex items-center">
                                    Reference
                                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9M3 12h5M3 16h7M3 20h11" />
                                    </svg>
                                </div>
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                wire:click="sortBy('date')">
                                <div class="flex items-center">
                                    Date
                                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9M3 12h5M3 16h7M3 20h11" />
                                    </svg>
                                </div>
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total Amount
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        @forelse($sales as $sale)
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {{ $sale->reference }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ $sale->date->format('M d, Y') }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ number_format($sale->total_amount, 2) }} {{ $sale->currency->symbol }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {{ $getStatusBadgeClass($sale->status) }}">
                                        {{ ucfirst($sale->status) }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div class="flex space-x-2">
                                        <button wire:click="showSaleDetails({{ $sale->id }})"
                                            class="text-indigo-600 hover:text-indigo-900">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                        @if($sale->due_amount > 0)
                                            <button wire:click="showPaymentForm({{ $sale->id }})"
                                                class="text-green-600 hover:text-green-900">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </button>
                                        @endif
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                    No sales found
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            <div class="px-6 py-4 border-t border-gray-200">
                {{ $sales->links() }}
            </div>
        </div>
    </div>

    <!-- Sale Details Modal -->
    <x-modal wire:model="showDetailsModal">
        <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Sale Details</h3>
            @if($selectedSale)
                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm font-medium text-gray-500">Reference</p>
                            <p class="mt-1 text-sm text-gray-900">{{ $selectedSale->reference }}</p>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-500">Date</p>
                            <p class="mt-1 text-sm text-gray-900">{{ $selectedSale->date->format('M d, Y') }}</p>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-500">Status</p>
                            <p class="mt-1">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {{ $getStatusBadgeClass($selectedSale->status) }}">
                                    {{ ucfirst($selectedSale->status) }}
                                </span>
                            </p>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-500">Total Amount</p>
                            <p class="mt-1 text-sm text-gray-900">{{ number_format($selectedSale->total_amount, 2) }} {{ $selectedSale->currency->symbol }}</p>
                        </div>
                    </div>

                    <div class="mt-6">
                        <h4 class="text-sm font-medium text-gray-500 mb-2">Items</h4>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    @foreach($selectedSale->saleItems as $item)
                                        <tr>
                                            <td class="px-4 py-2 text-sm text-gray-900">{{ $item->product->name }}</td>
                                            <td class="px-4 py-2 text-sm text-gray-500">{{ $item->quantity }}</td>
                                            <td class="px-4 py-2 text-sm text-gray-500">{{ number_format($item->unit_price, 2) }}</td>
                                            <td class="px-4 py-2 text-sm text-gray-500">{{ number_format($item->total, 2) }}</td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            @endif
        </div>
    </x-modal>

    <!-- Payment Modal -->
    <x-modal wire:model="showPaymentModal">
        <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Add Payment</h3>
            @if($selectedSale)
                <form wire:submit="addPayment" class="space-y-4">
                    <div>
                        <label for="paymentAmount" class="block text-sm font-medium text-gray-700">Amount</label>
                        <input type="number" step="0.01" wire:model="paymentAmount" id="paymentAmount"
                            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                        @error('paymentAmount') <span class="text-red-500 text-xs">{{ $errors->first('paymentAmount') }}</span> @enderror
                    </div>

                    <div>
                        <label for="paymentDate" class="block text-sm font-medium text-gray-700">Date</label>
                        <input type="date" wire:model="paymentDate" id="paymentDate"
                            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                        @error('paymentDate') <span class="text-red-500 text-xs">{{ $errors->first('paymentDate') }}</span> @enderror
                    </div>

                    <div>
                        <label for="paymentNotes" class="block text-sm font-medium text-gray-700">Notes</label>
                        <textarea wire:model="paymentNotes" id="paymentNotes" rows="3"
                            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"></textarea>
                        @error('paymentNotes') <span class="text-red-500 text-xs">{{ $errors->first('paymentNotes') }}</span> @enderror
                    </div>

                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" wire:click="$set('showPaymentModal', false)"
                            class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Cancel
                        </button>
                        <button type="submit"
                            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Add Payment
                        </button>
                    </div>
                </form>
            @endif
        </div>
    </x-modal>
</div> 