<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ __('Order') }} {{ $orderNumber }} - {{ __('Print') }}</title>
    <style>
        /* Thermal printer friendly styles */
        @page {
            margin: 0;
        }
        body {
            font-family: 'Courier New', monospace;
            font-size: 10px;
            line-height: 1.1;
            width: 80mm; /* Standard thermal paper width */
            margin: 0 auto;
            padding: 5px;
            direction: rtl;
            text-align: right;
        }
        .header {
            text-align: center;
            margin-bottom: 10px;
            border-bottom: 1px dashed #000;
            padding-bottom: 5px;
        }
        .store-name {
            font-size: 14px;
            font-weight: bold;
        }
        .info {
            margin-bottom: 10px;
        }
        .items {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .items th {
            text-align: right;
            border-bottom: 1px solid #000;
            font-weight: bold;
            font-size: 9px;
        }
        .items td, .items th {
            padding: 2px 0;
            font-size: 9px;
        }
        .price {
            text-align: left;
        }
        .total-row {
            border-top: 1px solid #000;
            font-weight: bold;
        }
        .totals {
            text-align: left;
            margin-bottom: 10px;
        }
        .footer {
            text-align: center;
            border-top: 1px dashed #000;
            padding-top: 5px;
            font-size: 8px;
        }
        .divider {
            border-bottom: 1px dashed #000;
            margin: 5px 0;
        }
        .unit-type {
            font-size: 8px;
            color: #666;
        }
        .notes {
            font-size: 8px;
            color: #666;
            font-style: italic;
        }
        .discount {
            font-size: 8px;
            color: #28a745;
        }
        @media print {
            body {
                width: 80mm;
            }
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="store-name">{{ config('app.name', 'Store') }}</div>
        <div>{{ __('ORDER RECEIPT') }}</div>
    </div>
    
    <div class="info">
        <div><strong>{{ __('Order') }}:</strong> {{ $orderNumber }}</div>
        <div><strong>{{ __('Date') }}:</strong> {{ $order->created_at->format('Y-m-d H:i') }}</div>
        <div><strong>{{ __('Status') }}:</strong> {{ ucfirst($order->order_status) }}</div>
        <div><strong>{{ __('Payment Status') }}:</strong> {{ $order->payment_status === 'paid' ? __('Paid') : __('Pending') }}</div>
    </div>
    
    <div class="divider"></div>
    
    <table class="items">
        <thead>
            <tr>
                <th>{{ __('Product') }}</th>
                <th>{{ __('Type') }}</th>
                <th>{{ __('Qty') }}</th>
                <th class="price">{{ __('Price') }}</th>
                <th class="price">{{ __('Total') }}</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
                <tr>
                    <td>
                        {{ $item->product->name ?? __('Unknown Product') }}
                        @if($item->notes)
                            <div class="notes">{{ $item->notes }}</div>
                        @endif
                    </td>
                    <td>
                        <div>{{ $item->unit_type === 'wholesale' ? __('Wholesale') : __('Retail') }}</div>
                        <div class="unit-type">{{ $item->unit_name ?? __('Unit') }}</div>
                    </td>
                    <td>
                        @if($item->unit_type === 'wholesale')
                            {{ number_format($item->quantity / ($item->unit_amount ?? 1), 2) }}
                            <div class="unit-type">({{ $item->quantity }} {{ __('pieces') }})</div>
                        @else
                            {{ $item->quantity }}
                        @endif
                    </td>
                    <td class="price">
                        {{ number_format($item->unit_price, 2) }}
                        <div class="unit-type">per {{ $item->unit_type === 'wholesale' ? ($item->unit_name ?? __('unit')) : __('piece') }}</div>
                    </td>
                    <td class="price">
                        {{ number_format($item->subtotal, 2) }}
                        @if($item->discount_amount > 0)
                            <div class="discount">-{{ number_format($item->discount_amount, 2) }}</div>
                        @endif
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
    
    <div class="divider"></div>
    
    <div class="totals">
        <div><strong>{{ __('Subtotal') }}:</strong> {{ $subtotal }}</div>
        <div><strong>{{ __('Tax') }}:</strong> {{ $tax }}</div>
        <div class="total-row"><strong>{{ __('Total Amount') }}:</strong> {{ $total }}</div>
    </div>
    
    <div class="footer">
        <div>{{ __('Thank you for your business!') }}</div>
        <div>{{ config('app.name', 'Store') }}</div>
        <div>{{ now()->format('Y-m-d H:i:s') }}</div>
    </div>
    
    <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print();" style="padding: 10px 20px; background: #4338ca; color: white; border: none; border-radius: 4px; cursor: pointer;">
            {{ __('Print') }}
        </button>
        <button onclick="window.close();" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
            {{ __('Close') }}
        </button>
    </div>
    
    <script>
        // Auto-print on page load
        window.onload = function() {
            // Uncomment to auto-print
            // window.print();
        }
    </script>
</body>
</html> 