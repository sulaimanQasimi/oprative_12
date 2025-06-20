import React, { useState, useEffect, useRef, useMemo, Component } from "react";
import { Head, Link } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    Search,
    TrendingUp,
    ChevronRight,
    Plus,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    Calendar,
    Clock,
    Download,
    MoreHorizontal,
    ExternalLink,
    Tag,
    User,
    CreditCard,
    DollarSign,
    Mail,
    Settings,
    Inbox,
    ChevronDown,
    Eye,
    RefreshCw,
    Sliders,
    ShoppingCart,
    Package,
    UserCheck,
    Layers,
    PieChart,
    Grid,
    List,
    LayoutGrid,
    AlertTriangle,
    Sparkles,
    X,
    Info,
} from "lucide-react";
import anime from "animejs";
import Navigation from "@/Components/Warehouse/Navigation";
import { motion, AnimatePresence } from "framer-motion";

// Safe querySelector utility function that checks if element exists
const safeQuerySelector = (element, selector) => {
    if (!element || !selector) return null;
    try {
        return element.querySelector(selector);
    } catch (error) {
        console.error("Error in querySelector:", error);
        return null;
    }
};

// AnimatedCounter component
const AnimatedCounter = ({
    value,
    prefix = "",
    suffix = "",
    duration = 1500,
}) => {
    const nodeRef = useRef(null);
    const [counted, setCounted] = useState(false);
    
    useEffect(() => {
        if (!counted && nodeRef.current) {
            anime({
                targets: nodeRef.current,
                innerHTML: [0, value],
                easing: "easeInOutExpo",
                duration: duration,
                round: 1,
                delay: 300,
                begin: () => setCounted(true),
            });
        }
    }, [value, counted, duration]);
    
    return (
        <span className="inline-block" ref={nodeRef}>
            {prefix}0{suffix}
        </span>
    );
};

// PageLoader component
const PageLoader = ({ isVisible }) => {
    const { t } = useLaravelReactI18n();
    
    return (
        <motion.div
            className="fixed inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 z-50 flex flex-col items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? "all" : "none",
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
            <div className="absolute w-full h-full overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-gradient-to-r from-emerald-400/10 via-teal-500/10 to-transparent h-[30vh] w-[100vw]"
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
            <div className="relative z-10 flex flex-col items-center">
                <motion.div
                    className="relative bg-gradient-to-br from-emerald-500 to-teal-600 h-20 w-20 rounded-2xl flex items-center justify-center shadow-xl"
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
    );
};

