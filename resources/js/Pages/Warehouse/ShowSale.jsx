import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
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
    Truck,
    Sparkles,
    Store
} from 'lucide-react';
import Navigation from '@/Components/Warehouse/Navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Define animation variants
const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
};

const slideIn = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4 } }
};

const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function ShowSale({ auth, sale }) {
    const { t } = useLaravelReactI18n();
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

    // Generate colors based on status
    const getStatusColor = (status) => {
        switch(status) {
            case 'completed':
                return 'from-emerald-500 to-green-400';
            case 'pending':
                return 'from-amber-500 to-yellow-400';
            default:
                return 'from-red-500 to-rose-400';
        }
    };

    return (
        <>
            <Head title={t(`Shop Sale #${sale.reference}`)} />

            <div className={`flex h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-950 dark:to-teal-950 ${isPrintMode ? 'print-mode' : ''}`}>
                {/* Sidebar - Hidden in print mode */}
                {!isPrintMode && (
                    <Navigation auth={auth} currentRoute="warehouse.sales" />
                )}

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-auto">
                    {/* Header - Hidden in print mode */}
                    {!isPrintMode && (
                        <motion.header
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="bg-white dark:bg-gray-800 shadow-lg p-4 flex items-center justify-between relative overflow-hidden backdrop-blur-sm flex-shrink-0 border-b border-emerald-100 dark:border-emerald-900/30"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/90 via-teal-50/80 to-white/90 dark:from-emerald-950/90 dark:via-teal-900/80 dark:to-gray-900/90 opacity-90"></div>
                            <motion.div
                                variants={slideIn}
                                className="flex items-center space-x-3 relative z-10"
                            >
                                <Link href={route('warehouse.sales')} className="flex items-center text-emerald-600 hover:text-emerald-800 transition-colors hover:scale-105 transform duration-200">
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    <span>{t('Back to Shop Sales')}</span>
                                </Link>
                                <div className="h-4 w-px bg-emerald-200 dark:bg-emerald-700"></div>
                                <div className="relative">
                                    <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                        <Store className="h-5 w-5 mr-2 text-emerald-600" />
                                        {t('Shop Sale Detail')}: <span className="text-emerald-600 ml-1">{sale.reference}</span>
                                    </h1>
                                </div>
                            </motion.div>
                            <motion.div
                                variants={slideIn}
                                className="relative z-10 flex space-x-2"
                            >
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex items-center gap-1.5 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 transition-all duration-200 shadow-sm hover:scale-105 transform border-emerald-200 dark:border-emerald-700"
                                    onClick={handlePrint}
                                >
                                    <Printer className="h-4 w-4" />
                                    <span>{t('Print Invoice')}</span>
                                </Button>
                                {!sale.confirmed_by_warehouse && (
                                    <Button
                                        size="sm"
                                        className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105 transform"
                                        onClick={handleConfirmation}
                                        disabled={processing || loading}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-1.5" />
                                        <span>{t('Confirm Shop Sale')}</span>
                                    </Button>
                                )}
                            </motion.div>
                        </motion.header>
                    )}

                    {/* Print Header - Only shown in print mode */}
                    {isPrintMode && (
                        <div className="print-header p-4 border-b">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <Store className="h-8 w-8 text-emerald-600 mr-3" />
                                    <div className="text-3xl font-bold text-gray-900">{t('Shop Invoice')}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-gray-900">{t('INVOICE')}</div>
                                    <div className="text-gray-600">{sale.reference}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content Section */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerChildren}
                        className="flex-1 p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-950 dark:to-teal-950"
                    >
                        {/* Sale Status and Info */}
                        <motion.div variants={fadeIn} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            <motion.div
                                variants={slideIn}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className="col-span-2"
                            >
                                <Card className="col-span-2 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-emerald-100 dark:border-emerald-900/30 overflow-hidden">
                                    <div className={`h-2 w-full bg-gradient-to-r ${getStatusColor(sale.status)}`}></div>
                                    <CardHeader className="pb-2 border-b border-emerald-100 dark:border-emerald-900/30">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center">
                                                <Sparkles className="h-5 w-5 mr-2 text-emerald-500" />
                                                {t('Shop Sale Information')}
                                            </CardTitle>
                                            <Badge
                                                className={`
                                                    ${sale.status === 'completed' ? 'bg-gradient-to-r from-emerald-500 to-green-400 text-white' :
                                                      sale.status === 'pending' ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-white' :
                                                      'bg-gradient-to-r from-red-500 to-rose-400 text-white'}
                                                    capitalize shadow-sm px-3 py-1
                                                `}
                                            >
                                                {sale.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-4">
                                                <motion.div
                                                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                                    className="flex items-start p-3 rounded-lg hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-colors"
                                                >
                                                    <Calendar className="h-5 w-5 text-emerald-600 mt-0.5 mr-2" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('Date')}</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">{sale.date}</p>
                                                    </div>
                                                </motion.div>
                                                <motion.div
                                                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                                    className="flex items-start p-3 rounded-lg hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-colors"
                                                >
                                                    <Store className="h-5 w-5 text-emerald-600 mt-0.5 mr-2" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('Reference')}</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">{sale.reference}</p>
                                                    </div>
                                                </motion.div>
                                                <motion.div
                                                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                                    className="flex items-start p-3 rounded-lg hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-colors"
                                                >
                                                    <CreditCard className="h-5 w-5 text-emerald-600 mt-0.5 mr-2" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('Currency')}</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">{sale.currency}</p>
                                                    </div>
                                                </motion.div>
                                            </div>
                                            <div className="space-y-4">
                                                <motion.div
                                                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                                    className="flex items-start p-3 rounded-lg hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-colors"
                                                >
                                                    <Clock className="h-5 w-5 text-emerald-600 mt-0.5 mr-2" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('Created')}</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">{sale.created_at}</p>
                                                    </div>
                                                </motion.div>
                                                <motion.div
                                                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                                    className="flex items-start p-3 rounded-lg hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-colors"
                                                >
                                                    <Truck className="h-5 w-5 text-emerald-600 mt-0.5 mr-2" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('Shop Confirmation')}</p>
                                                        <div className="font-medium text-gray-900 dark:text-white">
                                                            {sale.confirmed_by_warehouse ? (
                                                                <motion.span
                                                                    className="flex items-center text-green-600"
                                                                    initial={{ scale: 0.8 }}
                                                                    animate={{ scale: 1 }}
                                                                    transition={{ yoyo: 1, duration: 0.3 }}
                                                                >
                                                                    <CheckCircle className="h-4 w-4 mr-1" /> {t('Confirmed')}
                                                                </motion.span>
                                                            ) : (
                                                                <motion.span
                                                                    className="flex items-center text-amber-600"
                                                                    animate={{ opacity: [0.6, 1, 0.6] }}
                                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                                >
                                                                    <XCircle className="h-4 w-4 mr-1" /> {t('Pending')}
                                                                </motion.span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                                <motion.div
                                                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                                    className="flex items-start p-3 rounded-lg hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-colors"
                                                >
                                                    <Package className="h-5 w-5 text-emerald-600 mt-0.5 mr-2" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Items Count</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">{sale.items_count} {t('items')}</p>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        </div>

                                        {sale.notes && (
                                            <motion.div
                                                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                                                className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800"
                                            >
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                                                    <Sparkles className="h-4 w-4 mr-1 text-emerald-500" />
                                                    {t('Notes')}
                                                </p>
                                                <p className="text-gray-700 dark:text-gray-300">{sale.notes}</p>
                                            </motion.div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div
                                variants={slideIn}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <Card className="shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-teal-100 dark:border-teal-900/30 overflow-hidden">
                                    <div className="h-2 w-full bg-gradient-to-r from-teal-500 to-cyan-400"></div>
                                    <CardHeader className="pb-2 border-b border-teal-100 dark:border-teal-900/30">
                                        <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center">
                                            <User className="h-5 w-5 mr-2 text-teal-500" />
                                            {t('Customer Information')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <motion.div
                                            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                            className="flex items-start mb-4"
                                        >
                                            <Avatar className="h-10 w-10 mr-3 ring-2 ring-teal-300 dark:ring-teal-700">
                                                <AvatarFallback className="bg-gradient-to-br from-teal-600 to-cyan-600 text-white">
                                                    {sale.customer.name ? sale.customer.name.charAt(0).toUpperCase() : 'C'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-white">{sale.customer.name}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('Customer ID')}: {sale.customer.id}</p>
                                            </div>
                                        </motion.div>

                                        <div className="space-y-3">
                                            {sale.customer.email && (
                                                <motion.div
                                                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                                    className="flex items-start p-2 rounded-lg hover:bg-teal-50/50 dark:hover:bg-teal-900/20 transition-colors"
                                                >
                                                    <Mail className="h-4 w-4 text-teal-500 mt-0.5 mr-2" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('Email')}</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">{sale.customer.email}</p>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {sale.customer.phone && (
                                                <motion.div
                                                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                                    className="flex items-start p-2 rounded-lg hover:bg-teal-50/50 dark:hover:bg-teal-900/20 transition-colors"
                                                >
                                                    <Phone className="h-4 w-4 text-teal-500 mt-0.5 mr-2" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('Phone')}</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">{sale.customer.phone}</p>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {sale.customer.address && (
                                                <motion.div
                                                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                                    className="flex items-start p-2 rounded-lg hover:bg-teal-50/50 dark:hover:bg-teal-900/20 transition-colors"
                                                >
                                                    <MapPin className="h-4 w-4 text-teal-500 mt-0.5 mr-2" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('Address')}</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">{sale.customer.address}</p>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {sale.customer.tax_number && (
                                                <motion.div
                                                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                                    className="flex items-start p-2 rounded-lg hover:bg-teal-50/50 dark:hover:bg-teal-900/20 transition-colors"
                                                >
                                                    <Building className="h-4 w-4 text-teal-500 mt-0.5 mr-2" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('Tax Number')}</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">{sale.customer.tax_number}</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>

                        {/* Sale Items */}
                        <motion.div
                            variants={fadeIn}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="mb-6"
                        >
                            <Card className="shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-teal-100 dark:border-teal-900/30 overflow-hidden">
                                <div className="h-2 w-full bg-gradient-to-r from-teal-500 to-cyan-400"></div>
                                <CardHeader className="pb-2 border-b border-teal-100 dark:border-teal-900/30">
                                    <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center">
                                        <Package className="h-4 w-4 mr-2 text-teal-500" />
                                        {t('Sale Items')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/40 dark:to-cyan-900/40">
                                                <tr>
                                                    <th scope="col" className="px-4 py-3 w-16 rounded-tl-lg">#</th>
                                                    <th scope="col" className="px-4 py-3">{t('Product')}</th>
                                                    <th scope="col" className="px-4 py-3 text-center">{t('Unit')}</th>
                                                    <th scope="col" className="px-4 py-3 text-center">{t('Quantity')}</th>
                                                    <th scope="col" className="px-4 py-3 text-center">{t('Smart Quantity')}</th>
                                                    <th scope="col" className="px-4 py-3 text-center">{t('Unit Price')}</th>
                                                    <th scope="col" className="px-4 py-3 text-right rounded-tr-lg">{t('Total')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sale.sale_items.map((item, index) => (
                                                    <motion.tr
                                                        key={item.id}
                                                        className="bg-white dark:bg-gray-800 border-b border-teal-100 dark:border-teal-900/30 hover:bg-teal-50/50 dark:hover:bg-teal-900/30"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05, duration: 0.3 }}
                                                        whileHover={{ backgroundColor: 'rgba(20, 184, 166, 0.1)', scale: 1.005 }}
                                                    >
                                                        <td className="px-4 py-3">{index + 1}</td>
                                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                                            <div className="flex items-center">
                                                                <Package className="h-4 w-4 text-teal-500 mr-2" />
                                                                {item.product.name}
                                                                {item.product.barcode && (
                                                                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                                                        ({item.product.barcode})
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">{item.unit || '-'}</td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 font-medium">
                                                                {item.quantity}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <div className="text-sm">
                                                                <p className={`text-lg font-bold ${parseFloat(item.quantity) < 10 ? "text-amber-600 dark:text-amber-500" : "text-emerald-600 dark:text-emerald-400"}`}>
                                                                    {(() => {
                                                                        const netQty = parseFloat(item.quantity) || 0;
                                                                        const wholesaleAmount = item.product?.whole_sale_unit_amount || 1;
                                                                        const wholesaleUnits = Math.floor(netQty / wholesaleAmount);
                                                                        const remainderUnits = netQty % wholesaleAmount;
                                                                        
                                                                        let display = "";
                                                                        if (wholesaleUnits > 0) {
                                                                            display += `${wholesaleUnits} ${item.product?.wholesaleUnit?.name || t("Units")}`;
                                                                        }
                                                                        if (remainderUnits > 0) {
                                                                            if (display) display += " + ";
                                                                            display += `${remainderUnits} ${item.product?.retailUnit?.name || t("Units")}`;
                                                                        }
                                                                        if (!display) display = `${netQty} ${t("Units")}`;
                                                                        
                                                                        // Add actual amount in parentheses
                                                                        display += ` (${netQty} ${t("total")})`;
                                                                        
                                                                        return display;
                                                                    })()}
                                                                </p>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className="text-gray-800 dark:text-gray-200">
                                                                {sale.currency} {parseFloat(item.unit_price).toFixed(2)}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-medium">
                                                            <span className="text-teal-700 dark:text-teal-300">
                                                                {sale.currency} {parseFloat(item.total).toFixed(2)}
                                                            </span>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="font-semibold text-gray-900 dark:text-white border-t-2 border-teal-200 dark:border-teal-800">
                                                    <td colSpan="6" className="px-4 py-3 text-right">{t('Subtotal')}:</td>
                                                    <td className="px-4 py-3 text-right">{sale.currency} {parseFloat(sale.total_amount).toFixed(2)}</td>
                                                </tr>
                                                {sale.tax_percentage > 0 && (
                                                    <tr className="text-gray-900 dark:text-white">
                                                        <td colSpan="6" className="px-4 py-3 text-right">{t('Tax')} ({sale.tax_percentage}%):</td>
                                                        <td className="px-4 py-3 text-right">{sale.currency} {parseFloat(sale.tax_amount).toFixed(2)}</td>
                                                    </tr>
                                                )}
                                                {sale.discount_percentage > 0 && (
                                                    <tr className="text-gray-900 dark:text-white">
                                                        <td colSpan="6" className="px-4 py-3 text-right">{t('Discount')} ({sale.discount_percentage}%):</td>
                                                        <td className="px-4 py-3 text-right text-pink-600 dark:text-pink-400">-{sale.currency} {parseFloat(sale.discount_amount).toFixed(2)}</td>
                                                    </tr>
                                                )}
                                                {sale.shipping_cost > 0 && (
                                                    <tr className="text-gray-900 dark:text-white">
                                                        <td colSpan="6" className="px-4 py-3 text-right">{t('Shipping')}:</td>
                                                        <td className="px-4 py-3 text-right">{sale.currency} {parseFloat(sale.shipping_cost).toFixed(2)}</td>
                                                    </tr>
                                                )}
                                                <motion.tr
                                                    className="font-bold text-gray-900 dark:text-white text-lg border-t-2 border-teal-200 dark:border-teal-800"
                                                    whileHover={{ scale: 1.01 }}
                                                >
                                                    <td colSpan="6" className="px-4 py-3 text-right">{t('Total')}:</td>
                                                    <td className="px-4 py-3 text-right bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-r">
                                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-teal-400 dark:to-cyan-300">
                                                            {sale.currency} {parseFloat(sale.total_amount).toFixed(2)}
                                                        </span>
                                                    </td>
                                                </motion.tr>
                                                <tr className="text-gray-900 dark:text-white">
                                                    <td colSpan="6" className="px-4 py-3 text-right">{t('Paid Amount')}:</td>
                                                    <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400">{sale.currency} {parseFloat(sale.paid_amount).toFixed(2)}</td>
                                                </tr>
                                                <motion.tr
                                                    className="font-semibold text-gray-900 dark:text-white"
                                                    animate={{ backgroundColor: ['rgba(20, 184, 166, 0.05)', 'rgba(20, 184, 166, 0.1)', 'rgba(20, 184, 166, 0.05)'] }}
                                                    transition={{ repeat: Infinity, duration: 3 }}
                                                >
                                                    <td colSpan="6" className="px-4 py-3 text-right">{t('Due Amount')}:</td>
                                                    <td className="px-4 py-3 text-right text-amber-600 dark:text-amber-400">{sale.currency} {parseFloat(sale.due_amount).toFixed(2)}</td>
                                                </motion.tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Payment History */}
                        {sale.payments && sale.payments.length > 0 && (
                            <motion.div
                                variants={fadeIn}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <Card className="shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-emerald-100 dark:border-emerald-900/30 overflow-hidden">
                                    <div className="h-2 w-full bg-gradient-to-r from-emerald-500 to-green-400"></div>
                                    <CardHeader className="pb-2 border-b border-emerald-100 dark:border-emerald-900/30">
                                        <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center">
                                            <CreditCard className="h-4 w-4 mr-2 text-emerald-500" />
                                            {t('Payment History')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/40">
                                                    <tr>
                                                        <th scope="col" className="px-4 py-3 rounded-tl-lg">{t('Date')}</th>
                                                        <th scope="col" className="px-4 py-3">{t('Reference')}</th>
                                                        <th scope="col" className="px-4 py-3">{t('Payment Method')}</th>
                                                        <th scope="col" className="px-4 py-3 text-right rounded-tr-lg">{t('Amount')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-emerald-100 dark:divide-emerald-900/30">
                                                    {sale.payments.map((payment, index) => (
                                                        <motion.tr
                                                            key={payment.id}
                                                            className="bg-white dark:bg-gray-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/30"
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.05, duration: 0.3 }}
                                                            whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', scale: 1.005 }}
                                                        >
                                                            <td className="px-4 py-3 font-medium">{payment.payment_date}</td>
                                                            <td className="px-4 py-3">{payment.reference || '-'}</td>
                                                            <td className="px-4 py-3">
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                                                                    {payment.payment_method}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-right font-medium text-emerald-700 dark:text-emerald-300">
                                                                {payment.currency} {parseFloat(payment.amount).toFixed(2)}
                                                            </td>
                                                        </motion.tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 font-semibold">
                                                        <td colSpan="3" className="px-4 py-3 text-right">{t('Total Payments')}:</td>
                                                        <td className="px-4 py-3 text-right text-emerald-700 dark:text-emerald-300">
                                                            {sale.currency} {parseFloat(sale.paid_amount).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Print styles - Only applied when printing */}
            <style>{`
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
