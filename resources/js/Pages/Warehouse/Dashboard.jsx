import React, { useState, useEffect, useRef } from "react";
import { Head, Link } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import {
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
    Calendar,
    Clock,
    Tag,
    AlertCircle,
    CheckCircle,
    XCircle,
} from "lucide-react";
import anime from "animejs";
import Navigation from "@/Components/Warehouse/Navigation";
import { motion } from "framer-motion";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    ChartTooltip,
    Legend,
    Filler
);

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
            <div className="relative z-10 flex flex-col items-center">
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
                    <div className="relative flex items-center justify-center h-40 w-40">
                        <motion.div
                            className="absolute h-full w-full rounded-full border-4 border-emerald-300/10"
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
                            className="absolute h-[85%] w-[85%] rounded-full border-4 border-teal-400/20"
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
                            className="relative z-10 bg-gradient-to-br from-emerald-500 to-teal-600 h-20 w-20 rounded-2xl flex items-center justify-center shadow-xl"
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
                            <BarChart3 className="h-10 w-10 text-white drop-shadow-lg" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};


export default function Dashboard({ auth = {}, stats = {} }) {
    const { t } = useLaravelReactI18n();

    // State for loading and animations
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);

    // Refs for animation targets
    const headerRef = useRef(null);
    const statsCardsRef = useRef([]);
    const chartsRef = useRef([]);

    // Format currency values
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(value);
    };

    // Chart.js options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1f2937',
                bodyColor: '#374151',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
                padding: 12,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#6b7280',
                },
            },
            y: {
                grid: {
                    color: '#e5e7eb',
                },
                ticks: {
                    color: '#6b7280',
                },
            },
        },
    };

    // Prepare chart data
    const monthlyTrendsData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Income',
                data: stats?.monthly_income || [],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Outcome',
                data: stats?.monthly_outcome || [],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Profit',
                data: stats?.monthly_profit || [],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const expiryStatusData = {
        labels: stats?.chart_data?.expiry_status?.map(item => item.label) || [],
        datasets: [
            {
                data: stats?.chart_data?.expiry_status?.map(item => item.value) || [],
                backgroundColor: stats?.chart_data?.expiry_status?.map(item => item.backgroundColor) || [],
                borderColor: stats?.chart_data?.expiry_status?.map(item => item.color) || [],
                borderWidth: 2,
            },
        ],
    };

    const topProductsData = stats?.chart_data?.top_products_chart || {
        labels: [],
        datasets: [],
    };

    const stockDistributionData = stats?.chart_data?.stock_distribution || {
        labels: [],
        datasets: [],
    };

    // Initialize animations
    useEffect(() => {
        if (!isAnimated) {
            const timeline = anime.timeline({
                easing: "easeOutExpo",
                duration: 800,
            });

            // Animate header
            timeline.add({
                targets: headerRef.current,
                opacity: [0, 1],
                translateY: [-20, 0],
                duration: 600,
            });

            // Animate stats cards
            timeline.add(
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
            timeline.add(
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

    return (
        <>
            <Head title={t("Warehouse Dashboard")}>
                <style>{`
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
                <Navigation auth={auth} currentRoute="warehouse.dashboard" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden max-w-full">
                    {/* Header */}
                    <header
                        ref={headerRef}
                        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-0.5">
                                    {t("Warehouse Management")}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    {t("Dashboard Overview")}
                                    {auth?.user?.warehouse?.name && (
                                        <Badge
                                            variant="outline"
                                            className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 rounded-full"
                                        >
                                            {auth.user.warehouse.name}
                                        </Badge>
                                    )}
                                </h1>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {/* Dashboard Stats Section */}
                        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 relative flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/30 to-white/30 dark:from-slate-900/30 dark:to-slate-950/30 opacity-80"></div>

                            <div className="relative z-10 max-w-7xl mx-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                                    {/* Total Batches */}
                                    <motion.div
                                        ref={(el) => statsCardsRef.current.push(el)}
                                        className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-0 rounded-2xl shadow-lg overflow-hidden relative group"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0 * 0.1 }}
                                        whileHover={{ translateY: -8, transition: { duration: 0.3 } }}
                                    >
                                        <div className="p-6 relative z-10">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-medium text-lg">{t("Total Batches")}</span>
                                                <div className="p-2.5 bg-white/20 rounded-lg shadow-inner backdrop-blur-sm">
                                                    <Package className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <div className="text-3xl font-bold mt-2">
                                                <AnimatedCounter value={stats?.total_batches || 0} duration={2000} />
                                            </div>
                                            <div className="mt-4 text-sm flex items-center text-white/90 backdrop-blur-sm bg-white/10 py-1.5 px-3 rounded-lg w-fit">
                                                <span>{stats?.total_products || 0} {t("unique products")}</span>
                                            </div>
                                        </div>
                                        <div className="card-shine"></div>
                                    </motion.div>

                                    {/* Total Stock Value */}
                                    <motion.div
                                        ref={(el) => statsCardsRef.current.push(el)}
                                        className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0 rounded-2xl shadow-lg overflow-hidden relative group"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 1 * 0.1 }}
                                        whileHover={{ translateY: -8, transition: { duration: 0.3 } }}
                                    >
                                        <div className="p-6 relative z-10">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-medium text-lg">{t("Stock Value")}</span>
                                                <div className="p-2.5 bg-white/20 rounded-lg shadow-inner backdrop-blur-sm">
                                                    <DollarSign className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <div className="text-3xl font-bold mt-2">
                                                <AnimatedCounter 
                                                    value={parseFloat(stats?.total_stock_value || 0)} 
                                                    prefix="$" 
                                                    duration={2000} 
                                                />
                                            </div>
                                            <div className="mt-4 text-sm flex items-center text-white/90 backdrop-blur-sm bg-white/10 py-1.5 px-3 rounded-lg w-fit">
                                                <span>{stats?.total_remaining_qty || 0} {t("units in stock")}</span>
                                            </div>
                                        </div>
                                        <div className="card-shine"></div>
                                    </motion.div>

                                    {/* Expiry Status */}
                                    <motion.div
                                        ref={(el) => statsCardsRef.current.push(el)}
                                        className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0 rounded-2xl shadow-lg overflow-hidden relative group"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 2 * 0.1 }}
                                        whileHover={{ translateY: -8, transition: { duration: 0.3 } }}
                                    >
                                        <div className="p-6 relative z-10">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-medium text-lg">{t("Expiry Status")}</span>
                                                <div className="p-2.5 bg-white/20 rounded-lg shadow-inner backdrop-blur-sm">
                                                    <AlertCircle className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <div className="text-3xl font-bold mt-2">
                                                <AnimatedCounter value={stats?.expired_batches || 0} duration={2000} />
                                            </div>
                                            <div className="mt-4 text-sm flex items-center text-white/90 backdrop-blur-sm bg-white/10 py-1.5 px-3 rounded-lg w-fit">
                                                <span>{stats?.expiring_soon_batches || 0} {t("expiring soon")}</span>
                                            </div>
                                        </div>
                                        <div className="card-shine"></div>
                                    </motion.div>

                                    {/* Average Days to Expiry */}
                                    <motion.div
                                        ref={(el) => statsCardsRef.current.push(el)}
                                        className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 rounded-2xl shadow-lg overflow-hidden relative group"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 3 * 0.1 }}
                                        whileHover={{ translateY: -8, transition: { duration: 0.3 } }}
                                    >
                                        <div className="p-6 relative z-10">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-medium text-lg">{t("Avg Days to Expiry")}</span>
                                                <div className="p-2.5 bg-white/20 rounded-lg shadow-inner backdrop-blur-sm">
                                                    <Calendar className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <div className="text-3xl font-bold mt-2">
                                                <AnimatedCounter value={stats?.average_days_to_expiry || 0} duration={2000} />
                                            </div>
                                            <div className="mt-4 text-sm flex items-center text-white/90 backdrop-blur-sm bg-white/10 py-1.5 px-3 rounded-lg w-fit">
                                                <span>{t("days remaining")}</span>
                                            </div>
                                        </div>
                                        <div className="card-shine"></div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        {/* Charts and Data Section */}
                        <div className="p-6">
                            <div className="max-w-full mx-auto space-y-6">
                                {/* Charts Row */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Monthly Trends Chart */}
                                    <motion.div
                                        ref={(el) => chartsRef.current.push(el)}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.1 }}
                                    >
                                        <Card className="shadow-md bg-white dark:bg-slate-900 border-0 rounded-xl overflow-hidden h-full">
                                            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 px-6 py-4">
                                                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    <BarChart3 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                                                    {t("Monthly Trends")}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <div className="h-80">
                                                    <Line data={monthlyTrendsData} options={chartOptions} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Expiry Status Chart */}
                                    <motion.div
                                        ref={(el) => chartsRef.current.push(el)}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    >
                                        <Card className="shadow-md bg-white dark:bg-slate-900 border-0 rounded-xl overflow-hidden h-full">
                                            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 px-6 py-4">
                                                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    <AlertCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                                                    {t("Expiry Status")}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <div className="h-80">
                                                    <Doughnut data={expiryStatusData} options={chartOptions} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>

                                {/* Top Products and Stock Distribution */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Top Products Chart */}
                                    <motion.div
                                        ref={(el) => chartsRef.current.push(el)}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.3 }}
                                    >
                                        <Card className="shadow-md bg-white dark:bg-slate-900 border-0 rounded-xl overflow-hidden h-full">
                                            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 px-6 py-4">
                                                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    <Package className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                                                    {t("Top Products by Value")}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <div className="h-80">
                                                    <Bar data={topProductsData} options={chartOptions} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Stock Distribution Chart */}
                                    <motion.div
                                        ref={(el) => chartsRef.current.push(el)}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.4 }}
                                    >
                                        <Card className="shadow-md bg-white dark:bg-slate-900 border-0 rounded-xl overflow-hidden h-full">
                                            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 px-6 py-4">
                                                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    <Layers className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                                                    {t("Stock Distribution")}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <div className="h-80">
                                                    <Pie data={stockDistributionData} options={chartOptions} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>

                                {/* Recent Activities */}
                                <motion.div
                                    ref={(el) => chartsRef.current.push(el)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    <Card className="shadow-md bg-white dark:bg-slate-900 border-0 rounded-xl overflow-hidden">
                                        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 px-6 py-4">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    <TrendingUp className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                                                    {t("Recent Activities")}
                                                </CardTitle>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-emerald-600 dark:text-emerald-400 border-slate-200 dark:border-slate-700 rounded-lg"
                                                    >
                                                        <Link href={route("warehouse.income")}>
                                                            {t("View Income")}
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-emerald-600 dark:text-emerald-400 border-slate-200 dark:border-slate-700 rounded-lg"
                                                    >
                                                        <Link href={route("warehouse.outcome")}>
                                                            {t("View Outcome")}
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                                {stats?.recent_activities?.length > 0 ? (
                                                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                                                        {stats.recent_activities.map((activity, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex items-center gap-4 p-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150 group"
                                                            >
                                                                <div
                                                                    className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                                        activity?.type === "income"
                                                                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                                            : "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
                                                                    }`}
                                                                >
                                                                    {activity?.type === "income" ? (
                                                                        <TrendingUp className="h-5 w-5" />
                                                                    ) : (
                                                                        <TrendingDown className="h-5 w-5" />
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium text-slate-900 dark:text-white truncate">
                                                                        {activity?.title || 'Unknown Activity'}
                                                                    </p>
                                                                    <div className="flex items-center flex-wrap gap-3 mt-1 text-xs">
                                                                        <span className="flex items-center text-slate-500 dark:text-slate-400">
                                                                            <Tag className="h-3 w-3 mr-1" />
                                                                            Ref: {activity?.reference || "N/A"}
                                                                        </span>
                                                                        <span className="flex items-center text-slate-500 dark:text-slate-400">
                                                                            <Package className="h-3 w-3 mr-1" />
                                                                            Qty: {activity?.quantity || 0}
                                                                        </span>
                                                                                                                                                 <span className="flex items-center text-slate-500 dark:text-slate-400">
                                                                             <Clock className="h-3 w-3 mr-1" />
                                                                             {activity?.time || 'N/A'}
                                                                         </span>
                                                                     </div>
                                                                 </div>
                                                                 <div
                                                                     className={`text-sm font-semibold ${
                                                                         activity?.type === "income"
                                                                             ? "text-emerald-600 dark:text-emerald-400"
                                                                             : "text-rose-600 dark:text-rose-400"
                                                                     }`}
                                                                 >
                                                                     {activity?.type === "income" ? "+" : "-"}
                                                                     {formatCurrency(activity?.amount || 0)}
                                                                 </div>
                                                             </div>
                                                         ))}
                                                     </div>
                                                 ) : (
                                                     <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                                                         <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                                         <p className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                                                             {t("No recent activities")}
                                                         </p>
                                                         <p>{t("Start tracking your warehouse activities")}</p>
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