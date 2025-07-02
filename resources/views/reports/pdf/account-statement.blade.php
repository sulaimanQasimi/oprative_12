<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>گزارش حساب - {{ $account->name }}</title>
    <style>
        @font-face {
            font-family: 'IRANSans';
            src: url('/fonts/persian/IRANSansWeb.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
        }

        * {
            font-family: 'IRANSans', tahoma, sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            direction: rtl;
            background: white;
            padding: 20mm;
            font-size: 10pt;
            line-height: 1.4;
        }

        @page {
            size: A4;
            margin: 15mm;
        }

        .report-header {
            text-align: center;
            margin-bottom: 10mm;
            padding-bottom: 5mm;
            border-bottom: 2px solid #e5e7eb;
        }

        .report-header h1 {
            font-size: 24pt;
            color: #1f2937;
            margin-bottom: 4mm;
        }

        .report-header p {
            color: #6b7280;
            font-size: 10pt;
            margin: 1mm 0;
        }

        .account-info {
            background: #f3f4f6;
            border-radius: 4mm;
            padding: 5mm;
            margin-bottom: 10mm;
        }

        .account-info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 5mm;
        }

        .info-item {
            padding: 3mm;
            background: white;
            border-radius: 2mm;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .info-item span {
            display: block;
        }

        .info-item .label {
            color: #6b7280;
            font-size: 8pt;
            margin-bottom: 1mm;
        }

        .info-item .value {
            color: #1f2937;
            font-size: 12pt;
            font-weight: bold;
        }

        .summary-cards {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 5mm;
            margin-bottom: 10mm;
        }

        .summary-card {
            padding: 4mm;
            border-radius: 2mm;
            text-align: center;
            color: white;
        }

        .summary-card.income {
            background: linear-gradient(135deg, #34d399 0%, #059669 100%);
        }

        .summary-card.outcome {
            background: linear-gradient(135deg, #fb7185 0%, #e11d48 100%);
        }

        .summary-card.net {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        }

        .summary-card.balance {
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        }

        .summary-card .amount {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 2mm;
        }

        .summary-card .label {
            font-size: 8pt;
            opacity: 0.9;
        }

        .transactions {
            margin-bottom: 10mm;
        }

        .transactions h2 {
            color: #1f2937;
            font-size: 14pt;
            margin-bottom: 4mm;
            padding-bottom: 2mm;
            border-bottom: 1px solid #e5e7eb;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8mm;
            font-size: 9pt;
        }

        th {
            background: #f3f4f6;
            color: #4b5563;
            text-align: right;
            padding: 3mm;
            border-bottom: 1px solid #e5e7eb;
            font-weight: bold;
        }

        td {
            padding: 3mm;
            border-bottom: 1px solid #e5e7eb;
            color: #1f2937;
        }

        tr:nth-child(even) {
            background: #f9fafb;
        }

        .status-badge {
            display: inline-block;
            padding: 1mm 2mm;
            border-radius: 1mm;
            font-size: 8pt;
            font-weight: bold;
        }

        .status-badge.approved {
            background: #d1fae5;
            color: #059669;
        }

        .status-badge.pending {
            background: #fef3c7;
            color: #d97706;
        }

        .status-badge.rejected {
            background: #fee2e2;
            color: #dc2626;
        }

        .amount-cell {
            font-family: 'Courier New', monospace;
            font-weight: bold;
        }

        .amount-cell.positive {
            color: #059669;
        }

        .amount-cell.negative {
            color: #dc2626;
        }

        .report-footer {
            text-align: center;
            color: #6b7280;
            font-size: 8pt;
            margin-top: 10mm;
            padding-top: 5mm;
            border-top: 1px solid #e5e7eb;
        }

        .date-range {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 2mm;
            padding: 3mm;
            margin-bottom: 5mm;
            text-align: center;
        }

        .date-range span {
            font-weight: bold;
            color: #1f2937;
        }

        @media print {
            body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
            }
        }
    </style>
</head>

<body>
    <div class="report-header">
        <h1>گزارش حساب</h1>
        <p>{{ $account->name }} - <span dir="ltr">{{ $account->account_number }}</span></p>
        <p>تاریخ گزارش: {{ \Verta::now()->format('Y/m/d H:i:s') }}</p>
    </div>

    @if(isset($statementData['dateRange']))
    <div class="date-range">
        <p>بازه زمانی: <span>{{ \Verta::instance($statementData['dateRange']['start'])->format('Y/m/d') }}</span> تا <span>{{ \Verta::instance($statementData['dateRange']['end'])->format('Y/m/d') }}</span></p>
    </div>
    @endif

    <div class="account-info">
        <div class="account-info-grid">
            <div class="info-item">
                <span class="label">نام حساب</span>
                <span class="value">{{ $account->name }}</span>
            </div>
            <div class="info-item">
                <span class="label">شماره حساب</span>
                <span class="value"><span dir="ltr">{{ $account->account_number }}</span></span>
            </div>
        </div>
    </div>

    <div class="summary-cards">
        <div class="summary-card income">
            <div class="amount">{{ number_format($statementData['summary']['totalIncome'] ?? 0, 2) }}</div>
            <div class="label">کل درآمد (افغانی)</div>
        </div>
        <div class="summary-card outcome">
            <div class="amount">{{ number_format($statementData['summary']['totalOutcome'] ?? 0, 2) }}</div>
            <div class="label">کل خروجی (افغانی)</div>
        </div>
        <div class="summary-card net">
            <div class="amount">{{ number_format($statementData['summary']['netChange'] ?? 0, 2) }}</div>
            <div class="label">تغییر خالص (افغانی)</div>
        </div>
        <div class="summary-card balance">
            <div class="amount">{{ number_format($statementData['summary']['closingBalance'] ?? 0, 2) }}</div>
            <div class="label">موجودی نهایی (افغانی)</div>
        </div>
    </div>

    <div class="transactions">
        <h2>تراکنش های درآمد</h2>
        <table>
            <thead>
                <tr>
                    <th>تاریخ</th>
                    <th>منبع</th>
                    <th>مبلغ (افغانی)</th>
                    <th>وضعیت</th>
                    <th>توضیحات</th>
                </tr>
            </thead>
            <tbody>
                @forelse($statementData['transactions']['incomes'] ?? [] as $income)
                    <tr>
                        <td>{{ \Verta::instance($income->date ?? $income->created_at)->format('Y/m/d') }}</td>
                        <td>{{ $income->source ?? '-' }}</td>
                        <td class="amount-cell positive">{{ number_format($income->amount, 2) }}</td>
                        <td>
                            <span class="status-badge {{ $income->status === 'approved' ? 'approved' : ($income->status === 'rejected' ? 'rejected' : 'pending') }}">
                                {{ $income->status === 'approved' ? 'تایید شده' : ($income->status === 'rejected' ? 'رد شده' : 'در انتظار') }}
                            </span>
                        </td>
                        <td>{{ $income->description ?: '-' }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" style="text-align: center; color: #6b7280; padding: 10mm;">هیچ تراکنش درآمدی یافت نشد</td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <h2>تراکنش های خروجی</h2>
        <table>
            <thead>
                <tr>
                    <th>تاریخ</th>
                    <th>شماره مرجع</th>
                    <th>مبلغ (افغانی)</th>
                    <th>وضعیت</th>
                    <th>توضیحات</th>
                </tr>
            </thead>
            <tbody>
                @forelse($statementData['transactions']['outcomes'] ?? [] as $outcome)
                    <tr>
                        <td>{{ \Verta::instance($outcome->date ?? $outcome->created_at)->format('Y/m/d') }}</td>
                        <td>{{ $outcome->reference_number ?: '-' }}</td>
                        <td class="amount-cell negative">{{ number_format($outcome->amount, 2) }}</td>
                        <td>
                            <span class="status-badge {{ $outcome->status === 'approved' ? 'approved' : ($outcome->status === 'rejected' ? 'rejected' : 'pending') }}">
                                {{ $outcome->status === 'approved' ? 'تایید شده' : ($outcome->status === 'rejected' ? 'رد شده' : 'در انتظار') }}
                            </span>
                        </td>
                        <td>{{ $outcome->description ?: '-' }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" style="text-align: center; color: #6b7280; padding: 10mm;">هیچ تراکنش خروجی یافت نشد</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="report-footer">
        <p>این گزارش به صورت خودکار تولید شده است.</p>
        <p>تاریخ و زمان تولید: {{ \Verta::now()->format('Y/m/d H:i:s') }}</p>
        @if(isset($generatedAt))
            <p>تولید شده در: {{ $generatedAt }}</p>
        @endif
    </div>
</body>
</html> 