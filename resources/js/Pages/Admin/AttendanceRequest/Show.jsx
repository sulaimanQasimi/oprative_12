import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Check,
    X,
    User,
    Calendar,
    Clock,
    FileText,
    AlertCircle,
    CheckCircle,
    XCircle,
    MessageSquare,
    Eye,
    UserCheck,
    Building,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Show({ auth, attendanceRequest, permissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [rejectComments, setRejectComments] = useState('');

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    const handleApprove = () => {
        if (confirm(t("Are you sure you want to approve this request?"))) {
            router.patch(route('admin.attendance-requests.approve', attendanceRequest.id));
        }
    };

    const handleReject = () => {
        if (rejectComments.trim().length < 5) {
            alert(t("Please provide a detailed reason for rejection (at least 5 characters)."));
            return;
        }

        if (confirm(t("Are you sure you want to reject this request?"))) {
            router.patch(route('admin.attendance-requests.reject', attendanceRequest.id), {
                comments: rejectComments.trim()
            }, {
                onSuccess: () => {
                    setShowRejectForm(false);
                    setRejectComments('');
                },
            });
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
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
            <Badge className={`${config.color} flex items-center gap-2 px-4 py-2 text-base`}>
                <Icon className="w-4 h-4" />
                {t(status.charAt(0).toUpperCase() + status.slice(1))}
            </Badge>
        );
    };

    const getTypeBadge = (type) => {
        const typeConfig = {
            late: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300', icon: Clock },
            absent: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', icon: XCircle },
        };
        const config = typeConfig[type] || typeConfig.absent;
        const Icon = config.icon;
        
        return (
            <Badge className={`${config.color} flex items-center gap-2 px-4 py-2 text-base`}>
                <Icon className="w-4 h-4" />
                {t(type.charAt(0).toUpperCase() + type.slice(1))}
            </Badge>
        );
    };

    return (
        <>
            <Head title={`${attendanceRequest.employee.first_name} ${attendanceRequest.employee.last_name} - ${t("Attendance Request")}`} />
            <PageLoader isVisible={loading} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
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
                                    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 p-4 rounded-2xl shadow-2xl">
                                        <Eye className="w-8 h-8 text-white" />
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1"
                                    >
                                        {t("Request Details")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent"
                                    >
                                        {attendanceRequest.employee.first_name} {attendanceRequest.employee.last_name}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <FileText className="w-4 h-4" />
                                        {t("Attendance justification request")}
                                    </motion.p>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.7, duration: 0.4 }}
                                        className="text-lg font-mono font-semibold text-blue-600 dark:text-blue-400 mt-2"
                                    >
                                        Track #: {attendanceRequest.track_number}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Link href={route("admin.attendance-requests.index")}>
                                    <Button variant="outline" className="gap-2">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Requests")}
                                    </Button>
                                </Link>

                                {attendanceRequest.status === 'pending' && (
                                    <>
                                        {permissions.approve_attendance_request && (
                                            <Button
                                                onClick={handleApprove}
                                                className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                <Check className="h-4 w-4" />
                                                {t("Approve")}
                                            </Button>
                                        )}

                                        {permissions.reject_attendance_request && (
                                            <Button
                                                onClick={() => setShowRejectForm(true)}
                                                variant="destructive"
                                                className="gap-2"
                                            >
                                                <X className="h-4 w-4" />
                                                {t("Reject")}
                                            </Button>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto p-8">
                        <div className="max-w-6xl mx-auto space-y-8">
                            {/* Quick Status Overview */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                            >
                                <Card className="border-l-4 border-l-blue-500">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                                    {t("Request Date")}
                                                </p>
                                                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                                    {formatDate(attendanceRequest.date)}
                                                </p>
                                            </div>
                                            <Calendar className="h-8 w-8 text-blue-500" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-l-4 border-l-purple-500">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                                    {t("Request Type")}
                                                </p>
                                                <div className="mt-2">
                                                    {getTypeBadge(attendanceRequest.type)}
                                                </div>
                                            </div>
                                            <FileText className="h-8 w-8 text-purple-500" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-l-4 border-l-green-500">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                                    {t("Status")}
                                                </p>
                                                <div className="mt-2">
                                                    {getStatusBadge(attendanceRequest.status)}
                                                </div>
                                            </div>
                                            <UserCheck className="h-8 w-8 text-green-500" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Employee Information */}
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.9, duration: 0.5 }}
                                >
                                    <Card className="shadow-lg h-full">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-3">
                                                <User className="h-6 w-6 text-blue-600" />
                                                {t("Employee Information")}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                                    <User className="h-8 w-8 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">
                                                        {attendanceRequest.employee.first_name} {attendanceRequest.employee.last_name}
                                                    </h3>
                                                    <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                                        <p>ID: {attendanceRequest.employee.employee_id}</p>
                                                        <p>Email: {attendanceRequest.employee.email}</p>
                                                        <p>Department: {attendanceRequest.employee.department}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Request Timeline */}
                                <motion.div
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 1.0, duration: 0.5 }}
                                >
                                    <Card className="shadow-lg h-full">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-3">
                                                <Clock className="h-6 w-6 text-purple-600" />
                                                {t("Request Timeline")}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-4">
                                                <div className="flex items-start space-x-3">
                                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                        <FileText className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{t("Request Submitted")}</p>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                                            {formatDateTime(attendanceRequest.created_at)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {attendanceRequest.reviewed_at && (
                                                    <div className="flex items-start space-x-3">
                                                        <div className={`p-2 rounded-lg ${
                                                            attendanceRequest.status === 'accepted' 
                                                                ? 'bg-green-100 dark:bg-green-900/30' 
                                                                : 'bg-red-100 dark:bg-red-900/30'
                                                        }`}>
                                                            {attendanceRequest.status === 'accepted' ? (
                                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                            ) : (
                                                                <XCircle className="h-4 w-4 text-red-600" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">
                                                                {attendanceRequest.status === 'accepted' 
                                                                    ? t("Request Approved") 
                                                                    : t("Request Rejected")
                                                                }
                                                            </p>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                {formatDateTime(attendanceRequest.reviewed_at)}
                                                            </p>
                                                            {attendanceRequest.reviewer && (
                                                                <p className="text-sm text-slate-500">
                                                                    {t("by")} {attendanceRequest.reviewer.name}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>

                            {/* Request Details */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.1, duration: 0.5 }}
                            >
                                <Card className="shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3">
                                            <MessageSquare className="h-6 w-6 text-green-600" />
                                            {t("Justification Reason")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6">
                                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                                {attendanceRequest.reason}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Reject Form Modal */}
                            {showRejectForm && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                                    onClick={() => setShowRejectForm(false)}
                                >
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <X className="h-5 w-5 text-red-500" />
                                            {t("Reject Request")}
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="rejectComments">
                                                    {t("Reason for rejection")} *
                                                </Label>
                                                <Textarea
                                                    id="rejectComments"
                                                    value={rejectComments}
                                                    onChange={(e) => setRejectComments(e.target.value)}
                                                    className="mt-2"
                                                    rows={4}
                                                    placeholder={t("Please provide a detailed reason for rejecting this request...")}
                                                />
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {t("Minimum 5 characters required")}
                                                </p>
                                            </div>
                                            <div className="flex justify-end space-x-3">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setShowRejectForm(false)}
                                                >
                                                    {t("Cancel")}
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={handleReject}
                                                    disabled={rejectComments.trim().length < 5}
                                                >
                                                    {t("Reject Request")}
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
} 