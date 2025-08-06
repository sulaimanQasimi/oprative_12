import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import CustomerNavbar from "@/Components/CustomerNavbar";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/Components/ui/button";
import {
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    Package,
    Layers,
    DollarSign,
    Calendar,
    ChevronRight,
    RefreshCcw,
    Filter,
    TrendingUp,
    Activity,
    Package2,
} from "lucide-react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    RadialLinearScale,
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    RadialLinearScale
);



// Animation variants (moved inside component)
const animationVariants = {
    fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
    },
    slideIn: {
        hidden: { x: -20, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.4 } }
    },
    slideUp: {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
    },
    scaleIn: {
        hidden: { scale: 0.8, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } }
    },
    staggerChildren: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    },
    // Enhanced animations for better UX
    pulse: {
        hidden: { scale: 1 },
        visible: { 
            scale: [1, 1.05, 1],
            transition: { 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    },
    bounce: {
        hidden: { y: 0 },
        visible: { 
            y: [0, -10, 0],
            transition: { 
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    },
    shimmer: {
        hidden: { x: '-100%' },
        visible: { 
            x: '100%',
            transition: { 
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
            }
        }
    }
};

// Chart options (moved inside component)
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        intersect: false,
        mode: 'index'
    },
    plugins: {
        legend: {
            position: 'top',
            labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                    size: 12,
                    weight: '500'
                },
                color: 'rgba(0, 0, 0, 0.8)'
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            cornerRadius: 12,
            displayColors: true,
            padding: 16,
            titleFont: {
                size: 14,
                weight: '600'
            },
            bodyFont: {
                size: 12
            },
            callbacks: {
                label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += new Intl.NumberFormat('en-US').format(context.parsed.y);
                    }
                    return label;
                }
            }
        }
    },
    scales: {
        x: {
            grid: {
                display: false
            },
            ticks: {
                font: {
                    size: 11,
                    weight: '500'
                },
                color: 'rgba(0, 0, 0, 0.7)'
            }
        },
        y: {
            grid: {
                color: 'rgba(0, 0, 0, 0.05)',
                drawBorder: false
            },
            ticks: {
                font: {
                    size: 11,
                    weight: '500'
                },
                color: 'rgba(0, 0, 0, 0.7)',
                callback: function(value) {
                    return new Intl.NumberFormat('en-US').format(value);
                }
            }
        }
    }
};

