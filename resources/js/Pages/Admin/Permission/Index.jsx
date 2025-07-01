import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Shield,
    Key,
    Search,
    Plus,
    RefreshCw,
    X,
    Crown,
    Calendar
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";
import { motion } from "framer-motion";

// AnimatedCounter component
const AnimatedCounter = ({
    value,
    prefix = "",
    suffix = "",
    duration = 1500,
}) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const startTime = Date.now();
        const endTime = startTime + duration;

        const updateCount = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const currentCount = Math.floor(progress * value);
            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            }
        };

        requestAnimationFrame(updateCount);
    }, [value, duration]);

    return (
        <span>
            {prefix}{count}{suffix}
        </span>
    );
};

export default function PermissionsIndex({ auth, permissions, filters }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [filteredPermissions, setFilteredPermissions] = useState(permissions || []);

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Enhanced filtering logic
    useEffect(() => {
        let filtered = [...(permissions || [])];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(permission =>
                permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                permission.guard_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredPermissions(filtered);
    }, [searchTerm, permissions]);

    // Group permissions by their group field or by extracting from name
    const groupedPermissions = filteredPermissions.reduce((groups, permission) => {
        // Use the group field if available, otherwise extract from permission name
        const group = permission.group || permission.name.split('_').slice(-1)[0] || 'other';
        const groupName = group.charAt(0).toUpperCase() + group.slice(1);

        if (!groups[groupName]) {
            groups[groupName] = [];
        }
        groups[groupName].push(permission);
        return groups;
    }, {});

    // Calculate stats
    const totalPermissions = permissions?.length || 0;
    const webGuardPermissions = permissions?.filter(permission => permission.guard_name === 'web')?.length || 0;
    const apiGuardPermissions = permissions?.filter(permission => permission.guard_name === 'api')?.length || 0;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const clearFilters = () => {
        setSearchTerm("");
    };

    const handleDelete = (permission) => {
        if (confirm(t('Are you sure you want to delete this permission?'))) {
            router.delete(route('admin.permissions.destroy', permission.id), {
                preserveScroll: true,
            });
        }
    };

    if (loading) {
        return <PageLoader isVisible={loading} icon={Shield} color="blue" />;
    }

    return (
        <>
            <Head title={t("Permissions Management")} />

            <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-hidden">
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.permissions" />

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
                                            <Shield className="w-6 h-6 text-white" />
                                        </div>
                                    </motion.div>
                                    <div className="space-y-1">
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.4, duration: 0.4 }}
                                            className="flex items-center gap-2"
                                        >
                                            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                                                {t("Permission Management")}
                                            </span>
                                        </motion.div>
                                        <motion.h1
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.5, duration: 0.4 }}
                                            className="text-2xl font-bold text-gray-900 dark:text-white"
                                        >
                                            {t("Permissions")}
                                        </motion.h1>
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.6, duration: 0.4 }}
                                            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                                        >
                                            <Key className="w-4 h-4" />
                                            {t("Manage system permissions and access controls")}
                                        </motion.div>
                                    </div>
                                </div>

                                <motion.div
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.7, duration: 0.4 }}
                                    className="flex items-center space-x-3"
                                >
                                    <Button
                                        variant="outline"
                                        onClick={() => window.location.reload()}
                                        className="gap-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-400 dark:hover:border-slate-500"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                        {t("Refresh")}
                                    </Button>
                                    <Link href={route("admin.permissions.create")}>
                                        <Button className="gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                                            <Plus className="h-4 w-4" />
                                            {t("Add Permission")}
                                        </Button>
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto bg-gray-50 dark:bg-slate-900">
                        <div className="container mx-auto px-6 py-8">
                            <div className="space-y-8">
                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.8, duration: 0.4 }}
                                    >
                                        <Card className="bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                            {t("Total Permissions")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                                            {totalPermissions}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            {t("System permissions")}
                                                        </p>
                                                    </div>
                                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                                        <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.4 }}
                                    >
                                        <Card className="bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                            {t("Web Guard")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                                            {webGuardPermissions}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            {t("Web permissions")}
                                                        </p>
                                                    </div>
                                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                                        <Key className="h-6 w-6 text-green-600 dark:text-green-400" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.0, duration: 0.4 }}
                                    >
                                        <Card className="bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                            {t("API Guard")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                                            {apiGuardPermissions}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            {t("API permissions")}
                                                        </p>
                                                    </div>
                                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                                        <Crown className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>

                                {/* Search Section */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.1, duration: 0.4 }}
                                >
                                    <Card className="bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700">
                                        <CardContent className="p-6">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                                                <Input
                                                    placeholder={t("Search permissions by name or guard...")}
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-12 h-11 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20"
                                                />
                                                {searchTerm && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSearchTerm("")}
                                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-slate-600"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Grouped Permissions */}
                                {Object.keys(groupedPermissions).length > 0 ? (
                                    <div className="space-y-8">
                                        {Object.entries(groupedPermissions).map(([groupName, groupPermissions], index) => (
                                            <motion.div
                                                key={groupName}
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                                            >
                                                <Card className="bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700">
                                                    <CardHeader className="bg-gray-50 dark:bg-slate-700 px-6 py-4 border-b border-gray-200 dark:border-slate-600">
                                                        <CardTitle className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                                                    <Shield className="h-5 w-5 text-white" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                        {t(groupName)} {t("Permissions")}
                                                                    </h3>
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                        {groupPermissions.length} {t("permissions in this group")}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                                                {groupPermissions.length}
                                                            </Badge>
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="px-6 py-8">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {groupPermissions.map((permission) => (
                                                                <div
                                                                    key={permission.id}
                                                                    className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                                                                >
                                                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                        <Key className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                                                                            {permission.label || permission.name}
                                                                        </h4>
                                                                        {permission.label && permission.name && (
                                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                                                {permission.name}
                                                                            </p>
                                                                        )}
                                                                        <div className="flex items-center gap-2">
                                                                            <Badge
                                                                                variant="outline"
                                                                                className={`text-xs ${
                                                                                    permission.guard_name === 'web'
                                                                                        ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                                                                                        : "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
                                                                                }`}
                                                                            >
                                                                                {permission.guard_name === 'web' ? (
                                                                                    <>
                                                                                        <Key className="h-3 w-3 mr-1" />
                                                                                        {permission.guard_name}
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <Crown className="h-3 w-3 mr-1" />
                                                                                        {permission.guard_name}
                                                                                    </>
                                                                                )}
                                                                            </Badge>
                                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                                ID: {permission.id}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.2, duration: 0.4 }}
                                    >
                                        <Card className="bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700">
                                            <CardContent className="p-12 text-center">
                                                <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Shield className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                    {t("No permissions found")}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                                    {searchTerm ? t("Try adjusting your search") : t("Create your first permission")}
                                                </p>
                                                {!searchTerm && (
                                                    <Link href={route("admin.permissions.create")}>
                                                        <Button className="gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white shadow-lg">
                                                            <Plus className="h-4 w-4" />
                                                            {t("Add Permission")}
                                                        </Button>
                                                    </Link>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
