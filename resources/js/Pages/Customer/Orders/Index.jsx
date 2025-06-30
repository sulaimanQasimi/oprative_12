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
    Check,
    X,
    FilterX,
    PackageCheck,
    PackageX,
    PackageOpen,
    Warehouse,
    Box,
    MapPin,
    Route,
    Minus,
    AlertTriangle,
    TrendingDown,
    Download as DownloadIcon,
    Upload,
    Globe,
    Ship,
    Plane,
    Container,
    CircleDollarSign,
    BanknoteIcon,
    ReceiptText,
    ArrowRightLeft,
    Truck,
    Receipt,
    ChevronLeft
} from "lucide-react";

export default function Index({ auth, stats }) {
    const { t } = useLaravelReactI18n();

    // State management
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        has_more_pages: false,
        has_previous_pages: false
    });
    const [stats_data, setStats] = useState({
        total_orders: 0,
        total_amount: 0,
        average_amount: 0,
        pending_orders: 0,
        processing_orders: 0,
        completed_orders: 0,
        cancelled_orders: 0,
        paid_orders: 0,
        partial_orders: 0,
        pending_payment_orders: 0
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [filters, setFilters] = useState({
        searchQuery: '',
        statusFilter: 'all',
        payment_status: 'all',
        dateRange: 'all',
        start_date: '',
        end_date: '',
        sortField: 'created_at',
        sortDirection: 'desc',
        page: 1,
        per_page: 10,
        min_amount: '',
        max_amount: ''
    });
    const [filterOptions, setFilterOptions] = useState({
        order_statuses: [],
        payment_statuses: [],
        amount_range: { min: 0, max: 0 },
        date_range: { earliest: null, latest: null },
        popular_products: [],
        sort_options: [],
        per_page_options: [5, 10, 15, 20, 25, 50]
    });
    const [activeFilters, setActiveFilters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [view, setView] = useState("grid");
    const [isAnimated, setIsAnimated] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Refs for animation targets
    const headerRef = useRef(null);
    const cardsRef = useRef(null);
    const gridItemsRef = useRef([]);
    const listItemsRef = useRef([]);
    const dashboardCardsRef = useRef([]);

    // Animation timeline
    const timelineRef = useRef(null);

    // Fetch filter options
    const fetchFilterOptions = async () => {
        try {
            const response = await axios.get(route('customer.api.orders.filter-options'));
            setFilterOptions(response.data);
        } catch (error) {
            console.error('Error fetching filter options:', error);
        }
    };

    // Fetch orders data based on current filters
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = {
                search: filters.searchQuery,
                status: filters.statusFilter,
                payment_status: filters.payment_status,
                dateRange: filters.dateRange,
                start_date: filters.start_date,
                end_date: filters.end_date,
                sortField: filters.sortField,
                sortDirection: filters.sortDirection,
                page: filters.page,
                per_page: filters.per_page,
                min_amount: filters.min_amount,
                max_amount: filters.max_amount
            };

            // Remove empty parameters
            Object.keys(params).forEach(key => {
                if (params[key] === '' || params[key] === 'all') {
                    delete params[key];
                }
            });

            const response = await axios.get(route('customer.api.orders.index'), { params });

            setOrders(response.data.orders);
            setPagination(response.data.pagination);
            setStats(response.data.stats);
            setActiveFilters(response.data.filters?.active || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    // Clear all filters
    const clearAllFilters = async () => {
        const resetFilters = {
            searchQuery: '',
            statusFilter: 'all',
            payment_status: 'all',
            dateRange: 'all',
            start_date: '',
            end_date: '',
            sortField: 'created_at',
            sortDirection: 'desc',
            page: 1,
            per_page: 10,
            min_amount: '',
            max_amount: ''
        };

        setFilters(resetFilters);

        try {
            const response = await axios.post(route('customer.api.orders.clear-filters'));
            setStats(response.data.stats);
            setActiveFilters([]);
        } catch (error) {
            console.error('Error clearing filters:', error);
        }
    };

    // Initialize filter options on component mount
    useEffect(() => {
        fetchFilterOptions();
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

    // Handle per page change
    const handlePerPageChange = (perPage) => {
        setFilters(prev => ({
            ...prev,
            per_page: perPage,
            page: 1 // Reset to page 1 when per page changes
        }));
    };

    // Remove individual filter
    const removeFilter = (filterKey, filterValue) => {
        setFilters(prev => ({
            ...prev,
            [filterKey]: filterKey === 'statusFilter' || filterKey === 'payment_status' ? 'all' :
                filterKey === 'dateRange' ? 'all' : '',
            page: 1
        }));
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
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    .animate-shimmer { animation: shimmer 3s infinite; }

                    .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
                        background-size: 14px 14px;
                    }

                    .dark .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden max-w-full">
                {/* Sidebar */}
                <CustomerNavbar
                    auth={auth || { user: { name: 'Customer' } }}
                    currentRoute="customer.orders"
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
                                    <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    {t("Orders Management")}
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                className="flex items-center gap-1.5 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-lg"
                            >
                                <Sliders className="h-3.5 w-3.5" />
                                <span>{showAdvancedFilters ? t('Hide Filters') : t('Advanced Filters')}</span>
                            </Button>
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
                        <div className="p-6">
                            <div className="max-w-7xl mx-auto">
                                {/* Hero Section with Gradient Background */}
                                <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 rounded-2xl shadow-xl p-10 mb-10 overflow-hidden">
                                    <div className="absolute inset-0 bg-pattern opacity-10"></div>
                                    <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-gradient-to-br from-blue-400 to-indigo-500 opacity-20 rounded-full blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-gradient-to-tr from-indigo-400 to-blue-500 opacity-20 rounded-full blur-3xl"></div>

                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div>
                                            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
                                                {t("Orders Management")}
                                            </h1>
                                            <p className="text-blue-100 text-lg max-w-2xl">
                                                {t(
                                                    "Track all your orders and manage your business operations in one secure place."
                                                )}
                                            </p>
                                        </div>
                                        <div className="hidden md:flex items-center justify-center bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl border border-white border-opacity-20 shadow-lg">
                                            <ShoppingCart className="h-16 w-16 text-white opacity-80" />
                                        </div>
                                    </div>
                                </div>

                                <div className="">
                                    <OrderFilters
                                        filters={filters}
                                        filterOptions={filterOptions}
                                        onFilterChange={handleFilterChange}
                                        onSortChange={handleSortChange}
                                        onPerPageChange={handlePerPageChange}
                                    />
                                </div>


                                {/* Grid and List Views */}
                                <div
                                    ref={cardsRef}
                                    className="transition-opacity duration-300"
                                    style={{ minHeight: "200px" }}
                                >
                                            <OrderList
                                                orders={orders}
                                                onOrderSelect={handleOrderSelect}
                                                loading={loading}
                                                pagination={pagination}
                                                onPageChange={handlePageChange}
                                                view={view}
                                                filters={filters}
                                                onFilterChange={handleFilterChange}
                                            />
                                        </div>

                                        {/* Pagination Controls */}
                                        {pagination.total > 0 && (
                                            <motion.div
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 1.5, duration: 0.4 }}
                                                className="flex flex-col items-center space-y-4"
                                            >
                                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                                    {t("Showing")} {((pagination.current_page - 1) * pagination.per_page) + 1} {t("to")} {Math.min(pagination.current_page * pagination.per_page, pagination.total)} {t("of")} {pagination.total} {t("results")}
                                                </div>
                                                <div className="flex items-center space-x-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-green-100 dark:border-green-900/30">
                                                    {/* Previous Page */}
                                                    <button
                                                        onClick={() => handlePageChange(pagination.current_page - 1)}
                                                        disabled={pagination.current_page <= 1}
                                                        className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                                                            pagination.current_page > 1
                                                                ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30'
                                                                : 'text-gray-400 cursor-not-allowed'
                                                        }`}
                                                    >
                                                        <ChevronRight className="h-4 w-4" />
                                                        <span className="ml-1 hidden sm:inline">{t('Previous')}</span>
                                                    </button>

                                                    {/* Page Numbers */}
                                                    {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                                                        const pageNum = i + 1;
                                                        return (
                                                            <button
                                                                key={pageNum}
                                                                onClick={() => handlePageChange(pageNum)}
                                                                className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                                                                    pageNum === pagination.current_page
                                                                        ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-lg'
                                                                        : 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30'
                                                                }`}
                                                            >
                                                                {pageNum}
                                                            </button>
                                                        );
                                                    })}

                                                    {/* Next Page */}
                                                    <button
                                                        onClick={() => handlePageChange(pagination.current_page + 1)}
                                                        disabled={pagination.current_page >= pagination.last_page}
                                                        className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                                                            pagination.current_page < pagination.last_page
                                                                ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30'
                                                                : 'text-gray-400 cursor-not-allowed'
                                                        }`}
                                                    >
                                                        <span className="mr-1 hidden sm:inline">{t('Next')}</span>
                                                        <ChevronLeft className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Order Details Modal */}
            {showOrderDetails && selectedOrder && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Backdrop */}
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-indigo-900/70 to-blue-900/70 backdrop-blur-sm"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        {/* Modal container */}
                        <div className="inline-block align-bottom bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-900 dark:to-slate-800/30 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-blue-100 dark:border-blue-900/50">
                            {/* Close button */}
                            <div className="absolute top-4 right-4 z-10">
                                <button
                                    type="button"
                                    onClick={() => setShowOrderDetails(false)}
                                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 transform hover:scale-110 focus:outline-none shadow-md hover:shadow-lg"
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