<div class="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30" dir="rtl">
    <x-customer-navbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header Section with Animated Background -->
        <div class="relative mb-8">
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-pink-600/90 rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
                <div class="absolute inset-0 bg-grid-white/10 animate-pulse"></div>
            </div>
            <div class="relative p-8">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <h2 class="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            @lang('Sales History')
                        </h2>
                        <p class="text-indigo-100 text-lg">@lang('Track and manage your sales transactions')</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filters Section with Glassmorphism -->
        <div class="bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl p-6 mb-8 border border-white/20">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="relative group">
                    <label for="search" class="block text-sm font-medium text-gray-700 mb-2">@lang('Search')</label>
                    <div class="relative">
                        <input type="text" wire:model.live.debounce.300ms="search" id="search"
                            class="w-full px-4 py-3 pr-12 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:border-indigo-300"
                            placeholder="@lang('Search by reference...')">
                        <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <div wire:loading wire:target="search" class="mr-2">
                                <div class="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <svg class="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="relative group">
                    <label for="dateFrom" class="block text-sm font-medium text-gray-700 mb-2">@lang('From Date')</label>
                    <input type="date" wire:model.live="dateFrom" id="dateFrom"
                        class="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:border-indigo-300">
                </div>

                <div class="relative group">
                    <label for="dateTo" class="block text-sm font-medium text-gray-700 mb-2">@lang('To Date')</label>
                    <input type="date" wire:model.live="dateTo" id="dateTo"
                        class="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:border-indigo-300">
                </div>

                <div class="relative group">
                    <label for="status" class="block text-sm font-medium text-gray-700 mb-2">@lang('Status')</label>
                    <select wire:model.live="status" id="status"
                        class="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:border-indigo-300">
                        <option value="">@lang('All Status')</option>
                        <option value="completed">@lang('Completed')</option>
                        <option value="pending">@lang('Pending')</option>
                        <option value="cancelled">@lang('Cancelled')</option>
                    </select>
                </div>

                <div class="relative group">
                    <label for="confirmedByWarehouse" class="block text-sm font-medium text-gray-700 mb-2">@lang('Warehouse Confirmation')</label>
                    <select wire:model.live="confirmedByWarehouse" id="confirmedByWarehouse"
                        class="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:border-indigo-300">
                        <option value="">@lang('All')</option>
                        <option value="1">@lang('Confirmed')</option>
                        <option value="0">@lang('Not Confirmed')</option>
                    </select>
                </div>

                <div class="relative group">
                    <label for="confirmedByShop" class="block text-sm font-medium text-gray-700 mb-2">@lang('Shop Confirmation')</label>
                    <select wire:model.live="confirmedByShop" id="confirmedByShop"
                        class="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:border-indigo-300">
                        <option value="">@lang('All')</option>
                        <option value="1">@lang('Confirmed')</option>
                        <option value="0">@lang('Not Confirmed')</option>
                    </select>
                </div>

                <div class="relative group">
                    <label for="movedFromWarehouse" class="block text-sm font-medium text-gray-700 mb-2">@lang('Moved from Warehouse')</label>
                    <select wire:model.live="movedFromWarehouse" id="movedFromWarehouse"
                        class="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:border-indigo-300">
                        <option value="">@lang('All')</option>
                        <option value="1">@lang('Yes')</option>
                        <option value="0">@lang('No')</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Sales Table with Enhanced Design -->
        <div class="bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl overflow-hidden border border-white/20">
            <div class="overflow-x-auto relative">
                <!-- Loading Overlay -->
                <div wire:loading wire:target="search, dateFrom, dateTo, status, confirmedByWarehouse, confirmedByShop, movedFromWarehouse"
                    class="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div class="flex flex-col items-center gap-4">
                        <div class="relative">
                            <div class="w-12 h-12 border-4 border-indigo-200 rounded-full"></div>
                            <div class="w-12 h-12 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                        </div>
                        <p class="text-indigo-600 font-medium">@lang('Loading...')</p>
                    </div>
                </div>

                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50/50">
                        <tr>
                            <th scope="col" class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors duration-200"
                                wire:click="sortBy('reference')">
                                <div class="flex items-center justify-end">
                                    @lang('Reference')
                                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9M3 12h5M3 16h7M3 20h11" />
                                    </svg>
                                </div>
                            </th>
                            <th scope="col" class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors duration-200"
                                wire:click="sortBy('date')">
                                <div class="flex items-center justify-end">
                                    @lang('Date')
                                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9M3 12h5M3 16h7M3 20h11" />
                                    </svg>
                                </div>
                            </th>
                            <th scope="col" class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                @lang('Total Amount')
                            </th>
                            <th scope="col" class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                @lang('Status')
                            </th>
                            <th scope="col" class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                @lang('Shop Confirmation')
                            </th>
                            <th scope="col" class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                @lang('Warehouse Confirmation')
                            </th>
                            <th scope="col" class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                @lang('Moved from Warehouse')
                            </th>
                            <th scope="col" class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                @lang('Actions')
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        @forelse($sales as $sale)
                            <tr class="hover:bg-gray-50/50 transition-colors duration-200">
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
                                    <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full {{ $this->getStatusBadgeClass($sale->status) }}">
                                        {{ ucfirst($sale->status) }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center justify-end">
                                        @if($sale->confirmed_by_shop)
                                            <div class="relative group">
                                                <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
                                                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                </div>
                                                <div class="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg py-1 px-2">
                                                    @lang('Confirmed by Shop')
                                                </div>
                                            </div>
                                        @else
                                            <div class="relative group">
                                                <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                                    <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                                    </svg>
                                                </div>
                                                <div class="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg py-1 px-2">
                                                    @lang('Not Confirmed by Shop')
                                                </div>
                                            </div>
                                        @endif
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center justify-end">
                                        @if($sale->confirmed_by_warehouse)
                                            <div class="relative group">
                                                <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
                                                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                </div>
                                                <div class="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg py-1 px-2">
                                                    @lang('Confirmed by Warehouse')
                                                </div>
                                            </div>
                                        @else
                                            <div class="relative group">
                                                <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                                    <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                                    </svg>
                                                </div>
                                                <div class="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg py-1 px-2">
                                                    @lang('Not Confirmed by Warehouse')
                                                </div>
                                            </div>
                                        @endif
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center justify-end">
                                        @if($sale->moved_from_warehouse)
                                            <div class="relative group">
                                                <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
                                                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                </div>
                                                <div class="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg py-1 px-2">
                                                    @lang('Moved from Warehouse')
                                                </div>
                                            </div>
                                        @else
                                            <div class="relative group">
                                                <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                                    <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                                    </svg>
                                                </div>
                                                <div class="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg py-1 px-2">
                                                    @lang('Not Moved from Warehouse')
                                                </div>
                                            </div>
                                        @endif
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div class="flex space-x-2 space-x-reverse">
                                        <button wire:click="showSaleDetails({{ $sale->id }})"
                                            class="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-all duration-200">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                        @if($sale->due_amount > 0)
                                            <button wire:click="showPaymentForm({{ $sale->id }})"
                                                class="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-200">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </button>
                                        @endif
                                        @if(!$sale->confirmed_by_shop)
                                            <button wire:click="confirmSale({{ $sale->id }})"
                                                class="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                @if(!$sale->confirmed_by_warehouse)
                                                    x-data
                                                    x-on:click.prevent="$dispatch('notify', { message: '{{ __('Cannot confirm sale. Warehouse confirmation is required first.') }}', type: 'error' })"
                                                @endif>
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </button>
                                        @endif
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="8" class="px-6 py-8 whitespace-nowrap text-sm text-gray-500 text-center">
                                    <div class="flex flex-col items-center justify-center">
                                        <svg class="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        <p class="text-lg font-medium text-gray-900 mb-1">@lang('No sales found')</p>
                                        <p class="text-gray-500">@lang('Try adjusting your search or filter criteria')</p>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            <div class="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
                {{ $sales->links() }}
            </div>
        </div>
    </div>

    <!-- Sale Details Modal -->
    @if($showDetailsModal)
        <x-modal model="showDetailsModal" maxWidth="16xl">
            <div class="p-8">
                <!-- Modal Header -->
                <div class="flex items-center justify-between mb-8">
                    <div class="flex items-center gap-3">
                        <div class="p-2 bg-indigo-100 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-2xl font-bold text-gray-900">@lang('Sale Details')</h3>
                            <p class="text-sm text-gray-500">@lang('View complete information about this sale')</p>
                        </div>
                    </div>
                    <button wire:click="$set('showDetailsModal', false)"
                        class="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-all duration-200">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                @if($selectedSale)
                    <div class="space-y-8">
                        <!-- Sale Information Cards -->
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div class="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-200">
                                <div class="flex items-center gap-4">
                                    <div class="p-2 bg-blue-100 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="text-sm font-medium text-gray-500">@lang('Reference')</p>
                                        <p class="text-lg font-semibold text-gray-900">{{ $selectedSale->reference }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-200">
                                <div class="flex items-center gap-4">
                                    <div class="p-2 bg-green-100 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="text-sm font-medium text-gray-500">@lang('Date')</p>
                                        <p class="text-lg font-semibold text-gray-900">{{ $selectedSale->date->format('M d, Y') }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-200">
                                <div class="flex items-center gap-4">
                                    <div class="p-2 bg-yellow-100 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="text-sm font-medium text-gray-500">@lang('Status')</p>
                                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold {{ $this->getStatusBadgeClass($selectedSale->status) }}">
                                            {{ ucfirst($selectedSale->status) }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-200">
                                <div class="flex items-center gap-4">
                                    <div class="p-2 bg-purple-100 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="text-sm font-medium text-gray-500">@lang('Total Amount')</p>
                                        <p class="text-lg font-semibold text-gray-900">{{ number_format($selectedSale->total_amount, 2) }} {{ $selectedSale->currency->symbol }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Items Table -->
                        <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                            <div class="p-6 border-b border-gray-200">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="p-2 bg-indigo-100 rounded-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 class="text-lg font-semibold text-gray-900">@lang('Items')</h4>
                                            <p class="text-sm text-gray-500">@lang('Products included in this sale')</p>
                                        </div>
                                    </div>
                                    <span class="text-sm font-medium text-gray-500">
                                        {{ count($selectedSale->saleItems) }} @lang('items')
                                    </span>
                                </div>
                            </div>
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th class="px-8 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">@lang('Product')</th>
                                            <th class="px-8 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">@lang('Quantity')</th>
                                            <th class="px-8 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">@lang('Price')</th>
                                            <th class="px-8 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">@lang('Total')</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        @foreach($selectedSale->saleItems as $item)
                                            <tr class="hover:bg-gray-50 transition-colors duration-200">
                                                <td class="px-8 py-4 whitespace-nowrap">
                                                    <div class="flex items-center">
                                                        <div class="flex-shrink-0 h-10 w-10">
                                                            <div class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div class="mr-4">
                                                            <div class="text-sm font-medium text-gray-900">{{ $item->product->name }}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="px-8 py-4 whitespace-nowrap">
                                                    <span class="px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {{ $item->quantity }}
                                                    </span>
                                                </td>
                                                <td class="px-8 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {{ number_format($item->unit_price, 2) }} {{ $selectedSale->currency->symbol }}
                                                </td>
                                                <td class="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {{ number_format($item->total, 2) }} {{ $selectedSale->currency->symbol }}
                                                </td>
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
    @endif

    <!-- Payment Modal -->
    @if($showPaymentModal)
        <x-modal model="showPaymentModal">
            <div class="p-6">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold text-gray-900">@lang('Add Payment')</h3>
                    <button wire:click="$set('showPaymentModal', false)" class="text-gray-400 hover:text-gray-500">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                @if($selectedSale)
                    <form wire:submit="addPayment" class="space-y-6">
                        <div class="space-y-2">
                            <label for="paymentAmount" class="block text-sm font-medium text-gray-700">@lang('Amount')</label>
                            <input type="number" step="0.01" wire:model="paymentAmount" id="paymentAmount"
                                class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200">
                            @error('paymentAmount') <span class="text-red-500 text-sm">{{ $errors->first('paymentAmount') }}</span> @enderror
                        </div>

                        <div class="space-y-2">
                            <label for="paymentDate" class="block text-sm font-medium text-gray-700">@lang('Date')</label>
                            <input type="date" wire:model="paymentDate" id="paymentDate"
                                class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200">
                            @error('paymentDate') <span class="text-red-500 text-sm">{{ $errors->first('paymentDate') }}</span> @enderror
                        </div>

                        <div class="space-y-2">
                            <label for="paymentNotes" class="block text-sm font-medium text-gray-700">@lang('Notes')</label>
                            <textarea wire:model="paymentNotes" id="paymentNotes" rows="3"
                                class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"></textarea>
                            @error('paymentNotes') <span class="text-red-500 text-sm">{{ $errors->first('paymentNotes') }}</span> @enderror
                        </div>

                        <div class="flex justify-end space-x-3 space-x-reverse pt-4">
                            <button type="button" wire:click="$set('showPaymentModal', false)"
                                class="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200">
                                @lang('Cancel')
                            </button>
                            <button type="submit"
                                class="px-6 py-3 border border-transparent rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200">
                                @lang('Add Payment')
                            </button>
                        </div>
                    </form>
                @endif
            </div>
        </x-modal>
    @endif
</div>
