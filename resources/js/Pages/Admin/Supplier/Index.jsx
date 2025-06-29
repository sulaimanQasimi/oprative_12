import React, { useState, useEffect, useRef } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion, AnimatePresence } from "framer-motion";
import anime from "animejs";
import {
    Search,
    Plus,
    Truck,
    CheckCircle,
    AlertCircle,
    Filter,
    ArrowUpDown,
    Phone,
    Mail,
    CreditCard,
    FileText,
    ShoppingBag,
    Building,
    Users,
    Activity,
    DollarSign,
    Package,
    Zap,
    RefreshCw,
    Settings,
    XCircle,
    Eye,
    Edit,
    Trash2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Download,
    MapPin,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/Components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
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
import { Input } from "@/Components/ui/input";

export default function Index({ auth, suppliers = {}, filters = {}, permissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "all");
    const [sortField, setSortField] = useState(filters.sort_field || "name");
    const [sortDirection, setSortDirection] = useState(filters.sort_direction || "asc");
    const [showFilters, setShowFilters] = useState(false);
    const [perPage, setPerPage] = useState(filters.per_page || 10);

    // Refs for animation targets
    const headerRef = useRef(null);
    const statsRef = useRef(null);
    const tableRef = useRef(null);

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Handle search/filter
    const handleSearch = () => {
        router.get(route('admin.suppliers.index'), {
            search: searchTerm,
            status: statusFilter,
            sort_field: sortField,
            sort_direction: sortDirection,
            per_page: perPage,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
        setSortField("name");
        setSortDirection("asc");
        setPerPage(10);
        router.get(route('admin.suppliers.index'));
    };

    // Handle delete
    const handleDelete = (supplierId) => {
        if (confirm(t("Are you sure you want to delete this supplier?"))) {
            router.delete(route("admin.suppliers.destroy", supplierId), {
                preserveScroll: true,
                onSuccess: () => {
                    // Optional: Add success notification
                },
                onError: () => {
                    // Optional: Add error notification
                }
            });
        }
    };

    // Stats
    const stats = {
        total: suppliers?.total || 0,
        active: suppliers?.data?.filter(s => s.is_active !== false)?.length || 0,
        withPurchases: suppliers?.data?.filter(s => s.purchases_count > 0)?.length || 0,
        pending: suppliers?.data?.filter(s => s.pending_payments > 0)?.length || 0,
        totalValue: suppliers?.data?.reduce((sum, s) => sum + (parseFloat(s.total_purchases) || 0), 0) || 0,
    };

    // Table columns
    const columns = [
        { key: 'name', label: t('Supplier'), icon: Building },
        { key: 'contact_name', label: t('Contact'), icon: Users },
        { key: 'email', label: t('Email'), icon: Mail },
        { key: 'phone', label: t('Phone'), icon: Phone },
        { key: 'id_number', label: t('ID Number'), icon: FileText },
        { key: 'status', label: t('Status'), icon: Activity },
        { key: 'actions', label: t('Actions'), icon: Settings },
    ];

    // Pagination
    const renderPagination = () => {
        if (!suppliers?.links || suppliers.links.length <= 3) return null;
        return (
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.4 }}
                className="flex items-center justify-center space-x-2"
            >
                <div className="flex items-center space-x-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-sky-100 dark:border-sky-900/30">
                    {suppliers.links.map((link, index) => {
                        if (link.label.includes('Previous')) {
                            return (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                                        link.url
                                            ? 'text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/30'
                                            : 'text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                    <span className="ml-1 hidden sm:inline">{t('Previous')}</span>
                                </Link>
                            );
                        }
                        if (link.label.includes('Next')) {
                            return (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                                        link.url
                                            ? 'text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/30'
                                            : 'text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <span className="mr-1 hidden sm:inline">{t('Next')}</span>
                                    <ChevronLeft className="h-4 w-4" />
                                </Link>
                            );
                        }
                        return (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                                    link.active
                                        ? 'bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-lg'
                                        : link.url
                                            ? 'text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/30'
                                            : 'text-gray-400 cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    })}
                </div>
            </motion.div>
        );
    };

    return (
        <>
            <Head title={t("Supplier Management")}>
                <style>{`
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    .animate-shimmer {
                        animation: shimmer 3s infinite;
                    }
                    .bg-grid-pattern {
                        background-image:
                            linear-gradient(to right, rgba(0, 0, 0, 0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
                        background-size: 20px 20px;
                    }
                    .dark .bg-grid-pattern {
                        background-image:
                            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
                    }
                    .glass-effect {
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(12px);
                        border: 1px solid rgba(226, 232, 240, 0.8);
                    }
                    .dark .glass-effect {
                        background: rgba(15, 23, 42, 0.95);
                        backdrop-filter: blur(12px);
                        border: 1px solid rgba(51, 65, 85, 0.8);
                    }
                    .header-glass {
                        background: rgba(255, 255, 255, 0.98);
                        backdrop-filter: blur(20px);
                        border-bottom: 1px solid rgba(226, 232, 240, 0.8);
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                    }
                    .dark .header-glass {
                        background: rgba(15, 23, 42, 0.98);
                        backdrop-filter: blur(20px);
                        border-bottom: 1px solid rgba(51, 65, 85, 0.6);
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
                    }
                    .table-row {
                        transition: all 0.3s ease;
                        background: linear-gradient(to right, transparent, transparent);
                    }
                    .table-row:hover {
                        background: linear-gradient(to right, rgba(14, 165, 233, 0.05), rgba(6, 182, 212, 0.05));
                        transform: translateX(4px);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }
                    .dark .table-row:hover {
                        background: linear-gradient(to right, rgba(14, 165, 233, 0.1), rgba(6, 182, 212, 0.1));
                    }
                    .stat-card {
                        background: rgba(255, 255, 255, 0.98);
                        backdrop-filter: blur(16px);
                        border: 1px solid rgba(226, 232, 240, 0.8);
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                    }
                    .dark .stat-card {
                        background: rgba(15, 23, 42, 0.98);
                        backdrop-filter: blur(16px);
                        border: 1px solid rgba(51, 65, 85, 0.8);
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
                    }
                    .content-card {
                        background: rgba(255, 255, 255, 0.98);
                        backdrop-filter: blur(16px);
                        border: 1px solid rgba(226, 232, 240, 0.8);
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                    }
                    .dark .content-card {
                        background: rgba(15, 23, 42, 0.98);
                        backdrop-filter: blur(16px);
                        border: 1px solid rgba(51, 65, 85, 0.8);
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
                    }
                    .search-input {
                        background: rgba(255, 255, 255, 1);
                        border: 1px solid rgba(226, 232, 240, 1);
                        transition: all 0.2s ease-in-out;
                    }
                    .dark .search-input {
                        background: rgba(30, 41, 59, 1);
                        border: 1px solid rgba(51, 65, 85, 1);
                    }
                    .search-input:focus {
                        border-color: #0ea5e9;
                        box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
                    }
                    .dark .search-input:focus {
                        border-color: #38bdf8;
                        box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
                    }
                    .search-input:hover {
                        border-color: #a7f3d0;
                    }
                    .dark .search-input:hover {
                        border-color: #475569;
                    }
                    .supplier-dropdown {
                        position: absolute !important;
                        z-index: 50 !important;
                        width: 10rem !important;
                        top: 100% !important;
                        left: 0 !important;
                        margin-top: 0.25rem !important;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.suppliers" />

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
                                    <div className="absolute -inset-2 bg-gradient-to-r from-sky-500 via-cyan-500 to-sky-600 rounded-2xl blur-lg opacity-60 dark:opacity-40"></div>
                                    <div className="relative bg-gradient-to-br from-sky-500 via-cyan-500 to-sky-600 p-4 rounded-2xl shadow-2xl">
                                        <Truck className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1 flex items-center gap-2"
                                    >
                                        <Zap className="w-4 h-4" />
                                        {t("Supplier Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent"
                                    >
                                        {t("Suppliers")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"
                                    >
                                        <Activity className="w-4 h-4" />
                                        {t("Track and manage supplier records")}
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
                                    className="gap-2 hover:scale-105 transition-all duration-200 border-slate-300 dark:border-slate-600 hover:border-sky-400 dark:hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/30 text-slate-700 dark:text-slate-200 hover:text-sky-700 dark:hover:text-sky-300"
                                >
                                    <Download className="h-4 w-4" />
                                    {t("Export")}
                                </Button>
                                {permissions.can_create && (
                                    <Link href={route("admin.suppliers.create")}>
                                        <Button className="gap-2 bg-gradient-to-r from-sky-600 via-cyan-600 to-sky-700 hover:from-sky-700 hover:via-cyan-700 hover:to-sky-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border-0">
                                            <Plus className="h-4 w-4" />
                                            {t("Add Supplier")}
                                        </Button>
                                    </Link>
                                )}
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-sky-300 dark:scrollbar-thumb-sky-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="space-y-8"
                            >
                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.4 }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <Card className="border-0 shadow-lg bg-gradient-to-br from-sky-50 to-cyan-100 dark:from-sky-900/20 dark:to-cyan-900/30">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-sky-600 dark:text-sky-400">{t("Total Suppliers")}</p>
                                                        <p className="text-3xl font-bold text-sky-700 dark:text-sky-300">{stats.total?.toLocaleString() || "0"}</p>
                                                    </div>
                                                    <div className="p-3 bg-sky-500 rounded-xl">
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
                                        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-green-600 dark:text-green-400">{t("Active Suppliers")}</p>
                                                        <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                                                            {stats.active?.toLocaleString() || "0"}
                                                        </p>
                                                    </div>
                                                    <div className="p-3 bg-green-500 rounded-xl">
                                                        <CheckCircle className="w-6 h-6 text-white" />
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
                                        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{t("With Purchases")}</p>
                                                        <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                                                            {stats.withPurchases?.toLocaleString() || "0"}
                                                        </p>
                                                    </div>
                                                    <div className="p-3 bg-blue-500 rounded-xl">
                                                        <ShoppingBag className="w-6 h-6 text-white" />
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
                                                            {suppliers?.data?.length || 0}
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
                                    className="relative z-40"
                                >
                                    <Card className="content-card">
                                        <CardHeader>
                                            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-sky-500 to-cyan-600 rounded-lg shadow-lg">
                                                    <Search className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Search & Filter")}
                                                {(searchTerm || statusFilter !== "all") && (
                                                    <Badge variant="secondary" className="ml-auto bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                                                        {t("Filtered")}
                                                    </Badge>
                                                )}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex flex-col lg:flex-row gap-4">
                                                <div className="relative flex-1">
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                                    <Input
                                                        placeholder={t("Search suppliers by name, contact, email, or phone...")}
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="search-input pl-10 h-12 transition-colors"
                                                    />
                                                    {searchTerm && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setSearchTerm("")}
                                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
                                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                                        <SelectTrigger className="w-48 h-12 search-input">
                                                            <SelectValue placeholder={t("Filter by status")} />
                                                        </SelectTrigger>
                                                        <SelectContent className="z-50">
                                                            <SelectItem value="all">{t("All Status")}</SelectItem>
                                                            <SelectItem value="active">{t("Active")}</SelectItem>
                                                            <SelectItem value="inactive">{t("Inactive")}</SelectItem>
                                                            <SelectItem value="with_purchases">{t("With Purchases")}</SelectItem>
                                                            <SelectItem value="pending">{t("Pending Payments")}</SelectItem>
                                                        </SelectContent>
                                                    </Select>

                                                    <Button type="submit" className="gap-2 h-12 bg-sky-600 hover:bg-sky-700">
                                                        <Search className="h-4 w-4" />
                                                        {t("Search")}
                                                    </Button>

                                                    {(searchTerm || statusFilter !== "all") && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={clearFilters}
                                                            className="gap-2 h-12 border-slate-200 hover:border-sky-300 dark:border-slate-600 dark:hover:border-sky-400"
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
                                {/* Supplier Table */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.4, duration: 0.4 }}
                                >
                                    <Card className="content-card overflow-hidden">
                                        <CardHeader className="bg-gradient-to-r from-sky-500/15 via-cyan-500/15 to-sky-500/15 dark:from-sky-500/25 dark:via-cyan-500/25 dark:to-sky-500/25 border-b border-slate-200/60 dark:border-slate-600/60 rounded-t-xl">
                                            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                <div className="p-3 bg-gradient-to-br from-sky-500 to-cyan-600 rounded-xl shadow-lg">
                                                    <Building className="h-6 w-6 text-white" />
                                                </div>
                                                {t("Supplier Records")}
                                                <Badge variant="secondary" className="ml-auto bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 border border-sky-200 dark:border-sky-700">
                                                    {suppliers?.data?.length || 0} {t("suppliers")}
                                                    {suppliers?.total && (
                                                        <span className="ml-1">
                                                            {t("of")} {suppliers.total}
                                                        </span>
                                                    )}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            {suppliers?.data?.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-200">{t("Supplier")}</TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-200">{t("Contact")}</TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-200">{t("Status")}</TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-200">{t("ID Number")}</TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-200 text-right">{t("Actions")}</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        <AnimatePresence>
                                                            {suppliers.data.map((supplier, index) => (
                                                                <motion.tr
                                                                    key={supplier.id}
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, y: -20 }}
                                                                    transition={{ delay: index * 0.05 }}
                                                                    className="border-b border-slate-100 dark:border-slate-700 hover:bg-sky-50/50 dark:hover:bg-sky-900/10 transition-colors"
                                                                >
                                                                    <TableCell>
                                                                        <div className="flex items-center space-x-3">
                                                                            <div className="p-2 bg-gradient-to-br from-sky-100 to-cyan-100 dark:from-sky-900/30 dark:to-cyan-900/30 rounded-lg">
                                                                                <Building className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                                                                            </div>
                                                                            <div>
                                                                                <div className="font-semibold text-slate-900 dark:text-white">{supplier.name}</div>
                                                                                {(supplier.city || supplier.country) && (
                                                                                    <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                                                        <MapPin className="w-3 h-3" />
                                                                                        {supplier.city}{supplier.city && supplier.country && ', '}{supplier.country}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="space-y-1">
                                                                            {supplier.contact_name && (
                                                                                <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                                                                    <Users className="w-3 h-3" />
                                                                                    {supplier.contact_name}
                                                                                </div>
                                                                            )}
                                                                            {supplier.email && (
                                                                                <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                                                                    <Mail className="w-3 h-3" />
                                                                                    {supplier.email}
                                                                                </div>
                                                                            )}
                                                                            {supplier.phone && (
                                                                                <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                                                                    <Phone className="w-3 h-3" />
                                                                                    {supplier.phone}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {supplier.is_active !== false && (
                                                                                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-0">
                                                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                                                    {t("Active")}
                                                                                </Badge>
                                                                            )}
                                                                            {(supplier.purchases_count || 0) > 0 && (
                                                                                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-0">
                                                                                    <ShoppingBag className="h-3 w-3 mr-1" />
                                                                                    {t("Has Orders")}
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge variant="outline" className="gap-1 border-slate-200 dark:border-slate-600">
                                                                            <FileText className="w-3 h-3" />
                                                                            {supplier.id_number || "—"}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        <div className="flex items-center justify-end gap-1">
                                                                            {permissions.can_view && (
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
                                                                                    asChild
                                                                                >
                                                                                    <Link href={route('admin.suppliers.show', supplier.id)}>
                                                                                        <Eye className="h-4 w-4" />
                                                                                        <span className="sr-only">{t("View Details")}</span>
                                                                                    </Link>
                                                                                </Button>
                                                                            )}
                                                                            {permissions.can_update && (
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="h-8 w-8 p-0 hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-900/20 dark:hover:text-sky-400 transition-colors"
                                                                                    asChild
                                                                                >
                                                                                    <Link href={route('admin.suppliers.edit', supplier.id)}>
                                                                                        <Edit className="h-4 w-4" />
                                                                                        <span className="sr-only">{t("Edit")}</span>
                                                                                    </Link>
                                                                                </Button>
                                                                            )}
                                                                            {permissions.can_delete && (
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                                                                                    onClick={() => handleDelete(supplier.id)}
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
                                                            <Truck className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                                                {searchTerm || statusFilter !== "all" ? t("No suppliers found") : t("No suppliers created yet")}
                                                            </p>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                {searchTerm || statusFilter !== "all" ? t("Try adjusting your search or filters") : t("Create your first supplier to get started.")}
                                                            </p>
                                                        </div>
                                                        {!(searchTerm || statusFilter !== "all") && permissions.can_create && (
                                                            <Link href={route("admin.suppliers.create")}>
                                                                <Button className="gap-2">
                                                                    <Plus className="w-4 h-4" />
                                                                    {t("Create First Supplier")}
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
                                {renderPagination()}
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
}
