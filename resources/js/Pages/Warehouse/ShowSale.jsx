import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import {
    ShoppingCart,
    ChevronRight,
    ArrowLeft,
    Calendar,
    Clock,
    Download,
    Printer,
    User,
    Building,
    Phone,
    Mail,
    MapPin,
    CreditCard,
    Package,
    CheckCircle,
    XCircle,
    Truck
} from 'lucide-react';
import Navigation from '@/Components/Warehouse/Navigation';
import { motion } from 'framer-motion';

export default function ShowSale({ auth, sale }) {
    const [loading, setLoading] = useState(false);
    const [isPrintMode, setIsPrintMode] = useState(false);

    const { post, processing } = useForm();

    // Handle sale confirmation by warehouse
    const handleConfirmation = () => {
        setLoading(true);
        post(route('warehouse.sales.confirm', sale.id), {
            onSuccess: () => {
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            }
        });
    };

    // Handle print invoice
    const handlePrint = () => {
        setIsPrintMode(true);
        setTimeout(() => {
            window.print();
            setIsPrintMode(false);
        }, 100);
    };

    return (
        <>
            <Head title={`Sale #${sale.reference}`} />

            <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 ${isPrintMode ? 'print-mode' : ''}`}>
                {/* Sidebar - Hidden in print mode */}
                {!isPrintMode && (
                    <Navigation auth={auth} currentRoute="warehouse.sales" />
                )}

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-auto">
                    {/* Header - Hidden in print mode */}
                    {!isPrintMode && (
                        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between relative overflow-hidden backdrop-blur-sm flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/90 to-white/90 dark:from-gray-800/90 dark:to-gray-900/90 opacity-90"></div>
                            <div className="flex items-center space-x-3 relative z-10">
                                <Link href={route('warehouse.sales')} className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    <span>Back to Sales</span>
                                </Link>
                                <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
                                <div className="relative">
                                    <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                        <ShoppingCart className="h-5 w-5 mr-2 text-blue-600" />
                                        Sale Detail: <span className="text-blue-600 ml-1">{sale.reference}</span>
                                    </h1>
                                </div>
                            </div>
                            <div className="relative z-10 flex space-x-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex items-center gap-1.5 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-all duration-200 shadow-sm"
                                    onClick={handlePrint}
                                >
                                    <Printer className="h-4 w-4" />
                                    <span>Print Invoice</span>
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex items-center gap-1.5 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-all duration-200 shadow-sm"
                                >
                                    <Download className="h-4 w-4" />
                                    <span>Download PDF</span>
                                </Button>
                                {!sale.confirmed_by_warehouse && (
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
                                        onClick={handleConfirmation}
                                        disabled={processing || loading}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-1.5" />
                                        <span>Confirm Sale</span>
                                    </Button>
                                )}
                            </div>
                        </header>
                    )}

                    {/* Print Header - Only shown in print mode */}
                    {isPrintMode && (
                        <div className="print-header p-4 border-b">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="text-3xl font-bold text-gray-900">Company Name</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-gray-900">INVOICE</div>
                                    <div className="text-gray-600">{sale.reference}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content Section */}
                    <div className="flex-1 p-6 bg-gray-100 dark:bg-gray-900">
                        {/* Sale Status and Info */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            <Card className="col-span-2 shadow-md">
                                <CardHeader className="pb-2 border-b">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg text-gray-900 dark:text-white">Sale Information</CardTitle>
                                        <Badge
                                            className={`
                                                ${sale.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400' :
                                                  sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400' :
                                                  'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400'}
                                                capitalize
                                            `}
                                        >
                                            {sale.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-4">
                                            <div className="flex items-start">
                                                <Calendar className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                                                    <p className="font-medium text-gray-900 dark:text-white">{sale.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <ShoppingCart className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Reference</p>
                                                    <p className="font-medium text-gray-900 dark:text-white">{sale.reference}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <CreditCard className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Currency</p>
                                                    <p className="font-medium text-gray-900 dark:text-white">{sale.currency}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-start">
                                                <Clock className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                                                    <p className="font-medium text-gray-900 dark:text-white">{sale.created_at}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <Truck className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Warehouse Confirmation</p>
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {sale.confirmed_by_warehouse ? (
                                                            <span className="flex items-center text-green-600">
                                                                <CheckCircle className="h-4 w-4 mr-1" /> Confirmed
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center text-yellow-600">
                                                                <XCircle className="h-4 w-4 mr-1" /> Pending
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <Package className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Items Count</p>
                                                    <p className="font-medium text-gray-900 dark:text-white">{sale.items_count} items</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {sale.notes && (
                                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                                            <p className="text-gray-700 dark:text-gray-300">{sale.notes}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="shadow-md">
                                <CardHeader className="pb-2 border-b">
                                    <CardTitle className="text-lg text-gray-900 dark:text-white">Customer Information</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="flex items-start mb-4">
                                        <Avatar className="h-10 w-10 mr-3">
                                            <AvatarFallback className="bg-blue-600 text-white">
                                                {sale.customer.name ? sale.customer.name.charAt(0).toUpperCase() : 'C'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">{sale.customer.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Customer ID: {sale.customer.id}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {sale.customer.email && (
                                            <div className="flex items-start">
                                                <Mail className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                                    <p className="font-medium text-gray-900 dark:text-white">{sale.customer.email}</p>
                                                </div>
                                            </div>
                                        )}

                                        {sale.customer.phone && (
                                            <div className="flex items-start">
                                                <Phone className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                                                    <p className="font-medium text-gray-900 dark:text-white">{sale.customer.phone}</p>
                                                </div>
                                            </div>
                                        )}

                                        {sale.customer.address && (
                                            <div className="flex items-start">
                                                <MapPin className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                                                    <p className="font-medium text-gray-900 dark:text-white">{sale.customer.address}</p>
                                                </div>
                                            </div>
                                        )}

                                        {sale.customer.tax_number && (
                                            <div className="flex items-start">
                                                <Building className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Tax Number</p>
                                                    <p className="font-medium text-gray-900 dark:text-white">{sale.customer.tax_number}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sale Items */}
                        <Card className="mb-6 shadow-md">
                            <CardHeader className="pb-2 border-b">
                                <CardTitle className="text-lg text-gray-900 dark:text-white">Sale Items</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-800/50">
                                            <tr>
                                                <th scope="col" className="px-4 py-3 w-16">#</th>
                                                <th scope="col" className="px-4 py-3">Product</th>
                                                <th scope="col" className="px-4 py-3 text-center">Unit</th>
                                                <th scope="col" className="px-4 py-3 text-center">Quantity</th>
                                                <th scope="col" className="px-4 py-3 text-center">Unit Price</th>
                                                <th scope="col" className="px-4 py-3 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sale.sale_items.map((item, index) => (
                                                <tr key={item.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                                    <td className="px-4 py-3">{index + 1}</td>
                                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                                        <div className="flex items-center">
                                                            <Package className="h-4 w-4 text-blue-600 mr-2" />
                                                            {item.product.name}
                                                            {item.product.barcode && (
                                                                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                                                    ({item.product.barcode})
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">{item.unit || '-'}</td>
                                                    <td className="px-4 py-3 text-center">{item.quantity}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        {sale.currency} {parseFloat(item.unit_price).toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-medium">
                                                        {sale.currency} {parseFloat(item.total).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="font-semibold text-gray-900 dark:text-white border-t-2 border-gray-200 dark:border-gray-700">
                                                <td colSpan="5" className="px-4 py-3 text-right">Subtotal:</td>
                                                <td className="px-4 py-3 text-right">{sale.currency} {parseFloat(sale.total_amount).toFixed(2)}</td>
                                            </tr>
                                            {sale.tax_percentage > 0 && (
                                                <tr className="text-gray-900 dark:text-white">
                                                    <td colSpan="5" className="px-4 py-3 text-right">Tax ({sale.tax_percentage}%):</td>
                                                    <td className="px-4 py-3 text-right">{sale.currency} {parseFloat(sale.tax_amount).toFixed(2)}</td>
                                                </tr>
                                            )}
                                            {sale.discount_percentage > 0 && (
                                                <tr className="text-gray-900 dark:text-white">
                                                    <td colSpan="5" className="px-4 py-3 text-right">Discount ({sale.discount_percentage}%):</td>
                                                    <td className="px-4 py-3 text-right">-{sale.currency} {parseFloat(sale.discount_amount).toFixed(2)}</td>
                                                </tr>
                                            )}
                                            {sale.shipping_cost > 0 && (
                                                <tr className="text-gray-900 dark:text-white">
                                                    <td colSpan="5" className="px-4 py-3 text-right">Shipping:</td>
                                                    <td className="px-4 py-3 text-right">{sale.currency} {parseFloat(sale.shipping_cost).toFixed(2)}</td>
                                                </tr>
                                            )}
                                            <tr className="font-bold text-gray-900 dark:text-white text-lg border-t-2 border-gray-200 dark:border-gray-700">
                                                <td colSpan="5" className="px-4 py-3 text-right">Total:</td>
                                                <td className="px-4 py-3 text-right">{sale.currency} {parseFloat(sale.total_amount).toFixed(2)}</td>
                                            </tr>
                                            <tr className="text-gray-900 dark:text-white">
                                                <td colSpan="5" className="px-4 py-3 text-right">Paid Amount:</td>
                                                <td className="px-4 py-3 text-right">{sale.currency} {parseFloat(sale.paid_amount).toFixed(2)}</td>
                                            </tr>
                                            <tr className="font-semibold text-gray-900 dark:text-white">
                                                <td colSpan="5" className="px-4 py-3 text-right">Due Amount:</td>
                                                <td className="px-4 py-3 text-right">{sale.currency} {parseFloat(sale.due_amount).toFixed(2)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment History */}
                        {sale.payments && sale.payments.length > 0 && (
                            <Card className="shadow-md">
                                <CardHeader className="pb-2 border-b">
                                    <CardTitle className="text-lg text-gray-900 dark:text-white">Payment History</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-800/50">
                                                <tr>
                                                    <th scope="col" className="px-4 py-3">Date</th>
                                                    <th scope="col" className="px-4 py-3">Reference</th>
                                                    <th scope="col" className="px-4 py-3">Payment Method</th>
                                                    <th scope="col" className="px-4 py-3 text-right">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sale.payments.map((payment) => (
                                                    <tr key={payment.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                                        <td className="px-4 py-3">{payment.payment_date}</td>
                                                        <td className="px-4 py-3">{payment.reference || '-'}</td>
                                                        <td className="px-4 py-3 capitalize">{payment.payment_method}</td>
                                                        <td className="px-4 py-3 text-right font-medium">
                                                            {payment.currency} {parseFloat(payment.amount).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Print styles - Only applied when printing */}
            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print-mode, .print-mode * {
                        visibility: visible;
                    }
                    .print-mode {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .no-print {
                        display: none !important;
                    }

                    /* A4 styling */
                    @page {
                        size: A4;
                        margin: 15mm;
                    }

                    /* Typography enhancements for print */
                    html, body {
                        font-size: 12pt;
                        color: #000;
                    }
                    h1 {
                        font-size: 18pt;
                    }
                    h2 {
                        font-size: 16pt;
                    }
                    h3 {
                        font-size: 14pt;
                    }

                    /* Layout specific */
                    .print-header {
                        margin-bottom: 20mm;
                    }

                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }

                    table th {
                        background-color: #f3f4f6 !important;
                        -webkit-print-color-adjust: exact;
                        color-adjust: exact;
                    }

                    table th, table td {
                        border: 1px solid #ddd;
                        padding: 8px;
                    }
                }
            `}</style>
        </>
    );
}
