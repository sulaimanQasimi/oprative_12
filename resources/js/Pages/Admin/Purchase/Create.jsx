import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    ShoppingCart,
    Save,
    AlertCircle,
    Truck,
    Globe,
    Calendar,
    DollarSign,
    FileText,
    Sparkles
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Badge } from "@/Components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Create({ auth, suppliers, currencies, invoiceNumber }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        supplier_id: '',
        currency_id: '1',
        invoice_number: invoiceNumber || '',
        invoice_date: new Date().toISOString().split('T')[0],
        currency_rate: '1',
        status: 'purchase'
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Set invoice number from backend
    useEffect(() => {
        if (invoiceNumber && !data.invoice_number) {
            setData('invoice_number', invoiceNumber);
        }
    }, [invoiceNumber]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        
        post(route('admin.purchases.store'), {
            onFinish: () => setLoading(false),
            onError: () => setLoading(false)
        });
    };

    return (
        <>
            <Head title={t("Create Purchase")}>
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
                                        {t("Purchase Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent"
                                    >
                                        {t("Create Purchase")}
                                    </motion.h1>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Link href={route("admin.purchases.index")}>
                                    <Button variant="outline" className="gap-2">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Purchases")}
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
                            className="max-w-4xl mx-auto"
                        >
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Form Card */}
                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                    <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                        <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                                                <ShoppingCart className="h-6 w-6 text-white" />
                                            </div>
                                            {t("Purchase Details")}
                                            <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                                {t("Required")}
                                            </Badge>
                                        </CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                            {t("Fill in the details for the new purchase order")}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-6">
                                        {/* Error Alert */}
                                        <AnimatePresence>
                                            {Object.keys(errors).length > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                >
                                                    <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                                                        <AlertCircle className="h-5 w-5 text-red-600" />
                                                        <AlertDescription className="text-red-700 dark:text-red-400 font-medium">
                                                            {t("Please correct the errors below and try again.")}
                                                        </AlertDescription>
                                                    </Alert>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Supplier Selection */}
                                            <div className="space-y-3">
                                                <Label htmlFor="supplier_id" className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                                                    <Truck className="w-4 h-4 text-green-500" />
                                                    {t("Supplier")} *
                                                </Label>
                                                <Select
                                                    value={data.supplier_id}
                                                    onValueChange={(value) => setData('supplier_id', value)}
                                                >
                                                    <SelectTrigger className={`h-12 border-2 ${errors.supplier_id ? 'border-red-500' : 'border-slate-200 hover:border-green-300 focus:border-green-500'}`}>
                                                        <SelectValue placeholder={t("Select a supplier")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {suppliers?.map((supplier) => (
                                                            <SelectItem key={supplier.id} value={supplier.id.toString()}>
                                                                {supplier.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.supplier_id && (
                                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                                        <AlertCircle className="w-4 h-4" />
                                                        {errors.supplier_id}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Currency Selection */}
                                            <div className="space-y-3">
                                                <Label htmlFor="currency_id" className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                                                    <Globe className="w-4 h-4 text-blue-500" />
                                                    {t("Currency")} *
                                                </Label>
                                                <Select
                                                    value={data.currency_id}
                                                    onValueChange={(value) => setData('currency_id', value)}
                                                >
                                                    <SelectTrigger className={`h-12 border-2 ${errors.currency_id ? 'border-red-500' : 'border-slate-200 hover:border-blue-300 focus:border-blue-500'}`}>
                                                        <SelectValue placeholder={t("Select currency")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {currencies?.map((currency) => (
                                                            <SelectItem key={currency.id} value={currency.id.toString()}>
                                                                {currency.name} ({currency.code})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.currency_id && (
                                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                                        <AlertCircle className="w-4 h-4" />
                                                        {errors.currency_id}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Invoice Number */}
                                            <div className="space-y-3">
                                                <Label htmlFor="invoice_number" className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-purple-500" />
                                                    {t("Invoice Number")} *
                                                </Label>
                                                <Input
                                                    id="invoice_number"
                                                    type="text"
                                                    value={data.invoice_number}
                                                    onChange={(e) => setData('invoice_number', e.target.value)}
                                                    className={`h-12 border-2 ${errors.invoice_number ? 'border-red-500' : 'border-slate-200 hover:border-purple-300 focus:border-purple-500'}`}
                                                    disabled
                                                />
                                                {errors.invoice_number && (
                                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                                        <AlertCircle className="w-4 h-4" />
                                                        {errors.invoice_number}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Invoice Date */}
                                            <div className="space-y-3">
                                                <Label htmlFor="invoice_date" className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-orange-500" />
                                                    {t("Invoice Date")} *
                                                </Label>
                                                <Input
                                                    id="invoice_date"
                                                    type="date"
                                                    value={data.invoice_date}
                                                    onChange={(e) => setData('invoice_date', e.target.value)}
                                                    className={`h-12 border-2 ${errors.invoice_date ? 'border-red-500' : 'border-slate-200 hover:border-orange-300 focus:border-orange-500'}`}
                                                />
                                                {errors.invoice_date && (
                                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                                        <AlertCircle className="w-4 h-4" />
                                                        {errors.invoice_date}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Currency Rate */}
                                            <div className="space-y-3">
                                                <Label htmlFor="currency_rate" className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                                                    <DollarSign className="w-4 h-4 text-green-500" />
                                                    {t("Currency Rate")} *
                                                </Label>
                                                <Input
                                                    id="currency_rate"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={data.currency_rate}
                                                    onChange={(e) => setData('currency_rate', e.target.value)}
                                                    className={`h-12 border-2 ${errors.currency_rate ? 'border-red-500' : 'border-slate-200 hover:border-green-300 focus:border-green-500'}`}
                                                />
                                                {errors.currency_rate && (
                                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                                        <AlertCircle className="w-4 h-4" />
                                                        {errors.currency_rate}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Status */}
                                            <div className="space-y-3">
                                                <Label htmlFor="status" className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-indigo-500" />
                                                    {t("Status")} *
                                                </Label>
                                                <Select
                                                    value={data.status}
                                                    onValueChange={(value) => setData('status', value)}
                                                >
                                                    <SelectTrigger className={`h-12 border-2 ${errors.status ? 'border-red-500' : 'border-slate-200 hover:border-indigo-300 focus:border-indigo-500'}`}>
                                                        <SelectValue placeholder={t("Select status")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="purchase">{t("Purchase")}</SelectItem>
                                                        <SelectItem value="onway">{t("On Way")}</SelectItem>
                                                        <SelectItem value="on_border">{t("On Border")}</SelectItem>
                                                        <SelectItem value="on_plan">{t("On Plan")}</SelectItem>
                                                        <SelectItem value="on_ship">{t("On Ship")}</SelectItem>
                                                        <SelectItem value="arrived">{t("Arrived")}</SelectItem>
                                                        <SelectItem value="warehouse_moved">{t("Moved to Warehouse")}</SelectItem>
                                                        <SelectItem value="return">{t("Return")}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.status && (
                                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                                        <AlertCircle className="w-4 h-4" />
                                                        {errors.status}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Submit Button */}
                                <div className="flex justify-end space-x-4">
                                    <Link href={route("admin.purchases.index")}>
                                        <Button type="button" variant="outline" className="px-8 py-3">
                                            {t("Cancel")}
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        disabled={processing || !data.supplier_id || !data.currency_id}
                                        className="px-8 py-3 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 text-white"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                {t("Creating...")}
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                {t("Create Purchase")}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </main>
                </div>
            </motion.div>
        </>
    );
} 