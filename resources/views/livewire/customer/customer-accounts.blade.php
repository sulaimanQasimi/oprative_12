<div class="rtl" dir="rtl">
    <style>
        @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .animate-gradient {
            background-size: 200% auto;
            animation: gradient 4s linear infinite;
        }
        .floating-label {
            top: -25px;
            right: 0;
            transition: all 0.3s ease;
        }
        .input-group:focus-within .floating-label {
            transform: translateY(-2px);
            color: theme('colors.indigo.600');
        }
        .input-icon {
            transition: all 0.3s ease;
        }
        .input-group:focus-within .input-icon {
            color: theme('colors.indigo.600');
        }
    </style>

    <x-customer-navbar />

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <!-- Header section -->
        <div class="md:flex md:items-center md:justify-between mb-8 pb-4 border-b border-gray-200">
            <div class="flex-1 min-w-0">
                <div class="relative">
                    <h2 class="text-3xl md:text-4xl font-bold leading-tight mb-2 bg-gradient-to-l from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient transform hover:scale-105 transition-transform duration-300 ease-in-out">
                        @lang('My Bank Accounts')
                    </h2>
                    <div class="h-1 w-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-full transform hover:scale-x-110 transition-transform duration-300 ease-in-out"></div>
                </div>
                <p class="mt-2 text-sm text-gray-500">@lang('Manage your bank accounts and financial information')</p>
            </div>
            <div class="mt-4 flex md:mt-0 md:mr-4">
                <button wire:click="toggleCreateModal" class="mr-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    @lang('Add New Account')
                </button>
            </div>
        </div>

        <!-- Success Message -->
        @if (session()->has('success'))
            <div class="rounded-md bg-green-50 p-4 mt-6">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="mr-3">
                        <p class="text-sm font-medium text-green-800">
                            {{ session('success') }}
                        </p>
                    </div>
                </div>
            </div>
        @endif

        <!-- Accounts List -->
        <div class="mt-8 flex flex-col">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div class="shadow-lg hover:shadow-xl transform transition-all duration-300 rounded-2xl overflow-hidden border border-indigo-50">
                        <div class="bg-gradient-to-l from-indigo-50/50 via-white to-purple-50/50">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr class="bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-blue-500/5">
                                        <th scope="col" class="px-6 py-4 text-right text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                            <div class="flex items-center justify-end">
                                                <span class="ml-2">@lang('Name')</span>
                                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                        </th>
                                        <th scope="col" class="px-6 py-4 text-right text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                            <div class="flex items-center justify-end">
                                                <span class="ml-2">@lang('ID Number')</span>
                                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4z" />
                                                </svg>
                                            </div>
                                        </th>
                                        <th scope="col" class="px-6 py-4 text-right text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                            <div class="flex items-center justify-end">
                                                <span class="ml-2">@lang('Account Number')</span>
                                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                        </th>
                                        <th scope="col" class="px-6 py-4 text-right text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                            <div class="flex items-center justify-end">
                                                <span class="ml-2">@lang('Address')</span>
                                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                        </th>
                                        <th scope="col" class="px-6 py-4 text-right text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                            <div class="flex items-center justify-end">
                                                <span class="ml-2">@lang('Status')</span>
                                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100">
                                    @forelse($accounts as $account)
                                        <tr class="hover:bg-gradient-to-r hover:from-indigo-50/50 hover:via-purple-50/50 hover:to-blue-50/50 transition-all duration-300">
                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                                <div class="flex items-center justify-end space-x-2 space-x-reverse">
                                                    <span class="font-semibold">{{ $account->name }}</span>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                                                <div class="flex items-center justify-end space-x-2 space-x-reverse">
                                                    <span class="font-medium">{{ $account->id_number }}</span>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                                                <div class="flex items-center justify-end space-x-2 space-x-reverse">
                                                    <span class="font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                                        {{ $account->account_number }}
                                                    </span>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                                                <div class="flex items-center justify-end space-x-2 space-x-reverse">
                                                    <span class="font-medium">{{ $account->address }}</span>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                @if($account->approved_by)
                                                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 transform transition-all duration-300 hover:scale-105">
                                                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        @lang('Approved')
                                                    </span>
                                                @else
                                                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200 transform transition-all duration-300 hover:scale-105">
                                                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        @lang('Pending')
                                                    </span>
                                                @endif
                                            </td>
                                        </tr>
                                    @empty
                                        <tr>
                                            <td colspan="5" class="px-6 py-8 whitespace-nowrap text-sm text-center">
                                                <div class="flex flex-col items-center justify-center space-y-3">
                                                    <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                    </svg>
                                                    <span class="text-gray-500 font-medium">@lang('No accounts found. Add your first account!')</span>
                                                    <button wire:click="toggleCreateModal" class="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-300 hover:scale-105">
                                                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                        @lang('Add New Account')
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-4">
                {{ $accounts->links() }}
            </div>
        </div>
    </div>

    <!-- Create Account Modal -->
    @if($showCreateModal)
        <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true"></div>

                <div class="inline-block align-bottom bg-white rounded-2xl text-right overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-indigo-50">
                    <form wire:submit.prevent="createAccount">
                        <div class="bg-gradient-to-l from-indigo-50 via-white to-purple-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div class="sm:flex sm:items-start">
                                <div class="mt-3 text-center sm:mt-0 sm:text-right w-full">
                                    <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-4 -mx-4 -mt-5 mb-6">
                                        <h3 class="text-xl leading-6 font-bold text-white" id="modal-title">
                                            @lang('Add New Account Request')
                                        </h3>
                                        <p class="mt-2 text-indigo-100 text-sm">@lang('Enter account details below')</p>
                                    </div>
                                    <div class="mt-6 space-y-8">
                                        <div class="input-group relative">
                                            <label for="name" class="floating-label absolute text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                                @lang('Full Name')
                                            </label>
                                            <div class="mt-1 relative">
                                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg class="input-icon h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <input type="text" wire:model.defer="name" id="name"
                                                    class="block w-full pl-10 pr-4 py-3 text-right border-0 rounded-xl text-gray-900 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:bg-white shadow-sm transition-all duration-300 hover:bg-white"
                                                    placeholder="@lang('Enter your full name')">
                                            </div>
                                            @error('name') <span class="text-red-500 text-xs mt-1">@lang($message)</span> @enderror
                                        </div>

                                        <div class="input-group relative">
                                            <label for="id_number" class="floating-label absolute text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                                @lang('ID Number')
                                            </label>
                                            <div class="mt-1 relative">
                                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg class="input-icon h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                                                    </svg>
                                                </div>
                                                <input type="text" wire:model.defer="id_number" id="id_number"
                                                    class="block w-full pl-10 pr-4 py-3 text-right border-0 rounded-xl text-gray-900 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:bg-white shadow-sm transition-all duration-300 hover:bg-white"
                                                    placeholder="@lang('Enter your ID number')">
                                            </div>
                                            @error('id_number') <span class="text-red-500 text-xs mt-1">@lang($message)</span> @enderror
                                        </div>

                                        <div class="input-group relative">
                                            <label for="address" class="floating-label absolute text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                                @lang('Address')
                                            </label>
                                            <div class="mt-1 relative">
                                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg class="input-icon h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                                <textarea wire:model.defer="address" id="address"
                                                    class="block w-full pl-10 pr-4 py-3 text-right border-0 rounded-xl text-gray-900 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:bg-white shadow-sm transition-all duration-300 hover:bg-white"
                                                    placeholder="@lang('Enter your full address')" rows="3"></textarea>
                                            </div>
                                            @error('address') <span class="text-red-500 text-xs mt-1">@lang($message)</span> @enderror
                                        </div>

                                        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                                            <div class="flex">
                                                <div class="flex-shrink-0">
                                                    <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div class="mr-3">
                                                    <p class="text-sm text-blue-700">
                                                        @lang('Your account request will be reviewed by our team'). @lang('Account number will be generated automatically').
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gradient-to-r from-gray-50 to-indigo-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="submit" class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-base font-medium text-white hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-300 hover:scale-105 sm:mr-3 sm:w-auto sm:text-sm">
                                @lang('Save Account')
                            </button>
                            <button type="button" wire:click="toggleCreateModal" class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-6 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-300 hover:scale-105 sm:mt-0 sm:mr-3 sm:w-auto sm:text-sm">
                                @lang('Cancel')
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    @endif
</div>
