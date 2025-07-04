import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Store,
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    Users,
    Phone,
    Mail,
    MapPin,
    CreditCard,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Sparkles,
    Building2,
    ShoppingBag,
    ChevronLeft,
    ChevronRight,
    X,
    RefreshCw,
    Settings
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Index({ auth, customers, filters = {}, permissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "");

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
        router.get(route('admin.customers.index'), {
            search: searchTerm,
            status: statusFilter,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
        router.get(route('admin.customers.index'), {
            search: searchTerm,
            status: status,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("");
        router.get(route('admin.customers.index'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (customerId) => {
        if (confirm(t("Are you sure you want to delete this customer?"))) {
            router.delete(route('admin.customers.destroy', customerId));
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', label: t('Active') },
            inactive: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', label: t('Inactive') },
            pending: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', label: t('Pending') },
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <Badge className={`${config.color} border-0`}>
                {config.label}
            </Badge>
        );
    };

    // Get customer data array (handle both paginated and non-paginated)
    const customerData = customers.data || customers;
    const totalCustomers = customers.total || customerData.length;
    const activeCustomers = customerData.filter(c => c.status === 'active').length;
    const totalUsers = customerData.reduce((sum, c) => sum + c.users_count, 0);

    return (
        <>
            <Head title={t("Stores Management")}>
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
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(12px);
                        border: 1px solid rgba(226, 232, 240, 0.8);
                    }

                    .dark .glass-effect {
                        background: rgba(15, 23, 42, 0.95);
                        backdrop-filter: blur(12px);
                        border: 1px solid rgba(51, 65, 85, 0.8);
                    }

                    .gradient-border {
                        background: linear-gradient(white, white) padding-box,
                                    linear-gradient(45deg, #10b981, #059669) border-box;
                        border: 1px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(15 23 42), rgb(15 23 42)) padding-box,
                                    linear-gradient(45deg, #10b981, #059669) border-box;
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
                        border-color: #10b981;
                        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
                    }

                    .dark .search-input:focus {
                        border-color: #34d399;
                        box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.2);
                    }

                    .search-input:hover {
                        border-color: #a7f3d0;
                    }

                    .dark .search-input:hover {
                        border-color: #475569;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.customers" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="glass-effect border-b border-slate-200/50 dark:border-slate-700/50 py-6 px-8 sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative float-animation"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 p-4 rounded-2xl shadow-2xl">
                                        <Store className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-green-600 dark:text-green-300 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {t("Store Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-green-600 to-slate-900 dark:from-white dark:via-green-300 dark:to-white bg-clip-text text-transparent"
                                    >
                                        {t("Stores")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"
                                    >
                                        <Building2 className="w-4 h-4" />
                                        {t("Manage your retail stores and customer accounts")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                {permissions.create_customer && (
                                    <Link href={route("admin.customers.create")}>
                                        <Button className="gap-2 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                                            <Plus className="h-4 w-4" />
                                            {t("Add Store")}
                                        </Button>
                                    </Link>
                                )}
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-green-300 dark:scrollbar-thumb-green-700 scrollbar-track-transparent">
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
                                        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-green-600 dark:text-green-400">{t("Total Stores")}</p>
                                                        <p className="text-3xl font-bold text-green-700 dark:text-green-300">{totalCustomers}</p>
                                                    </div>
                                                    <div className="p-3 bg-green-500 rounded-xl">
                                                        <Store className="w-6 h-6 text-white" />
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
                                                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{t("Active Stores")}</p>
                                                        <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                                                            {activeCustomers}
                                                        </p>
                                                    </div>
                                                    <div className="p-3 bg-blue-500 rounded-xl">
                                                        <TrendingUp className="w-6 h-6 text-white" />
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
                                                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400">{t("Total Users")}</p>
                                                        <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                                                            {totalUsers}
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
                                                            {customerData.length}
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
                                                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg">
                                                    <Search className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Search & Filter")}
                                                {(searchTerm || statusFilter) && (
                                                    <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                                        {t("Filtered")}
                                                    </Badge>
                                                )}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
                                                <div className="relative flex-1">
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                                    <Input
                                                        placeholder={t("Search stores by name, email, phone, or address...")}
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
                                                    <Select value={statusFilter} onValueChange={handleStatusFilter}>
                                                        <SelectTrigger className="w-48 h-12 search-input">
                                                            <SelectValue placeholder={t("Filter by status")} />
                                                        </SelectTrigger>
                                                        <SelectContent className="z-50">
                                                            <SelectItem value="">{t("All Status")}</SelectItem>
                                                            <SelectItem value="active">{t("Active")}</SelectItem>
                                                            <SelectItem value="inactive">{t("Inactive")}</SelectItem>
                                                            <SelectItem value="pending">{t("Pending")}</SelectItem>
                                                        </SelectContent>
                                                    </Select>

                                                    <Button type="submit" className="gap-2 h-12 bg-green-600 hover:bg-green-700">
                                                        <Search className="h-4 w-4" />
                                                        {t("Search")}
                                                    </Button>

                                                    {(searchTerm || statusFilter) && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={clearFilters}
                                                            className="gap-2 h-12 border-slate-200 hover:border-green-300 dark:border-slate-600 dark:hover:border-green-400"
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

                                {/* Customers Table */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.4, duration: 0.4 }}
                                >
                                    <Card className="content-card overflow-hidden">
                                        <CardHeader className="bg-gradient-to-r from-green-500/15 via-emerald-500/15 to-green-500/15 dark:from-green-500/25 dark:via-emerald-500/25 dark:to-green-500/25 border-b border-slate-200/60 dark:border-slate-600/60 rounded-t-xl">
                                            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                                                    <ShoppingBag className="h-6 w-6 text-white" />
                                                </div>
                                                {t("Stores List")}
                                                <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-700">
                                                    {customerData.length} {t("stores")}
                                                    {customers.total && (
                                                        <span className="ml-1">
                                                            {t("of")} {customers.total}
                                                        </span>
                                                    )}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            {customerData.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-200 py-4 px-6">
                                                                <div className="flex items-center gap-2">
                                                                    <Store className="h-4 w-4 text-green-600" />
                                                                    {t("Store")}
                                                                </div>
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-200 py-4 px-6">
                                                                <div className="flex items-center gap-2">
                                                                    <Users className="h-4 w-4 text-green-600" />
                                                                    {t("Contact")}
                                                                </div>
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-200 py-4 px-6">
                                                                <div className="flex items-center gap-2">
                                                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                                                    {t("Status")}
                                                                </div>
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-200 py-4 px-6">
                                                                <div className="flex items-center gap-2">
                                                                    <Users className="h-4 w-4 text-green-600" />
                                                                    {t("Users")}
                                                                </div>
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-200 py-4 px-6 text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <Settings className="h-4 w-4 text-green-600" />
                                                                    {t("Actions")}
                                                                </div>
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        <AnimatePresence>
                                                                {customerData.map((customer, index) => (
                                                                <motion.tr
                                                                    key={customer.id}
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, y: -20 }}
                                                                    transition={{ delay: index * 0.05 }}
                                                                    className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-all duration-200"
                                                                >
                                                                    <TableCell className="py-4 px-6">
                                                                        <div className="flex items-center space-x-4">
                                                                            <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl shadow-sm">
                                                                                <Store className="h-6 w-6 text-green-600 dark:text-green-400" />
                                                                            </div>
                                                                            <div>
                                                                                <div className="font-semibold text-gray-900 dark:text-white text-base mb-1">
                                                                                    {customer.name}
                                                                                </div>
                                                                                {customer.address && (
                                                                                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                                                        <MapPin className="w-4 h-4" />
                                                                                        {customer.address}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="py-4 px-6">
                                                                        <div className="space-y-2">
                                                                            {customer.email && (
                                                                                <div className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                                                    <Mail className="w-4 h-4 text-gray-500" />
                                                                                    <span className="font-mono">{customer.email}</span>
                                                                                </div>
                                                                            )}
                                                                            {customer.phone && (
                                                                                <div className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                                                    <Phone className="w-4 h-4 text-gray-500" />
                                                                                    <span className="font-mono">{customer.phone}</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="py-4 px-6">
                                                                        {getStatusBadge(customer.status)}
                                                                    </TableCell>
                                                                    <TableCell className="py-4 px-6">
                                                                        <Badge variant="outline" className="gap-2 border-gray-200 dark:border-gray-600 px-3 py-2 text-sm font-medium">
                                                                            <Users className="w-4 h-4" />
                                                                            {customer.users_count}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="py-4 px-6 text-right">
                                                                        <div className="flex items-center justify-end gap-3">
                                                                            {permissions.view_customer && (
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="default"
                                                                                    className="h-12 w-12 p-0 border-gray-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 shadow-sm hover:shadow-md"
                                                                                    asChild
                                                                                    title={t("View Details")}
                                                                                >
                                                                                    <Link href={route('admin.customers.show', customer.id)}>
                                                                                        <Eye className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                                                                                    </Link>
                                                                                </Button>
                                                                            )}
                                                                            {permissions.update_customer && (
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="default"
                                                                                    className="h-12 w-12 p-0 border-gray-300 dark:border-slate-600 hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 shadow-sm hover:shadow-md"
                                                                                    asChild
                                                                                    title={t("Edit Store")}
                                                                                >
                                                                                    <Link href={route('admin.customers.edit', customer.id)}>
                                                                                        <Edit className="h-7 w-7 text-green-600 dark:text-green-400" />
                                                                                    </Link>
                                                                                </Button>
                                                                            )}
                                                                            {permissions.view_customer && (
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="default"
                                                                                    className="h-12 w-12 p-0 border-gray-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 shadow-sm hover:shadow-md"
                                                                                    asChild
                                                                                    title={t("View Income")}
                                                                                >
                                                                                    <Link href={route('admin.customers.income', customer.id)}>
                                                                                        <TrendingUp className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                                                                                    </Link>
                                                                                </Button>
                                                                            )}
                                                                            {permissions.view_customer && (
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="default"
                                                                                    className="h-12 w-12 p-0 border-gray-300 dark:border-slate-600 hover:border-orange-500 dark:hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200 shadow-sm hover:shadow-md"
                                                                                    asChild
                                                                                    title={t("View Outcome")}
                                                                                >
                                                                                    <Link href={route('admin.customers.outcome', customer.id)}>
                                                                                        <TrendingDown className="h-7 w-7 text-orange-600 dark:text-orange-400" />
                                                                                    </Link>
                                                                                </Button>
                                                                            )}
                                                                            {permissions.delete_customer && (
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="default"
                                                                                    className="h-12 w-12 p-0 border-gray-300 dark:border-slate-600 hover:border-red-500 dark:hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 shadow-sm hover:shadow-md"
                                                                                    onClick={() => handleDelete(customer.id)}
                                                                                    title={t("Delete Store")}
                                                                                >
                                                                                    <Trash2 className="h-7 w-7 text-red-600 dark:text-red-400" />
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
                                                            <Store className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                                                {searchTerm || statusFilter ? t("No stores found") : t("No stores created yet")}
                                                            </p>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                {searchTerm || statusFilter ? t("Try adjusting your search or filters") : t("Create your first store to get started.")}
                                                            </p>
                                                        </div>
                                                        {!(searchTerm || statusFilter) && permissions.create_customer && (
                                                            <Link href={route("admin.customers.create")}>
                                                                <Button className="gap-2">
                                                                    <Plus className="w-4 h-4" />
                                                                    {t("Create First Store")}
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
                                {customers.links && customers.links.length > 3 && (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.5, duration: 0.4 }}
                                        className="flex items-center justify-center space-x-2"
                                    >
                                        <div className="flex items-center space-x-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-green-100 dark:border-green-900/30">
                                            {customers.links.map((link, index) => {
                                                if (link.label.includes('Previous')) {
                                                    return (
                                                        <Link
                                                            key={index}
                                                            href={link.url || '#'}
                                                            className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                                                                link.url
                                                                    ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30'
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
                                                                    ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30'
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
                                                                ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-lg'
                                                                : link.url
                                                                    ? 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30'
                                                                    : 'text-gray-400 cursor-not-allowed'
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                );
                                            })}
                                        </div>
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
