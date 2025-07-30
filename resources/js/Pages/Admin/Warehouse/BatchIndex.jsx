import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    ArrowUpDown,
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
    ArrowRightLeft,
    AlertTriangle,
    CalendarDays
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

export default function BatchIndex({
    auth,
    batches = [],
    pagination = {},
    filters = {},
    availableWarehouses = [],
    availableProducts = [],
    availableSuppliers = [],
    stats = {}
}) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [warehouseFilter, setWarehouseFilter] = useState(filters.warehouse_id || "");
    const [productFilter, setProductFilter] = useState(filters.product_id || "");
    const [supplierFilter, setSupplierFilter] = useState(filters.supplier_id || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "");
    const [dateFrom, setDateFrom] = useState(filters.date_from || "");
    const [dateTo, setDateTo] = useState(filters.date_to || "");

    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");
    const [filteredBatches, setFilteredBatches] = useState(batches || []);

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
        let filtered = [...(batches || [])];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(batch =>
                (batch.reference_number && batch.reference_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (batch.product?.name && batch.product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (batch.product?.barcode && batch.product.barcode.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (batch.warehouse?.name && batch.warehouse.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (batch.warehouse?.code && batch.warehouse.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (batch.supplier?.name && batch.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (batch.supplier?.code && batch.supplier.code.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Warehouse filter
        if (warehouseFilter) {
            filtered = filtered.filter(batch => batch.warehouse?.id && batch.warehouse.id.toString() === warehouseFilter);
        }

        // Product filter
        if (productFilter) {
            filtered = filtered.filter(batch => batch.product?.id && batch.product.id.toString() === productFilter);
        }

        // Supplier filter
        if (supplierFilter) {
            filtered = filtered.filter(batch => batch.supplier?.id && batch.supplier.id.toString() === supplierFilter);
        }

        // Status filter
        if (statusFilter) {
            if (statusFilter === 'active') {
                filtered = filtered.filter(batch => batch.is_active);
            } else if (statusFilter === 'expired') {
                filtered = filtered.filter(batch => batch.expire_date && new Date(batch.expire_date) <= new Date());
            }
        }

        // Date filter
        if (dateFrom) {
            const filterDate = new Date(dateFrom);
            filtered = filtered.filter(batch => {
                const batchDate = new Date(batch.created_at);
                return batchDate >= filterDate;
            });
        }

        if (dateTo) {
            const filterDate = new Date(dateTo);
            filtered = filtered.filter(batch => {
                const batchDate = new Date(batch.created_at);
                return batchDate <= filterDate;
            });
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
            } else if (sortBy === 'supplier.name') {
                aValue = a.supplier?.name || '';
                bValue = b.supplier?.name || '';
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

        setFilteredBatches(filtered);
    }, [searchTerm, warehouseFilter, productFilter, supplierFilter, statusFilter, dateFrom, dateTo, sortBy, sortOrder, batches]);

    // Calculate totals from filtered data
    const totalBatches = filteredBatches?.length || 0;
    const totalQuantity = filteredBatches?.reduce((sum, batch) => sum + (batch.quantity || 0), 0) || 0;
    const activeBatches = filteredBatches?.filter(batch => batch.is_active).length || 0;
    const expiredBatches = filteredBatches?.filter(batch => batch.expire_date && new Date(batch.expire_date) <= new Date()).length || 0;

    const handleSearch = () => {
        router.get(route('admin.batches.index'), {
            search: searchTerm,
            warehouse_id: warehouseFilter,
            product_id: productFilter,
            supplier_id: supplierFilter,
            status: statusFilter,
            date_from: dateFrom,
            date_to: dateTo,
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

    const getStatusBadgeClass = (batch) => {
        if (!batch.is_active) {
            return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        }

        if (batch.expire_date && new Date(batch.expire_date) <= new Date()) {
            return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        }

        if (batch.expire_date && new Date(batch.expire_date) <= new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)) {
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        }

        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    };

    const getStatusText = (batch) => {
        if (!batch.is_active) {
            return t("Inactive");
        }

        if (batch.expire_date && new Date(batch.expire_date) <= new Date()) {
            return t("Expired");
        }

        if (batch.expire_date && new Date(batch.expire_date) <= new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)) {
            return t("Expiring Soon");
        }

        return t("Active");
    };

    const clearFilters = () => {
        setSearchTerm("");
        setWarehouseFilter("");
        setProductFilter("");
        setSupplierFilter("");
        setStatusFilter("");
        setDateFrom("");
        setDateTo("");

        router.get(route('admin.batches.index'));
    };

    return (
        <>
            <Head title={t("Batch Management")}>
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

            <PageLoader isVisible={loading} icon={Package} color="blue" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.batches" />

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
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-2xl blur-lg opacity-60 dark:opacity-40"></div>
                                    <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 p-4 rounded-2xl shadow-2xl">
                                        <Package className="w-8 h-8 text-white" />
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
                                        {t("Batch Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent"
                                    >
                                        {t("Batch Management")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        {t("Track and manage product batches")}
                                    </motion.p>
                                </div>
                            </div>
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
                                        className="gap-3 px-6 py-3 text-lg font-medium border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-all duration-200 hover:scale-105 shadow-lg"
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
                                                <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50">
                                                    <CardTitle className="flex items-center gap-3">
                                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
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
                                                                placeholder={t("Search by reference, product, warehouse, or supplier...")}
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                                className="pl-12 h-12 text-lg border-2 border-blue-200 focus:border-blue-500 rounded-xl"
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
                                                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
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
                                                                    {availableWarehouses.map((warehouse) => (
                                                                        <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                                                            {warehouse.name} ({warehouse.code})
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
                                                                    {availableProducts.map((product) => (
                                                                        <SelectItem key={product.id} value={product.id.toString()}>
                                                                            {product.name} ({product.barcode})
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                {t("Supplier")}
                                                            </label>
                                                            <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                                                                <SelectTrigger className="h-10">
                                                                    <SelectValue placeholder={t("All Suppliers")} />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="">{t("All Suppliers")}</SelectItem>
                                                                    {availableSuppliers.map((supplier) => (
                                                                        <SelectItem key={supplier.id} value={supplier.id.toString()}>
                                                                            {supplier.name} ({supplier.code})
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
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
                                                                    <SelectItem value="active">{t("Active")}</SelectItem>
                                                                    <SelectItem value="expired">{t("Expired")}</SelectItem>
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

                                                    <div className="flex items-center justify-between mt-6">
                                                        <Button
                                                            variant="outline"
                                                            onClick={clearFilters}
                                                            className="gap-2"
                                                        >
                                                            <RefreshCw className="h-4 w-4" />
                                                            {t("Clear Filters")}
                                                        </Button>

                                                        <Button
                                                            onClick={handleSearch}
                                                            className="gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white"
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

                                {/* Batch Table */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.4, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                    <BarChart3 className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Batch Records")}
                                                <Badge variant="secondary" className="ml-auto">
                                                    {batches?.length || 0} {t("of")} {pagination?.total || 0}
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
                                                                {t("Product")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Quantity")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Warehouse")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Customer")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Expire Date")}
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
                                                        {filteredBatches?.length > 0 ? (
                                                            filteredBatches.map((batch, index) => (
                                                                <TableRow
                                                                    key={batch.id}
                                                                    className="hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                                                                >
                                                                    <TableCell>
                                                                        <div>
                                                                            <span className="font-mono text-sm bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg">
                                                                                {batch.reference_number || `BCH-${batch.id}`}
                                                                            </span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <Package className="h-4 w-4 text-blue-600" />
                                                                            <div>
                                                                                <div className="font-semibold text-slate-800 dark:text-white">{batch.product?.name || t('Unknown Product')}</div>
                                                                                <div className="text-sm text-slate-500">{batch.product?.barcode}</div>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                                                            {batch.quantity/batch.unit_amount || 0} {batch.unit_name}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                                                            {batch.remaining_warehouse/batch.unit_amount} {batch.unit_name}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                                                            {batch.remaining_customer/batch.unit_amount} {batch.unit_name}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {batch.expire_date ? (
                                                                            <div className="flex items-center gap-2">
                                                                                <CalendarDays className={`h-4 w-4 ${
                                                                                    new Date(batch.expire_date) <= new Date() 
                                                                                        ? 'text-red-600' 
                                                                                        : new Date(batch.expire_date) <= new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
                                                                                        ? 'text-yellow-600'
                                                                                        : 'text-green-600'
                                                                                }`} />
                                                                                <span className={`text-sm font-medium ${
                                                                                    new Date(batch.expire_date) <= new Date() 
                                                                                        ? 'text-red-600 dark:text-red-400' 
                                                                                        : new Date(batch.expire_date) <= new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
                                                                                        ? 'text-yellow-600 dark:text-yellow-400'
                                                                                        : 'text-green-600 dark:text-green-400'
                                                                                }`}>
                                                                                    {formatDate(batch.expire_date)}
                                                                                </span>
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-sm text-slate-400 italic">{t("No expiry")}</span>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                                                                        <div className="flex items-center gap-2">
                                                                            <Calendar className="h-4 w-4" />
                                                                            {formatDate(batch.created_at)}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <Link href={route('admin.batches.show', batch.id)}>
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 border-blue-200 hover:border-blue-300 dark:border-blue-700 dark:hover:border-blue-600"
                                                                                >
                                                                                    <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                                                </Button>
                                                                            </Link>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan="8" className="h-32 text-center">
                                                                    <div className="flex flex-col items-center gap-4">
                                                                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                                            <Package className="h-8 w-8 text-slate-400" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                                                                {t("No batch records found")}
                                                                            </p>
                                                                            <p className="text-sm text-slate-500">
                                                                                {searchTerm || warehouseFilter || productFilter || supplierFilter || statusFilter ? t("Try adjusting your filters") : t("Start tracking product batches")}
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
                                {pagination && pagination.last_page > 1 && (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.5, duration: 0.4 }}
                                        className="flex items-center justify-center space-x-2"
                                    >
                                        <div className="flex items-center space-x-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-blue-100 dark:border-blue-900/30">
                                            {/* Previous Page */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.get(route('admin.batches.index'), {
                                                    ...filters,
                                                    page: pagination.current_page - 1,
                                                }, {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                })}
                                                disabled={pagination.current_page === 1}
                                                className="h-8 w-8 p-0"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>

                                            {/* Page Numbers */}
                                            {(() => {
                                                const pages = [];
                                                const totalPages = pagination.last_page;
                                                const currentPage = pagination.current_page;
                                                let startPage = Math.max(1, currentPage - 2);
                                                let endPage = Math.min(totalPages, currentPage + 2);

                                                if (endPage - startPage < 4) {
                                                    if (startPage === 1) {
                                                        endPage = Math.min(totalPages, startPage + 4);
                                                    } else if (endPage === totalPages) {
                                                        startPage = Math.max(1, endPage - 4);
                                                    }
                                                }

                                                for (let i = startPage; i <= endPage; i++) {
                                                    pages.push(
                                                        <Button
                                                            key={i}
                                                            variant={currentPage === i ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => router.get(route('admin.batches.index'), {
                                                                ...filters,
                                                                page: i,
                                                            }, {
                                                                preserveState: true,
                                                                preserveScroll: true,
                                                            })}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            {i}
                                                        </Button>
                                                    );
                                                }
                                                return pages;
                                            })()}

                                            {/* Next Page */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.get(route('admin.batches.index'), {
                                                    ...filters,
                                                    page: pagination.current_page + 1,
                                                }, {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                })}
                                                disabled={pagination.current_page === pagination.last_page}
                                                className="h-8 w-8 p-0"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
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