<div dir="rtl" class="p-8 bg-white shadow-lg rounded-lg">
    <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold">{{ __('Sales') }}</h1>
        <div class="text-right">
            <p class="text-gray-600">{{ __('Invoice #') }}: {{ $sale->id }}</p>
            <p class="text-gray-600">{{ __('Invoice Date') }}: {{ $sale->created_at->format('Y-m-d') }}</p>
        </div>
    </div>

    <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">{{ __('Customer Information') }}</h2>
        <div class="grid grid-cols-2 gap-4">
            <div>
                <p class="font-medium">{{ $sale->customer->name }}</p>
                <p class="text-gray-600">{{ $sale->customer->email }}</p>
                <p class="text-gray-600">{{ $sale->customer->phone }}</p>
            </div>
            <div class="text-right">
                <p class="text-gray-600">{{ __('Address') }}: {{ $sale->customer->address }}</p>
                <p class="text-gray-600">{{ __('Notes') }}: {{ $sale->notes }}</p>
            </div>
        </div>
    </div>

    <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">{{ __('Sale Items') }}</h2>
        <table class="w-full text-right">
            <thead>
                <tr class="bg-gray-100">
                    <th class="px-4 py-2">{{ __('Product') }}</th>
                    <th class="px-4 py-2">{{ __('Quantity') }}</th>
                    <th class="px-4 py-2">{{ __('Price') }}</th>
                    <th class="px-4 py-2">{{ __('Total') }}</th>
                </tr>
            </thead>
            <tbody>
                @foreach($sale->items as $item)
                <tr class="border-b">
                    <td class="px-4 py-2">{{ $item->product->name }}</td>
                    <td class="px-4 py-2">{{ $item->quantity }}</td>
                    <td class="px-4 py-2">{{ number_format($item->price) }}</td>
                    <td class="px-4 py-2">{{ number_format($item->quantity * $item->price) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="text-right">
        <p class="text-xl font-semibold">{{ __('Total Amount') }}: {{ number_format($sale->total_amount) }}</p>
        <p class="text-gray-600">{{ __('Balance Due') }}: {{ number_format($sale->balance_due) }}</p>
    </div>

    <div class="mt-8 text-center text-gray-500">
        <p>{{ __('This is a computer generated invoice.') }}</p>
        <p>{{ __('Thank you for your business!') }}</p>
    </div>
</div>