import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import CustomerNavbar from '@/Components/CustomerNavbar';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { motion } from 'framer-motion';
import {
    CreditCard,
    Plus,
    Search,
    X,
    Filter,
    ChevronRight,
    RefreshCw,
    DollarSign,
    Shield,
    User,
    Calendar,
    ArrowLeft,
    ShoppingCart,
    ChevronDown,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    Building2,
    ShoppingBag,
    FileText,
    Mail,
    Receipt,
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
    ChevronLeft
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
                        <CreditCard className="h-10 w-10 text-white drop-shadow-lg" />
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default function AccountsIndex({ accounts, search_id_number, search_account_number, isFilterOpen, customer, auth }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(isFilterOpen);

    const { data, setData, get, processing, errors } = useForm({
        search_id_number: search_id_number || '',
        search_account_number: search_account_number || '',
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
        get(route('customer.accounts.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setData({
            search_id_number: '',
            search_account_number: '',
        });
        get(route('customer.accounts.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Calculate statistics
    const totalAccounts = accounts.total || 0;
    const activeAccounts = accounts.data.filter(account => account.status === 'active').length;
    const suspendedAccounts = accounts.data.filter(account => account.status === 'suspended').length;
    const totalBalance = accounts.data.reduce((sum, account) => sum + (parseFloat(account.balance) || 0), 0);

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
            <Head title={t('Bank Accounts')}>
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
                    auth={auth || {user: {name: customer?.name || 'Customer'}}}
                    currentRoute="customer.accounts.index"
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
                                    <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    {t("Banking Accounts")}
                                </h1>
                            </div>
                        </div>

                        <div>
                            <Link
                                href={route('customer.accounts.create')}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-200"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                {t('New Account')}
                            </Link>
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
                                                {t('Banking Accounts Management')}
                                            </h1>
                                            <p className="text-indigo-100 text-lg max-w-2xl">
                                                {t('Securely manage your bank accounts and track your financial transactions in one place.')}
                                            </p>
                                            <div className="flex items-center mt-6 gap-4">
                                                <Link
                                                    href={route('customer.accounts.create')}
                                                    className="group relative inline-flex items-center px-6 py-3 text-base font-medium leading-6 text-white transition-all duration-300 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 overflow-hidden"
                                                >
                                                    <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                                    <Plus className="mr-2 h-5 w-5 text-white group-hover:rotate-90 transition-transform duration-300" />
                                                    <span className="relative">{t('Create New Account')}</span>
                                                </Link>
                                                <span className="text-indigo-200 text-sm">{totalAccounts} {t('Accounts Total')}</span>
                                            </div>
                                        </div>
                                        <div className="hidden md:flex items-center justify-center bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl border border-white border-opacity-20 shadow-lg">
                                            <CreditCard className="h-16 w-16 text-white opacity-80" />
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                                    {/* Total Accounts */}
                                    <div className="group relative bg-white rounded-2xl shadow-md border border-gray-100 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-100 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-indigo-600">{t('Total Accounts')}</p>
                                                <p className="text-2xl font-bold text-gray-900">{totalAccounts}</p>
                                                <p className="text-xs text-gray-500">{t('Across all statuses')}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <CreditCard className="w-8 h-8 text-indigo-600" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Active Accounts */}
                                    <div className="group relative bg-white rounded-2xl shadow-md border border-gray-100 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-green-100 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-green-600">{t('Active Accounts')}</p>
                                                <p className="text-2xl font-bold text-gray-900">{activeAccounts}</p>
                                                <p className="text-xs text-gray-500">{t('Ready for transactions')}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <Shield className="w-8 h-8 text-green-600" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Suspended Accounts */}
                                    <div className="group relative bg-white rounded-2xl shadow-md border border-gray-100 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-red-100 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-red-600">{t('Suspended Accounts')}</p>
                                                <p className="text-2xl font-bold text-gray-900">{suspendedAccounts}</p>
                                                <p className="text-xs text-gray-500">{t('Temporarily disabled')}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <XCircle className="w-8 h-8 text-red-600" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Balance */}
                                    <div className="group relative bg-white rounded-2xl shadow-md border border-gray-100 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-purple-100 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-purple-600">{t('Total Balance')}</p>
                                                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalBalance)}</p>
                                                <p className="text-xs text-gray-500">{t('Combined balance')}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <DollarSign className="w-8 h-8 text-purple-600" />
                                            </div>
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
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* ID Number Filter */}
                                                <div className="group">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                        </svg>
                                                        {t('ID Number')}
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={data.search_id_number}
                                                            onChange={(e) => setData('search_id_number', e.target.value)}
                                                            placeholder={t('Search by ID number...')}
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

                                                {/* Account Number Filter */}
                                                <div className="group">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                        </svg>
                                                        {t('Account Number')}
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={data.search_account_number}
                                                            onChange={(e) => setData('search_account_number', e.target.value)}
                                                            placeholder={t('Search by account number...')}
                                                            className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pl-11 pr-4 py-3 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-200"
                                                        />
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <div className="p-1.5 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-lg">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

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

                                {/* Accounts Table */}
                                <div className="overflow-x-auto rounded-xl shadow-sm">
                                    {accounts.data.length === 0 ? (
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
                                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                                />
                                            </svg>
                                            <p className="text-lg">
                                                {t('No accounts found matching your criteria.')}
                                            </p>
                                            <p className="text-sm mt-2">
                                                {t('Try changing your filters or create a new account.')}
                                            </p>
                                            <Link
                                                href={route('customer.accounts.create')}
                                                className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 w-full mt-4 shadow-md hover:shadow-lg"
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                {t('Create Your First Account')}
                                            </Link>
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
                                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                                />
                                                            </svg>
                                                            {t('Account Details')}
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
                                                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                                                />
                                                            </svg>
                                                            {t('Account Number')}
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
                                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                />
                                                            </svg>
                                                            {t('Status')}
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
                                                            {t('Balance')}
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
                                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                />
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                />
                                                            </svg>
                                                            {t('Actions')}
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {accounts.data.map((account, index) => (
                                                    <tr
                                                        key={account.id}
                                                        className="hover:bg-indigo-50/30 transition-colors duration-150 group"
                                                        style={{
                                                            animation: `fadeIn 0.5s ease-out ${
                                                                index * 0.1
                                                            }s both`,
                                                        }}
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center justify-end">
                                                                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg group-hover:shadow-xl group-hover:from-violet-600 group-hover:to-purple-700 transition-all duration-300 transform group-hover:scale-105">
                                                                    <CreditCard className="h-6 w-6" />
                                                                </div>
                                                                <div className="mr-4 text-right">
                                                                    <div className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">{account.name}</div>
                                                                    <div className="text-xs text-gray-500 mt-1 flex items-center justify-end">
                                                                        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                                                                        {account.created_at ? new Date(account.created_at).toLocaleDateString() : 'N/A'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            <div className="flex items-center justify-end">
                                                                <span className="bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors duration-150 py-1 px-2.5 rounded-lg">
                                                                    {account.account_number}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <div className="flex items-center justify-end">
                                                                <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                                                                    account.status === 'active'
                                                                        ? 'bg-green-100 text-green-800 border border-green-200'
                                                                        : account.status === 'suspended' || account.status === 'closed'
                                                                            ? 'bg-red-100 text-red-800 border border-red-200'
                                                                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                                } shadow-sm group-hover:shadow-md transition-all duration-300`}>
                                                                    <span className={`flex h-2 w-2 rounded-full mr-2 ${
                                                                        account.status === 'active'
                                                                            ? 'bg-green-500 animate-pulse'
                                                                            : account.status === 'suspended' || account.status === 'closed'
                                                                                ? 'bg-red-500'
                                                                                : 'bg-yellow-500'
                                                                    }`}></span>
                                                                    {t(account.status.charAt(0).toUpperCase() + account.status.slice(1))}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex items-center justify-end">
                                                                <span className="bg-green-100 text-green-700 py-1 px-2.5 rounded-lg group-hover:bg-green-200 transition-colors duration-150">
                                                                    {formatCurrency(account.balance || 0)}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <div className="flex justify-end">
                                                                <Link
                                                                    href={route('customer.accounts.show', account.id)}
                                                                    className="flex items-center text-indigo-600 hover:text-indigo-900 font-medium bg-indigo-50 hover:bg-indigo-100 transition-colors duration-150 px-3 py-1.5 rounded-lg group-hover:scale-105 transform"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4 w-4 mr-1.5 rtl:ml-1.5 rtl:mr-0"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                        />
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                        />
                                                                    </svg>
                                                                    {t('View Details')}
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>

                                {/* Pagination Controls */}
                                {accounts.links && accounts.links.length > 3 && (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.5, duration: 0.4 }}
                                        className="flex flex-col items-center space-y-4 mt-6"
                                    >
                                        <div className="text-sm text-slate-600 dark:text-slate-400">
                                            {t("Showing")} {accounts.from || 0} {t("to")} {accounts.to || 0} {t("of")} {accounts.total || 0} {t("results")}
                                        </div>
                                        <div className="flex items-center space-x-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-green-100 dark:border-green-900/30">
                                            {/* Previous Page */}
                                            <Link
                                                href={accounts.prev_page_url}
                                                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                                                    accounts.prev_page_url
                                                        ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30'
                                                        : 'text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                                <span className="ml-1 hidden sm:inline">{t('Previous')}</span>
                                            </Link>

                                            {/* Page Numbers */}
                                            {accounts.links.slice(1, -1).map((link, index) => {
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
                                                    <Link
                                                        key={index}
                                                        href={link.url}
                                                        className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                                                            isActive
                                                                ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-lg'
                                                                : 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30'
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: pageNum }}
                                                    />
                                                );
                                            })}

                                            {/* Next Page */}
                                            <Link
                                                href={accounts.next_page_url}
                                                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                                                    accounts.next_page_url
                                                        ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30'
                                                        : 'text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                <span className="mr-1 hidden sm:inline">{t('Next')}</span>
                                                <ChevronRight className="h-4 w-4 rotate-180" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}

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
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
