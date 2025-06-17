import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    CreditCard,
    Save,
    DollarSign,
    Calendar,
    Sparkles,
    Info,
    AlertCircle,
    Building,
    Hash,
    FileText,
    User,
    Banknote,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
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
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function CreatePayment({ auth, purchase, suppliers, currencies }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        supplier_id: purchase.supplier?.id || '',
        currency_id: purchase.currency?.id || '',
        amount: '',
        payment_method: '',
        reference_number: '',
        bank_name: '',
        bank_account: '',
        payment_date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        
        post(route('admin.purchases.payments.store', purchase.id), {
            onFinish: () => setLoading(false),
            onError: () => setLoading(false),
            onSuccess: () => setLoading(false)
        });
    };

    const paymentMethods = [
        { value: 'cash', label: t('Cash'), icon: Banknote },
        { value: 'bank_transfer', label: t('Bank Transfer'), icon: Building },
        { value: 'check', label: t('Check'), icon: FileText },
        { value: 'credit_card', label: t('Credit Card'), icon: CreditCard },
        { value: 'other', label: t('Other'), icon: Hash },
    ];

    const showBankFields = ['bank_transfer', 'check'].includes(data.payment_method);

    return (
        <>
            <Head title={`${t("Add Payment")} - ${purchase.invoice_number}`} />
            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
                .float-animation { animation: float 6s ease-in-out infinite; }
                .glass-effect { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); }
                .dark .glass-effect { background: rgba(0, 0, 0, 0.2); backdrop-filter: blur(10px); }
                .gradient-border {
                    background: linear-gradient(white, white) padding-box, linear-gradient(45deg, #3b82f6, #1d4ed8) border-box;
                    border: 2px solid transparent;
                }
                .dark .gradient-border {
                    background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box, linear-gradient(45deg, #3b82f6, #1d4ed8) border-box;
                }
            `}</style>

            <PageLoader isVisible={loading} icon={CreditCard} color="blue" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                <Navigation auth={auth} currentRoute="admin.purchases" />

                <div className="flex-1 flex flex-col overflow-hidden">
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
                                    className="relative float-animation"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 p-4 rounded-2xl shadow-2xl">
                                        <CreditCard className="w-8 h-8 text-white" />
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" /> {t("Add Purchase Payment")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent"
                                    >
                                        {purchase.invoice_number}
                                    </motion.h1>
                                </div>
                            </div>

                            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7, duration: 0.4 }}>
                                <Link href={route("admin.purchases.show", purchase.id)}>
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-all duration-200 border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                        <ArrowLeft className="h-4 w-4" /> {t("Back to Purchase")}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-700 scrollbar-track-transparent p-8">
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}>
                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border max-w-4xl mx-auto">
                                <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                    <CardTitle className="flex items-center gap-3 text-2xl">
                                        <CreditCard className="h-6 w-6 text-blue-600" />
                                        {t("Add New Payment")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {/* Supplier and Currency */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.1, duration: 0.4 }}
                                                className="space-y-3"
                                            >
                                                <Label htmlFor="supplier_id" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                    <User className="w-5 h-5 text-blue-500" />
                                                    {t("Supplier")} *
                                                </Label>
                                                <Select value={data.supplier_id} onValueChange={(value) => setData('supplier_id', value)}>
                                                    <SelectTrigger className={`h-14 text-lg border-2 transition-all duration-200 ${errors.supplier_id ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-blue-300 focus:border-blue-500'} bg-white dark:bg-slate-800`}>
                                                        <SelectValue placeholder={t("Select supplier")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {suppliers?.map((supplier) => (
                                                            <SelectItem key={supplier.id} value={supplier.id.toString()} className="p-4">
                                                                <div className="flex items-center space-x-4">
                                                                    <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg">
                                                                        <User className="h-5 w-5 text-blue-600" />
                                                                    </div>
                                                                    <div className="font-semibold text-slate-800 dark:text-white">{supplier.name}</div>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.supplier_id && (
                                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                        <AlertCircle className="w-4 h-4" />
                                                        {errors.supplier_id}
                                                    </motion.p>
                                                )}
                                            </motion.div>

                                            <motion.div
                                                initial={{ x: 20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.2, duration: 0.4 }}
                                                className="space-y-3"
                                            >
                                                <Label htmlFor="currency_id" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                    <DollarSign className="w-5 h-5 text-blue-500" />
                                                    {t("Currency")} *
                                                </Label>
                                                <Select value={data.currency_id} onValueChange={(value) => setData('currency_id', value)}>
                                                    <SelectTrigger className={`h-14 text-lg border-2 transition-all duration-200 ${errors.currency_id ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-blue-300 focus:border-blue-500'} bg-white dark:bg-slate-800`}>
                                                        <SelectValue placeholder={t("Select currency")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {currencies?.map((currency) => (
                                                            <SelectItem key={currency.id} value={currency.id.toString()} className="p-4">
                                                                <div className="flex items-center space-x-4">
                                                                    <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg">
                                                                        <DollarSign className="h-5 w-5 text-blue-600" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-semibold text-slate-800 dark:text-white">{currency.name}</div>
                                                                        <div className="text-sm text-slate-500">{currency.code}</div>
                                                                    </div>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.currency_id && (
                                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                        <AlertCircle className="w-4 h-4" />
                                                        {errors.currency_id}
                                                    </motion.p>
                                                )}
                                            </motion.div>
                                        </div>

                                        {/* Amount and Payment Method */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.3, duration: 0.4 }}
                                                className="space-y-3"
                                            >
                                                <Label htmlFor="amount" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                    <DollarSign className="w-5 h-5 text-green-500" />
                                                    {t("Amount")} *
                                                </Label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                    <Input
                                                        id="amount"
                                                        type="number"
                                                        step="0.01"
                                                        min="0.01"
                                                        placeholder={t("Enter payment amount")}
                                                        value={data.amount}
                                                        onChange={(e) => setData('amount', e.target.value)}
                                                        className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${errors.amount ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-green-300 focus:border-green-500'} bg-white dark:bg-slate-800`}
                                                    />
                                                </div>
                                                {errors.amount && (
                                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                        <AlertCircle className="w-4 h-4" />
                                                        {errors.amount}
                                                    </motion.p>
                                                )}
                                            </motion.div>

                                            <motion.div
                                                initial={{ x: 20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.4, duration: 0.4 }}
                                                className="space-y-3"
                                            >
                                                <Label htmlFor="payment_method" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                    <CreditCard className="w-5 h-5 text-purple-500" />
                                                    {t("Payment Method")} *
                                                </Label>
                                                <Select value={data.payment_method} onValueChange={(value) => setData('payment_method', value)}>
                                                    <SelectTrigger className={`h-14 text-lg border-2 transition-all duration-200 ${errors.payment_method ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-purple-300 focus:border-purple-500'} bg-white dark:bg-slate-800`}>
                                                        <SelectValue placeholder={t("Select payment method")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {paymentMethods.map((method) => (
                                                            <SelectItem key={method.value} value={method.value} className="p-4">
                                                                <div className="flex items-center space-x-4">
                                                                    <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
                                                                        <method.icon className="h-5 w-5 text-purple-600" />
                                                                    </div>
                                                                    <div className="font-semibold text-slate-800 dark:text-white">{method.label}</div>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.payment_method && (
                                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                        <AlertCircle className="w-4 h-4" />
                                                        {errors.payment_method}
                                                    </motion.p>
                                                )}
                                            </motion.div>
                                        </div>

                                        {/* Payment Date and Reference Number */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.5, duration: 0.4 }}
                                                className="space-y-3"
                                            >
                                                <Label htmlFor="payment_date" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                    <Calendar className="w-5 h-5 text-indigo-500" />
                                                    {t("Payment Date")} *
                                                </Label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                    <Input
                                                        id="payment_date"
                                                        type="date"
                                                        value={data.payment_date}
                                                        onChange={(e) => setData('payment_date', e.target.value)}
                                                        className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${errors.payment_date ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-indigo-300 focus:border-indigo-500'} bg-white dark:bg-slate-800`}
                                                    />
                                                </div>
                                                {errors.payment_date && (
                                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                        <AlertCircle className="w-4 h-4" />
                                                        {errors.payment_date}
                                                    </motion.p>
                                                )}
                                            </motion.div>

                                            <motion.div
                                                initial={{ x: 20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.6, duration: 0.4 }}
                                                className="space-y-3"
                                            >
                                                <Label htmlFor="reference_number" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                    <Hash className="w-5 h-5 text-teal-500" />
                                                    {t("Reference Number")}
                                                </Label>
                                                <div className="relative">
                                                    <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                    <Input
                                                        id="reference_number"
                                                        type="text"
                                                        placeholder={t("Enter reference number")}
                                                        value={data.reference_number}
                                                        onChange={(e) => setData('reference_number', e.target.value)}
                                                        className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${errors.reference_number ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-teal-300 focus:border-teal-500'} bg-white dark:bg-slate-800`}
                                                    />
                                                </div>
                                                {errors.reference_number && (
                                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                        <AlertCircle className="w-4 h-4" />
                                                        {errors.reference_number}
                                                    </motion.p>
                                                )}
                                            </motion.div>
                                        </div>

                                        {/* Bank Information (conditional) */}
                                        <AnimatePresence>
                                            {showBankFields && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="space-y-6"
                                                >
                                                    <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                                                        <Info className="h-5 w-5 text-blue-600" />
                                                        <AlertDescription className="text-blue-700 dark:text-blue-400 font-medium">
                                                            {t("Please provide bank information for this payment method")}
                                                        </AlertDescription>
                                                    </Alert>

                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                        <motion.div
                                                            initial={{ x: -20, opacity: 0 }}
                                                            animate={{ x: 0, opacity: 1 }}
                                                            transition={{ delay: 0.1, duration: 0.4 }}
                                                            className="space-y-3"
                                                        >
                                                            <Label htmlFor="bank_name" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                                <Building className="w-5 h-5 text-orange-500" />
                                                                {t("Bank Name")}
                                                            </Label>
                                                            <div className="relative">
                                                                <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                                <Input
                                                                    id="bank_name"
                                                                    type="text"
                                                                    placeholder={t("Enter bank name")}
                                                                    value={data.bank_name}
                                                                    onChange={(e) => setData('bank_name', e.target.value)}
                                                                    className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${errors.bank_name ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-orange-300 focus:border-orange-500'} bg-white dark:bg-slate-800`}
                                                                />
                                                            </div>
                                                            {errors.bank_name && (
                                                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                                    <AlertCircle className="w-4 h-4" />
                                                                    {errors.bank_name}
                                                                </motion.p>
                                                            )}
                                                        </motion.div>

                                                        <motion.div
                                                            initial={{ x: 20, opacity: 0 }}
                                                            animate={{ x: 0, opacity: 1 }}
                                                            transition={{ delay: 0.2, duration: 0.4 }}
                                                            className="space-y-3"
                                                        >
                                                            <Label htmlFor="bank_account" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                                <Hash className="w-5 h-5 text-red-500" />
                                                                {t("Bank Account")}
                                                            </Label>
                                                            <div className="relative">
                                                                <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                                <Input
                                                                    id="bank_account"
                                                                    type="text"
                                                                    placeholder={t("Enter bank account number")}
                                                                    value={data.bank_account}
                                                                    onChange={(e) => setData('bank_account', e.target.value)}
                                                                    className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${errors.bank_account ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-red-300 focus:border-red-500'} bg-white dark:bg-slate-800`}
                                                                />
                                                            </div>
                                                            {errors.bank_account && (
                                                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                                    <AlertCircle className="w-4 h-4" />
                                                                    {errors.bank_account}
                                                                </motion.p>
                                                            )}
                                                        </motion.div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Notes */}
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.7, duration: 0.4 }}
                                            className="space-y-3"
                                        >
                                            <Label htmlFor="notes" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                <FileText className="w-5 h-5 text-slate-500" />
                                                {t("Notes")}
                                            </Label>
                                            <Textarea
                                                id="notes"
                                                placeholder={t("Enter any additional notes or comments")}
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                className={`min-h-[120px] text-lg border-2 transition-all duration-200 ${errors.notes ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-slate-300 focus:border-slate-500'} bg-white dark:bg-slate-800`}
                                            />
                                            {errors.notes && (
                                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.notes}
                                                </motion.p>
                                            )}
                                        </motion.div>

                                        <div className="flex justify-end space-x-4 pt-6">
                                            <Link href={route("admin.purchases.show", purchase.id)}>
                                                <Button type="button" variant="outline" className="px-8 py-3">
                                                    {t("Cancel")}
                                                </Button>
                                            </Link>
                                            <Button type="submit" disabled={processing} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3">
                                                {processing ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                        {t("Saving...")}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="h-4 w-4 mr-2" />
                                                        {t("Add Payment")}
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </main>
                </div>
            </motion.div>
        </>
    );
}