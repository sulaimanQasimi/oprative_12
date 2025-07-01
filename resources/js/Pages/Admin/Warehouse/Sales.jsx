import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    Store,
    Package,
    TrendingUp,
    DollarSign,
    Calendar,
    Search,
    Eye,
    Edit,
    Trash2,
    Plus,
    Filter,
    Download,
    RefreshCw,
    BarChart3,
    Sparkles,
    ChevronDown,
    X,
    User,
    CheckCircle,
    Clock
} from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Sales({ auth, warehouse, sales }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");
    const [showFilters, setShowFilters] = useState(false);
    const [filteredSales, setFilteredSales] = useState(sales || []);

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Enhanced filtering logic
    useEffect(() => {
        let filtered = [...sales];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(sale =>
                sale.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sale.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sale.customer?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sale.sale_items?.some(item => 
                    item.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.product?.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        // Date filter
        if (dateFilter) {
            const filterDate = new Date(dateFilter);
            filtered = filtered.filter(sale => {
                const saleDate = new Date(sale.date);
                return saleDate.toDateString() === filterDate.toDateString();
            });
        }

        // Status filter
        if (statusFilter) {
            filtered = filtered.filter(sale => sale.status === statusFilter);
        }

        // Sorting
        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'customer.name') {
                aValue = a.customer?.name || '';
                bValue = b.customer?.name || '';
            }

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredSales(filtered);
    }, [searchTerm, dateFilter, statusFilter, sortBy, sortOrder, sales]);

    // Calculate totals
    const totalSales = filteredSales.length;
    const totalAmount = filteredSales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
    const totalItems = filteredSales.reduce((sum, sale) => sum + (sale.sale_items?.length || 0), 0);
    const avgSaleValue = totalSales > 0 ? totalAmount / totalSales : 0;

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

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
        }
    };

    const clearFilters = () => {
        setSearchTerm("");
        setDateFilter("");
        setStatusFilter("");
        setSortBy("created_at");
        setSortOrder("desc");
    };

    return (
        <>
            <Head title={`${warehouse?.name} - ${t("Sales")}`}>
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
                                    linear-gradient(45deg, #22c55e, #16a34a) border-box;
                        border: 1px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(15 23 42), rgb(15 23 42)) padding-box,
                                    linear-gradient(45deg, #22c55e, #16a34a) border-box;
                    }

                    .stat-card {
                        background: rgba(255, 255, 255, 0.98);
                        backdrop-filter: blur(16px);
                        border: 1px solid rgba(226, 232, 240, 0.8);
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                    }

                    .dark .stat-card {
                        background: rgba(15, 23, 42, 0.98);
                        backdrop-filter: blur(16px);
                        border: 1px solid rgba(51, 65, 85, 0.8);
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
                    }

                    .content-card {
                        background: rgba(255, 255, 255, 0.98);
                        backdrop-filter: blur(16px);
                        border: 1px solid rgba(226, 232, 240, 0.8);
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                    }

                    .dark .content-card {
                        background: rgba(15, 23, 42, 0.98);
                        backdrop-filter: blur(16px);
                        border: 1px solid rgba(51, 65, 85, 0.8);
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
                    }

                    /* Dark mode fixes for cards */
                    .dark .bg-white {
                        background-color: rgb(15 23 42) !important;
                    }

                    .dark .bg-white\/50 {
                        background-color: rgba(15, 23, 42, 0.5) !important;
                    }

                    .dark .bg-white\/80 {
                        background-color: rgba(15, 23, 42, 0.8) !important;
                    }

                    .dark .border-white\/20 {
                        border-color: rgba(255, 255, 255, 0.2) !important;
                    }

                    .dark .border-white\/30 {
                        border-color: rgba(255, 255, 255, 0.3) !important;
                    }

                    .dark .text-slate-800 {
                        color: rgb(248 250 252) !important;
                    }

                    .dark .text-slate-700 {
                        color: rgb(203 213 225) !important;
                    }

                    .dark .text-slate-600 {
                        color: rgb(148 163 184) !important;
                    }

                    .dark .text-slate-500 {
                        color: rgb(100 116 139) !important;
                    }

                    .dark .text-slate-400 {
                        color: rgb(148 163 184) !important;
                    }

                    .dark .border-slate-200 {
                        border-color: rgb(51 65 85) !important;
                    }

                    .dark .border-slate-700 {
                        border-color: rgb(71 85 105) !important;
                    }

                    .dark .bg-slate-50 {
                        background-color: rgb(30 41 59) !important;
                    }

                    .dark .bg-slate-100 {
                        background-color: rgb(30 41 59) !important;
                    }

                    .dark .bg-slate-800 {
                        background-color: rgb(30 41 59) !important;
                    }

                    .dark .bg-slate-800\/80 {
                        background-color: rgba(30, 41, 59, 0.8) !important;
                    }

                    .dark .hover\:bg-green-50:hover {
                        background-color: rgb(30 41 59) !important;
                    }

                    .dark .hover\:bg-green-900\/20:hover {
                        background-color: rgba(30, 41, 59, 0.8) !important;
                    }

                    .dark .hover\:bg-green-900\/10:hover {
                        background-color: rgba(30, 41, 59, 0.6) !important;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={Store} color="green" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.warehouses" />

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
                                    <div className="absolute -inset-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 p-4 rounded-2xl shadow-2xl">
                                        <Store className="w-8 h-8 text-white" />
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
                                        {warehouse?.name} - {t("Sales Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent"
                                    >
                                        {t("Sales")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        {t("Track and manage warehouse sales")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Button variant="outline" className="gap-2 hover:scale-105 transition-all duration-200 border-slate-300 dark:border-slate-600 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 text-slate-700 dark:text-slate-200 hover:text-green-700 dark:hover:text-green-300">
                                    <Download className="h-4 w-4" />
                                    {t("Export")}
                                </Button>
                                <Link href={route("admin.warehouses.show", warehouse.id)}>
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-all duration-200 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Warehouse")}
                                    </Button>
                                </Link>
                                <Link href={route("admin.warehouses.sales.create", warehouse.id)}>
                                    <Button className="gap-2 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 text-white hover:scale-105 transition-all duration-200 shadow-lg">
                                        <Plus className="h-4 w-4" />
                                        {t("Create Sale")}
                                    </Button>
                                </Link>
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
                                {/* Enhanced Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.4 }}
                                    >
                                        <Card className="border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-slate-800 hover:shadow-xl transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                            {t("Total Sales")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                                            {totalSales}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            {t("Orders")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl shadow-lg">
                                                        <Store className="h-8 w-8 text-green-600 dark:text-green-400" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.0, duration: 0.4 }}
                                    >
                                        <Card className="border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-slate-800 hover:shadow-xl transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                            {t("Total Items")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                                            {totalItems.toLocaleString()}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            {t("Products sold")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl shadow-lg">
                                                        <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.1, duration: 0.4 }}
                                    >
                                        <Card className="border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-slate-800 hover:shadow-xl transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                            {t("Total Revenue")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                                            {formatCurrency(totalAmount)}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            {t("Sales value")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl shadow-lg">
                                                        <DollarSign className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.2, duration: 0.4 }}
                                    >
                                        <Card className="border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-slate-800 hover:shadow-xl transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                            {t("Average Sale")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                                                            {formatCurrency(avgSaleValue)}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            {t("Per order")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-2xl shadow-lg">
                                                        <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>

                                {/* Enhanced Search & Filter Card */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.3, duration: 0.4 }}
                                >
                                    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-slate-800">
                                        <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/50">
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
                                                    className="gap-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
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
                                                        placeholder={t("Search by reference, customer, or product...")}
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="pl-12 h-12 text-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 rounded-lg w-full bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
                                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                            <div className="relative">
                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                    {t("Date Filter")}
                                                                </label>
                                                                <Input
                                                                    type="date"
                                                                    value={dateFilter}
                                                                    onChange={(e) => setDateFilter(e.target.value)}
                                                                    className="h-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                                                                />
                                                            </div>

                                                            <div className="relative z-50">
                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                    {t("Status")}
                                                                </label>
                                                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                                                    <SelectTrigger className="h-10 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white">
                                                                        <SelectValue placeholder={t("All Statuses")} />
                                                                    </SelectTrigger>
                                                                    <SelectContent position="popper" sideOffset={5} className="z-[9999] bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                                                                        <SelectItem value="" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                            {t("All Statuses")}
                                                                        </SelectItem>
                                                                        <SelectItem value="pending" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                            {t("Pending")}
                                                                        </SelectItem>
                                                                        <SelectItem value="completed" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                            {t("Completed")}
                                                                        </SelectItem>
                                                                        <SelectItem value="cancelled" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                            {t("Cancelled")}
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className="relative z-50">
                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                    {t("Sort By")}
                                                                </label>
                                                                <Select value={sortBy} onValueChange={setSortBy}>
                                                                    <SelectTrigger className="h-10 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent position="popper" sideOffset={5} className="z-[9999] bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                                                                        <SelectItem value="created_at" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                            {t("Date Created")}
                                                                        </SelectItem>
                                                                        <SelectItem value="reference" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                            {t("Reference")}
                                                                        </SelectItem>
                                                                        <SelectItem value="customer.name" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                            {t("Customer")}
                                                                        </SelectItem>
                                                                        <SelectItem value="total_amount" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                            {t("Total Amount")}
                                                                        </SelectItem>
                                                                        <SelectItem value="status" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                            {t("Status")}
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className="relative z-50">
                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                    {t("Sort Order")}
                                                                </label>
                                                                <Select value={sortOrder} onValueChange={setSortOrder}>
                                                                    <SelectTrigger className="h-10 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent position="popper" sideOffset={5} className="z-[9999] bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                                                                        <SelectItem value="desc" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                            {t("Descending")}
                                                                        </SelectItem>
                                                                        <SelectItem value="asc" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                            {t("Ascending")}
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className="flex items-end">
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={clearFilters}
                                                                    className="w-full h-10 gap-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                                                                >
                                                                    <RefreshCw className="h-4 w-4" />
                                                                    {t("Clear Filters")}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Results Summary */}
                                            <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                                                <div>
                                                    {t("Showing")} <span className="font-medium">{filteredSales.length}</span> {t("of")} <span className="font-medium">{sales.length}</span> {t("sales")}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Enhanced Sales Table */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.4, duration: 0.4 }}
                                >
                                    <Card className="border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-slate-800">
                                        <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/50">
                                            <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                                                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                    <BarChart3 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                                </div>
                                                {t("Sales Records")}
                                                <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                    {filteredSales.length} {t("of")} {sales.length}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                                {t("Reference")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                                {t("Customer")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                                {t("Items")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                                {t("Total Amount")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                                {t("Status")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                                {t("Confirmations")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                                {t("Date")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                                {t("Actions")}
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody className="bg-white dark:bg-slate-800">
                                                        {filteredSales.length > 0 ? (
                                                            filteredSales.map((sale, index) => (
                                                                <TableRow
                                                                    key={sale.id}
                                                                    className={`hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors ${index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-gray-50 dark:bg-slate-700/50'}`}
                                                                >
                                                                    <TableCell>
                                                                        <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg text-gray-700 dark:text-gray-300">
                                                                            {sale.reference}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg">
                                                                                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-semibold text-gray-900 dark:text-white">{sale.customer?.name || 'N/A'}</p>
                                                                                <p className="text-sm text-gray-500 dark:text-gray-400">{sale.customer?.email || ''}</p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex flex-col gap-1">
                                                                            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 w-fit">
                                                                                {sale.sale_items?.length || 0} {t('items')}
                                                                            </Badge>
                                                                            {sale.sale_items && sale.sale_items.length > 0 && (
                                                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                                    {sale.sale_items[0].product?.name}
                                                                                    {sale.sale_items.length > 1 && ` +${sale.sale_items.length - 1} more`}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="font-bold text-green-600 dark:text-green-400">
                                                                        {formatCurrency(sale.total_amount)}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge className={getStatusBadgeClass(sale.status)}>
                                                                            {sale.status}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="flex items-center gap-1">
                                                                                {sale.confirmed_by_warehouse ? (
                                                                                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                                                ) : (
                                                                                    <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                                                                )}
                                                                                <span className="text-xs text-gray-600 dark:text-gray-400">{t('Warehouse')}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-1">
                                                                                {sale.confirmed_by_shop ? (
                                                                                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                                                ) : (
                                                                                    <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                                                                )}
                                                                                <span className="text-xs text-gray-600 dark:text-gray-400">{t('Shop')}</span>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                                                                        <div className="flex items-center gap-2">
                                                                            <Calendar className="h-4 w-4" />
                                                                            {formatDate(sale.date)}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <Link href={route("admin.warehouses.sales.show", [warehouse.id, sale.id])}>
                                                                                <Button size="sm" variant="outline" className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20 dark:hover:border-blue-400">
                                                                                    <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                                                </Button>
                                                                            </Link>
                                                                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-900/20 dark:hover:border-green-400">
                                                                                <Edit className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                                            </Button>
                                                                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20 dark:hover:border-red-400">
                                                                                <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                                            </Button>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan="8" className="h-32 text-center">
                                                                    <div className="flex flex-col items-center gap-4">
                                                                        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                                                                            <Store className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                                                                                {t("No sales found")}
                                                                            </p>
                                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                                {searchTerm || dateFilter || statusFilter ? t("Try adjusting your filters") : t("Create your first sale")}
                                                                            </p>
                                                                        </div>
                                                                        {!searchTerm && !dateFilter && !statusFilter && (
                                                                            <Link href={route("admin.warehouses.sales.create", warehouse.id)}>
                                                                                <Button className="gap-2">
                                                                                    <Plus className="h-4 w-4" />
                                                                                    {t("Create Sale")}
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
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
} 