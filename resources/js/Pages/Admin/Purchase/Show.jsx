import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    ShoppingCart,
    Package,
    DollarSign,
    Calendar,
    Edit,
    Trash2,
    FileText,
    Truck,
    Globe,
    CheckCircle,
    Clock,
    Building2,
    CreditCard,
    Plus,
    Eye,
    Sparkles,
    User,
    Hash,
    Receipt,
    Calculator,
    AlertCircle
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/Components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { motion } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Show({ auth, purchase, purchaseItems, additionalCosts, payments, warehouses }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [selectedWarehouse, setSelectedWarehouse] = useState("");
    const [warehouseTransferLoading, setWarehouseTransferLoading] = useState(false);
    const [transferNotes, setTransferNotes] = useState("");

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
            currency: purchase.currency?.code || 'USD',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'purchase': { color: 'bg-blue-100 text-blue-700', label: t('Purchase') },
            'onway': { color: 'bg-yellow-100 text-yellow-700', label: t('On Way') },
            'on_border': { color: 'bg-orange-100 text-orange-700', label: t('On Border') },
            'on_plan': { color: 'bg-purple-100 text-purple-700', label: t('On Plan') },
            'on_ship': { color: 'bg-indigo-100 text-indigo-700', label: t('On Ship') },
            'arrived': { color: 'bg-green-100 text-green-700', label: t('Arrived') },
            'warehouse_moved': { color: 'bg-emerald-100 text-emerald-700', label: t('Moved to Warehouse') },
            'return': { color: 'bg-red-100 text-red-700', label: t('Return') },
        };

        const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-700', label: status };
        return (
            <Badge className={`${config.color} font-medium`}>
                {config.label}
            </Badge>
        );
    };

    const handleDeleteItem = (itemId) => {
        if (confirm(t('Are you sure you want to delete this item?'))) {
            router.delete(route('admin.purchases.items.destroy', [purchase.id, itemId]));
        }
    };

    const handleWarehouseTransfer = () => {
        if (!selectedWarehouse) {
            alert(t('Please select a warehouse'));
            return;
        }

        if (confirm(t('Are you sure you want to transfer all items to the selected warehouse? This action cannot be undone.'))) {
            setWarehouseTransferLoading(true);
            router.post(route('admin.purchases.warehouse-transfer.store', purchase.id), {
                warehouse_id: selectedWarehouse,
                notes: transferNotes,
            }, {
                onFinish: () => setWarehouseTransferLoading(false),
                onError: () => setWarehouseTransferLoading(false),
            });
        }
    };

    const getTotalAmount = () => (purchaseItems || []).reduce((sum, item) => sum + parseFloat(item.total_price || 0), 0);
    const getTotalQuantity = () => (purchaseItems || []).reduce((sum, item) => sum + parseFloat(item.quantity || 0), 0);

    // Check if warehouse tab should be shown
    const showWarehouseTab = purchase.status === 'arrived' && !purchase.is_moved_to_warehouse;

    return (
        <>
            <Head title={`${t("Purchase")} - ${purchase.invoice_number}`}>
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

            <PageLoader isVisible={loading} icon={ShoppingCart} color="green" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                <Navigation auth={auth} currentRoute="admin.purchases" />

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
                                    className="relative"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 p-4 rounded-2xl shadow-2xl">
                                        <ShoppingCart className="w-8 h-8 text-white" />
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
                                        {t("Purchase Details")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent"
                                    >
                                        {purchase.invoice_number}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Calendar className="w-4 h-4" />
                                        {formatDate(purchase.invoice_date)}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-5"
                            >
                                <Link href={route('admin.purchases.edit', purchase.id)}>
                                    <Button className="relative group bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-110 hover:-translate-y-1 w-14 h-14 p-0 rounded-xl border border-white/20 backdrop-blur-sm">
                                        <Edit className="h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                                    </Button>
                                </Link>

                                <Button className="relative group bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 hover:from-rose-600 hover:via-pink-600 hover:to-red-600 text-white shadow-2xl hover:shadow-rose-500/25 transition-all duration-300 hover:scale-110 hover:-translate-y-1 w-14 h-14 p-0 rounded-xl border border-white/20 backdrop-blur-sm">
                                    <Trash2 className="h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                                </Button>

                                <Link href={route('admin.purchases.index')}>
                                    <Button className="relative group bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 hover:from-indigo-600 hover:via-purple-600 hover:to-violet-600 text-white shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-110 hover:-translate-y-1 w-14 h-14 p-0 rounded-xl border border-white/20 backdrop-blur-sm">
                                        <ArrowLeft className="h-5 w-5 relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-green-300 dark:scrollbar-thumb-green-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="max-w-7xl mx-auto space-y-8"
                            >
                                {/* Financial Overview Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-green-600 dark:text-green-400">{t("Total Amount")}</p>
                                                    <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                                                        {formatCurrency(purchase.total_amount)}
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-green-500 rounded-xl">
                                                    <DollarSign className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/30">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{t("Paid Amount")}</p>
                                                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                                                        {formatCurrency(purchase.paid_amount)}
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-blue-500 rounded-xl">
                                                    <CreditCard className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/30">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">{t("Due Amount")}</p>
                                                    <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                                                        {formatCurrency(purchase.due_amount)}
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-orange-500 rounded-xl">
                                                    <Clock className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/30">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">{t("Status")}</p>
                                                    <div className="mt-2">
                                                        {getStatusBadge(purchase.status)}
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-purple-500 rounded-xl">
                                                    <CheckCircle className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Purchase Information */}
                                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                    <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                        <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                                                <ShoppingCart className="h-6 w-6 text-white" />
                                            </div>
                                            {t("Purchase Information")}
                                            {getStatusBadge(purchase.status)}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                    <FileText className="w-4 h-4" />
                                                    <span className="text-sm font-medium">{t("Invoice Number")}</span>
                                                </div>
                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{purchase.invoice_number}</p>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                    <Truck className="w-4 h-4" />
                                                    <span className="text-sm font-medium">{t("Supplier")}</span>
                                                </div>
                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{purchase.supplier?.name}</p>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                    <Globe className="w-4 h-4" />
                                                    <span className="text-sm font-medium">{t("Currency")}</span>
                                                </div>
                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                                    {purchase.currency?.name} ({purchase.currency?.code}) - Rate: {purchase.currency_rate}
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="text-sm font-medium">{t("Invoice Date")}</span>
                                                </div>
                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{formatDate(purchase.invoice_date)}</p>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                    <User className="w-4 h-4" />
                                                    <span className="text-sm font-medium">{t("Created By")}</span>
                                                </div>
                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{purchase.user?.name || t("Unknown")}</p>
                                            </div>

                                            {purchase.reference_no && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                        <FileText className="w-4 h-4" />
                                                        <span className="text-sm font-medium">{t("Reference No")}</span>
                                                    </div>
                                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{purchase.reference_no}</p>
                                                </div>
                                            )}

                                            {purchase.warehouse && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                        <Building2 className="w-4 h-4" />
                                                        <span className="text-sm font-medium">{t("Warehouse")}</span>
                                                    </div>
                                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{purchase.warehouse.name}</p>
                                                </div>
                                            )}
                                        </div>

                                        {purchase.note && (
                                            <div className="mt-6 space-y-2">
                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                    <FileText className="w-4 h-4" />
                                                    <span className="text-sm font-medium">{t("Notes")}</span>
                                                </div>
                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{purchase.note}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Tabs for Items, Payments, Additional Costs */}
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                                    <TabsList className={`grid w-full ${showWarehouseTab ? 'grid-cols-5' : 'grid-cols-4'} h-14 p-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700`}>
                                        <TabsTrigger value="overview" className="h-12 text-sm font-semibold">
                                            {t("Overview")}
                                        </TabsTrigger>
                                        <TabsTrigger value="items" className="h-12 text-sm font-semibold">
                                            {t("Items")}
                                        </TabsTrigger>
                                        <TabsTrigger value="payments" className="h-12 text-sm font-semibold">
                                            {t("Payments")}
                                        </TabsTrigger>
                                        <TabsTrigger value="costs" className="h-12 text-sm font-semibold">
                                            {t("Additional Costs")}
                                        </TabsTrigger>
                                        {showWarehouseTab && (
                                            <TabsTrigger value="warehouse" className="h-12 text-sm font-semibold">
                                                {t("Warehouse")}
                                            </TabsTrigger>
                                        )}
                                    </TabsList>

                                    <TabsContent value="overview" className="space-y-6">
                                        {/* Financial Overview */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                                <CardContent className="p-6 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{t("Items Value")}</p>
                                                        <p className="text-2xl font-bold text-green-600">{formatCurrency(getTotalAmount())}</p>
                                                        <p className="text-xs text-slate-500 mt-1">{(purchaseItems || []).length} {t("items")}</p>
                                                    </div>
                                                    <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-900/50 rounded-xl">
                                                        <Package className="h-6 w-6 text-green-600" />
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                                <CardContent className="p-6 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{t("Additional Costs")}</p>
                                                        <p className="text-2xl font-bold text-orange-600">{formatCurrency((additionalCosts || []).reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0))}</p>
                                                        <p className="text-xs text-slate-500 mt-1">{(additionalCosts || []).length} {t("costs")}</p>
                                                    </div>
                                                    <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-900/50 rounded-xl">
                                                        <Receipt className="h-6 w-6 text-orange-600" />
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                                <CardContent className="p-6 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{t("Total Paid")}</p>
                                                        <p className="text-2xl font-bold text-blue-600">{formatCurrency((payments || []).reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0))}</p>
                                                        <p className="text-xs text-slate-500 mt-1">{(payments || []).length} {t("payments")}</p>
                                                    </div>
                                                    <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-900/50 rounded-xl">
                                                        <CreditCard className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                                <CardContent className="p-6 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{t("Balance Due")}</p>
                                                        <p className={`text-2xl font-bold ${
                                                            (getTotalAmount() + (additionalCosts || []).reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0) - (payments || []).reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0)) > 0 
                                                            ? 'text-red-600' 
                                                            : 'text-emerald-600'
                                                        }`}>
                                                            {formatCurrency(getTotalAmount() + (additionalCosts || []).reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0) - (payments || []).reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0))}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {(getTotalAmount() + (additionalCosts || []).reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0) - (payments || []).reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0)) > 0 
                                                                ? t("Outstanding") 
                                                                : t("Paid in Full")
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className={`p-3 rounded-xl ${
                                                        (getTotalAmount() + (additionalCosts || []).reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0) - (payments || []).reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0)) > 0 
                                                        ? 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-900/50' 
                                                        : 'bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-900/50'
                                                    }`}>
                                                        <DollarSign className={`h-6 w-6 ${
                                                            (getTotalAmount() + (additionalCosts || []).reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0) - (payments || []).reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0)) > 0 
                                                            ? 'text-red-600' 
                                                            : 'text-emerald-600'
                                                        }`} />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Detailed Financial Breakdown */}
                                        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                                <CardTitle className="flex items-center gap-3 text-xl">
                                                    <Calculator className="h-6 w-6 text-indigo-600" />
                                                    {t("Financial Breakdown")}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <div className="space-y-6">
                                                    {/* Purchase Calculation */}
                                                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-6">
                                                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                                                            <Hash className="h-5 w-5 text-indigo-600" />
                                                            {t("Purchase Calculation")}
                                                        </h3>
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                                                                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                                                    <Package className="h-4 w-4" />
                                                                    {t("Items Subtotal")} ({(purchaseItems || []).length} {t("items")})
                                                                </span>
                                                                <span className="font-semibold font-mono">{formatCurrency(getTotalAmount())}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                                                                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                                                    <Receipt className="h-4 w-4" />
                                                                    {t("Additional Costs")} ({(additionalCosts || []).length} {t("costs")})
                                                                </span>
                                                                <span className="font-semibold font-mono text-orange-600">+ {formatCurrency((additionalCosts || []).reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0))}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center py-3 bg-slate-100 dark:bg-slate-800 rounded-lg px-4">
                                                                <span className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                                    <DollarSign className="h-5 w-5" />
                                                                    {t("Total Purchase Amount")}
                                                                </span>
                                                                <span className="text-xl font-bold text-slate-800 dark:text-slate-200 font-mono">
                                                                    {formatCurrency(getTotalAmount() + (additionalCosts || []).reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0))}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Payment Status */}
                                                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-6">
                                                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                                                            <CreditCard className="h-5 w-5 text-blue-600" />
                                                            {t("Payment Status")}
                                                        </h3>
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                                                                <span className="text-slate-600 dark:text-slate-400">
                                                                    {t("Total Amount Due")}
                                                                </span>
                                                                <span className="font-semibold font-mono">
                                                                    {formatCurrency(getTotalAmount() + (additionalCosts || []).reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0))}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                                                                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                                                    <CreditCard className="h-4 w-4" />
                                                                    {t("Total Paid")} ({(payments || []).length} {t("payments")})
                                                                </span>
                                                                <span className="font-semibold font-mono text-blue-600">- {formatCurrency((payments || []).reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0))}</span>
                                                            </div>
                                                            <div className={`flex justify-between items-center py-3 rounded-lg px-4 ${
                                                                (getTotalAmount() + (additionalCosts || []).reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0) - (payments || []).reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0)) > 0 
                                                                ? 'bg-red-50 dark:bg-red-900/20' 
                                                                : 'bg-emerald-50 dark:bg-emerald-900/20'
                                                            }`}>
                                                                <span className={`text-lg font-semibold flex items-center gap-2 ${
                                                                    (getTotalAmount() + (additionalCosts || []).reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0) - (payments || []).reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0)) > 0 
                                                                    ? 'text-red-700 dark:text-red-300' 
                                                                    : 'text-emerald-700 dark:text-emerald-300'
                                                                }`}>
                                                                    {(getTotalAmount() + (additionalCosts || []).reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0) - (payments || []).reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0)) > 0 ? (
                                                                        <AlertCircle className="h-5 w-5" />
                                                                    ) : (
                                                                        <CheckCircle className="h-5 w-5" />
                                                                    )}
                                                                    {(getTotalAmount() + (additionalCosts || []).reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0) - (payments || []).reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0)) > 0 
                                                                        ? t("Remaining Balance") 
                                                                        : t("Fully Paid")
                                                                    }
                                                                </span>
                                                                <span className={`text-xl font-bold font-mono ${
                                                                    (getTotalAmount() + (additionalCosts || []).reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0) - (payments || []).reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0)) > 0 
                                                                    ? 'text-red-700 dark:text-red-300' 
                                                                    : 'text-emerald-700 dark:text-emerald-300'
                                                                }`}>
                                                                    {formatCurrency(Math.abs(getTotalAmount() + (additionalCosts || []).reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0) - (payments || []).reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0)))}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Payment Progress */}
                                                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-6">
                                                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                                                            <Hash className="h-5 w-5 text-purple-600" />
                                                            {t("Payment Progress")}
                                                        </h3>
                                                        <div className="space-y-4">
                                                            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                                                <span>{t("Payment Completion")}</span>
                                                                <span>
                                                                    {(getTotalAmount() + (additionalCosts || []).reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0)) > 0 
                                                                        ? Math.round(((payments || []).reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0) / (getTotalAmount() + (additionalCosts || []).reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0))) * 100)
                                                                        : 100
                                                                    }%
                                                                </span>
                                                            </div>
                                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                                                                <div 
                                                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                                                                    style={{ 
                                                                        width: `${(getTotalAmount() + (additionalCosts || []).reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0)) > 0 
                                                                            ? Math.min(((payments || []).reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0) / (getTotalAmount() + (additionalCosts || []).reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0))) * 100, 100)
                                                                            : 100
                                                                        }%` 
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Quick Actions */}
                                        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                                <CardTitle className="flex items-center gap-3 text-xl">
                                                    <Sparkles className="h-6 w-6 text-purple-600" />
                                                    {t("Quick Actions")}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <Link href={route('admin.purchases.items.create', purchase.id)}>
                                                        <Button className="w-full gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:scale-105 transition-all duration-200 shadow-lg">
                                                            <Package className="h-4 w-4" />
                                                            {t("Add Item")}
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('admin.purchases.payments.create', purchase.id)}>
                                                        <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 transition-all duration-200 shadow-lg">
                                                            <CreditCard className="h-4 w-4" />
                                                            {t("Add Payment")}
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('admin.purchases.additional-costs.create', purchase.id)}>
                                                        <Button className="w-full gap-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:scale-105 transition-all duration-200 shadow-lg">
                                                            <Receipt className="h-4 w-4" />
                                                            {t("Add Cost")}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="items" className="space-y-6">
                                        {/* Items Summary Cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                                <CardContent className="p-6 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{t("Total Items")}</p>
                                                        <p className="text-3xl font-bold text-green-600">{(purchaseItems || []).length}</p>
                                                        <p className="text-xs text-slate-500 mt-1">{t("Products")}</p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-900/50 rounded-2xl">
                                                        <Package className="h-8 w-8 text-green-600" />
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                                <CardContent className="p-6 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{t("Total Quantity")}</p>
                                                        <p className="text-3xl font-bold text-blue-600">{getTotalQuantity().toLocaleString()}</p>
                                                        <p className="text-xs text-slate-500 mt-1">{t("Units Ordered")}</p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-900/50 rounded-2xl">
                                                        <Hash className="h-8 w-8 text-blue-600" />
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                                <CardContent className="p-6 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{t("Total Amount")}</p>
                                                        <p className="text-3xl font-bold text-purple-600">{formatCurrency(getTotalAmount())}</p>
                                                        <p className="text-xs text-slate-500 mt-1">{t("Purchase Value")}</p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-900/50 rounded-2xl">
                                                        <DollarSign className="h-8 w-8 text-purple-600" />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Items List */}
                                        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="flex items-center gap-3 text-lg">
                                                        <Package className="h-5 w-5 text-green-600" />
                                                        {t("Purchase Items List")}
                                                        <Badge variant="secondary" className="ml-auto">
                                                            {(purchaseItems || []).length} {t("items")}
                                                        </Badge>
                                                    </CardTitle>
                                                    <Link href={route('admin.purchases.items.create', purchase.id)}>
                                                        <Button className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:scale-105 transition-all duration-200 shadow-lg">
                                                            <Plus className="h-4 w-4" />
                                                            {t("Add Item")}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <div className="overflow-x-auto">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>{t("Product")}</TableHead>
                                                                <TableHead>{t("Input Qty")}</TableHead>
                                                                <TableHead>{t("Unit Type")}</TableHead>
                                                                <TableHead>{t("Unit Price")}</TableHead>
                                                                <TableHead>{t("Total Price")}</TableHead>
                                                                <TableHead>{t("Actual Qty (DB)")}</TableHead>
                                                                <TableHead>{t("Date Added")}</TableHead>
                                                                <TableHead>{t("Actions")}</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {(purchaseItems || []).length > 0 ? (
                                                                purchaseItems.map((item) => (
                                                                    <TableRow key={item.id} className="hover:bg-green-50/50 dark:hover:bg-green-900/10">
                                                                        <TableCell>
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                                                                    <Package className="h-5 w-5 text-slate-500" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="font-semibold">{item.product?.name || 'N/A'}</p>
                                                                                    <p className="text-xs text-slate-500">{item.product?.barcode}</p>
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <div className="space-y-1">
                                                                                <Badge variant="secondary" className="font-mono text-xs">
                                                                                    {(() => {
                                                                                        const product = item.product;
                                                                                        if (item.unit_type === 'wholesale' && product?.whole_sale_unit_amount > 0) {
                                                                                            return (parseFloat(item.quantity) / product.whole_sale_unit_amount).toFixed(2);
                                                                                        } else if (item.unit_type === 'retail' && product?.retails_sale_unit_amount > 0) {
                                                                                            return (parseFloat(item.quantity) / product.retails_sale_unit_amount).toFixed(2);
                                                                                        }
                                                                                        return parseFloat(item.quantity).toLocaleString();
                                                                                    })()}
                                                                                </Badge>
                                                                                <div className="text-xs text-slate-500">
                                                                                    {item.unit_type ? `${item.unit_type} units` : 'units'}
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Badge variant="outline" className={`${item.unit_type === 'wholesale' ? 'border-orange-300 text-orange-700 bg-orange-50 dark:bg-orange-900/30' : 'border-blue-300 text-blue-700 bg-blue-50 dark:bg-blue-900/30'}`}>
                                                                                {item.unit_type ? t(item.unit_type.charAt(0).toUpperCase() + item.unit_type.slice(1)) : '-'}
                                                                            </Badge>
                                                                        </TableCell>
                                                                        <TableCell className="font-mono">{formatCurrency(item.price)}</TableCell>
                                                                        <TableCell className="font-bold text-green-600 font-mono">{formatCurrency(item.total_price)}</TableCell>
                                                                        <TableCell>
                                                                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-mono">
                                                                                {parseFloat(item.quantity).toLocaleString()}
                                                                            </Badge>
                                                                        </TableCell>
                                                                        <TableCell className="text-sm text-slate-500">
                                                                            {new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <div className="flex items-center gap-2">
                                                                                <Button size="icon" variant="ghost" onClick={() => handleDeleteItem(item.id)} className="h-8 w-8 hover:bg-red-100">
                                                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                                                </Button>
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))
                                                            ) : (
                                                                <TableRow>
                                                                    <TableCell colSpan="8" className="h-48 text-center">
                                                                        <div className="flex flex-col items-center gap-4">
                                                                            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                                                <Package className="h-8 w-8 text-slate-400" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-medium">{t("This purchase has no items yet")}</p>
                                                                                <p className="text-sm text-slate-500">{t("Click the button below to add the first item.")}</p>
                                                                            </div>
                                                                            <Link href={route('admin.purchases.items.create', purchase.id)}>
                                                                                <Button className="gap-2 mt-2">
                                                                                    <Plus className="h-4 w-4" />
                                                                                    {t("Add First Item")}
                                                                                </Button>
                                                                            </Link>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="payments" className="space-y-6">
                                        {/* Payments Summary Cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                                <CardContent className="p-6 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{t("Total Payments")}</p>
                                                        <p className="text-3xl font-bold text-blue-600">{(payments || []).length}</p>
                                                        <p className="text-xs text-slate-500 mt-1">{t("Payment Records")}</p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-900/50 rounded-2xl">
                                                        <CreditCard className="h-8 w-8 text-blue-600" />
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                                <CardContent className="p-6 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{t("Total Paid")}</p>
                                                        <p className="text-3xl font-bold text-green-600">{formatCurrency((payments || []).reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0))}</p>
                                                        <p className="text-xs text-slate-500 mt-1">{t("Amount Paid")}</p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-900/50 rounded-2xl">
                                                        <DollarSign className="h-8 w-8 text-green-600" />
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                                <CardContent className="p-6 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{t("Average Payment")}</p>
                                                        <p className="text-3xl font-bold text-purple-600">
                                                            {formatCurrency((payments || []).length > 0 ? 
                                                                (payments || []).reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0) / (payments || []).length 
                                                                : 0)}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">{t("Per Payment")}</p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-900/50 rounded-2xl">
                                                        <Calculator className="h-8 w-8 text-purple-600" />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Payments List */}
                                        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="flex items-center gap-3 text-lg">
                                                        <CreditCard className="h-5 w-5 text-blue-600" />
                                                        {t("Payment History")}
                                                        <Badge variant="secondary" className="ml-auto">
                                                            {(payments || []).length} {t("payments")}
                                                        </Badge>
                                                    </CardTitle>
                                                    <Link href={route('admin.purchases.payments.create', purchase.id)}>
                                                        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 transition-all duration-200 shadow-lg">
                                                            <Plus className="h-4 w-4" />
                                                            {t("Add Payment")}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <div className="overflow-x-auto">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>{t("Amount")}</TableHead>
                                                                <TableHead>{t("Payment Method")}</TableHead>
                                                                <TableHead>{t("Reference")}</TableHead>
                                                                <TableHead>{t("Supplier")}</TableHead>
                                                                <TableHead>{t("Payment Date")}</TableHead>
                                                                <TableHead>{t("Actions")}</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {(payments || []).length > 0 ? (
                                                                (payments || []).map((payment) => (
                                                                    <TableRow key={payment.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10">
                                                                        <TableCell className="font-bold text-green-600 font-mono">{formatCurrency(payment.amount)}</TableCell>
                                                                        <TableCell>
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                                                                    <CreditCard className="h-5 w-5 text-slate-500" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="font-semibold capitalize">{payment.payment_method?.replace('_', ' ')}</p>
                                                                                    {payment.bank_name && (
                                                                                        <p className="text-xs text-slate-500">{payment.bank_name}</p>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {payment.reference_number ? (
                                                                                <Badge variant="outline" className="font-mono text-xs">
                                                                                    {payment.reference_number}
                                                                                </Badge>
                                                                            ) : (
                                                                                <span className="text-slate-400">-</span>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                                                                    <User className="h-5 w-5 text-slate-500" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="font-semibold">{payment.supplier?.name}</p>
                                                                                    <p className="text-xs text-slate-500">Supplier</p>
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="text-sm text-slate-500">
                                                                            {new Date(payment.payment_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <div className="flex items-center gap-2">
                                                                                <Button 
                                                                                    size="icon" 
                                                                                    variant="ghost" 
                                                                                    onClick={() => {
                                                                                        if (confirm(t('Are you sure you want to delete this payment?'))) {
                                                                                            router.delete(route('admin.purchases.payments.destroy', [purchase.id, payment.id]));
                                                                                        }
                                                                                    }} 
                                                                                    className="h-8 w-8 hover:bg-red-100"
                                                                                >
                                                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                                                </Button>
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))
                                                            ) : (
                                                                <TableRow>
                                                                    <TableCell colSpan="6" className="h-48 text-center">
                                                                        <div className="flex flex-col items-center gap-4">
                                                                            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                                                <CreditCard className="h-8 w-8 text-slate-400" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-medium">{t("This purchase has no payments yet")}</p>
                                                                                <p className="text-sm text-slate-500">{t("Click the button below to add the first payment.")}</p>
                                                                            </div>
                                                                            <Link href={route('admin.purchases.payments.create', purchase.id)}>
                                                                                <Button className="gap-2 mt-2">
                                                                                    <Plus className="h-4 w-4" />
                                                                                    {t("Add First Payment")}
                                                                                </Button>
                                                                            </Link>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="costs" className="space-y-6">
                                        {/* Additional Costs Summary Cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                                <CardContent className="p-6 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{t("Total Costs")}</p>
                                                        <p className="text-3xl font-bold text-orange-600">{(additionalCosts || []).length}</p>
                                                        <p className="text-xs text-slate-500 mt-1">{t("Additional Costs")}</p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-900/50 rounded-2xl">
                                                        <DollarSign className="h-8 w-8 text-orange-600" />
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                                <CardContent className="p-6 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{t("Total Amount")}</p>
                                                        <p className="text-3xl font-bold text-red-600">{formatCurrency((additionalCosts || []).reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0))}</p>
                                                        <p className="text-xs text-slate-500 mt-1">{t("Extra Costs")}</p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-900/50 rounded-2xl">
                                                        <Receipt className="h-8 w-8 text-red-600" />
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                                <CardContent className="p-6 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{t("Average Cost")}</p>
                                                        <p className="text-3xl font-bold text-purple-600">
                                                            {formatCurrency((additionalCosts || []).length > 0 ? 
                                                                (additionalCosts || []).reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0) / (additionalCosts || []).length 
                                                                : 0)}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">{t("Per Cost")}</p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-900/50 rounded-2xl">
                                                        <Calculator className="h-8 w-8 text-purple-600" />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Additional Costs List */}
                                        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="flex items-center gap-3 text-lg">
                                                        <DollarSign className="h-5 w-5 text-orange-600" />
                                                        {t("Additional Costs List")}
                                                        <Badge variant="secondary" className="ml-auto">
                                                            {(additionalCosts || []).length} {t("costs")}
                                                        </Badge>
                                                    </CardTitle>
                                                    <Link href={route('admin.purchases.additional-costs.create', purchase.id)}>
                                                        <Button className="gap-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:scale-105 transition-all duration-200 shadow-lg">
                                                            <Plus className="h-4 w-4" />
                                                            {t("Add Cost")}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <div className="overflow-x-auto">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>{t("Name")}</TableHead>
                                                                <TableHead>{t("Amount")}</TableHead>
                                                                <TableHead>{t("Date Added")}</TableHead>
                                                                <TableHead>{t("Actions")}</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {(additionalCosts || []).length > 0 ? (
                                                                (additionalCosts || []).map((cost) => (
                                                                    <TableRow key={cost.id} className="hover:bg-orange-50/50 dark:hover:bg-orange-900/10">
                                                                        <TableCell>
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                                                                    <Receipt className="h-5 w-5 text-slate-500" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="font-semibold">{cost.name}</p>
                                                                                    <p className="text-xs text-slate-500">ID: {cost.id}</p>
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="font-bold text-red-600 font-mono">{formatCurrency(cost.amount)}</TableCell>
                                                                        <TableCell className="text-sm text-slate-500">
                                                                            {new Date(cost.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <div className="flex items-center gap-2">
                                                                                <Button 
                                                                                    size="icon" 
                                                                                    variant="ghost" 
                                                                                    onClick={() => {
                                                                                        if (confirm(t('Are you sure you want to delete this additional cost?'))) {
                                                                                            router.delete(route('admin.purchases.additional-costs.destroy', [purchase.id, cost.id]));
                                                                                        }
                                                                                    }} 
                                                                                    className="h-8 w-8 hover:bg-red-100"
                                                                                >
                                                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                                                </Button>
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))
                                                            ) : (
                                                                <TableRow>
                                                                    <TableCell colSpan="4" className="h-48 text-center">
                                                                        <div className="flex flex-col items-center gap-4">
                                                                            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                                                <DollarSign className="h-8 w-8 text-slate-400" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-medium">{t("This purchase has no additional costs yet")}</p>
                                                                                <p className="text-sm text-slate-500">{t("Click the button below to add the first additional cost.")}</p>
                                                                            </div>
                                                                            <Link href={route('admin.purchases.additional-costs.create', purchase.id)}>
                                                                                <Button className="gap-2 mt-2">
                                                                                    <Plus className="h-4 w-4" />
                                                                                    {t("Add First Cost")}
                                                                                </Button>
                                                                            </Link>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {showWarehouseTab && (
                                        <TabsContent value="warehouse" className="space-y-6">
                                            {/* Warehouse Transfer Section */}
                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                                <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                                    <CardTitle className="flex items-center gap-3 text-xl">
                                                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                                                            <Building2 className="h-6 w-6 text-white" />
                                                        </div>
                                                        {t("Transfer to Warehouse")}
                                                        <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700">
                                                            {t("Ready for Transfer")}
                                                        </Badge>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-8">
                                                    <div className="space-y-6">
                                                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                                                            <div className="flex items-start gap-4">
                                                                <div className="p-2 bg-blue-500 rounded-lg">
                                                                    <AlertCircle className="h-5 w-5 text-white" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                                                        {t("Ready for Warehouse Transfer")}
                                                                    </h3>
                                                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                                                        {t("This purchase has arrived and is ready to be transferred to a warehouse. All items will be added to the selected warehouse inventory as incoming stock.")}
                                                                    </p>
                                                                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                                                                        <strong>{t("Items to transfer:")}</strong> {(purchaseItems || []).length} {t("items")} • 
                                                                        <strong className="ml-2">{t("Total quantity:")}</strong> {getTotalQuantity().toLocaleString()} {t("units")}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                            {/* Warehouse Selection */}
                                                            <div className="space-y-4">
                                                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                                    <Building2 className="h-5 w-5 text-indigo-600" />
                                                                    {t("Select Destination Warehouse")}
                                                                </h3>
                                                                
                                                                <div className="space-y-3">
                                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                                                        {t("Warehouse")} <span className="text-red-500">*</span>
                                                                    </label>
                                                                    <select
                                                                        value={selectedWarehouse}
                                                                        onChange={(e) => setSelectedWarehouse(e.target.value)}
                                                                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                                        disabled={warehouseTransferLoading}
                                                                    >
                                                                        <option value="">{t("Choose a warehouse...")}</option>
                                                                        {(warehouses || []).map((warehouse) => (
                                                                            <option key={warehouse.id} value={warehouse.id}>
                                                                                {warehouse.name} ({warehouse.code})
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>

                                                                <div className="space-y-3">
                                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                                                        {t("Transfer Notes")} <span className="text-slate-400">({t("Optional")})</span>
                                                                    </label>
                                                                    <textarea
                                                                        value={transferNotes}
                                                                        onChange={(e) => setTransferNotes(e.target.value)}
                                                                        rows={3}
                                                                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                                                                        placeholder={t("Add any notes about this transfer...")}
                                                                        disabled={warehouseTransferLoading}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Transfer Summary */}
                                                            <div className="space-y-4">
                                                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                                    <Package className="h-5 w-5 text-green-600" />
                                                                    {t("Transfer Summary")}
                                                                </h3>
                                                                
                                                                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-6">
                                                                    <div className="space-y-4">
                                                                        <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                                                                            <span className="text-slate-600 dark:text-slate-400">{t("Purchase Invoice")}</span>
                                                                            <span className="font-semibold font-mono">{purchase.invoice_number}</span>
                                                                        </div>
                                                                        <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                                                                            <span className="text-slate-600 dark:text-slate-400">{t("Total Items")}</span>
                                                                            <span className="font-semibold">{(purchaseItems || []).length} {t("items")}</span>
                                                                        </div>
                                                                        <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                                                                            <span className="text-slate-600 dark:text-slate-400">{t("Total Quantity")}</span>
                                                                            <span className="font-semibold">{getTotalQuantity().toLocaleString()} {t("units")}</span>
                                                                        </div>
                                                                        <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                                                                            <span className="text-slate-600 dark:text-slate-400">{t("Items Value")}</span>
                                                                            <span className="font-semibold font-mono">{formatCurrency(getTotalAmount())}</span>
                                                                        </div>
                                                                        <div className="flex justify-between items-center py-3 bg-slate-100 dark:bg-slate-800 rounded-lg px-4">
                                                                            <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">{t("Status")}</span>
                                                                            <Badge className="bg-green-100 text-green-700">
                                                                                {t("Ready for Transfer")}
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Transfer Action */}
                                                        <div className="flex justify-center pt-6 border-t border-slate-200 dark:border-slate-700">
                                                            <Button
                                                                onClick={handleWarehouseTransfer}
                                                                disabled={!selectedWarehouse || warehouseTransferLoading}
                                                                className="gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 text-lg font-semibold"
                                                            >
                                                                {warehouseTransferLoading ? (
                                                                    <>
                                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                        {t("Transferring...")}
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Building2 className="h-5 w-5" />
                                                                        {t("Transfer to Warehouse")}
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Items Preview */}
                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                                <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                                    <CardTitle className="flex items-center gap-3 text-lg">
                                                        <Package className="h-5 w-5 text-green-600" />
                                                        {t("Items to Transfer")}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-0">
                                                    <div className="overflow-x-auto">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>{t("Product")}</TableHead>
                                                                    <TableHead>{t("Quantity")}</TableHead>
                                                                    <TableHead>{t("Unit Price")}</TableHead>
                                                                    <TableHead>{t("Total Value")}</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {(purchaseItems || []).map((item) => (
                                                                    <TableRow key={item.id} className="hover:bg-green-50/50 dark:hover:bg-green-900/10">
                                                                        <TableCell>
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                                                                    <Package className="h-4 w-4 text-slate-500" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="font-semibold">{item.product?.name || 'N/A'}</p>
                                                                                    <p className="text-xs text-slate-500">{item.product?.barcode}</p>
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Badge variant="secondary" className="font-mono text-xs">
                                                                                {parseFloat(item.quantity).toLocaleString()} {t("units")}
                                                                            </Badge>
                                                                        </TableCell>
                                                                        <TableCell className="font-mono">{formatCurrency(item.price)}</TableCell>
                                                                        <TableCell className="font-bold text-green-600 font-mono">{formatCurrency(item.total_price)}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>
                                    )}
                                </Tabs>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
}
