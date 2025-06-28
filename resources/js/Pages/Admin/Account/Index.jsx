import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";
import {
    Search,
    Plus,
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
    CreditCard,
    Download,
    RefreshCw,
    BarChart3,
    Sparkles,
    ChevronDown,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

export default function Index({ accounts, customers, filters, auth, permissions }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedCustomer, setSelectedCustomer] = useState(filters.customer_id || '');
    const [showFilters, setShowFilters] = useState(false);

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const handleSearch = () => {
        setLoading(true);
        router.get(route('admin.accounts.index'), {
            search: searchTerm,
            status: selectedStatus,
            customer_id: selectedCustomer,
        }, {
            preserveState: true,
            onFinish: () => setLoading(false),
        });
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedStatus("");
        setSelectedCustomer("");
        setLoading(true);
        router.get(route('admin.accounts.index'), {}, {
            preserveState: true,
            onFinish: () => setLoading(false),
        });
    };

    const handleDelete = (account) => {
        if (confirm(t('Are you sure you want to delete this account?'))) {
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
            active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            suspended: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
            closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
        };

        const icons = {
            pending: <Clock className="w-3 h-3 mr-1" />,
            active: <CheckCircle className="w-3 h-3 mr-1" />,
            suspended: <XCircle className="w-3 h-3 mr-1" />,
            closed: <XCircle className="w-3 h-3 mr-1" />,
        };

        return (
            <Badge className={`${styles[status] || styles.pending} border-0`}>
                {icons[status]}
                {status?.charAt(0).toUpperCase() + status?.slice(1)}
            </Badge>
        );
    };

    // Calculate totals
    const accountsData = accounts.data || [];
    const totalAccounts = accounts.total || accountsData.length;
    const activeAccounts = accountsData.filter(acc => acc.status === 'active').length;
    const totalIncome = accountsData.reduce((sum, acc) => sum + (acc.total_income || 0), 0);
    const totalOutcome = accountsData.reduce((sum, acc) => sum + (acc.total_outcome || 0), 0);

    // Auto-search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== filters.search) {
                handleSearch();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

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

                    @keyframes pulse-glow {
                        0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
                        50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
                    }

                    .shimmer {
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                        background-size: 1000px 100%;
                        animation: shimmer 2s infinite;
                    }

                    .float-animation {
                        animation: float 6s ease-in-out infinite;
                    }

                    .pulse-glow {
                        animation: pulse-glow 2s ease-in-out infinite;
                    }

                    .glass-effect {
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(12px);
                        border: 1px solid rgba(226, 232, 240, 0.8);
                    }

                    .dark .glass-effect {
                        background: rgba(15, 23, 42, 0.95);
                        backdrop-filter: blur(12px);
                        border: 1px solid rgba(51, 65, 85, 0.8);
                    }

                    .gradient-border {
                        background: linear-gradient(white, white) padding-box,
                                    linear-gradient(45deg, #3b82f6, #1d4ed8) border-box;
                        border: 1px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(15 23 42), rgb(15 23 42)) padding-box,
                                    linear-gradient(45deg, #3b82f6, #1d4ed8) border-box;
                    }

                    /* Comprehensive dropdown positioning fixes */
                    [data-radix-popper-content-wrapper] {
                        z-index: 999999 !important;
                        position: absolute !important;
                        top: auto !important;
                        left: auto !important;
                        transform: none !important;
                    }

                    [data-radix-select-content] {
                        z-index: 999999 !important;
                        position: absolute !important;
                        top: auto !important;
                        left: auto !important;
                        transform: none !important;
                        max-height: 200px !important;
                        overflow-y: auto !important;
                    }

                    [role="listbox"] {
                        z-index: 999999 !important;
                        position: absolute !important;
                        top: auto !important;
                        left: auto !important;
                        transform: none !important;
                    }

                    /* Force proper positioning for all Radix components */
                    [data-radix-popper-content-wrapper],
                    [data-radix-select-content],
                    [role="listbox"],
                    [data-radix-select-viewport] {
                        position: absolute !important;
                        z-index: 999999 !important;
                        top: auto !important;
                        left: auto !important;
                        right: auto !important;
                        bottom: auto !important;
                        transform: none !important;
                    }

                    /* Ensure proper stacking context for containers */
                    .relative {
                        position: relative !important;
                        z-index: 1;
                    }

                    /* Specific fixes for Select components */
                    .select-container {
                        position: relative !important;
                        z-index: 50 !important;
                    }

                    /* Override any inline styles that might interfere */
                    [data-radix-popper-content-wrapper][style] {
                        position: absolute !important;
                        z-index: 999999 !important;
                        top: auto !important;
                        left: auto !important;
                        transform: none !important;
                    }

                    [data-radix-select-content][style] {
                        position: absolute !important;
                        z-index: 999999 !important;
                        top: auto !important;
                        left: auto !important;
                        transform: none !important;
                    }

                    /* Ensure dropdowns are visible */
                    [data-state="open"] {
                        z-index: 999999 !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                    }

                    /* Fix for any overflow issues */
                    .overflow-hidden {
                        overflow: visible !important;
                    }

                    /* Ensure proper background for dropdowns */
                    [data-radix-select-content] {
                        background: white !important;
                        border: 1px solid #e2e8f0 !important;
                        border-radius: 0.5rem !important;
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
                    }

                    .dark [data-radix-select-content] {
                        background: #1e293b !important;
                        border: 1px solid #475569 !important;
                        color: white !important;
                    }

                    /* Fix for SelectItem hover states */
                    [data-radix-select-item] {
                        cursor: pointer !important;
                        padding: 0.5rem 1rem !important;
                    }

                    [data-radix-select-item]:hover {
                        background: #f1f5f9 !important;
                    }

                    .dark [data-radix-select-item]:hover {
                        background: #334155 !important;
                    }

                    /* Ensure proper positioning context */
                    .card-content {
                        position: relative !important;
                        z-index: 1 !important;
                    }

                    /* Override any transform that might interfere */
                    [data-radix-popper-content-wrapper][style*="transform"] {
                        transform: none !important;
                    }

                    /* Additional z-index fixes for all possible dropdown elements */
                    [data-radix-portal] {
                        z-index: 999999 !important;
                    }

                    [data-radix-popper-content] {
                        z-index: 999999 !important;
                    }

                    /* Ensure the card doesn't interfere with dropdowns */
                    .card {
                        z-index: 1 !important;
                    }

                    /* Force highest z-index for any dropdown-related element */
                    [class*="select"],
                    [class*="dropdown"],
                    [class*="popover"],
                    [class*="menu"] {
                        z-index: 999999 !important;
                    }

                    /* Specific fix for the filters card */
                    .filters-card {
                        z-index: 1 !important;
                    }

                    /* Ensure proper stacking for the entire page */
                    body {
                        z-index: 0 !important;
                    }

                    /* Force dropdowns to be on top of everything */
                    [data-radix-popper-content-wrapper],
                    [data-radix-select-content],
                    [role="listbox"],
                    [data-radix-select-viewport],
                    [data-radix-portal],
                    [data-radix-popper-content] {
                        z-index: 999999 !important;
                        position: absolute !important;
                    }

                    /* Specific fixes for SelectItems and dropdown content */
                    [data-radix-select-item] {
                        z-index: 999999 !important;
                        position: relative !important;
                    }

                    [data-radix-select-viewport] {
                        z-index: 999999 !important;
                        position: relative !important;
                    }

                    /* Override table z-index to be lower */
                    .table,
                    [role="table"],
                    [data-radix-table] {
                        z-index: 1 !important;
                        position: relative !important;
                    }

                    /* Ensure table cells don't interfere */
                    [role="cell"],
                    [data-radix-table-cell] {
                        z-index: 1 !important;
                        position: relative !important;
                    }

                    /* Force all dropdown-related elements to be on top */
                    [data-radix-popper-content-wrapper] *,
                    [data-radix-select-content] *,
                    [role="listbox"] *,
                    [data-radix-select-viewport] *,
                    [data-radix-portal] *,
                    [data-radix-popper-content] * {
                        z-index: 999999 !important;
                    }

                    /* Specific override for any table-related elements */
                    .table-container,
                    .table-wrapper,
                    [class*="table"] {
                        z-index: 1 !important;
                    }

                    /* Ensure the main content area doesn't interfere */
                    .main-content,
                    .content-area {
                        z-index: 1 !important;
                    }

                    /* Force dropdowns to render above everything */
                    [data-radix-popper-content-wrapper],
                    [data-radix-select-content],
                    [role="listbox"],
                    [data-radix-select-viewport],
                    [data-radix-portal],
                    [data-radix-popper-content],
                    [data-radix-select-item],
                    [data-radix-select-viewport] * {
                        z-index: 999999 !important;
                        position: absolute !important;
                        top: auto !important;
                        left: auto !important;
                        right: auto !important;
                        bottom: auto !important;
                        transform: none !important;
                    }

                    /* Additional specificity for SelectContent */
                    div[data-radix-select-content] {
                        z-index: 999999 !important;
                        position: absolute !important;
                    }

                    /* Force all children of SelectContent to have high z-index */
                    div[data-radix-select-content] * {
                        z-index: 999999 !important;
                    }

                    /* Override any potential table overflow issues */
                    .overflow-x-auto,
                    .overflow-y-auto {
                        z-index: 1 !important;
                    }

                    /* Ensure the card containing the table has lower z-index */
                    .card {
                        z-index: 1 !important;
                        position: relative !important;
                    }

                    /* Force dropdowns to be rendered in a portal-like manner */
                    [data-radix-popper-content-wrapper],
                    [data-radix-select-content] {
                        z-index: 999999 !important;
                        position: fixed !important;
                        top: auto !important;
                        left: auto !important;
                        right: auto !important;
                        bottom: auto !important;
                    }

                    /* Specific fix for table card */
                    .table-card {
                        z-index: 1 !important;
                        position: relative !important;
                    }

                    .table-card * {
                        z-index: 1 !important;
                    }

                    /* Ensure table elements don't interfere with dropdowns */
                    .table-card .table,
                    .table-card [role="table"],
                    .table-card [data-radix-table] {
                        z-index: 1 !important;
                    }

                    .table-card [role="cell"],
                    .table-card [data-radix-table-cell] {
                        z-index: 1 !important;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={CreditCard} color="blue" />

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
                        className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 py-6 px-8 sticky top-0 z-30"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative"
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
                                        className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
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
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        {t("Manage customer accounts and financial transactions")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Button variant="outline" className="gap-2 hover:scale-105 transition-all duration-200 border-slate-200 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-600 dark:hover:border-blue-400 dark:hover:bg-blue-900/20">
                                    <Download className="h-4 w-4" />
                                    {t("Export")}
                                </Button>
                                {permissions?.create_account && (
                                    <Link href={route('admin.accounts.create')}>
                                        <Button className="gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white hover:scale-105 transition-all duration-200 shadow-lg">
                                            <Plus className="h-4 w-4" />
                                            {t("Add Account")}
                                        </Button>
                                    </Link>
                                )}
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
                                className="space-y-8"
                            >
                                {/* Enhanced Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.4 }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Total Accounts")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                                            {totalAccounts}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t("Customer accounts")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl shadow-lg">
                                                        <CreditCard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.0, duration: 0.4 }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Active Accounts")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                                            {activeAccounts}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t("Currently active")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl shadow-lg">
                                                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.1, duration: 0.4 }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Total Income")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                                            {formatCurrency(totalIncome)}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t("All accounts")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl shadow-lg">
                                                        <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.2, duration: 0.4 }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Total Outcome")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                                                            {formatCurrency(totalOutcome)}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t("All accounts")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-2xl shadow-lg">
                                                        <TrendingDown className="h-8 w-8 text-red-600 dark:text-red-400" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>

                                {/* Advanced Filters */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.3, duration: 0.4 }}
                                >
                                    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
                                        <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                                                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                        <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                                    </div>
                                                    {t("Search & Filter")}
                                                </CardTitle>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setShowFilters(!showFilters)}
                                                    className="gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                >
                                                    <Filter className="h-4 w-4" />
                                                    {showFilters ? t("Hide Filters") : t("Show Filters")}
                                                    <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            {/* Search Bar */}
                                            <div className="mb-4">
                                                <div className="relative w-full">
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                                    <Input
                                                        placeholder={t("Search by account name, number, ID, or customer...")}
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="pl-12 h-12 text-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 rounded-lg w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                                    />
                                                    {searchTerm && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setSearchTerm("")}
                                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Advanced Filters */}
                                            <AnimatePresence>
                                                {showFilters && (
                                                    <motion.div
                                                        initial={{
                                                            height: 0,
                                                            opacity: 0,
                                                        }}
                                                        animate={{
                                                            height: "auto",
                                                            opacity: 1,
                                                        }}
                                                        exit={{
                                                            height: 0,
                                                            opacity: 0,
                                                        }}
                                                        transition={{
                                                            duration: 0.3,
                                                        }}
                                                        className="relative"
                                                    >
                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                            <div className="relative z-50">
                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                    {t("Status")}
                                                                </label>
                                                                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                                                    <SelectTrigger className="h-10 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                                                                        <SelectValue>
                                                                            {selectedStatus === "" 
                                                                                ? t("All Statuses") 
                                                                                : selectedStatus === "pending" 
                                                                                ? t("Pending") 
                                                                                : selectedStatus === "active" 
                                                                                ? t("Active") 
                                                                                : selectedStatus === "suspended" 
                                                                                ? t("Suspended") 
                                                                                : selectedStatus === "closed" 
                                                                                ? t("Closed") 
                                                                                : t("Select status")}
                                                                        </SelectValue>
                                                                    </SelectTrigger>
                                                                    <SelectContent position="popper" sideOffset={5} className="z-[9999] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                                                                        <SelectItem value="" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                            {t("All Statuses")}
                                                                        </SelectItem>
                                                                        <SelectItem value="pending" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                            {t("Pending")}
                                                                        </SelectItem>
                                                                        <SelectItem value="active" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                            {t("Active")}
                                                                        </SelectItem>
                                                                        <SelectItem value="suspended" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                            {t("Suspended")}
                                                                        </SelectItem>
                                                                        <SelectItem value="closed" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                            {t("Closed")}
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className="relative z-50">
                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                    {t("Customer")}
                                                                </label>
                                                                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                                                                    <SelectTrigger className="h-10 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                                                                        <SelectValue>
                                                                            {selectedCustomer === "" 
                                                                                ? t("All Customers") 
                                                                                : customers.find(c => c.id.toString() === selectedCustomer)?.name || t("Select customer")}
                                                                        </SelectValue>
                                                                    </SelectTrigger>
                                                                    <SelectContent position="popper" sideOffset={5} className="z-[9999] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                                                                        <SelectItem value="" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                            {t("All Customers")}
                                                                        </SelectItem>
                                                                        {customers.map(customer => (
                                                                            <SelectItem 
                                                                                key={customer.id} 
                                                                                value={customer.id.toString()}
                                                                                className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                            >
                                                                                {customer.name}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className="flex items-end">
                                                                <Button
                                                                    onClick={handleSearch}
                                                                    disabled={loading}
                                                                    className="w-full h-10 gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                                                                >
                                                                    <Search className="h-4 w-4" />
                                                                    {loading ? t('Searching...') : t('Search')}
                                                                </Button>
                                                            </div>

                                                            <div className="flex items-end">
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={clearFilters}
                                                                    className="w-full h-10 gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                                >
                                                                    <RefreshCw className="h-4 w-4" />
                                                                    {t("Clear Filters")}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Accounts Table */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.4, duration: 0.4 }}
                                >
                                    <Card className="table-card border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/10 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-blue-500/20 border-b border-slate-200 dark:border-slate-700">
                                            <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
                                                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                                                    <BarChart3 className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Account Records")}
                                                <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                    {accountsData.length} {t("of")} {totalAccounts}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-slate-100 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Account")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Customer")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Status")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Income")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Outcome")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Net Balance")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Actions")}
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody className="bg-white dark:bg-slate-800">
                                                        {accountsData.length > 0 ? (
                                                            accountsData.map((account, index) => (
                                                                <TableRow
                                                                    key={account.id}
                                                                    className={`hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors ${index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-700/50'}`}
                                                                >
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg shadow-sm">
                                                                                <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-semibold text-slate-800 dark:text-white">{account.name}</p>
                                                                                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                                                    <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600">
                                                                                        ID: {account.id_number}
                                                                                    </Badge>
                                                                                    <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600">
                                                                                        Acc: {account.account_number}
                                                                                    </Badge>
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <Building2 className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                                                            <span className="font-medium text-slate-800 dark:text-white">{account.customer.name}</span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {getStatusBadge(account.status)}
                                                                    </TableCell>
                                                                    <TableCell className="font-bold text-green-600 dark:text-green-400">
                                                                        {formatCurrency(account.total_income)}
                                                                    </TableCell>
                                                                    <TableCell className="font-bold text-red-600 dark:text-red-400">
                                                                        {formatCurrency(account.total_outcome)}
                                                                    </TableCell>
                                                                    <TableCell className={`font-bold ${account.net_balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                                        {formatCurrency(account.net_balance)}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            {permissions?.view_account && (
                                                                                <Button size="sm" variant="outline" className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20 dark:hover:border-blue-400" asChild>
                                                                                    <Link href={route('admin.accounts.show', account.id)}>
                                                                                        <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                                                    </Link>
                                                                                </Button>
                                                                            )}
                                                                            {permissions?.update_account && (
                                                                                <Button size="sm" variant="outline" className="h-8 w-8 p-0 hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-900/20 dark:hover:border-green-400" asChild>
                                                                                    <Link href={route('admin.accounts.edit', account.id)}>
                                                                                        <Edit className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                                                    </Link>
                                                                                </Button>
                                                                            )}
                                                                            {permissions?.delete_account && (
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="outline"
                                                                                    className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20 dark:hover:border-red-400"
                                                                                    onClick={() => handleDelete(account)}
                                                                                >
                                                                                    <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                                                </Button>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan="7" className="h-32 text-center">
                                                                    <div className="flex flex-col items-center gap-4">
                                                                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                                            <CreditCard className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                                                                {t("No accounts found")}
                                                                            </p>
                                                                            <p className="text-sm text-slate-500 dark:text-slate-500">
                                                                                {searchTerm || selectedStatus || selectedCustomer ? t("Try adjusting your filters") : t("Create your first account")}
                                                                            </p>
                                                                        </div>
                                                                        {!searchTerm && !selectedStatus && !selectedCustomer && permissions?.create_account && (
                                                                            <Link href={route('admin.accounts.create')}>
                                                                                <Button className="gap-2">
                                                                                    <Plus className="h-4 w-4" />
                                                                                    {t("Add Account")}
                                                                                </Button>
                                                                            </Link>
                                                                        )}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Pagination */}
                                {accounts.links && accounts.links.length > 3 && (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.5, duration: 0.4 }}
                                        className="flex justify-center"
                                    >
                                        <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="text-sm text-slate-600 dark:text-slate-400">
                                                        {t("Showing")} {accounts.from} {t("to")} {accounts.to} {t("of")} {accounts.total} {t("accounts")}
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        {accounts.links.map((link, index) => {
                                                            if (link.url === null) {
                                                                return (
                                                                    <Button
                                                                        key={index}
                                                                        variant="outline"
                                                                        size="sm"
                                                                        disabled
                                                                        className="w-10 h-10 p-0 border-slate-200 dark:border-slate-600"
                                                                    >
                                                                        {link.label === '&laquo; Previous' ? <ChevronLeft className="h-4 w-4" /> :
                                                                         link.label === 'Next &raquo;' ? <ChevronRight className="h-4 w-4" /> :
                                                                         link.label}
                                                                    </Button>
                                                                );
                                                            }

                                                            return (
                                                                <Button
                                                                    key={index}
                                                                    variant={link.active ? "default" : "outline"}
                                                                    size="sm"
                                                                    className={`w-10 h-10 p-0 ${link.active ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border-slate-200 hover:border-blue-300 dark:border-slate-600 dark:hover:border-blue-400'}`}
                                                                    onClick={() => {
                                                                        setLoading(true);
                                                                        router.get(link.url, {}, {
                                                                            preserveState: true,
                                                                            onFinish: () => setLoading(false),
                                                                        });
                                                                    }}
                                                                >
                                                                    {link.label === '&laquo; Previous' ? <ChevronLeft className="h-4 w-4" /> :
                                                                     link.label === 'Next &raquo;' ? <ChevronRight className="h-4 w-4" /> :
                                                                     link.label}
                                                                </Button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
}
