import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    TrendingUp,
    ArrowLeft,
    Package,
    DollarSign,
    Calendar,
    Hash,
    FileText,
    Sparkles,
    Building2,
    User,
    Search,
    Filter,
    Download,
    RefreshCw,
    BarChart3,
    ChevronDown,
    X,
    Plus,
    ShoppingCart,
    Tag,
    Barcode,
    CheckCircle,
    XCircle,
    Star,
    AlertCircle,
    ArrowUpDown,
    Eye,
    Settings,
    ChevronRight,
    ChevronLeft,
    SkipBack,
    SkipForward,
    RotateCcw,
    XOctagon,
    Edit,
    Trash2,
    CircleDollarSign,
    Receipt
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";
import BackButton from "@/Components/BackButton";

export default function Income({ 
    auth, 
    customer, 
    incomes = {
        data: [],
        total: 0,
        from: 0,
        to: 0,
        current_page: 1,
        last_page: 1,
        links: [],
    },
    filters = {},
    permissions = {} 
}) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [dateFilter, setDateFilter] = useState(filters.date || "");
    const [sortBy, setSortBy] = useState(filters.sort_by || "created_at");
    const [sortOrder, setSortOrder] = useState(filters.sort_order || "desc");
    const [showFilters, setShowFilters] = useState(false);
    const [perPage, setPerPage] = useState(filters.per_page || 15);
    const [dateFrom, setDateFrom] = useState(filters.date_from || "");
    const [dateTo, setDateTo] = useState(filters.date_to || "");

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            handleFilter();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleFilter = () => {
        const params = {
            search: searchTerm,
            per_page: perPage,
            sort_by: sortBy,
            sort_order: sortOrder,
            date_from: dateFrom,
            date_to: dateTo,
        };
        Object.keys(params).forEach(key => {
            if (!params[key]) delete params[key];
        });
        router.get(route('admin.customers.income', customer.id), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSort = (column) => {
        const newDirection = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortBy(column);
        setSortOrder(newDirection);
        router.get(route('admin.customers.income', customer.id), {
            ...filters,
            sort_by: column,
            sort_order: newDirection,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page) => {
        router.get(route('admin.customers.income', customer.id), {
            ...filters,
            page: page,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm("");
        setDateFrom("");
        setDateTo("");
        setSortBy("created_at");
        setSortOrder("desc");
        setPerPage(15);
        router.get(route('admin.customers.income', customer.id), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getSortIcon = (column) => {
        if (sortBy !== column) return null;
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    // Calculate totals from paginated data
    const incomesData = incomes?.data || incomes || [];

    const getStatusBadge = (status) => {
        const statusConfig = {
            completed: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', label: t('Completed') },
            pending: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', label: t('Pending') },
            cancelled: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', label: t('Cancelled') },
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <Badge className={`${config.color} border-0`}>
                {config.label}
            </Badge>
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fa-IR', {
            style: 'currency',
            currency: 'IRR',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <Head title={`${t("Customer Income")} - ${customer.name}`}>
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
                        0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
                        50% { box-shadow: 0 0 30px rgba(34, 197, 94, 0.6); }
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
                        background: rgba(255, 255, 255, 0.1);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                    }

                    .dark .glass-effect {
                        background: rgba(0, 0, 0, 0.2);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    }

                    .gradient-border {
                        background: linear-gradient(white, white) padding-box,
                                    linear-gradient(45deg, #10b981, #059669) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #10b981, #059669) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={TrendingUp} color="green" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.customers" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-700/60 py-6 px-8 sticky top-0 z-30 shadow-sm dark:shadow-slate-900/20"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-2xl blur-lg opacity-60 dark:opacity-40"></div>
                                    <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 p-4 rounded-2xl shadow-2xl">
                                        <TrendingUp className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-green-600 dark:text-green-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {t("Income Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent"
                                    >
                                        {t("Income Records")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        {t("Track and manage customer income records")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <BackButton link={route("admin.customers.show", customer.id)} />
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-green-300 dark:scrollbar-thumb-green-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="space-y-8"
                            >
                                {/* Customer Info Card */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                >
                                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-3">
                                                <Building2 className="h-5 w-5 text-green-600" />
                                                {t("Customer Information")}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{t("Name")}</p>
                                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{customer.name}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{t("Email")}</p>
                                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{customer.email || t("Not provided")}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{t("Status")}</p>
                                                    {getStatusBadge(customer.status)}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Search */}
                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                    <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-700/50">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                                    <Filter className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Search & Filter")}
                                            </CardTitle>
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowFilters(!showFilters)}
                                                className="gap-2"
                                            >
                                                <Filter className="h-4 w-4" />
                                                {showFilters ? t("Hide Filters") : t("Show Filters")}
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        {/* Search Bar */}
                                        <div className="mb-4">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                <Input
                                                    placeholder={t("Search by reference or product...")}
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-12 h-12 text-lg border-2 border-green-200 focus:border-green-500 rounded-xl"
                                                />
                                                {searchTerm && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSearchTerm("")}
                                                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        {/* Advanced Filters */}
                                        {showFilters && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700"
                                            >
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        {t("Date From")}
                                                    </label>
                                                    <Input
                                                        type="date"
                                                        value={dateFrom}
                                                        onChange={(e) => setDateFrom(e.target.value)}
                                                        className="h-10"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        {t("Date To")}
                                                    </label>
                                                    <Input
                                                        type="date"
                                                        value={dateTo}
                                                        onChange={(e) => setDateTo(e.target.value)}
                                                        className="h-10"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        {t("Sort By")}
                                                    </label>
                                                    <Select value={sortBy} onValueChange={setSortBy}>
                                                        <SelectTrigger className="h-10">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="created_at">{t("Date Created")}</SelectItem>
                                                            <SelectItem value="reference_number">{t("Reference")}</SelectItem>
                                                            <SelectItem value="total">{t("Amount")}</SelectItem>
                                                            <SelectItem value="quantity">{t("Quantity")}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        {t("Per Page")}
                                                    </label>
                                                    <Select value={perPage.toString()} onValueChange={(value) => setPerPage(parseInt(value))}>
                                                        <SelectTrigger className="h-10">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="10">10</SelectItem>
                                                            <SelectItem value="15">15</SelectItem>
                                                            <SelectItem value="25">25</SelectItem>
                                                            <SelectItem value="50">50</SelectItem>
                                                            <SelectItem value="100">100</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="flex items-end gap-2">
                                                    <Button
                                                        onClick={handleFilter}
                                                        className="h-10 bg-green-600 hover:bg-green-700 text-white"
                                                    >
                                                        {t("Apply")}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={clearFilters}
                                                        className="h-10"
                                                    >
                                                        <RefreshCw className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Income Records Table */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.0, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-3">
                                                <BarChart3 className="h-5 w-5 text-green-600" />
                                                {t("Income Records")}
                                                <Badge variant="secondary">
                                                    {incomesData.length} {t("of")} {incomes.total}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            {incomesData.length > 0 ? (
                                                <div className="overflow-x-auto">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                    {t("Reference")}
                                                                </TableHead>
                                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                    {t("Product")}
                                                                </TableHead>
                                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center">
                                                                    {t("Batch")}
                                                                </TableHead>
                                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">
                                                                    {t("Quantity")}
                                                                </TableHead>
                                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">
                                                                    {t("Unit Type")}
                                                                </TableHead>
                                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">
                                                                    {t("Price")}
                                                                </TableHead>
                                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">
                                                                    {t("Total")}
                                                                </TableHead>
                                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center">
                                                                    {t("Notes")}
                                                                </TableHead>
                                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">
                                                                    {t("Date")}
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {incomesData.map((income, index) => (
                                                                <TableRow
                                                                    key={income.id}
                                                                    className="hover:bg-green-50 dark:hover:bg-green-900/10"
                                                                >
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md">
                                                                                <FileText className="h-5 w-5" />
                                                                            </div>
                                                                            <div>
                                                                                <div className="text-base font-medium text-slate-900 dark:text-white">
                                                                                    {income.reference_number}
                                                                                </div>
                                                                                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center">
                                                                                    <Calendar className="h-4 w-4 mr-1 text-slate-400" />
                                                                                    {formatDate(income.created_at)}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="text-sm text-slate-900 dark:text-white">
                                                                            {income.product?.name || 'N/A'}
                                                                        </div>
                                                                        {income.product?.barcode && (
                                                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                                                <Badge variant="outline" className="text-xs">
                                                                                    {income.product.barcode}
                                                                                </Badge>
                                                                            </div>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell className="text-center">
                                                                        {/* Batch cell */}
                                                                        {income.batch ? (
                                                                            <div className="flex flex-col items-center gap-1 min-w-0">
                                                                                <span className="font-medium text-slate-800 dark:text-white truncate" title={income.batch.reference_number}>
                                                                                    {income.batch.reference_number}
                                                                                </span>
                                                                                {income.batch.expire_date && (
                                                                                    <span className={`text-xs ${
                                                                                        income.batch.expiry_status === 'expired' ? 'text-red-500' :
                                                                                        income.batch.expiry_status === 'expiring_soon' ? 'text-orange-500' :
                                                                                        income.batch.expiry_status === 'valid' ? 'text-green-500' :
                                                                                        'text-slate-400'
                                                                                    }`}>
                                                                                        {formatDate(income.batch.expire_date)}
                                                                                        {income.batch.days_to_expiry !== null && (
                                                                                            <span className="ml-1">
                                                                                                ({income.batch.days_to_expiry > 0 ? '+' : ''}{income.batch.days_to_expiry} {t('days')})
                                                                                            </span>
                                                                                        )}
                                                                                    </span>
                                                                                )}
                                                                                {income.batch.expiry_status && (
                                                                                    <Badge 
                                                                                        variant="outline" 
                                                                                        className={`text-xs mt-1 ${
                                                                                            income.batch.expiry_status === 'expired' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800' :
                                                                                            income.batch.expiry_status === 'expiring_soon' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800' :
                                                                                            income.batch.expiry_status === 'valid' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800' :
                                                                                            'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
                                                                                        }`}
                                                                                    >
                                                                                        {income.batch.expiry_status === 'expired' ? t('Expired') :
                                                                                         income.batch.expiry_status === 'expiring_soon' ? t('Expiring Soon') :
                                                                                         income.batch.expiry_status === 'valid' ? t('Valid') :
                                                                                         t('No Expiry')}
                                                                                    </Badge>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-slate-400 dark:text-slate-500">-</span>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        <div className="flex flex-col gap-1">
                                                                            <div className="text-sm font-mono bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 py-1.5 px-3 rounded-md border border-blue-100 dark:border-blue-900 shadow-sm inline-flex items-center float-right">
                                                                                <Package className="h-4 w-4 mr-1.5 text-blue-500 dark:text-blue-400" />
                                                                                {income.is_wholesale 
                                                                                    ? `${((parseFloat(income.quantity) || 0) / (parseFloat(income.unit_amount) || 1)).toLocaleString()}`
                                                                                    : (parseFloat(income.quantity) || 0).toLocaleString()
                                                                                }
                                                                                {(income.unit_name || income.unit?.name) && (
                                                                                    <span className="ml-1 text-xs opacity-75">
                                                                                        {income.unit_name || income.unit?.name}
                                                                                        {income.unit?.symbol && ` (${income.unit.symbol})`}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            {income.is_wholesale && (
                                                                                <span className="text-xs text-slate-500 dark:text-slate-400 float-right">
                                                                                    ({(parseFloat(income.quantity) || 0).toLocaleString()} retail units total)
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        <div className={`text-sm font-mono py-1.5 px-3 rounded-md border shadow-sm inline-flex items-center float-right ${
                                                                            income.unit_type === 'wholesale' 
                                                                                ? "bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-100 dark:border-purple-900"
                                                                                : "bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-100 dark:border-blue-900"
                                                                        }`}>
                                                                            <Package className={`h-4 w-4 mr-1.5 ${
                                                                                income.unit_type === 'wholesale' 
                                                                                    ? "text-purple-500 dark:text-purple-400"
                                                                                    : "text-blue-500 dark:text-blue-400"
                                                                            }`} />
                                                                            {income.unit_type === 'wholesale' ? t('Wholesale') : t('Retail')}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        <div className="text-sm font-mono bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 py-1.5 px-3 rounded-md border border-purple-100 dark:border-purple-900 shadow-sm inline-flex items-center float-right">
                                                                            <DollarSign className="h-4 w-4 mr-1.5 text-purple-500 dark:text-purple-400" />
                                                                            {formatCurrency(income.price)}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        <div className="text-sm font-mono bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 py-1.5 px-3 rounded-md border border-green-100 dark:border-green-900 shadow-sm inline-flex items-center float-right">
                                                                            <DollarSign className="h-4 w-4 mr-1.5 text-green-500 dark:text-green-400" />
                                                                            {formatCurrency(income.total)}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-center">
                                                                        {income.notes ? (
                                                                            <div className="text-sm text-slate-700 dark:text-slate-300 bg-yellow-50 dark:bg-yellow-900/30 py-1.5 px-3 rounded-md border border-yellow-100 dark:border-yellow-900 shadow-sm inline-flex items-center max-w-xs">
                                                                                <FileText className="h-4 w-4 mr-1.5 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
                                                                                <span className="truncate" title={income.notes}>
                                                                                    {income.notes.length > 30 ? `${income.notes.substring(0, 30)}...` : income.notes}
                                                                                </span>
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-slate-400 dark:text-slate-600 text-sm italic">
                                                                                {t('No notes')}
                                                                            </span>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        <div className="text-sm text-slate-900 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 py-1.5 px-3 rounded-md inline-flex items-center float-right">
                                                                            <Calendar className="h-4 w-4 mr-1.5 text-slate-500 dark:text-slate-400" />
                                                                            {formatDate(income.created_at)}
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan="8" className="h-32 text-center">
                                                        <div className="flex flex-col items-center gap-4">
                                                            <TrendingUp className="h-8 w-8 text-slate-400" />
                                                            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                                                {t("No income records found")}
                                                            </p>
                                                            <p className="text-sm text-slate-500">
                                                                {searchTerm || dateFilter ? t("Try adjusting your filters") : t("This customer doesn't have any income records yet.")}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Pagination */}
                                {incomes?.links && incomes.links.length > 3 && (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.0, duration: 0.4 }}
                                        className="flex flex-col items-center space-y-4"
                                    >
                                        <div className="text-sm text-slate-600 dark:text-slate-400">
                                            {t("Showing")} {incomes.from} {t("to")} {incomes.to} {t("of")} {incomes.total} {t("results")}
                                        </div>
                                        <div className="flex items-center space-x-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-green-100 dark:border-green-900/30">
                                            {incomes.links.map((link, index) => {
                                                if (link.label.includes('Previous')) {
                                                    return (
                                                        <Link
                                                            key={index}
                                                            href={link.url || '#'}
                                                            className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                                                                link.url
                                                                    ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30'
                                                                    : 'text-gray-400 cursor-not-allowed'
                                                            }`}
                                                        >
                                                            <ChevronLeft className="h-4 w-4" />
                                                            <span className="ml-1 hidden sm:inline">{t('Previous')}</span>
                                                        </Link>
                                                    );
                                                }
                                                if (link.label.includes('Next')) {
                                                    return (
                                                        <Link
                                                            key={index}
                                                            href={link.url || '#'}
                                                            className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                                                                link.url
                                                                    ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30'
                                                                    : 'text-gray-400 cursor-not-allowed'
                                                            }`}
                                                        >
                                                            <span className="mr-1 hidden sm:inline">{t('Next')}</span>
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Link>
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
                                        </div>
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
