import React, { useState, useEffect, useRef } from "react";
import { Head, Link } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import CustomerNavbar from "@/Components/CustomerNavbar";
import { motion } from "framer-motion";
import {
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    Package,
    Layers,
    DollarSign,
    Calendar,
    ChevronRight,
    Plus,
    RefreshCcw,
    ArrowUp,
    ArrowDown,
    Filter,
    CreditCard,
    TrendingUp,
    Clock,
    Hash,
    Check,
    ShoppingCart,
    Eye,
} from "lucide-react";
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

// AnimatedCounter component for beautiful number animations
const AnimatedCounter = ({
    value,
    prefix = "",
    suffix = "",
    duration = 800,
}) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseInt(value);
        if (start === end) return;

        // Use faster incrementTime for a quicker animation
        const incrementTime = (duration / end) * 1000;
        // Set a minimum time between increments to ensure smooth animation
        const minIncrementTime = Math.max(5, incrementTime);
        // For very large numbers, use larger steps
        const step = end > 1000 ? Math.ceil(end / 100) : 1;

        let timer = setInterval(() => {
            start = Math.min(start + step, end);
            setCount(start);
            if (start === end) clearInterval(timer);
        }, minIncrementTime);

        return () => {
            clearInterval(timer);
        };
    }, [value, duration]);

    return (
        <span>
            {prefix}
            {count.toLocaleString()}
            {suffix}
        </span>
    );
};

