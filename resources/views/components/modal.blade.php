@props(['model', 'maxWidth' => '2xl'])

@php
$maxWidth = [
    'sm' => 'sm:max-w-sm',
    'md' => 'sm:max-w-md',
    'lg' => 'sm:max-w-lg',
    'xl' => 'sm:max-w-xl',
    '2xl' => 'sm:max-w-2xl',
    '3xl' => 'sm:max-w-3xl',
    '4xl' => 'sm:max-w-4xl',
    '5xl' => 'sm:max-w-5xl',
    '6xl' => 'sm:max-w-6xl',
    '7xl' => 'sm:max-w-7xl',
    '8xl' => 'sm:max-w-8xl',
    '9xl' => 'sm:max-w-9xl',
    '10xl' => 'sm:max-w-10xl',
    '11xl' => 'sm:max-w-11xl',
    '12xl' => 'sm:max-w-12xl',
    '13xl' => 'sm:max-w-13xl',
    '14xl' => 'sm:max-w-14xl',
    '15xl' => 'sm:max-w-15xl',
    '16xl' => 'sm:max-w-16xl',
    '17xl' => 'sm:max-w-17xl',
    '18xl' => 'sm:max-w-18xl',
    '19xl' => 'sm:max-w-19xl',
    '20xl' => 'sm:max-w-20xl',
][$maxWidth];
@endphp

<div class="fixed inset-0 z-50 overflow-y-auto" wire:key="modal-{{ $model }}">
    <!-- Background overlay -->
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <!-- Modal panel -->
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-2xl transition-all sm:my-8 sm:w-full {{ $maxWidth }} sm:p-6">
            <!-- Close button -->
            <div class="absolute right-0 top-0 pr-4 pt-4">
                <button type="button" wire:click="$set('{{ $model }}', false)" class="rounded-xl bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span class="sr-only">Close</span>
                    <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {{ $slot }}
        </div>
    </div>
</div>
