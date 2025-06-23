import React, { useState, useEffect } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Home,
    Package,
    Warehouse,
    ShoppingCart,
    Ruler,
    TrendingUp,
    BarChart3,
    Users,
    Plus,
    Sparkles,
    ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { motion } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Dashboard({ auth }) {
    const { t } = useLaravelReactI18n();
    const { stats, recentProducts, recentWarehouses, recentCustomers } =
        usePage().props;
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => { 
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const StatCard = ({ title, value, icon, color, link, description }) => (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
        >
            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border hover:shadow-3xl transition-all duration-300 group">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                {t(title)}
                            </p>
                            <p className={`text-3xl font-bold ${color} dark:text-white`}>
                                {typeof value === "number"
                                    ? value.toLocaleString()
                                    : value}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {t(description)}
                            </p>
                        </div>
                        <div
                            className={`p-4 bg-gradient-to-br rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 dark:bg-slate-700/50`}
                        >
                            {icon}
                        </div>
                    </div>
                    {link && (
                        <Link
                            href={route(link)}
                            className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors group-hover:translate-x-1 duration-200"
                        >
                            {t("View all")}
                            <ArrowUpRight className="w-4 h-4 ml-1" />
                        </Link>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );

    const RecentItem = ({ title, subtitle, date, icon }) => (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 dark:bg-slate-700/50 dark:hover:bg-slate-600/50 rounded-lg transition-all duration-200 group cursor-pointer border border-gray-200 dark:border-slate-600"
        >
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                {icon}
            </div>
            <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                    {subtitle}
                </p>
            </div>
            <div className="text-sm text-gray-400 dark:text-gray-400">
                {new Date(date).toLocaleDateString()}
            </div>
        </motion.div>
    );

    return (
        <>
            <Head title="Admin Dashboard">
                <style>{`
                    @keyframes shimmer {
                        0% { background-position: -1000px 0; }
                        100% { background-position: 1000px 0; }
                    }

                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }

                    @keyframes pulse-glow {
                        0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
                        50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
                    }

                    .shimmer {
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                        background-size: 1000px 100%;
                        animation: shimmer 2s infinite;
                    }

                    .float-animation {
                        animation: float 6s ease-in-out infinite;
                    }

                    .pulse-glow {
                        animation: pulse-glow 2s ease-in-out infinite;
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
                                    linear-gradient(45deg, #3b82f6, #1d4ed8) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #3b82f6, #1d4ed8) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={Home} color="blue" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.dashboard" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="glass-effect border-b border-white/20 dark:border-slate-700/50 py-6 px-8 sticky top-0 z-30"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    initial={{
                                        scale: 0.8,
                                        opacity: 0,
                                        rotate: -180,
                                    }}
                                    animate={{
                                        scale: 1,
                                        opacity: 1,
                                        rotate: 0,
                                    }}
                                    transition={{
                                        delay: 0.3,
                                        duration: 0.6,
                                        type: "spring",
                                        stiffness: 200,
                                    }}
                                    className="relative float-animation"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-4 rounded-2xl shadow-2xl">
                                        <Home className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{
                                            delay: 0.4,
                                            duration: 0.4,
                                        }}
                                        className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {t("Administrative Dashboard")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{
                                            delay: 0.5,
                                            duration: 0.4,
                                        }}
                                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent"
                                    >
                                        {t("Dashboard")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{
                                            delay: 0.6,
                                            duration: 0.4,
                                        }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        {t("System overview and quick actions")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="text-sm text-slate-600 dark:text-slate-400"
                            >
                                {new Date().toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="space-y-8"
                            >
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatCard
                                        title={t("Products")}
                                        value={stats?.products || 0}
                                        color="text-blue-600"
                                        link="admin.products.index"
                                        description={t("Product catalog")}
                                        icon={
                                            <Package className="w-8 h-8 text-blue-600" />
                                        }
                                    />
                                    <StatCard
                                        title={t("Warehouses")}
                                        value={stats?.warehouses || 0}
                                        color="text-green-600"
                                        link="admin.warehouses.index"
                                        description={t("Storage facilities")}
                                        icon={
                                            <Warehouse className="w-8 h-8 text-green-600" />
                                        }
                                    />
                                    <StatCard
                                        title={t("Shops")}
                                        value={stats?.shops || 0}
                                        color="text-purple-600"
                                        link="admin.customers.index"
                                        description={t("Customer stores")}
                                        icon={
                                            <ShoppingCart className="w-8 h-8 text-purple-600" />
                                        }
                                    />
                                    <StatCard
                                        title={t("Units")}
                                        value={stats?.units || 0}
                                        color="text-orange-600"
                                        link="admin.units.index"
                                        description={t("Measurement units")}
                                        icon={
                                            <Ruler className="w-8 h-8 text-orange-600" />
                                        }
                                    />
                                </div>

                                {/* Recent Activity */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Recent Products */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay: 1.0,
                                            duration: 0.4,
                                        }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800 backdrop-blur-xl">
                                            <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50">
                                                <CardTitle className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                        <Package className="h-5 w-5 text-white" />
                                                    </div>
                                                    {t("Recent Products")}
                                                    <Link
                                                        href={route(
                                                            "admin.products.index"
                                                        )}
                                                        className="ml-auto text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                    >
                                                        {t("View all")}
                                                    </Link>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6 space-y-4">
                                                {recentProducts?.length > 0 ? (
                                                    recentProducts.map(
                                                        (product) => (
                                                            <RecentItem
                                                                key={product.id}
                                                                title={
                                                                    product.name
                                                                }
                                                                subtitle={`Unit: ${
                                                                    product.unit
                                                                        ?.name ||
                                                                    "N/A"
                                                                }`}
                                                                date={
                                                                    product.created_at
                                                                }
                                                                icon={
                                                                    <Package className="w-5 h-5 text-blue-600" />
                                                                }
                                                            />
                                                        )
                                                    )
                                                ) : (
                                                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                                        {t(
                                                            "No recent products"
                                                        )}
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Recent Warehouses */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay: 1.1,
                                            duration: 0.4,
                                        }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-700/50">
                                                <CardTitle className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                                        <Warehouse className="h-5 w-5 text-white" />
                                                    </div>
                                                    {t("Recent Warehouses")}
                                                    <Link
                                                        href={route(
                                                            "admin.warehouses.index"
                                                        )}
                                                        className="ml-auto text-green-600 hover:text-green-800 text-sm font-medium"
                                                    >
                                                        {t("View all")}
                                                    </Link>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6 space-y-4">
                                                {recentWarehouses?.length >
                                                0 ? (
                                                    recentWarehouses.map(
                                                        (warehouse) => (
                                                            <RecentItem
                                                                key={
                                                                    warehouse.id
                                                                }
                                                                title={
                                                                    warehouse.name
                                                                }
                                                                subtitle={`Location: ${
                                                                    warehouse.location ||
                                                                    "N/A"
                                                                }`}
                                                                date={
                                                                    warehouse.created_at
                                                                }
                                                                icon={
                                                                    <Warehouse className="w-5 h-5 text-green-600" />
                                                                }
                                                            />
                                                        )
                                                    )
                                                ) : (
                                                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                                        {t(
                                                            "No recent warehouses"
                                                        )}
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Recent Customers */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay: 1.2,
                                            duration: 0.4,
                                        }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardHeader className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 border-b border-white/30 dark:border-slate-700/50">
                                                <CardTitle className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                                                        <ShoppingCart className="h-5 w-5 text-white" />
                                                    </div>
                                                    {t("Recent Shops")}
                                                    <Link
                                                        href={route(
                                                            "admin.customers.index"
                                                        )}
                                                        className="ml-auto text-purple-600 hover:text-purple-800 text-sm font-medium"
                                                    >
                                                        {t("View all")}
                                                    </Link>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6 space-y-4">
                                                {recentCustomers?.length > 0 ? (
                                                    recentCustomers.map(
                                                        (customer) => (
                                                            <RecentItem
                                                                key={
                                                                    customer.id
                                                                }
                                                                title={
                                                                    customer.name
                                                                }
                                                                subtitle={`Email: ${
                                                                    customer.email ||
                                                                    "N/A"
                                                                }`}
                                                                date={
                                                                    customer.created_at
                                                                }
                                                                icon={
                                                                    <Users className="w-5 h-5 text-purple-600" />
                                                                }
                                                            />
                                                        )
                                                    )
                                                ) : (
                                                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                                        {t("No recent shops")}
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>

                                {/* Quick Actions */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.3, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                                                    <TrendingUp className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Quick Actions")}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <Link
                                                    href={route(
                                                        "admin.products.create"
                                                    )}
                                                    className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700 transition-all duration-200 group hover:scale-105"
                                                >
                                                    <div className="flex items-center">
                                                        <div className="bg-blue-600 p-2 rounded-lg mr-3 group-hover:bg-blue-700 transition-colors">
                                                            <Plus className="w-5 h-5 text-white" />
                                                        </div>
                                                        <span className="font-medium text-blue-900 dark:text-blue-100">
                                                            {t("Add Product")}
                                                        </span>
                                                    </div>
                                                </Link>

                                                <Link
                                                    href={route(
                                                        "admin.warehouses.create"
                                                    )}
                                                    className="bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-700 transition-all duration-200 group hover:scale-105"
                                                >
                                                    <div className="flex items-center">
                                                        <div className="bg-green-600 p-2 rounded-lg mr-3 group-hover:bg-green-700 transition-colors">
                                                            <Plus className="w-5 h-5 text-white" />
                                                        </div>
                                                        <span className="font-medium text-green-900 dark:text-green-100">
                                                            {t("Add Warehouse")}
                                                        </span>
                                                    </div>
                                                </Link>

                                                <Link
                                                    href={route(
                                                        "admin.customers.create"
                                                    )}
                                                    className="bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-700 transition-all duration-200 group hover:scale-105"
                                                >
                                                    <div className="flex items-center">
                                                        <div className="bg-purple-600 p-2 rounded-lg mr-3 group-hover:bg-purple-700 transition-colors">
                                                            <Plus className="w-5 h-5 text-white" />
                                                        </div>
                                                        <span className="font-medium text-purple-900 dark:text-purple-100">
                                                            {t("Add Shop")}
                                                        </span>
                                                    </div>
                                                </Link>

                                                <Link
                                                    href={route(
                                                        "admin.units.create"
                                                    )}
                                                    className="bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 p-4 rounded-lg border border-orange-200 dark:border-orange-700 transition-all duration-200 group hover:scale-105"
                                                >
                                                    <div className="flex items-center">
                                                        <div className="bg-orange-600 p-2 rounded-lg mr-3 group-hover:bg-orange-700 transition-colors">
                                                            <Plus className="w-5 h-5 text-white" />
                                                        </div>
                                                        <span className="font-medium text-orange-900 dark:text-orange-100">
                                                            {t("Add Unit")}
                                                        </span>
                                                    </div>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
}
