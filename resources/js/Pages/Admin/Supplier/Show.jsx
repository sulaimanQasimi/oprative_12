import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
import {
    Truck,
    ArrowLeft,
    Edit,
    Building,
    Mail,
    Phone,
    MapPin,
    FileText,
    CreditCard,
    BookOpen,
    Globe,
    Trash2,
    CreditCard as PaymentIcon,
    ShoppingBag,
    User,
    DollarSign,
    Calendar,
    Package,
    Sparkles,
    Hash,
    Receipt,
    Calculator,
    AlertCircle,
    CheckCircle,
    Plus,
    Eye,
    Clock,
    Building2,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/Components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Show({ auth, supplier, purchases, payments, summary, permissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'purchase': { color: 'bg-blue-100 text-blue-700', label: t('Purchase') },
            'onway': { color: 'bg-yellow-100 text-yellow-700', label: t('On Way') },
            'on_border': { color: 'bg-orange-100 text-orange-700', label: t('On Border') },
            'on_plan': { color: 'bg-purple-100 text-purple-700', label: t('On Plan') },
            'on_ship': { color: 'bg-indigo-100 text-indigo-700', label: t('On Ship') },
            'arrived': { color: 'bg-green-100 text-green-700', label: t('Arrived') },
            'warehouse_moved': { color: 'bg-emerald-100 text-emerald-700', label: t('Moved to Warehouse') },
            'return': { color: 'bg-red-100 text-red-700', label: t('Return') },
        };

        const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-700', label: status };
        return (
            <Badge className={`${config.color} font-medium`}>
                {config.label}
            </Badge>
        );
    };

    return (
        <>
            <Head title={`${t("Supplier")}: ${supplier.name}`}>
                <style>{`
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
                                    linear-gradient(45deg, #22c55e, #16a34a) border-box;
                        border: 2px solid transparent;
                    }
                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #22c55e, #16a34a) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={Truck} color="indigo" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                <Navigation auth={auth} currentRoute="admin.suppliers" />

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
                                    className="relative"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-indigo-500 via-blue-500 to-indigo-600 p-4 rounded-2xl shadow-2xl">
                                        <Truck className="w-8 h-8 text-white" />
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {t("Supplier Details")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent"
                                    >
                                        {supplier.name}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Building2 className="w-4 h-4" />
                                        {supplier.contact_name || t("Supplier Account")}
                                    </motion.p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                {permissions.view_supplier && (
                                    <Link href={route('admin.suppliers.activity-log', supplier.id)}>
                                        <Button 
                                            size="sm"
                                            variant="outline"
                                            className="h-10 px-4 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                                        >
                                            <Clock className="h-4 w-4 mr-2" />
                                            {t("Activity Log")}
                                        </Button>
                                    </Link>
                                )}

                                {permissions.can_update && (
                                    <Link href={route('admin.suppliers.edit', supplier.id)}>
                                        <Button 
                                            size="sm"
                                            className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
                                        >
                                            <Edit className="h-4 w-4 mr-2" />
                                            {t("Edit")}
                                        </Button>
                                    </Link>
                                )}

                                {permissions.can_delete && (
                                    <Button 
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            if (confirm(t('Are you sure you want to delete this supplier?'))) {
                                                router.delete(route('admin.suppliers.destroy', supplier.id));
                                            }
                                        }}
                                        className="h-10 px-4 border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        {t("Delete")}
                                    </Button>
                                )}

                                <Link href={route('admin.suppliers.index')}>
                                    <Button 
                                        size="sm"
                                        variant="outline"
                                        className="h-10 px-4 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        {t("Back")}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-indigo-300 dark:scrollbar-thumb-indigo-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="max-w-7xl mx-auto space-y-8"
                            >
                                {/* Tabs for Overview, Purchases, Payments */}
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                                    <TabsList className="grid w-full grid-cols-3 h-14 p-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700">
                                        <TabsTrigger value="overview" className="h-12 text-sm font-semibold">
                                            {t("Overview")}
                                        </TabsTrigger>
                                        <TabsTrigger value="purchases" className="h-12 text-sm font-semibold">
                                            {t("Purchases")}
                                        </TabsTrigger>
                                        <TabsTrigger value="payments" className="h-12 text-sm font-semibold">
                                            {t("Payments")}
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="overview" className="space-y-6">
                                        {/* Supplier Information */}
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="bg-gradient-to-r from-indigo-500/20 via-blue-500/20 to-indigo-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg">
                                                        <Building2 className="h-6 w-6 text-white" />
                                                    </div>
                                                    {t("Supplier Information")}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                            <Building className="w-4 h-4" />
                                                            <span className="text-sm font-medium">{t("Supplier Name")}</span>
                                                        </div>
                                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.name}</p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                            <User className="w-4 h-4" />
                                                            <span className="text-sm font-medium">{t("Contact Person")}</span>
                                                        </div>
                                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.contact_name || t("Not provided")}</p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                            <Mail className="w-4 h-4" />
                                                            <span className="text-sm font-medium">{t("Email Address")}</span>
                                                        </div>
                                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.email || t("Not provided")}</p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                            <Phone className="w-4 h-4" />
                                                            <span className="text-sm font-medium">{t("Phone Number")}</span>
                                                        </div>
                                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.phone || t("Not provided")}</p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                            <MapPin className="w-4 h-4" />
                                                            <span className="text-sm font-medium">{t("Address")}</span>
                                                        </div>
                                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.address || t("Not provided")}</p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                            <Globe className="w-4 h-4" />
                                                            <span className="text-sm font-medium">{t("Location")}</span>
                                                        </div>
                                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                                            {[supplier.city, supplier.state, supplier.country].filter(Boolean).join(", ") || t("Not provided")}
                                                            {supplier.postal_code && <span className="ml-1">({supplier.postal_code})</span>}
                                                        </p>
                                                    </div>

                                                    {supplier.id_number && (
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                <FileText className="w-4 h-4" />
                                                                <span className="text-sm font-medium">{t("ID Number / Tax ID")}</span>
                                                            </div>
                                                            <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.id_number}</p>
                                                        </div>
                                                    )}

                                                    {supplier.status && (
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                <CheckCircle className="w-4 h-4" />
                                                                <span className="text-sm font-medium">{t("Status")}</span>
                                                            </div>
                                                            <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.status}</p>
                                                        </div>
                                                    )}

                                                    {supplier.type && (
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                <Building className="w-4 h-4" />
                                                                <span className="text-sm font-medium">{t("Type")}</span>
                                                            </div>
                                                            <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.type}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Bank Information */}
                                        {(supplier.bank_name || supplier.bank_account_number || supplier.bank_account_name) && (
                                            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                                <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                                    <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                                                            <CreditCard className="h-6 w-6 text-white" />
                                                        </div>
                                                        {t("Bank Information")}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-8">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        {supplier.bank_name && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <Building className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{t("Bank Name")}</span>
                                                                </div>
                                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.bank_name}</p>
                                                            </div>
                                                        )}

                                                        {supplier.bank_account_number && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <Hash className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{t("Account Number")}</span>
                                                                </div>
                                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.bank_account_number}</p>
                                                            </div>
                                                        )}

                                                        {supplier.bank_account_name && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <User className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{t("Account Holder")}</span>
                                                                </div>
                                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.bank_account_name}</p>
                                                            </div>
                                                        )}

                                                        {supplier.bank_account_branch && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <MapPin className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{t("Branch")}</span>
                                                                </div>
                                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.bank_account_branch}</p>
                                                            </div>
                                                        )}

                                                        {supplier.bank_account_swift_code && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <Hash className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{t("SWIFT Code")}</span>
                                                                </div>
                                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.bank_account_swift_code}</p>
                                                            </div>
                                                        )}

                                                        {supplier.bank_account_iban && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <Hash className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{t("IBAN")}</span>
                                                                </div>
                                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.bank_account_iban}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {/* License Information */}
                                        {(supplier.license_number || supplier.license_type || supplier.license_expiration_date) && (
                                            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                                <CardHeader className="bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-purple-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                                    <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                        <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg">
                                                            <FileText className="h-6 w-6 text-white" />
                                                        </div>
                                                        {t("License Information")}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-8">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        {supplier.license_number && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <Hash className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{t("License Number")}</span>
                                                                </div>
                                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.license_number}</p>
                                                            </div>
                                                        )}

                                                        {supplier.license_type && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <FileText className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{t("License Type")}</span>
                                                                </div>
                                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.license_type}</p>
                                                            </div>
                                                        )}

                                                        {supplier.license_expiration_date && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <Calendar className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{t("Expiration Date")}</span>
                                                                </div>
                                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{formatDate(supplier.license_expiration_date)}</p>
                                                            </div>
                                                        )}

                                                        {supplier.license_file && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <FileText className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{t("License File")}</span>
                                                                </div>
                                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.license_file}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {/* Social Media & Website */}
                                        {(supplier.website || supplier.facebook || supplier.instagram || supplier.twitter || supplier.linkedin || supplier.youtube || supplier.tiktok || supplier.pinterest || supplier.snapchat || supplier.telegram || supplier.whatsapp) && (
                                            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                                <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                                    <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                                            <Globe className="h-6 w-6 text-white" />
                                                        </div>
                                                        {t("Social Media & Website")}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-8">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        {supplier.website && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <Globe className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{t("Website")}</span>
                                                                </div>
                                                                <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                                                    {supplier.website}
                                                                </a>
                                                            </div>
                                                        )}

                                                        {supplier.facebook && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <Globe className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{t("Facebook")}</span>
                                                                </div>
                                                                <a href={supplier.facebook} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                                                    {supplier.facebook}
                                                                </a>
                                                            </div>
                                                        )}

                                                        {supplier.instagram && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <Globe className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{t("Instagram")}</span>
                                                                </div>
                                                                <a href={supplier.instagram} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                                                    {supplier.instagram}
                                                                </a>
                                                            </div>
                                                        )}

                                                        {supplier.twitter && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <Globe className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{t("Twitter")}</span>
                                                                </div>
                                                                <a href={supplier.twitter} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                                                    {supplier.twitter}
                                                                </a>
                                                            </div>
                                                        )}

                                                        {supplier.linkedin && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <Globe className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{t("LinkedIn")}</span>
                                                                </div>
                                                                <a href={supplier.linkedin} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                                                    {supplier.linkedin}
                                                                </a>
                                                            </div>
                                                        )}

                                                        {supplier.youtube && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <Globe className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{t("YouTube")}</span>
                                                                </div>
                                                                <a href={supplier.youtube} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                                                    {supplier.youtube}
                                                                </a>
                                                            </div>
                                                        )}

                                                        {supplier.tiktok && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <Globe className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{t("TikTok")}</span>
                                                                </div>
                                                                <a href={supplier.tiktok} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                                                    {supplier.tiktok}
                                                                </a>
                                                            </div>
                                                        )}

                                                        {supplier.pinterest && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <Globe className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{t("Pinterest")}</span>
                                                                </div>
                                                                <a href={supplier.pinterest} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                                                    {supplier.pinterest}
                                                                </a>
                                                            </div>
                                                        )}

                                                        {supplier.snapchat && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <Globe className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{t("Snapchat")}</span>
                                                                </div>
                                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.snapchat}</p>
                                                            </div>
                                                        )}

                                                        {supplier.telegram && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <Globe className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{t("Telegram")}</span>
                                                                </div>
                                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.telegram}</p>
                                                            </div>
                                                        )}

                                                        {supplier.whatsapp && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <Globe className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{t("WhatsApp")}</span>
                                                                </div>
                                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.whatsapp}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {/* Personal Information */}
                                        {(supplier.personal_id_number || supplier.personal_id_type || supplier.personal_id_expiration_date) && (
                                            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                                <CardHeader className="bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-orange-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                                    <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                        <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg">
                                                            <User className="h-6 w-6 text-white" />
                                                        </div>
                                                        {t("Personal Information")}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-8">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        {supplier.personal_id_number && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <Hash className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{t("Personal ID Number")}</span>
                                                                </div>
                                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.personal_id_number}</p>
                                                            </div>
                                                        )}

                                                        {supplier.personal_id_type && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <FileText className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{t("ID Type")}</span>
                                                                </div>
                                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.personal_id_type}</p>
                                                            </div>
                                                        )}

                                                        {supplier.personal_id_expiration_date && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <Calendar className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{t("ID Expiration Date")}</span>
                                                                </div>
                                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{formatDate(supplier.personal_id_expiration_date)}</p>
                                                            </div>
                                                        )}

                                                        {supplier.personal_id_file && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <FileText className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{t("ID File")}</span>
                                                                </div>
                                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.personal_id_file}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {/* Additional Information */}
                                        {(supplier.notes) && (
                                            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                                <CardHeader className="bg-gradient-to-r from-gray-500/20 via-slate-500/20 to-gray-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                                    <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                        <div className="p-3 bg-gradient-to-br from-gray-500 to-slate-600 rounded-xl shadow-lg">
                                                            <FileText className="h-6 w-6 text-white" />
                                                        </div>
                                                        {t("Additional Information")}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-8">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                            <FileText className="w-4 h-4" />
                                                            <span className="text-sm font-medium">{t("Notes")}</span>
                                                        </div>
                                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.notes}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="purchases" className="space-y-6">
                                        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
                                            <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                                                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
                                                    <ShoppingBag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                    {t("Purchase History")}
                                                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 ml-auto">
                                                        {purchases.total} {t("purchases")}
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <div className="overflow-x-auto">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                                <TableHead className="font-semibold text-gray-900 dark:text-white py-4">{t("Invoice Number")}</TableHead>
                                                                <TableHead className="font-semibold text-gray-900 dark:text-white py-4">{t("Date")}</TableHead>
                                                                <TableHead className="font-semibold text-gray-900 dark:text-white py-4">{t("Total Amount")}</TableHead>
                                                                <TableHead className="font-semibold text-gray-900 dark:text-white py-4">{t("Paid Amount")}</TableHead>
                                                                <TableHead className="font-semibold text-gray-900 dark:text-white py-4">{t("Status")}</TableHead>
                                                                <TableHead className="font-semibold text-gray-900 dark:text-white py-4">{t("Actions")}</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {purchases.data?.length > 0 ? (
                                                                purchases.data.map((purchase) => (
                                                                    <TableRow key={purchase.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                                                        <TableCell className="py-4">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                                                    <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{purchase.invoice_number}</p>
                                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">ID: {purchase.id}</p>
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="py-4 text-sm text-gray-600 dark:text-gray-400">
                                                                            {formatDate(purchase.invoice_date)}
                                                                        </TableCell>
                                                                        <TableCell className="py-4 font-bold text-green-600 dark:text-green-400 font-mono text-sm">
                                                                            {formatCurrency(purchase.total_amount)}
                                                                        </TableCell>
                                                                        <TableCell className="py-4 font-bold text-blue-600 dark:text-blue-400 font-mono text-sm">
                                                                            {formatCurrency(purchase.paid_amount)}
                                                                        </TableCell>
                                                                        <TableCell className="py-4">{getStatusBadge(purchase.status)}</TableCell>
                                                                        <TableCell className="py-4">
                                                                            <div className="flex items-center gap-2">
                                                                                <Link href={route('admin.purchases.show', purchase.id)}>
                                                                                    <Button size="sm" variant="outline" className="h-10 w-10 p-0 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                                                                                        <Eye className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                                                                    </Button>
                                                                                </Link>
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))
                                                            ) : (
                                                                <TableRow>
                                                                    <TableCell colSpan="6" className="h-48 text-center">
                                                                        <div className="flex flex-col items-center gap-4">
                                                                            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                                                                                <ShoppingBag className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-medium text-gray-900 dark:text-white">{t("No purchases found")}</p>
                                                                                <p className="text-sm text-gray-500 dark:text-gray-400">{t("This supplier has no purchase history yet.")}</p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>

                                                {/* Pagination */}
                                                {purchases.last_page > 1 && (
                                                    <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                {t("Showing")} {purchases.from} {t("to")} {purchases.to} {t("of")} {purchases.total} {t("results")}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {purchases.prev_page_url && (
                                                                    <Link href={purchases.prev_page_url} preserveState>
                                                                        <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                                            {t("Previous")}
                                                                        </Button>
                                                                    </Link>
                                                                )}
                                                                {purchases.next_page_url && (
                                                                    <Link href={purchases.next_page_url} preserveState>
                                                                        <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                                            {t("Next")}
                                                                        </Button>
                                                                    </Link>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="payments" className="space-y-6">
                                        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
                                            <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                                                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
                                                    <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                                    {t("Payment History")}
                                                    <Badge className="bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800 ml-auto">
                                                        {payments.total} {t("payments")}
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <div className="overflow-x-auto">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                                <TableHead className="font-semibold text-gray-900 dark:text-white py-4">{t("Amount")}</TableHead>
                                                                <TableHead className="font-semibold text-gray-900 dark:text-white py-4">{t("Payment Method")}</TableHead>
                                                                <TableHead className="font-semibold text-gray-900 dark:text-white py-4">{t("Reference")}</TableHead>
                                                                <TableHead className="font-semibold text-gray-900 dark:text-white py-4">{t("Payment Date")}</TableHead>
                                                                <TableHead className="font-semibold text-gray-900 dark:text-white py-4">{t("Notes")}</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {payments.data?.length > 0 ? (
                                                                payments.data.map((payment) => (
                                                                    <TableRow key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                                                        <TableCell className="py-4 font-bold text-green-600 dark:text-green-400 font-mono text-sm">
                                                                            {formatCurrency(payment.amount)}
                                                                        </TableCell>
                                                                        <TableCell className="py-4">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                                                    <CreditCard className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="font-semibold text-gray-900 dark:text-white capitalize text-sm">{payment.payment_method?.replace('_', ' ')}</p>
                                                                                    {payment.bank_name && (
                                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{payment.bank_name}</p>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="py-4">
                                                                            {payment.reference_number ? (
                                                                                <Badge variant="outline" className="font-mono text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                                                                                    {payment.reference_number}
                                                                                </Badge>
                                                                            ) : (
                                                                                <span className="text-gray-400 dark:text-gray-500">-</span>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell className="py-4 text-sm text-gray-600 dark:text-gray-400">
                                                                            {formatDate(payment.payment_date)}
                                                                        </TableCell>
                                                                        <TableCell className="py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                                                            {payment.notes || '-'}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))
                                                            ) : (
                                                                <TableRow>
                                                                    <TableCell colSpan="5" className="h-48 text-center">
                                                                        <div className="flex flex-col items-center gap-4">
                                                                            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                                                                                <CreditCard className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-medium text-gray-900 dark:text-white">{t("No payments found")}</p>
                                                                                <p className="text-sm text-gray-500 dark:text-gray-400">{t("This supplier has no payment history yet.")}</p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>

                                                {/* Pagination */}
                                                {payments.last_page > 1 && (
                                                    <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                {t("Showing")} {payments.from} {t("to")} {payments.to} {t("of")} {payments.total} {t("results")}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {payments.prev_page_url && (
                                                                    <Link href={payments.prev_page_url} preserveState>
                                                                        <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                                            {t("Previous")}
                                                                        </Button>
                                                                    </Link>
                                                                )}
                                                                {payments.next_page_url && (
                                                                    <Link href={payments.next_page_url} preserveState>
                                                                        <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                                            {t("Next")}
                                                                        </Button>
                                                                    </Link>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
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
