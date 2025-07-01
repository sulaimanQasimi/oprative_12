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
    Container,
    ChevronLeft,
    ChevronRight
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
                        <Box className="h-10 w-10 text-white drop-shadow-lg" />
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
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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
            <Head title={t("Stock Outcomes")}>
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
                                    <Box className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    {t("Stock Outcomes")}
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
                                                {t('Stock Outcomes Management')}
                                            </h1>
                                            <p className="text-blue-100 text-lg max-w-2xl">
                                                {t('Track all product removals from your inventory in one secure place.')}
                                            </p>
                                        </div>
                                        <div className="hidden md:flex items-center justify-center bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl border border-white border-opacity-20 shadow-lg">
                                            <PackageCheck className="h-16 w-16 text-white opacity-80" />
                                        </div>
                                    </div>
                                </div>

                                {/* Filters Section */}
                                <div className="mb-6 bg-gradient-to-br from-white/80 to-indigo-50/50 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-100/50 overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
                                    <div className="p-4 border-b border-indigo-100/50 flex justify-between items-center bg-gradient-to-r from-purple-50 to-indigo-50">
                                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                            <div className="p-2 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                                </svg>
                                            </div>
                                            {t('Filters')}
                                        </h3>
                                        <button 
                                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                            className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 hover:text-indigo-700 transition-all duration-200 group"
                                        >
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`h-5 w-5 transform transition-transform duration-300 ${showAdvancedFilters ? 'rotate-180' : ''}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </div>
                                    {showAdvancedFilters && (
                                        <div className="p-6 space-y-6 bg-gradient-to-br from-white to-indigo-50/30">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                                {/* Date Range Filter */}
                                                <div className="group">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {t('Date Range')}
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={data.date_from && data.date_to ? 'custom' : 'all'}
                                                            onChange={(e) => {
                                                                if (e.target.value === 'all') {
                                                                    setData('date_from', '');
                                                                    setData('date_to', '');
                                                                }
                                                            }}
                                                            className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pl-4 pr-10 py-3 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-200 text-gray-700"
                                                        >
                                                            <option value="all">{t('All Time')}</option>
                                                            <option value="today">{t('Today')}</option>
                                                            <option value="week">{t('This Week')}</option>
                                                            <option value="month">{t('This Month')}</option>
                                                            <option value="year">{t('This Year')}</option>
                                                            <option value="custom">{t('Custom Range')}</option>
                                                        </select>
                                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-indigo-500">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Reference Number Search */}
                                                <div className="group">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                        </svg>
                                                        {t('Reference Number')}
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={data.search}
                                                            onChange={(e) => setData('search', e.target.value)}
                                                            placeholder={t('Search by reference number...')}
                                                            className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pl-11 pr-4 py-3 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-200"
                                                        />
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <div className="p-1.5 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-lg">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Product Filter */}
                                                <div className="group">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                        </svg>
                                                        {t('Product')}
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={data.product}
                                                            onChange={(e) => setData('product', e.target.value)}
                                                            className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pl-4 pr-10 py-3 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-200 text-gray-700"
                                                        >
                                                            <option value="">{t('All Products')}</option>
                                                            {products.map(product => (
                                                                <option key={product.id} value={product.id}>{product.name}</option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-indigo-500">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Sort By */}
                                                <div className="group">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                                        </svg>
                                                        {t('Sort By')}
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value="created_at"
                                                            onChange={(e) => {
                                                                // Handle sort change if needed
                                                            }}
                                                            className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pl-4 pr-10 py-3 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-200 text-gray-700"
                                                        >
                                                            <option value="created_at">{t('Date')}</option>
                                                            <option value="total">{t('Amount')}</option>
                                                            <option value="quantity">{t('Quantity')}</option>
                                                        </select>
                                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-indigo-500">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Per Page */}
                                                <div className="group">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                                        </svg>
                                                        {t('Per Page')}
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={10}
                                                            onChange={(e) => {
                                                                // Handle per page change if needed
                                                            }}
                                                            className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pl-4 pr-10 py-3 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-200 text-gray-700"
                                                        >
                                                            <option value={5}>5</option>
                                                            <option value={10}>10</option>
                                                            <option value={15}>15</option>
                                                            <option value={20}>20</option>
                                                            <option value={25}>25</option>
                                                            <option value={50}>50</option>
                                                        </select>
                                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-indigo-500">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Custom Date Range (shown when custom is selected) */}
                                            {(data.date_from || data.date_to) && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="group">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            {t('From Date')}
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={data.date_from}
                                                            onChange={(e) => setData('date_from', e.target.value)}
                                                            className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pl-4 pr-4 py-3 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-200"
                                                        />
                                                    </div>
                                                    <div className="group">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            {t('To Date')}
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={data.date_to}
                                                            onChange={(e) => setData('date_to', e.target.value)}
                                                            className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pl-4 pr-4 py-3 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-200"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex justify-end space-x-4">
                                                <button
                                                    type="button"
                                                    onClick={handleReset}
                                                    className="px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                                >
                                                    <RefreshCw className="h-4 w-4 mr-2 inline" />
                                                    {t('Reset')}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleSubmit}
                                                    disabled={processing}
                                                    className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                                >
                                                    <Search className="h-4 w-4 mr-2 inline" />
                                                    {t('Apply Filters')}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Stock Outcomes Table */}
                                <div className="overflow-x-auto rounded-xl shadow-sm">
                                    {safeStockOutcomes.data.length === 0 ? (
                                        <div className="bg-white rounded-xl p-12 text-center text-gray-500 border border-dashed border-gray-300">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-12 w-12 mx-auto text-gray-400 mb-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                            <p className="text-lg">
                                                {t('No stock outcomes found matching your criteria.')}
                                            </p>
                                            <p className="text-sm mt-2">
                                                {t('Try changing your filters or search parameters.')}
                                            </p>
                                        </div>
                                    ) : (
                                        <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-xl overflow-hidden border-collapse">
                                            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider"
                                                    >
                                                        <div className="flex items-center justify-end">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                                                                />
                                                            </svg>
                                                            {t('ID')}
                                                        </div>
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider"
                                                    >
                                                        <div className="flex items-center justify-end">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                />
                                                            </svg>
                                                            {t('Reference')}
                                                        </div>
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider"
                                                    >
                                                        <div className="flex items-center justify-end">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                                                />
                                                            </svg>
                                                            {t('Product')}
                                                        </div>
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider"
                                                    >
                                                        <div className="flex items-center justify-end">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                                                />
                                                            </svg>
                                                            {t('Quantity')}
                                                        </div>
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider"
                                                    >
                                                        <div className="flex items-center justify-end">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                />
                                                            </svg>
                                                            {t('Total')}
                                                        </div>
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider"
                                                    >
                                                        <div className="flex items-center justify-end">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                />
                                                            </svg>
                                                            {t('Date')}
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {safeStockOutcomes.data.map((outcome, index) => (
                                                    <tr
                                                        key={outcome.id}
                                                        className="hover:bg-indigo-50/30 transition-colors duration-150 group"
                                                        style={{
                                                            animation: `fadeIn 0.5s ease-out ${
                                                                index * 0.1
                                                            }s both`,
                                                        }}
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
                                                                <span className="bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200 transition-colors duration-150 py-1 px-2.5 rounded-lg">
                                                                    #{outcome.id}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            <div className="flex items-center justify-end">
                                                                <span className="bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors duration-150 py-1 px-2.5 rounded-lg">
                                                                    {outcome.reference_number || `#${String(outcome.id).padStart(6, "0")}`}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            <div className="flex items-center justify-end">
                                                                <span className="bg-purple-100 text-purple-600 group-hover:bg-purple-200 transition-colors duration-150 py-1 px-2.5 rounded-lg">
                                                                    {outcome.product?.name || 'N/A'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <div className="flex items-center justify-end">
                                                                <span className="bg-green-100 text-green-600 group-hover:bg-green-200 transition-colors duration-150 py-1 px-2.5 rounded-lg">
                                                                    <span className="font-semibold">
                                                                        {outcome.is_wholesale 
                                                                            ? `${((parseFloat(outcome.quantity) || 0) / (parseFloat(outcome.unit_amount) || 1)).toLocaleString()}`
                                                                            : (parseFloat(outcome.quantity) || 0).toLocaleString()
                                                                        }
                                                                    </span>
                                                                    {(outcome.unit_name || outcome.unit?.name) && (
                                                                        <span className="ml-1 text-xs opacity-75">
                                                                            {outcome.unit_name || outcome.unit?.name}
                                                                            {outcome.unit?.symbol && ` (${outcome.unit.symbol})`}
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex items-center justify-end">
                                                                <span className="bg-green-100 text-green-700 py-1 px-2.5 rounded-lg group-hover:bg-green-200 transition-colors duration-150">
                                                                    {formatCurrency(outcome.total)}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <div className="flex items-center justify-end">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-4 w-4 mr-1.5 rtl:ml-1.5 rtl:mr-0 text-indigo-400 group-hover:text-indigo-500"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                    />
                                                                </svg>
                                                                <span className="text-green-600 font-medium">
                                                                    {new Intl.DateTimeFormat('fa-IR', {
                                                                        year: 'numeric',
                                                                        month: '2-digit',
                                                                        day: 'numeric',
                                                                        calendar: 'persian',
                                                                        numberingSystem: 'arab'
                                                                    }).format(new Date(outcome.created_at))}
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>

                                {/* Pagination Controls */}
                                {safeStockOutcomes.links && safeStockOutcomes.links.length > 3 && (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.5, duration: 0.4 }}
                                        className="flex flex-col items-center space-y-4"
                                    >
                                        <div className="text-sm text-slate-600 dark:text-slate-400">
                                            {t("Showing")} {safeStockOutcomes.from || 0} {t("to")} {safeStockOutcomes.to || 0} {t("of")} {safeStockOutcomes.total || 0} {t("results")}
                                        </div>
                                        <div className="flex items-center space-x-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-green-100 dark:border-green-900/30">
                                            {/* Previous Page */}
                                            <button
                                                onClick={() => {
                                                    const prevPage = safeStockOutcomes.current_page - 1;
                                                    if (prevPage >= 1) {
                                                        get(route('customer.stock-outcomes.index', { page: prevPage }), {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                        });
                                                    }
                                                }}
                                                disabled={!safeStockOutcomes.links || safeStockOutcomes.current_page <= 1}
                                                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                                                    safeStockOutcomes.links && safeStockOutcomes.current_page > 1
                                                        ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30'
                                                        : 'text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                                <span className="ml-1 hidden sm:inline">{t('Previous')}</span>
                                            </button>

                                            {/* Page Numbers */}
                                            {safeStockOutcomes.links && safeStockOutcomes.links.slice(1, -1).map((link, index) => {
                                                if (link.url === null) {
                                                    return (
                                                        <span key={index} className="px-3 py-2 text-gray-400">
                                                            ...
                                                        </span>
                                                    );
                                                }
                                                
                                                const pageNum = link.label;
                                                const isActive = link.active;
                                                
                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => {
                                                            const url = new URL(link.url);
                                                            const page = url.searchParams.get('page');
                                                            if (page) {
                                                                get(route('customer.stock-outcomes.index', { page }), {
                                                                    preserveState: true,
                                                                    preserveScroll: true,
                                                                });
                                                            }
                                                        }}
                                                        className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                                                            isActive
                                                                ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-lg'
                                                                : 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30'
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}

                                            {/* Next Page */}
                                            <button
                                                onClick={() => {
                                                    const nextPage = safeStockOutcomes.current_page + 1;
                                                    if (nextPage <= safeStockOutcomes.last_page) {
                                                        get(route('customer.stock-outcomes.index', { page: nextPage }), {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                        });
                                                    }
                                                }}
                                                disabled={!safeStockOutcomes.links || safeStockOutcomes.current_page >= safeStockOutcomes.last_page}
                                                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                                                    safeStockOutcomes.links && safeStockOutcomes.current_page < safeStockOutcomes.last_page
                                                        ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30'
                                                        : 'text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                <span className="mr-1 hidden sm:inline">{t('Next')}</span>
                                                <ChevronRight className="h-4 w-4 rotate-180" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `,
                }}
            />
        </>
    );
}
