<div>
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
            <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                <!-- Header Section with Gradient Background -->
                <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                    <div class="flex flex-col md:flex-row justify-between items-center">
                        <h2 class="text-2xl font-bold mb-4 md:mb-0 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Reports Dashboard
                        </h2>
                        <div class="flex space-x-2">
                            <button wire:click="exportExcel" class="flex items-center px-4 py-2 bg-white text-indigo-700 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition duration-150 ease-in-out">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export Excel
                            </button>
                            <button wire:click="exportPDF" class="flex items-center px-4 py-2 bg-white text-indigo-700 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition duration-150 ease-in-out">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export PDF
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Filters Card -->
                <div class="p-6">
                    <div class="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200 shadow-sm">
                        <h3 class="text-lg font-medium text-gray-800 mb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filter Reports
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div class="relative">
                                <label for="reportType" class="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                                <div class="relative">
                                    <select wire:model.live="reportType" id="reportType" class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm">
                                        <option value="all">All</option>
                                        <option value="market_orders">Market Orders</option>
                                        <option value="stocks">Stocks</option>
                                        <option value="sales">Sales</option>
                                        <option value="accounts">Accounts</option>
                                        <option value="incomes">Account Incomes</option>
                                        <option value="outcomes">Account Outcomes</option>
                                    </select>
                                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label for="dateFrom" class="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                    </div>
                                    <input type="date" wire:model.live="dateFrom" id="dateFrom" class="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                </div>
                            </div>

                            <div>
                                <label for="dateTo" class="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                    </div>
                                    <input type="date" wire:model.live="dateTo" id="dateTo" class="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                </div>
                            </div>

                            <div>
                                <label for="searchTerm" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                    </div>
                                    <input type="text" wire:model.live.debounce.300ms="searchTerm" id="searchTerm" placeholder="Search..." class="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Data Table Card -->
                    <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <!-- Results Summary -->
                        <div class="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                            <h3 class="text-sm font-medium text-gray-700">Results</h3>
                            <div class="flex items-center space-x-2">
                                <label for="perPage" class="text-sm text-gray-600">Show</label>
                                <select wire:model.live="perPage" id="perPage" class="text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                <span class="text-sm text-gray-600">entries</span>
                            </div>
                        </div>

                        <div class="overflow-x-auto relative">
                            <div wire:loading class="absolute inset-0 bg-white bg-opacity-75 z-10 flex items-center justify-center">
                                <div class="flex items-center justify-center">
                                    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                                    <span class="ml-2 text-indigo-600 font-medium">Loading...</span>
                                </div>
                            </div>
                            <table class="min-w-full divide-y divide-gray-200 table-fixed">
                                <thead>
                                    <tr class="bg-gradient-to-r from-gray-50 to-gray-100">
                                        @switch($reportType)
                                            @case('market_orders')
                                                <th wire:click="sortBy('id')" class="group px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 w-1/6">
                                                    <div class="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        ID
                                                        @if($sortField === 'id')
                                                            <svg class="ml-1 h-4 w-4 {{ $sortDirection === 'asc' ? 'text-indigo-500' : 'text-indigo-500 transform rotate-180' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @endif
                                                    </div>
                                                </th>
                                                <th wire:click="sortBy('created_at')" class="group px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 w-1/4">
                                                    <div class="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        Date
                                                        @if($sortField === 'created_at')
                                                            <svg class="ml-1 h-4 w-4 {{ $sortDirection === 'asc' ? 'text-indigo-500' : 'text-indigo-500 transform rotate-180' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @endif
                                                    </div>
                                                </th>
                                                <th wire:click="sortBy('total_amount')" class="group px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 w-1/4">
                                                    <div class="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Total Amount
                                                        @if($sortField === 'total_amount')
                                                            <svg class="ml-1 h-4 w-4 {{ $sortDirection === 'asc' ? 'text-indigo-500' : 'text-indigo-500 transform rotate-180' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @endif
                                                    </div>
                                                </th>
                                                <th wire:click="sortBy('status')" class="group px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 w-1/6">
                                                    <div class="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Status
                                                        @if($sortField === 'status')
                                                            <svg class="ml-1 h-4 w-4 {{ $sortDirection === 'asc' ? 'text-indigo-500' : 'text-indigo-500 transform rotate-180' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @endif
                                                    </div>
                                                </th>
                                                @break
                                            @case('stocks')
                                                <th wire:click="sortBy('id')" class="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                                    <div class="flex items-center">
                                                        ID
                                                        @if($sortField === 'id')
                                                            <svg class="ml-1 h-4 w-4 {{ $sortDirection === 'asc' ? 'text-indigo-500' : 'text-indigo-500 transform rotate-180' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @endif
                                                    </div>
                                                </th>
                                                <th wire:click="sortBy('product_id')" class="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                                    <div class="flex items-center">
                                                        Product
                                                        @if($sortField === 'product_id')
                                                            <svg class="ml-1 h-4 w-4 {{ $sortDirection === 'asc' ? 'text-indigo-500' : 'text-indigo-500 transform rotate-180' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @endif
                                                    </div>
                                                </th>
                                                <th wire:click="sortBy('quantity')" class="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                                    <div class="flex items-center">
                                                        Quantity
                                                        @if($sortField === 'quantity')
                                                            <svg class="ml-1 h-4 w-4 {{ $sortDirection === 'asc' ? 'text-indigo-500' : 'text-indigo-500 transform rotate-180' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @endif
                                                    </div>
                                                </th>
                                                <th wire:click="sortBy('created_at')" class="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                                    <div class="flex items-center">
                                                        Date
                                                        @if($sortField === 'created_at')
                                                            <svg class="ml-1 h-4 w-4 {{ $sortDirection === 'asc' ? 'text-indigo-500' : 'text-indigo-500 transform rotate-180' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @endif
                                                    </div>
                                                </th>
                                                @break
                                            @case('sales')
                                                <th wire:click="sortBy('id')" class="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                                    <div class="flex items-center">
                                                        ID
                                                        @if($sortField === 'id')
                                                            <svg class="ml-1 h-4 w-4 {{ $sortDirection === 'asc' ? 'text-indigo-500' : 'text-indigo-500 transform rotate-180' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @endif
                                                    </div>
                                                </th>
                                                <th wire:click="sortBy('product_id')" class="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                                    <div class="flex items-center">
                                                        Product
                                                        @if($sortField === 'product_id')
                                                            <svg class="ml-1 h-4 w-4 {{ $sortDirection === 'asc' ? 'text-indigo-500' : 'text-indigo-500 transform rotate-180' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @endif
                                                    </div>
                                                </th>
                                                <th wire:click="sortBy('quantity')" class="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                                    <div class="flex items-center">
                                                        Quantity
                                                        @if($sortField === 'quantity')
                                                            <svg class="ml-1 h-4 w-4 {{ $sortDirection === 'asc' ? 'text-indigo-500' : 'text-indigo-500 transform rotate-180' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @endif
                                                    </div>
                                                </th>
                                                <th wire:click="sortBy('amount')" class="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                                    <div class="flex items-center">
                                                        Amount
                                                        @if($sortField === 'amount')
                                                            <svg class="ml-1 h-4 w-4 {{ $sortDirection === 'asc' ? 'text-indigo-500' : 'text-indigo-500 transform rotate-180' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @endif
                                                    </div>
                                                </th>
                                                <th wire:click="sortBy('created_at')" class="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                                    <div class="flex items-center">
                                                        Date
                                                        @if($sortField === 'created_at')
                                                            <svg class="ml-1 h-4 w-4 {{ $sortDirection === 'asc' ? 'text-indigo-500' : 'text-indigo-500 transform rotate-180' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @endif
                                                    </div>
                                                </th>
                                                @break
                                            @case('accounts')
                                                <th wire:click="sortBy('id')" class="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                                    <div class="flex items-center">
                                                        ID
                                                        @if($sortField === 'id')
                                                            <svg class="ml-1 h-4 w-4 {{ $sortDirection === 'asc' ? 'text-indigo-500' : 'text-indigo-500 transform rotate-180' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @endif
                                                    </div>
                                                </th>
                                                <th wire:click="sortBy('name')" class="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                                    <div class="flex items-center">
                                                        Name
                                                        @if($sortField === 'name')
                                                            <svg class="ml-1 h-4 w-4 {{ $sortDirection === 'asc' ? 'text-indigo-500' : 'text-indigo-500 transform rotate-180' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @endif
                                                    </div>
                                                </th>
                                                <th wire:click="sortBy('balance')" class="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                                    <div class="flex items-center">
                                                        Balance
                                                        @if($sortField === 'balance')
                                                            <svg class="ml-1 h-4 w-4 {{ $sortDirection === 'asc' ? 'text-indigo-500' : 'text-indigo-500 transform rotate-180' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @endif
                                                    </div>
                                                </th>
                                                <th wire:click="sortBy('created_at')" class="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                                    <div class="flex items-center">
                                                        Created At
                                                        @if($sortField === 'created_at')
                                                            <svg class="ml-1 h-4 w-4 {{ $sortDirection === 'asc' ? 'text-indigo-500' : 'text-indigo-500 transform rotate-180' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @endif
                                                    </div>
                                                </th>
                                                @break
                                            @case('incomes')
                                            @case('outcomes')
                                                <th wire:click="sortBy('id')" class="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                                    <div class="flex items-center">
                                                        ID
                                                        @if($sortField === 'id')
                                                            <svg class="ml-1 h-4 w-4 {{ $sortDirection === 'asc' ? 'text-indigo-500' : 'text-indigo-500 transform rotate-180' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @endif
                                                    </div>
                                                </th>
                                                <th wire:click="sortBy('account_id')" class="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                                    <div class="flex items-center">
                                                        Account
                                                        @if($sortField === 'account_id')
                                                            <svg class="ml-1 h-4 w-4 {{ $sortDirection === 'asc' ? 'text-indigo-500' : 'text-indigo-500 transform rotate-180' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @endif
                                                    </div>
                                                </th>
                                                <th wire:click="sortBy('amount')" class="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                                    <div class="flex items-center">
                                                        Amount
                                                        @if($sortField === 'amount')
                                                            <svg class="ml-1 h-4 w-4 {{ $sortDirection === 'asc' ? 'text-indigo-500' : 'text-indigo-500 transform rotate-180' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @endif
                                                    </div>
                                                </th>
                                                <th wire:click="sortBy('description')" class="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                                    <div class="flex items-center">
                                                        Description
                                                        @if($sortField === 'description')
                                                            <svg class="ml-1 h-4 w-4 {{ $sortDirection === 'asc' ? 'text-indigo-500' : 'text-indigo-500 transform rotate-180' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @endif
                                                    </div>
                                                </th>
                                                <th wire:click="sortBy('created_at')" class="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                                    <div class="flex items-center">
                                                        Date
                                                        @if($sortField === 'created_at')
                                                            <svg class="ml-1 h-4 w-4 {{ $sortDirection === 'asc' ? 'text-indigo-500' : 'text-indigo-500 transform rotate-180' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @endif
                                                    </div>
                                                </th>
                                                @break
                                            @default
                                                <th wire:click="sortBy('id')" class="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                                    <div class="flex items-center">
                                                        ID
                                                        @if($sortField === 'id')
                                                            <svg class="ml-1 h-4 w-4 {{ $sortDirection === 'asc' ? 'text-indigo-500' : 'text-indigo-500 transform rotate-180' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @endif
                                                    </div>
                                                </th>
                                                <th wire:click="sortBy('created_at')" class="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                                    <div class="flex items-center">
                                                        Created At
                                                        @if($sortField === 'created_at')
                                                            <svg class="ml-1 h-4 w-4 {{ $sortDirection === 'asc' ? 'text-indigo-500' : 'text-indigo-500 transform rotate-180' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                            </svg>
                                                        @endif
                                                    </div>
                                                </th>
                                        @endswitch
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    @forelse($records as $record)
                                        <tr class="hover:bg-gray-50 transition-colors duration-150">
                                            @switch($reportType)
                                                @case('market_orders')
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="flex items-center">
                                                            <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-500">
                                                                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                                </svg>
                                                            </div>
                                                            <div class="ml-4">
                                                                <div class="text-sm font-medium text-gray-900">#{{ $record->id }}</div>
                                                                <div class="text-xs text-gray-500">Order</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm text-gray-900">{{ $record->created_at->format('Y-m-d') }}</div>
                                                        <div class="text-xs text-gray-500">{{ $record->created_at->format('h:i A') }}</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium text-gray-900">{{ $record->total_amount }}</div>
                                                        <div class="text-xs text-gray-500">Total Amount</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm
                                                            {{ $record->status == 'completed' ? 'bg-green-100 text-green-800' :
                                                              ($record->status == 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                              'bg-gray-100 text-gray-800') }}">
                                                            {{ ucfirst($record->status) }}
                                                        </span>
                                                    </td>
                                                    @break
                                                @case('stocks')
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="flex items-center">
                                                            <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-500">
                                                                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                                </svg>
                                                            </div>
                                                            <div class="ml-4">
                                                                <div class="text-sm font-medium text-gray-900">#{{ $record->id }}</div>
                                                                <div class="text-xs text-gray-500">Stock</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium text-gray-900">{{ $record->product->name ?? 'N/A' }}</div>
                                                        <div class="text-xs text-gray-500">Product Name</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium text-gray-900">{{ $record->quantity }}</div>
                                                        <div class="text-xs text-gray-500">Units</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm text-gray-900">{{ $record->created_at->format('Y-m-d') }}</div>
                                                        <div class="text-xs text-gray-500">{{ $record->created_at->format('h:i A') }}</div>
                                                    </td>
                                                    @break
                                                @case('sales')
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="flex items-center">
                                                            <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-green-100 text-green-500">
                                                                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                                                                </svg>
                                                            </div>
                                                            <div class="ml-4">
                                                                <div class="text-sm font-medium text-gray-900">#{{ $record->id }}</div>
                                                                <div class="text-xs text-gray-500">Sale</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium text-gray-900">{{ $record->product->name ?? 'N/A' }}</div>
                                                        <div class="text-xs text-gray-500">Product Name</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium text-gray-900">{{ $record->quantity }}</div>
                                                        <div class="text-xs text-gray-500">Units</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium text-green-600">{{ $record->amount }}</div>
                                                        <div class="text-xs text-gray-500">Amount</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm text-gray-900">{{ $record->created_at->format('Y-m-d') }}</div>
                                                        <div class="text-xs text-gray-500">{{ $record->created_at->format('h:i A') }}</div>
                                                    </td>
                                                    @break
                                                @case('accounts')
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="flex items-center">
                                                            <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
                                                                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                                </svg>
                                                            </div>
                                                            <div class="ml-4">
                                                                <div class="text-sm font-medium text-gray-900">#{{ $record->id }}</div>
                                                                <div class="text-xs text-gray-500">Account</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium text-gray-900">{{ $record->name }}</div>
                                                        <div class="text-xs text-gray-500">Account Name</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium {{ $record->balance >= 0 ? 'text-green-600' : 'text-red-600' }}">
                                                            {{ $record->balance >= 0 ? '+' : '' }}{{ $record->balance }}
                                                        </div>
                                                        <div class="text-xs text-gray-500">Current Balance</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm text-gray-900">{{ $record->created_at->format('Y-m-d') }}</div>
                                                        <div class="text-xs text-gray-500">{{ $record->created_at->format('h:i A') }}</div>
                                                    </td>
                                                    @break
                                                @case('incomes')
                                                @case('outcomes')
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="flex items-center">
                                                            <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full
                                                                {{ $reportType == 'incomes' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500' }}">
                                                                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                                                        d="{{ $reportType == 'incomes'
                                                                            ? 'M12 4v16m8-8H4'
                                                                            : 'M20 12H4' }}"/>
                                                                </svg>
                                                            </div>
                                                            <div class="ml-4">
                                                                <div class="text-sm font-medium text-gray-900">#{{ $record->id }}</div>
                                                                <div class="text-xs text-gray-500">{{ $reportType == 'incomes' ? 'Income' : 'Outcome' }}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium text-gray-900">{{ $record->account->name ?? 'N/A' }}</div>
                                                        <div class="text-xs text-gray-500">Account</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium {{ $reportType == 'incomes' ? 'text-green-600' : 'text-red-600' }}">
                                                            {{ $reportType == 'incomes' ? '+' : '-' }}{{ $record->amount }}
                                                        </div>
                                                        <div class="text-xs text-gray-500">Amount</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm text-gray-900">{{ $record->description }}</div>
                                                        <div class="text-xs text-gray-500">Description</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm text-gray-900">{{ $record->created_at->format('Y-m-d') }}</div>
                                                        <div class="text-xs text-gray-500">{{ $record->created_at->format('h:i A') }}</div>
                                                    </td>
                                                    @break
                                                @default
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="flex items-center">
                                                            <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500">
                                                                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                            </div>
                                                            <div class="ml-4">
                                                                <div class="text-sm font-medium text-gray-900">#{{ $record->id }}</div>
                                                                <div class="text-xs text-gray-500">Record</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm text-gray-900">{{ $record->created_at->format('Y-m-d') }}</div>
                                                        <div class="text-xs text-gray-500">{{ $record->created_at->format('h:i A') }}</div>
                                                    </td>
                                            @endswitch
                                        </tr>
                                    @empty
                                        <tr>
                                            <td colspan="5" class="px-6 py-16 whitespace-nowrap text-center">
                                                <div class="flex flex-col items-center justify-center">
                                                    <div class="rounded-full bg-gray-100 p-6 mb-4">
                                                        <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                        </svg>
                                                    </div>
                                                    <span class="text-lg font-medium text-gray-900 mb-1">No records found</span>
                                                    <p class="text-gray-500 max-w-md mb-6">We couldn't find any records matching your search criteria. Try adjusting your filters or search terms.</p>
                                                    <button wire:click="$set('reportType', 'all')" class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-500 active:bg-indigo-700 focus:outline-none focus:border-indigo-700 focus:ring focus:ring-indigo-300 disabled:opacity-25 transition">
                                                        <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                                        </svg>
                                                        Reset Filters
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>

                        <!-- Pagination -->
                        <div class="bg-white px-6 py-4 border-t border-gray-200 sm:px-6">
                            <div class="flex items-center justify-between">
                                <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                    <div>
                                        <p class="text-sm text-gray-700">
                                            @if($records->total() > 0)
                                                <span class="font-medium">{{ number_format($records->firstItem()) }}</span>
                                                -
                                                <span class="font-medium">{{ number_format($records->lastItem()) }}</span>
                                                of
                                                <span class="font-medium">{{ number_format($records->total()) }}</span>
                                                results
                                            @else
                                                <span class="font-medium text-gray-500">No results found</span>
                                            @endif
                                        </p>
                                    </div>
                                    <div>
                                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            {{ $records->onEachSide(1)->links() }}
                                        </nav>
                                    </div>
                                </div>
                                <div class="flex sm:hidden">
                                    <p class="text-sm text-gray-700">
                                        @if($records->total() > 0)
                                            <span class="font-medium">{{ number_format($records->firstItem()) }}</span>
                                            -
                                            <span class="font-medium">{{ number_format($records->lastItem()) }}</span>
                                            of
                                            <span class="font-medium">{{ number_format($records->total()) }}</span>
                                        @else
                                            <span class="font-medium text-gray-500">No results</span>
                                        @endif
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
