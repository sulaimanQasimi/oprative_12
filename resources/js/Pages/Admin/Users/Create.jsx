import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    User,
    Mail,
    Lock,
    Shield,
    Key,
    Crown,
    Eye,
    EyeOff,
    Check,
    X,
    Sparkles,
    UserPlus,
    Save,
    ChevronDown,
    ChevronRight
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
import { Badge } from "@/Components/ui/badge";
import { Checkbox } from "@/Components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function CreateUser({ auth, roles, permissions }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [collapsedGroups, setCollapsedGroups] = useState({});

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [],
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
        post(route('admin.users.store'), {
            onSuccess: () => {
                reset();
            },
        });
    };

    const handleRoleChange = (roleId, checked) => {
        if (checked) {
            setData('roles', [...data.roles, roleId]);
        } else {
            setData('roles', data.roles.filter(id => id !== roleId));
        }
    };

    const handlePermissionChange = (permissionId, checked) => {
        if (checked) {
            setData('permissions', [...data.permissions, permissionId]);
        } else {
            setData('permissions', data.permissions.filter(id => id !== permissionId));
        }
    };

    const toggleGroup = (groupName) => {
        setCollapsedGroups(prev => ({
            ...prev,
            [groupName]: !prev[groupName]
        }));
    };

    // Group permissions by their group field or by extracting from name
    const groupedPermissions = permissions?.reduce((groups, permission) => {
        // Use the group field if available, otherwise extract from permission name
        const group = permission.group || permission.name.split('_').slice(-1)[0] || 'other';
        const groupName = group.charAt(0).toUpperCase() + group.slice(1);

        if (!groups[groupName]) {
            groups[groupName] = [];
        }
        groups[groupName].push(permission);
        return groups;
    }, {}) || {};

    return (
        <>
            <Head title={t("Create User")}>
                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }

                    @keyframes pulse-glow {
                        0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
                        50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
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

            <PageLoader isVisible={loading} icon={UserPlus} color="blue" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.users" />

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
                                        <UserPlus className="w-8 h-8 text-white" />
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
                                        {t("Admin Panel")} - {t("User Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent"
                                    >
                                        {t("Create User")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        {t("Add a new user to the system")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                            >
                                <Link href={route("admin.users.index")}>
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-all duration-200">
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
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-8">
                                        {/* Basic Information and Roles Row */}
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            {/* Basic Information */}
                                            <div className="lg:col-span-2">
                                            <motion.div
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.9, duration: 0.4 }}
                                            >
                                                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                                    <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50">
                                                        <CardTitle className="flex items-center gap-3">
                                                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                                <User className="h-5 w-5 text-white" />
                                                            </div>
                                                            {t("Basic Information")}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="p-6 space-y-6">
                                                        {/* Name Field */}
                                                        <div className="space-y-2">
                                                            <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                                {t("Full Name")} <span className="text-red-500">*</span>
                                                            </Label>
                                                            <div className="relative">
                                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                                                <Input
                                                                    id="name"
                                                                    type="text"
                                                                    value={data.name}
                                                                    onChange={(e) => setData('name', e.target.value)}
                                                                    placeholder={t("Enter full name")}
                                                                    className="pl-10 h-12 border-2 border-slate-200 focus:border-blue-500 rounded-xl"
                                                                    required
                                                                />
                                                            </div>
                                                            {errors.name && (
                                                                <motion.p
                                                                    initial={{ opacity: 0, y: -10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    className="text-red-500 text-sm flex items-center gap-1"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                    {errors.name}
                                                                </motion.p>
                                                            )}
                                                        </div>

                                                        {/* Email Field */}
                                                        <div className="space-y-2">
                                                            <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                                {t("Email Address")} <span className="text-red-500">*</span>
                                                            </Label>
                                                            <div className="relative">
                                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                                                <Input
                                                                    id="email"
                                                                    type="email"
                                                                    value={data.email}
                                                                    onChange={(e) => setData('email', e.target.value)}
                                                                    placeholder={t("Enter email address")}
                                                                    className="pl-10 h-12 border-2 border-slate-200 focus:border-blue-500 rounded-xl"
                                                                    required
                                                                />
                                                            </div>
                                                            {errors.email && (
                                                                <motion.p
                                                                    initial={{ opacity: 0, y: -10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    className="text-red-500 text-sm flex items-center gap-1"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                    {errors.email}
                                                                </motion.p>
                                                            )}
                                                        </div>

                                                        {/* Password Field */}
                                                        <div className="space-y-2">
                                                            <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                                {t("Password")} <span className="text-red-500">*</span>
                                                            </Label>
                                                            <div className="relative">
                                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                                                <Input
                                                                    id="password"
                                                                    type={showPassword ? "text" : "password"}
                                                                    value={data.password}
                                                                    onChange={(e) => setData('password', e.target.value)}
                                                                    placeholder={t("Enter password")}
                                                                    className="pl-10 pr-12 h-12 border-2 border-slate-200 focus:border-blue-500 rounded-xl"
                                                                    required
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                >
                                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                                </Button>
                                                            </div>
                                                            {errors.password && (
                                                                <motion.p
                                                                    initial={{ opacity: 0, y: -10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    className="text-red-500 text-sm flex items-center gap-1"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                    {errors.password}
                                                                </motion.p>
                                                            )}
                                                        </div>

                                                        {/* Password Confirmation Field */}
                                                        <div className="space-y-2">
                                                            <Label htmlFor="password_confirmation" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                                {t("Confirm Password")} <span className="text-red-500">*</span>
                                                            </Label>
                                                            <div className="relative">
                                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                                                <Input
                                                                    id="password_confirmation"
                                                                    type={showPasswordConfirmation ? "text" : "password"}
                                                                    value={data.password_confirmation}
                                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                                    placeholder={t("Confirm password")}
                                                                    className="pl-10 pr-12 h-12 border-2 border-slate-200 focus:border-blue-500 rounded-xl"
                                                                    required
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                                                                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                                                >
                                                                    {showPasswordConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                                </Button>
                                                            </div>
                                                            {errors.password_confirmation && (
                                                                <motion.p
                                                                    initial={{ opacity: 0, y: -10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    className="text-red-500 text-sm flex items-center gap-1"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                    {errors.password_confirmation}
                                                                </motion.p>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        </div>

                                            {/* Roles */}
                                            <div className="space-y-6">
                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 1.0, duration: 0.4 }}
                                                >
                                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                                        <CardHeader className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 border-b border-white/30 dark:border-slate-700/50">
                                                            <CardTitle className="flex items-center gap-3">
                                                                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                                                                    <Crown className="h-5 w-5 text-white" />
                                                                </div>
                                                                {t("Roles")}
                                                            </CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="p-4">
                                                            <div className="space-y-3">
                                                                {roles?.map((role) => (
                                                                    <div key={role.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                                                        <Checkbox
                                                                            id={`role-${role.id}`}
                                                                            checked={data.roles.includes(role.id)}
                                                                            onCheckedChange={(checked) => handleRoleChange(role.id, checked)}
                                                                            className="border-2 border-purple-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                                                        />
                                                                        <Label
                                                                            htmlFor={`role-${role.id}`}
                                                                            className="flex items-center gap-2 cursor-pointer flex-1"
                                                                        >
                                                                            <Crown className="h-4 w-4 text-purple-600" />
                                                                            <span className="font-medium">{role.name}</span>
                                                                        </Label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            {errors.roles && (
                                                                <motion.p
                                                                    initial={{ opacity: 0, y: -10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    className="text-red-500 text-sm flex items-center gap-1 mt-2"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                    {errors.roles}
                                                                </motion.p>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            </div>
                                        </div>

                                        {/* Permissions - Full Width */}
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 1.1, duration: 0.4 }}
                                        >
                                            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                                <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-700/50">
                                                    <CardTitle className="flex items-center gap-3">
                                                        <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                                            <Shield className="h-5 w-5 text-white" />
                                                        </div>
                                                        {t("Permissions")}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-6">
                                                    <div className="space-y-4">
                                                        {Object.entries(groupedPermissions).map(([groupName, groupPermissions]) => (
                                                            <div key={groupName} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleGroup(groupName)}
                                                                    className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                                            <Shield className="h-4 w-4 text-white" />
                                                                        </div>
                                                                                                                                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                                                                        {t(groupName)} ({groupPermissions.length})
                                                                    </span>
                                                                    </div>
                                                                    {collapsedGroups[groupName] ? (
                                                                        <ChevronRight className="h-5 w-5 text-slate-500" />
                                                                    ) : (
                                                                        <ChevronDown className="h-5 w-5 text-slate-500" />
                                                                    )}
                                                                </button>

                                                                <AnimatePresence>
                                                                    {!collapsedGroups[groupName] && (
                                                                        <motion.div
                                                                            initial={{ height: 0, opacity: 0 }}
                                                                            animate={{ height: "auto", opacity: 1 }}
                                                                            exit={{ height: 0, opacity: 0 }}
                                                                            transition={{ duration: 0.3 }}
                                                                            className="overflow-hidden"
                                                                        >
                                                                            <div className="p-4 bg-white dark:bg-slate-900 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                                {groupPermissions.map((permission) => (
                                                                                    <div key={permission.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-700">
                                                                                        <Checkbox
                                                                                            id={`permission-${permission.id}`}
                                                                                            checked={data.permissions.includes(permission.id)}
                                                                                            onCheckedChange={(checked) => handlePermissionChange(permission.id, checked)}
                                                                                            className="border-2 border-green-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                                                                        />
                                                                                        <Label
                                                                                            htmlFor={`permission-${permission.id}`}
                                                                                            className="flex items-center gap-2 cursor-pointer flex-1 text-sm"
                                                                                        >
                                                                                            <Key className="h-3 w-3 text-green-600" />
                                                                                            <span className="text-xs">{permission.label || permission.name}</span>
                                                                                        </Label>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {errors.permissions && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-red-500 text-sm flex items-center gap-1 mt-4"
                                                        >
                                                            <X className="h-4 w-4" />
                                                            {errors.permissions}
                                                        </motion.p>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </div>

                                    {/* Submit Button */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.2, duration: 0.4 }}
                                        className="mt-8 flex justify-end gap-4"
                                    >
                                        <Link href={route("admin.users.index")}>
                                            <Button type="button" variant="outline" className="gap-2">
                                                <X className="h-4 w-4" />
                                                {t("Cancel")}
                                            </Button>
                                        </Link>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white shadow-lg"
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
