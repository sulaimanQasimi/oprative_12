import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    TrendingDown,
    ArrowLeft,
    Package,
    Calendar,
    Hash,
    FileText,
    Sparkles,
    Building2,
    User,
    AlertTriangle,
    Search,
    Filter,
    Download,
    RefreshCw,
    BarChart3,
    ChevronDown,
    X,
    DollarSign
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

export default function Outcome({ auth, customer, outcomes, permissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");
    const [showFilters, setShowFilters] = useState(false);
    const [filteredOutcomes, setFilteredOutcomes] = useState(outcomes || []);

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
        let filtered = [...outcomes];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(outcome =>
                outcome.reference_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                outcome.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                outcome.product.barcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                outcome.reason?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Date filter
        if (dateFilter) {
            const filterDate = new Date(dateFilter);
            filtered = filtered.filter(outcome => {
                const outcomeDate = new Date(outcome.created_at);
                return outcomeDate.toDateString() === filterDate.toDateString();
            });
        }

        // Sorting
        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'product.name') {
                aValue = a.product.name;
                bValue = b.product.name;
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

        setFilteredOutcomes(filtered);
    }, [searchTerm, dateFilter, sortBy, sortOrder, outcomes]);

    // Calculate totals
    const totalOutcomes = filteredOutcomes.length;
    const totalQuantity = filteredOutcomes.reduce((sum, outcome) => sum + (outcome.quantity || 0), 0);
    const totalValue = filteredOutcomes.reduce((sum, outcome) => sum + (outcome.total || 0), 0);
    const avgOutcomeValue = totalOutcomes > 0 ? totalValue / totalOutcomes : 0;

    const getStatusBadge = (status) => {
        const statusConfig = {
            completed: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', label: t('Completed') },
            pending: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', label: t('Pending') },
            cancelled: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', label: t('Cancelled') },
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <Badge className={`${config.color} border-0`}>
                {config.label}
            </Badge>
        );
    };

    const getReasonBadge = (reason) => {
        const reasonConfig = {
            return: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', label: t('Return') },
            damage: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', label: t('Damage') },
            expired: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300', label: t('Expired') },
            other: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300', label: t('Other') },
        };

        const config = reasonConfig[reason] || reasonConfig.other;
        return (
            <Badge className={`${config.color} border-0`}>
                {config.label}
            </Badge>
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fa-IR', {
            style: 'currency',
            currency: 'IRR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const clearFilters = () => {
        setSearchTerm("");
        setDateFilter("");
        setSortBy("created_at");
        setSortOrder("desc");
    };

    return (
        <>
            <Head title={`${t("Customer Outcome")} - ${customer.name}`}>
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
                        0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.3); }
                        50% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.6); }
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
                                    linear-gradient(45deg, #ef4444, #dc2626) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #ef4444, #dc2626) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={TrendingDown} color="red" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
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
                                    <div className="absolute -inset-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-red-500 via-orange-500 to-red-600 p-4 rounded-2xl shadow-2xl">
                                        <TrendingDown className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {customer.name} - {t("Outcome Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-red-700 bg-clip-text text-transparent"
                                    >
                                        {t("Outcome Records")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        {t("Track and manage customer outcome records")}
                                    </motion.p>
                                </div>
                            </div>
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Button variant="outline" className="gap-2 hover:scale-105 transition-all duration-200 border-red-200 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20">
                                    <Download className="h-4 w-4" />
                                    {t("Export")}
                                </Button>
                                <Link href={route('admin.customers.show', customer.id)}>
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-all duration-200">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Customer")}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-red-300 dark:scrollbar-thumb-red-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="space-y-8"
                            >
                                {/* Customer Info Card */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                        <CardHeader className="bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg">
                                                    <Building2 className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Customer Information")}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{t("Name")}</p>
                                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{customer.name}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{t("Email")}</p>
                                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{customer.email || t("Not provided")}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{t("Status")}</p>
                                                    {getStatusBadge(customer.status)}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Enhanced Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                                                            {t("Total Outcome")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-red-600">
                                                            {totalOutcomes}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {t("Records")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-2xl">
                                                        <TrendingDown className="h-8 w-8 text-red-600" />
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
                                                            {t("Total Quantity")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-blue-600">
                                                            {totalQuantity.toLocaleString()}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {t("Units")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl">
                                                        <Package className="h-8 w-8 text-blue-600" />
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
                                                            {t("Total Value")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-purple-600">
                                                            {formatCurrency(totalValue)}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {t("Outcome value")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl">
                                                        <DollarSign className="h-8 w-8 text-purple-600" />
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
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border hover:scale-105 transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Average Outcome")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-orange-600">
                                                            {formatCurrency(avgOutcomeValue)}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {t("Per record")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-2xl">
                                                        <BarChart3 className="h-8 w-8 text-orange-600" />
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
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg">
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
                                                        placeholder={t("Search by reference, product name, barcode, or reason...")}
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="pl-12 h-12 text-lg border-2 border-red-200 focus:border-red-500 rounded-xl"
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
                                                                    {t("Date Filter")}
                                                                </label>
                                                                <Input
                                                                    type="date"
                                                                    value={dateFilter}
                                                                    onChange={(e) => setDateFilter(e.target.value)}
                                                                    className="h-10"
                                                                />
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
                                                                        <SelectItem value="reference_number">{t("Reference")}</SelectItem>
                                                                        <SelectItem value="product.name">{t("Product Name")}</SelectItem>
                                                                        <SelectItem value="quantity">{t("Quantity")}</SelectItem>
                                                                        <SelectItem value="total">{t("Total Value")}</SelectItem>
                                                                        <SelectItem value="reason">{t("Reason")}</SelectItem>
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

                                {/* Outcome Records Table */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.4, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg">
                                                    <BarChart3 className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Outcome Records")}
                                                <Badge variant="secondary" className="ml-auto">
                                                    {filteredOutcomes.length} {t("of")} {outcomes.length}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            {filteredOutcomes.length > 0 ? (
                                                <div className="overflow-x-auto">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                    {t("Reference")}
                                                                </TableHead>
                                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                    {t("Product")}
                                                                </TableHead>
                                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                    {t("Quantity")}
                                                                </TableHead>
                                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                    {t("Total Value")}
                                                                </TableHead>
                                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                    {t("Reason")}
                                                                </TableHead>
                                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                    {t("Status")}
                                                                </TableHead>
                                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                    {t("Date")}
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {filteredOutcomes.map((outcome, index) => (
                                                                <TableRow
                                                                    key={outcome.id}
                                                                    className="hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                                                >
                                                                    <TableCell>
                                                                        <span className="font-mono text-sm bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg">
                                                                            {outcome.reference_number || '-'}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="p-2 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-lg">
                                                                                <Package className="h-4 w-4 text-red-600" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-semibold text-slate-800 dark:text-white">{outcome.product.name}</p>
                                                                                <p className="text-sm text-slate-500 flex items-center gap-1">
                                                                                    {outcome.product.barcode && (
                                                                                        <Badge variant="outline" className="text-xs">
                                                                                            {outcome.product.barcode}
                                                                                        </Badge>
                                                                                    )}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                                                            {outcome.quantity?.toLocaleString() || 0}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="font-bold text-red-600">
                                                                        {formatCurrency(outcome.total)}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {getReasonBadge(outcome.reason)}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {getStatusBadge(outcome.status)}
                                                                    </TableCell>
                                                                    <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                                                                        <div className="flex items-center gap-2">
                                                                            <Calendar className="h-4 w-4" />
                                                                            {formatDate(outcome.created_at)}
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
                                                            <TrendingDown className="h-8 w-8 text-slate-400" />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                                                {t("No outcome records found")}
                                                            </p>
                                                            <p className="text-sm text-slate-500">
                                                                {searchTerm || dateFilter ? t("Try adjusting your filters") : t("This customer doesn't have any outcome records yet.")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
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