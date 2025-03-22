<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="rtl">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Invoice #{{ $order->order_number }}</title>
    <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
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

        body {
            font-family: 'Vazirmatn', sans-serif;
        }
    </style>
</head>

<body class="bg-gradient-to-br from-gray-50 to-indigo-50/30">
    <div class="max-w-4xl mx-auto my-8">
        <!-- Top Decoration -->
        <div class="h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-t-xl"></div>

        <div class="bg-white shadow-lg border border-gray-100 p-8 relative overflow-hidden">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-[0.02] pointer-events-none">
                <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\" 20\"
                    height=\"20\" viewBox=\"0 0 20 20\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath
                    d=\"M1 0h2v2H1V0z\" fill=\"%236366F1\"/%3E%3C/svg%3E');"></div>
            </div>

            <div class="relative">
                <!-- Header -->
                <div class="flex justify-between items-start mb-12">
                    <div>
                        <div class="flex items-center gap-4 mb-4">
                            <div class="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl px-6 py-3">
                                <h1 class="text-3xl font-bold text-white">فاکتور</h1>
                            </div>
                            <div
                                class="h-12 w-12 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>

                        <!-- Customer Info -->
                        <div class="mb-12">
                            <div class="flex items-center gap-2 mb-4">
                                <div
                                    class="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-600" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h3 class="text-lg font-bold text-gray-900">اطلاعات مشتری</h3>
                            </div>
                            <div
                                class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100/50">
                                <div class="grid grid-cols-2 gap-6">
                                    <div>
                                        <p class="font-bold text-gray-900 mb-1">{{ $order->customer->name }}</p>
                                        <p class="text-gray-600">{{ $order->customer->email }}</p>
                                    </div>
                                    <div>
                                        <p class="text-gray-600">{{ $order->customer->phone }}</p>
                                        <p class="text-gray-600">{{ $order->customer->address }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div
                            class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-indigo-100/50">
                            <div class="mb-4 pb-4 border-b border-indigo-100">
                                <h2 class="text-2xl font-bold text-indigo-600">{{ $order->order_number }}</h2>
                                <p class="text-gray-500 mt-1">تاریخ: {{ $order->created_at->format('Y/m/d') }}</p>
                                <!-- Add Barcode -->
                                <div class="mt-4 flex justify-center">
                                    <svg id="orderBarcode"></svg>
                                </div>
                                <script>
                                    // Initialize barcode after DOM is loaded
                                    document.addEventListener('DOMContentLoaded', function () {
                                        JsBarcode("#orderBarcode", "{{ $order->order_number }}", {
                                            format: "CODE128",
                                            width: 2,
                                            height: 100,
                                            displayValue: true,
                                            fontSize: 20,
                                            font: 'Vazirmatn',
                                            textAlign: "center",
                                            textPosition: "bottom",
                                            textMargin: 10,
                                            background: "#fff",
                                        });
                                        // Add a small delay before printing to ensure barcode is rendered
                                        setTimeout(function () {
                                            window.print();
                                        }, 500);
                                    });
                                </script>
                            </div>
                            <div class="space-y-1">
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-600">وضعیت سفارش:</span>
                                    <span class="font-medium {{
    $order->order_status === 'completed' ? 'text-emerald-600' :
    ($order->order_status === 'processing' ? 'text-blue-600' : 'text-amber-600')
                                    }}">{{ ucfirst($order->order_status) }}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-600">وضعیت پرداخت:</span>
                                    <span
                                        class="font-medium {{ $order->payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-600' }}">
                                        {{ ucfirst($order->payment_status) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Order Items -->
                <div class="mb-12">
                    <div class="flex items-center gap-2 mb-4">
                        <div
                            class="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-600" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-bold text-gray-900">اقلام سفارش</h3>
                    </div>
                    <div
                        class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl overflow-hidden border border-indigo-100/50">
                        <table class="w-full">
                            <thead>
                                <tr class="bg-gradient-to-r from-purple-500/10 to-indigo-500/10">
                                    <th class="px-6 py-4 text-right text-sm font-bold text-gray-900">محصول</th>
                                    <th class="px-6 py-4 text-center text-sm font-bold text-gray-900">تعداد</th>
                                    <th class="px-6 py-4 text-left text-sm font-bold text-gray-900">قیمت واحد</th>
                                    <th class="px-6 py-4 text-left text-sm font-bold text-gray-900">جمع</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-indigo-100">
                                @foreach($order->items as $item)
                                    <tr
                                        class="hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-colors duration-150">
                                        <td class="px-6 py-4">
                                            <div>
                                                <p class="font-medium text-gray-900">{{ $item->product->name }}</p>
                                                @if($item->notes)
                                                    <p class="text-sm text-gray-500 mt-1">{{ $item->notes }}</p>
                                                @endif
                                            </div>
                                        </td>
                                        <td class="px-6 py-4">
                                            <div class="flex items-center justify-center">
                                                <span
                                                    class="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                                                    {{ $item->quantity }}
                                                </span>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 text-left font-medium text-gray-900">
                                            ${{ number_format($item->unit_price, 2) }}</td>
                                        <td class="px-6 py-4 text-left font-bold text-indigo-600">
                                            ${{ number_format($item->quantity * $item->unit_price, 2) }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Summary -->
                <div class="flex justify-end mb-12">
                    <div class="w-80 space-y-3">
                        <div
                            class="flex justify-between px-6 py-3 bg-gradient-to-r from-gray-50 to-indigo-50/30 rounded-xl">
                            <span class="text-gray-600">جمع کل:</span>
                            <span class="font-bold text-gray-900">${{ number_format($order->subtotal, 2) }}</span>
                        </div>
                        <div
                            class="flex justify-between px-6 py-3 bg-gradient-to-r from-gray-50 to-indigo-50/30 rounded-xl">
                            <span class="text-gray-600">مالیات:</span>
                            <span class="font-bold text-gray-900">${{ number_format($order->tax_amount, 2) }}</span>
                        </div>
                        @if($order->discount_amount > 0)
                            <div
                                class="flex justify-between px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                                <span class="text-gray-600">تخفیف:</span>
                                <span
                                    class="font-bold text-emerald-600">-${{ number_format($order->discount_amount, 2) }}</span>
                            </div>
                        @endif
                        <div
                            class="flex justify-between px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl">
                            <span class="font-bold text-white">مبلغ نهایی:</span>
                            <span class="font-bold text-white">${{ number_format($order->total_amount, 2) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Notes -->
                @if($order->notes)
                    <div class="mb-8">
                        <div class="flex items-center gap-2 mb-4">
                            <div
                                class="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-600" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <h3 class="text-lg font-bold text-gray-900">یادداشت‌ها</h3>
                        </div>
                        <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100/50">
                            <p class="text-gray-700">{{ $order->notes }}</p>
                        </div>
                    </div>
                @endif

                <!-- Footer -->
                <div class="mt-12 pt-8 border-t border-gray-100">
                    <div class="text-center text-gray-500 text-sm">
                        <p>این فاکتور به صورت الکترونیکی صادر شده و نیاز به مهر و امضا ندارد.</p>
                        <p class="mt-2">برای پیگیری سفارش خود می‌توانید با شماره {{ $order->order_number }} به پنل
                            کاربری مراجعه نمایید.</p>
                    </div>
                </div>

                <!-- Print Button -->
                <div class="mt-8 text-center no-print">
                    <button onclick="window.print()"
                        class="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                        چاپ فاکتور
                    </button>
                </div>
            </div>
        </div>

        <!-- Bottom Decoration -->
        <div class="h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-b-xl"></div>
    </div>
</body>

</html>