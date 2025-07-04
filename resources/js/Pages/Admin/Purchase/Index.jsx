import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ShoppingCart,
    Plus,
    Eye,
    Edit,
    Trash2,
    Search,
    Filter,
    Download,
    Sparkles,
    DollarSign,
    Calendar,
    FileText,
    Truck
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { motion } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Index({ auth, purchases, suppliers }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

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
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'purchase': { 
                color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', 
                label: t('Purchase') 
            },
            'onway': { 
                color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', 
                label: t('On Way') 
            },
            'arrived': { 
                color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', 
                label: t('Arrived') 
            },
            'return': { 
                color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', 
                label: t('Return') 
            },
        };
        const config = statusConfig[status] || { 
            color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300', 
            label: status 
        };
        return <Badge className={`${config.color} font-medium px-3 py-1 text-sm`}>{config.label}</Badge>;
    };

    const purchaseData = purchases?.data || purchases || [];
    const totalPurchases = purchaseData.length;
    const totalAmount = purchaseData.reduce((sum, purchase) => sum + (purchase.total_amount || 0), 0);

    return (
        <>
            <Head title={t("Purchases")}>
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
                        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-700/60 py-6 px-8 sticky top-0 z-30 shadow-sm dark:shadow-slate-900/20"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-2xl blur-lg opacity-60 dark:opacity-40"></div>
                                    <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 p-4 rounded-2xl shadow-2xl">
                                        <ShoppingCart className="w-8 h-8 text-white" />
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
                                        {t("Purchase Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent"
                                    >
                                        {t("Purchases")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        {t("Manage purchase orders and supplier transactions")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Button 
                                    variant="outline" 
                                    className="gap-2 hover:scale-105 transition-all duration-200 border-slate-300 dark:border-slate-600 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 text-slate-700 dark:text-slate-200 hover:text-green-700 dark:hover:text-green-300"
                                >
                                    <Download className="h-4 w-4" />
                                    {t("Export")}
                                </Button>
                                <Link href={route("admin.purchases.create")}>
                                    <Button className="gap-2 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border-0">
                                        <Plus className="h-4 w-4" />
                                        {t("New Purchase")}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto p-8">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="space-y-8"
                        >
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                    {t("Total Purchases")}
                                                </p>
                                                <p className="text-3xl font-bold text-green-600">{totalPurchases}</p>
                                            </div>
                                            <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl">
                                                <ShoppingCart className="h-8 w-8 text-green-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                    {t("Total Amount")}
                                                </p>
                                                <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalAmount)}</p>
                                            </div>
                                            <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl">
                                                <DollarSign className="h-8 w-8 text-blue-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                    {t("Suppliers")}
                                                </p>
                                                <p className="text-3xl font-bold text-purple-600">{suppliers?.length || 0}</p>
                                            </div>
                                            <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl">
                                                <Truck className="h-8 w-8 text-purple-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Search */}
                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                <CardContent className="p-6">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                        <Input
                                            placeholder={t("Search purchases...")}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-12 h-12 text-lg border-2 border-green-200 focus:border-green-500 rounded-xl"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Purchases Table */}
                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-xl">
                                <CardHeader className="border-b border-slate-200 dark:border-slate-600">
                                    <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
                                        <ShoppingCart className="h-6 w-6 text-green-600" />
                                        {t("Purchase Orders")}
                                        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">{purchaseData.length}</Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>{t("Invoice")}</TableHead>
                                                <TableHead>{t("Supplier")}</TableHead>
                                                <TableHead>{t("Date")}</TableHead>
                                                <TableHead>{t("Amount")}</TableHead>
                                                <TableHead>{t("Status")}</TableHead>
                                                <TableHead className="text-right">{t("Actions")}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {purchaseData.length > 0 ? (
                                                purchaseData.map((purchase) => (
                                                    <TableRow key={purchase.id} className="hover:bg-green-50 dark:hover:bg-green-900/10">
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-semibold text-slate-800 dark:text-slate-200">{purchase.invoice_number}</div>
                                                                    <div className="text-sm text-slate-500 dark:text-slate-400">#{purchase.id}</div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                                                    <Truck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-slate-800 dark:text-slate-200">{purchase.supplier?.name || 'N/A'}</div>
                                                                    <div className="text-sm text-slate-500 dark:text-slate-400">{purchase.supplier?.email || ''}</div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                                <span className="text-slate-700 dark:text-slate-300">{formatDate(purchase.invoice_date)}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="font-bold text-green-600 dark:text-green-400 text-lg">
                                                                {formatCurrency(purchase.total_amount)}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Link href={route("admin.purchases.show", purchase.id)}>
                                                                    <Button size="sm" variant="outline" className="h-10 w-10 p-0 border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-700 dark:hover:border-blue-600 dark:hover:bg-blue-900/20 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-200 shadow-sm hover:shadow-md">
                                                                        <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                                    </Button>
                                                                </Link>
                                                                <Link href={route("admin.purchases.edit", purchase.id)}>
                                                                    <Button size="sm" variant="outline" className="h-10 w-10 p-0 border-2 border-green-200 hover:border-green-300 hover:bg-green-50 dark:border-green-700 dark:hover:border-green-600 dark:hover:bg-green-900/20 dark:text-green-400 dark:hover:text-green-300 transition-all duration-200 shadow-sm hover:shadow-md">
                                                                        <Edit className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                                    </Button>
                                                                </Link>
                                                                <Button size="sm" variant="outline" className="h-10 w-10 p-0 border-2 border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-700 dark:hover:border-red-600 dark:hover:bg-red-900/20 dark:text-red-400 dark:hover:text-red-300 transition-all duration-200 shadow-sm hover:shadow-md">
                                                                    <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan="6" className="h-40 text-center py-8">
                                                        <div className="flex flex-col items-center gap-4">
                                                            <ShoppingCart className="h-12 w-12 text-slate-400 dark:text-slate-500" />
                                                            <p className="text-xl font-medium text-slate-600 dark:text-slate-400">
                                                                {t("No purchases found")}
                                                            </p>
                                                            <Link href={route("admin.purchases.create")}>
                                                                <Button className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3">
                                                                    <Plus className="h-5 w-5" />
                                                                    {t("Create First Purchase")}
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </main>
                </div>
            </motion.div>
        </>
    );
} 