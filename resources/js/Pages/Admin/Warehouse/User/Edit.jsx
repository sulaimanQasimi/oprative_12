import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Building2,
    ArrowLeft,
    Edit as EditIcon,
    Shield,
    Users,
    Key,
    Mail,
    AlertCircle,
    CheckCircle,
    Save
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
import { Checkbox } from "@/Components/ui/checkbox";
import { Badge } from "@/Components/ui/badge";
import { motion } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Edit({ auth, warehouse, user, permissions }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
        permissions: user?.permissions?.map(p => p.name) || [],
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
        put(route("admin.warehouses.users.update", [warehouse.id, user.id]));
    };

    const togglePermission = (permissionName) => {
        const currentPermissions = [...data.permissions];
        if (currentPermissions.includes(permissionName)) {
            setData("permissions", currentPermissions.filter(p => p !== permissionName));
        } else {
            setData("permissions", [...currentPermissions, permissionName]);
        }
    };

    // Filter warehouse-specific permissions
    const warehousePermissions = permissions?.filter(permission =>
        permission.guard_name === 'warehouse_user'
    ) || [];

    // Group permissions by category for better organization
    const groupedPermissions = warehousePermissions.reduce((groups, permission) => {
        const category = permission.name.split('.')[1] || 'general';
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(permission);
        return groups;
    }, {});

    const getPermissionDisplayName = (permissionName) => {
        return permissionName.replace('warehouse.', '').replace(/[._]/g, ' ').toUpperCase();
    };

    return (
        <>
            <Head title={t("Edit Warehouse User")}>
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

                    .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
                        background-size: 14px 14px;
                    }

                    .dark .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
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
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-hidden bg-grid-pattern"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.warehouses" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Enhanced Header */}
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
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl blur opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
                                        <EditIcon className="w-8 h-8 text-white" />
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1"
                                    >
                                        {t("User Management")}
                                        <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                                            {t("Edit Mode")}
                                        </Badge>
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
                                    >
                                        {user?.name}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400"
                                    >
                                        {t("Warehouse")}: <span className="font-semibold">{warehouse?.name}</span>
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
                                className="max-w-4xl mx-auto"
                            >
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* User Information Section */}
                                    <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                                        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-white/20 dark:border-slate-700/50">
                                            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                    <Users className="h-5 w-5 text-white" />
                                                </div>
                                                {t("User Information")}
                                            </CardTitle>
                                            <CardDescription className="text-slate-600 dark:text-slate-400">
                                                {t("Update the user's basic information and account details")}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* Name */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                                                        <Users className="h-4 w-4" />
                                                        {t("Full Name")} <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        type="text"
                                                        value={data.name}
                                                        onChange={(e) => setData("name", e.target.value)}
                                                        className={errors.name ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}
                                                        placeholder={t("Enter full name")}
                                                        required
                                                    />
                                                    {errors.name && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-500 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.name}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* Email */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                                                        <Mail className="h-4 w-4" />
                                                        {t("Email Address")} <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={data.email}
                                                        onChange={(e) => setData("email", e.target.value)}
                                                        className={errors.email ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}
                                                        placeholder={t("Enter email address")}
                                                        required
                                                    />
                                                    {errors.email && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-500 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.email}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* Password */}
                                                <div className="space-y-2 lg:col-span-2">
                                                    <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                                                        <Key className="h-4 w-4" />
                                                        {t("Password")}
                                                        <Badge variant="outline" className="text-xs ml-2">
                                                            {t("Optional")}
                                                        </Badge>
                                                    </Label>
                                                    <Input
                                                        id="password"
                                                        type="password"
                                                        value={data.password}
                                                        onChange={(e) => setData("password", e.target.value)}
                                                        className={errors.password ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}
                                                        placeholder={t("Leave blank to keep current password")}
                                                    />
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {t("Only enter a new password if you want to change it")}
                                                    </p>
                                                    {errors.password && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-500 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.password}
                                                        </motion.p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Permissions Section */}
                                    <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                                        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-white/20 dark:border-slate-700/50">
                                            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                                                    <Shield className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Warehouse Permissions")}
                                            </CardTitle>
                                            <CardDescription className="text-slate-600 dark:text-slate-400">
                                                {t("Manage the permissions this user has within this warehouse")}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            {Object.keys(groupedPermissions).length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                                                        <motion.div
                                                            key={category}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="space-y-4 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-700 dark:to-slate-600 border border-purple-200/50 dark:border-slate-600"
                                                        >
                                                            <h4 className="font-semibold text-purple-700 dark:text-purple-300 capitalize flex items-center gap-2">
                                                                <Shield className="h-4 w-4 flex-shrink-0" />
                                                                <span className="truncate">{category.replace(/[._]/g, ' ')}</span>
                                                            </h4>
                                                            <div className="space-y-3">
                                                                {categoryPermissions.map((permission) => (
                                                                    <div key={permission.id} className="flex items-start space-x-3">
                                                                        <Checkbox
                                                                            id={`permission-${permission.id}`}
                                                                            checked={data.permissions.includes(permission.name)}
                                                                            onCheckedChange={() => togglePermission(permission.name)}
                                                                            className="border-purple-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 mt-0.5 flex-shrink-0"
                                                                        />
                                                                        <Label
                                                                            htmlFor={`permission-${permission.id}`}
                                                                            className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors leading-relaxed"
                                                                        >
                                                                            {getPermissionDisplayName(permission.name)}
                                                                        </Label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                                                            <Shield className="h-6 w-6 text-white" />
                                                        </div>
                                                        <p className="text-slate-600 dark:text-slate-400">
                                                            {t("No warehouse permissions available")}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {errors.permissions && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-sm text-red-500 flex items-center gap-1 mt-4"
                                                >
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.permissions}
                                                </motion.p>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end gap-4">
                                        <Link href={route("admin.warehouses.show", warehouse.id)}>
                                            <Button variant="outline" className="hover:scale-105 transition-transform">
                                                {t("Cancel")}
                                            </Button>
                                        </Link>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:scale-105 transition-transform"
                                        >
                                            {processing ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    {t("Updating...")}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Save className="h-4 w-4" />
                                                    {t("Update User")}
                                                </div>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
}
