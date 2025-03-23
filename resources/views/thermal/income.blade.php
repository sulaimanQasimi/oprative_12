<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>رسید بازپرداخت</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <script src="{{ asset('node_modules/qrcode/build/qrcode.min.js') }}"></script>
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
        .currency {
            font-size: 12pt;
            color: #666;
            margin-right: 2mm;
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
        .qr-code {
            margin: 5mm auto;
            text-align: center;
        }
        .qr-code canvas {
            margin: 0 auto;
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
        window.onload = function() {
            // Generate QR Code
            const qrData = {
                id: '{{ $income->id }}',
                type: 'income',
                amount: '{{ $income->amount }}',
                date: '{{ $income->date->format("Y-m-d") }}',
                account: '{{ $account->account_number }}',
                status: '{{ $income->status }}'
            };

            const qr = new QRCode(document.getElementById('qrcode'), {
                text: JSON.stringify(qrData),
                width: 128,
                height: 128,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });

            // Auto print
            if (!window.location.href.includes('printed')) {
                window.print();
            }
        }
    </script>
</head>
<body>
    <button onclick="window.print()" class="print-button no-print">چاپ رسید</button>
    <div class="receipt">
        <div class="header">
            <h1>رسید بازپرداخت</h1>
            <p>{{ $account->name }}</p>
            <p>{{ $account->account_number }}</p>
            <p>{{ now()->format('Y/m/d H:i:s') }}</p>
        </div>

        <div class="details">
            <p>
                <span>منبع:</span>
                <span>{{ $income->source }}</span>
            </p>
            <p>
                <span>تاریخ:</span>
                <span>{{ $income->date->format('Y/m/d') }}</span>
            </p>
            @if($income->description)
            <p>
                <span>توضیحات:</span>
                <span>{{ $income->description }}</span>
            </p>
            @endif
        </div>

        <div class="amount">
            <span>{{ number_format($income->amount, 2) }}</span>
            <span class="currency">افغانی</span>
        </div>

        <div class="status">
            <span>وضعیت: {{ __($income->status_text) }}</span>
        </div>

        <div class="qr-code">
            <div id="qrcode"></div>
        </div>

        <div class="footer">
            <p>با تشکر از شما</p>
            <p>شماره تراکنش: {{ $income->id }}</p>
        </div>
    </div>
</body>
</html>
