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
import BackButton from "@/Components/BackButton";

export default function Sales({ auth, customer, sales, filters = {}, permissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [dateFilter, setDateFilter] = useState(filters.date_from || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "");
    const [sortBy, setSortBy] = useState(filters.sort_field || "created_at");
    const [sortOrder, setSortOrder] = useState(filters.sort_direction || "desc");
    const [showFilters, setShowFilters] = useState(false);
    const [filteredSales, setFilteredSales] = useState(sales.data || []);

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
        let filtered = [...(sales.data || sales)];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(sale =>
                sale.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sale.sale_items?.some(item => 
                    item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

            if (sortBy === 'date') {
                aValue = new Date(a.date);
                bValue = new Date(b.date);
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
            <Head title={`${customer?.name} - ${t("Sales")}`}>
                {/* ...styles omitted for brevity... */}
            </Head>

            <PageLoader isVisible={loading} />

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
                        className="glass-effect border-b border-slate-200/50 dark:border-slate-700/50 py-6 px-8 sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95"
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
                                        {t("Sales Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-green-600 to-slate-900 dark:from-white dark:via-green-300 dark:to-white bg-clip-text text-transparent"
                                    >
                                        {t("Sales Transactions")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"
                                    >
                                        <Store className="w-4 h-4" />
                                        {t("Track and manage sales for this customer")}
                                    </motion.p>
                                </div>
                            </div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-green-300 dark:scrollbar-thumb-green-700 scrollbar-track-transparent">
                        <div className="p-8">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <Card className="stat-card">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-green-600 dark:text-green-400">{t("Total Sales")}</p>
                                                <p className="text-3xl font-bold text-green-700 dark:text-green-300">{totalSales}</p>
                                            </div>
                                            <div className="p-3 bg-green-500 rounded-xl">
                                                <TrendingUp className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="stat-card">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{t("Total Items")}</p>
                                                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{totalItems}</p>
                                            </div>
                                            <div className="p-3 bg-blue-500 rounded-xl">
                                                <Package className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="stat-card">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">{t("Total Amount")}</p>
                                                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{formatCurrency(totalAmount)}</p>
                                            </div>
                                            <div className="p-3 bg-purple-500 rounded-xl">
                                                <DollarSign className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="stat-card">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">{t("Avg. Sale")}</p>
                                                <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{formatCurrency(avgSaleValue)}</p>
                                            </div>
                                            <div className="p-3 bg-orange-500 rounded-xl">
                                                <BarChart3 className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Filters and Table */}
                            <Card className="content-card overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-green-500/15 via-emerald-500/15 to-green-500/15 dark:from-green-500/25 dark:via-emerald-500/25 dark:to-green-500/25 border-b border-slate-200/60 dark:border-slate-600/60 rounded-t-xl">
                                    <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                                            <TrendingUp className="h-6 w-6 text-white" />
                                        </div>
                                        {t("Sales List")}
                                        <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-700">
                                            {filteredSales.length} {t("sales")}
                                            {sales.total && (
                                                <span className="ml-1">
                                                    {t("of")} {sales.total}
                                                </span>
                                            )}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {/* Table */}
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                                                    <TableHead className="font-semibold text-gray-700 dark:text-gray-200 py-4 px-6">{t("Reference")}</TableHead>
                                                    <TableHead className="font-semibold text-gray-700 dark:text-gray-200 py-4 px-6">{t("Date")}</TableHead>
                                                    <TableHead className="font-semibold text-gray-700 dark:text-gray-200 py-4 px-6">{t("Status")}</TableHead>
                                                    <TableHead className="font-semibold text-gray-700 dark:text-gray-200 py-4 px-6">{t("Total")}</TableHead>
                                                    <TableHead className="font-semibold text-gray-700 dark:text-gray-200 py-4 px-6 text-right">{t("Actions")}</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredSales.length > 0 ? (
                                                    filteredSales.map((sale) => (
                                                        <TableRow key={sale.id} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-all duration-200">
                                                            <TableCell className="py-4 px-6 font-mono">{sale.reference}</TableCell>
                                                            <TableCell className="py-4 px-6">{formatDate(sale.date)}</TableCell>
                                                            <TableCell className="py-4 px-6">
                                                                <Badge className={getStatusBadgeClass(sale.status)}>{t(sale.status)}</Badge>
                                                            </TableCell>
                                                            <TableCell className="py-4 px-6 font-bold text-green-600">{formatCurrency(sale.total_amount)}</TableCell>
                                                            <TableCell className="py-4 px-6 text-right">
                                                                <Link href={route('admin.warehouses.sales.show', [sale.warehouse_id, sale.id])}>
                                                                    <Button size="sm" variant="outline" className="h-8 w-8 p-0 hover:bg-green-50 hover:border-green-300" title={t('Move to Shop')}>
                                                                        <Store className="h-4 w-4 text-green-600" />
                                                                        <span className="sr-only">{t("Move to Shop")}</span>
                                                                    </Button>
                                                                </Link>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                                            {t("No sales found")}
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
} 