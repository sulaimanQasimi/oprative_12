import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
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
    Calendar,
    DollarSign,
    TrendingUp,
    Users,
    Building2,
    ChevronDown,
    ChevronUp,
    X,
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
            completed: { label: t('Completed'), class: 'bg-green-100 text-green-800 border-green-200' },
            pending: { label: t('Pending'), class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
            cancelled: { label: t('Cancelled'), class: 'bg-red-100 text-red-800 border-red-200' },
        };

        const statusConfig = config[status] || config.pending;
        
        return (
            <Badge className={`${statusConfig.class} flex items-center gap-1`}>
                {getStatusIcon(status)}
                {statusConfig.label}
            </Badge>
        );
    };

    return (
        <>
            <Head title={t("Sales Management")} />

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
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 py-6 px-8 sticky top-0 z-30"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl">
                                    <ShoppingCart className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                                        {t("Sales Management")}
                                    </h1>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4" />
                                        {t("Monitor and manage all sales transactions")}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="gap-2"
                                >
                                    <Filter className="h-4 w-4" />
                                    {t("Filters")}
                                    {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                                
                            </div>
                        </div>

                        {/* Filters */}
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-6"
                                >
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">{t("Search")}</label>
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
                                                    <label className="text-sm font-medium">{t("Warehouse")}</label>
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
                                                    <label className="text-sm font-medium">{t("Status")}</label>
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
                                                    <label className="text-sm font-medium">{t("Date From")}</label>
                                                    <Input
                                                        type="date"
                                                        value={dateFrom}
                                                        onChange={(e) => setDateFrom(e.target.value)}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">{t("Date To")}</label>
                                                    <Input
                                                        type="date"
                                                        value={dateTo}
                                                        onChange={(e) => setDateTo(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-between mt-6">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSearchTerm("");
                                                        setWarehouseFilter("");
                                                        setStatusFilter("");
                                                        setDateFrom("");
                                                        setDateTo("");
                                                        router.get(route('admin.sales.index'));
                                                    }}
                                                    className="gap-2"
                                                >
                                                    <X className="h-4 w-4" />
                                                    {t("Clear Filters")}
                                                </Button>
                                                <Button onClick={handleSearch} className="gap-2">
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

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto p-8">
                        <div className="space-y-8">
                            {/* Statistics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <motion.div whileHover={{ scale: 1.02 }}>
                                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{t("Total Sales")}</p>
                                                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.total_sales?.toLocaleString() || 0}</p>
                                                    <p className="text-xs text-blue-500 mt-1">{t("All time")}</p>
                                                </div>
                                                <div className="p-3 bg-blue-500 rounded-xl">
                                                    <ShoppingCart className="h-8 w-8 text-white" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                                
                                <motion.div whileHover={{ scale: 1.02 }}>
                                    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">{t("Total Revenue")}</p>
                                                    <p className="text-3xl font-bold text-green-700 dark:text-green-300">{formatCurrency(stats.total_amount || 0)}</p>
                                                    <p className="text-xs text-green-500 mt-1">{t("All time")}</p>
                                                </div>
                                                <div className="p-3 bg-green-500 rounded-xl">
                                                    <DollarSign className="h-8 w-8 text-white" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                                
                                <motion.div whileHover={{ scale: 1.02 }}>
                                    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">{t("Today's Sales")}</p>
                                                    <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{stats.today_sales?.toLocaleString() || 0}</p>
                                                    <p className="text-xs text-purple-500 mt-1">{t("Today")}</p>
                                                </div>
                                                <div className="p-3 bg-purple-500 rounded-xl">
                                                    <Calendar className="h-8 w-8 text-white" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                                
                                <motion.div whileHover={{ scale: 1.02 }}>
                                    <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">{t("Today's Revenue")}</p>
                                                    <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{formatCurrency(stats.today_amount || 0)}</p>
                                                    <p className="text-xs text-orange-500 mt-1">{t("Today")}</p>
                                                </div>
                                                <div className="p-3 bg-orange-500 rounded-xl">
                                                    <TrendingUp className="h-8 w-8 text-white" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>

                            {/* Sales Table */}
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                <Card className="border-0 shadow-xl bg-white dark:bg-gray-800">
                                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-b">
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                <ShoppingCart className="h-6 w-6 text-white" />
                                            </div>
                                            {t("Sales List")}
                                            <Badge variant="secondary" className="ml-auto">
                                                {sales?.total || 0} {t("total")}
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="border-b bg-gray-50 dark:bg-gray-900">
                                                        <TableHead className="py-4 font-semibold">{t("ID")}</TableHead>
                                                        <TableHead className="py-4 font-semibold">{t("Customer")}</TableHead>
                                                        <TableHead className="py-4 font-semibold">{t("Warehouse")}</TableHead>
                                                        <TableHead className="py-4 font-semibold">{t("Total Amount")}</TableHead>
                                                        <TableHead className="py-4 font-semibold">{t("Status")}</TableHead>
                                                        <TableHead className="py-4 font-semibold">{t("Date")}</TableHead>
                                                        <TableHead className="text-center py-4 font-semibold">{t("Actions")}</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {sales?.data?.length > 0 ? (
                                                        sales.data.map((sale, index) => (
                                                            <motion.tr
                                                                key={sale.id}
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: index * 0.1 }}
                                                                className="border-b hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                                                            >
                                                                <TableCell className="py-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                                            <FileText className="h-4 w-4 text-blue-600" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="font-semibold">#{sale.id}</div>
                                                                            <div className="text-sm text-gray-500">
                                                                                {sale.reference_number || `SALE-${sale.id}`}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="py-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                                            <Users className="h-4 w-4 text-green-600" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="font-semibold">{sale.customer?.name || t('Unknown Customer')}</div>
                                                                            <div className="text-sm text-gray-500">{sale.customer?.email}</div>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="py-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <Building2 className="h-4 w-4 text-purple-600" />
                                                                        <div>
                                                                            <div className="font-semibold">{sale.warehouse?.name || t('Unknown Warehouse')}</div>
                                                                            <div className="text-sm text-gray-500">{sale.warehouse?.code}</div>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="py-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <DollarSign className="h-4 w-4 text-green-600" />
                                                                        <div>
                                                                                                                                                         <div className="font-bold text-green-600 text-lg">
                                                                                {formatCurrency(sale.total)}
                                                                             </div>
                                                                            <div className="text-sm text-gray-500">
                                                                                {sale.items?.length || 0} {t('items')}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="py-4">
                                                                    {getStatusBadge(sale.status)}
                                                                </TableCell>
                                                                <TableCell className="py-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <Calendar className="h-4 w-4 text-gray-400" />
                                                                        <div className="text-sm">{formatDate(sale.created_at)}</div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="py-4">
                                                                    <div className="flex justify-center">
                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger asChild>
                                                                                <Button variant="ghost" size="sm" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                                </Button>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent align="end" className="w-48">
                                                                                {can.view_sale && (
                                                                                    <DropdownMenuItem 
                                                                                        className="flex items-center gap-2 cursor-pointer"
                                                                                        onClick={() => router.visit(route('admin.warehouses.sales.show', { warehouse: sale.warehouse_id, sale: sale.id }))}
                                                                                    >
                                                                                        <Eye className="h-4 w-4" />
                                                                                        {t("View Details")}
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
                                                                        <p className="text-gray-500 mb-4">
                                                                            {t("Get started by creating your first sale.")}
                                                                        </p>
                                                                        {can.create_sale && (
                                                                            <Link href={route("admin.sales.create")}>
                                                                                <Button className="gap-2">
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
                                                </TableBody>
                                            </Table>
                                        </div>

                                        {/* Pagination */}
                                        {sales?.last_page > 1 && (
                                            <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 dark:bg-gray-900">
                                                <div className="text-sm text-gray-500">
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
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
} 