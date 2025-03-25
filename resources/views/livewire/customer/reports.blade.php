<!-- Three.js Background Container -->
<div id="three-background" class="fixed inset-0 -z-10"></div>

<div dir="rtl" x-data="{
    showFilters: false,
    showTable: true,
    init() {
        // Initialize animations when component loads
        this.$nextTick(() => {
            // Animate header
            anime({
                targets: '.header-section',
                translateY: [-50, 0],
                opacity: [0, 1],
                duration: 1000,
                easing: 'easeOutElastic(1, .8)'
            });

            // Animate filters card
            anime({
                targets: '.filters-card',
                translateY: [30, 0],
                opacity: [0, 1],
                duration: 800,
                delay: 300,
                easing: 'easeOutCubic'
            });

            // Animate table
            anime({
                targets: '.table-container',
                translateY: [30, 0],
                opacity: [0, 1],
                duration: 800,
                delay: 500,
                easing: 'easeOutCubic'
            });

            // Animate table rows
            anime({
                targets: '.table-row',
                translateX: [-30, 0],
                opacity: [0, 1],
                duration: 600,
                delay: anime.stagger(100),
                easing: 'easeOutCubic'
            });
        });
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
                                class="animate-button flex items-center px-4 py-2 bg-white text-indigo-700 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition duration-150 ease-in-out">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            @lang('Export Excel')
                        </button>
                        <button wire:click="exportPDF"
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
                                class="text-indigo-600 hover:text-indigo-800 focus:outline-none">
                            <svg class="w-5 h-5 transform transition-transform duration-200"
                                 :class="{'rotate-180': showFilters}"
                                 fill="none"
                                 stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="p-6"
                     x-show="showFilters"
                     x-transition:enter="transition ease-out duration-300"
                     x-transition:enter-start="opacity-0 transform -translate-y-2"
                     x-transition:enter-end="opacity-100 transform translate-y-0"
                     x-transition:leave="transition ease-in duration-200"
                     x-transition:leave-start="opacity-100 transform translate-y-0"
                     x-transition:leave-end="opacity-0 transform -translate-y-2">
                    <!-- Existing filters content -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <!-- ... existing filter fields ... -->
                    </div>
                </div>
            </div>

            <!-- Data Table Card -->
            <div class="table-container bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
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
                        <!-- ... existing table header ... -->
                        <tbody class="bg-white divide-y divide-gray-200">
                            @forelse($records as $record)
                                <tr class="table-row hover:bg-gray-50 transition-colors duration-150">
                                    <!-- ... existing table row content ... -->
                                </tr>
                            @empty
                                <tr class="table-row">
                                    <td colspan="5" class="px-6 py-16 whitespace-nowrap text-center">
                                        <div class="flex flex-col items-center justify-center">
                                            <div class="rounded-full bg-gray-100 p-6 mb-4">
                                                <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
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
