<x-customer-layout>
    <div class="container px-6 mx-auto">
        <!-- Header with gradient background -->
        <div class="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-xl p-8 mb-8 overflow-hidden">
            <div class="absolute inset-0 bg-pattern opacity-10"></div>
            <div class="relative z-10 flex justify-between items-center">
                        <div>
                    <h2 class="text-3xl font-bold text-white">
                        {{ __('My Sales') }}
                    </h2>
                    <p class="mt-2 text-indigo-100 max-w-2xl">
                        {{ __('Manage and track your sales transactions securely in one place.') }}
                    </p>
                        </div>
                <div class="hidden md:block">
                    <lottie-player src="https://assets5.lottiefiles.com/packages/lf20_ystsffqy.json" background="transparent" speed="1" style="width: 120px; height: 120px;" loop autoplay></lottie-player>
                        </div>
                    </div>
                </div>

        @if(session('success'))
        <div class="animate-fade-in-down bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow-lg p-4 mb-6" role="alert">
            <div class="flex items-center">
                <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="font-medium">{{ session('success') }}</p>
            </div>
        </div>
        @endif

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <!-- Status Cards -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 account-card">
                <div class="p-6 flex flex-col items-center text-center">
                    <div class="p-3 rounded-full bg-purple-100 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ __('Total Sales') }}</h3>
                    <p class="text-2xl font-bold text-purple-600">{{ $sales->total() }}</p>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 account-card">
                <div class="p-6 flex flex-col items-center text-center">
                    <div class="p-3 rounded-full bg-green-100 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ __('Completed Sales') }}</h3>
                    <p class="text-2xl font-bold text-green-600">{{ $sales->where('status', 'completed')->count() }}</p>
                            </div>
                        </div>

            <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 account-card lg:col-span-1">
                <div class="p-6 flex flex-col items-center text-center">
                    <div class="p-3 rounded-full bg-amber-100 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ __('Pending Sales') }}</h3>
                    <p class="text-2xl font-bold text-amber-600">{{ $sales->where('status', 'pending')->count() }}</p>
                                </div>
                            </div>
                        </div>

        <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 account-card mb-8">
            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    {{ __('Quick Filters') }}
                </h3>
                <form id="filterForm" action="{{ route('customer.sales.index') }}" method="GET" class="grid gap-4 md:grid-cols-3">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Reference') }}</label>
                        <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                    </svg>
                                </div>
                            <input name="search" value="{{ request('search') }}" class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="{{ __('Search by reference') }}">
                            </div>
                        </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Status') }}</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <select name="status" class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                    <option value="">{{ __('All Statuses') }}</option>
                                    <option value="completed" {{ request('status') == 'completed' ? 'selected' : '' }}>{{ __('Completed') }}</option>
                                    <option value="pending" {{ request('status') == 'pending' ? 'selected' : '' }}>{{ __('Pending') }}</option>
                                    <option value="cancelled" {{ request('status') == 'cancelled' ? 'selected' : '' }}>{{ __('Cancelled') }}</option>
                                </select>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Warehouse Confirmation') }}</label>
                        <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                            <select name="confirmedByWarehouse" class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                    <option value="">{{ __('All') }}</option>
                                    <option value="1" {{ request('confirmedByWarehouse') == '1' ? 'selected' : '' }}>{{ __('Yes') }}</option>
                                    <option value="0" {{ request('confirmedByWarehouse') == '0' ? 'selected' : '' }}>{{ __('No') }}</option>
                                </select>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Shop Confirmation') }}</label>
                        <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            <select name="confirmedByShop" class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                    <option value="">{{ __('All') }}</option>
                                    <option value="1" {{ request('confirmedByShop') == '1' ? 'selected' : '' }}>{{ __('Yes') }}</option>
                                    <option value="0" {{ request('confirmedByShop') == '0' ? 'selected' : '' }}>{{ __('No') }}</option>
                                </select>
                                </div>
                                </div>
                    <div class="flex items-end">
                        <button type="submit" class="w-full px-4 py-2 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white text-sm font-medium rounded-md shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 relative overflow-hidden group">
                            <span class="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                            <span class="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300 animate-tilt"></span>
                            <span class="relative flex items-center justify-center">
                                <svg class="h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                {{ __('Search') }}
                            </span>
                        </button>
                                </div>
                    <div class="flex items-end">
                        <a href="{{ route('customer.sales.index') }}" class="w-full px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white text-sm font-medium rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300">
                            <span class="flex items-center justify-center">
                                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                {{ __('Reset') }}
                            </span>
                        </a>
                                </div>
                </form>
                            </div>
                        </div>

        <div class="bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-xl overflow-hidden mb-8 account-list">
            <div class="px-8 py-5 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 backdrop-blur-sm">
                <h3 class="text-xl font-semibold text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2m-2 0h-2" />
                                </svg>
                    {{ __('Your Sales') }}
                </h3>
            </div>

            <!-- Sales Table -->
            <div class="overflow-x-auto bg-white relative">
                <div class="absolute inset-0 bg-pattern opacity-[0.02] pointer-events-none"></div>
                <table class="min-w-full divide-y divide-gray-200 table-fixed">
                        <thead>
                        <tr class="bg-gradient-to-r from-gray-50 to-gray-100">
                            <th scope="col" class="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {{ __('Reference') }}
                                </th>
                            <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {{ __('Date') }}
                                </th>
                            <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {{ __('Total Amount') }}
                                </th>
                            <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {{ __('Status') }}
                                </th>
                            <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider pr-8">
                                {{ __('Actions') }}
                            </th>
                            </tr>
                        </thead>
                    <tbody class="bg-white divide-y divide-gray-100">
                        @forelse($sales as $sale)
                        <tr class="hover:bg-indigo-50/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md search-result table-row account-row">
                            <td class="px-8 py-5 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="mx-6 flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-base font-medium text-gray-900">{{ $sale->reference }}</div>
                                        <div class="text-sm text-gray-500 mt-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            {{ $sale->customer->name ?? 'N/A' }}
                                        </div>
                                    </div>
                                </div>
                                    </td>
                            <td class="px-6 py-5 whitespace-nowrap text-right">
                                <div class="text-sm text-gray-900 bg-gray-50 py-1.5 px-3 rounded-md inline-flex items-center float-right">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {{ $sale->date->format('Y-m-d') }}
                                </div>
                                    </td>
                            <td class="px-6 py-5 whitespace-nowrap text-right">
                                <div class="text-sm font-mono bg-indigo-50 text-indigo-800 py-1.5 px-3 rounded-md border border-indigo-100 shadow-sm inline-flex items-center float-right">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {{ $sale->total }}
                                </div>
                                    </td>
                            <td class="px-6 py-5 whitespace-nowrap text-right">
                                <div class="flex justify-end">
                                @if($sale->status == 'completed')
                                    <span class="px-3.5 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200 shadow-sm status-badge status-approved">
                                        <span class="flex items-center justify-center h-5 w-5 bg-green-500 rounded-full mr-1.5 shadow-inner">
                                            <svg class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                        {{ __('Completed') }}
                                    </span>
                                @elseif($sale->status == 'cancelled')
                                    <span class="px-3.5 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-red-50 to-pink-50 text-red-800 border border-red-200 shadow-sm status-badge status-cancelled">
                                        <span class="flex items-center justify-center h-5 w-5 bg-red-500 rounded-full mr-1.5 shadow-inner">
                                            <svg class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </span>
                                        {{ __('Cancelled') }}
                                    </span>
                                @else
                                    <span class="px-3.5 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 border border-amber-200 shadow-sm status-badge status-pending">
                                        <span class="flex items-center justify-center h-5 w-5 bg-amber-500 rounded-full mr-1.5 shadow-inner">
                                            <svg class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                        </span>
                                        {{ __('Pending') }}
                                    </span>
                                        @endif
                                </div>
                            </td>
                            <td class="px-6 py-5 whitespace-nowrap text-sm font-medium text-right">
                                <button onclick="showSaleDetails({{ $sale->id }})" class="group relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg overflow-hidden">
                                    <span class="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                    <span class="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300 animate-tilt"></span>
                                    <span class="absolute left-0 inset-y-0 flex items-center pl-3 relative">
                                        <svg class="h-4 w-4 text-white opacity-80 group-hover:opacity-100 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                    </span>
                                    <span class="pl-6 relative">{{ __('View Details') }}</span>
                                            </button>
                                    </td>
                                </tr>
                        @empty
                        <tr>
                            <td colspan="5" class="px-6 py-12 text-center">
                                <div class="flex flex-col items-center bg-indigo-50/50 max-w-lg mx-auto py-10 px-6 rounded-2xl">
                                    <div class="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4 shadow-inner">
                                        <svg class="h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h3 class="mt-2 text-lg font-medium text-gray-900">{{ __('No sales found') }}</h3>
                                    <p class="mt-2 text-sm text-gray-500 text-center max-w-xs">{{ __('No sales transactions match your current filters. Try adjusting your search criteria.') }}</p>
                                    <div class="mt-8">
                                        <a href="{{ route('customer.sales.index') }}" class="group relative inline-flex items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden">
                                            <span class="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                            <span class="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300 animate-tilt"></span>
                                            <span class="relative flex items-center">
                                                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                {{ __('Reset Filters') }}
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        @endforelse
                        </tbody>
                    </table>
                <div class="absolute inset-0 pointer-events-none shadow-[inset_0_-1px_1px_rgba(0,0,0,0.05)]"></div>
            </div>

            <div class="px-8 py-4 border-t border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div class="pagination-container">
                {{ $sales->links() }}
                </div>
            </div>
        </div>
    </div>

    <div id="three-background" class="fixed inset-0 z-[-1] opacity-30"></div>

    <!-- Sale Details Modal -->
    <div id="saleDetailsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden overflow-y-auto h-full w-full z-50 transition-opacity duration-300">
        <div class="relative top-20 mx-auto p-5 border max-w-5xl shadow-xl rounded-lg bg-white transform transition-all duration-300">
            <!-- Modal Header -->
            <div class="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <div class="flex items-center space-x-3">
                    <div class="bg-indigo-100 p-2 rounded-lg">
                        <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900" id="modalTitle">{{ __('Sale Details') }}</h3>
                </div>
                <button onclick="closeSaleDetailsModal()" class="text-gray-400 hover:text-gray-500 transition-colors duration-200">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <!-- Loading State -->
            <div id="loadingState" class="py-12">
                <div class="flex flex-col items-center justify-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                    <p class="text-gray-500">{{ __('Loading sale details...') }}</p>
                </div>
            </div>

            <!-- Sale Details Content -->
            <div id="saleDetailsContent" class="hidden space-y-6">
                <!-- Sale Information -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="flex items-center space-x-3 mb-2">
                            <div class="bg-blue-100 p-2 rounded-lg">
                                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                            </div>
                            <h4 class="text-sm font-medium text-gray-500">{{ __('Reference') }}</h4>
                        </div>
                        <p class="text-lg font-semibold text-gray-900" id="sale-reference"></p>
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
                        <p class="text-lg font-semibold text-gray-900" id="sale-date"></p>
                    </div>

                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="flex items-center space-x-3 mb-2">
                            <div class="bg-purple-100 p-2 rounded-lg">
                                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                            </div>
                            <h4 class="text-sm font-medium text-gray-500">{{ __('Customer') }}</h4>
                        </div>
                        <p class="text-lg font-semibold text-gray-900" id="sale-customer"></p>
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
                        <div id="sale-status-badge">
                            <!-- Will be filled by JavaScript -->
                        </div>
                    </div>

                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="flex items-center space-x-3 mb-2">
                            <div class="bg-red-100 p-2 rounded-lg">
                                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                                </svg>
                            </div>
                            <h4 class="text-sm font-medium text-gray-500">{{ __('Total Amount') }}</h4>
                        </div>
                        <p class="text-lg font-semibold text-gray-900" id="sale-amount"></p>
                </div>

                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="flex items-center space-x-3 mb-2">
                            <div class="bg-indigo-100 p-2 rounded-lg">
                                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                            </div>
                            <h4 class="text-sm font-medium text-gray-500">{{ __('Warehouse') }}</h4>
                                            </div>
                        <p class="text-lg font-semibold text-gray-900" id="sale-warehouse"></p>
                                            </div>
                </div>

                <!-- Confirmation Status -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="flex items-center space-x-3 mb-2">
                            <div class="bg-blue-100 p-2 rounded-lg">
                                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </div>
                            <h4 class="text-sm font-medium text-gray-500">{{ __('Warehouse Confirmation') }}</h4>
                        </div>
                        <div id="warehouse-confirmation">
                            <!-- Will be filled by JavaScript -->
                        </div>
                    </div>

                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="flex items-center space-x-3 mb-2">
                            <div class="bg-blue-100 p-2 rounded-lg">
                                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </div>
                            <h4 class="text-sm font-medium text-gray-500">{{ __('Shop Confirmation') }}</h4>
                        </div>
                        <div id="shop-confirmation">
                            <!-- Will be filled by JavaScript -->
                        </div>
                    </div>
                </div>

                <!-- Sale Items -->
                <div class="mt-6">
                    <h4 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <svg class="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {{ __('Sale Items') }}
                    </h4>
                    <div class="bg-white shadow overflow-x-auto rounded-lg">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Product') }}</th>
                                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Quantity') }}</th>
                                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Unit Price') }}</th>
                                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Subtotal') }}</th>
                                    </tr>
                                </thead>
                            <tbody id="sale-items-body" class="bg-white divide-y divide-gray-200">
                                <!-- Will be filled by JavaScript -->
                                </tbody>
                            <tfoot class="bg-gray-50">
                                <tr>
                                    <td colspan="3" class="px-6 py-4 text-right text-sm font-medium text-gray-900">{{ __('Total:') }}</td>
                                    <td class="px-6 py-4 text-right text-base font-bold text-gray-900" id="sale-total"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                <!-- Notes -->
                <div class="bg-gray-50 p-4 rounded-lg" id="notes-section">
                    <div class="flex items-center space-x-3 mb-2">
                        <div class="bg-yellow-100 p-2 rounded-lg">
                            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </div>
                        <h4 class="text-sm font-medium text-gray-500">{{ __('Notes') }}</h4>
                    </div>
                    <p class="text-gray-700 mt-2" id="sale-notes"></p>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="mt-6 flex justify-end pt-4 border-t border-gray-200">
                <button onclick="closeSaleDetailsModal()" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {{ __('Close') }}
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
        <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>
        <script>
            // Function to show sale details modal
            function showSaleDetails(saleId) {
                // Show the modal
                document.getElementById('saleDetailsModal').classList.remove('hidden');
                document.getElementById('loadingState').classList.remove('hidden');
                document.getElementById('saleDetailsContent').classList.add('hidden');

                // Fetch sale details
                fetch(`/customer/sales/${saleId}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Hide loading state
                        document.getElementById('loadingState').classList.add('hidden');
                        document.getElementById('saleDetailsContent').classList.remove('hidden');

                        // Fill in sale details
                        document.getElementById('sale-reference').textContent = data.reference;
                        document.getElementById('sale-date').textContent = data.date;
                        document.getElementById('sale-customer').textContent = data.customer_name;
                        document.getElementById('sale-amount').textContent = data.total;
                        document.getElementById('sale-warehouse').textContent = data.warehouse_name;
                        document.getElementById('sale-total').textContent = data.total;

                        // Status badge
                        let statusBadge = '';
                        if (data.status === 'completed') {
                            statusBadge = `
                                <span class="px-3.5 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200 shadow-sm">
                                    <span class="flex items-center justify-center h-5 w-5 bg-green-500 rounded-full mr-1.5 shadow-inner">
                                        <svg class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                    Completed
                                </span>
                            `;
                        } else if (data.status === 'cancelled') {
                            statusBadge = `
                                <span class="px-3.5 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-red-50 to-pink-50 text-red-800 border border-red-200 shadow-sm">
                                    <span class="flex items-center justify-center h-5 w-5 bg-red-500 rounded-full mr-1.5 shadow-inner">
                                        <svg class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </span>
                                    Cancelled
                                </span>
                            `;
                        } else {
                            statusBadge = `
                                <span class="px-3.5 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 border border-amber-200 shadow-sm">
                                    <span class="flex items-center justify-center h-5 w-5 bg-amber-500 rounded-full mr-1.5 shadow-inner">
                                        <svg class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </span>
                                    Pending
                                </span>
                            `;
                        }
                        document.getElementById('sale-status-badge').innerHTML = statusBadge;

                        // Warehouse confirmation
                        let warehouseConfirmation = data.confirmed_by_warehouse ?
                            `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <svg class="mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                                    <circle cx="4" cy="4" r="3" />
                                </svg>
                                Confirmed
                            </span>` :
                            `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <svg class="mr-1.5 h-2 w-2 text-yellow-400" fill="currentColor" viewBox="0 0 8 8">
                                    <circle cx="4" cy="4" r="3" />
                                </svg>
                                Pending
                            </span>`;
                        document.getElementById('warehouse-confirmation').innerHTML = warehouseConfirmation;

                        // Shop confirmation
                        let shopConfirmation = data.confirmed_by_shop ?
                            `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <svg class="mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                                    <circle cx="4" cy="4" r="3" />
                                </svg>
                                Confirmed
                            </span>` :
                            `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <svg class="mr-1.5 h-2 w-2 text-yellow-400" fill="currentColor" viewBox="0 0 8 8">
                                    <circle cx="4" cy="4" r="3" />
                                </svg>
                                Pending
                            </span>`;
                        document.getElementById('shop-confirmation').innerHTML = shopConfirmation;

                        // Notes
                        const notesSection = document.getElementById('notes-section');
                        if (data.notes && data.notes.trim() !== '') {
                            document.getElementById('sale-notes').textContent = data.notes;
                            notesSection.classList.remove('hidden');
                        } else {
                            notesSection.classList.add('hidden');
                        }

                        // Sale items
                        const itemsBody = document.getElementById('sale-items-body');
                        itemsBody.innerHTML = '';

                        if (data.items && data.items.length > 0) {
                            data.items.forEach(item => {
                                const row = document.createElement('tr');
                                row.innerHTML = `
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="text-sm font-medium text-gray-900">${item.product_name}</div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">${item.quantity}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">${item.unit_price}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">${item.subtotal}</td>
                                `;
                                itemsBody.appendChild(row);
                            });
                        } else {
                            const row = document.createElement('tr');
                            row.innerHTML = `
                                <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                                    No items found for this sale.
                                </td>
                            `;
                            itemsBody.appendChild(row);
                        }
                    })
                    .catch(error => {
                        // Show error message
                        document.getElementById('loadingState').classList.add('hidden');
                        document.getElementById('saleDetailsContent').innerHTML = `
                            <div class="py-8 text-center">
                                <div class="bg-red-50 p-4 rounded-lg inline-block mb-4">
                                    <svg class="h-10 w-10 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 class="text-lg font-medium text-gray-900">Error loading sale details</h3>
                                <p class="mt-2 text-sm text-gray-500">Please try again later or contact support.</p>
                            </div>
                        `;
                        document.getElementById('saleDetailsContent').classList.remove('hidden');
                        console.error('Error fetching sale details:', error);
                    });
            }

            // Function to close sale details modal
            function closeSaleDetailsModal() {
                const modal = document.getElementById('saleDetailsModal');

                // Add fade-out animation
                modal.classList.add('opacity-0');

                // Hide modal after animation completes
                setTimeout(() => {
                    modal.classList.add('hidden');
                    modal.classList.remove('opacity-0');
                }, 300);
            }

            document.addEventListener('DOMContentLoaded', function() {
                // Initialize animations for the account cards
                anime({
                    targets: '.account-card',
                    opacity: [0, 1],
                    translateY: [20, 0],
                    delay: anime.stagger(100),
                    easing: 'easeOutExpo'
                });

                // Initialize animations for the account list
                anime({
                    targets: '.account-list',
                    opacity: [0, 1],
                    translateY: [30, 0],
                    delay: 300,
                    easing: 'easeOutExpo'
                });

                // Enhanced table row interactions
                document.querySelectorAll('.account-row').forEach(row => {
                    row.addEventListener('mouseenter', () => {
                        anime({
                            targets: row.querySelectorAll('td'),
                            backgroundColor: 'rgba(238, 242, 255, 0.5)',
                            duration: 300,
                            easing: 'easeOutCubic'
                    });

                        // Animate the bank icon on hover
                        const bankIcon = row.querySelector('.flex-shrink-0.h-12.w-12 svg');
                        if (bankIcon) {
                        anime({
                                targets: bankIcon,
                                rotate: ['0deg', '5deg'],
                                scale: 1.1,
                                duration: 400,
                                easing: 'easeOutElastic(1, .8)'
                            });
                        }
                    });

                    row.addEventListener('mouseleave', () => {
                        anime({
                            targets: row.querySelectorAll('td'),
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            duration: 300,
                            easing: 'easeOutCubic'
                    });

                        // Reset the bank icon animation
                        const bankIcon = row.querySelector('.flex-shrink-0.h-12.w-12 svg');
                        if (bankIcon) {
                        anime({
                                targets: bankIcon,
                                rotate: '0deg',
                            scale: 1,
                                duration: 400,
                            easing: 'easeOutElastic(1, .8)'
                        });
                        }
                    });
                });

                // Add hover effect to buttons
                document.querySelectorAll('.animate-button').forEach(button => {
                    button.addEventListener('mouseenter', () => {
                    anime({
                            targets: button,
                        scale: 1.05,
                        duration: 300,
                            easing: 'easeOutCubic'
                    });
                });

                    button.addEventListener('mouseleave', () => {
                    anime({
                            targets: button,
                        scale: 1,
                        duration: 300,
                            easing: 'easeOutCubic'
                    });
                });
            });
            });
        </script>

        <style>
            @keyframes fade-in-down {
                0% { opacity: 0; transform: translateY(-10px); }
                100% { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-down {
                animation: fade-in-down 0.5s ease-out;
            }
            @keyframes tilt {
                0%, 100% { transform: rotate(-1deg); }
                50% { transform: rotate(1deg); }
            }
            .animate-tilt {
                animation: tilt 10s infinite linear;
            }
            @keyframes shine {
                0% { background-position: -100% 0; }
                100% { background-position: 200% 0; }
            }
            .table-row {
                animation: fadeIn 0.6s ease-out backwards;
            }
            .table-row:nth-child(1) { animation-delay: 0.1s; }
            .table-row:nth-child(2) { animation-delay: 0.2s; }
            .table-row:nth-child(3) { animation-delay: 0.3s; }
            .table-row:nth-child(4) { animation-delay: 0.4s; }
            .table-row:nth-child(5) { animation-delay: 0.5s; }
            .table-row:nth-child(6) { animation-delay: 0.6s; }
            .table-row:nth-child(7) { animation-delay: 0.7s; }
            .table-row:nth-child(8) { animation-delay: 0.8s; }
            .table-row:nth-child(9) { animation-delay: 0.9s; }
            .table-row:nth-child(10) { animation-delay: 1.0s; }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .pagination-container nav > div:first-child {
                @apply hidden;
            }

            .pagination-container nav > div:last-child span:not(.text-gray-500),
            .pagination-container nav > div:last-child a {
                @apply px-3 py-1 mx-1 rounded-md border-0 shadow-sm;
            }

            .pagination-container nav > div:last-child span.text-gray-500 {
                @apply px-3 py-1 mx-1;
            }

            .pagination-container nav > div:last-child span:not(.text-gray-500) {
                @apply bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium;
            }

            .pagination-container nav > div:last-child a {
                @apply bg-white hover:bg-gray-50 transition-colors duration-150;
            }

            .bg-pattern {
                background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            }

            .bank-icon-pulse {
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% {
                    transform: scale(0.95);
                    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.1);
                }

                70% {
                    transform: scale(1);
                    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
                }

                100% {
                    transform: scale(0.95);
                    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
                }
            }

            /* Table animations */
            .account-row {
                opacity: 0;
                transform: translateY(20px);
                animation: fadeInUp 0.6s ease forwards;
            }

            @keyframes fadeInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Account row staggered animation */
            .account-row:nth-child(1) { animation-delay: 0.1s; }
            .account-row:nth-child(2) { animation-delay: 0.2s; }
            .account-row:nth-child(3) { animation-delay: 0.3s; }
            .account-row:nth-child(4) { animation-delay: 0.4s; }
            .account-row:nth-child(5) { animation-delay: 0.5s; }
            .account-row:nth-child(6) { animation-delay: 0.6s; }
            .account-row:nth-child(7) { animation-delay: 0.7s; }
            .account-row:nth-child(8) { animation-delay: 0.8s; }
            .account-row:nth-child(9) { animation-delay: 0.9s; }
            .account-row:nth-child(10) { animation-delay: 1.0s; }

            /* Cell content animations */
            .account-row td {
                transition: all 0.3s ease;
            }

            /* Status badge animations */
            .status-badge {
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                position: relative;
                overflow: hidden;
            }

            .status-badge::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
                transform: translateX(-100%);
            }

            .account-row:hover .status-badge::after {
                animation: shimmer 1.5s infinite;
            }

            .account-row:hover .status-approved {
                box-shadow: 0 0 15px rgba(16, 185, 129, 0.15);
                transform: translateY(-2px) scale(1.05);
            }

            .account-row:hover .status-pending {
                box-shadow: 0 0 15px rgba(245, 158, 11, 0.15);
                transform: translateY(-2px) scale(1.05);
            }

            .account-row:hover .status-cancelled {
                box-shadow: 0 0 15px rgba(239, 68, 68, 0.15);
                transform: translateY(-2px) scale(1.05);
            }

            @keyframes shimmer {
                0% {
                    transform: translateX(-100%);
                }
                100% {
                    transform: translateX(100%);
                }
            }

            /* View details button animation */
            .account-row .inline-flex.items-center {
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }

            .account-row:hover .inline-flex.items-center {
                transform: translateY(-3px);
                box-shadow: 0 10px 20px -10px rgba(124, 58, 237, 0.3);
            }
        </style>
    @endpush
</x-customer-layout>
