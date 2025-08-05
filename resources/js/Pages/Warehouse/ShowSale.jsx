import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
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
    Store,
    Receipt,
    Eye,
    BarChart3,
    Filter,
    ArrowUpDown,
    RefreshCw,
    X,
    ChevronDown,
    Hash,
    AlertCircle,
    Info,
    Save,
    Edit
} from 'lucide-react';
import Navigation from '@/Components/Warehouse/Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import PageLoader from '@/Components/Admin/PageLoader';
import BackButton from '@/Components/BackButton';

// Memoized animation variants to prevent re-creation
const animationVariants = {
    fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
    },
    slideIn: {
        hidden: { x: -20, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.4 } }
    },
    staggerChildren: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }
};

// Memoized status color function
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

// Memoized component for sale items
const SaleItemRow = memo(({ item, index, t }) => (
    <motion.tr
        className="bg-white/80 dark:bg-slate-800/80 border-b border-teal-200/30 dark:border-teal-800/30 hover:bg-gradient-to-r hover:from-teal-50/70 hover:to-cyan-50/70 dark:hover:from-teal-900/30 dark:hover:to-cyan-900/30 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        whileHover={{ scale: 1.005, boxShadow: '0 4px 20px rgba(20, 184, 166, 0.15)' }}
    >
        <td className="px-4 py-3">{index + 1}</td>
        <td className="px-4 py-4 font-semibold text-slate-800 dark:text-slate-200">
            <div className="flex items-center">
                <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg mr-3 shadow-md">
                    <Package className="h-4 w-4 text-white" />
                </div>
                <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                        {item.product.name}
                    </div>
                    {item.product.barcode && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {t('Barcode')}: {item.product.barcode}
                        </div>
                    )}
                </div>
            </div>
        </td>
        <td className="px-4 py-3 text-center">
            <span className="text-slate-700 dark:text-slate-300 font-medium">
                {item.unit || '-'}
            </span>
        </td>
        <td className="px-4 py-4 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/40 dark:to-cyan-900/40 text-teal-800 dark:text-teal-300 font-bold shadow-md">
                <span className="text-lg">{item.quantity}</span>
            </div>
        </td>
        <td className="px-4 py-3 text-center">
            <div className="text-sm">
                <p className={`text-lg font-bold ${parseFloat(item.quantity) < 10 ? "text-amber-600 dark:text-amber-500" : "text-emerald-600 dark:text-emerald-400"}`}>
                    {parseFloat(item.quantity) || 0} {item.product?.unit_name || t('Units')}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('Quantity')}
                </p>
            </div>
        </td>
        <td className="px-4 py-4 text-center">
            {item.batch_info ? (
                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50/70 to-teal-50/70 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200/30 dark:border-emerald-800/30">
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {item.batch_info.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                        {t('Code')}: {item.batch_info.code}
                    </div>
                    {item.batch_info.expiry_date && (
                        <div className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-900/30 px-2 py-1 rounded-full">
                            {t('Exp')}: {item.batch_info.expiry_date}
                        </div>
                    )}
                </div>
            ) : (
                <div className="p-3 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 dark:border-slate-700/30">
                    <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">{t('No Batch Info')}</span>
                </div>
            )}
        </td>
        <td className="px-4 py-3 text-center">
            <div className="flex flex-col items-center space-y-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                    {item.product.barcode && `${t('Barcode')}: ${item.product.barcode}`}
                </span>
                {item.batch_info?.manufacturing_date && (
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                        {t('MFG')}: {item.batch_info.manufacturing_date}
                    </span>
                )}
            </div>
        </td>
    </motion.tr>
));

// Memoized component for payment rows
const PaymentRow = memo(({ payment, index, t }) => (
    <motion.tr
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
));

// Memoized component for customer info items
const CustomerInfoItem = memo(({ icon: Icon, label, value, color = "teal" }) => (
    <motion.div
        whileHover={{ x: 5, transition: { duration: 0.2 } }}
        className="flex items-start p-2 rounded-lg hover:bg-teal-50/50 dark:hover:bg-teal-900/20 transition-colors"
    >
        <Icon className={`h-4 w-4 text-${color}-500 mt-0.5 mr-2`} />
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
        </div>
    </motion.div>
));

