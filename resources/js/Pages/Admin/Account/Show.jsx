import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
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
    FileText
} from 'lucide-react';

export default function Show({ account, auth }) {
    const { t } = useLaravelReactI18n();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);
    const [isAnimated, setIsAnimated] = useState(false);

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimated(true);
        }, 300);
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
            active: { label: t('Active'), variant: 'success', icon: CheckCircle },
            inactive: { label: t('Inactive'), variant: 'secondary', icon: XCircle },
            suspended: { label: t('Suspended'), variant: 'destructive', icon: AlertCircle },
            pending: { label: t('Pending'), variant: 'warning', icon: Clock },
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className="gap-1">
                <Icon className="w-3 h-3" />
                {config.label}
            </Badge>
        );
    };

    const getTransactionStatusBadge = (status) => {
        const statusConfig = {
            approved: { label: t('Approved'), variant: 'success', icon: CheckCircle },
            pending: { label: t('Pending'), variant: 'warning', icon: Clock },
            rejected: { label: t('Rejected'), variant: 'destructive', icon: XCircle },
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className="gap-1">
                <Icon className="w-3 h-3" />
                {config.label}
            </Badge>
        );
    };

    return (
        <>
            <Head title={t(":name - Account Details", { name: account.name })}>
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
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <div className="flex items-center space-x-4">
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {account.name}
                                    </h1>
                                    {getStatusBadge(account.status)}
                                </div>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {t("Account #:number • ID: :id", { number: account.account_number, id: account.id_number })}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Building2 className="w-4 h-4" />
                                    <span>{account.customer.name}</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Link href={route('admin.accounts.edit', account.id)}>
                                    <Button className="gap-2">
                                        <Edit className="w-4 h-4" />
                                        {t("Edit Account")}
                                    </Button>
                                </Link>

                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    {t("Delete")}
                                </Button>

                                <Link href={route('admin.accounts.index')}>
                                    <Button variant="outline" className="gap-2">
                                        <ArrowLeft className="w-4 h-4" />
                                        {t("Back to Accounts")}
                                    </Button>
                                </Link>
                            </div>
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-green-600">{t("Total Income")}</p>
                                                    <p className="text-3xl font-bold text-green-700">
                                                        {formatCurrency(account.total_income)}
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-green-100 rounded-full">
                                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-red-600">{t("Total Outcome")}</p>
                                                    <p className="text-3xl font-bold text-red-700">
                                                        {formatCurrency(account.total_outcome)}
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-red-100 rounded-full">
                                                    <TrendingDown className="w-6 h-6 text-red-600" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-blue-600">{t("Net Balance")}</p>
                                                    <p className={`text-3xl font-bold ${account.net_balance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                        {formatCurrency(account.net_balance)}
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-blue-100 rounded-full">
                                                    <DollarSign className="w-6 h-6 text-blue-600" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-orange-600">{t("Pending Amount")}</p>
                                                    <p className="text-3xl font-bold text-orange-700">
                                                        {formatCurrency(account.pending_income + account.pending_outcome)}
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-orange-100 rounded-full">
                                                    <Clock className="w-6 h-6 text-orange-600" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Account Information Card */}
                                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CreditCard className="w-5 h-5" />
                                            {t("Account Information")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">{t("Account Name")}</label>
                                                <p className="text-lg font-semibold dark:text-white">{account.name}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">{t("Account Number")}</label>
                                                <p className="text-lg font-semibold dark:text-white">{account.account_number}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">{t("ID Number")}</label>
                                                <p className="text-lg font-semibold dark:text-white">{account.id_number}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">{t("Customer")}</label>
                                                <p className="text-lg font-semibold dark:text-white">{account.customer.name}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">{t("Status")}</label>
                                                <div className="mt-1">
                                                    {getStatusBadge(account.status)}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">{t("Created")}</label>
                                                <p className="text-lg font-semibold dark:text-white">{formatDate(account.created_at)}</p>
                                            </div>
                                            {account.address && (
                                                <div className="md:col-span-2 lg:col-span-3">
                                                    <label className="text-sm font-medium text-gray-500">{t("Address")}</label>
                                                    <p className="text-lg font-semibold dark:text-white">{account.address}</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Tabs for Transactions */}
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                                    <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
                                        <TabsTrigger value="overview">{t("Overview")}</TabsTrigger>
                                        <TabsTrigger value="incomes">
                                            {t("Incomes")} ({account.recent_incomes?.length || 0})
                                        </TabsTrigger>
                                        <TabsTrigger value="outcomes">
                                            {t("Outcomes")} ({account.recent_outcomes?.length || 0})
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="overview" className="space-y-6">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Recent Incomes */}
                                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
                                                <CardHeader className="flex flex-row items-center justify-between">
                                                    <CardTitle className="flex items-center gap-2">
                                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                                        {t("Recent Incomes")}
                                                    </CardTitle>
                                                    <Link href={route('admin.accounts.incomes', account.id)}>
                                                        <Button variant="outline" size="sm" className="gap-1">
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
                                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
                                                <CardHeader className="flex flex-row items-center justify-between">
                                                    <CardTitle className="flex items-center gap-2">
                                                        <TrendingDown className="w-5 h-5 text-red-600" />
                                                        {t("Recent Outcomes")}
                                                    </CardTitle>
                                                    <Link href={route('admin.accounts.outcomes', account.id)}>
                                                        <Button variant="outline" size="sm" className="gap-1">
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
                                    </TabsContent>

                                    <TabsContent value="incomes">
                                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
                                            <CardHeader className="flex flex-row items-center justify-between">
                                                <CardTitle className="flex items-center gap-2">
                                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                                    {t("Income Management")}
                                                </CardTitle>
                                                <div className="flex gap-2">
                                                    <Button className="gap-2">
                                                        <Plus className="w-4 h-4" />
                                                        {t("Add Income")}
                                                    </Button>
                                                    <Link href={route('admin.accounts.incomes', account.id)}>
                                                        <Button variant="outline" className="gap-2">
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
                                                        <Button>
                                                            {t("View Income Details")}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="outcomes">
                                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
                                            <CardHeader className="flex flex-row items-center justify-between">
                                                <CardTitle className="flex items-center gap-2">
                                                    <TrendingDown className="w-5 h-5 text-red-600" />
                                                    {t("Outcome Management")}
                                                </CardTitle>
                                                <div className="flex gap-2">
                                                    <Button className="gap-2">
                                                        <Plus className="w-4 h-4" />
                                                        {t("Add Outcome")}
                                                    </Button>
                                                    <Link href={route('admin.accounts.outcomes', account.id)}>
                                                        <Button variant="outline" className="gap-2">
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
                                                        <Button>
                                                            {t("View Outcome Details")}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
}