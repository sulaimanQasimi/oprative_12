<x-customer-layout>

<div class="container px-6 mx-auto grid">
    <h2 class="my-6 text-2xl font-semibold text-gray-700">
        {{ __('Create New Account') }}
    </h2>

    <div class="px-4 py-3 mb-8 bg-white rounded-lg shadow-md">
        <form action="{{ route('customer.accounts.store') }}" method="POST">
            @csrf

            <div class="mb-4">
                <label class="block text-sm">
                    <span class="text-gray-700">{{ __('Name') }}</span>
                    <input name="name" value="{{ old('name') }}" class="block w-full mt-1 text-sm border-gray-300 rounded-md focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input @error('name') border-red-500 @enderror" placeholder="{{ __('Account Name') }}">
                    @error('name')
                    <span class="text-xs text-red-600">{{ $message }}</span>
                    @enderror
                </label>
            </div>

            <div class="mb-4">
                <label class="block text-sm">
                    <span class="text-gray-700">{{ __('ID Number') }}</span>
                    <input name="id_number" value="{{ old('id_number') }}" class="block w-full mt-1 text-sm border-gray-300 rounded-md focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input @error('id_number') border-red-500 @enderror" placeholder="{{ __('ID Number') }}">
                    @error('id_number')
                    <span class="text-xs text-red-600">{{ $message }}</span>
                    @enderror
                </label>
            </div>

            <div class="mb-4">
                <label class="block text-sm">
                    <span class="text-gray-700">{{ __('Address') }}</span>
                    <textarea name="address" class="block w-full mt-1 text-sm border-gray-300 rounded-md focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-textarea @error('address') border-red-500 @enderror" rows="3" placeholder="{{ __('Account Address') }}">{{ old('address') }}</textarea>
                    @error('address')
                    <span class="text-xs text-red-600">{{ $message }}</span>
                    @enderror
                </label>
            </div>

            <div class="flex justify-between mt-6">
                <button type="submit" class="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
                    {{ __('Create Account') }}
                </button>
                <a href="{{ route('customer.accounts.index') }}" class="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-gray-600 border border-transparent rounded-lg active:bg-gray-600 hover:bg-gray-700 focus:outline-none focus:shadow-outline-gray">
                    {{ __('Cancel') }}
                </a>
            </div>
        </form>
    </div>
</div>

</x-customer-layout>
