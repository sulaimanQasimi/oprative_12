import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import CustomerNavbar from "@/Components/CustomerNavbar";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
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
    Plus,
    Minus,
    AlertTriangle,
    TrendingDown,
    Download,
    Upload,
    ExternalLink,
    Globe,
    Ship,
    Plane,
    Container
} from "lucide-react";

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
                        <Ship className="h-10 w-10 text-white drop-shadow-lg" />
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default function StockOutcomesIndex({
    auth,
    stockOutcomes = { data: [], links: [], total: 0 },
    filters = {},
    products = [],
    statistics = {},
}) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);

    // Ensure stockOutcomes has the proper structure
    const safeStockOutcomes = {
        data: Array.isArray(stockOutcomes?.data) ? stockOutcomes.data : [],
        links: Array.isArray(stockOutcomes?.links) ? stockOutcomes.links : [],
        total: parseInt(stockOutcomes?.total) || 0,
        from: parseInt(stockOutcomes?.from) || 0,
        to: parseInt(stockOutcomes?.to) || 0,
        ...stockOutcomes
    };

    const { data, setData, get, processing, errors } = useForm({
        search: filters.search || "",
        product: filters.product || "",
        date_from: filters.date_from || "",
        date_to: filters.date_to || "",
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
        get(route("customer.stock-outcomes.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setData({
            search: "",
            product: "",
            date_from: "",
            date_to: "",
        });
        get(route("customer.stock-outcomes.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Calculate totals with proper error handling
    const totalExports = safeStockOutcomes.data.length;
    const totalQuantity = safeStockOutcomes.data.reduce((sum, outcome) => {
        // Ensure we're working with numbers
        const currentSum = isNaN(sum) ? 0 : sum;
        const quantity = parseFloat(outcome?.quantity) || 0;
        const unitAmount = parseFloat(outcome?.unit_amount) || 1;
        
        // For wholesale items, show the actual wholesale quantity (not the converted retail units)
        if (outcome?.is_wholesale && unitAmount > 0) {
            return currentSum + (quantity / unitAmount);
        }
        return currentSum + quantity;
    }, 0) || 0;
    
    const totalValue = safeStockOutcomes.data.reduce((sum, outcome) => {
        const currentSum = isNaN(sum) ? 0 : sum;
        const total = parseFloat(outcome?.total) || 0;
        return currentSum + total;
    }, 0) || 0;
    
    const avgExportValue = totalExports > 0 ? totalValue / totalExports : 0;

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
            <Head title={t("Export Records")}>
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
                    auth={auth || { user: { name: "Customer" } }}
                    currentRoute="customer.stock-outcomes.index"
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
                                    <Ship className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    {t("Export Records")}
                                </h1>
                            </div>
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
                                                {t("Export Management")}
                                            </h1>
                                            <p className="text-blue-100 text-lg max-w-2xl">
                                                {t(
                                                    "Track all product exports and international shipments in one secure place."
                                                )}
                                            </p>
                                        </div>
                                        <div className="hidden md:flex items-center justify-center bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl border border-white border-opacity-20 shadow-lg">
                                            <Ship className="h-16 w-16 text-white opacity-80" />
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    {/* Total Exports */}
                                    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-gray-100 dark:border-slate-800 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-100 dark:hover:border-blue-800 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/30 dark:to-indigo-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{t('Total Exports')}</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.total || 0}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('All time export records')}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <Ship className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Quantity */}
                                    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-gray-100 dark:border-slate-800 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-100 dark:hover:border-indigo-800 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/30 dark:to-purple-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{t('Total Quantity')}</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{(isNaN(totalQuantity) ? 0 : totalQuantity).toFixed(2)}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('Units exported')}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <Container className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Value */}
                                    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-gray-100 dark:border-slate-800 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-purple-100 dark:hover:border-purple-800 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-900/30 dark:to-blue-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">{t('Total Value')}</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalValue)}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('Value of exports')}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <Globe className="w-8 h-8 text-purple-600 dark:text-purple-400" />
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

                                {/* Export Records Table */}
                                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden mb-8">
                                    <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                                            <Ship className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
                                            {t('Export Records')}
                                        </h3>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                                            <thead>
                                                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900">
                                                    <th scope="col" className="px-8 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                        {t('Reference')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                        {t('Product')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                        {t('Quantity')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                        {t('Unit Type')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                        {t('Price')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                        {t('Total')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                        {t('Destination')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                        {t('Notes')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                        {t('Date')}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-100 dark:divide-slate-800">
                                                {safeStockOutcomes.data.map((outcome) => (
                                                    <tr key={outcome.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md">
                                                        <td className="px-8 py-5 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="mx-6 flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                                                                    <ExternalLink className="h-6 w-6" />
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-base font-medium text-gray-900 dark:text-white">{outcome.reference_number}</div>
                                                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                                                                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                                                        {new Date(outcome.created_at).toLocaleDateString()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900 dark:text-white">{outcome.product?.name || 'N/A'}</div>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                                            <div className="flex flex-col gap-1">
                                                                <div className="text-sm font-mono bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 py-1.5 px-3 rounded-md border border-blue-100 dark:border-blue-900 shadow-sm inline-flex items-center float-right">
                                                                    <Container className="h-4 w-4 mr-1.5 text-blue-500 dark:text-blue-400" />
                                                                    {outcome.is_wholesale 
                                                                        ? `${((parseFloat(outcome.quantity) || 0) / (parseFloat(outcome.unit_amount) || 1)).toLocaleString()}`
                                                                        : (parseFloat(outcome.quantity) || 0).toLocaleString()
                                                                    }
                                                                    {(outcome.unit_name || outcome.unit?.name) && (
                                                                        <span className="ml-1 text-xs opacity-75">
                                                                            {outcome.unit_name || outcome.unit?.name}
                                                                            {outcome.unit?.symbol && ` (${outcome.unit.symbol})`}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {outcome.is_wholesale && (
                                                                    <span className="text-xs text-slate-500 dark:text-slate-400 float-right">
                                                                        ({(parseFloat(outcome.quantity) || 0).toLocaleString()} retail units total)
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                                            <div className={`text-sm font-mono py-1.5 px-3 rounded-md border shadow-sm inline-flex items-center float-right ${
                                                                outcome.unit_type === 'wholesale' 
                                                                    ? "bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-100 dark:border-purple-900"
                                                                    : "bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-100 dark:border-blue-900"
                                                            }`}>
                                                                <Package className={`h-4 w-4 mr-1.5 ${
                                                                    outcome.unit_type === 'wholesale' 
                                                                        ? "text-purple-500 dark:text-purple-400"
                                                                        : "text-blue-500 dark:text-blue-400"
                                                                }`} />
                                                                {outcome.unit_type === 'wholesale' ? t('Wholesale') : t('Retail')}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                                            <div className="text-sm font-mono bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 py-1.5 px-3 rounded-md border border-purple-100 dark:border-purple-900 shadow-sm inline-flex items-center float-right">
                                                                <DollarSign className="h-4 w-4 mr-1.5 text-purple-500 dark:text-purple-400" />
                                                                {formatCurrency(outcome.price)}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                                            <div className="text-sm font-mono bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 py-1.5 px-3 rounded-md border border-blue-100 dark:border-blue-900 shadow-sm inline-flex items-center float-right">
                                                                <CircleDollarSign className="h-4 w-4 mr-1.5 text-blue-500 dark:text-blue-400" />
                                                                {formatCurrency(outcome.total)}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 text-center">
                                                            {outcome.reason ? (
                                                                <div className="text-sm text-gray-700 dark:text-gray-300 bg-indigo-50 dark:bg-indigo-900/30 py-1.5 px-3 rounded-md border border-indigo-100 dark:border-indigo-900 shadow-sm inline-flex items-center max-w-xs">
                                                                    <Globe className="h-4 w-4 mr-1.5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                                                                    <span className="truncate" title={outcome.reason}>
                                                                        {outcome.reason.length > 30 ? `${outcome.reason.substring(0, 30)}...` : outcome.reason}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400 dark:text-gray-600 text-sm italic">
                                                                    {t('No destination')}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-5 text-center">
                                                            {outcome.notes ? (
                                                                <div className="text-sm text-gray-700 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/30 py-1.5 px-3 rounded-md border border-yellow-100 dark:border-yellow-900 shadow-sm inline-flex items-center max-w-xs">
                                                                    <FileText className="h-4 w-4 mr-1.5 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
                                                                    <span className="truncate" title={outcome.notes}>
                                                                        {outcome.notes.length > 30 ? `${outcome.notes.substring(0, 30)}...` : outcome.notes}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400 dark:text-gray-600 text-sm italic">
                                                                    {t('No notes')}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                                            <div className="text-sm text-gray-900 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 py-1.5 px-3 rounded-md inline-flex items-center float-right">
                                                                <Calendar className="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400" />
                                                                {new Date(outcome.created_at).toLocaleDateString()}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}

                                                {safeStockOutcomes.data.length === 0 && (
                                                    <tr>
                                                        <td colSpan="10" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                                            <div className="flex flex-col items-center justify-center">
                                                                <Ship className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
                                                                <p className="text-lg font-medium">{t('No export records found')}</p>
                                                                <p className="text-sm mt-1">{t('Try adjusting your search or filter to find what you are looking for.')}</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {safeStockOutcomes.links && safeStockOutcomes.links.length > 3 && (
                                        <div className="px-8 py-6 border-t border-blue-100 dark:border-slate-800 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                                            {/* Pagination Controls */}
                                            <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 rtl:flex-row-reverse">
                                                {/* Records Info */}
                                                <div className="text-sm text-gray-600 rtl:text-right">
                                                    <div className="flex items-center gap-2 rtl:flex-row-reverse">
                                                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md rtl:font-semibold">
                                                            RTL {t('Support')}
                                                        </span>
                                                        {safeStockOutcomes.total > 0 ? (
                                                            <p>
                                                                {t('Showing')} <span className="font-medium text-blue-600">{safeStockOutcomes.from}</span> {t('to')}{' '}
                                                                <span className="font-medium text-blue-600">{safeStockOutcomes.to}</span> {t('of')}{' '}
                                                                <span className="font-medium text-blue-600">{safeStockOutcomes.total}</span> {t('records')}
                                                            </p>
                                                        ) : (
                                                            <p>{t('No records found')}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Pagination Controls */}
                                                <div className="flex items-center justify-center rtl:flex-row-reverse">
                                                    <nav
                                                        className="relative z-0 inline-flex rounded-xl shadow-md -space-x-px rtl:space-x-reverse overflow-hidden"
                                                        aria-label="Pagination"
                                                        style={{ boxShadow: '0 4px 20px -2px rgba(59, 130, 246, 0.15)' }}
                                                    >
                                                        {safeStockOutcomes.links.map((link, index) => (
                                                            <Link
                                                                key={index}
                                                                href={link.url || '#'}
                                                                className={`relative inline-flex items-center px-4 py-2.5 text-sm border-r border-blue-100 dark:border-slate-700 ${
                                                                    link.url === null
                                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
                                                                        : link.active
                                                                        ? 'z-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white shadow-md transform scale-105'
                                                                        : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                                                                }`}
                                                                disabled={link.url === null}
                                                            >
                                                                {link.label.replace(/&laquo;|&raquo;/g, '')}
                                                                {link.active && (
                                                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full transform translate-y-1/2 opacity-60"></span>
                                                                )}
                                                            </Link>
                                                        ))}
                                                    </nav>
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
