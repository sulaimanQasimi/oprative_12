import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Calendar,
    Filter,
    Download,
    Printer,
    User,
    Building2,
    Clock,
    CheckCircle,
    XCircle,
    RotateCcw,
    FileText,
    Search,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Badge } from "@/Components/ui/badge";
import { motion } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";

// Persian month names
const PERSIAN_MONTHS = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

// Persian day names
const PERSIAN_DAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

export default function AttendanceReport({
    auth,
    attendanceData = [],
    employees = [],
    departments = [],
    filters = {},
    monthInfo = {},
    stats = {}
}) {
    const { t } = useLaravelReactI18n();
    const [selectedYear, setSelectedYear] = useState(filters.year || new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(filters.month || (new Date().getMonth() + 1));
    const [selectedDepartment, setSelectedDepartment] = useState(filters.department || "");
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [isPrintMode, setIsPrintMode] = useState(false);

    // Generate year options (current year ± 5 years)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            updateFilters();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [selectedYear, selectedMonth, selectedDepartment, searchTerm]);

    const updateFilters = () => {
        const params = {
            year: selectedYear,
            month: selectedMonth,
            department: selectedDepartment || undefined,
            search: searchTerm || undefined,
        };

        router.get(route("admin.employees.attendance-report"), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePrint = () => {
        setIsPrintMode(true);
        setTimeout(() => {
            window.print();
            setIsPrintMode(false);
        }, 100);
    };

    const handleExportExcel = () => {
        const params = new URLSearchParams({
            year: selectedYear,
            month: selectedMonth,
            department: selectedDepartment || "",
            search: searchTerm || "",
            export: "excel"
        });

        window.open(`${route("admin.employees.attendance-report")}?${params}`, '_blank');
    };

    const getAttendanceStatus = (employeeId, day) => {
        const attendance = attendanceData.find(a =>
            a.employee_id === employeeId && a.day === day
        );

        if (!attendance) return 'absent';
        if (attendance.enter_time && attendance.exit_time) return 'complete';
        if (attendance.enter_time && !attendance.exit_time) return 'incomplete';
        return 'absent';
    };

    const getAttendanceCell = (employeeId, day) => {
        const status = getAttendanceStatus(employeeId, day);
        const attendance = attendanceData.find(a =>
            a.employee_id === employeeId && a.day === day
        );

        // Check if it's Friday (day of week = 5 in Persian calendar)
        const isFriday = monthInfo.dayOfWeeks && monthInfo.dayOfWeeks[day - 1] === 5;

        let cellClass = "w-8 h-8 text-xs border border-gray-300 flex items-center justify-center ";
        let content = "";

        if (isFriday) {
            cellClass += "bg-red-50 text-red-700 border-red-200 ";
            content = "ج";
        } else {
            switch (status) {
                case 'complete':
                    cellClass += "bg-green-100 text-green-800 border-green-200 ";
                    content = "✓";
                    break;
                case 'incomplete':
                    cellClass += "bg-yellow-100 text-yellow-800 border-yellow-200 ";
                    content = "◐";
                    break;
                case 'absent':
                    cellClass += "bg-red-100 text-red-800 border-red-200 ";
                    content = "✗";
                    break;
            }
        }

        return (
            <td key={day} className={cellClass} title={
                isFriday ? "جمعه" :
                attendance ?
                    `ورود: ${attendance.enter_time || 'ندارد'} - خروج: ${attendance.exit_time || 'ندارد'}` :
                    'غایب'
            }>
                {content}
            </td>
        );
    };

    const filteredEmployees = employees.filter(employee => {
        const matchesSearch = !searchTerm ||
            employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDepartment = !selectedDepartment || employee.department === selectedDepartment;

        return matchesSearch && matchesDepartment;
    });

    return (
        <>
            <Head title={t("Monthly Attendance Report")} />

            {/* Print Styles */}
            <style jsx>{`
                @media print {
                    body * { visibility: hidden; }
                    .print-area, .print-area * { visibility: visible; }
                    .print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        background: white;
                    }
                    .no-print { display: none !important; }
                    .print-header {
                        border-bottom: 2px solid #000;
                        margin-bottom: 20px;
                        padding-bottom: 15px;
                    }
                    .print-table {
                        font-size: 10px;
                        border-collapse: collapse;
                        width: 100%;
                    }
                    .print-table th,
                    .print-table td {
                        border: 1px solid #000;
                        padding: 2px;
                        text-align: center;
                    }
                    .print-signature {
                        margin-top: 40px;
                        display: flex;
                        justify-content: space-between;
                    }
                }
            `}</style>

            <div className={`flex h-screen bg-gray-50 dark:bg-gray-950 ${isPrintMode ? 'print-mode' : ''}`}>
                <Navigation auth={auth} currentRoute="admin.employees.attendance-report" className="no-print" />

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className="bg-white dark:bg-gray-900 shadow border-b border-gray-200 dark:border-gray-800 no-print">
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg">
                                        <FileText className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {t("Monthly Attendance Report")}
                                        </h1>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {t("Comprehensive monthly attendance tracking with Persian calendar")}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        onClick={handleExportExcel}
                                        variant="outline"
                                        className="gap-2"
                                    >
                                        <Download className="h-4 w-4" />
                                        {t("Export Excel")}
                                    </Button>
                                    <Button
                                        onClick={handlePrint}
                                        className="bg-green-600 hover:bg-green-700 text-white gap-2"
                                    >
                                        <Printer className="h-4 w-4" />
                                        {t("Print Report")}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Filters */}
                    <div className="px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 no-print">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Year Filter */}
                            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t("Select Year")} />
                                </SelectTrigger>
                                <SelectContent>
                                    {yearOptions.map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Month Filter */}
                            <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t("Select Month")} />
                                </SelectTrigger>
                                <SelectContent>
                                    {PERSIAN_MONTHS.map((month, index) => (
                                        <SelectItem key={index + 1} value={(index + 1).toString()}>
                                            {month} ({index + 1})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

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

                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder={t("Search employees...")}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto p-6">
                        <div className="print-area">
                            {/* Print Header */}
                            <div className="print-header hidden print:block mb-6">
                                <div className="text-center">
                                    <h1 className="text-2xl font-bold mb-2">گزارش حضور و غیاب ماهانه</h1>
                                    <h2 className="text-lg">
                                        {PERSIAN_MONTHS[selectedMonth - 1]} {selectedYear}
                                        {selectedDepartment && ` - بخش: ${selectedDepartment}`}
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-2">
                                        تاریخ تهیه گزارش: {new Date().toLocaleDateString('fa-IR')}
                                    </p>
                                </div>
                            </div>

                            {/* Statistics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 no-print">
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    {t("Total Employees")}
                                                </p>
                                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {filteredEmployees.length}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    {t("Total Present Days")}
                                                </p>
                                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {stats.totalPresent || 0}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                                                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    {t("Total Absent Days")}
                                                </p>
                                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {stats.totalAbsent || 0}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                                                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    {t("Working Days")}
                                                </p>
                                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {monthInfo.workingDays || 0}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Legend */}
                            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <h3 className="text-sm font-semibold mb-2">{t("Legend")}:</h3>
                                <div className="flex flex-wrap gap-4 text-xs">
                                    <div className="flex items-center gap-1">
                                        <div className="w-4 h-4 bg-green-100 border border-green-200 rounded flex items-center justify-center text-green-800">✓</div>
                                        <span>{t("Complete Attendance")}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded flex items-center justify-center text-yellow-800">◐</div>
                                        <span>{t("Incomplete (No Check-out)")}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-4 h-4 bg-red-100 border border-red-200 rounded flex items-center justify-center text-red-800">✗</div>
                                        <span>{t("Absent")}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-4 h-4 bg-red-50 border border-red-200 rounded flex items-center justify-center text-red-700">ج</div>
                                        <span>{t("Friday (Holiday)")}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Attendance Table */}
                            <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow">
                                <table className="w-full print-table">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-800">
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-800 min-w-48">
                                                {t("Employee")}
                                            </th>
                                            <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t("Dept")}
                                            </th>
                                            {/* Day headers */}
                                            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                                <th
                                                    key={day}
                                                    className={`px-1 py-3 text-center text-xs font-medium uppercase tracking-wider w-8 ${
                                                        monthInfo.dayOfWeeks && monthInfo.dayOfWeeks[day - 1] === 5
                                                            ? 'text-red-600 bg-red-50'
                                                            : 'text-gray-500 dark:text-gray-400'
                                                    }`}
                                                >
                                                    {day}
                                                </th>
                                            ))}
                                            <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t("Total")}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                        {filteredEmployees.map((employee, index) => {
                                            const employeeAttendance = attendanceData.filter(a => a.employee_id === employee.id);
                                            const presentDays = employeeAttendance.filter(a => a.enter_time).length;

                                            return (
                                                <tr key={employee.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                                                    <td className="px-4 py-3 sticky left-0 bg-inherit">
                                                        <div className="flex items-center">
                                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                                                                <User className="w-4 h-4 text-white" />
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {employee.first_name} {employee.last_name}
                                                                </div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {employee.employee_id}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-3 text-center">
                                                        <Badge variant="outline" className="text-xs">
                                                            {employee.department}
                                                        </Badge>
                                                    </td>
                                                    {/* Day cells */}
                                                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day =>
                                                        getAttendanceCell(employee.id, day)
                                                    )}
                                                    <td className="px-2 py-3 text-center font-semibold">
                                                        {presentDays}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Print Footer */}
                            <div className="print-signature hidden print:block">
                                <div>
                                    <p>امضاء مسئول حضور و غیاب:</p>
                                    <div className="border-b border-black w-32 mt-8"></div>
                                </div>
                                <div>
                                    <p>امضاء مدیر:</p>
                                    <div className="border-b border-black w-32 mt-8"></div>
                                </div>
                                <div>
                                    <p>مهر سازمان:</p>
                                    <div className="border border-black w-24 h-24 mt-4"></div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
