import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    Package,
    Search,
    TrendingUp,
    TrendingDown,
    BarChart3,
    DollarSign,
    Boxes,
    Calendar,
    AlertTriangle,
    Clock,
    CheckCircle
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
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";
import BackButton from "@/Components/BackButton";

export default function Products({ auth, warehouse, products }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("net_quantity");
    const [sortDirection, setSortDirection] = useState("desc");
    const [filteredProducts, setFilteredProducts] = useState(products || []);

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Filter and sort products
    useEffect(() => {
        let filtered = products || [];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.product.barcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.batch_reference?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            // Handle nested product properties
            if (sortBy.includes('product.')) {
                const key = sortBy.replace('product.', '');
                aValue = a.product[key];
                bValue = b.product[key];
            }

            if (sortDirection === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredProducts(filtered);
    }, [products, searchTerm, sortBy, sortDirection]);

    // Calculate summary statistics
    const totalProducts = filteredProducts.length;
    const totalValue = filteredProducts.reduce((sum, product) => sum + (product.total_income_value || 0), 0);
    const totalQuantity = filteredProducts.reduce((sum, product) => sum + (product.remaining_qty || 0), 0);
    const totalProfit = filteredProducts.reduce((sum, product) => sum + (product.profit || 0), 0);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AFN',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const getStockStatus = (quantity) => {
        if (quantity <= 0) return { status: 'out', color: 'bg-red-500', text: 'Out of Stock' };
        if (quantity <= 10) return { status: 'low', color: 'bg-yellow-500', text: 'Low Stock' };
        return { status: 'good', color: 'bg-green-500', text: 'In Stock' };
    };

    const getExpiryStatus = (batches) => {
        if (!batches || batches.length === 0) return { status: 'no_batch', color: 'bg-gray-500', text: 'No Batch Info' };
        
        const batch = batches[0]; // Since we're now dealing with individual batches
        if (batch.expiry_status === 'expired') {
            return { status: 'expired', color: 'bg-red-500', text: 'Expired' };
        }
        if (batch.expiry_status === 'expiring_soon') {
            return { status: 'expiring_soon', color: 'bg-yellow-500', text: 'Expiring Soon' };
        }
        return { status: 'valid', color: 'bg-green-500', text: 'Valid' };
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <>
            <Head title={`${warehouse?.name} - ${t("Products")}`}>
                <style>{`
                    @keyframes shimmer {
                        0% { background-position: -1000px 0; }
                        100% { background-position: 1000px 0; }
                    }

                    .shimmer {
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                        background-size: 1000px 100%;
                        animation: shimmer 2s infinite;
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
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.warehouses" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Enhanced Header */}
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="glass-effect border-b border-white/20 dark:border-slate-700/50 py-6 px-8 sticky top-0 z-30"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.4 }}
                                    className="relative"
                                >
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl blur opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
                                        <Package className="w-8 h-8 text-white" />
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1"
                                    >
                                        {warehouse?.name} - {t("Product Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
                                    >
                                        {t("Warehouse Products")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400"
                                    >
                                        {t("Manage inventory and track product movements")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <BackButton link={route("admin.warehouses.show", warehouse.id)} />
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-8 space-y-8">
                            {/* Summary Cards */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                            >
                                <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                    {t("Total Products")}
                                                </p>
                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                    {totalProducts}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                <Boxes className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                    {t("Total Quantity")}
                                                </p>
                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                    {totalQuantity.toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                                <BarChart3 className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                    {t("Total Value")}
                                                </p>
                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                    {formatCurrency(totalValue)}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                                                <DollarSign className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                    {t("Total Profit")}
                                                </p>
                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                    {formatCurrency(totalProfit)}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                                                <TrendingUp className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Filters and Search */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.9, duration: 0.5 }}
                            >
                                <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                            <div className="flex flex-1 gap-4 items-center">
                                                <div className="relative flex-1 max-w-md">
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                                    <Input
                                                        placeholder={t("Search products...")}
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="pl-10 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400"
                                                    />
                                                </div>
                                                <Select value={sortBy} onValueChange={setSortBy}>
                                                    <SelectTrigger className="w-48">
                                                        <SelectValue placeholder={t("Sort by")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="product.name">{t("Product Name")}</SelectItem>
                                                        <SelectItem value="remaining_qty">{t("Remaining Quantity")}</SelectItem>
                                                        <SelectItem value="total_income_value">{t("Income Value")}</SelectItem>
                                                        <SelectItem value="profit">{t("Profit")}</SelectItem>
                                                        <SelectItem value="income_qty">{t("Income Quantity")}</SelectItem>
                                                        <SelectItem value="outcome_qty">{t("Outcome Quantity")}</SelectItem>
                                                        <SelectItem value="expire_date">{t("Expire Date")}</SelectItem>
                                                        <SelectItem value="batch_reference">{t("Batch Reference")}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                                                    className="gap-2 dark:text-white text-black"
                                                >
                                                    {sortDirection === 'asc' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                                    {sortDirection === 'asc' ? t("Ascending") : t("Descending")}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Products Table */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.0, duration: 0.5 }}
                            >
                                <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm">
                                    <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-white/20 dark:border-slate-600/50">
                                        <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                <Package className="h-5 w-5 text-white" />
                                            </div>
                                            {t("Product Inventory")}
                                        </CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                            {t("Complete list of products in this warehouse")}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {filteredProducts.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-slate-50/50 dark:bg-slate-600/50">
                                                                <TableHead className="font-bold text-slate-700 dark:text-slate-300">
                                                                    {t("Batch Ref")}
                                                                </TableHead>
                                                                <TableHead className="font-bold text-slate-700 dark:text-slate-300">
                                                                    {t("Product")}
                                                                </TableHead>
                                                                <TableHead className="font-bold text-slate-700 dark:text-slate-300">
                                                                    {t("Barcode")}
                                                                </TableHead>
                                                                <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-center">
                                                                    {t("Units")}
                                                                </TableHead>
                                                                <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-center">
                                                                    {t("Income Qty")}
                                                                </TableHead>
                                                                <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-right">
                                                                    {t("Income Total")}
                                                                </TableHead>
                                                                <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-center">
                                                                    {t("Outcome Qty")}
                                                                </TableHead>
                                                                <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-right">
                                                                    {t("Outcome Total")}
                                                                </TableHead>
                                                                <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-center">
                                                                    {t("Remaining")}
                                                                </TableHead>
                                                                <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-right">
                                                                    {t("Profit")}
                                                                </TableHead>
                                                                <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-center">
                                                                    {t("Issue Date")}
                                                                </TableHead>
                                                                <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-center">
                                                                    {t("Expire Date")}
                                                                </TableHead>
                                                                <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-center">
                                                                    {t("Status")}
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                    <TableBody>
                                                                                                                <AnimatePresence>
                                                            {filteredProducts.map((batch, index) => {
                                                                const stockStatus = getStockStatus(batch.remaining_qty);
                                                                const expiryStatus = getExpiryStatus([batch]);
                                                                return (
                                                                    <motion.tr
                                                                        key={batch.batch_id}
                                                                        initial={{ opacity: 0, y: 20 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ delay: index * 0.05 }}
                                                                        className="hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-colors"
                                                                    >
                                                                        <TableCell>
                                                                            <span className="font-mono text-sm bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg">
                                                                                {batch.batch_reference || '-'}
                                                                            </span>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                                                                    <Package className="h-5 w-5 text-white" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="font-semibold text-slate-800 dark:text-white">
                                                                                        {batch.product.name}
                                                                                    </p>
                                                                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                                        {batch.product.type}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="font-mono text-slate-600 dark:text-slate-400">
                                                                            {batch.product.barcode || '-'}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <div className="space-y-1">
                                                                                {batch.product.unit && (
                                                                                    <div className="text-xs">
                                                                                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                                                            {batch.product.unit.name} ({batch.product.unit.symbol})
                                                                                        </Badge>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="text-center font-semibold">
                                                                            {batch.income_qty?.toLocaleString() || 0}
                                                                        </TableCell>
                                                                        <TableCell className="text-right font-semibold text-green-600 dark:text-green-400">
                                                                            {formatCurrency(batch.total_income_value)}
                                                                        </TableCell>
                                                                        <TableCell className="text-center font-semibold">
                                                                            {batch.outcome_qty?.toLocaleString() || 0}
                                                                        </TableCell>
                                                                        <TableCell className="text-right font-semibold text-red-600 dark:text-red-400">
                                                                            {formatCurrency(batch.total_outcome_value)}
                                                                        </TableCell>
                                                                        <TableCell className="text-center">
                                                                            <Badge
                                                                                variant="secondary"
                                                                                className={`${stockStatus.color} text-white font-bold`}
                                                                            >
                                                                                {batch.remaining_qty?.toLocaleString() || 0}
                                                                            </Badge>
                                                                        </TableCell>
                                                                        <TableCell className="text-right font-bold">
                                                                            <span className={batch.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                                                                {formatCurrency(batch.profit)}
                                                                            </span>
                                                                        </TableCell>
                                                                        <TableCell className="text-center text-sm text-slate-600 dark:text-slate-400">
                                                                            {batch.issue_date ? formatDate(batch.issue_date) : '-'}
                                                                        </TableCell>
                                                                        <TableCell className="text-center">
                                                                            <div className="flex items-center gap-2">
                                                                                <Calendar className="h-4 w-4" />
                                                                                <div className="flex flex-col">
                                                                                    <span className="font-medium text-sm">
                                                                                        {batch.expire_date ? formatDate(batch.expire_date) : '-'}
                                                                                    </span>
                                                                                    {batch.days_to_expiry !== null && (
                                                                                        <span className={`text-xs ${
                                                                                            batch.days_to_expiry < 0 ? 'text-red-500' : 
                                                                                            batch.days_to_expiry <= 30 ? 'text-orange-500' : 'text-green-500'
                                                                                        }`}>
                                                                                            {batch.days_to_expiry < 0 ? `${Math.abs(batch.days_to_expiry)} days expired` :
                                                                                             batch.days_to_expiry === 0 ? 'Expires today' :
                                                                                             `${batch.days_to_expiry} days left`}
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="text-center">
                                                                            <Badge
                                                                                variant="secondary"
                                                                                className={`${expiryStatus.color} text-white`}
                                                                            >
                                                                                {t(expiryStatus.text)}
                                                                            </Badge>
                                                                        </TableCell>
                                                                    </motion.tr>
                                                                );
                                                            })}
                                                        </AnimatePresence>
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="text-center py-16"
                                            >
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center">
                                                        <Package className="h-8 w-8 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                                                            {t("No products found")}
                                                        </h3>
                                                        <p className="text-slate-600 dark:text-slate-400">
                                                            {searchTerm 
                                                                ? t("No products match your search criteria")
                                                                : t("This warehouse doesn't have any products yet")
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
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