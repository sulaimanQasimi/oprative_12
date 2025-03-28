<x-customer-layout>
    <div class="py-12 bg-gray-50">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <!-- Header Section -->
            <div class="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
                <div class="px-6 py-8 bg-gradient-to-r from-indigo-600 to-indigo-800">
                    <div class="flex justify-between items-center">
                        <div>
                            <h2 class="text-3xl font-bold text-white">{{ __('Sales List') }}</h2>
                            <p class="mt-2 text-indigo-100">{{ __('Manage and track your sales transactions') }}</p>
                        </div>
                        <div class="bg-white/10 p-4 rounded-lg">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Filters Section -->
            <div class="bg-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] mb-6 overflow-hidden border border-gray-100">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-800">{{ __('Filters') }}</h3>
                        <button type="button" onclick="resetFilters()" class="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1 transition-colors duration-200">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            <span>{{ __('Reset Filters') }}</span>
                        </button>
                    </div>
                    <form id="filterForm" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <!-- Search Input -->
                        <div class="space-y-2">
                            <label for="search" class="block text-sm font-medium text-gray-700">{{ __('Search') }}</label>
                            <div class="relative group">
                                <input type="text" name="search" id="search" value="{{ request('search') }}"
                                    class="block w-full rounded-lg border-gray-300 shadow-[0_2px_4px_rgb(0,0,0,0.05)] focus:border-indigo-500 focus:ring-indigo-500 pl-10 pr-4 py-2.5 transition-all duration-200 group-hover:border-indigo-300 group-hover:shadow-[0_4px_8px_rgb(0,0,0,0.1)]"
                                    placeholder="{{ __('Search by reference...') }}">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Date Range Inputs -->
                        <div class="space-y-2">
                            <label for="dateFrom" class="block text-sm font-medium text-gray-700">{{ __('Date From') }}</label>
                            <div class="relative group">
                                <input type="text" name="dateFrom" id="dateFrom" value="{{ request('dateFrom') }}"
                                    data-jdp
                                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10 pr-4 py-2.5 transition-all duration-200 group-hover:border-indigo-300">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label for="dateTo" class="block text-sm font-medium text-gray-700">{{ __('Date To') }}</label>
                            <div class="relative group">
                                <input type="text" name="dateTo" id="dateTo" value="{{ request('dateTo') }}"
                                    data-jdp
                                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10 pr-4 py-2.5 transition-all duration-200 group-hover:border-indigo-300">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Status Select -->
                        <div class="space-y-2">
                            <label for="status" class="block text-sm font-medium text-gray-700">{{ __('Status') }}</label>
                            <div class="relative group">
                                <select name="status" id="status"
                                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10 pr-4 py-2.5 appearance-none transition-all duration-200 group-hover:border-indigo-300">
                                    <option value="">{{ __('All Statuses') }}</option>
                                    <option value="completed" {{ request('status') == 'completed' ? 'selected' : '' }}>{{ __('Completed') }}</option>
                                    <option value="pending" {{ request('status') == 'pending' ? 'selected' : '' }}>{{ __('Pending') }}</option>
                                    <option value="cancelled" {{ request('status') == 'cancelled' ? 'selected' : '' }}>{{ __('Cancelled') }}</option>
                                </select>
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                    </svg>
                                </div>
                                <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Warehouse Confirmation Select -->
                        <div class="space-y-2">
                            <label for="confirmedByWarehouse" class="block text-sm font-medium text-gray-700">{{ __('Warehouse Confirmed') }}</label>
                            <div class="relative group">
                                <select name="confirmedByWarehouse" id="confirmedByWarehouse"
                                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10 pr-4 py-2.5 appearance-none transition-all duration-200 group-hover:border-indigo-300">
                                    <option value="">{{ __('All') }}</option>
                                    <option value="1" {{ request('confirmedByWarehouse') == '1' ? 'selected' : '' }}>{{ __('Yes') }}</option>
                                    <option value="0" {{ request('confirmedByWarehouse') == '0' ? 'selected' : '' }}>{{ __('No') }}</option>
                                </select>
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                    </svg>
                                </div>
                                <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Shop Confirmation Select -->
                        <div class="space-y-2">
                            <label for="confirmedByShop" class="block text-sm font-medium text-gray-700">{{ __('Shop Confirmed') }}</label>
                            <div class="relative group">
                                <select name="confirmedByShop" id="confirmedByShop"
                                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10 pr-4 py-2.5 appearance-none transition-all duration-200 group-hover:border-indigo-300">
                                    <option value="">{{ __('All') }}</option>
                                    <option value="1" {{ request('confirmedByShop') == '1' ? 'selected' : '' }}>{{ __('Yes') }}</option>
                                    <option value="0" {{ request('confirmedByShop') == '0' ? 'selected' : '' }}>{{ __('No') }}</option>
                                </select>
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    </svg>
                                </div>
                                <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Moved from Warehouse Select -->
                        <div class="space-y-2">
                            <label for="movedFromWarehouse" class="block text-sm font-medium text-gray-700">{{ __('Moved from Warehouse') }}</label>
                            <div class="relative group">
                                <select name="movedFromWarehouse" id="movedFromWarehouse"
                                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10 pr-4 py-2.5 appearance-none transition-all duration-200 group-hover:border-indigo-300">
                                    <option value="">{{ __('All') }}</option>
                                    <option value="1" {{ request('movedFromWarehouse') == '1' ? 'selected' : '' }}>{{ __('Yes') }}</option>
                                    <option value="0" {{ request('movedFromWarehouse') == '0' ? 'selected' : '' }}>{{ __('No') }}</option>
                                </select>
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                                    </svg>
                                </div>
                                <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Apply Filters Button -->
                        <div class="flex items-end">
                            <button type="submit"
                                class="w-full bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                                </svg>
                                <span>{{ __('Apply Filters') }}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Sales Table -->
            <div class="bg-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden border border-gray-100">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr class="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
                                <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    <button class="flex items-center space-x-1 group" onclick="sortBy('reference')">
                                        <span>{{ __('Reference') }}</span>
                                        <span class="sort-icon opacity-0 group-hover:opacity-100 transition-opacity duration-200" data-field="reference">sort</span>
                                    </button>
                                </th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    <button class="flex items-center space-x-1 group" onclick="sortBy('date')">
                                        <span>{{ __('Date') }}</span>
                                        <span class="sort-icon opacity-0 group-hover:opacity-100 transition-opacity duration-200" data-field="date">sort</span>
                                    </button>
                                </th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    <button class="flex items-center space-x-1 group" onclick="sortBy('total_amount')">
                                        <span>{{ __('Total Amount') }}</span>
                                        <span class="sort-icon opacity-0 group-hover:opacity-100 transition-opacity duration-200" data-field="total_amount">sort</span>
                                    </button>
                                </th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    <button class="flex items-center space-x-1 group" onclick="sortBy('status')">
                                        <span>{{ __('Status') }}</span>
                                        <span class="sort-icon opacity-0 group-hover:opacity-100 transition-opacity duration-200" data-field="status">sort</span>
                                    </button>
                                </th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">{{ __('Actions') }}</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            @foreach($sales as $sale)
                                <tr class="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200 hover:shadow-[0_4px_12px_rgb(0,0,0,0.05)]">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-medium text-gray-900">{{ $sale->reference }}</div>
                                        <div class="text-xs text-gray-500">{{ $sale->customer->name }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">{{ $sale->date->format('Y-m-d') }}</div>
                                        <div class="text-xs text-gray-500">{{ $sale->date->format('H:i') }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-semibold text-gray-900">{{ $sale->total }}</div>
                                        <div class="text-xs text-gray-500">{{ __('Paid') }}: {{ $sale->paid_amount }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm {{ $sale->getStatusBadgeClass() }}">
                                            {{ ucfirst($sale->status) }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                        <button onclick="showSaleDetails({{ $sale->id }})"
                                            class="text-indigo-600 hover:text-indigo-900 transition-colors duration-200 group relative"
                                            title="{{ __('View Details') }}">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                            </svg>
                                        </button>
                                        @if($sale->due_amount > 0)
                                            <button onclick="showPaymentForm({{ $sale->id }})"
                                                class="text-green-600 hover:text-green-900 transition-colors duration-200 group relative"
                                                title="{{ __('Add Payment') }}">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                            </button>
                                        @endif
                                        @if(!$sale->confirmed_by_shop && $sale->confirmed_by_warehouse)
                                            <button onclick="confirmSale({{ $sale->id }})"
                                                class="text-blue-600 hover:text-blue-900 transition-colors duration-200 group relative"
                                                title="{{ __('Confirm Sale') }}">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                            </button>
                                        @endif
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Pagination -->
            <div class="mt-6">
                {{ $sales->links() }}
            </div>
        </div>
    </div>

    <!-- Sale Details Modal -->
    <div id="detailsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden overflow-y-auto h-full w-full transition-opacity duration-300">
        <div class="relative top-20 mx-auto p-6 border w-3/4 shadow-xl rounded-lg bg-white transform transition-all duration-300">
            <!-- Modal Header -->
            <div class="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <div class="flex items-center space-x-3">
                    <div class="bg-indigo-100 p-2 rounded-lg">
                        <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900">{{ __('Sale Details') }}</h3>
                </div>
                <button onclick="closeDetailsModal()" class="text-gray-400 hover:text-gray-500 transition-colors duration-200">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <!-- Loading State -->
            <div id="loadingState" class="hidden">
                <div class="flex flex-col items-center justify-center py-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                    <p class="text-gray-500">{{ __('Loading sale details...') }}</p>
                </div>
            </div>

            <!-- Sale Details Content -->
            <div id="saleDetails" class="space-y-6 hidden">
                <!-- Sale Information -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="flex items-center space-x-3 mb-2">
                            <div class="bg-blue-100 p-2 rounded-lg">
                                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                            </div>
                            <h4 class="text-sm font-medium text-gray-500">{{ __('Reference') }}</h4>
                        </div>
                        <p class="text-lg font-semibold text-gray-900" id="saleReference"></p>
                    </div>

                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="flex items-center space-x-3 mb-2">
                            <div class="bg-green-100 p-2 rounded-lg">
                                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <h4 class="text-sm font-medium text-gray-500">{{ __('Date') }}</h4>
                        </div>
                        <p class="text-lg font-semibold text-gray-900" id="saleDate"></p>
                    </div>

                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="flex items-center space-x-3 mb-2">
                            <div class="bg-purple-100 p-2 rounded-lg">
                                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h4 class="text-sm font-medium text-gray-500">{{ __('Total Amount') }}</h4>
                        </div>
                        <p class="text-lg font-semibold text-gray-900" id="saleAmount"></p>
                    </div>

                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="flex items-center space-x-3 mb-2">
                            <div class="bg-yellow-100 p-2 rounded-lg">
                                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h4 class="text-sm font-medium text-gray-500">{{ __('Status') }}</h4>
                        </div>
                        <p class="text-lg font-semibold" id="saleStatus"></p>
                    </div>

                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="flex items-center space-x-3 mb-2">
                            <div class="bg-red-100 p-2 rounded-lg">
                                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h4 class="text-sm font-medium text-gray-500">{{ __('Due Amount') }}</h4>
                        </div>
                        <p class="text-lg font-semibold text-gray-900" id="saleDueAmount"></p>
                    </div>
                </div>

                <!-- Sale Items Table -->
                <div class="mt-8">
                    <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                        <h4 class="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-3">
                            <div class="bg-purple-100 p-2 rounded-lg">
                                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                            </div>
                            <span>{{ __('Sale Items') }}</span>
                        </h4>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr class="bg-gradient-to-r from-purple-50 to-blue-50">
                                        <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div class="flex items-center space-x-2">
                                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                                </svg>
                                                <span>{{ __('Product') }}</span>
                                            </div>
                                        </th>
                                        <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div class="flex items-center space-x-2">
                                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                                                </svg>
                                                <span>{{ __('Quantity') }}</span>
                                            </div>
                                        </th>
                                        <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div class="flex items-center space-x-2">
                                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                <span>{{ __('Price') }}</span>
                                            </div>
                                        </th>
                                        <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div class="flex items-center space-x-2">
                                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                                </svg>
                                                <span>{{ __('Total') }}</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200" id="saleItemsTable">
                                </tbody>
                                <tfoot class="bg-gradient-to-r from-purple-50 to-blue-50">
                                    <tr>
                                        <td colspan="3" class="px-6 py-4 text-right text-sm font-medium text-gray-500">
                                            <div class="flex items-center justify-end space-x-2">
                                                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                                </svg>
                                                <span>{{ __('Total Amount') }}</span>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 text-left text-sm font-semibold text-gray-900" id="saleTotalAmount"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button onclick="closeDetailsModal()"
                    class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span>{{ __('Close') }}</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Payment Modal -->
    <div id="paymentModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden overflow-y-auto h-full w-full transition-opacity duration-300">
        <div class="relative top-20 mx-auto p-6 border w-1/2 shadow-xl rounded-lg bg-white transform transition-all duration-300">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-semibold text-gray-900">{{ __('Add Payment') }}</h3>
                <button onclick="closePaymentModal()" class="text-gray-400 hover:text-gray-500 transition-colors duration-200">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <form id="paymentForm" class="space-y-6">
                    <input type="hidden" id="saleId" name="saleId">
                <div>
                    <label for="paymentAmount" class="block text-sm font-medium text-gray-700">{{ __('Amount') }}</label>
                        <input type="number" step="0.01" id="paymentAmount" name="paymentAmount" required
                        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    </div>
                <div>
                    <label for="paymentDate" class="block text-sm font-medium text-gray-700">{{ __('Date') }}</label>
                        <input type="date" id="paymentDate" name="paymentDate" required
                        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    </div>
                <div>
                    <label for="paymentNotes" class="block text-sm font-medium text-gray-700">{{ __('Notes') }}</label>
                        <textarea id="paymentNotes" name="paymentNotes" rows="3"
                        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
                    </div>
                    <div class="flex justify-end space-x-3">
                        <button type="button" onclick="closePaymentModal()"
                        class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                            {{ __('Cancel') }}
                        </button>
                    <button type="submit"
                        class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200">
                            {{ __('Submit') }}
                        </button>
                    </div>
                </form>
        </div>
    </div>

    @push('scripts')
        <script>
            // Initialize page animations
            document.addEventListener('DOMContentLoaded', function() {
                // Header animation
                anime({
                    targets: '.bg-gradient-to-r.from-indigo-600',
                    opacity: [0, 1],
                    translateY: [-20, 0],
                    easing: 'easeOutExpo',
                    duration: 1000
                });

                // Animate filters section
                anime({
                    targets: '.bg-white.rounded-lg.shadow-[0_8px_30px_rgb(0,0,0,0.12)]',
                    opacity: [0, 1],
                    translateY: [-15, 0],
                    easing: 'easeOutQuint',
                    duration: 800,
                    delay: 300
                });

                // Staggered animation for table rows
                anime({
                    targets: 'tbody tr',
                    opacity: [0, 1],
                    translateX: [-20, 0],
                    delay: anime.stagger(80, {start: 500}),
                    easing: 'easeOutSine',
                    duration: 600
                });

                // Animate filter input groups on focus
                document.querySelectorAll('#filterForm input, #filterForm select').forEach(input => {
                    input.addEventListener('focus', function() {
                        anime({
                            targets: this.closest('.group'),
                            scale: 1.02,
                            boxShadow: '0 4px 15px rgba(79, 70, 229, 0.15)',
                            duration: 300,
                            easing: 'easeOutQuart'
                        });
                    });

                    input.addEventListener('blur', function() {
                        anime({
                            targets: this.closest('.group'),
                            scale: 1,
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                            duration: 300,
                            easing: 'easeOutQuart'
                        });
                    });
                });

                // Bounce effect for buttons
                document.querySelectorAll('button:not([type="submit"])').forEach(button => {
                    button.addEventListener('mouseenter', function() {
                        anime({
                            targets: this,
                            scale: 1.05,
                            duration: 300,
                            easing: 'easeOutElastic(1, .8)'
                        });
                    });

                    button.addEventListener('mouseleave', function() {
                        anime({
                            targets: this,
                            scale: 1,
                            duration: 300,
                            easing: 'easeOutElastic(1, .8)'
                        });
                    });
                });

                // Special effect for submit button
                document.querySelector('button[type="submit"]').addEventListener('mouseenter', function() {
                    anime({
                        targets: this,
                        scale: 1.05,
                        backgroundColor: '#4338ca', // Darker indigo
                        boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)',
                        duration: 300,
                        easing: 'easeOutQuart'
                    });
                });

                document.querySelector('button[type="submit"]').addEventListener('mouseleave', function() {
                    anime({
                        targets: this,
                        scale: 1,
                        backgroundColor: '#4f46e5', // Original indigo
                        boxShadow: '0 0 0 rgba(79, 70, 229, 0)',
                        duration: 300,
                        easing: 'easeOutQuart'
                    });
                });
            });

            // Create a subtle background gradient animation
            function animateBackground() {
                anime({
                    targets: '.py-12.bg-gray-50',
                    background: [
                        'linear-gradient(135deg, rgba(243, 244, 246, 1) 0%, rgba(249, 250, 251, 1) 100%)',
                        'linear-gradient(225deg, rgba(243, 244, 246, 1) 0%, rgba(249, 250, 251, 1) 100%)',
                        'linear-gradient(315deg, rgba(243, 244, 246, 1) 0%, rgba(249, 250, 251, 1) 100%)',
                        'linear-gradient(45deg, rgba(243, 244, 246, 1) 0%, rgba(249, 250, 251, 1) 100%)'
                    ],
                    duration: 20000,
                    easing: 'easeInOutSine',
                    direction: 'alternate',
                    loop: true
                });
            }

            document.addEventListener('DOMContentLoaded', animateBackground);

            // Modal animations
            function showSaleDetails(saleId) {
                const modal = document.getElementById('detailsModal');
                const loadingState = document.getElementById('loadingState');
                const saleDetails = document.getElementById('saleDetails');
                const modalContent = modal.querySelector('.relative');

                // Show modal with animation
                modal.classList.remove('hidden');
                loadingState.classList.remove('hidden');
                saleDetails.classList.add('hidden');

                // Animate modal appearing
                anime({
                    targets: modalContent,
                    opacity: [0, 1],
                    scale: [0.9, 1],
                    duration: 400,
                    easing: 'easeOutCubic'
                });

                // Fetch sale details
                fetch(`{{ route('customer.sales.show', '') }}/${saleId}`)
                    .then(response => response.json())
                    .then(data => {
                        // Update sale information
                        document.getElementById('saleReference').textContent = data.reference;
                        document.getElementById('saleDate').textContent = data.date;
                        document.getElementById('saleAmount').textContent = data.total_amount;
                        document.getElementById('saleDueAmount').textContent = data.due_amount;

                        // Update status with appropriate styling
                        const statusElement = document.getElementById('saleStatus');
                        statusElement.textContent = data.status;
                        statusElement.className = `text-lg font-semibold px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(data.status)}`;

                        // Update sale items table
                        const tableBody = document.getElementById('saleItemsTable');
                        tableBody.innerHTML = data.sale_items.map(item => `
                            <tr class="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200 group">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center space-x-3">
                                        <div class="bg-gray-100 p-2 rounded-lg group-hover:bg-purple-100 transition-colors duration-200">
                                            <svg class="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <div class="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors duration-200">${item.product.name}</div>
                                            <div class="text-xs text-gray-500">${item.product.code || ''}</div>
                                            <div class="text-xs text-gray-400 mt-0.5">${item.product.barcode || ''}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center space-x-2">
                                        <div class="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                                            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                                            </svg>
                                        </div>
                                        <span class="text-sm text-gray-900">${item.quantity}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center space-x-2">
                                        <div class="bg-yellow-100 p-2 rounded-lg group-hover:bg-yellow-200 transition-colors duration-200">
                                            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        </div>
                                        <span class="text-sm text-gray-900">${item.unit_price}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center space-x-2">
                                        <div class="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors duration-200">
                                            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                            </svg>
                                        </div>
                                        <span class="text-sm font-semibold text-gray-900">${item.total}</span>
                                    </div>
                                </td>
                            </tr>
                        `).join('');

                        // Update total amount
                        document.getElementById('saleTotalAmount').textContent = data.total_amount;

                        // Hide loading state and show details with animation
                        loadingState.classList.add('hidden');
                        saleDetails.classList.remove('hidden');

                        // Animate the sale details items appearing
                        anime({
                            targets: '#saleDetails > div, #saleDetails table tr',
                            opacity: [0, 1],
                            translateY: [15, 0],
                            delay: anime.stagger(100),
                            duration: 500,
                            easing: 'easeOutCubic'
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching sale details:', error);
                        loadingState.classList.add('hidden');
                        alert('Error loading sale details. Please try again.');
                    });
            }

            function closeDetailsModal() {
                const modal = document.getElementById('detailsModal');
                const modalContent = modal.querySelector('.relative');

                // Animate modal disappearing
                anime({
                    targets: modalContent,
                    opacity: [1, 0],
                    scale: [1, 0.9],
                    duration: 300,
                    easing: 'easeInCubic',
                    complete: function() {
                        modal.classList.add('hidden');
                    }
                });
            }

            // Payment modal animations
            function showPaymentForm(saleId) {
                document.getElementById('saleId').value = saleId;
                const modal = document.getElementById('paymentModal');
                const modalContent = modal.querySelector('.relative');

                modal.classList.remove('hidden');

                anime({
                    targets: modalContent,
                    opacity: [0, 1],
                    translateY: [50, 0],
                    duration: 500,
                    easing: 'easeOutQuint'
                });

                // Animate form fields
                anime({
                    targets: '#paymentForm > div',
                    opacity: [0, 1],
                    translateX: [-20, 0],
                    delay: anime.stagger(100, {start: 200}),
                    duration: 500,
                    easing: 'easeOutCubic'
                });
            }

            function closePaymentModal() {
                const modal = document.getElementById('paymentModal');
                const modalContent = modal.querySelector('.relative');

                anime({
                    targets: modalContent,
                    opacity: [1, 0],
                    translateY: [0, 50],
                    duration: 400,
                    easing: 'easeInCubic',
                    complete: function() {
                        modal.classList.add('hidden');
                        document.getElementById('paymentForm').reset();
                    }
                });
            }

            // Filter form submission
            document.getElementById('filterForm').addEventListener('submit', function (e) {
                e.preventDefault();
                const formData = new FormData(this);
                const params = new URLSearchParams(formData);
                console.log('Form data:', Object.fromEntries(formData));
                window.location.href = `{{ route('customer.sales.index') }}?${params.toString()}`;
            });

            // Sorting functionality
            function sortBy(field) {
                const currentDirection = new URLSearchParams(window.location.search).get('sortDirection') || 'asc';
                const currentField = new URLSearchParams(window.location.search).get('sortField') || 'date';

                let newDirection = 'asc';
                if (currentField === field) {
                    newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
                }

                const params = new URLSearchParams(window.location.search);
                params.set('sortField', field);
                params.set('sortDirection', newDirection);
                window.location.href = `{{ route('customer.sales.index') }}?${params.toString()}`;
            }

            function getStatusBadgeClass(status) {
                switch (status.toLowerCase()) {
                    case 'completed':
                        return 'bg-green-100 text-green-800';
                    case 'pending':
                        return 'bg-yellow-100 text-yellow-800';
                    case 'cancelled':
                        return 'bg-red-100 text-red-800';
                    default:
                        return 'bg-gray-100 text-gray-800';
                }
            }

            document.getElementById('paymentForm').addEventListener('submit', function (e) {
                e.preventDefault();
                const formData = new FormData(this);
                const saleId = formData.get('saleId');

                // Add submission animation
                const submitButton = this.querySelector('button[type="submit"]');
                anime({
                    targets: submitButton,
                    scale: [1, 0.95, 1],
                    backgroundColor: ['#4f46e5', '#4338ca', '#4f46e5'],
                    duration: 700,
                    easing: 'easeInOutQuad'
                });

                fetch(`{{ route('customer.sales.payment', '') }}/${saleId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    },
                    body: JSON.stringify({
                        paymentAmount: formData.get('paymentAmount'),
                        paymentDate: formData.get('paymentDate'),
                        paymentNotes: formData.get('paymentNotes')
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            window.location.reload();
                        } else {
                            alert(data.message);
                        }
                    });
            });

            // Confirm sale with animation
            function confirmSale(saleId) {
                if (!confirm('{{ __("Are you sure you want to confirm this sale?") }}')) {
                    return;
                }

                fetch(`{{ route('customer.sales.confirm', '') }}/${saleId}`, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            window.location.reload();
                        } else {
                            alert(data.message);
                        }
                    });
            }

            // Reset filters function
            function resetFilters() {
                // Ripple animation on reset
                const resetButton = document.querySelector('button[onclick="resetFilters()"]');
                const ripple = document.createElement('span');
                ripple.classList.add('ripple-effect');
                resetButton.appendChild(ripple);

                anime({
                    targets: ripple,
                    scale: [0, 1],
                    opacity: [1, 0],
                    translateX: '-50%',
                    translateY: '-50%',
                    duration: 600,
                    easing: 'easeOutCubic',
                    complete: function() {
                        ripple.remove();
                    }
                });

                const form = document.getElementById('filterForm');
                const inputs = form.querySelectorAll('input, select');

                // Animate inputs being cleared
                anime({
                    targets: inputs,
                    backgroundColor: ['#ffffff', '#f3f4f6', '#ffffff'],
                    duration: 400,
                    easing: 'easeInOutQuad'
                });

                inputs.forEach(input => {
                    input.value = '';
                });

                setTimeout(() => {
                    form.submit();
                }, 400);
            }

            // Add active state to filters when they have values
            function updateFilterStates() {
                const inputs = document.querySelectorAll('#filterForm input, #filterForm select');
                inputs.forEach(input => {
                    const group = input.closest('.group');
                    if (input.value) {
                        group.classList.add('border-indigo-300');
                        const icon = group.querySelector('svg');
                        if (icon) {
                            icon.classList.remove('text-gray-400');
                            icon.classList.add('text-indigo-500');
                        }
                    } else {
                        group.classList.remove('border-indigo-300');
                        const icon = group.querySelector('svg');
                        if (icon) {
                            icon.classList.add('text-gray-400');
                            icon.classList.remove('text-indigo-500');
                        }
                    }
                });
            }

            // Initialize filter states
            document.addEventListener('DOMContentLoaded', updateFilterStates);

            // Update filter states on change
            document.getElementById('filterForm').addEventListener('change', updateFilterStates);

            // Add a custom ripple style for the reset button
            const style = document.createElement('style');
            style.textContent = `
                .ripple-effect {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(79, 70, 229, 0.3);
                    width: 100px;
                    height: 100px;
                    left: 50%;
                    top: 50%;
                    pointer-events: none;
                }

                .sort-icon::after {
                    content: '↑';
                    display: inline-block;
                    transition: transform 0.3s ease;
                }

                [data-direction="desc"] .sort-icon::after {
                    transform: rotate(180deg);
                }

                .hover-scale {
                    transition: transform 0.3s ease;
                }

                .hover-scale:hover {
                    transform: scale(1.05);
                }
            `;
            document.head.appendChild(style);
        </script>
    @endpush
</x-customer-layout>
