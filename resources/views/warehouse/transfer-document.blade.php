<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>سند انتقال انبار - {{ $transfer->reference_number }}</title>
    <style>
        @media print {
            @page {
                margin: 1cm;
                size: A4;
            }
            
            body {
                margin: 0;
                padding: 0;
            }
            
            .no-print {
                display: none !important;
            }
            
            .page-break {
                page-break-before: always;
            }
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Vazirmatn', 'Tahoma', 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
            padding: 20px;
            direction: rtl;
            text-align: right;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            padding: 30px;
            text-align: center;
            position: relative;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
        }

        .header h1 {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
        }

        .header .subtitle {
            font-size: 16px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }

        .document-info {
            background: #f8fafc;
            padding: 20px;
            border-bottom: 2px solid #e2e8f0;
        }

        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        .info-section {
            background: white;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }

        .info-section h3 {
            color: #3b82f6;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
            flex-direction: row-reverse;
        }

        .info-label {
            font-weight: 600;
            color: #64748b;
        }

        .info-value {
            font-weight: 500;
            color: #1e293b;
        }

        .warehouse-section {
            background: white;
            padding: 25px;
            border-bottom: 2px solid #e2e8f0;
        }

        .warehouse-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }

        .warehouse-card {
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            position: relative;
        }

        .warehouse-card.from {
            border-color: #ef4444;
        }

        .warehouse-card.to {
            border-color: #10b981;
        }

        .warehouse-card h3 {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            text-align: center;
            padding: 8px;
            border-radius: 4px;
        }

        .warehouse-card.from h3 {
            background: #fef2f2;
            color: #dc2626;
        }

        .warehouse-card.to h3 {
            background: #f0fdf4;
            color: #059669;
        }

        .warehouse-details {
            margin-bottom: 20px;
        }

        .warehouse-detail {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
            flex-direction: row-reverse;
        }

        .warehouse-detail .label {
            font-weight: 600;
            color: #64748b;
        }

        .warehouse-detail .value {
            font-weight: 500;
            color: #1e293b;
        }

        .items-section {
            background: white;
            padding: 25px;
        }

        .items-section h3 {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #1e293b;
            text-align: center;
            padding-bottom: 10px;
            border-bottom: 2px solid #e2e8f0;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .items-table th {
            background: #f1f5f9;
            padding: 12px 8px;
            text-align: right;
            font-weight: bold;
            font-size: 12px;
            color: #475569;
            border-bottom: 2px solid #e2e8f0;
        }

        .items-table td {
            padding: 12px 8px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 12px;
            vertical-align: top;
            text-align: right;
        }

        .items-table tr:nth-child(even) {
            background: #f8fafc;
        }

        .product-name {
            font-weight: 600;
            color: #1e293b;
        }

        .product-barcode {
            font-size: 11px;
            color: #64748b;
            margin-top: 2px;
        }

        .batch-info {
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 4px;
            padding: 8px;
            margin-top: 5px;
        }

        .batch-number {
            font-weight: 600;
            color: #0369a1;
            font-size: 11px;
        }

        .expiry-info {
            font-size: 10px;
            color: #64748b;
            margin-top: 2px;
        }

        .expiry-warning {
            color: #dc2626;
            font-weight: 600;
        }

        .quantity-info {
            text-align: center;
        }

        .quantity-amount {
            font-weight: bold;
            color: #1e293b;
            font-size: 14px;
        }

        .quantity-unit {
            font-size: 11px;
            color: #64748b;
            margin-top: 2px;
        }

        .notes-section {
            background: #f8fafc;
            padding: 20px;
            border-top: 2px solid #e2e8f0;
        }

        .notes-section h3 {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #1e293b;
        }

        .notes-content {
            background: white;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
            min-height: 60px;
        }

        .signatures-section {
            background: white;
            padding: 30px;
            border-top: 2px solid #e2e8f0;
        }

        .signatures-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
        }

        .signature-box {
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            min-height: 120px;
            position: relative;
        }

        .signature-box h4 {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #1e293b;
        }

        .signature-line {
            border-bottom: 2px solid #cbd5e1;
            margin: 20px 0 10px 0;
            height: 40px;
        }

        .signature-info {
            font-size: 12px;
            color: #64748b;
        }

        .footer {
            background: #1e293b;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 12px;
        }

        .footer p {
            margin-bottom: 5px;
        }

        .print-button {
            position: fixed;
            top: 20px;
            left: 20px;
            background: #3b82f6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            transition: all 0.3s ease;
            font-family: 'Vazirmatn', 'Tahoma', 'Arial', sans-serif;
        }

        .print-button:hover {
            background: #2563eb;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        }

        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .status-pending {
            background: #fef3c7;
            color: #d97706;
        }

        .status-completed {
            background: #d1fae5;
            color: #059669;
        }

        .status-cancelled {
            background: #fee2e2;
            color: #dc2626;
        }

        .total-summary {
            background: #f8fafc;
            padding: 15px;
            border-radius: 6px;
            margin-top: 20px;
            border: 1px solid #e2e8f0;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
            flex-direction: row-reverse;
        }

        .total-row:last-child {
            margin-bottom: 0;
            font-weight: bold;
            font-size: 16px;
            color: #1e293b;
            border-top: 1px solid #e2e8f0;
            padding-top: 8px;
        }

        @media (max-width: 768px) {
            .info-grid,
            .warehouse-grid,
            .signatures-grid {
                grid-template-columns: 1fr;
            }
            
            .items-table {
                font-size: 11px;
            }
            
            .items-table th,
            .items-table td {
                padding: 8px 4px;
            }
        }
    </style>
</head>
<body>
    <button onclick="window.print()" class="print-button no-print">
        🖨️ Print Document
    </button>

    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>WAREHOUSE TRANSFER DOCUMENT</h1>
            <div class="subtitle">Inventory Transfer Authorization</div>
        </div>

        <!-- Document Information -->
        <div class="document-info">
            <div class="info-grid">
                <div class="info-section">
                    <h3>Transfer Details</h3>
                    <div class="info-row">
                        <span class="info-label">Reference Number:</span>
                        <span class="info-value">{{ $transfer->reference_number }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Transfer Date:</span>
                        <span class="info-value">{{ $transfer->transfer_date->format('F j, Y') }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Status:</span>
                        <span class="info-value">
                            <span class="status-badge status-{{ $transfer->status }}">
                                {{ ucfirst($transfer->status) }}
                            </span>
                        </span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Created By:</span>
                        <span class="info-value">{{ $transfer->creator->name ?? 'System' }}</span>
                    </div>
                </div>

                <div class="info-section">
                    <h3>Document Information</h3>
                    <div class="info-row">
                        <span class="info-label">Document Type:</span>
                        <span class="info-value">Warehouse Transfer</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Generated On:</span>
                        <span class="info-value">{{ now()->format('F j, Y \a\t g:i A') }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Total Items:</span>
                        <span class="info-value">{{ $transfer->transferItems->count() }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Total Quantity:</span>
                        <span class="info-value">{{ number_format($transfer->total_quantity) }} units</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Warehouse Information -->
        <div class="warehouse-section">
            <div class="warehouse-grid">
                <!-- Source Warehouse -->
                <div class="warehouse-card from">
                    <h3>📤 Source Warehouse</h3>
                    <div class="warehouse-details">
                        <div class="warehouse-detail">
                            <span class="label">Name:</span>
                            <span class="value">{{ $transfer->fromWarehouse->name }}</span>
                        </div>
                        <div class="warehouse-detail">
                            <span class="label">Code:</span>
                            <span class="value">{{ $transfer->fromWarehouse->code }}</span>
                        </div>
                        <div class="warehouse-detail">
                            <span class="label">Address:</span>
                            <span class="value">{{ $transfer->fromWarehouse->address ?? 'Not specified' }}</span>
                        </div>
                        <div class="warehouse-detail">
                            <span class="label">Status:</span>
                            <span class="value">{{ $transfer->fromWarehouse->is_active ? 'Active' : 'Inactive' }}</span>
                        </div>
                    </div>
                </div>

                <!-- Destination Warehouse -->
                <div class="warehouse-card to">
                    <h3>📥 Destination Warehouse</h3>
                    <div class="warehouse-details">
                        <div class="warehouse-detail">
                            <span class="label">Name:</span>
                            <span class="value">{{ $transfer->toWarehouse->name }}</span>
                        </div>
                        <div class="warehouse-detail">
                            <span class="label">Code:</span>
                            <span class="value">{{ $transfer->toWarehouse->code }}</span>
                        </div>
                        <div class="warehouse-detail">
                            <span class="label">Address:</span>
                            <span class="value">{{ $transfer->toWarehouse->address ?? 'Not specified' }}</span>
                        </div>
                        <div class="warehouse-detail">
                            <span class="label">Status:</span>
                            <span class="value">{{ $transfer->toWarehouse->is_active ? 'Active' : 'Inactive' }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Transfer Items -->
        <div class="items-section">
            <h3>📦 Transfer Items</h3>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Product Information</th>
                        <th>Batch Details</th>
                        <th>Quantity</th>
                        <th>Unit Information</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($transfer->transferItems as $index => $item)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>
                            <div class="product-name">{{ $item->product->name }}</div>
                            <div class="product-barcode">Barcode: {{ $item->product->barcode }}</div>
                            <div class="product-barcode">Type: {{ ucfirst($item->product->type) }}</div>
                        </td>
                        <td>
                            @if($item->batch)
                                <div class="batch-info">
                                    <div class="batch-number">Batch: {{ $item->batch->reference_number }}</div>
                                    @if($item->batch->expire_date)
                                        <div class="expiry-info {{ \Carbon\Carbon::parse($item->batch->expire_date)->isPast() ? 'expiry-warning' : '' }}">
                                            Expires: {{ \Carbon\Carbon::parse($item->batch->expire_date)->format('M j, Y') }}
                                            @if(\Carbon\Carbon::parse($item->batch->expire_date)->isPast())
                                                (EXPIRED)
                                            @elseif(\Carbon\Carbon::parse($item->batch->expire_date)->diffInDays(now()) <= 30)
                                                (Expiring Soon)
                                            @endif
                                        </div>
                                    @endif
                                </div>
                            @else
                                <span style="color: #64748b; font-style: italic;">No batch specified</span>
                            @endif
                        </td>
                        <td>
                            <div class="quantity-info">
                                <div class="quantity-amount">{{ number_format($item->quantity) }}</div>
                                <div class="quantity-unit">pieces</div>
                            </div>
                        </td>
                        <td>
                            <div style="font-size: 11px; color: #64748b;">
                                <div><strong>Type:</strong> {{ ucfirst($item->unit_type) }}</div>
                                @if($item->unit_name)
                                    <div><strong>Unit:</strong> {{ $item->unit_name }}</div>
                                @endif
                                @if($item->unit_amount)
                                    <div><strong>Amount:</strong> {{ $item->unit_amount }}</div>
                                @endif
                            </div>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            <!-- Total Summary -->
            <div class="total-summary">
                <div class="total-row">
                    <span>Total Items:</span>
                    <span>{{ $transfer->transferItems->count() }}</span>
                </div>
                <div class="total-row">
                    <span>Total Quantity:</span>
                    <span>{{ number_format($transfer->total_quantity) }} pieces</span>
                </div>
            </div>
        </div>

        <!-- Notes Section -->
        @if($transfer->notes)
        <div class="notes-section">
            <h3>📝 Additional Notes</h3>
            <div class="notes-content">
                {{ $transfer->notes }}
            </div>
        </div>
        @endif

        <!-- Signatures Section -->
        <div class="signatures-section">
            <div class="signatures-grid">
                <!-- Source Warehouse Signature -->
                <div class="signature-box">
                    <h4>Source Warehouse Authorization</h4>
                    <div class="signature-line"></div>
                    <div class="signature-info">
                        <div>Warehouse Manager</div>
                        <div>{{ $transfer->fromWarehouse->name }}</div>
                        <div>Date: _________________</div>
                    </div>
                </div>

                <!-- Destination Warehouse Signature -->
                <div class="signature-box">
                    <h4>Destination Warehouse Authorization</h4>
                    <div class="signature-line"></div>
                    <div class="signature-info">
                        <div>Warehouse Manager</div>
                        <div>{{ $transfer->toWarehouse->name }}</div>
                        <div>Date: _________________</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Warehouse Transfer Document</strong></p>
            <p>This document serves as official authorization for the transfer of inventory between warehouses.</p>
            <p>Reference: {{ $transfer->reference_number }} | Generated: {{ now()->format('Y-m-d H:i:s') }}</p>
        </div>
    </div>

    <script>
        // Auto-print functionality (optional)
        // window.onload = function() {
        //     setTimeout(function() {
        //         window.print();
        //     }, 1000);
        // };
    </script>
</body>
</html> 