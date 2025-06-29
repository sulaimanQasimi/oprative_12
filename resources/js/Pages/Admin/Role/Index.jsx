import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Shield,
    Key,
    Users,
    Search,
    Eye,
    Edit,
    Trash2,
    Plus,
    Filter,
    BarChart3,
    ChevronDown,
    X,
    MoreHorizontal,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Download
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/Components/ui/dropdown-menu";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

// AnimatedCounter component
const AnimatedCounter = ({
    value,
    prefix = "",
    suffix = "",
    duration = 1500,
}) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const startTime = Date.now();
        const endTime = startTime + duration;

        const updateCount = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const currentCount = Math.floor(progress * value);
            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            }
        };

        requestAnimationFrame(updateCount);
    }, [value, duration]);

    return (
        <span>
            {prefix}{count}{suffix}
        </span>
    );
};

// Pagination component
const Pagination = ({ data, onPageChange }) => {
    const { t } = useLaravelReactI18n();
    
    if (!data.links || data.links.length <= 3) return null;

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                {t("Showing")} <span className="font-medium mx-1 text-slate-700 dark:text-slate-300">{data.from}</span> {t("to")} <span className="font-medium mx-1 text-slate-700 dark:text-slate-300">{data.to}</span> {t("of")} <span className="font-medium mx-1 text-slate-700 dark:text-slate-300">{data.total}</span> {t("results")}
            </div>
            <div className="flex items-center space-x-1">
                {data.links.map((link, index) => {
                    if (link.url === null) {
                        return (
                            <Button
                                key={index}
                                variant="ghost"
                                size="sm"
                                disabled
                                className="text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                                {link.label === '&laquo; Previous' ? <ChevronLeft className="w-4 h-4" /> :
                                 link.label === 'Next &raquo;' ? <ChevronRight className="w-4 h-4" /> :
                                 link.label}
                            </Button>
                        );
                    }

                    return (
                        <Button
                            key={index}
                            variant={link.active ? "default" : "ghost"}
                            size="sm"
                            onClick={() => onPageChange(link.url)}
                            className={link.active ? "bg-blue-600 text-white hover:bg-blue-700" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"}
                        >
                            {link.label === '&laquo; Previous' ? <ChevronLeft className="w-4 h-4" /> :
                             link.label === 'Next &raquo;' ? <ChevronRight className="w-4 h-4" /> :
                             link.label}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
};

export default function RolesIndex({ auth, roles, filters = {}, statistics = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [sortBy, setSortBy] = useState(filters?.sort_by || "created_at");
    const [sortOrder, setSortOrder] = useState(filters?.sort_order || "desc");
    const [perPage, setPerPage] = useState(filters?.per_page || 15);
    const [minPermissions, setMinPermissions] = useState(filters?.min_permissions || "");
    const [maxPermissions, setMaxPermissions] = useState(filters?.max_permissions || "");
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Check if any advanced filters are active
    useEffect(() => {
        if (minPermissions || maxPermissions) {
            setShowAdvancedFilters(true);
        }
    }, [minPermissions, maxPermissions]);

    // Get statistics with fallbacks
    const totalRoles = statistics?.total_roles || roles?.data?.length || 0;
    const totalPermissions = statistics?.total_permissions || 0;
    const averagePermissions = statistics?.average_permissions || 0;
    const rolesWithPermissions = statistics?.roles_with_permissions || 0;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSortBy("created_at");
        setSortOrder("desc");
        setPerPage(15);
        setMinPermissions("");
        setMaxPermissions("");
        setShowAdvancedFilters(false);
        
        router.get(route('admin.roles.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearch = () => {
        const params = {
            search: searchTerm || undefined,
            sort_by: sortBy,
            sort_order: sortOrder,
            per_page: perPage,
            min_permissions: minPermissions || undefined,
            max_permissions: maxPermissions || undefined,
        };

        // Remove undefined values
        Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

        router.get(route('admin.roles.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (url) => {
        router.visit(url, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (role) => {
        if (confirm(t('Are you sure you want to delete this role?'))) {
            router.delete(route('admin.roles.destroy', role.id), {
                preserveScroll: true,
            });
        }
    };

    const handleExport = () => {
        const params = new URLSearchParams({
            search: searchTerm || '',
            sort_by: sortBy,
            sort_order: sortOrder,
            min_permissions: minPermissions || '',
            max_permissions: maxPermissions || '',
            export: 'true'
        });
        
        window.open(`${route('admin.roles.index')}?${params.toString()}`, '_blank');
    };

    // Auto-search on filter changes
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm !== (filters?.search || "")) {
                handleSearch();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    return (
        <>
            <Head title={t("Roles Management")}>
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
            
            <PageLoader isVisible={loading} icon={Shield} color="blue" />
            
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.roles" />

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
                                    className="relative"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-2xl blur-lg opacity-60 dark:opacity-40"></div>
                                    <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 p-4 rounded-2xl shadow-2xl">
                                        <Shield className="w-8 h-8 text-white" />
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
                                        {t("Admin Panel")} - {t("Role Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent"
                                    >
                                        {t("Roles")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        {t("Manage user roles and permissions")}
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
                                    onClick={handleExport} 
                                    variant="outline" 
                                    className="gap-2 hover:scale-105 transition-all duration-200 border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300"
                                >
                                    <Download className="h-4 w-4" />
                                    {t("Export")}
                                </Button>
                                {auth.user?.can?.create_role && (
                                    <Link href={route('admin.roles.create')}>
                                        <Button className="gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white hover:scale-105 transition-all duration-200 shadow-lg">
                                            <Plus className="h-4 w-4" />
                                            {t("Add Role")}
                                        </Button>
                                    </Link>
                                )}
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="space-y-8"
                            >
                                {/* Enhanced Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.4 }}
                                    >
                                        <Card className="border border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-800 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                                                            {t("Total Roles")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                                            <AnimatedCounter value={totalRoles} duration={2000} />
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t("System roles")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-2xl">
                                                        <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.0, duration: 0.4 }}
                                    >
                                        <Card className="border border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-800 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                                                            {t("Total Permissions")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                                                            <AnimatedCounter value={totalPermissions} duration={2000} />
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t("Available permissions")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-2xl">
                                                        <Key className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.1, duration: 0.4 }}
                                    >
                                        <Card className="border border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-800 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                                                            {t("Avg Permissions")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                                            <AnimatedCounter value={averagePermissions} duration={2000} />
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t("Per role")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-2xl">
                                                        <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.2, duration: 0.4 }}
                                    >
                                        <Card className="border border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-800 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                                                            {t("Active Roles")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                                            <AnimatedCounter value={rolesWithPermissions} duration={2000} />
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t("With permissions")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-2xl">
                                                        <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>

                                {/* Enhanced Filters and Search */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.3, duration: 0.5 }}
                                >
                                    <Card className="border border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-800">
                                        <CardContent className="p-6">
                                            <div className="space-y-4">
                                                {/* Basic Filters */}
                                                <div className="flex flex-col lg:flex-row gap-4">
                                                    <div className="flex-1">
                                                        <div className="relative">
                                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                                                            <Input
                                                                placeholder={t("Search roles or permissions...")}
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                                className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
                                                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                                            />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex gap-2">
                                                        <Select value={sortBy} onValueChange={setSortBy}>
                                                            <SelectTrigger className="w-40 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                                                <SelectItem value="name">{t("Name")}</SelectItem>
                                                                <SelectItem value="created_at">{t("Created Date")}</SelectItem>
                                                                <SelectItem value="updated_at">{t("Updated Date")}</SelectItem>
                                                            </SelectContent>
                                                        </Select>

                                                        <Select value={sortOrder} onValueChange={setSortOrder}>
                                                            <SelectTrigger className="w-32 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                                                <SelectItem value="asc">{t("Ascending")}</SelectItem>
                                                                <SelectItem value="desc">{t("Descending")}</SelectItem>
                                                            </SelectContent>
                                                        </Select>

                                                        <Select value={perPage.toString()} onValueChange={(value) => setPerPage(parseInt(value))}>
                                                            <SelectTrigger className="w-24 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                                                <SelectItem value="10">10</SelectItem>
                                                                <SelectItem value="15">15</SelectItem>
                                                                <SelectItem value="25">25</SelectItem>
                                                                <SelectItem value="50">50</SelectItem>
                                                                <SelectItem value="100">100</SelectItem>
                                                            </SelectContent>
                                                        </Select>

                                                        <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                                                            <CollapsibleTrigger asChild>
                                                                <Button variant="outline" className="gap-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">
                                                                    <Filter className="w-4 h-4" />
                                                                    {t("Advanced")}
                                                                    <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                                                                </Button>
                                                            </CollapsibleTrigger>
                                                        </Collapsible>

                                                        <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                                                            <Search className="w-4 h-4" />
                                                        </Button>

                                                        <Button onClick={clearFilters} variant="outline" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Advanced Filters */}
                                                <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                                                    <CollapsibleContent className="space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                                            <div>
                                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                    {t("Minimum Permissions")}
                                                                </label>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="0"
                                                                    value={minPermissions}
                                                                    onChange={(e) => setMinPermissions(e.target.value)}
                                                                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                    {t("Maximum Permissions")}
                                                                </label>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="100"
                                                                    value={maxPermissions}
                                                                    onChange={(e) => setMaxPermissions(e.target.value)}
                                                                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100"
                                                                />
                                                            </div>
                                                        </div>
                                                    </CollapsibleContent>
                                                </Collapsible>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Enhanced Roles Table */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.4, duration: 0.5 }}
                                >
                                    <Card className="border border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-800">
                                        <CardHeader className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/10 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-blue-500/20 border-b border-slate-200 dark:border-slate-700">
                                            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                                <Shield className="w-5 h-5" />
                                                {t("Roles")} ({roles?.total || 0})
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                                            <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">
                                                                {t("Role Name")}
                                                            </TableHead>
                                                            <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">
                                                                {t("Permissions")}
                                                            </TableHead>
                                                            <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">
                                                                {t("Created Date")}
                                                            </TableHead>
                                                            <TableHead className="text-slate-700 dark:text-slate-300 font-semibold text-right">
                                                                {t("Actions")}
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        <AnimatePresence>
                                                            {roles?.data?.map((role, index) => (
                                                                <motion.tr
                                                                    key={role.id}
                                                                    initial={{ opacity: 0, x: -20 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    exit={{ opacity: 0, x: 20 }}
                                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                                                >
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                                                                                {role.name.charAt(0).toUpperCase()}
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-semibold text-slate-800 dark:text-white">
                                                                                    {role.name}
                                                                                </p>
                                                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                                    {role.guard_name} guard
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {role.permissions?.slice(0, 3).map((permission) => (
                                                                                <Badge
                                                                                    key={permission.id}
                                                                                    variant="secondary"
                                                                                    className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border-blue-200 dark:border-blue-800"
                                                                                >
                                                                                    {permission.name}
                                                                                </Badge>
                                                                            ))}
                                                                            {role.permissions?.length > 3 && (
                                                                                <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600">
                                                                                    +{role.permissions.length - 3} more
                                                                                </Badge>
                                                                            )}
                                                                            {!role.permissions?.length && (
                                                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                                                    {t("No permissions")}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-slate-600 dark:text-slate-400">
                                                                        {formatDate(role.created_at)}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center justify-end gap-2">
                                                                            <DropdownMenu>
                                                                                <DropdownMenuTrigger asChild>
                                                                                    <Button size="sm" variant="ghost" className="h-10 w-10 p-0 hover:bg-slate-100 dark:hover:bg-slate-700">
                                                                                        <MoreHorizontal className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                                                                    </Button>
                                                                                </DropdownMenuTrigger>
                                                                                <DropdownMenuContent align="end" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                                                                    {auth.user?.can?.view_role && (
                                                                                        <DropdownMenuItem asChild className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                                                                                            <Link href={route('admin.roles.show', role.id)} className="flex items-center gap-2">
                                                                                                <Eye className="w-4 h-4" />
                                                                                                {t("View")}
                                                                                            </Link>
                                                                                        </DropdownMenuItem>
                                                                                    )}
                                                                                    {auth.user?.can?.update_role && (
                                                                                        <DropdownMenuItem asChild className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                                                                                            <Link href={route('admin.roles.edit', role.id)} className="flex items-center gap-2">
                                                                                                <Edit className="w-4 h-4" />
                                                                                                {t("Edit")}
                                                                                            </Link>
                                                                                        </DropdownMenuItem>
                                                                                    )}
                                                                                    {auth.user?.can?.delete_role && (
                                                                                        <>
                                                                                            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                                                                                            <DropdownMenuItem
                                                                                                onClick={() => handleDelete(role)}
                                                                                                className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                                            >
                                                                                                <Trash2 className="w-4 h-4" />
                                                                                                {t("Delete")}
                                                                                            </DropdownMenuItem>
                                                                                        </>
                                                                                    )}
                                                                                </DropdownMenuContent>
                                                                            </DropdownMenu>
                                                                        </div>
                                                                    </TableCell>
                                                                </motion.tr>
                                                            ))}
                                                        </AnimatePresence>
                                                    </TableBody>
                                                </Table>
                                            </div>

                                            {(!roles?.data || roles.data.length === 0) && (
                                                <div className="text-center py-12">
                                                    <Shield className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                                                    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                                                        {t("No roles found")}
                                                    </h3>
                                                    <p className="text-slate-500 dark:text-slate-500 mb-4">
                                                        {t("No roles match your current search criteria.")}
                                                    </p>
                                                    <Button onClick={clearFilters} variant="outline" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">
                                                        {t("Clear Filters")}
                                                    </Button>
                                                </div>
                                            )}

                                            {/* Pagination */}
                                            {roles?.data && roles.data.length > 0 && (
                                                <Pagination data={roles} onPageChange={handlePageChange} />
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