import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import CustomerNavbar from "@/Components/CustomerNavbar";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
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
                    auth={auth || { user: { name: "Customer" } }}
                    currentRoute="customer.accounts.show"
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
                                    {t("Account Details")}
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
                                                {t('Account Details Management')}
                                            </h1>
                                            <p className="text-blue-100 text-lg max-w-2xl">
                                                {t('Track all your account transactions and manage your financial records in one secure place.')}
                                            </p>
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
                                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-4 flex items-center justify-center gap-3"
                                            >
                                                <Plus className="h-5 w-5" />
                                                {t('Add Income')}
                                            </button>
                                            <button
                                                onClick={() => setShowCreateOutcomeModal(true)}
                                                className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-4 flex items-center justify-center gap-3"
                                            >
                                                <CardIcon className="h-5 w-5" />
                                                {t('Add Rent/Loan')}
                                            </button>
                                            <a
                                                href={route('reports.account.statement', account.id)}
                                                target="_blank"
                                                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-4 flex items-center justify-center gap-3"
                                            >
                                                <FileText className="h-5 w-5" />
                                                {t('Export Statement')}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Statistics Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                    {/* Total Income */}
                                    <div className="bg-gradient-to-br from-white to-green-50/50 backdrop-blur-xl rounded-2xl shadow-lg border border-green-100/50 p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-3 rounded-xl">
                                                <TrendingUp className="h-6 w-6 text-green-600" />
                                            </div>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-green-600">
                                                {t('Total Income')}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-2xl font-bold text-slate-800 dark:text-white">
                                                ${formatNumber(totalIncome)}
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {t('All time income')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Total Outcome */}
                                    <div className="bg-gradient-to-br from-white to-red-50/50 backdrop-blur-xl rounded-2xl shadow-lg border border-red-100/50 p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 p-3 rounded-xl">
                                                <TrendingDown className="h-6 w-6 text-red-600" />
                                            </div>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
                                                {t('Total Rent')}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-2xl font-bold text-slate-800 dark:text-white">
                                                ${formatNumber(totalOutcome)}
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {t('All time rent/loans')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Monthly Income */}
                                    <div className="bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-xl rounded-2xl shadow-lg border border-blue-100/50 p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-3 rounded-xl">
                                                <Calendar className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                                                {t('Monthly Income')}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-2xl font-bold text-slate-800 dark:text-white">
                                                ${formatNumber(monthlyIncome)}
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {t('This month')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Monthly Outcome */}
                                    <div className="bg-gradient-to-br from-white to-yellow-50/50 backdrop-blur-xl rounded-2xl shadow-lg border border-yellow-100/50 p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 p-3 rounded-xl">
                                                <Clock className="h-6 w-6 text-yellow-600" />
                                            </div>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-yellow-600">
                                                {t('Monthly Rent')}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-2xl font-bold text-slate-800 dark:text-white">
                                                ${formatNumber(monthlyOutcome)}
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {t('This month')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Income History Table */}
                                <div className="mb-10 bg-gradient-to-br from-white/80 to-indigo-50/50 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-100/50 overflow-hidden">
                                    <div className="p-6 border-b border-indigo-100/50 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-blue-50">
                                        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                            <div className="p-2 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-lg">
                                                <TrendingUp className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            {t('Income History')}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder={t('Search transactions...')}
                                                    value={searchIncomeQuery}
                                                    onChange={(e) => setSearchIncomeQuery(e.target.value)}
                                                    className="pl-10 pr-4 py-2 border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                                                />
                                                <Search className="h-4 w-4 text-indigo-400 absolute left-3 top-2.5" />
                                            </div>
                                            <button
                                                onClick={() => setSearchIncomeQuery('')}
                                                className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 hover:text-indigo-700 transition-all duration-200"
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-slate-200">
                                            <thead className="bg-gradient-to-r from-indigo-50 to-blue-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                                                        {t('Description')}
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                                                        {t('Amount')}
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                                                        {t('Status')}
                                                    </th>
                                                    <th className="px-6 py-4 text-right text-xs font-medium text-indigo-600 uppercase tracking-wider">
                                                        {t('Actions')}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-slate-100">
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
                                                            <tr key={income.id} className="hover:bg-indigo-50/30 transition-colors duration-150">
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                                                                    <div className="font-semibold">{income.description || t('Income payment')}</div>
                                                                    <div className="flex items-center text-slate-500 text-xs mt-1">
                                                                        <Calendar className="w-3 h-3 mr-1 text-indigo-400" />
                                                                        {new Date(income.date).toLocaleDateString()}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-base font-medium bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                                                                        ${formatNumber(income.amount)}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold
                                                                        ${income.status === 'approved'
                                                                            ? 'bg-green-100 text-green-700 ring-1 ring-green-600/20'
                                                                            : income.status === 'pending'
                                                                                ? 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-600/20'
                                                                                : 'bg-slate-100 text-slate-700 ring-1 ring-slate-600/20'
                                                                        }`}>
                                                                        {income.status === 'approved' && <CheckCircle className="w-3.5 h-3.5 mr-1.5" />}
                                                                        {income.status === 'pending' && <Clock className="w-3.5 h-3.5 mr-1.5" />}
                                                                        {income.status.charAt(0).toUpperCase() + income.status.slice(1)}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                                    <div className="flex items-center justify-end space-x-2">
                                                                        {income.status === 'pending' && (
                                                                            <Link
                                                                                href={route('customer.accounts.incomes.approve', {account: account.id, income: income.id})}
                                                                                method="post"
                                                                                as="button"
                                                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-sm hover:shadow-md transition-all duration-200"
                                                                            >
                                                                                <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                                                                                {t('Approve')}
                                                                            </Link>
                                                                        )}
                                                                        <a
                                                                            href={route('thermal.print.income', income.id)}
                                                                            target="_blank"
                                                                            className="inline-flex items-center px-2 py-1.5 border border-slate-300 text-xs font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 shadow-sm hover:shadow-md transition-all duration-200"
                                                                        >
                                                                            <Printer className="w-3.5 h-3.5 text-indigo-500" />
                                                                        </a>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="px-6 py-12 text-center text-sm text-slate-500">
                                                            <div className="flex flex-col items-center">
                                                                <div className="bg-slate-50 p-6 rounded-full mb-4">
                                                                    <DollarSign className="h-14 w-14 text-slate-400" />
                                                                </div>
                                                                <p className="text-base font-medium text-slate-600 mb-1">{t('No income transactions found')}</p>
                                                                <p className="text-sm text-slate-500 mb-4">{t('Start by adding your first income transaction')}</p>
                                                                <button
                                                                    onClick={() => setShowCreateIncomeModal(true)}
                                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                                                                >
                                                                    <Plus className="w-4 h-4 mr-2" />
                                                                    {t('Add your first income')}
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
                                        <div className="px-6 py-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50/30">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                <div className="mb-4 sm:mb-0">
                                                    <p className="text-sm text-slate-700">
                                                        {t('Showing')} <span className="font-semibold">{incomes.from}</span> {t('to')} <span className="font-semibold">{incomes.to}</span> {t('of')} <span className="font-semibold">{incomes.total}</span> {t('results')}
                                                    </p>
                                                </div>
                                                <nav className="relative z-0 inline-flex justify-center rounded-md shadow-sm -space-x-px">
                                                    <Link
                                                        href={incomes.prev_page_url}
                                                        className={`relative inline-flex items-center px-4 py-2 rounded-l-lg border ${!incomes.prev_page_url ? 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed' : 'border-slate-300 bg-white text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-colors'}`}
                                                        disabled={!incomes.prev_page_url}
                                                    >
                                                        <ChevronLeft className="h-4 w-4" />
                                                    </Link>

                                                    {incomes.links && incomes.links.slice(1, -1).map((link, index) => (
                                                        <Link
                                                            key={index}
                                                            href={link.url}
                                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                link.active
                                                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 font-semibold'
                                                                    : 'bg-white border-slate-300 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-colors'
                                                            }`}
                                                        >
                                                            {link.label.replace('&laquo;', '').replace('&raquo;', '')}
                                                        </Link>
                                                    ))}

                                                    <Link
                                                        href={incomes.next_page_url}
                                                        className={`relative inline-flex items-center px-4 py-2 rounded-r-lg border ${!incomes.next_page_url ? 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed' : 'border-slate-300 bg-white text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-colors'}`}
                                                        disabled={!incomes.next_page_url}
                                                    >
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Link>
                                                </nav>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Outcome/Loan History Table */}
                                <div className="mb-10 bg-gradient-to-br from-white/80 to-red-50/50 backdrop-blur-xl rounded-2xl shadow-lg border border-red-100/50 overflow-hidden">
                                    <div className="p-6 border-b border-red-100/50 flex justify-between items-center bg-gradient-to-r from-red-50 to-pink-50">
                                        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                            <div className="p-2 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-lg">
                                                <TrendingDown className="h-5 w-5 text-red-600" />
                                            </div>
                                            {t('Rent & Loan History')}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder={t('Search transactions...')}
                                                    value={searchOutcomeQuery}
                                                    onChange={(e) => setSearchOutcomeQuery(e.target.value)}
                                                    className="pl-10 pr-4 py-2 border border-red-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                                                />
                                                <Search className="h-4 w-4 text-red-400 absolute left-3 top-2.5" />
                                            </div>
                                            <button
                                                onClick={() => setSearchOutcomeQuery('')}
                                                className="p-2 hover:bg-red-50 rounded-lg text-red-600 hover:text-red-700 transition-all duration-200"
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-slate-200">
                                            <thead className="bg-gradient-to-r from-red-50 to-pink-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                                                        {t('Description')}
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                                                        {t('Reference')}
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                                                        {t('Amount')}
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                                                        {t('Status')}
                                                    </th>
                                                    <th className="px-6 py-4 text-right text-xs font-medium text-red-600 uppercase tracking-wider">
                                                        {t('Actions')}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-slate-100">
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
                                                            <tr key={outcome.id} className="hover:bg-red-50/30 transition-colors duration-150">
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                                                                    <div className="font-semibold">{outcome.description || t('Rent payment')}</div>
                                                                    <div className="flex items-center text-slate-500 text-xs mt-1">
                                                                        <Calendar className="w-3 h-3 mr-1 text-red-400" />
                                                                        {new Date(outcome.date).toLocaleDateString()}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-slate-600 font-mono bg-slate-50 px-2.5 py-1.5 rounded-lg inline-flex items-center border border-slate-100 shadow-sm">
                                                                        <span className="text-xs text-red-500 mr-1.5">#</span>
                                                                        {outcome.reference_number || '-'}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-base font-medium bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                                                                        ${formatNumber(outcome.amount)}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold
                                                                        ${outcome.status === 'approved'
                                                                            ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-600/20'
                                                                            : outcome.status === 'pending'
                                                                                ? 'bg-orange-100 text-orange-700 ring-1 ring-orange-600/20'
                                                                                : 'bg-slate-100 text-slate-700 ring-1 ring-slate-600/20'
                                                                        }`}>
                                                                        {outcome.status === 'approved' && <CheckCircle className="w-3.5 h-3.5 mr-1.5" />}
                                                                        {outcome.status === 'pending' && <Clock className="w-3.5 h-3.5 mr-1.5" />}
                                                                        {outcome.status.charAt(0).toUpperCase() + outcome.status.slice(1)}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                                    <div className="flex items-center justify-end space-x-2">
                                                                        {outcome.status === 'pending' && (
                                                                            <Link
                                                                                href={route('customer.accounts.outcomes.approve', {account: account.id, outcome: outcome.id})}
                                                                                method="post"
                                                                                as="button"
                                                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-sm hover:shadow-md transition-all duration-200"
                                                                            >
                                                                                <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                                                                                {t('Approve')}
                                                                            </Link>
                                                                        )}
                                                                        <a
                                                                            href={route('thermal.print.outcome', outcome.id)}
                                                                            target="_blank"
                                                                            className="inline-flex items-center px-2 py-1.5 border border-slate-300 text-xs font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 shadow-sm hover:shadow-md transition-all duration-200"
                                                                        >
                                                                            <Printer className="w-3.5 h-3.5 text-red-500" />
                                                                        </a>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500">
                                                            <div className="flex flex-col items-center">
                                                                <div className="bg-slate-50 p-6 rounded-full mb-4">
                                                                    <ReceiptText className="h-14 w-14 text-slate-400" />
                                                                </div>
                                                                <p className="text-base font-medium text-slate-600 mb-1">{t('No rent or loan transactions found')}</p>
                                                                <p className="text-sm text-slate-500 mb-4">{t('Add your first rental or loan payment')}</p>
                                                                <button
                                                                    onClick={() => setShowCreateOutcomeModal(true)}
                                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-pink-600 shadow-sm hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                                                                >
                                                                    <Plus className="w-4 h-4 mr-2" />
                                                                    {t('Add Rent/Loan')}
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
                                        <div className="px-6 py-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-red-50/30">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                <div className="mb-4 sm:mb-0">
                                                    <p className="text-sm text-slate-700">
                                                        {t('Showing')} <span className="font-semibold">{outcomes.from}</span> {t('to')} <span className="font-semibold">{outcomes.to}</span> {t('of')} <span className="font-semibold">{outcomes.total}</span> {t('results')}
                                                    </p>
                                                </div>
                                                <nav className="relative z-0 inline-flex justify-center rounded-md shadow-sm -space-x-px">
                                                    <Link
                                                        href={outcomes.prev_page_url}
                                                        className={`relative inline-flex items-center px-4 py-2 rounded-l-lg border ${!outcomes.prev_page_url ? 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed' : 'border-slate-300 bg-white text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors'}`}
                                                        disabled={!outcomes.prev_page_url}
                                                    >
                                                        <ChevronLeft className="h-4 w-4" />
                                                    </Link>

                                                    {outcomes.links && outcomes.links.slice(1, -1).map((link, index) => (
                                                        <Link
                                                            key={index}
                                                            href={link.url}
                                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                link.active
                                                                    ? 'z-10 bg-red-50 border-red-500 text-red-600 font-semibold'
                                                                    : 'bg-white border-slate-300 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors'
                                                            }`}
                                                        >
                                                            {link.label.replace('&laquo;', '').replace('&raquo;', '')}
                                                        </Link>
                                                    ))}

                                                    <Link
                                                        href={outcomes.next_page_url}
                                                        className={`relative inline-flex items-center px-4 py-2 rounded-r-lg border ${!outcomes.next_page_url ? 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed' : 'border-slate-300 bg-white text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors'}`}
                                                        disabled={!outcomes.next_page_url}
                                                    >
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Link>
                                                </nav>
                                            </div>
                                        </div>
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

                                <div className="mt-8 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateIncomeModal(false)}
                                        className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200"
                                    >
                                        {t('Cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-200"
                                    >
                                        {processing ? (
                                            <div className="flex items-center justify-center">
                                                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                                {t('Creating...')}
                                            </div>
                                        ) : (
                                            t('Create Income')
                                        )}
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

                                <div className="mt-8 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateOutcomeModal(false)}
                                        className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200"
                                    >
                                        {t('Cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={outcomeForm.processing}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 disabled:opacity-50 transition-all duration-200"
                                    >
                                        {outcomeForm.processing ? (
                                            <div className="flex items-center justify-center">
                                                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                                {t('Creating...')}
                                            </div>
                                        ) : (
                                            t('Create Payment')
                                        )}
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
