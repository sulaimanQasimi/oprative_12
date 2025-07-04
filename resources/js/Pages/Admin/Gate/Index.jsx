import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Plus,
    Building,
    Edit,
    Trash2,
    Download,
    Settings,
    X,
    User,
    Users,
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
    gates = {
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
    const [filterState, setFilterState] = useState(
        filters.only_trashed ? 'trashed' : 
        filters.with_trashed ? 'with_trashed' : 'active'
    );

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Handle search and filter
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.gates.index'), {
            search: searchTerm,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm("");
        router.get(route('admin.gates.index'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (gateId) => {
        if (confirm(t("Are you sure you want to delete this gate?"))) {
            router.delete(route('admin.gates.destroy', gateId));
        }
    };

    const handleRestore = (gateId) => {
        if (confirm(t("Are you sure you want to restore this gate?"))) {
            router.patch(route('admin.gates.restore', gateId));
        }
    };

    const handleForceDelete = (gateId) => {
        if (confirm(t("Are you sure you want to permanently delete this gate? This action cannot be undone!"))) {
            router.delete(route('admin.gates.force-delete', gateId));
        }
    };

    const handleFilterChange = (newFilter) => {
        setFilterState(newFilter);
        const params = { search: searchTerm };
        
        if (newFilter === 'trashed') {
            params.only_trashed = '1';
        } else if (newFilter === 'with_trashed') {
            params.with_trashed = '1';
        }
        
        router.get(route('admin.gates.index'), params, {
            preserveState: true,
            replace: true,
        });
    };

    // Get gate data array (handle both paginated and non-paginated)
    const gateData = gates.data || gates;
    const totalGates = gates.total || gateData.length;
    const totalUsers = gateData.filter(g => g.user).length;
    const totalEmployees = gateData.reduce((sum, g) => sum + (g.employees?.length || 0), 0);

    return (
        <>
            <Head title={t("Gate Management")}>
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
                <Navigation auth={auth} currentRoute="admin.gates" />

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
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative float-animation"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-2xl blur-lg opacity-60 dark:opacity-40"></div>
                                    <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 p-4 rounded-2xl shadow-2xl">
                                        <Building className="w-8 h-8 text-white" />
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
                                        {t("Access Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent"
                                    >
                                        {t("Gates")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"
                                    >
                                        <Building className="w-4 h-4" />
                                        {t("Manage access gates and permissions")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                {permissions.create_gate && (
                                    <Link href={route("admin.gates.create")}>
                                        <Button className="gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                                            <Plus className="h-4 w-4" />
                                            {t("Add Gate")}
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
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                                                        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{t("Total Gates")}</p>
                                                        <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">{totalGates}</p>
                                                    </div>
                                                    <div className="p-3 bg-indigo-500 rounded-xl">
                                                        <Building className="w-6 h-6 text-white" />
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
                                                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{t("Assigned Users")}</p>
                                                        <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                                                            {totalUsers}
                                                        </p>
                                                    </div>
                                                    <div className="p-3 bg-blue-500 rounded-xl">
                                                        <User className="w-6 h-6 text-white" />
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
                                                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400">{t("Total Employees")}</p>
                                                        <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                                                            {totalEmployees}
                                                        </p>
                                                    </div>
                                                    <div className="p-3 bg-purple-500 rounded-xl">
                                                        <Users className="w-6 h-6 text-white" />
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
                                        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/30">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-orange-600 dark:text-orange-400">{t("Displaying")}</p>
                                                        <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                                                            {gateData.length}
                                                        </p>
                                                    </div>
                                                    <div className="p-3 bg-orange-500 rounded-xl">
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
                                    transition={{ delay: 1.3, duration: 0.4 }}
                                >
                                    <Card className="border border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-800">
                                        <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg">
                                                    <Search className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Search & Filter")}
                                                {searchTerm && (
                                                    <Badge variant="secondary" className="ml-auto bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                                                        {t("Filtered")}
                                                    </Badge>
                                                )}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6 p-6">
                                            <form onSubmit={handleSearch} className="space-y-4">
                                                <div className="relative">
                                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-5 w-5" />
                                                    <Input
                                                        placeholder={t("Search gates by name, user, or description...")}
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="pl-12 h-14 text-lg border-2 border-slate-300 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                                                    />
                                                    {searchTerm && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setSearchTerm("")}
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                                        >
                                                            <X className="h-5 w-5" />
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    <Button 
                                                        type="submit" 
                                                        className="gap-2 h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                                    >
                                                        <Search className="h-5 w-5" />
                                                        {t("Search")}
                                                    </Button>

                                                    {searchTerm && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={clearFilters}
                                                            className="gap-2 h-12 border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 hover:text-indigo-700 dark:hover:text-indigo-300 dark:text-white"
                                                        >
                                                            <RefreshCw className="h-5 w-5" />
                                                            {t("Clear")}
                                                        </Button>
                                                    )}
                                                </div>
                                            </form>
                                            
                                            {/* Filter Buttons */}
                                            {permissions.restore_gate && (
                                                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                                        <div className="flex items-center gap-2">
                                                            <Filter className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                                {t("Show")}:
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-2 flex-wrap">
                                                            <Button
                                                                variant={filterState === 'active' ? 'default' : 'outline'}
                                                                size="sm"
                                                                onClick={() => handleFilterChange('active')}
                                                                className={`gap-2 transition-all duration-200 ${
                                                                    filterState === 'active' 
                                                                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg' 
                                                                        : 'border-slate-300 dark:border-slate-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-300 hover:border-indigo-400 dark:hover:border-indigo-500 dark:text-white'
                                                                }`}
                                                            >
                                                                <Building className="h-4 w-4" />
                                                                {t("Active Gates")}
                                                            </Button>
                                                            <Button
                                                                variant={filterState === 'with_trashed' ? 'default' : 'outline'}
                                                                size="sm"
                                                                onClick={() => handleFilterChange('with_trashed')}
                                                                className={`gap-2 transition-all duration-200 ${
                                                                    filterState === 'with_trashed' 
                                                                        ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg' 
                                                                        : 'border-slate-300 dark:border-slate-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:text-amber-600 dark:hover:text-amber-300 hover:border-amber-400 dark:hover:border-amber-500 dark:text-white'
                                                                }`}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                                {t("All Gates")}
                                                            </Button>
                                                            <Button
                                                                variant={filterState === 'trashed' ? 'default' : 'outline'}
                                                                size="sm"
                                                                onClick={() => handleFilterChange('trashed')}
                                                                className={`gap-2 transition-all duration-200 ${
                                                                    filterState === 'trashed' 
                                                                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg' 
                                                                        : 'border-slate-300 dark:border-slate-600 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-300 hover:border-red-400 dark:hover:border-red-500 dark:text-white'
                                                                }`}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                                {t("Deleted Gates")}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Gates Table */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.4, duration: 0.4 }}
                                >
                                    <Card className="border border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-800">
                                        <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                                                    <Building className="h-6 w-6 text-white" />
                                                </div>
                                                {t("Gates List")}
                                                <Badge variant="secondary" className="ml-auto bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                                                    {gateData.length} {t("gates")}
                                                    {gates.total && (
                                                        <span className="ml-1">
                                                            {t("of")} {gates.total}
                                                        </span>
                                                    )}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            {gateData.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="w-1/3">{t("Gate Information")}</TableHead>
                                                            <TableHead className="w-1/3">{t("Assigned User")}</TableHead>
                                                            <TableHead className="w-1/6">{t("Employees")}</TableHead>
                                                            <TableHead className="w-1/6 text-right">{t("Actions")}</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                            {gateData.map((gate, index) => (
                                                            <TableRow key={gate.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                                <TableCell>
                                                                    <div className="flex items-start space-x-3">
                                                                        <div className="flex-shrink-0 p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                                                                <Building className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                                            </div>
                                                                        <div className="min-w-0 flex-1">
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                                                                    {gate.name}
                                                                                </h4>
                                                                                    {gate.deleted_at && (
                                                                                    <Badge variant="destructive" className="text-xs px-2 py-0.5">
                                                                                            {t("Deleted")}
                                                                                        </Badge>
                                                                                    )}
                                                                                </div>
                                                                                {gate.description && (
                                                                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                                                                        {gate.description}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {gate.user ? (
                                                                        <div className="space-y-1">
                                                                            <div className="font-medium text-slate-900 dark:text-white text-sm">
                                                                                {gate.user.name}
                                                                                    </div>
                                                                            <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                                                                <User className="w-3.5 h-3.5" />
                                                                                <span className="truncate">{gate.user.email}</span>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-sm text-slate-500 dark:text-slate-400 italic">
                                                                            {t("No user assigned")}
                                                                        </div>
                                                                    )}
                                                                    </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center justify-center">
                                                                        <Badge variant="secondary" className="gap-1.5 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                                                            <Users className="w-3.5 h-3.5" />
                                                                            <span className="font-medium">{gate.employees?.length || 0}</span>
                                                                        </Badge>
                                                                    </div>
                                                                    </TableCell>
                                                                <TableCell className="text-right">
                                                                        <div className="flex items-center justify-end gap-2">
                                                                            {/* View Button */}
                                                                            {permissions.view_gate && (
                                                                            <Link
                                                                                href={route('admin.gates.show', gate.id)}
                                                                                className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                                                                                title={t("View Gate")}
                                                                            >
                                                                                        <Eye className="h-4 w-4" />
                                                                                    </Link>
                                                                            )}
                                                                            
                                                                            {/* Edit Button - only for active gates */}
                                                                            {permissions.update_gate && !gate.deleted_at && (
                                                                            <Link
                                                                                href={route('admin.gates.edit', gate.id)}
                                                                                className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200 transition-colors"
                                                                                title={t("Edit Gate")}
                                                                            >
                                                                                        <Edit className="h-4 w-4" />
                                                                                    </Link>
                                                                            )}
                                                                            
                                                                            {/* Delete Button - only for active gates */}
                                                                            {permissions.delete_gate && !gate.deleted_at && (
                                                                            <button
                                                                                    onClick={() => handleDelete(gate.id)}
                                                                                className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 hover:text-red-900 dark:text-red-300 dark:hover:text-red-200 transition-colors"
                                                                                title={t("Delete Gate")}
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
                                                                            </button>
                                                                            )}
                                                                            
                                                                            {/* Restore Button - only for deleted gates */}
                                                                            {permissions.restore_gate && gate.deleted_at && (
                                                                            <button
                                                                                    onClick={() => handleRestore(gate.id)}
                                                                                className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 hover:text-green-900 dark:text-green-300 dark:hover:text-green-200 transition-colors"
                                                                                title={t("Restore Gate")}
                                                                                >
                                                                                    <RotateCcw className="h-4 w-4" />
                                                                            </button>
                                                                            )}
                                                                            
                                                                            {/* Force Delete Button - only for deleted gates */}
                                                                            {permissions.force_delete_gate && gate.deleted_at && (
                                                                            <button
                                                                                    onClick={() => handleForceDelete(gate.id)}
                                                                                className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 hover:text-red-900 dark:text-red-300 dark:hover:text-red-200 transition-colors"
                                                                                title={t("Force Delete Gate")}
                                                                                >
                                                                                    <XCircle className="h-4 w-4" />
                                                                            </button>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                            </TableRow>
                                                            ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                            ) : (
                                                <div className="text-center py-16">
                                                    <div className="flex flex-col items-center gap-6">
                                                        <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                            <Building className="h-12 w-12 text-slate-400" />
                                                        </div>
                                                        <div className="text-center max-w-md">
                                                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                                                                {searchTerm ? t("No gates found") : t("No gates created yet")}
                                                            </h3>
                                                            <p className="text-slate-600 dark:text-slate-400">
                                                                {searchTerm ? t("Try adjusting your search criteria") : t("Create your first gate to get started with access management.")}
                                                            </p>
                                                        </div>
                                                        {!searchTerm && permissions.create_gate && (
                                                            <Link href={route("admin.gates.create")}>
                                                                <Button className="gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 text-white shadow-lg">
                                                                    <Plus className="w-4 h-4" />
                                                                    {t("Create First Gate")}
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
                                {gates.links && gates.links.length > 3 && (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.5, duration: 0.4 }}
                                        className="flex justify-center"
                                    >
                                        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="text-sm text-slate-600 dark:text-slate-400">
                                                        {t("Showing")} {gates.from} {t("to")} {gates.to} {t("of")} {gates.total} {t("gates")}
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        {gates.links.map((link, index) => {
                                                            if (link.url === null) {
                                                                return (
                                                                    <Button
                                                                        key={index}
                                                                        variant="outline"
                                                                        size="sm"
                                                                        disabled
                                                                        className="w-10 h-10 p-0 dark:text-white"
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
                                                                                : 'hover:bg-indigo-50 hover:border-indigo-300 dark:text-white'
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