export default function CustomerDashboard({ auth, stats = {}, filters = {} }) {
    const { t } = useLaravelReactI18n();
    
    // Optimized state management with better defaults
    const [isLoading, setIsLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [chartType, setChartType] = useState(filters.chart_type || 'monthly');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [productFilter, setProductFilter] = useState(filters.product_filter || '');
    const [isAnimating, setIsAnimating] = useState(false);

    // Optimized refs for animations
    const headerRef = useRef(null);
    const statsCardsRef = useRef([]);
    const chartsRef = useRef([]);
    const filterPanelRef = useRef(null);

    // Memoized safe stats with better error handling
    const safeStats = useMemo(() => {
        if (typeof stats === "object" && stats !== null) {
            return stats;
        }
        console.warn('Invalid stats object provided to Dashboard');
        return {};
    }, [stats]);

    // Memoized computed values with better performance
    const inventoryOverview = useMemo(() => {
        const overview = safeStats.inventory_overview || {};
        return {
            total_products: overview.total_products || 0,
            total_quantity: overview.total_quantity || 0,
            total_value: overview.total_value || 0,
            expiry_status: overview.expiry_status || {},
            products: overview.products || []
        };
    }, [safeStats.inventory_overview]);

    const stockMovementCharts = useMemo(() => {
        const charts = safeStats.stock_movement_charts || {};
        return {
            labels: charts.labels || [],
            quantity_datasets: charts.quantity_datasets || [],
            value_datasets: charts.value_datasets || []
        };
    }, [safeStats.stock_movement_charts]);

    const productPerformance = useMemo(() => {
        return safeStats.product_performance || [];
    }, [safeStats.product_performance]);

    const expiryAnalysis = useMemo(() => {
        const analysis = safeStats.expiry_analysis || {};
        return {
            summary: analysis.summary || [],
            expiring_soon: analysis.expiring_soon || []
        };
    }, [safeStats.expiry_analysis]);

    const recentActivities = useMemo(() => {
        return safeStats.recent_activities || [];
    }, [safeStats.recent_activities]);

    const financialSummary = useMemo(() => {
        const summary = safeStats.financial_summary || {};
        return {
            income: summary.income || {},
            outcome: summary.outcome || {},
            current_inventory: summary.current_inventory || {},
            net_movement: summary.net_movement || {}
        };
    }, [safeStats.financial_summary]);

    const topProducts = useMemo(() => {
        const products = safeStats.top_products || {};
        return {
            by_quantity: products.by_quantity || [],
            by_value: products.by_value || []
        };
    }, [safeStats.top_products]);

    // Optimized loading effect with better error handling
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            setIsAnimating(true);
        }, 150);
        return () => clearTimeout(timer);
    }, []);

    // Memoized loading state to prevent unnecessary re-renders
    const loadingState = useMemo(() => isLoading, [isLoading]);

    // Memoized handlers with better error handling and performance
    const handleFilter = useCallback(() => {
        try {
            setIsAnimating(false);
            router.get(route('customer.dashboard'), {
                date_from: dateFrom,
                date_to: dateTo,
                chart_type: chartType,
                product_filter: productFilter
            }, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setTimeout(() => setIsAnimating(true), 100);
                }
            });
        } catch (error) {
            console.error('Error applying filters:', error);
            setIsAnimating(true);
        }
    }, [dateFrom, dateTo, chartType, productFilter]);

    const clearFilters = useCallback(() => {
        try {
            setDateFrom('');
            setDateTo('');
            setChartType('monthly');
            setProductFilter('');
            setIsAnimating(false);
            router.get(route('customer.dashboard'), {}, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setTimeout(() => setIsAnimating(true), 100);
                }
            });
        } catch (error) {
            console.error('Error clearing filters:', error);
            setIsAnimating(true);
        }
    }, []);

    const toggleFilters = useCallback(() => {
        setShowFilters(prev => !prev);
    }, []);

    const handleChartTypeChange = useCallback((newChartType) => {
        setChartType(newChartType);
    }, []);

    const handleDateChange = useCallback((field, value) => {
        if (field === 'from') {
            setDateFrom(value);
        } else if (field === 'to') {
            setDateTo(value);
        }
    }, []);

    const handleProductFilterChange = useCallback((value) => {
        setProductFilter(value);
    }, []);

    // Memoized utility functions to prevent re-creation
    const formatCurrency = useCallback((value) => {
        if (!value || isNaN(value)) return '$0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    }, []);

    const formatNumber = useCallback((value) => {
        if (!value || isNaN(value)) return '0';
        return new Intl.NumberFormat('en-US').format(value);
    }, []);

    const formatPercentage = useCallback((value) => {
        if (!value || isNaN(value)) return '0%';
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        }).format(value / 100);
    }, []);

    const getStatusColor = useCallback((status) => {
        switch (status) {
            case 'income':
                return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30 border-green-200 dark:border-green-800';
            case 'outcome':
                return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30 border-red-200 dark:border-red-800';
            default:
                return 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800';
        }
    }, []);

    const getExpiryStatusColor = useCallback((status) => {
        switch (status) {
            case 'expired':
                return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30 border-red-200 dark:border-red-800';
            case 'expiring_soon':
                return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
            case 'valid':
                return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30 border-green-200 dark:border-green-800';
            default:
                return 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800';
        }
    }, []);

    const getActivityIcon = useCallback((type) => {
        switch (type) {
            case 'income':
                return ArrowUpRight;
            case 'outcome':
                return ArrowDownRight;
            default:
                return Activity;
        }
    }, []);

    const getActivityColor = useCallback((type) => {
        switch (type) {
            case 'income':
                return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
            case 'outcome':
                return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
            default:
                return 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-900/30';
        }
    }, []);

    if (loadingState) {
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-2xl blur-lg opacity-60 animate-pulse"></div>
                        <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 p-6 rounded-2xl shadow-2xl">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto"></div>
                        </div>
                    </motion.div>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mt-6 text-lg font-semibold text-slate-700 dark:text-slate-300"
                    >
                        {t('Loading dashboard...')}
                    </motion.p>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="mt-2 text-sm text-slate-500 dark:text-slate-400"
                    >
                        {t('Please wait while we load your data')}
                    </motion.div>
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        className="mt-4 flex justify-center space-x-1"
                    >
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title={t('Customer Dashboard')} />

            <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
                <CustomerNavbar auth={auth} />

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Enhanced Header with better animations */}
                    <motion.header
                        ref={headerRef}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="bg-white/10 backdrop-blur-lg border-b border-white/20 dark:border-slate-700/50 py-6 px-8 sticky top-0 z-30 shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 p-4 rounded-2xl shadow-2xl">
                                        <BarChart3 className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-2"
                                    >
                                        <Activity className="w-4 h-4" />
                                        {t('Customer Dashboard')}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent"
                                    >
                                        {t('Inventory Overview')}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Calendar className="w-4 h-4" />
                                        {t('Real-time stock management and analytics')}
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
                                    size="sm"
                                    onClick={toggleFilters}
                                    className="gap-2"
                                >
                                    <Filter className="h-4 w-4" />
                                    {t('Filters')}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleFilter}
                                    className="gap-2"
                                >
                                    <RefreshCcw className="h-4 w-4" />
                                    {t('Apply')}
                                </Button>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Filters Panel */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 overflow-hidden"
                            >
                                <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            {t('Date From')}
                                        </label>
                                        <input
                                            type="date"
                                            value={dateFrom}
                                            onChange={(e) => setDateFrom(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            {t('Date To')}
                                        </label>
                                        <input
                                            type="date"
                                            value={dateTo}
                                            onChange={(e) => setDateTo(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            {t('Chart Type')}
                                        </label>
                                        <select
                                            value={chartType}
                                            onChange={(e) => setChartType(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        >
                                            <option value="monthly">{t('Monthly')}</option>
                                            <option value="weekly">{t('Weekly')}</option>
                                            <option value="daily">{t('Daily')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            {t('Product Filter')}
                                        </label>
                                        <input
                                            type="text"
                                            value={productFilter}
                                            onChange={(e) => setProductFilter(e.target.value)}
                                            placeholder={t('Search products...')}
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-700 scrollbar-track-transparent">
                        <div className="p-8">
                            {/* Stats Cards */}
                            <motion.div
                                variants={animationVariants.staggerChildren}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
                            >
                                {/* Total Products */}
                                <motion.div
                                    variants={animationVariants.scaleIn}
                                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-slate-700/50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                {t('Total Products')}
                                            </p>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                <span className="text-blue-600 dark:text-blue-400">
                                                    {(inventoryOverview.total_products || 0).toLocaleString()}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                            <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Total Quantity */}
                                <motion.div
                                    variants={animationVariants.scaleIn}
                                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-slate-700/50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                {t('Total Quantity')}
                                            </p>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                <span className="text-green-600 dark:text-green-400">
                                                    {(inventoryOverview.total_quantity || 0).toLocaleString()}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                            <Layers className="h-6 w-6 text-green-600 dark:text-green-400" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Total Value */}
                                <motion.div
                                    variants={animationVariants.scaleIn}
                                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-slate-700/50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                {t('Total Value')}
                                            </p>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                <span className="text-purple-600 dark:text-purple-400">
                                                    {formatCurrency(inventoryOverview.total_value || 0)}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                            <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Net Movement */}
                                <motion.div
                                    variants={animationVariants.scaleIn}
                                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-slate-700/50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                {t('Net Movement')}
                                            </p>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                <span className="text-orange-600 dark:text-orange-400">
                                                    {(financialSummary.net_movement?.quantity || 0).toLocaleString()}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                                            <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Charts Section */}
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-8">
                                {/* Stock Movement Chart */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-slate-700/50"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            {t('Stock Movement')}
                                        </h3>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <span className="text-sm text-slate-600 dark:text-slate-400">{t('Income')}</span>
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                            <span className="text-sm text-slate-600 dark:text-slate-400">{t('Outcome')}</span>
                                        </div>
                                    </div>
                                    <div className="h-80">
                                        {stockMovementCharts.labels && stockMovementCharts.quantity_datasets && stockMovementCharts.labels.length > 0 ? (
                                            <Line
                                                data={{
                                                    labels: stockMovementCharts.labels,
                                                    datasets: stockMovementCharts.quantity_datasets
                                                }}
                                                options={{
                                                    ...chartOptions,
                                                    plugins: {
                                                        ...chartOptions.plugins,
                                                        title: {
                                                            display: false
                                                        }
                                                    }
                                                }}
                                                redraw={false}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <div className="text-center">
                                                    <BarChart3 className="mx-auto h-12 w-12 text-slate-400 mb-2" />
                                                    <p className="text-slate-500 dark:text-slate-400">{t('No chart data available')}</p>
                                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t('Try adjusting your filters')}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Product Performance Chart */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.9, duration: 0.5 }}
                                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-slate-700/50"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            {t('Product Performance')}
                                        </h3>
                                    </div>
                                    <div className="h-80">
                                        {productPerformance.length > 0 ? (
                                            <Bar
                                                data={{
                                                    labels: productPerformance.slice(0, 5).map(item => item.product_name),
                                                    datasets: [{
                                                        label: t('Total Value'),
                                                        data: productPerformance.slice(0, 5).map(item => item.total_value),
                                                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                                                        borderColor: 'rgb(59, 130, 246)',
                                                        borderWidth: 1
                                                    }]
                                                }}
                                                options={{
                                                    ...chartOptions,
                                                    plugins: {
                                                        ...chartOptions.plugins,
                                                        title: {
                                                            display: false
                                                        }
                                                    }
                                                }}
                                                redraw={false}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <div className="text-center">
                                                    <Package2 className="mx-auto h-12 w-12 text-slate-400 mb-2" />
                                                    <p className="text-slate-500 dark:text-slate-400">{t('No product data available')}</p>
                                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t('Try adjusting your filters')}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Recent Activities */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.0, duration: 0.5 }}
                                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-slate-700/50 mb-8"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        {t('Recent Activities')}
                                    </h3>
                                  
                                </div>
                                <div className="space-y-4">
                                    {recentActivities.length > 0 ? (
                                        recentActivities.map((activity, index) => (
                                            <motion.div
                                                key={`${activity.id}-${activity.type}-${activity.reference}`}
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 1.1 + index * 0.1, duration: 0.4 }}
                                                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600/50 transition-colors"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className={`p-2 rounded-lg ${activity.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                                        {activity.type === 'income' ? (
                                                            <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                        ) : (
                                                            <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                            {activity.product}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {activity.reference} • {activity.relative_time}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                        {formatNumber(activity.quantity)} {activity.unit_name}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {formatCurrency(activity.total)}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <Package className="mx-auto h-12 w-12 text-slate-400" />
                                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                                {t('No recent activities')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}