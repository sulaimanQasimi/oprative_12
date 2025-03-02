<html>

<head>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <style>
        @media print {
            body {
                margin: 0;
                padding: 0;
            }
            .print-container {
                width: 210mm;
                min-height: 297mm;
                padding: 10mm;
                margin: 0 auto;
                background: white;
            }
            .page-break {
                page-break-after: always;
            }
            @page {
                size: A4;
                margin: 0;
            }
        }
        .invoice-header {
            background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
            color: white;
            border-radius: 0.75rem;
            padding: 2rem;
            margin-bottom: 2rem;
        }
        .invoice-header h1 {
            color: white;
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        .invoice-header p {
            color: rgba(255, 255, 255, 0.9);
        }
        .details-card {
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 1.5rem;
            background: #f9fafb;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .status-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-weight: 500;
            background: #10b981;
            color: white;
        }
        .table-header {
            background: #4f46e5;
            color: white;
        }
        .table-header th {
            color: white !important;
        }
        .table-row-alt:nth-child(even) {
            background: #f9fafb;
        }
    </style>
</head>
<body class="bg-white print:bg-white">
    <div class="print-container">
        <div class="max-w-4xl mx-auto">
            <!-- Invoice Header -->
            <div class="invoice-header flex justify-between items-center">
                <div>
                    <h1 class="font-bold">PURCHASE INVOICE</h1>
                    <p class="text-sm">Invoice #: {{ $purchase->invoice_number }}</p>
                    <p class="text-sm">Date: {{ $purchase->invoice_date->format('d/m/Y') }}</p>
                </div>
                <div class="text-right">
                    <h2 class="text-xl font-semibold text-white mb-2">{{ config('invoice.company.name') }}</h2>
                    <p class="text-sm text-white opacity-90">{{ config('invoice.company.address.street') }}</p>
                    <p class="text-sm text-white opacity-90">{{ config('invoice.company.address.city') }}, {{ config('invoice.company.address.country') }}</p>
                    <p class="text-sm text-white opacity-90">Phone: {{ config('invoice.company.contact.phone') }}</p>
                </div>
            </div>

            <!-- Supplier & Purchase Details -->
            <div class="grid grid-cols-2 gap-6 mb-6">
                <div class="details-card">
                    <h3 class="text-lg font-semibold text-indigo-600 mb-3">Supplier Details</h3>
                    <div class="text-sm text-gray-600 space-y-2">
                        <p>{{ $purchase->supplier->name }}</p>
                        <p>{{ $purchase->supplier->address }}</p>
                        <p>Phone: {{ $purchase->supplier->phone }}</p>
                        <p>Email: {{ $purchase->supplier->email }}</p>
                    </div>
                </div>
                <div class="details-card">
                    <h3 class="text-lg font-semibold text-indigo-600 mb-3">Purchase Details</h3>
                    <div class="text-sm text-gray-600 space-y-2">
                        <p>Status: <span class="status-badge">{{ match($purchase->status) {
                            'purchase' => 'Purchase',
                            'onway' => 'On Way',
                            'on_border' => 'On Border',
                            'on_plan' => 'On Plan',
                            'on_ship' => 'On Ship',
                            'arrived' => 'Arrived',
                            'warehouse_moved' => 'Moved to Warehouse',
                            'return' => 'Return',
                            default => ucfirst($purchase->status)
                        } }}</span></p>
                        <div class="flex flex-col gap-2">
                            <p>Currency: {{ $purchase->currency->code }}</p>
                            <div class="flex items-center gap-2">
                                <span class="text-indigo-600 font-medium">Exchange Rate:</span>
                                <span class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">{{ number_format($purchase->currency_rate, 4) }}</span>
                            </div>
                        </div>
                        <p>Warehouse: {{ $purchase->warehouse->name ?? 'N/A' }}</p>
                    </div>
                </div>
            </div>

            <!-- Items Table -->
            <div class="mb-6">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr class="table-header">
                            <th class="px-4 py-3 text-left text-xs font-medium uppercase">Product</th>
                            <th class="px-4 py-3 text-right text-xs font-medium uppercase">Quantity</th>
                            <th class="px-4 py-3 text-right text-xs font-medium uppercase">Price</th>
                            <th class="px-4 py-3 text-right text-xs font-medium uppercase">Total</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        @foreach($purchase->purchaseItems as $item)
                            <tr class="table-row-alt hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3 text-sm text-gray-900">{{ $item->product->name }}</td>
                                <td class="px-4 py-3 text-sm text-gray-900 text-right">{{ $item->quantity }}</td>
                                <td class="px-4 py-3 text-sm text-gray-900 text-right">{{ number_format($item->price, 2) }}</td>
                                <td class="px-4 py-3 text-sm text-gray-900 text-right font-medium">{{ number_format($item->total_price, 2) }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <!-- Summary -->
            <div class="border-t pt-6">
                <div class="flex justify-end">
                    <div class="w-64 bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-medium text-indigo-600">Total Amount:</span>
                            <span class="text-lg font-bold text-indigo-700">{{ $purchase->currency->code }} {{ number_format($purchase->total_amount, 2) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Payment History -->
            <div class="mt-6 pt-6 border-t">
                <h3 class="text-lg font-semibold text-indigo-600 mb-4">Payment History</h3>
                <div class="overflow-hidden rounded-lg border border-gray-200 mb-4">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            @php
                                $runningBalance = $purchase->total_amount;
                            @endphp
                            @forelse($purchase->purchasePayments as $payment)
                                @php
                                    $runningBalance -= $payment->amount;
                                @endphp
                                <tr class="hover:bg-gray-50 transition-colors">
                                    <td class="px-4 py-3 text-sm text-gray-900">{{ $payment->payment_date->format('d/m/Y') }}</td>
                                    <td class="px-4 py-3 text-sm text-gray-900">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {{ $payment->payment_method === 'cash' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800' }}">
                                            {{ ucfirst($payment->payment_method) }}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-sm text-gray-900 text-right">{{ $purchase->currency->code }} {{ number_format($payment->amount, 2) }}</td>
                                    <td class="px-4 py-3 text-sm font-medium text-right {{ $runningBalance <= 0 ? 'text-green-600' : 'text-red-600' }}">{{ $purchase->currency->code }} {{ number_format($runningBalance, 2) }}</td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="4" class="px-4 py-3 text-sm text-gray-500 text-center">No payments recorded</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>

                <!-- Payment Summary -->
                <div class="flex justify-end space-x-4 items-start">
                    <div class="w-64 bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                        <div class="space-y-3">
                            <div class="flex justify-between items-center">
                                <span class="text-sm font-medium text-indigo-600">Total Amount:</span>
                                <span class="text-sm font-bold text-indigo-700">{{ $purchase->currency->code }} {{ number_format($purchase->total_amount, 2) }}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-sm font-medium text-indigo-600">Paid Amount:</span>
                                <span class="text-sm font-bold text-green-600">{{ $purchase->currency->code }} {{ number_format($purchase->purchasePayments->sum('amount'), 2) }}</span>
                            </div>
                            <div class="pt-2 border-t border-indigo-200">
                                <div class="flex justify-between items-center">
                                    <span class="text-sm font-medium text-indigo-600">Balance Due:</span>
                                    <span class="text-sm font-bold {{ $purchase->total_amount - $purchase->purchasePayments->sum('amount') <= 0 ? 'text-green-600' : 'text-red-600' }}">{{ $purchase->currency->code }} {{ number_format($purchase->total_amount - $purchase->purchasePayments->sum('amount'), 2) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer Notes -->
            <div class="mt-6 pt-4 border-t">
                <p class="text-sm text-gray-600">Thank you for your business!</p>
                <p class="text-xs text-gray-500 mt-1">This is a computer generated invoice.</p>
            </div>
        </div>
    </div>
</body>
</html>
