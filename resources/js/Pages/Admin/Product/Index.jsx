import React, { useState, useEffect, useRef } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion, AnimatePresence } from "framer-motion";
import anime from "animejs";
import {
    Search,
    Plus,
    Package,
    ChevronRight,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Star,
    AlertCircle,
    Filter,
    ArrowUpDown,
    Eye,
    Settings,
    DollarSign,
    ShoppingCart,
    Tag,
    Barcode,
    Sparkles,
    BarChart3,
    ChevronDown,
    X,
    RefreshCw,
    Download,
    ChevronLeft,
    SkipBack,
    SkipForward,
    RotateCcw,
    XOctagon,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Index({
    auth,
    products = {
        data: [],
        total: 0,
        from: 0,
        to: 0,
        current_page: 1,
        last_page: 1,
        links: [],
    },
    filters = {},
    productTypes = [],
    permissions = {},
}) {
    const { t } = useLaravelReactI18n();
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [sortField, setSortField] = useState(filters.sort_field || "name");
    const [sortDirection, setSortDirection] = useState(
        filters.sort_direction || "asc"
    );
    const [filterStatus, setFilterStatus] = useState(filters.status || "all");
    const [filterType, setFilterType] = useState(filters.type || "all");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    // Refs for animation targets
    const headerRef = useRef(null);
    const statsRef = useRef(null);
    const tableRef = useRef(null);

    // Calculate statistics with safety checks
    const stats = {
        total: products?.total || 0,
        active: products?.data?.filter((p) => p?.is_activated)?.length || 0,
        inStock: products?.data?.filter((p) => p?.is_in_stock)?.length || 0,
        trending: products?.data?.filter((p) => p?.is_trend)?.length || 0,
        totalValue:
            products?.data?.reduce(
                (sum, p) => sum + (parseFloat(p?.retail_price) || 0),
                0
            ) || 0,
    };

    // Define status options
    const statusOptions = [
        { value: "all", label: t("All Status") },
        { value: "active", label: t("Active") },
        { value: "inactive", label: t("Inactive") },
        { value: "in_stock", label: t("In Stock") },
        { value: "trending", label: t("Trending") },
    ];

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                route("admin.products.index"),
                { search: searchTerm },
                { preserveState: true, preserveScroll: true }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Handle filter changes
    useEffect(() => {
        router.get(
            route("admin.products.index"),
            {
                status: filterStatus,
                type: filterType,
                sort_field: sortField,
                sort_direction: sortDirection,
            },
            { preserveState: true, preserveScroll: true }
        );
    }, [filterStatus, filterType, sortField, sortDirection]);

    // Sort handler
    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    // Pagination handler
    const handlePageChange = (url) => {
        router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    // Bulk actions
    const handleSelectAll = () => {
        if (selectedProducts.length === products.data.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(products.data.map((p) => p.id));
        }
    };

    const handleSelectProduct = (productId) => {
        setSelectedProducts((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };

    // Delete handler
    const handleDelete = (productId) => {
        if (confirm(t("Are you sure you want to delete this product?"))) {
            router.delete(route("admin.products.destroy", productId));
        }
    };

    // Restore handler
    const handleRestore = (productId) => {
        if (confirm(t("Are you sure you want to restore this product?"))) {
            router.patch(route("admin.products.restore", productId));
        }
    };

    // Force Delete handler
    const handleForceDelete = (productId) => {
        if (confirm(t("Are you sure you want to permanently delete this product? This action cannot be undone."))) {
            router.delete(route("admin.products.force-delete", productId));
        }
    };

    // Initialize animations
    useEffect(() => {
        if (!isAnimated) {
            // Animate header
            anime({
                targets: headerRef.current,
                opacity: [0, 1],
                translateY: [-30, 0],
                duration: 800,
                easing: "easeOutExpo",
            });

            // Animate stats
            anime({
                targets: statsRef.current?.children,
                opacity: [0, 1],
                translateY: [20, 0],
                delay: anime.stagger(100),
                duration: 600,
                easing: "easeOutExpo",
            });

            // Animate table
            anime({
                targets: tableRef.current,
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 700,
                easing: "easeOutExpo",
                delay: 400,
            });

            setIsAnimated(true);
        }
    }, [isAnimated]);

    // Simulate loading delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title={t("Products")}>
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
                        0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
                        50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.6); }
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
                                    linear-gradient(45deg, #6366f1, #8b5cf6) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #6366f1, #8b5cf6) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={Package} color="indigo" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.products" />

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
                                    className="relative"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-2xl blur-lg opacity-60 dark:opacity-40"></div>
                                    <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 p-4 rounded-2xl shadow-2xl">
                                        <Package className="w-8 h-8 text-white" />
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
                                        {t("Product Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent"
                                    >
                                        {t("Products")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        {t("Manage your product inventory")}
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
                                    className="gap-2 hover:scale-105 transition-all duration-200 border-slate-300 dark:border-slate-600 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 text-slate-700 dark:text-slate-200 hover:text-green-700 dark:hover:text-green-300"
                                >
                                    <Download className="h-4 w-4" />
                                    {t("Export")}
                                </Button>
                                <Link href={route("admin.products.create")}> 
                                    <Button className="gap-2 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border-0">
                                        <Plus className="h-4 w-4" />
                                        {t("Add Product")}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-indigo-300 dark:scrollbar-thumb-indigo-700 scrollbar-track-transparent">
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
                                        transition={{
                                            delay: 0.9,
                                            duration: 0.4,
                                        }}
                                    >
                                        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Total Products")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t("In inventory")}
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
                                        transition={{
                                            delay: 1.0,
                                            duration: 0.4,
                                        }}
                                    >
                                        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Active Products")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t("Currently active")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl">
                                                        <CheckCircle className="h-8 w-8 text-green-600" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            delay: 1.1,
                                            duration: 0.4,
                                        }}
                                    >
                                        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("In Stock")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-indigo-600">{stats.inStock}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t("Available")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl">
                                                        <ShoppingCart className="h-8 w-8 text-indigo-600" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            delay: 1.2,
                                            duration: 0.4,
                                        }}
                                    >
                                        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Total Value")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-purple-600">
                                                            ${stats.totalValue.toLocaleString()}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t("Inventory value")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl">
                                                        <DollarSign className="h-8 w-8 text-purple-600" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>

                                {/* Search */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.3, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardContent className="p-6">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                <Input
                                                    placeholder={t("Search products...")}
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-12 h-12 text-lg border-2 border-green-200 focus:border-green-500 rounded-xl"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Products Table */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.4, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-3">
                                                <Package className="h-5 w-5 text-green-600" />
                                                {t("Product List")}
                                                <Badge variant="secondary">{products.total} {t("total")}</Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700">
                                                            <TableHead 
                                                                className="cursor-pointer hover:text-green-600 transition-colors py-4 px-6 font-semibold text-gray-700 dark:text-gray-200"
                                                                onClick={() => handleSort("name")}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Package className="h-4 w-4 text-green-600" />
                                                                    {t("Product")}
                                                                    <ArrowUpDown className="h-3 w-3 opacity-50" />
                                                                </div>
                                                            </TableHead>
                                                            <TableHead 
                                                                className="cursor-pointer hover:text-green-600 transition-colors py-4 px-6 font-semibold text-gray-700 dark:text-gray-200"
                                                                onClick={() => handleSort("type")}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Tag className="h-4 w-4 text-green-600" />
                                                                    {t("Type")}
                                                                    <ArrowUpDown className="h-3 w-3 opacity-50" />
                                                                </div>
                                                            </TableHead>
                                                            <TableHead 
                                                                className="cursor-pointer hover:text-green-600 transition-colors py-4 px-6 font-semibold text-gray-700 dark:text-gray-200"
                                                                onClick={() => handleSort("barcode")}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Barcode className="h-4 w-4 text-green-600" />
                                                                    {t("Barcode")}
                                                                    <ArrowUpDown className="h-3 w-3 opacity-50" />
                                                                </div>
                                                            </TableHead>
                                                            <TableHead 
                                                                className="cursor-pointer hover:text-green-600 transition-colors py-4 px-6 font-semibold text-gray-700 dark:text-gray-200"
                                                                onClick={() => handleSort("purchase_price")}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <DollarSign className="h-4 w-4 text-green-600" />
                                                                    {t("Purchase")}
                                                                    <ArrowUpDown className="h-3 w-3 opacity-50" />
                                                                </div>
                                                            </TableHead>
                                                            <TableHead 
                                                                className="cursor-pointer hover:text-green-600 transition-colors py-4 px-6 font-semibold text-gray-700 dark:text-gray-200"
                                                                onClick={() => handleSort("retail_price")}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <ShoppingCart className="h-4 w-4 text-green-600" />
                                                                    {t("Retail")}
                                                                    <ArrowUpDown className="h-3 w-3 opacity-50" />
                                                                </div>
                                                            </TableHead>
                                                            <TableHead 
                                                                className="cursor-pointer hover:text-green-600 transition-colors py-4 px-6 font-semibold text-gray-700 dark:text-gray-200"
                                                                onClick={() => handleSort("whole_sale_unit_amount")}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Package className="h-4 w-4 text-green-600" />
                                                                    {t("Wholesale Unit")}
                                                                    <ArrowUpDown className="h-3 w-3 opacity-50" />
                                                                </div>
                                                            </TableHead>
                                                            <TableHead className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-200 text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <Settings className="h-4 w-4 text-green-600" />
                                                                    {t("Actions")}
                                                                </div>
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {products.data.length > 0 ? (
                                                            products.data.map((product) => (
                                                                <TableRow key={product.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-all duration-200 border-b border-gray-100 dark:border-slate-700">
                                                                    <TableCell className="py-4 px-6">
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl shadow-sm">
                                                                                <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
                                                                            </div>
                                                                            <div>
                                                                                <div className="font-semibold text-gray-900 dark:text-white text-base mb-1">
                                                                                    {product.name}
                                                                                </div>
                                                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                                    {product.wholesaleUnit?.name} / {product.retailUnit?.name}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="py-4 px-6">
                                                                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-600 px-3 py-2 text-sm font-medium">
                                                                            {product.type}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="py-4 px-6">
                                                                        <div className="font-mono text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-3 py-2 rounded-lg">
                                                                            {product.barcode || "—"}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="py-4 px-6 font-bold text-gray-900 dark:text-white">
                                                                        ${parseFloat(product.purchase_price || 0).toLocaleString()}
                                                                    </TableCell>
                                                                    <TableCell className="py-4 px-6 font-bold text-green-600 dark:text-green-400">
                                                                        ${parseFloat(product.retail_price || 0).toLocaleString()}
                                                                    </TableCell>
                                                                    <TableCell className="py-4 px-6 font-bold text-blue-600 dark:text-blue-400">
                                                                        {product.whole_sale_unit_amount
                                                                            ? `${parseFloat(product.whole_sale_unit_amount).toLocaleString()} ${product.wholesaleUnit?.name || ""}`
                                                                            : "—"}
                                                                    </TableCell>
                                                                    <TableCell className="py-4 px-6 text-right">
                                                                        <div className="flex items-center justify-end gap-3">
                                                                            {!product.deleted_at && permissions.view_product && (
                                                                                <Link href={route("admin.products.edit", product.id)}>
                                                                                    <Button 
                                                                                        size="default" 
                                                                                        variant="outline" 
                                                                                        className="h-12 w-12 p-0 border-gray-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 shadow-sm hover:shadow-md"
                                                                                        title={t("Edit Product")}
                                                                                    >
                                                                                        <Edit className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                                                                                    </Button>
                                                                                </Link>
                                                                            )}
                                                                            {!product.deleted_at && permissions.delete_product && (
                                                                                <Button
                                                                                    size="default"
                                                                                    variant="outline"
                                                                                    className="h-12 w-12 p-0 border-gray-300 dark:border-slate-600 hover:border-red-500 dark:hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 shadow-sm hover:shadow-md"
                                                                                    onClick={() => handleDelete(product.id)}
                                                                                    title={t("Delete Product")}
                                                                                >
                                                                                    <Trash2 className="h-7 w-7 text-red-600 dark:text-red-400" />
                                                                                </Button>
                                                                            )}
                                                                            {product.deleted_at && permissions.restore_product && (
                                                                                <Button
                                                                                    size="default"
                                                                                    variant="outline"
                                                                                    className="h-12 w-12 p-0 border-gray-300 dark:border-slate-600 hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 shadow-sm hover:shadow-md"
                                                                                    onClick={() => handleRestore(product.id)}
                                                                                    title={t("Restore Product")}
                                                                                >
                                                                                    <RotateCcw className="h-7 w-7 text-green-600 dark:text-green-400" />
                                                                                </Button>
                                                                            )}
                                                                            {product.deleted_at && permissions.force_delete_product && (
                                                                                <Button
                                                                                    size="default"
                                                                                    variant="outline"
                                                                                    className="h-12 w-12 p-0 border-gray-300 dark:border-slate-600 hover:border-red-600 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 shadow-sm hover:shadow-md"
                                                                                    onClick={() => handleForceDelete(product.id)}
                                                                                    title={t("Permanently Delete Product")}
                                                                                >
                                                                                    <XOctagon className="h-7 w-7 text-red-700 dark:text-red-500" />
                                                                                </Button>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan="7" className="h-32 text-center">
                                                                    <div className="flex flex-col items-center gap-4">
                                                                        <Package className="h-8 w-8 text-slate-400" />
                                                                        <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                                                            {t("No products found")}
                                                                        </p>
                                                                        <Link href={route("admin.products.create")}>
                                                                            <Button className="gap-2">
                                                                                <Plus className="h-4 w-4" />
                                                                                {t("Create First Product")}
                                                                            </Button>
                                                                        </Link>
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

                                {/* Pagination */}
                                {products?.links && products.links.length > 3 && (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.5, duration: 0.4 }}
                                        className="flex flex-col items-center space-y-4"
                                    >
                                        <div className="text-sm text-slate-600 dark:text-slate-400">
                                            {t("Showing")} {products.from} {t("to")} {products.to} {t("of")} {products.total} {t("results")}
                                        </div>
                                        <div className="flex items-center space-x-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-green-100 dark:border-green-900/30">
                                            {products.links.map((link, index) => {
                                                if (link.label.includes('Previous')) {
                                                    return (
                                                        <Link
                                                            key={index}
                                                            href={link.url || '#'}
                                                            className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                                                                link.url
                                                                    ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30'
                                                                    : 'text-gray-400 cursor-not-allowed'
                                                            }`}
                                                        >
                                                            <ChevronRight className="h-4 w-4" />
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
                                                                    ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30'
                                                                    : 'text-gray-400 cursor-not-allowed'
                                                            }`}
                                                        >
                                                            <span className="mr-1 hidden sm:inline">{t('Next')}</span>
                                                            <ChevronLeft className="h-4 w-4" />
                                                        </Link>
                                                    );
                                                }
                                                return (
                                                    <Link
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                                                            link.active
                                                                ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-lg'
                                                                : link.url
                                                                    ? 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30'
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
