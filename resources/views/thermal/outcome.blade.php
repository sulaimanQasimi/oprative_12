<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>رسید قرض</title>
    <style>
        @font-face {
            font-family: 'B Nazanin';
            src: url('/fonts/persian/B-NAZANIN.TTF') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
        @font-face {
            font-family: 'IRANSans';
            src: url('/fonts/persian/IRANSansWeb.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
        @font-face {
            font-family: 'Vazir';
            src: url('{{ public_path('fonts/persian/Vazir.ttf') }}') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
        @font-face {
            font-family: 'Yekan';
            src: url('{{ public_path('fonts/persian/Yekan.ttf') }}') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
        @page {
            size: 80mm auto;
            margin: 0;
        }
        * {
            font-family: 'IRANSans', 'B Nazanin', tahoma, sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            direction: rtl;
            width: 80mm;
            background: white;
            margin: 0 auto;
            padding: 3mm;
            font-size: 12pt;
        }
        .receipt {
            text-align: center;
        }
        .header {
            border-bottom: 1px dashed #000;
            padding-bottom: 5mm;
            margin-bottom: 5mm;
        }
        .header h1 {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 2mm;
        }
        .header p {
            font-size: 12pt;
            margin: 1mm 0;
        }
        .details {
            text-align: right;
            margin: 5mm 0;
        }
        .details p {
            margin: 2mm 0;
            font-size: 12pt;
        }
        .amount {
            font-size: 16pt;
            font-weight: bold;
            margin: 5mm 0;
            text-align: center;
        }
        .status {
            text-align: center;
            margin: 5mm 0;
            font-weight: bold;
            padding: 2mm;
            border: 1px solid #000;
            border-style: dashed;
        }
        .footer {
            margin-top: 5mm;
            padding-top: 5mm;
            border-top: 1px dashed #000;
            text-align: center;
            font-size: 10pt;
        }
        @media print {
            @page {
                size: 80mm auto;
                margin: 0;
            }
            html, body {
                width: 80mm;
                height: auto;
                margin: 0;
                padding: 3mm;
            }
            .no-print {
                display: none;
            }
        }
        .print-button {
            position: fixed;
            top: 10px;
            left: 10px;
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-family: tahoma, sans-serif;
        }
        .print-button:hover {
            background: #45a049;
        }
    </style>
    <script>
        function printReceipt() {
            window.print();
        }
        // Auto print when page loads
        window.onload = function() {
            window.print();
        }
    </script>
</head>
<body>
    <button onclick="printReceipt()" class="print-button no-print">Print</button>
    <div class="receipt">
        <div class="header">
            <h1>رسید قرض</h1>
            <p>{{ $outcome->account->name }}</p>
            <p>{{ $outcome->account->account_number }}</p>
        </div>

        <div class="details">
            <p><strong>تاریخ:</strong> {{ $outcome->date->format('Y-m-d') }}</p>
            <p><strong>مبلغ:</strong> {{ number_format($outcome->amount, 2) }}</p>
            <p><strong>شماره مرجع:</strong> {{ $outcome->reference_number }}</p>
            @if($outcome->description)
                <p><strong>توضیحات:</strong> {{ $outcome->description }}</p>
            @endif
        </div>

        <div class="amount">
            {{ number_format($outcome->amount, 2) }} ریال
        </div>

        <div class="status">
            وضعیت: {{ $outcome->status === 'approved' ? 'تایید شده' : ($outcome->status === 'pending' ? 'در انتظار تایید' : 'رد شده') }}
        </div>

        <div class="footer">
            <p>{{ $outcome->created_at->format('Y-m-d H:i:s') }}</p>
            <p>شماره پیگیری: {{ str_pad($outcome->id, 6, '0', STR_PAD_LEFT) }}</p>
        </div>
    </div>
</body>
</html>
