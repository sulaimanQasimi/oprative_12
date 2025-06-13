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
    X,
    Sparkles,
    UserCheck,
    Save,
    Edit,
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

export default function EditUser({ auth, user, roles, permissions }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [collapsedGroups, setCollapsedGroups] = useState({});

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        roles: user.roles?.map(role => role.id) || [],
        permissions: user.permissions?.map(permission => permission.id) || [],
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
        put(route('admin.users.update', user.id));
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
            <Head title={t("Edit User") + " - " + user.name} />

            <PageLoader isVisible={loading} icon={Edit} color="blue" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                <Navigation auth={auth} currentRoute="admin.users" />

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 py-6 px-8 sticky top-0 z-30"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                    className="relative"
                                >
                                    <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 p-4 rounded-2xl shadow-2xl">
                                        <Edit className="w-8 h-8 text-white" />
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1"
                                    >
                                        {t("Admin Panel")} - {t("User Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent"
                                    >
                                        {t("Edit User")}
                                    </motion.h1>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Link href={route("admin.users.show", user.id)}>
                                    <Button variant="outline" className="gap-2">
                                        <Eye className="h-4 w-4" />
                                        {t("View Details")}
                                    </Button>
                                </Link>
                                <Link href={route("admin.users.index")}>
                                    <Button variant="outline" className="gap-2">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Users")}
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
                            {/* User Info Header */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.9, duration: 0.4 }}
                                className="mb-8"
                            >
                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                <span className="text-blue-600 dark:text-blue-400 font-bold text-2xl">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{user.name}</h2>
                                                <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                                    <Mail className="h-4 w-4" />
                                                    {user.email}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Badge variant={user.email_verified_at ? "success" : "secondary"}>
                                                        {user.email_verified_at ? t("Active") : t("Pending")}
                                                    </Badge>
                                                    {user.roles?.map(role => (
                                                        <Badge key={role.id} variant="outline" className="bg-purple-100 text-purple-700">
                                                            <Crown className="h-3 w-3 mr-1" />
                                                            {role.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-8">
                                    {/* Basic Information and Roles Row */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Basic Information */}
                                        <div className="lg:col-span-2">
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 1.0, duration: 0.4 }}
                                        >
                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                                <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20">
                                                    <CardTitle className="flex items-center gap-3">
                                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                            <User className="h-5 w-5 text-white" />
                                                        </div>
                                                        {t("Basic Information")}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-6 space-y-6">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="name">{t("Full Name")} <span className="text-red-500">*</span></Label>
                                                        <div className="relative">
                                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                                            <Input
                                                                id="name"
                                                                type="text"
                                                                value={data.name}
                                                                onChange={(e) => setData('name', e.target.value)}
                                                                className="pl-10 h-12"
                                                                required
                                                            />
                                                        </div>
                                                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="email">{t("Email Address")} <span className="text-red-500">*</span></Label>
                                                        <div className="relative">
                                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                                            <Input
                                                                id="email"
                                                                type="email"
                                                                value={data.email}
                                                                onChange={(e) => setData('email', e.target.value)}
                                                                className="pl-10 h-12"
                                                                required
                                                            />
                                                        </div>
                                                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="password">{t("New Password")} <span className="text-xs text-slate-500">({t("leave blank to keep current")})</span></Label>
                                                        <div className="relative">
                                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                                            <Input
                                                                id="password"
                                                                type={showPassword ? "text" : "password"}
                                                                value={data.password}
                                                                onChange={(e) => setData('password', e.target.value)}
                                                                className="pl-10 pr-12 h-12"
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
                                                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="password_confirmation">{t("Confirm New Password")}</Label>
                                                        <div className="relative">
                                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                                            <Input
                                                                id="password_confirmation"
                                                                type={showPasswordConfirmation ? "text" : "password"}
                                                                value={data.password_confirmation}
                                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                                className="pl-10 pr-12 h-12"
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
                                                        {errors.password_confirmation && <p className="text-red-500 text-sm">{errors.password_confirmation}</p>}
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
                                                transition={{ delay: 1.1, duration: 0.4 }}
                                            >
                                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                                    <CardHeader className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20">
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
                                                                <div key={role.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                                                    <Checkbox
                                                                        id={`role-${role.id}`}
                                                                        checked={data.roles.includes(role.id)}
                                                                        onCheckedChange={(checked) => handleRoleChange(role.id, checked)}
                                                                    />
                                                                    <Label htmlFor={`role-${role.id}`} className="flex items-center gap-2 cursor-pointer">
                                                                        <Crown className="h-4 w-4 text-purple-600" />
                                                                        <span>{role.name}</span>
                                                                    </Label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Permissions - Full Width */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.2, duration: 0.4 }}
                                    >
                                        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20">
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
                                                                        {groupName} ({groupPermissions.length})
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
                                    transition={{ delay: 1.3, duration: 0.4 }}
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
                                                {t("Updating...")}
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4" />
                                                {t("Update User")}
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                            </form>
                        </motion.div>
                    </main>
                </div>
            </motion.div>
        </>
    );
}
