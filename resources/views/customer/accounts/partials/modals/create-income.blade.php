<!-- Create Income Modal -->
<div x-data="{ open: false }" x-on:keydown.escape.window="open = false" class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true" x-cloak>
    <div x-show="open" x-transition:enter="ease-out duration-300" x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100" x-transition:leave="ease-in duration-200" x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div x-show="open" class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div x-transition:enter="ease-out duration-300" x-transition:enter-start="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100" x-transition:leave="ease-in duration-200" x-transition:leave-start="opacity-100 translate-y-0 sm:scale-100" x-transition:leave-end="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-right shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <form action="{{ route('customer.account.income.store', $account->id) }}" method="POST">
                    @csrf
                    <div>
                        <div class="mt-3 text-center sm:mt-0 sm:text-right">
                            <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                                @lang('Create New Income')
                            </h3>
                            <div class="mt-6 space-y-4">
                                <!-- Amount -->
                                <div class="grid grid-cols-1 gap-4">
                                    <div>
                                        <label for="amount" class="block text-sm font-medium text-gray-700">@lang('Amount')</label>
                                        <div class="relative mt-1 rounded-md shadow-sm">
                                            <input type="number" step="0.01" name="amount" id="amount" class="block w-full rounded-md border-gray-300 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="0.00" required>
                                            <div class="absolute inset-y-0 left-0 flex items-center pr-3 pointer-events-none">
                                                <span class="text-gray-500 sm:text-sm">$</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Date -->
                                <div class="grid grid-cols-1 gap-4">
                                    <div>
                                        <label for="date" class="block text-sm font-medium text-gray-700">@lang('Date')</label>
                                        <div class="mt-1">
                                            <input type="date" name="date" id="date" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value="{{ now()->format('Y-m-d') }}" required>
                                        </div>
                                    </div>
                                </div>

                                <!-- Source -->
                                <div class="grid grid-cols-1 gap-4">
                                    <div>
                                        <label for="source" class="block text-sm font-medium text-gray-700">@lang('Source')</label>
                                        <div class="mt-1">
                                            <input type="text" name="source" id="source" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="@lang('e.g. Sales, Investment, etc.')" required>
                                        </div>
                                    </div>
                                </div>

                                <!-- Description -->
                                <div class="grid grid-cols-1 gap-4">
                                    <div>
                                        <label for="description" class="block text-sm font-medium text-gray-700">@lang('Description')</label>
                                        <div class="mt-1">
                                            <textarea id="description" name="description" rows="3" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="@lang('Optional additional details')"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button type="submit" class="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm transition-all duration-200 transform hover:scale-105">
                            @lang('Save')
                        </button>
                        <button type="button" @click="open = false" class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm transition-all duration-200 transform hover:scale-105">
                            @lang('Cancel')
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Trigger button for the modal -->
    <button type="button" @click="open = true" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105">
        <svg class="ml-1 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        @lang('New Income')
    </button>
</div>
