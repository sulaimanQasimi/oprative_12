import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Shield,
    Key,
    Search,
    Eye,
    Edit,
    Trash2,
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

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

            <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.permissions" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-white/30 dark:border-slate-700/50 px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                                        {t("Permissions Management")}
                                    </h1>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        {t("Manage system permissions and access controls")}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={() => window.location.reload()}
                                    className="gap-2 hover:scale-105 transition-all duration-200 border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    {t("Refresh")}
                                </Button>
                                <Link href={route("admin.permissions.create")}>
                                    <Button className="gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white hover:scale-105 transition-all duration-200 shadow-lg">
                                        <Plus className="h-4 w-4" />
                                        {t("Add Permission")}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto p-8">
                        <div className="space-y-8">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                    {t("Total Permissions")}
                                                </p>
                                                <p className="text-3xl font-bold text-blue-600">
                                                    {totalPermissions}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {t("System permissions")}
                                                </p>
                                            </div>
                                            <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl">
                                                <Shield className="h-8 w-8 text-blue-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                    {t("Web Guard")}
                                                </p>
                                                <p className="text-3xl font-bold text-green-600">
                                                    {webGuardPermissions}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {t("Web permissions")}
                                                </p>
                                            </div>
                                            <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl">
                                                <Key className="h-8 w-8 text-green-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                    {t("API Guard")}
                                                </p>
                                                <p className="text-3xl font-bold text-purple-600">
                                                    {apiGuardPermissions}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {t("API permissions")}
                                                </p>
                                            </div>
                                            <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl">
                                                <Crown className="h-8 w-8 text-purple-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Search Section */}
                            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                <CardContent className="p-6">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                        <Input
                                            placeholder={t("Search permissions by name or guard...")}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-12 h-12 text-lg border-2 border-blue-200 focus:border-blue-500 rounded-xl"
                                        />
                                        {searchTerm && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSearchTerm("")}
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Grouped Permissions */}
                            {Object.keys(groupedPermissions).length > 0 ? (
                                <div className="space-y-8">
                                    {Object.entries(groupedPermissions).map(([groupName, groupPermissions]) => (
                                        <Card key={groupName} className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50">
                                                <CardTitle className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                        <Shield className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold">{t(groupName)} {t("Permissions")}</h3>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                            {groupPermissions.length} {t("permissions in this group")}
                                                        </p>
                                                    </div>
                                                    <Badge variant="secondary" className="ml-auto">
                                                        {groupPermissions.length}
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {groupPermissions.map((permission) => (
                                                        <div
                                                            key={permission.id}
                                                            className="flex items-center gap-3 p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-colors"
                                                        >
                                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex-shrink-0">
                                                                <Key className="h-5 w-5 text-blue-600" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                                                                <h4 className="font-semibold text-slate-800 dark:text-white text-sm">
                                                    {permission.label || permission.name}
                                                </h4>
                                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                                                    {permission.label && permission.name && `${permission.label} • ${permission.name}`}
                                                    {!permission.label && permission.name}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
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
                                                    <span className="text-xs text-slate-500">
                                                        ID: {permission.id}
                                                    </span>
                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                    <CardContent className="p-12 text-center">
                                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                            <Shield className="h-8 w-8 text-slate-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
                                            {t("No permissions found")}
                                        </h3>
                                        <p className="text-sm text-slate-500 mb-4">
                                            {searchTerm ? t("Try adjusting your search") : t("Create your first permission")}
                                        </p>
                                        {!searchTerm && (
                                            <Link href={route("admin.permissions.create")}>
                                                <Button className="gap-2">
                                                    <Plus className="h-4 w-4" />
                                                    {t("Add Permission")}
                                                </Button>
                                            </Link>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
