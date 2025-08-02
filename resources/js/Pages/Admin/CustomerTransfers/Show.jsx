import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Store,
    ArrowLeft,
    Edit,
    Package,
    Users,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    Trash2,
    Printer,
    TrendingUp,
    TrendingDown,
    User,
    Mail,
    Phone,
    MapPin,
    AlertCircle
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
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";
import BackButton from "@/Components/BackButton";
import ActionButton from "@/Components/ActionButton";

export default function Show({ auth, transfer }) {
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

    const handleCompleteTransfer = () => {
        if (confirm(t("Are you sure you want to complete this transfer?"))) {
            router.post(route('admin.customer-transfers.complete', transfer.id));
        }
    };

    const handleCancelTransfer = () => {
        if (confirm(t("Are you sure you want to cancel this transfer?"))) {
            router.post(route('admin.customer-transfers.cancel', transfer.id));
        }
    };

    const handleDeleteTransfer = () => {
        if (confirm(t("Are you sure you want to delete this transfer?"))) {
            router.delete(route('admin.customer-transfers.destroy', transfer.id));
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', icon: Clock, label: t('Pending') },
            completed: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircle, label: t('Completed') },
            cancelled: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', icon: XCircle, label: t('Cancelled') },
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;
        return (
            <Badge className={`${config.color} border-0 flex items-center gap-1`}>
                <Icon className="w-3 h-3" />
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
            <Head title={`${transfer.reference_number} - ${t("Transfer Details")}`}>
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
                <Navigation auth={auth} currentRoute="admin.customer-transfers" />

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
                                    <div className="absolute -inset-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 p-4 rounded-2xl shadow-2xl">
                                        <Package className="w-8 h-8 text-white" />
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
                                        <Users className="w-4 h-4" />
                                        {t("Transfer Details")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent"
                                    >
                                        {transfer.reference_number}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Store className="w-4 h-4" />
                                        {t("Customer transfer information")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center gap-x-2"
                            >
                                {transfer.status === 'pending' && (
                                    <>
                                        <Button
                                            onClick={handleCompleteTransfer}
                                            className="gap-2 bg-green-600 hover:bg-green-700"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            {t("Complete")}
                                        </Button>
                                        <Button
                                            onClick={handleCancelTransfer}
                                            variant="outline"
                                            className="gap-2 border-red-300 text-red-600 hover:bg-red-50"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            {t("Cancel")}
                                        </Button>
                                    </>
                                )}
                                
                                {transfer.status === 'pending' && (
                                    <Button
                                        onClick={handleDeleteTransfer}
                                        variant="outline"
                                        className="gap-2 border-red-300 text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        {t("Delete")}
                                    </Button>
                                )}
                                
                                <BackButton link={route("admin.customer-transfers.index")} />
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-green-300 dark:scrollbar-thumb-green-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="max-w-7xl mx-auto space-y-8"
                            >
                                {/* Transfer Overview */}
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.9, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                        <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                                                    <Package className="h-6 w-6 text-white" />
                                                </div>
                                                {t("Transfer Information")}
                                                {getStatusBadge(transfer.status)}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                        <Package className="w-4 h-4" />
                                                        <span className="text-sm font-medium">{t("Reference")}</span>
                                                    </div>
                                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{transfer.reference_number}</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                        <Calendar className="w-4 h-4" />
                                                        <span className="text-sm font-medium">{t("Transfer Date")}</span>
                                                    </div>
                                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                                        {formatDate(transfer.transfer_date)}
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                        <Users className="w-4 h-4" />
                                                        <span className="text-sm font-medium">{t("Created By")}</span>
                                                    </div>
                                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{transfer.creator?.name}</p>
                                                </div>

                                                {transfer.completed_at && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                            <CheckCircle className="w-4 h-4" />
                                                            <span className="text-sm font-medium">{t("Completed At")}</span>
                                                        </div>
                                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                                            {formatDate(transfer.completed_at)}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {transfer.notes && (
                                                <div className="mt-6 space-y-2">
                                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                        <AlertCircle className="w-4 h-4" />
                                                        <span className="text-sm font-medium">{t("Notes")}</span>
                                                    </div>
                                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{transfer.notes}</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Customer Information */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.0, duration: 0.4 }}
                                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                                >
                                    {/* From Customer */}
                                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                <div className="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl shadow-lg">
                                                    <TrendingDown className="h-6 w-6 text-white" />
                                                </div>
                                                {t("From Customer")}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-red-100 rounded-lg">
                                                        <User className="w-5 h-5 text-red-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900 dark:text-white">{transfer.from_customer?.name}</p>
                                                        <p className="text-sm text-slate-500">{transfer.from_customer?.email}</p>
                                                    </div>
                                                </div>
                                                
                                                {transfer.from_customer?.phone && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-red-100 rounded-lg">
                                                            <Phone className="w-4 h-4 text-red-600" />
                                                        </div>
                                                        <p className="text-slate-700 dark:text-slate-300">{transfer.from_customer.phone}</p>
                                                    </div>
                                                )}
                                                
                                                {transfer.from_customer?.address && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-red-100 rounded-lg">
                                                            <MapPin className="w-4 h-4 text-red-600" />
                                                        </div>
                                                        <p className="text-slate-700 dark:text-slate-300">{transfer.from_customer.address}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* To Customer */}
                                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                                                    <TrendingUp className="h-6 w-6 text-white" />
                                                </div>
                                                {t("To Customer")}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-green-100 rounded-lg">
                                                        <User className="w-5 h-5 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900 dark:text-white">{transfer.to_customer?.name}</p>
                                                        <p className="text-sm text-slate-500">{transfer.to_customer?.email}</p>
                                                    </div>
                                                </div>
                                                
                                                {transfer.to_customer?.phone && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-green-100 rounded-lg">
                                                            <Phone className="w-4 h-4 text-green-600" />
                                                        </div>
                                                        <p className="text-slate-700 dark:text-slate-300">{transfer.to_customer.phone}</p>
                                                    </div>
                                                )}
                                                
                                                {transfer.to_customer?.address && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-green-100 rounded-lg">
                                                            <MapPin className="w-4 h-4 text-green-600" />
                                                        </div>
                                                        <p className="text-slate-700 dark:text-slate-300">{transfer.to_customer.address}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Transfer Items */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.1, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="flex flex-row items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <Package className="w-5 h-5 text-green-600" />
                                                {t("Transfer Items")}
                                                <Badge variant="secondary">
                                                    {transfer.transfer_items?.length || 0}
                                                </Badge>
                                            </CardTitle>
                                            <div className="text-right">
                                                <p className="text-sm text-slate-600 dark:text-slate-400">{t("Total Amount")}</p>
                                                <p className="text-2xl font-bold text-green-600">
                                                    {formatCurrency(transfer.total_amount || 0)}
                                                </p>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            {transfer.transfer_items && transfer.transfer_items.length > 0 ? (
                                                <div className="overflow-x-auto">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>{t("Product")}</TableHead>
                                                                <TableHead>{t("Batch")}</TableHead>
                                                                <TableHead>{t("Quantity")}</TableHead>
                                                                <TableHead>{t("Unit Price")}</TableHead>
                                                                <TableHead>{t("Total")}</TableHead>
                                                                <TableHead>{t("Unit")}</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {transfer.transfer_items.map((item) => (
                                                                <TableRow key={item.id}>
                                                                    <TableCell>
                                                                        <div className="space-y-1">
                                                                            <div className="font-medium">{item.product?.name}</div>
                                                                            <div className="text-sm text-slate-500">{item.product?.barcode}</div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {item.batch?.name || '-'}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <span className="font-semibold">{item.quantity}</span>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {formatCurrency(item.unit_price)}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <span className="font-semibold text-green-600">
                                                                            {formatCurrency(item.total_price)}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="space-y-1">
                                                                            <div className="text-sm">{item.unit_name || item.unit?.name}</div>
                                                                            <div className="text-xs text-slate-500">{item.unit_type}</div>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                                    <p className="text-slate-500">{t("No transfer items found")}</p>
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