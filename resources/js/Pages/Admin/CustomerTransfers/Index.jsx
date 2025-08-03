import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Store,
    ArrowLeft,
    Edit,
    Plus,
    Search,
    Filter,
    Calendar,
    Users,
    Package,
    TrendingUp,
    TrendingDown,
    Eye,
    Trash2,
    CheckCircle,
    XCircle,
    Clock,
    ChevronLeft,
    ChevronRight,
    X
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
import { Input } from "@/Components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";
import BackButton from "@/Components/BackButton";
import ActionButton from "@/Components/ActionButton";
import ApiSelect from "@/Components/ApiSelect";

export default function Index({ auth, transfers, filters = {} }) {
    console.log(transfers);
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [dateFrom, setDateFrom] = useState(filters.date_from || "");
    const [dateTo, setDateTo] = useState(filters.date_to || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "");
    const [customerFilter, setCustomerFilter] = useState(filters.customer_id || "");

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.customer-transfers.index'), {
            search: searchTerm,
            date_from: dateFrom,
            date_to: dateTo,
            status: statusFilter,
            customer_id: customerFilter,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm("");
        setDateFrom("");
        setDateTo("");
        setStatusFilter("");
        setCustomerFilter("");
        router.get(route('admin.customer-transfers.index'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDeleteTransfer = (transferId) => {
        if (confirm(t("Are you sure you want to delete this transfer?"))) {
            router.delete(route('admin.customer-transfers.destroy', transferId));
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', icon: Clock, label: t('Pending') },
            completed: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircle, label: t('Completed') },
            cancelled: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', icon: XCircle, label: t('Cancelled') },
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;
        return (
            <Badge className={`${config.color} border-0 flex items-center gap-1`}>
                <Icon className="w-3 h-3" />
                {config.label}
            </Badge>
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AFN',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <Head title={t("Customer Transfers")}>
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
                <Navigation auth={auth} currentRoute="admin.customer-transfers" />

                {/* Main Content */}
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
                                    <div className="absolute -inset-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 p-4 rounded-2xl shadow-2xl">
                                        <Users className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-green-600 dark:text-green-400 mb-1 flex items-center gap-2"
                                    >
                                        <Package className="w-4 h-4" />
                                        {t("Customer Transfers")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent"
                                    >
                                        {t("Manage Transfers")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Store className="w-4 h-4" />
                                        {t("Transfer products between customers")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center gap-x-2"
                            >
                                <ActionButton link={route("admin.customer-transfers.create")} className="light:bg-green-500 text-white hover:bg-green-700 dark:bg-green-600 dark:text-white dark:hover:bg-green-700" icon={<Plus className="h-4 w-4" />} text={t("New Transfer")} />
                                <BackButton link={route("admin.dashboard")} />
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-green-300 dark:scrollbar-thumb-green-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="max-w-7xl mx-auto space-y-8"
                            >
                                {/* Search and Filter Card */}
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.9, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                        <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                                                    <Search className="h-6 w-6 text-white" />
                                                </div>
                                                {t("Search & Filter Transfers")}
                                                {(searchTerm || dateFrom || dateTo || statusFilter || customerFilter) && (
                                                    <Badge variant="secondary" className="ml-auto">
                                                        {t("Filtered")}
                                                    </Badge>
                                                )}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <form onSubmit={handleSearch} className="space-y-6 flex flex-col gap-4 mb-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                                        <Input
                                                            placeholder={t("Search transfers...")}
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            className="pl-10 h-12 border-2 border-slate-200 hover:border-green-300 focus:border-green-500 transition-colors"
                                                        />
                                                    </div>

                                                    <Input
                                                        type="date"
                                                        placeholder={t("From Date")}
                                                        value={dateFrom}
                                                        onChange={(e) => setDateFrom(e.target.value)}
                                                        className="h-12 border-2 border-slate-200 hover:border-green-300 focus:border-green-500 transition-colors"
                                                    />

                                                    <Input
                                                        type="date"
                                                        placeholder={t("To Date")}
                                                        value={dateTo}
                                                        onChange={(e) => setDateTo(e.target.value)}
                                                        className="h-12 border-2 border-slate-200 hover:border-green-300 focus:border-green-500 transition-colors"
                                                    />

                                                    <select
                                                        value={statusFilter}
                                                        onChange={(e) => setStatusFilter(e.target.value)}
                                                        className="h-12 px-3 border-2 border-slate-200 hover:border-green-300 focus:border-green-500 rounded-md transition-colors"
                                                    >
                                                        <option value="">{t("All Status")}</option>
                                                        <option value="pending">{t("Pending")}</option>
                                                        <option value="completed">{t("Completed")}</option>
                                                        <option value="cancelled">{t("Cancelled")}</option>
                                                    </select>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <ApiSelect
                                                        apiEndpoint="/api/customers/select"
                                                        placeholder={t("Select Customer")}
                                                        searchPlaceholder={t("Search customers...")}
                                                        icon={Users}
                                                        direction="ltr"
                                                        value={customerFilter}
                                                        onChange={(value, option) => setCustomerFilter(option.value)}
                                                        searchParam="search"
                                                        requireAuth={false}
                                                        className="w-full"
                                                    />

                                                    <div className="flex gap-2">
                                                        <Button type="submit" className="flex-1 gap-2 h-12 bg-green-600 hover:bg-green-700">
                                                            <Search className="h-4 w-4" />
                                                            {t("Search")}
                                                        </Button>

                                                        {(searchTerm || dateFrom || dateTo || statusFilter || customerFilter) && (
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={clearFilters}
                                                                className="gap-2 h-12 border-2 hover:border-green-300"
                                                            >
                                                                <X className="h-4 w-4" />
                                                                {t("Clear")}
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </form>


                                            {transfers.data && transfers.data.length > 0 ? (
                                                <div className="overflow-x-auto">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>{t("Reference")}</TableHead>
                                                                <TableHead>{t("From Customer")}</TableHead>
                                                                <TableHead>{t("To Customer")}</TableHead>
                                                                <TableHead>{t("Status")}</TableHead>
                                                                <TableHead>{t("Items")}</TableHead>
                                                                <TableHead>{t("Total Amount")}</TableHead>
                                                                <TableHead>{t("Date")}</TableHead>
                                                                <TableHead className="text-right">{t("Actions")}</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {transfers.data.map((transfer) => (
                                                                <TableRow key={transfer.id}>
                                                                    <TableCell className="font-medium">
                                                                        {transfer.reference_number}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="space-y-1">
                                                                            <div className="font-medium">{transfer.from_customer?.name}</div>
                                                                            <div className="text-sm text-slate-500">{transfer.from_customer?.email}</div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="space-y-1">
                                                                            <div className="font-medium">{transfer.to_customer?.name}</div>
                                                                            <div className="text-sm text-slate-500">{transfer.to_customer?.email}</div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {getStatusBadge(transfer.status)}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <Package className="w-4 h-4 text-slate-400" />
                                                                            <span>{transfer.transfer_items?.length || 0} {t("items")}</span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="font-semibold text-green-600">
                                                                            {formatCurrency(transfer.transfer_items.reduce((acc, item) => acc + item.total_price, 0))}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {formatDate(transfer.created_at)}
                                                                    </TableCell>
                                                                    <TableCell className="text-right">

                                                                        <Button
                                                                            variant="outline"
                                                                            size="default"
                                                                            className="h-12 w-12 p-0 border-gray-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 shadow-sm hover:shadow-md"
                                                                            asChild
                                                                            title={t("View Details")}
                                                                        >
                                                                            <Link href={route('admin.customer-transfers.show', transfer.id)}>
                                                                                <Eye className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                                                                            </Link>
                                                                        </Button>

                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            ) : (
                                                <div className="text-center py-12">
                                                    <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                                                        {searchTerm || dateFrom || dateTo || statusFilter || customerFilter ? t("No transfers found") : t("No transfers yet")}
                                                    </h3>
                                                    <p className="text-slate-500 mb-6">
                                                        {searchTerm || dateFrom || dateTo || statusFilter || customerFilter ? t("Try adjusting your search or filters") : t("Create your first customer transfer to get started")}
                                                    </p>
                                                    <Link href={route("admin.customer-transfers.create")}>
                                                        <Button className="gap-2 bg-green-600 hover:bg-green-700">
                                                            <Plus className="w-4 h-4" />
                                                            {t("Create First Transfer")}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Pagination */}
                                {transfers.links && transfers.links.length > 3 && (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.1, duration: 0.4 }}
                                        className="flex justify-center"
                                    >
                                        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="text-sm text-slate-600 dark:text-slate-400">
                                                        {t("Showing")} {transfers.from} {t("to")} {transfers.to} {t("of")} {transfers.total} {t("transfers")}
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        {transfers.links.map((link, index) => {
                                                            if (link.url === null) {
                                                                return (
                                                                    <Button
                                                                        key={index}
                                                                        variant="outline"
                                                                        size="sm"
                                                                        disabled
                                                                        className="w-10 h-10 p-0"
                                                                    >
                                                                        {link.label === '&laquo; Previous' ? (
                                                                            <ChevronLeft className="h-4 w-4" />
                                                                        ) : link.label === 'Next &raquo;' ? (
                                                                            <ChevronRight className="h-4 w-4" />
                                                                        ) : (
                                                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                                        )}
                                                                    </Button>
                                                                );
                                                            }

                                                            return (
                                                                <Link
                                                                    key={index}
                                                                    href={link.url}
                                                                    preserveState
                                                                    preserveScroll
                                                                >
                                                                    <Button
                                                                        variant={link.active ? "default" : "outline"}
                                                                        size="sm"
                                                                        className={`w-10 h-10 p-0 ${link.active
                                                                            ? 'bg-green-600 hover:bg-green-700 text-white'
                                                                            : 'hover:bg-green-50 hover:border-green-300'
                                                                            }`}
                                                                    >
                                                                        {link.label === '&laquo; Previous' ? (
                                                                            <ChevronLeft className="h-4 w-4" />
                                                                        ) : link.label === 'Next &raquo;' ? (
                                                                            <ChevronRight className="h-4 w-4" />
                                                                        ) : (
                                                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                                        )}
                                                                    </Button>
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
} 