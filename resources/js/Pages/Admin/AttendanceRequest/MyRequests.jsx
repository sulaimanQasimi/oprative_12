import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
import {
    Plus,
    Clock,
    User,
    Calendar,
    Filter,
    CheckCircle,
    XCircle,
    FileText,
    AlertCircle,
    MessageSquare,
    Eye,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Badge } from "@/Components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function MyRequests({ auth, attendanceRequests, employee, filters = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState({
        status: filters.status || '',
        type: filters.type || '',
    });

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    const handleFilterChange = (key, value) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        router.get(route('admin.attendance-requests.my-requests'), localFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setLocalFilters({
            status: '',
            type: '',
        });
        router.get(route('admin.attendance-requests.my-requests'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatDateTime = (datetime) => {
        return new Date(datetime).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', icon: Clock },
            accepted: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircle },
            rejected: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', icon: XCircle },
        };
        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;
        
        return (
            <Badge className={`${config.color} flex items-center gap-1`}>
                <Icon className="w-3 h-3" />
                {t(status.charAt(0).toUpperCase() + status.slice(1))}
            </Badge>
        );
    };

    const getTypeBadge = (type) => {
        const typeConfig = {
            late: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
            absent: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
        };
        const config = typeConfig[type] || typeConfig.absent;
        
        return (
            <Badge className={config.color}>
                {t(type.charAt(0).toUpperCase() + type.slice(1))}
            </Badge>
        );
    };

    const pendingCount = attendanceRequests.data.filter(request => request.status === 'pending').length;
    const acceptedCount = attendanceRequests.data.filter(request => request.status === 'accepted').length;
    const rejectedCount = attendanceRequests.data.filter(request => request.status === 'rejected').length;

    return (
        <>
            <Head title={t("My Attendance Requests")} />
            <PageLoader isVisible={loading} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.attendance-requests" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 py-6 px-8 sticky top-0 z-30"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 p-4 rounded-2xl shadow-2xl">
                                        <FileText className="w-8 h-8 text-white" />
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1"
                                    >
                                        {t("My Attendance")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent"
                                    >
                                        {t("Justification Requests")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <User className="w-4 h-4" />
                                        {employee.first_name} {employee.last_name} - {employee.employee_id}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Button
                                    onClick={() => setShowFilters(!showFilters)}
                                    variant="outline"
                                    className="gap-2"
                                >
                                    <Filter className="h-4 w-4" />
                                    {t("Filters")}
                                </Button>

                                <Link href={route('admin.attendance-requests.create')}>
                                    <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                        <Plus className="h-4 w-4" />
                                        {t("New Request")}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Statistics Cards */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="p-8 pb-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                            <Card className="border-l-4 border-l-blue-500">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                {t("Total Requests")}
                                            </p>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                                {attendanceRequests.data.length}
                                            </p>
                                        </div>
                                        <FileText className="h-8 w-8 text-blue-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-yellow-500">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                {t("Pending")}
                                            </p>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                                {pendingCount}
                                            </p>
                                        </div>
                                        <Clock className="h-8 w-8 text-yellow-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-green-500">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                {t("Accepted")}
                                            </p>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                                {acceptedCount}
                                            </p>
                                        </div>
                                        <CheckCircle className="h-8 w-8 text-green-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-red-500">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                {t("Rejected")}
                                            </p>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                                {rejectedCount}
                                            </p>
                                        </div>
                                        <XCircle className="h-8 w-8 text-red-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>

                    {/* Filters */}
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 mx-8 rounded-lg mb-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t("Status")}</label>
                                    <Select
                                        value={localFilters.status}
                                        onValueChange={(value) => handleFilterChange('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("All Statuses")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">{t("All Statuses")}</SelectItem>
                                            <SelectItem value="pending">{t("Pending")}</SelectItem>
                                            <SelectItem value="accepted">{t("Accepted")}</SelectItem>
                                            <SelectItem value="rejected">{t("Rejected")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">{t("Type")}</label>
                                    <Select
                                        value={localFilters.type}
                                        onValueChange={(value) => handleFilterChange('type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("All Types")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">{t("All Types")}</SelectItem>
                                            <SelectItem value="late">{t("Late")}</SelectItem>
                                            <SelectItem value="absent">{t("Absent")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-4">
                                <Button variant="outline" onClick={clearFilters}>
                                    {t("Clear")}
                                </Button>
                                <Button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700">
                                    {t("Apply Filters")}
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto px-8 pb-8">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                        >
                            {attendanceRequests.data.length > 0 ? (
                                <Card className="shadow-lg">
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>{t("Track #")}</TableHead>
                                                    <TableHead>{t("Date")}</TableHead>
                                                    <TableHead>{t("Type")}</TableHead>
                                                    <TableHead>{t("Status")}</TableHead>
                                                    <TableHead>{t("Submitted")}</TableHead>
                                                    <TableHead>{t("Reviewed By")}</TableHead>
                                                    <TableHead>{t("Reason")}</TableHead>
                                                    <TableHead className="text-right">{t("Actions")}</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {attendanceRequests.data.map((request) => (
                                                    <TableRow key={request.id}>
                                                        <TableCell>
                                                            <div className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                                #{request.track_number}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4 text-slate-500" />
                                                                {formatDate(request.date)}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{getTypeBadge(request.type)}</TableCell>
                                                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                                                        <TableCell>
                                                            <div className="text-sm text-slate-600">
                                                                {formatDateTime(request.created_at)}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {request.reviewer ? (
                                                                <div className="text-sm">
                                                                    <div className="font-medium">{request.reviewer.name}</div>
                                                                    <div className="text-slate-500">
                                                                        {formatDateTime(request.reviewed_at)}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <span className="text-slate-400">-</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="max-w-xs truncate" title={request.reason}>
                                                                {request.reason}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Link href={route('admin.attendance-requests.show', request.id)}>
                                                                <Button size="sm" variant="outline" className="gap-1">
                                                                    <Eye className="h-4 w-4" />
                                                                    {t("View")}
                                                                </Button>
                                                            </Link>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="shadow-lg">
                                    <CardContent className="text-center py-12">
                                        <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
                                            {t("No Requests Submitted")}
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-500 mb-4">
                                            {t("You haven't submitted any attendance justification requests yet.")}
                                        </p>
                                        <Link href={route('admin.attendance-requests.create')}>
                                            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                                <Plus className="h-4 w-4" />
                                                {t("Submit Your First Request")}
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Pagination */}
                            {attendanceRequests.links.length > 3 && (
                                <div className="mt-6 flex justify-center">
                                    <div className="flex space-x-1">
                                        {attendanceRequests.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-4 py-2 text-sm border rounded-lg transition-colors ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </main>
                </div>
            </motion.div>
        </>
    );
} 