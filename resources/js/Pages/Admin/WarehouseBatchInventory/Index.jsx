import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Package,
    Building2,
    Calendar,
    AlertTriangle,
    CheckCircle,
    Filter,
    Download,
    Search,
    TrendingUp,
    TrendingDown,
    BarChart3,
    Eye,
    RefreshCw,
    Clock,
    Archive,
    Sparkles
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Badge } from "@/Components/ui/badge";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Index({ auth, inventory, warehouses, products, stats, filters }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedFilters, setSelectedFilters] = useState({
        warehouse_id: filters.warehouse_id || '',
        product_id: filters.product_id || '',
        expiry_status: filters.expiry_status || '',
        stock_status: filters.stock_status || '',
        sort_by: filters.sort_by || 'expire_date',
        sort_direction: filters.sort_direction || 'asc'
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...selectedFilters, [key]: value };
        setSelectedFilters(newFilters);
        
        router.get(route('admin.warehouse-batch-inventory.index'), {
            ...newFilters,
            search: searchTerm
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.warehouse-batch-inventory.index'), {
            ...selectedFilters,
            search: searchTerm
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleExport = () => {
        window.open(route('admin.warehouse-batch-inventory.export', {
            ...selectedFilters,
            search: searchTerm
        }));
    };

    const getExpiryStatusBadge = (status, daysToExpiry) => {
        switch (status) {
            case 'expired':
                return <Badge variant="destructive" className="gap-1"><AlertTriangle className="w-3 h-3" /> Expired</Badge>;
            case 'expiring_soon':
                return <Badge variant="outline" className="gap-1 border-orange-500 text-orange-700"><Clock className="w-3 h-3" /> {daysToExpiry} days left</Badge>;
            case 'valid':
                return <Badge variant="outline" className="gap-1 border-green-500 text-green-700"><CheckCircle className="w-3 h-3" /> Valid</Badge>;
            default:
                return <Badge variant="secondary">Unknown</Badge>;
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AFN',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat().format(number || 0);
    };

    return (
        <>
            <Head title={t("Warehouse Batch Inventory")}>
                <style>{`
                    @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
                    .float-animation { animation: float 6s ease-in-out infinite; }
                    .glass-effect { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); }
                    .dark .glass-effect { background: rgba(0, 0, 0, 0.2); backdrop-filter: blur(10px); }
                    .gradient-border {
                        background: linear-gradient(white, white) padding-box, linear-gradient(45deg, #3b82f6, #8b5cf6) border-box;
                        border: 2px solid transparent;
                    }
                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box, linear-gradient(45deg, #3b82f6, #8b5cf6) border-box;
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
                <Navigation auth={auth} currentRoute="admin.warehouse-batch-inventory" />

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
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 p-4 rounded-2xl shadow-2xl">
                                        <Archive className="w-8 h-8 text-white" />
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" /> {t("Batch Inventory")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent"
                                    >
                                        {t("Warehouse Batch Inventory")}
                                    </motion.h1>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Button
                                    onClick={handleExport}
                                    variant="outline"
                                    className="gap-2 hover:scale-105 transition-all duration-200"
                                >
                                    <Download className="h-4 w-4" />
                                    {t("Export")}
                                </Button>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-700 scrollbar-track-transparent p-8">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="space-y-8"
                        >
                            {/* Statistics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Batches</p>
                                                <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatNumber(stats.total_batches)}</p>
                                            </div>
                                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">With Stock</p>
                                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{formatNumber(stats.batches_with_stock)}</p>
                                            </div>
                                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Expiring Soon</p>
                                                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{formatNumber(stats.expiring_soon_batches)}</p>
                                            </div>
                                            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                                                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Expired</p>
                                                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{formatNumber(stats.expired_batches)}</p>
                                            </div>
                                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                                                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Filters */}
                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <Filter className="h-5 w-5 text-blue-600" />
                                        {t("Filters & Search")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <form onSubmit={handleSearch} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                            {/* Search */}
                                            <div className="space-y-2">
                                                <Label htmlFor="search">{t("Search")}</Label>
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                                    <Input
                                                        id="search"
                                                        type="text"
                                                        placeholder={t("Search batches, products...")}
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="pl-10"
                                                    />
                                                </div>
                                            </div>

                                            {/* Warehouse Filter */}
                                            <div className="space-y-2">
                                                <Label>{t("Warehouse")}</Label>
                                                <Select value={selectedFilters.warehouse_id} onValueChange={(value) => handleFilterChange('warehouse_id', value)}>
                                                    <SelectTrigger>
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

                                            {/* Product Filter */}
                                            <div className="space-y-2">
                                                <Label>{t("Product")}</Label>
                                                <Select value={selectedFilters.product_id} onValueChange={(value) => handleFilterChange('product_id', value)}>
                                                    <SelectTrigger>
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

                                            {/* Expiry Status Filter */}
                                            <div className="space-y-2">
                                                <Label>{t("Expiry Status")}</Label>
                                                <Select value={selectedFilters.expiry_status} onValueChange={(value) => handleFilterChange('expiry_status', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t("All Status")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="">{t("All Status")}</SelectItem>
                                                        <SelectItem value="expired">{t("Expired")}</SelectItem>
                                                        <SelectItem value="expiring_soon">{t("Expiring Soon")}</SelectItem>
                                                        <SelectItem value="valid">{t("Valid")}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Stock Status Filter */}
                                            <div className="space-y-2">
                                                <Label>{t("Stock Status")}</Label>
                                                <Select value={selectedFilters.stock_status} onValueChange={(value) => handleFilterChange('stock_status', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t("All Stock")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="">{t("All Stock")}</SelectItem>
                                                        <SelectItem value="with_stock">{t("With Stock")}</SelectItem>
                                                        <SelectItem value="no_stock">{t("No Stock")}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <Button type="submit" className="gap-2">
                                                <Search className="h-4 w-4" />
                                                {t("Search")}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Inventory Table */}
                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <BarChart3 className="h-5 w-5 text-purple-600" />
                                            {t("Batch Inventory")}
                                        </div>
                                        <Badge variant="secondary">
                                            {inventory.total} {t("records")}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-slate-50 dark:bg-slate-800">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                                                        {t("Batch")}
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                                                        {t("Product")}
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                                                        {t("Warehouse")}
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                                                        {t("Expire Date")}
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                                                        {t("Income Qty")}
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                                                        {t("Outcome Qty")}
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                                                        {t("Remaining")}
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                                                        {t("Status")}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                                {inventory.data.map((item, index) => (
                                                    <motion.tr
                                                        key={item.batch_id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div>
                                                                <div className="font-semibold text-slate-800 dark:text-white">
                                                                    {item.batch_reference}
                                                                </div>
                                                                {item.batch_notes && (
                                                                    <div className="text-sm text-slate-500 dark:text-slate-400 italic">
                                                                        {item.batch_notes}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <Package className="h-4 w-4 text-blue-600" />
                                                                <div>
                                                                    <div className="font-semibold text-slate-800 dark:text-white">
                                                                        {item.product_name}
                                                                    </div>
                                                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                                                        {item.product_barcode}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <Building2 className="h-4 w-4 text-purple-600" />
                                                                <span className="font-medium text-slate-800 dark:text-white">
                                                                    {item.warehouse_name}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4 text-slate-500" />
                                                                <span className="text-slate-800 dark:text-white">
                                                                    {item.expire_date ? new Date(item.expire_date).toLocaleDateString() : 'N/A'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-1">
                                                                <TrendingUp className="h-4 w-4 text-green-600" />
                                                                <span className="font-semibold text-green-600">
                                                                    {formatNumber(item.income_qty)}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-1">
                                                                <TrendingDown className="h-4 w-4 text-red-600" />
                                                                <span className="font-semibold text-red-600">
                                                                    {formatNumber(item.outcome_qty)}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`font-bold ${item.remaining_qty > 0 ? 'text-blue-600' : 'text-gray-500'}`}>
                                                                {formatNumber(item.remaining_qty)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {getExpiryStatusBadge(item.expiry_status, item.days_to_expiry)}
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {inventory.last_page > 1 && (
                                        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                                    Showing {inventory.from} to {inventory.to} of {inventory.total} results
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {inventory.links.map((link, index) => (
                                                        <Button
                                                            key={index}
                                                            variant={link.active ? "default" : "outline"}
                                                            size="sm"
                                                            disabled={!link.url}
                                                            onClick={() => link.url && router.visit(link.url)}
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </main>
                </div>
            </motion.div>
        </>
    );
} 