import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Store,
    ArrowLeft,
    Edit,
    Plus,
    User,
    Mail,
    Phone,
    MapPin,
    Building2,
    Sparkles,
    CheckCircle,
    AlertCircle,
    Users,
    TrendingUp,
    TrendingDown,
    Package,
    CreditCard,
    Trash2,
    Eye,
    Calendar,
    Filter,
    Search,
    ShoppingCart,
    ChevronLeft,
    ChevronRight,
    X
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
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/Components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Show({ auth, customer, roles, permissions, accounts, accounts_filters = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [searchTerm, setSearchTerm] = useState("");
    const [accountsSearch, setAccountsSearch] = useState(accounts_filters.accounts_search || "");
    const [accountsStatus, setAccountsStatus] = useState(accounts_filters.accounts_status || "");

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const handleDeleteUser = (userId) => {
        if (confirm(t("Are you sure you want to delete this user?"))) {
            router.delete(route('admin.customer-users.destroy', userId));
        }
    };

    // Handle accounts search and filter
    const handleAccountsSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.customers.show', customer.id), {
            accounts_search: accountsSearch,
            accounts_status: accountsStatus,
        }, {
            preserveState: true,
            replace: true,
            only: ['accounts', 'accounts_filters']
        });
    };

    const handleAccountsStatusFilter = (status) => {
        setAccountsStatus(status);
        router.get(route('admin.customers.show', customer.id), {
            accounts_search: accountsSearch,
            accounts_status: status,
        }, {
            preserveState: true,
            replace: true,
            only: ['accounts', 'accounts_filters']
        });
    };

    const clearAccountsFilters = () => {
        setAccountsSearch("");
        setAccountsStatus("");
        router.get(route('admin.customers.show', customer.id), {}, {
            preserveState: true,
            replace: true,
            only: ['accounts', 'accounts_filters']
        });
    };

    const handleDeleteAccount = (accountId) => {
        if (confirm(t("Are you sure you want to delete this account?"))) {
            router.delete(route('admin.accounts.destroy', accountId));
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AFN',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <Head title={`${customer.name} - ${t("Store Details")}`}>
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
                                    linear-gradient(45deg, #10b981, #059669) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #10b981, #059669) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
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
                        className="glass-effect border-b border-white/20 dark:border-slate-700/50 py-6 px-8 sticky top-0 z-30"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative float-animation"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 p-4 rounded-2xl shadow-2xl">
                                        <Store className="w-8 h-8 text-white" />
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
                                        {t("Store Details")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent"
                                    >
                                        {customer.name}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Building2 className="w-4 h-4" />
                                        {t("Complete store information and management")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Link href={route("admin.customers.edit", customer.id)}>
                                    <Button className="gap-2 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:via-amber-700 hover:to-orange-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                                        <Edit className="h-4 w-4" />
                                        {t("Edit Store")}
                                    </Button>
                                </Link>
                                <Link href={route("admin.customers.index")}>
                                    <Button variant="outline" className="gap-2 border-2 hover:border-blue-300">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Stores")}
                                    </Button>
                                </Link>
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
                                className="max-w-7xl mx-auto space-y-8"
                            >
                                {/* Store Overview Card */}
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.9, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                        <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                                    <User className="h-6 w-6 text-white" />
                                                </div>
                                                {t("Store Information")}
                                                {getStatusBadge(customer.status)}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                        <Store className="w-4 h-4" />
                                                        <span className="text-sm font-medium">{t("Store Name")}</span>
                                                    </div>
                                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{customer.name}</p>
                                                </div>

                                                {customer.email && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                            <Mail className="w-4 h-4" />
                                                            <span className="text-sm font-medium">{t("Email")}</span>
                                                        </div>
                                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{customer.email}</p>
                                                    </div>
                                                )}

                                                {customer.phone && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                            <Phone className="w-4 h-4" />
                                                            <span className="text-sm font-medium">{t("Phone")}</span>
                                                        </div>
                                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{customer.phone}</p>
                                                    </div>
                                                )}

                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                        <Calendar className="w-4 h-4" />
                                                        <span className="text-sm font-medium">{t("Created")}</span>
                                                    </div>
                                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                                        {formatDate(customer.created_at)}
                                                    </p>
                                                </div>
                                            </div>

                                            {customer.address && (
                                                <div className="mt-6 space-y-2">
                                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                        <MapPin className="w-4 h-4" />
                                                        <span className="text-sm font-medium">{t("Address")}</span>
                                                    </div>
                                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{customer.address}</p>
                                                </div>
                                            )}

                                            {customer.notes && (
                                                <div className="mt-6 space-y-2">
                                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                        <AlertCircle className="w-4 h-4" />
                                                        <span className="text-sm font-medium">{t("Notes")}</span>
                                                    </div>
                                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{customer.notes}</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Tabs for different sections */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.0, duration: 0.4 }}
                                >
                                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                                        <TabsList className="grid w-full grid-cols-5 h-14 p-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700">
                                            <TabsTrigger value="overview" className="h-12 text-sm font-semibold">
                                                {t("Overview")}
                                            </TabsTrigger>
                                            <TabsTrigger value="users" className="h-12 text-sm font-semibold">
                                                {t("Users")} ({customer.users?.length || 0})
                                            </TabsTrigger>
                                            <TabsTrigger value="accounts" className="h-12 text-sm font-semibold">
                                                {t("Accounts")}
                                            </TabsTrigger>
                                            <TabsTrigger value="stock" className="h-12 text-sm font-semibold">
                                                {t("Stock")}
                                            </TabsTrigger>
                                            <TabsTrigger value="transactions" className="h-12 text-sm font-semibold">
                                                {t("Transactions")}
                                            </TabsTrigger>
                                        </TabsList>

                                        {/* Overview Tab */}
                                        <TabsContent value="overview" className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30">
                                                    <CardContent className="p-6">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-sm font-medium text-green-600 dark:text-green-400">{t("Total Users")}</p>
                                                                <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                                                                    {customer.users?.length || 0}
                                                                </p>
                                                            </div>
                                                            <div className="p-3 bg-green-500 rounded-xl">
                                                                <Users className="w-6 h-6 text-white" />
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/30">
                                                    <CardContent className="p-6">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{t("Accounts")}</p>
                                                                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                                                                    {accounts?.total || accounts?.data?.length || accounts?.length || 0}
                                                                </p>
                                                            </div>
                                                            <div className="p-3 bg-blue-500 rounded-xl">
                                                                <CreditCard className="w-6 h-6 text-white" />
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/30">
                                                    <CardContent className="p-6">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">{t("Stock Items")}</p>
                                                                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">0</p>
                                                            </div>
                                                            <div className="p-3 bg-purple-500 rounded-xl">
                                                                <Package className="w-6 h-6 text-white" />
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/30">
                                                    <CardContent className="p-6">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">{t("Status")}</p>
                                                                <p className="text-lg font-bold text-orange-700 dark:text-orange-300 capitalize">
                                                                    {customer.status}
                                                                </p>
                                                            </div>
                                                            <div className="p-3 bg-orange-500 rounded-xl">
                                                                <CheckCircle className="w-6 h-6 text-white" />
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2">
                                                            <TrendingUp className="w-5 h-5 text-green-600" />
                                                            {t("Quick Actions")}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-3">
                                                        <Link href={route("admin.customers.edit", customer.id)}>
                                                            <Button className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700">
                                                                <Edit className="w-4 h-4" />
                                                                {t("Edit Store Information")}
                                                            </Button>
                                                        </Link>
                                                        <Link href={route("admin.accounts.index", { customer_id: customer.id })}>
                                                            <Button variant="outline" className="w-full justify-start gap-2">
                                                                <CreditCard className="w-4 h-4" />
                                                                {t("Manage Accounts")}
                                                            </Button>
                                                        </Link>
                                                        <Link href={route("admin.customers.income", customer.id)}>
                                                            <Button variant="outline" className="w-full justify-start gap-2">
                                                                <TrendingUp className="w-4 h-4" />
                                                                {t("View Income History")}
                                                            </Button>
                                                        </Link>
                                                                                                <Link href={route("admin.customers.outcome", customer.id)}>
                                            <Button variant="outline" className="w-full justify-start gap-2">
                                                <TrendingDown className="w-4 h-4" />
                                                {t("View Outcome History")}
                                            </Button>
                                        </Link>
                                        <Link href={route("admin.customers.orders", customer.id)}>
                                            <Button variant="outline" className="w-full justify-start gap-2">
                                                <ShoppingCart className="w-4 h-4" />
                                                {t("View Market Orders")}
                                            </Button>
                                        </Link>
                                        <Link href={route("admin.customer-users.index")}>
                                            <Button variant="outline" className="w-full justify-start gap-2">
                                                <Users className="w-4 h-4" />
                                                {t("View All Customer Users")}
                                            </Button>
                                        </Link>
                                                    </CardContent>
                                                </Card>

                                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2">
                                                            <Calendar className="w-5 h-5 text-purple-600" />
                                                            {t("Recent Activity")}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                                <div>
                                                                    <p className="text-sm font-medium">{t("Store created")}</p>
                                                                    <p className="text-xs text-slate-500">{formatDate(customer.created_at)}</p>
                                                                </div>
                                                            </div>
                                                            {customer.updated_at && customer.updated_at !== customer.created_at && (
                                                                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                                    <div>
                                                                        <p className="text-sm font-medium">{t("Store updated")}</p>
                                                                        <p className="text-xs text-slate-500">{formatDate(customer.updated_at)}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </TabsContent>

                                        {/* Users Tab */}
                                        <TabsContent value="users" className="space-y-6">
                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                                <CardHeader className="flex flex-row items-center justify-between">
                                                    <CardTitle className="flex items-center gap-2">
                                                        <Users className="w-5 h-5 text-blue-600" />
                                                        {t("Store Users")}
                                                        <Badge variant="secondary">{customer.users?.length || 0}</Badge>
                                                    </CardTitle>
                                                    <Link href={route("admin.customer-users.create", { customer_id: customer.id })}>
                                                    <Button className="gap-2">
                                                            <Plus className="w-4 w-4" />
                                                        {t("Add User")}
                                                    </Button>
                                                    </Link>
                                                </CardHeader>
                                                <CardContent>
                                                    {customer.users && customer.users.length > 0 ? (
                                                        <div className="overflow-x-auto">
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow>
                                                                        <TableHead>{t("Name")}</TableHead>
                                                                        <TableHead>{t("Email")}</TableHead>
                                                                        <TableHead>{t("Roles")}</TableHead>
                                                                        <TableHead>{t("Created")}</TableHead>
                                                                        <TableHead className="text-right">{t("Actions")}</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {customer.users.map((user) => (
                                                                        <TableRow key={user.id}>
                                                                            <TableCell className="font-medium">{user.name}</TableCell>
                                                                            <TableCell>{user.email}</TableCell>
                                                                            <TableCell>
                                                                                <div className="flex gap-1">
                                                                                    {user.roles?.map((role) => (
                                                                                        <Badge key={role.id} variant="outline">
                                                                                            {role.name}
                                                                                        </Badge>
                                                                                    ))}
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>{formatDate(user.created_at)}</TableCell>
                                                                            <TableCell className="text-right">
                                                                                <DropdownMenu>
                                                                                    <DropdownMenuTrigger asChild>
                                                                                        <Button variant="ghost" size="sm">
                                                                                            <MoreVertical className="w-4 h-4" />
                                                                                        </Button>
                                                                                    </DropdownMenuTrigger>
                                                                                    <DropdownMenuContent>
                                                                                        <Link href={route('admin.customer-users.show', user.id)}>
                                                                                            <DropdownMenuItem>
                                                                                                <Eye className="w-4 h-4 mr-2" />
                                                                                                {t("View")}
                                                                                            </DropdownMenuItem>
                                                                                        </Link>
                                                                                        <Link href={route('admin.customer-users.edit', user.id)}>
                                                                                        <DropdownMenuItem>
                                                                                            <Edit className="w-4 h-4 mr-2" />
                                                                                            {t("Edit")}
                                                                                        </DropdownMenuItem>
                                                                                        </Link>
                                                                                        <DropdownMenuItem
                                                                                            onClick={() => handleDeleteUser(user.id)}
                                                                                            className="text-red-600"
                                                                                        >
                                                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                                                            {t("Delete")}
                                                                                        </DropdownMenuItem>
                                                                                    </DropdownMenuContent>
                                                                                </DropdownMenu>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-8">
                                                            <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                                            <p className="text-slate-500">{t("No users found for this store")}</p>
                                                            <Link href={route("admin.customer-users.create", { customer_id: customer.id })}>
                                                            <Button className="mt-4 gap-2">
                                                                <Plus className="w-4 h-4" />
                                                                {t("Add First User")}
                                                            </Button>
                                                            </Link>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        {/* Accounts Tab */}
                                        <TabsContent value="accounts" className="space-y-6">
                                            {/* Search and Filter */}
                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                                <CardHeader>
                                                    <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3">
                                                        <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg">
                                                            <Search className="h-5 w-5 text-white" />
                                                        </div>
                                                        {t("Search & Filter Accounts")}
                                                        {(accountsSearch || accountsStatus) && (
                                                            <Badge variant="secondary" className="ml-auto">
                                                                {t("Filtered")}
                                                            </Badge>
                                                        )}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <form onSubmit={handleAccountsSearch} className="flex flex-col lg:flex-row gap-4">
                                                        <div className="relative flex-1">
                                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                                            <Input
                                                                placeholder={t("Search accounts by name, account number, or ID number...")}
                                                                value={accountsSearch}
                                                                onChange={(e) => setAccountsSearch(e.target.value)}
                                                                className="pl-10 h-12 border-2 border-slate-200 hover:border-green-300 focus:border-green-500 transition-colors"
                                                            />
                                                        </div>
                                                        
                                                        <div className="flex gap-2">
                                                            <select
                                                                value={accountsStatus}
                                                                onChange={(e) => handleAccountsStatusFilter(e.target.value)}
                                                                className="w-48 h-12 px-3 border-2 border-slate-200 hover:border-green-300 focus:border-green-500 rounded-md transition-colors"
                                                            >
                                                                <option value="">{t("All Status")}</option>
                                                                <option value="active">{t("Active")}</option>
                                                                <option value="inactive">{t("Inactive")}</option>
                                                                <option value="suspended">{t("Suspended")}</option>
                                                            </select>

                                                            <Button type="submit" className="gap-2 h-12 bg-green-600 hover:bg-green-700">
                                                                <Search className="h-4 w-4" />
                                                                {t("Search")}
                                                            </Button>

                                                            {(accountsSearch || accountsStatus) && (
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    onClick={clearAccountsFilters}
                                                                    className="gap-2 h-12 border-2 hover:border-green-300"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                    {t("Clear")}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </form>
                                                </CardContent>
                                            </Card>

                                            {/* Accounts List */}
                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                                <CardHeader className="flex flex-row items-center justify-between">
                                                    <CardTitle className="flex items-center gap-2">
                                                        <CreditCard className="w-5 h-5 text-green-600" />
                                                        {t("Customer Accounts")}
                                                        <Badge variant="secondary">
                                                            {accounts?.data?.length || accounts?.length || 0}
                                                            {accounts?.total && (
                                                                <span className="ml-1">
                                                                    {t("of")} {accounts.total}
                                                                </span>
                                                            )}
                                                        </Badge>
                                                    </CardTitle>
                                                    <Link href={route("admin.accounts.create", { customer_id: customer.id })}>
                                                        <Button className="gap-2">
                                                            <Plus className="w-4 h-4" />
                                                            {t("Add Account")}
                                                        </Button>
                                                    </Link>
                                                </CardHeader>
                                                <CardContent>
                                                    {accounts && (accounts.data?.length > 0 || accounts.length > 0) ? (
                                                        <div className="overflow-x-auto">
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow>
                                                                        <TableHead>{t("Account Info")}</TableHead>
                                                                        <TableHead>{t("Contact")}</TableHead>
                                                                        <TableHead>{t("Status")}</TableHead>
                                                                        <TableHead>{t("Balance")}</TableHead>
                                                                        <TableHead>{t("Transactions")}</TableHead>
                                                                        <TableHead className="text-right">{t("Actions")}</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {(accounts.data || accounts).map((account) => (
                                                                        <TableRow key={account.id}>
                                                                            <TableCell>
                                                                                <div className="space-y-1">
                                                                                    <div className="font-medium">{account.name}</div>
                                                                                    <div className="text-sm text-slate-500">
                                                                                        <div>Account: {account.account_number}</div>
                                                                                        <div>ID: {account.id_number}</div>
                                                                                    </div>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                                                                    {account.address ? (
                                                                                        <div className="flex items-center gap-1">
                                                                                            <MapPin className="w-3 h-3" />
                                                                                            {account.address}
                                                                                        </div>
                                                                                    ) : (
                                                                                        <span className="text-slate-400">-</span>
                                                                                    )}
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {getStatusBadge(account.status)}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="space-y-1">
                                                                                    <div className={`font-semibold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                                        {formatCurrency(account.balance)}
                                                                                    </div>
                                                                                    <div className="text-xs text-slate-500">
                                                                                        In: {formatCurrency(account.total_income)} | 
                                                                                        Out: {formatCurrency(account.total_outcome)}
                                                                                    </div>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="flex gap-2">
                                                                                    <Badge variant="outline" className="gap-1">
                                                                                        <TrendingUp className="w-3 h-3 text-green-600" />
                                                                                        {account.incomes_count}
                                                                                    </Badge>
                                                                                    <Badge variant="outline" className="gap-1">
                                                                                        <TrendingDown className="w-3 h-3 text-red-600" />
                                                                                        {account.outcomes_count}
                                                                                    </Badge>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell className="text-right">
                                                                                <div className="flex items-center justify-end gap-1">
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
                                                                                        asChild
                                                                                    >
                                                                                        <Link href={route('admin.accounts.show', account.id)}>
                                                                                            <Eye className="h-4 w-4" />
                                                                                            <span className="sr-only">{t("View Details")}</span>
                                                                                        </Link>
                                                                                    </Button>
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400 transition-colors"
                                                                                        asChild
                                                                                    >
                                                                                        <Link href={route('admin.accounts.edit', account.id)}>
                                                                                            <Edit className="h-4 w-4" />
                                                                                            <span className="sr-only">{t("Edit")}</span>
                                                                                        </Link>
                                                                                    </Button>
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                                                                                        onClick={() => handleDeleteAccount(account.id)}
                                                                                    >
                                                                                        <Trash2 className="h-4 w-4" />
                                                                                        <span className="sr-only">{t("Delete")}</span>
                                                                                    </Button>
                                                                                </div>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-8">
                                                            <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                                            <p className="text-slate-500">
                                                                {accountsSearch || accountsStatus ? t("No accounts found") : t("No accounts created yet")}
                                                            </p>
                                                            <p className="text-sm text-slate-400 mb-4">
                                                                {accountsSearch || accountsStatus ? t("Try adjusting your search or filters") : t("Create the first account to get started")}
                                                            </p>
                                                            <Link href={route("admin.accounts.create", { customer_id: customer.id })}>
                                                                <Button className="gap-2">
                                                                    <Plus className="w-4 h-4" />
                                                                    {t("Add Account")}
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>

                                            {/* Pagination */}
                                            {accounts?.links && accounts.links.length > 3 && (
                                                <div className="flex justify-center">
                                                    <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                                        <CardContent className="p-4">
                                                            <div className="flex items-center justify-between gap-4">
                                                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                                                    {t("Showing")} {accounts.from} {t("to")} {accounts.to} {t("of")} {accounts.total} {t("accounts")}
                                                                </div>
                                                                
                                                                <div className="flex items-center gap-2">
                                                                    {accounts.links.map((link, index) => {
                                                                        if (link.url === null) {
                                                                            return (
                                                                                <Button
                                                                                    key={index}
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    disabled
                                                                                    className="w-10 h-10 p-0"
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
                                                                                only={['accounts', 'accounts_filters']}
                                                                            >
                                                                                <Button
                                                                                    variant={link.active ? "default" : "outline"}
                                                                                    size="sm"
                                                                                    className={`w-10 h-10 p-0 ${
                                                                                        link.active 
                                                                                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                                                                                            : 'hover:bg-green-50 hover:border-green-300'
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
                                                </div>
                                            )}
                                        </TabsContent>

                                        {/* Stock Tab */}
                                        <TabsContent value="stock" className="space-y-6">
                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-2">
                                                        <Package className="w-5 h-5 text-purple-600" />
                                                        {t("Stock Management")}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <Link href={route("admin.customers.income", customer.id)}>
                                                            <Card className="border-2 border-green-200 hover:border-green-300 transition-colors cursor-pointer">
                                                                <CardContent className="p-6 text-center">
                                                                    <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                                                                    <h3 className="text-lg font-semibold text-green-700 mb-2">{t("Stock Income")}</h3>
                                                                    <p className="text-slate-600">{t("View all stock received by this store")}</p>
                                                                </CardContent>
                                                            </Card>
                                                        </Link>

                                                        <Link href={route("admin.customers.outcome", customer.id)}>
                                                            <Card className="border-2 border-red-200 hover:border-red-300 transition-colors cursor-pointer">
                                                                <CardContent className="p-6 text-center">
                                                                    <TrendingDown className="w-12 h-12 text-red-600 mx-auto mb-4" />
                                                                    <h3 className="text-lg font-semibold text-red-700 mb-2">{t("Stock Outcome")}</h3>
                                                                    <p className="text-slate-600">{t("View all stock shipped from this store")}</p>
                                                                </CardContent>
                                                            </Card>
                                                        </Link>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        {/* Transactions Tab */}
                                        <TabsContent value="transactions" className="space-y-6">
                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-2">
                                                        <TrendingUp className="w-5 h-5 text-orange-600" />
                                                        {t("Transaction History")}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-center py-8">
                                                        <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                                        <p className="text-slate-500">{t("Transaction history will be displayed here")}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>
                                    </Tabs>
                                </motion.div>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
}
