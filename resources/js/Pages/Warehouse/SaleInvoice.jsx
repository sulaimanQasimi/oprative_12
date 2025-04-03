import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';

export default function SaleInvoice({ sale, company }) {
    // Auto-print when the component loads
    useEffect(() => {
        window.print();
    }, []);

    return (
        <>
            <Head title={`Invoice: ${sale.reference}`} />

            <div className="invoice-wrapper">
                {/* Company Info and Invoice Header */}
                <div className="header">
                    <div className="company-info">
                        <div className="logo-container">
                            {company.logo && (
                                <img
                                    src={company.logo}
                                    alt={company.name}
                                    className="company-logo"
                                />
                            )}
                        </div>
                        <div className="company-details">
                            <h1 className="company-name">{company.name || 'Company Name'}</h1>
                            <div className="company-address">
                                {company.address && <p>{company.address}</p>}
                                {company.phone && <p>Phone: {company.phone}</p>}
                                {company.email && <p>Email: {company.email}</p>}
                                {company.website && <p>Web: {company.website}</p>}
                                {company.tax_number && <p>Tax Number: {company.tax_number}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="invoice-header">
                        <div className="invoice-title">INVOICE</div>
                        <div className="invoice-number"># {sale.reference}</div>
                        <div className="invoice-date">Date: {sale.date}</div>
                        <div className="invoice-status">
                            <span className={`status-badge status-${sale.status}`}>
                                {sale.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Customer & Warehouse Info */}
                <div className="info-section">
                    <div className="customer-info">
                        <h3>Bill To:</h3>
                        <div className="customer-name">{sale.customer.name}</div>
                        {sale.customer.address && <div>{sale.customer.address}</div>}
                        {sale.customer.phone && <div>Phone: {sale.customer.phone}</div>}
                        {sale.customer.email && <div>Email: {sale.customer.email}</div>}
                        {sale.customer.tax_number && <div>Tax No: {sale.customer.tax_number}</div>}
                    </div>
                    <div className="warehouse-info">
                        <h3>Shipped From:</h3>
                        <div className="warehouse-name">{sale.warehouse.name}</div>
                        {sale.warehouse.address && <div>{sale.warehouse.address}</div>}
                        {sale.warehouse.phone && <div>Phone: {sale.warehouse.phone}</div>}
                        {sale.warehouse.email && <div>Email: {sale.warehouse.email}</div>}
                    </div>
                </div>

                {/* Invoice Items */}
                <div className="items-section">
                    <table className="items-table">
                        <thead>
                            <tr>
                                <th className="item-no">#</th>
                                <th className="item-description">Product</th>
                                <th className="item-quantity">Quantity</th>
                                <th className="item-price">Unit Price</th>
                                <th className="item-total">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sale.sale_items.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="item-no">{index + 1}</td>
                                    <td className="item-description">
                                        <div className="product-name">{item.product.name}</div>
                                        {item.product.barcode && (
                                            <div className="product-barcode">{item.product.barcode}</div>
                                        )}
                                    </td>
                                    <td className="item-quantity">
                                        {item.quantity} {item.unit || ''}
                                    </td>
                                    <td className="item-price">
                                        {sale.currency} {parseFloat(item.unit_price).toFixed(2)}
                                    </td>
                                    <td className="item-total">
                                        {sale.currency} {parseFloat(item.total).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Invoice Summary */}
                <div className="summary-section">
                    <div className="summary-info">
                        {sale.notes && (
                            <div className="invoice-notes">
                                <h3>Notes:</h3>
                                <p>{sale.notes}</p>
                            </div>
                        )}
                        <div className="payment-info">
                            <h3>Payment Info:</h3>
                            <div>Payment Status: {parseFloat(sale.due_amount) <= 0 ? 'Paid' : 'Partially Paid'}</div>
                            <div>Payment Method: {sale.payments && sale.payments.length > 0
                                ? sale.payments.map(p => p.payment_method).join(', ')
                                : 'Not specified'}
                            </div>
                        </div>
                    </div>
                    <div className="totals">
                        <div className="total-row">
                            <div className="total-label">Subtotal:</div>
                            <div className="total-value">{sale.currency} {parseFloat(sale.total_amount).toFixed(2)}</div>
                        </div>

                        {sale.tax_percentage > 0 && (
                            <div className="total-row">
                                <div className="total-label">Tax ({sale.tax_percentage}%):</div>
                                <div className="total-value">{sale.currency} {parseFloat(sale.tax_amount).toFixed(2)}</div>
                            </div>
                        )}

                        {sale.discount_percentage > 0 && (
                            <div className="total-row">
                                <div className="total-label">Discount ({sale.discount_percentage}%):</div>
                                <div className="total-value">-{sale.currency} {parseFloat(sale.discount_amount).toFixed(2)}</div>
                            </div>
                        )}

                        {sale.shipping_cost > 0 && (
                            <div className="total-row">
                                <div className="total-label">Shipping:</div>
                                <div className="total-value">{sale.currency} {parseFloat(sale.shipping_cost).toFixed(2)}</div>
                            </div>
                        )}

                        <div className="total-row grand-total">
                            <div className="total-label">Grand Total:</div>
                            <div className="total-value">{sale.currency} {parseFloat(sale.total_amount).toFixed(2)}</div>
                        </div>

                        <div className="total-row">
                            <div className="total-label">Paid Amount:</div>
                            <div className="total-value">{sale.currency} {parseFloat(sale.paid_amount).toFixed(2)}</div>
                        </div>

                        <div className="total-row">
                            <div className="total-label">Due Amount:</div>
                            <div className="total-value">{sale.currency} {parseFloat(sale.due_amount).toFixed(2)}</div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="footer">
                    <div className="signature-section">
                        <div className="signature">
                            <div className="signature-line"></div>
                            <div className="signature-label">Customer Signature</div>
                        </div>
                        <div className="signature">
                            <div className="signature-line"></div>
                            <div className="signature-label">Authorized Signature</div>
                        </div>
                    </div>
                    <div className="footer-text">
                        <p>Thank you for your business!</p>
                        {company.footer_text && <p>{company.footer_text}</p>}
                    </div>
                </div>
            </div>

            {/* Print-specific styles */}
            <style jsx global>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 15mm;
                    }

                    body {
                        font-family: 'Arial', sans-serif;
                        color: #333;
                        line-height: 1.5;
                    }

                    .invoice-wrapper {
                        width: 100%;
                        margin: 0;
                        padding: 0;
                    }

                    /* Header Styles */
                    .header {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 30px;
                        border-bottom: 1px solid #ddd;
                        padding-bottom: 20px;
                    }

                    .company-info {
                        display: flex;
                        align-items: center;
                    }

                    .logo-container {
                        margin-right: 20px;
                    }

                    .company-logo {
                        max-width: 150px;
                        max-height: 80px;
                    }

                    .company-name {
                        font-size: 24px;
                        font-weight: bold;
                        margin: 0 0 10px 0;
                    }

                    .company-address {
                        font-size: 12px;
                    }

                    .company-address p {
                        margin: 0;
                    }

                    .invoice-header {
                        text-align: right;
                    }

                    .invoice-title {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2563eb;
                    }

                    .invoice-number {
                        font-size: 16px;
                        margin-top: 5px;
                    }

                    .invoice-date {
                        margin-top: 5px;
                    }

                    .invoice-status {
                        margin-top: 10px;
                    }

                    .status-badge {
                        padding: 5px 10px;
                        border-radius: 15px;
                        font-size: 12px;
                        font-weight: bold;
                        text-transform: uppercase;
                    }

                    .status-completed {
                        background-color: #d1fae5;
                        color: #065f46;
                    }

                    .status-pending {
                        background-color: #fef3c7;
                        color: #92400e;
                    }

                    .status-cancelled {
                        background-color: #fee2e2;
                        color: #b91c1c;
                    }

                    /* Info Section Styles */
                    .info-section {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 30px;
                    }

                    .customer-info, .warehouse-info {
                        width: 48%;
                        padding: 15px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                    }

                    .customer-info h3, .warehouse-info h3 {
                        margin-top: 0;
                        margin-bottom: 10px;
                        color: #2563eb;
                        font-size: 16px;
                    }

                    .customer-name, .warehouse-name {
                        font-weight: bold;
                        margin-bottom: 5px;
                    }

                    /* Items Section Styles */
                    .items-section {
                        margin-bottom: 30px;
                    }

                    .items-table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    .items-table th, .items-table td {
                        border: 1px solid #ddd;
                        padding: 8px;
                    }

                    .items-table th {
                        background-color: #f8fafc;
                        text-align: left;
                    }

                    .item-no {
                        width: 5%;
                        text-align: center;
                    }

                    .item-description {
                        width: 45%;
                    }

                    .item-quantity, .item-price, .item-total {
                        width: 15%;
                        text-align: right;
                    }

                    .product-name {
                        font-weight: bold;
                    }

                    .product-barcode {
                        font-size: 11px;
                        color: #666;
                    }

                    /* Summary Section Styles */
                    .summary-section {
                        display: flex;
                        justify-content: space-between;
                    }

                    .summary-info {
                        width: 48%;
                    }

                    .invoice-notes {
                        margin-bottom: 20px;
                        padding: 10px;
                        background-color: #f8fafc;
                        border-radius: 5px;
                    }

                    .invoice-notes h3, .payment-info h3 {
                        margin-top: 0;
                        margin-bottom: 5px;
                        color: #2563eb;
                        font-size: 14px;
                    }

                    .payment-info {
                        padding: 10px;
                        background-color: #f8fafc;
                        border-radius: 5px;
                    }

                    .totals {
                        width: 48%;
                    }

                    .total-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 5px 0;
                    }

                    .total-label {
                        text-align: right;
                        width: 60%;
                        padding-right: 10px;
                    }

                    .total-value {
                        text-align: right;
                        width: 40%;
                        font-weight: bold;
                    }

                    .grand-total {
                        border-top: 2px solid #ddd;
                        border-bottom: 2px solid #ddd;
                        padding: 10px 0;
                        margin: 10px 0;
                        font-size: 16px;
                        font-weight: bold;
                    }

                    /* Footer Styles */
                    .footer {
                        margin-top: 40px;
                        text-align: center;
                    }

                    .signature-section {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 30px;
                    }

                    .signature {
                        width: 45%;
                    }

                    .signature-line {
                        border-bottom: 1px solid #333;
                        margin-bottom: 5px;
                        padding-top: 60px;
                    }

                    .signature-label {
                        font-weight: bold;
                        font-size: 12px;
                    }

                    .footer-text {
                        font-size: 12px;
                        color: #666;
                        margin-top: 20px;
                    }
                }
            `}</style>
        </>
    );
}
