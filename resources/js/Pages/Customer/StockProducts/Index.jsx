import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerNavbar from '@/Components/CustomerNavbar';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import {
    Package,
    Plus,
    Search,
    Filter,
    RefreshCw,
    DollarSign,
    Box,
    ArrowLeft,
    PackageSearch,
    TrendingUp,
    TrendingDown,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { motion } from 'framer-motion';

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

            {/* Animated particles */}
            <div className="absolute inset-0">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                            width: Math.random() * 4 + 1,
                            height: Math.random() * 4 + 1,
                            x: `${Math.random() * 100}%`,
                            y: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.5 + 0.2,
                        }}
                        animate={{
                            y: [null, `${-Math.random() * 100 - 50}%`],
                            opacity: [null, 0],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 5,
                            repeat: Infinity,
                            ease: "linear",
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
                    {/* Pulsing background circles */}
                    <motion.div
                        className="absolute w-64 h-64 rounded-full bg-blue-600/5 filter blur-2xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute w-72 h-72 rounded-full bg-indigo-500/5 filter blur-2xl transform -translate-x-4 translate-y-4"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                        }}
                    />

                    {/* Animated logo/icon container */}
                    <div className="relative flex items-center justify-center h-40 w-40">
                        {/* Spinning rings */}
                        <motion.div
                            className="absolute h-full w-full rounded-full border-4 border-blue-300/10"
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 20,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                        />
                        <motion.div
                            className="absolute h-[85%] w-[85%] rounded-full border-4 border-indigo-400/20"
                            animate={{
                                rotate: -360,
                            }}
                            transition={{
                                duration: 15,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                        />
                        <motion.div
                            className="absolute h-[70%] w-[70%] rounded-full border-4 border-blue-400/30"
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 10,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                        />

                        {/* Spinner arcs */}
                        <motion.div
                            className="absolute h-full w-full rounded-full border-4 border-r-blue-400 border-t-transparent border-l-transparent border-b-transparent"
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 1.5,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                        />
                        <motion.div
                            className="absolute h-full w-full rounded-full border-4 border-b-indigo-400 border-t-transparent border-l-transparent border-r-transparent"
                            animate={{ rotate: -180 }}
                            transition={{
                                duration: 2,
                                ease: "easeInOut",
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                        />

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
                            <Package className="h-10 w-10 text-white drop-shadow-lg" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default function StockProductsIndex({ stockProducts, search, isFilterOpen, auth }) {
    const { t } = useLaravelReactI18n();
    const [filterOpen, setFilterOpen] = useState(isFilterOpen);
    const [loading, setLoading] = useState(true);

    // Simulate loading delay
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title={t('Stock Products')}>
                <style>{`
                    @keyframes shimmer {
                        0% {
                            transform: translateX(-100%);
                        }
                        100% {
                            transform: translateX(100%);
                        }
                    }
                    .animate-shimmer {
                        animation: shimmer 3s infinite;
                    }

                    .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
                        background-size: 14px 14px;
                    }

                    .dark .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                    }

                    .card-shine {
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 50%;
                        height: 100%;
                        background: linear-gradient(
                            to right,
                            rgba(255, 255, 255, 0) 0%,
                            rgba(255, 255, 255, 0.3) 50%,
                            rgba(255, 255, 255, 0) 100%
                        );
                    }

                    /* Fix for horizontal scroll */
                    html, body {
                        overflow-x: hidden;
                        max-width: 100%;
                    }

                    .responsive-chart-container {
                        max-width: 100%;
                        overflow-x: hidden;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden max-w-full">
                {/* Sidebar */}
                <CustomerNavbar
                    auth={auth || {user: {name: 'Customer'}}}
                    currentRoute="customer.stock-products"
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden max-w-full">
                    {/* Header */}
                    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-0.5">
                                    {t("Customer Portal")}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    {t("Stock Products Management")}
                                </h1>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-6">
                            <div className="max-w-7xl mx-auto">
                                {/* Hero Section with Gradient Background */}
                                <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-xl p-10 mb-10 overflow-hidden">
                                    <div className="absolute inset-0 bg-pattern opacity-10"></div>
                                    <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-gradient-to-br from-pink-400 to-indigo-500 opacity-20 rounded-full blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-gradient-to-tr from-indigo-400 to-purple-500 opacity-20 rounded-full blur-3xl"></div>

                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div>
                                            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
                                                {t('Stock Products Management')}
                                            </h1>
                                            <p className="text-indigo-100 text-lg max-w-2xl">
                                                {t('Track your inventory, monitor stock levels, and analyze product performance in real-time.')}
                                            </p>
                                        </div>
                                        <div className="hidden md:flex items-center justify-center bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl border border-white border-opacity-20 shadow-lg">
                                            <Package className="h-16 w-16 text-white opacity-80" />
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    {/* Total Products */}
                                    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-gray-100 dark:border-slate-800 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-100 dark:hover:border-indigo-800 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/30 dark:to-purple-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{t('Total Products')}</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stockProducts.total}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('In your inventory')}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <Package className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Stock Value */}
                                    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-gray-100 dark:border-slate-800 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-green-100 dark:hover:border-green-800 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/30 dark:to-emerald-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300 group-hover:text-green-600 dark:group-hover:text-green-400">{t('Total Stock Value')}</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                                                                                        {new Intl.NumberFormat('fa-AF', { style: 'currency', currency: 'AFN' }).format(stockProducts.data.reduce((sum, product) => sum + product.net_total, 0))}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('Current inventory value')}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Profit */}
                                    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-gray-100 dark:border-slate-800 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-purple-100 dark:hover:border-purple-800 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/30 dark:to-pink-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">{t('Total Profit')}</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                                                                                        {new Intl.NumberFormat('fa-AF', { style: 'currency', currency: 'AFN' }).format(stockProducts.data.reduce((sum, product) => sum + product.profit, 0))}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('From all transactions')}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Filter Panel */}
                                {filterOpen && (
                                    <div className="mb-8 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-slate-800 transition-all duration-300 animate-fadeIn">
                                        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center">
                                            <Filter className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                                            {t('Search Filters')}
                                        </h3>

                                        <form action={route('customer.stock-products')} method="GET" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Product Name Filter */}
                                            <div>
                                                <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {t('Product Name or Barcode')}
                                                </label>
                                                <div className="mt-1 relative rounded-md shadow-sm">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <PackageSearch className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="search"
                                                        id="search"
                                                        defaultValue={search}
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2.5 sm:text-sm border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg"
                                                        placeholder={t('Search by name or barcode')}
                                                    />
                                                </div>
                                            </div>

                                            {/* Filter Actions */}
                                            <div className="md:col-span-2 flex flex-col md:flex-row justify-end gap-4 mt-2">
                                                <Link
                                                    href={route('customer.stock-products')}
                                                    className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-slate-700 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                                                >
                                                    <RefreshCw className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                                                    {t('Reset Filters')}
                                                </Link>

                                                <button
                                                    type="submit"
                                                    className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm hover:shadow-md transition-all duration-300"
                                                >
                                                    <Search className="h-4 w-4 mr-2" />
                                                    {t('Apply Filters')}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Stock Products List */}
                                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden mb-8">
                                    <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900">
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                                            <Package className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                                            {t('Your Stock Products')}
                                        </h3>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                                            <thead>
                                                <tr className="bg-gray-50 dark:bg-slate-800">
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        {t('Product Details')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        {t('Stock')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        {t('Total Value')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        {t('Profit')}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-100 dark:divide-slate-800">
                                                {stockProducts.data.length > 0 ? (
                                                    stockProducts.data.map(product => (
                                                        <tr key={product.product_id} className="group hover:bg-indigo-50/40 dark:hover:bg-slate-800/40 transition-all duration-300">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg group-hover:shadow-xl group-hover:from-violet-600 group-hover:to-purple-700 transition-all duration-300 transform group-hover:scale-105">
                                                                        <Box className="h-5 w-5" />
                                                                    </div>
                                                                    <div className="ml-4">
                                                                        <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors duration-300">{product.product_name}</div>
                                                                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                                                            <PackageSearch className="h-4 w-4 mr-1.5 text-gray-400" />
                                                                            {product.barcode}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-mono bg-indigo-50/80 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 py-1.5 px-3 rounded-md border border-indigo-100 dark:border-indigo-800 shadow-sm group-hover:shadow-md group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 inline-flex items-center transition-all duration-300">
                                                                    <Box className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                                                                    {product.net_quantity}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-mono bg-indigo-50/80 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 py-1.5 px-3 rounded-md border border-indigo-100 dark:border-indigo-800 shadow-sm group-hover:shadow-md group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 inline-flex items-center transition-all duration-300">
                                                                    <DollarSign className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                                                                    {new Intl.NumberFormat('fa-AF', { style: 'currency', currency: 'AFN' }).format(product.net_total)}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className={`text-sm font-mono py-1.5 px-3 rounded-md border shadow-sm group-hover:shadow-md inline-flex items-center transition-all duration-300 ${
                                                                    product.profit >= 0
                                                                        ? 'bg-green-50/80 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-100 dark:border-green-800 group-hover:bg-green-100 dark:group-hover:bg-green-900/50'
                                                                        : 'bg-red-50/80 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-100 dark:border-red-800 group-hover:bg-red-100 dark:group-hover:bg-red-900/50'
                                                                }`}>
                                                                    {product.profit >= 0 ? (
                                                                        <TrendingUp className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
                                                                    ) : (
                                                                        <TrendingDown className="h-4 w-4 mr-2 text-red-500 dark:text-red-400" />
                                                                    )}
                                                                    {new Intl.NumberFormat('fa-AF', { style: 'currency', currency: 'AFN' }).format(product.profit)}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="px-6 py-12 text-center">
                                                            <div className="max-w-sm mx-auto">
                                                                <div className="flex justify-center mb-4">
                                                                    <div className="p-5 bg-indigo-100 dark:bg-indigo-900/50 rounded-full shadow-inner">
                                                                        <Package className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                                                                    </div>
                                                                </div>
                                                                <p className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                                                                    {t('No products found')}
                                                                </p>
                                                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                                                    {t('No stock products match your search criteria.')}
                                                                </p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {stockProducts.links && stockProducts.links.length > 3 && (
                                        <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900">
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                                    {t('Showing')} <span className="font-medium text-indigo-700 dark:text-indigo-400">{stockProducts.from}</span> {t('to')} <span className="font-medium text-indigo-700 dark:text-indigo-400">{stockProducts.to}</span> {t('of')} <span className="font-medium text-indigo-700 dark:text-indigo-400">{stockProducts.total}</span> {t('results')}
                                                </div>

                                                <nav className="relative z-0 inline-flex rounded-xl shadow-md -space-x-px overflow-hidden" aria-label="Pagination">
                                                    {stockProducts.links.map((link, i) => {
                                                        if (i === 0 || i === stockProducts.links.length - 1) {
                                                            return null;
                                                        }

                                                        return (
                                                            <Link
                                                                key={i}
                                                                href={link.url}
                                                                className={`relative inline-flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out border-r border-indigo-100 dark:border-slate-700 ${
                                                                    link.active
                                                                        ? 'z-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-md transform scale-105'
                                                                        : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400'
                                                                }`}
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                            />
                                                        );
                                                    })}
                                                </nav>

                                                {/* Prev/Next Buttons */}
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={stockProducts.prev_page_url}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg ${
                                                            stockProducts.prev_page_url
                                                                ? 'border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                                                                : 'border-gray-200 dark:border-slate-800 bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                                        }`}
                                                        disabled={!stockProducts.prev_page_url}
                                                    >
                                                        {t('Previous')}
                                                    </Link>
                                                    <Link
                                                        href={stockProducts.next_page_url}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg ${
                                                            stockProducts.next_page_url
                                                                ? 'border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                                                                : 'border-gray-200 dark:border-slate-800 bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                                        }`}
                                                        disabled={!stockProducts.next_page_url}
                                                    >
                                                        {t('Next')}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
