import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerNavbar from '@/Components/CustomerNavbar';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { motion } from 'framer-motion';
import {
    Package,
    ArrowLeft,
    Calendar,
    DollarSign,
    Hash,
    ShoppingBag,
    Printer,
    ClipboardList,
    Tag,
    Box,
    FileText,
    CheckCircle2,
    BarChart3,
    Clock
} from 'lucide-react';

// PageLoader component
const PageLoader = ({ isVisible }) => {
    return (
        <motion.div
            className="fixed inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-950 z-50 flex flex-col items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? "all" : "none",
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            {/* Background patterns */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>

            {/* Animated light beams */}
            <div className="absolute w-full h-full overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-gradient-to-r from-blue-400/10 via-indigo-500/10 to-transparent h-[30vh] w-[100vw]"
                        style={{
                            top: `${10 + i * 20}%`,
                            left: "-100%",
                            transformOrigin: "left center",
                            rotate: `${-20 + i * 10}deg`,
                        }}
                        animate={{
                            left: ["100%", "-100%"],
                        }}
                        transition={{
                            duration: 15 + i * 2,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 3,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Main animated container */}
                <motion.div
                    className="relative"
                    animate={{
                        scale: [0.95, 1.05, 0.95],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    {/* Icon/logo in center */}
                    <motion.div
                        className="relative z-10 bg-gradient-to-br from-blue-500 to-indigo-600 h-20 w-20 rounded-2xl flex items-center justify-center shadow-xl"
                        animate={{
                            rotate: [0, 10, 0, -10, 0],
                            scale: [1, 1.1, 1, 1.1, 1],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <Box className="h-10 w-10 text-white drop-shadow-lg" />
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default function ShowStockIncome({ auth, stockIncome }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Format time
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString();
    };

    // Simulate loading delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title={t('Stock Income Details')}>
                <style>{`
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    .animate-shimmer { animation: shimmer 3s infinite; }

                    .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
                        background-size: 14px 14px;
                    }

                    .dark .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden max-w-full">
                {/* Sidebar */}
                <CustomerNavbar
                    auth={auth || {user: {name: 'Customer'}}}
                    currentRoute="customer.stock-incomes.show"
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden max-w-full">
                    {/* Header */}
                    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center space-x-4">
                            <Link
                                href={route('customer.stock-incomes.index')}
                                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
                            >
                                <ArrowLeft className="h-6 w-6" />
                            </Link>
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-0.5">
                                    {t("Stock Income")}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <Box className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    {t("Reference")}: {stockIncome?.reference_number}
                                </h1>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-6">
                            <div className="max-w-4xl mx-auto">
                                {/* Stock Income Details Card */}
                                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden mb-8">
                                    <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                                            <ClipboardList className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
                                            {t('Stock Income Details')}
                                        </h3>
                                    </div>

                                    <div className="p-8">
                                        <div className="flex flex-col md:flex-row gap-8">
                                            {/* Left Column - Basic Info */}
                                            <div className="flex-1 space-y-6">
                                                <h4 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                                                    <FileText className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                                                    {t('Basic Information')}
                                                </h4>

                                                {/* Reference Number */}
                                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
                                                            <Hash className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                {t('Reference Number')}
                                                            </h5>
                                                            <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                                                                {stockIncome?.reference_number}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Product */}
                                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-md">
                                                            <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                {t('Product')}
                                                            </h5>
                                                            <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                                                                {stockIncome?.product?.name}
                                                            </p>
                                                            {stockIncome?.product?.barcode && (
                                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                                                    <Tag className="h-4 w-4 mr-1 text-gray-400" />
                                                                    {t('Barcode')}: {stockIncome?.product?.barcode}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Date & Time */}
                                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 p-2 rounded-md">
                                                            <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                {t('Date & Time')}
                                                            </h5>
                                                            <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                                                                {formatDate(stockIncome?.created_at)}
                                                            </p>
                                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                                                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                                                {formatTime(stockIncome?.created_at)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column - Financial Info */}
                                            <div className="flex-1 space-y-6">
                                                <h4 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                                                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                                                    {t('Financial Details')}
                                                </h4>

                                                {/* Quantity */}
                                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 p-2 rounded-md">
                                                            <ShoppingBag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                {t('Quantity')}
                                                            </h5>
                                                            <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                                                                {stockIncome?.quantity} {t('units')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Unit Price */}
                                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-900/30 p-2 rounded-md">
                                                            <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                {t('Unit Price')}
                                                            </h5>
                                                            <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                                                                ${stockIncome?.price}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Total */}
                                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-900/20">
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 bg-blue-500 p-2 rounded-md">
                                                            <DollarSign className="h-5 w-5 text-white" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                {t('Total')}
                                                            </h5>
                                                            <p className="mt-1 text-lg font-bold text-blue-600 dark:text-blue-400">
                                                                ${stockIncome?.total}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Status */}
                                                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-900/20">
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 bg-green-500 p-2 rounded-md">
                                                            <CheckCircle2 className="h-5 w-5 text-white" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                {t('Status')}
                                                            </h5>
                                                            <p className="mt-1 text-base font-semibold text-green-600 dark:text-green-400">
                                                                {t('Completed')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-between items-center mt-6">
                                    <Link
                                        href={route('customer.stock-incomes.index')}
                                        className="px-4 py-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200 flex items-center shadow-sm"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        {t('Back to List')}
                                    </Link>

                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                                        onClick={() => window.print()}
                                    >
                                        <Printer className="h-4 w-4 mr-2" />
                                        {t('Print')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
} 