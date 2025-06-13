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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    Search,
    TrendingUp,
    ChevronRight,
    Plus,
    Filter,
    ArrowUpRight,
    BarChart3,
    Calendar,
    Download,
    MoreHorizontal,
    ExternalLink,
    User,
    Mail,
    Shield,
    ChevronDown,
    Eye,
    RefreshCw,
    Users,
    UserCheck,
    Key,
    Edit,
    Trash2,
    Crown,
    Clock
} from "lucide-react";
import anime from "animejs";
import Navigation from "@/Components/Admin/Navigation";
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

export default function UsersIndex({ auth, users, roles, permissions, filters }) {
    const { t } = useLaravelReactI18n();

    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [view, setView] = useState("grid");
    const [isAnimated, setIsAnimated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Refs for animation targets
    const headerRef = useRef(null);
    const cardsRef = useRef(null);
    const gridItemsRef = useRef([]);
    const listItemsRef = useRef([]);
    const dashboardCardsRef = useRef([]);

    // Calculate stats
    const totalUsers = users?.data?.length || 0;
    const activeUsers = users?.data?.filter(user => user.email_verified_at)?.length || 0;
    const adminUsers = users?.data?.filter(user => user.roles?.some(role => role.name === 'admin'))?.length || 0;
    const recentUsers = users?.data?.filter(user => {
        const createdAt = new Date(user.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdAt > thirtyDaysAgo;
    })?.length || 0;

    // Initialize animations
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <Head title={t("User Management")}>
                <style>{`
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    .animate-shimmer {
                        animation: shimmer 3s infinite;
                    }
                `}</style>
            </Head>

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
                <Navigation auth={auth} currentRoute="admin.users" />

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header
                        ref={headerRef}
                        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-0.5">
                                    {t("Admin Panel")}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    {t("User Management")}
                                    <Badge
                                        variant="outline"
                                        className="ml-2 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 rounded-full"
                                    >
                                        {totalUsers}
                                    </Badge>
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button variant="outline" className="gap-2">
                                <Download className="h-4 w-4" />
                                {t("Export")}
                            </Button>
                            <Link href={route("admin.users.create")}>
                                <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                                    <Plus className="h-4 w-4" />
                                    {t("Add User")}
                                </Button>
                            </Link>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {/* Dashboard Stats Section */}
                        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 relative flex-shrink-0">
                            <div className="relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        {
                                            title: t("Total Users"),
                                            value: totalUsers,
                                            icon: <Users className="h-6 w-6" />,
                                            bgClass: "from-blue-500 to-indigo-600",
                                            trend: t("All registered users"),
                                        },
                                        {
                                            title: t("Active Users"),
                                            value: activeUsers,
                                            icon: <UserCheck className="h-6 w-6" />,
                                            bgClass: "from-green-500 to-emerald-600",
                                            trend: t("Verified accounts"),
                                        },
                                        {
                                            title: t("Administrators"),
                                            value: adminUsers,
                                            icon: <Crown className="h-6 w-6" />,
                                            bgClass: "from-purple-500 to-pink-600",
                                            trend: t("Admin role users"),
                                        },
                                        {
                                            title: t("Recent Users"),
                                            value: recentUsers,
                                            icon: <Clock className="h-6 w-6" />,
                                            bgClass: "from-orange-500 to-red-600",
                                            trend: t("Last 30 days"),
                                        },
                                    ].map((card, index) => (
                                        <motion.div
                                            key={index}
                                            className={`bg-gradient-to-br ${card.bgClass} text-white border-0 rounded-2xl shadow-lg overflow-hidden relative group`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: index * 0.1,
                                            }}
                                            whileHover={{ translateY: -8 }}
                                        >
                                            <div className="p-6 relative z-10">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="font-medium text-lg">
                                                        {card.title}
                                                    </span>
                                                    <div className="p-2.5 bg-white/20 rounded-lg shadow-inner backdrop-blur-sm">
                                                        {card.icon}
                                                    </div>
                                                </div>
                                                <div className="text-3xl font-bold mt-2">
                                                    <AnimatedCounter
                                                        value={card.value}
                                                        duration={2000}
                                                    />
                                                </div>
                                                <div className="mt-4 text-sm text-white/90 backdrop-blur-sm bg-white/10 py-1.5 px-3 rounded-lg w-fit">
                                                    {card.trend}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Search and Filters */}
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
                                        placeholder={t("Search users...")}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <Tabs defaultValue="grid" className="w-auto">
                                        <TabsList className="p-1 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg">
                                            <TabsTrigger
                                                value="grid"
                                                onClick={() => setView("grid")}
                                                className="px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:dark:bg-slate-900 data-[state=active]:shadow-sm rounded-md transition-all"
                                            >
                                                Grid
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="list"
                                                onClick={() => setView("list")}
                                                className="px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:dark:bg-slate-900 data-[state=active]:shadow-sm rounded-md transition-all"
                                            >
                                                List
                                            </TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </motion.div>
                            </div>

                            {/* Users Grid/List */}
                            <div ref={cardsRef} className="transition-opacity duration-300">
                                {view === "grid" ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {users?.data?.map((user, index) => (
                                            <motion.div
                                                key={user.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    duration: 0.3,
                                                    delay: index * 0.05,
                                                }}
                                            >
                                                <Card className="bg-white dark:bg-slate-900 border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full">
                                                    <CardHeader className="pb-3">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex gap-3 items-start">
                                                                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                                                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
                                                                        {user.name.charAt(0).toUpperCase()}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                                                        {user.name}
                                                                    </h3>
                                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                        {user.email}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Badge
                                                                variant={user.email_verified_at ? "success" : "secondary"}
                                                                className="rounded-full"
                                                            >
                                                                {user.email_verified_at ? t("Active") : t("Pending")}
                                                            </Badge>
                                                        </div>
                                                    </CardHeader>

                                                    <CardContent className="pt-0">
                                                        <div className="space-y-3">
                                                            {user.roles?.length > 0 && (
                                                                <div>
                                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                                                                        {t("Roles")}
                                                                    </p>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {user.roles.map((role) => (
                                                                            <Badge
                                                                                key={role.id}
                                                                                variant="outline"
                                                                                className="text-xs"
                                                                            >
                                                                                {role.name}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
                                                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                                                    {t("Joined")} {formatDate(user.created_at)}
                                                                </div>
                                                                <div className="flex gap-1">
                                                                    <Link href={route("admin.users.edit", user.id)}>
                                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                            <Edit className="h-4 w-4" />
                                                                        </Button>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    // List view would go here
                                    <div className="space-y-2">
                                        {users?.data?.map((user, index) => (
                                            <Card key={user.id} className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                            <span className="text-blue-600 dark:text-blue-400 font-semibold">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                                                {user.name}
                                                            </h3>
                                                            <p className="text-sm text-slate-500">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Badge variant={user.email_verified_at ? "success" : "secondary"}>
                                                            {user.email_verified_at ? t("Active") : t("Pending")}
                                                        </Badge>
                                                        <Link href={route("admin.users.edit", user.id)}>
                                                            <Button variant="outline" size="sm">
                                                                {t("Edit")}
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
} 