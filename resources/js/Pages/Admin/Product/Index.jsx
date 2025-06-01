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
    Barcode,
    Tag,
    Scale,
    ShoppingCart,
    Package2,
    Zap,
    RefreshCw,
    Calendar,
    Clock,
    Users,
    Activity,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Separator } from "@/Components/ui/separator";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Index({ auth, products = [] }) {
    const { t } = useLaravelReactI18n();
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [sortField, setSortField] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterType, setFilterType] = useState("all");
    const [selectedProducts, setSelectedProducts] = useState([]);

    // Refs for animation targets
    const headerRef = useRef(null);
    const statsRef = useRef(null);
    const tableRef = useRef(null);

    // Calculate statistics
    const stats = {
        total: products?.length || 0,
        active: products?.filter(p => p.is_activated)?.length || 0,
        inStock: products?.filter(p => p.is_in_stock)?.length || 0,
        trending: products?.filter(p => p.is_trend)?.length || 0,
        totalValue: products?.reduce((sum, p) => sum + (parseFloat(p.retail_price) || 0), 0) || 0,
    };

    // Get unique product types for filter
    const productTypes = [...new Set(products?.map(p => p.type).filter(Boolean))];

    // Filter products based on search term and filters
    const filteredProducts = products
        ? products.filter((product) => {
              const matchesSearch =
                  (product?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (product?.barcode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (product?.type || "").toLowerCase().includes(searchTerm.toLowerCase());

              const matchesStatus = filterStatus === "all" ||
                  (filterStatus === "active" && product.is_activated) ||
                  (filterStatus === "inactive" && !product.is_activated) ||
                  (filterStatus === "in_stock" && product.is_in_stock) ||
                  (filterStatus === "trending" && product.is_trend);

              const matchesType = filterType === "all" || product.type === filterType;

              return matchesSearch && matchesStatus && matchesType;
          })
        : [];

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const aValue = a[sortField] || "";
        const bValue = b[sortField] || "";

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        if (aValue < bValue) {
            return sortDirection === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
    });

    // Sort handler
    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    // Bulk actions
    const handleSelectAll = () => {
        if (selectedProducts.length === sortedProducts.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(sortedProducts.map(p => p.id));
        }
    };

    const handleSelectProduct = (productId) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
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

    const StatCard = ({ icon: Icon, title, value, subtitle, color = "indigo" }) => (
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            {title}
                        </p>
                        <p className={`text-3xl font-bold text-${color}-600 dark:text-${color}-400`}>
                            {typeof value === 'number' && title.includes('Value')
                                ? `$${value.toLocaleString()}`
                                : value.toLocaleString()}
                        </p>
                        {subtitle && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <div className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/30`}>
                        <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <>
            <Head title={t("Product Management")}>
                <style>{`
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    .animate-shimmer {
                        animation: shimmer 3s infinite;
                    }
                    .bg-grid-pattern {
                        background-image:
                            linear-gradient(to right, rgba(0, 0, 0, 0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
                        background-size: 20px 20px;
                    }
                    .dark .bg-grid-pattern {
                        background-image:
                            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
                    }
                    .glass-effect {
                        backdrop-filter: blur(20px);
                        background: rgba(255, 255, 255, 0.8);
                    }
                    .dark .glass-effect {
                        background: rgba(15, 23, 42, 0.8);
                    }
                    .table-row {
                        transition: all 0.3s ease;
                        background: linear-gradient(to right, transparent, transparent);
                    }
                    .table-row:hover {
                        background: linear-gradient(to right, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05));
                        transform: translateX(4px);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }
                    .dark .table-row:hover {
                        background: linear-gradient(to right, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 bg-grid-pattern overflow-hidden">
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.products" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Enhanced Header */}
                    <header
                        ref={headerRef}
                        className="glass-effect border-b border-slate-200/50 dark:border-slate-800/50 py-6 px-8 sticky top-0 z-40"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-25"></div>
                                    <div className="relative bg-white dark:bg-slate-900 p-3 rounded-lg">
                                        <Package className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                            {t("Inventory Management")}
                                        </span>
                                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800">
                                            Live
                                        </Badge>
                                    </div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                                        {t("Product Management")}
                                    </h1>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                        {t("Manage your product catalog and inventory")}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Link href={route("admin.products.create")}>
                                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
                                        <Plus className="h-4 w-4 mr-2" />
                                        {t("Add Product")}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-8 space-y-8">
                            {/* Statistics Cards */}
                            <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                <StatCard
                                    icon={Package}
                                    title={t("Total Products")}
                                    value={stats.total}
                                    subtitle={t("All products in catalog")}
                                    color="indigo"
                                />
                                <StatCard
                                    icon={CheckCircle}
                                    title={t("Active Products")}
                                    value={stats.active}
                                    subtitle={t("Currently available")}
                                    color="green"
                                />
                                <StatCard
                                    icon={Package2}
                                    title={t("In Stock")}
                                    value={stats.inStock}
                                    subtitle={t("Available inventory")}
                                    color="blue"
                                />
                                <StatCard
                                    icon={Zap}
                                    title={t("Trending")}
                                    value={stats.trending}
                                    subtitle={t("Popular products")}
                                    color="orange"
                                />
                                <StatCard
                                    icon={DollarSign}
                                    title={t("Total Value")}
                                    value={stats.totalValue}
                                    subtitle={t("Inventory worth")}
                                    color="emerald"
                                />
                            </div>

                            {/* Enhanced Filters and Search */}
                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                        {/* Search */}
                                        <div className="flex-1 max-w-md">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <input
                                                    type="text"
                                                    placeholder={t("Search products, barcodes, types...")}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                                {searchTerm && (
                                                    <button
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                        onClick={() => setSearchTerm("")}
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Filters */}
                                        <div className="flex items-center gap-3">
                                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                                <SelectTrigger className="w-40">
                                                    <SelectValue placeholder={t("Status")} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">{t("All Status")}</SelectItem>
                                                    <SelectItem value="active">{t("Active")}</SelectItem>
                                                    <SelectItem value="inactive">{t("Inactive")}</SelectItem>
                                                    <SelectItem value="in_stock">{t("In Stock")}</SelectItem>
                                                    <SelectItem value="trending">{t("Trending")}</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Select value={filterType} onValueChange={setFilterType}>
                                                <SelectTrigger className="w-40">
                                                    <SelectValue placeholder={t("Type")} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">{t("All Types")}</SelectItem>
                                                    {productTypes.map(type => (
                                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <Button variant="outline" size="sm">
                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                {t("Refresh")}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Results Summary */}
                                    <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                                        <div>
                                            {t("Showing")} <span className="font-medium">{sortedProducts.length}</span> {t("of")} <span className="font-medium">{products?.length || 0}</span> {t("products")}
                                        </div>
                                        {selectedProducts.length > 0 && (
                                            <div className="flex items-center gap-2">
                                                <span>{selectedProducts.length} {t("selected")}</span>
                                                <Button variant="outline" size="sm">
                                                    {t("Bulk Actions")}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Enhanced Products Table */}
                            <Card ref={tableRef} className="border-0 shadow-xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b-2 border-slate-200 dark:border-slate-600">
                                                <th className="px-6 py-5 text-left">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedProducts.length === sortedProducts.length && sortedProducts.length > 0}
                                                        onChange={handleSelectAll}
                                                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 scale-110"
                                                    />
                                                </th>
                                                <th
                                                    className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors group"
                                                    onClick={() => handleSort("name")}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Package className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                        <span>{t("Product")}</span>
                                                        <ArrowUpDown className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                                                    </div>
                                                </th>
                                                <th
                                                    className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors group"
                                                    onClick={() => handleSort("type")}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Tag className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                        <span>{t("Type")}</span>
                                                        <ArrowUpDown className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                                                    </div>
                                                </th>
                                                <th
                                                    className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors group"
                                                    onClick={() => handleSort("barcode")}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Barcode className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                        <span>{t("Barcode")}</span>
                                                        <ArrowUpDown className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                                                    </div>
                                                </th>
                                                <th
                                                    className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors group"
                                                    onClick={() => handleSort("purchase_price")}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                        <span>{t("Purchase")}</span>
                                                        <ArrowUpDown className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                                                    </div>
                                                </th>
                                                <th
                                                    className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors group"
                                                    onClick={() => handleSort("retail_price")}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <ShoppingCart className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                        <span>{t("Retail")}</span>
                                                        <ArrowUpDown className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                                                    </div>
                                                </th>
                                                <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                                    <div className="flex items-center gap-2">
                                                        <Activity className="h-4 w-4" />
                                                        <span>{t("Status")}</span>
                                                    </div>
                                                </th>
                                                <th className="px-6 py-5 text-center text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Settings className="h-4 w-4" />
                                                        <span>{t("Actions")}</span>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            <AnimatePresence>
                                                {sortedProducts.map((product, index) => (
                                                    <motion.tr
                                                        key={product.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -20 }}
                                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                                        className="table-row rounded-lg"
                                                    >
                                                        <td className="px-6 py-5">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedProducts.includes(product.id)}
                                                                onChange={() => handleSelectProduct(product.id)}
                                                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 scale-110"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-4">
                                                                <div className="relative">
                                                                    <div className="h-14 w-14 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center shadow-md">
                                                                        <Package className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                                                                    </div>
                                                                    {product.is_trend && (
                                                                        <div className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                                                                            <Star className="h-3 w-3 text-white" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-slate-900 dark:text-white text-lg">
                                                                        {product.name}
                                                                    </div>
                                                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                                                        {product.wholesaleUnit?.name} / {product.retailUnit?.name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <Badge variant="outline" className="bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 border-slate-200 dark:from-slate-800 dark:to-slate-700 dark:text-slate-300 dark:border-slate-600 font-medium">
                                                                {product.type}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="font-mono text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg shadow-inner">
                                                                {product.barcode || "—"}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="font-bold text-slate-900 dark:text-white text-lg">
                                                                ${parseFloat(product.purchase_price || 0).toLocaleString()}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="font-bold text-green-600 dark:text-green-400 text-lg">
                                                                ${parseFloat(product.retail_price || 0).toLocaleString()}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="flex flex-wrap gap-2">
                                                                {product.is_activated && (
                                                                    <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300 dark:from-green-900/30 dark:to-green-800/30 dark:text-green-400 dark:border-green-700 shadow-sm">
                                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                                        {t("Active")}
                                                                    </Badge>
                                                                )}
                                                                {product.is_in_stock && (
                                                                    <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-400 dark:border-blue-700 shadow-sm">
                                                                        <Package2 className="h-3 w-3 mr-1" />
                                                                        {t("Stock")}
                                                                    </Badge>
                                                                )}
                                                                {product.is_shipped && (
                                                                    <Badge className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300 dark:from-orange-900/30 dark:to-orange-800/30 dark:text-orange-400 dark:border-orange-700 shadow-sm">
                                                                        {t("Shipped")}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <Link href={route("admin.products.edit", product.id)}>
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
                                                                    onClick={() => handleDelete(product.id)}
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:hover:bg-red-900/30 shadow-sm"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </AnimatePresence>
                                        </tbody>
                                    </table>
                                </div>

                                {sortedProducts.length === 0 && (
                                    <div className="text-center py-16">
                                        <div className="relative inline-block">
                                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur opacity-25"></div>
                                            <div className="relative bg-white dark:bg-slate-900 p-6 rounded-full">
                                                <Package className="h-16 w-16 text-slate-400 mx-auto" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 mt-6">
                                            {t("No products found")}
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                                            {searchTerm || filterStatus !== "all" || filterType !== "all"
                                                ? t("Try adjusting your search or filters to find what you're looking for")
                                                : t("Get started by adding your first product to the inventory")}
                                        </p>
                                        {(!searchTerm && filterStatus === "all" && filterType === "all") && (
                                            <Link href={route("admin.products.create")}>
                                                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    {t("Add Your First Product")}
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
