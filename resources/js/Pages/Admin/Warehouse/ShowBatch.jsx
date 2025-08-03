import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    Package,
    DollarSign,
    Building2,
    Calendar,
    Search,
    Eye,
    Plus,
    Filter,
    Download,
    RefreshCw,
    BarChart3,
    Sparkles,
    ChevronDown,
    ChevronUp,
    X,
    Warehouse,
    CheckCircle,
    Clock,
    XCircle,
    ChevronLeft,
    ChevronRight,
    Users,
    FileText,
    ShoppingBag,
    ArrowRightLeft,
    AlertTriangle,
    CalendarDays,
    User,
    Truck,
    TrendingUp,
    TrendingDown,
    MapPin,
    Hash,
    Receipt,
    Calculator,
    Globe,
    Phone,
    Mail,
    Edit,
    Printer,
    Share2,
    Copy,
    ExternalLink
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
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/Components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";
import BackButton from "@/Components/BackButton";

export default function ShowBatch({ auth, batch }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    // Ensure batch data has default values to prevent undefined errors
    const safeBatch = {
        id: batch?.id || 0,
        reference_number: batch?.reference_number || 'N/A',
        product: batch?.product || { id: 0, name: 'Unknown Product', barcode: 'N/A', type: 'Unknown' },
        warehouse: batch?.warehouse || null,
        supplier: batch?.supplier || null,
        quantity: batch?.quantity || 0,
        unit_type: batch?.unit_type || 'Unknown',
        unit_name: batch?.unit_name || 'Unit',
        unit_amount: batch?.unit_amount || 1,
        expire_date: batch?.expire_date || null,
        manufacture_date: batch?.manufacture_date || null,
        is_active: batch?.is_active ?? true,
        notes: batch?.notes || '',
        purchase_price: batch?.purchase_price || 0,
        wholesale_price: batch?.wholesale_price || 0,
        retail_price: batch?.retail_price || 0,
        total: batch?.total || 0,
        incomes: batch?.incomes || [],
        outcomes: batch?.outcomes || [],
        transfer_items: batch?.transfer_items || [],
        warehouse_inventory: batch?.warehouse_inventory || [],
        customer_inventory: batch?.customer_inventory || [],
        summary: batch?.summary || {
            total_warehouse_remaining: 0,
            total_customer_remaining: 0,
            total_warehouse_value: 0,
            total_customer_value: 0,
            total_warehouses: 0,
            total_customers: 0,
        },
        created_at: batch?.created_at || new Date(),
        updated_at: batch?.updated_at || new Date(),
    };

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AFN',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    // Utility function to convert Gregorian to Jalali date
    const formatJalaliDate = (dateString) => {
        if (!dateString) return 'N/A';

        const date = new Date(dateString);

        // Convert to Jalali date using Persian calendar
        const jalaliDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(date);

        const time = date.toLocaleTimeString('fa-IR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        return `${jalaliDate} ${time}`;
    };

    const formatDate = (dateString) => {
        return formatJalaliDate(dateString);
    };

    const getStatusBadgeClass = (batch) => {
        if (!batch.is_active) {
            return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        }

        if (batch.expire_date && new Date(batch.expire_date) <= new Date()) {
            return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        }

        if (batch.expire_date && new Date(batch.expire_date) <= new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)) {
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        }

        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    };

    const getStatusText = (batch) => {
        if (!batch.is_active) {
            return t("Inactive");
        }

        if (batch.expire_date && new Date(batch.expire_date) <= new Date()) {
            return t("Expired");
        }

        if (batch.expire_date && new Date(batch.expire_date) <= new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)) {
            return t("Expiring Soon");
        }

        return t("Active");
    };

    const getExpiryStatusBadge = (daysToExpiry) => {
        if (daysToExpiry === null) {
            return <Badge variant="secondary" className="bg-gray-100 text-gray-700">{t("No Expiry")}</Badge>;
        }
        if (daysToExpiry < 0) {
            return <Badge variant="destructive">{t("Expired")}</Badge>;
        }
        if (daysToExpiry <= 20) {
            return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">{t("Expiring Soon")}</Badge>;
        }
        return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">{t("Valid")}</Badge>;
    };

    return (
        <>
            <Head title={`${t("Batch")}: ${safeBatch.reference_number}`}>
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
                        0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
                        50% { box-shadow: 0 0 30px rgba(34, 197, 94, 0.6); }
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

                    .gradient-border {
                        background: linear-gradient(white, white) padding-box,
                                    linear-gradient(45deg, #22c55e, #16a34a) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #22c55e, #16a34a) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={Package} color="blue" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.batches" />

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
                                    className="relative float-animation"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-2xl blur-lg opacity-60 dark:opacity-40"></div>
                                    <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 p-4 rounded-2xl shadow-2xl">
                                        <Package className="w-8 h-8 text-white" />
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
                                        {t("Batch Details")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent"
                                    >
                                        {safeBatch.reference_number}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        {safeBatch.product.name} - {t("Complete batch information")}
                                    </motion.p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <BackButton link={route('admin.batches.index')} />

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
                                className="space-y-8"
                            >
                                {/* Batch Overview Cards */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.0, duration: 0.4 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                                >
                                    {/* Product Info */}
                                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                        <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3 text-lg">
                                                <Package className="h-5 w-5 text-blue-600" />
                                                {t("Product")}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t("Name")}</p>
                                                    <p className="font-semibold text-slate-800 dark:text-white">{safeBatch.product.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t("Barcode")}</p>
                                                    <p className="font-mono text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{safeBatch.product.barcode}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t("Type")}</p>
                                                    <Badge variant="outline">{safeBatch.product.type}</Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Batch Status */}
                                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                        <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3 text-lg">
                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                                {t("Status")}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t("Status")}</p>
                                                    <Badge className={getStatusBadgeClass(safeBatch)}>
                                                        {getStatusText(safeBatch)}
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t("Quantity")}</p>
                                                    <p className="font-semibold text-slate-800 dark:text-white">
                                                        {safeBatch.quantity / safeBatch.unit_amount} {safeBatch.unit_name}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t("Unit Type")}</p>
                                                    <p className="font-semibold text-slate-800 dark:text-white">{safeBatch.unit_type}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Financial Info */}
                                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                        <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3 text-lg">
                                                <DollarSign className="h-5 w-5 text-green-600" />
                                                {t("Financial")}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t("Purchase Price")}</p>
                                                    <p className="font-semibold text-slate-800 dark:text-white">{formatCurrency(safeBatch.purchase_price)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t("Wholesale Price")}</p>
                                                    <p className="font-semibold text-slate-800 dark:text-white">{formatCurrency(safeBatch.wholesale_price)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t("Retail Price")}</p>
                                                    <p className="font-semibold text-slate-800 dark:text-white">{formatCurrency(safeBatch.retail_price)}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Dates Info */}
                                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                        <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3 text-lg">
                                                <Calendar className="h-5 w-5 text-purple-600" />
                                                {t("Dates")}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t("Manufacture Date")}</p>
                                                    <p className="font-semibold text-slate-800 dark:text-white">{formatDate(safeBatch.manufacture_date)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t("Expire Date")}</p>
                                                    <div className="flex items-center gap-2">
                                                        <CalendarDays className={`h-4 w-4 ${safeBatch.expire_date && new Date(safeBatch.expire_date) <= new Date()
                                                                ? 'text-red-600'
                                                                : safeBatch.expire_date && new Date(safeBatch.expire_date) <= new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
                                                                    ? 'text-yellow-600'
                                                                    : 'text-green-600'
                                                            }`} />
                                                        <span className={`font-semibold ${safeBatch.expire_date && new Date(safeBatch.expire_date) <= new Date()
                                                                ? 'text-red-600 dark:text-red-400'
                                                                : safeBatch.expire_date && new Date(safeBatch.expire_date) <= new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
                                                                    ? 'text-yellow-600 dark:text-yellow-400'
                                                                    : 'text-green-600 dark:text-green-400'
                                                            }`}>
                                                            {safeBatch.expire_date ? formatDate(safeBatch.expire_date) : t("No expiry")}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t("Created")}</p>
                                                    <p className="font-semibold text-slate-800 dark:text-white">{formatDate(safeBatch.created_at)}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Supplier & Warehouse Info */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.2, duration: 0.4 }}
                                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                                >
                                    {/* Supplier Info */}
                                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3 text-lg">
                                                <User className="h-5 w-5 text-blue-600" />
                                                {t("Supplier Information")}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            {safeBatch.supplier ? (
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">{t("Name")}</p>
                                                        <p className="font-semibold text-slate-800 dark:text-white">{safeBatch.supplier.name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">{t("Code")}</p>
                                                        <p className="font-mono text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{safeBatch.supplier.code}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-slate-500 dark:text-slate-400 italic">{t("No supplier information available")}</p>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Warehouse Info */}
                                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3 text-lg">
                                                <Warehouse className="h-5 w-5 text-green-600" />
                                                {t("Warehouse Information")}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            {safeBatch.warehouse ? (
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">{t("Name")}</p>
                                                        <p className="font-semibold text-slate-800 dark:text-white">{safeBatch.warehouse.name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">{t("Code")}</p>
                                                        <p className="font-mono text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{safeBatch.warehouse.code}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-slate-500 dark:text-slate-400 italic">{t("No warehouse information available")}</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Summary Statistics */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.4, duration: 0.4 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                                >
                                    <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-blue-100">{t("Warehouse Stock")}</p>
                                                    <p className="text-2xl font-bold">{safeBatch.summary.total_warehouse_remaining / safeBatch.unit_amount} {safeBatch.unit_name}</p>
                                                </div>
                                                <Warehouse className="h-8 w-8 text-blue-200" />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-green-600 text-white">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-green-100">{t("Customer Stock")}</p>
                                                    <p className="text-2xl font-bold">{safeBatch.summary.total_customer_remaining / safeBatch.unit_amount} {safeBatch.unit_name}</p>
                                                </div>
                                                <Users className="h-8 w-8 text-green-200" />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-purple-100">{t("Warehouse Value")}</p>
                                                    <p className="text-2xl font-bold">{formatCurrency(safeBatch.summary.total_warehouse_value)}</p>
                                                </div>
                                                <DollarSign className="h-8 w-8 text-purple-200" />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-orange-100">{t("Customer Value")}</p>
                                                    <p className="text-2xl font-bold">{formatCurrency(safeBatch.summary.total_customer_value)}</p>
                                                </div>
                                                <ShoppingBag className="h-8 w-8 text-orange-200" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Detailed Information Tabs */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.6, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3 text-lg">
                                                <BarChart3 className="h-5 w-5 text-blue-600" />
                                                {t("Detailed Information")}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                                <TabsList className="grid w-full grid-cols-6 bg-slate-100 dark:bg-slate-700">
                                                    <TabsTrigger value="overview" className="flex items-center gap-2">
                                                        <Eye className="h-4 w-4" />
                                                        {t("Overview")}
                                                    </TabsTrigger>
                                                    <TabsTrigger value="warehouse" className="flex items-center gap-2">
                                                        <Warehouse className="h-4 w-4" />
                                                        {t("Warehouse")}
                                                    </TabsTrigger>
                                                    <TabsTrigger value="customers" className="flex items-center gap-2">
                                                        <Users className="h-4 w-4" />
                                                        {t("Customers")}
                                                    </TabsTrigger>
                                                    <TabsTrigger value="incomes" className="flex items-center gap-2">
                                                        <TrendingUp className="h-4 w-4" />
                                                        {t("Incomes")}
                                                    </TabsTrigger>
                                                    <TabsTrigger value="outcomes" className="flex items-center gap-2">
                                                        <TrendingDown className="h-4 w-4" />
                                                        {t("Outcomes")}
                                                    </TabsTrigger>
                                                    <TabsTrigger value="transfers" className="flex items-center gap-2">
                                                        <Truck className="h-4 w-4" />
                                                        {t("Transfers")}
                                                    </TabsTrigger>
                                                </TabsList>

                                                <TabsContent value="overview" className="p-6">
                                                    <div className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div>
                                                                <h3 className="text-lg font-semibold mb-4">{t("Batch Summary")}</h3>
                                                                <div className="space-y-3">
                                                                    <div className="flex justify-between">
                                                                        <span className="text-slate-600 dark:text-slate-400">{t("Total Warehouses")}:</span>
                                                                        <span className="font-semibold">{safeBatch.summary.total_warehouses}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-slate-600 dark:text-slate-400">{t("Total Customers")}:</span>
                                                                        <span className="font-semibold">{safeBatch.summary.total_customers}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-slate-600 dark:text-slate-400">{t("Total Income Records")}:</span>
                                                                        <span className="font-semibold">{safeBatch.incomes.length}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-slate-600 dark:text-slate-400">{t("Total Outcome Records")}:</span>
                                                                        <span className="font-semibold">{safeBatch.outcomes.length}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h3 className="text-lg font-semibold mb-4">{t("Notes")}</h3>
                                                                <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                                                                    <p className="text-slate-700 dark:text-slate-300">
                                                                        {safeBatch.notes || t("No notes available")}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="warehouse" className="p-6">
                                                    <div className="space-y-6">
                                                        <h3 className="text-lg font-semibold">{t("Warehouse Inventory")}</h3>
                                                        {safeBatch.warehouse_inventory.length > 0 ? (
                                                            <div className="overflow-x-auto">
                                                                <Table>
                                                                    <TableHeader>
                                                                        <TableRow>
                                                                            <TableHead>{t("Warehouse")}</TableHead>
                                                                            <TableHead>{t("Income Qty")}</TableHead>
                                                                            <TableHead>{t("Outcome Qty")}</TableHead>
                                                                            <TableHead>{t("Remaining")}</TableHead>
                                                                            <TableHead>{t("Income Value")}</TableHead>
                                                                            <TableHead>{t("Outcome Value")}</TableHead>
                                                                            <TableHead>{t("Expiry Status")}</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {safeBatch.warehouse_inventory.map((item, index) => (
                                                                            <TableRow key={index}>
                                                                                <TableCell>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Warehouse className="h-4 w-4 text-blue-600" />
                                                                                        <span className="font-semibold">{item.warehouse_name}</span>
                                                                                    </div>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                                                        {item.income_qty / safeBatch.unit_amount} {safeBatch.unit_name}
                                                                                    </Badge>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                                                                                        {item.outcome_qty / safeBatch.unit_amount} {safeBatch.unit_name}
                                                                                    </Badge>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                                                                        {item.remaining_qty / safeBatch.unit_amount} {safeBatch.unit_name}
                                                                                    </Badge>
                                                                                </TableCell>
                                                                                <TableCell>{formatCurrency(item.total_income_value)}</TableCell>
                                                                                <TableCell>{formatCurrency(item.total_outcome_value)}</TableCell>
                                                                                <TableCell>{getExpiryStatusBadge(item.days_to_expiry)}</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-8">
                                                                <Warehouse className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                                                <p className="text-slate-500 dark:text-slate-400">{t("No warehouse inventory data available")}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="customers" className="p-6">
                                                    <div className="space-y-6">
                                                        <h3 className="text-lg font-semibold">{t("Customer Inventory")}</h3>
                                                        {safeBatch.customer_inventory.length > 0 ? (
                                                            <div className="overflow-x-auto">
                                                                <Table>
                                                                    <TableHeader>
                                                                        <TableRow>
                                                                            <TableHead>{t("Customer")}</TableHead>
                                                                            <TableHead>{t("Quantity")}</TableHead>
                                                                            <TableHead>{t("Remaining")}</TableHead>
                                                                            <TableHead>{t("Price")}</TableHead>
                                                                            <TableHead>{t("Total")}</TableHead>
                                                                            <TableHead>{t("Date")}</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {safeBatch.customer_inventory.map((item, index) => (
                                                                            <TableRow key={index}>
                                                                                <TableCell>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <User className="h-4 w-4 text-green-600" />
                                                                                        <div>
                                                                                            <span className="font-semibold">{item.customer_name}</span>
                                                                                            <p className="text-xs text-slate-500">{item.customer_code}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                                                        {item.quantity / safeBatch.unit_amount} {safeBatch.unit_name}
                                                                                    </Badge>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                                                                        {item.remaining_quantity / safeBatch.unit_amount} {safeBatch.unit_name}
                                                                                    </Badge>
                                                                                </TableCell>
                                                                                <TableCell>{formatCurrency(item.price)}</TableCell>
                                                                                <TableCell>{formatCurrency(item.total)}</TableCell>
                                                                                <TableCell>{formatDate(item.created_at)}</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-8">
                                                                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                                                <p className="text-slate-500 dark:text-slate-400">{t("No customer inventory data available")}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="incomes" className="p-6">
                                                    <div className="space-y-6">
                                                        <h3 className="text-lg font-semibold">{t("Warehouse Income Records")}</h3>
                                                        {safeBatch.incomes.length > 0 ? (
                                                            <div className="overflow-x-auto">
                                                                <Table>
                                                                    <TableHeader>
                                                                        <TableRow>
                                                                            <TableHead>{t("Reference")}</TableHead>
                                                                            <TableHead>{t("Warehouse")}</TableHead>
                                                                            <TableHead>{t("Quantity")}</TableHead>
                                                                            <TableHead>{t("Price")}</TableHead>
                                                                            <TableHead>{t("Total")}</TableHead>
                                                                            <TableHead>{t("Date")}</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {safeBatch.incomes.map((income, index) => (
                                                                            <TableRow key={index}>
                                                                                <TableCell>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Hash className="h-4 w-4 text-blue-600" />
                                                                                        <span className="font-mono text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                                                                            {income.reference_number}
                                                                                        </span>
                                                                                    </div>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Warehouse className="h-4 w-4 text-green-600" />
                                                                                        <div>
                                                                                            <span className="font-semibold">{income.warehouse?.name || 'N/A'}</span>
                                                                                            <p className="text-xs text-slate-500">{income.warehouse?.code || 'N/A'}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                                                        {income.quantity / safeBatch.unit_amount} {safeBatch.unit_name}
                                                                                    </Badge>
                                                                                </TableCell>
                                                                                <TableCell>{formatCurrency(income.price)}</TableCell>
                                                                                <TableCell>{formatCurrency(income.total)}</TableCell>
                                                                                <TableCell>{formatDate(income.created_at)}</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-8">
                                                                <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                                                <p className="text-slate-500 dark:text-slate-400">{t("No income records available")}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="outcomes" className="p-6">
                                                    <div className="space-y-6">
                                                        <h3 className="text-lg font-semibold">{t("Warehouse Outcome Records")}</h3>
                                                        {safeBatch.outcomes.length > 0 ? (
                                                            <div className="overflow-x-auto">
                                                                <Table>
                                                                    <TableHeader>
                                                                        <TableRow>
                                                                            <TableHead>{t("Reference")}</TableHead>
                                                                            <TableHead>{t("Warehouse")}</TableHead>
                                                                            <TableHead>{t("Quantity")}</TableHead>
                                                                            <TableHead>{t("Price")}</TableHead>
                                                                            <TableHead>{t("Total")}</TableHead>
                                                                            <TableHead>{t("Date")}</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {safeBatch.outcomes.map((outcome, index) => (
                                                                            <TableRow key={index}>
                                                                                <TableCell>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Hash className="h-4 w-4 text-red-600" />
                                                                                        <span className="font-mono text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                                                                            {outcome.reference_number}
                                                                                        </span>
                                                                                    </div>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Warehouse className="h-4 w-4 text-red-600" />
                                                                                        <div>
                                                                                            <span className="font-semibold">{outcome.warehouse?.name || 'N/A'}</span>
                                                                                            <p className="text-xs text-slate-500">{outcome.warehouse?.code || 'N/A'}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                                                                                        {outcome.quantity / safeBatch.unit_amount} {safeBatch.unit_name}
                                                                                    </Badge>
                                                                                </TableCell>
                                                                                <TableCell>{formatCurrency(outcome.price)}</TableCell>
                                                                                <TableCell>{formatCurrency(outcome.total)}</TableCell>
                                                                                <TableCell>{formatDate(outcome.created_at)}</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-8">
                                                                <TrendingDown className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                                                <p className="text-slate-500 dark:text-slate-400">{t("No outcome records available")}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="transfers" className="p-6">
                                                    <div className="space-y-6">
                                                        <h3 className="text-lg font-semibold">{t("Transfer Records")}</h3>
                                                        {safeBatch.transfer_items.length > 0 ? (
                                                            <div className="overflow-x-auto">
                                                                <Table>
                                                                    <TableHeader>
                                                                        <TableRow>
                                                                            <TableHead>{t("Reference")}</TableHead>
                                                                            <TableHead>{t("From Warehouse")}</TableHead>
                                                                            <TableHead>{t("To Warehouse")}</TableHead>
                                                                            <TableHead>{t("Quantity")}</TableHead>
                                                                            <TableHead>{t("Status")}</TableHead>
                                                                            <TableHead>{t("Date")}</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {safeBatch.transfer_items.map((transfer, index) => (
                                                                            <TableRow key={index}>
                                                                                <TableCell>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Hash className="h-4 w-4 text-purple-600" />
                                                                                        <span className="font-mono text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                                                                            {transfer.reference_number}
                                                                                        </span>
                                                                                    </div>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Warehouse className="h-4 w-4 text-blue-600" />
                                                                                        <div>
                                                                                            <span className="font-semibold">{transfer.from_warehouse?.name || 'N/A'}</span>
                                                                                            <p className="text-xs text-slate-500">{transfer.from_warehouse?.code || 'N/A'}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Warehouse className="h-4 w-4 text-green-600" />
                                                                                        <div>
                                                                                            <span className="font-semibold">{transfer.to_warehouse?.name || 'N/A'}</span>
                                                                                            <p className="text-xs text-slate-500">{transfer.to_warehouse?.code || 'N/A'}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                                                                        {transfer.quantity / safeBatch.unit_amount} {safeBatch.unit_name}
                                                                                    </Badge>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <Badge variant={transfer.status === 'completed' ? 'default' : 'outline'}>
                                                                                        {transfer.status === 'completed' ? t('Completed') : t('Pending')}
                                                                                    </Badge>
                                                                                </TableCell>
                                                                                <TableCell>{formatDate(transfer.created_at)}</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-8">
                                                                <Truck className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                                                <p className="text-slate-500 dark:text-slate-400">{t("No transfer records available")}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TabsContent>
                                            </Tabs>
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