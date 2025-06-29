import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    TrendingDown,
    Package,
    DollarSign,
    Building2,
    Calendar,
    Search,
    Eye,
    Plus,
    Filter,
    Download,
    RefreshCw,
    BarChart3,
    Sparkles,
    ChevronDown,
    ChevronUp,
    X,
    Warehouse,
    CheckCircle,
    Clock,
    XCircle,
    ChevronLeft,
    ChevronRight,
    Users,
    FileText,
    ShoppingBag,
    User
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

export default function OutcomeIndex({ 
    auth, 
    outcomes, 
    warehouses = [], 
    products = [],
    filters = {}, 
    sort = {}, 
    stats = {},
    can = {} 
}) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [warehouseFilter, setWarehouseFilter] = useState(filters.warehouse_id || "");
    const [productFilter, setProductFilter] = useState(filters.product_id || "");
    const [dateFrom, setDateFrom] = useState(filters.date_from || "");
    const [dateTo, setDateTo] = useState(filters.date_to || "");
    const [minAmount, setMinAmount] = useState(filters.min_amount || "");
    const [maxAmount, setMaxAmount] = useState(filters.max_amount || "");
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");
    const [filteredOutcomes, setFilteredOutcomes] = useState(outcomes?.data || []);

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
        let filtered = [...(outcomes?.data || [])];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(outcome =>
                (outcome.reference_number && outcome.reference_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (outcome.warehouse?.name && outcome.warehouse.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (outcome.warehouse?.code && outcome.warehouse.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (outcome.product?.name && outcome.product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (outcome.product?.barcode && outcome.product.barcode.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Warehouse filter
        if (warehouseFilter) {
            filtered = filtered.filter(outcome => outcome.warehouse_id && outcome.warehouse_id.toString() === warehouseFilter);
        }

        // Product filter
        if (productFilter) {
            filtered = filtered.filter(outcome => outcome.product_id && outcome.product_id.toString() === productFilter);
        }

        // Date filter
        if (dateFrom) {
            const filterDate = new Date(dateFrom);
            filtered = filtered.filter(outcome => {
                const outcomeDate = new Date(outcome.created_at);
                return outcomeDate >= filterDate;
            });
        }

        if (dateTo) {
            const filterDate = new Date(dateTo);
            filtered = filtered.filter(outcome => {
                const outcomeDate = new Date(outcome.created_at);
                return outcomeDate <= filterDate;
            });
        }

        // Amount filters
        if (minAmount) {
            filtered = filtered.filter(outcome => (outcome.total || 0) >= parseFloat(minAmount));
        }

        if (maxAmount) {
            filtered = filtered.filter(outcome => (outcome.total || 0) <= parseFloat(maxAmount));
        }

        // Sorting
        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'warehouse.name') {
                aValue = a.warehouse?.name || '';
                bValue = b.warehouse?.name || '';
            } else if (sortBy === 'product.name') {
                aValue = a.product?.name || '';
                bValue = b.product?.name || '';
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

        setFilteredOutcomes(filtered);
    }, [searchTerm, warehouseFilter, productFilter, dateFrom, dateTo, minAmount, maxAmount, sortBy, sortOrder, outcomes]);

    // Calculate totals from filtered data
    const totalOutcomes = filteredOutcomes?.length || 0;
    const totalAmount = filteredOutcomes?.reduce((sum, outcome) => sum + (outcome.total || 0), 0) || 0;
    const totalQuantity = filteredOutcomes?.reduce((sum, outcome) => sum + (outcome.quantity || 0), 0) || 0;
    const avgOutcomeValue = totalOutcomes > 0 ? totalAmount / totalOutcomes : 0;

    const handleSearch = () => {
        router.get(route('admin.outcomes.index'), {
            search: searchTerm,
            warehouse_id: warehouseFilter,
            product_id: productFilter,
            date_from: dateFrom,
            date_to: dateTo,
            min_amount: minAmount,
            max_amount: maxAmount,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AFN',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    // Utility function to convert Gregorian to Jalali date
    const formatJalaliDate = (dateString) => {
        const date = new Date(dateString);
        
        // Convert to Jalali date using Persian calendar
        const jalaliDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(date);
        
        const time = date.toLocaleTimeString('fa-IR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        
        return `${jalaliDate} ${time}`;
    };

    const formatDate = (dateString) => {
        return formatJalaliDate(dateString);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setWarehouseFilter("");
        setProductFilter("");
        setDateFrom("");
        setDateTo("");
        setMinAmount("");
        setMaxAmount("");
        router.get(route('admin.outcomes.index'));
    };

    return (
        <>
            <Head title={t("Warehouse Outcome Management")}>
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
                        0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.3); }
                        50% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.6); }
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

                    .gradient-border {
                        background: linear-gradient(white, white) padding-box,
                                    linear-gradient(45deg, #ef4444, #dc2626) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #ef4444, #dc2626) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={TrendingDown} color="red" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.outcomes" />

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
                                    className="relative float-animation"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 rounded-2xl blur-lg opacity-60 dark:opacity-40"></div>
                                    <div className="relative bg-gradient-to-br from-red-500 via-orange-500 to-red-600 p-4 rounded-2xl shadow-2xl">
                                        <TrendingDown className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {t("Warehouse Outcome Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent"
                                    >
                                        {t("Warehouse Outcomes")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        {t("Track and manage warehouse outcome records")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Button 
                                    variant="outline" 
                                    className="gap-2 hover:scale-105 transition-all duration-200 border-slate-300 dark:border-slate-600 hover:border-red-400 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-700 dark:text-slate-200 hover:text-red-700 dark:hover:text-red-300"
                                >
                                    <Download className="h-4 w-4" />
                                    {t("Export")}
                                </Button>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-red-300 dark:scrollbar-thumb-red-700 scrollbar-track-transparent">
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
                                        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Total Outcome Records")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                                                            {stats.total_outcomes?.toLocaleString() || totalOutcomes.toLocaleString()}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t("Records")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl">
                                                        <TrendingDown className="h-8 w-8 text-red-600 dark:text-red-400" />
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
                                        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Total Quantity")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                                            {totalQuantity.toLocaleString()}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t("Items sent out")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
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
                                        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Total Value")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                                            {formatCurrency(stats.total_amount || totalAmount)}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t("Outcome value")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
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
                                        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Average Outcome")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                                                            {formatCurrency(avgOutcomeValue)}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t("Per record")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl">
                                                        <BarChart3 className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>

                                {/* Filter Button Component */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.3, duration: 0.4 }}
                                    className="flex justify-end"
                                >
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="gap-3 px-6 py-3 text-lg font-medium border-2 border-red-200 dark:border-red-700 hover:border-red-400 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 transition-all duration-200 hover:scale-105 shadow-lg"
                                    >
                                        <Filter className="h-5 w-5" />
                                        {showFilters ? t("Hide Filters") : t("Show Filters")}
                                        <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                                    </Button>
                                </motion.div>

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
                                            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                                <CardHeader className="bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 border-b border-white/30 dark:border-slate-700/50">
                                                    <CardTitle className="flex items-center gap-3">
                                                        <div className="p-2 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg">
                                                            <Filter className="h-5 w-5 text-white" />
                                                        </div>
                                                        {t("Search & Filter")}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-6">
                                                    {/* Search Bar */}
                                                    <div className="mb-4">
                                                        <div className="relative">
                                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                            <Input
                                                                placeholder={t("Search by reference, warehouse, or product...")}
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                                className="pl-12 h-12 text-lg border-2 border-red-200 focus:border-red-500 rounded-xl"
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
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                {t("Warehouse")}
                                                            </label>
                                                            <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                                                                <SelectTrigger className="h-10">
                                                                    <SelectValue placeholder={t("All Warehouses")} />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="">{t("All Warehouses")}</SelectItem>
                                                                    {warehouses.map((warehouse) => (
                                                                        <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                                                            {warehouse.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                {t("Product")}
                                                            </label>
                                                            <Select value={productFilter} onValueChange={setProductFilter}>
                                                                <SelectTrigger className="h-10">
                                                                    <SelectValue placeholder={t("All Products")} />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="">{t("All Products")}</SelectItem>
                                                                    {products.map((product) => (
                                                                        <SelectItem key={product.id} value={product.id.toString()}>
                                                                            {product.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                {t("Date From")}
                                                            </label>
                                                            <Input
                                                                type="date"
                                                                value={dateFrom}
                                                                onChange={(e) => setDateFrom(e.target.value)}
                                                                placeholder="YYYY/MM/DD"
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
                                                                placeholder="YYYY/MM/DD"
                                                                className="h-10"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Amount Filters */}
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                {t("Min Amount")}
                                                            </label>
                                                            <Input
                                                                type="number"
                                                                value={minAmount}
                                                                onChange={(e) => setMinAmount(e.target.value)}
                                                                placeholder="0"
                                                                className="h-10"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                {t("Max Amount")}
                                                            </label>
                                                            <Input
                                                                type="number"
                                                                value={maxAmount}
                                                                onChange={(e) => setMaxAmount(e.target.value)}
                                                                placeholder="999999"
                                                                className="h-10"
                                                            />
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

                                                    <div className="flex justify-end mt-6">
                                                        <Button 
                                                            onClick={handleSearch} 
                                                            className="gap-2 bg-gradient-to-r from-red-600 via-orange-600 to-red-700 hover:from-red-700 hover:via-orange-700 hover:to-red-800 text-white"
                                                        >
                                                            <Search className="h-4 w-4" />
                                                            {t("Apply Filters")}
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Outcome Table */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.4, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg">
                                                    <BarChart3 className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Outcome Records")}
                                                <Badge variant="secondary" className="ml-auto">
                                                    {filteredOutcomes?.length || 0} {t("of")} {outcomes?.total || 0}
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
                                                                {t("Warehouse")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Product")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Quantity")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Unit Price")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Total Amount")}
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
                                                        {filteredOutcomes?.length > 0 ? (
                                                            filteredOutcomes.map((outcome, index) => (
                                                                <TableRow
                                                                    key={outcome.id}
                                                                    className="hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                                                >
                                                                    <TableCell>
                                                                        <span className="font-mono text-sm bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg">
                                                                            {outcome.reference_number || `OUT-${outcome.id}`}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <Building2 className="h-4 w-4 text-purple-600" />
                                                                            <div>
                                                                                <div className="font-semibold text-slate-800 dark:text-white">{outcome.warehouse?.name || t('Unknown Warehouse')}</div>
                                                                                <div className="text-sm text-slate-500">{outcome.warehouse?.code}</div>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <ShoppingBag className="h-4 w-4 text-blue-600" />
                                                                            <div>
                                                                                <div className="font-semibold text-slate-800 dark:text-white">{outcome.product?.name || t('Unknown Product')}</div>
                                                                                <div className="text-sm text-slate-500">{outcome.product?.barcode}</div>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                                                            {outcome.quantity?.toLocaleString() || 0}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="font-medium text-slate-700 dark:text-slate-300">
                                                                        {formatCurrency(outcome.price)}
                                                                    </TableCell>
                                                                    <TableCell className="font-bold text-red-600">
                                                                        {formatCurrency(outcome.total)}
                                                                    </TableCell>
                                                                    <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                                                                        <div className="flex items-center gap-2">
                                                                            <Calendar className="h-4 w-4" />
                                                                            {formatDate(outcome.created_at)}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            {/* Actions can be added here if needed */}
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan="8" className="h-32 text-center">
                                                                    <div className="flex flex-col items-center gap-4">
                                                                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                                            <TrendingDown className="h-8 w-8 text-slate-400" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                                                                {t("No outcome records found")}
                                                                            </p>
                                                                            <p className="text-sm text-slate-500">
                                                                                {searchTerm || warehouseFilter || productFilter ? t("Try adjusting your filters") : t("Start tracking warehouse outcomes")}
                                                                            </p>
                                                                        </div>
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

                                {/* Enhanced Pagination */}
                                {outcomes?.links && outcomes.links.length > 3 && (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.5, duration: 0.4 }}
                                        className="flex items-center justify-center space-x-2"
                                    >
                                        <div className="flex items-center space-x-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-red-100 dark:border-red-900/30">
                                            {outcomes.links.map((link, index) => {
                                                if (link.label.includes('Previous')) {
                                                    return (
                                                        <Link
                                                            key={index}
                                                            href={link.url || '#'}
                                                            className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                                                                link.url 
                                                                    ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30' 
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
                                                                    ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30' 
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
                                                                ? 'bg-gradient-to-r from-red-500 to-orange-400 text-white shadow-lg' 
                                                                : link.url 
                                                                    ? 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30' 
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
