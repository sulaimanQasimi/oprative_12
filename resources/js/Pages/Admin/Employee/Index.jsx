import React, { useState, useEffect, useRef } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion, AnimatePresence } from "framer-motion";
import anime from "animejs";
import {
    Search,
    Plus,
    Users,
    ChevronRight,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Star,
    AlertCircle,
    Filter,
    ArrowUpDown,
    Eye,
    Settings,
    Mail,
    Phone,
    MapPin,
    Building,
    User,
    Badge,
    Calendar,
    Clock,
    Activity,
    UserCheck,
    Fingerprint,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/Components/ui/card";
import { Badge as UIBadge } from "@/Components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Separator } from "@/Components/ui/separator";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Index({ auth, employees = [], departments = [], filters = {} }) {
    const { t } = useLaravelReactI18n();
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [sortField, setSortField] = useState("first_name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [filterDepartment, setFilterDepartment] = useState(filters.department || "all");
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    // Refs for animation targets
    const headerRef = useRef(null);
    const statsRef = useRef(null);
    const tableRef = useRef(null);

    // Calculate statistics
    const stats = {
        total: employees?.length || 0,
        withFingerprints: employees?.filter(e => e.fingerprints?.length > 0)?.length || 0,
        departments: departments?.length || 0,
        recentlyAdded: employees?.filter(e => {
            const createdAt = new Date(e.created_at);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return createdAt > weekAgo;
        })?.length || 0,
    };

    // Filter employees based on search term and filters
    const filteredEmployees = employees
        ? employees.filter((employee) => {
              const matchesSearch =
                  (employee?.first_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (employee?.last_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (employee?.employee_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (employee?.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (employee?.department || "").toLowerCase().includes(searchTerm.toLowerCase());

              const matchesDepartment = filterDepartment === "all" || employee.department === filterDepartment;

              return matchesSearch && matchesDepartment;
          })
        : [];

    // Sort employees
    const sortedEmployees = [...filteredEmployees].sort((a, b) => {
        const aValue = a[sortField] || "";
        const bValue = b[sortField] || "";

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        if (aValue < bValue) {
            return sortDirection === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
    });

    // Sort handler
    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    // Search handler
    const handleSearch = (value) => {
        setSearchTerm(value);
        router.get(route("admin.employees.index"), {
            search: value,
            department: filterDepartment !== "all" ? filterDepartment : undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    // Department filter handler
    const handleDepartmentFilter = (value) => {
        setFilterDepartment(value);
        router.get(route("admin.employees.index"), {
            search: searchTerm || undefined,
            department: value !== "all" ? value : undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    // Bulk actions
    const handleSelectAll = () => {
        if (selectedEmployees.length === sortedEmployees.length) {
            setSelectedEmployees([]);
        } else {
            setSelectedEmployees(sortedEmployees.map(e => e.id));
        }
    };

    const handleSelectEmployee = (employeeId) => {
        setSelectedEmployees(prev =>
            prev.includes(employeeId)
                ? prev.filter(id => id !== employeeId)
                : [...prev, employeeId]
        );
    };

    // Delete handler
    const handleDelete = (employeeId) => {
        if (confirm(t("Are you sure you want to delete this employee?"))) {
            router.delete(route("admin.employees.destroy", employeeId));
        }
    };

    // Initialize animations
    useEffect(() => {
        if (!isAnimated) {
            // Animate header
            anime({
                targets: headerRef.current,
                opacity: [0, 1],
                translateY: [-30, 0],
                duration: 800,
                easing: "easeOutExpo",
            });

            // Animate stats
            anime({
                targets: statsRef.current?.children,
                opacity: [0, 1],
                translateY: [20, 0],
                delay: anime.stagger(100),
                duration: 600,
                easing: "easeOutExpo",
            });

            // Animate table
            anime({
                targets: tableRef.current,
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 700,
                easing: "easeOutExpo",
                delay: 400,
            });

            setIsAnimated(true);
        }
    }, [isAnimated]);

    // Simulate loading delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    const StatCard = ({ icon: Icon, title, value, subtitle, color = "indigo" }) => (
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {title}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {value}
                        </p>
                        {subtitle && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <div className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900/20`}>
                        <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    if (loading) {
        return <PageLoader />;
    }

    return (
        <>
            <Head title={t("Employee Management")} />

            <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
                <Navigation auth={auth} currentRoute="admin.employees" />

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header
                        ref={headerRef}
                        className="bg-white dark:bg-gray-900 shadow border-b border-gray-200 dark:border-gray-800"
                    >
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                        <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {t("Employee Management")}
                                        </h1>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {t("Manage your organization's employees")}
                                        </p>
                                    </div>
                                </div>
                                <Link href={route("admin.employees.create")}>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                                        <Plus className="h-4 w-4 mr-2" />
                                        {t("Add Employee")}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 overflow-auto p-6">
                        <div className="max-w-7xl mx-auto space-y-6">
                            {/* Statistics */}
                            <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard
                                    icon={Users}
                                    title={t("Total Employees")}
                                    value={stats.total}
                                    subtitle={t("Active employees")}
                                    color="blue"
                                />
                                <StatCard
                                    icon={Fingerprint}
                                    title={t("With Fingerprints")}
                                    value={stats.withFingerprints}
                                    subtitle={t("Biometric enrolled")}
                                    color="green"
                                />
                                <StatCard
                                    icon={Building}
                                    title={t("Departments")}
                                    value={stats.departments}
                                    subtitle={t("Active departments")}
                                    color="purple"
                                />
                                <StatCard
                                    icon={UserCheck}
                                    title={t("Recently Added")}
                                    value={stats.recentlyAdded}
                                    subtitle={t("Last 7 days")}
                                    color="orange"
                                />
                            </div>

                            {/* Filters and Search */}
                            <Card className="shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder={t("Search employees...")}
                                                    value={searchTerm}
                                                    onChange={(e) => handleSearch(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Select value={filterDepartment} onValueChange={handleDepartmentFilter}>
                                                <SelectTrigger className="w-48">
                                                    <SelectValue placeholder={t("Filter by department")} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">{t("All Departments")}</SelectItem>
                                                    {departments.map((department) => (
                                                        <SelectItem key={department} value={department}>
                                                            {department}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Employee Table */}
                            <Card ref={tableRef} className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>{t("Employees")} ({sortedEmployees.length})</span>
                                        {selectedEmployees.length > 0 && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {selectedEmployees.length} {t("selected")}
                                                </span>
                                                <Button variant="outline" size="sm">
                                                    {t("Bulk Actions")}
                                                </Button>
                                            </div>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 dark:bg-gray-800">
                                                <tr>
                                                    <th className="px-6 py-3 text-left">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedEmployees.length === sortedEmployees.length && sortedEmployees.length > 0}
                                                            onChange={handleSelectAll}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        <button
                                                            onClick={() => handleSort("first_name")}
                                                            className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                                                        >
                                                            {t("Employee")}
                                                            <ArrowUpDown className="h-3 w-3" />
                                                        </button>
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        <button
                                                            onClick={() => handleSort("employee_id")}
                                                            className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                                                        >
                                                            {t("Employee ID")}
                                                            <ArrowUpDown className="h-3 w-3" />
                                                        </button>
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        <button
                                                            onClick={() => handleSort("department")}
                                                            className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                                                        >
                                                            {t("Department")}
                                                            <ArrowUpDown className="h-3 w-3" />
                                                        </button>
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        {t("Contact")}
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        {t("Fingerprints")}
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        {t("Actions")}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                                {sortedEmployees.map((employee) => (
                                                    <tr
                                                        key={employee.id}
                                                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                                    >
                                                        <td className="px-6 py-4">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedEmployees.includes(employee.id)}
                                                                onChange={() => handleSelectEmployee(employee.id)}
                                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10">
                                                                    {employee.photo ? (
                                                                        <img
                                                                            className="h-10 w-10 rounded-full object-cover"
                                                                            src={`/storage/${employee.photo}`}
                                                                            alt={employee.first_name}
                                                                        />
                                                                    ) : (
                                                                        <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                                                            <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                        {employee.first_name} {employee.last_name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                        {employee.taskra_id}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <UIBadge variant="outline">
                                                                {employee.employee_id}
                                                            </UIBadge>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <UIBadge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                                {employee.department}
                                                            </UIBadge>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="space-y-1">
                                                                <div className="flex items-center text-sm text-gray-900 dark:text-white">
                                                                    <Mail className="h-3 w-3 mr-1 text-gray-400" />
                                                                    {employee.email}
                                                                </div>
                                                                {employee.contact_info?.phone && (
                                                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                                        <Phone className="h-3 w-3 mr-1 text-gray-400" />
                                                                        {employee.contact_info.phone}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center">
                                                                <Fingerprint className="h-4 w-4 mr-1 text-gray-400" />
                                                                <span className="text-sm text-gray-900 dark:text-white">
                                                                    {employee.fingerprints?.length || 0}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center space-x-2">
                                                                <Link
                                                                    href={route("admin.employees.show", employee.id)}
                                                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Link>
                                                                <Link
                                                                    href={route("admin.employees.edit", employee.id)}
                                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(employee.id)}
                                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {sortedEmployees.length === 0 && (
                                        <div className="text-center py-12">
                                            <Users className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                                                {t("No employees found")}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                {t("Get started by adding a new employee.")}
                                            </p>
                                            <div className="mt-6">
                                                <Link href={route("admin.employees.create")}>
                                                    <Button>
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        {t("Add Employee")}
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
} 