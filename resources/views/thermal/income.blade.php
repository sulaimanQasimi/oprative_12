<!DOCTYPE html>
<html dir="rtl">
<head>
    <meta charset="utf-8">
    <title>Income Receipt</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.4;
            margin: 0;
            padding: 10px;
            width: 80mm;
        }
        .header {
            text-align: center;
            margin-bottom: 10px;
            border-bottom: 1px dashed #000;
            padding-bottom: 5px;
        }
        .content {
            margin: 10px 0;
        }
        .row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
        }
        .footer {
            text-align: center;
            margin-top: 10px;
            border-top: 1px dashed #000;
            padding-top: 5px;
        }
        .amount {
            font-size: 16px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>بازپرداخت قرض</h2>
        <p>{{ $account->name }}</p>
    </div>

    <div class="content">
        <div class="row">
            <span>شماره حساب:</span>
            <span>{{ $account->account_number }}</span>
        </div>
        <div class="row">
            <span>تاریخ:</span>
            <span>{{ $income->date->format('Y-m-d') }}</span>
        </div>
        <div class="row">
            <span>منبع:</span>
            <span>{{ $income->source }}</span>
        </div>
        <div class="row">
            <span>مبلغ:</span>
            <span class="amount">{{ number_format($income->amount, 2) }}</span>
        </div>
        @if($income->description)
        <div class="row">
            <span>توضیحات:</span>
            <span>{{ $income->description }}</span>
        </div>
        @endif
    </div>

    <div class="footer">
        <p>وضعیت: {{ $income->status_text }}</p>
        <p>{{ now()->format('Y-m-d H:i:s') }}</p>
    </div>
</body>
</html>
