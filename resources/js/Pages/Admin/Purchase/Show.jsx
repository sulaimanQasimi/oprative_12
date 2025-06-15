import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
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
    User
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
import { Badge } from "@/Components/ui/badge";
import { motion } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Show({ auth, purchase }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

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
                                    <TabsList className="grid w-full grid-cols-4 h-14 p-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700">
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
                                    </TabsList>

                                    <TabsContent value="overview" className="space-y-6">
                                        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-3">
                                                    <Package className="h-5 w-5 text-green-600" />
                                                    {t("Purchase Summary")}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-center py-8">
                                                    <p className="text-slate-600 dark:text-slate-400">
                                                        {t("Use the tabs above to view items, payments, and additional costs")}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="items" className="space-y-6">
                                        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardHeader className="flex flex-row items-center justify-between">
                                                <CardTitle className="flex items-center gap-3">
                                                    <Package className="h-5 w-5 text-green-600" />
                                                    {t("Purchase Items")}
                                                </CardTitle>
                                                <Link href={route('admin.purchases.items', purchase.id)}>
                                                    <Button className="gap-2">
                                                        <Plus className="h-4 w-4" />
                                                        {t("Manage Items")}
                                                    </Button>
                                                </Link>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-center py-8">
                                                    <p className="text-slate-600 dark:text-slate-400">
                                                        {t("Purchase items will be displayed here")}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="payments" className="space-y-6">
                                        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-3">
                                                    <CreditCard className="h-5 w-5 text-blue-600" />
                                                    {t("Payment History")}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-center py-8">
                                                    <p className="text-slate-600 dark:text-slate-400">
                                                        {t("Payment management will be available in a future update")}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="costs" className="space-y-6">
                                        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-3">
                                                    <DollarSign className="h-5 w-5 text-orange-600" />
                                                    {t("Additional Costs")}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-center py-8">
                                                    <p className="text-slate-600 dark:text-slate-400">
                                                        {t("Additional costs management will be available in a future update")}
                                                    </p>
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