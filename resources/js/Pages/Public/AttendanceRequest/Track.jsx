import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import moment from 'moment-jalaali';
import axios from 'axios';
import {
    Search,
    FileText,
    Calendar,
    Clock,
    User,
    Building,
    CheckCircle,
    XCircle,
    AlertCircle,
    Hash,
    Eye,
    Info,
    ArrowLeft,
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Badge } from '@/Components/ui/badge';

export default function Track() {
    const [trackNumber, setTrackNumber] = useState('');
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Helper function to format Jalali dates
    const formatJalaliDate = (date) => {
        return moment(date).format('jYYYY/jMM/jDD');
    };

    const formatJalaliDateTime = (date) => {
        return moment(date).format('jYYYY/jMM/jDD - HH:mm');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!trackNumber.trim()) {
            setError('Please enter a track number');
            return;
        }

        setLoading(true);
        setError('');
        setRequest(null);

        try {
            const response = await axios.post('/attendance-request/track', {
                track_number: trackNumber
            });
            
            setRequest(response.data.request);
        } catch (error) {
            if (error.response?.status === 404) {
                setError(error.response.data.error);
            } else {
                setError('An error occurred while tracking your request');
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
                icon: Clock,
                label: 'در انتظار بررسی'
            },
            accepted: {
                color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
                icon: CheckCircle,
                label: 'تأیید شده'
            },
            rejected: {
                color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
                icon: XCircle,
                label: 'رد شده'
            }
        };
        return configs[status] || configs.pending;
    };

    const getTypeConfig = (type) => {
        const configs = {
            late: {
                color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
                icon: Clock,
                label: 'تأخیر'
            },
            absent: {
                color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
                icon: AlertCircle,
                label: 'غیبت'
            }
        };
        return configs[type] || configs.late;
    };

    return (
        <>
            <Head title="Track Attendance Request" />
            
            <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-8"
                    >
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <div className="absolute -inset-2 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 rounded-full blur-lg opacity-60"></div>
                                <div className="relative bg-gradient-to-br from-teal-500 via-blue-500 to-purple-600 p-4 rounded-full shadow-2xl">
                                    <Search className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 via-blue-600 to-purple-700 bg-clip-text text-transparent mb-2">
                            پیگیری درخواست
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            وضعیت درخواست توجیه حضور خود را پیگیری کنید
                        </p>
                    </motion.div>

                    {/* Search Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl mb-8">
                            <CardHeader className="text-center pb-2">
                                <CardTitle className="flex items-center justify-center gap-3 text-xl">
                                    <div className="p-2 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg">
                                        <Hash className="h-5 w-5 text-white" />
                                    </div>
                                    شماره پیگیری
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="track_number" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            شماره پیگیری ۶ رقمی *
                                        </Label>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                            <Input
                                                id="track_number"
                                                type="text"
                                                value={trackNumber}
                                                onChange={(e) => setTrackNumber(e.target.value)}
                                                className="pl-12 h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-teal-500 rounded-lg text-center text-lg font-mono"
                                                placeholder="123456"
                                                maxLength={6}
                                                required
                                            />
                                        </div>
                                        {error && (
                                            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                                                <AlertCircle className="h-4 w-4 text-red-600" />
                                                <AlertDescription className="text-red-700 dark:text-red-300">
                                                    {error}
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading || trackNumber.length !== 6}
                                        className="w-full h-12 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                در حال جستجو...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Search className="w-4 h-4" />
                                                پیگیری درخواست
                                            </div>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Request Details */}
                    {request && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                                    <CardTitle className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg">
                                                <FileText className="h-5 w-5 text-white" />
                                            </div>
                                            جزئیات درخواست
                                        </div>
                                        <div className="font-mono text-lg font-bold text-teal-600">
                                            #{request.track_number}
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-6">
                                    {/* Status */}
                                    <div className="flex items-center justify-center">
                                        {(() => {
                                            const statusConfig = getStatusConfig(request.status);
                                            const StatusIcon = statusConfig.icon;
                                            return (
                                                <Badge className={`${statusConfig.color} px-4 py-2 text-lg font-medium`}>
                                                    <StatusIcon className="w-5 h-5 mr-2" />
                                                    {statusConfig.label}
                                                </Badge>
                                            );
                                        })()}
                                    </div>

                                    {/* Employee Info */}
                                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 rounded-xl p-4">
                                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                                            <User className="w-5 h-5" />
                                            اطلاعات کارمند
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-slate-600 dark:text-slate-400">شماره پرسنلی:</span>
                                                <span className="font-mono font-bold">{request.employee.employee_id}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-slate-600 dark:text-slate-400">نام:</span>
                                                <span>{request.employee.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Building className="w-4 h-4 text-slate-500" />
                                                <span className="font-medium text-slate-600 dark:text-slate-400">بخش:</span>
                                                <span>{request.employee.department}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Request Details */}
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    تاریخ
                                                </label>
                                                <div className="font-semibold text-lg">{formatJalaliDate(request.date)}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">نوع درخواست</label>
                                                <div>
                                                    {(() => {
                                                        const typeConfig = getTypeConfig(request.type);
                                                        const TypeIcon = typeConfig.icon;
                                                        return (
                                                            <Badge className={typeConfig.color}>
                                                                <TypeIcon className="w-4 h-4 mr-1" />
                                                                {typeConfig.label}
                                                            </Badge>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">دلیل توجیه</label>
                                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm">
                                                {request.reason}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                                            <Clock className="w-5 h-5" />
                                            تاریخچه درخواست
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium">درخواست ارسال شد</div>
                                                    <div className="text-xs text-slate-500">{formatJalaliDateTime(request.submitted_at)}</div>
                                                </div>
                                            </div>
                                            
                                            {request.reviewed_at && (
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${request.status === 'accepted' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium">
                                                            {request.status === 'accepted' ? 'درخواست تأیید شد' : 'درخواست رد شد'}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {formatJalaliDateTime(request.reviewed_at)} 
                                                            {request.reviewer && ` توسط ${request.reviewer}`}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Instructions */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-8"
                    >
                        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                            <Info className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-blue-700 dark:text-blue-300">
                                <strong>راهنمای پیگیری:</strong>
                                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                                    <li>شماره پیگیری ۶ رقمی خود را در فیلد بالا وارد کنید</li>
                                    <li>وضعیت درخواست شما به‌روزرسانی خودکار می‌شود</li>
                                    <li>در صورت تأیید، حضور شما اصلاح خواهد شد</li>
                                    <li>برای سوالات بیشتر با واحد منابع انسانی تماس بگیرید</li>
                                </ul>
                            </AlertDescription>
                        </Alert>
                    </motion.div>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-center mt-8"
                    >
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            سیستم مدیریت حضور و غیاب | تمامی حقوق محفوظ است
                        </p>
                    </motion.div>
                </div>
            </div>
        </>
    );
} 