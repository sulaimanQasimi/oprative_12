<x-customer-layout>

<div class="container px-6 mx-auto">
    <!-- Header with gradient background -->
    <div class="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-xl p-8 mb-8 overflow-hidden">
        <div class="absolute inset-0 bg-pattern opacity-10"></div>
        <div class="relative z-10 flex justify-between items-center">
            <div>
                <h2 class="text-3xl font-bold text-white">
                    {{ __('My Accounts') }}
                </h2>
                <p class="mt-2 text-indigo-100 max-w-2xl">
                    {{ __('Manage your accounts and banking information securely in one place.') }}
                </p>
            </div>
            <div class="hidden md:block">
                <lottie-player src="https://assets2.lottiefiles.com/packages/lf20_it8yjkl7.json" background="transparent" speed="1" style="width: 120px; height: 120px;" loop autoplay></lottie-player>
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

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <!-- Action Cards -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 account-card">
            <div class="p-6 flex flex-col items-center text-center">
                <div class="p-3 rounded-full bg-indigo-100 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ __('Create New Account') }}</h3>
                <p class="text-gray-600 text-sm mb-4">{{ __('Add a new banking account to your profile') }}</p>
                <button onclick="document.location='{{ route('customer.accounts.create') }}'" class="animate-button group relative px-4 py-2 text-sm font-medium leading-5 text-white transition-all duration-300 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 overflow-hidden shadow-md hover:shadow-lg">
                    <span class="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                    <span class="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300 animate-tilt"></span>
                    <span class="relative">{{ __('Create Account') }}</span>
                </button>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 account-card">
            <div class="p-6 flex flex-col items-center text-center">
                <div class="p-3 rounded-full bg-purple-100 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ __('Total Accounts') }}</h3>
                <p class="text-2xl font-bold text-purple-600">{{ $accounts->total() }}</p>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 account-card lg:col-span-2">
            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    {{ __('Quick Filters') }}
                </h3>
                <form action="{{ route('customer.accounts.index') }}" method="GET" class="grid gap-4 md:grid-cols-2">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('ID Number') }}</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                </svg>
                            </div>
                            <input name="search_id_number" value="{{ $search_id_number }}" class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="{{ __('Search by ID Number') }}">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Account Number') }}</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input name="search_account_number" value="{{ $search_account_number }}" class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="{{ __('Search by Account Number') }}">
                        </div>
                    </div>
                    <div class="md:col-span-2 flex gap-3 mt-2">
                        <button type="submit" class="flex-1 px-4 py-2 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white text-sm font-medium rounded-md shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 relative overflow-hidden group">
                            <span class="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                            <span class="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300 animate-tilt"></span>
                            <span class="relative flex items-center justify-center">
                                <svg class="h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                {{ __('Search') }}
                            </span>
                        </button>
                        <a href="{{ route('customer.accounts.resetFilters') }}" class="flex-1 px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white text-sm font-medium rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300">
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
    </div>

    <div class="bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-xl overflow-hidden mb-8 account-list">
        <div class="px-8 py-5 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 backdrop-blur-sm">
            <h3 class="text-xl font-semibold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2M7 7h10" />
                </svg>
                {{ __('Your Accounts') }}
            </h3>
        </div>
        <div class="overflow-x-auto bg-white relative">
            <div class="absolute inset-0 bg-pattern opacity-[0.02] pointer-events-none"></div>
            <table class="min-w-full divide-y divide-gray-200 table-fixed">
                <thead>
                    <tr class="bg-gradient-to-r from-gray-50 to-gray-100">
                        <th scope="col" class="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            {{ __('Name') }}
                        </th>
                        <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            {{ __('ID Number') }}
                        </th>
                        <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            {{ __('Account Number') }}
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
                    @forelse($accounts as $account)
                    <tr class="hover:bg-indigo-50/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md search-result table-row account-row">
                        <td class="px-8 py-5 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="mx-6 flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 6l9-4 9 4m-9-4v20m0 0l-9-4m9 4l9-4M3 6l9 4 9-4" />
                                    </svg>
                                </div>
                                <div class="ml-4">                                    <div class="text-base font-medium text-gray-900">{{ $account->name }}</div>
                                    <div class="text-sm text-gray-500 mt-1 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {{ Str::limit($account->address, 30) }}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-5 whitespace-nowrap text-right">
                            <div class="text-sm text-gray-900 bg-gray-50 py-1.5 px-3 rounded-md inline-flex items-center float-right">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                </svg>
                                {{ $account->id_number }}
                            </div>
                        </td>
                        <td class="px-6 py-5 whitespace-nowrap text-right">
                            <div class="text-sm font-mono bg-indigo-50 text-indigo-800 py-1.5 px-3 rounded-md border border-indigo-100 shadow-sm inline-flex items-center float-right">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                {{ $account->account_number }}
                            </div>
                        </td>
                        <td class="px-6 py-5 whitespace-nowrap text-right">
                            <div class="flex justify-end">
                            @if($account->approved_by)
                                <span class="px-3.5 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200 shadow-sm status-badge status-approved">
                                    <span class="flex items-center justify-center h-5 w-5 bg-green-500 rounded-full mr-1.5 shadow-inner">
                                        <svg class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                    {{ __('Approved') }}
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
                            <a href="{{ route('customer.accounts.show', $account) }}" class="group relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg overflow-hidden">
                                <span class="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                <span class="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300 animate-tilt"></span>
                                <span class="absolute left-0 inset-y-0 flex items-center pl-3 relative">
                                    <svg class="h-4 w-4 text-white opacity-80 group-hover:opacity-100 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </span>
                                <span class="pl-6 relative">{{ __('View Details') }}</span>
                            </a>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="5" class="px-6 py-12 text-center">
                            <div class="flex flex-col items-center bg-indigo-50/50 max-w-lg mx-auto py-10 px-6 rounded-2xl">
                                <div class="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4 shadow-inner">
                                    <svg class="h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <h3 class="mt-2 text-lg font-medium text-gray-900">{{ __('No accounts found') }}</h3>
                                <p class="mt-2 text-sm text-gray-500 text-center max-w-xs">{{ __('Get started by creating a new account to manage your banking information securely.') }}</p>
                                <div class="mt-8">
                                    <button onclick="document.location='{{ route('customer.accounts.create') }}'" class="group relative inline-flex items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden">
                                        <span class="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                        <span class="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300 animate-tilt"></span>
                                        <span class="relative flex items-center">
                                            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            {{ __('Create New Account') }}
                                        </span>
                                    </button>
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
                {{ $accounts->links() }}
            </div>
        </div>
    </div>
</div>

<div id="three-background" class="fixed inset-0 z-[-1] opacity-30"></div>

@push('scripts')
<script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
<script>
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

        // Add animation for filter toggle
        function toggleFilter() {
            const filterSection = document.getElementById('filterSection');
            if (filterSection.classList.contains('hidden')) {
                filterSection.classList.remove('hidden');
                anime({
                    targets: filterSection,
                    opacity: [0, 1],
                    height: ['0px', filterSection.scrollHeight + 'px'],
                    duration: 400,
                    easing: 'easeOutExpo'
                });
            } else {
                anime({
                    targets: filterSection,
                    opacity: [1, 0],
                    height: ['auto', '0px'],
                    duration: 300,
                    easing: 'easeInExpo',
                    complete: function() {
                        filterSection.classList.add('hidden');
                    }
                });
            }
        }
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

