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
import BackButton from "@/Components/BackButton";

export default function CreateUser({ auth, roles, permissions, can }) {
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
        chat_id: '',
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
                        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-slate-700 sticky top-0 z-30 shadow-sm"
                    >
                        <div className="max-w-7xl mx-auto px-6 lg:px-8">
                            <div className="flex items-center justify-between py-4">
                                <div className="flex items-center space-x-6">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                        transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                        className="relative float-animation"
                                    >
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-xl blur opacity-75 dark:opacity-50"></div>
                                        <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 dark:from-blue-700 dark:via-indigo-700 dark:to-blue-700 p-3 rounded-xl shadow-lg">
                                            <UserPlus className="w-6 h-6 text-white" />
                                        </div>
                                    </motion.div>
                                    <div className="space-y-1">
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.4, duration: 0.4 }}
                                            className="flex items-center gap-2"
                                        >
                                            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                                                {t("User Management")}
                                            </span>
                                        </motion.div>
                                        <motion.h1
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.5, duration: 0.4 }}
                                            className="text-2xl font-bold text-gray-900 dark:text-white"
                                        >
                                            {t("Create User")}
                                        </motion.h1>
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.6, duration: 0.4 }}
                                            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            {t("Add a new user to the system")}
                                        </motion.div>
                                    </div>
                                </div>

                                <motion.div
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.7, duration: 0.4 }}
                                >
                                    <BackButton className="dark:text-white text-black" link={route("admin.users.index")}/>
                                </motion.div>
                            </div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto bg-gray-50 dark:bg-slate-900">
                        <div className="container mx-auto px-6 py-8">
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
                                        <Card className="bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700">
                                            <CardHeader className="bg-gray-50 dark:bg-slate-700 px-6 py-4 border-b border-gray-200 dark:border-slate-600">
                                                <CardTitle className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                                            <User className="h-5 w-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                {t("Basic Information")}
                                                            </h2>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {t("Enter the user's basic details")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="px-6 py-8">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Name Field */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                            {t("Full Name")} *
                                                        </Label>
                                                        <Input
                                                            id="name"
                                                            type="text"
                                                            value={data.name}
                                                            onChange={(e) => setData('name', e.target.value)}
                                                            placeholder={t("Enter full name")}
                                                            className={`h-11 transition-all duration-200 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                                                                errors.name ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20"
                                                            }`}
                                                            required
                                                        />
                                                        {errors.name && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1"
                                                            >
                                                                <X className="h-4 w-4" />
                                                                {errors.name}
                                                            </motion.p>
                                                        )}
                                                    </div>

                                                    {/* Email Field */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                            <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                            {t("Email Address")} *
                                                        </Label>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            value={data.email}
                                                            onChange={(e) => setData('email', e.target.value)}
                                                            placeholder={t("Enter email address")}
                                                            className={`h-11 transition-all duration-200 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                                                                errors.email ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20"
                                                            }`}
                                                            required
                                                        />
                                                        {errors.email && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1"
                                                            >
                                                                <X className="h-4 w-4" />
                                                                {errors.email}
                                                            </motion.p>
                                                        )}
                                                    </div>

                                                    {/* Password Field */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                            <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                            {t("Password")} *
                                                        </Label>
                                                        <div className="relative">
                                                            <Input
                                                                id="password"
                                                                type={showPassword ? "text" : "password"}
                                                                value={data.password}
                                                                onChange={(e) => setData('password', e.target.value)}
                                                                placeholder={t("Enter password")}
                                                                className={`pr-12 h-11 transition-all duration-200 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                                                                    errors.password ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20"
                                                                }`}
                                                                required
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-slate-600"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                            >
                                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                            </Button>
                                                        </div>
                                                        {errors.password && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1"
                                                            >
                                                                <X className="h-4 w-4" />
                                                                {errors.password}
                                                            </motion.p>
                                                        )}
                                                    </div>

                                                    {/* Password Confirmation Field */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                            <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                            {t("Confirm Password")} *
                                                        </Label>
                                                        <div className="relative">
                                                            <Input
                                                                id="password_confirmation"
                                                                type={showPasswordConfirmation ? "text" : "password"}
                                                                value={data.password_confirmation}
                                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                                placeholder={t("Confirm password")}
                                                                className={`pr-12 h-11 transition-all duration-200 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                                                                    errors.password_confirmation ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20"
                                                                }`}
                                                                required
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-slate-600"
                                                                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                                            >
                                                                {showPasswordConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                            </Button>
                                                        </div>
                                                        {errors.password_confirmation && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1"
                                                            >
                                                                <X className="h-4 w-4" />
                                                                {errors.password_confirmation}
                                                            </motion.p>
                                                        )}
                                                    </div>

                                                    {/* Chat ID Field */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="chat_id" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                            </svg>
                                                            {t("Telegram Chat ID")}
                                                        </Label>
                                                        <Input
                                                            id="chat_id"
                                                            type="text"
                                                            value={data.chat_id}
                                                            onChange={(e) => setData('chat_id', e.target.value)}
                                                            placeholder={t("Enter Telegram chat ID (optional)")}
                                                            className={`h-11 transition-all duration-200 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                                                                errors.chat_id ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20"
                                                            }`}
                                                        />
                                                        {errors.chat_id && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1"
                                                            >
                                                                <X className="h-4 w-4" />
                                                                {errors.chat_id}
                                                            </motion.p>
                                                        )}
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {t("Used for sending Telegram notifications to this user")}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Roles and Permissions Row */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Roles */}
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 1.0, duration: 0.4 }}
                                        >
                                            <Card className="bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700">
                                                <CardHeader className="bg-gray-50 dark:bg-slate-700 px-6 py-4 border-b border-gray-200 dark:border-slate-600">
                                                    <CardTitle className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                                                                <Crown className="h-5 w-5 text-white" />
                                                            </div>
                                                            <div>
                                                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                    {t("Roles")}
                                                                </h2>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {t("Assign roles to the user")}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="px-6 py-8">
                                                    <div className="space-y-3">
                                                        {roles?.map((role) => (
                                                            <div key={role.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors border border-gray-100 dark:border-slate-700">
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
                                                                    <Crown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                                    <span className="font-medium text-gray-900 dark:text-white">{role.name}</span>
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {errors.roles && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1 mt-2"
                                                        >
                                                            <X className="h-4 w-4" />
                                                            {errors.roles}
                                                        </motion.p>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </motion.div>

                                        {/* Permissions Quick Access */}
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 1.1, duration: 0.4 }}
                                        >
                                            <Card className="bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700">
                                                <CardHeader className="bg-gray-50 dark:bg-slate-700 px-6 py-4 border-b border-gray-200 dark:border-slate-600">
                                                    <CardTitle className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                                                <Shield className="h-5 w-5 text-white" />
                                                            </div>
                                                            <div>
                                                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                    {t("Permissions")}
                                                                </h2>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {t("Additional user permissions")}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="px-6 py-8">
                                                    <div className="text-center py-8">
                                                        <Shield className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                            {t("Select roles first to automatically inherit permissions, or expand below for detailed permission management.")}
                                                        </p>
                                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                                            {t("Total permissions available")}: {permissions?.length || 0}
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </div>

                                    {/* Detailed Permissions - Collapsible */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.2, duration: 0.4 }}
                                    >
                                        <Card className="bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700">
                                            <CardHeader className="bg-gray-50 dark:bg-slate-700 px-6 py-4 border-b border-gray-200 dark:border-slate-600">
                                                <CardTitle className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                                            <Shield className="h-5 w-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                {t("Detailed Permissions")}
                                                            </h2>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {t("Fine-tune specific permissions")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="px-6 py-8">
                                                <div className="space-y-4">
                                                    {Object.entries(groupedPermissions).map(([groupName, groupPermissions]) => (
                                                        <div key={groupName} className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleGroup(groupName)}
                                                                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="p-2 bg-green-600 rounded-lg">
                                                                        <Shield className="h-4 w-4 text-white" />
                                                                    </div>
                                                                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                                                                        {t(groupName)} ({groupPermissions.length})
                                                                    </span>
                                                                </div>
                                                                {collapsedGroups[groupName] ? (
                                                                    <ChevronRight className="h-5 w-5 text-gray-500" />
                                                                ) : (
                                                                    <ChevronDown className="h-5 w-5 text-gray-500" />
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
                                                                        <div className="p-4 bg-white dark:bg-slate-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                            {groupPermissions.map((permission) => (
                                                                                <div key={permission.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border border-gray-100 dark:border-slate-600">
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
                                                                                        <Key className="h-3 w-3 text-green-600 dark:text-green-400" />
                                                                                        <span className="text-xs text-gray-900 dark:text-white">{permission.label || permission.name}</span>
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
                                                        className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1 mt-4"
                                                    >
                                                        <X className="h-4 w-4" />
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
                                        transition={{ delay: 1.3, duration: 0.4 }}
                                        className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 p-6"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {t("Create User")}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {t("Review the information and create the new user")}
                                                </p>
                                            </div>
                                            <div className="flex space-x-3">
                                                <Link href={route("admin.users.index")}>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="gap-2 px-6 py-2 h-10 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-400 dark:hover:border-slate-500"
                                                    >
                                                        <X className="h-4 w-4" />
                                                        {t("Cancel")}
                                                    </Button>
                                                </Link>
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="gap-2 px-6 py-2 h-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                            </div>
                                        </div>
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
