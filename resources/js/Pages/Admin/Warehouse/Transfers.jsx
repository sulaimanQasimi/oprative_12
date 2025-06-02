import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Building2,
    ArrowLeft,
    ArrowRightLeft,
    Search,
    Plus,
    Eye,
    Package,
    Calendar,
    FileText,
    DollarSign,
    Hash,
    CheckCircle,
    AlertCircle,
    Truck
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

export default function Transfers({ auth, warehouse, transfers }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTransfers, setFilteredTransfers] = useState(transfers || []);

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Filter transfers
    useEffect(() => {
        let filtered = transfers || [];

        if (searchTerm) {
            filtered = filtered.filter(transfer =>
                transfer.reference_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transfer.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transfer.to_warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transfer.from_warehouse.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredTransfers(filtered);
    }, [transfers, searchTerm]);

    // Calculate summary statistics
    const totalTransfers = filteredTransfers.length;
    const totalQuantity = filteredTransfers.reduce((sum, transfer) => sum + (transfer.quantity || 0), 0);
    const totalValue = filteredTransfers.reduce((sum, transfer) => sum + (transfer.total || 0), 0);

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
            <Head title={`${warehouse?.name} - ${t("Transfers")}`}>
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
                                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl blur opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl">
                                        <ArrowRightLeft className="w-8 h-8 text-white" />
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1"
                                    >
                                        {warehouse?.name} - {t("Transfer Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
                                    >
                                        {t("Warehouse Transfers")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400"
                                    >
                                        {t("Manage inventory transfers between warehouses")}
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
                                <Link href={route("admin.warehouses.transfers.create", warehouse.id)}>
                                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:scale-105 transition-transform">
                                        <Plus className="h-4 w-4 mr-2" />
                                        {t("Create Transfer")}
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
                                                    {t("Total Transfers")}
                                                </p>
                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                    {totalTransfers}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
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
                                            <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
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
                                            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
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
                                                placeholder={t("Search transfers...")}
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Transfers Table */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.0, duration: 0.5 }}
                            >
                                <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                                    <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-white/20 dark:border-slate-700/50">
                                        <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                                                <ArrowRightLeft className="h-5 w-5 text-white" />
                                            </div>
                                            {t("Transfer Records")}
                                        </CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                            {t("Complete list of warehouse transfer transactions")}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {filteredTransfers.length > 0 ? (
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
                                                            <TableHead className="font-bold text-slate-700 dark:text-slate-300">
                                                                {t("From → To")}
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
                                                                {t("Actions")}
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        <AnimatePresence>
                                                            {filteredTransfers.map((transfer, index) => (
                                                                <motion.tr
                                                                    key={transfer.id}
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{ delay: index * 0.05 }}
                                                                    className="hover:bg-purple-50/50 dark:hover:bg-slate-700/50 transition-colors"
                                                                >
                                                                    <TableCell className="font-mono text-slate-600 dark:text-slate-400">
                                                                        {transfer.reference_number || '-'}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                                                                <Package className="h-4 w-4 text-white" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-semibold text-slate-800 dark:text-white">
                                                                                    {transfer.product.name}
                                                                                </p>
                                                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                                    {transfer.product.barcode || transfer.product.type}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <Badge variant="outline" className="text-xs">
                                                                                {transfer.from_warehouse.name}
                                                                            </Badge>
                                                                            <ArrowRightLeft className="h-3 w-3 text-slate-400" />
                                                                            <Badge variant="outline" className="text-xs">
                                                                                {transfer.to_warehouse.name}
                                                                            </Badge>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-center font-semibold">
                                                                        {transfer.quantity?.toLocaleString() || 0}
                                                                    </TableCell>
                                                                    <TableCell className="text-right font-semibold">
                                                                        {formatCurrency(transfer.price)}
                                                                    </TableCell>
                                                                    <TableCell className="text-right font-bold text-purple-600 dark:text-purple-400">
                                                                        {formatCurrency(transfer.total)}
                                                                    </TableCell>
                                                                    <TableCell className="text-slate-600 dark:text-slate-400">
                                                                        {formatDate(transfer.created_at)}
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
                                                        <ArrowRightLeft className="h-8 w-8 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                                                            {t("No transfers found")}
                                                        </h3>
                                                        <p className="text-slate-600 dark:text-slate-400">
                                                            {searchTerm
                                                                ? t("No transfers match your search criteria")
                                                                : t("This warehouse doesn't have any transfers yet")
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
