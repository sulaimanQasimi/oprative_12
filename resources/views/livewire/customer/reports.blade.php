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
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        @switch($reportType)
                                            @case('market_orders')
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
                                                <th wire:click="sortBy('total_amount')" class="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                                    <div class="flex items-center">
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
                                                <th wire:click="sortBy('status')" class="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                                    <div class="flex items-center">
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
                                                        <div class="text-sm font-medium text-gray-900">#{{ $record->id }}</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm text-gray-900">{{ $record->created_at->format('Y-m-d') }}</div>
                                                        <div class="text-xs text-gray-500">{{ $record->created_at->format('h:i A') }}</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium text-gray-900">{{ $record->total_amount }}</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                            {{ $record->status == 'completed' ? 'bg-green-100 text-green-800' :
                                                              ($record->status == 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                              'bg-gray-100 text-gray-800') }}">
                                                            {{ ucfirst($record->status) }}
                                                        </span>
                                                    </td>
                                                    @break
                                                @case('stocks')
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium text-gray-900">#{{ $record->id }}</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium text-gray-900">{{ $record->product->name ?? 'N/A' }}</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium text-gray-900">{{ $record->quantity }}</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm text-gray-900">{{ $record->created_at->format('Y-m-d') }}</div>
                                                        <div class="text-xs text-gray-500">{{ $record->created_at->format('h:i A') }}</div>
                                                    </td>
                                                    @break
                                                @case('sales')
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium text-gray-900">#{{ $record->id }}</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium text-gray-900">{{ $record->product->name ?? 'N/A' }}</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium text-gray-900">{{ $record->quantity }}</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium text-gray-900">{{ $record->amount }}</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm text-gray-900">{{ $record->created_at->format('Y-m-d') }}</div>
                                                        <div class="text-xs text-gray-500">{{ $record->created_at->format('h:i A') }}</div>
                                                    </td>
                                                    @break
                                                @case('accounts')
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium text-gray-900">#{{ $record->id }}</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium text-gray-900">{{ $record->name }}</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium {{ $record->balance >= 0 ? 'text-green-600' : 'text-red-600' }}">
                                                            {{ $record->balance }}
                                                        </div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm text-gray-900">{{ $record->created_at->format('Y-m-d') }}</div>
                                                        <div class="text-xs text-gray-500">{{ $record->created_at->format('h:i A') }}</div>
                                                    </td>
                                                    @break
                                                @case('incomes')
                                                @case('outcomes')
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium text-gray-900">#{{ $record->id }}</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium text-gray-900">{{ $record->account->name ?? 'N/A' }}</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium {{ $reportType == 'incomes' ? 'text-green-600' : 'text-red-600' }}">
                                                            {{ $record->amount }}
                                                        </div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm text-gray-900">{{ $record->description }}</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm text-gray-900">{{ $record->created_at->format('Y-m-d') }}</div>
                                                        <div class="text-xs text-gray-500">{{ $record->created_at->format('h:i A') }}</div>
                                                    </td>
                                                    @break
                                                @default
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium text-gray-900">#{{ $record->id }}</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm text-gray-900">{{ $record->created_at->format('Y-m-d') }}</div>
                                                        <div class="text-xs text-gray-500">{{ $record->created_at->format('h:i A') }}</div>
                                                    </td>
                                            @endswitch
                                        </tr>
                                    @empty
                                        <tr>
                                            <td colspan="5" class="px-6 py-10 whitespace-nowrap text-sm text-gray-500 text-center bg-gray-50">
                                                <div class="flex flex-col items-center justify-center">
                                                    <svg class="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                    </svg>
                                                    <span class="mt-2 font-medium">No records found</span>
                                                    <p class="text-gray-500 mt-1">Try adjusting your search or filter to find what you're looking for.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>

                        <!-- Pagination -->
                        <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                            <div class="flex items-center justify-between">
                                <div class="text-sm text-gray-700">
                                    @if($records->total() > 0)
                                        Showing <span class="font-medium">{{ $records->firstItem() }}</span> to <span class="font-medium">{{ $records->lastItem() }}</span> of <span class="font-medium">{{ $records->total() }}</span> results
                                    @else
                                        No results found
                                    @endif
                                </div>
                                <div>
                                    {{ $records->links() }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
