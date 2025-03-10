<x-filament::widget>
    <x-filament::card>
        <div class="flex items-center justify-between gap-8">
            <div>
                <h2 class="text-lg sm:text-xl font-bold tracking-tight">
                    {{ __('Total Amount') }}
                </h2>
            </div>

            <div>
                <p class="text-3xl font-bold">
                    {{ number_format($total, 2) }}
                </p>
            </div>
        </div>
    </x-filament::card>
</x-filament::widget>

