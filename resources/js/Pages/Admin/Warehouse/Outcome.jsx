import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Building2,
    ArrowLeft,
    TrendingDown,
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    Package,
    Calendar,
    FileText,
    DollarSign,
    Hash,
    CheckCircle,
    AlertCircle,
    ShoppingCart,
    User,
    Filter,
    Download,
    RefreshCw,
    BarChart3,
    Sparkles,
    ChevronDown,
    X,
    Info
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
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
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Outcome({ auth, warehouse, outcomes }) {
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
                outcome.model_type?.toLowerCase().includes(searchTerm.toLowerCase())
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
    const totalExports = filteredOutcomes.length;
    const totalQuantity = filteredOutcomes.reduce((sum, outcome) => {
        // For wholesale items, show the actual wholesale quantity (not the converted retail units)
        if (outcome.is_wholesale && outcome.unit_amount) {
            return sum + (outcome.quantity / outcome.unit_amount);
        }
        return sum + (outcome.quantity || 0);
    }, 0);
    const totalValue = filteredOutcomes.reduce((sum, outcome) => sum + (outcome.total || 0), 0);
    const avgExportValue = totalExports > 0 ? totalValue / totalExports : 0;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AFN',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    // Persian date conversion function
    const toPersianDate = (gregorianDate) => {
        const date = new Date(gregorianDate);
        const gy = date.getFullYear();
        const gm = date.getMonth() + 1;
        const gd = date.getDate();
        
        // Check for leap year
        const isLeap = (gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0);
        
        // Days in each Gregorian month
        const gdm = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        
        // Calculate number of days passed since start of Gregorian year
        let days = gd;
        for (let i = 0; i < gm - 1; i++) {
            days += gdm[i];
        }
        
        // Calculate the Persian year and day offset from March 21
        const marchDay = isLeap ? 80 : 79;
        let jy, jm, jd;
        
        if (days > marchDay) {
            jy = gy - 621;
            days = days - marchDay;
        } else {
            jy = gy - 622;
            const prevYearLeap = ((gy - 1) % 4 === 0 && (gy - 1) % 100 !== 0) || ((gy - 1) % 400 === 0);
            days = days + (prevYearLeap ? 286 : 285);
        }
        
        // Convert days into Persian month/day
        if (days <= 186) {
            jm = Math.floor((days - 1) / 31) + 1;
            jd = days - ((jm - 1) * 31);
        } else {
            days = days - 186;
            jm = Math.floor((days - 1) / 30) + 7;
            jd = days - ((jm - 7) * 30);
        }
        
        return {
            year: jy,
            month: jm,
            day: jd
        };
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const persianDate = toPersianDate(dateString);
        
        const time = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        
        return `${persianDate.year}/${persianDate.month.toString().padStart(2, '0')}/${persianDate.day.toString().padStart(2, '0')} - ${time}`;
    };

    const formatPersianDateWithName = (dateString) => {
        const date = new Date(dateString);
        const persianDate = toPersianDate(dateString);
        
        // Persian month names
        const persianMonths = [
            "حمل","ثور","جوزا","سرطان","اسد","سنبله","میزان","عقرب","قوس","جدی","دلو","حوت"
        ];
        
        const time = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        
        return `${persianDate.day} ${persianMonths[persianDate.month - 1]} ${persianDate.year} - ${time}`;
    };

    const clearFilters = () => {
        setSearchTerm("");
        setDateFilter("");
        setSortBy("created_at");
        setSortOrder("desc");
    };

    const getModelTypeIcon = (modelType) => {
        switch (modelType?.toLowerCase()) {
            case 'sale':
                return <ShoppingCart className="h-4 w-4" />;
            case 'customer':
                return <User className="h-4 w-4" />;
            default:
                return <Package className="h-4 w-4" />;
        }
    };

    const getModelTypeBadge = (modelType) => {
        const typeConfig = {
            'sale': { color: 'bg-blue-500', text: 'Sale' },
            'customer': { color: 'bg-purple-500', text: 'Customer' },
            'transfer': { color: 'bg-orange-500', text: 'Transfer' },
            'adjustment': { color: 'bg-red-500', text: 'Adjustment' },
        };

        const config = typeConfig[modelType?.toLowerCase()] || { color: 'bg-gray-500', text: 'Other' };
        return (
            <Badge variant="secondary" className={`${config.color} text-white`}>
                {t(config.text)}
            </Badge>
        );
    };

    return (
        <>
            <Head title={`${warehouse?.name} - ${t("Export Records")}`}>
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
                <Navigation auth={auth} currentRoute="admin.warehouses" />

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
                                        {warehouse?.name} - {t("Export Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-red-700 bg-clip-text text-transparent"
                                    >
                                        {t("Export Records")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        {t("Track and manage outgoing inventory")}
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
                                <Link href={route("admin.warehouses.show", warehouse.id)}>
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-all duration-200">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Warehouse")}
                                    </Button>
                                </Link>
                                <Link href={route("admin.warehouses.outcome.create", warehouse.id)}>
                                    <Button className="gap-2 bg-gradient-to-r from-red-600 via-orange-600 to-red-700 hover:from-red-700 hover:via-orange-700 hover:to-red-800 text-white hover:scale-105 transition-all duration-200 shadow-lg">
                                        <Plus className="h-4 w-4" />
                                        {t("New Export")}
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
                                {/* Enhanced Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.4 }}
                                    >
                                        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Total Exports")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                                                            {totalExports}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t("Transactions")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl">
                                                        <TrendingDown className="h-8 w-8 text-red-600 dark:text-red-400" />
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
                                        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Total Quantity")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                                            {totalQuantity.toLocaleString()}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t("Units exported")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                                                        <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
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
                                        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Total Value")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                                            {formatCurrency(totalValue)}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t("Export value")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
                                                        <DollarSign className="h-8 w-8 text-purple-600 dark:text-purple-400" />
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
                                        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Average Export")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                                                            {formatCurrency(avgExportValue)}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t("Per transaction")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl">
                                                        <BarChart3 className="h-8 w-8 text-orange-600 dark:text-orange-400" />
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
                                                        placeholder={t("Search by reference, product name, barcode, or type...")}
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

                                {/* Export Table */}
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
                                                {t("Export Records")}
                                                <Badge variant="secondary" className="ml-auto">
                                                    {filteredOutcomes.length} {t("of")} {outcomes.length}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
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
                                                                {t("Unit Type")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Unit Price")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Total Value")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center">
                                                                {t("Type")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Export Date")}
                                                            </TableHead>

                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {filteredOutcomes.length > 0 ? (
                                                            filteredOutcomes.map((outcome, index) => (
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
                                                                                    <span className="text-xs">{outcome.product.type}</span>
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex flex-col gap-1">
                                                                            <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 w-fit">
                                                                                {outcome.is_wholesale 
                                                                                    ? `${(outcome.quantity / (outcome.unit_amount || 1)).toLocaleString()}`
                                                                                    : outcome.quantity?.toLocaleString() || 0
                                                                                }
                                                                                {outcome.unit_name && (
                                                                                    <span className="ml-1 text-xs opacity-75">
                                                                                        {outcome.unit_name}
                                                                                    </span>
                                                                                )}
                                                                            </Badge>
                                                                            {outcome.is_wholesale && (
                                                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                                                    ({outcome.quantity?.toLocaleString() || 0} units total)
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge 
                                                                            variant={outcome.is_wholesale ? "default" : "outline"}
                                                                            className={
                                                                                outcome.is_wholesale 
                                                                                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                                                                                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                                                            }
                                                                        >
                                                                            {outcome.unit_type === 'wholesale' ? t('Wholesale') : t('Retail')}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="font-medium">
                                                                        {formatCurrency(outcome.price)}
                                                                    </TableCell>
                                                                    <TableCell className="font-bold text-red-600">
                                                                        {formatCurrency(outcome.total)}
                                                                    </TableCell>
                                                                    <TableCell className="text-center">
                                                                        {getModelTypeBadge(outcome.model_type)}
                                                                    </TableCell>
                                                                    <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                                                                        <div className="flex items-center gap-2">
                                                                            <Calendar className="h-4 w-4" />
                                                                            <div className="flex flex-col">
                                                                                <span className="font-medium" title={formatDate(outcome.created_at)}>
                                                                                    {formatPersianDateWithName(outcome.created_at)}
                                                                                </span>
                                                                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                                                                    {formatDate(outcome.created_at)}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>

                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan="8" className="h-32 text-center">
                                                                    <div className="flex flex-col items-center gap-4">
                                                                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                                            <TrendingDown className="h-8 w-8 text-slate-400" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                                                                {t("No export records found")}
                                                                            </p>
                                                                            <p className="text-sm text-slate-500">
                                                                                {searchTerm || dateFilter ? t("Try adjusting your filters") : t("Create your first export record")}
                                                                            </p>
                                                                        </div>
                                                                        {!searchTerm && !dateFilter && (
                                                                            <Link href={route("admin.warehouses.outcome.create", warehouse.id)}>
                                                                                <Button className="gap-2">
                                                                                    <Plus className="h-4 w-4" />
                                                                                    {t("Create Export")}
                                                                                </Button>
                                                                            </Link>
                                                                        )}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
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
