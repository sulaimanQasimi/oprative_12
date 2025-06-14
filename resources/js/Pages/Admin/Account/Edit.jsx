import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";
import {
    Save,
    ArrowLeft,
    CreditCard,
    MapPin,
    AlertCircle,
    User,
    Hash,
    Building2,
    CheckCircle,
    Sparkles,
    Eye,
    Edit3
} from 'lucide-react';
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

export default function Edit({ account, customers, auth }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: account.name || '',
        id_number: account.id_number || '',
        account_number: account.account_number || '',
        customer_id: account.customer_id || '',
        address: account.address || '',
        status: account.status || 'pending',
    });

    // Animation effect
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
        put(route('admin.accounts.update', account.id), {
            onFinish: () => setLoading(false),
        });
    };

    return (
        <>
            <Head title={t("Edit Account - :name", { name: account.name })}>
                <style>{`
                    @keyframes shimmer {
                        0% { background-position: -1000px 0; }
                        100% { background-position: 1000px 0; }
                    }

                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }

                    @keyframes pulse-glow {
                        0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
                        50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
                    }

                    .shimmer {
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                        background-size: 1000px 100%;
                        animation: shimmer 2s infinite;
                    }

                    .float-animation {
                        animation: float 6s ease-in-out infinite;
                    }

                    .pulse-glow {
                        animation: pulse-glow 2s ease-in-out infinite;
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

                    .gradient-border {
                        background: linear-gradient(white, white) padding-box,
                                    linear-gradient(45deg, #3b82f6, #1d4ed8) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #3b82f6, #1d4ed8) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={Edit3} color="blue" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.accounts" />

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
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative float-animation"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 p-4 rounded-2xl shadow-2xl">
                                        <Edit3 className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {t("Account Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent"
                                    >
                                        {t("Edit Account")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Building2 className="w-4 h-4" />
                                        {t("Update account information and settings")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Link href={route('admin.accounts.show', account.id)}>
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-all duration-200 border-green-200 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20">
                                        <Eye className="h-4 w-4" />
                                        {t("View Details")}
                                    </Button>
                                </Link>
                                <Link href={route('admin.accounts.index')}>
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-all duration-200 border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Accounts")}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-700 scrollbar-track-transparent">
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
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                                        <Edit3 className="h-6 w-6 text-white" />
                                                    </div>
                                                    {t("Account Details")}
                                                    <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                        {t("Editing")}
                                                    </Badge>
                                                </CardTitle>
                                                <CardDescription className="text-slate-600 dark:text-slate-400">
                                                    {t("Update the account information below")}
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
                                                            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 pulse-glow">
                                                                <AlertCircle className="h-5 w-5 text-red-600" />
                                                                <AlertDescription className="text-red-700 dark:text-red-400 font-medium">
                                                                    {t("Please correct the errors below and try again.")}
                                                                </AlertDescription>
                                                            </Alert>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                    {/* Account Name */}
                                                    <motion.div
                                                        initial={{ x: -20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: 1.0, duration: 0.4 }}
                                                        className="space-y-3"
                                                    >
                                                        <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <User className="w-5 h-5 text-blue-500" />
                                                            {t("Account Name")} *
                                                        </Label>
                                                        <div className="relative">
                                                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                            <Input
                                                                id="name"
                                                                type="text"
                                                                placeholder={t("Enter account name")}
                                                                value={data.name}
                                                                onChange={(e) => setData('name', e.target.value)}
                                                                className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${errors.name ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-blue-300 focus:border-blue-500'} bg-white dark:bg-slate-800`}
                                                            />
                                                        </div>
                                                        {errors.name && (
                                                            <motion.p
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="text-sm text-red-600 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.name}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>

                                                    {/* Customer Selection */}
                                                    <motion.div
                                                        initial={{ x: 20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: 1.1, duration: 0.4 }}
                                                        className="space-y-3"
                                                    >
                                                        <Label htmlFor="customer_id" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <Building2 className="w-5 h-5 text-emerald-500" />
                                                            {t("Customer")} *
                                                        </Label>
                                                        <Select
                                                            value={data.customer_id.toString()}
                                                            onValueChange={(value) => setData('customer_id', value)}
                                                        >
                                                            <SelectTrigger className={`h-14 text-lg border-2 transition-all duration-200 ${errors.customer_id ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-emerald-300 focus:border-emerald-500'} bg-white dark:bg-slate-800`}>
                                                                <SelectValue placeholder={t("Select a customer")} />
                                                            </SelectTrigger>
                                                            <SelectContent className="max-w-md">
                                                                {customers.map((customer) => (
                                                                    <SelectItem key={customer.id} value={customer.id.toString()} className="p-4">
                                                                        <div className="flex items-center space-x-4">
                                                                            <div className="p-2 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-lg">
                                                                                <Building2 className="h-5 w-5 text-emerald-600" />
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <div className="font-semibold text-slate-800 dark:text-white">{customer.name}</div>
                                                                            </div>
                                                                        </div>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.customer_id && (
                                                            <motion.p
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="text-sm text-red-600 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.customer_id}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>
                                                </div>

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                    {/* ID Number */}
                                                    <motion.div
                                                        initial={{ x: -20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: 1.2, duration: 0.4 }}
                                                        className="space-y-3"
                                                    >
                                                        <Label htmlFor="id_number" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <Hash className="w-5 h-5 text-purple-500" />
                                                            {t("ID Number")} *
                                                        </Label>
                                                        <div className="relative">
                                                            <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                            <Input
                                                                id="id_number"
                                                                type="text"
                                                                placeholder={t("Enter ID number")}
                                                                value={data.id_number}
                                                                onChange={(e) => setData('id_number', e.target.value)}
                                                                className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${errors.id_number ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-purple-300 focus:border-purple-500'} bg-white dark:bg-slate-800`}
                                                            />
                                                        </div>
                                                        {errors.id_number && (
                                                            <motion.p
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="text-sm text-red-600 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.id_number}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>

                                                    {/* Account Number */}
                                                    <motion.div
                                                        initial={{ x: 20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: 1.3, duration: 0.4 }}
                                                        className="space-y-3"
                                                    >
                                                        <Label htmlFor="account_number" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <CreditCard className="w-5 h-5 text-green-500" />
                                                            {t("Account Number")} *
                                                        </Label>
                                                        <div className="relative">
                                                            <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                            <Input
                                                                id="account_number"
                                                                type="text"
                                                                placeholder={t("Enter account number")}
                                                                value={data.account_number}
                                                                onChange={(e) => setData('account_number', e.target.value)}
                                                                className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${errors.account_number ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-green-300 focus:border-green-500'} bg-white dark:bg-slate-800`}
                                                            />
                                                        </div>
                                                        {errors.account_number && (
                                                            <motion.p
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="text-sm text-red-600 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.account_number}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>
                                                </div>

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                    {/* Status */}
                                                    <motion.div
                                                        initial={{ x: -20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: 1.4, duration: 0.4 }}
                                                        className="space-y-3"
                                                    >
                                                        <Label htmlFor="status" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <CheckCircle className="w-5 h-5 text-orange-500" />
                                                            {t("Status")} *
                                                        </Label>
                                                        <Select
                                                            value={data.status}
                                                            onValueChange={(value) => setData('status', value)}
                                                        >
                                                            <SelectTrigger className={`h-14 text-lg border-2 transition-all duration-200 ${errors.status ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-orange-300 focus:border-orange-500'} bg-white dark:bg-slate-800`}>
                                                                <SelectValue placeholder={t("Select status")} />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="pending" className="p-4">
                                                                    <div className="flex items-center space-x-4">
                                                                        <div className="p-2 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg">
                                                                            <CheckCircle className="h-5 w-5 text-yellow-600" />
                                                                        </div>
                                                                        <span className="font-semibold">{t("Pending")}</span>
                                                                    </div>
                                                                </SelectItem>
                                                                <SelectItem value="active" className="p-4">
                                                                    <div className="flex items-center space-x-4">
                                                                        <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg">
                                                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                                                        </div>
                                                                        <span className="font-semibold">{t("Active")}</span>
                                                                    </div>
                                                                </SelectItem>
                                                                <SelectItem value="suspended" className="p-4">
                                                                    <div className="flex items-center space-x-4">
                                                                        <div className="p-2 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-lg">
                                                                            <CheckCircle className="h-5 w-5 text-red-600" />
                                                                        </div>
                                                                        <span className="font-semibold">{t("Suspended")}</span>
                                                                    </div>
                                                                </SelectItem>
                                                                <SelectItem value="closed" className="p-4">
                                                                    <div className="flex items-center space-x-4">
                                                                        <div className="p-2 bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-900/30 dark:to-slate-900/30 rounded-lg">
                                                                            <CheckCircle className="h-5 w-5 text-gray-600" />
                                                                        </div>
                                                                        <span className="font-semibold">{t("Closed")}</span>
                                                                    </div>
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.status && (
                                                            <motion.p
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="text-sm text-red-600 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.status}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>

                                                    {/* Empty space for layout balance */}
                                                    <div></div>
                                                </div>

                                                {/* Address */}
                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 1.5, duration: 0.4 }}
                                                    className="space-y-3"
                                                >
                                                    <Label htmlFor="address" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                        <MapPin className="w-5 h-5 text-red-500" />
                                                        {t("Address")}
                                                        <Badge variant="secondary" className="text-xs">
                                                            {t("Optional")}
                                                        </Badge>
                                                    </Label>
                                                    <Textarea
                                                        id="address"
                                                        placeholder={t("Enter address (optional)")}
                                                        value={data.address}
                                                        onChange={(e) => setData('address', e.target.value)}
                                                        rows={4}
                                                        className={`resize-none text-lg border-2 transition-all duration-200 ${errors.address ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-red-300 focus:border-red-500'} bg-white dark:bg-slate-800`}
                                                    />
                                                    {errors.address && (
                                                        <motion.p
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="text-sm text-red-600 font-medium flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="w-4 h-4" />
                                                            {errors.address}
                                                        </motion.p>
                                                    )}
                                                </motion.div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Submit Button */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.6, duration: 0.4 }}
                                        className="flex justify-end space-x-6 pt-6"
                                    >
                                        <Link href={route('admin.accounts.show', account.id)}>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="px-8 py-4 text-lg border-2 hover:scale-105 transition-all duration-200"
                                            >
                                                {t("Cancel")}
                                            </Button>
                                        </Link>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className={`px-8 py-4 text-lg shadow-2xl transition-all duration-200 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 hover:scale-105 hover:shadow-3xl text-white`}
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                                    {t("Updating...")}
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-5 w-5 mr-3" />
                                                    {t("Update Account")}
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
