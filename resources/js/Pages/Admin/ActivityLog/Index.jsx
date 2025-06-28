import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion, AnimatePresence } from "framer-motion";
import {
    Activity,
    Search,
    Filter,
    Calendar,
    User,
    RefreshCw,
    Plus,
    Edit,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    Building,
    Package,
    Users,
    ShoppingCart,
    Receipt,
    Warehouse,
    UserCheck,
    CreditCard,
    DollarSign,
    Ruler,
    MapPin,
    Clock,
    Sparkles,
    Zap,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

// Icon mapping for different model types
const ICON_MAP = {
    Building,
    User,
    Package,
    Users,
    ShoppingCart,
    Receipt,
    Warehouse,
    UserCheck,
    CreditCard,
    DollarSign,
    Ruler,
    MapPin,
    Activity,
};

export default function ActivityLogIndex({ 
    auth, 
    activities, 
    filters, 
    availableModels, 
    availableLogNames, 
    permissions 
}) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedModel, setSelectedModel] = useState(filters?.model_type || '');
    const [selectedLogName, setSelectedLogName] = useState(filters?.log_name || '');
    const [dateFrom, setDateFrom] = useState(filters?.date_from || '');
    const [dateTo, setDateTo] = useState(filters?.date_to || '');

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    // Get activity icon
    const getActivityIcon = (description) => {
        if (description.includes('created')) return Plus;
        if (description.includes('updated')) return Edit;
        if (description.includes('deleted')) return Trash2;
        if (description.includes('viewed')) return Eye;
        return Activity;
    };

    // Get activity color
    const getActivityColor = (description) => {
        if (description.includes('created')) return 'text-green-600';
        if (description.includes('updated')) return 'text-blue-600';
        if (description.includes('deleted')) return 'text-red-600';
        if (description.includes('viewed')) return 'text-purple-600';
        return 'text-sky-600';
    };

    // Get activity badge variant
    const getActivityBadge = (description) => {
        if (description.includes('created')) return 'bg-green-100 text-green-800 border-green-200';
        if (description.includes('updated')) return 'bg-blue-100 text-blue-800 border-blue-200';
        if (description.includes('deleted')) return 'bg-red-100 text-red-800 border-red-200';
        if (description.includes('viewed')) return 'bg-purple-100 text-purple-800 border-purple-200';
        return 'bg-sky-100 text-sky-800 border-sky-200';
    };

    // Get model icon by name
    const getModelIcon = (modelType) => {
        const iconName = {
            'supplier': 'Building',
            'user': 'User',
            'product': 'Package',
            'customer': 'Users',
            'purchase': 'ShoppingCart',
            'sale': 'Receipt',
            'warehouse': 'Warehouse',
            'employee': 'UserCheck',
            'account': 'CreditCard',
            'currency': 'DollarSign',
            'unit': 'Ruler',
            'branch': 'MapPin',
        }[modelType?.toLowerCase()] || 'Activity';
        
        return ICON_MAP[iconName] || Activity;
    };

    // Handle search
    const handleSearch = () => {
        const params = new URLSearchParams();
        
        if (searchTerm) params.set('search', searchTerm);
        if (selectedModel) params.set('model_type', selectedModel);
        if (selectedLogName) params.set('log_name', selectedLogName);
        if (dateFrom) params.set('date_from', dateFrom);
        if (dateTo) params.set('date_to', dateTo);

        router.get(route('admin.activity-logs.index'), Object.fromEntries(params));
    };

    // Clear filters
    const clearFilters = () => {
        setSearchTerm('');
        setSelectedModel('');
        setSelectedLogName('');
        setDateFrom('');
        setDateTo('');
        router.get(route('admin.activity-logs.index'));
    };

    return (
        <>
            <Head title={t("Activity Logs")}>
                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
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
                                    linear-gradient(45deg, #0ea5e9, #0284c7) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #0ea5e9, #0284c7) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={Activity} color="sky" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                <Navigation auth={auth} currentRoute="admin.activity-logs" />

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
                                    <div className="absolute -inset-2 bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-600 p-4 rounded-2xl shadow-2xl">
                                        <Activity className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {t("Admin Panel")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent"
                                    >
                                        {t("Activity Logs")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Zap className="w-4 h-4" />
                                        {t("System-wide activity monitoring")}
                                    </motion.p>
                                </div>
                            </div>
                        </div>
                    </motion.header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-sky-300 dark:scrollbar-thumb-sky-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="max-w-7xl mx-auto space-y-8"
                            >
                                {/* Filters */}
                                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-3">
                                            <Filter className="h-5 w-5 text-sky-600" />
                                            {t("Filters")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                            <div>
                                                <Input
                                                    placeholder={t("Search activities...")}
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="w-full"
                                                />
                                            </div>
                                            <div>
                                                <Select value={selectedModel} onValueChange={setSelectedModel}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t("All Models")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="">{t("All Models")}</SelectItem>
                                                        {availableModels && Object.entries(availableModels).map(([key, name]) => (
                                                            <SelectItem key={key} value={key}>
                                                                {name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Select value={selectedLogName} onValueChange={setSelectedLogName}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t("All Log Types")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="">{t("All Log Types")}</SelectItem>
                                                        {availableLogNames && availableLogNames.map((logName) => (
                                                            <SelectItem key={logName} value={logName}>
                                                                {logName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Input
                                                    type="date"
                                                    placeholder={t("From Date")}
                                                    value={dateFrom}
                                                    onChange={(e) => setDateFrom(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    type="date"
                                                    placeholder={t("To Date")}
                                                    value={dateTo}
                                                    onChange={(e) => setDateTo(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button onClick={handleSearch} className="gap-2">
                                                <Search className="h-4 w-4" />
                                                {t("Search")}
                                            </Button>
                                            <Button variant="outline" onClick={clearFilters} className="gap-2">
                                                <RefreshCw className="h-4 w-4" />
                                                {t("Clear")}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Activity Log Table */}
                                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                    <CardHeader className="bg-gradient-to-r from-sky-500/20 via-cyan-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50">
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-br from-sky-500 to-cyan-600 rounded-lg">
                                                <Activity className="h-5 w-5 text-white" />
                                            </div>
                                            {t("All Activities")}
                                            <Badge variant="secondary" className="ml-auto">
                                                {activities?.total || 0} {t("activities")}
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                            {t("Activity")}
                                                        </TableHead>
                                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                            {t("Type")}
                                                        </TableHead>
                                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                            {t("Subject")}
                                                        </TableHead>
                                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                            {t("User")}
                                                        </TableHead>
                                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                            {t("Date & Time")}
                                                        </TableHead>
                                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                            {t("Actions")}
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {activities?.data?.length > 0 ? (
                                                        activities.data.map((activity, index) => {
                                                            const Icon = getActivityIcon(activity.description);
                                                            const ModelIcon = getModelIcon(activity.subject_type_name);
                                                            
                                                            return (
                                                                <TableRow
                                                                    key={activity.id}
                                                                    className="hover:bg-sky-50 dark:hover:bg-sky-900/10 transition-colors"
                                                                >
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-3">
                                                                            <div className={`p-2 rounded-lg ${getActivityColor(activity.description).replace('text-', 'bg-').replace('-600', '-100')}`}>
                                                                                <Icon className={`h-4 w-4 ${getActivityColor(activity.description)}`} />
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-medium text-slate-800 dark:text-white">
                                                                                    {activity.description}
                                                                                </p>
                                                                                <p className="text-sm text-slate-500">
                                                                                    {activity.log_name}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge className={`${getActivityBadge(activity.description)} font-medium`}>
                                                                            {activity.description?.split(' ')[0] || 'Activity'}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <ModelIcon className="h-4 w-4 text-slate-600" />
                                                                            <div>
                                                                                <p className="font-medium text-slate-800 dark:text-white">
                                                                                    {activity.subject_type_name || 'Unknown'}
                                                                                </p>
                                                                                {activity.subject_id && (
                                                                                    <p className="text-sm text-slate-500">
                                                                                        ID: {activity.subject_id}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <User className="h-4 w-4 text-slate-600" />
                                                                            <div>
                                                                                <p className="font-medium text-slate-800 dark:text-white">
                                                                                    {activity.causer?.name || t('System')}
                                                                                </p>
                                                                                {activity.causer?.email && (
                                                                                    <p className="text-sm text-slate-500">
                                                                                        {activity.causer.email}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                                            <Clock className="h-4 w-4" />
                                                                            {formatDate(activity.created_at)}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {activity.subject_type_name && activity.subject_id && (
                                                                            <Link
                                                                                href={route('admin.activity-logs.show', [
                                                                                    activity.subject_type_name.toLowerCase(),
                                                                                    activity.subject_id
                                                                                ])}
                                                                            >
                                                                                <Button variant="outline" size="sm" className="gap-2">
                                                                                    <Eye className="h-4 w-4" />
                                                                                    {t("View")}
                                                                                </Button>
                                                                            </Link>
                                                                        )}
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan="6" className="h-32 text-center">
                                                                <div className="flex flex-col items-center gap-4">
                                                                    <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                                        <Activity className="h-8 w-8 text-slate-400" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                                                            {t("No activities found")}
                                                                        </p>
                                                                        <p className="text-sm text-slate-500">
                                                                            {t("Try adjusting your search filters")}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        {/* Pagination */}
                                        {activities?.data?.length > 0 && activities.last_page > 1 && (
                                            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700">
                                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                    <span>
                                                        {t("Showing")} {activities.from} {t("to")} {activities.to} {t("of")} {activities.total} {t("activities")}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center space-x-2">
                                                    {activities.prev_page_url && (
                                                        <Button
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => router.get(activities.prev_page_url)}
                                                            className="border-sky-200 text-sky-700 hover:bg-sky-50 dark:border-sky-700 dark:text-sky-400"
                                                        >
                                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                                            {t("Previous")}
                                                        </Button>
                                                    )}
                                                    
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                                        {t("Page")} {activities.current_page} {t("of")} {activities.last_page}
                                                    </span>
                                                    
                                                    {activities.next_page_url && (
                                                        <Button
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => router.get(activities.next_page_url)}
                                                            className="border-sky-200 text-sky-700 hover:bg-sky-50 dark:border-sky-700 dark:text-sky-400"
                                                        >
                                                            {t("Next")}
                                                            <ChevronRight className="h-4 w-4 ml-1" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
} 