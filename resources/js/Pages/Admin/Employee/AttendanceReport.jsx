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
    Sparkles,
    TrendingUp,
    Activity,
    ChevronDown,
    X,
    RefreshCw,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";

// Persian month names
const PERSIAN_MONTHS = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

// Persian day names
const PERSIAN_DAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

// Add custom CSS for dynamic container expansion
const dynamicSelectStyles = `
    .select-container {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        min-height: 80px;
        position: relative;
    }
    
    .select-container[data-state="open"] {
        min-height: 180px;
        transform: translateY(0);
    }
    
    .select-container[data-state="closed"] {
        min-height: 80px;
        transform: translateY(0);
    }
    
    .select-container[data-state="open"] .select-trigger {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .select-content-wrapper {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .select-content-wrapper[data-state="open"] {
        transform: translateY(0);
        opacity: 1;
    }
    
    .select-content-wrapper[data-state="closed"] {
        transform: translateY(-10px);
        opacity: 0;
    }
    
    .filters-grid {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .filters-grid[data-expanded="true"] {
        min-height: 200px;
    }
    
    .filters-grid[data-expanded="false"] {
        min-height: auto;
    }
`;

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
    const [showFilters, setShowFilters] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

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

    const handleExportExcel = async () => {
        setIsExporting(true);
        try {
            const params = new URLSearchParams({
                year: selectedYear,
                month: selectedMonth,
                department: selectedDepartment || "",
                search: searchTerm || "",
                export: "excel"
            });

            await router.get(route("admin.employees.attendance-report"), params, {
                preserveState: true,
                preserveScroll: true,
            });
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setIsExporting(false);
        }
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

        let cellClass = "w-8 h-8 text-xs border border-slate-200 dark:border-slate-600 flex items-center justify-center font-medium ";
        let content = "";

        if (isFriday) {
            cellClass += "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700 ";
            content = "ج";
        } else {
            switch (status) {
                case 'complete':
                    cellClass += "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700 ";
                    content = "✓";
                    break;
                case 'incomplete':
                    cellClass += "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700 ";
                    content = "◐";
                    break;
                case 'absent':
                    cellClass += "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700 ";
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
            <Head title={t("Monthly Attendance Report")}>
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
                                    linear-gradient(45deg, #10b981, #3b82f6) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #10b981, #3b82f6) border-box;
                    }

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

                    ${dynamicSelectStyles}
                `}</style>
            </Head>

            <div className={`flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 ${isPrintMode ? 'print-mode' : ''}`}>
                <Navigation auth={auth} currentRoute="admin.employees.attendance-report" className="no-print" />

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 py-6 px-8 sticky top-0 z-30 no-print"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-green-500 via-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-green-500 via-blue-500 to-indigo-600 p-4 rounded-2xl shadow-2xl">
                                        <FileText className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-green-600 dark:text-green-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {t("Attendance Analytics")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent"
                                    >
                                        {t("Monthly Attendance Report")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Activity className="w-4 h-4" />
                                        {t("Comprehensive monthly attendance tracking with Persian calendar")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center gap-3"
                            >
                                <Button
                                    onClick={handleExportExcel}
                                    variant="outline"
                                    className="gap-2 border-2 dark:text-white hover:border-green-300 dark:border-slate-600 dark:hover:border-green-400"
                                    disabled={isExporting}
                                >
                                    <Download className="h-4 w-4 dark:text-white" />
                                    {isExporting ? t("Exporting...") : t("Export Excel")}
                                </Button>
                                <Button
                                    onClick={handlePrint}
                                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white gap-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                                >
                                    <Printer className="h-4 w-4" />
                                    {t("Print Report")}
                                </Button>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Filters */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="px-8 py-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 no-print"
                    >
                        <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                            <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-white">
                                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                            <Filter className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                        </div>
                                        {t("Search & Filter")}
                                    </CardTitle>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="gap-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                                    >
                                        <Filter className="h-4 w-4" />
                                        {showFilters ? t("Hide Filters") : t("Show Filters")}
                                        <ChevronDown
                                            className={`h-4 w-4 transition-transform ${
                                                showFilters ? "rotate-180" : ""
                                            }`}
                                        />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                {/* Search Bar */}
                                <div className="mb-4">
                                    <div className="relative w-full">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                        <Input
                                            placeholder={t("Search employees...")}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-12 h-12 text-lg border border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 rounded-lg w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                                        />
                                        {searchTerm && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSearchTerm("")}
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Advanced Filters */}
                                <AnimatePresence>
                                    {showFilters && (
                                        <motion.div
                                            initial={{
                                                height: 0,
                                                opacity: 0,
                                            }}
                                            animate={{
                                                height: "auto",
                                                opacity: 1,
                                            }}
                                            exit={{
                                                height: 0,
                                                opacity: 0,
                                            }}
                                            transition={{
                                                duration: 0.3,
                                            }}
                                            className="relative"
                                        >
                                            <div 
                                                className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700 filters-grid"
                                                data-expanded="false"
                                                id="filters-grid"
                                            >
                                                <div className="relative select-container" data-state="closed">
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        {t("Year")}
                                                    </label>
                                                    <Select 
                                                        value={selectedYear.toString()} 
                                                        onValueChange={(value) => setSelectedYear(parseInt(value))}
                                                        onOpenChange={(open) => {
                                                            const container = document.querySelector('.select-container:nth-child(1)');
                                                            const grid = document.getElementById('filters-grid');
                                                            if (container) {
                                                                container.setAttribute('data-state', open ? 'open' : 'closed');
                                                            }
                                                            if (grid) {
                                                                grid.setAttribute('data-expanded', open ? 'true' : 'false');
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger className="h-10 w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white select-trigger">
                                                            <SelectValue  placeholder={t("Select Year")} />
                                                        </SelectTrigger>
                                                        <SelectContent 
                                                            position="popper" 
                                                            sideOffset={5}
                                                            className="w-[var(--radix-select-trigger-width)]"
                                                        >
                                                            {yearOptions.map((year) => (
                                                                <SelectItem key={year} value={year.toString()} className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700">
                                                                    {year}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="relative select-container" data-state="closed">
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        {t("Month")}
                                                    </label>
                                                    <Select 
                                                        value={selectedMonth.toString()} 
                                                        onValueChange={(value) => setSelectedMonth(parseInt(value))}
                                                        onOpenChange={(open) => {
                                                            const container = document.querySelector('.select-container:nth-child(2)');
                                                            const grid = document.getElementById('filters-grid');
                                                            if (container) {
                                                                container.setAttribute('data-state', open ? 'open' : 'closed');
                                                            }
                                                            if (grid) {
                                                                grid.setAttribute('data-expanded', open ? 'true' : 'false');
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger className="h-10 w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white select-trigger">
                                                            <SelectValue placeholder={t("Select Month")} />
                                                        </SelectTrigger>
                                                        <SelectContent 
                                                            position="popper" 
                                                            sideOffset={5}
                                                            className="w-[var(--radix-select-trigger-width)]"
                                                        >
                                                            {PERSIAN_MONTHS.map((month, index) => (
                                                                <SelectItem key={index + 1} value={(index + 1).toString()} className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700">
                                                                    {month} ({index + 1})
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="relative select-container" data-state="closed">
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        {t("Department")}
                                                    </label>
                                                    <Select 
                                                        value={selectedDepartment} 
                                                        onValueChange={setSelectedDepartment}
                                                        onOpenChange={(open) => {
                                                            const container = document.querySelector('.select-container:nth-child(3)');
                                                            const grid = document.getElementById('filters-grid');
                                                            if (container) {
                                                                container.setAttribute('data-state', open ? 'open' : 'closed');
                                                            }
                                                            if (grid) {
                                                                grid.setAttribute('data-expanded', open ? 'true' : 'false');
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger className="h-10 w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white select-trigger">
                                                            <SelectValue placeholder={t("All Departments")} />
                                                        </SelectTrigger>
                                                        <SelectContent 
                                                            position="popper" 
                                                            sideOffset={5}
                                                            className="w-[var(--radix-select-trigger-width)]"
                                                        >
                                                            <SelectItem value="" className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700">
                                                                {t("All Departments")}
                                                            </SelectItem>
                                                            {departments.map((dept) => (
                                                                <SelectItem key={dept} value={dept} className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700">
                                                                    {dept}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="flex items-end select-container" data-state="closed">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setSelectedYear(new Date().getFullYear());
                                                            setSelectedMonth(new Date().getMonth() + 1);
                                                            setSelectedDepartment("");
                                                            setSearchTerm("");
                                                        }}
                                                        className="w-full h-10 gap-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                                                    >
                                                        <RefreshCw className="h-4 w-4" />
                                                        {t("Clear Filters")}
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto p-8">
                        <div className="print-area max-w-7xl mx-auto space-y-8">
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
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.0, duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-4 gap-6 no-print"
                            >
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
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{t("Total Employees")}</p>
                                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{filteredEmployees.length}</p>
                                                </div>
                                                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                                                    <User className="w-6 h-6 text-white" />
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
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{t("Total Present Days")}</p>
                                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalPresent || 0}</p>
                                                </div>
                                                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                                                    <CheckCircle className="w-6 h-6 text-white" />
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
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{t("Total Absent Days")}</p>
                                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalAbsent || 0}</p>
                                                </div>
                                                <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                                                    <XCircle className="w-6 h-6 text-white" />
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
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{t("Working Days")}</p>
                                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{monthInfo.workingDays || 0}</p>
                                                </div>
                                                <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                                                    <Clock className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>

                            {/* Legend */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.5, duration: 0.5 }}
                                className="no-print"
                            >
                                <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl">
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">{t("Legend")}:</h3>
                                        <div className="flex flex-wrap gap-6 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded flex items-center justify-center text-green-700 dark:text-green-300 font-bold">✓</div>
                                                <span className="text-slate-700 dark:text-slate-300">{t("Complete Attendance")}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-700 rounded flex items-center justify-center text-yellow-700 dark:text-yellow-300 font-bold">◐</div>
                                                <span className="text-slate-700 dark:text-slate-300">{t("Incomplete (No Check-out)")}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded flex items-center justify-center text-red-700 dark:text-red-300 font-bold">✗</div>
                                                <span className="text-slate-700 dark:text-slate-300">{t("Absent")}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded flex items-center justify-center text-red-700 dark:text-red-300 font-bold">ج</div>
                                                <span className="text-slate-700 dark:text-slate-300">{t("Friday (Holiday)")}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Attendance Table */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.6, duration: 0.5 }}
                            >
                                <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl overflow-hidden">
                                    <CardHeader className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-green-500/10 dark:from-green-500/20 dark:via-blue-500/20 dark:to-green-500/20 border-b border-slate-200 dark:border-slate-700">
                                        <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                            <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl shadow-lg">
                                                <TrendingUp className="h-6 w-6 text-white" />
                                            </div>
                                            {t("Monthly Attendance Report")}
                                            <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                                {PERSIAN_MONTHS[selectedMonth - 1]} {selectedYear}
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <table className="w-full print-table">
                                                <thead>
                                                    <tr className="bg-slate-100 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider sticky left-0 bg-slate-100 dark:bg-slate-700 min-w-48 z-10">
                                                            {t("Employee")}
                                                        </th>
                                                        <th className="px-2 py-3 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                                            {t("Dept")}
                                                        </th>
                                                        {/* Day headers */}
                                                        {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                                            <th
                                                                key={day}
                                                                className={`px-1 py-3 text-center text-xs font-semibold uppercase tracking-wider w-8 ${
                                                                    monthInfo.dayOfWeeks && monthInfo.dayOfWeeks[day - 1] === 5
                                                                        ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                                                                        : 'text-slate-700 dark:text-slate-300'
                                                                }`}
                                                            >
                                                                {day}
                                                            </th>
                                                        ))}
                                                        <th className="px-2 py-3 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                                            {t("Total")}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                                    {filteredEmployees.map((employee, index) => {
                                                        const employeeAttendance = attendanceData.filter(a => a.employee_id === employee.id);
                                                        const presentDays = employeeAttendance.filter(a => a.enter_time).length;

                                                        return (
                                                            <tr key={employee.id} className={index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-700/50'}>
                                                                <td className="px-4 py-3 sticky left-0 bg-inherit z-10">
                                                                    <div className="flex items-center">
                                                                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                                                                            <User className="w-4 h-4 text-white" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                                                                {employee.first_name} {employee.last_name}
                                                                            </div>
                                                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                                                {employee.employee_id}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-2 py-3 text-center">
                                                                    <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600">
                                                                        {employee.department}
                                                                    </Badge>
                                                                </td>
                                                                {/* Day cells */}
                                                                {Array.from({ length: 31 }, (_, i) => i + 1).map(day =>
                                                                    getAttendanceCell(employee.id, day)
                                                                )}
                                                                <td className="px-2 py-3 text-center font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700">
                                                                    {presentDays}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

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
