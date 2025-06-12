import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import {
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Eye,
    TrendingUp,
    DollarSign,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    ArrowLeft,
    Download,
    FileSpreadsheet,
    AlertCircle,
    X
} from 'lucide-react';

export default function Income({ account, incomes, filters, auth }) {
    const { t } = useLaravelReactI18n();
    const [search, setSearch] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [dateRange, setDateRange] = useState({ from: filters.date_from || '', to: filters.date_to || '' });
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [isAnimated, setIsAnimated] = useState(false);

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimated(true);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    const handleSearch = () => {
        setLoading(true);
        router.get(route('admin.accounts.incomes', account.id), {
            search,
            status: selectedStatus,
            date_from: dateRange.from,
            date_to: dateRange.to,
        }, {
            preserveState: true,
            replace: true,
            onFinish: () => setLoading(false)
        });
    };

    const handleReset = () => {
        setSearch('');
        setSelectedStatus('');
        setDateRange({ from: '', to: '' });
        setLoading(true);
        router.get(route('admin.accounts.incomes', account.id), {}, {
            preserveState: true,
            replace: true,
            onFinish: () => setLoading(false)
        });
    };

    const handleDelete = (id) => {
        if (confirm(t('Are you sure you want to delete this income record? This action cannot be undone.'))) {
            setLoading(true);
            router.delete(route('admin.incomes.destroy', id), {
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
            day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
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

    // Auto-search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters.search) {
                handleSearch();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [search]);

    const totalApprovedIncomes = incomes.data?.filter(income => income.status === 'approved').length || 0;
    const totalPendingIncomes = incomes.data?.filter(income => income.status === 'pending').length || 0;
    const totalIncomeAmount = incomes.data?.reduce((sum, income) => sum + (income.status === 'approved' ? parseFloat(income.amount) : 0), 0) || 0;

    return (
        <>
            <Head title={t(":name - Income Management", { name: account.name })}>
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
                                        {t("Income Management")}
                                    </h1>
                                    <Badge variant="outline" className="text-sm">
                                        {account.name}
                                    </Badge>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {t("Manage income transactions for account #:number", { number: account.account_number })}
                                </p>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Button className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    {t("Add Income")}
                                </Button>

                                <Button variant="outline" className="gap-2">
                                    <Download className="w-4 h-4" />
                                    {t("Export")}
                                </Button>

                                <Link href={route('admin.accounts.show', account.id)}>
                                    <Button variant="outline" className="gap-2">
                                        <ArrowLeft className="w-4 h-4" />
                                        {t("Back to Account")}
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
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="max-w-7xl mx-auto space-y-8"
                            >
                                {/* Statistics Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-green-600">{t("Total Approved")}</p>
                                                    <p className="text-3xl font-bold text-green-700">{totalApprovedIncomes}</p>
                                                </div>
                                                <div className="p-3 bg-green-100 rounded-full">
                                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-orange-600">{t("Pending Review")}</p>
                                                    <p className="text-3xl font-bold text-orange-700">{totalPendingIncomes}</p>
                                                </div>
                                                <div className="p-3 bg-orange-100 rounded-full">
                                                    <Clock className="w-6 h-6 text-orange-600" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-blue-600">{t("Total Amount")}</p>
                                                    <p className="text-3xl font-bold text-blue-700">
                                                        {formatCurrency(totalIncomeAmount)}
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
                                                    <p className="text-sm font-medium text-purple-600">{t("Total Records")}</p>
                                                    <p className="text-3xl font-bold text-purple-700">{incomes.total || 0}</p>
                                                </div>
                                                <div className="p-3 bg-purple-100 rounded-full">
                                                    <TrendingUp className="w-6 h-6 text-purple-600" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Search and Filters */}
                                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="flex items-center gap-2">
                                                <Search className="w-5 h-5" />
                                                {t("Search & Filter")}
                                            </CardTitle>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setShowFilters(!showFilters)}
                                                className="gap-2"
                                            >
                                                <Filter className="w-4 h-4" />
                                                {showFilters ? t('Hide Filters') : t('Show Filters')}
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <Input
                                                    placeholder={t("Search by description, amount, or source number...")}
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                    className="w-full"
                                                />
                                            </div>
                                            <Button
                                                onClick={handleSearch}
                                                disabled={loading}
                                                className="gap-2"
                                            >
                                                <Search className="w-4 h-4" />
                                                {t("Search")}
                                            </Button>
                                        </div>

                                        {showFilters && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t"
                                            >
                                                <div>
                                                    <label className="text-sm font-medium mb-2 block">{t("Status")}</label>
                                                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t("All Statuses")} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="">{t("All Statuses")}</SelectItem>
                                                            <SelectItem value="approved">{t("Approved")}</SelectItem>
                                                            <SelectItem value="pending">{t("Pending")}</SelectItem>
                                                            <SelectItem value="rejected">{t("Rejected")}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium mb-2 block">{t("From Date")}</label>
                                                    <Input
                                                        type="date"
                                                        value={dateRange.from}
                                                        onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium mb-2 block">{t("To Date")}</label>
                                                    <Input
                                                        type="date"
                                                        value={dateRange.to}
                                                        onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                                                    />
                                                </div>

                                                <div className="flex items-end">
                                                    <Button
                                                        variant="outline"
                                                        onClick={handleReset}
                                                        className="w-full gap-2"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        {t("Reset")}
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Incomes Table */}
                                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5" />
                                            {t("Income Records")}
                                            <Badge variant="secondary">{incomes.total || 0}</Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {incomes.data && incomes.data.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>{t("Source Number")}</TableHead>
                                                            <TableHead>{t("Description")}</TableHead>
                                                            <TableHead>{t("Amount")}</TableHead>
                                                            <TableHead>{t("Date")}</TableHead>
                                                            <TableHead>{t("Status")}</TableHead>
                                                            <TableHead>{t("Actions")}</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {incomes.data.map((income) => (
                                                            <TableRow key={income.id}>
                                                                <TableCell className="font-medium">
                                                                    {income.source_number}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div>
                                                                        <p className="font-medium">{income.description}</p>
                                                                        {income.notes && (
                                                                            <p className="text-sm text-gray-500">{income.notes}</p>
                                                                        )}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="font-medium text-green-600">
                                                                    {formatCurrency(income.amount)}
                                                                </TableCell>
                                                                <TableCell>{formatDate(income.date)}</TableCell>
                                                                <TableCell>
                                                                    {getStatusBadge(income.status)}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center gap-2">
                                                                        <Button variant="outline" size="sm" className="gap-1">
                                                                            <Eye className="w-3 h-3" />
                                                                            {t("View")}
                                                                        </Button>
                                                                        <Button variant="outline" size="sm" className="gap-1">
                                                                            <Edit className="w-3 h-3" />
                                                                            {t("Edit")}
                                                                        </Button>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => handleDelete(income.id)}
                                                                            className="gap-1 text-red-600 hover:bg-red-50"
                                                                        >
                                                                            <Trash2 className="w-3 h-3" />
                                                                            {t("Delete")}
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>

                                                {/* Pagination */}
                                                {incomes.last_page > 1 && (
                                                    <div className="flex justify-between items-center mt-6">
                                                        <div className="text-sm text-gray-500">
                                                            {t("Showing :from to :to of :total results", {
                                                                from: incomes.from,
                                                                to: incomes.to,
                                                                total: incomes.total
                                                            })}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            {incomes.links.map((link, index) => (
                                                                <Link
                                                                    key={index}
                                                                    href={link.url}
                                                                    className={`px-3 py-1 rounded ${
                                                                        link.active
                                                                            ? 'bg-blue-500 text-white'
                                                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                    {t("No income records found")}
                                                </h3>
                                                <p className="text-gray-500 mb-4">
                                                    {t("Start by adding your first income transaction for this account.")}
                                                </p>
                                                <Button className="gap-2">
                                                    <Plus className="w-4 h-4" />
                                                    {t("Add First Income")}
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
}
