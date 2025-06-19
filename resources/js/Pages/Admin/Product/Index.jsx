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
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
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
    },
    filters = {},
    productTypes = [],
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

    // Pagination handlers
    const handlePageChange = (page) => {
        router.get(
            route("admin.products.index"),
            { page },
            { preserveState: true, preserveScroll: true }
        );
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
                        className="glass-effect border-b border-white/20 dark:border-slate-700/50 py-6 px-8 sticky top-0 z-30"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    initial={{
                                        scale: 0.8,
                                        opacity: 0,
                                        rotate: -180,
                                    }}
                                    animate={{
                                        scale: 1,
                                        opacity: 1,
                                        rotate: 0,
                                    }}
                                    transition={{
                                        delay: 0.3,
                                        duration: 0.6,
                                        type: "spring",
                                        stiffness: 200,
                                    }}
                                    className="relative float-animation"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 p-4 rounded-2xl shadow-2xl">
                                        <Package className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{
                                            delay: 0.4,
                                            duration: 0.4,
                                        }}
                                        className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {t("Product Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{
                                            delay: 0.5,
                                            duration: 0.4,
                                        }}
                                        className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent"
                                    >
                                        {t("Products")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{
                                            delay: 0.6,
                                            duration: 0.4,
                                        }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <BarChart3 className="w-4 h-4" />
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
                                    className="gap-2 hover:scale-105 transition-all duration-200 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                >
                                    <Download className="h-4 w-4" />
                                    {t("Export")}
                                </Button>
                                <Link href={route("admin.products.create")}>
                                    <Button className="gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 text-white hover:scale-105 transition-all duration-200 shadow-lg">
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
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border hover:scale-105 transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t(
                                                                "Total Products"
                                                            )}
                                                        </p>
                                                        <p className="text-3xl font-bold text-indigo-600">
                                                            {stats.total}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {t("In inventory")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl">
                                                        <Package className="h-8 w-8 text-indigo-600" />
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
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border hover:scale-105 transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t(
                                                                "Active Products"
                                                            )}
                                                        </p>
                                                        <p className="text-3xl font-bold text-green-600">
                                                            {stats.active}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {t(
                                                                "Currently active"
                                                            )}
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
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border hover:scale-105 transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("In Stock")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-blue-600">
                                                            {stats.inStock}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {t("Available")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl">
                                                        <ShoppingCart className="h-8 w-8 text-blue-600" />
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
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border hover:scale-105 transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Total Value")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-purple-600">
                                                            $
                                                            {stats.totalValue.toLocaleString()}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {t(
                                                                "Inventory value"
                                                            )}
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

                                {/* Search & Filter Card */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.3, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                                                        <Filter className="h-5 w-5 text-white" />
                                                    </div>
                                                    {t("Search & Filter")}
                                                </CardTitle>
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        setShowFilters(
                                                            !showFilters
                                                        )
                                                    }
                                                    className="gap-2"
                                                >
                                                    <Filter className="h-4 w-4" />
                                                    {showFilters
                                                        ? t("Hide Filters")
                                                        : t("Show Filters")}
                                                    <ChevronDown
                                                        className={`h-4 w-4 transition-transform ${
                                                            showFilters
                                                                ? "rotate-180"
                                                                : ""
                                                        }`}
                                                    />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            {/* Search Bar */}
                                            <div className="mb-4">
                                                <div className="relative w-full">
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                    <Input
                                                        placeholder={t(
                                                            "Search by name, barcode, or type..."
                                                        )}
                                                        value={searchTerm}
                                                        onChange={(e) =>
                                                            setSearchTerm(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="pl-12 h-12 text-lg border-2 border-indigo-200 focus:border-indigo-500 rounded-xl w-full"
                                                    />
                                                    {searchTerm && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                setSearchTerm(
                                                                    ""
                                                                )
                                                            }
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
                                                        initial={{
                                                            height: 0,
                                                            opacity: 0,
                                                        }}
                                                        animate={{
                                                            height: "auto",
                                                            opacity: 1,
                                                        }}
                                                        exit={{
                                                            height: 0,
                                                            opacity: 0,
                                                        }}
                                                        transition={{
                                                            duration: 0.3,
                                                        }}
                                                        className="relative"
                                                    >
                                                        <div className=" grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                                            <div className="relative">
                                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                    {t(
                                                                        "Status"
                                                                    )}
                                                                </label>
                                                                <Select
                                                                    value={
                                                                        filterStatus
                                                                    }
                                                                    onValueChange={
                                                                        setFilterStatus
                                                                    }
                                                                >
                                                                    <SelectTrigger className="h-10 w-full">
                                                                        <SelectValue>
                                                                            {statusOptions.find(
                                                                                (
                                                                                    option
                                                                                ) =>
                                                                                    option.value ===
                                                                                    filterStatus
                                                                            )
                                                                                ?.label ||
                                                                                t(
                                                                                    "Select status"
                                                                                )}
                                                                        </SelectValue>
                                                                    </SelectTrigger>
                                                                    <SelectContent
                                                                        position="popper"
                                                                        sideOffset={
                                                                            5
                                                                        }
                                                                        className="z-[9999]"
                                                                        style={{
                                                                            position:
                                                                                "fixed",
                                                                            bottom: 0,
                                                                            width: "var(--radix-select-trigger-width)",
                                                                            zIndex: 9999,
                                                                        }}
                                                                    >
                                                                        {statusOptions.map(
                                                                            (
                                                                                option
                                                                            ) => (
                                                                                <SelectItem
                                                                                    key={
                                                                                        option.value
                                                                                    }
                                                                                    value={
                                                                                        option.value
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        option.label
                                                                                    }
                                                                                </SelectItem>
                                                                            )
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className="relative">
                                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                    {t("Type")}
                                                                </label>
                                                                <Select
                                                                    value={
                                                                        filterType
                                                                    }
                                                                    onValueChange={
                                                                        setFilterType
                                                                    }
                                                                >
                                                                    <SelectTrigger className="h-10 w-full">
                                                                        <SelectValue>
                                                                            {filterType ===
                                                                            "all"
                                                                                ? t(
                                                                                      "All Types"
                                                                                  )
                                                                                : filterType ||
                                                                                  t(
                                                                                      "Select type"
                                                                                  )}
                                                                        </SelectValue>
                                                                    </SelectTrigger>
                                                                    <SelectContent
                                                                        position="popper"
                                                                        sideOffset={
                                                                            5
                                                                        }
                                                                        className="z-[9999]"
                                                                        style={{
                                                                            position:
                                                                                "fixed",
                                                                            bottom: 0,
                                                                            width: "var(--radix-select-trigger-width)",
                                                                            zIndex: 9999,
                                                                        }}
                                                                    >
                                                                        <SelectItem value="all">
                                                                            {t(
                                                                                "All Types"
                                                                            )}
                                                                        </SelectItem>
                                                                        {Array.isArray(
                                                                            productTypes
                                                                        ) &&
                                                                            productTypes.map(
                                                                                (
                                                                                    type
                                                                                ) => (
                                                                                    <SelectItem
                                                                                        key={
                                                                                            type
                                                                                        }
                                                                                        value={
                                                                                            type
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            type
                                                                                        }
                                                                                    </SelectItem>
                                                                                )
                                                                            )}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className="flex items-end">
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        setFilterStatus(
                                                                            "all"
                                                                        );
                                                                        setFilterType(
                                                                            "all"
                                                                        );
                                                                        setSearchTerm(
                                                                            ""
                                                                        );
                                                                    }}
                                                                    className="w-full h-10 gap-2"
                                                                >
                                                                    <RefreshCw className="h-4 w-4" />
                                                                    {t(
                                                                        "Clear Filters"
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Products Table */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.4, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                                                    <Package className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Product List")}
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-auto"
                                                >
                                                    {products.total}{" "}
                                                    {t("total")}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="bg-slate-50 dark:bg-slate-900/50">
                                                            <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        selectedProducts.length ===
                                                                        products
                                                                            .data
                                                                            .length
                                                                    }
                                                                    onChange={
                                                                        handleSelectAll
                                                                    }
                                                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 scale-110"
                                                                />
                                                            </th>
                                                            <th
                                                                className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors group"
                                                                onClick={() =>
                                                                    handleSort(
                                                                        "name"
                                                                    )
                                                                }
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Package className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                                    <span>
                                                                        {t(
                                                                            "Product"
                                                                        )}
                                                                    </span>
                                                                    <ArrowUpDown className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                                                                </div>
                                                            </th>
                                                            <th
                                                                className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors group"
                                                                onClick={() =>
                                                                    handleSort(
                                                                        "type"
                                                                    )
                                                                }
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Tag className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                                    <span>
                                                                        {t(
                                                                            "Type"
                                                                        )}
                                                                    </span>
                                                                    <ArrowUpDown className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                                                                </div>
                                                            </th>
                                                            <th
                                                                className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors group"
                                                                onClick={() =>
                                                                    handleSort(
                                                                        "barcode"
                                                                    )
                                                                }
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Barcode className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                                    <span>
                                                                        {t(
                                                                            "Barcode"
                                                                        )}
                                                                    </span>
                                                                    <ArrowUpDown className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                                                                </div>
                                                            </th>
                                                            <th
                                                                className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors group"
                                                                onClick={() =>
                                                                    handleSort(
                                                                        "purchase_price"
                                                                    )
                                                                }
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <DollarSign className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                                    <span>
                                                                        {t(
                                                                            "Purchase"
                                                                        )}
                                                                    </span>
                                                                    <ArrowUpDown className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                                                                </div>
                                                            </th>
                                                            <th
                                                                className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors group"
                                                                onClick={() =>
                                                                    handleSort(
                                                                        "retail_price"
                                                                    )
                                                                }
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <ShoppingCart className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                                    <span>
                                                                        {t(
                                                                            "Retail"
                                                                        )}
                                                                    </span>
                                                                    <ArrowUpDown className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                                                                </div>
                                                            </th>
                                                            <th
                                                                className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors group"
                                                                onClick={() =>
                                                                    handleSort(
                                                                        "whole_sale_unit_amount"
                                                                    )
                                                                }
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Package className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                                    <span>
                                                                        {t(
                                                                            "Wholesale Unit"
                                                                        )}
                                                                    </span>
                                                                    <ArrowUpDown className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                                                                </div>
                                                            </th>
                                                            <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                                                {t("Actions")}
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                        <AnimatePresence>
                                                            {products.data.map(
                                                                (
                                                                    product,
                                                                    index
                                                                ) => (
                                                                    <motion.tr
                                                                        key={
                                                                            product.id
                                                                        }
                                                                        initial={{
                                                                            opacity: 0,
                                                                            y: 20,
                                                                        }}
                                                                        animate={{
                                                                            opacity: 1,
                                                                            y: 0,
                                                                        }}
                                                                        exit={{
                                                                            opacity: 0,
                                                                            y: -20,
                                                                        }}
                                                                        transition={{
                                                                            duration: 0.3,
                                                                            delay:
                                                                                index *
                                                                                0.05,
                                                                        }}
                                                                        className="hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors"
                                                                    >
                                                                        <td className="px-6 py-5">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={selectedProducts.includes(
                                                                                    product.id
                                                                                )}
                                                                                onChange={() =>
                                                                                    handleSelectProduct(
                                                                                        product.id
                                                                                    )
                                                                                }
                                                                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 scale-110"
                                                                            />
                                                                        </td>
                                                                        <td className="px-6 py-5">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg">
                                                                                    <Package className="h-4 w-4 text-indigo-600" />
                                                                                </div>
                                                                                <div>
                                                                                    <div className="font-bold text-slate-900 dark:text-white text-lg">
                                                                                        {
                                                                                            product.name
                                                                                        }
                                                                                    </div>
                                                                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                                                                        {
                                                                                            product
                                                                                                .wholesaleUnit
                                                                                                ?.name
                                                                                        }{" "}
                                                                                        /{" "}
                                                                                        {
                                                                                            product
                                                                                                .retailUnit
                                                                                                ?.name
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-6 py-5">
                                                                            <Badge
                                                                                variant="outline"
                                                                                className="bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 border-slate-200 dark:from-slate-800 dark:to-slate-700 dark:text-slate-300 dark:border-slate-600 font-medium"
                                                                            >
                                                                                {
                                                                                    product.type
                                                                                }
                                                                            </Badge>
                                                                        </td>
                                                                        <td className="px-6 py-5">
                                                                            <div className="font-mono text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg shadow-inner">
                                                                                {product.barcode ||
                                                                                    "—"}
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-6 py-5">
                                                                            <div className="font-bold text-slate-900 dark:text-white text-lg">
                                                                                $
                                                                                {parseFloat(
                                                                                    product.purchase_price ||
                                                                                        0
                                                                                ).toLocaleString()}
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-6 py-5">
                                                                            <div className="font-bold text-green-600 dark:text-green-400 text-lg">
                                                                                $
                                                                                {parseFloat(
                                                                                    product.retail_price ||
                                                                                        0
                                                                                ).toLocaleString()}
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-6 py-5">
                                                                            <div className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                                                                                {product.whole_sale_unit_amount
                                                                                    ? `${parseFloat(
                                                                                          product.whole_sale_unit_amount
                                                                                      ).toLocaleString()} ${
                                                                                          product
                                                                                              .wholesaleUnit
                                                                                              ?.name ||
                                                                                          ""
                                                                                      }`
                                                                                    : "—"}
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-6 py-5">
                                                                            <div className="flex items-center justify-center gap-2">
                                                                                <Link
                                                                                    href={route(
                                                                                        "admin.products.edit",
                                                                                        product.id
                                                                                    )}
                                                                                >
                                                                                    <Button
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border-indigo-200 dark:hover:bg-indigo-900/30 shadow-sm"
                                                                                    >
                                                                                        <Edit className="h-4 w-4" />
                                                                                    </Button>
                                                                                </Link>
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={() =>
                                                                                        handleDelete(
                                                                                            product.id
                                                                                        )
                                                                                    }
                                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:hover:bg-red-900/30 shadow-sm"
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
                                                                                </Button>
                                                                            </div>
                                                                        </td>
                                                                    </motion.tr>
                                                                )
                                                            )}
                                                        </AnimatePresence>
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Pagination */}
                                            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700">
                                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                    {t("Showing")}{" "}
                                                    {products?.from || 0} -{" "}
                                                    {products?.to || 0}{" "}
                                                    {t("of")}{" "}
                                                    {products?.total || 0}{" "}
                                                    {t("results")}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handlePageChange(1)
                                                        }
                                                        disabled={
                                                            !products?.current_page ||
                                                            products.current_page ===
                                                                1
                                                        }
                                                        className="gap-1"
                                                    >
                                                        <SkipForward className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handlePageChange(
                                                                products.current_page -
                                                                    1
                                                            )
                                                        }
                                                        disabled={
                                                            !products?.current_page ||
                                                            products.current_page ===
                                                                1
                                                        }
                                                        className="gap-1"
                                                    >
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Button>
                                                    {Array.from(
                                                        {
                                                            length:
                                                                products?.last_page ||
                                                                1,
                                                        },
                                                        (_, i) => i + 1
                                                    )
                                                        .filter((page) => {
                                                            const current =
                                                                products?.current_page ||
                                                                1;
                                                            return (
                                                                page === 1 ||
                                                                page ===
                                                                    (products?.last_page ||
                                                                        1) ||
                                                                (page >=
                                                                    current -
                                                                        1 &&
                                                                    page <=
                                                                        current +
                                                                            1)
                                                            );
                                                        })
                                                        .map(
                                                            (
                                                                page,
                                                                index,
                                                                array
                                                            ) => (
                                                                <React.Fragment
                                                                    key={page}
                                                                >
                                                                    {index >
                                                                        0 &&
                                                                        array[
                                                                            index -
                                                                                1
                                                                        ] !==
                                                                            page -
                                                                                1 && (
                                                                            <span className="px-2 text-slate-400">
                                                                                ...
                                                                            </span>
                                                                        )}
                                                                    <Button
                                                                        variant={
                                                                            page ===
                                                                            (products?.current_page ||
                                                                                1)
                                                                                ? "default"
                                                                                : "outline"
                                                                        }
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handlePageChange(
                                                                                page
                                                                            )
                                                                        }
                                                                        className="min-w-[2rem]"
                                                                    >
                                                                        {page}
                                                                    </Button>
                                                                </React.Fragment>
                                                            )
                                                        )}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handlePageChange(
                                                                products.current_page +
                                                                    1
                                                            )
                                                        }
                                                        disabled={
                                                            !products?.current_page ||
                                                            products.current_page ===
                                                                products.last_page
                                                        }
                                                        className="gap-1"
                                                    >
                                                        <ChevronLeft className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handlePageChange(
                                                                products.last_page
                                                            )
                                                        }
                                                        disabled={
                                                            !products?.current_page ||
                                                            products.current_page ===
                                                                products.last_page
                                                        }
                                                        className="gap-1"
                                                    >
                                                        <SkipBack className="h-4 w-4" />
                                                    </Button>
                                                </div>
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
