import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Building2,
    ArrowLeft,
    Store,
    Package,
    TrendingUp,
    DollarSign,
    Calendar,
    Search,
    Eye,
    Edit,
    Trash2,
    Plus
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
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Sales({ auth, warehouse, sales }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredSales, setFilteredSales] = useState(sales || []);

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Filter sales based on search term
    useEffect(() => {
        if (!searchTerm) {
            setFilteredSales(sales);
        } else {
            const filtered = sales.filter(sale =>
                sale.reference_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sale.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sale.product.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredSales(filtered);
        }
    }, [searchTerm, sales]);

    // Calculate totals
    const totalSales = filteredSales.length;
    const totalQuantity = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);
    const totalValue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fa-IR', {
            style: 'currency',
            currency: 'IRR',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fa-IR');
    };

    return (
        <>
            <Head title={`${warehouse?.name} - ${t("Move to Store")}`}>
                <style>{`
                    @keyframes shimmer {
                        0% { background-position: -1000px 0; }
                        100% { background-position: 1000px 0; }
                    }

                    .shimmer {
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                        background-size: 1000px 100%;
                        animation: shimmer 2s infinite;
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
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden"
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
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.4 }}
                                    className="relative"
                                >
                                    <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl blur opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl">
                                        <Store className="w-8 h-8 text-white" />
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-green-600 dark:text-green-400 mb-1"
                                    >
                                        {warehouse?.name} - {t("Move to Store")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
                                    >
                                        {t("Store Movements")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400"
                                    >
                                        {t("Track products moved from warehouse to store")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex gap-3"
                            >
                                <Link href={route("admin.warehouses.show", warehouse.id)}>
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-transform">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Warehouse")}
                                    </Button>
                                </Link>
                                <Link href={route("admin.warehouses.sales.create", warehouse.id)}>
                                    <Button className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:scale-105 transition-transform">
                                        <Plus className="h-4 w-4" />
                                        {t("Move to Store")}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="space-y-6"
                            >
                                {/* Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                        {t("Total Movements")}
                                                    </p>
                                                    <p className="text-3xl font-bold text-green-600">
                                                        {totalSales}
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                                                    <Store className="h-6 w-6 text-green-600" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                        {t("Total Quantity")}
                                                    </p>
                                                    <p className="text-3xl font-bold text-blue-600">
                                                        {totalQuantity}
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                                    <Package className="h-6 w-6 text-blue-600" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                        {t("Total Value")}
                                                    </p>
                                                    <p className="text-3xl font-bold text-purple-600">
                                                        {formatCurrency(totalValue)}
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                                                    <DollarSign className="h-6 w-6 text-purple-600" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Search and Table */}
                                <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <Store className="h-5 w-5 text-green-600" />
                                                {t("Store Movement Records")}
                                            </CardTitle>
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                                <Input
                                                    placeholder={t("Search movements...")}
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-10 w-64"
                                                />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-slate-200 dark:border-slate-700">
                                                        <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                                                            {t("Reference")}
                                                        </th>
                                                        <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                                                            {t("Product")}
                                                        </th>
                                                        <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                                                            {t("Quantity")}
                                                        </th>
                                                        <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                                                            {t("Price")}
                                                        </th>
                                                        <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                                                            {t("Total")}
                                                        </th>
                                                        <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                                                            {t("Date")}
                                                        </th>
                                                        <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                                                            {t("Actions")}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredSales.length > 0 ? (
                                                        filteredSales.map((sale) => (
                                                            <tr
                                                                key={sale.id}
                                                                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                                            >
                                                                <td className="py-3 px-4">
                                                                    <span className="font-mono text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                                                        {sale.reference_number}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <div>
                                                                        <p className="font-medium">{sale.product.name}</p>
                                                                        <p className="text-sm text-slate-500">{sale.product.barcode}</p>
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <Badge variant="secondary">
                                                                        {sale.quantity}
                                                                    </Badge>
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    {formatCurrency(sale.price)}
                                                                </td>
                                                                <td className="py-3 px-4 font-medium">
                                                                    {formatCurrency(sale.total)}
                                                                </td>
                                                                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                                                                    {formatDate(sale.sale_date)}
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                                                            <Eye className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                                                            <Edit className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="7" className="py-8 text-center text-slate-500 dark:text-slate-400">
                                                                {t("No store movements found")}
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
}
