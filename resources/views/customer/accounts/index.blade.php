<x-customer-layout>

<div class="container px-6 mx-auto grid">
    <h2 class="my-6 text-2xl font-semibold text-gray-700">
        {{ __('My Accounts') }}
    </h2>

    @if(session('success'))
    <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
        <p>{{ session('success') }}</p>
    </div>
    @endif

    <div class="flex justify-between mb-6">
        <div>
            <button onclick="document.location='{{ route('customer.accounts.create') }}'" class="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
                {{ __('Create New Account') }}
            </button>
        </div>
        <div>
            <button onclick="toggleFilter()" class="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-gray-600 border border-transparent rounded-lg active:bg-gray-600 hover:bg-gray-700 focus:outline-none focus:shadow-outline-gray">
                {{ __('Filter') }} {{ $isFilterOpen ? '▲' : '▼' }}
            </button>
        </div>
    </div>

    <div id="filterSection" class="{{ $isFilterOpen ? 'block' : 'hidden' }} mb-8">
        <form action="{{ route('customer.accounts.index') }}" method="GET">
            <div class="grid gap-6 mb-8 md:grid-cols-2">
                <div>
                    <label class="block text-sm">
                        <span class="text-gray-700">{{ __('ID Number') }}</span>
                        <input name="search_id_number" value="{{ $search_id_number }}" class="block w-full mt-1 text-sm border-gray-300 rounded-md focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input" placeholder="{{ __('Search by ID Number') }}">
                    </label>
                </div>
                <div>
                    <label class="block text-sm">
                        <span class="text-gray-700">{{ __('Account Number') }}</span>
                        <input name="search_account_number" value="{{ $search_account_number }}" class="block w-full mt-1 text-sm border-gray-300 rounded-md focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input" placeholder="{{ __('Search by Account Number') }}">
                    </label>
                </div>
            </div>
            <div class="flex justify-between">
                <button type="submit" class="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
                    {{ __('Search') }}
                </button>
                <a href="{{ route('customer.accounts.resetFilters') }}" class="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-gray-600 border border-transparent rounded-lg active:bg-gray-600 hover:bg-gray-700 focus:outline-none focus:shadow-outline-gray">
                    {{ __('Reset') }}
                </a>
            </div>
        </form>
    </div>

    <div class="w-full overflow-hidden rounded-lg shadow-xs">
        <div class="w-full overflow-x-auto">
            <table class="w-full whitespace-no-wrap">
                <thead>
                    <tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                        <th class="px-4 py-3">{{ __('Name') }}</th>
                        <th class="px-4 py-3">{{ __('ID Number') }}</th>
                        <th class="px-4 py-3">{{ __('Account Number') }}</th>
                        <th class="px-4 py-3">{{ __('Status') }}</th>
                        <th class="px-4 py-3">{{ __('Actions') }}</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y">
                    @forelse($accounts as $account)
                    <tr class="text-gray-700">
                        <td class="px-4 py-3">
                            <div class="flex items-center text-sm">
                                <div>
                                    <p class="font-semibold">{{ $account->name }}</p>
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-3 text-sm">
                            {{ $account->id_number }}
                        </td>
                        <td class="px-4 py-3 text-sm">
                            {{ $account->account_number }}
                        </td>
                        <td class="px-4 py-3 text-xs">
                            <span class="px-2 py-1 font-semibold leading-tight {{ $account->approved_by ? 'text-green-700 bg-green-100' : 'text-yellow-700 bg-yellow-100' }} rounded-full">
                                {{ $account->approved_by ? __('Approved') : __('Pending') }}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-sm">
                            <a href="{{ route('customer.accounts.show', $account) }}" class="px-3 py-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
                                {{ __('View') }}
                            </a>
                        </td>
                    </tr>
                    @empty
                    <tr class="text-gray-700">
                        <td colspan="5" class="px-4 py-3 text-sm text-center">
                            {{ __('No accounts found.') }}
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="px-4 py-3 border-t bg-gray-50">
            {{ $accounts->links() }}
        </div>
    </div>
</div>

<script>
    function toggleFilter() {
        const filterSection = document.getElementById('filterSection');
        if (filterSection.classList.contains('hidden')) {
            filterSection.classList.remove('hidden');
            filterSection.classList.add('block');
        } else {
            filterSection.classList.remove('block');
            filterSection.classList.add('hidden');
        }
    }
</script>
</x-customer-layout>
