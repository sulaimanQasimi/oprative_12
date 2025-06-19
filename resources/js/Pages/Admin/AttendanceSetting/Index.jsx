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
    ArrowUpDown,
    Download,
    Calendar,
    Settings,
    ChevronLeft,
    SkipBack,
    SkipForward,
    X,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
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
    const [sortField, setSortField] = useState(filters.sort_field || "created_at");
    const [sortDirection, setSortDirection] = useState(
        filters.sort_direction || "desc"
    );

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                route("admin.attendance-settings.index"),
                { search: searchTerm },
                { preserveState: true, preserveScroll: true }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Handle filter changes
    useEffect(() => {
        router.get(
            route("admin.attendance-settings.index"),
            {
                sort_field: sortField,
                sort_direction: sortDirection,
            },
            { preserveState: true, preserveScroll: true }
        );
    }, [sortField, sortDirection]);

    // Sort handler
    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    // Pagination handlers
    const handlePageChange = (page) => {
        router.get(
            route("admin.attendance-settings.index"),
            { page },
            { preserveState: true, preserveScroll: true }
        );
    };

    // Delete handler
    const handleDelete = (attendanceSettingId) => {
        if (confirm(t("Are you sure you want to delete this attendance setting?"))) {
            router.delete(route("admin.attendance-settings.destroy", attendanceSettingId));
        }
    };

    // Simulate loading delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title={t("Attendance Settings")}>
                <style>{`
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
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={Clock} color="indigo" />

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
                                    className="relative"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 p-4 rounded-2xl shadow-2xl">
                                        <Clock className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent"
                                    >
                                        {t("Attendance Settings")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400"
                                    >
                                        {t("Manage attendance time configurations")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Button
                                    variant="outline"
                                    className="gap-2 hover:scale-105 transition-all duration-200"
                                >
                                    <Download className="h-4 w-4" />
                                    {t("Export")}
                                </Button>
                                {permissions.create_attendance_setting && (
                                    <Link href={route("admin.attendance-settings.create")}>
                                        <Button className="gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 text-white hover:scale-105 transition-all duration-200 shadow-lg">
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
                                transition={{ delay: 0.7, duration: 0.5 }}
                                className="space-y-8"
                            >
                                {/* Summary Card */}
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                        {t("Total Settings")}
                                                    </p>
                                                    <p className="text-3xl font-bold text-indigo-600">
                                                        {attendanceSettings.total}
                                                    </p>
                                                </div>
                                                <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl">
                                                    <Settings className="h-8 w-8 text-indigo-600" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Search & Filter Card */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.9, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardContent className="p-6">
                                            <div className="relative w-full">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                <Input
                                                    placeholder={t("Search attendance settings...")}
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-12 h-12 text-lg border-2 border-indigo-200 focus:border-indigo-500 rounded-xl w-full"
                                                />
                                                {searchTerm && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSearchTerm("")}
                                                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Settings Table */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.0, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                                                    <Clock className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Attendance Settings")}
                                                <Badge variant="secondary" className="ml-auto">
                                                    {attendanceSettings.total} {t("total")}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="bg-slate-50 dark:bg-slate-900/50">
                                                            <th
                                                                className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors group"
                                                                onClick={() => handleSort("enter_time")}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                                    <span>{t("Enter Time")}</span>
                                                                    <ArrowUpDown className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                                                                </div>
                                                            </th>
                                                            <th
                                                                className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors group"
                                                                onClick={() => handleSort("exit_time")}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                                    <span>{t("Exit Time")}</span>
                                                                    <ArrowUpDown className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                                                                </div>
                                                            </th>
                                                            <th
                                                                className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors group"
                                                                onClick={() => handleSort("date")}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                                    <span>{t("Date")}</span>
                                                                    <ArrowUpDown className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                                                                </div>
                                                            </th>
                                                            <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                                                {t("Actions")}
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                        <AnimatePresence>
                                                            {attendanceSettings.data.map((setting, index) => (
                                                                <motion.tr
                                                                    key={setting.id}
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, y: -20 }}
                                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                                    className="hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors"
                                                                >
                                                                    <td className="px-6 py-5">
                                                                        <div className="font-bold text-slate-900 dark:text-white text-lg">
                                                                            {setting.enter_time}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-5">
                                                                        <div className="font-bold text-slate-900 dark:text-white text-lg">
                                                                            {setting.exit_time}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-5">
                                                                        <div className="font-bold text-slate-900 dark:text-white text-lg">
                                                                            {setting.date || "—"}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-5">
                                                                        <div className="flex items-center justify-center gap-2">
                                                                            {permissions.view_attendance_setting && (
                                                                                <Link href={route("admin.attendance-settings.edit", setting.id)}>
                                                                                    <Button
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border-indigo-200 dark:hover:bg-indigo-900/30 shadow-sm"
                                                                                        title={t("Edit Setting")}
                                                                                    >
                                                                                        <Edit className="h-4 w-4" />
                                                                                    </Button>
                                                                                </Link>
                                                                            )}
                                                                            {permissions.delete_attendance_setting && (
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={() => handleDelete(setting.id)}
                                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:hover:bg-red-900/30 shadow-sm"
                                                                                    title={t("Delete Setting")}
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
                                                                                </Button>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                </motion.tr>
                                                            ))}
                                                        </AnimatePresence>
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Pagination */}
                                            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700">
                                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                    {t("Showing")} {attendanceSettings?.from || 0} - {attendanceSettings?.to || 0} {t("of")} {attendanceSettings?.total || 0} {t("results")}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePageChange(1)}
                                                        disabled={!attendanceSettings?.current_page || attendanceSettings.current_page === 1}
                                                        className="gap-1"
                                                    >
                                                        <SkipBack className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePageChange(attendanceSettings.current_page - 1)}
                                                        disabled={!attendanceSettings?.current_page || attendanceSettings.current_page === 1}
                                                        className="gap-1"
                                                    >
                                                        <ChevronLeft className="h-4 w-4" />
                                                    </Button>
                                                    {Array.from({ length: attendanceSettings?.last_page || 1 }, (_, i) => i + 1)
                                                        .filter((page) => {
                                                            const current = attendanceSettings?.current_page || 1;
                                                            return page === 1 || page === (attendanceSettings?.last_page || 1) || (page >= current - 1 && page <= current + 1);
                                                        })
                                                        .map((page, index, array) => (
                                                            <React.Fragment key={page}>
                                                                {index > 0 && array[index - 1] !== page - 1 && (
                                                                    <span className="px-2 text-slate-400">...</span>
                                                                )}
                                                                <Button
                                                                    variant={page === (attendanceSettings?.current_page || 1) ? "default" : "outline"}
                                                                    size="sm"
                                                                    onClick={() => handlePageChange(page)}
                                                                    className="min-w-[2rem]"
                                                                >
                                                                    {page}
                                                                </Button>
                                                            </React.Fragment>
                                                        ))}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePageChange(attendanceSettings.current_page + 1)}
                                                        disabled={!attendanceSettings?.current_page || attendanceSettings.current_page === attendanceSettings.last_page}
                                                        className="gap-1"
                                                    >
                                                        <ChevronLeft className="h-4 w-4 rotate-180" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePageChange(attendanceSettings.last_page)}
                                                        disabled={!attendanceSettings?.current_page || attendanceSettings.current_page === attendanceSettings.last_page}
                                                        className="gap-1"
                                                    >
                                                        <SkipForward className="h-4 w-4" />
                                                    </Button>
                                                </div>
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