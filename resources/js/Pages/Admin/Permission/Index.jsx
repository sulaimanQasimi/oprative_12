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

                            {/* Permissions Table */}
                            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50">
                                    <CardTitle className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                            <Shield className="h-5 w-5 text-white" />
                                        </div>
                                        {t("Permission Records")}
                                        <Badge variant="secondary" className="ml-auto">
                                            {filteredPermissions.length} {t("of")} {totalPermissions}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                                                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                        {t("Permission")}
                                                    </TableHead>
                                                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                        {t("Guard")}
                                                    </TableHead>
                                                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                        {t("Created")}
                                                    </TableHead>
                                                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                        {t("Actions")}
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredPermissions.length > 0 ? (
                                                    filteredPermissions.map((permission, index) => (
                                                        <TableRow
                                                            key={permission.id}
                                                            className="hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                                                        >
                                                            <TableCell>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                                                        <Key className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-semibold text-slate-800 dark:text-white">{permission.name}</p>
                                                                        <p className="text-sm text-slate-500">
                                                                            {t("Permission ID")}: {permission.id}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
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
                                                            </TableCell>
                                                            <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar className="h-4 w-4" />
                                                                    {formatDate(permission.created_at)}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <Link href={route("admin.permissions.show", permission.id)}>
                                                                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300">
                                                                            <Eye className="h-4 w-4 text-blue-600" />
                                                                        </Button>
                                                                    </Link>
                                                                    <Link href={route("admin.permissions.edit", permission.id)}>
                                                                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 hover:bg-green-50 hover:border-green-300">
                                                                            <Edit className="h-4 w-4 text-green-600" />
                                                                        </Button>
                                                                    </Link>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-300"
                                                                        onClick={() => handleDelete(permission)}
                                                                    >
                                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan="4" className="h-32 text-center">
                                                            <div className="flex flex-col items-center gap-4">
                                                                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                                    <Shield className="h-8 w-8 text-slate-400" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                                                        {t("No permissions found")}
                                                                    </p>
                                                                    <p className="text-sm text-slate-500">
                                                                        {searchTerm ? t("Try adjusting your search") : t("Create your first permission")}
                                                                    </p>
                                                                </div>
                                                                {!searchTerm && (
                                                                    <Link href={route("admin.permissions.create")}>
                                                                        <Button className="gap-2">
                                                                            <Plus className="h-4 w-4" />
                                                                            {t("Add Permission")}
                                                                        </Button>
                                                                    </Link>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
