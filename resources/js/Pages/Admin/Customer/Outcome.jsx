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

export default function Outcome({ auth, customer, outcomes }) {
    const { t } = useLaravelReactI18n();
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
        return new Date(dateString).toLocaleDateString('fa-IR');
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
                                    linear-gradient(45deg, #ef4444, #dc2626) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #ef4444, #dc2626) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

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
                                        {t("Customer Outcome")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-red-700 bg-clip-text text-transparent"
                                    >
                                        {customer.name}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <User className="w-4 h-4" />
                                        {t("Outcome Records")} • {outcomes.length} {t("Records")}
                                    </motion.p>
                                </div>
                            </div>
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center gap-3"
                            >
                                <Link href={route('admin.customers.show', customer.id)}>
                                    <Button
                                        variant="outline"
                                        className="gradient-border hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 group"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                                        {t("Back to Customer")}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Content */}
                    <div className="flex-1 overflow-auto p-8">
                        <div className="max-w-7xl mx-auto space-y-8">
                            {/* Customer Info Card */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                            >
                                <Card className="glass-effect border-0 shadow-xl">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-3 text-xl">
                                            <Building2 className="w-6 h-6 text-red-600" />
                                            {t("Customer Information")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
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

                            {/* Outcome Records */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.9, duration: 0.5 }}
                            >
                                <Card className="glass-effect border-0 shadow-xl">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-3 text-xl">
                                            <TrendingDown className="w-6 h-6 text-red-600" />
                                            {t("Outcome Records")}
                                            <Badge variant="secondary" className="ml-auto">
                                                {outcomes.length} {t("Records")}
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {outcomes.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="border-slate-200 dark:border-slate-700">
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                <div className="flex items-center gap-2">
                                                                    <Hash className="w-4 h-4" />
                                                                    {t("Reference")}
                                                                </div>
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                <div className="flex items-center gap-2">
                                                                    <Package className="w-4 h-4" />
                                                                    {t("Product")}
                                                                </div>
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center">
                                                                {t("Quantity")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">
                                                                {t("Total")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center">
                                                                <div className="flex items-center gap-2 justify-center">
                                                                    <AlertTriangle className="w-4 h-4" />
                                                                    {t("Reason")}
                                                                </div>
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center">
                                                                {t("Status")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center">
                                                                <div className="flex items-center gap-2 justify-center">
                                                                    <Calendar className="w-4 h-4" />
                                                                    {t("Date")}
                                                                </div>
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {outcomes.map((outcome, index) => (
                                                            <motion.tr
                                                                key={outcome.id}
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
                                                                className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                                            >
                                                                <TableCell className="font-medium">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                                        {outcome.reference_number}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="space-y-1">
                                                                        <p className="font-medium text-slate-900 dark:text-white">
                                                                            {outcome.product.name}
                                                                        </p>
                                                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                            {outcome.product.barcode}
                                                                        </p>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-center">
                                                                    <Badge variant="outline" className="font-mono">
                                                                        {outcome.quantity}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-right font-mono font-semibold text-red-600 dark:text-red-400">
                                                                    {formatCurrency(outcome.total)}
                                                                </TableCell>
                                                                <TableCell className="text-center">
                                                                    {getReasonBadge(outcome.reason)}
                                                                </TableCell>
                                                                <TableCell className="text-center">
                                                                    {getStatusBadge(outcome.status)}
                                                                </TableCell>
                                                                <TableCell className="text-center text-sm text-slate-600 dark:text-slate-400">
                                                                    {formatDate(outcome.created_at)}
                                                                </TableCell>
                                                            </motion.tr>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 1, duration: 0.5 }}
                                                className="text-center py-12"
                                            >
                                                <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <FileText className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                                    {t("No Outcome Records")}
                                                </h3>
                                                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                                                    {t("This customer doesn't have any outcome records yet.")}
                                                </p>
                                            </motion.div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
} 