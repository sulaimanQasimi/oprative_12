import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import moment from 'moment-jalaali';
import {
    Calendar,
    Clock,
    FileText,
    Filter,
    Search,
    Check,
    X,
    Eye,
    User,
    Hash,
    ChevronDown,
} from 'lucide-react';
import Navigation from '@/Components/Admin/Navigation';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import PageLoader from '@/Components/Admin/PageLoader';

export default function AttendanceRequestIndex({ 
    auth, 
    attendanceRequests, 
    filters, 
    permissions 
}) {
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [selectedRequests, setSelectedRequests] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);

    const { data, setData, get } = useForm({
        status: filters.status || '',
        type: filters.type || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        employee_search: filters.employee_search || '',
    });

    useEffect(() => {
        setLoading(false);
        setTimeout(() => setIsAnimated(true), 100);
        fetchPendingCount();
    }, []);

    const fetchPendingCount = async () => {
        try {
            const response = await fetch('/adminpanel/attendance-requests/api/pending-count');
            const result = await response.json();
            setPendingCount(result.count);
        } catch (error) {
            console.error('Error fetching pending count:', error);
        }
    };

    const handleFilter = () => {
        get(route('admin.attendance-requests.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleBulkAction = (action) => {
        if (selectedRequests.length === 0) {
            alert('Please select requests first');
            return;
        }

        const endpoint = action === 'approve' 
            ? route('admin.attendance-requests.bulk-approve')
            : route('admin.attendance-requests.bulk-reject');

        router.post(endpoint, {
            request_ids: selectedRequests,
            comments: action === 'reject' ? 'Bulk rejection' : null,
        }, {
            onSuccess: () => {
                setSelectedRequests([]);
                fetchPendingCount();
            }
        });
    };

    const toggleSelectAll = () => {
        if (selectedRequests.length === attendanceRequests.data.length) {
            setSelectedRequests([]);
        } else {
            setSelectedRequests(attendanceRequests.data.map(req => req.id));
        }
    };

    const toggleSelectRequest = (requestId) => {
        setSelectedRequests(prev => 
            prev.includes(requestId) 
                ? prev.filter(id => id !== requestId)
                : [...prev, requestId]
        );
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', label: 'Pending' },
            accepted: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', label: 'Approved' },
            rejected: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', label: 'Rejected' },
        };
        const config = statusConfig[status] || statusConfig.pending;
        return <Badge className={config.color}>{config.label}</Badge>;
    };

    const getTypeBadge = (type) => {
        const typeConfig = {
            late: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300', label: 'Late' },
            absent: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', label: 'Absent' },
        };
        const config = typeConfig[type] || typeConfig.absent;
        return <Badge className={config.color}>{config.label}</Badge>;
    };

    // Helper function to format Jalali dates
    const formatJalaliDate = (date, format = 'jYYYY/jMM/jDD') => {
        return moment(date).format(format);
    };

    const formatJalaliDateTime = (date) => {
        return moment(date).format('jYYYY/jMM/jDD HH:mm');
    };

    return (
        <>
            <Head title="Attendance Requests Management" />
            
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
                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 py-6 px-8 sticky top-0 z-30"
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
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent"
                                    >
                                        Attendance Requests
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <User className="w-4 h-4" />
                                        Review and manage employee attendance justifications
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                {pendingCount > 0 && (
                                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 px-3 py-1">
                                        {pendingCount} Pending
                                    </Badge>
                                )}
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto p-8">
                        <div className="max-w-7xl mx-auto space-y-6">
                            {/* Filters */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                            >
                                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Filter className="w-5 h-5" />
                                            Filters
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                            <div>
                                                <Select 
                                                    value={data.status} 
                                                    onValueChange={(value) => setData('status', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="All Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="">All Status</SelectItem>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="accepted">Approved</SelectItem>
                                                        <SelectItem value="rejected">Rejected</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Select 
                                                    value={data.type} 
                                                    onValueChange={(value) => setData('type', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="All Types" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="">All Types</SelectItem>
                                                        <SelectItem value="late">Late</SelectItem>
                                                        <SelectItem value="absent">Absent</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Input
                                                    type="date"
                                                    value={data.date_from}
                                                    onChange={(e) => setData('date_from', e.target.value)}
                                                    placeholder="From Date"
                                                />
                                            </div>

                                            <div>
                                                <Input
                                                    type="date"
                                                    value={data.date_to}
                                                    onChange={(e) => setData('date_to', e.target.value)}
                                                    placeholder="To Date"
                                                />
                                            </div>

                                            <div>
                                                <Input
                                                    type="text"
                                                    value={data.employee_search}
                                                    onChange={(e) => setData('employee_search', e.target.value)}
                                                    placeholder="Search employee..."
                                                    className="pr-10"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            <Button onClick={handleFilter} className="gap-2">
                                                <Search className="w-4 h-4" />
                                                Apply Filters
                                            </Button>

                                            {selectedRequests.length > 0 && permissions.approve_attendance_request && (
                                                <div className="flex space-x-2">
                                                    <Button 
                                                        variant="outline"
                                                        onClick={() => handleBulkAction('approve')}
                                                        className="gap-2 text-green-600 border-green-300 hover:bg-green-50"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        Approve Selected ({selectedRequests.length})
                                                    </Button>
                                                    <Button 
                                                        variant="outline"
                                                        onClick={() => handleBulkAction('reject')}
                                                        className="gap-2 text-red-600 border-red-300 hover:bg-red-50"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Reject Selected ({selectedRequests.length})
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Requests Table */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                            >
                                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-slate-50 dark:bg-slate-700">
                                                    <tr>
                                                        <th className="p-4 text-left">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedRequests.length === attendanceRequests.data.length}
                                                                onChange={toggleSelectAll}
                                                                className="rounded border-gray-300"
                                                            />
                                                        </th>
                                                        <th className="p-4 text-left font-semibold text-slate-600 dark:text-slate-300">
                                                            <div className="flex items-center gap-2">
                                                                <Hash className="w-4 h-4" />
                                                                Track #
                                                            </div>
                                                        </th>
                                                        <th className="p-4 text-left font-semibold text-slate-600 dark:text-slate-300">
                                                            <div className="flex items-center gap-2">
                                                                <User className="w-4 h-4" />
                                                                Employee
                                                            </div>
                                                        </th>
                                                        <th className="p-4 text-left font-semibold text-slate-600 dark:text-slate-300">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4" />
                                                                Date
                                                            </div>
                                                        </th>
                                                        <th className="p-4 text-left font-semibold text-slate-600 dark:text-slate-300">Type</th>
                                                        <th className="p-4 text-left font-semibold text-slate-600 dark:text-slate-300">Status</th>
                                                        <th className="p-4 text-left font-semibold text-slate-600 dark:text-slate-300">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-4 h-4" />
                                                                Submitted
                                                            </div>
                                                        </th>
                                                        <th className="p-4 text-center font-semibold text-slate-600 dark:text-slate-300">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {attendanceRequests.data.map((request, index) => (
                                                        <motion.tr
                                                            key={request.id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.9 + (index * 0.05), duration: 0.3 }}
                                                            className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                                                        >
                                                            <td className="p-4">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedRequests.includes(request.id)}
                                                                    onChange={() => toggleSelectRequest(request.id)}
                                                                    className="rounded border-gray-300"
                                                                />
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                                    #{request.track_number}
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                                        {request.employee.first_name.charAt(0)}{request.employee.last_name.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                                                                            {request.employee.first_name} {request.employee.last_name}
                                                                        </div>
                                                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                                                            ID: {request.employee.employee_id}
                                                                        </div>
                                                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                                                            {request.employee.department}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                                    {formatJalaliDate(request.date)}
                                                                </div>
                                                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                                                    {moment(request.date).format('dddd')}
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                {getTypeBadge(request.type)}
                                                            </td>
                                                            <td className="p-4">
                                                                {getStatusBadge(request.status)}
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                                                    {formatJalaliDateTime(request.created_at)}
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="flex justify-center">
                                                                    <Link href={route('admin.attendance-requests.show', request.id)}>
                                                                        <Button size="sm" variant="outline" className="gap-2">
                                                                            <Eye className="w-4 h-4" />
                                                                            View
                                                                        </Button>
                                                                    </Link>
                                                                </div>
                                                            </td>
                                                        </motion.tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Pagination */}
                                        {attendanceRequests.last_page > 1 && (
                                            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm text-slate-600 dark:text-slate-400">
                                                        Showing {attendanceRequests.from} to {attendanceRequests.to} of {attendanceRequests.total} results
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        {attendanceRequests.links.map((link, index) => (
                                                            <Link
                                                                key={index}
                                                                href={link.url}
                                                                className={`px-3 py-2 text-sm rounded-lg ${
                                                                    link.active 
                                                                        ? 'bg-blue-500 text-white' 
                                                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                                                                }`}
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                            />
                                                        ))}
                                                    </div>
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