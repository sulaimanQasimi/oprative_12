import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    Store,
    Package,
    DollarSign,
    Calendar,
    User,
    CheckCircle,
    Clock,
    Hash,
    Barcode,
    Phone,
    Mail,
    MapPin,
    FileText,
    Download,
    Edit,
    Trash2,
    Receipt,
    Sparkles,
    Building2,
    ShoppingCart,
    CreditCard,
    AlertCircle,
    Info
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
import { Badge } from "@/Components/ui/badge";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";
import BackButton from "@/Components/BackButton";

export default function ShowSale({ auth, warehouse, sale }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);

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

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
        }
    };

    const getTotalQuantity = () => {
        return sale.sale_items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
    };

    const getTotalAmount = () => {
        return sale.sale_items?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;
    };

    return (
        <>
            <Head title={`${t("Sale")} ${sale?.reference} - ${warehouse?.name}`} />

            <PageLoader isVisible={loading} icon={Receipt} color="green" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                <Navigation auth={auth} currentRoute="admin.warehouses" />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 py-6 px-8 sticky top-0 z-30"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 p-4 rounded-2xl shadow-2xl">
                                        <Receipt className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-green-600 dark:text-green-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {warehouse?.name} - {t("Sale Details")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent"
                                    >
                                        {sale?.reference}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Calendar className="w-4 h-4" />
                                        {formatDate(sale?.date)}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <BackButton link={route("admin.warehouses.sales", warehouse.id)} />
                            </motion.div>
                        </div>
                    </motion.header>

                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-green-300 dark:scrollbar-thumb-green-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="max-w-7xl mx-auto space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.4 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover:scale-105 transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Status")}
                                                        </p>
                                                        <Badge className={`${getStatusBadgeClass(sale?.status)} text-lg px-4 py-2`}>
                                                            {sale?.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl">
                                                        <CheckCircle className="h-8 w-8 text-green-600" />
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
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover:scale-105 transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Total Items")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-blue-600">
                                                            {sale?.sale_items?.length || 0}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {getTotalQuantity()} {t("pieces")}
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
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover:scale-105 transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Total Amount")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-green-600">
                                                            {formatCurrency(getTotalAmount())}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {sale?.currency?.code || 'AFN'}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl">
                                                        <DollarSign className="h-8 w-8 text-green-600" />
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
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover:scale-105 transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Date Created")}
                                                        </p>
                                                        <p className="text-lg font-bold text-purple-600">
                                                            {new Date(sale?.date).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {new Date(sale?.created_at).toLocaleTimeString()}
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

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 1.3, duration: 0.4 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50">
                                                <CardTitle className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                        <User className="h-5 w-5 text-white" />
                                                    </div>
                                                    {t("Customer Information")}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6 space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                                                        <User className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-800 dark:text-white text-lg">
                                                            {sale?.customer?.name || 'N/A'}
                                                        </p>
                                                        <p className="text-sm text-slate-500">{t("Customer Name")}</p>
                                                    </div>
                                                </div>

                                                {sale?.customer?.email && (
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl">
                                                            <Mail className="h-6 w-6 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-800 dark:text-white">
                                                                {sale.customer.email}
                                                            </p>
                                                            <p className="text-sm text-slate-500">{t("Email Address")}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {sale?.customer?.phone && (
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-xl">
                                                            <Phone className="h-6 w-6 text-orange-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-800 dark:text-white">
                                                                {sale.customer.phone}
                                                            </p>
                                                            <p className="text-sm text-slate-500">{t("Phone Number")}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 1.4, duration: 0.4 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-700/50">
                                                <CardTitle className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                                        <Receipt className="h-5 w-5 text-white" />
                                                    </div>
                                                    {t("Sale Information")}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6 space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl">
                                                        <Hash className="h-6 w-6 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-mono text-lg font-semibold text-slate-800 dark:text-white">
                                                            {sale?.reference}
                                                        </p>
                                                        <p className="text-sm text-slate-500">{t("Reference Number")}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                                                        <Building2 className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-800 dark:text-white">
                                                            {warehouse?.name}
                                                        </p>
                                                        <p className="text-sm text-slate-500">{t("Warehouse")}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
                                                        <CreditCard className="h-6 w-6 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-800 dark:text-white">
                                                            {sale?.currency?.name || 'Afghan Afghani'} ({sale?.currency?.code || 'AFN'})
                                                        </p>
                                                        <p className="text-sm text-slate-500">{t("Currency")}</p>
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">{t("Confirmation Status")}</p>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="flex items-center gap-2">
                                                            {sale?.confirmed_by_warehouse ? (
                                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                                            ) : (
                                                                <Clock className="h-5 w-5 text-yellow-600" />
                                                            )}
                                                            <span className="text-sm font-medium">
                                                                {t('Warehouse')}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {sale?.confirmed_by_shop ? (
                                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                                            ) : (
                                                                <Clock className="h-5 w-5 text-yellow-600" />
                                                            )}
                                                            <span className="text-sm font-medium">
                                                                {t('Shop')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>

                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.5, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                                    <ShoppingCart className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Sale Items")}
                                                <Badge variant="secondary" className="ml-auto">
                                                    {sale?.sale_items?.length || 0} {t("items")}
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
                                                        {sale?.sale_items?.length > 0 ? (
                                                            sale.sale_items.map((item, index) => (
                                                                <TableRow
                                                                    key={item.id}
                                                                    className="hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors"
                                                                >
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                                                                                <Package className="h-5 w-5 text-blue-600" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-semibold text-slate-800 dark:text-white">
                                                                                    {item.product?.name || 'N/A'}
                                                                                </p>
                                                                                {item.product?.barcode && (
                                                                                    <div className="flex items-center gap-1 mt-1">
                                                                                        <Barcode className="h-3 w-3 text-slate-400" />
                                                                                        <span className="text-xs text-slate-500 font-mono">
                                                                                            {item.product.barcode}
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex flex-col">
                                                                            <span className="font-semibold text-slate-800 dark:text-white">
                                                                                {item.quantity?.toLocaleString()}
                                                                            </span>
                                                                            <span className="text-xs text-slate-500">
                                                                                {t("pieces")}
                                                                            </span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="font-semibold text-slate-800 dark:text-white">
                                                                        {formatCurrency(item.unit_price)}
                                                                    </TableCell>
                                                                    <TableCell className="font-bold text-green-600">
                                                                        {formatCurrency(item.total)}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan="4" className="h-32 text-center">
                                                                    <div className="flex flex-col items-center gap-4">
                                                                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                                            <Package className="h-8 w-8 text-slate-400" />
                                                                        </div>
                                                                        <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                                                            {t("No items found")}
                                                                        </p>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>

                                            {sale?.sale_items?.length > 0 && (
                                                <div className="border-t border-slate-200 dark:border-slate-700 p-6">
                                                    <div className="flex justify-end">
                                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 min-w-80">
                                                            <div className="space-y-3">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-slate-600 dark:text-slate-400">{t("Total Items")}:</span>
                                                                    <span className="font-semibold">{sale.sale_items.length}</span>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-slate-600 dark:text-slate-400">{t("Total Quantity")}:</span>
                                                                    <span className="font-semibold">{getTotalQuantity().toLocaleString()}</span>
                                                                </div>
                                                                <div className="border-t border-green-200 dark:border-green-800 pt-3">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-lg font-semibold text-slate-800 dark:text-white">{t("Total Amount")}:</span>
                                                                        <span className="text-2xl font-bold text-green-600">{formatCurrency(getTotalAmount())}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {sale?.notes && (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.6, duration: 0.4 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardHeader className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 border-b border-white/30 dark:border-slate-700/50">
                                                <CardTitle className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                                                        <FileText className="h-5 w-5 text-white" />
                                                    </div>
                                                    {t("Notes")}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                                                    <Info className="h-4 w-4 text-blue-600" />
                                                    <AlertDescription className="text-blue-700 dark:text-blue-400">
                                                        {sale.notes}
                                                    </AlertDescription>
                                                </Alert>
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
