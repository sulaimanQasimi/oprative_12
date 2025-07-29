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
    Store,
    Sparkles,
    ChevronDown,
    Wallet,
    BarChart3
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

export default function Show({ auth, warehouse, roles, permissions, warehousePermissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
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

                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }

                    .shimmer {
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                        background-size: 1000px 100%;
                        animation: shimmer 2s infinite;
                    }

                    .float-animation {
                        animation: float 6s ease-in-out infinite;
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
                                    linear-gradient(45deg, #10b981, #059669) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #10b981, #059669) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

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
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative float-animation"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 p-4 rounded-2xl shadow-2xl">
                                        <Building2 className="w-8 h-8 text-white" />
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
                                        {t("Warehouse Details")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent"
                                    >
                                        {warehouse?.name || t("Warehouse")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Building2 className="w-4 h-4" />
                                        {warehouse?.code ? `${t("Code")}: ${warehouse.code} • ` : ""}{t("Complete warehouse information and management")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-2"
                            >
                                {warehouse && warehousePermissions.can_update && (
                                    <Link href={route("admin.warehouses.edit", warehouse.id)}>
                                        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:scale-105 transition-transform">
                                            <Edit className="h-4 w-4 mr-2" />
                                            {t("Edit Warehouse")}
                                        </Button>
                                    </Link>
                                )}

                                <Link href={route("admin.warehouses.index")} >
                                    <Button variant="outline" className="gap-2 dark:text-white text-black hover:scale-105 transition-transform">
                                        {t("Back")}
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                </Link>

                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-700 scrollbar-track-transparent">
                        <div className="p-8 space-y-8">
                            {/* Enhanced Tabs */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                            >
                                {/* Overview Statistics Cards */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                                >
                                    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-green-600 dark:text-green-400">{t("Total Users")}</p>
                                                    <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                                                        {warehouse?.users?.length || 0}
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-green-500 rounded-xl">
                                                    <Users className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/30">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{t("Products")}</p>
                                                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">0</p>
                                                </div>
                                                <div className="p-3 bg-blue-500 rounded-xl">
                                                    <Package className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/30">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">{t("Transactions")}</p>
                                                    <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">0</p>
                                                </div>
                                                <div className="p-3 bg-purple-500 rounded-xl">
                                                    <ArrowRightLeft className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/30">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">{t("Status")}</p>
                                                    <p className="text-lg font-bold text-orange-700 dark:text-orange-300 capitalize">
                                                        {warehouse?.is_active ? t("Active") : t("Inactive")}
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-orange-500 rounded-xl">
                                                    <CheckCircle className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                                    <TabsList className="grid w-full grid-cols-4 h-14 p-1 bg-white/80 dark:bg-slate-700/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-600">
                                        <TabsTrigger
                                            value="overview"
                                            className="h-12 text-sm font-semibold flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
                                        >
                                            <Sparkles className="h-4 w-4" />
                                            {t("Overview")}
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="details"
                                            className="h-12 text-sm font-semibold flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
                                        >
                                            <Building2 className="h-4 w-4" />
                                            {t("Details")}
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="users"
                                            className="h-12 text-sm font-semibold flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
                                        >
                                            <Users className="h-4 w-4" />
                                            {t("Users")} ({warehouse?.users?.length || 0})
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="operations"
                                            className="h-12 text-sm font-semibold flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
                                        >
                                            <Package className="h-4 w-4" />
                                            {t("Operations")}
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Overview Tab */}
                                    <TabsContent value="overview" className="space-y-6">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-xl">
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                                        <Package className="w-5 h-5 text-blue-600" />
                                                        {t("Quick Actions")}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <Link href={route("admin.warehouses.edit", warehouse.id)}>
                                                        <Button className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700">
                                                            <Edit className="w-4 h-4" />
                                                            {t("Edit Warehouse")}
                                                        </Button>
                                                    </Link>
                                                    <Link href={route("admin.warehouses.products", warehouse.id)}>
                                                        <Button variant="outline" className="w-full justify-start gap-2 dark:text-white text-black">
                                                            <Package className="w-4 h-4" />
                                                            {t("Manage Products")}
                                                        </Button>
                                                    </Link>
                                                    <Link href={route("admin.warehouses.income", warehouse.id)}>
                                                        <Button variant="outline" className="w-full justify-start gap-2 dark:text-white text-black">
                                                            <Download className="w-4 h-4" />
                                                            {t("View Imports")}
                                                        </Button>
                                                    </Link>
                                                    <Link href={route("admin.warehouses.outcome", warehouse.id)}>
                                                        <Button variant="outline" className="w-full justify-start gap-2 dark:text-white text-black">
                                                            <Upload className="w-4 h-4" />
                                                            {t("View Exports")}
                                                        </Button>
                                                    </Link>
                                                    <Link href={route("admin.warehouses.sales", warehouse.id)}>
                                                        <Button variant="outline" className="w-full justify-start gap-2 dark:text-white text-black">
                                                            <ShoppingCart className="w-4 h-4" />
                                                            {t("View Sales")}
                                                        </Button>
                                                    </Link>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-xl">
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                                        <Calendar className="w-5 h-5 text-purple-600" />
                                                        {t("Recent Activity")}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                            <div>
                                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{t("Warehouse created")}</p>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(warehouse?.created_at).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                        {warehouse?.updated_at && warehouse?.updated_at !== warehouse?.created_at && (
                                                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{t("Warehouse updated")}</p>
                                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(warehouse?.updated_at).toLocaleDateString()}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </TabsContent>

                                    {/* Warehouse Details Tab */}
                                    <TabsContent value="details" className="space-y-6">
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.3, duration: 0.5 }}
                                        >
                                            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-xl gradient-border">
                                                <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-white/20 dark:border-slate-600/50">
                                                    <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3">
                                                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                                            <Building2 className="h-6 w-6 text-white" />
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
                                            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-xl gradient-border">
                                                <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-white/20 dark:border-slate-600/50">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3">
                                                                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                                                    <Users className="h-6 w-6 text-white" />
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
                                                                    <TableRow className="bg-slate-50/50 dark:bg-slate-600/50">
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

                                    {/* Operations Tab */}
                                    <TabsContent value="operations" className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <Link href={route("admin.warehouses.income", warehouse.id)}>
                                                <Card className="border-0 shadow-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-green-900/30 hover:shadow-3xl transform hover:scale-105 duration-300 cursor-pointer backdrop-blur-xl">
                                                    <CardContent className="p-8 text-center">
                                                        <div className="relative">
                                                            <div className="absolute -inset-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-3xl blur-lg opacity-30"></div>
                                                            <div className="relative p-6 bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 rounded-3xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-2xl">
                                                                <Download className="w-10 h-10 text-white" />
                                                                <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full opacity-70"></div>
                                                            </div>
                                                        </div>
                                                        <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-3">{t("Import Products")}</h3>
                                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">{t("Manage incoming inventory and stock")}</p>
                                                        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-green-600 dark:text-green-400 font-semibold">
                                                            {t("Manage Imports")}
                                                            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>

                                            <Link href={route("admin.warehouses.outcome", warehouse.id)}>
                                                <Card className="border-0 shadow-2xl bg-gradient-to-br from-red-50 via-orange-50 to-red-100 dark:from-red-900/20 dark:via-orange-900/20 dark:to-red-900/30 hover:shadow-3xl transform hover:scale-105 duration-300 cursor-pointer backdrop-blur-xl">
                                                    <CardContent className="p-8 text-center">
                                                        <div className="relative">
                                                            <div className="absolute -inset-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 rounded-3xl blur-lg opacity-30"></div>
                                                            <div className="relative p-6 bg-gradient-to-br from-red-500 via-orange-500 to-red-600 rounded-3xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-2xl">
                                                                <Upload className="w-10 h-10 text-white" />
                                                                <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full opacity-70"></div>
                                                            </div>
                                                        </div>
                                                        <h3 className="text-xl font-bold text-red-700 dark:text-red-300 mb-3">{t("Export Products")}</h3>
                                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">{t("Manage outgoing inventory and exports")}</p>
                                                        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-red-600 dark:text-red-400 font-semibold">
                                                            {t("Manage Exports")}
                                                            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>

                                            <Link href={route("admin.warehouses.transfers", warehouse.id)}>
                                                <Card className="border-0 shadow-2xl bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 dark:from-purple-900/20 dark:via-indigo-900/20 dark:to-purple-900/30 hover:shadow-3xl transform hover:scale-105 duration-300 cursor-pointer backdrop-blur-xl">
                                                    <CardContent className="p-8 text-center">
                                                        <div className="relative">
                                                            <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 rounded-3xl blur-lg opacity-30"></div>
                                                            <div className="relative p-6 bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600 rounded-3xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-2xl">
                                                                <ArrowRightLeft className="w-10 h-10 text-white" />
                                                                <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full opacity-70"></div>
                                                            </div>
                                                        </div>
                                                        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">{t("Transfer Products")}</h3>
                                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">{t("Move inventory between warehouses")}</p>
                                                        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-purple-600 dark:text-purple-400 font-semibold">
                                                            {t("Manage Transfers")}
                                                            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>

                                            <Link href={route("admin.warehouses.sales", warehouse.id)}>
                                                <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-blue-900/30 hover:shadow-3xl transform hover:scale-105 duration-300 cursor-pointer backdrop-blur-xl">
                                                    <CardContent className="p-8 text-center">
                                                        <div className="relative">
                                                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-3xl blur-lg opacity-30"></div>
                                                            <div className="relative p-6 bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 rounded-3xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-2xl">
                                                                <Store className="w-10 h-10 text-white" />
                                                                <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full opacity-70"></div>
                                                            </div>
                                                        </div>
                                                        <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-3">{t("Shop Moves")}</h3>
                                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">{t("Track products moved to shop for sales")}</p>
                                                        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-blue-600 dark:text-blue-400 font-semibold">
                                                            {t("Manage Shop Moves")}
                                                            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>

                                            <Link href={route("admin.warehouses.products", warehouse.id)}>
                                                <Card className="border-0 shadow-2xl bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 dark:from-indigo-900/20 dark:via-blue-900/20 dark:to-indigo-900/30 hover:shadow-3xl transform hover:scale-105 duration-300 cursor-pointer backdrop-blur-xl">
                                                    <CardContent className="p-8 text-center">
                                                        <div className="relative">
                                                            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 rounded-3xl blur-lg opacity-30"></div>
                                                            <div className="relative p-6 bg-gradient-to-br from-indigo-500 via-blue-500 to-indigo-600 rounded-3xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-2xl">
                                                                <Package className="w-10 h-10 text-white" />
                                                                <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full opacity-70"></div>
                                                            </div>
                                                        </div>
                                                        <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-3">{t("Product Management")}</h3>
                                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">{t("View and manage warehouse products")}</p>
                                                        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
                                                            {t("Manage Products")}
                                                            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>

                                            <Link href={route("admin.warehouses.users.create", warehouse.id)}>
                                                <Card className="border-0 shadow-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-emerald-900/30 hover:shadow-3xl transform hover:scale-105 duration-300 cursor-pointer backdrop-blur-xl">
                                                    <CardContent className="p-8 text-center">
                                                        <div className="relative">
                                                            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-3xl blur-lg opacity-30"></div>
                                                            <div className="relative p-6 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-3xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-2xl">
                                                                <UserPlus className="w-10 h-10 text-white" />
                                                                <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full opacity-70"></div>
                                                            </div>
                                                        </div>
                                                        <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mb-3">{t("User Management")}</h3>
                                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">{t("Add and manage warehouse users")}</p>
                                                        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                                                            {t("Manage Users")}
                                                            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>

                                            <Link href={route("admin.warehouses.wallet", warehouse.id)}>
                                                <Card className="border-0 shadow-2xl bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 dark:from-yellow-900/20 dark:via-amber-900/20 dark:to-yellow-900/30 hover:shadow-3xl transform hover:scale-105 duration-300 cursor-pointer backdrop-blur-xl">
                                                    <CardContent className="p-8 text-center">
                                                        <div className="relative">
                                                            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 rounded-3xl blur-lg opacity-30"></div>
                                                            <div className="relative p-6 bg-gradient-to-br from-yellow-500 via-amber-500 to-yellow-600 rounded-3xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-2xl">
                                                                <Wallet className="w-10 h-10 text-white" />
                                                                <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full opacity-70"></div>
                                                            </div>
                                                        </div>
                                                        <h3 className="text-xl font-bold text-yellow-700 dark:text-yellow-300 mb-3">{t("Wallet Management")}</h3>
                                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">{t("Manage warehouse financial transactions")}</p>
                                                        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-yellow-600 dark:text-yellow-400 font-semibold">
                                                            {t("Manage Wallet")}
                                                            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>

                                            <Link href={route("admin.warehouses.charts", warehouse.id)}>
                                                <Card className="border-0 shadow-2xl bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 dark:from-pink-900/20 dark:via-rose-900/20 dark:to-pink-900/30 hover:shadow-3xl transform hover:scale-105 duration-300 cursor-pointer backdrop-blur-xl">
                                                    <CardContent className="p-8 text-center">
                                                        <div className="relative">
                                                            <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-3xl blur-lg opacity-30"></div>
                                                            <div className="relative p-6 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 rounded-3xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-2xl">
                                                                <BarChart3 className="w-10 h-10 text-white" />
                                                                <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full opacity-70"></div>
                                                            </div>
                                                        </div>
                                                        <h3 className="text-xl font-bold text-pink-700 dark:text-pink-300 mb-3">{t("Analytics & Charts")}</h3>
                                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">{t("View comprehensive warehouse analytics and insights")}</p>
                                                        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-pink-600 dark:text-pink-400 font-semibold">
                                                            {t("View Analytics")}
                                                            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        </div>
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
