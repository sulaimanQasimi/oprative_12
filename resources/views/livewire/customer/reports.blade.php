<div>
    <!-- Three.js Background Container -->
    <div id="three-background" class="fixed inset-0 -z-10"></div>

    <div dir="rtl" x-data="{
        showFilters: false,
        showTable: true,
        showExportButtons: false,
        init() {
            // Wait for anime to be available
            const checkAnime = () => {
                if (window.anime) {
                    // Initialize animations when component loads
                    this.$nextTick(() => {
                        // Animate header
                        window.anime({
                            targets: '.header-section',
                            translateY: [-50, 0],
                            opacity: [0, 1],
                            duration: 1000,
                            easing: 'easeOutElastic(1, .8)'
                        });

                        // Animate filters card
                        window.anime({
                            targets: '.filters-card',
                            translateY: [30, 0],
                            opacity: [0, 1],
                            duration: 800,
                            delay: 300,
                            easing: 'easeOutCubic'
                        });

                        // Animate table
                        window.anime({
                            targets: '.table-container',
                            translateY: [30, 0],
                            opacity: [0, 1],
                            duration: 800,
                            delay: 500,
                            easing: 'easeOutCubic'
                        });

                        // Animate table rows
                        window.anime({
                            targets: '.table-row',
                            translateX: [-30, 0],
                            opacity: [0, 1],
                            duration: 600,
                            delay: window.anime.stagger(100),
                            easing: 'easeOutCubic'
                        });

                        // Show export buttons with delay
                        setTimeout(() => {
                            this.showExportButtons = true;
                        }, 800);
                    });
                } else {
                    // If anime is not available yet, check again in 100ms
                    setTimeout(checkAnime, 100);
                }
            };

            // Start checking for anime availability
            checkAnime();
        }
    }">
        <x-customer-navbar />

        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div class="px-4 py-6 sm:px-0">
                <!-- Header Section with Gradient Background -->
                <div class="header-section bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white rounded-t-lg">
                    <div class="flex flex-col md:flex-row justify-between items-center">
                        <h2 class="text-2xl font-bold mb-4 md:mb-0 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            @lang('Reports Dashboard')
                        </h2>
                        <div class="flex space-x-2">
                            <button wire:click="exportExcel"
                                    x-show="showExportButtons"
                                    x-cloak
                                    class="animate-button flex items-center px-4 py-2 bg-white text-indigo-700 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition duration-150 ease-in-out">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                @lang('Export Excel')
                            </button>
                            <button wire:click="exportPDF"
                                    x-show="showExportButtons"
                                    x-cloak
                                    class="animate-button flex items-center px-4 py-2 bg-white text-indigo-700 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition duration-150 ease-in-out">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                @lang('Export PDF')
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Filters Card -->
                <div class="filters-card bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div class="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-medium text-gray-800 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                @lang('Filter Reports')
                            </h3>
                            <button @click="showFilters = !showFilters"
                                    class="text-indigo-600 hover:text-indigo-800 focus:outline-none transition-transform duration-200"
                                    :class="{'rotate-180': showFilters}">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="p-6 transition-all duration-300 ease-in-out"
                         x-show="showFilters"
                         x-cloak>
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <!-- Report Type Filter -->
                            <div>
                                <label for="reportType" class="block text-sm font-medium text-gray-700 mb-1">@lang('Report Type')</label>
                                <select wire:model.live="reportType"
                                        id="reportType"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                    <option value="all">@lang('All Reports')</option>
                                    <option value="market_orders">@lang('Market Orders')</option>
                                    <option value="stocks">@lang('Stocks')</option>
                                    <option value="sales">@lang('Sales')</option>
                                    <option value="accounts">@lang('Accounts')</option>
                                    <option value="incomes">@lang('Incomes')</option>
                                    <option value="outcomes">@lang('Outcomes')</option>
                                </select>
                            </div>

                            <!-- Date From Filter -->
                            <div>
                                <label for="dateFrom" class="block text-sm font-medium text-gray-700 mb-1">@lang('Date From')</label>
                                <input type="date"
                                       wire:model.live="dateFrom"
                                       id="dateFrom"
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            </div>

                            <!-- Date To Filter -->
                            <div>
                                <label for="dateTo" class="block text-sm font-medium text-gray-700 mb-1">@lang('Date To')</label>
                                <input type="date"
                                       wire:model.live="dateTo"
                                       id="dateTo"
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            </div>

                            <!-- Search Filter -->
                            <div>
                                <label for="searchTerm" class="block text-sm font-medium text-gray-700 mb-1">@lang('Search')</label>
                                <div class="relative rounded-md shadow-sm">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <input type="text"
                                           wire:model.live.debounce.300ms="searchTerm"
                                           id="searchTerm"
                                           class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                           placeholder="@lang('Search...')">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Data Table Card -->
                <div class="table-container bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mt-6">
                    <!-- Results Summary -->
                    <div class="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                        <h3 class="text-sm font-medium text-gray-700">@lang('Results')</h3>
                        <div class="flex items-center space-x-2">
                            <label for="perPage" class="text-sm text-gray-600">@lang('Show')</label>
                            <select wire:model.live="perPage"
                                    id="perPage"
                                    class="text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                            <span class="text-sm text-gray-600">@lang('entries')</span>
                        </div>
                    </div>

                    <div class="overflow-x-auto relative">
                        <div wire:loading class="absolute inset-0 bg-white bg-opacity-75 z-10 flex items-center justify-center">
                            <div class="flex items-center justify-center">
                                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                                <span class="ml-2 text-indigo-600 font-medium">@lang('Loading...')</span>
                            </div>
                        </div>
                        <table class="min-w-full divide-y divide-gray-200 table-fixed">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div class="flex items-center justify-end">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                            </svg>
                                            @lang('ID')
                                        </div>
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div class="flex items-center justify-end">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            @lang('Date')
                                        </div>
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div class="flex items-center justify-end">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            @lang('Amount')
                                        </div>
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div class="flex items-center justify-end">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            @lang('Status')
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                @forelse($records as $record)
                                    <tr class="table-row hover:bg-gray-50 transition-colors duration-150">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div class="flex items-center justify-end">
                                                <span class="font-medium">#{{ $record->id }}</span>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div class="flex items-center justify-end">
                                                <span>{{ $record->created_at->format('Y-m-d H:i') }}</span>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div class="flex items-center justify-end">
                                                <span class="font-medium">{{ number_format($record->amount ?? $record->total_amount ?? 0, 2) }}</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm">
                                            <div class="flex items-center justify-end">
                                                @if($record->status === 'completed' || $record->status === 'success')
                                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        {{ $record->status ?? 'N/A' }}
                                                    </span>
                                                @elseif($record->status === 'pending')
                                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {{ $record->status ?? 'N/A' }}
                                                    </span>
                                                @elseif($record->status === 'failed' || $record->status === 'error')
                                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        {{ $record->status ?? 'N/A' }}
                                                    </span>
                                                @else
                                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {{ $record->status ?? 'N/A' }}
                                                    </span>
                                                @endif
                                            </div>
                                        </td>
                                    </tr>
                                @empty
                                    <tr class="table-row">
                                        <td colspan="4" class="px-6 py-16 whitespace-nowrap text-center">
                                            <div class="flex flex-col items-center justify-center">
                                                <div class="rounded-full bg-gray-100 p-6 mb-4">
                                                    <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <span class="text-lg font-medium text-gray-900 mb-1">@lang('No records found')</span>
                                                <p class="text-gray-500 max-w-md mb-6">@lang('We couldn\'t find any records matching your search criteria. Try adjusting your filters or search terms.')</p>
                                                <button wire:click="$set('reportType', 'all')"
                                                        class="animate-button inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-500 active:bg-indigo-700 focus:outline-none focus:border-indigo-700 focus:ring focus:ring-indigo-300 disabled:opacity-25 transition">
                                                    <svg class="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                                    </svg>
                                                    @lang('Reset Filters')
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
                                            @lang('of')
                                            <span class="font-medium">{{ number_format($records->total()) }}</span>
                                        @else
                                            <span class="font-medium text-gray-500">@lang('No results found')</span>
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
                                        @lang('of')
                                        <span class="font-medium">{{ number_format($records->total()) }}</span>
                                    @else
                                        <span class="font-medium text-gray-500">@lang('No results')</span>
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
