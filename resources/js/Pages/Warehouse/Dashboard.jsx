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
} from "lucide-react";
import anime from "animejs";
import Navigation from "@/Components/Warehouse/Navigation";
import { motion } from "framer-motion";

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
            {/* Background patterns */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>

            {/* Animated light beams */}
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
                        className="absolute w-64 h-64 rounded-full bg-emerald-600/5 filter blur-2xl"
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
                        className="absolute w-72 h-72 rounded-full bg-teal-500/5 filter blur-2xl transform -translate-x-4 translate-y-4"
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
                            className="absolute h-[70%] w-[70%] rounded-full border-4 border-emerald-400/30"
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
                            className="absolute h-full w-full rounded-full border-4 border-r-emerald-400 border-t-transparent border-l-transparent border-b-transparent"
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 1.5,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                        />
                        <motion.div
                            className="absolute h-full w-full rounded-full border-4 border-b-teal-400 border-t-transparent border-l-transparent border-r-transparent"
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

export default function Dashboard({ auth, stats }) {
    const { t } = useLaravelReactI18n();

    // State for loading and animations
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);

    // Refs for animation targets
    const headerRef = useRef(null);
    const statsCardsRef = useRef([]);
    const chartsRef = useRef([]);
    const timelineRef = useRef(null);

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

    // Simplified pie chart data from top-selling products
    const pieData =
        stats?.top_selling_products?.map((product) => ({
            name: product.name,
            value: product.qty_sold,
        })) || [];

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

    return (
        <>
            <Head title={t("Warehouse Dashboard")}>
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
                                    <Badge
                                        variant="outline"
                                        className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 rounded-full"
                                    >
                                        {auth.user.warehouse.name}
                                    </Badge>
                                </h1>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {/* Dashboard Stats Section */}
                        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 relative flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/30 to-white/30 dark:from-slate-900/30 dark:to-slate-950/30 opacity-80"></div>

                            {/* Animated background elements */}
                            <div className="absolute -left-40 -top-40 w-96 h-96 bg-emerald-200/20 dark:bg-emerald-900/10 rounded-full filter blur-3xl animate-pulse"></div>
                            <div
                                className="absolute right-20 top-10 w-72 h-72 bg-teal-200/20 dark:bg-teal-900/10 rounded-full filter blur-3xl animate-pulse"
                                style={{ animationDuration: "15s" }}
                            ></div>
                            <div
                                className="absolute -right-40 -bottom-40 w-80 h-80 bg-green-200/20 dark:bg-green-900/10 rounded-full filter blur-3xl animate-pulse"
                                style={{
                                    animationDuration: "20s",
                                    animationDelay: "2s",
                                }}
                            ></div>
                            <div
                                className="absolute left-1/3 bottom-0 w-64 h-64 bg-lime-200/20 dark:bg-lime-900/10 rounded-full filter blur-3xl animate-pulse"
                                style={{
                                    animationDuration: "18s",
                                    animationDelay: "1s",
                                }}
                            ></div>

                            <div className="relative z-10 max-w-7xl mx-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
                                    <motion.div
                                        ref={(el) =>
                                            statsCardsRef.current.push(el)
                                        }
                                        className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-0 rounded-2xl shadow-lg overflow-hidden relative group"
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
                                                    {t("Total Stock")}
                                                </span>
                                                <div className="p-2.5 bg-white/20 rounded-lg shadow-inner backdrop-blur-sm transform group-hover:rotate-3 transition-transform duration-300 border border-white/10">
                                                    <Layers className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <div className="text-3xl font-bold mt-2 flex items-end transform group-hover:scale-105 transition-transform origin-left duration-300">
                                                <AnimatedCounter
                                                    value={
                                                        stats?.total_stock || 0
                                                    }
                                                    duration={2000}
                                                />
                                            </div>
                                            <div className="mt-4 text-sm flex items-center text-white/90 backdrop-blur-sm bg-white/10 py-1.5 px-3 rounded-lg w-fit group-hover:bg-white/20 transition-colors duration-300 border border-white/10">
                                                {stats?.low_stock_count > 0 ? (
                                                    <div className="flex items-center">
                                                        <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                                                        <span>
                                                            {
                                                                stats.low_stock_count
                                                            }{" "}
                                                            {t(
                                                                "products low on stock"
                                                            )}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span>
                                                        {t(
                                                            "Inventory levels good"
                                                        )}
                                                    </span>
                                                )}
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
                                            <Layers className="h-16 w-16" />
                                        </motion.div>
                                    </motion.div>

                                    <motion.div
                                        ref={(el) =>
                                            statsCardsRef.current.push(el)
                                        }
                                        className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0 rounded-2xl shadow-lg overflow-hidden relative group"
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
                                                    {t("Inventory Value")}
                                                </span>
                                                <div className="p-2.5 bg-white/20 rounded-lg shadow-inner backdrop-blur-sm transform group-hover:rotate-3 transition-transform duration-300 border border-white/10">
                                                    <DollarSign className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <div className="text-3xl font-bold mt-2 flex items-end transform group-hover:scale-105 transition-transform origin-left duration-300">
                                                <AnimatedCounter
                                                    value={
                                                        parseFloat(
                                                            stats?.total_inventory_value
                                                        ) || 0
                                                    }
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
                                        className="bg-gradient-to-br from-pink-500 to-rose-600 text-white border-0 rounded-2xl shadow-lg overflow-hidden relative group"
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
                                                    {t("Total Sales")}
                                                </span>
                                                <div className="p-2.5 bg-white/20 rounded-lg shadow-inner backdrop-blur-sm transform group-hover:rotate-3 transition-transform duration-300 border border-white/10">
                                                    <TrendingUp className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <div className="text-3xl font-bold mt-2 flex items-end transform group-hover:scale-105 transition-transform origin-left duration-300">
                                                <AnimatedCounter
                                                    value={
                                                        parseFloat(
                                                            stats?.total_outcome_value
                                                        ) || 0
                                                    }
                                                    prefix="$"
                                                    duration={2000}
                                                />
                                            </div>
                                            <div className="mt-4 text-sm flex items-center text-white/90 backdrop-blur-sm bg-white/10 py-1.5 px-3 rounded-lg w-fit group-hover:bg-white/20 transition-colors duration-300 border border-white/10">
                                                <span>
                                                    {stats?.total_outcome_quantity ||
                                                        0}{" "}
                                                    {t("units sold")}
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
                                            <ShoppingCart className="h-16 w-16" />
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
                                                    {t("Total Profit")}
                                                </span>
                                                <div className="p-2.5 bg-white/20 rounded-lg shadow-inner backdrop-blur-sm transform group-hover:rotate-3 transition-transform duration-300 border border-white/10">
                                                    <TrendingUp className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <div className="text-3xl font-bold mt-2 flex items-end transform group-hover:scale-105 transition-transform origin-left duration-300">
                                                <AnimatedCounter
                                                    value={
                                                        parseFloat(
                                                            stats?.total_profit
                                                        ) || 0
                                                    }
                                                    prefix="$"
                                                    duration={2000}
                                                />
                                            </div>
                                            <div className="mt-4 text-sm flex items-center text-white/90 backdrop-blur-sm bg-white/10 py-1.5 px-3 rounded-lg w-fit group-hover:bg-white/20 transition-colors duration-300 border border-white/10">
                                                <Percent className="h-3.5 w-3.5 mr-1" />
                                                <span>
                                                    {t("Margin")}:{" "}
                                                    {stats?.profit_margin?.toFixed(
                                                        1
                                                    ) || 0}
                                                    %
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
                                            <DollarSign className="h-16 w-16" />
                                        </motion.div>
                                    </motion.div>

                                    <motion.div
                                        ref={(el) =>
                                            statsCardsRef.current.push(el)
                                        }
                                        className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 rounded-2xl shadow-lg overflow-hidden relative group"
                                        style={{ perspective: "1000px" }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 4 * 0.1,
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
                                                    {t("Turnover Rate")}
                                                </span>
                                                <div className="p-2.5 bg-white/20 rounded-lg shadow-inner backdrop-blur-sm transform group-hover:rotate-3 transition-transform duration-300 border border-white/10">
                                                    <RefreshCcw className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <div className="text-3xl font-bold mt-2 flex items-end transform group-hover:scale-105 transition-transform origin-left duration-300">
                                                <AnimatedCounter
                                                    value={
                                                        parseFloat(
                                                            stats?.inventory_turnover?.toFixed(
                                                                2
                                                            )
                                                        ) || 0
                                                    }
                                                    duration={2000}
                                                />
                                            </div>
                                            <div className="mt-4 text-sm flex items-center text-white/90 backdrop-blur-sm bg-white/10 py-1.5 px-3 rounded-lg w-fit group-hover:bg-white/20 transition-colors duration-300 border border-white/10">
                                                <ArrowUp className="h-3.5 w-3.5 mr-1" />
                                                <span>
                                                    {t("Higher is better")}
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
                                                rotate: [0, 10, 0],
                                            }}
                                            transition={{
                                                duration: 7,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                        >
                                            <RefreshCcw className="h-16 w-16" />
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
                                    {/* Monthly Sales Chart */}
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
                                                    <BarChart3 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                                                    {t(
                                                        "Monthly Sales (Current Year)"
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
                                                                stats?.monthly_sales ||
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
                                                                tickFormatter={(
                                                                    value
                                                                ) =>
                                                                    `$${value}`
                                                                }
                                                                tick={{
                                                                    fill: "#64748b",
                                                                }}
                                                            />
                                                            <Tooltip
                                                                formatter={(
                                                                    value
                                                                ) => [
                                                                    `$${value.toFixed(
                                                                        2
                                                                    )}`,
                                                                    t("Sales"),
                                                                ]}
                                                                labelFormatter={(
                                                                    label
                                                                ) =>
                                                                    `${t(
                                                                        "Month"
                                                                    )}: ${label}`
                                                                }
                                                                contentStyle={{
                                                                    background:
                                                                        "#fff",
                                                                    border: "1px solid #e2e8f0",
                                                                    borderRadius:
                                                                        "0.5rem",
                                                                    boxShadow:
                                                                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                                                }}
                                                            />
                                                            <Bar
                                                                dataKey="value"
                                                                fill="#10b981"
                                                                radius={[
                                                                    4, 4, 0, 0,
                                                                ]}
                                                            >
                                                                {(
                                                                    stats?.monthly_sales ||
                                                                    []
                                                                ).map(
                                                                    (
                                                                        entry,
                                                                        index
                                                                    ) => (
                                                                        <Cell
                                                                            key={`cell-${index}`}
                                                                            fill={`url(#colorGradient${index})`}
                                                                        />
                                                                    )
                                                                )}
                                                            </Bar>
                                                            <defs>
                                                                {(
                                                                    stats?.monthly_sales ||
                                                                    []
                                                                ).map(
                                                                    (
                                                                        entry,
                                                                        index
                                                                    ) => (
                                                                        <linearGradient
                                                                            key={`gradient-${index}`}
                                                                            id={`colorGradient${index}`}
                                                                            x1="0"
                                                                            y1="0"
                                                                            x2="0"
                                                                            y2="1"
                                                                        >
                                                                            <stop
                                                                                offset="0%"
                                                                                stopColor="#10b981"
                                                                                stopOpacity={
                                                                                    0.8
                                                                                }
                                                                            />
                                                                            <stop
                                                                                offset="100%"
                                                                                stopColor="#10b981"
                                                                                stopOpacity={
                                                                                    0.4
                                                                                }
                                                                            />
                                                                        </linearGradient>
                                                                    )
                                                                )}
                                                            </defs>
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Top Products Chart */}
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
                                                    <Package className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                                                    {t("Top Selling Products")}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="h-80 flex items-center justify-center responsive-chart-container">
                                                        <ResponsiveContainer
                                                            width="99%"
                                                            height="100%"
                                                        >
                                                            <PieChart>
                                                                <Pie
                                                                    data={
                                                                        pieData
                                                                    }
                                                                    cx="50%"
                                                                    cy="50%"
                                                                    labelLine={
                                                                        false
                                                                    }
                                                                    outerRadius={
                                                                        80
                                                                    }
                                                                    fill="#8884d8"
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
                                                                    {pieData.map(
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
                                                                        `${value} ${t(
                                                                            "units"
                                                                        )}`,
                                                                        t(
                                                                            "Quantity Sold"
                                                                        ),
                                                                    ]}
                                                                    contentStyle={{
                                                                        background:
                                                                            "#fff",
                                                                        border: "1px solid #e2e8f0",
                                                                        borderRadius:
                                                                            "0.5rem",
                                                                        boxShadow:
                                                                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                                                    }}
                                                                />
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-medium mb-4 text-slate-900 dark:text-white">
                                                            {t(
                                                                "Top 5 Products"
                                                            )}
                                                        </h3>
                                                        <div className="space-y-4">
                                                            {stats?.top_selling_products?.map(
                                                                (
                                                                    product,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            product.product_id
                                                                        }
                                                                        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                                                                    >
                                                                        <div
                                                                            className="w-4 h-4 rounded-full"
                                                                            style={{
                                                                                backgroundColor:
                                                                                    COLORS[
                                                                                        index %
                                                                                            COLORS.length
                                                                                    ],
                                                                            }}
                                                                        ></div>
                                                                        <div className="flex-1">
                                                                            <div className="font-medium text-slate-900 dark:text-white break-words line-clamp-1">
                                                                                {
                                                                                    product.name
                                                                                }
                                                                            </div>
                                                                            <div className="flex items-center flex-wrap gap-2 mt-1">
                                                                                <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 py-1 px-2 rounded-full">
                                                                                    <ArrowUp className="inline h-3 w-3 mr-0.5" />
                                                                                    {
                                                                                        product.qty_sold
                                                                                    }{" "}
                                                                                    units
                                                                                </span>
                                                                                <span className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 py-1 px-2 rounded-full">
                                                                                    <ArrowDown className="inline h-3 w-3 mr-0.5" />
                                                                                    {formatCurrency(
                                                                                        product.revenue
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>

                                {/* Activity and Recent Products Row */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Daily Activity Chart */}
                                    <motion.div
                                        ref={(el) => chartsRef.current.push(el)}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.3,
                                        }}
                                    >
                                        <Card className="shadow-md bg-white dark:bg-slate-900 border-0 rounded-xl overflow-hidden h-full">
                                            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 px-6 py-4">
                                                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    <TrendingUp className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                                                    {t(
                                                        "Daily Activity (Last 7 Days)"
                                                    )}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <div className="h-60 responsive-chart-container">
                                                    <ResponsiveContainer
                                                        width="99%"
                                                        height="100%"
                                                    >
                                                        <BarChart
                                                            data={
                                                                stats?.daily_activity
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
                                                                formatter={(
                                                                    value
                                                                ) => [
                                                                    `${value} transactions`,
                                                                ]}
                                                                contentStyle={{
                                                                    background:
                                                                        "#fff",
                                                                    border: "1px solid #e2e8f0",
                                                                    borderRadius:
                                                                        "0.5rem",
                                                                    boxShadow:
                                                                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                                                }}
                                                            />
                                                            <Bar
                                                                dataKey="value"
                                                                radius={[
                                                                    4, 4, 0, 0,
                                                                ]}
                                                            >
                                                                {(
                                                                    stats?.daily_activity ||
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
                                                                                    ? "#14b8a6"
                                                                                    : "#0d9488"
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

                                    {/* Recent Products Activity */}
                                    <motion.div
                                        ref={(el) => chartsRef.current.push(el)}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.4,
                                        }}
                                    >
                                        <Card className="shadow-md bg-white dark:bg-slate-900 border-0 rounded-xl overflow-hidden h-full">
                                            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 px-6 py-4">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                        <Package className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                                                        {t(
                                                            "Recent Product Movement"
                                                        )}
                                                    </CardTitle>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-emerald-600 dark:text-emerald-400 border-slate-200 dark:border-slate-700 rounded-lg"
                                                    >
                                                        <Link
                                                            href={route(
                                                                "warehouse.products"
                                                            )}
                                                        >
                                                            {t("View All")}
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <div className="space-y-4">
                                                    {stats
                                                        ?.recent_product_movement
                                                        ?.length > 0 ? (
                                                        stats.recent_product_movement.map(
                                                            (product) => (
                                                                <div
                                                                    key={
                                                                        product.product_id
                                                                    }
                                                                    className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150 group"
                                                                >
                                                                    <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                                                        <Package className="h-5 w-5" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="font-medium text-slate-900 dark:text-white">
                                                                            {
                                                                                product.name
                                                                            }
                                                                        </p>
                                                                        <div className="flex items-center flex-wrap gap-3 mt-1">
                                                                            <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 py-1 px-2 rounded-full">
                                                                                <ArrowUp className="inline h-3 w-3 mr-0.5" />
                                                                                In:{" "}
                                                                                {
                                                                                    product.income_quantity
                                                                                }
                                                                            </span>
                                                                            <span className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 py-1 px-2 rounded-full">
                                                                                <ArrowDown className="inline h-3 w-3 mr-0.5" />
                                                                                Out:{" "}
                                                                                {
                                                                                    product.outcome_quantity
                                                                                }
                                                                            </span>
                                                                            <span className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 py-1 px-2 rounded-full">
                                                                                Stock:{" "}
                                                                                {
                                                                                    product.net_quantity
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                                        <Clock className="h-3 w-3" />
                                                                        {
                                                                            product.last_updated
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )
                                                        )
                                                    ) : (
                                                        <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                                                            <Package className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                                            <p>
                                                                No recent
                                                                product activity
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>

                                {/* Recent Activity */}
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
                                                    {t("Recent Transactions")}
                                                </CardTitle>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-emerald-600 dark:text-emerald-400 border-slate-200 dark:border-slate-700 rounded-lg"
                                                    >
                                                        <Link
                                                            href={route(
                                                                "warehouse.income"
                                                            )}
                                                        >
                                                            {t("View Income")}
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-emerald-600 dark:text-emerald-400 border-slate-200 dark:border-slate-700 rounded-lg"
                                                    >
                                                        <Link
                                                            href={route(
                                                                "warehouse.outcome"
                                                            )}
                                                        >
                                                            {t("View Outcome")}
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                                {stats?.recent_activities
                                                    ?.length > 0 ? (
                                                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                                                        {stats.recent_activities.map(
                                                            (
                                                                activity,
                                                                index
                                                            ) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex items-center gap-4 p-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150 group"
                                                                >
                                                                    <div
                                                                        className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                                            activity.type ===
                                                                            "income"
                                                                                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                                                : "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
                                                                        }`}
                                                                    >
                                                                        {activity.type ===
                                                                        "income" ? (
                                                                            <TrendingUp className="h-5 w-5" />
                                                                        ) : (
                                                                            <TrendingDown className="h-5 w-5" />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="font-medium text-slate-900 dark:text-white truncate">
                                                                            {
                                                                                activity.title
                                                                            }
                                                                        </p>
                                                                        <div className="flex items-center flex-wrap gap-3 mt-1 text-xs">
                                                                            <span className="flex items-center text-slate-500 dark:text-slate-400">
                                                                                <Tag className="h-3 w-3 mr-1" />
                                                                                Ref:{" "}
                                                                                {activity.reference ||
                                                                                    "N/A"}
                                                                            </span>
                                                                            <span className="flex items-center text-slate-500 dark:text-slate-400">
                                                                                <Package className="h-3 w-3 mr-1" />
                                                                                Items:{" "}
                                                                                {activity.items ||
                                                                                    0}
                                                                            </span>
                                                                            <span className="flex items-center text-slate-500 dark:text-slate-400">
                                                                                <Clock className="h-3 w-3 mr-1" />
                                                                                {
                                                                                    activity.time
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className={`text-sm font-semibold ${
                                                                            activity.type ===
                                                                            "income"
                                                                                ? "text-emerald-600 dark:text-emerald-400"
                                                                                : "text-rose-600 dark:text-rose-400"
                                                                        }`}
                                                                    >
                                                                        {activity.type ===
                                                                        "income"
                                                                            ? "+"
                                                                            : "-"}
                                                                        {formatCurrency(
                                                                            activity.amount
                                                                        )}
                                                                    </div>
                                                                    {activity.id && (
                                                                        <Link
                                                                            href={route(
                                                                                `warehouse.${activity.type}.show`,
                                                                                activity.id
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
                                                        <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                                        <p className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                                                            {t(
                                                                "No recent transactions"
                                                            )}
                                                        </p>
                                                        <p>
                                                            {t(
                                                                "Start tracking your warehouse income and expenses"
                                                            )}
                                                        </p>
                                                        <Button className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white">
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            {t(
                                                                "Add Transaction"
                                                            )}
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