export default function CustomerDashboard({ auth, stats = {} }) {
    const { t } = useLaravelReactI18n();
    const [isLoading, setIsLoading] = useState(true);

    // Refs for animations
    const headerRef = useRef(null);
    const statsCardsRef = useRef([]);
    const chartsRef = useRef([]);

    // Make sure stats is an object
    const safeStats = typeof stats === "object" && stats !== null ? stats : {};

    // Default stats if not provided
    const defaultStats = {
        total_income: 0,
        total_outcome: 0,
        total_income_quantity: 0,
        total_outcome_quantity: 0,
        net_quantity: 0,
        net_value: 0,
        top_products: [],
        monthly_stock_data: [],
        stock_distribution: [],
        recent_movements: [],
        filters: {
            date_from: null,
            date_to: null,
        },
    };

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

    // Colors for charts
    const COLORS = ["#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"];

    // Simulate loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

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
                        animation: shimmer 3s infinite;
                    }
                `}</style>
            </Head>

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden max-w-full">
                {/* Sidebar */}
                <CustomerNavbar
                    auth={auth || { user: { name: "Customer" } }}
                    currentRoute="customer.dashboard"
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden max-w-full">
                    {/* Header */}
                    <motion.header
                        ref={headerRef}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-0.5">
                                    {t("Customer Portal")}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    {t("Dashboard Overview")}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href={route("customer.dashboard")}
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <RefreshCcw className="h-4 w-4" />
                                    <span>{t("Refresh")}</span>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 bg-slate-50 dark:bg-slate-950">
                        <div className="max-w-7xl mx-auto relative">
                            {/* Background Elements */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/30 to-purple-50/30 dark:from-slate-900/30 dark:to-slate-800/30 pointer-events-none"></div>
                            <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200/30 dark:bg-blue-900/20 rounded-full filter blur-3xl animate-pulse pointer-events-none"></div>
                            <div
                                className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-200/30 dark:bg-purple-900/20 rounded-full filter blur-3xl animate-pulse pointer-events-none"
                                style={{ animationDelay: "1s" }}
                            ></div>
                            <div
                                className="absolute top-1/3 right-1/4 w-40 h-40 bg-pink-200/20 dark:bg-pink-900/10 rounded-full filter blur-2xl animate-pulse pointer-events-none"
                                style={{ animationDelay: "2s" }}
                            ></div>

                            <div className="relative z-10">
                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    <motion.div
                                        ref={(el) =>
                                            (statsCardsRef.current[0] = el)
                                        }
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: 0.05,
                                        }}
                                        whileHover={{
                                            y: -5,
                                            transition: { duration: 0.2 },
                                        }}
                                        className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                                        <div className="card-shine"></div>
                                        <div className="p-6 relative z-10">
                                            <div className="flex justify-between items-center mb-3">
                                                <h2 className="text-lg font-medium text-white">
                                                    {t("Total Stock In")}
                                                </h2>
                                                <div className="p-2 bg-white/20 rounded-lg">
                                                    <ArrowUpRight className="h-5 w-5 text-white" />
                                                </div>
                                            </div>
                                            <div className="text-3xl font-bold text-white mb-1">
                                                <AnimatedCounter
                                                    value={
                                                        mergedStats.total_income_quantity
                                                    }
                                                />
                                            </div>
                                            <p className="text-blue-100">
                                                {formatCurrency(
                                                    mergedStats.total_income
                                                )}
                                            </p>

                                            <div className="mt-4 flex items-center text-sm text-white/90">
                                                <div className="px-2 py-1 rounded-md bg-white/10 border border-white/10 backdrop-blur-sm">
                                                    <TrendingUp className="h-3.5 w-3.5 inline mr-1" />
                                                    <span>
                                                        {t("Incoming Stock")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        ref={(el) =>
                                            (statsCardsRef.current[1] = el)
                                        }
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: 0.1,
                                        }}
                                        whileHover={{
                                            y: -5,
                                            transition: { duration: 0.2 },
                                        }}
                                        className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-lg relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                                        <div className="card-shine"></div>
                                        <div className="p-6 relative z-10">
                                            <div className="flex justify-between items-center mb-3">
                                                <h2 className="text-lg font-medium text-white">
                                                    {t("Total Stock Out")}
                                                </h2>
                                                <div className="p-2 bg-white/20 rounded-lg">
                                                    <ArrowDownRight className="h-5 w-5 text-white" />
                                                </div>
                                            </div>
                                            <div className="text-3xl font-bold text-white mb-1">
                                                <AnimatedCounter
                                                    value={
                                                        mergedStats.total_outcome_quantity
                                                    }
                                                />
                                            </div>
                                            <p className="text-pink-100">
                                                {formatCurrency(
                                                    mergedStats.total_outcome
                                                )}
                                            </p>

                                            <div className="mt-4 flex items-center text-sm text-white/90">
                                                <div className="px-2 py-1 rounded-md bg-white/10 border border-white/10 backdrop-blur-sm">
                                                    <ShoppingCart className="h-3.5 w-3.5 inline mr-1" />
                                                    <span>
                                                        {t("Outgoing Stock")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        ref={(el) =>
                                            (statsCardsRef.current[2] = el)
                                        }
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: 0.15,
                                        }}
                                        whileHover={{
                                            y: -5,
                                            transition: { duration: 0.2 },
                                        }}
                                        className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                                        <div className="card-shine"></div>
                                        <div className="p-6 relative z-10">
                                            <div className="flex justify-between items-center mb-3">
                                                <h2 className="text-lg font-medium text-white">
                                                    {t("Net Stock")}
                                                </h2>
                                                <div className="p-2 bg-white/20 rounded-lg">
                                                    <Layers className="h-5 w-5 text-white" />
                                                </div>
                                            </div>
                                            <div className="text-3xl font-bold text-white mb-1">
                                                <AnimatedCounter
                                                    value={
                                                        mergedStats.net_quantity
                                                    }
                                                />
                                            </div>
                                            <p className="text-emerald-100">
                                                {t("Current stock level")}
                                            </p>

                                            <div className="mt-4 flex items-center text-sm text-white/90">
                                                <div className="px-2 py-1 rounded-md bg-white/10 border border-white/10 backdrop-blur-sm">
                                                    {mergedStats.net_quantity >
                                                    0 ? (
                                                        <ArrowUp className="h-3.5 w-3.5 inline mr-1" />
                                                    ) : (
                                                        <ArrowDown className="h-3.5 w-3.5 inline mr-1" />
                                                    )}
                                                    <span>
                                                        {t("Total Inventory")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        ref={(el) =>
                                            (statsCardsRef.current[3] = el)
                                        }
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: 0.2,
                                        }}
                                        whileHover={{
                                            y: -5,
                                            transition: { duration: 0.2 },
                                        }}
                                        className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                                        <div className="card-shine"></div>
                                        <div className="p-6 relative z-10">
                                            <div className="flex justify-between items-center mb-3">
                                                <h2 className="text-lg font-medium text-white">
                                                    {t("Net Value")}
                                                </h2>
                                                <div className="p-2 bg-white/20 rounded-lg">
                                                    <DollarSign className="h-5 w-5 text-white" />
                                                </div>
                                            </div>
                                            <div className="text-3xl font-bold text-white mb-1">
                                                <AnimatedCounter
                                                    value={parseFloat(
                                                        mergedStats.net_value
                                                    )}
                                                    prefix="$"
                                                />
                                            </div>
                                            <p className="text-amber-100">
                                                {t("Total inventory value")}
                                            </p>

                                            <div className="mt-4 flex items-center text-sm text-white/90">
                                                <div className="px-2 py-1 rounded-md bg-white/10 border border-white/10 backdrop-blur-sm">
                                                    <CreditCard className="h-3.5 w-3.5 inline mr-1" />
                                                    <span>
                                                        {t("Asset Worth")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Top Products */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 mb-8 overflow-hidden">
                                    <h2 className="text-xl font-bold mb-4">
                                        {t("Top Products")}
                                    </h2>
                                    {mergedStats.top_products &&
                                    mergedStats.top_products.length > 0 ? (
                                        <div className="overflow-x-auto max-w-full">
                                            <table className="w-full min-w-full">
                                                <thead>
                                                    <tr className="border-b">
                                                        <th className="text-left p-2">
                                                            {t("Product")}
                                                        </th>
                                                        <th className="text-right p-2">
                                                            {t("Stock In")}
                                                        </th>
                                                        <th className="text-right p-2">
                                                            {t("Stock Out")}
                                                        </th>
                                                        <th className="text-right p-2">
                                                            {t("Net")}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {mergedStats.top_products.map(
                                                        (product) => (
                                                            <tr
                                                                key={product.id}
                                                                className="border-b hover:bg-slate-50"
                                                            >
                                                                <td className="p-2">
                                                                    {
                                                                        product.name
                                                                    }
                                                                </td>
                                                                <td className="text-right p-2">
                                                                    {
                                                                        product.income_quantity
                                                                    }
                                                                </td>
                                                                <td className="text-right p-2">
                                                                    {
                                                                        product.outcome_quantity
                                                                    }
                                                                </td>
                                                                <td className="text-right p-2 font-medium">
                                                                    {
                                                                        product.net_quantity
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">
                                            {t("No products data available")}
                                        </p>
                                    )}
                                </div>

                                {/* Recent Stock Movements */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.4 }}
                                    className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-800"
                                >
                                    <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <RefreshCcw className="h-5 w-5 text-blue-500 mr-2" />
                                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                    {t(
                                                        "Recent Stock Movements"
                                                    )}
                                                </h2>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={route(
                                                        "customer.stock-incomes.index"
                                                    )}
                                                    className="px-3 py-1.5 text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 rounded-lg flex items-center gap-1.5 transition-colors"
                                                >
                                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                                    <span>
                                                        {t("View All Incoming")}
                                                    </span>
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "customer.stock-outcomes.index"
                                                    )}
                                                    className="px-3 py-1.5 text-sm bg-pink-50 hover:bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:hover:bg-pink-900/50 dark:text-pink-400 rounded-lg flex items-center gap-1.5 transition-colors"
                                                >
                                                    <ArrowDownRight className="h-3.5 w-3.5" />
                                                    <span>
                                                        {t("View All Outgoing")}
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        {mergedStats.recent_movements &&
                                        mergedStats.recent_movements.length >
                                            0 ? (
                                            <div className="overflow-x-auto max-w-full">
                                                <table className="w-full min-w-full">
                                                    <thead>
                                                        <tr>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                {t("Type")}
                                                            </th>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                {t("Product")}
                                                            </th>
                                                            <th className="px-4 py-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                {t("Quantity")}
                                                            </th>
                                                            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                {t("Total")}
                                                            </th>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                {t("Reference")}
                                                            </th>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                {t("Date")}
                                                            </th>
                                                            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                {t("Actions")}
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                        {mergedStats.recent_movements.map(
                                                            (
                                                                movement,
                                                                index
                                                            ) => (
                                                                <motion.tr
                                                                    key={`${movement.type}-${movement.id}`}
                                                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                                                                    initial={{
                                                                        opacity: 0,
                                                                        y: 10,
                                                                    }}
                                                                    animate={{
                                                                        opacity: 1,
                                                                        y: 0,
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.3,
                                                                        delay:
                                                                            index *
                                                                                0.05 +
                                                                            0.4,
                                                                    }}
                                                                >
                                                                    <td className="px-4 py-3">
                                                                        <div
                                                                            className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                                                                                movement.type ===
                                                                                "income"
                                                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                                                    : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                                                                            }`}
                                                                        >
                                                                            {movement.type ===
                                                                            "income" ? (
                                                                                <ArrowUpRight className="h-3 w-3" />
                                                                            ) : (
                                                                                <ArrowDownRight className="h-3 w-3" />
                                                                            )}
                                                                            <span>
                                                                                {movement.type ===
                                                                                "income"
                                                                                    ? t(
                                                                                          "In"
                                                                                      )
                                                                                    : t(
                                                                                          "Out"
                                                                                      )}
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        <div className="flex items-center">
                                                                            <div className="h-7 w-7 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-2">
                                                                                <Package className="h-3.5 w-3.5" />
                                                                            </div>
                                                                            <span className="font-medium text-slate-900 dark:text-white">
                                                                                {
                                                                                    movement.product
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-center">
                                                                        <span className="font-medium text-slate-900 dark:text-white">
                                                                            {
                                                                                movement.quantity
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-right">
                                                                        <span className="font-medium text-slate-900 dark:text-white">
                                                                            {formatCurrency(
                                                                                movement.total
                                                                            )}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        <div className="flex items-center">
                                                                            <Hash className="h-3.5 w-3.5 text-slate-400 mr-1.5" />
                                                                            <span className="text-slate-600 dark:text-slate-300">
                                                                                {
                                                                                    movement.reference
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        <div className="flex items-center">
                                                                            <Calendar className="h-3.5 w-3.5 text-slate-400 mr-1.5" />
                                                                            <span className="text-slate-600 dark:text-slate-300">
                                                                                {
                                                                                    movement.date
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-right">
                                                                        <Link
                                                                            href={route(
                                                                                movement.type ===
                                                                                    "income"
                                                                                    ? "customer.stock-incomes.show"
                                                                                    : "customer.stock-outcomes.show",
                                                                                movement.id
                                                                            )}
                                                                            className="inline-flex items-center px-2.5 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                                        >
                                                                            <Eye className="h-3.5 w-3.5 mr-1" />
                                                                            <span>
                                                                                {t(
                                                                                    "View"
                                                                                )}
                                                                            </span>
                                                                        </Link>
                                                                    </td>
                                                                </motion.tr>
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="mx-auto h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                                    <RefreshCcw className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                                                </div>
                                                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                                                    {t(
                                                        "No recent stock movements"
                                                    )}
                                                </h3>
                                                <p className="text-slate-500 dark:text-slate-400 mb-6">
                                                    {t(
                                                        "Add your first stock entry to see movements here"
                                                    )}
                                                </p>
                                                <Link
                                                    href={route(
                                                        "customer.stock-incomes.create"
                                                    )}
                                                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors"
                                                >
                                                    <Plus className="h-4 w-4 mr-1.5" />
                                                    <span>
                                                        {t("Add Stock")}
                                                    </span>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Charts Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                    {/* Monthly Stock Chart */}
                                    <motion.div
                                        ref={(el) =>
                                            (chartsRef.current[0] = el)
                                        }
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: 0.25,
                                        }}
                                        className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-800"
                                    >
                                        <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900">
                                            <div className="flex items-center">
                                                <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
                                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                    {t(
                                                        "Monthly Stock Movement"
                                                    )}
                                                </h2>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="h-72">
                                                {mergedStats.monthly_stock_data &&
                                                mergedStats.monthly_stock_data
                                                    .length > 0 ? (
                                                    <ResponsiveContainer
                                                        width="100%"
                                                        height="100%"
                                                    >
                                                        <BarChart
                                                            data={
                                                                mergedStats.monthly_stock_data
                                                            }
                                                        >
                                                            <CartesianGrid
                                                                strokeDasharray="3 3"
                                                                vertical={false}
                                                                className="stroke-slate-200 dark:stroke-slate-700"
                                                            />
                                                            <XAxis
                                                                dataKey="name"
                                                                axisLine={false}
                                                                tickLine={false}
                                                                className="text-slate-500 dark:text-slate-400 text-xs"
                                                            />
                                                            <YAxis
                                                                axisLine={false}
                                                                tickLine={false}
                                                                className="text-slate-500 dark:text-slate-400 text-xs"
                                                            />
                                                            <Tooltip
                                                                contentStyle={{
                                                                    backgroundColor:
                                                                        "rgba(255, 255, 255, 0.9)",
                                                                    borderColor:
                                                                        "#e2e8f0",
                                                                    borderRadius:
                                                                        "0.5rem",
                                                                    boxShadow:
                                                                        "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                                                    paddingTop:
                                                                        "0.5rem",
                                                                    paddingBottom:
                                                                        "0.5rem",
                                                                }}
                                                            />
                                                            <Bar
                                                                name={t(
                                                                    "Stock In"
                                                                )}
                                                                dataKey="income"
                                                                fill="#3b82f6"
                                                                radius={[
                                                                    4, 4, 0, 0,
                                                                ]}
                                                                animationDuration={
                                                                    800
                                                                }
                                                            />
                                                            <Bar
                                                                name={t(
                                                                    "Stock Out"
                                                                )}
                                                                dataKey="outcome"
                                                                fill="#ec4899"
                                                                radius={[
                                                                    4, 4, 0, 0,
                                                                ]}
                                                                animationDuration={
                                                                    800
                                                                }
                                                                animationBegin={
                                                                    100
                                                                }
                                                            />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                ) : (
                                                    <div className="h-full flex items-center justify-center flex-col">
                                                        <BarChart3 className="h-16 w-16 text-slate-200 dark:text-slate-700 mb-4" />
                                                        <p className="text-slate-400 dark:text-slate-500">
                                                            {t(
                                                                "No monthly data available"
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Stock Distribution Chart */}
                                    <motion.div
                                        ref={(el) =>
                                            (chartsRef.current[1] = el)
                                        }
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: 0.3,
                                        }}
                                        className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-800"
                                    >
                                        <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900">
                                            <div className="flex items-center">
                                                <Package className="h-5 w-5 text-purple-500 mr-2" />
                                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                    {t("Stock Distribution")}
                                                </h2>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="h-72">
                                                {mergedStats.stock_distribution &&
                                                mergedStats.stock_distribution
                                                    .length > 0 ? (
                                                    <ResponsiveContainer
                                                        width="100%"
                                                        height="100%"
                                                    >
                                                        <PieChart>
                                                            <Pie
                                                                data={
                                                                    mergedStats.stock_distribution
                                                                }
                                                                cx="50%"
                                                                cy="50%"
                                                                innerRadius={60}
                                                                outerRadius={90}
                                                                paddingAngle={2}
                                                                dataKey="value"
                                                                nameKey="name"
                                                                animationDuration={
                                                                    1000
                                                                }
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
                                                                labelLine={
                                                                    false
                                                                }
                                                            >
                                                                {mergedStats.stock_distribution.map(
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
                                                                formatter={(
                                                                    value
                                                                ) => [
                                                                    value,
                                                                    "Quantity",
                                                                ]}
                                                                contentStyle={{
                                                                    backgroundColor:
                                                                        "rgba(255, 255, 255, 0.9)",
                                                                    borderColor:
                                                                        "#e2e8f0",
                                                                    borderRadius:
                                                                        "0.5rem",
                                                                    boxShadow:
                                                                        "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                                                    paddingTop:
                                                                        "0.5rem",
                                                                    paddingBottom:
                                                                        "0.5rem",
                                                                }}
                                                            />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                ) : (
                                                    <div className="h-full flex items-center justify-center flex-col">
                                                        <Package className="h-16 w-16 text-slate-200 dark:text-slate-700 mb-4" />
                                                        <p className="text-slate-400 dark:text-slate-500">
                                                            {t(
                                                                "No distribution data available"
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Top Products */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.35 }}
                                    className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-800 mb-8"
                                >
                                    <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900">
                                        <div className="flex items-center">
                                            <TrendingUp className="h-5 w-5 text-emerald-500 mr-2" />
                                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                {t("Top Products")}
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        {mergedStats.top_products &&
                                        mergedStats.top_products.length > 0 ? (
                                            <div className="overflow-x-auto max-w-full">
                                                <table className="w-full min-w-full">
                                                    <thead>
                                                        <tr>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                {t("Product")}
                                                            </th>
                                                            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                {t("Stock In")}
                                                            </th>
                                                            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                {t("Stock Out")}
                                                            </th>
                                                            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                {t(
                                                                    "Net Quantity"
                                                                )}
                                                            </th>
                                                            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                {t("Net Total")}
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                        {mergedStats.top_products.map(
                                                            (
                                                                product,
                                                                index
                                                            ) => (
                                                                <motion.tr
                                                                    key={
                                                                        product.id
                                                                    }
                                                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                                                    initial={{
                                                                        opacity: 0,
                                                                        y: 10,
                                                                    }}
                                                                    animate={{
                                                                        opacity: 1,
                                                                        y: 0,
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.3,
                                                                        delay:
                                                                            index *
                                                                                0.05 +
                                                                            0.35,
                                                                    }}
                                                                >
                                                                    <td className="px-4 py-3">
                                                                        <div className="flex items-center">
                                                                            <div className="h-8 w-8 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3">
                                                                                <Package className="h-4 w-4" />
                                                                            </div>
                                                                            <span className="font-medium text-slate-900 dark:text-white">
                                                                                {
                                                                                    product.name
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-right">
                                                                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                                                            {
                                                                                product.income_quantity
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-right">
                                                                        <span className="text-rose-600 dark:text-rose-400 font-medium">
                                                                            {
                                                                                product.outcome_quantity
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-right">
                                                                        <span className="font-semibold text-slate-900 dark:text-white">
                                                                            {
                                                                                product.net_quantity
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-right">
                                                                        <span className="font-semibold text-slate-900 dark:text-white">
                                                                            {formatCurrency(
                                                                                product.net_total
                                                                            )}
                                                                        </span>
                                                                    </td>
                                                                </motion.tr>
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <Package className="h-12 w-12 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
                                                <p className="text-slate-500 dark:text-slate-400">
                                                    {t(
                                                        "No product data available"
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
