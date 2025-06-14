import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";
import {
    Search,
    Plus,
    Users,
    TrendingUp,
    TrendingDown,
    Eye,
    Edit,
    Trash2,
    Filter,
    X,
    CheckCircle,
    XCircle,
    Clock,
    DollarSign,
    Building2,
    CreditCard
} from 'lucide-react';

export default function Index({ accounts, customers, filters, auth }) {
    const { t } = useLaravelReactI18n();
    const [search, setSearch] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedCustomer, setSelectedCustomer] = useState(filters.customer_id || '');
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [isAnimated, setIsAnimated] = useState(false);

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimated(true);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    const handleSearch = () => {
        setLoading(true);
        router.get(route('admin.accounts.index'), {
            search,
            status: selectedStatus,
            customer_id: selectedCustomer,
        }, {
            preserveState: true,
            onFinish: () => setLoading(false),
        });
    };

    const handleReset = () => {
        setSearch('');
        setSelectedStatus('');
        setSelectedCustomer('');
        setLoading(true);
        router.get(route('admin.accounts.index'), {}, {
            preserveState: true,
            onFinish: () => setLoading(false),
        });
    };

    const handleDelete = (account) => {
        if (confirm('Are you sure you want to delete this account?')) {
            router.delete(route('admin.accounts.destroy', account.id));
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AFN',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            active: 'bg-green-100 text-green-800',
            suspended: 'bg-red-100 text-red-800',
            closed: 'bg-gray-100 text-gray-800',
        };

        const icons = {
            pending: <Clock className="w-3 h-3 mr-1" />,
            active: <CheckCircle className="w-3 h-3 mr-1" />,
            suspended: <XCircle className="w-3 h-3 mr-1" />,
            closed: <XCircle className="w-3 h-3 mr-1" />,
        };

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
                {icons[status]}
                {status?.charAt(0).toUpperCase() + status?.slice(1)}
            </span>
        );
    };

    const getBalanceColor = (balance) => {
        if (balance > 0) return 'text-green-600';
        if (balance < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search) {
                handleSearch();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    return (
        <>
            <Head title={t("Account Management")}>
                <style>{`
                    @keyframes shimmer {
                        0% { background-position: -1000px 0; }
                        100% { background-position: 1000px 0; }
                    }

                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }

                    .shimmer {
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                        background-size: 1000px 100%;
                        animation: shimmer 2s infinite;
                    }

                    .float-animation {
                        animation: float 6s ease-in-out infinite;
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
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.accounts" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="glass-effect border-b border-white/20 dark:border-slate-700/50 py-6 px-8 sticky top-0 z-30"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative float-animation"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 p-4 rounded-2xl shadow-2xl">
                                        <CreditCard className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1"
                                    >
                                        {t("Financial Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent"
                                    >
                                        {t("Account Management")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400"
                                    >
                                        {t("Manage customer accounts and their financial transactions")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Link
                                    href={route('admin.accounts.create')}
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    {t("Add Account")}
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="max-w-7xl mx-auto space-y-8"
                            >
                                {/* Stats Cards */}
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.9, duration: 0.4 }}
                                    className="grid grid-cols-1 md:grid-cols-4 gap-6"
                                >
                                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-xl shadow-xl border border-white/20 dark:border-slate-700/50">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <CreditCard className="h-8 w-8 text-blue-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-500">{t("Total Accounts")}</p>
                                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{accounts.length}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-xl shadow-xl border border-white/20 dark:border-slate-700/50">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <CheckCircle className="h-8 w-8 text-green-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-500">{t("Active Accounts")}</p>
                                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                                    {accounts.filter(acc => acc.status === 'active').length}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-xl shadow-xl border border-white/20 dark:border-slate-700/50">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <TrendingUp className="h-8 w-8 text-green-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-500">{t("Total Income")}</p>
                                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                                    {formatCurrency(accounts.reduce((sum, acc) => sum + (acc.total_income || 0), 0))}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-xl shadow-xl border border-white/20 dark:border-slate-700/50">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <TrendingDown className="h-8 w-8 text-red-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-500">{t("Total Outcome")}</p>
                                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                                    {formatCurrency(accounts.reduce((sum, acc) => sum + (acc.total_outcome || 0), 0))}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Search and Filters */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.0, duration: 0.4 }}
                                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-xl shadow-xl border border-white/20 dark:border-slate-700/50"
                                >
                                    <div className="space-y-4">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="flex-1">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <input
                                                        type="text"
                                                        placeholder={t("Search accounts...")}
                                                        value={search}
                                                        onChange={(e) => setSearch(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setShowFilters(!showFilters)}
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                            >
                                                <Filter className="w-4 h-4 mr-2" />
                                                {t("Filters")}
                                            </button>
                                        </div>

                                        {showFilters && (
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("Status")}</label>
                                                    <select
                                                        value={selectedStatus}
                                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        <option value="">{t("All Statuses")}</option>
                                                        <option value="pending">{t("Pending")}</option>
                                                        <option value="active">{t("Active")}</option>
                                                        <option value="suspended">{t("Suspended")}</option>
                                                        <option value="closed">{t("Closed")}</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("Customer")}</label>
                                                    <select
                                                        value={selectedCustomer}
                                                        onChange={(e) => setSelectedCustomer(e.target.value)}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        <option value="">{t("All Customers")}</option>
                                                        {customers.map(customer => (
                                                            <option key={customer.id} value={customer.id}>
                                                                {customer.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="flex items-end gap-2">
                                                    <button
                                                        onClick={handleSearch}
                                                        disabled={loading}
                                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                                    >
                                                        {loading ? t('Searching...') : t('Apply')}
                                                    </button>
                                                    <button
                                                        onClick={handleReset}
                                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Accounts Table */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.1, duration: 0.4 }}
                                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 dark:border-slate-700/50 overflow-hidden"
                                >
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-800">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Account")}</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Customer")}</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Status")}</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Income")}</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Outcome")}</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Net Balance")}</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Actions")}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                                {accounts.length > 0 ? (
                                                    accounts.map((account) => (
                                                        <tr key={account.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{account.name}</div>
                                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                        ID: {account.id_number} | Acc: {account.account_number}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                                                                    <span className="text-sm text-gray-900 dark:text-white">{account.customer.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                {getStatusBadge(account.status)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                                                                <span className="font-bold text-green-600">
                                                                    {formatCurrency(account.total_income)}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                                                                <span className="font-bold text-red-600">
                                                                    {formatCurrency(account.total_outcome)}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`font-bold ${account.net_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                    {formatCurrency(account.net_balance)}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                <div className="flex items-center space-x-2">
                                                                    <Link
                                                                        href={route('admin.accounts.show', account.id)}
                                                                        className="text-blue-600 hover:text-blue-900"
                                                                        title={t("View Details")}
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                    </Link>
                                                                    <Link
                                                                        href={route('admin.accounts.edit', account.id)}
                                                                        className="text-green-600 hover:text-green-900"
                                                                        title={t("Edit")}
                                                                    >
                                                                        <Edit className="w-4 h-4" />
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => handleDelete(account)}
                                                                        className="text-red-600 hover:text-red-900"
                                                                        title={t("Delete")}
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="7" className="px-6 py-12 text-center">
                                                            <div className="flex flex-col items-center">
                                                                <CreditCard className="w-12 h-12 text-gray-300 mb-4" />
                                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t("No accounts found")}</h3>
                                                                <p className="text-gray-500 dark:text-gray-400">{t("Get started by creating a new account.")}</p>
                                                                <Link
                                                                    href={route('admin.accounts.create')}
                                                                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                                                                >
                                                                    <Plus className="w-4 h-4 mr-2" />
                                                                    {t("Add Account")}
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
}
