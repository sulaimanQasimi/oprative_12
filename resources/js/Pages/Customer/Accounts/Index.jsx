import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerNavbar from '@/Components/CustomerNavbar';
import { useLaravelReactI18n } from 'laravel-react-i18n';
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
    ShoppingCart
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
                            <CreditCard className="h-10 w-10 text-white drop-shadow-lg" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default function AccountsIndex({ accounts, search_id_number, search_account_number, isFilterOpen, customer, auth }) {
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
            <Head title={t('Bank Accounts')}>
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
                    auth={auth || {user: {name: customer?.name || 'Customer'}}}
                    currentRoute="customer.accounts.index"
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden max-w-full">
                    {/* Header */}
                    <header
                        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-0.5">
                                    {t("Customer Portal")}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    {t("Banking Accounts")}
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Link
                                href={route('customer.accounts.create')}
                            >
                                <Button
                                    size="sm"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    {t("New Account")}
                                </Button>
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
                                                <span className="text-indigo-200 text-sm">{accounts.total} {t('Accounts Total')}</span>
                                            </div>
                                        </div>
                                        <div className="hidden md:flex items-center justify-center bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl border border-white border-opacity-20 shadow-lg">
                                            <CreditCard className="h-16 w-16 text-white opacity-80" />
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    {/* Total Accounts */}
                                    <div className="group relative bg-white rounded-2xl shadow-md border border-gray-100 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-100 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-indigo-600">{t('Total Accounts')}</p>
                                                <p className="text-2xl font-bold text-gray-900">{accounts.total}</p>
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
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {accounts.data.filter(account => account.status === 'active').length}
                                                </p>
                                                <p className="text-xs text-gray-500">{t('Ready for transactions')}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <Shield className="w-8 h-8 text-green-600" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="group relative bg-white rounded-2xl shadow-md border border-gray-100 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-purple-100 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-purple-600">{t('Customer Profile')}</p>
                                                <p className="text-xl font-bold text-gray-900">{customer.name}</p>
                                                <p className="text-xs text-gray-500">{t('Account Holder')}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <User className="w-8 h-8 text-purple-600" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions and Filters Row */}
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                    {/* Create Account Button - hiding this since we already have it in the header */}
                                    <div className="hidden">
                                        <Link
                                            href={route('customer.accounts.create')}
                                            className="group relative inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg transition-all duration-300"
                                        >
                                            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                            <span className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></span>
                                            <Plus className="mr-2 h-4 w-4 text-white" />
                                            <span className="relative">{t('Create New Account')}</span>
                                        </Link>
                                    </div>

                                    {/* Filter Button */}
                                    <button
                                        onClick={() => setFilterOpen(!filterOpen)}
                                        className="group relative inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm hover:shadow-md transition-all duration-300"
                                    >
                                        <span className="absolute top-0 left-0 w-full h-full bg-indigo-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-lg"></span>
                                        <Filter className={`mr-2 h-4 w-4 ${filterOpen ? 'text-indigo-600' : 'text-gray-500'} group-hover:text-indigo-600 transition-colors duration-300`} />
                                        <span className="relative group-hover:text-indigo-600 transition-colors duration-300">
                                            {filterOpen ? t('Hide Filters') : t('Show Filters')}
                                        </span>
                                    </button>
                                </div>

                                {/* Filter Panel */}
                                {filterOpen && (
                                    <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300 animate-fadeIn">
                                        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                                            <Filter className="h-5 w-5 mr-2 text-indigo-500" />
                                            {t('Search Filters')}
                                        </h3>

                                        <form action={route('customer.accounts.index')} method="GET" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* ID Number Filter */}
                                            <div>
                                                <label htmlFor="search_id_number" className="block text-sm font-medium text-gray-700 mb-1">
                                                    {t('ID Number')}
                                                </label>
                                                <div className="mt-1 relative rounded-md shadow-sm">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Search className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="search_id_number"
                                                        id="search_id_number"
                                                        defaultValue={search_id_number}
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2.5 sm:text-sm border-gray-300 rounded-lg"
                                                        placeholder={t('Search by ID number')}
                                                    />
                                                </div>
                                            </div>

                                            {/* Account Number Filter */}
                                            <div>
                                                <label htmlFor="search_account_number" className="block text-sm font-medium text-gray-700 mb-1">
                                                    {t('Account Number')}
                                                </label>
                                                <div className="mt-1 relative rounded-md shadow-sm">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Search className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="search_account_number"
                                                        id="search_account_number"
                                                        defaultValue={search_account_number}
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2.5 sm:text-sm border-gray-300 rounded-lg"
                                                        placeholder={t('Search by account number')}
                                                    />
                                                </div>
                                            </div>

                                            {/* Filter Actions */}
                                            <div className="md:col-span-2 flex flex-col md:flex-row justify-end gap-4 mt-2">
                                                <Link
                                                    href={route('customer.accounts.resetFilters')}
                                                    className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                                                >
                                                    <RefreshCw className="h-4 w-4 mr-2 text-gray-500" />
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

                                {/* Accounts List */}
                                <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-xl overflow-hidden mb-8">
                                    <div className="px-8 py-6 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 backdrop-blur-sm">
                                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                                            <CreditCard className="h-6 w-6 mr-2 text-indigo-600" />
                                            {t('Your Banking Accounts')}
                                        </h3>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                                                    <th scope="col" className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        {t('Account Details')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        {t('Account Number')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        {t('Status')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        {t('Balance')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        {t('Actions')}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-100">
                                                {accounts.data.length > 0 ? (
                                                    accounts.data.map(account => (
                                                        <tr key={account.id} className="group hover:bg-indigo-50/40 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                                                            <td className="px-8 py-6 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div className="flex-shrink-0 h-16 w-16 flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg group-hover:shadow-xl group-hover:from-violet-600 group-hover:to-purple-700 transition-all duration-300 transform group-hover:scale-105">
                                                                        <CreditCard className="h-8 w-8" />
                                                                    </div>
                                                                    <div className="ml-5">
                                                                        <div className="text-base font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">{account.name}</div>
                                                                        <div className="text-sm text-gray-500 mt-1.5 flex items-center">
                                                                            <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                                                                            {account.created_at ? new Date(account.created_at).toLocaleDateString() : 'N/A'}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-6 whitespace-nowrap">
                                                                <div className="text-sm text-gray-600 bg-gray-50 group-hover:bg-indigo-100/70 py-2 px-3.5 rounded-md inline-flex items-center transition-colors duration-300 border border-gray-100 group-hover:border-indigo-200 shadow-sm">
                                                                    <CreditCard className="h-4 w-4 mr-2 text-gray-500 group-hover:text-indigo-600 transition-colors duration-300" />
                                                                    {account.account_number}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-6 whitespace-nowrap">
                                                                <span className={`px-4 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                                                                    account.status === 'active'
                                                                        ? 'bg-green-100 text-green-800 border border-green-200'
                                                                        : account.status === 'suspended' || account.status === 'closed'
                                                                            ? 'bg-red-100 text-red-800 border border-red-200'
                                                                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                                } shadow-sm group-hover:shadow-md transition-all duration-300`}>
                                                                    <span className={`flex h-2.5 w-2.5 rounded-full mr-2 ${
                                                                        account.status === 'active'
                                                                            ? 'bg-green-500 animate-pulse'
                                                                            : account.status === 'suspended' || account.status === 'closed'
                                                                                ? 'bg-red-500'
                                                                                : 'bg-yellow-500'
                                                                    }`}></span>
                                                                    {t(account.status.charAt(0).toUpperCase() + account.status.slice(1))}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-6 whitespace-nowrap">
                                                                <div className="text-sm font-mono bg-indigo-50/80 text-indigo-800 py-2 px-4 rounded-md border border-indigo-100 shadow-sm group-hover:shadow-md group-hover:bg-indigo-100 inline-flex items-center transition-all duration-300">
                                                                    <DollarSign className="h-4 w-4 mr-2 text-indigo-500" />
                                                                    {new Intl.NumberFormat('fa-AF', { style: 'currency', currency: 'AFN' }).format(account.balance || 0)}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-6 whitespace-nowrap text-right text-sm font-medium">
                                                                <Link
                                                                    href={route('customer.accounts.show', account.id)}
                                                                    className="group relative inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md overflow-hidden"
                                                                >
                                                                    <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                                                    <span className="relative">{t('View Details')}</span>
                                                                    <ChevronRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="px-6 py-12 text-center">
                                                            <div className="max-w-sm mx-auto">
                                                                <div className="flex justify-center mb-4">
                                                                    <div className="p-5 bg-indigo-100 rounded-full shadow-inner">
                                                                        <CreditCard className="h-12 w-12 text-indigo-600" />
                                                                    </div>
                                                                </div>
                                                                <p className="text-lg font-medium text-gray-800 mb-2">
                                                                    {t('No accounts found')}
                                                                </p>
                                                                <p className="text-gray-500 mb-6">
                                                                    {t('Create a new account to get started with managing your finances.')}
                                                                </p>
                                                                <Link
                                                                    href={route('customer.accounts.create')}
                                                                    className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 w-full shadow-md hover:shadow-lg"
                                                                >
                                                                    <Plus className="mr-2 h-4 w-4" />
                                                                    {t('Create Your First Account')}
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {accounts.links && accounts.links.length > 3 && (
                                        <div className="px-8 py-6 border-t border-indigo-100 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                                <div className="text-sm text-gray-700">
                                                    {t('Showing')} <span className="font-medium text-indigo-700">{accounts.from}</span> {t('to')} <span className="font-medium text-indigo-700">{accounts.to}</span> {t('of')} <span className="font-medium text-indigo-700">{accounts.total}</span> {t('results')}
                                                </div>

                                                <nav className="relative z-0 inline-flex rounded-xl shadow-md -space-x-px overflow-hidden" aria-label="Pagination">
                                                    {accounts.links.map((link, i) => {
                                                        // Skip the "prev" and "next" labels for special styling
                                                        if (i === 0 || i === accounts.links.length - 1) {
                                                            return null;
                                                        }

                                                        // For number pagination links
                                                        return (
                                                            <Link
                                                                key={i}
                                                                href={link.url}
                                                                className={`relative inline-flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out border-r border-indigo-100 ${
                                                                    link.active
                                                                        ? 'z-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-md transform scale-105'
                                                                        : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                                                }`}
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                            />
                                                        );
                                                    })}
                                                </nav>

                                                {/* Prev/Next Buttons */}
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={accounts.prev_page_url}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg ${
                                                            accounts.prev_page_url
                                                                ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                                : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                        disabled={!accounts.prev_page_url}
                                                    >
                                                        {t('Previous')}
                                                    </Link>
                                                    <Link
                                                        href={accounts.next_page_url}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg ${
                                                            accounts.next_page_url
                                                                ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                                : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                        disabled={!accounts.next_page_url}
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
