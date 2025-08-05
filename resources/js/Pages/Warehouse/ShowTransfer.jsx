import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import {
    ArrowLeft,
    Truck,
    Package,
    Calendar,
    User,
    Building,
    ArrowUpRight,
    ArrowDownLeft,
    CheckCircle,
    Clock,
    XCircle,
    Eye,
    Printer,
    Hash,
    MapPin,
    Phone,
    Mail,
    FileText,
    DollarSign,
    Package2,
    AlertCircle,
    CheckSquare
} from 'lucide-react';
import Navigation from '@/Components/Warehouse/Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '@/Components/BackButton';

// Memoized animation variants to prevent re-creation
const animationVariants = {
    fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
    },
    slideIn: {
        hidden: { x: -20, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.4 } }
    },
    staggerChildren: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }
};

// Memoized status color function
const getStatusColor = (status) => {
    switch (status) {
        case 'completed':
            return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
        case 'cancelled':
            return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
        default:
            return 'bg-slate-100 text-slate-800 dark:bg-slate-900/40 dark:text-slate-300';
    }
};

// Memoized component for transfer items
const TransferItemRow = memo(({ item, index, t }) => (
    <motion.tr
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
    >
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                    <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {item.product.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        {t('Unit')}: {item.product.unit_name}
                    </div>
                    {item.product.barcode && (
                        <div className="text-xs text-slate-400 dark:text-slate-500">
                            {t('Barcode')}: {item.product.barcode}
                        </div>
                    )}
                </div>
            </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-center">
            {item.batch ? (
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-50/70 to-indigo-50/70 dark:from-purple-900/30 dark:to-indigo-900/30 border border-purple-200/30 dark:border-purple-800/30">
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {item.batch.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                        {t('Code')}: {item.batch.code}
                    </div>
                    {item.batch.expiry_date && (
                        <div className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-900/30 px-2 py-1 rounded-full">
                            {t('Exp')}: {item.batch.expiry_date}
                        </div>
                    )}
                    {item.batch.manufacturing_date && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {t('MFG')}: {item.batch.manufacturing_date}
                        </div>
                    )}
                </div>
            ) : (
                <div className="p-3 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 dark:border-slate-700/30">
                    <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">{t('No Batch Info')}</span>
                </div>
            )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                {item.quantity} {item.unit_name}
            </span>
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-center">
            {item.notes && (
                <div className="text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate" title={item.notes}>
                    {item.notes}
                </div>
            )}
        </td>
    </motion.tr>
));

// Memoized component for warehouse info items
const WarehouseInfoItem = memo(({ icon: Icon, label, value, color = "purple" }) => (
    <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
        <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
            <Icon className={`h-4 w-4 text-${color}-600 dark:text-${color}-400`} />
        </div>
        <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {label}
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {value}
            </p>
        </div>
    </div>
));

export default function ShowTransfer({ auth, transfer, permissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [isPrintMode, setIsPrintMode] = useState(false);
    const [confirming, setConfirming] = useState(false);

    const { post, processing } = useForm();

    // Memoized computed values
    const statusColor = useMemo(() => getStatusColor(transfer.status), [transfer.status]);

    // Optimized animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimated(true);
            setLoading(false);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Memoized handlers
    const handlePrint = useCallback(() => {
        setIsPrintMode(true);
        setTimeout(() => {
            window.print();
            setIsPrintMode(false);
        }, 100);
    }, []);

    const handleConfirm = useCallback(async () => {
        if (!permissions.confirm_transfers) return;
        
        setConfirming(true);
        try {
            const response = await fetch(route('warehouse.transfers.confirm', transfer.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Reload the page to show updated status
                window.location.reload();
            } else {
                alert(data.message || t('Failed to confirm transfer'));
            }
        } catch (error) {
            console.error('Error confirming transfer:', error);
            alert(t('An error occurred while confirming the transfer'));
        } finally {
            setConfirming(false);
        }
    }, [transfer.id, permissions.confirm_transfers, t]);

    // Memoized warehouse info items
    const fromWarehouseInfoItems = useMemo(() => [
        { icon: Building, label: t('Name'), value: transfer.from_warehouse.name, condition: true },
        { icon: MapPin, label: t('Address'), value: transfer.from_warehouse.address, condition: transfer.from_warehouse.address },
        { icon: Phone, label: t('Phone'), value: transfer.from_warehouse.phone, condition: transfer.from_warehouse.phone },
        { icon: Mail, label: t('Email'), value: transfer.from_warehouse.email, condition: transfer.from_warehouse.email },
    ].filter(item => item.condition), [transfer.from_warehouse, t]);

    const toWarehouseInfoItems = useMemo(() => [
        { icon: Building, label: t('Name'), value: transfer.to_warehouse.name, condition: true },
        { icon: MapPin, label: t('Address'), value: transfer.to_warehouse.address, condition: transfer.to_warehouse.address },
        { icon: Phone, label: t('Phone'), value: transfer.to_warehouse.phone, condition: transfer.to_warehouse.phone },
        { icon: Mail, label: t('Email'), value: transfer.to_warehouse.email, condition: transfer.to_warehouse.email },
    ].filter(item => item.condition), [transfer.to_warehouse, t]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600 dark:text-slate-400">{t('Loading transfer details...')}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title={`${t('Transfer')} ${transfer.reference}`} />

            <div className="flex h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
                <Navigation auth={auth} currentRoute="warehouse.transfers" />

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="bg-white/10 backdrop-blur-lg border-b border-white/20 dark:border-slate-700/50 py-6 px-8 sticky top-0 z-30"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600 p-4 rounded-2xl shadow-2xl">
                                        <Truck className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1 flex items-center gap-2"
                                    >
                                        <Package className="w-4 h-4" />
                                        {t('Warehouse Transfer')}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent"
                                    >
                                        {transfer.reference}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Hash className="w-4 h-4" />
                                        ID: {transfer.id}
                                    </motion.p>
                                </div>
                            </div>
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Badge className={`${statusColor} capitalize`}>
                                    {transfer.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                                    {transfer.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                                    {transfer.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                                    {transfer.status}
                                </Badge>
                                {permissions.confirm_transfers && transfer.status === 'pending' && (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.8, duration: 0.5, type: "spring", stiffness: 200 }}
                                        className="relative"
                                    >
                                        <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-lg blur opacity-75 animate-pulse"></div>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={handleConfirm}
                                            disabled={confirming}
                                            className="relative gap-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                                        >
                                            {confirming ? (
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                                                />
                                            ) : (
                                                <motion.div
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                    transition={{ type: "spring", stiffness: 400 }}
                                                >
                                                    <CheckSquare className="h-4 w-4" />
                                                </motion.div>
                                            )}
                                        </Button>
                                    </motion.div>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePrint}
                                    className="gap-2"
                                >
                                    <Printer className="h-4 w-4" />
                                    {t('Print')}
                                </Button>
                                <BackButton link={route('warehouse.transfers')} />
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-purple-300 dark:scrollbar-thumb-purple-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Transfer Details */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                    className="lg:col-span-2 space-y-6"
                                >
                                    {/* Transfer Summary */}
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-purple-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                                                    <FileText className="h-5 w-5 text-white" />
                                                </div>
                                                {t('Transfer Summary')}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                            {t('Transfer Type')}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            {transfer.type === 'outgoing' ? (
                                                                <ArrowUpRight className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                                            ) : (
                                                                <ArrowDownLeft className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                            )}
                                                            <Badge variant="outline" className="capitalize">
                                                                {transfer.type}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                            {t('Total Items')}
                                                        </span>
                                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                            {transfer.items_count}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                            {t('Total Quantity')}
                                                        </span>
                                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                            {transfer.total_quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">

                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                            {t('Transfer Date')}
                                                        </span>
                                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                            {transfer.transfer_date}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                            {t('Created')}
                                                        </span>
                                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                            {transfer.created_at}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {transfer.notes && (
                                                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        {t('Notes')}
                                                    </h4>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                                        {transfer.notes}
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Transfer Items */}
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-purple-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                                                    <Package2 className="h-5 w-5 text-white" />
                                                </div>
                                                {t('Transfer Items')} ({transfer.items_count})
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            {transfer.transfer_items && transfer.transfer_items.length > 0 ? (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full">
                                                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                                            <tr>
                                                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                    {t('Product')}
                                                                </th>
                                                                <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                    {t('Batch Info')}
                                                                </th>
                                                                <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                    {t('Quantity')}
                                                                </th>

                                                                <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                    {t('Notes')}
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                                                            {transfer.transfer_items.map((item, index) => (
                                                                <TransferItemRow
                                                                    key={item.id}
                                                                    item={item}
                                                                    index={index}
                                                                    t={t}
                                                                />
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <div className="text-center py-12">
                                                    <Package2 className="mx-auto h-12 w-12 text-slate-400" />
                                                    <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">
                                                        {t('No transfer items found')}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                        {t('This transfer has no items.')}
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Sidebar */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1, duration: 0.5 }}
                                    className="space-y-6"
                                >
                                    {/* From Warehouse */}
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-orange-500/20 via-red-500/20 to-orange-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                                                    <ArrowUpRight className="h-5 w-5 text-white" />
                                                </div>
                                                {t('From Warehouse')}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="space-y-3">
                                                {fromWarehouseInfoItems.map((item, index) => (
                                                    <WarehouseInfoItem
                                                        key={index}
                                                        icon={item.icon}
                                                        label={item.label}
                                                        value={item.value}
                                                        color="orange"
                                                    />
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* To Warehouse */}
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                    <ArrowDownLeft className="h-5 w-5 text-white" />
                                                </div>
                                                {t('To Warehouse')}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="space-y-3">
                                                {toWarehouseInfoItems.map((item, index) => (
                                                    <WarehouseInfoItem
                                                        key={index}
                                                        icon={item.icon}
                                                        label={item.label}
                                                        value={item.value}
                                                        color="blue"
                                                    />
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Creator Info */}
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-teal-500/20 via-emerald-500/20 to-teal-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg">
                                                    <User className="h-5 w-5 text-white" />
                                                </div>
                                                {t('Created By')}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="space-y-3">
                                                <WarehouseInfoItem
                                                    icon={User}
                                                    label={t('Name')}
                                                    value={transfer.creator.name}
                                                    color="teal"
                                                />
                                                <WarehouseInfoItem
                                                    icon={Mail}
                                                    label={t('Email')}
                                                    value={transfer.creator.email}
                                                    color="teal"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}