// Error Boundary Component
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Product component error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        const { t } = this.props.i18n;
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/50 my-4">
                    <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
                        {t("Something went wrong.")}
                    </h2>
                    <p className="text-red-600 dark:text-red-300">
                        {t("There was an error loading the products. Please try refreshing the page.")}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    >
                        {t("Refresh Page")}
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default function Products({ auth, products }) {
    const { t } = useLaravelReactI18n();
    const [searchTerm, setSearchTerm] = useState("");
    const [view, setView] = useState("grid");
    const [isAnimated, setIsAnimated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(products || []);

    // Calculate total inventory value using useMemo
    const totalValue = useMemo(() => {
        if (!products || !Array.isArray(products) || products.length === 0)
            return 0;
        return products.reduce((sum, product) => {
            if (!product) return sum;
            const quantity = typeof product.net_quantity === "number" ? product.net_quantity : 0;
            const price = typeof product.income_price === "number" ? product.income_price : 0;
            return sum + quantity * price;
        }, 0);
    }, [products]);

    // Count low stock products using useMemo
    const lowStockCount = useMemo(() => {
        if (!products || !Array.isArray(products) || products.length === 0)
            return 0;
        return products.filter((product) => {
            if (!product) return false;
            const quantity = typeof product.net_quantity === "number" ? product.net_quantity : 0;
            return quantity < 10;
        }).length;
    }, [products]);

    // Get unique product categories using useMemo
    const categories = useMemo(() => {
        if (!products || !Array.isArray(products) || products.length === 0)
            return [];
        return Array.from(
            new Set(
                products.map((p) => {
                    if (!p || !p.product) {
                        return "Uncategorized";
                    }
                    const productItem = p.product;
                    if (!productItem || typeof productItem.type !== "string") {
                        return "Uncategorized";
                    }
                    return productItem.type || "Uncategorized";
                })
            )
        );
    }, [products]);

    // Enhanced filtering logic
    useEffect(() => {
        let filtered = [...(products || [])];
        
        // Search filter
        if (searchTerm) {
            filtered = filtered.filter((product) => {
                if (!product || !product.product) {
                    return false;
                }
                const productItem = product.product;
                const nameMatch = productItem.name?.toLowerCase().includes(searchTerm.toLowerCase());
                const barcodeMatch = productItem.barcode?.toLowerCase().includes(searchTerm.toLowerCase());
                return nameMatch || barcodeMatch;
            });
        }
        
        // Category filter
        if (categoryFilter) {
            filtered = filtered.filter((product) => {
                if (!product || !product.product) {
                    return false;
                }
                const productItem = product.product;
                return productItem.type === categoryFilter;
            });
        }
        
        // Sorting
        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];
            if (sortBy === 'product.name') {
                aValue = a.product?.name || '';
                bValue = b.product?.name || '';
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
        
        setFilteredProducts(filtered);
    }, [searchTerm, categoryFilter, sortBy, sortOrder, products]);

    const clearFilters = () => {
        setSearchTerm("");
        setCategoryFilter("");
        setSortBy("created_at");
        setSortOrder("desc");
    };

    // Add useEffect to handle page loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title={t("Warehouse Products")} />
            <PageLoader isVisible={loading} />
            
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: loading ? 0 : 1 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                <Navigation auth={auth} currentRoute="warehouse.products" />
                
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="bg-white/10 backdrop-blur-lg border-b border-white/20 dark:border-slate-700/50 py-6 px-8 sticky top-0 z-30"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 p-4 rounded-2xl shadow-2xl">
                                        <Package className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {t("Warehouse Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 bg-clip-text text-transparent"
                                    >
                                        {t("Products Inventory")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        {t("Manage and track your product inventory")}
                                    </motion.p>
                                </div>
                            </div>
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                {/* Buttons removed as requested */}
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-emerald-300 dark:scrollbar-thumb-emerald-700 scrollbar-track-transparent">
                        {/* Dashboard Stats Section */}
                        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 relative flex-shrink-0">
                            <div className="relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover:scale-105 transition-all duration-300">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                        {t("Total Value")}
                                                    </p>
                                                    <p className="text-3xl font-bold text-emerald-600">
                                                        ${totalValue.toFixed(2)}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {t("Inventory value")}
                                                    </p>
                                                </div>
                                                <div className="p-4 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-2xl">
                                                    <DollarSign className="h-8 w-8 text-emerald-600" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover:scale-105 transition-all duration-300">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                        {t("Total Products")}
                                                    </p>
                                                    <p className="text-3xl font-bold text-blue-600">
                                                        {products?.length || 0}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {t("Product variants")}
                                                    </p>
                                                </div>
                                                <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl">
                                                    <Package className="h-8 w-8 text-blue-600" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover:scale-105 transition-all duration-300">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                        {t("Low Stock")}
                                                    </p>
                                                    <p className="text-3xl font-bold text-orange-600">
                                                        {lowStockCount}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {t("Items need restock")}
                                                    </p>
                                                </div>
                                                <div className="p-4 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-2xl">
                                                    <AlertTriangle className="h-8 w-8 text-orange-600" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover:scale-105 transition-all duration-300">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                        {t("Categories")}
                                                    </p>
                                                    <p className="text-3xl font-bold text-purple-600">
                                                        {categories.length}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {t("Product types")}
                                                    </p>
                                                </div>
                                                <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl">
                                                    <PieChart className="h-8 w-8 text-purple-600" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>

                        {/* Search and Filters Section */}
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="space-y-8"
                            >
                                {/* Search & Filter Card */}
                                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                    <CardHeader className="bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-emerald-500/20 border-b border-white/30 dark:border-slate-700/50">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
                                                    <Filter className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Search & Filter")}
                                            </CardTitle>
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowFilters(!showFilters)}
                                                className="gap-2"
                                            >
                                                <Filter className="h-4 w-4" />
                                                {showFilters ? t("Hide Filters") : t("Show Filters")}
                                                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        {/* Search Bar */}
                                        <div className="mb-4">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                <Input
                                                    placeholder={t("Search products by name or barcode...")}
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-12 h-12 text-lg border-2 border-emerald-200 focus:border-emerald-500 rounded-xl"
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
                                        <AnimatePresence>
                                            {showFilters && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                {t("Category")}
                                                            </label>
                                                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                                                <SelectTrigger className="h-10">
                                                                    <SelectValue placeholder={t("All Categories")} />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="">{t("All Categories")}</SelectItem>
                                                                    {categories.map((category) => (
                                                                        <SelectItem key={category} value={category}>
                                                                            {category}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                {t("Sort By")}
                                                            </label>
                                                            <Select value={sortBy} onValueChange={setSortBy}>
                                                                <SelectTrigger className="h-10">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="created_at">{t("Date Created")}</SelectItem>
                                                                    <SelectItem value="product.name">{t("Product Name")}</SelectItem>
                                                                    <SelectItem value="net_quantity">{t("Stock Quantity")}</SelectItem>
                                                                    <SelectItem value="income_price">{t("Price")}</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                {t("Sort Order")}
                                                            </label>
                                                            <Select value={sortOrder} onValueChange={setSortOrder}>
                                                                <SelectTrigger className="h-10">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="desc">{t("Descending")}</SelectItem>
                                                                    <SelectItem value="asc">{t("Ascending")}</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="flex items-end">
                                                            <Button
                                                                variant="outline"
                                                                onClick={clearFilters}
                                                                className="w-full h-10 gap-2"
                                                            >
                                                                <RefreshCw className="h-4 w-4" />
                                                                {t("Clear Filters")}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </CardContent>
                                </Card>

                                {/* View Toggle */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        {searchTerm && (
                                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 animate-pulse">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                                <p>
                                                    {t("Showing results for:")}{" "}
                                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                                        {searchTerm}
                                                    </span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex items-center gap-1.5 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-lg"
                                        >
                                            <RefreshCw className="h-3.5 w-3.5" />
                                            <span>{t("Refresh")}</span>
                                        </Button>
                                        <Tabs defaultValue="grid" className="w-auto">
                                            <TabsList className="p-1 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg">
                                                <TabsTrigger
                                                    value="grid"
                                                    className="px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:dark:bg-slate-900 data-[state=active]:shadow-sm rounded-md transition-all"
                                                >
                                                    <LayoutGrid className="h-4 w-4" />
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="list"
                                                    className="px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:dark:bg-slate-900 data-[state=active]:shadow-sm rounded-md transition-all"
                                                >
                                                    <List className="h-4 w-4" />
                                                </TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>
                                </div>

                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center mb-6">
                                    {searchTerm ? t("Search Results") : t("Products Inventory")}
                                </h2>

                                {/* Products Grid/List */}
                                <Tabs value={view}>
                                    <TabsContent value="grid" className="mt-0">
                                        {filteredProducts && filteredProducts.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {filteredProducts.map((product, index) => (
                                                    <motion.div
                                                        key={product.product_id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                                    >
                                                        <Card className="bg-white dark:bg-slate-900 border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full">
                                                            <div className="flex justify-between items-start p-5 pb-3">
                                                                <div className="flex gap-3 items-start">
                                                                    <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                                                                        <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                                                                            {product.product?.name || t("Unnamed Product")}
                                                                        </h3>
                                                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                            {t("ID")}: {product.product_id}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full font-medium border-0">
                                                                    {product.product?.type || t("Item")}
                                                                </Badge>
                                                            </div>
                                                            <CardContent className="px-5 pt-0 pb-3">
                                                                <div className="mt-3 space-y-3">
                                                                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                                        <div>
                                                                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                                                {t("Stock")}
                                                                            </p>
                                                                            <p className={`text-xl font-bold ${product.net_quantity < 10 ? "text-amber-600 dark:text-amber-500" : "text-emerald-600 dark:text-emerald-400"}`}>
                                                                                {product.net_quantity}
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                                                {t("Price")}
                                                                            </p>
                                                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                                                ${product.income_price}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {/* Units Information */}
                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                                            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                                                                {t("Wholesale Unit")}
                                                                            </p>
                                                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                                                {product.product?.wholesaleUnit
                                                                                    ? `${product.product.wholesaleUnit.name} (${product.product.wholesaleUnit.symbol})`
                                                                                    : t("N/A")}
                                                                            </p>
                                                                            {product.product?.whole_sale_unit_amount && (
                                                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                                    {product.product.whole_sale_unit_amount} {t("units")}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                                            <p className="text-xs font-medium text-green-600 dark:text-green-400">
                                                                                {t("Retail Unit")}
                                                                            </p>
                                                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                                                {product.product?.retailUnit
                                                                                    ? `${product.product.retailUnit.name} (${product.product.retailUnit.symbol})`
                                                                                    : t("N/A")}
                                                                            </p>
                                                                            {product.product?.retails_sale_unit_amount && (
                                                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                                    {product.product.retails_sale_unit_amount} {t("units")}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                            <CardFooter className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 px-2 h-8"
                                                                >
                                                                    <Eye className="h-3.5 w-3.5" />
                                                                    <span>{t("View")}</span>
                                                                </Button>
                                                                <Button
                                                                    variant="default"
                                                                    size="sm"
                                                                    className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg h-8"
                                                                >
                                                                    {t("Details")}
                                                                </Button>
                                                            </CardFooter>
                                                        </Card>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3 }}
                                                className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 text-center"
                                            >
                                                <div className="inline-flex h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center mb-5">
                                                    <Package className="h-8 w-8 text-slate-400" />
                                                </div>
                                                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                                                    {t("No products found")}
                                                </h3>
                                                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                                                    {searchTerm 
                                                        ? t("Try adjusting your search criteria or check for typos.")
                                                        : t("No products have been added yet.")}
                                                </p>
                                            </motion.div>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
} 