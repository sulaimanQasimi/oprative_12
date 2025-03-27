<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <!-- Total Income -->
    <div class="group relative bg-white rounded-2xl shadow-sm border border-indigo-50 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-100">
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative flex items-center justify-between">
            <div class="space-y-1">
                <p class="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-indigo-600">@lang('Total Income')</p>
                <p class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">{{ number_format($totalIncome, 2) }}</p>
            </div>
            <div class="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
        </div>
    </div>

    <!-- Total Rent -->
    <div class="group relative bg-white rounded-2xl shadow-sm border border-red-50 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-red-100">
        <div class="absolute inset-0 bg-gradient-to-br from-red-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative flex items-center justify-between">
            <div class="space-y-1">
                <p class="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-red-600">@lang('Total Rent')</p>
                <p class="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">{{ number_format($totalOutcome, 2) }}</p>
            </div>
            <div class="bg-gradient-to-br from-red-100 to-pink-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
            </div>
        </div>
    </div>

    <!-- Monthly Income -->
    <div class="group relative bg-white rounded-2xl shadow-sm border border-green-50 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-green-100">
        <div class="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative flex items-center justify-between">
            <div class="space-y-1">
                <p class="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-green-600">@lang('Monthly Income')</p>
                <p class="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">{{ number_format($monthlyIncome, 2) }}</p>
            </div>
            <div class="bg-gradient-to-br from-green-100 to-emerald-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            </div>
        </div>
    </div>

    <!-- Monthly Rent -->
    <div class="group relative bg-white rounded-2xl shadow-sm border border-yellow-50 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-yellow-100">
        <div class="absolute inset-0 bg-gradient-to-br from-yellow-50/50 to-amber-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative flex items-center justify-between">
            <div class="space-y-1">
                <p class="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-yellow-600">@lang('Monthly Rent')</p>
                <p class="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">{{ number_format($monthlyOutcome, 2) }}</p>
            </div>
            <div class="bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            </div>
        </div>
    </div>
</div>
