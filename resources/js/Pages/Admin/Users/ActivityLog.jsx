import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    Activity,
    User,
    Calendar,
    Eye,
    Edit,
    Trash2,
    Plus,
    Search,
    Filter,
    RefreshCw,
    Clock,
    AlertCircle,
    CheckCircle,
    XCircle,
    Info,
    ChevronLeft,
    ChevronRight,
    Sparkles
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { motion } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function UserActivityLog({ auth, user, activities }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);

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
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getActivityIcon = (description) => {
        if (description.includes('created')) return <Plus className="h-4 w-4 text-green-600" />;
        if (description.includes('updated')) return <Edit className="h-4 w-4 text-blue-600" />;
        if (description.includes('deleted')) return <Trash2 className="h-4 w-4 text-red-600" />;
        if (description.includes('viewed')) return <Eye className="h-4 w-4 text-purple-600" />;
        return <Activity className="h-4 w-4 text-slate-600" />;
    };

    const getActivityBadge = (description) => {
        if (description.includes('created')) return <Badge className="bg-green-100 text-green-700 border-green-200">{t("Created")}</Badge>;
        if (description.includes('updated')) return <Badge className="bg-blue-100 text-blue-700 border-blue-200">{t("Updated")}</Badge>;
        if (description.includes('deleted')) return <Badge className="bg-red-100 text-red-700 border-red-200">{t("Deleted")}</Badge>;
        if (description.includes('viewed')) return <Badge className="bg-purple-100 text-purple-700 border-purple-200">{t("Viewed")}</Badge>;
        return <Badge variant="secondary">{t("Activity")}</Badge>;
    };

    return (
        <>
            <Head title={t("Activity Log") + " - " + user.name}>
                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
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
                                    linear-gradient(45deg, #3b82f6, #1d4ed8) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #3b82f6, #1d4ed8) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={Activity} color="blue" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                <Navigation auth={auth} currentRoute="admin.users" />

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
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative float-animation"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 p-4 rounded-2xl shadow-2xl">
                                        <Activity className="w-8 h-8 text-white" />
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
                                        {t("Admin Panel")} - {t("User Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent"
                                    >
                                        {t("Activity Log")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <User className="w-4 h-4" />
                                        {t("Activity history for")} {user.name}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Link href={route("admin.users.show", user.id)}>
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-all duration-200">
                                        <User className="h-4 w-4" />
                                        {t("User Profile")}
                                    </Button>
                                </Link>
                                <Link href={route("admin.users.index")}>
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-all duration-200">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Users")}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-purple-300 dark:scrollbar-thumb-purple-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="max-w-6xl mx-auto space-y-8"
                            >
                                {/* User Info Card */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.9, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                                    <span className="text-purple-600 dark:text-purple-400 font-bold text-2xl">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{user.name}</h2>
                                                    <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                                        <User className="h-4 w-4" />
                                                        {user.email}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Badge variant={user.email_verified_at ? "success" : "secondary"}>
                                                            {user.email_verified_at ? t("Active") : t("Pending")}
                                                        </Badge>
                                                        {user.roles?.map(role => (
                                                            <Badge key={role.id} variant="outline" className="bg-purple-100 text-purple-700">
                                                                {role.name}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                        {t("Total Activities")}
                                                    </p>
                                                    <p className="text-2xl font-bold text-purple-600">
                                                        {activities?.total || 0}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Activity Log Table */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.0, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                        <CardHeader className="bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                                                    <Activity className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Recent Activities")}
                                                <Badge variant="secondary" className="ml-auto">
                                                    {activities?.data?.length || 0} {t("activities")}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Activity")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Type")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Subject")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Date & Time")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("User Agent")}
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {activities?.data?.length > 0 ? (
                                                            activities.data.map((activity, index) => (
                                                                <TableRow
                                                                    key={activity.id}
                                                                    className="hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors"
                                                                >
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                                                                {getActivityIcon(activity.description)}
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-medium text-slate-800 dark:text-white">
                                                                                    {activity.description}
                                                                                </p>
                                                                                {activity.causer && (
                                                                                    <p className="text-sm text-slate-500">
                                                                                        {t("by")} {activity.causer.name}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {getActivityBadge(activity.description)}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="space-y-1">
                                                                            <p className="font-medium text-slate-800 dark:text-white">
                                                                                {activity.subject_type ? activity.subject_type.split('\\').pop() : t("N/A")}
                                                                            </p>
                                                                            {activity.subject_id && (
                                                                                <p className="text-sm text-slate-500">
                                                                                    ID: {activity.subject_id}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                                            <Clock className="h-4 w-4" />
                                                                            {formatDate(activity.created_at)}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="max-w-xs">
                                                                            <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                                                                                {activity.properties?.user_agent || t("N/A")}
                                                                            </p>
                                                                            {activity.properties?.ip && (
                                                                                <p className="text-xs text-slate-500">
                                                                                    IP: {activity.properties.ip}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan="5" className="h-32 text-center">
                                                                    <div className="flex flex-col items-center gap-4">
                                                                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                                            <Activity className="h-8 w-8 text-slate-400" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                                                                {t("No activities found")}
                                                                            </p>
                                                                            <p className="text-sm text-slate-500">
                                                                                {t("This user has no recorded activities yet")}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>

                                            {/* Pagination */}
                                            {activities?.data?.length > 0 && (
                                                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700">
                                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                        <span>
                                                            {t("Showing")} {activities.from} {t("to")} {activities.to} {t("of")} {activities.total} {t("activities")}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2">
                                                        {activities.prev_page_url && (
                                                            <Link href={activities.prev_page_url}>
                                                                <Button variant="outline" size="sm" className="gap-2">
                                                                    <ChevronLeft className="h-4 w-4" />
                                                                    {t("Previous")}
                                                                </Button>
                                                            </Link>
                                                        )}
                                                        
                                                        <span className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md">
                                                            {t("Page")} {activities.current_page} {t("of")} {activities.last_page}
                                                        </span>
                                                        
                                                        {activities.next_page_url && (
                                                            <Link href={activities.next_page_url}>
                                                                <Button variant="outline" size="sm" className="gap-2">
                                                                    {t("Next")}
                                                                    <ChevronRight className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
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