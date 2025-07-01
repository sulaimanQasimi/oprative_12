import React, { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import CustomerNavbar from "@/Components/CustomerNavbar";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
import { Button } from '@/Components/ui/button';
import {
    CreditCard,
    Plus,
    Search,
    Filter,
    RefreshCw,
    DollarSign,
    Shield,
    User,
    Calendar,
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    Clock,
    X,
    ChevronRight,
    CheckCircle,
    FileText,
    ChevronLeft,
    CreditCard as CardIcon,
    ReceiptText,
    Printer,
    Box,
    PackageCheck,
    PackageX,
    PackageOpen,
    Warehouse,
    MapPin,
    Route,
    Minus,
    AlertTriangle,
    TrendingDown as TrendingDownIcon,
    Download,
    Upload,
    ExternalLink,
    Globe,
    Ship,
    Plane,
    Container
} from "lucide-react";

// PageLoader component (copied from Index.jsx)
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

export default function AccountDetails({
    auth,
    account,
    incomes,
    outcomes,
    totalIncome,
    pendingIncome,
    monthlyIncome,
    yearlyIncome,
    incomeByMonth,
    totalOutcome,
    pendingOutcome,
    monthlyOutcome,
    yearlyOutcome,
    tab,
    customer
}) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(tab);
    const [showCreateIncomeModal, setShowCreateIncomeModal] = useState(false);
    const [showCreateOutcomeModal, setShowCreateOutcomeModal] = useState(false);
    const [searchIncomeQuery, setSearchIncomeQuery] = useState('');
    const [searchOutcomeQuery, setSearchOutcomeQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        description: '',
    });

    const outcomeForm = useForm({
        amount: '',
        description: '',
    });

    // Simulate loading delay (copied from Index.jsx)
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const handleCreateIncome = (e) => {
        e.preventDefault();
        post(route('customer.accounts.incomes.store', account.id), {
            onSuccess: () => {
                setShowCreateIncomeModal(false);
                reset();
            }
        });
    };

    const handleCreateOutcome = (e) => {
        e.preventDefault();
        outcomeForm.post(route('customer.accounts.outcomes.store', account.id), {
            onSuccess: () => {
                setShowCreateOutcomeModal(false);
                outcomeForm.reset();
            }
        });
    };

    return (
        <>
            <Head title={t("Account Details")}>
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
                    auth={auth || {user: {name: customer?.name || 'Customer'}}}
                    currentRoute="customer.accounts.show"
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
                                    {t("Account Details")}
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Link
                                href={route('customer.accounts.index')}
                            >
                                <Button
                                    size="sm"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    {t("Back to Accounts")}
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
                                                {t('Account Details Management')}
                                            </h1>
                                            <p className="text-indigo-100 text-lg max-w-2xl">
                                                {t('Track all your account transactions and manage your financial records in one secure place.')}
                                            </p>
                                            <div className="flex items-center mt-6 gap-4">
                                                <button
                                                    onClick={() => setShowCreateIncomeModal(true)}
                                                    className="group relative inline-flex items-center px-6 py-3 text-base font-medium leading-6 text-white transition-all duration-300 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 overflow-hidden"
                                                >
                                                    <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                                    <Plus className="mr-2 h-5 w-5 text-white group-hover:rotate-90 transition-transform duration-300" />
                                                    <span className="relative">{t('Add Income')}</span>
                                                </button>
                                                <button
                                                    onClick={() => setShowCreateOutcomeModal(true)}
                                                    className="group relative inline-flex items-center px-6 py-3 text-base font-medium leading-6 text-white transition-all duration-300 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 overflow-hidden"
                                                >
                                                    <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                                    <Minus className="mr-2 h-5 w-5 text-white group-hover:rotate-90 transition-transform duration-300" />
                                                    <span className="relative">{t('Add Rent/Loan')}</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="hidden md:flex items-center justify-center bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl border border-white border-opacity-20 shadow-lg">
                                            <CreditCard className="h-16 w-16 text-white opacity-80" />
                                        </div>
                                    </div>
                                </div>

                                {/* Account Information Section */}
                                <div className="mb-10">
                                    <div className="flex items-center mb-6">
                                        <Link
                                            href={route('customer.accounts.index')}
                                            className="mr-4 p-2.5 rounded-full bg-white shadow-md hover:bg-gray-50 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                                        >
                                            <ChevronLeft className="h-5 w-5 text-indigo-600" />
                                        </Link>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                                                {account.name}
                                            </h2>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className="text-slate-600 dark:text-slate-400">•</span>
                                                <span className="text-slate-600 dark:text-slate-400 font-mono text-sm bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
                                                    {account.account_number}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Balance and Action Cards */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                                        {/* Balance Card */}
                                        <div className="bg-gradient-to-br from-white to-indigo-50/50 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-100/50 p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 p-3 rounded-xl">
                                                    <CreditCard className="h-6 w-6 text-indigo-600" />
                                                </div>
                                                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                                                    {t('Balance')}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-3xl font-bold text-slate-800 dark:text-white">
                                                    ${formatNumber(totalIncome - totalOutcome)}
                                                </p>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    {t('Current Account Balance')}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="lg:col-span-2 flex flex-col sm:flex-row gap-4">
                                            <button
                                                onClick={() => setShowCreateIncomeModal(true)}
                                                className="group relative flex-1 bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 hover:from-emerald-500 hover:via-green-600 hover:to-emerald-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 p-5 flex items-center justify-center gap-3 overflow-hidden"
                                            >
                                                {/* Animated background effect */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                                
                                                {/* Icon with glow effect */}
                                                <div className="relative z-10 flex items-center gap-3">
                                                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                                        <Plus className="h-5 w-5 drop-shadow-lg" />
                                                    </div>
                                                    <span className="text-lg font-bold tracking-wide">{t('Add Income')}</span>
                                                </div>
                                                
                                                {/* Shimmer effect */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                                            </button>
                                            
                                            <button
                                                onClick={() => setShowCreateOutcomeModal(true)}
                                                className="group relative flex-1 bg-gradient-to-br from-rose-400 via-red-500 to-rose-600 hover:from-rose-500 hover:via-red-600 hover:to-rose-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 p-5 flex items-center justify-center gap-3 overflow-hidden"
                                            >
                                                {/* Animated background effect */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                                
                                                {/* Icon with glow effect */}
                                                <div className="relative z-10 flex items-center gap-3">
                                                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                                        <CardIcon className="h-5 w-5 drop-shadow-lg" />
                                                    </div>
                                                    <span className="text-lg font-bold tracking-wide">{t('Add Rent/Loan')}</span>
                                                </div>
                                                
                                                {/* Shimmer effect */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                                            </button>
                                            
                                            <a
                                                href={route('reports.account.statement', account.id)}
                                                target="_blank"
                                                className="group relative flex-1 bg-gradient-to-br from-blue-400 via-indigo-500 to-blue-600 hover:from-blue-500 hover:via-indigo-600 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 p-5 flex items-center justify-center gap-3 overflow-hidden"
                                            >
                                                {/* Animated background effect */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                                
                                                {/* Icon with glow effect */}
                                                <div className="relative z-10 flex items-center gap-3">
                                                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                                        <FileText className="h-5 w-5 drop-shadow-lg" />
                                                    </div>
                                                    <span className="text-lg font-bold tracking-wide">{t('Export Statement')}</span>
                                                </div>
                                                
                                                {/* Shimmer effect */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    {/* Total Income */}
                                    <div className="group relative bg-white rounded-2xl shadow-md border border-gray-100 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-green-100 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-green-600">{t('Total Income')}</p>
                                                <p className="text-2xl font-bold text-gray-900">${formatNumber(totalIncome)}</p>
                                                <p className="text-xs text-gray-500">{t('All time income')}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <TrendingUp className="w-8 h-8 text-green-600" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Outcome */}
                                    <div className="group relative bg-white rounded-2xl shadow-md border border-gray-100 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-red-100 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-red-600">{t('Total Rent')}</p>
                                                <p className="text-2xl font-bold text-gray-900">${formatNumber(totalOutcome)}</p>
                                                <p className="text-xs text-gray-500">{t('All time rent/loans')}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <TrendingDown className="w-8 h-8 text-red-600" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Account Balance */}
                                    <div className="group relative bg-white rounded-2xl shadow-md border border-gray-100 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-100 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-indigo-600">{t('Account Balance')}</p>
                                                <p className="text-2xl font-bold text-gray-900">${formatNumber(totalIncome - totalOutcome)}</p>
                                                <p className="text-xs text-gray-500">{t('Current balance')}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <CreditCard className="w-8 h-8 text-indigo-600" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Income History Table */}
                                <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-xl overflow-hidden mb-8">
                                    <div className="px-8 py-6 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 backdrop-blur-sm">
                                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                                            <TrendingUp className="h-6 w-6 mr-2 text-indigo-600" />
                                            {t('Income History')}
                                        </h3>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                                                    <th scope="col" className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        {t('Description')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        {t('Amount')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        {t('Status')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        {t('Actions')}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-100">
                                            {incomes.data && incomes.data.length > 0 ? (
                                                incomes.data
                                                .filter(income => {
                                                    if (!searchIncomeQuery) return true;
                                                    const searchText = searchIncomeQuery.toLowerCase();
                                                    return (
                                                        (income.description || '').toLowerCase().includes(searchText) ||
                                                        (income.id || '').toString().includes(searchText) ||
                                                        (income.amount || '').toString().includes(searchText)
                                                    );
                                                })
                                                .map((income) => (
                                                            <tr key={income.id} className="group hover:bg-indigo-50/40 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                                                                <td className="px-8 py-6 whitespace-nowrap">
                                                                    <div className="flex items-center">
                                                                        <div className="flex-shrink-0 h-16 w-16 flex items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg group-hover:shadow-xl group-hover:from-green-600 group-hover:to-emerald-700 transition-all duration-300 transform group-hover:scale-105">
                                                                            <TrendingUp className="h-8 w-8" />
                                                                        </div>
                                                                        <div className="ml-5">
                                                                            <div className="text-base font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">{income.description || t('Income payment')}</div>
                                                                            <div className="text-sm text-gray-500 mt-1.5 flex items-center">
                                                                                <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                                                                                {new Date(income.date).toLocaleDateString()}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-6 whitespace-nowrap">
                                                                    <div className="text-sm font-mono bg-green-50/80 text-green-800 py-2 px-4 rounded-md border border-green-100 shadow-sm group-hover:shadow-md group-hover:bg-green-100 inline-flex items-center transition-all duration-300">
                                                                        <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                                                                        ${formatNumber(income.amount)}
                                                                    </div>
                                                                </td>
                                                                                                                                <td className="px-6 py-6 whitespace-nowrap">
                                                                    <span className={`px-4 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                                                                        income.status === 'approved'
                                                                            ? 'bg-green-100 text-green-800 border border-green-200'
                                                                            : income.status === 'pending'
                                                                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                                                                    } shadow-sm group-hover:shadow-md transition-all duration-300`}>
                                                                        <span className={`flex h-2.5 w-2.5 rounded-full mr-2 ${
                                                                            income.status === 'approved'
                                                                                ? 'bg-green-500 animate-pulse'
                                                                                : income.status === 'pending'
                                                                                    ? 'bg-yellow-500'
                                                                                    : 'bg-gray-500'
                                                                        }`}></span>
                                                                        {t(income.status.charAt(0).toUpperCase() + income.status.slice(1))}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-6 whitespace-nowrap text-right text-sm font-medium">
                                                                    <div className="flex items-center justify-end space-x-2">
                                                                        {income.status === 'pending' && (
                                                                            <button
                                                                                onClick={() => {
                                                                                    router.post(route('customer.accounts.incomes.approve', {account: account.id, income: income.id}));
                                                                                }}
                                                                                className="group relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md overflow-hidden"
                                                                            >
                                                                                <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                                                                <CheckCircle className="mr-1.5 h-4 w-4" />
                                                                                <span className="relative">{t('Approve')}</span>
                                                                            </button>
                                                                        )}
                                                                        <a
                                                                            href={route('thermal.print.income', income.id)}
                                                                            target="_blank"
                                                                            className="group relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                                                                        >
                                                                            <span className="absolute top-0 left-0 w-full h-full bg-indigo-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-lg"></span>
                                                                            <Printer className="mr-1.5 h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-300" />
                                                                            <span className="relative group-hover:text-indigo-600 transition-colors duration-300">{t('Print')}</span>
                                                                        </a>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-12 text-center">
                                                        <div className="max-w-sm mx-auto">
                                                            <div className="flex justify-center mb-4">
                                                                <div className="p-5 bg-green-100 rounded-full shadow-inner">
                                                                    <TrendingUp className="h-12 w-12 text-green-600" />
                                                                </div>
                                                            </div>
                                                            <p className="text-lg font-medium text-gray-800 mb-2">
                                                                {t('No income transactions found')}
                                                            </p>
                                                            <p className="text-gray-500 mb-6">
                                                                {t('Start by adding your first income transaction.')}
                                                            </p>
                                                            <button
                                                                onClick={() => setShowCreateIncomeModal(true)}
                                                                className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 w-full shadow-md hover:shadow-lg"
                                                            >
                                                                <Plus className="mr-2 h-4 w-4" />
                                                                {t('Add Your First Income')}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination for incomes */}
                                    {incomes.links && incomes.links.length > 3 && (
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 1.5, duration: 0.4 }}
                                            className="flex flex-col items-center space-y-4 px-6 py-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50/30"
                                        >
                                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                                {t("Showing")} {incomes.from || 0} {t("to")} {incomes.to || 0} {t("of")} {incomes.total || 0} {t("results")}
                                            </div>
                                            <div className="flex items-center space-x-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-indigo-100 dark:border-indigo-900/30">
                                                {/* Previous Page */}
                                                <button
                                                    onClick={() => {
                                                        const prevPage = incomes.current_page - 1;
                                                        if (prevPage >= 1) {
                                                            router.get(route('customer.accounts.show', { account: account.id, page: prevPage }), {
                                                                preserveState: true,
                                                                preserveScroll: true,
                                                            });
                                                        }
                                                    }}
                                                    disabled={!incomes.links || incomes.current_page <= 1}
                                                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                                                        incomes.links && incomes.current_page > 1
                                                            ? 'text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                                                            : 'text-gray-400 cursor-not-allowed'
                                                    }`}
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                    <span className="ml-1 hidden sm:inline">{t('Previous')}</span>
                                                </button>

                                                {/* Page Numbers */}
                                                {incomes.links && incomes.links.slice(1, -1).map((link, index) => {
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
                                                                    router.get(route('customer.accounts.show', { account: account.id, page }), {
                                                                        preserveState: true,
                                                                        preserveScroll: true,
                                                                    });
                                                                }
                                                            }}
                                                            className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                                                                isActive
                                                                    ? 'bg-gradient-to-r from-indigo-500 to-blue-400 text-white shadow-lg'
                                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                                                            }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                })}

                                                {/* Next Page */}
                                                <button
                                                    onClick={() => {
                                                        const nextPage = incomes.current_page + 1;
                                                        if (nextPage <= incomes.last_page) {
                                                            router.get(route('customer.accounts.show', { account: account.id, page: nextPage }), {
                                                                preserveState: true,
                                                                preserveScroll: true,
                                                            });
                                                        }
                                                    }}
                                                    disabled={!incomes.links || incomes.current_page >= incomes.last_page}
                                                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                                                        incomes.links && incomes.current_page < incomes.last_page
                                                            ? 'text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
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

                                {/* Outcome/Loan History Table */}
                                <div className="bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-xl overflow-hidden mb-8">
                                    <div className="px-8 py-6 border-b border-red-100 bg-gradient-to-r from-red-50 to-pink-50 backdrop-blur-sm">
                                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                                            <TrendingDown className="h-6 w-6 mr-2 text-red-600" />
                                            {t('Rent & Loan History')}
                                        </h3>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                                <tr className="bg-gradient-to-r from-red-50 to-pink-50">
                                                    <th scope="col" className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        {t('Description')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        {t('Reference')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        {t('Amount')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        {t('Status')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        {t('Actions')}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-100">
                                            {outcomes.data && outcomes.data.length > 0 ? (
                                                outcomes.data
                                                .filter(outcome => {
                                                    if (!searchOutcomeQuery) return true;
                                                    const searchText = searchOutcomeQuery.toLowerCase();
                                                    return (
                                                        (outcome.description || '').toLowerCase().includes(searchText) ||
                                                        (outcome.reference_number || '').toLowerCase().includes(searchText) ||
                                                        (outcome.amount || '').toString().includes(searchText) ||
                                                        (outcome.id || '').toString().includes(searchText)
                                                    );
                                                })
                                                .map((outcome) => (
                                                            <tr key={outcome.id} className="group hover:bg-red-50/40 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                                                                <td className="px-8 py-6 whitespace-nowrap">
                                                                    <div className="flex items-center">
                                                                        <div className="flex-shrink-0 h-16 w-16 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-lg group-hover:shadow-xl group-hover:from-red-600 group-hover:to-pink-700 transition-all duration-300 transform group-hover:scale-105">
                                                                            <TrendingDown className="h-8 w-8" />
                                                                        </div>
                                                                        <div className="ml-5">
                                                                            <div className="text-base font-semibold text-gray-900 group-hover:text-red-700 transition-colors duration-300">{outcome.description || t('Rent payment')}</div>
                                                                            <div className="text-sm text-gray-500 mt-1.5 flex items-center">
                                                                                <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                                                                                {new Date(outcome.date).toLocaleDateString()}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-6 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-600 bg-gray-50 group-hover:bg-red-100/70 py-2 px-3.5 rounded-md inline-flex items-center transition-colors duration-300 border border-gray-100 group-hover:border-red-200 shadow-sm">
                                                                        <span className="text-xs text-red-500 mr-1.5">#</span>
                                                                        {outcome.reference_number || '-'}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-6 whitespace-nowrap">
                                                                    <div className="text-sm font-mono bg-red-50/80 text-red-800 py-2 px-4 rounded-md border border-red-100 shadow-sm group-hover:shadow-md group-hover:bg-red-100 inline-flex items-center transition-all duration-300">
                                                                        <DollarSign className="h-4 w-4 mr-2 text-red-500" />
                                                                        ${formatNumber(outcome.amount)}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-6 whitespace-nowrap">
                                                                    <span className={`px-4 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                                                                        outcome.status === 'approved'
                                                                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                                                            : outcome.status === 'pending'
                                                                                ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                                                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                                                                    } shadow-sm group-hover:shadow-md transition-all duration-300`}>
                                                                        <span className={`flex h-2.5 w-2.5 rounded-full mr-2 ${
                                                                            outcome.status === 'approved'
                                                                                ? 'bg-purple-500 animate-pulse'
                                                                                : outcome.status === 'pending'
                                                                                    ? 'bg-orange-500'
                                                                                    : 'bg-gray-500'
                                                                        }`}></span>
                                                                        {t(outcome.status.charAt(0).toUpperCase() + outcome.status.slice(1))}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-6 whitespace-nowrap text-right text-sm font-medium">
                                                                    <div className="flex items-center justify-end space-x-2">
                                                                        {outcome.status === 'pending' && (
                                                                            <button
                                                                                onClick={() => {
                                                                                    router.post(route('customer.accounts.outcomes.approve', {account: account.id, outcome: outcome.id}));
                                                                                }}
                                                                                className="group relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md overflow-hidden"
                                                                            >
                                                                                <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                                                                <CheckCircle className="mr-1.5 h-4 w-4" />
                                                                                <span className="relative">{t('Approve')}</span>
                                                                            </button>
                                                                        )}
                                                                        <a
                                                                            href={route('thermal.print.outcome', outcome.id)}
                                                                            target="_blank"
                                                                            className="group relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                                                                        >
                                                                            <span className="absolute top-0 left-0 w-full h-full bg-red-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-lg"></span>
                                                                            <Printer className="mr-1.5 h-4 w-4 text-red-500 group-hover:text-red-600 transition-colors duration-300" />
                                                                            <span className="relative group-hover:text-red-600 transition-colors duration-300">{t('Print')}</span>
                                                                        </a>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-12 text-center">
                                                        <div className="max-w-sm mx-auto">
                                                            <div className="flex justify-center mb-4">
                                                                <div className="p-5 bg-red-100 rounded-full shadow-inner">
                                                                    <TrendingDown className="h-12 w-12 text-red-600" />
                                                                </div>
                                                            </div>
                                                            <p className="text-lg font-medium text-gray-800 mb-2">
                                                                {t('No rent or loan transactions found')}
                                                            </p>
                                                            <p className="text-gray-500 mb-6">
                                                                {t('Add your first rental or loan payment.')}
                                                            </p>
                                                            <button
                                                                onClick={() => setShowCreateOutcomeModal(true)}
                                                                className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 w-full shadow-md hover:shadow-lg"
                                                            >
                                                                <Minus className="mr-2 h-4 w-4" />
                                                                {t('Add Rent/Loan Payment')}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination for outcomes */}
                                    {outcomes.links && outcomes.links.length > 3 && (
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 1.5, duration: 0.4 }}
                                            className="flex flex-col items-center space-y-4 px-6 py-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-red-50/30"
                                        >
                                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                                {t("Showing")} {outcomes.from || 0} {t("to")} {outcomes.to || 0} {t("of")} {outcomes.total || 0} {t("results")}
                                            </div>
                                            <div className="flex items-center space-x-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-red-100 dark:border-red-900/30">
                                                {/* Previous Page */}
                                                <button
                                                    onClick={() => {
                                                        const prevPage = outcomes.current_page - 1;
                                                        if (prevPage >= 1) {
                                                            router.get(route('customer.accounts.show', { account: account.id, page: prevPage }), {
                                                                preserveState: true,
                                                                preserveScroll: true,
                                                            });
                                                        }
                                                    }}
                                                    disabled={!outcomes.links || outcomes.current_page <= 1}
                                                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                                                        outcomes.links && outcomes.current_page > 1
                                                            ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30'
                                                            : 'text-gray-400 cursor-not-allowed'
                                                    }`}
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                    <span className="ml-1 hidden sm:inline">{t('Previous')}</span>
                                                </button>

                                                {/* Page Numbers */}
                                                {outcomes.links && outcomes.links.slice(1, -1).map((link, index) => {
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
                                                                    router.get(route('customer.accounts.show', { account: account.id, page }), {
                                                                        preserveState: true,
                                                                        preserveScroll: true,
                                                                    });
                                                                }
                                                            }}
                                                            className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                                                                isActive
                                                                    ? 'bg-gradient-to-r from-red-500 to-pink-400 text-white shadow-lg'
                                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30'
                                                            }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                })}

                                                {/* Next Page */}
                                                <button
                                                    onClick={() => {
                                                        const nextPage = outcomes.current_page + 1;
                                                        if (nextPage <= outcomes.last_page) {
                                                            router.get(route('customer.accounts.show', { account: account.id, page: nextPage }), {
                                                                preserveState: true,
                                                                preserveScroll: true,
                                                            });
                                                        }
                                                    }}
                                                    disabled={!outcomes.links || outcomes.current_page >= outcomes.last_page}
                                                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                                                        outcomes.links && outcomes.current_page < outcomes.last_page
                                                            ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30'
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
                        </div>
                    </main>
                </div>
            </div>

            {/* Create Income Modal */}
            {showCreateIncomeModal && (
                <div className="fixed inset-0 overflow-y-auto z-50 animate-fadeIn">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay with enhanced blur effect */}
                        <div className="fixed inset-0 bg-gradient-to-br from-gray-900/80 to-indigo-900/70 backdrop-blur-md transition-all duration-300"
                             aria-hidden="true"
                             onClick={() => setShowCreateIncomeModal(false)}></div>

                        {/* Modal panel */}
                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <Plus className="h-5 w-5" />
                                        {t('Add New Income')}
                                    </h3>
                                    <button
                                        onClick={() => setShowCreateIncomeModal(false)}
                                        className="text-white hover:text-indigo-200 transition-colors"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleCreateIncome} className="px-6 py-6">
                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-2">
                                            {t('Amount')} *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            id="amount"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            placeholder="0.00"
                                            required
                                        />
                                        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                                            {t('Description')}
                                        </label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows="3"
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            placeholder={t('Enter income description...')}
                                        />
                                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateIncomeModal(false)}
                                        className="group relative flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 transform hover:scale-105 font-semibold"
                                    >
                                        <div className="relative z-10 flex items-center justify-center gap-2">
                                            <X className="w-4 h-4" />
                                            <span>{t('Cancel')}</span>
                                        </div>
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="group relative flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl disabled:opacity-50 transition-all duration-300 transform hover:scale-105 font-bold shadow-lg hover:shadow-xl overflow-hidden"
                                    >
                                        {/* Shimmer effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                        
                                        <div className="relative z-10 flex items-center justify-center gap-2">
                                            {processing ? (
                                                <>
                                                    <RefreshCw className="h-5 w-5 animate-spin drop-shadow-sm" />
                                                    <span>{t('Creating...')}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="h-5 w-5 drop-shadow-sm" />
                                                    <span>{t('Create Income')}</span>
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Outcome/Loan Modal */}
            {showCreateOutcomeModal && (
                <div className="fixed inset-0 overflow-y-auto z-50 animate-fadeIn">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay with enhanced blur effect */}
                        <div className="fixed inset-0 bg-gradient-to-br from-gray-900/80 to-red-900/70 backdrop-blur-md transition-all duration-300"
                             aria-hidden="true"
                             onClick={() => setShowCreateOutcomeModal(false)}></div>

                        {/* Modal panel */}
                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <Minus className="h-5 w-5" />
                                        {t('Add Rent/Loan Payment')}
                                    </h3>
                                    <button
                                        onClick={() => setShowCreateOutcomeModal(false)}
                                        className="text-white hover:text-red-200 transition-colors"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleCreateOutcome} className="px-6 py-6">
                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="outcome_amount" className="block text-sm font-medium text-slate-700 mb-2">
                                            {t('Amount')} *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            id="outcome_amount"
                                            value={outcomeForm.data.amount}
                                            onChange={(e) => outcomeForm.setData('amount', e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                                            placeholder="0.00"
                                            required
                                        />
                                        {outcomeForm.errors.amount && <p className="mt-1 text-sm text-red-600">{outcomeForm.errors.amount}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="outcome_description" className="block text-sm font-medium text-slate-700 mb-2">
                                            {t('Description')}
                                        </label>
                                        <textarea
                                            id="outcome_description"
                                            value={outcomeForm.data.description}
                                            onChange={(e) => outcomeForm.setData('description', e.target.value)}
                                            rows="3"
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                                            placeholder={t('Enter rent or loan description...')}
                                        />
                                        {outcomeForm.errors.description && <p className="mt-1 text-sm text-red-600">{outcomeForm.errors.description}</p>}
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateOutcomeModal(false)}
                                        className="group relative flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 transform hover:scale-105 font-semibold"
                                    >
                                        <div className="relative z-10 flex items-center justify-center gap-2">
                                            <X className="w-4 h-4" />
                                            <span>{t('Cancel')}</span>
                                        </div>
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={outcomeForm.processing}
                                        className="group relative flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white rounded-xl disabled:opacity-50 transition-all duration-300 transform hover:scale-105 font-bold shadow-lg hover:shadow-xl overflow-hidden"
                                    >
                                        {/* Shimmer effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                        
                                        <div className="relative z-10 flex items-center justify-center gap-2">
                                            {outcomeForm.processing ? (
                                                <>
                                                    <RefreshCw className="h-5 w-5 animate-spin drop-shadow-sm" />
                                                    <span>{t('Creating...')}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Minus className="h-5 w-5 drop-shadow-sm" />
                                                    <span>{t('Create Payment')}</span>
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
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
        </>
    );
}
