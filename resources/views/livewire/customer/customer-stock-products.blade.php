<div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
    <style>
        .animate__animated {
            animation-duration: 0.8s;
        }
        .animate__delay-1s {
            animation-delay: 0.2s;
        }
        .animate__delay-2s {
            animation-delay: 0.4s;
        }
        .animate__delay-3s {
            animation-delay: 0.6s;
        }
        .animate__delay-4s {
            animation-delay: 0.8s;
        }
        .animate__delay-5s {
            animation-delay: 1s;
        }
        .animate__delay-6s {
            animation-delay: 1.2s;
        }
    </style>

    <x-customer-navbar />

    <div class="container mx-auto px-4 py-8">
        <!-- Header Section -->
        <div class="relative mb-12 animate__animated animate__fadeIn">
            <!-- Decorative background elements -->
            <div class="absolute inset-0 -z-10 overflow-hidden">
                <div class="absolute right-1/2 top-0 h-24 w-24 translate-x-1/2 transform rounded-full bg-blue-500 opacity-10 blur-3xl"></div>
                <div class="absolute left-1/4 top-8 h-32 w-32 rounded-full bg-purple-500 opacity-10 blur-3xl"></div>
                <div class="absolute right-1/4 top-4 h-28 w-28 rounded-full bg-pink-500 opacity-10 blur-3xl"></div>
            </div>

            <!-- Main header content -->
            <div class="relative">
                <div class="flex flex-col items-start space-y-4">
                    <div class="inline-flex items-center space-x-4 space-x-reverse">
                        <span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-bl from-blue-600 to-purple-600 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </span>
                        <div class="relative">
                            <h1 class="text-5xl font-extrabold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                                @lang('Stock Movement Overview')
                            </h1>
                            <div class="absolute -bottom-2 left-0 h-1 w-24 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-full"></div>
                        </div>
                    </div>

                    <div class="flex items-center space-x-4 space-x-reverse w-full">
                        <div class="h-8 w-1 rounded-full bg-gradient-to-b from-blue-600 to-transparent opacity-50"></div>
                        <div class="flex items-center">
                            <span class="inline-flex items-center px-3 py-1 ml-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                                <span class="w-2 h-2 ml-1 bg-blue-500 rounded-full"></span>
                                @lang('Live Updates')
                            </span>
                            <p class="text-lg text-gray-600 max-w-2xl text-right leading-relaxed">
                                @lang('Track your inventory performance')
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Search Bar -->
        <div class="mb-8 animate__animated animate__fadeInUp animate__delay-1s">
            <div class="relative max-w-2xl mx-auto">
                <input wire:model.live="search"
                       type="text"
                       placeholder="@lang('Search products by name,or barcode...')"
                       class="w-full px-4 py-4 pr-12 border-0 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-xl">
                <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg class="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="animate__animated animate__fadeInRight animate__delay-2s">
                <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div class="flex items-center justify-between">
                        <div class="p-3 bg-blue-100 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-medium text-gray-500">@lang('Total Products')</p>
                            <h3 class="text-3xl font-bold text-gray-900 mt-1">{{ $stockProducts->total() }}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div class="animate__animated animate__fadeInRight animate__delay-3s">
                <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div class="flex items-center justify-between">
                        <div class="p-3 bg-green-100 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-medium text-gray-500">@lang('Income Total')</p>
                            <h3 class="text-3xl font-bold text-gray-900 mt-1">${{ number_format($stockProducts->sum('income_total'), 2) }}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div class="animate__animated animate__fadeInRight animate__delay-4s">
                <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div class="flex items-center justify-between">
                        <div class="p-3 bg-purple-100 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-medium text-gray-500">@lang('Profit')</p>
                            <h3 class="text-3xl font-bold text-gray-900 mt-1">${{ number_format($stockProducts->sum('profit'), 2) }}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Products Table -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate__animated animate__fadeInUp animate__delay-5s">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">@lang('Product')</th>
                            <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">@lang('Barcode')</th>
                            <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">@lang('Net Quantity')</th>
                            <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">@lang('Income')</th>
                            <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">@lang('Outcome')</th>
                            <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">@lang('Profit')</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        @forelse($stockProducts as $stock)
                            <tr class="hover:bg-gray-50 transition-all duration-200">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 h-12 w-12 ml-4">
                                            <div class="h-12 w-12 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center relative shadow-sm">
                                                @if($stock->net_quantity <= 5)
                                                    <div class="absolute -top-2 -left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg shadow-sm animate__animated animate__pulse animate__infinite">
                                                        @lang('Low')
                                                    </div>
                                                @endif
                                                @if($stock->net_quantity > 5 && $stock->net_quantity <= 10)
                                                    <div class="absolute -top-2 -left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-lg shadow-sm">
                                                        @lang('Med')
                                                    </div>
                                                @endif
                                                @if($stock->net_quantity > 10)
                                                    <div class="absolute -top-2 -left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-lg shadow-sm">
                                                        @lang('High')
                                                    </div>
                                                @endif
                                                @if($stock->net_quantity <= 5)
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                @elseif($stock->net_quantity <= 10)
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                @else
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                @endif
                                            </div>
                                        </div>
                                        <div>
                                            <div class="text-sm font-bold text-gray-900">{{ $stock->product_name }}</div>
                                            <div class="text-xs text-gray-500">@lang('Barcode'): {{ $stock->barcode }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900">{{ $stock->barcode }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">{{ number_format($stock->net_quantity) }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-green-600">{{ number_format($stock->income_quantity) }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-red-600">{{ number_format($stock->outcome_quantity) }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium {{ $stock->profit >= 0 ? 'text-green-600' : 'text-red-600' }}">
                                        ${{ number_format($stock->profit, 2) }}
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="px-6 py-12 text-center">
                                    <div class="flex flex-col items-center animate__animated animate__fadeIn">
                                        <div class="bg-gray-50 rounded-full p-4 mb-4">
                                            <svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                        <p class="text-lg font-medium text-gray-500">@lang('No records found')</p>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Pagination -->
        <div class="mt-6 animate__animated animate__fadeIn animate__delay-6s">
            {{ $stockProducts->links() }}
        </div>
    </div>
</div>
