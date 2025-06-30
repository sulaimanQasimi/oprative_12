import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Search,
    Filter,
    Calendar,
    Clock,
    User,
    Building,
    CheckCircle,
    XCircle,
    LogIn,
    LogOut,
    RotateCcw,
    Download,
    Eye,
    Edit,
    Trash2,
    Plus,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Sparkles,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";

export default function ManualAttendance({ auth, attendances = [], employees = [], departments = [], filters = {}, pagination = {} }) {
    const { t } = useLaravelReactI18n();
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [selectedDepartment, setSelectedDepartment] = useState(filters.department || "");
    const [selectedDate, setSelectedDate] = useState(filters.date || new Date().toISOString().split('T')[0]);
    const [selectedStatus, setSelectedStatus] = useState(filters.status || "");
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [actionType, setActionType] = useState(""); // "check_in" or "check_out"

    // Handle search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            updateFilters();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedDepartment, selectedDate, selectedStatus]);

    const updateFilters = () => {
        const params = {
            search: searchTerm || undefined,
            department: selectedDepartment || undefined,
            date: selectedDate || undefined,
            status: selectedStatus || undefined,
            page: 1, // Reset to first page when filtering
        };

        router.get(route("admin.employees.manual-attendance"), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page) => {
        const params = {
            search: searchTerm || undefined,
            department: selectedDepartment || undefined,
            date: selectedDate || undefined,
            status: selectedStatus || undefined,
            page: page,
        };

        router.get(route("admin.employees.manual-attendance"), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const openActionModal = (employee, action) => {
        setSelectedEmployee(employee);
        setActionType(action);
        setIsActionModalOpen(true);
    };

    const closeActionModal = () => {
        setSelectedEmployee(null);
        setActionType("");
        setIsActionModalOpen(false);
    };

    const handleManualAttendance = async () => {
        if (!selectedEmployee || !actionType) return;

        try {
            const response = await fetch(route("admin.attendance.manual-record"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
                },
                body: JSON.stringify({
                    employee_id: selectedEmployee.id,
                    action: actionType,
                    verification_method: "manual_entry",
                }),
            });

            const data = await response.json();

            if (data.success) {
                closeActionModal();
                // Refresh the page to show updated attendance
                router.reload();
            } else {
                alert(data.message || t("Failed to record attendance"));
            }
        } catch (err) {
            alert(t("Error recording attendance"));
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return t("N/A");
        return new Date(dateString).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return t("N/A");
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusBadge = (attendance) => {
        if (!attendance.enter_time) {
            return <Badge variant="secondary" className="bg-gray-100 text-gray-800">{t("Absent")}</Badge>;
        } else if (attendance.exit_time) {
            return <Badge variant="default" className="bg-green-100 text-green-800">{t("Complete")}</Badge>;
        } else {
            return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">{t("Checked In")}</Badge>;
        }
    };

    // Calculate stats
    const stats = {
        total: attendances.length,
        present: attendances.filter(a => a.enter_time).length,
        absent: attendances.filter(a => !a.enter_time).length,
        incomplete: attendances.filter(a => a.enter_time && !a.exit_time).length,
    };

    return (
        <>
            <Head title={t("Manual Attendance Management")} />

            <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <Navigation auth={auth} currentRoute="admin.employees.manual-attendance" />

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 py-6 px-8 sticky top-0 z-30"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 p-4 rounded-2xl shadow-2xl">
                                        <Clock className="w-8 h-8 text-white" />
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
                                        <Sparkles className="w-4 h-4" />
                                        {t("Attendance Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent drop-shadow dark:drop-shadow-lg"
                                    >
                                        {t("Manual Attendance")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Clock className="w-4 h-4" />
                                        {t("Manage employee attendance manually")}
                                    </motion.p>
                                </div>
                            </div>
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center gap-3"
                            >
                                <Link href={route("admin.employees.verify")}>
                                    <Button variant="outline" className="gap-2 dark:text-white border-slate-200 hover:border-blue-300 dark:border-slate-600 dark:hover:border-blue-400">
                                        <Eye className="h-4 w-4" />
                                        {t("Biometric Verify")}
                                    </Button>
                                </Link>
                                <Button
                                    onClick={() => router.reload()}
                                    variant="outline"
                                    className="gap-2  border-slate-200 hover:border-blue-300 dark:border-slate-600 dark:hover:border-blue-400 dark:text-white text-slate-800"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    {t("Refresh")}
                                </Button>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Filters */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="px-8 py-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700"
                    >
                        <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
                                        <Filter className="h-5 w-5 text-white" />
                                    </div>
                                    {t("Search & Filter")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {/* Search */}
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                        <Input
                                            type="text"
                                            placeholder={t("Search employees...")}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 border-2 border-slate-200 hover:border-blue-300 focus:border-blue-500 dark:border-slate-600 dark:hover:border-blue-400 dark:focus:border-blue-400 dark:bg-slate-700 dark:text-white"
                                        />
                                    </div>

                                    {/* Department Filter */}
                                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                        <SelectTrigger className="border-2 border-slate-200 hover:border-blue-300 focus:border-blue-500 dark:border-slate-600 dark:hover:border-blue-400 dark:focus:border-blue-400 dark:bg-slate-700 dark:text-white">
                                            <SelectValue placeholder={t("All Departments")} />
                                        </SelectTrigger>
                                        <SelectContent className="dark:bg-slate-800">
                                            <SelectItem value="" className="dark:text-white">{t("All Departments")}</SelectItem>
                                            {departments.map((dept) => (
                                                <SelectItem key={dept} value={dept} className="dark:text-white">
                                                    {dept}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Date Filter */}
                                    <Input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="border-2 border-slate-200 hover:border-blue-300 focus:border-blue-500 dark:border-slate-600 dark:hover:border-blue-400 dark:focus:border-blue-400 dark:bg-slate-700 dark:text-white"
                                    />

                                    {/* Status Filter */}
                                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                        <SelectTrigger className="border-2 border-slate-200 hover:border-blue-300 focus:border-blue-500 dark:border-slate-600 dark:hover:border-blue-400 dark:focus:border-blue-400 dark:bg-slate-700 dark:text-white">
                                            <SelectValue placeholder={t("All Status")} />
                                        </SelectTrigger>
                                        <SelectContent className="z-50 fixed top-0 dark:bg-slate-800">
                                            <SelectItem value="" className="dark:text-white">{t("All Status")}</SelectItem>
                                            <SelectItem value="present" className="dark:text-white">{t("Present")}</SelectItem>
                                            <SelectItem value="absent" className="dark:text-white">{t("Absent")}</SelectItem>
                                            <SelectItem value="incomplete" className="dark:text-white">{t("Incomplete")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto p-8">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.0, duration: 0.5 }}
                            className="space-y-8"
                        >
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 1.1, duration: 0.4 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                                                        {t("Total Employees")}
                                                    </p>
                                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                                        {stats.total}
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl shadow-lg">
                                                    <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 1.2, duration: 0.4 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                                                        {t("Present Today")}
                                                    </p>
                                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                                        {stats.present}
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl shadow-lg">
                                                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 1.3, duration: 0.4 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                                                        {t("Absent Today")}
                                                    </p>
                                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                                        {stats.absent}
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-xl shadow-lg">
                                                    <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 1.4, duration: 0.4 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                                                        {t("Incomplete")}
                                                    </p>
                                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                                        {stats.incomplete}
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl shadow-lg">
                                                    <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>

                            {/* Attendance Table */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.5, duration: 0.4 }}
                            >
                                <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl">
                                    <CardHeader className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-blue-500/20 border-b border-slate-200 dark:border-slate-700">
                                        <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
                                            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
                                                <Calendar className="h-5 w-5 text-white" />
                                            </div>
                                            {t("Employee Attendance")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="bg-slate-100 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                                                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                                                            {t("Employee")}
                                                        </th>
                                                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                                                            {t("Department")}
                                                        </th>
                                                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                                                            {t("Date")}
                                                        </th>
                                                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                                                            {t("Check In")}
                                                        </th>
                                                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                                                            {t("Check Out")}
                                                        </th>
                                                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                                                            {t("Status")}
                                                        </th>
                                                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                                                            {t("Actions")}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-slate-800">
                                                    <AnimatePresence>
                                                        {attendances.map((attendance, index) => (
                                                            <motion.tr
                                                                key={`${attendance.employee.id}-${attendance.date}`}
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -20 }}
                                                                transition={{ delay: index * 0.05 }}
                                                                className={`border-b border-slate-100 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors ${index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-700/50'}`}
                                                            >
                                                                <td className="py-4 px-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                                                            <User className="w-5 h-5 text-white" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                                                {attendance.employee.first_name} {attendance.employee.last_name}
                                                                            </p>
                                                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                                {attendance.employee.employee_id}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <Badge variant="outline" className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600">
                                                                        {attendance.employee.department}
                                                                    </Badge>
                                                                </td>
                                                                <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                                                                    {formatDate(attendance.date)}
                                                                </td>
                                                                <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                                                                    {formatTime(attendance.enter_time)}
                                                                </td>
                                                                <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                                                                    {formatTime(attendance.exit_time)}
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    {getStatusBadge(attendance)}
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <div className="flex items-center gap-2">
                                                                        {!attendance.enter_time && (
                                                                            <Button
                                                                                size="sm"
                                                                                onClick={() => openActionModal(attendance.employee, "check_in")}
                                                                                className="bg-green-600 hover:bg-green-700 text-white gap-1 shadow-sm"
                                                                            >
                                                                                <LogIn className="w-3 h-3" />
                                                                                {t("Check In")}
                                                                            </Button>
                                                                        )}
                                                                        {attendance.enter_time && !attendance.exit_time && (
                                                                            <Button
                                                                                size="sm"
                                                                                onClick={() => openActionModal(attendance.employee, "check_out")}
                                                                                className="bg-blue-600 hover:bg-blue-700 text-white gap-1 shadow-sm"
                                                                            >
                                                                                <LogOut className="w-3 h-3" />
                                                                                {t("Check Out")}
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </motion.tr>
                                                        ))}
                                                    </AnimatePresence>

                                                    {attendances.length === 0 && (
                                                        <tr>
                                                            <td colSpan="7" className="py-8 text-center text-slate-500 dark:text-slate-400">
                                                                {t("No attendance records found")}
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Pagination */}
                                        {pagination.last_page > 1 && (
                                            <div className="flex items-center justify-between mt-6 p-4 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-600">
                                                <div className="text-sm text-slate-700 dark:text-slate-300">
                                                    {t("Showing")} {pagination.from} {t("to")} {pagination.to} {t("of")} {pagination.total} {t("results")}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePageChange(1)}
                                                        disabled={pagination.current_page === 1}
                                                        className="border-slate-200 hover:border-blue-300 dark:border-slate-600 dark:hover:border-blue-400 dark:text-white"
                                                    >
                                                        <ChevronsLeft className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePageChange(pagination.current_page - 1)}
                                                        disabled={pagination.current_page === 1}
                                                        className="border-slate-200 hover:border-blue-300 dark:border-slate-600 dark:hover:border-blue-400 dark:text-white"
                                                    >
                                                        <ChevronLeft className="h-4 w-4" />
                                                    </Button>

                                                    {/* Page Numbers */}
                                                    {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                                                        const page = Math.max(1, Math.min(pagination.last_page - 4, pagination.current_page - 2)) + i;
                                                        return (
                                                            <Button
                                                                key={page}
                                                                variant={pagination.current_page === page ? "default" : "outline"}
                                                                size="sm"
                                                                onClick={() => handlePageChange(page)}
                                                                className={pagination.current_page === page ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border-slate-200 hover:border-blue-300 dark:border-slate-600 dark:hover:border-blue-400 dark:text-white'}
                                                            >
                                                                {page}
                                                            </Button>
                                                        );
                                                    })}

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePageChange(pagination.current_page + 1)}
                                                        disabled={pagination.current_page === pagination.last_page}
                                                        className="border-slate-200 hover:border-blue-300 dark:border-slate-600 dark:hover:border-blue-400 dark:text-white"
                                                    >
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePageChange(pagination.last_page)}
                                                        disabled={pagination.current_page === pagination.last_page}
                                                        className="border-slate-200 hover:border-blue-300 dark:border-slate-600 dark:hover:border-blue-400 dark:text-white"
                                                    >
                                                        <ChevronsRight className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </main>
                </div>
            </div>

            {/* Manual Attendance Modal */}
            {isActionModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl border border-slate-200 dark:border-slate-700"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-3 rounded-xl shadow-lg ${actionType === "check_in" ? "bg-green-100 dark:bg-green-900/20" : "bg-blue-100 dark:bg-blue-900/20"}`}>
                                {actionType === "check_in" ? (
                                    <LogIn className={`h-6 w-6 ${actionType === "check_in" ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"}`} />
                                ) : (
                                    <LogOut className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    {actionType === "check_in" ? t("Manual Check In") : t("Manual Check Out")}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {selectedEmployee?.first_name} {selectedEmployee?.last_name}
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-slate-600 dark:text-slate-400">
                                {actionType === "check_in"
                                    ? t("Are you sure you want to manually check in this employee?")
                                    : t("Are you sure you want to manually check out this employee?")
                                }
                            </p>
                            <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    <strong>{t("Employee")}:</strong> {selectedEmployee?.first_name} {selectedEmployee?.last_name}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    <strong>{t("ID")}:</strong> {selectedEmployee?.employee_id}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    <strong>{t("Time")}:</strong> {new Date().toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={closeActionModal}
                                className="flex-1 border-slate-200 hover:border-slate-300 dark:border-slate-600 dark:hover:border-slate-500 dark:text-white"
                            >
                                {t("Cancel")}
                            </Button>
                            <Button
                                onClick={handleManualAttendance}
                                className={`flex-1 ${actionType === "check_in" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} text-white shadow-lg`}
                            >
                                {actionType === "check_in" ? t("Check In") : t("Check Out")}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
}
