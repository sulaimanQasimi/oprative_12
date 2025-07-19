import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Users,
    ArrowLeft,
    User,
    Calendar,
    Mail,
    Building2,
    Sparkles,
    Search,
    Filter,
    Download,
    RefreshCw,
    BarChart3,
    ChevronDown,
    X,
    Plus,
    Edit,
    Trash2,
    Shield,
    Eye
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";
import PageHeader from "@/Components/PageHeader";

export default function Index({ auth = {}, customerUsers = { data: [] }, permissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [customerFilter, setCustomerFilter] = useState("");
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");
    const [showFilters, setShowFilters] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState(customerUsers.data || []);

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Enhanced filtering logic
    useEffect(() => {
        let filtered = [...(customerUsers.data || [])];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Customer filter
        if (customerFilter) {
            filtered = filtered.filter(user => user.customer?.id === parseInt(customerFilter));
        }

        // Sorting
        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'customer.name') {
                aValue = a.customer?.name || '';
                bValue = b.customer?.name || '';
            }

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredUsers(filtered);
    }, [searchTerm, customerFilter, sortBy, sortOrder, customerUsers.data]);

    // Calculate totals
    const totalUsers = filteredUsers.length;
    const uniqueCustomers = new Set(filteredUsers.map(user => user.customer?.id)).size;

    const handleDeleteUser = (userId) => {
        if (confirm(t("Are you sure you want to delete this user?"))) {
            router.delete(route('admin.customer-users.destroy', userId));
        }
    };

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
        setCustomerFilter("");
        setSortBy("created_at");
        setSortOrder("desc");
    };

    // Get unique customers for filter
    const uniqueCustomersList = Array.from(
        new Map((customerUsers.data || []).map(user => [user.customer?.id, user.customer])).values()
    ).filter(customer => customer);

    return (
        <>
            <Head title={t("Customer Users Management")}>
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
                        0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
                        50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
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
                                    linear-gradient(45deg, #3b82f6, #1d4ed8) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #3b82f6, #1d4ed8) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={Users} color="blue" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.customer-users" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <PageHeader
                        category={t("Customer Users Management")}
                        title={t("Customer Users")}
                        subtitle={t("Manage customer user accounts and permissions")}
                        icon={Users}
                        actions={
                            <>
                                {permissions?.create_customer_user && (
                                    <Link href={route('admin.customer-users.create')}>
                                        <Button className="gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                                            <Plus className="h-4 w-4" />
                                            {t("Add User")}
                                        </Button>
                                    </Link>
                                )}
                            </>
                        }
                    />

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
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.4 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border hover:scale-105 transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Total Users")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-blue-600">
                                                            {totalUsers}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {t("Active customer users")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl">
                                                        <Users className="h-8 w-8 text-blue-600" />
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
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border hover:scale-105 transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Unique Customers")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-green-600">
                                                            {uniqueCustomers}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {t("With user accounts")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl">
                                                        <Building2 className="h-8 w-8 text-green-600" />
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
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border hover:scale-105 transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Recent Users")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-purple-600">
                                                            {filteredUsers.filter(user => {
                                                                const userDate = new Date(user.created_at);
                                                                const weekAgo = new Date();
                                                                weekAgo.setDate(weekAgo.getDate() - 7);
                                                                return userDate >= weekAgo;
                                                            }).length}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {t("Added this week")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl">
                                                        <Calendar className="h-8 w-8 text-purple-600" />
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
                                    transition={{ delay: 1.2, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                        <Filter className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Search & Filter")}
                                            </CardTitle>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setShowFilters(!showFilters)}
                                                    className="gap-2"
                                                >
                                                    <Filter className="h-4 w-4" />
                                                    {showFilters ? t("Hide Filters") : t("Show Filters")}
                                                    <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            {/* Search Bar */}
                                            <div className="mb-4">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                    <Input
                                                        placeholder={t("Search by name, email, or customer...")}
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="pl-12 h-12 text-lg border-2 border-blue-200 focus:border-blue-500 rounded-xl"
                                                    />
                                                    {searchTerm && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setSearchTerm("")}
                                                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
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
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                                            <div>
                                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                    {t("Customer Filter")}
                                                                </label>
                                                                <Select value={customerFilter} onValueChange={setCustomerFilter}>
                                                                    <SelectTrigger className="h-10">
                                                                        <SelectValue placeholder={t("All customers")} />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="">{t("All customers")}</SelectItem>
                                                                        {uniqueCustomersList.map((customer) => (
                                                                            <SelectItem key={customer.id} value={customer.id.toString()}>
                                                                                {customer.name}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                    {t("Sort By")}
                                                                </label>
                                                                <Select value={sortBy} onValueChange={setSortBy}>
                                                                    <SelectTrigger className="h-10">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="created_at">{t("Date Created")}</SelectItem>
                                                                        <SelectItem value="name">{t("Name")}</SelectItem>
                                                                        <SelectItem value="email">{t("Email")}</SelectItem>
                                                                        <SelectItem value="customer.name">{t("Customer")}</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                    {t("Sort Order")}
                                                                </label>
                                                                <Select value={sortOrder} onValueChange={setSortOrder}>
                                                                    <SelectTrigger className="h-10">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="desc">{t("Descending")}</SelectItem>
                                                                        <SelectItem value="asc">{t("Ascending")}</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className="flex items-end">
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={clearFilters}
                                                                    className="w-full h-10 gap-2"
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

                                {/* Users Table */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.3, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                    <BarChart3 className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Customer Users")}
                                                <Badge variant="secondary" className="ml-auto">
                                                    {filteredUsers.length} {t("of")} {customerUsers.data?.length || 0}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            {filteredUsers.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                            <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                    {t("User")}
                                                                </TableHead>
                                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                    {t("Customer")}
                                                                </TableHead>
                                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                    {t("Permissions")}
                                                                </TableHead>
                                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                    {t("Created")}
                                                                </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                            {filteredUsers.map((user, index) => (
                                                                <TableRow
                                                                    key={user.id}
                                                                    className="hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                                                                >
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg">
                                                                                <User className="h-4 w-4 text-blue-600" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-semibold text-slate-800 dark:text-white">{user.name}</p>
                                                                                <p className="text-sm text-slate-500 flex items-center gap-1">
                                                                                    <Mail className="w-3 h-3" />
                                                                                    {user.email}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <Building2 className="h-4 w-4 text-slate-400" />
                                                                            <span className="font-medium">{user.customer?.name || '-'}</span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex gap-1 flex-wrap">
                                                                            {user.permissions?.length > 0 ? (
                                                                                user.permissions.slice(0, 2).map((permission) => (
                                                                                    <Badge key={permission.id} variant="outline" className="text-xs">
                                                                                        <Shield className="w-3 h-3 mr-1" />
                                                                                        {t(permission.name)}
                                                                                    </Badge>
                                                                                ))
                                                                            ) : (
                                                                                <Badge variant="secondary" className="text-xs">
                                                                                    {t("No permissions")}
                                                                                </Badge>
                                                                            )}
                                                                            {user.permissions?.length > 2 && (
                                                                                <Badge variant="secondary" className="text-xs">
                                                                                    +{user.permissions.length - 2}
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                                                                        <div className="flex items-center gap-2">
                                                                            <Calendar className="h-4 w-4" />
                                                                            {formatDate(user.created_at)}
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                            ) : (
                                                <div className="h-32 flex flex-col items-center justify-center">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                            <Users className="h-8 w-8 text-slate-400" />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                                                {t("No customer users found")}
                                                            </p>
                                                            <p className="text-sm text-slate-500">
                                                                {searchTerm || customerFilter ? t("Try adjusting your filters") : t("No customer users have been created yet.")}
                                                            </p>
                                                        </div>
                                                        {!searchTerm && !customerFilter && permissions.create_customer_user && (
                                                            <Link href={route('admin.customer-users.create')}>
                                                                <Button className="gap-2">
                                                                    <Plus className="w-4 h-4" />
                                                                    {t("Add First User")}
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Enhanced Pagination */}
                                {customerUsers.links && customerUsers.links.length > 3 && (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.4, duration: 0.4 }}
                                        className="flex flex-col items-center space-y-4"
                                    >
                                        {/* Pagination Info */}
                                        <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            {t("Showing")} {customerUsers.from || 0} {t("to")} {customerUsers.to || 0} {t("of")} {customerUsers.total || 0} {t("results")}
                                        </div>
                                        
                                        {/* Pagination Links */}
                                        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardContent className="p-4">
                                                <div className="flex gap-2 justify-center">
                                                    {customerUsers.links.map((link, index) => (
                                                        <Link
                                                            key={index}
                                                            href={link.url || '#'}
                                                            preserveState
                                                            preserveScroll
                                                            className={`
                                                                inline-flex items-center px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200
                                                                ${link.active
                                                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl'
                                                                    : link.url
                                                                        ? 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-slate-200 dark:border-slate-600'
                                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                                                }
                                                                ${link.url && !link.active ? 'hover:scale-105' : ''}
                                                            `}
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    ))}
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
