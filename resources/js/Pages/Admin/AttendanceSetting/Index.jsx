import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Plus,
    Clock,
    Edit,
    Trash2,
    Download,
    Settings,
    X,
    User,
    Calendar,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Activity,
    TrendingUp,
    Eye,
    RotateCcw,
    XCircle,
    Filter,
    Timer,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Index({
    auth,
    attendanceSettings = {
        data: [],
        total: 0,
        from: 0,
        to: 0,
        current_page: 1,
        last_page: 1,
    },
    filters = {},
    permissions = {},
}) {
    const { t } = useLaravelReactI18n();
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
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

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.attendance-settings.index'), {
            search: searchTerm,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm("");
        router.get(route('admin.attendance-settings.index'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (settingId) => {
        if (confirm(t("Are you sure you want to delete this attendance setting?"))) {
            router.delete(route('admin.attendance-settings.destroy', settingId));
        }
    };

    // Get setting data array
    const settingData = attendanceSettings.data || attendanceSettings;
    const totalSettings = attendanceSettings.total || settingData.length;

    return (
        <>
            <Head title={t("Attendance Settings Management")}>
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
                                    linear-gradient(45deg, #6366f1, #8b5cf6) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #6366f1, #8b5cf6) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.attendance-settings" />

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
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative float-animation"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 p-4 rounded-2xl shadow-2xl">
                                        <Clock className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {t("Time Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent"
                                    >
                                        {t("Attendance Settings")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Timer className="w-4 h-4" />
                                        {t("Manage work hours and attendance schedules")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                {permissions.create_attendance_setting && (
                                    <Link href={route("admin.attendance-settings.create")}>
                                        <Button className="gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                                            <Plus className="h-4 w-4" />
                                            {t("Add Setting")}
                                        </Button>
                                    </Link>
                                )}
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-indigo-300 dark:scrollbar-thumb-indigo-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="max-w-7xl mx-auto space-y-8"
                            >
                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.4 }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/30">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{t("Total Settings")}</p>
                                                        <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">{totalSettings}</p>
                                                    </div>
                                                    <div className="p-3 bg-indigo-500 rounded-xl">
                                                        <Clock className="w-6 h-6 text-white" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.0, duration: 0.4 }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/30">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{t("Active Today")}</p>
                                                        <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                                                            {settingData.filter(s => s.date === new Date().toISOString().split('T')[0]).length}
                                                        </p>
                                                    </div>
                                                    <div className="p-3 bg-blue-500 rounded-xl">
                                                        <Calendar className="w-6 h-6 text-white" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.1, duration: 0.4 }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/30">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400">{t("Displaying")}</p>
                                                        <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                                                            {settingData.length}
                                                        </p>
                                                    </div>
                                                    <div className="p-3 bg-purple-500 rounded-xl">
                                                        <Eye className="w-6 h-6 text-white" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>

                                {/* Search and Filter */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.2, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                        <CardHeader>
                                            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg">
                                                    <Search className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Search & Filter")}
                                                {searchTerm && (
                                                    <Badge variant="secondary" className="ml-auto">
                                                        {t("Filtered")}
                                                    </Badge>
                                                )}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
                                                <div className="relative flex-1">
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                                    <Input
                                                        placeholder={t("Search by date, enter time, or exit time...")}
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="pl-10 h-12 border-2 border-slate-200 hover:border-indigo-300 focus:border-indigo-500 transition-colors"
                                                    />
                                                    {searchTerm && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setSearchTerm("")}
                                                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button type="submit" className="gap-2 h-12 bg-indigo-600 hover:bg-indigo-700">
                                                        <Search className="h-4 w-4" />
                                                        {t("Search")}
                                                    </Button>

                                                    {searchTerm && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={clearFilters}
                                                            className="gap-2 h-12 border-2 hover:border-indigo-300"
                                                        >
                                                            <RefreshCw className="h-4 w-4" />
                                                            {t("Clear")}
                                                        </Button>
                                                    )}
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Settings Table */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.3, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                        <CardHeader className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                                                    <Clock className="h-6 w-6 text-white" />
                                                </div>
                                                {t("Attendance Settings List")}
                                                <Badge variant="secondary" className="ml-auto bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                                                    {settingData.length} {t("settings")}
                                                    {attendanceSettings.total && (
                                                        <span className="ml-1">
                                                            {t("of")} {attendanceSettings.total}
                                                        </span>
                                                    )}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            {settingData.length > 0 ? (
                                                <div className="overflow-x-auto">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="border-b border-slate-200 dark:border-slate-700">
                                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">{t("Date")}</TableHead>
                                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">{t("Enter Time")}</TableHead>
                                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">{t("Exit Time")}</TableHead>
                                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">{t("Duration")}</TableHead>
                                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">{t("Actions")}</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            <AnimatePresence>
                                                                {settingData.map((setting, index) => (
                                                                    <motion.tr
                                                                        key={setting.id}
                                                                        initial={{ opacity: 0, y: 20 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        exit={{ opacity: 0, y: -20 }}
                                                                        transition={{ delay: index * 0.05 }}
                                                                        className="border-b border-slate-100 dark:border-slate-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors"
                                                                    >
                                                                        <TableCell>
                                                                            <div className="flex items-center space-x-3">
                                                                                <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg">
                                                                                    <Calendar className="h-5 w-5 text-indigo-600" />
                                                                                </div>
                                                                                <div>
                                                                                    <div className="font-semibold text-slate-900 dark:text-white">
                                                                                        {setting.date || t("Default")}
                                                                                    </div>
                                                                                    <div className="text-sm text-slate-600 dark:text-slate-400">
                                                                                        {setting.date ? new Date(setting.date).toLocaleDateString() : t("No specific date")}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700">
                                                                                <Clock className="w-3 h-3" />
                                                                                {setting.enter_time}
                                                                            </Badge>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Badge variant="outline" className="gap-1 bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700">
                                                                                <Clock className="w-3 h-3" />
                                                                                {setting.exit_time}
                                                                            </Badge>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                                                {(() => {
                                                                                    const enter = new Date(`2000-01-01T${setting.enter_time}`);
                                                                                    const exit = new Date(`2000-01-01T${setting.exit_time}`);
                                                                                    const duration = Math.abs(exit - enter) / (1000 * 60 * 60);
                                                                                    return `${duration.toFixed(1)} ${t("hours")}`;
                                                                                })()}
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="text-right">
                                                                            <div className="flex items-center justify-end gap-1">
                                                                                {/* View Button */}
                                                                                {permissions.view_attendance_setting && (
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
                                                                                        asChild
                                                                                    >
                                                                                        <Link href={route('admin.attendance-settings.show', setting.id)}>
                                                                                            <Eye className="h-4 w-4" />
                                                                                            <span className="sr-only">{t("View")}</span>
                                                                                        </Link>
                                                                                    </Button>
                                                                                )}
                                                                                
                                                                                {/* Edit Button */}
                                                                                {permissions.update_attendance_setting && (
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        className="h-8 w-8 p-0 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 transition-colors"
                                                                                        asChild
                                                                                    >
                                                                                        <Link href={route('admin.attendance-settings.edit', setting.id)}>
                                                                                            <Edit className="h-4 w-4" />
                                                                                            <span className="sr-only">{t("Edit")}</span>
                                                                                        </Link>
                                                                                    </Button>
                                                                                )}
                                                                                
                                                                                {/* Delete Button */}
                                                                                {permissions.delete_attendance_setting && (
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                                                                                        onClick={() => handleDelete(setting.id)}
                                                                                    >
                                                                                        <Trash2 className="h-4 w-4" />
                                                                                        <span className="sr-only">{t("Delete")}</span>
                                                                                    </Button>
                                                                                )}
                                                                            </div>
                                                                        </TableCell>
                                                                    </motion.tr>
                                                                ))}
                                                            </AnimatePresence>
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            ) : (
                                                <div className="text-center py-12">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                            <Clock className="h-8 w-8 text-slate-400" />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                                                {searchTerm ? t("No settings found") : t("No attendance settings created yet")}
                                                            </p>
                                                            <p className="text-sm text-slate-500">
                                                                {searchTerm ? t("Try adjusting your search") : t("Create your first attendance setting to get started.")}
                                                            </p>
                                                        </div>
                                                        {!searchTerm && permissions.create_attendance_setting && (
                                                            <Link href={route("admin.attendance-settings.create")}>
                                                                <Button className="gap-2">
                                                                    <Plus className="w-4 h-4" />
                                                                    {t("Create First Setting")}
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Pagination */}
                                {attendanceSettings.links && attendanceSettings.links.length > 3 && (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.4, duration: 0.4 }}
                                        className="flex justify-center"
                                    >
                                        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="text-sm text-slate-600 dark:text-slate-400">
                                                        {t("Showing")} {attendanceSettings.from} {t("to")} {attendanceSettings.to} {t("of")} {attendanceSettings.total} {t("settings")}
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        {attendanceSettings.links.map((link, index) => {
                                                            if (link.url === null) {
                                                                return (
                                                                    <Button
                                                                        key={index}
                                                                        variant="outline"
                                                                        size="sm"
                                                                        disabled
                                                                        className="w-10 h-10 p-0"
                                                                    >
                                                                        {link.label === '&laquo; Previous' ? (
                                                                            <ChevronLeft className="h-4 w-4" />
                                                                        ) : link.label === 'Next &raquo;' ? (
                                                                            <ChevronRight className="h-4 w-4" />
                                                                        ) : (
                                                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                                        )}
                                                                    </Button>
                                                                );
                                                            }

                                                            return (
                                                                <Link
                                                                    key={index}
                                                                    href={link.url}
                                                                    preserveState
                                                                    preserveScroll
                                                                >
                                                                    <Button
                                                                        variant={link.active ? "default" : "outline"}
                                                                        size="sm"
                                                                        className={`w-10 h-10 p-0 ${
                                                                            link.active
                                                                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                                                                : 'hover:bg-indigo-50 hover:border-indigo-300'
                                                                        }`}
                                                                    >
                                                                        {link.label === '&laquo; Previous' ? (
                                                                            <ChevronLeft className="h-4 w-4" />
                                                                        ) : link.label === 'Next &raquo;' ? (
                                                                            <ChevronRight className="h-4 w-4" />
                                                                        ) : (
                                                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                                        )}
                                                                    </Button>
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
} 