import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import {
    Building2,
    Package,
    DollarSign,
    Calendar,
    FileText,
    Truck,
    Globe,
    User,
    Hash,
    Receipt,
    Calculator,
    TrendingUp,
    ShoppingBag,
    Users,
    Printer,
    CheckCircle,
    AlertTriangle,
    Clock,
    Star,
    BadgeCheck,
    Zap
} from "lucide-react";
import axios from "axios";

export default function Print({ auth, purchase, purchaseItems, additionalCosts, payments, warehouses }) {
    const [warehouseInventoryData, setWarehouseInventoryData] = useState(null);
    const [customerInventoryData, setCustomerInventoryData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInventoryData();
    }, []);

    const fetchInventoryData = async () => {
        setLoading(true);
        try {
            const [warehouseResponse, customerResponse] = await Promise.all([
                axios.get(`/api/warehouse-inventory/purchase/${purchase.id}`),
                axios.get(`/api/customer-inventory/purchase/${purchase.id}`)
            ]);
            
            setWarehouseInventoryData(warehouseResponse.data);
            setCustomerInventoryData(customerResponse.data);
        } catch (error) {
            console.error('Error fetching inventory data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount, currency = 'AFS') => {
        return new Intl.NumberFormat('fa-AF', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatPurchaseCurrency = (amount) => {
        return formatCurrency(amount, purchase.currency?.code || 'USD');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusLabel = (status) => {
        const statusLabels = {
            'purchase': 'خرید',
            'onway': 'در راه',
            'on_border': 'در مرز',
            'on_plan': 'در برنامه',
            'on_ship': 'در کشتی',
            'arrived': 'رسیده',
            'warehouse_moved': 'منتقل به انبار',
            'return': 'بازگشت',
        };
        return statusLabels[status] || status;
    };

    const getStatusIcon = (status) => {
        const icons = {
            'purchase': Package,
            'onway': Truck,
            'on_border': Globe,
            'on_plan': Calendar,
            'on_ship': Globe,
            'arrived': CheckCircle,
            'warehouse_moved': Building2,
            'return': AlertTriangle,
        };
        return icons[status] || Package;
    };

    const getStatusColor = (status) => {
        const colors = {
            'purchase': 'text-blue-600 bg-blue-50',
            'onway': 'text-yellow-600 bg-yellow-50',
            'on_border': 'text-orange-600 bg-orange-50',
            'on_plan': 'text-purple-600 bg-purple-50',
            'on_ship': 'text-indigo-600 bg-indigo-50',
            'arrived': 'text-green-600 bg-green-50',
            'warehouse_moved': 'text-emerald-600 bg-emerald-50',
            'return': 'text-red-600 bg-red-50',
        };
        return colors[status] || 'text-gray-600 bg-gray-50';
    };

    const getTotalAmount = () => (purchaseItems || []).reduce((sum, item) => sum + parseFloat(item.total_price || 0), 0);
    const getAdditionalCostsTotal = () => (additionalCosts || []).reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0);
    const getPaymentsTotal = () => (payments || []).reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-200">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                        <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">در حال بارگیری گزارش</h3>
                    <p className="text-gray-600">لطفاً منتظر بمانید...</p>
                    <div className="mt-4 flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title={`چاپ خرید - ${purchase.invoice_number}`}>
                <style>{`
                    @page {
                        size: A4;
                        margin: 15mm;
                    }
                    @media print {
                        body { 
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                            font-family: 'Tahoma', 'Arial', sans-serif;
                        }
                        .no-print { display: none !important; }
                        .print-break { page-break-before: always; }
                        .avoid-break { page-break-inside: avoid; }
                        .text-sm { font-size: 12px !important; }
                        .text-xs { font-size: 10px !important; }
                        table { font-size: 11px !important; }
                        .bg-gray-50 { background-color: #f9fafb !important; }
                        .bg-blue-50 { background-color: #eff6ff !important; }
                        .bg-green-50 { background-color: #f0fdf4 !important; }
                        .bg-yellow-50 { background-color: #fefce8 !important; }
                        .bg-orange-50 { background-color: #fff7ed !important; }
                        .bg-purple-50 { background-color: #faf5ff !important; }
                        .bg-indigo-50 { background-color: #eef2ff !important; }
                        .bg-emerald-50 { background-color: #ecfdf5 !important; }
                        .bg-red-50 { background-color: #fef2f2 !important; }
                        .border { border: 1px solid #d1d5db !important; }
                        .border-b { border-bottom: 1px solid #d1d5db !important; }
                        .border-t { border-top: 1px solid #d1d5db !important; }
                        .border-l { border-left: 1px solid #d1d5db !important; }
                        .border-r { border-right: 1px solid #d1d5db !important; }
                        .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important; }
                        .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important; }
                        .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important; }
                        .text-gradient { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                    }
                    * {
                        font-family: 'Tahoma', 'Arial', sans-serif;
                    }
                    body {
                        direction: rtl;
                        text-align: right;
                    }
                    .gradient-bg {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    }
                    .text-gradient {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }
                    .hover-lift {
                        transition: transform 0.2s ease;
                    }
                    .hover-lift:hover {
                        transform: translateY(-2px);
                    }
                `}</style>
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6" dir="rtl">
                {/* Print Button - Hidden during print */}
                <div className="no-print mb-8 flex justify-center">
                    <button
                        onClick={handlePrint}
                        className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                            <Printer className="h-6 w-6" />
                        </div>
                        <span className="text-lg font-semibold">چاپ گزارش تفصیلی</span>
                    </button>
                </div>

                {/* Main Content Container */}
                <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                    
                    {/* Elegant Header */}
                    <div className="gradient-bg text-white p-8 avoid-break">
                        <div className="text-center">
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white/20 rounded-2xl blur-lg"></div>
                                    <div className="relative bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                                        <FileText className="h-12 w-12 text-white mx-auto" />
                                    </div>
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold mb-4">گزارش تفصیلی خرید</h1>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <p className="text-xl font-semibold mb-2">
                                    شماره فاکتور: <span className="text-yellow-200">{purchase.invoice_number}</span>
                                </p>
                                <p className="text-lg opacity-90">
                                    تاریخ: {formatDate(purchase.invoice_date)}
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-white/20">
                                <div className="flex items-center justify-center gap-2 text-sm opacity-75">
                                    <Clock className="h-4 w-4" />
                                    <span>تاریخ چاپ: {formatDate(new Date())}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Purchase Information Card */}
                        <div className="avoid-break">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-100 rounded-xl">
                                    <Package className="h-6 w-6 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">اطلاعات خرید</h2>
                            </div>
                            
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                                            <Hash className="h-5 w-5 text-blue-600" />
                                            <div>
                                                <span className="text-sm text-gray-600">شماره فاکتور</span>
                                                <p className="font-bold text-gray-800">{purchase.invoice_number}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                                            <Truck className="h-5 w-5 text-green-600" />
                                            <div>
                                                <span className="text-sm text-gray-600">تامین کننده</span>
                                                <p className="font-bold text-gray-800">{purchase.supplier?.name}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                                            <Calendar className="h-5 w-5 text-purple-600" />
                                            <div>
                                                <span className="text-sm text-gray-600">تاریخ فاکتور</span>
                                                <p className="font-bold text-gray-800">{formatDate(purchase.invoice_date)}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                                            {React.createElement(getStatusIcon(purchase.status), { 
                                                className: `h-5 w-5 ${getStatusColor(purchase.status).split(' ')[0]}` 
                                            })}
                                            <div className="flex-1">
                                                <span className="text-sm text-gray-600">وضعیت</span>
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(purchase.status)}`}>
                                                    {getStatusLabel(purchase.status)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                                            <Globe className="h-5 w-5 text-orange-600" />
                                            <div>
                                                <span className="text-sm text-gray-600">ارز</span>
                                                <p className="font-bold text-gray-800">{purchase.currency?.name} ({purchase.currency?.code})</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                                            <Calculator className="h-5 w-5 text-indigo-600" />
                                            <div>
                                                <span className="text-sm text-gray-600">نرخ ارز</span>
                                                <p className="font-bold text-gray-800">{purchase.currency_rate}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                                            <User className="h-5 w-5 text-teal-600" />
                                            <div>
                                                <span className="text-sm text-gray-600">ایجاد شده توسط</span>
                                                <p className="font-bold text-gray-800">{purchase.user?.name || 'نامشخص'}</p>
                                            </div>
                                        </div>
                                        
                                        {purchase.reference_no && (
                                            <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                                                <Hash className="h-5 w-5 text-gray-600" />
                                                <div>
                                                    <span className="text-sm text-gray-600">شماره مرجع</span>
                                                    <p className="font-bold text-gray-800">{purchase.reference_no}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {purchase.note && (
                                    <div className="mt-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                                        <div className="flex items-start gap-3">
                                            <FileText className="h-5 w-5 text-gray-600 mt-0.5" />
                                            <div>
                                                <span className="text-sm text-gray-600">یادداشت</span>
                                                <p className="font-semibold text-gray-800 mt-1">{purchase.note}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Enhanced Financial Summary */}
                        <div className="avoid-break">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-green-100 rounded-xl">
                                    <DollarSign className="h-6 w-6 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">خلاصه مالی</h2>
                            </div>
                            
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border-l-4 border-blue-500">
                                            <div className="flex items-center gap-3">
                                                <Package className="h-5 w-5 text-blue-600" />
                                                <span className="font-medium text-gray-700">ارزش اقلام</span>
                                            </div>
                                            <span className="text-xl font-bold text-blue-600">{formatPurchaseCurrency(getTotalAmount())}</span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border-l-4 border-orange-500">
                                            <div className="flex items-center gap-3">
                                                <Receipt className="h-5 w-5 text-orange-600" />
                                                <span className="font-medium text-gray-700">هزینه‌های اضافی</span>
                                            </div>
                                            <span className="text-xl font-bold text-orange-600">+ {formatPurchaseCurrency(getAdditionalCostsTotal())}</span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl shadow-sm border-2 border-purple-300">
                                            <div className="flex items-center gap-3">
                                                <Star className="h-6 w-6 text-purple-600" />
                                                <span className="text-lg font-bold text-purple-800">مجموع خرید</span>
                                            </div>
                                            <span className="text-2xl font-bold text-purple-800">{formatPurchaseCurrency(getTotalAmount() + getAdditionalCostsTotal())}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border-l-4 border-green-500">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                                <span className="font-medium text-gray-700">مجموع پرداخت شده</span>
                                            </div>
                                            <span className="text-xl font-bold text-green-600">{formatPurchaseCurrency(getPaymentsTotal())}</span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border-l-4 border-red-500">
                                            <div className="flex items-center gap-3">
                                                <Clock className="h-5 w-5 text-red-600" />
                                                <span className="font-medium text-gray-700">باقی مانده</span>
                                            </div>
                                            <span className={`text-xl font-bold ${(getTotalAmount() + getAdditionalCostsTotal() - getPaymentsTotal()) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                {formatPurchaseCurrency(getTotalAmount() + getAdditionalCostsTotal() - getPaymentsTotal())}
                                            </span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl shadow-sm border-2 border-blue-300">
                                            <div className="flex items-center gap-3">
                                                <TrendingUp className="h-6 w-6 text-blue-600" />
                                                <span className="text-lg font-bold text-blue-800">درصد پرداخت</span>
                                            </div>
                                            <span className="text-2xl font-bold text-blue-800">
                                                {((getPaymentsTotal() / (getTotalAmount() + getAdditionalCostsTotal())) * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Purchase Items Table */}
                        <div className="avoid-break">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-purple-100 rounded-xl">
                                    <ShoppingBag className="h-6 w-6 text-purple-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">اقلام خرید</h2>
                                <div className="mr-auto bg-purple-100 text-purple-800 px-4 py-2 rounded-lg font-semibold">
                                    {(purchaseItems || []).length} قلم
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-purple-100 to-indigo-100 border-b border-purple-200">
                                                <th className="p-4 text-right font-bold text-purple-800 border-l border-purple-200">محصول</th>
                                                <th className="p-4 text-center font-bold text-purple-800 border-l border-purple-200">تعداد</th>
                                                <th className="p-4 text-center font-bold text-purple-800 border-l border-purple-200">نوع واحد</th>
                                                <th className="p-4 text-center font-bold text-purple-800 border-l border-purple-200">قیمت واحد</th>
                                                <th className="p-4 text-center font-bold text-purple-800 border-l border-purple-200">قیمت عمده</th>
                                                <th className="p-4 text-center font-bold text-purple-800 border-l border-purple-200">قیمت خرده</th>
                                                <th className="p-4 text-center font-bold text-purple-800">مجموع</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {(purchaseItems || []).map((item, index) => (
                                                <tr key={item.id} className={`border-b border-gray-100 hover:bg-purple-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                                    <td className="p-4 border-l border-gray-100">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                                <Package className="h-4 w-4 text-purple-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-800">{item.product?.name || 'N/A'}</p>
                                                                <p className="text-xs text-gray-500 font-mono">{item.product?.barcode}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center border-l border-gray-100">
                                                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-bold inline-block">
                                                            {item.batch?.quantity && item.batch?.unit_amount ? 
                                                                `${(item.batch.quantity / item.batch.unit_amount).toLocaleString('fa')} ${item.batch.unit_name || ''}` 
                                                                : item.quantity?.toLocaleString('fa')
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center border-l border-gray-100">
                                                        <div className={`px-3 py-1 rounded-lg font-semibold inline-block ${
                                                            item.unit_type === 'wholesale' ? 'bg-orange-100 text-orange-800' : 
                                                            item.unit_type === 'retail' ? 'bg-green-100 text-green-800' : 
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {item.unit_type === 'wholesale' ? 'عمده' : item.unit_type === 'retail' ? 'خرده' : '-'}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center border-l border-gray-100 font-bold font-mono">{formatPurchaseCurrency(item.price)}</td>
                                                    <td className="p-4 text-center border-l border-gray-100 font-bold font-mono">
                                                        {item.batch?.wholesale_price ? (
                                                            <span className="text-orange-600">{formatCurrency(item.batch.wholesale_price)}</span>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-center border-l border-gray-100 font-bold font-mono">
                                                        {item.batch?.retail_price ? (
                                                            <span className="text-green-600">{formatCurrency(item.batch.retail_price)}</span>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-center font-bold font-mono text-purple-600 text-lg">{formatPurchaseCurrency(item.total_price)}</td>
                                                </tr>
                                            ))}
                                            <tr className="bg-gradient-to-r from-purple-100 to-indigo-100 border-t-2 border-purple-300">
                                                <td colSpan="6" className="p-4 text-left font-bold text-purple-800 text-lg">مجموع اقلام:</td>
                                                <td className="p-4 text-center font-bold text-purple-800 text-xl font-mono">{formatPurchaseCurrency(getTotalAmount())}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Additional Costs */}
                        {(additionalCosts || []).length > 0 && (
                            <div className="avoid-break">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-orange-100 rounded-xl">
                                        <Receipt className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">هزینه‌های اضافی</h2>
                                    <div className="mr-auto bg-orange-100 text-orange-800 px-4 py-2 rounded-lg font-semibold">
                                        {additionalCosts.length} هزینه
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gradient-to-r from-orange-100 to-amber-100 border-b border-orange-200">
                                                    <th className="p-4 text-right font-bold text-orange-800 border-l border-orange-200">نام هزینه</th>
                                                    <th className="p-4 text-center font-bold text-orange-800 border-l border-orange-200">مبلغ</th>
                                                    <th className="p-4 text-center font-bold text-orange-800">تاریخ</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                {additionalCosts.map((cost, index) => (
                                                    <tr key={cost.id} className={`border-b border-gray-100 hover:bg-orange-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                                        <td className="p-4 border-l border-gray-100">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-orange-100 rounded-lg">
                                                                    <Receipt className="h-4 w-4 text-orange-600" />
                                                                </div>
                                                                <span className="font-bold text-gray-800">{cost.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-center border-l border-gray-100">
                                                            <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg font-bold font-mono inline-block">
                                                                {formatPurchaseCurrency(cost.amount)}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-center font-mono text-gray-600">
                                                            {formatDate(cost.created_at)}
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr className="bg-gradient-to-r from-orange-100 to-amber-100 border-t-2 border-orange-300">
                                                    <td className="p-4 text-left font-bold text-orange-800 text-lg border-l border-orange-200">مجموع هزینه‌های اضافی:</td>
                                                    <td className="p-4 text-center font-bold text-orange-800 text-xl font-mono border-l border-orange-200">
                                                        {formatPurchaseCurrency(getAdditionalCostsTotal())}
                                                    </td>
                                                    <td className="p-4"></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Enhanced Payments */}
                        {(payments || []).length > 0 && (
                            <div className="avoid-break">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-green-100 rounded-xl">
                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">پرداخت‌ها</h2>
                                    <div className="mr-auto bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
                                        {payments.length} پرداخت
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gradient-to-r from-green-100 to-emerald-100 border-b border-green-200">
                                                    <th className="p-4 text-center font-bold text-green-800 border-l border-green-200">مبلغ</th>
                                                    <th className="p-4 text-center font-bold text-green-800 border-l border-green-200">روش پرداخت</th>
                                                    <th className="p-4 text-center font-bold text-green-800 border-l border-green-200">شماره مرجع</th>
                                                    <th className="p-4 text-center font-bold text-green-800">تاریخ پرداخت</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                {payments.map((payment, index) => (
                                                    <tr key={payment.id} className={`border-b border-gray-100 hover:bg-green-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                                        <td className="p-4 text-center border-l border-gray-100">
                                                            <span className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-bold font-mono inline-block">
                                                                {formatPurchaseCurrency(payment.amount)}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-center border-l border-gray-100">
                                                            <div>
                                                                <span className="font-semibold text-gray-800">{payment.payment_method?.replace('_', ' ')}</span>
                                                                {payment.bank_name && (
                                                                    <div className="text-xs text-gray-500 mt-1">{payment.bank_name}</div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-center border-l border-gray-100">
                                                            <span className="font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                                                {payment.reference_number || '-'}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-center font-mono text-gray-600">
                                                            {formatDate(payment.payment_date)}
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr className="bg-gradient-to-r from-green-100 to-emerald-100 border-t-2 border-green-300">
                                                    <td className="p-4 text-center font-bold text-green-800 text-xl font-mono border-l border-green-200">
                                                        {formatPurchaseCurrency(getPaymentsTotal())}
                                                    </td>
                                                    <td colSpan="3" className="p-4 text-left font-bold text-green-800 text-lg">مجموع پرداخت‌ها:</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Page Break for Inventory Sections */}
                <div className="print-break"></div>

                {/* Inventory Sections with Enhanced Design */}
                <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 mt-8">
                    <div className="p-8 space-y-8">
                        {/* Enhanced Warehouse Inventory */}
                        {warehouseInventoryData?.batch_details?.length > 0 && (
                            <div className="avoid-break">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-indigo-100 rounded-xl">
                                        <Building2 className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">موجودی انبار</h2>
                                    <div className="mr-auto bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg font-semibold">
                                        {warehouseInventoryData.batch_details.length} مورد
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gradient-to-r from-indigo-100 to-blue-100 border-b border-indigo-200">
                                                    <th className="p-4 text-right font-bold text-indigo-800 border-l border-indigo-200">محصول</th>
                                                    <th className="p-4 text-center font-bold text-indigo-800 border-l border-indigo-200">انبار</th>
                                                    <th className="p-4 text-center font-bold text-indigo-800 border-l border-indigo-200">دریافتی</th>
                                                    <th className="p-4 text-center font-bold text-indigo-800 border-l border-indigo-200">خروجی</th>
                                                    <th className="p-4 text-center font-bold text-indigo-800 border-l border-indigo-200">باقی مانده</th>
                                                    <th className="p-4 text-center font-bold text-indigo-800 border-l border-indigo-200">ارزش باقی مانده</th>
                                                    <th className="p-4 text-center font-bold text-indigo-800">وضعیت انقضا</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                {warehouseInventoryData.batch_details.map((batch, index) => (
                                                    <tr key={`${batch.batch_id}-${batch.warehouse_id}`} className={`border-b border-gray-100 hover:bg-indigo-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                                        <td className="p-4 border-l border-gray-100">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-indigo-100 rounded-lg">
                                                                    <Package className="h-4 w-4 text-indigo-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-gray-800">{batch.product_name}</p>
                                                                    <p className="text-xs text-gray-500 font-mono">{batch.product_barcode}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-center border-l border-gray-100">
                                                            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-semibold inline-block">
                                                                {batch.warehouse_name}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-center border-l border-gray-100">
                                                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg font-bold font-mono inline-block">
                                                                {batch.unit_amount && batch.unit_amount > 0 ? 
                                                                    `${(batch.income_qty / batch.unit_amount).toLocaleString('fa')} ${batch.unit_name || ''}` 
                                                                    : (batch.income_qty || 0).toLocaleString('fa')
                                                                }
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-center border-l border-gray-100">
                                                            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-lg font-bold font-mono inline-block">
                                                                {batch.unit_amount && batch.unit_amount > 0 ? 
                                                                    `${(batch.outcome_qty / batch.unit_amount).toLocaleString('fa')} ${batch.unit_name || ''}` 
                                                                    : (batch.outcome_qty || 0).toLocaleString('fa')
                                                                }
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-center border-l border-gray-100">
                                                            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg font-bold font-mono inline-block text-lg">
                                                                {batch.unit_amount && batch.unit_amount > 0 ? 
                                                                    `${(batch.remaining_qty / batch.unit_amount).toLocaleString('fa')} ${batch.unit_name || ''}` 
                                                                    : (batch.remaining_qty || 0).toLocaleString('fa')
                                                                }
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-center border-l border-gray-100">
                                                            <span className="text-lg font-bold text-green-600 font-mono">
                                                                {formatCurrency(batch.total_income_value - batch.total_outcome_value)}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <span className={`px-3 py-2 rounded-lg text-sm font-bold inline-flex items-center gap-2 ${
                                                                batch.expiry_status === 'expired' ? 'bg-red-100 text-red-700' :
                                                                batch.expiry_status === 'expiring_soon' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-green-100 text-green-700'
                                                            }`}>
                                                                {batch.expiry_status === 'expired' ? (
                                                                    <>
                                                                        <AlertTriangle className="h-4 w-4" />
                                                                        منقضی شده
                                                                    </>
                                                                ) : batch.expiry_status === 'expiring_soon' ? (
                                                                    <>
                                                                        <Clock className="h-4 w-4" />
                                                                        در حال انقضا
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <CheckCircle className="h-4 w-4" />
                                                                        سالم
                                                                    </>
                                                                )}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Enhanced Customer Inventory */}
                        {customerInventoryData?.batch_summary?.length > 0 && (
                            <div className="avoid-break">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-teal-100 rounded-xl">
                                        <Users className="h-6 w-6 text-teal-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">موجودی مغازه (فروش به مشتریان)</h2>
                                    <div className="mr-auto bg-teal-100 text-teal-800 px-4 py-2 rounded-lg font-semibold">
                                        {customerInventoryData.batch_summary.length} مورد
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gradient-to-r from-teal-100 to-cyan-100 border-b border-teal-200">
                                                    <th className="p-4 text-right font-bold text-teal-800 border-l border-teal-200">محصول</th>
                                                    <th className="p-4 text-center font-bold text-teal-800 border-l border-teal-200">مشتری</th>
                                                    <th className="p-4 text-center font-bold text-teal-800 border-l border-teal-200">دریافتی</th>
                                                    <th className="p-4 text-center font-bold text-teal-800 border-l border-teal-200">فروش رفته</th>
                                                    <th className="p-4 text-center font-bold text-teal-800 border-l border-teal-200">باقی مانده</th>
                                                    <th className="p-4 text-center font-bold text-teal-800 border-l border-teal-200">ارزش فروش</th>
                                                    <th className="p-4 text-center font-bold text-teal-800">سود</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                {customerInventoryData.batch_summary.map((batch, index) => (
                                                    <tr key={`${batch.batch_id}-${batch.customer_id}`} className={`border-b border-gray-100 hover:bg-teal-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                                        <td className="p-4 border-l border-gray-100">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-teal-100 rounded-lg">
                                                                    <Package className="h-4 w-4 text-teal-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-gray-800">{batch.product_name}</p>
                                                                    <p className="text-xs text-gray-500 font-mono">{batch.product_barcode}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 border-l border-gray-100">
                                                            <div className="text-center">
                                                                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-semibold inline-block mb-1">
                                                                    {batch.customer_name}
                                                                </div>
                                                                {batch.customer_phone && (
                                                                    <p className="text-xs text-gray-500 font-mono">{batch.customer_phone}</p>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-center border-l border-gray-100">
                                                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg font-bold font-mono inline-block">
                                                                {batch.unit_amount && batch.unit_amount > 0 ? 
                                                                    `${(batch.income_qty / batch.unit_amount).toLocaleString('fa')} ${batch.unit_name || ''}` 
                                                                                                                                          : (batch.income_qty || 0).toLocaleString('fa')
                                                                  }
                                                              </span>
                                                        </td>
                                                        <td className="p-4 text-center border-l border-gray-100">
                                                            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-lg font-bold font-mono inline-block">
                                                                {batch.unit_amount && batch.unit_amount > 0 ? 
                                                                    `${(batch.outcome_qty / batch.unit_amount).toLocaleString('fa')} ${batch.unit_name || ''}` 
                                                                    : (batch.outcome_qty || 0).toLocaleString('fa')
                                                                }
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-center border-l border-gray-100">
                                                            <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-lg font-bold font-mono inline-block text-lg">
                                                                {batch.unit_amount && batch.unit_amount > 0 ? 
                                                                    `${(batch.remaining_qty / batch.unit_amount).toLocaleString('fa')} ${batch.unit_name || ''}` 
                                                                    : (batch.remaining_qty || 0).toLocaleString('fa')
                                                                }
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-center border-l border-gray-100">
                                                            <span className="text-lg font-bold text-blue-600 font-mono">
                                                                {formatCurrency(batch.total_outcome_value)}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <span className="text-lg font-bold text-green-600 font-mono">
                                                                {formatCurrency((batch.total_outcome_value || 0) - (batch.total_income_value || 0))}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Enhanced Sales Summary */}
                        {customerInventoryData?.sales_metrics && (
                            <div className="avoid-break">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-emerald-100 rounded-xl">
                                        <TrendingUp className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">خلاصه فروش</h2>
                                </div>
                                
                                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200 shadow-sm">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border-l-4 border-emerald-500">
                                                <div className="flex items-center gap-3">
                                                    <DollarSign className="h-6 w-6 text-emerald-600" />
                                                    <span className="text-lg font-bold text-emerald-800">ارزش کل فروش</span>
                                                </div>
                                                <span className="text-2xl font-bold text-emerald-600 font-mono">{formatCurrency(customerInventoryData.sales_metrics.total_sales_value || 0)}</span>
                                            </div>
                                            
                                            <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border-l-4 border-blue-500">
                                                <div className="flex items-center gap-3">
                                                    <ShoppingBag className="h-6 w-6 text-blue-600" />
                                                    <span className="text-lg font-bold text-blue-800">تعداد فروش رفته</span>
                                                </div>
                                                <span className="text-2xl font-bold text-blue-600 font-mono">{(customerInventoryData.sales_metrics.total_sold_qty || 0).toLocaleString('fa')}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border-l-4 border-green-500">
                                                <div className="flex items-center gap-3">
                                                    <Zap className="h-6 w-6 text-green-600" />
                                                    <span className="text-lg font-bold text-green-800">سود ناخالص</span>
                                                </div>
                                                <span className="text-2xl font-bold text-green-600 font-mono">{formatCurrency(customerInventoryData.sales_metrics.total_profit || 0)}</span>
                                            </div>
                                            
                                            <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border-l-4 border-purple-500">
                                                <div className="flex items-center gap-3">
                                                    <Users className="h-6 w-6 text-purple-600" />
                                                    <span className="text-lg font-bold text-purple-800">تعداد مشتریان</span>
                                                </div>
                                                <span className="text-2xl font-bold text-purple-600 font-mono">{customerInventoryData.sales_metrics.total_customers || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Enhanced Empty States */}
                        {(!warehouseInventoryData?.batch_details || warehouseInventoryData.batch_details.length === 0) && 
                         (!customerInventoryData?.batch_summary || customerInventoryData.batch_summary.length === 0) && (
                            <div className="avoid-break">
                                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-8 text-center shadow-lg">
                                    <div className="flex justify-center mb-6">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-yellow-200 rounded-2xl blur-lg opacity-50"></div>
                                            <div className="relative bg-yellow-100 p-6 rounded-2xl">
                                                <Package className="h-16 w-16 text-yellow-600 mx-auto" />
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-yellow-800 mb-4">اطلاعات موجودی موجود نیست</h3>
                                    <p className="text-lg text-yellow-700 mb-3">این خرید هنوز به انبار منتقل نشده یا به مشتریان فروخته نشده است.</p>
                                    <p className="text-yellow-600 bg-yellow-100 inline-block px-4 py-2 rounded-lg">
                                        لطفاً پس از انتقال به انبار یا انجام فروش، گزارش را دوباره چاپ کنید.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Enhanced Footer */}
                <div className="max-w-5xl mx-auto mt-8">
                    <div className="bg-gradient-to-r from-slate-100 to-gray-100 rounded-2xl p-6 text-center border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <BadgeCheck className="h-5 w-5 text-green-600" />
                            <p className="text-sm font-semibold text-gray-700">این گزارش به صورت خودکار تولید شده است</p>
                        </div>
                        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>تاریخ چاپ: {formatDate(new Date())}</span>
                            </div>
                            <div className="w-px h-4 bg-gray-300"></div>
                            <span>سیستم مدیریت انبار و فروش</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 