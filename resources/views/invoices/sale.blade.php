<div dir="rtl" class="p-8 bg-blue-500 shadow-lg rounded-lg">
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

    <!-- POS Product Table Section -->
    <div class="mt-12 bg-white rounded-lg shadow-md p-6">
        <div class="mb-6">
            <input type="text"
                   id="product-search"
                   placeholder="{{ __('Search products...') }}"
                   class="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200"
                   onkeyup="filterProducts()">
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-right" id="pos-table">
                <thead>
                    <tr class="bg-gray-50">
                        <th class="px-6 py-3 text-sm font-semibold text-gray-600 rounded-tr-lg">{{ __('Product Name') }}</th>
                        <th class="px-6 py-3 text-sm font-semibold text-gray-600">{{ __('Price') }}</th>
                        <th class="px-6 py-3 text-sm font-semibold text-gray-600">{{ __('Quantity') }}</th>
                        <th class="px-6 py-3 text-sm font-semibold text-gray-600 rounded-tl-lg">{{ __('Total') }}</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    @foreach($sale->items as $item)
                    <tr class="hover:bg-gray-50 transition duration-150">
                        <td class="px-6 py-4 text-sm text-gray-800">{{ $item->product->name }}</td>
                        <td class="px-6 py-4 text-sm text-gray-800">{{ number_format($item->price) }}</td>
                        <td class="px-6 py-4">
                            <input type="number"
                                   value="{{ $item->quantity }}"
                                   min="1"
                                   class="w-20 px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                   onchange="updateTotal(this)">
                        </td>
                        <td class="px-6 py-4 text-sm font-medium text-gray-800 item-total">
                            {{ number_format($item->quantity * $item->price) }}
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>

    <script>
    function filterProducts() {
        const input = document.getElementById('product-search');
        const filter = input.value.toLowerCase();
        const table = document.getElementById('pos-table');
        const rows = table.getElementsByTagName('tr');

        for (let i = 1; i < rows.length; i++) {
            const productName = rows[i].getElementsByTagName('td')[0];
            if (productName) {
                const text = productName.textContent || productName.innerText;
                rows[i].style.display = text.toLowerCase().indexOf(filter) > -1 ? '' : 'none';
            }
        }
    }

    function updateTotal(input) {
        const row = input.closest('tr');
        const price = parseFloat(row.cells[1].textContent.replace(/,/g, ''));
        const quantity = parseFloat(input.value);
        const total = price * quantity;
        row.querySelector('.item-total').textContent = total.toLocaleString();
    }
    </script>
</div>