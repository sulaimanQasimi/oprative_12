import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Activity,
    User,
    Calendar,
    History,
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
    Zap,
    Plus,
    Edit,
    Trash2,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Eye,
    Info,
    Clock,
    AlertCircle,
    CheckCircle,
    XCircle,
    Sparkles,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
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
import BackButton from "@/Components/BackButton";

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

export default function ActivityLogShow({ auth, model, modelMeta, activities, permissions }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [expandedActivity, setExpandedActivity] = useState(null);

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
        if (description.includes('restored')) return RefreshCw;
        return Activity;
    };

    // Get activity color
    const getActivityColor = (description) => {
        if (description.includes('created')) return 'text-green-600';
        if (description.includes('updated')) return 'text-blue-600';
        if (description.includes('deleted')) return 'text-red-600';
        if (description.includes('restored')) return 'text-orange-600';
        return 'text-sky-600';
    };

    // Get activity badge variant
    const getActivityBadge = (description) => {
        if (description.includes('created')) return 'bg-green-100 text-green-800 border-green-200';
        if (description.includes('updated')) return 'bg-blue-100 text-blue-800 border-blue-200';
        if (description.includes('deleted')) return 'bg-red-100 text-red-800 border-red-200';
        if (description.includes('restored')) return 'bg-orange-100 text-orange-800 border-orange-200';
        return 'bg-sky-100 text-sky-800 border-sky-200';
    };

    // Get model icon
    const getModelIcon = () => {
        const iconName = modelMeta?.icon || 'Activity';
        return ICON_MAP[iconName] || Activity;
    };

    // Get back route
    const getBackRoute = () => {
        if (modelMeta?.routePrefix) {
            return route(`${modelMeta.routePrefix}.show`, model.id);
        }
        return route('admin.dashboard');
    };

    const ModelIcon = getModelIcon();

    return (
        <>
            <Head title={t("Activity Log") + " - " + modelMeta?.displayName}>
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
                                        <ModelIcon className="w-8 h-8 text-white" />
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
                                        <Zap className="w-4 h-4" />
                                        {t("Activity Log")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent"
                                    >
                                        {modelMeta?.displayName || 'Model'}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <ModelIcon className="w-4 h-4" />
                                        {t("Activity History")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <BackButton 
                                    href={getBackRoute()}
                                    variant="outline"
                                    className="border-sky-200 text-sky-700 hover:bg-sky-50 dark:border-sky-700 dark:text-sky-400 dark:hover:bg-sky-900/20"
                                />
                            </motion.div>
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
                                {/* Activity Log Card */}
                                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                    <CardHeader className="bg-gradient-to-r from-sky-500/20 via-cyan-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                        <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                            <div className="p-3 bg-gradient-to-br from-sky-500 to-cyan-600 rounded-xl shadow-lg">
                                                <Activity className="h-6 w-6 text-white" />
                                            </div>
                                            {t("Activity History")}
                                            <Badge className="bg-sky-100 text-sky-700 border-sky-200 ml-auto">
                                                {activities?.total || 0} {t("activities")}
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {activities?.data && activities.data.length > 0 ? (
                                            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                                                <AnimatePresence>
                                                    {activities.data.map((activity, index) => {
                                                        const Icon = getActivityIcon(activity.description);
                                                        const isExpanded = expandedActivity === activity.id;
                                                        
                                                        return (
                                                            <motion.div
                                                                key={activity.id}
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.9 + (index * 0.05), duration: 0.4 }}
                                                                className="p-6 hover:bg-sky-50/50 dark:hover:bg-sky-900/10 transition-all duration-200"
                                                            >
                                                                <div className="flex items-start space-x-4">
                                                                    <div className={`p-3 rounded-xl shadow-md ${getActivityColor(activity.description).replace('text-', 'bg-').replace('-600', '-100')} flex-shrink-0`}>
                                                                        <Icon className={`h-5 w-5 ${getActivityColor(activity.description)}`} />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center justify-between mb-2">
                                                                            <div className="flex items-center space-x-3">
                                                                                <Badge className={`${getActivityBadge(activity.description)} font-medium`}>
                                                                                    {activity.description}
                                                                                </Badge>
                                                                                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                                                                                    <User className="h-4 w-4" />
                                                                                    <span>{activity.causer?.name || t('System')}</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                                                                                <Calendar className="h-4 w-4" />
                                                                                <span>{formatDate(activity.created_at)}</span>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        {activity.changes && activity.changes.length > 0 && (
                                                                            <div className="space-y-2">
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={() => setExpandedActivity(isExpanded ? null : activity.id)}
                                                                                    className="text-sky-600 hover:text-sky-700 hover:bg-sky-100 dark:text-sky-400 dark:hover:text-sky-300 dark:hover:bg-sky-900/20 p-1 h-auto"
                                                                                >
                                                                                    <Info className="h-4 w-4 mr-1" />
                                                                                    {isExpanded ? t('Hide Details') : t('Show Details')}
                                                                                    {isExpanded ? (
                                                                                        <ChevronLeft className="h-4 w-4 ml-1" />
                                                                                    ) : (
                                                                                        <ChevronRight className="h-4 w-4 ml-1" />
                                                                                    )}
                                                                                </Button>
                                                                                
                                                                                <AnimatePresence>
                                                                                    {isExpanded && (
                                                                                        <motion.div
                                                                                            initial={{ opacity: 0, height: 0 }}
                                                                                            animate={{ opacity: 1, height: 'auto' }}
                                                                                            exit={{ opacity: 0, height: 0 }}
                                                                                            transition={{ duration: 0.3 }}
                                                                                        >
                                                                                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 space-y-3">
                                                                                                <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                                                                                                    {t('Changes Made')}:
                                                                                                </h4>
                                                                                                <div className="space-y-2">
                                                                                                    {activity.changes.map((change, changeIndex) => (
                                                                                                        <div key={changeIndex} className="text-sm">
                                                                                                            <div className="font-medium text-slate-600 dark:text-slate-400 mb-1">
                                                                                                                {change.field}:
                                                                                                            </div>
                                                                                                            <div className="pl-4 space-y-1">
                                                                                                                {change.old !== null && (
                                                                                                                    <div className="flex items-center space-x-2">
                                                                                                                        <span className="text-red-600 dark:text-red-400 font-mono text-xs bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                                                                                                                            {t('From')}: {change.old}
                                                                                                                        </span>
                                                                                                                    </div>
                                                                                                                )}
                                                                                                                {change.new !== null && (
                                                                                                                    <div className="flex items-center space-x-2">
                                                                                                                        <span className="text-green-600 dark:text-green-400 font-mono text-xs bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                                                                                                                            {t('To')}: {change.new}
                                                                                                                        </span>
                                                                                                                    </div>
                                                                                                                )}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    ))}
                                                                                                </div>
                                                                                            </div>
                                                                                        </motion.div>
                                                                                    )}
                                                                                </AnimatePresence>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </AnimatePresence>
                                            </div>
                                        ) : (
                                            <div className="p-12 text-center">
                                                <motion.div
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 1.0, duration: 0.4 }}
                                                    className="flex flex-col items-center space-y-4"
                                                >
                                                    <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                        <Activity className="h-16 w-16 text-slate-400" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400">
                                                            {t("No activities found")}
                                                        </h3>
                                                        <p className="text-sm text-slate-500">
                                                            {t("This item has no recorded activities yet")}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        )}

                                        {/* Pagination */}
                                        {activities?.data && activities.data.length > 0 && activities.last_page > 1 && (
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