import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerNavbar from '@/Components/CustomerNavbar';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import {
    Package,
    Plus,
    Search,
    Filter,
    RefreshCw,
    DollarSign,
    Box,
    ArrowLeft,
    PackageSearch,
    TrendingUp,
    TrendingDown,
    ChevronRight,
    ChevronLeft,
    Boxes,
    BarChart3,
    Calendar
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';

// PageLoader component
const PageLoader = ({ isVisible }) => {
    return (
        <motion.div
            className="fixed inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-950 z-50 flex flex-col items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? "all" : "none",
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            {/* Background patterns */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>

            {/* Animated light beams */}
            <div className="absolute w-full h-full overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-gradient-to-r from-blue-400/10 via-indigo-500/10 to-transparent h-[30vh] w-[100vw]"
                        style={{
                            top: `${10 + i * 20}%`,
                            left: "-100%",
                            transformOrigin: "left center",
                            rotate: `${-20 + i * 10}deg`,
                        }}
                        animate={{
                            left: ["100%", "-100%"],
                        }}
                        transition={{
                            duration: 15 + i * 2,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 3,
                        }}
                    />
                ))}
            </div>

            {/* Animated particles */}
            <div className="absolute inset-0">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                            width: Math.random() * 4 + 1,
                            height: Math.random() * 4 + 1,
                            x: `${Math.random() * 100}%`,
                            y: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.5 + 0.2,
                        }}
                        animate={{
                            y: [null, `${-Math.random() * 100 - 50}%`],
                            opacity: [null, 0],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 5,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Main animated container */}
                <motion.div
                    className="relative"
                    animate={{
                        scale: [0.95, 1.05, 0.95],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    {/* Pulsing background circles */}
                    <motion.div
                        className="absolute w-64 h-64 rounded-full bg-blue-600/5 filter blur-2xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute w-72 h-72 rounded-full bg-indigo-500/5 filter blur-2xl transform -translate-x-4 translate-y-4"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                        }}
                    />

                    {/* Animated logo/icon container */}
                    <div className="relative flex items-center justify-center h-40 w-40">
                        {/* Spinning rings */}
                        <motion.div
                            className="absolute h-full w-full rounded-full border-4 border-blue-300/10"
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 20,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                        />
                        <motion.div
                            className="absolute h-[85%] w-[85%] rounded-full border-4 border-indigo-400/20"
                            animate={{
                                rotate: -360,
                            }}
                            transition={{
                                duration: 15,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                        />
                        <motion.div
                            className="absolute h-[70%] w-[70%] rounded-full border-4 border-blue-400/30"
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 10,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                        />

                        {/* Spinner arcs */}
                        <motion.div
                            className="absolute h-full w-full rounded-full border-4 border-r-blue-400 border-t-transparent border-l-transparent border-b-transparent"
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 1.5,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                        />
                        <motion.div
                            className="absolute h-full w-full rounded-full border-4 border-b-indigo-400 border-t-transparent border-l-transparent border-r-transparent"
                            animate={{ rotate: -180 }}
                            transition={{
                                duration: 2,
                                ease: "easeInOut",
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                        />

                        {/* Icon/logo in center */}
                        <motion.div
                            className="relative z-10 bg-gradient-to-br from-blue-500 to-indigo-600 h-20 w-20 rounded-2xl flex items-center justify-center shadow-xl"
                            animate={{
                                rotate: [0, 10, 0, -10, 0],
                                scale: [1, 1.1, 1, 1.1, 1],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <Package className="h-10 w-10 text-white drop-shadow-lg" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default function StockProductsIndex({ products, search, sort_by, sort_direction, filters, auth }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [searchTerm, setSearchTerm] = useState(search || "");
    const [sortBy, setSortBy] = useState(sort_by || "net_quantity");
    const [sortDirection, setSortDirection] = useState(sort_direction || "desc");
    const [filteredProducts, setFilteredProducts] = useState(products?.data || []);

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
        let filtered = products?.data || [];

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
    }, [products?.data, searchTerm, sortBy, sortDirection]);

    // Calculate detailed summary statistics
    const totalProducts = filteredProducts.length;
    const totalValue = filteredProducts.reduce((sum, product) => sum + (product.total_income_value || 0), 0);
    const totalQuantity = filteredProducts.reduce((sum, product) => sum + (product.remaining_qty || 0), 0);
    const totalProfit = filteredProducts.reduce((sum, product) => sum + (product.profit || 0), 0);
    
    // Expiry statistics
    const expiredProducts = filteredProducts.filter(product => product.expiry_status === 'expired');
    const expiringSoonProducts = filteredProducts.filter(product => product.expiry_status === 'expiring_soon');
    const validProducts = filteredProducts.filter(product => product.expiry_status === 'valid');
    
    const expiredQuantity = expiredProducts.reduce((sum, product) => sum + (product.remaining_qty || 0), 0);
    const expiringSoonQuantity = expiringSoonProducts.reduce((sum, product) => sum + (product.remaining_qty || 0), 0);
    const validQuantity = validProducts.reduce((sum, product) => sum + (product.remaining_qty || 0), 0);
    
    // Stock level statistics
    const outOfStockProducts = filteredProducts.filter(product => (product.remaining_qty || 0) <= 0);
    const lowStockProducts = filteredProducts.filter(product => (product.remaining_qty || 0) > 0 && (product.remaining_qty || 0) <= 10);
    const inStockProducts = filteredProducts.filter(product => (product.remaining_qty || 0) > 10);
    
    // Financial statistics
    const totalIncomeValue = filteredProducts.reduce((sum, product) => sum + (product.total_income_value || 0), 0);
    const totalOutcomeValue = filteredProducts.reduce((sum, product) => sum + (product.total_outcome_value || 0), 0);
    const totalRemainingValue = filteredProducts.reduce((sum, product) => sum + (product.net_value || 0), 0);
    
    // Batch statistics
    const totalBatches = filteredProducts.filter(product => product.batch_id).length;
    const batchesWithExpiry = filteredProducts.filter(product => product.expire_date).length;
    
    // Pricing statistics
    const totalPurchaseValue = filteredProducts.reduce((sum, product) => sum + (product.purchase_price * (product.remaining_qty || 0)), 0);
    const totalWholesaleValue = filteredProducts.reduce((sum, product) => sum + (product.wholesale_price * (product.remaining_qty || 0)), 0);
    const totalRetailValue = filteredProducts.reduce((sum, product) => sum + (product.retail_price * (product.remaining_qty || 0)), 0);
    const potentialWholesaleProfit = totalWholesaleValue - totalPurchaseValue;
    const potentialRetailProfit = totalRetailValue - totalPurchaseValue;

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
            <Head title={t('Stock Products')}>
                <style>{`
                    @keyframes shimmer {
                        0% {
                            transform: translateX(-100%);
                        }
                        100% {
                            transform: translateX(100%);
                        }
                    }
                    .animate-shimmer {
                        animation: shimmer 3s infinite;
                    }

                    .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
                        background-size: 14px 14px;
                    }

                    .dark .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                    }

                    .card-shine {
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 50%;
                        height: 100%;
                        background: linear-gradient(
                            to right,
                            rgba(255, 255, 255, 0) 0%,
                            rgba(255, 255, 255, 0.3) 50%,
                            rgba(255, 255, 255, 0) 100%
                        );
                    }

                    /* Fix for horizontal scroll */
                    html, body {
                        overflow-x: hidden;
                        max-width: 100%;
                    }

                    .responsive-chart-container {
                        max-width: 100%;
                        overflow-x: hidden;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden max-w-full">
                {/* Sidebar */}
                <CustomerNavbar
                    auth={auth || {user: {name: 'Customer'}}}
                    currentRoute="customer.stock-products"
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden max-w-full">
                    {/* Header */}
                    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-0.5">
                                    {t("Customer Portal")}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    {t("Stock Products Management")}
                                </h1>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-8 space-y-8">
                            {/* Summary Cards */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            >
                                {/* Total Products */}
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
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                    {totalBatches} {t("batches")}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                <Boxes className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Total Quantity */}
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
                                                <div className="flex gap-2 mt-1">
                                                    <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded">
                                                        {inStockProducts.length} {t("in stock")}
                                                    </span>
                                                    <span className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 px-2 py-1 rounded">
                                                        {lowStockProducts.length} {t("low")}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                                <BarChart3 className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Expiry Status */}
                                <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                    {t("Expiry Status")}
                                                </p>
                                                <div className="space-y-1 mt-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-green-600 dark:text-green-400">{t("Valid")}</span>
                                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                            {validProducts.length} ({validQuantity.toLocaleString()})
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-yellow-600 dark:text-yellow-400">{t("Expiring Soon")}</span>
                                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                            {expiringSoonProducts.length} ({expiringSoonQuantity.toLocaleString()})
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-red-600 dark:text-red-400">{t("Expired")}</span>
                                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                            {expiredProducts.length} ({expiredQuantity.toLocaleString()})
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                                                <Calendar className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Financial Overview */}
                                <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                    {t("Financial Overview")}
                                                </p>
                                                <div className="space-y-1 mt-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-green-600 dark:text-green-400">{t("Income")}</span>
                                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                            {formatCurrency(totalIncomeValue)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-red-600 dark:text-red-400">{t("Outcome")}</span>
                                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                            {formatCurrency(totalOutcomeValue)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between border-t pt-1">
                                                        <span className="text-xs text-purple-600 dark:text-purple-400">{t("Profit")}</span>
                                                        <span className={`text-sm font-bold ${totalProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                            {formatCurrency(totalProfit)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                                                <DollarSign className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Additional Stats Row */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.0, duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                            >
                                {/* Stock Alerts */}
                                <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                                                    {t("Stock Alerts")}
                                                </p>
                                                <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                                                    {outOfStockProducts.length + lowStockProducts.length}
                                                </p>
                                                <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                                                    {outOfStockProducts.length} {t("out of stock")}, {lowStockProducts.length} {t("low stock")}
                                                </div>
                                            </div>
                                            <div className="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg">
                                                <TrendingDown className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Expiry Alerts */}
                                <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                                                    {t("Expiry Alerts")}
                                                </p>
                                                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                                                    {expiredProducts.length + expiringSoonProducts.length}
                                                </p>
                                                <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                                                    {expiredProducts.length} {t("expired")}, {expiringSoonProducts.length} {t("expiring soon")}
                                                </div>
                                            </div>
                                            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg">
                                                <Calendar className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Remaining Value */}
                                <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                                    {t("Remaining Value")}
                                                </p>
                                                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                                    {formatCurrency(totalRemainingValue)}
                                                </p>
                                                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                                    {t("Current inventory value")}
                                                </div>
                                            </div>
                                            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                <Package className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Pricing Insights */}
                                <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                                    {t("Pricing Insights")}
                                                </p>
                                                <div className="space-y-1 mt-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-blue-600 dark:text-blue-400">{t("Wholesale")}</span>
                                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                            {formatCurrency(potentialWholesaleProfit)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-purple-600 dark:text-purple-400">{t("Retail")}</span>
                                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                            {formatCurrency(potentialRetailProfit)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                                                <DollarSign className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Batch Information */}
                                <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                                    {t("Batch Info")}
                                                </p>
                                                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                                    {totalBatches}
                                                </p>
                                                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                                                    {batchesWithExpiry} {t("with expiry dates")}
                                                </div>
                                            </div>
                                            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                                <Boxes className="h-6 w-6 text-white" />
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
                                            {t("Your Inventory")}
                                        </CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                            {t("Complete list of products in your inventory with batch tracking")}
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
                                                                {t("Purchase Price")}
                                                            </TableHead>
                                                            <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-right">
                                                                {t("Wholesale")}
                                                            </TableHead>
                                                            <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-right">
                                                                {t("Retail")}
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
                                                                        key={batch.batch_id || `${batch.product_id}-${index}`}
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
                                                                                {batch.unit_name && (
                                                                                    <div className="text-xs">
                                                                                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                                                            {batch.remaining_qty/batch.unit_amount} {batch.unit_name}
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
                                                                        <TableCell className="text-right font-semibold text-slate-600 dark:text-slate-400">
                                                                            {formatCurrency(batch.purchase_price)}
                                                                        </TableCell>
                                                                        <TableCell className="text-right font-semibold text-blue-600 dark:text-blue-400">
                                                                            {formatCurrency(batch.wholesale_price)}
                                                                        </TableCell>
                                                                        <TableCell className="text-right font-semibold text-purple-600 dark:text-purple-400">
                                                                            {formatCurrency(batch.retail_price)}
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
                                                                : t("You don't have any products in inventory yet")
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Pagination */}
                            {products?.links && products.links.length > 3 && (
                                <div className="flex justify-center">
                                    <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                                    {t("Showing")} {products.from} {t("to")} {products.to} {t("of")} {products.total} {t("products")}
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    {products.links.map((link, index) => {
                                                        if (link.url === null) {
                                                            return (
                                                                <Button
                                                                    key={index}
                                                                    variant="outline"
                                                                    size="sm"
                                                                    disabled
                                                                    className="w-10 h-10 p-0"
                                                                >
                                                                    {link.label === '&laquo; Previous' ? (
                                                                        <ChevronLeft className="h-4 w-4" />
                                                                    ) : link.label === 'Next &raquo;' ? (
                                                                        <ChevronRight className="h-4 w-4" />
                                                                    ) : (
                                                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                                    )}
                                                                </Button>
                                                            );
                                                        }

                                                        return (
                                                            <Link
                                                                key={index}
                                                                href={link.url}
                                                                preserveState
                                                                preserveScroll
                                                                only={['products', 'filters']}
                                                            >
                                                                <Button
                                                                    variant={link.active ? "default" : "outline"}
                                                                    size="sm"
                                                                    className={`w-10 h-10 p-0 ${
                                                                        link.active 
                                                                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                                                            : 'hover:bg-blue-50 hover:border-blue-300'
                                                                    }`}
                                                                >
                                                                    {link.label === '&laquo; Previous' ? (
                                                                        <ChevronLeft className="h-4 w-4" />
                                                                    ) : link.label === 'Next &raquo;' ? (
                                                                        <ChevronRight className="h-4 w-4" />
                                                                    ) : (
                                                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                                    )}
                                                                </Button>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
