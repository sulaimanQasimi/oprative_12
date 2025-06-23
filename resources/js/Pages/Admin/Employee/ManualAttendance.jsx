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

            <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
                <Navigation auth={auth} currentRoute="admin.employees.manual-attendance" />

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className="bg-white dark:bg-gray-900 shadow border-b border-gray-200 dark:border-gray-800">
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                        <Clock className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {t("Manual Attendance")}
                                        </h1>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {t("Manage employee attendance manually")}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Link href={route("admin.employees.verify")}>
                                        <Button variant="outline" className="gap-2">
                                            <Eye className="h-4 w-4" />
                                            {t("Biometric Verify")}
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={() => router.reload()}
                                        variant="outline"
                                        className="gap-2"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                        {t("Refresh")}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Filters */}
                    <div className="px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    type="text"
                                    placeholder={t("Search employees...")}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Department Filter */}
                            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t("All Departments")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">{t("All Departments")}</SelectItem>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept} value={dept}>
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
                                className="w-full"
                            />

                            {/* Status Filter */}
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t("All Status")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">{t("All Status")}</SelectItem>
                                    <SelectItem value="present">{t("Present")}</SelectItem>
                                    <SelectItem value="absent">{t("Absent")}</SelectItem>
                                    <SelectItem value="incomplete">{t("Incomplete")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto p-6">
                        <div className="space-y-6">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                                <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    {t("Total Employees")}
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {stats.total}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    {t("Present Today")}
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {stats.present}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                                                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    {t("Absent Today")}
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {stats.absent}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                                                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    {t("Incomplete")}
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {stats.incomplete}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Attendance Table */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5" />
                                        {t("Employee Attendance")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                                                        {t("Employee")}
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                                                        {t("Department")}
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                                                        {t("Date")}
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                                                        {t("Check In")}
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                                                        {t("Check Out")}
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                                                        {t("Status")}
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                                                        {t("Actions")}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <AnimatePresence>
                                                    {attendances.map((attendance, index) => (
                                                        <motion.tr
                                                            key={`${attendance.employee.id}-${attendance.date}`}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -20 }}
                                                            transition={{ delay: index * 0.05 }}
                                                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                                        >
                                                            <td className="py-4 px-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                                        <User className="w-5 h-5 text-white" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                                            {attendance.employee.first_name} {attendance.employee.last_name}
                                                                        </p>
                                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                            {attendance.employee.employee_id}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <Badge variant="outline">
                                                                    {attendance.employee.department}
                                                                </Badge>
                                                            </td>
                                                            <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                                                                {formatDate(attendance.date)}
                                                            </td>
                                                            <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                                                                {formatTime(attendance.enter_time)}
                                                            </td>
                                                            <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
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
                                                                            className="bg-green-600 hover:bg-green-700 text-white gap-1"
                                                                        >
                                                                            <LogIn className="w-3 h-3" />
                                                                            {t("Check In")}
                                                                        </Button>
                                                                    )}
                                                                    {attendance.enter_time && !attendance.exit_time && (
                                                                        <Button
                                                                            size="sm"
                                                                            onClick={() => openActionModal(attendance.employee, "check_out")}
                                                                            className="bg-blue-600 hover:bg-blue-700 text-white gap-1"
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
                                                        <td colSpan="7" className="py-8 text-center text-gray-500 dark:text-gray-400">
                                                            {t("No attendance records found")}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {pagination.last_page > 1 && (
                                        <div className="flex items-center justify-between mt-6">
                                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                                {t("Showing")} {pagination.from} {t("to")} {pagination.to} {t("of")} {pagination.total} {t("results")}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handlePageChange(1)}
                                                    disabled={pagination.current_page === 1}
                                                >
                                                    <ChevronsLeft className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handlePageChange(pagination.current_page - 1)}
                                                    disabled={pagination.current_page === 1}
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
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handlePageChange(pagination.last_page)}
                                                    disabled={pagination.current_page === pagination.last_page}
                                                >
                                                    <ChevronsRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>

            {/* Manual Attendance Modal */}
            {isActionModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-lg ${actionType === "check_in" ? "bg-green-100 dark:bg-green-900/20" : "bg-blue-100 dark:bg-blue-900/20"}`}>
                                {actionType === "check_in" ? (
                                    <LogIn className={`h-6 w-6 ${actionType === "check_in" ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"}`} />
                                ) : (
                                    <LogOut className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {actionType === "check_in" ? t("Manual Check In") : t("Manual Check Out")}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {selectedEmployee?.first_name} {selectedEmployee?.last_name}
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-600 dark:text-gray-400">
                                {actionType === "check_in"
                                    ? t("Are you sure you want to manually check in this employee?")
                                    : t("Are you sure you want to manually check out this employee?")
                                }
                            </p>
                            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <strong>{t("Employee")}:</strong> {selectedEmployee?.first_name} {selectedEmployee?.last_name}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <strong>{t("ID")}:</strong> {selectedEmployee?.employee_id}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <strong>{t("Time")}:</strong> {new Date().toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={closeActionModal}
                                className="flex-1"
                            >
                                {t("Cancel")}
                            </Button>
                            <Button
                                onClick={handleManualAttendance}
                                className={`flex-1 ${actionType === "check_in" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
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
