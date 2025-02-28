<x-filament-panels::page>
    <div class="supplier-details">
        <x-filament::info-list>
            <x-filament::info-list-item label="Name" :value="$supplier->name" />
            <x-filament::info-list-item label="Contact Name" :value="$supplier->contact_name" />
            <x-filament::info-list-item label="Phone" :value="$supplier->phone" />
            <x-filament::info-list-item label="Email" :value="$supplier->email" />
            <x-filament::info-list-item label="Address" :value="$supplier->address" />
            <x-filament::info-list-item label="City" :value="$supplier->city" />
            <x-filament::info-list-item label="State" :value="$supplier->state" />
            <x-filament::info-list-item label="Country" :value="$supplier->country" />
            <x-filament::info-list-item label="Postal Code" :value="$supplier->postal_code" />
            <x-filament::info-list-item label="ID Number" :value="$supplier->id_number" />
            @if ($supplier->image)
                <x-filament::info-list-item label="Image">
                    <img src="{{ asset('storage/' . $supplier->image) }}" alt="{{ $supplier->name }}" />
                </x-filament::info-list-item>
            @endif
        </x-filament::info-list>
    </div>
</x-filament-panels::page>
