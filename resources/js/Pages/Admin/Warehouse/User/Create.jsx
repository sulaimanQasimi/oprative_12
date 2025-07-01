import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Building2,
    ArrowLeft,
    UserPlus,
    Shield,
    Users,
    Key,
    Mail,
    AlertCircle,
    Save,
    Sparkles
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

export default function Create({ auth, warehouse, permissions }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
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
        post(route("admin.warehouses.users.store", warehouse.id));
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
            <Head title={`${warehouse?.name} - ${t("Add Warehouse User")}`}>
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
                                    linear-gradient(45deg, #3b82f6, #6366f1) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #3b82f6, #6366f1) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={UserPlus} color="green" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
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
                                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                                    <UserPlus className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-wider text-green-600 dark:text-green-400 mb-1 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        {warehouse?.name} - {t("User Management")}
                                    </p>
                                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                                        {t("Add New User")}
                                    </h1>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                        <Building2 className="w-4 h-4" />
                                        {t("Create a new warehouse user with permissions")}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Link href={route("admin.warehouses.show", warehouse.id)}>
                                    <Button variant="outline" className="gap-2 dark:text-white text-black hover:scale-105 transition-all duration-200">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Warehouse")}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-green-300 dark:scrollbar-thumb-green-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="max-w-5xl mx-auto"
                            >
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* User Information Section */}
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.5 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="border-b border-slate-200 dark:border-slate-600">
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                    <div className="p-2 bg-blue-500 rounded-lg">
                                                        <Users className="h-5 w-5 text-white" />
                                                    </div>
                                                    {t("User Information")}
                                                    <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                        {t("Required")}
                                                    </Badge>
                                                </CardTitle>
                                                <CardDescription className="text-slate-600 dark:text-slate-400 mt-2">
                                                    {t("Enter the basic information for the new warehouse user")}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-8">
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    {/* Name */}
                                                    <div className="space-y-3">
                                                        <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <Users className="w-5 h-5 text-blue-500" />
                                                            {t("Full Name")} *
                                                        </Label>
                                                        <Input
                                                            id="name"
                                                            type="text"
                                                            value={data.name}
                                                            onChange={(e) => setData("name", e.target.value)}
                                                            className={`h-14 text-lg border-2 transition-all duration-200 ${errors.name ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-blue-300 focus:border-blue-500'} bg-white dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400`}
                                                            placeholder={t("Enter full name")}
                                                            required
                                                        />
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
                                                    </div>

                                                    {/* Email */}
                                                    <div className="space-y-3">
                                                        <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <Mail className="w-5 h-5 text-green-500" />
                                                            {t("Email Address")} *
                                                        </Label>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            value={data.email}
                                                            onChange={(e) => setData("email", e.target.value)}
                                                            className={`h-14 text-lg border-2 transition-all duration-200 ${errors.email ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-green-300 focus:border-green-500'} bg-white dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400`}
                                                            placeholder={t("Enter email address")}
                                                            required
                                                        />
                                                        {errors.email && (
                                                            <motion.p
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="text-sm text-red-600 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.email}
                                                            </motion.p>
                                                        )}
                                                    </div>

                                                    {/* Password */}
                                                    <div className="space-y-3 lg:col-span-2">
                                                        <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <Key className="w-5 h-5 text-purple-500" />
                                                            {t("Password")} *
                                                        </Label>
                                                        <Input
                                                            id="password"
                                                            type="password"
                                                            value={data.password}
                                                            onChange={(e) => setData("password", e.target.value)}
                                                            className={`h-14 text-lg border-2 transition-all duration-200 ${errors.password ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-purple-300 focus:border-purple-500'} bg-white dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400`}
                                                            placeholder={t("Enter secure password")}
                                                            required
                                                        />
                                                        {errors.password && (
                                                            <motion.p
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="text-sm text-red-600 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.password}
                                                            </motion.p>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Permissions Section */}
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.0, duration: 0.5 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="border-b border-slate-200 dark:border-slate-600">
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                    <div className="p-2 bg-purple-500 rounded-lg">
                                                        <Shield className="h-5 w-5 text-white" />
                                                    </div>
                                                    {t("Warehouse Permissions")}
                                                </CardTitle>
                                                <CardDescription className="text-slate-600 dark:text-slate-400 mt-2">
                                                    {t("Select the permissions this user will have within this warehouse")}
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
                                                                className="space-y-4 p-6 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-all duration-200"
                                                            >
                                                                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200 capitalize flex items-center gap-2">
                                                                    <Shield className="h-5 w-5 flex-shrink-0 text-purple-500" />
                                                                    <span className="truncate">{categoryPermissions[0]?.label || getPermissionDisplayName(categoryPermissions[0]?.name)}</span>
                                                                </h4>
                                                                <div className="space-y-4">
                                                                    {categoryPermissions.map((permission) => (
                                                                        <div key={permission.id} className="flex items-start space-x-3">
                                                                            <Checkbox
                                                                                id={`permission-${permission.id}`}
                                                                                checked={data.permissions.includes(permission.name)}
                                                                                onCheckedChange={() => togglePermission(permission.name)}
                                                                                className="border-purple-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 mt-0.5 flex-shrink-0 w-5 h-5 dark:border-slate-500"
                                                                            />
                                                                            <Label
                                                                                htmlFor={`permission-${permission.id}`}
                                                                                className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors leading-relaxed font-medium"
                                                                            >
                                                                                {permission.label || getPermissionDisplayName(permission.name)}
                                                                            </Label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12">
                                                        <div className="flex flex-col items-center gap-4">
                                                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                                                                <Shield className="h-8 w-8 text-white" />
                                                            </div>
                                                            <p className="text-slate-600 dark:text-slate-400 text-lg">
                                                                {t("No warehouse permissions available")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {errors.permissions && (
                                                    <motion.p
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="text-sm text-red-600 font-medium flex items-center gap-1 mt-4"
                                                    >
                                                        <AlertCircle className="w-4 h-4" />
                                                        {errors.permissions}
                                                    </motion.p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Submit Button */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.2, duration: 0.4 }}
                                        className="flex justify-end space-x-6 pt-6"
                                    >
                                        <Link href={route("admin.warehouses.show", warehouse.id)}>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="px-8 py-4 text-lg border-2 dark:text-white text-black hover:scale-105 transition-all duration-200"
                                            >
                                                {t("Cancel")}
                                            </Button>
                                        </Link>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className={`px-8 py-4 text-lg shadow-2xl transition-all duration-200 ${
                                                processing
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 hover:scale-105 hover:shadow-3xl'
                                            } text-white`}
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                                    {t("Creating...")}
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-5 w-5 mr-3" />
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