export default function ShowSale({ auth, sale, permissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [isPrintMode, setIsPrintMode] = useState(false);

    const { post, processing } = useForm();

    // Memoized computed values
    const statusColor = useMemo(() => getStatusColor(sale.status), [sale.status]);
    const totalPayments = useMemo(() => 
        sale.payments?.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) || 0, 
        [sale.payments]
    );

    // Optimized animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Memoized handlers
    const handleConfirmation = useCallback(() => {
        setLoading(true);
        post(route('warehouse.sales.confirm', sale.id), {
            onSuccess: () => setLoading(false),
            onError: () => setLoading(false)
        });
    }, [post, sale.id]);

    const handlePrint = useCallback(() => {
        setIsPrintMode(true);
        setTimeout(() => {
            window.print();
            setIsPrintMode(false);
        }, 100);
    }, []);

    // Memoized customer info items
    const customerInfoItems = useMemo(() => [
        { icon: Mail, label: t('Email'), value: sale.customer.email, condition: sale.customer.email },
        { icon: Phone, label: t('Phone'), value: sale.customer.phone, condition: sale.customer.phone },
        { icon: MapPin, label: t('Address'), value: sale.customer.address, condition: sale.customer.address },
        { icon: Building, label: t('Tax Number'), value: sale.customer.tax_number, condition: sale.customer.tax_number }
    ].filter(item => item.condition), [sale.customer, t]);

    return (
        <>
            <Head title={t(`Shop Sale #${sale.reference}`)}>
                <style>{`
                    @keyframes shimmer {
                        0% { background-position: -1000px 0; }
                        100% { background-position: 1000px 0; }
                    }

                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }

                    @keyframes pulse-glow {
                        0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
                        50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.6); }
                    }

                    .shimmer {
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                        background-size: 1000px 100%;
                        animation: shimmer 2s infinite;
                    }

                    .float-animation {
                        animation: float 6s ease-in-out infinite;
                    }

                    .pulse-glow {
                        animation: pulse-glow 2s ease-in-out infinite;
                    }

                    .glass-effect {
                        background: rgba(255, 255, 255, 0.1);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                    }

                    .dark .glass-effect {
                        background: rgba(0, 0, 0, 0.2);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    }

                    .gradient-border {
                        background: linear-gradient(white, white) padding-box,
                                    linear-gradient(45deg, #10b981, #059669) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #10b981, #059669) border-box;
                    }

                    /* Responsive improvements */
                    @media (max-width: 768px) {
                        .grid-cols-1.lg\\:grid-cols-3 {
                            grid-template-columns: 1fr;
                        }
                        
                        .text-4xl {
                            font-size: 1.875rem;
                        }
                        
                        .p-8 {
                            padding: 1rem;
                        }
                    }

                    /* Accessibility improvements */
                    @media (prefers-reduced-motion: reduce) {
                        .float-animation,
                        .pulse-glow,
                        .shimmer {
                            animation: none;
                        }
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={Receipt} color="green" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className={`flex h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-emerald-950 dark:to-teal-950 overflow-hidden ${isPrintMode ? 'print-mode' : ''}`}
            >
                {/* Sidebar - Hidden in print mode */}
                {!isPrintMode && (
                    <Navigation auth={auth} currentRoute="warehouse.sales" />
                )}

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header - Hidden in print mode */}
                    {!isPrintMode && (
                        <motion.header
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-700/60 py-6 px-8 sticky top-0 z-30 shadow-sm dark:shadow-slate-900/20"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <motion.div
                                        initial={{
                                            scale: 0.8,
                                            opacity: 0,
                                            rotate: -180,
                                        }}
                                        animate={{
                                            scale: 1,
                                            opacity: 1,
                                            rotate: 0,
                                        }}
                                        transition={{
                                            delay: 0.3,
                                            duration: 0.6,
                                            type: "spring",
                                            stiffness: 200,
                                        }}
                                        className="relative float-animation"
                                    >
                                        <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-2xl blur-lg opacity-60 dark:opacity-40"></div>
                                        <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 p-4 rounded-2xl shadow-2xl">
                                            <Receipt className="w-8 h-8 text-white" />
                                            <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                        </div>
                                    </motion.div>
                                    <div>
                                        <motion.p
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{
                                                delay: 0.4,
                                                duration: 0.4,
                                            }}
                                            className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-2"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            {t("Sales Management")}
                                        </motion.p>
                                        <motion.h1
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{
                                                delay: 0.5,
                                                duration: 0.4,
                                            }}
                                            className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent"
                                        >
                                            {t('Shop Sale Detail')}: {sale.reference}
                                        </motion.h1>
                                        <motion.p
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{
                                                delay: 0.6,
                                                duration: 0.4,
                                            }}
                                            className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"
                                        >
                                            <BarChart3 className="w-4 h-4" />
                                            {t("View sale details and manage confirmation")}
                                        </motion.p>
                                    </div>
                                </div>

                                <motion.div
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.7, duration: 0.4 }}
                                    className="flex items-center space-x-3"
                                >
                                    {permissions?.generate_invoice && (
                                        <Button
                                            variant="outline"
                                            className="gap-2 hover:scale-105 transition-all duration-200 border-slate-300 dark:border-slate-600 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300"
                                            onClick={handlePrint}
                                        >
                                            <Printer className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {permissions?.confirm_sales && !sale.confirmed_by_warehouse && (
                                        <Button
                                            className="gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:via-teal-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                                            onClick={handleConfirmation}
                                            disabled={processing || loading}
                                        >
                                            <CheckCircle className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <BackButton href={route('warehouse.sales')} className="gap-2 hover:scale-105 transition-all duration-200 border-slate-300 dark:border-slate-600 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300" />
                                </motion.div>
                            </div>
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

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-emerald-300 dark:scrollbar-thumb-emerald-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="space-y-8"
                            >
                        {/* Sale Status and Info */}
                        <motion.div variants={animationVariants.fadeIn} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            <motion.div
                                variants={animationVariants.slideIn}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className="col-span-2"
                            >
                                <Card className="col-span-2 shadow-2xl bg-gradient-to-br from-white/95 to-emerald-50/30 dark:from-slate-800/95 dark:to-emerald-900/20 backdrop-blur-xl border border-emerald-200/50 dark:border-emerald-800/50 overflow-hidden">
                                    <div className={`h-3 w-full bg-gradient-to-r ${statusColor} shadow-lg`}></div>
                                    <CardHeader className="pb-4 border-b border-emerald-200/50 dark:border-emerald-800/50 bg-gradient-to-r from-emerald-50/50 to-transparent dark:from-emerald-900/20">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center">
                                                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl mr-3 shadow-lg">
                                                    <Sparkles className="h-5 w-5 text-white" />
                                                </div>
                                                {t('Shop Sale Information')}
                                            </CardTitle>
                                            <Badge
                                                className={`
                                                    ${sale.status === 'completed' ? 'bg-gradient-to-r from-emerald-500 to-green-400 text-white shadow-lg' :
                                                      sale.status === 'pending' ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-white shadow-lg' :
                                                      'bg-gradient-to-r from-red-500 to-rose-400 text-white shadow-lg'}
                                                    capitalize px-4 py-2 text-sm font-semibold rounded-full
                                                `}
                                            >
                                                {sale.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <motion.div
                                                    whileHover={{ x: 5, scale: 1.02, transition: { duration: 0.2 } }}
                                                    className="flex items-start p-4 rounded-xl bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-900/20 hover:from-emerald-100/70 hover:to-teal-100/70 dark:hover:from-emerald-800/30 dark:hover:to-teal-800/30 transition-all duration-300 border border-emerald-200/30 dark:border-emerald-800/30"
                                                >
                                                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg mr-3 shadow-md">
                                                        <Calendar className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">{t('Date')}</p>
                                                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-lg">{sale.date}</p>
                                                    </div>
                                                </motion.div>
                                                <motion.div
                                                    whileHover={{ x: 5, scale: 1.02, transition: { duration: 0.2 } }}
                                                    className="flex items-start p-4 rounded-xl bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-900/20 hover:from-emerald-100/70 hover:to-teal-100/70 dark:hover:from-emerald-800/30 dark:hover:to-teal-800/30 transition-all duration-300 border border-emerald-200/30 dark:border-emerald-800/30"
                                                >
                                                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg mr-3 shadow-md">
                                                        <Store className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">{t('Reference')}</p>
                                                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-lg">{sale.reference}</p>
                                                    </div>
                                                </motion.div>
                                                <motion.div
                                                    whileHover={{ x: 5, scale: 1.02, transition: { duration: 0.2 } }}
                                                    className="flex items-start p-4 rounded-xl bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-900/20 hover:from-emerald-100/70 hover:to-teal-100/70 dark:hover:from-emerald-800/30 dark:hover:to-teal-800/30 transition-all duration-300 border border-emerald-200/30 dark:border-emerald-800/30"
                                                >
                                                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg mr-3 shadow-md">
                                                        <CreditCard className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">{t('Currency')}</p>
                                                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-lg">{sale.currency}</p>
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
                                variants={animationVariants.slideIn}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <Card className="shadow-2xl bg-gradient-to-br from-white/95 to-teal-50/30 dark:from-slate-800/95 dark:to-teal-900/20 backdrop-blur-xl border border-teal-200/50 dark:border-teal-800/50 overflow-hidden">
                                    <div className="h-3 w-full bg-gradient-to-r from-teal-500 to-cyan-400 shadow-lg"></div>
                                    <CardHeader className="pb-4 border-b border-teal-200/50 dark:border-teal-800/50 bg-gradient-to-r from-teal-50/50 to-transparent dark:from-teal-900/20">
                                        <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center">
                                            <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl mr-3 shadow-lg">
                                                <User className="h-5 w-5 text-white" />
                                            </div>
                                            {t('Customer Information')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <motion.div
                                            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                            className="flex items-start mb-6 p-4 rounded-xl bg-gradient-to-r from-teal-50/50 to-cyan-50/50 dark:from-teal-900/20 dark:to-cyan-900/20 border border-teal-200/30 dark:border-teal-800/30"
                                        >
                                            <Avatar className="h-12 w-12 mr-4 ring-4 ring-teal-300 dark:ring-teal-700 shadow-lg">
                                                <AvatarFallback className="bg-gradient-to-br from-teal-600 to-cyan-600 text-white font-bold text-lg">
                                                    {sale.customer.name ? sale.customer.name.charAt(0).toUpperCase() : 'C'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-1">{sale.customer.name}</h3>
                                                <p className="text-sm text-teal-600 dark:text-teal-400 font-medium">{t('Customer ID')}: {sale.customer.id}</p>
                                            </div>
                                        </motion.div>

                                        <div className="space-y-3">
                                            {customerInfoItems.map((item, index) => (
                                                <CustomerInfoItem
                                                    key={index}
                                                    icon={item.icon}
                                                    label={item.label}
                                                    value={item.value}
                                                    color="teal"
                                                />
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>

                        {/* Sale Items */}
                        <motion.div
                            variants={animationVariants.fadeIn}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="mb-6"
                        >
                            <Card className="shadow-2xl bg-gradient-to-br from-white/95 to-teal-50/30 dark:from-slate-800/95 dark:to-teal-900/20 backdrop-blur-xl border border-teal-200/50 dark:border-teal-800/50 overflow-hidden">
                                <div className="h-3 w-full bg-gradient-to-r from-teal-500 to-cyan-400 shadow-lg"></div>
                                <CardHeader className="pb-4 border-b border-teal-200/50 dark:border-teal-800/50 bg-gradient-to-r from-teal-50/50 to-transparent dark:from-teal-900/20">
                                    <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center">
                                        <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl mr-3 shadow-lg">
                                            <Package className="h-5 w-5 text-white" />
                                        </div>
                                        {t('Sale Items')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="overflow-x-auto rounded-xl border border-teal-200/30 dark:border-teal-800/30">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-gradient-to-r from-teal-100/80 to-cyan-100/80 dark:from-teal-900/60 dark:to-cyan-900/60 border-b border-teal-200/50 dark:border-teal-800/50">
                                                <tr>
                                                    <th scope="col" className="px-4 py-3 w-16 rounded-tl-lg">{t('#')}</th>
                                                    <th scope="col" className="px-4 py-3">{t('Product')}</th>
                                                    <th scope="col" className="px-4 py-3 text-center">{t('Unit')}</th>
                                                    <th scope="col" className="px-4 py-3 text-center">{t('Quantity')}</th>
                                                    <th scope="col" className="px-4 py-3 text-center">{t('Batch Info')}</th>
                                                    <th scope="col" className="px-4 py-3 text-center rounded-tr-lg">{t('Details')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sale.sale_items.map((item, index) => (
                                                    <SaleItemRow
                                                        key={item.id}
                                                        item={item}
                                                        index={index}
                                                        t={t}
                                                    />
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="font-semibold text-slate-800 dark:text-slate-200 border-t-2 border-teal-200/50 dark:border-teal-800/50 bg-gradient-to-r from-teal-50/50 to-cyan-50/50 dark:from-teal-900/20 dark:to-cyan-900/20">
                                                    <td colSpan="6" className="px-6 py-4 text-center">
                                                        <div className="flex items-center justify-center space-x-8">
                                                            <div className="flex items-center space-x-2">
                                                                <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg shadow-md">
                                                                    <Package className="h-4 w-4 text-white" />
                                                                </div>
                                                                <span className="text-slate-700 dark:text-slate-300 font-bold">
                                                                    {t('Total Items')}: {sale.items_count}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-md">
                                                                    <Receipt className="h-4 w-4 text-white" />
                                                                </div>
                                                                <span className="text-slate-700 dark:text-slate-300 font-bold">
                                                                    {t('Sale Reference')}: {sale.reference}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Payment History */}
                        {sale.payments && sale.payments.length > 0 && (
                            <motion.div
                                variants={animationVariants.fadeIn}
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
                                                        <PaymentRow
                                                            key={payment.id}
                                                            payment={payment}
                                                            index={index}
                                                            t={t}
                                                        />
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 font-semibold">
                                                        <td colSpan="3" className="px-4 py-3 text-right">{t('Total Payments')}:</td>
                                                        <td className="px-4 py-3 text-right text-emerald-700 dark:text-emerald-300">
                                                            {sale.currency} {totalPayments.toFixed(2)}
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
                    </main>
                </div>
            </motion.div>

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