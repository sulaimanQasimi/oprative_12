import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Users,
    ArrowLeft,
    User,
    Mail,
    Key,
    Building2,
    Shield,
    Save,
    AlertCircle,
    Sparkles,
    Eye,
    EyeOff,
    CheckCircle,
    Info,
    Edit as EditIcon
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
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Badge } from "@/Components/ui/badge";
import { Checkbox } from "@/Components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";
import BackButton from "@/Components/BackButton";

export default function Edit({ auth, customerUser, customers, permissions, customerPermissions = {}, errors }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const { data, setData, patch, processing, errors: formErrors } = useForm({
        name: customerUser.name || '',
        email: customerUser.email || '',
        password: '',
        password_confirmation: '',
        customer_id: customerUser.customer_id || '',
        permissions: customerUser.permissions?.map(p => p.id) || [],
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
        patch(route('admin.customer-users.update', customerUser.id));
    };

    const handlePermissionChange = (permissionId, checked) => {
        if (checked) {
            setData('permissions', [...data.permissions, permissionId]);
        } else {
            setData('permissions', data.permissions.filter(id => id !== permissionId));
        }
    };

    const selectedCustomer = customers.find(c => c.id === parseInt(data.customer_id));

    return (
        <>
            <Head title={`${t("Edit User")} - ${customerUser.name}`}>
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

            <PageLoader isVisible={loading} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.customer-users" />

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
                                        <EditIcon className="w-8 h-8 text-white" />
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
                                        {t("Customer User Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent"
                                    >
                                        {t("Edit User")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <User className="w-4 h-4" />
                                        {t("Update customer user account and permissions")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <BackButton link={route("admin.customer-users.index")} />
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
                                {!customerPermissions.update_customer ? (
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.5 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardContent className="p-12 text-center">
                                                <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                                    <Shield className="h-8 w-8 text-red-500" />
                                                </div>
                                                <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                    {t("Access Denied")}
                                                </h3>
                                                <p className="text-sm text-slate-500 mb-4">
                                                    {t("You don't have permission to edit customer users.")}
                                                </p>
                                                <Link href={route("admin.customer-users.index")}>
                                                    <Button variant="outline" className="gap-2">
                                                        <ArrowLeft className="h-4 w-4" />
                                                        {t("Back")}
                                                    </Button>
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Current User Info */}
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.5 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-blue-900/30 backdrop-blur-xl">
                                            <CardHeader className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-b border-blue-200/50 dark:border-blue-700/50">
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                                        <User className="h-6 w-6 text-white" />
                                                    </div>
                                                    {t("Current User Information")}
                                                    <Badge className="ml-auto bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        {t("Existing")}
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <div className="space-y-2">
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">{t("Name")}</p>
                                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{customerUser.name}</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">{t("Email")}</p>
                                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{customerUser.email}</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">{t("Customer")}</p>
                                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{customerUser.customer?.name || t("No customer assigned")}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Form Card */}
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.0, duration: 0.5 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                                        <Edit className="h-6 w-6 text-white" />
                                                    </div>
                                                    {t("Update User Details")}
                                                    <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                        {t("Required")}
                                                    </Badge>
                                                </CardTitle>
                                                <CardDescription className="text-slate-600 dark:text-slate-400">
                                                    {t("Update the details for this customer user account")}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-8 space-y-8">
                                                {/* Error Alert */}
                                                <AnimatePresence>
                                                    {Object.keys(formErrors).length > 0 && (
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
                                                    {/* Name */}
                                                    <motion.div
                                                        initial={{ x: -20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: 1.1, duration: 0.4 }}
                                                        className="space-y-3"
                                                    >
                                                        <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <User className="w-5 h-5 text-blue-500" />
                                                            {t("Full Name")} *
                                                        </Label>
                                                        <div className="relative">
                                                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                            <Input
                                                                id="name"
                                                                type="text"
                                                                placeholder={t("Enter full name")}
                                                                value={data.name}
                                                                onChange={(e) => setData('name', e.target.value)}
                                                                className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${formErrors.name ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-blue-300 focus:border-blue-500'} bg-white dark:bg-slate-800`}
                                                            />
                                                        </div>
                                                        {formErrors.name && (
                                                            <motion.p
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="text-sm text-red-600 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {formErrors.name}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>

                                                    {/* Email */}
                                                    <motion.div
                                                        initial={{ x: 20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: 1.2, duration: 0.4 }}
                                                        className="space-y-3"
                                                    >
                                                        <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <Mail className="w-5 h-5 text-green-500" />
                                                            {t("Email Address")} *
                                                        </Label>
                                                        <div className="relative">
                                                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                            <Input
                                                                id="email"
                                                                type="email"
                                                                placeholder={t("Enter email address")}
                                                                value={data.email}
                                                                onChange={(e) => setData('email', e.target.value)}
                                                                className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${formErrors.email ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-green-300 focus:border-green-500'} bg-white dark:bg-slate-800`}
                                                            />
                                                        </div>
                                                        {formErrors.email && (
                                                            <motion.p
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="text-sm text-red-600 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {formErrors.email}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>
                                                </div>

                                                {/* Customer Selection */}
                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 1.3, duration: 0.4 }}
                                                    className="space-y-3"
                                                >
                                                    <Label htmlFor="customer_id" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                        <Building2 className="w-5 h-5 text-purple-500" />
                                                        {t("Customer")} *
                                                    </Label>
                                                    <Select
                                                        value={data.customer_id}
                                                        onValueChange={(value) => setData('customer_id', value)}
                                                    >
                                                        <SelectTrigger className={`h-14 text-lg border-2 transition-all duration-200 ${formErrors.customer_id ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-purple-300 focus:border-purple-500'} bg-white dark:bg-slate-800`}>
                                                            <SelectValue placeholder={t("Select a customer")} />
                                                        </SelectTrigger>
                                                        <SelectContent className="max-w-md">
                                                            {customers.map((customer) => (
                                                                <SelectItem key={customer.id} value={customer.id.toString()} className="p-4">
                                                                    <div className="flex items-center space-x-4">
                                                                        <div className="p-2 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-lg">
                                                                            <Building2 className="h-5 w-5 text-purple-600" />
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <div className="font-semibold text-slate-800 dark:text-white">{customer.name}</div>
                                                                            <div className="text-sm text-slate-500">{customer.email || 'No email'}</div>
                                                                        </div>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {formErrors.customer_id && (
                                                        <motion.p
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="text-sm text-red-600 font-medium flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="w-4 h-4" />
                                                            {formErrors.customer_id}
                                                        </motion.p>
                                                    )}
                                                </motion.div>

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                    {/* Password */}
                                                    <motion.div
                                                        initial={{ x: -20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: 1.4, duration: 0.4 }}
                                                        className="space-y-3"
                                                    >
                                                        <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <Key className="w-5 h-5 text-red-500" />
                                                            {t("New Password")}
                                                            <Badge variant="secondary" className="text-xs">
                                                                {t("Optional")}
                                                            </Badge>
                                                        </Label>
                                                        <div className="relative">
                                                            <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                            <Input
                                                                id="password"
                                                                type={showPassword ? "text" : "password"}
                                                                placeholder={t("Leave blank to keep current password")}
                                                                value={data.password}
                                                                onChange={(e) => setData('password', e.target.value)}
                                                                className={`pl-12 pr-12 h-14 text-lg border-2 transition-all duration-200 ${formErrors.password ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-red-300 focus:border-red-500'} bg-white dark:bg-slate-800`}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                                            >
                                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                            </Button>
                                                        </div>
                                                        {formErrors.password && (
                                                            <motion.p
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="text-sm text-red-600 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {formErrors.password}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>

                                                    {/* Confirm Password */}
                                                    <motion.div
                                                        initial={{ x: 20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: 1.5, duration: 0.4 }}
                                                        className="space-y-3"
                                                    >
                                                        <Label htmlFor="password_confirmation" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <Key className="w-5 h-5 text-orange-500" />
                                                            {t("Confirm New Password")}
                                                        </Label>
                                                        <div className="relative">
                                                            <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                            <Input
                                                                id="password_confirmation"
                                                                type={showPasswordConfirm ? "text" : "password"}
                                                                placeholder={t("Confirm new password")}
                                                                value={data.password_confirmation}
                                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                                className={`pl-12 pr-12 h-14 text-lg border-2 transition-all duration-200 ${formErrors.password_confirmation ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-orange-300 focus:border-orange-500'} bg-white dark:bg-slate-800`}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                                            >
                                                                {showPasswordConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                            </Button>
                                                        </div>
                                                        {formErrors.password_confirmation && (
                                                            <motion.p
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="text-sm text-red-600 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {formErrors.password_confirmation}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>
                                                </div>

                                                {/* Password Info Alert */}
                                                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                                                    <Info className="h-4 w-4 text-blue-600" />
                                                    <AlertDescription className="text-blue-700 dark:text-blue-400">
                                                        {t("Leave password fields blank to keep the current password unchanged.")}
                                                    </AlertDescription>
                                                </Alert>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Permissions Card */}
                                    {permissions && permissions.length > 0 && (
                                        <motion.div
                                            initial={{ scale: 0.95, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 1.6, duration: 0.5 }}
                                        >
                                            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                                <CardHeader className="bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-purple-500/20 border-b border-white/30 dark:border-slate-700/50">
                                                    <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                        <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                                                            <Shield className="h-6 w-6 text-white" />
                                                        </div>
                                                        {t("Permissions")}
                                                        <Badge variant="secondary" className="ml-auto bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                                            {t("Optional")}
                                                        </Badge>
                                                    </CardTitle>
                                                    <CardDescription className="text-slate-600 dark:text-slate-400">
                                                        {t("Update the permissions for this user account")}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="p-8">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {permissions.map((permission) => (
                                                            <motion.div
                                                                key={permission.id}
                                                                whileHover={{ scale: 1.02 }}
                                                                className="flex items-center space-x-3 p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 bg-white/50 dark:bg-slate-800/50"
                                                            >
                                                                <Checkbox
                                                                    id={`permission-${permission.id}`}
                                                                    checked={data.permissions.includes(permission.id)}
                                                                    onCheckedChange={(checked) => handlePermissionChange(permission.id, checked)}
                                                                />
                                                                <div className="flex-1">
                                                                    <Label
                                                                        htmlFor={`permission-${permission.id}`}
                                                                        className="font-semibold text-slate-800 dark:text-white cursor-pointer"
                                                                    >
                                                                        {permission.label || permission.name}
                                                                    </Label>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                    {data.permissions.length > 0 && (
                                                        <Alert className="mt-6 border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                                                            <Shield className="h-4 w-4 text-purple-600" />
                                                            <AlertDescription className="text-purple-700 dark:text-purple-400">
                                                                <strong>{data.permissions.length}</strong> {t("permissions selected")}
                                                            </AlertDescription>
                                                        </Alert>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )}

                                    {/* Customer Info Display */}
                                    <AnimatePresence>
                                        {selectedCustomer && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                                transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                                            >
                                                <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-blue-900/30 backdrop-blur-xl">
                                                    <CardHeader className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-b border-blue-200/50 dark:border-blue-700/50">
                                                        <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                                                <Building2 className="h-6 w-6 text-white" />
                                                            </div>
                                                            {t("Selected Customer")}
                                                            <Badge className="ml-auto bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                {t("Selected")}
                                                            </Badge>
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="p-8">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div className="space-y-2">
                                                                <p className="text-sm text-slate-600 dark:text-slate-400">{t("Customer Name")}</p>
                                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{selectedCustomer.name}</p>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <p className="text-sm text-slate-600 dark:text-slate-400">{t("Email")}</p>
                                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{selectedCustomer.email || t("Not provided")}</p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Submit Button */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.7, duration: 0.4 }}
                                        className="flex justify-end space-x-6 pt-6"
                                    >
                                        <Link href={route("admin.customer-users.index")}>
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
                                            className="px-8 py-4 text-lg shadow-2xl transition-all duration-200 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 hover:scale-105 hover:shadow-3xl text-white"
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                                    {t("Updating...")}
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-5 w-5 mr-3" />
                                                    {t("Update User")}
                                                </>
                                            )}
                                        </Button>
                                    </motion.div>
                                </form>
                                )}
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
}
