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
    Filter,
    RefreshCw,
    MoreHorizontal,
    X,
    Crown
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
        return <PageLoader />;
    }

    return (
        <>
            <Head title={t("Permissions Management")} />
            <Navigation user={auth.user} />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
                <div className="container mx-auto px-4 py-8">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                                    <Shield className="h-8 w-8" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {t("Permissions Management")}
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {t("Manage system permissions and access controls")}
                                    </p>
                                </div>
                            </div>

                            <Link href={route('admin.permissions.create')}>
                                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                                    <Plus className="h-4 w-4 mr-2" />
                                    {t("Create Permission")}
                                </Button>
                            </Link>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                    {t("Total Permissions")}
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {isAnimated ? (
                                                        <AnimatedCounter value={totalPermissions} />
                                                    ) : totalPermissions}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                                                <Shield className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                    {t("Web Guard")}
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {isAnimated ? (
                                                        <AnimatedCounter value={webGuardPermissions} />
                                                    ) : webGuardPermissions}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                                                <Key className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                    {t("API Guard")}
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {isAnimated ? (
                                                        <AnimatedCounter value={apiGuardPermissions} />
                                                    ) : apiGuardPermissions}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                                                <Crown className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Filters Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg mb-6">
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                        <div className="relative flex-1 min-w-[300px]">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                            <Input
                                                type="text"
                                                placeholder={t("Search permissions...")}
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {(searchTerm) && (
                                            <Button
                                                variant="outline"
                                                onClick={clearFilters}
                                                className="bg-white/50 dark:bg-gray-700/50"
                                            >
                                                <X className="h-4 w-4 mr-2" />
                                                {t("Clear")}
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            onClick={() => window.location.reload()}
                                            className="bg-white/50 dark:bg-gray-700/50"
                                        >
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            {t("Refresh")}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Permissions Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-blue-600" />
                                    {t("Permissions List")}
                                    <Badge variant="secondary" className="ml-2">
                                        {filteredPermissions.length}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[40%]">{t("Permission Name")}</TableHead>
                                                <TableHead className="w-[20%]">{t("Guard Name")}</TableHead>
                                                <TableHead className="w-[20%]">{t("Created At")}</TableHead>
                                                <TableHead className="w-[20%] text-right">{t("Actions")}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <AnimatePresence>
                                                {filteredPermissions.map((permission) => (
                                                    <motion.tr
                                                        key={permission.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -20 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50"
                                                    >
                                                        <TableCell>
                                                            <div className="flex items-center space-x-3">
                                                                <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg">
                                                                    <Key className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                                        {permission.name}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={permission.guard_name === 'web' ? 'default' : 'secondary'}
                                                                className={permission.guard_name === 'web'
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                    : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                                                }
                                                            >
                                                                {permission.guard_name}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-gray-600 dark:text-gray-300">
                                                            {formatDate(permission.created_at)}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end space-x-2">
                                                                <Link href={route('admin.permissions.show', permission.id)}>
                                                                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                                <Link href={route('admin.permissions.edit', permission.id)}>
                                                                    <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleDelete(permission)}
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </motion.tr>
                                                ))}
                                            </AnimatePresence>
                                        </TableBody>
                                    </Table>

                                    {filteredPermissions.length === 0 && (
                                        <div className="text-center py-12">
                                            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                {t("No permissions found")}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                {searchTerm
                                                    ? t("Try adjusting your search criteria")
                                                    : t("Get started by creating your first permission")
                                                }
                                            </p>
                                            {!searchTerm && (
                                                <Link href={route('admin.permissions.create')}>
                                                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        {t("Create Permission")}
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
