import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Badge } from '@/Components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import {
    ArrowLeft,
    Edit,
    Trash2,
    TrendingUp,
    TrendingDown,
    DollarSign,
    CreditCard,
    Building2,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    Plus,
    Eye,
    BarChart3,
    PieChart,
    Activity,
    AlertCircle,
    FileText,
    Sparkles,
    Hash
} from 'lucide-react';

export default function Show({ account, auth }) {
    const { t } = useLaravelReactI18n();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const handleDelete = () => {
        if (confirm(t('Are you sure you want to delete this account? This action cannot be undone.'))) {
            setLoading(true);
            router.delete(route('admin.accounts.destroy', account.id), {
                onFinish: () => setLoading(false)
            });
        }
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

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', label: t('Pending') },
            active: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', label: t('Active') },
            suspended: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', label: t('Suspended') },
            closed: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300', label: t('Closed') },
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <Badge className={`${config.color} border-0`}>
                {config.label}
            </Badge>
        );
    };

    const getTransactionStatusBadge = (status) => {
        const statusConfig = {
            approved: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', label: t('Approved'), icon: CheckCircle },
            pending: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', label: t('Pending'), icon: Clock },
            rejected: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', label: t('Rejected'), icon: XCircle },
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <Badge className={`${config.color} border-0 gap-1`}>
                <Icon className="w-3 h-3" />
                {config.label}
            </Badge>
        );
    };

    return (
        <>
            <Head title={t(":name - Account Details", { name: account.name })}>
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
                                    linear-gradient(45deg, #3b82f6, #1d4ed8) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #3b82f6, #1d4ed8) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={CreditCard} color="blue" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.accounts" />

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
                                        <CreditCard className="w-8 h-8 text-white" />
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
                                        {t("Account Details")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent"
                                    >
                                        {account.name}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Hash className="w-4 h-4" />
                                        {t("Account #:number • ID: :id", { number: account.account_number, id: account.id_number })}
                                    </motion.p>
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.7, duration: 0.4 }}
                                        className="flex items-center gap-2 mt-1"
                                    >
                                        <Building2 className="w-4 h-4 text-slate-500" />
                                        <span className="text-sm text-slate-500">{account.customer.name}</span>
                                        {getStatusBadge(account.status)}
                                    </motion.div>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-5"
                            >
                                <Link href={route('admin.accounts.edit', account.id)}>
                                    <Button className="relative group bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 hover:from-blue-600 hover:via-indigo-600 hover:to-blue-700 text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110 hover:-translate-y-1 w-14 h-14 p-0 rounded-xl border border-white/20 backdrop-blur-sm before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300">
                                        <Edit className="h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-blue-400/20 blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                                    </Button>
                                </Link>

                                <Button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="relative group bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 hover:from-blue-600 hover:via-indigo-600 hover:to-blue-700 text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110 hover:-translate-y-1 w-14 h-14 p-0 rounded-xl border border-white/20 backdrop-blur-sm before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
                                >
                                    <Trash2 className="h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-blue-400/20 blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                                </Button>

                                <Link href={route('admin.accounts.index')}>
                                    <Button className="relative group bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 hover:from-indigo-600 hover:via-purple-600 hover:to-violet-600 text-white shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-110 hover:-translate-y-1 w-14 h-14 p-0 rounded-xl border border-white/20 backdrop-blur-sm before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300">
                                        <ArrowLeft className="h-5 w-5 relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-400/20 to-violet-400/20 blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
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
                                {/* Financial Overview Cards */}
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.9, duration: 0.4 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                                >
                                    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-green-600 dark:text-green-400">{t("Total Income")}</p>
                                                    <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                                                        {formatCurrency(account.total_income)}
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-green-500 rounded-xl">
                                                    <TrendingUp className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-pink-100 dark:from-red-900/20 dark:to-pink-900/30">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-red-600 dark:text-red-400">{t("Total Outcome")}</p>
                                                    <p className="text-3xl font-bold text-red-700 dark:text-red-300">
                                                        {formatCurrency(account.total_outcome)}
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-red-500 rounded-xl">
                                                    <TrendingDown className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/30">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{t("Net Balance")}</p>
                                                    <p className={`text-3xl font-bold ${account.net_balance >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-red-700 dark:text-red-300'}`}>
                                                        {formatCurrency(account.net_balance)}
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-blue-500 rounded-xl">
                                                    <DollarSign className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/30">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">{t("Pending Amount")}</p>
                                                    <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                                                        {formatCurrency((account.pending_income || 0) + (account.pending_outcome || 0))}
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-orange-500 rounded-xl">
                                                    <Clock className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Account Information Card */}
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 1.0, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                        <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                                    <CreditCard className="h-6 w-6 text-white" />
                                                </div>
                                                {t("Account Information")}
                                                {getStatusBadge(account.status)}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                        <User className="w-4 h-4" />
                                                        <span className="text-sm font-medium">{t("Account Name")}</span>
                                                    </div>
                                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{account.name}</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                        <Hash className="w-4 h-4" />
                                                        <span className="text-sm font-medium">{t("Account Number")}</span>
                                                    </div>
                                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{account.account_number}</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                        <CreditCard className="w-4 h-4" />
                                                        <span className="text-sm font-medium">{t("ID Number")}</span>
                                                    </div>
                                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{account.id_number}</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                        <Building2 className="w-4 h-4" />
                                                        <span className="text-sm font-medium">{t("Customer")}</span>
                                                    </div>
                                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{account.customer.name}</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span className="text-sm font-medium">{t("Status")}</span>
                                                    </div>
                                                    <div className="mt-1">
                                                        {getStatusBadge(account.status)}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                        <Calendar className="w-4 h-4" />
                                                        <span className="text-sm font-medium">{t("Created")}</span>
                                                    </div>
                                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{formatDate(account.created_at)}</p>
                                                </div>

                                                {account.address && (
                                                    <div className="md:col-span-2 lg:col-span-3 space-y-2">
                                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                            <MapPin className="w-4 h-4" />
                                                            <span className="text-sm font-medium">{t("Address")}</span>
                                                        </div>
                                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{account.address}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Tabs for Transactions */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.1, duration: 0.4 }}
                                >
                                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                                        <TabsList className="grid w-full grid-cols-3 h-14 p-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700">
                                            <TabsTrigger value="overview" className="h-12 text-sm font-semibold">
                                                {t("Overview")}
                                            </TabsTrigger>
                                            <TabsTrigger value="incomes" className="h-12 text-sm font-semibold">
                                                {t("Incomes")} ({account.recent_incomes?.length || 0})
                                            </TabsTrigger>
                                            <TabsTrigger value="outcomes" className="h-12 text-sm font-semibold">
                                                {t("Outcomes")} ({account.recent_outcomes?.length || 0})
                                            </TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="overview" className="space-y-6">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* Recent Incomes */}
                                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                                    <CardHeader className="flex flex-row items-center justify-between">
                                                        <CardTitle className="flex items-center gap-2">
                                                            <TrendingUp className="w-5 h-5 text-green-600" />
                                                            {t("Recent Incomes")}
                                                        </CardTitle>
                                                        <Link href={route('admin.accounts.incomes', account.id)}>
                                                            <Button variant="outline" size="sm" className="gap-1 hover:bg-green-50 hover:border-green-300">
                                                                <Eye className="w-4 h-4" />
                                                                {t("View All")}
                                                            </Button>
                                                        </Link>
                                                    </CardHeader>
                                                    <CardContent>
                                                        {account.recent_incomes && account.recent_incomes.length > 0 ? (
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow>
                                                                        <TableHead>{t("Description")}</TableHead>
                                                                        <TableHead>{t("Amount")}</TableHead>
                                                                        <TableHead>{t("Status")}</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {account.recent_incomes.map((income) => (
                                                                        <TableRow key={income.id}>
                                                                            <TableCell>
                                                                                <div>
                                                                                    <p className="font-medium">{income.description}</p>
                                                                                    <p className="text-sm text-gray-500">{formatDate(income.date)}</p>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell className="font-medium text-green-600">
                                                                                {formatCurrency(income.amount)}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {getTransactionStatusBadge(income.status)}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        ) : (
                                                            <div className="text-center py-6">
                                                                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                                                <p className="text-gray-500">{t("No income transactions yet")}</p>
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>

                                                {/* Recent Outcomes */}
                                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                                    <CardHeader className="flex flex-row items-center justify-between">
                                                        <CardTitle className="flex items-center gap-2">
                                                            <TrendingDown className="w-5 h-5 text-red-600" />
                                                            {t("Recent Outcomes")}
                                                        </CardTitle>
                                                        <Link href={route('admin.accounts.outcomes', account.id)}>
                                                            <Button variant="outline" size="sm" className="gap-1 hover:bg-red-50 hover:border-red-300">
                                                                <Eye className="w-4 h-4" />
                                                                {t("View All")}
                                                            </Button>
                                                        </Link>
                                                    </CardHeader>
                                                    <CardContent>
                                                        {account.recent_outcomes && account.recent_outcomes.length > 0 ? (
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow>
                                                                        <TableHead>{t("Description")}</TableHead>
                                                                        <TableHead>{t("Amount")}</TableHead>
                                                                        <TableHead>{t("Status")}</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {account.recent_outcomes.map((outcome) => (
                                                                        <TableRow key={outcome.id}>
                                                                            <TableCell>
                                                                                <div>
                                                                                    <p className="font-medium">{outcome.description}</p>
                                                                                    <p className="text-sm text-gray-500">{formatDate(outcome.date)}</p>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell className="font-medium text-red-600">
                                                                                {formatCurrency(outcome.amount)}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {getTransactionStatusBadge(outcome.status)}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        ) : (
                                                            <div className="text-center py-6">
                                                                <TrendingDown className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                                                <p className="text-gray-500">{t("No outcome transactions yet")}</p>
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            {/* Quick Actions */}
                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-2">
                                                        <Activity className="w-5 h-5 text-purple-600" />
                                                        {t("Quick Actions")}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                    <Link href={route('admin.accounts.edit', account.id)}>
                                                        <Button className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700">
                                                            <Edit className="w-4 h-4" />
                                                            {t("Edit Account")}
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('admin.accounts.incomes', account.id)}>
                                                        <Button variant="outline" className="w-full justify-start gap-2 hover:bg-green-50 hover:border-green-300">
                                                            <TrendingUp className="w-4 h-4" />
                                                            {t("Manage Incomes")}
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('admin.accounts.outcomes', account.id)}>
                                                        <Button variant="outline" className="w-full justify-start gap-2 hover:bg-red-50 hover:border-red-300">
                                                            <TrendingDown className="w-4 h-4" />
                                                            {t("Manage Outcomes")}
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('admin.customers.show', account.customer.id)}>
                                                        <Button variant="outline" className="w-full justify-start gap-2 hover:bg-purple-50 hover:border-purple-300">
                                                            <Building2 className="w-4 h-4" />
                                                            {t("View Customer")}
                                                        </Button>
                                                    </Link>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        <TabsContent value="incomes">
                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                                <CardHeader className="flex flex-row items-center justify-between">
                                                    <CardTitle className="flex items-center gap-2">
                                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                                        {t("Income Management")}
                                                    </CardTitle>
                                                    <div className="flex gap-2">
                                                        <Button className="gap-2 bg-green-600 hover:bg-green-700">
                                                            <Plus className="w-4 h-4" />
                                                            {t("Add Income")}
                                                        </Button>
                                                        <Link href={route('admin.accounts.incomes', account.id)}>
                                                            <Button variant="outline" className="gap-2 hover:bg-green-50 hover:border-green-300">
                                                                <Eye className="w-4 h-4" />
                                                                {t("Manage All Incomes")}
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-center py-8">
                                                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                        <p className="text-gray-500 mb-4">{t("Detailed income management and history")}</p>
                                                        <Link href={route('admin.accounts.incomes', account.id)}>
                                                            <Button className="bg-green-600 hover:bg-green-700">
                                                                {t("View Income Details")}
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        <TabsContent value="outcomes">
                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                                <CardHeader className="flex flex-row items-center justify-between">
                                                    <CardTitle className="flex items-center gap-2">
                                                        <TrendingDown className="w-5 h-5 text-red-600" />
                                                        {t("Outcome Management")}
                                                    </CardTitle>
                                                    <div className="flex gap-2">
                                                        <Button className="gap-2 bg-red-600 hover:bg-red-700">
                                                            <Plus className="w-4 h-4" />
                                                            {t("Add Outcome")}
                                                        </Button>
                                                        <Link href={route('admin.accounts.outcomes', account.id)}>
                                                            <Button variant="outline" className="gap-2 hover:bg-red-50 hover:border-red-300">
                                                                <Eye className="w-4 h-4" />
                                                                {t("Manage All Outcomes")}
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-center py-8">
                                                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                        <p className="text-gray-500 mb-4">{t("Detailed outcome management and history")}</p>
                                                        <Link href={route('admin.accounts.outcomes', account.id)}>
                                                            <Button className="bg-red-600 hover:bg-red-700">
                                                                {t("View Outcome Details")}
                                                            </Button>
                                                        </Link>
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