<div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 sm:max-w-4xl sm:mx-auto">
        <div class="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
            <div class="max-w-4xl mx-auto">
                <!-- Invoice Header -->
                <div class="flex justify-between items-center mb-8">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">PURCHASE INVOICE</h1>
                        <p class="text-sm text-gray-600">Invoice #: {{ $purchase->invoice_number }}</p>
                        <p class="text-sm text-gray-600">Date: {{ $purchase->invoice_date->format('d/m/Y') }}</p>
                    </div>
                    <div class="text-right">
                        <h2 class="text-xl font-semibold text-gray-900">Company Name</h2>
                        <p class="text-sm text-gray-600">123 Business Street</p>
                        <p class="text-sm text-gray-600">City, Country</p>
                        <p class="text-sm text-gray-600">Phone: +1234567890</p>
                    </div>
                </div>

                <!-- Supplier & Purchase Details -->
                <div class="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Supplier Details</h3>
                        <div class="text-sm text-gray-600">
                            <p>{{ $purchase->supplier->name }}</p>
                            <p>{{ $purchase->supplier->address }}</p>
                            <p>Phone: {{ $purchase->supplier->phone }}</p>
                            <p>Email: {{ $purchase->supplier->email }}</p>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Purchase Details</h3>
                        <div class="text-sm text-gray-600">
                            <p>Status: <span class="font-medium">{{ ucfirst($purchase->status) }}</span></p>
                            <p>Currency: {{ $purchase->currency->code }}</p>
                            <p>Exchange Rate: {{ $purchase->currency_rate }}</p>
                            <p>Warehouse: {{ $purchase->warehouse->name ?? 'N/A' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Items Table -->
                <div class="mb-8">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            @foreach($purchase->purchaseItems as $item)
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $item->product->name }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{{ $item->quantity }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{{ number_format($item->price, 2) }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{{ number_format($item->total_price, 2) }}</td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>

                <!-- Summary -->
                <div class="border-t pt-8">
                    <div class="flex justify-end">
                        <div class="w-64">
                            <div class="flex justify-between mb-2">
                                <span class="text-sm font-medium text-gray-600">Total Amount:</span>
                                <span class="text-sm font-bold text-gray-900">{{ $purchase->currency->code }} {{ number_format($purchase->total_amount, 2) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer Notes -->
                <div class="mt-8 pt-8 border-t">
                    <p class="text-sm text-gray-600">Thank you for your business!</p>
                    <p class="text-xs text-gray-500 mt-2">This is a computer generated invoice.</p>
                </div>
            </div>
        </div>
    </div>
</div>