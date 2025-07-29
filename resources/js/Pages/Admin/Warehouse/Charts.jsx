import React, { useState, useEffect, useRef } from "react";
import { Head, Link } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Building2,
    ArrowLeft,
    BarChart3,
    PieChart,
    TrendingUp,
    TrendingDown,
    Package,
    Calendar,
    AlertTriangle,
    CheckCircle,
    Clock,
    DollarSign,
    Activity,
    Sparkles,
    ChevronDown,
    Download,
    RefreshCw
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";
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
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import BackButton from "@/Components/BackButton";

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
    Filler
);

export default function Charts({ auth, warehouse, chartData }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [batchFilter, setBatchFilter] = useState("all"); // all, expired, expiring_soon, valid

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-US').format(number);
    };

    // Filter batches based on status
    const filteredBatches = chartData.all_batches?.filter(batch => {
        if (batchFilter === "all") return true;
        return batch.expiry_status === batchFilter;
    }) || [];

    // Chart configurations
    const productDistributionChart = {
        labels: chartData.product_distribution.map(item => item.product),
        datasets: [
            {
                label: 'Remaining Quantity (Base Units)',
                data: chartData.product_distribution.map(item => item.total_remaining),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
                borderRadius: 8,
            },
        ],
    };

    const expiryStatusChart = {
        labels: chartData.expiry_status.map(item => {
            const statusMap = {
                'valid': t('Expired Items'),
                'expiring_soon': t('Expiring Soon'),
                'expired':t('Valid Items') 
            };
            return statusMap[item.status] || item.status;
        }),
        datasets: [
            {
                data: chartData.expiry_status.map(item => item.count),
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)', // Green for valid
                    'rgba(251, 191, 36, 0.8)', // Yellow for expiring soon
                    'rgba(239, 68, 68, 0.8)',  // Red for expired
                ],
                borderColor: [
                    'rgba(34, 197, 94, 1)',
                    'rgba(251, 191, 36, 1)',
                    'rgba(239, 68, 68, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const monthlyComparisonChart = {
        labels: chartData.monthly_comparison.map(item => {
            const date = new Date(item.month + '-01');
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        }),
        datasets: [
            {
                label: 'Income Quantity (Base Units)',
                data: chartData.monthly_comparison.map(item => item.income_quantity),
                borderColor: 'rgba(34, 197, 94, 1)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Outcome Quantity (Base Units)',
                data: chartData.monthly_comparison.map(item => item.outcome_quantity),
                borderColor: 'rgba(239, 68, 68, 1)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const topProductsByValueChart = {
        labels: chartData.top_products_by_value.map(item => item.product),
        datasets: [
            {
                label: 'Total Value',
                data: chartData.top_products_by_value.map(item => item.total_value),
                backgroundColor: 'rgba(147, 51, 234, 0.8)',
                borderColor: 'rgba(147, 51, 234, 1)',
                borderWidth: 2,
                borderRadius: 8,
            },
        ],
    };

    const unitDistributionChart = {
        labels: chartData.unit_distribution.map(item => `${item.unit} (${formatNumber(item.total_quantity)})`),
        datasets: [
            {
                data: chartData.unit_distribution.map(item => item.total_quantity),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(147, 51, 234, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(147, 51, 234, 1)',
                    'rgba(236, 72, 153, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

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
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
            },
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
            },
        },
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
            },
        },
    };

    return (
        <>
            <Head title={t("Warehouse Analytics")}>
                <style>{`
                    @keyframes shimmer {
                        0% { background-position: -1000px 0; }
                        100% { background-position: 1000px 0; }
                    }

                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }

                    .shimmer {
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                        background-size: 1000px 100%;
                        animation: shimmer 2s infinite;
                    }

                    .float-animation {
                        animation: float 6s ease-in-out infinite;
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
                                    linear-gradient(45deg, #10b981, #059669) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #10b981, #059669) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.warehouses" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Enhanced Header */}
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="glass-effect border-b border-white/20 dark:border-slate-700/50 py-6 px-8 sticky top-0 z-30"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative float-animation"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600 p-4 rounded-2xl shadow-2xl">
                                        <BarChart3 className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {t("Warehouse Analytics")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent"
                                    >
                                        {warehouse?.name || t("Warehouse")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        {warehouse?.code ? `${t("Code")}: ${warehouse.code} • ` : ""}{t("Comprehensive analytics and insights")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-2"
                            >
                                <BackButton link={route("admin.warehouses.show", warehouse.id)} />
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-700 scrollbar-track-transparent">
                        <div className="p-8 space-y-8">
                            {/* Summary Statistics Cards */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                            >
                                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{t("Total Products")}</p>
                                                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                                                    {formatNumber(chartData.summary.total_products)}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-blue-500 rounded-xl">
                                                <Package className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-green-600 dark:text-green-400">{t("Total Batches")}</p>
                                                <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                                                    {formatNumber(chartData.summary.total_batches)}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-green-500 rounded-xl">
                                                <Activity className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/30">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">{t("Total Value")}</p>
                                                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                                                    {formatCurrency(chartData.summary.total_inventory_value)}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-purple-500 rounded-xl">
                                                <DollarSign className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/30">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">{t("Remaining Qty")}</p>
                                                <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                                                    {formatNumber(chartData.summary.total_remaining_quantity)}
                                                </p>
                                                <p className="text-xs text-orange-500 dark:text-orange-400 mt-1">
                                                    {t("Base Units")}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-orange-500 rounded-xl">
                                                <TrendingUp className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Expiry Status Cards */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                            >
                                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-green-600 dark:text-green-400">{t("Valid Items")}</p>
                                                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                                    {formatNumber(chartData.summary.valid_items)}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-green-500 rounded-xl">
                                                <CheckCircle className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/30">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{t("Expiring Soon")}</p>
                                                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                                                    {formatNumber(chartData.summary.expiring_soon_items)}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-yellow-500 rounded-xl">
                                                <Clock className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-900/30">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-red-600 dark:text-red-400">{t("Expired Items")}</p>
                                                <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                                                    {formatNumber(chartData.summary.expired_items)}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-red-500 rounded-xl">
                                                <AlertTriangle className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Charts Grid */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                            >
                                {/* Product Distribution Chart */}
                                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-xl">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                            <BarChart3 className="w-5 h-5 text-blue-600" />
                                            {t("Product Distribution by Quantity")}
                                        </CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                            {t("Top 10 products by remaining quantity (converted to base units)")}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-80">
                                            <Bar data={productDistributionChart} options={chartOptions} />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Expiry Status Chart */}
                                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-xl">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                            <PieChart className="w-5 h-5 text-green-600" />
                                            {t("Expiry Status Distribution")}
                                        </CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                            {t("Distribution of items by expiry status")}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-80">
                                            <Doughnut data={expiryStatusChart} options={pieChartOptions} />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Monthly Comparison Chart */}
                                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-xl lg:col-span-2">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                            <TrendingUp className="w-5 h-5 text-purple-600" />
                                            {t("Monthly Income vs Outcome")}
                                        </CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                            {t("Comparison of income and outcome quantities over time (converted to base units)")}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-80">
                                            <Line data={monthlyComparisonChart} options={chartOptions} />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Top Products by Value Chart */}
                                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-xl">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                            <DollarSign className="w-5 h-5 text-purple-600" />
                                            {t("Top Products by Value")}
                                        </CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                            {t("Top 10 products by total inventory value")}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-80">
                                            <Bar data={topProductsByValueChart} options={chartOptions} />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Unit Distribution Chart */}
                                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-xl">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                            <Package className="w-5 h-5 text-indigo-600" />
                                            {t("Unit Distribution")}
                                        </CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                            {t("Distribution of items by unit type (quantities in base units)")}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-80">
                                            <Pie data={unitDistributionChart} options={pieChartOptions} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Detailed Data Tables */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="space-y-6"
                            >
                                {/* Top Products Table */}
                                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-xl">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                            <TrendingUp className="w-5 h-5 text-green-600" />
                                            {t("Top Products by Value")}
                                        </CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                            {t("Detailed breakdown of highest value products")}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {filteredBatches.length === 0 ? (
                                            <div className="text-center py-8">
                                                <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                                <p className="text-slate-600 dark:text-slate-400">{t("No batches found with the selected filter")}</p>
                                            </div>
                                        ) : (
                                            <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    {t("Showing")} <span className="font-semibold">{filteredBatches.length}</span> {t("batches")}
                                                    {batchFilter !== "all" && (
                                                        <span> ({t("filtered by")} <span className="font-semibold">{t(batchFilter.replace('_', ' '))}</span>)</span>
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-slate-200 dark:border-slate-600">
                                                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t("Product")}</th>
                                                        <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t("Remaining Qty")}</th>
                                                        <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t("Total Value")}</th>
                                                        <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t("Remaining Value")}</th>
                                                        <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t("Profit")}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {chartData.top_products_by_value.map((product, index) => (
                                                        <tr key={index} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                                                            <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{product.product}</td>
                                                            <td className="py-3 px-4 text-right font-semibold text-orange-600 dark:text-orange-400">
                                                                {product.total_remaining_formatted || formatNumber(product.total_remaining) + ' Units'}
                                                            </td>
                                                            <td className="py-3 px-4 text-right font-semibold text-green-600 dark:text-green-400">{formatCurrency(product.total_value)}</td>
                                                            <td className="py-3 px-4 text-right font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(product.remaining_value)}</td>
                                                            <td className="py-3 px-4 text-right font-semibold text-purple-600 dark:text-purple-400">{formatCurrency(product.profit)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* All Batches with Expiry Dates Table */}
                                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-xl">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                                    <Calendar className="w-5 h-5 text-red-600" />
                                                    {t("All Batches with Expiry Dates")}
                                                </CardTitle>
                                                <CardDescription className="text-slate-600 dark:text-slate-400">
                                                    {t("Complete list of all batches including expired products")}
                                                </CardDescription>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={batchFilter}
                                                    onChange={(e) => setBatchFilter(e.target.value)}
                                                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="all">{t("All Batches")} ({chartData.all_batches?.length || 0})</option>
                                                    <option value="valid">{t("Valid")} ({chartData.summary.valid_items})</option>
                                                    <option value="expiring_soon">{t("Expiring Soon")} ({chartData.summary.expiring_soon_items})</option>
                                                    <option value="expired">{t("Expired")} ({chartData.summary.expired_items})</option>
                                                </select>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {filteredBatches.length === 0 ? (
                                            <div className="text-center py-8">
                                                <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                                <p className="text-slate-600 dark:text-slate-400">{t("No batches found with the selected filter")}</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                                        {t("Showing")} <span className="font-semibold">{filteredBatches.length}</span> {t("batches")}
                                                        {batchFilter !== "all" && (
                                                            <span> ({t("filtered by")} <span className="font-semibold">{t(batchFilter.replace('_', ' '))}</span>)</span>
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-slate-200 dark:border-slate-600">
                                                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t("Product")}</th>
                                                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t("Batch Ref")}</th>
                                                        <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t("Remaining Qty")}</th>
                                                        <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t("Expiry Date")}</th>
                                                        <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t("Days Left")}</th>
                                                        <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t("Status")}</th>
                                                        <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t("Value")}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredBatches.map((batch, index) => {
                                                        const getStatusBadge = (status) => {
                                                            switch (status) {
                                                                case 'expired':
                                                                    return (
                                                                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-700">
                                                                            {t("Expired")}
                                                                        </Badge>
                                                                    );
                                                                case 'expiring_soon':
                                                                    return (
                                                                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700">
                                                                            {t("Expiring Soon")}
                                                                        </Badge>
                                                                    );
                                                                case 'valid':
                                                                    return (
                                                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-700">
                                                                            {t("Valid")}
                                                                        </Badge>
                                                                    );
                                                                default:
                                                                    return (
                                                                        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-700">
                                                                            {status}
                                                                        </Badge>
                                                                    );
                                                            }
                                                        };

                                                        const getDaysLeftColor = (daysLeft) => {
                                                            if (daysLeft < 0) return 'text-red-600 dark:text-red-400';
                                                            if (daysLeft <= 30) return 'text-yellow-600 dark:text-yellow-400';
                                                            return 'text-green-600 dark:text-green-400';
                                                        };

                                                        const getDaysLeftText = (daysLeft) => {
                                                            if (daysLeft < 0) return `${Math.abs(daysLeft)} ${t("days expired")}`;
                                                            if (daysLeft === 0) return t("Expires today");
                                                            return `${daysLeft} ${t("days left")}`;
                                                        };

                                                        return (
                                                            <tr key={index} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                                                                <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                                                                    <div>
                                                                        <div className="font-semibold">{batch.product_name}</div>
                                                                        <div className="text-xs text-slate-500 dark:text-slate-400">{batch.product_barcode}</div>
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono text-sm">
                                                                    {batch.batch_reference}
                                                                </td>
                                                                <td className="py-3 px-4 text-right font-semibold text-orange-600 dark:text-orange-400">
                                                                    {formatNumber(batch.remaining_qty_converted)} {batch.unit_name}
                                                                </td>
                                                                <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-400">
                                                                    {batch.expire_date ? new Date(batch.expire_date).toLocaleDateString() : t("No expiry")}
                                                                </td>
                                                                <td className="py-3 px-4 text-center">
                                                                    <span className={`font-semibold ${getDaysLeftColor(batch.days_to_expiry)}`}>
                                                                        {getDaysLeftText(batch.days_to_expiry)}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 px-4 text-center">
                                                                    {getStatusBadge(batch.expiry_status)}
                                                                </td>
                                                                <td className="py-3 px-4 text-right font-semibold text-green-600 dark:text-green-400">
                                                                    {formatCurrency(batch.total_income_value)}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
} 