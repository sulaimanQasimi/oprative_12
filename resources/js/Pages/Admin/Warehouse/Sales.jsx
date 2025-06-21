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
                                    linear-gradient(45deg, #22c55e, #16a34a) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #22c55e, #16a34a) border-box;
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
                                <Button variant="outline" className="gap-2 hover:scale-105 transition-all duration-200 border-green-200 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20">
                                    <Download className="h-4 w-4" />
                                    {t("Export")}
                                </Button>
                                <Link href={route("admin.warehouses.show", warehouse.id)}>
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-all duration-200">
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
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border hover:scale-105 transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Total Sales")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-green-600">
                                                            {totalSales}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {t("Orders")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl">
                                                        <Store className="h-8 w-8 text-green-600" />
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
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border hover:scale-105 transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Total Items")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-blue-600">
                                                            {totalItems.toLocaleString()}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {t("Products sold")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl">
                                                        <Package className="h-8 w-8 text-blue-600" />
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
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border hover:scale-105 transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Total Revenue")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-purple-600">
                                                            {formatCurrency(totalAmount)}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {t("Sales value")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl">
                                                        <DollarSign className="h-8 w-8 text-purple-600" />
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
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border hover:scale-105 transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Average Sale")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-orange-600">
                                                            {formatCurrency(avgSaleValue)}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {t("Per order")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-2xl">
                                                        <TrendingUp className="h-8 w-8 text-orange-600" />
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
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
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
                                                    <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            {/* Search Bar */}
                                            <div className="mb-4">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                    <Input
                                                        placeholder={t("Search by reference, customer, or product...")}
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
                                            <AnimatePresence>
                                                {showFilters && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                                            <div>
                                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                    {t("Date Filter")}
                                                                </label>
                                                                <Input
                                                                    type="date"
                                                                    value={dateFilter}
                                                                    onChange={(e) => setDateFilter(e.target.value)}
                                                                    className="h-10"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                    {t("Status")}
                                                                </label>
                                                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                                                    <SelectTrigger className="h-10">
                                                                        <SelectValue placeholder={t("All Statuses")} />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="">{t("All Statuses")}</SelectItem>
                                                                        <SelectItem value="pending">{t("Pending")}</SelectItem>
                                                                        <SelectItem value="completed">{t("Completed")}</SelectItem>
                                                                        <SelectItem value="cancelled">{t("Cancelled")}</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
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
                                                                        <SelectItem value="reference">{t("Reference")}</SelectItem>
                                                                        <SelectItem value="customer.name">{t("Customer")}</SelectItem>
                                                                        <SelectItem value="total_amount">{t("Total Amount")}</SelectItem>
                                                                        <SelectItem value="status">{t("Status")}</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                    {t("Sort Order")}
                                                                </label>
                                                                <Select value={sortOrder} onValueChange={setSortOrder}>
                                                                    <SelectTrigger className="h-10">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="desc">{t("Descending")}</SelectItem>
                                                                        <SelectItem value="asc">{t("Ascending")}</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className="flex items-end">
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={clearFilters}
                                                                    className="w-full h-10 gap-2"
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

                                {/* Sales Table */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.4, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                                    <BarChart3 className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Sales Records")}
                                                <Badge variant="secondary" className="ml-auto">
                                                    {filteredSales.length} {t("of")} {sales.length}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Reference")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Customer")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Items")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Total Amount")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Status")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Confirmations")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Date")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Actions")}
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {filteredSales.length > 0 ? (
                                                            filteredSales.map((sale, index) => (
                                                                <TableRow
                                                                    key={sale.id}
                                                                    className="hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors"
                                                                >
                                                                    <TableCell>
                                                                        <span className="font-mono text-sm bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg">
                                                                            {sale.reference}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg">
                                                                                <User className="h-4 w-4 text-blue-600" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-semibold text-slate-800 dark:text-white">{sale.customer?.name || 'N/A'}</p>
                                                                                <p className="text-sm text-slate-500">{sale.customer?.email || ''}</p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex flex-col gap-1">
                                                                            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 w-fit">
                                                                                {sale.sale_items?.length || 0} {t('items')}
                                                                            </Badge>
                                                                            {sale.sale_items && sale.sale_items.length > 0 && (
                                                                                <span className="text-xs text-slate-500">
                                                                                    {sale.sale_items[0].product?.name}
                                                                                    {sale.sale_items.length > 1 && ` +${sale.sale_items.length - 1} more`}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="font-bold text-green-600">
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
                                                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                                                ) : (
                                                                                    <Clock className="h-4 w-4 text-yellow-600" />
                                                                                )}
                                                                                <span className="text-xs">{t('Warehouse')}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-1">
                                                                                {sale.confirmed_by_shop ? (
                                                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                                                ) : (
                                                                                    <Clock className="h-4 w-4 text-yellow-600" />
                                                                                )}
                                                                                <span className="text-xs">{t('Shop')}</span>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                                                                        <div className="flex items-center gap-2">
                                                                            <Calendar className="h-4 w-4" />
                                                                            {formatDate(sale.date)}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <Link href={route("admin.warehouses.sales.show", [warehouse.id, sale.id])}>
                                                                                <Button size="sm" variant="outline" className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300">
                                                                                    <Eye className="h-4 w-4 text-blue-600" />
                                                                                </Button>
                                                                            </Link>
                                                                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 hover:bg-green-50 hover:border-green-300">
                                                                                <Edit className="h-4 w-4 text-green-600" />
                                                                            </Button>
                                                                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-300">
                                                                                <Trash2 className="h-4 w-4 text-red-600" />
                                                                            </Button>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan="8" className="h-32 text-center">
                                                                    <div className="flex flex-col items-center gap-4">
                                                                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                                            <Store className="h-8 w-8 text-slate-400" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                                                                {t("No sales found")}
                                                                            </p>
                                                                            <p className="text-sm text-slate-500">
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