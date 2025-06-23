import React, { useState, useEffect } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ShoppingCart,
    Plus,
    Search,
    Filter,
    Download,
    Eye,
    Edit,
    Trash2,
    RefreshCw,
    Calendar,
    DollarSign,
    Package,
    TrendingUp,
    Users,
    Building2,
    ChevronDown,
    ChevronUp,
    X,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    FileText,
    Sparkles,
    BarChart3,
    CheckCircle,
    Clock,
    XCircle,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function SalesIndex({ 
    auth, 
    sales, 
    warehouses = [], 
    filters = {}, 
    sort = {}, 
    stats = {},
    can = {} 
}) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [warehouseFilter, setWarehouseFilter] = useState(filters.warehouse_id || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "");
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

    const handleSearch = () => {
        router.get(route('admin.sales.index'), {
            search: searchTerm,
            warehouse_id: warehouseFilter,
            status: statusFilter,
            date_from: dateFrom,
            date_to: dateTo,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSort = (field) => {
        const direction = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
        router.get(route('admin.sales.index'), {
            ...filters,
            sort_field: field,
            sort_direction: direction,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm("");
        setWarehouseFilter("");
        setStatusFilter("");
        setDateFrom("");
        setDateTo("");
        router.get(route('admin.sales.index'));
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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'pending':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'cancelled':
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return <Clock className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            completed: { label: t('Completed'), class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
            pending: { label: t('Pending'), class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
            cancelled: { label: t('Cancelled'), class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
        };

        const statusConfig = config[status] || config.pending;
        
        return (
            <Badge variant="outline" className={statusConfig.class}>
                {getStatusIcon(status)}
                <span className="ml-1">{statusConfig.label}</span>
            </Badge>
        );
    };

    const getSortIcon = (field) => {
        if (sort.field !== field) {
            return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
        }
        return sort.direction === 'asc' 
            ? <ArrowUp className="h-4 w-4 text-blue-600" />
            : <ArrowDown className="h-4 w-4 text-blue-600" />;
    };

    const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue", trend }) => (
        <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                            <p className={`text-3xl font-bold text-${color}-600 dark:text-${color}-400`}>{value}</p>
                            {subtitle && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
                            )}
                        </div>
                        <div className={`p-4 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-2xl shadow-lg`}>
                            <Icon className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    {trend && (
                        <div className="mt-4 flex items-center text-sm">
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-600 font-medium">{trend}</span>
                            <span className="text-gray-500 ml-1">{t('vs last period')}</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );

    return (
        <>
            <Head title={t("Sales Management")}>
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
                                    linear-gradient(45deg, #3b82f6, #6366f1) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(17 24 39), rgb(17 24 39)) padding-box,
                                    linear-gradient(45deg, #3b82f6, #6366f1) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={ShoppingCart} color="blue" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.sales" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="glass-effect border-b border-white/20 dark:border-gray-700/50 py-6 px-8 sticky top-0 z-30"
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
                                        <ShoppingCart className="w-8 h-8 text-white" />
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
                                        {t("Sales Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent"
                                    >
                                        {t("Sales Overview")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        {t("Monitor and manage all sales transactions")}
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
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="gap-2 hover:scale-105 transition-all duration-200"
                                >
                                    <Filter className="h-4 w-4" />
                                    {t("Filters")}
                                    {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                                
                                <Button
                                    variant="outline"
                                    className="gap-2 hover:scale-105 transition-all duration-200"
                                >
                                    <Download className="h-4 w-4" />
                                    {t("Export")}
                                </Button>

                                {can.create_sale && (
                                    <Link href={route("admin.sales.create")}>
                                        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 transition-all duration-200">
                                            <Plus className="h-4 w-4" />
                                            {t("New Sale")}
                                        </Button>
                                    </Link>
                                )}
                            </motion.div>
                        </div>

                        {/* Advanced Filters */}
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-6 overflow-hidden"
                                >
                                    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
                                        <CardContent className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("Search")}</label>
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                        <Input
                                                            placeholder={t("Search sales...")}
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            className="pl-10"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("Warehouse")}</label>
                                                    <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t("All warehouses")} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="">{t("All warehouses")}</SelectItem>
                                                            {warehouses.map((warehouse) => (
                                                                <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                                                    {warehouse.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("Status")}</label>
                                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t("All statuses")} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="">{t("All statuses")}</SelectItem>
                                                            <SelectItem value="pending">{t("Pending")}</SelectItem>
                                                            <SelectItem value="completed">{t("Completed")}</SelectItem>
                                                            <SelectItem value="cancelled">{t("Cancelled")}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("Date From")}</label>
                                                    <Input
                                                        type="date"
                                                        value={dateFrom}
                                                        onChange={(e) => setDateFrom(e.target.value)}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("Date To")}</label>
                                                    <Input
                                                        type="date"
                                                        value={dateTo}
                                                        onChange={(e) => setDateTo(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-6">
                                                <Button
                                                    variant="outline"
                                                    onClick={clearFilters}
                                                    className="gap-2"
                                                >
                                                    <X className="h-4 w-4" />
                                                    {t("Clear Filters")}
                                                </Button>
                                                <Button
                                                    onClick={handleSearch}
                                                    className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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
                                {/* Statistics Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatCard
                                        icon={ShoppingCart}
                                        title={t("Total Sales")}
                                        value={stats.total_sales?.toLocaleString() || "0"}
                                        subtitle={t("All time")}
                                        color="blue"
                                        trend="+12%"
                                    />
                                    <StatCard
                                        icon={DollarSign}
                                        title={t("Total Revenue")}
                                        value={formatCurrency(stats.total_amount || 0)}
                                        subtitle={t("All time")}
                                        color="green"
                                        trend="+8%"
                                    />
                                    <StatCard
                                        icon={Calendar}
                                        title={t("Today's Sales")}
                                        value={stats.today_sales?.toLocaleString() || "0"}
                                        subtitle={t("Today")}
                                        color="purple"
                                        trend="+15%"
                                    />
                                    <StatCard
                                        icon={TrendingUp}
                                        title={t("Today's Revenue")}
                                        value={formatCurrency(stats.today_amount || 0)}
                                        subtitle={t("Today")}
                                        color="orange"
                                        trend="+20%"
                                    />
                                </div>

                                {/* Sales Table */}
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 1.0, duration: 0.5 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl gradient-border">
                                        <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-gray-700/50 rounded-t-xl">
                                            <CardTitle className="text-gray-800 dark:text-gray-200 flex items-center gap-3 text-xl">
                                                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                                    <ShoppingCart className="h-6 w-6 text-white" />
                                                </div>
                                                {t("Sales List")}
                                                <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                    {sales.total} {t("total")}
                                                </Badge>
                                            </CardTitle>
                                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                                {t("Manage and monitor all sales transactions")}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="border-b border-gray-200 dark:border-gray-700">
                                                            <TableHead className="text-left py-4 px-6">
                                                                <Button 
                                                                    variant="ghost" 
                                                                    onClick={() => handleSort('id')}
                                                                    className="gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                                >
                                                                    {t("ID")}
                                                                    {getSortIcon('id')}
                                                                </Button>
                                                            </TableHead>
                                                            <TableHead className="text-left py-4 px-6">
                                                                <Button 
                                                                    variant="ghost" 
                                                                    onClick={() => handleSort('customer')}
                                                                    className="gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                                >
                                                                    {t("Customer")}
                                                                    {getSortIcon('customer')}
                                                                </Button>
                                                            </TableHead>
                                                            <TableHead className="text-left py-4 px-6">
                                                                <Button 
                                                                    variant="ghost" 
                                                                    onClick={() => handleSort('warehouse')}
                                                                    className="gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                                >
                                                                    {t("Warehouse")}
                                                                    {getSortIcon('warehouse')}
                                                                </Button>
                                                            </TableHead>
                                                            <TableHead className="text-left py-4 px-6">
                                                                <Button 
                                                                    variant="ghost" 
                                                                    onClick={() => handleSort('total_amount')}
                                                                    className="gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                                >
                                                                    {t("Total Amount")}
                                                                    {getSortIcon('total_amount')}
                                                                </Button>
                                                            </TableHead>
                                                            <TableHead className="text-left py-4 px-6">
                                                                <Button 
                                                                    variant="ghost" 
                                                                    onClick={() => handleSort('status')}
                                                                    className="gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                                >
                                                                    {t("Status")}
                                                                    {getSortIcon('status')}
                                                                </Button>
                                                            </TableHead>
                                                            <TableHead className="text-left py-4 px-6">
                                                                <Button 
                                                                    variant="ghost" 
                                                                    onClick={() => handleSort('created_at')}
                                                                    className="gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                                >
                                                                    {t("Date")}
                                                                    {getSortIcon('created_at')}
                                                                </Button>
                                                            </TableHead>
                                                            <TableHead className="text-center py-4 px-6">{t("Actions")}</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        <AnimatePresence>
                                                            {sales.data?.length > 0 ? (
                                                                sales.data.map((sale, index) => (
                                                                    <motion.tr
                                                                        key={sale.id}
                                                                        initial={{ opacity: 0, y: 20 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        exit={{ opacity: 0, y: -20 }}
                                                                        transition={{ delay: index * 0.1 }}
                                                                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors"
                                                                    >
                                                                        <TableCell className="py-4 px-6">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg">
                                                                                    <FileText className="h-4 w-4 text-blue-600" />
                                                                                </div>
                                                                                <div>
                                                                                    <div className="font-semibold text-gray-900 dark:text-white">#{sale.id}</div>
                                                                                    <div className="text-sm text-gray-500">
                                                                                        {sale.reference_number || `SALE-${sale.id}`}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="py-4 px-6">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg">
                                                                                    <Users className="h-4 w-4 text-green-600" />
                                                                                </div>
                                                                                <div>
                                                                                    <div className="font-semibold text-gray-900 dark:text-white">
                                                                                        {sale.customer?.name || t('Unknown Customer')}
                                                                                    </div>
                                                                                    <div className="text-sm text-gray-500">
                                                                                        {sale.customer?.email || sale.customer?.phone}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="py-4 px-6">
                                                                            <div className="flex items-center gap-2">
                                                                                <Building2 className="h-4 w-4 text-purple-600" />
                                                                                <div>
                                                                                    <div className="font-semibold text-gray-900 dark:text-white">
                                                                                        {sale.warehouse?.name || t('Unknown Warehouse')}
                                                                                    </div>
                                                                                    <div className="text-sm text-gray-500">
                                                                                        {sale.warehouse?.code}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="py-4 px-6">
                                                                            <div className="flex items-center gap-2">
                                                                                <DollarSign className="h-4 w-4 text-green-600" />
                                                                                <div>
                                                                                    <div className="font-bold text-green-600 text-lg">
                                                                                        {formatCurrency(sale.total_amount)}
                                                                                    </div>
                                                                                    <div className="text-sm text-gray-500">
                                                                                        {sale.items?.length || 0} {t('items')}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="py-4 px-6">
                                                                            {getStatusBadge(sale.status)}
                                                                        </TableCell>
                                                                        <TableCell className="py-4 px-6">
                                                                            <div className="flex items-center gap-2">
                                                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                                    {formatDate(sale.created_at)}
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="py-4 px-6">
                                                                            <div className="flex items-center justify-center">
                                                                                <DropdownMenu>
                                                                                    <DropdownMenuTrigger asChild>
                                                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                                        </Button>
                                                                                    </DropdownMenuTrigger>
                                                                                    <DropdownMenuContent align="end" className="w-48">
                                                                                        {can.view_sale && (
                                                                                            <DropdownMenuItem asChild>
                                                                                                <Link
                                                                                                    href={route('admin.sales.show', sale.id)}
                                                                                                    className="flex items-center gap-2 cursor-pointer"
                                                                                                >
                                                                                                    <Eye className="h-4 w-4" />
                                                                                                    {t("View Details")}
                                                                                                </Link>
                                                                                            </DropdownMenuItem>
                                                                                        )}
                                                                                        {can.update_sale && (
                                                                                            <DropdownMenuItem asChild>
                                                                                                <Link
                                                                                                    href={route('admin.sales.edit', sale.id)}
                                                                                                    className="flex items-center gap-2 cursor-pointer"
                                                                                                >
                                                                                                    <Edit className="h-4 w-4" />
                                                                                                    {t("Edit")}
                                                                                                </Link>
                                                                                            </DropdownMenuItem>
                                                                                        )}
                                                                                        {can.delete_sale && (
                                                                                            <DropdownMenuItem 
                                                                                                className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                                                onClick={() => {
                                                                                                    if (confirm(t('Are you sure you want to delete this sale?'))) {
                                                                                                        router.delete(route('admin.sales.destroy', sale.id));
                                                                                                    }
                                                                                                }}
                                                                                            >
                                                                                                <Trash2 className="h-4 w-4" />
                                                                                                {t("Delete")}
                                                                                            </DropdownMenuItem>
                                                                                        )}
                                                                                    </DropdownMenuContent>
                                                                                </DropdownMenu>
                                                                            </div>
                                                                        </TableCell>
                                                                    </motion.tr>
                                                                ))
                                                            ) : (
                                                                <TableRow>
                                                                    <TableCell colSpan={7} className="text-center py-12">
                                                                        <div className="flex flex-col items-center gap-4">
                                                                            <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-full">
                                                                                <ShoppingCart className="h-12 w-12 text-gray-400" />
                                                                            </div>
                                                                            <div>
                                                                                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                                                                    {t("No sales found")}
                                                                                </h3>
                                                                                <p className="text-gray-500 dark:text-gray-500 mb-4">
                                                                                    {t("Get started by creating your first sale.")}
                                                                                </p>
                                                                                {can.create_sale && (
                                                                                    <Link href={route("admin.sales.create")}>
                                                                                        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                                                                            <Plus className="h-4 w-4" />
                                                                                            {t("Create Sale")}
                                                                                        </Button>
                                                                                    </Link>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </AnimatePresence>
                                                    </TableBody>
                                                </Table>
                                            </div>

                                            {/* Pagination */}
                                            {sales.last_page > 1 && (
                                                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {t("Showing")} {sales.from} {t("to")} {sales.to} {t("of")} {sales.total} {t("results")}
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        {sales.prev_page_url && (
                                                            <Link href={sales.prev_page_url}>
                                                                <Button variant="outline" size="sm" className="gap-2">
                                                                    <ChevronLeft className="h-4 w-4" />
                                                                    {t("Previous")}
                                                                </Button>
                                                            </Link>
                                                        )}
                                                        
                                                        <div className="flex items-center space-x-1">
                                                            {[...Array(sales.last_page)].map((_, index) => {
                                                                const page = index + 1;
                                                                const isCurrentPage = page === sales.current_page;
                                                                const shouldShow = page === 1 || page === sales.last_page || 
                                                                    (page >= sales.current_page - 1 && page <= sales.current_page + 1);
                                                                
                                                                if (!shouldShow) {
                                                                    if (page === sales.current_page - 2 || page === sales.current_page + 2) {
                                                                        return <span key={page} className="px-2">...</span>;
                                                                    }
                                                                    return null;
                                                                }
                                                                
                                                                return (
                                                                    <Link
                                                                        key={page}
                                                                        href={`${sales.path}?page=${page}`}
                                                                        preserveState
                                                                        preserveScroll
                                                                    >
                                                                        <Button
                                                                            variant={isCurrentPage ? "default" : "outline"}
                                                                            size="sm"
                                                                            className={isCurrentPage ? "bg-blue-600 hover:bg-blue-700" : ""}
                                                                        >
                                                                            {page}
                                                                        </Button>
                                                                    </Link>
                                                                );
                                                            })}
                                                        </div>

                                                        {sales.next_page_url && (
                                                            <Link href={sales.next_page_url}>
                                                                <Button variant="outline" size="sm" className="gap-2">
                                                                    {t("Next")}
                                                                    <ChevronRight className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
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