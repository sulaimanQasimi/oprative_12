import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Building2,
    ArrowLeft,
    TrendingUp,
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
    AlertCircle
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

export default function Income({ auth, warehouse, incomes }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredIncomes, setFilteredIncomes] = useState(incomes || []);

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Filter incomes
    useEffect(() => {
        let filtered = incomes || [];

        if (searchTerm) {
            filtered = filtered.filter(income =>
                income.reference_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                income.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                income.product.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredIncomes(filtered);
    }, [incomes, searchTerm]);

    // Calculate summary statistics
    const totalIncomes = filteredIncomes.length;
    const totalQuantity = filteredIncomes.reduce((sum, income) => sum + (income.quantity || 0), 0);
    const totalValue = filteredIncomes.reduce((sum, income) => sum + (income.total || 0), 0);

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

    return (
        <>
            <Head title={`${warehouse?.name} - ${t("Import")}`}>
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
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl blur opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-xl">
                                        <TrendingUp className="w-8 h-8 text-white" />
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1"
                                    >
                                        {warehouse?.name} - {t("Import Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
                                    >
                                        {t("Warehouse Import")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400"
                                    >
                                        {t("Track and manage incoming inventory")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Link href={route("admin.warehouses.show", warehouse.id)}>
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-transform">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Warehouse")}
                                    </Button>
                                </Link>
                                <Link href={route("admin.warehouses.income.create", warehouse.id)}>
                                    <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:scale-105 transition-transform">
                                        <Plus className="h-4 w-4 mr-2" />
                                        {t("Add Import")}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-8 space-y-8">
                            {/* Summary Cards */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                            >
                                <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                    {t("Total Import Records")}
                                                </p>
                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                    {totalIncomes}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                                                <FileText className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                    {t("Total Quantity")}
                                                </p>
                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                    {totalQuantity.toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                                <Package className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                    {t("Total Value")}
                                                </p>
                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                    {formatCurrency(totalValue)}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                                                <DollarSign className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Search */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.9, duration: 0.5 }}
                            >
                                <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <div className="relative max-w-md">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                            <Input
                                                placeholder={t("Search import records...")}
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Import Table */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.0, duration: 0.5 }}
                            >
                                <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                                    <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-b border-white/20 dark:border-slate-700/50">
                                        <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                                                <TrendingUp className="h-5 w-5 text-white" />
                                            </div>
                                            {t("Import Records")}
                                        </CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                            {t("Complete list of warehouse import transactions")}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {filteredIncomes.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-slate-50/50 dark:bg-slate-800/50">
                                                            <TableHead className="font-bold text-slate-700 dark:text-slate-300">
                                                                {t("Reference")}
                                                            </TableHead>
                                                            <TableHead className="font-bold text-slate-700 dark:text-slate-300">
                                                                {t("Product")}
                                                            </TableHead>
                                                            <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-center">
                                                                {t("Quantity")}
                                                            </TableHead>
                                                            <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-right">
                                                                {t("Price")}
                                                            </TableHead>
                                                            <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-right">
                                                                {t("Total")}
                                                            </TableHead>
                                                            <TableHead className="font-bold text-slate-700 dark:text-slate-300">
                                                                {t("Date")}
                                                            </TableHead>
                                                            <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-center">
                                                                {t("Status")}
                                                            </TableHead>
                                                            <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-center">
                                                                {t("Actions")}
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        <AnimatePresence>
                                                            {filteredIncomes.map((income, index) => (
                                                                <motion.tr
                                                                    key={income.id}
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{ delay: index * 0.05 }}
                                                                    className="hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-colors"
                                                                >
                                                                    <TableCell className="font-mono text-slate-600 dark:text-slate-400">
                                                                        {income.reference_number || '-'}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                                                                <Package className="h-4 w-4 text-white" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-semibold text-slate-800 dark:text-white">
                                                                                    {income.product.name}
                                                                                </p>
                                                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                                    {income.product.barcode || income.product.type}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-center font-semibold">
                                                                        {income.quantity?.toLocaleString() || 0}
                                                                    </TableCell>
                                                                    <TableCell className="text-right font-semibold">
                                                                        {formatCurrency(income.price)}
                                                                    </TableCell>
                                                                    <TableCell className="text-right font-bold text-green-600 dark:text-green-400">
                                                                        {formatCurrency(income.total)}
                                                                    </TableCell>
                                                                    <TableCell className="text-slate-600 dark:text-slate-400">
                                                                        {formatDate(income.created_at)}
                                                                    </TableCell>
                                                                    <TableCell className="text-center">
                                                                        <Badge variant="secondary" className="bg-green-500 text-white">
                                                                            {t("Completed")}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="text-center">
                                                                        <div className="flex items-center justify-center gap-2">
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                className="hover:scale-105 transition-transform"
                                                                            >
                                                                                <Eye className="h-3 w-3" />
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                className="hover:scale-105 transition-transform"
                                                                            >
                                                                                <Edit className="h-3 w-3" />
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-105 transition-all"
                                                                            >
                                                                                <Trash2 className="h-3 w-3" />
                                                                            </Button>
                                                                        </div>
                                                                    </TableCell>
                                                                </motion.tr>
                                                            ))}
                                                        </AnimatePresence>
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="text-center py-16"
                                            >
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center">
                                                        <TrendingUp className="h-8 w-8 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                                                            {t("No import records found")}
                                                        </h3>
                                                        <p className="text-slate-600 dark:text-slate-400">
                                                            {searchTerm
                                                                ? t("No import records match your search criteria")
                                                                : t("This warehouse doesn't have any import records yet")
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
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
