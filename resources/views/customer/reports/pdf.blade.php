<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Customer Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f5f5f5;
        }
        .footer {
            text-align: center;
            font-size: 10px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Customer Report</h1>
        <p>Report Type: {{ ucfirst($reportType) }}</p>
        <p>Period: {{ $dateFrom }} to {{ $dateTo }}</p>
    </div>

    <table>
        <thead>
            <tr>
                @switch($reportType)
                    @case('market_orders')
                        <th>ID</th>
                        <th>Date</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        @break
                    @case('stocks')
                        <th>ID</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Date</th>
                        @break
                    @case('sales')
                        <th>ID</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                        <th>Date</th>
                        @break
                    @case('accounts')
                        <th>ID</th>
                        <th>Name</th>
                        <th>Balance</th>
                        <th>Created At</th>
                        @break
                    @case('incomes')
                    @case('outcomes')
                        <th>ID</th>
                        <th>Account</th>
                        <th>Amount</th>
                        <th>Description</th>
                        <th>Date</th>
                        @break
                    @default
                        <th>ID</th>
                        <th>Created At</th>
                @endswitch
            </tr>
        </thead>
        <tbody>
            @foreach($data as $row)
                <tr>
                    @switch($reportType)
                        @case('market_orders')
                            <td>{{ $row->id }}</td>
                            <td>{{ $row->created_at->format('Y-m-d') }}</td>
                            <td>{{ $row->total_amount }}</td>
                            <td>{{ $row->status }}</td>
                            @break
                        @case('stocks')
                            <td>{{ $row->id }}</td>
                            <td>{{ $row->product->name ?? 'N/A' }}</td>
                            <td>{{ $row->quantity }}</td>
                            <td>{{ $row->created_at->format('Y-m-d H:i:s') }}</td>
                            @break
                        @case('sales')
                            <td>{{ $row->id }}</td>
                            <td>{{ $row->product->name ?? 'N/A' }}</td>
                            <td>{{ $row->quantity }}</td>
                            <td>{{ $row->amount }}</td>
                            <td>{{ $row->created_at->format('Y-m-d H:i:s') }}</td>
                            @break
                        @case('accounts')
                            <td>{{ $row->id }}</td>
                            <td>{{ $row->name }}</td>
                            <td>{{ $row->balance }}</td>
                            <td>{{ $row->created_at->format('Y-m-d H:i:s') }}</td>
                            @break
                        @case('incomes')
                        @case('outcomes')
                            <td>{{ $row->id }}</td>
                            <td>{{ $row->account->name ?? 'N/A' }}</td>
                            <td>{{ $row->amount }}</td>
                            <td>{{ $row->description }}</td>
                            <td>{{ $row->created_at->format('Y-m-d H:i:s') }}</td>
                            @break
                        @default
                            <td>{{ $row->id }}</td>
                            <td>{{ $row->created_at->format('Y-m-d H:i:s') }}</td>
                    @endswitch
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Generated on {{ now()->format('Y-m-d H:i:s') }}</p>
    </div>
</body>
</html>
