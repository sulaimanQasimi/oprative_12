<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Invoice #{{ $order->order_number }}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css'])
    <style>
        @media print {
            @page {
                margin: 0;
                size: A4;
            }
            body {
                margin: 1.6cm;
            }
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body class="bg-gray-50" onload="window.print()">
    <div class="max-w-4xl mx-auto my-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <!-- Header -->
        <div class="flex justify-between items-start mb-8">
            <div>
                <div class="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl px-4 py-2 inline-block">
                    <h1 class="text-2xl font-bold text-white">INVOICE</h1>
                </div>
                <div class="mt-4 text-gray-600">
                    <p>{{ config('app.name') }}</p>
                    <p>123 Business Street</p>
                    <p>City, Country 12345</p>
                </div>
            </div>
            <div class="text-right">
                <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100/50">
                    <h2 class="text-xl font-bold text-amber-600">{{ $order->order_number }}</h2>
                    <p class="text-gray-600 mt-1">{{ $order->created_at->format('F d, Y') }}</p>
                </div>
            </div>
        </div>

        <!-- Customer Info -->
        <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Bill To:</h3>
            <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4">
                <p class="font-medium text-gray-800">{{ $order->customer->name }}</p>
                <p class="text-gray-600">{{ $order->customer->email }}</p>
                <p class="text-gray-600">{{ $order->customer->phone }}</p>
                <p class="text-gray-600">{{ $order->customer->address }}</p>
            </div>
        </div>

        <!-- Order Items -->
        <div class="mb-8">
            <div class="bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl overflow-hidden">
                <table class="w-full">
                    <thead>
                        <tr class="bg-gradient-to-r from-purple-500/10 to-indigo-500/10">
                            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700">Quantity</th>
                            <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">Unit Price</th>
                            <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        @foreach($order->items as $item)
                            <tr class="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-indigo-50/50 transition-colors duration-150">
                                <td class="px-4 py-3 text-gray-800">{{ $item->product->name }}</td>
                                <td class="px-4 py-3 text-center text-gray-600">{{ $item->quantity }}</td>
                                <td class="px-4 py-3 text-right text-gray-600">${{ number_format($item->unit_price, 2) }}</td>
                                <td class="px-4 py-3 text-right font-medium text-indigo-600">${{ number_format($item->quantity * $item->unit_price, 2) }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Summary -->
        <div class="flex justify-end mb-8">
            <div class="w-72 space-y-3">
                <div class="flex justify-between px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                    <span class="text-gray-600">Subtotal:</span>
                    <span class="font-medium text-gray-800">${{ number_format($order->subtotal, 2) }}</span>
                </div>
                <div class="flex justify-between px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                    <span class="text-gray-600">Tax:</span>
                    <span class="font-medium text-gray-800">${{ number_format($order->tax_amount, 2) }}</span>
                </div>
                @if($order->discount_amount > 0)
                    <div class="flex justify-between px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                        <span class="text-gray-600">Discount:</span>
                        <span class="font-medium text-emerald-600">-${{ number_format($order->discount_amount, 2) }}</span>
                    </div>
                @endif
                <div class="flex justify-between px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
                    <span class="font-medium text-white">Total:</span>
                    <span class="font-bold text-white">${{ number_format($order->total_amount, 2) }}</span>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-100 pt-8">
            <div class="grid grid-cols-3 gap-8">
                <div class="text-center">
                    <div class="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl mb-2">
                        <p class="text-sm font-medium text-gray-600">Payment Status</p>
                        <p class="text-lg font-semibold {{ $order->payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-600' }}">
                            {{ ucfirst($order->payment_status) }}
                        </p>
                    </div>
                </div>
                <div class="text-center">
                    <div class="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl mb-2">
                        <p class="text-sm font-medium text-gray-600">Payment Method</p>
                        <p class="text-lg font-semibold text-gray-800">{{ ucfirst($order->payment_method) }}</p>
                    </div>
                </div>
                <div class="text-center">
                    <div class="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl mb-2">
                        <p class="text-sm font-medium text-gray-600">Order Status</p>
                        <p class="text-lg font-semibold {{
                            $order->order_status === 'completed' ? 'text-emerald-600' :
                            ($order->order_status === 'processing' ? 'text-blue-600' : 'text-amber-600')
                        }}">
                            {{ ucfirst($order->order_status) }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Notes -->
        @if($order->notes)
            <div class="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4">
                <h4 class="font-medium text-amber-800 mb-2">Notes:</h4>
                <p class="text-amber-700">{{ $order->notes }}</p>
            </div>
        @endif

        <!-- Print Button (visible only on screen) -->
        <div class="mt-8 text-center no-print">
            <button onclick="window.print()" class="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105">
                Print Invoice
            </button>
        </div>
    </div>
</body>
</html>