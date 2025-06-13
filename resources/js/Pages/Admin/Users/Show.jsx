import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    User,
    Mail,
    Calendar,
    Shield,
    Key,
    Crown,
    Eye,
    Edit,
    Trash2,
    Sparkles,
    UserCheck,
    Clock,
    CheckCircle,
    XCircle,
    Activity,
    MoreHorizontal
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { motion } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function ShowUser({ auth, user }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDelete = () => {
        if (confirm(t('Are you sure you want to delete this user?'))) {
            router.delete(route('admin.users.destroy', user.id), {
                onSuccess: () => {
                    router.visit(route('admin.users.index'));
                }
            });
        }
    };

    return (
        <>
            <Head title={t("User Details") + " - " + user.name} />

            <PageLoader isVisible={loading} icon={Eye} color="blue" />

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
                                        <Eye className="w-8 h-8 text-white" />
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
                                        {t("User Details")}
                                    </motion.h1>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Link href={route("admin.users.edit", user.id)}>
                                    <Button className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                                        <Edit className="h-4 w-4" />
                                        {t("Edit User")}
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    className="gap-2"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    {t("Delete")}
                                </Button>
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
                            className="max-w-6xl mx-auto"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* User Profile Card */}
                                <div className="lg:col-span-1">
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.4 }}
                                    >
                                        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardContent className="p-6 text-center">
                                                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center mx-auto mb-6 shadow-lg">
                                                    <span className="text-blue-600 dark:text-blue-400 font-bold text-5xl">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>

                                                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                                                    {user.name}
                                                </h2>

                                                <p className="text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2 mb-4">
                                                    <Mail className="h-4 w-4" />
                                                    {user.email}
                                                </p>

                                                <div className="flex justify-center mb-6">
                                                    <Badge
                                                        variant={user.email_verified_at ? "success" : "secondary"}
                                                        className={`rounded-full px-4 py-2 text-sm font-medium ${
                                                            user.email_verified_at
                                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                                                        }`}
                                                    >
                                                        {user.email_verified_at ? (
                                                            <>
                                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                                {t("Active Account")}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Clock className="h-4 w-4 mr-2" />
                                                                {t("Pending Verification")}
                                                            </>
                                                        )}
                                                    </Badge>
                                                </div>

                                                <Separator className="mb-6" />

                                                <div className="space-y-4 text-left">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                                            {t("Member Since")}
                                                        </p>
                                                        <p className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                                            <Calendar className="h-4 w-4" />
                                                            {formatDate(user.created_at)}
                                                        </p>
                                                    </div>

                                                    {user.email_verified_at && (
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                                                {t("Verified On")}
                                                            </p>
                                                            <p className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                                                <UserCheck className="h-4 w-4" />
                                                                {formatDate(user.email_verified_at)}
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                                            {t("Last Updated")}
                                                        </p>
                                                        <p className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                                            <Activity className="h-4 w-4" />
                                                            {formatDate(user.updated_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>

                                {/* Roles and Permissions */}
                                <div className="lg:col-span-2 space-y-8">
                                    {/* Roles Card */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.0, duration: 0.4 }}
                                    >
                                        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardHeader className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20">
                                                <CardTitle className="flex items-center gap-3">
                                                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                                                        <Crown className="h-6 w-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold">{t("User Roles")}</h3>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                            {t("Assigned roles and their capabilities")}
                                                        </p>
                                                    </div>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                {user.roles && user.roles.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {user.roles.map((role) => (
                                                            <div
                                                                key={role.id}
                                                                className="p-4 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/20 hover:bg-purple-100/50 dark:hover:bg-purple-900/30 transition-colors"
                                                            >
                                                                <div className="flex items-center gap-3 mb-3">
                                                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                                                                        <Crown className="h-5 w-5 text-purple-600" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-semibold text-slate-800 dark:text-white">
                                                                            {role.name}
                                                                        </h4>
                                                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                            {t("Role permissions included")}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {role.permissions && role.permissions.length > 0 && (
                                                                    <div className="space-y-2">
                                                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                            {t("Includes Permissions")}:
                                                                        </p>
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {role.permissions.slice(0, 3).map((permission) => (
                                                                                <Badge
                                                                                    key={permission.id}
                                                                                    variant="outline"
                                                                                    className="text-xs bg-white dark:bg-slate-800 border-purple-200 dark:border-purple-700"
                                                                                >
                                                                                    {permission.name}
                                                                                </Badge>
                                                                            ))}
                                                                            {role.permissions.length > 3 && (
                                                                                <Badge variant="outline" className="text-xs">
                                                                                    +{role.permissions.length - 3} {t("more")}
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8">
                                                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                                            <Crown className="h-8 w-8 text-slate-400" />
                                                        </div>
                                                        <p className="text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("No roles assigned")}
                                                        </p>
                                                        <p className="text-sm text-slate-500">
                                                            {t("This user has no specific roles assigned")}
                                                        </p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Direct Permissions Card */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.1, duration: 0.4 }}
                                    >
                                        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20">
                                                <CardTitle className="flex items-center gap-3">
                                                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                                                        <Shield className="h-6 w-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold">{t("Direct Permissions")}</h3>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                            {t("Permissions assigned directly to this user")}
                                                        </p>
                                                    </div>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                {user.permissions && user.permissions.length > 0 ? (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        {user.permissions.map((permission) => (
                                                            <div
                                                                key={permission.id}
                                                                className="flex items-center gap-3 p-3 rounded-lg border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/20 hover:bg-green-100/50 dark:hover:bg-green-900/30 transition-colors"
                                                            >
                                                                <div className="p-1.5 bg-green-100 dark:bg-green-900/50 rounded-md">
                                                                    <Key className="h-4 w-4 text-green-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-slate-800 dark:text-white text-sm">
                                                                        {permission.name}
                                                                    </p>
                                                                    <p className="text-xs text-slate-500">
                                                                        {t("Direct permission")}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8">
                                                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                                            <Shield className="h-8 w-8 text-slate-400" />
                                                        </div>
                                                        <p className="text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("No direct permissions")}
                                                        </p>
                                                        <p className="text-sm text-slate-500">
                                                            {t("This user has no direct permissions assigned")}
                                                        </p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </main>
                </div>
            </motion.div>
        </>
    );
}
