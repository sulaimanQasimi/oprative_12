import React, { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Building2,
    ArrowLeft,
    ShoppingCart,
    Package,
    DollarSign,
    Hash,
    Calculator,
    Save,
    AlertCircle,
    Truck,
    Globe,
    Calendar,
    CheckCircle,
    Info,
    Sparkles,
    FileText,
    Plus,
    Minus,
    X
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Badge } from "@/Components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Edit({ auth, purchase, suppliers, currencies, warehouses }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [additionalCosts, setAdditionalCosts] = useState(purchase.additional_costs || []);

    const { data, setData, put, processing, errors } = useForm({
        supplier_id: purchase.supplier_id?.toString() || '',
        currency_id: purchase.currency_id?.toString() || '1',
        invoice_number: purchase.invoice_number || '',
        invoice_date: purchase.invoice_date || '',
        currency_rate: purchase.currency_rate?.toString() || '1',
        status: purchase.status || 'purchase',
        warehouse_id: purchase.warehouse_id?.toString() || '',
        reference_no: purchase.reference_no || '',
        date: purchase.date || '',
        note: purchase.note || '',
        additional_costs: purchase.additional_costs || []
    });

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Update selected supplier
    useEffect(() => {
        if (data.supplier_id && suppliers) {
            const supplier = suppliers.find(s => s.id === parseInt(data.supplier_id));
            setSelectedSupplier(supplier || null);
        } else {
            setSelectedSupplier(null);
        }
    }, [data.supplier_id, suppliers]);

    // Update selected currency
    useEffect(() => {
        if (data.currency_id && currencies) {
            const currency = currencies.find(c => c.id === parseInt(data.currency_id));
            setSelectedCurrency(currency || null);
        } else {
            setSelectedCurrency(null);
        }
    }, [data.currency_id, currencies]);

    // Update additional costs in form data
    useEffect(() => {
        setData('additional_costs', additionalCosts);
    }, [additionalCosts]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        
        put(route('admin.purchases.update', purchase.id), {
            onFinish: () => setLoading(false),
            onError: (errors) => {
                console.log('Submission errors:', errors);
                setLoading(false);
            }
        });
    };

    const addAdditionalCost = () => {
        setAdditionalCosts([...additionalCosts, { name: '', amount: '' }]);
    };

    const removeAdditionalCost = (index) => {
        setAdditionalCosts(additionalCosts.filter((_, i) => i !== index));
    };

    const updateAdditionalCost = (index, field, value) => {
        const updated = [...additionalCosts];
        updated[index][field] = value;
        setAdditionalCosts(updated);
    };

    const getTotalAdditionalCosts = () => {
        return additionalCosts.reduce((sum, cost) => sum + (parseFloat(cost.amount) || 0), 0);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: selectedCurrency?.code || 'USD',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    return (
        <>
            <Head title={`${t("Edit Purchase")} - ${purchase.invoice_number}`}>
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
                                        {t("Purchase Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent"
                                    >
                                        {t("Edit Purchase")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Package className="w-4 h-4" />
                                        {t("Update purchase order details")} - {purchase.invoice_number}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Link href={route("admin.purchases.show", purchase.id)}>
                                    <Button variant="outline" className="gap-2 dark:text-white text-black hover:scale-105 transition-all duration-200 border-green-200 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Purchase")}
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
                                className="max-w-5xl mx-auto"
                            >
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Form Card */}
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.5 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-600/50 rounded-t-xl">
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                                                        <ShoppingCart className="h-6 w-6 text-white" />
                                                    </div>
                                                    {t("Purchase Details")}
                                                    <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                                        {t("Edit Mode")}
                                                    </Badge>
                                                </CardTitle>
                                                <CardDescription className="text-slate-600 dark:text-slate-300">
                                                    {t("Update the details for this purchase order")}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-8 space-y-8">
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

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                    {/* Supplier Selection */}
                                                    <div className="space-y-3">
                                                        <Label htmlFor="supplier_id" className="text-slate-700 dark:text-slate-200 font-semibold text-lg flex items-center gap-2">
                                                            <Truck className="w-5 h-5 text-green-500" />
                                                            {t("Supplier")} *
                                                        </Label>
                                                        <Select
                                                            value={data.supplier_id}
                                                            onValueChange={(value) => setData('supplier_id', value)}
                                                        >
                                                            <SelectTrigger className={`h-14 text-lg border-2 transition-all duration-200 ${errors.supplier_id ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-green-300 focus:border-green-500'} bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200`}>
                                                                <SelectValue placeholder={t("Select a supplier")} />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                                                                {suppliers?.map((supplier) => (
                                                                    <SelectItem key={supplier.id} value={supplier.id.toString()} className="text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">
                                                                        {supplier.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.supplier_id && (
                                                            <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.supplier_id}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Currency Selection */}
                                                    <div className="space-y-3">
                                                        <Label htmlFor="currency_id" className="text-slate-700 dark:text-slate-200 font-semibold text-lg flex items-center gap-2">
                                                            <Globe className="w-5 h-5 text-blue-500" />
                                                            {t("Currency")} *
                                                        </Label>
                                                        <Select
                                                            value={data.currency_id}
                                                            onValueChange={(value) => setData('currency_id', value)}
                                                        >
                                                            <SelectTrigger className={`h-14 text-lg border-2 transition-all duration-200 ${errors.currency_id ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-blue-300 focus:border-blue-500'} bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200`}>
                                                                <SelectValue placeholder={t("Select currency")} />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                                                                {currencies?.map((currency) => (
                                                                    <SelectItem key={currency.id} value={currency.id.toString()} className="text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">
                                                                        {currency.name} ({currency.code})
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.currency_id && (
                                                            <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.currency_id}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Status */}
                                                    <div className="space-y-3">
                                                        <Label htmlFor="status" className="text-slate-700 dark:text-slate-200 font-semibold text-lg flex items-center gap-2">
                                                            <CheckCircle className="w-5 h-5 text-indigo-500" />
                                                            {t("Status")} *
                                                        </Label>
                                                        <Select
                                                            value={data.status}
                                                            onValueChange={(value) => setData('status', value)}
                                                        >
                                                            <SelectTrigger className={`h-14 text-lg border-2 transition-all duration-200 ${errors.status ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-indigo-300 focus:border-indigo-500'} bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200`}>
                                                                <SelectValue placeholder={t("Select status")} />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                                                                <SelectItem value="purchase" className="text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">{t("Purchase")}</SelectItem>
                                                                <SelectItem value="onway" className="text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">{t("On Way")}</SelectItem>
                                                                <SelectItem value="on_border" className="text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">{t("On Border")}</SelectItem>
                                                                <SelectItem value="on_plan" className="text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">{t("On Plan")}</SelectItem>
                                                                <SelectItem value="on_ship" className="text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">{t("On Ship")}</SelectItem>
                                                                <SelectItem value="arrived" className="text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">{t("Arrived")}</SelectItem>
                                                                <SelectItem value="warehouse_moved" className="text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">{t("Moved to Warehouse")}</SelectItem>
                                                                <SelectItem value="return" className="text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">{t("Return")}</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.status && (
                                                            <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.status}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Currency Rate */}
                                                    <div className="space-y-3">
                                                        <Label htmlFor="currency_rate" className="text-slate-700 dark:text-slate-200 font-semibold text-lg flex items-center gap-2">
                                                            <DollarSign className="w-5 h-5 text-green-500" />
                                                            {t("Currency Rate")} *
                                                        </Label>
                                                        <div className="relative">
                                                            <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-5 w-5" />
                                                            <Input
                                                                id="currency_rate"
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                placeholder={t("Enter rate")}
                                                                value={data.currency_rate}
                                                                onChange={(e) => setData('currency_rate', e.target.value)}
                                                                className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${errors.currency_rate ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-green-300 focus:border-green-500'} bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder:text-slate-400`}
                                                            />
                                                        </div>
                                                        {errors.currency_rate && (
                                                            <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.currency_rate}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Notes */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="note" className="text-slate-700 dark:text-slate-200 font-semibold text-lg flex items-center gap-2">
                                                        <FileText className="w-5 h-5 text-purple-500" />
                                                        {t("Notes")}
                                                        <Badge variant="secondary" className="text-xs">
                                                            {t("Optional")}
                                                        </Badge>
                                                    </Label>
                                                    <Textarea
                                                        id="note"
                                                        placeholder={t("Enter any additional notes about this purchase...")}
                                                        value={data.note}
                                                        onChange={(e) => setData('note', e.target.value)}
                                                        rows={4}
                                                        className={`resize-none text-lg border-2 transition-all duration-200 ${errors.note ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-purple-300 focus:border-purple-500'} bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder:text-slate-400`}
                                                    />
                                                    {errors.note && (
                                                        <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                            <AlertCircle className="w-4 h-4" />
                                                            {errors.note}
                                                        </p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Submit Button */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.0, duration: 0.4 }}
                                        className="flex justify-end space-x-6 pt-6"
                                    >
                                        <Link href={route("admin.purchases.show", purchase.id)}>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="px-8 py-4 text-lg border-2 hover:scale-105 transition-all duration-200 dark:text-white text-black"
                                            >
                                                {t("Cancel")}
                                            </Button>
                                        </Link>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="px-8 py-4 text-lg shadow-2xl transition-all duration-200 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 hover:scale-105 hover:shadow-3xl text-white"
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                                    {t("Updating...")}
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-5 w-5 mr-3" />
                                                    {t("Update Purchase")}
                                                </>
                                            )}
                                        </Button>
                                    </motion.div>
                                </form>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
} 