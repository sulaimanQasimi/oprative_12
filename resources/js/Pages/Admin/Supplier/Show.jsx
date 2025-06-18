import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
import {
    Truck,
    ArrowLeft,
    Edit,
    Building,
    Mail,
    Phone,
    MapPin,
    FileText,
    CreditCard,
    BookOpen,
    Globe,
    Trash2,
    CreditCard as PaymentIcon,
    ShoppingBag,
    User,
    DollarSign,
    Calendar,
    Package,
    Sparkles,
    Hash,
    Receipt,
    Calculator,
    AlertCircle,
    CheckCircle,
    Plus,
    Eye,
    Clock,
    Building2,
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
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Show({ auth, supplier, purchases, payments, summary, permissions = {} }) {
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
            currency: 'USD',
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
            <Head title={`${t("Supplier")}: ${supplier.name}`}>
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

            <PageLoader isVisible={loading} icon={Truck} color="indigo" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                <Navigation auth={auth} currentRoute="admin.suppliers" />

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
                                    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-indigo-500 via-blue-500 to-indigo-600 p-4 rounded-2xl shadow-2xl">
                                        <Truck className="w-8 h-8 text-white" />
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {t("Supplier Details")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent"
                                    >
                                        {supplier.name}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Building2 className="w-4 h-4" />
                                        {supplier.contact_name || t("Supplier Account")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-5"
                            >
                                {permissions.can_update && (
                                    <Link href={route('admin.suppliers.edit', supplier.id)}>
                                        <Button className="relative group bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-110 hover:-translate-y-1 w-14 h-14 p-0 rounded-xl border border-white/20 backdrop-blur-sm">
                                            <Edit className="h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                                        </Button>
                                    </Link>
                                )}

                                {permissions.can_delete && (
                                    <Button 
                                        onClick={() => {
                                            if (confirm(t('Are you sure you want to delete this supplier?'))) {
                                                router.delete(route('admin.suppliers.destroy', supplier.id));
                                            }
                                        }}
                                        className="relative group bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 hover:from-rose-600 hover:via-pink-600 hover:to-red-600 text-white shadow-2xl hover:shadow-rose-500/25 transition-all duration-300 hover:scale-110 hover:-translate-y-1 w-14 h-14 p-0 rounded-xl border border-white/20 backdrop-blur-sm"
                                    >
                                        <Trash2 className="h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                                    </Button>
                                )}

                                <Link href={route('admin.suppliers.index')}>
                                    <Button className="relative group bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 hover:from-indigo-600 hover:via-purple-600 hover:to-violet-600 text-white shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-110 hover:-translate-y-1 w-14 h-14 p-0 rounded-xl border border-white/20 backdrop-blur-sm">
                                        <ArrowLeft className="h-5 w-5 relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-indigo-300 dark:scrollbar-thumb-indigo-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="max-w-7xl mx-auto space-y-8"
                            >
                                {/* Tabs for Overview, Purchases, Payments */}
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                                    <TabsList className="grid w-full grid-cols-3 h-14 p-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700">
                                        <TabsTrigger value="overview" className="h-12 text-sm font-semibold">
                                            {t("Overview")}
                                        </TabsTrigger>
                                        <TabsTrigger value="purchases" className="h-12 text-sm font-semibold">
                                            {t("Purchases")}
                                        </TabsTrigger>
                                        <TabsTrigger value="payments" className="h-12 text-sm font-semibold">
                                            {t("Payments")}
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="overview" className="space-y-6">
                                        {/* Supplier Information */}
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="bg-gradient-to-r from-indigo-500/20 via-blue-500/20 to-indigo-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg">
                                                        <Building2 className="h-6 w-6 text-white" />
                                                    </div>
                                                    {t("Supplier Information")}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                            <Building className="w-4 h-4" />
                                                            <span className="text-sm font-medium">{t("Supplier Name")}</span>
                                                        </div>
                                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.name}</p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                            <User className="w-4 h-4" />
                                                            <span className="text-sm font-medium">{t("Contact Person")}</span>
                                                        </div>
                                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.contact_name || t("Not provided")}</p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                            <Mail className="w-4 h-4" />
                                                            <span className="text-sm font-medium">{t("Email Address")}</span>
                                                        </div>
                                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.email || t("Not provided")}</p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                            <Phone className="w-4 h-4" />
                                                            <span className="text-sm font-medium">{t("Phone Number")}</span>
                                                        </div>
                                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.phone || t("Not provided")}</p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                            <MapPin className="w-4 h-4" />
                                                            <span className="text-sm font-medium">{t("Address")}</span>
                                                        </div>
                                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.address || t("Not provided")}</p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                            <Globe className="w-4 h-4" />
                                                            <span className="text-sm font-medium">{t("Location")}</span>
                                                        </div>
                                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                                            {[supplier.city, supplier.state, supplier.country].filter(Boolean).join(", ") || t("Not provided")}
                                                            {supplier.postal_code && <span className="ml-1">({supplier.postal_code})</span>}
                                                        </p>
                                                    </div>

                                                    {supplier.id_number && (
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                <FileText className="w-4 h-4" />
                                                                <span className="text-sm font-medium">{t("ID Number / Tax ID")}</span>
                                                            </div>
                                                            <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.id_number}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="purchases" className="space-y-6">
                                        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="flex items-center gap-3 text-lg">
                                                        <ShoppingBag className="h-5 w-5 text-blue-600" />
                                                        {t("Purchase History")}
                                                        <Badge variant="secondary" className="ml-auto">
                                                            {purchases.total} {t("purchases")}
                                                        </Badge>
                                                    </CardTitle>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <div className="overflow-x-auto">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>{t("Invoice Number")}</TableHead>
                                                                <TableHead>{t("Date")}</TableHead>
                                                                <TableHead>{t("Total Amount")}</TableHead>
                                                                <TableHead>{t("Paid Amount")}</TableHead>
                                                                <TableHead>{t("Status")}</TableHead>
                                                                <TableHead>{t("Actions")}</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {purchases.data?.length > 0 ? (
                                                                purchases.data.map((purchase) => (
                                                                    <TableRow key={purchase.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10">
                                                                        <TableCell>
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                                                                    <FileText className="h-5 w-5 text-slate-500" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="font-semibold">{purchase.invoice_number}</p>
                                                                                    <p className="text-xs text-slate-500">ID: {purchase.id}</p>
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="text-sm text-slate-500">
                                                                            {formatDate(purchase.invoice_date)}
                                                                        </TableCell>
                                                                        <TableCell className="font-bold text-green-600 font-mono">{formatCurrency(purchase.total_amount)}</TableCell>
                                                                        <TableCell className="font-bold text-blue-600 font-mono">{formatCurrency(purchase.paid_amount)}</TableCell>
                                                                        <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                                                                        <TableCell>
                                                                            <div className="flex items-center gap-2">
                                                                                <Link href={route('admin.purchases.show', purchase.id)}>
                                                                                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-blue-100">
                                                                                        <Eye className="h-4 w-4 text-blue-600" />
                                                                                    </Button>
                                                                                </Link>
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))
                                                            ) : (
                                                                <TableRow>
                                                                    <TableCell colSpan="6" className="h-48 text-center">
                                                                        <div className="flex flex-col items-center gap-4">
                                                                            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                                                <ShoppingBag className="h-8 w-8 text-slate-400" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-medium">{t("No purchases found")}</p>
                                                                                <p className="text-sm text-slate-500">{t("This supplier has no purchase history yet.")}</p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>

                                                {/* Pagination */}
                                                {purchases.last_page > 1 && (
                                                    <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                                                {t("Showing")} {purchases.from} {t("to")} {purchases.to} {t("of")} {purchases.total} {t("results")}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {purchases.prev_page_url && (
                                                                    <Link href={purchases.prev_page_url} preserveState>
                                                                        <Button variant="outline" size="sm">
                                                                            {t("Previous")}
                                                                        </Button>
                                                                    </Link>
                                                                )}
                                                                {purchases.next_page_url && (
                                                                    <Link href={purchases.next_page_url} preserveState>
                                                                        <Button variant="outline" size="sm">
                                                                            {t("Next")}
                                                                        </Button>
                                                                    </Link>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="payments" className="space-y-6">
                                        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="flex items-center gap-3 text-lg">
                                                        <CreditCard className="h-5 w-5 text-purple-600" />
                                                        {t("Payment History")}
                                                        <Badge variant="secondary" className="ml-auto">
                                                            {payments.total} {t("payments")}
                                                        </Badge>
                                                    </CardTitle>
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
                                                                <TableHead>{t("Payment Date")}</TableHead>
                                                                <TableHead>{t("Notes")}</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {payments.data?.length > 0 ? (
                                                                payments.data.map((payment) => (
                                                                    <TableRow key={payment.id} className="hover:bg-purple-50/50 dark:hover:bg-purple-900/10">
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
                                                                        <TableCell className="text-sm text-slate-500">
                                                                            {formatDate(payment.payment_date)}
                                                                        </TableCell>
                                                                        <TableCell className="text-sm text-slate-500 max-w-xs truncate">
                                                                            {payment.notes || '-'}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))
                                                            ) : (
                                                                <TableRow>
                                                                    <TableCell colSpan="5" className="h-48 text-center">
                                                                        <div className="flex flex-col items-center gap-4">
                                                                            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                                                <CreditCard className="h-8 w-8 text-slate-400" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-medium">{t("No payments found")}</p>
                                                                                <p className="text-sm text-slate-500">{t("This supplier has no payment history yet.")}</p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>

                                                {/* Pagination */}
                                                {payments.last_page > 1 && (
                                                    <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                                                {t("Showing")} {payments.from} {t("to")} {payments.to} {t("of")} {payments.total} {t("results")}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {payments.prev_page_url && (
                                                                    <Link href={payments.prev_page_url} preserveState>
                                                                        <Button variant="outline" size="sm">
                                                                            {t("Previous")}
                                                                        </Button>
                                                                    </Link>
                                                                )}
                                                                {payments.next_page_url && (
                                                                    <Link href={payments.next_page_url} preserveState>
                                                                        <Button variant="outline" size="sm">
                                                                            {t("Next")}
                                                                        </Button>
                                                                    </Link>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
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
