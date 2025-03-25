<div>
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
            <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                <div class="flex flex-col md:flex-row justify-between items-center mb-6">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">Reports</h2>
                    <div class="flex space-x-2">
                        <button wire:click="exportExcel" class="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-500 active:bg-green-700 focus:outline-none focus:border-green-700 focus:ring focus:ring-green-300 disabled:opacity-25 transition">
                            Export Excel
                        </button>
                        <button wire:click="exportPDF" class="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-300 disabled:opacity-25 transition">
                            Export PDF
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                        <label for="reportType" class="block text-sm font-medium text-gray-700">Report Type</label>
                        <select wire:model.live="reportType" id="reportType" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="all">All</option>
                            <option value="market_orders">Market Orders</option>
                            <option value="stocks">Stocks</option>
                            <option value="sales">Sales</option>
                            <option value="accounts">Accounts</option>
                            <option value="incomes">Account Incomes</option>
                            <option value="outcomes">Account Outcomes</option>
                        </select>
                    </div>

                    <div>
                        <label for="dateFrom" class="block text-sm font-medium text-gray-700">Date From</label>
                        <input type="date" wire:model.live="dateFrom" id="dateFrom" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    </div>

                    <div>
                        <label for="dateTo" class="block text-sm font-medium text-gray-700">Date To</label>
                        <input type="date" wire:model.live="dateTo" id="dateTo" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    </div>

                    <div>
                        <label for="searchTerm" class="block text-sm font-medium text-gray-700">Search</label>
                        <input type="text" wire:model.live.debounce.300ms="searchTerm" id="searchTerm" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Search...">
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <div class="relative">
                        <div wire:loading class="absolute inset-0 bg-white bg-opacity-75 z-10 flex items-center justify-center">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    @switch($reportType)
                                        @case('market_orders')
                                            <th wire:click="sortBy('id')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                                ID
                                                @if($sortField === 'id')
                                                    <span class="ml-1">{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                                @endif
                                            </th>
                                            <th wire:click="sortBy('created_at')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                                Date
                                                @if($sortField === 'created_at')
                                                    <span class="ml-1">{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                                @endif
                                            </th>
                                            <th wire:click="sortBy('total_amount')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                                Total Amount
                                                @if($sortField === 'total_amount')
                                                    <span class="ml-1">{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                                @endif
                                            </th>
                                            <th wire:click="sortBy('status')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                                Status
                                                @if($sortField === 'status')
                                                    <span class="ml-1">{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                                @endif
                                            </th>
                                            @break
                                        @case('stocks')
                                            <th wire:click="sortBy('id')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                                ID
                                                @if($sortField === 'id')
                                                    <span class="ml-1">{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                                @endif
                                            </th>
                                            <th wire:click="sortBy('product_id')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                                Product
                                                @if($sortField === 'product_id')
                                                    <span class="ml-1">{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                                @endif
                                            </th>
                                            <th wire:click="sortBy('quantity')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                                Quantity
                                                @if($sortField === 'quantity')
                                                    <span class="ml-1">{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                                @endif
                                            </th>
                                            <th wire:click="sortBy('created_at')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                                Date
                                                @if($sortField === 'created_at')
                                                    <span class="ml-1">{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                                @endif
                                            </th>
                                            @break
                                        @case('sales')
                                            <th wire:click="sortBy('id')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                                ID
                                                @if($sortField === 'id')
                                                    <span class="ml-1">{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                                @endif
                                            </th>
                                            <th wire:click="sortBy('product_id')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                                Product
                                                @if($sortField === 'product_id')
                                                    <span class="ml-1">{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                                @endif
                                            </th>
                                            <th wire:click="sortBy('quantity')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                                Quantity
                                                @if($sortField === 'quantity')
                                                    <span class="ml-1">{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                                @endif
                                            </th>
                                            <th wire:click="sortBy('amount')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                                Amount
                                                @if($sortField === 'amount')
                                                    <span class="ml-1">{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                                @endif
                                            </th>
                                            <th wire:click="sortBy('created_at')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                                Date
                                                @if($sortField === 'created_at')
                                                    <span class="ml-1">{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                                @endif
                                            </th>
                                            @break
                                        @case('accounts')
                                            <th wire:click="sortBy('id')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                                ID
                                                @if($sortField === 'id')
                                                    <span class="ml-1">{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                                @endif
                                            </th>
                                            <th wire:click="sortBy('name')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                                Name
                                                @if($sortField === 'name')
                                                    <span class="ml-1">{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                                @endif
                                            </th>
                                            <th wire:click="sortBy('balance')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                                Balance
                                                @if($sortField === 'balance')
                                                    <span class="ml-1">{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                                @endif
                                            </th>
                                            <th wire:click="sortBy('created_at')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                                Created At
                                                @if($sortField === 'created_at')
                                                    <span class="ml-1">{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                                @endif
                                            </th>
                                            @break
                                        @case('incomes')
                                        @case('outcomes')
                                            <th wire:click="sortBy('id')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                                ID
                                                @if($sortField === 'id')
                                                    <span class="ml-1">{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                                @endif
                                            </th>
                                            <th wire:click="sortBy('account_id')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                                Account
                                                @if($sortField === 'account_id')
                                                    <span class="ml-1">{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                                @endif
                                            </th>
                                            <th wire:click="sortBy('amount')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                                Amount
                                                @if($sortField === 'amount')
                                                    <span class="ml-1">{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                                @endif
                                            </th>
                                            <th wire:click="sortBy('description')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                                Description
                                                @if($sortField === 'description')
                                                    <span class="ml-1">{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                                @endif
                                            </th>
                                            <th wire:click="sortBy('created_at')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                                Date
                                                @if($sortField === 'created_at')
                                                    <span class="ml-1">{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                                @endif
                                            </th>
                                            @break
                                        @default
                                            <th wire:click="sortBy('id')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                                ID
                                                @if($sortField === 'id')
                                                    <span class="ml-1">{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                                @endif
                                            </th>
                                            <th wire:click="sortBy('created_at')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                                Created At
                                                @if($sortField === 'created_at')
                                                    <span class="ml-1">{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                                @endif
                                            </th>
                                    @endswitch
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                @forelse($records as $record)
                                    <tr>
                                        @switch($reportType)
                                            @case('market_orders')
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $record->id }}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $record->created_at->format('Y-m-d') }}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $record->total_amount }}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $record->status }}</td>
                                                @break
                                            @case('stocks')
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $record->id }}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $record->product->name ?? 'N/A' }}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $record->quantity }}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $record->created_at->format('Y-m-d H:i:s') }}</td>
                                                @break
                                            @case('sales')
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $record->id }}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $record->product->name ?? 'N/A' }}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $record->quantity }}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $record->amount }}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $record->created_at->format('Y-m-d H:i:s') }}</td>
                                                @break
                                            @case('accounts')
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $record->id }}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $record->name }}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $record->balance }}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $record->created_at->format('Y-m-d H:i:s') }}</td>
                                                @break
                                            @case('incomes')
                                            @case('outcomes')
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $record->id }}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $record->account->name ?? 'N/A' }}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $record->amount }}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $record->description }}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $record->created_at->format('Y-m-d H:i:s') }}</td>
                                                @break
                                            @default
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $record->id }}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $record->created_at->format('Y-m-d H:i:s') }}</td>
                                        @endswitch
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No records found</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="mt-4">
                    {{ $records->links() }}
                </div>
            </div>
        </div>
    </div>
</div>
