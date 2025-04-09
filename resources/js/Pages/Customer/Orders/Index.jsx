import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Head, Link } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import OrderList from './Components/OrderList';
import OrderDetails from './Components/OrderDetails';
import OrderFilters from './Components/OrderFilters';
import OrderStats from './Components/OrderStats';
import CustomerNavbar from '@/Components/CustomerNavbar';
import { motion } from "framer-motion";
import anime from "animejs";

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
    Search,
    ShoppingCart,
    TrendingUp,
    ChevronRight,
    DollarSign,
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
    Mail,
    Settings,
    Inbox,
    ChevronDown,
    Eye,
    RefreshCw,
    Sliders,
    Package,
    UserCheck,
    Check
} from "lucide-react";

export default function Index({ auth, stats }) {
    const { t } = useLaravelReactI18n();

    // State management
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 4,
        total: 0
    });
    const [stats_data, setStats] = useState({
        total_orders: 0,
        total_amount: 0,
        pending_orders: 0,
        completed_orders: 0
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [filters, setFilters] = useState({
        searchQuery: '',
        statusFilter: 'all',
        dateRange: 'all',
        sortField: 'created_at',
        sortDirection: 'desc',
        page: 1
    });
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [view, setView] = useState("grid");
    const [isAnimated, setIsAnimated] = useState(false);

    // Refs for animation targets
    const headerRef = useRef(null);
    const cardsRef = useRef(null);
    const gridItemsRef = useRef([]);
    const listItemsRef = useRef([]);
    const dashboardCardsRef = useRef([]);

    // Animation timeline
    const timelineRef = useRef(null);

    // Fetch orders data based on current filters
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(route('customer.api.orders.index'), {
                params: {
                    search: filters.searchQuery,
                    status: filters.statusFilter,
                    dateRange: filters.dateRange,
                    sortField: filters.sortField,
                    sortDirection: filters.sortDirection,
                    page: filters.page
                }
            });
            setOrders(response.data.orders);
            setPagination(response.data.pagination);
            setStats(response.data.stats);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

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

            // Animate dashboard cards with stagger
            timelineRef.current.add(
                {
                    targets: dashboardCardsRef.current,
                    opacity: [0, 1],
                    translateY: [20, 0],
                    delay: anime.stagger(100),
                    duration: 700,
                },
                "-=400"
            );

            // Animate order cards or list items with stagger based on view
            if (view === "grid" && gridItemsRef.current.length > 0) {
                timelineRef.current.add(
                    {
                        targets: gridItemsRef.current,
                        opacity: [0, 1],
                        translateY: [30, 0],
                        scale: [0.95, 1],
                        delay: anime.stagger(50),
                        duration: 600,
                    },
                    "-=500"
                );
            } else if (view === "list" && listItemsRef.current.length > 0) {
                timelineRef.current.add(
                    {
                        targets: listItemsRef.current,
                        opacity: [0, 1],
                        translateX: [-20, 0],
                        delay: anime.stagger(30),
                        duration: 500,
                    },
                    "-=500"
                );
            }

            setIsAnimated(true);
        }
    }, [isAnimated, view, orders.length]);

    // Reset animation state when view changes
    useEffect(() => {
        setIsAnimated(false);
        // Clear refs
        gridItemsRef.current = [];
        listItemsRef.current = [];
    }, [view, searchTerm]);

    // Animation for view transition
    const handleViewChange = (newView) => {
        if (newView === view) return;

        anime({
            targets: cardsRef.current,
            opacity: [1, 0],
            scale: [1, 0.95],
            duration: 200,
            easing: "easeInOutQuad",
            complete: () => {
                setView(newView);
                // Force immediate rerender to avoid flash of empty content
                setTimeout(() => {
                    anime({
                        targets: cardsRef.current,
                        opacity: [0, 1],
                        scale: [0.95, 1],
                        duration: 300,
                        easing: "easeOutQuad",
                    });
                }, 50);
            },
        });
    };

    // Animation for hover effects
    const animateHover = (target, enter) => {
        anime({
            targets: target,
            scale: enter ? 1.03 : 1,
            boxShadow: enter
                ? "0 10px 30px rgba(0, 0, 0, 0.1)"
                : "0 4px 10px rgba(0, 0, 0, 0.08)",
            duration: 300,
            easing: "spring(1, 80, 10, 0)",
        });
    };

    // Initial data fetch and when filters change
    useEffect(() => {
        fetchOrders();
    }, [filters]);

    // Handle order selection
    const handleOrderSelect = async (orderId) => {
        try {
            const response = await axios.get(route('customer.api.orders.show', orderId));
            setSelectedOrder(response.data);
            setShowOrderDetails(true);
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    // Handle filter changes
    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value,
            page: 1 // Reset to page 1 when filters change
        }));
    };

    // Handle sorting
    const handleSortChange = (field) => {
        const newDirection = filters.sortField === field && filters.sortDirection === 'asc' ? 'desc' : 'asc';
        setFilters(prev => ({
            ...prev,
            sortField: field,
            sortDirection: newDirection,
            page: 1 // Reset to page 1 when sort changes
        }));
    };

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.last_page) {
            setFilters(prev => ({
                ...prev,
                page
            }));
        }
    };

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // Update status filter when tab changes
        if (tab !== 'all') {
            setFilters(prev => ({
                ...prev,
                statusFilter: tab,
                page: 1 // Reset to page 1 when tab changes
            }));
        } else {
            setFilters(prev => ({
                ...prev,
                statusFilter: 'all',
                page: 1 // Reset to page 1 when tab changes
            }));
        }
    };

    // Add useEffect to handle page loading
    useEffect(() => {
        // Simulate loading delay
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

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
                    round: 1, // Rounds the values to 1 decimal
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

    // Add PageLoader component after AnimatedCounter
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

    return (
        <>
            <Head title={t('Customer Orders')}>
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

                    @keyframes modalFadeIn {
                        from { opacity: 0; transform: scale(0.95) translateY(10px); }
                        to { opacity: 1; transform: scale(1) translateY(0); }
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden max-w-full">
                {/* Sidebar */}
                <CustomerNavbar
                    auth={auth || {user: {name: 'Customer'}}}
                    currentRoute="customer.orders"
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
                                    {t("Orders Management")}
                                    <Badge
                                        variant="outline"
                                        className="ml-2 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 rounded-full"
                                    >
                                        {pagination?.total || 0}
                                    </Badge>
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button
                                size="sm"
                                onClick={() => fetchOrders()}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                {t("Refresh")}
                            </Button>
                            <Link
                                href={route('customer.create_orders')}
                            >
                                <Button
                                    size="sm"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    {t("New Order")}
                                </Button>
                            </Link>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {/* Search and Tabs Section */}
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full md:w-96 relative"
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={t(
                                            "Search orders..."
                                        )}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                                        value={filters.searchQuery}
                                        onChange={(e) =>
                                            handleFilterChange('searchQuery', e.target.value)
                                        }
                                    />
                                    {filters.searchQuery && (
                                        <button
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-500"
                                            onClick={() => handleFilterChange('searchQuery', '')}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M18 6 6 18"></path>
                                                <path d="m6 6 12 12"></path>
                                            </svg>
                                        </button>
                                    )}
                                </motion.div>

                                <motion.div
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="flex items-center gap-4">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex items-center gap-1.5 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-lg"
                                            onClick={() => fetchOrders()}
                                        >
                                            <RefreshCw className="h-3.5 w-3.5" />
                                            <span>{t('Refresh')}</span>
                                        </Button>
                                        <Tabs
                                            defaultValue="grid"
                                            className="w-auto"
                                        >
                                            <TabsList className="p-1 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg">
                                                <TabsTrigger
                                                    value="grid"
                                                    active={view === "grid"}
                                                    onClick={() =>
                                                        handleViewChange("grid")
                                                    }
                                                    className="px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:dark:bg-slate-900 data-[state=active]:shadow-sm rounded-md transition-all"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-layout-grid"
                                                    >
                                                        <rect
                                                            width="7"
                                                            height="7"
                                                            x="3"
                                                            y="3"
                                                            rx="1"
                                                        />
                                                        <rect
                                                            width="7"
                                                            height="7"
                                                            x="14"
                                                            y="3"
                                                            rx="1"
                                                        />
                                                        <rect
                                                            width="7"
                                                            height="7"
                                                            x="14"
                                                            y="14"
                                                            rx="1"
                                                        />
                                                        <rect
                                                            width="7"
                                                            height="7"
                                                            x="3"
                                                            y="14"
                                                            rx="1"
                                                        />
                                                    </svg>
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="list"
                                                    active={view === "list"}
                                                    onClick={() =>
                                                        handleViewChange("list")
                                                    }
                                                    className="px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:dark:bg-slate-900 data-[state=active]:shadow-sm rounded-md transition-all"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-list"
                                                    >
                                                        <line
                                                            x1="8"
                                                            x2="21"
                                                            y1="6"
                                                            y2="6"
                                                        />
                                                        <line
                                                            x1="8"
                                                            x2="21"
                                                            y1="12"
                                                            y2="12"
                                                        />
                                                        <line
                                                            x1="8"
                                                            x2="21"
                                                            y1="18"
                                                            y2="18"
                                                        />
                                                        <line
                                                            x1="3"
                                                            x2="3.01"
                                                            y1="6"
                                                            y2="6"
                                                        />
                                                        <line
                                                            x1="3"
                                                            x2="3.01"
                                                            y1="12"
                                                            y2="12"
                                                        />
                                                        <line
                                                            x1="3"
                                                            x2="3.01"
                                                            y1="18"
                                                            y2="18"
                                                        />
                                                    </svg>
                                                </TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>
                                </motion.div>
                            </div>

                            {filters.searchQuery && (
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4 animate-pulse">
                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                    <p>
                                        {t("Showing results for:")}{" "}
                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                            {filters.searchQuery}
                                        </span>
                                    </p>
                                </div>
                            )}

                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center mb-6">
                                {filters.searchQuery
                                    ? t("Search Results")
                                    : t("Your Orders")}
                                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 rounded-full">
                                    {pagination?.total || 0}
                                </Badge>
                            </h2>

                            {/* Filters Section */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl p-5 mb-6">
                                <OrderFilters
                                    filters={filters}
                                    onFilterChange={handleFilterChange}
                                    onSortChange={handleSortChange}
                                />
                            </div>

                            {/* Grid and List Views */}
                            <div
                                ref={cardsRef}
                                className="transition-opacity duration-300"
                                style={{ minHeight: "200px" }}
                            >
                                {/* Orders list component */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl overflow-hidden mb-6">
                                    <div className="p-5">
                                        <OrderList
                                            orders={orders}
                                            activeTab={activeTab}
                                            setActiveTab={handleTabChange}
                                            onOrderSelect={handleOrderSelect}
                                            loading={loading}
                                            pagination={pagination}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Order Details Modal */}
            {showOrderDetails && selectedOrder && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Backdrop with improved blur effect */}
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 via-purple-900/70 to-indigo-900/70 backdrop-blur-sm"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        {/* Modal container with animation */}
                        <div
                            className="inline-block align-bottom bg-gradient-to-br from-white to-indigo-50/30 dark:from-slate-900 dark:to-slate-800/30 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-indigo-100 dark:border-indigo-900/50"
                            style={{
                                animation: 'modalFadeIn 0.3s ease-out forwards'
                            }}
                        >
                            {/* Close button - enhanced */}
                            <div className="absolute top-4 right-4 z-10">
                                <button
                                    type="button"
                                    onClick={() => setShowOrderDetails(false)}
                                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full text-gray-500 dark:text-gray-400 hover:text-indigo-700 dark:hover:text-indigo-400 p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 transform hover:scale-110 focus:outline-none shadow-md hover:shadow-lg"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6 sm:p-8">
                                <OrderDetails
                                    order={selectedOrder}
                                    visible={showOrderDetails}
                                    onClose={() => setShowOrderDetails(false)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
