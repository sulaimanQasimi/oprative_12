<div class="rtl" dir="rtl" x-data="{
    showCreateModal: @entangle('showCreateModal'),
    showSuccessMessage: false,
    init() {
        if ($wire.session.has('success')) {
            this.showSuccessMessage = true;
            setTimeout(() => {
                this.showSuccessMessage = false;
            }, 3000);
        }
    }
}">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <!-- Header Section -->
        <div class="md:flex md:items-center md:justify-between mb-8 pb-4 border-b border-gray-200">
            <div class="flex-1 min-w-0">
                <div class="relative">
                    <h2 class="text-3xl md:text-4xl font-bold leading-tight mb-2 bg-gradient-to-l from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                        @lang('Account Incomes')
                    </h2>
                    <div class="h-1 w-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-full"></div>
                </div>
                <p class="mt-2 text-sm text-gray-500">{{ $account->name }} - {{ $account->account_number }}</p>
            </div>
            <div class="mt-4 flex md:mt-0 md:mr-4">
                <a href="{{ route('accounts') }}" class="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    @lang('Back to Accounts')
                </a>
                <button wire:click="toggleCreateModal" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    @lang('Add New Income')
                </button>
            </div>
        </div>

        <!-- Success Message -->
        <div x-show="showSuccessMessage"
            x-transition:enter="transition ease-out duration-300"
            x-transition:enter-start="opacity-0 transform translate-y-2"
            x-transition:enter-end="opacity-100 transform translate-y-0"
            x-transition:leave="transition ease-in duration-200"
            x-transition:leave-start="opacity-100 transform translate-y-0"
            x-transition:leave-end="opacity-0 transform translate-y-2"
            class="rounded-md bg-green-50 p-4 mb-6">
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="mr-3">
                    <p class="text-sm font-medium text-green-800" x-text="$wire.session.get('success')"></p>
                </div>
            </div>
        </div>

        <!-- Income Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Total Income -->
            <div class="bg-white rounded-xl shadow-sm border border-indigo-50 p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500">@lang('Total Income')</p>
                        <p class="text-2xl font-bold text-indigo-600">{{ number_format($totalIncome, 2) }}</p>
                    </div>
                    <div class="bg-indigo-50 rounded-full p-3">
                        <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Pending Income -->
            <div class="bg-white rounded-xl shadow-sm border border-yellow-50 p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500">@lang('Pending Income')</p>
                        <p class="text-2xl font-bold text-yellow-600">{{ number_format($pendingIncome, 2) }}</p>
                    </div>
                    <div class="bg-yellow-50 rounded-full p-3">
                        <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Monthly Income -->
            <div class="bg-white rounded-xl shadow-sm border border-green-50 p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500">@lang('Monthly Income')</p>
                        <p class="text-2xl font-bold text-green-600">{{ number_format($monthlyIncome, 2) }}</p>
                    </div>
                    <div class="bg-green-50 rounded-full p-3">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Yearly Income -->
            <div class="bg-white rounded-xl shadow-sm border border-blue-50 p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500">@lang('Yearly Income')</p>
                        <p class="text-2xl font-bold text-blue-600">{{ number_format($yearlyIncome, 2) }}</p>
                    </div>
                    <div class="bg-blue-50 rounded-full p-3">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- Income List -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">@lang('Income History')</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                @lang('Date')
                            </th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                @lang('Amount')
                            </th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                @lang('Source')
                            </th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                @lang('Status')
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        @forelse($incomes as $income)
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                    {{ $income->income_date->format('Y-m-d') }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                    {{ number_format($income->amount, 2) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                    {{ $income->source }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        @if($income->status === 'approved') bg-green-100 text-green-800
                                        @elseif($income->status === 'pending') bg-yellow-100 text-yellow-800
                                        @else bg-red-100 text-red-800 @endif">
                                        {{ $income->status_text }}
                                    </span>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                                    @lang('No income records found.')
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            <div class="px-6 py-4 border-t border-gray-200">
                {{ $incomes->links() }}
            </div>
        </div>
    </div>

    <!-- Create Income Modal -->
    <div x-show="showCreateModal"
        x-transition:enter="transition ease-out duration-300"
        x-transition:enter-start="opacity-0 transform scale-95"
        x-transition:enter-end="opacity-100 transform scale-100"
        x-transition:leave="transition ease-in duration-200"
        x-transition:leave-start="opacity-100 transform scale-100"
        x-transition:leave-end="opacity-0 transform scale-95"
        class="fixed z-10 inset-0 overflow-y-auto"
        x-cloak>
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true"></div>

            <div class="inline-block align-bottom bg-white rounded-2xl text-right overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form wire:submit.prevent="createIncome">
                    <div class="bg-gradient-to-l from-indigo-50 via-white to-purple-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div class="mt-3 text-center sm:mt-0 sm:text-right w-full">
                                <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-4 -mx-4 -mt-5 mb-6">
                                    <h3 class="text-xl leading-6 font-bold text-white" id="modal-title">
                                        @lang('Add New Income')
                                    </h3>
                                    <p class="mt-2 text-indigo-100 text-sm">@lang('Enter income details below')</p>
                                </div>
                                <div class="mt-6 space-y-6">
                                    <div class="input-group relative">
                                        <label for="amount" class="floating-label absolute text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            @lang('Amount')
                                        </label>
                                        <div class="mt-1 relative">
                                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg class="input-icon h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <input type="number" step="0.01" wire:model.defer="amount" id="amount"
                                                class="block w-full pl-10 pr-4 py-3 text-right border-0 rounded-xl text-gray-900 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:bg-white shadow-sm transition-all duration-300 hover:bg-white"
                                                placeholder="@lang('Enter amount')">
                                        </div>
                                        @error('amount') <span class="text-red-500 text-xs mt-1">@lang($message)</span> @enderror
                                    </div>

                                    <div class="input-group relative">
                                        <label for="source" class="floating-label absolute text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            @lang('Source')
                                        </label>
                                        <div class="mt-1 relative">
                                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg class="input-icon h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <input type="text" wire:model.defer="source" id="source"
                                                class="block w-full pl-10 pr-4 py-3 text-right border-0 rounded-xl text-gray-900 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:bg-white shadow-sm transition-all duration-300 hover:bg-white"
                                                placeholder="@lang('Enter income source')">
                                        </div>
                                        @error('source') <span class="text-red-500 text-xs mt-1">@lang($message)</span> @enderror
                                    </div>

                                    <div class="input-group relative">
                                        <label for="description" class="floating-label absolute text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            @lang('Description')
                                        </label>
                                        <div class="mt-1 relative">
                                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg class="input-icon h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                                                </svg>
                                            </div>
                                            <textarea wire:model.defer="description" id="description"
                                                class="block w-full pl-10 pr-4 py-3 text-right border-0 rounded-xl text-gray-900 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:bg-white shadow-sm transition-all duration-300 hover:bg-white"
                                                placeholder="@lang('Enter description')" rows="3"></textarea>
                                        </div>
                                        @error('description') <span class="text-red-500 text-xs mt-1">@lang($message)</span> @enderror
                                    </div>

                                    <div class="input-group relative">
                                        <label for="income_date" class="floating-label absolute text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            @lang('Date')
                                        </label>
                                        <div class="mt-1 relative">
                                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg class="input-icon h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <input type="date" wire:model.defer="income_date" id="income_date"
                                                class="block w-full pl-10 pr-4 py-3 text-right border-0 rounded-xl text-gray-900 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:bg-white shadow-sm transition-all duration-300 hover:bg-white">
                                        </div>
                                        @error('income_date') <span class="text-red-500 text-xs mt-1">@lang($message)</span> @enderror
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gradient-to-r from-gray-50 to-indigo-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="submit" class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-base font-medium text-white hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-300 hover:scale-105 sm:mr-3 sm:w-auto sm:text-sm">
                            @lang('Save Income')
                        </button>
                        <button type="button" wire:click="toggleCreateModal" class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-6 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-300 hover:scale-105 sm:mt-0 sm:mr-3 sm:w-auto sm:text-sm">
                            @lang('Cancel')
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
