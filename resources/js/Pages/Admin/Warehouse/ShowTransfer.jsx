import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Building2,
    ArrowLeft,
    ArrowRightLeft,
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
    Filter,
    Download,
    RefreshCw,
    BarChart3,
    Sparkles,
    ChevronDown,
    X,
    Info,
    Truck,
    Users,
    Printer,
    Share2
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
import { Badge } from "@/Components/ui/badge";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";
import BackButton from "@/Components/BackButton";

export default function ShowTransfer({ auth, warehouse, transfer }) {
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AFN',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const baseClasses = "text-xs font-medium px-3 py-1 rounded-full";
        
        switch (status) {
            case 'completed':
                return <Badge className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`}>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {t("Completed")}
                </Badge>;
            case 'pending':
                return <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300`}>
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {t("Pending")}
                </Badge>;
            case 'cancelled':
                return <Badge className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`}>
                    <X className="w-4 h-4 mr-1" />
                    {t("Cancelled")}
                </Badge>;
            default:
                return <Badge className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300`}>
                    {status}
                </Badge>;
        }
    };

    const getDirectionBadge = (direction) => {
        const baseClasses = "text-xs font-medium px-3 py-1 rounded-full";
        
        if (direction === 'outgoing') {
            return <Badge className={`${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300`}>
                <ArrowRightLeft className="w-4 h-4 mr-1" />
                {t("Outgoing Transfer")}
            </Badge>;
        } else {
            return <Badge className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`}>
                <Truck className="w-4 h-4 mr-1" />
                {t("Incoming Transfer")}
            </Badge>;
        }
    };

    return (
        <>
            <Head title={`${warehouse?.name} - ${t("Transfer Details")} ${transfer?.reference_number}`}>
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
                                    linear-gradient(45deg, #3b82f6, #6366f1) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #3b82f6, #6366f1) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={ArrowRightLeft} color="blue" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
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
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 p-4 rounded-2xl shadow-2xl">
                                        <ArrowRightLeft className="w-8 h-8 text-white" />
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
                                        {warehouse?.name} - {t("Transfer Details")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent"
                                    >
                                        {transfer?.reference_number}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        {t("Transfer details and item information")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <BackButton link={route("admin.warehouses.transfers", warehouse.id)} />
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
                                className="space-y-8"
                            >
                                {/* Transfer Overview */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.4 }}
                                    >
                                        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Transfer Status")}
                                                        </p>
                                                        <div className="mb-2">
                                                            {getStatusBadge(transfer?.status)}
                                                        </div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {transfer?.completed_at ? t("Completed on") : t("Created on")}: {formatDate(transfer?.completed_at || transfer?.created_at)}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                                                        <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
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
                                        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Total Items")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                                                            {transfer?.items_count || 0}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t("Products transferred")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-2xl">
                                                        <Package className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
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
                                        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Total Value")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                                            {formatCurrency(transfer?.total_amount)}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t("Transfer value")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
                                                        <DollarSign className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>

                                {/* Transfer Details */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.2, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                                    <Info className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Transfer Information")}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {/* From Warehouse */}
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                                                        <Building2 className="w-5 h-5 text-red-500" />
                                                        {t("From Warehouse")}
                                                    </h3>
                                                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-700">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                                                <Building2 className="h-5 w-5 text-red-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-800 dark:text-white">
                                                                    {transfer?.from_warehouse?.name}
                                                                </p>
                                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                    {transfer?.from_warehouse?.code}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* To Warehouse */}
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                                                        <Building2 className="w-5 h-5 text-green-500" />
                                                        {t("To Warehouse")}
                                                    </h3>
                                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                                <Building2 className="h-5 w-5 text-green-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-800 dark:text-white">
                                                                    {transfer?.to_warehouse?.name}
                                                                </p>
                                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                    {transfer?.to_warehouse?.code}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Additional Information */}
                                            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                        {t("Created By")}
                                                    </p>
                                                    <p className="font-semibold text-slate-800 dark:text-white">
                                                        {transfer?.created_by?.name || t("System")}
                                                    </p>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                        {t("Transfer Date")}
                                                    </p>
                                                    <p className="font-semibold text-slate-800 dark:text-white">
                                                        {formatDate(transfer?.transfer_date)}
                                                    </p>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                        {t("Total Quantity")}
                                                    </p>
                                                    <p className="font-semibold text-slate-800 dark:text-white">
                                                        {transfer?.total_quantity?.toLocaleString() || 0} {t("pieces")}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Notes */}
                                            {transfer?.notes && (
                                                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                        {t("Notes")}
                                                    </p>
                                                    <p className="text-slate-800 dark:text-white">
                                                        {transfer.notes}
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Transfer Items */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.3, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                                    <Package className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Transfer Items")}
                                                <Badge className="ml-auto bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                    {transfer?.transfer_items?.length || 0} {t("items")}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Product")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Batch")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Unit Type")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Quantity")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Unit Price")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Total")}
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {transfer?.transfer_items && transfer.transfer_items.length > 0 ? (
                                                            transfer.transfer_items.map((item, index) => (
                                                                <TableRow
                                                                    key={item.id}
                                                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                                                >
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg">
                                                                                <Package className="h-4 w-4 text-blue-600" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-semibold text-slate-800 dark:text-white">{item.product.name}</p>
                                                                                <p className="text-sm text-slate-500 dark:text-slate-400">{item.product.barcode}</p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <Package className="h-4 w-4 text-indigo-600" />
                                                                            <div>
                                                                                <p className="font-semibold text-slate-800 dark:text-white">
                                                                                    {item.batch?.reference_number || 'N/A'}
                                                                                </p>
                                                                                {item.batch?.expire_date && (
                                                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                                        Exp: {new Date(item.batch.expire_date).toLocaleDateString()}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge variant="outline" className="capitalize">
                                                                            {item.unit_name || item.unit_type}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                                            {item.quantity?.toLocaleString() || 0}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="font-medium">
                                                                        {formatCurrency(item.unit_price)}
                                                                    </TableCell>
                                                                    <TableCell className="font-bold text-blue-600">
                                                                        {formatCurrency(item.total_price)}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan="6" className="h-32 text-center">
                                                                    <div className="flex flex-col items-center gap-4">
                                                                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                                            <Package className="h-8 w-8 text-slate-400" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                                                                {t("No transfer items found")}
                                                                            </p>
                                                                            <p className="text-sm text-slate-500">
                                                                                {t("This transfer has no items associated with it")}
                                                                            </p>
                                                                        </div>
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