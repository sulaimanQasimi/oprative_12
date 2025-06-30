import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import CustomerNavbar from '@/Components/CustomerNavbar';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { motion } from 'framer-motion';
import {
    Package,
    Search,
    RefreshCw,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    DollarSign,
    Building2,
    ShoppingBag,
    FileText,
    Filter,
    ChevronDown,
    Mail,
    User,
    Receipt,
    CreditCard,
    Wallet,
    ArrowDownRight,
    ArrowUpRight,
    CircleDollarSign,
    BanknoteIcon,
    ReceiptText,
    ArrowRightLeft,
    Truck,
    PackageCheck,
    PackageX,
    PackageOpen,
    Warehouse,
    Box,
    MapPin,
    Route,
    Plus
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

export default function StockIncomesIndex({ auth, stockIncomes = { data: [], links: [], total: 0 }, filters = {}, products = [], statistics = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);

    // Ensure stockIncomes has the proper structure
    const safeStockIncomes = {
        data: Array.isArray(stockIncomes?.data) ? stockIncomes.data : [],
        links: Array.isArray(stockIncomes?.links) ? stockIncomes.links : [],
        total: parseInt(stockIncomes?.total) || 0,
        from: parseInt(stockIncomes?.from) || 0,
        to: parseInt(stockIncomes?.to) || 0,
        ...stockIncomes
    };

    const { data, setData, get, processing, errors } = useForm({
        search: filters.search || '',
        product: filters.product || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    // Simulate loading delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        get(route('customer.stock-incomes.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setData({
            search: '',
            product: '',
            date_from: '',
            date_to: '',
        });
        get(route('customer.stock-incomes.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Calculate totals with proper error handling
    const totalImports = safeStockIncomes.data.length;
    const totalQuantity = safeStockIncomes.data.reduce((sum, income) => {
        // Ensure we're working with numbers
        const currentSum = isNaN(sum) ? 0 : sum;
        const quantity = parseFloat(income?.quantity) || 0;
        const unitAmount = parseFloat(income?.unit_amount) || 1;
        
        // For wholesale items, show the actual wholesale quantity (not the converted retail units)
        if (income?.is_wholesale && unitAmount > 0) {
            return currentSum + (quantity / unitAmount);
        }
        return currentSum + quantity;
    }, 0) || 0;
    
    const totalValue = safeStockIncomes.data.reduce((sum, income) => {
        const currentSum = isNaN(sum) ? 0 : sum;
        const total = parseFloat(income?.total) || 0;
        return currentSum + total;
    }, 0) || 0;
    
    const avgImportValue = totalImports > 0 ? totalValue / totalImports : 0;

    const formatCurrency = (amount) => {
        const numericAmount = parseFloat(amount) || 0;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AFN',
            minimumFractionDigits: 0,
        }).format(isNaN(numericAmount) ? 0 : numericAmount);
    };

    return (
        <>
            <Head title={t('Stock Incomes')}>
                <style>{`
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    .animate-shimmer { animation: shimmer 3s infinite; }

                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
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
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden max-w-full">
                {/* Sidebar */}
                <CustomerNavbar
                    auth={auth || {user: {name: 'Customer'}}}
                    currentRoute="customer.stock-incomes.index"
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
                                    <Box className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    {t("Stock Incomes")}
                                </h1>
                            </div>
                        </div>

                        <div>
                            <Link
                                href={route('customer.stock-incomes.create')}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-200"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                {t('Add Stock Income')}
                            </Link>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-6">
                            <div className="max-w-7xl mx-auto">
                                {/* Hero Section with Gradient Background */}
                                <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 rounded-2xl shadow-xl p-10 mb-10 overflow-hidden">
                                    <div className="absolute inset-0 bg-pattern opacity-10"></div>
                                    <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-gradient-to-br from-blue-400 to-indigo-500 opacity-20 rounded-full blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-gradient-to-tr from-indigo-400 to-blue-500 opacity-20 rounded-full blur-3xl"></div>

                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div>
                                            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
                                                {t('Stock Incomes Management')}
                                            </h1>
                                            <p className="text-blue-100 text-lg max-w-2xl">
                                                {t('Track all product additions to your inventory in one secure place.')}
                                            </p>
                                        </div>
                                        <div className="hidden md:flex items-center justify-center bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl border border-white border-opacity-20 shadow-lg">
                                            <PackageCheck className="h-16 w-16 text-white opacity-80" />
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    {/* Total Stock Incomes */}
                                    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-gray-100 dark:border-slate-800 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-100 dark:hover:border-blue-800 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/30 dark:to-indigo-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{t('Total Incomes')}</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.total || 0}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('All time stock incomes')}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Quantity */}
                                    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-gray-100 dark:border-slate-800 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-green-100 dark:hover:border-green-800 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/30 dark:to-emerald-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300 group-hover:text-green-600 dark:group-hover:text-green-400">{t('Total Quantity')}</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{(isNaN(totalQuantity) ? 0 : totalQuantity).toFixed(2)}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('Units received')}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <PackageCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Value */}
                                    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-gray-100 dark:border-slate-800 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-purple-100 dark:hover:border-purple-800 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-violet-50/50 dark:from-purple-900/30 dark:to-violet-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">{t('Total Value')}</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalValue)}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('Value of stock incomes')}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900 dark:to-violet-900 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <DollarSign className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Filters */}
                                <div className="mb-8 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-slate-800 transition-all duration-300">
                                    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center">
                                        <Filter className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
                                        {t('Quick Filters')}
                                    </h3>

                                    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Reference')}</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Search className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="search"
                                                    value={data.search}
                                                    onChange={e => setData('search', e.target.value)}
                                                    className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                    placeholder={t('Search by reference')}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Product')}</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Package className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <select
                                                    name="product"
                                                    value={data.product}
                                                    onChange={e => setData('product', e.target.value)}
                                                    className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                >
                                                    <option value="">{t('All Products')}</option>
                                                    {products.map(product => (
                                                        <option key={product.id} value={product.id}>{product.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('From Date')}</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Calendar className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="date"
                                                        name="date_from"
                                                        value={data.date_from}
                                                        onChange={e => setData('date_from', e.target.value)}
                                                        className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('To Date')}</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Calendar className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="date"
                                                        name="date_to"
                                                        value={data.date_to}
                                                        onChange={e => setData('date_to', e.target.value)}
                                                        className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-end">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 hover:from-blue-600 hover:via-indigo-600 hover:to-blue-700 text-white text-sm font-medium rounded-md shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 relative overflow-hidden group"
                                            >
                                                <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                                <span className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300 animate-tilt"></span>
                                                <span className="relative flex items-center justify-center">
                                                    <Search className="h-5 w-5 mr-2 text-white" />
                                                    {t('Search')}
                                                </span>
                                            </button>
                                        </div>

                                        <div className="flex items-end">
                                            <button
                                                type="button"
                                                onClick={handleReset}
                                                className="w-full px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white text-sm font-medium rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300"
                                            >
                                                <span className="flex items-center justify-center">
                                                    <RefreshCw className="h-5 w-5 mr-2" />
                                                    {t('Reset')}
                                                </span>
                                            </button>
                                        </div>
                                    </form>
                                </div>


                                    <div className="overflow-x-auto rounded-xl shadow-sm">
                                        <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-xl overflow-hidden border-collapse">
                                            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                                                        <div className="flex items-center justify-end">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            {t('Reference')}
                                                        </div>
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                                                        <div className="flex items-center justify-end">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                            </svg>
                                                            {t('Product')}
                                                        </div>
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                                                        <div className="flex items-center justify-end">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                            </svg>
                                                            {t('Quantity')}
                                                        </div>
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                                                        <div className="flex items-center justify-end">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                            </svg>
                                                            {t('Unit Type')}
                                                        </div>
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                                                        <div className="flex items-center justify-end">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {t('Price')}
                                                        </div>
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                                                        <div className="flex items-center justify-end">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {t('Total')}
                                                        </div>
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                                                        <div className="flex items-center justify-end">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            {t('Notes')}
                                                        </div>
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                                                        <div className="flex items-center justify-end">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            {t('Date')}
                                                        </div>
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                                                        <div className="flex items-center justify-end">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            {t('Actions')}
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {safeStockIncomes.data.map((income, index) => (
                                                    <tr
                                                        key={income.id}
                                                        className="hover:bg-indigo-50/30 transition-colors duration-150 group"
                                                        style={{
                                                            animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                                                        }}
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
                                                                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
                                                                    <Receipt className="h-5 w-5" />
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-150">
                                                                        {income.reference_number}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 flex items-center justify-end mt-1">
                                                                        <Calendar className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0" />
                                                                        {new Date(income.created_at).toLocaleDateString()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            <div className="flex items-center justify-end">
                                                                <span className="bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors duration-150 py-1 px-2.5 rounded-lg">
                                                                    {income.product?.name || 'N/A'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <div className="flex items-center justify-end">
                                                                <span className="bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200 transition-colors duration-150 py-1 px-2.5 rounded-lg">
                                                                    <span className="font-semibold">
                                                                        {income.is_wholesale 
                                                                            ? `${((parseFloat(income.quantity) || 0) / (parseFloat(income.unit_amount) || 1)).toLocaleString()}`
                                                                            : (parseFloat(income.quantity) || 0).toLocaleString()
                                                                        }
                                                                    </span>
                                                                    {(income.unit_name || income.unit?.name) && (
                                                                        <span className="ml-1 text-xs opacity-75">
                                                                            {income.unit_name || income.unit?.name}
                                                                            {income.unit?.symbol && ` (${income.unit.symbol})`}
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <div className="flex items-center justify-end">
                                                                <span className={`py-1 px-2.5 rounded-lg ${
                                                                    income.unit_type === 'wholesale' 
                                                                        ? "bg-purple-100 text-purple-600 group-hover:bg-purple-200"
                                                                        : "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
                                                                } transition-colors duration-150`}>
                                                                    {income.unit_type === 'wholesale' ? t('Wholesale') : t('Retail')}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex items-center justify-end">
                                                                <span className="bg-green-100 text-green-700 py-1 px-2.5 rounded-lg group-hover:bg-green-200 transition-colors duration-150">
                                                                    {formatCurrency(income.price)}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex items-center justify-end">
                                                                <span className="bg-purple-100 text-purple-600 py-1 px-2.5 rounded-lg group-hover:bg-purple-200 transition-colors duration-150">
                                                                    {formatCurrency(income.total)}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <div className="flex items-center justify-end">
                                                                {income.notes ? (
                                                                    <span className="bg-yellow-100 text-yellow-600 py-1 px-2.5 rounded-lg group-hover:bg-yellow-200 transition-colors duration-150 max-w-xs truncate" title={income.notes}>
                                                                        {income.notes.length > 20 ? `${income.notes.substring(0, 20)}...` : income.notes}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-gray-400 text-sm italic">
                                                                        {t('No notes')}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <div className="flex items-center justify-end">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 rtl:ml-1.5 rtl:mr-0 text-indigo-400 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                                <span className="text-green-600 font-medium">
                                                                    {new Date(income.created_at).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <div className="flex justify-end">
                                                                <Link
                                                                    href={route('customer.stock-incomes.show', income.id)}
                                                                    className="flex items-center text-indigo-600 hover:text-indigo-900 font-medium bg-indigo-50 hover:bg-indigo-100 transition-colors duration-150 px-3 py-1.5 rounded-lg group-hover:scale-105 transform"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 rtl:ml-1.5 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                    </svg>
                                                                    {t('View Details')}
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}

                                                {safeStockIncomes.data.length === 0 && (
                                                    <tr>
                                                        <td colSpan="9" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                                            <div className="flex flex-col items-center justify-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                                <p className="text-lg">
                                                                    {t('No stock incomes found matching your criteria.')}
                                                                </p>
                                                                <p className="text-sm mt-2">
                                                                    {t('Try changing your filters or search parameters.')}
                                                                </p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {safeStockIncomes.links && safeStockIncomes.links.length > 3 && (
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 1.5, duration: 0.4 }}
                                            className="flex flex-col items-center space-y-4"
                                        >
                                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                                {t("Showing")} {safeStockIncomes.from} {t("to")} {safeStockIncomes.to} {t("of")} {safeStockIncomes.total} {t("results")}
                                            </div>
                                            <div className="flex items-center space-x-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-green-100 dark:border-green-900/30">
                                                {/* Previous Page */}
                                                <Link
                                                    href={safeStockIncomes.links[0]?.url || '#'}
                                                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                                                        safeStockIncomes.links[0]?.url
                                                            ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30'
                                                            : 'text-gray-400 cursor-not-allowed'
                                                    }`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                    <span className="ml-1 hidden sm:inline">{t('Previous')}</span>
                                                </Link>

                                                {/* Page Numbers */}
                                                {safeStockIncomes.links.slice(1, -1).map((link, index) => {
                                                    if (link.label.includes('...')) {
                                                        return (
                                                            <span key={index} className="px-3 py-2 text-gray-400">
                                                                ...
                                                            </span>
                                                        );
                                                    }
                                                    return (
                                                        <Link
                                                            key={index}
                                                            href={link.url || '#'}
                                                            className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                                                                link.active
                                                                    ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-lg'
                                                                    : link.url
                                                                    ? 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30'
                                                                    : 'text-gray-400 cursor-not-allowed'
                                                            }`}
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    );
                                                })}

                                                {/* Next Page */}
                                                <Link
                                                    href={safeStockIncomes.links[safeStockIncomes.links.length - 1]?.url || '#'}
                                                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                                                        safeStockIncomes.links[safeStockIncomes.links.length - 1]?.url
                                                            ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30'
                                                            : 'text-gray-400 cursor-not-allowed'
                                                    }`}
                                                >
                                                    <span className="mr-1 hidden sm:inline">{t('Next')}</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
