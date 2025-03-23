// Thermal Receipt QR Code Generator
document.addEventListener('DOMContentLoaded', function() {
    const qrcodeElement = document.getElementById('qrcode');
    if (!qrcodeElement) return;

    // Get transaction data from data attributes
    const data = {
        id: qrcodeElement.dataset.id,
        type: qrcodeElement.dataset.type,
        amount: qrcodeElement.dataset.amount,
        date: qrcodeElement.dataset.date,
        account: qrcodeElement.dataset.account,
        reference: qrcodeElement.dataset.reference,
        status: qrcodeElement.dataset.status
    };

    try {
        // Generate QR Code
        const qr = qrcode(0, 'M');
        qr.addData(JSON.stringify(data));
        qr.make();

        // Create QR code HTML
        qrcodeElement.innerHTML = qr.createImgTag(5);

        // Style the QR code image
        const qrImage = qrcodeElement.querySelector('img');
        if (qrImage) {
            qrImage.style.margin = 'auto';
            qrImage.style.display = 'block';
        }

        // Auto print after a short delay to ensure QR code is rendered
        if (!window.location.href.includes('printed')) {
            setTimeout(() => {
                window.print();
            }, 500);
        }
    } catch (error) {
        console.error('Error generating QR code:', error);
        qrcodeElement.innerHTML = '<p style="color: red;">خطا در ایجاد کد QR</p>';
    }
});
