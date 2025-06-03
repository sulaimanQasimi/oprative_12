import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Building2,
    ArrowLeft,
    UserPlus,
    X,
    Shield,
    Users,
    Key,
    Plus,
    Edit,
    Trash2,
    CheckCircle,
    AlertCircle,
    Globe,
    MapPin,
    Phone,
    Mail,
    Calendar,
    Package,
    Download,
    Upload,
    ArrowRightLeft,
    ShoppingCart,
    Store
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
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
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Switch } from "@/Components/ui/switch";
import { Checkbox } from "@/Components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Show({ auth, warehouse, roles, permissions }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("details");
    const [isAnimated, setIsAnimated] = useState(false);

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Initialize data from props
    useEffect(() => {
        if (!warehouse) {
            console.error("Warehouse data is missing");
        }
        if (!permissions) {
            console.error("Permissions data is missing");
        }
    }, [warehouse, roles, permissions]);

    // Filter warehouse-specific permissions
    const warehousePermissions = permissions?.filter(permission =>
        permission.guard_name === 'warehouse_user'
    ) || [];

    const getPermissionDisplayName = (permissionName) => {
        // Remove 'warehouse.' prefix for display
        return permissionName.replace('warehouse.', '').replace(/[._]/g, ' ').toUpperCase();
    };

    return (
        <>
            <Head title={t("Warehouse Details")}>
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
                className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden"
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
                                        <Building2 className="w-8 h-8 text-white" />
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1"
                                    >
                                        {t("Warehouse Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
                                    >
                                        {warehouse?.name || t("Warehouse Details")}
                                    </motion.h1>
                                    {warehouse?.code && (
                                        <motion.p
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.6, duration: 0.4 }}
                                            className="text-sm text-slate-600 dark:text-slate-400"
                                        >
                                            {t("Code")}: <span className="font-mono font-semibold">{warehouse.code}</span>
                                        </motion.p>
                                    )}
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Link href={route("admin.warehouses.index")}>
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-transform">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to List")}
                                    </Button>
                                </Link>
                                {warehouse && (
                                    <Link href={route("admin.warehouses.edit", warehouse.id)}>
                                        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:scale-105 transition-transform">
                                            <Edit className="h-4 w-4 mr-2" />
                                            {t("Edit Warehouse")}
                                        </Button>
                                    </Link>
                                )}
                                <Link href={route("admin.warehouses.products", warehouse.id)}>
                                    <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:scale-105 transition-transform">
                                        <Package className="h-4 w-4 mr-2" />
                                        {t("View Products")}
                                    </Button>
                                </Link>
                                <Link href={route("admin.warehouses.income", warehouse.id)}>
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-transform bg-green-50 hover:bg-green-100 border-green-200 text-green-700">
                                        <Download className="h-4 w-4" />
                                        {t("Import")}
                                    </Button>
                                </Link>
                                <Link href={route("admin.warehouses.outcome", warehouse.id)}>
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-transform bg-red-50 hover:bg-red-100 border-red-200 text-red-700">
                                        <Upload className="h-4 w-4" />
                                        {t("Export")}
                                    </Button>
                                </Link>
                                <Link href={route("admin.warehouses.transfers", warehouse.id)}>
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-transform bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700">
                                        <ArrowRightLeft className="h-4 w-4" />
                                        {t("Transfer")}
                                    </Button>
                                </Link>
                                <Link href={route("admin.warehouses.sales", warehouse.id)}>
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-transform border-green-200 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20">
                                        <Store className="h-4 w-4 text-green-600" />
                                        {t("Move to Store")}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-8 space-y-8">
                            {/* Enhanced Tabs */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                            >
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                                    <TabsList className="grid w-full grid-cols-2 p-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                                        <TabsTrigger
                                            value="details"
                                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
                                        >
                                            <Building2 className="h-4 w-4" />
                                            {t("Details")}
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="users"
                                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
                                        >
                                            <Users className="h-4 w-4" />
                                            {t("Users")} ({warehouse?.users?.length || 0})
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Warehouse Details Tab */}
                                    <TabsContent value="details" className="space-y-6">
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.3, duration: 0.5 }}
                                        >
                                            <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                                                <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-white/20 dark:border-slate-700/50">
                                                    <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3">
                                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                            <Building2 className="h-5 w-5 text-white" />
                                                        </div>
                                                        {t("Warehouse Information")}
                                                    </CardTitle>
                                                    <CardDescription className="text-slate-600 dark:text-slate-400">
                                                        {t("Complete details about this warehouse facility")}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="p-8">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                        {/* Name */}
                                                        <motion.div
                                                            whileHover={{ scale: 1.02 }}
                                                            className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 border border-blue-200/50 dark:border-slate-600"
                                                        >
                                                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                                                <Building2 className="h-4 w-4" />
                                                                <Label className="font-semibold">{t("Name")}</Label>
                                                            </div>
                                                            <p className="text-lg font-bold text-slate-800 dark:text-white">
                                                                {warehouse?.name || "-"}
                                                            </p>
                                                        </motion.div>

                                                        {/* Code */}
                                                        <motion.div
                                                            whileHover={{ scale: 1.02 }}
                                                            className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-700 dark:to-slate-600 border border-emerald-200/50 dark:border-slate-600"
                                                        >
                                                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                                                <Key className="h-4 w-4" />
                                                                <Label className="font-semibold">{t("Code")}</Label>
                                                            </div>
                                                            <p className="text-lg font-bold font-mono text-slate-800 dark:text-white">
                                                                {warehouse?.code || "-"}
                                                            </p>
                                                        </motion.div>

                                                        {/* Status */}
                                                        <motion.div
                                                            whileHover={{ scale: 1.02 }}
                                                            className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-700 dark:to-slate-600 border border-purple-200/50 dark:border-slate-600"
                                                        >
                                                            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                                                                <CheckCircle className="h-4 w-4" />
                                                                <Label className="font-semibold">{t("Status")}</Label>
                                                            </div>
                                                            <Badge
                                                                variant={warehouse?.is_active ? "success" : "secondary"}
                                                                className={`text-sm font-bold ${warehouse?.is_active
                                                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                                                                    : 'bg-gradient-to-r from-gray-500 to-slate-600 text-white'
                                                                }`}
                                                            >
                                                                {warehouse?.is_active ? t("Active") : t("Inactive")}
                                                            </Badge>
                                                        </motion.div>

                                                        {/* Description */}
                                                        <motion.div
                                                            whileHover={{ scale: 1.02 }}
                                                            className="md:col-span-2 lg:col-span-3 space-y-3 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-700 dark:to-slate-600 border border-orange-200/50 dark:border-slate-600"
                                                        >
                                                            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                                                                <AlertCircle className="h-4 w-4" />
                                                                <Label className="font-semibold">{t("Description")}</Label>
                                                            </div>
                                                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                                                {warehouse?.description || t("No description provided")}
                                                            </p>
                                                        </motion.div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </TabsContent>

                                    {/* Enhanced Users Tab */}
                                    <TabsContent value="users" className="space-y-6">
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.3, duration: 0.5 }}
                                        >
                                            <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                                                <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-white/20 dark:border-slate-700/50">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3">
                                                                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                                    <Users className="h-5 w-5 text-white" />
                                                                </div>
                                                                {t("Warehouse Users")}
                                                            </CardTitle>
                                                            <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
                                                                {t("Manage user access and permissions for this warehouse")}
                                                            </CardDescription>
                                                        </div>
                                                        <Link href={route("admin.warehouses.users.create", warehouse.id)}>
                                                            <Button
                                                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:scale-105 transition-transform"
                                                            >
                                                                <UserPlus className="h-4 w-4 mr-2" />
                                                                {t("Add User")}
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="p-0">
                                                    {warehouse?.users && warehouse.users.length > 0 ? (
                                                        <div className="overflow-x-auto">
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow className="bg-slate-50/50 dark:bg-slate-800/50">
                                                                        <TableHead className="font-bold text-slate-700 dark:text-slate-300">
                                                                            <div className="flex items-center gap-2">
                                                                                <Users className="h-4 w-4" />
                                                                                {t("Name")}
                                                                            </div>
                                                                        </TableHead>
                                                                        <TableHead className="font-bold text-slate-700 dark:text-slate-300">
                                                                            <div className="flex items-center gap-2">
                                                                                <Mail className="h-4 w-4" />
                                                                                {t("Email")}
                                                                            </div>
                                                                        </TableHead>
                                                                        <TableHead className="font-bold text-slate-700 dark:text-slate-300">
                                                                            <div className="flex items-center gap-2">
                                                                                <Shield className="h-4 w-4" />
                                                                                {t("Permissions")}
                                                                            </div>
                                                                        </TableHead>
                                                                        <TableHead className="font-bold text-slate-700 dark:text-slate-300">
                                                                            <div className="flex items-center gap-2">
                                                                                <Calendar className="h-4 w-4" />
                                                                                {t("Created")}
                                                                            </div>
                                                                        </TableHead>
                                                                        <TableHead className="text-right font-bold text-slate-700 dark:text-slate-300">
                                                                            {t("Actions")}
                                                                        </TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    <AnimatePresence>
                                                                        {warehouse.users.map((user, index) => (
                                                                            <motion.tr
                                                                                key={user.id}
                                                                                initial={{ opacity: 0, y: 20 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                transition={{ delay: index * 0.1 }}
                                                                                className="hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-colors"
                                                                            >
                                                                                <TableCell>
                                                                                    <div className="flex items-center gap-3">
                                                                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                                                                            <span className="text-white font-bold text-sm">
                                                                                                {user.name?.charAt(0).toUpperCase()}
                                                                                            </span>
                                                                                        </div>
                                                                                        <span className="font-semibold text-slate-800 dark:text-white">
                                                                                            {user.name}
                                                                                        </span>
                                                                                    </div>
                                                                                </TableCell>
                                                                                <TableCell className="text-slate-600 dark:text-slate-400">
                                                                                    {user.email}
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <div className="flex flex-wrap gap-1 max-w-xs">
                                                                                        {user.permissions?.slice(0, 3).map((permission) => (
                                                                                            <Badge
                                                                                                key={permission.id}
                                                                                                variant="secondary"
                                                                                                className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700"
                                                                                            >
                                                                                                {getPermissionDisplayName(permission.name)}
                                                                                            </Badge>
                                                                                        ))}
                                                                                        {user.permissions?.length > 3 && (
                                                                                            <Badge variant="outline" className="text-xs">
                                                                                                +{user.permissions.length - 3} more
                                                                                            </Badge>
                                                                                        )}
                                                                                    </div>
                                                                                </TableCell>
                                                                                <TableCell className="text-slate-600 dark:text-slate-400">
                                                                                    {new Date(user.created_at).toLocaleDateString()}
                                                                                </TableCell>
                                                                                <TableCell className="text-right">
                                                                                    <div className="flex items-center justify-end gap-2">
                                                                                        <Link href={route("admin.warehouses.users.edit", [warehouse.id, user.id])}>
                                                                                            <Button
                                                                                                size="sm"
                                                                                                variant="outline"
                                                                                                className="hover:scale-105 transition-transform"
                                                                                            >
                                                                                                <Edit className="h-3 w-3" />
                                                                                            </Button>
                                                                                        </Link>
                                                                                        <Button
                                                                                            size="sm"
                                                                                            variant="outline"
                                                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-105 transition-all"
                                                                                        >
                                                                                            <Trash2 className="h-3 w-3" />
                                                                                        </Button>
                                                                                    </div>
                                                                                </TableCell>
                                                                            </motion.tr>
                                                                        ))}
                                                                    </AnimatePresence>
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    ) : (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className="text-center py-16"
                                                        >
                                                            <div className="flex flex-col items-center gap-4">
                                                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                                                    <Users className="h-8 w-8 text-white" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                                                                        {t("No users assigned")}
                                                                    </h3>
                                                                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                                                                        {t("Get started by adding your first warehouse user")}
                                                                    </p>
                                                                    <Link href={route("admin.warehouses.users.create", warehouse.id)}>
                                                                        <Button
                                                                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:scale-105 transition-transform"
                                                                        >
                                                                            <UserPlus className="h-4 w-4 mr-2" />
                                                                            {t("Add First User")}
                                                                        </Button>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </TabsContent>
                                </Tabs>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
}
