import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    User,
    ArrowLeft,
    Save,
    Mail,
    Shield,
    Key,
    UserCheck,
    Building2,
    Sparkles,
    AlertCircle,
    CheckCircle,
    Info
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
import { Badge } from "@/Components/ui/badge";
import { Checkbox } from "@/Components/ui/checkbox";
import { motion } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Create({ auth, customers, permissions, selectedCustomerId }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        customer_id: selectedCustomerId || "",
        permissions: [],
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
        post(route("admin.customer-users.store"), {
            onSuccess: () => {
                reset();
            },
        });
    };

    const handlePermissionChange = (permissionId, checked) => {
        if (checked) {
            setData('permissions', [...data.permissions, permissionId]);
        } else {
            setData('permissions', data.permissions.filter(id => id !== permissionId));
        }
    };

    // Filter permissions by customer_user guard
    const customerPermissions = permissions.filter(permission => permission.guard_name === 'customer_user');

    return (
        <>
            <Head title={t("Add New Customer User")}>
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
                        50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.5); }
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
                        animation: pulse-glow 3s ease-in-out infinite;
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

                    .input-glow:focus {
                        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                        border-color: #3b82f6;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={User} color="blue" />

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
                                        <User className="w-8 h-8 text-white" />
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
                                        {t("User Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent"
                                    >
                                        {t("Add New User")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <UserCheck className="w-4 h-4" />
                                        {t("Create a new customer user account")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Link href={route("admin.customer-users.index")}>
                                    <Button variant="outline" className="gap-2 border-2 hover:border-blue-300">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Users")}
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
                                className="max-w-4xl mx-auto"
                            >
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Basic Information Card */}
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.4 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                                        <User className="h-6 w-6 text-white" />
                                                    </div>
                                                    {t("Basic Information")}
                                                    <Badge className="ml-auto bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                        {t("Required")}
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8 space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <motion.div
                                                        initial={{ x: -20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: 1.0, duration: 0.4 }}
                                                        className="space-y-2"
                                                    >
                                                        <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                                                            <User className="w-4 h-4 text-blue-600" />
                                                            {t("Full Name")} *
                                                        </Label>
                                                        <Input
                                                            id="name"
                                                            type="text"
                                                            value={data.name}
                                                            onChange={(e) => setData("name", e.target.value)}
                                                            className={`h-12 border-2 transition-all duration-200 input-glow ${
                                                                errors.name ? "border-red-300 focus:border-red-500" : "border-slate-200 hover:border-blue-300"
                                                            }`}
                                                            placeholder={t("Enter full name")}
                                                            required
                                                        />
                                                        {errors.name && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-red-500 text-sm flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.name}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>

                                                    <motion.div
                                                        initial={{ x: 20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: 1.1, duration: 0.4 }}
                                                        className="space-y-2"
                                                    >
                                                        <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                                                            <Mail className="w-4 h-4 text-blue-600" />
                                                            {t("Email Address")} *
                                                        </Label>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            value={data.email}
                                                            onChange={(e) => setData("email", e.target.value)}
                                                            className={`h-12 border-2 transition-all duration-200 input-glow ${
                                                                errors.email ? "border-red-300 focus:border-red-500" : "border-slate-200 hover:border-blue-300"
                                                            }`}
                                                            placeholder={t("Enter email address")}
                                                            required
                                                        />
                                                        {errors.email && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-red-500 text-sm flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.email}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>

                                                    <motion.div
                                                        initial={{ x: -20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: 1.2, duration: 0.4 }}
                                                        className="space-y-2"
                                                    >
                                                        <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                                                            <Key className="w-4 h-4 text-blue-600" />
                                                            {t("Password")} *
                                                        </Label>
                                                        <Input
                                                            id="password"
                                                            type="password"
                                                            value={data.password}
                                                            onChange={(e) => setData("password", e.target.value)}
                                                            className={`h-12 border-2 transition-all duration-200 input-glow ${
                                                                errors.password ? "border-red-300 focus:border-red-500" : "border-slate-200 hover:border-blue-300"
                                                            }`}
                                                            placeholder={t("Enter password")}
                                                            required
                                                        />
                                                        {errors.password && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-red-500 text-sm flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.password}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>

                                                    <motion.div
                                                        initial={{ x: 20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: 1.3, duration: 0.4 }}
                                                        className="space-y-2"
                                                    >
                                                        <Label htmlFor="password_confirmation" className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                                                            <Key className="w-4 h-4 text-blue-600" />
                                                            {t("Confirm Password")} *
                                                        </Label>
                                                        <Input
                                                            id="password_confirmation"
                                                            type="password"
                                                            value={data.password_confirmation}
                                                            onChange={(e) => setData("password_confirmation", e.target.value)}
                                                            className={`h-12 border-2 transition-all duration-200 input-glow ${
                                                                errors.password_confirmation ? "border-red-300 focus:border-red-500" : "border-slate-200 hover:border-blue-300"
                                                            }`}
                                                            placeholder={t("Confirm password")}
                                                            required
                                                        />
                                                        {errors.password_confirmation && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-red-500 text-sm flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.password_confirmation}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>

                                                    <motion.div
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        transition={{ delay: 1.4, duration: 0.4 }}
                                                        className="md:col-span-2 space-y-2"
                                                    >
                                                        <Label htmlFor="customer_id" className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                                                            <Building2 className="w-4 h-4 text-blue-600" />
                                                            {t("Store")} *
                                                        </Label>
                                                        <Select value={data.customer_id} onValueChange={(value) => setData("customer_id", value)}>
                                                            <SelectTrigger className="h-12 border-2 border-slate-200 hover:border-blue-300 focus:border-blue-500 transition-colors">
                                                                <SelectValue placeholder={t("Select a store")} />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {customers.map(customer => (
                                                                    <SelectItem key={customer.id} value={customer.id.toString()}>
                                                                        {customer.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.customer_id && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-red-500 text-sm flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.customer_id}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                                                        {/* Permissions Card */}
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.5, duration: 0.4 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-purple-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                    <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg">
                                                        <Shield className="h-6 w-6 text-white" />
                                                    </div>
                                                    {t("User Permissions")}
                                                    <Badge className="ml-auto bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                                        {t("Customer User Guard")}
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8 space-y-6">
                                                {/* Permissions Section */}
                                                <div className="space-y-4">
                                                    <Label className="text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Key className="w-5 h-5 text-purple-600" />
                                                        {t("Select Permissions")}
                                                    </Label>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {customerPermissions.map(permission => (
                                                            <motion.div
                                                                key={permission.id}
                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: 1.8 + (permission.id * 0.05), duration: 0.3 }}
                                                                className="flex items-center space-x-3 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-purple-300 transition-colors"
                                                            >
                                                                <Checkbox
                                                                    id={`permission-${permission.id}`}
                                                                    checked={data.permissions.includes(permission.id)}
                                                                    onCheckedChange={(checked) => handlePermissionChange(permission.id, checked)}
                                                                />
                                                                <div className="flex-1">
                                                                    <Label
                                                                        htmlFor={`permission-${permission.id}`}
                                                                        className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                                                                    >
                                                                        {permission.name}
                                                                    </Label>
                                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                        {permission.description || t("Permission for customer users")}
                                                                    </p>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                    {customerPermissions.length === 0 && (
                                                        <div className="text-center py-8">
                                                            <p className="text-slate-500 dark:text-slate-400">
                                                                {t("No permissions available for customer user guard")}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Submit Button */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 2.0, duration: 0.4 }}
                                        className="flex justify-end space-x-4"
                                    >
                                        <Link href={route("admin.customer-users.index")}>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="gap-2 h-12 px-8 border-2 hover:border-slate-300"
                                            >
                                                <ArrowLeft className="h-4 w-4" />
                                                {t("Cancel")}
                                            </Button>
                                        </Link>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="gap-2 h-12 px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 pulse-glow"
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    {t("Creating...")}
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4" />
                                                    {t("Create User")}
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
