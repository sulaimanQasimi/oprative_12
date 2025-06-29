import React, { useState, useEffect, useRef } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion, AnimatePresence } from "framer-motion";
import anime from "animejs";
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Star,
    Filter,
    ArrowUpDown,
    Download,
    RefreshCw,
    BarChart3,
    Sparkles,
    ChevronDown,
    X,
    Package,
    Hash,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Index({ auth, units = [], permissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [sortField, setSortField] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [showFilters, setShowFilters] = useState(false);

    // Refs for animation targets
    const headerRef = useRef(null);
    const tableRef = useRef(null);
    const rowRefs = useRef([]);

    // Filter units based on search term
    const filteredUnits = units
        ? units.filter(
              (unit) =>
                  (unit?.name || "")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  (unit?.code || "")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  (unit?.symbol || "")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
          )
        : [];

    // Sort units
    const sortedUnits = [...filteredUnits].sort((a, b) => {
        const aValue = a[sortField] || "";
        const bValue = b[sortField] || "";

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

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Calculate totals
    const totalUnits = filteredUnits.length;
    const totalCodes = filteredUnits.filter((unit) => unit.code).length;
    const totalSymbols = filteredUnits.filter((unit) => unit.symbol).length;

    const clearFilters = () => {
        setSearchTerm("");
        setSortField("name");
        setSortDirection("asc");
    };

    const handleDelete = (unitId) => {
        if (confirm(t('Are you sure you want to delete this unit?'))) {
            router.delete(route('admin.units.destroy', unitId), {
                preserveScroll: true,
                onSuccess: () => {
                    // Success message is handled by the backend
                },
                onError: (errors) => {
                    console.error('Error deleting unit:', errors);
                }
            });
        }
    };

    return (
        <>
            <Head title={t("Unit Management")}>
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
                        0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
                        50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.6); }
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
                                    linear-gradient(45deg, #6366f1, #4f46e5) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #6366f1, #4f46e5) border-box;
                    }

                    .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
                        background-size: 14px 14px;
                    }

                    .dark .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={Package} color="indigo" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.units" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-700/60 py-6 px-8 sticky top-0 z-30 shadow-sm dark:shadow-slate-900/20"
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
                                    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-2xl blur-lg opacity-60 dark:opacity-40"></div>
                                    <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 p-4 rounded-2xl shadow-2xl">
                                        <Package className="w-8 h-8 text-white" />
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
                                        className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {t("Admin Panel")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{
                                            delay: 0.5,
                                            duration: 0.4,
                                        }}
                                        className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent"
                                    >
                                        {t("Unit Management")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{
                                            delay: 0.6,
                                            duration: 0.4,
                                        }}
                                        className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        {t(
                                            "Manage measurement units and conversions"
                                        )}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Button
                                    variant="outline"
                                    className="gap-2 hover:scale-105 transition-all duration-200 border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 hover:text-indigo-700 dark:hover:text-indigo-300"
                                >
                                    <Download className="h-4 w-4" />
                                    {t("Export")}
                                </Button>
                                {permissions.can_create && (
                                    <Link href={route("admin.units.create")}>
                                        <Button className="gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 text-white hover:scale-105 transition-all duration-200 shadow-lg">
                                            <Plus className="h-4 w-4" />
                                            {t("Add Unit")}
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
                                className="space-y-8"
                            >
                                {/* Enhanced Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            delay: 0.9,
                                            duration: 0.4,
                                        }}
                                    >
                                        <Card className="border border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-800 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                                                            {t("Total Units")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                                                            {totalUnits}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t(
                                                                "Measurement units"
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-2xl">
                                                        <Package className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            delay: 1.0,
                                            duration: 0.4,
                                        }}
                                    >
                                        <Card className="border border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-800 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                                                            {t("With Codes")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                                            {totalCodes}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t(
                                                                "Units with codes"
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-2xl">
                                                        <Hash className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            delay: 1.1,
                                            duration: 0.4,
                                        }}
                                    >
                                        <Card className="border border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-800 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                                                            {t("With Symbols")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                                            {totalSymbols}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t(
                                                                "Units with symbols"
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-2xl">
                                                        <Star className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>

                                {/* Advanced Filters */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.3, duration: 0.4 }}
                                >
                                    <Card className="border border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-800">
                                        <CardHeader className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-indigo-500/20 border-b border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
                                                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                                                        <Filter className="h-5 w-5 text-white" />
                                                    </div>
                                                    {t("Search & Filter")}
                                                </CardTitle>
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        setShowFilters(
                                                            !showFilters
                                                        )
                                                    }
                                                    className="gap-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                                                >
                                                    <Filter className="h-4 w-4" />
                                                    {showFilters
                                                        ? t("Hide Filters")
                                                        : t("Show Filters")}
                                                    <ChevronDown
                                                        className={`h-4 w-4 transition-transform ${
                                                            showFilters
                                                                ? "rotate-180"
                                                                : ""
                                                        }`}
                                                    />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            {/* Search Bar */}
                                            <div className="mb-4">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-5 w-5" />
                                                    <Input
                                                        placeholder={t(
                                                            "Search units by name, code, or symbol..."
                                                        )}
                                                        value={searchTerm}
                                                        onChange={(e) =>
                                                            setSearchTerm(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="pl-12 h-12 text-lg border-2 border-slate-300 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
                                                    />
                                                    {searchTerm && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                setSearchTerm(
                                                                    ""
                                                                )
                                                            }
                                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
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
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                                            <div>
                                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                    {t(
                                                                        "Sort By"
                                                                    )}
                                                                </label>
                                                                <Select
                                                                    value={
                                                                        sortField
                                                                    }
                                                                    onValueChange={
                                                                        setSortField
                                                                    }
                                                                >
                                                                    <SelectTrigger className="h-10 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                                                        <SelectItem value="name">
                                                                            {t(
                                                                                "Name"
                                                                            )}
                                                                        </SelectItem>
                                                                        <SelectItem value="code">
                                                                            {t(
                                                                                "Code"
                                                                            )}
                                                                        </SelectItem>
                                                                        <SelectItem value="symbol">
                                                                            {t(
                                                                                "Symbol"
                                                                            )}
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                    {t(
                                                                        "Sort Order"
                                                                    )}
                                                                </label>
                                                                <Select
                                                                    value={
                                                                        sortDirection
                                                                    }
                                                                    onValueChange={
                                                                        setSortDirection
                                                                    }
                                                                >
                                                                    <SelectTrigger className="h-10 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                                                        <SelectItem value="asc">
                                                                            {t(
                                                                                "Ascending"
                                                                            )}
                                                                        </SelectItem>
                                                                        <SelectItem value="desc">
                                                                            {t(
                                                                                "Descending"
                                                                            )}
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className="flex items-end">
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={
                                                                        clearFilters
                                                                    }
                                                                    className="w-full h-10 gap-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                                                                >
                                                                    <RefreshCw className="h-4 w-4" />
                                                                    {t(
                                                                        "Clear Filters"
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Units Table */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.4, duration: 0.4 }}
                                >
                                    <Card className="border border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-800">
                                        <CardHeader className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-indigo-500/20 border-b border-slate-200 dark:border-slate-700">
                                            <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
                                                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                                                    <BarChart3 className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Units")}
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-auto bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                                                >
                                                    {filteredUnits.length}{" "}
                                                    {t("of")} {units.length}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                                            <TableHead
                                                                className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                                                                onClick={() =>
                                                                    handleSort(
                                                                        "name"
                                                                    )
                                                                }
                                                            >
                                                                <div className="flex items-center space-x-1">
                                                                    <span>
                                                                        {t(
                                                                            "Name"
                                                                        )}
                                                                    </span>
                                                                    <ArrowUpDown className="h-4 w-4" />
                                                                </div>
                                                            </TableHead>
                                                            <TableHead
                                                                className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                                                                onClick={() =>
                                                                    handleSort(
                                                                        "code"
                                                                    )
                                                                }
                                                            >
                                                                <div className="flex items-center space-x-1">
                                                                    <span>
                                                                        {t(
                                                                            "Code"
                                                                        )}
                                                                    </span>
                                                                    <ArrowUpDown className="h-4 w-4" />
                                                                </div>
                                                            </TableHead>
                                                            <TableHead
                                                                className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                                                                onClick={() =>
                                                                    handleSort(
                                                                        "symbol"
                                                                    )
                                                                }
                                                            >
                                                                <div className="flex items-center space-x-1">
                                                                    <span>
                                                                        {t(
                                                                            "Symbol"
                                                                        )}
                                                                    </span>
                                                                    <ArrowUpDown className="h-4 w-4" />
                                                                </div>
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">
                                                                {t("Actions")}
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {sortedUnits.length >
                                                        0 ? (
                                                            sortedUnits.map(
                                                                (
                                                                    unit,
                                                                    index
                                                                ) => (
                                                                    <TableRow
                                                                        key={
                                                                            unit.id
                                                                        }
                                                                        className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-800"
                                                                    >
                                                                        <TableCell>
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-lg">
                                                                                    <Package className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="font-semibold text-slate-800 dark:text-white">
                                                                                        {
                                                                                            unit.name
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <span className="font-mono text-sm bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg text-slate-700 dark:text-slate-300">
                                                                                {unit.code ||
                                                                                    t(
                                                                                        "—"
                                                                                    )}
                                                                            </span>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Badge
                                                                                variant="secondary"
                                                                                className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                                                                            >
                                                                                {unit.symbol ||
                                                                                    t(
                                                                                        "—"
                                                                                    )}
                                                                            </Badge>
                                                                        </TableCell>
                                                                        <TableCell className="text-right">
                                                                            <div className="flex items-center justify-end space-x-2">
                                                                                {permissions.can_update && (
                                                                                    <Link
                                                                                        href={route(
                                                                                            "admin.units.edit",
                                                                                            unit.id
                                                                                        )}
                                                                                        className="p-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200"
                                                                                    >
                                                                                        <Edit className="h-4 w-4" />
                                                                                    </Link>
                                                                                )}
                                                                                {permissions.can_delete && (
                                                                                    <button
                                                                                        onClick={() =>
                                                                                            handleDelete(
                                                                                                unit.id
                                                                                            )
                                                                                        }
                                                                                        className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                                                                                    >
                                                                                        <Trash2 className="h-4 w-4" />
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )
                                                            )
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell
                                                                    colSpan="4"
                                                                    className="h-32 text-center"
                                                                >
                                                                    <div className="flex flex-col items-center gap-4">
                                                                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                                            <Package className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                                                                {t(
                                                                                    "No units found"
                                                                                )}
                                                                            </p>
                                                                            <p className="text-sm text-slate-500 dark:text-slate-500">
                                                                                {searchTerm
                                                                                    ? t(
                                                                                          "Try adjusting your search"
                                                                                      )
                                                                                    : t(
                                                                                          "Create your first unit"
                                                                                      )}
                                                                            </p>
                                                                        </div>
                                                                        {!searchTerm && permissions.can_create && (
                                                                            <Link
                                                                                href={route(
                                                                                    "admin.units.create"
                                                                                )}
                                                                            >
                                                                                <Button className="gap-2">
                                                                                    <Plus className="h-4 w-4" />
                                                                                    {t(
                                                                                        "Create Unit"
                                                                                    )}
                                                                                </Button>
                                                                            </Link>
                                                                        )}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
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
