import React, { useState, useEffect, useRef } from "react";
import { Head, Link } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import {
    User,
    Package,
    TrendingUp,
    ChevronRight,
    DollarSign,
    Layers,
    AlertTriangle,
    TrendingDown,
    BarChart3,
    ArrowUp,
    ArrowDown,
    Percent,
    RefreshCcw,
    Search,
    Plus,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Clock,
    Download,
    MoreHorizontal,
    ExternalLink,
    Tag,
    CreditCard,
    Mail,
    Settings,
    Inbox,
    ChevronDown,
    Eye,
    RefreshCw,
    Sliders,
    ShoppingCart,
    UserCheck,
    Star,
    Check,
    X,
} from "lucide-react";
import anime from "animejs";
import CustomerNavbar from "@/Components/CustomerNavbar";
import { motion } from "framer-motion";
import axios from "axios";

// AnimatedCounter component
const AnimatedCounter = ({
    value,
    prefix = "",
    suffix = "",
    duration = 1500,
}) => {
    const nodeRef = useRef(null);
    const [counted, setCounted] = useState(false);

    // Ensure value is a valid number
    const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;

    useEffect(() => {
        if (!counted && nodeRef.current) {
            anime({
                targets: nodeRef.current,
                innerHTML: [0, safeValue],
                easing: "easeInOutExpo",
                duration: duration,
                round: 1,
                delay: 300,
                begin: () => setCounted(true),
            });
        }
    }, [safeValue, counted, duration]);

    return (
        <span className="inline-block" ref={nodeRef}>
            {prefix}0{suffix}
        </span>
    );
};

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
                            <ShoppingCart className="h-10 w-10 text-white drop-shadow-lg" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default function CustomerDashboard({ auth, stats = {} }) {
    const { t } = useLaravelReactI18n();

    // State for loading and animations
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [dateRange, setDateRange] = useState({ from: '', to: '' });

    // Refs for animation targets
    const headerRef = useRef(null);
    const statsCardsRef = useRef([]);
    const chartsRef = useRef([]);
    const timelineRef = useRef(null);
    const searchInputRef = useRef(null);
    const filterRef = useRef(null);

    // Default stats if not provided
    const defaultStats = {
        total_orders: 0,
        pending_orders: 0,
        total_spent: 0,
        active_subscriptions: 0,
        reward_points: 0,
        monthly_orders: [],
        order_status_distribution: [],
        recent_orders: [],
    };

    // Make sure stats is an object
    const safeStats = typeof stats === "object" && stats !== null ? stats : {};

    // Merge provided stats with defaults
    const mergedStats = {
        ...defaultStats,
        ...safeStats,
    };

    // Format currency values
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(value);
    };

    // Format percent values
    const formatPercent = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "percent",
            minimumFractionDigits: 1,
        }).format(value / 100);
    };

    // Colors for pie chart
    const COLORS = ["#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"];

    // Reset refs when items change
    useEffect(() => {
        // Clear ref arrays when needed
        statsCardsRef.current = [];
        chartsRef.current = [];
    }, []);

    // Initialize animations
    useEffect(() => {
        if (!isAnimated) {
            // Initialize the timeline
            timelineRef.current = anime.timeline({
                easing: "easeOutExpo",
                duration: 800,
            });

            // Animate header
            timelineRef.current.add({
                targets: headerRef.current,
                opacity: [0, 1],
                translateY: [-20, 0],
                duration: 600,
            });

            // Animate stats cards
            timelineRef.current.add(
                {
                    targets: statsCardsRef.current,
                    opacity: [0, 1],
                    translateY: [20, 0],
                    scale: [0.98, 1],
                    delay: anime.stagger(100),
                    duration: 700,
                },
                "-=400"
            );

            // Animate charts
            timelineRef.current.add(
                {
                    targets: chartsRef.current,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    delay: anime.stagger(150),
                    duration: 800,
                },
                "-=600"
            );

            setIsAnimated(true);
        }
    }, [isAnimated]);

    // Simulate loading delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        if (value.length < 2) {
            setShowSearchResults(false);
            setSearchResults([]);
            return;
        }
        
        setIsSearching(true);
        setShowSearchResults(true);
        
        // Use axios to fetch results from the backend using our new endpoint
        const fetchSearchResults = async () => {
            try {
                const response = await axios.get(route('customer.dashboard.search-products', {
                    search: value
                }));
                
                setSearchResults(response.data);
                setIsSearching(false);
            } catch (error) {
                console.error('Error searching:', error);
                setSearchResults([]);
                setIsSearching(false);
            }
        };
        
        // Debounce the search to avoid too many requests
        const timeoutId = setTimeout(() => {
            fetchSearchResults();
        }, 300);
        
        return () => clearTimeout(timeoutId);
    };
    
    // Handle clicking outside to close search results
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle clicking outside to close filter dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilters(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    // Handle date filter change
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prev => ({ ...prev, [name]: value }));
    };
    
    // Apply date filters
    const applyFilters = () => {
        setShowFilters(false);
        setIsRefreshing(true);
        
        // Use Inertia to reload with filters
        window.location.href = route('customer.dashboard', { 
            date_from: dateRange.from, 
            date_to: dateRange.to 
        });
    };
    
    // Clear filters
    const clearFilters = () => {
        setDateRange({ from: '', to: '' });
    };

    // Function to handle dashboard refresh
    const handleRefresh = () => {
        setIsRefreshing(true);
        
        // Reload the page to get fresh data
        window.location.reload();
        
        // Alternative approach using Inertia (uncomment if using Inertia for page refreshes)
        // Inertia.visit(route('customer.dashboard'), {
        //     preserveScroll: true,
        //     onSuccess: () => setIsRefreshing(false),
        //     onError: () => setIsRefreshing(false),
        // });
    };

    return (
        <>
            <Head title={t("Customer Dashboard")}>
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
                    auth={auth || { user: { name: "Customer" } }}
                    currentRoute="customer.dashboard"
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden max-w-full">
                    {/* Header */}
                    <header
                        ref={headerRef}
                        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-0.5">
                                    {t("Customer Portal")}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    {t("Dashboard Overview")}
                                    <Badge
                                        variant="outline"
                                        className="ml-2 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 rounded-full"
                                    >
                                        {auth.user.name}
                                    </Badge>
                                </h1>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            {/* Search Component */}
                            <div className="relative" ref={searchInputRef}>
                                <div className="relative flex items-center">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={t("Search products...")}
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                                    />
                                    {searchTerm && (
                                        <button
                                            className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            onClick={() => setSearchTerm("")}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                
                                {/* Search Results Dropdown */}
                                {showSearchResults && (
                                    <div className="absolute z-20 mt-2 w-full bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
                                        {isSearching ? (
                                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                                {t("Searching...")}
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            <div className="py-2">
                                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    {t("Products")}
                                                </div>
                                                {searchResults.map((product) => (
                                                    <div 
                                                        key={product.id}
                                                        className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-150"
                                                    >
                                                        <div className="flex items-center">
                                                            <div className="mr-3 p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                                                <Package className="h-4 w-4" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center justify-between">
                                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                        {product.name}
                                                                    </p>
                                                                    {product.current_stock > 0 && (
                                                                        <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                                                                            Stock: {product.current_stock}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center justify-between mt-1">
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                        {product.barcode && `Barcode: ${product.barcode}`}
                                                                    </p>
                                                                    {product.retail_price && (
                                                                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                                                            ${product.retail_price}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <Link 
                                                                    href={route("customer.stock-incomes.create", { product_id: product.id })}
                                                                    className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center transition-colors"
                                                                    title="Add Stock"
                                                                >
                                                                    <Plus className="h-4 w-4" />
                                                                </Link>
                                                                {product.current_stock > 0 && (
                                                                    <Link 
                                                                        href={route("customer.stock-outcomes.create", { product_id: product.id })}
                                                                        className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-md flex items-center transition-colors"
                                                                        title="Use Stock"
                                                                    >
                                                                        <ArrowDown className="h-4 w-4" />
                                                                    </Link>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                
                                                <div className="mt-2 px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                                                    <Link
                                                        href={route("customer.stock-products")}
                                                        className="flex items-center justify-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        {t("View All Products")}
                                                    </Link>
                                                </div>
                                            </div>
                                        ) : searchTerm.length > 1 ? (
                                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                                {t("No products found")}
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </div>
                            
                            {/* Filter Button */}
                            <div className="relative" ref={filterRef}>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <Filter className="h-4 w-4" />
                                </Button>
                                
                                {showFilters && (
                                    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-30">
                                        <div className="p-4">
                                            <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                                                {t("Filter Dashboard")}
                                            </h3>
                                            
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                        {t("From Date")}
                                                    </label>
                                                    <input
                                                        type="date"
                                                        name="from"
                                                        value={dateRange.from}
                                                        onChange={handleDateChange}
                                                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                        {t("To Date")}
                                                    </label>
                                                    <input
                                                        type="date"
                                                        name="to"
                                                        value={dateRange.to}
                                                        onChange={handleDateChange}
                                                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700"
                                                    onClick={clearFilters}
                                                >
                                                    {t("Clear")}
                                                </Button>
                                                
                                                <Button
                                                    size="sm"
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                                    onClick={applyFilters}
                                                >
                                                    {t("Apply")}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Refresh Button */}
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 relative"
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                            >
                                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                {isRefreshing && (
                                    <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-blue-500 rounded-full"></span>
                                )}
                            </Button>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {/* Dashboard Stats Section */}
                        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 relative flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-white/30 dark:from-slate-900/30 dark:to-slate-950/30 opacity-80"></div>

                            {/* Animated background elements */}
                            <div className="absolute -left-40 -top-40 w-96 h-96 bg-blue-200/20 dark:bg-blue-900/10 rounded-full filter blur-3xl animate-pulse"></div>
                            <div
                                className="absolute right-20 top-10 w-72 h-72 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full filter blur-3xl animate-pulse"
                                style={{ animationDuration: "15s" }}
                            ></div>
                            <div
                                className="absolute -right-40 -bottom-40 w-80 h-80 bg-blue-200/20 dark:bg-blue-900/10 rounded-full filter blur-3xl animate-pulse"
                                style={{
                                    animationDuration: "20s",
                                    animationDelay: "2s",
                                }}
                            ></div>
                            <div
                                className="absolute left-1/3 bottom-0 w-64 h-64 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full filter blur-3xl animate-pulse"
                                style={{
                                    animationDuration: "18s",
                                    animationDelay: "1s",
                                }}
                            ></div>

                            <div className="relative z-10 max-w-7xl mx-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                                    <motion.div
                                        ref={(el) =>
                                            statsCardsRef.current.push(el)
                                        }
                                        className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 rounded-2xl shadow-lg overflow-hidden relative group"
                                        style={{ perspective: "1000px" }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0 * 0.1,
                                            ease: "easeOut",
                                        }}
                                        whileHover={{
                                            translateY: -8,
                                            transition: { duration: 0.3 },
                                        }}
                                    >
                                        <div className="p-6 relative z-10">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-medium text-lg">
                                                    {t("Total Orders")}
                                                </span>
                                                <div className="p-2.5 bg-white/20 rounded-lg shadow-inner backdrop-blur-sm transform group-hover:rotate-3 transition-transform duration-300 border border-white/10">
                                                    <ShoppingCart className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <div className="text-3xl font-bold mt-2 flex items-end transform group-hover:scale-105 transition-transform origin-left duration-300">
                                                <AnimatedCounter
                                                    value={
                                                        mergedStats.total_orders
                                                    }
                                                    duration={2000}
                                                />
                                            </div>
                                            <div className="mt-4 text-sm flex items-center text-white/90 backdrop-blur-sm bg-white/10 py-1.5 px-3 rounded-lg w-fit group-hover:bg-white/20 transition-colors duration-300 border border-white/10">
                                                <span>
                                                    {mergedStats.pending_orders}{" "}
                                                    {t("pending orders")}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="card-shine"></div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-[1px] opacity-50"></div>
                                        <motion.div
                                            className="absolute right-4 bottom-4 opacity-10"
                                            initial={{
                                                opacity: 0.1,
                                                scale: 0.8,
                                            }}
                                            animate={{
                                                opacity: [0.1, 0.15, 0.1],
                                                scale: [0.8, 0.9, 0.8],
                                            }}
                                            transition={{
                                                duration: 5,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                        >
                                            <ShoppingCart className="h-16 w-16" />
                                        </motion.div>
                                    </motion.div>

                                    <motion.div
                                        ref={(el) =>
                                            statsCardsRef.current.push(el)
                                        }
                                        className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 rounded-2xl shadow-lg overflow-hidden relative group"
                                        style={{ perspective: "1000px" }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 1 * 0.1,
                                            ease: "easeOut",
                                        }}
                                        whileHover={{
                                            translateY: -8,
                                            transition: { duration: 0.3 },
                                        }}
                                    >
                                        <div className="p-6 relative z-10">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-medium text-lg">
                                                    {t("Total Spent")}
                                                </span>
                                                <div className="p-2.5 bg-white/20 rounded-lg shadow-inner backdrop-blur-sm transform group-hover:rotate-3 transition-transform duration-300 border border-white/10">
                                                    <DollarSign className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <div className="text-3xl font-bold mt-2 flex items-end transform group-hover:scale-105 transition-transform origin-left duration-300">
                                                <AnimatedCounter
                                                    value={parseFloat(
                                                        mergedStats.total_spent
                                                    )}
                                                    prefix="$"
                                                    duration={2000}
                                                />
                                            </div>
                                            <div className="mt-4 text-sm flex items-center text-white/90 backdrop-blur-sm bg-white/10 py-1.5 px-3 rounded-lg w-fit group-hover:bg-white/20 transition-colors duration-300 border border-white/10">
                                                <ArrowUp className="h-3.5 w-3.5 mr-1" />
                                                <span>
                                                    +5% {t("from last month")}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="card-shine"></div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-[1px] opacity-50"></div>
                                        <motion.div
                                            className="absolute right-4 bottom-4 opacity-10"
                                            initial={{
                                                opacity: 0.1,
                                                rotate: 0,
                                            }}
                                            animate={{
                                                opacity: [0.1, 0.15, 0.1],
                                                rotate: [0, 5, 0],
                                            }}
                                            transition={{
                                                duration: 6,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                        >
                                            <DollarSign className="h-16 w-16" />
                                        </motion.div>
                                    </motion.div>

                                    <motion.div
                                        ref={(el) =>
                                            statsCardsRef.current.push(el)
                                        }
                                        className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 rounded-2xl shadow-lg overflow-hidden relative group"
                                        style={{ perspective: "1000px" }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 2 * 0.1,
                                            ease: "easeOut",
                                        }}
                                        whileHover={{
                                            translateY: -8,
                                            transition: { duration: 0.3 },
                                        }}
                                    >
                                        <div className="p-6 relative z-10">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-medium text-lg">
                                                    {t("Active Subscriptions")}
                                                </span>
                                                <div className="p-2.5 bg-white/20 rounded-lg shadow-inner backdrop-blur-sm transform group-hover:rotate-3 transition-transform duration-300 border border-white/10">
                                                    <CreditCard className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <div className="text-3xl font-bold mt-2 flex items-end transform group-hover:scale-105 transition-transform origin-left duration-300">
                                                <AnimatedCounter
                                                    value={
                                                        mergedStats.active_subscriptions
                                                    }
                                                    duration={2000}
                                                />
                                            </div>
                                            <div className="mt-4 text-sm flex items-center text-white/90 backdrop-blur-sm bg-white/10 py-1.5 px-3 rounded-lg w-fit group-hover:bg-white/20 transition-colors duration-300 border border-white/10">
                                                <span>
                                                    {t("Manage subscriptions")}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="card-shine"></div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-[1px] opacity-50"></div>
                                        <motion.div
                                            className="absolute right-4 bottom-4 opacity-10"
                                            initial={{ opacity: 0.1, y: 0 }}
                                            animate={{
                                                opacity: [0.1, 0.15, 0.1],
                                                y: [0, -5, 0],
                                            }}
                                            transition={{
                                                duration: 4,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                        >
                                            <CreditCard className="h-16 w-16" />
                                        </motion.div>
                                    </motion.div>

                                    <motion.div
                                        ref={(el) =>
                                            statsCardsRef.current.push(el)
                                        }
                                        className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0 rounded-2xl shadow-lg overflow-hidden relative group"
                                        style={{ perspective: "1000px" }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 3 * 0.1,
                                            ease: "easeOut",
                                        }}
                                        whileHover={{
                                            translateY: -8,
                                            transition: { duration: 0.3 },
                                        }}
                                    >
                                        <div className="p-6 relative z-10">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-medium text-lg">
                                                    {t("Reward Points")}
                                                </span>
                                                <div className="p-2.5 bg-white/20 rounded-lg shadow-inner backdrop-blur-sm transform group-hover:rotate-3 transition-transform duration-300 border border-white/10">
                                                    <Star className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <div className="text-3xl font-bold mt-2 flex items-end transform group-hover:scale-105 transition-transform origin-left duration-300">
                                                <AnimatedCounter
                                                    value={
                                                        mergedStats.reward_points
                                                    }
                                                    duration={2000}
                                                />
                                            </div>
                                            <div className="mt-4 text-sm flex items-center text-white/90 backdrop-blur-sm bg-white/10 py-1.5 px-3 rounded-lg w-fit group-hover:bg-white/20 transition-colors duration-300 border border-white/10">
                                                <span>
                                                    {t(
                                                        "Available for redemption"
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="card-shine"></div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-[1px] opacity-50"></div>
                                        <motion.div
                                            className="absolute right-4 bottom-4 opacity-10"
                                            initial={{ opacity: 0.1, scale: 1 }}
                                            animate={{
                                                opacity: [0.1, 0.15, 0.1],
                                                scale: [1, 1.05, 1],
                                            }}
                                            transition={{
                                                duration: 5,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                        >
                                            <Star className="h-16 w-16" />
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        {/* Charts and Data Section */}
                        <div className="p-6">
                            <div className="max-w-full mx-auto space-y-6">
                                {/* Charts Row */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                                    {/* Monthly Orders Chart */}
                                    <motion.div
                                        ref={(el) => chartsRef.current.push(el)}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.1,
                                        }}
                                    >
                                        <Card className="shadow-md bg-white dark:bg-slate-900 border-0 rounded-xl overflow-hidden h-full">
                                            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 px-6 py-4">
                                                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    <BarChart3 className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                                                    {t(
                                                        "Monthly Orders (Current Year)"
                                                    )}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <div className="h-80 responsive-chart-container">
                                                    <ResponsiveContainer
                                                        width="99%"
                                                        height="100%"
                                                    >
                                                        <BarChart
                                                            data={
                                                                mergedStats.monthly_orders ||
                                                                []
                                                            }
                                                        >
                                                            <CartesianGrid
                                                                strokeDasharray="3 3"
                                                                vertical={false}
                                                                stroke="#e2e8f0"
                                                            />
                                                            <XAxis
                                                                dataKey="name"
                                                                axisLine={false}
                                                                tickLine={false}
                                                                tick={{
                                                                    fill: "#64748b",
                                                                }}
                                                            />
                                                            <YAxis
                                                                axisLine={false}
                                                                tickLine={false}
                                                                tick={{
                                                                    fill: "#64748b",
                                                                }}
                                                            />
                                                            <Tooltip
                                                                cursor={{
                                                                    fill: "rgba(59, 130, 246, 0.1)",
                                                                }}
                                                                contentStyle={{
                                                                    backgroundColor:
                                                                        "#fff",
                                                                    borderColor:
                                                                        "#e2e8f0",
                                                                    borderRadius:
                                                                        "0.5rem",
                                                                    boxShadow:
                                                                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                                                }}
                                                            />
                                                            <Bar
                                                                dataKey="value"
                                                                radius={[
                                                                    4, 4, 0, 0,
                                                                ]}
                                                            >
                                                                {(
                                                                    mergedStats.monthly_orders ||
                                                                    []
                                                                ).map(
                                                                    (
                                                                        entry,
                                                                        index
                                                                    ) => (
                                                                        <Cell
                                                                            key={`cell-${index}`}
                                                                            fill={
                                                                                index %
                                                                                    2 ===
                                                                                0
                                                                                    ? "#3b82f6"
                                                                                    : "#2563eb"
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                            </Bar>
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Order Status Chart */}
                                    <motion.div
                                        ref={(el) => chartsRef.current.push(el)}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.2,
                                        }}
                                    >
                                        <Card className="shadow-md bg-white dark:bg-slate-900 border-0 rounded-xl overflow-hidden h-full">
                                            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 px-6 py-4">
                                                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    <Package className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                                                    {t(
                                                        "Order Status Distribution"
                                                    )}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <div className="h-80 responsive-chart-container">
                                                    <ResponsiveContainer
                                                        width="99%"
                                                        height="100%"
                                                    >
                                                        <PieChart>
                                                            <Pie
                                                                data={
                                                                    mergedStats.order_status_distribution ||
                                                                    []
                                                                }
                                                                cx="50%"
                                                                cy="50%"
                                                                innerRadius={60}
                                                                outerRadius={
                                                                    100
                                                                }
                                                                paddingAngle={2}
                                                                dataKey="value"
                                                                label={({
                                                                    name,
                                                                    percent,
                                                                }) =>
                                                                    `${name}: ${(
                                                                        percent *
                                                                        100
                                                                    ).toFixed(
                                                                        0
                                                                    )}%`
                                                                }
                                                            >
                                                                {(
                                                                    mergedStats.order_status_distribution ||
                                                                    []
                                                                ).map(
                                                                    (
                                                                        entry,
                                                                        index
                                                                    ) => (
                                                                        <Cell
                                                                            key={`cell-${index}`}
                                                                            fill={
                                                                                COLORS[
                                                                                    index %
                                                                                        COLORS.length
                                                                                ]
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                            </Pie>
                                                            <Tooltip
                                                                contentStyle={{
                                                                    backgroundColor:
                                                                        "#fff",
                                                                    borderColor:
                                                                        "#e2e8f0",
                                                                    borderRadius:
                                                                        "0.5rem",
                                                                    boxShadow:
                                                                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                                                }}
                                                            />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>

                                {/* Recent Orders */}
                                <motion.div
                                    ref={(el) => chartsRef.current.push(el)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                    <Card className="shadow-md bg-white dark:bg-slate-900 border-0 rounded-xl overflow-hidden">
                                        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 px-6 py-4">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    <ShoppingCart className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                                                    {t("Recent Orders")}
                                                </CardTitle>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-blue-600 dark:text-blue-400 border-slate-200 dark:border-slate-700 rounded-lg"
                                                >
                                                    <Link
                                                        href={route(
                                                            "customer.orders"
                                                        )}
                                                    >
                                                        {t("View All Orders")}
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                                {mergedStats.recent_orders &&
                                                mergedStats.recent_orders
                                                    .length > 0 ? (
                                                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                                                        {mergedStats.recent_orders.map(
                                                            (order, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex items-center gap-4 p-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150 group"
                                                                >
                                                                    <div
                                                                        className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                                            order.status ===
                                                                            "completed"
                                                                                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                                                                : order.status ===
                                                                                  "processing"
                                                                                ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                                                : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                                                        }`}
                                                                    >
                                                                        {order.status ===
                                                                        "completed" ? (
                                                                            <Check className="h-5 w-5" />
                                                                        ) : order.status ===
                                                                          "processing" ? (
                                                                            <RefreshCw className="h-5 w-5" />
                                                                        ) : (
                                                                            <Clock className="h-5 w-5" />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="font-medium text-slate-900 dark:text-white truncate">
                                                                            Order
                                                                            #
                                                                            {
                                                                                order.id
                                                                            }
                                                                        </p>
                                                                        <div className="flex items-center flex-wrap gap-3 mt-1 text-xs">
                                                                            <span className="flex items-center text-slate-500 dark:text-slate-400">
                                                                                <Calendar className="h-3 w-3 mr-1" />
                                                                                {
                                                                                    order.date
                                                                                }
                                                                            </span>
                                                                            <span className="flex items-center text-slate-500 dark:text-slate-400">
                                                                                <Package className="h-3 w-3 mr-1" />
                                                                                {
                                                                                    order.items
                                                                                }{" "}
                                                                                items
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                                                        {formatCurrency(
                                                                            order.total
                                                                        )}
                                                                    </div>
                                                                    {order.id && (
                                                                        <Link
                                                                            href={route(
                                                                                "customer.orders.show",
                                                                                order.id
                                                                            )}
                                                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        >
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="bg-white dark:bg-transparent dark:text-slate-400 dark:border-slate-700 text-slate-700 flex items-center h-8"
                                                                            >
                                                                                <span>
                                                                                    Details
                                                                                </span>
                                                                                <ChevronRight className="h-3.5 w-3.5 ml-1" />
                                                                            </Button>
                                                                        </Link>
                                                                    )}
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                                                        <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                                        <p className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                                                            No recent orders
                                                        </p>
                                                        <p>
                                                            Start shopping to
                                                            see your orders here
                                                        </p>
                                                        <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            Start Shopping
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
