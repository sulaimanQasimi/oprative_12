import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function PublicAttendanceRequestTrack() {
    const [trackNumber, setTrackNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [requestData, setRequestData] = useState(null);
    const [error, setError] = useState('');

    const handleTrackNumberChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setTrackNumber(value);
        setError('');
        setRequestData(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (trackNumber.length !== 6) {
            setError('Please enter a valid 6-digit track number');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/attendance-request/track', {
                track_number: trackNumber
            });

            if (response.data.success) {
                setRequestData(response.data.request);
                setError('');
            }
        } catch (err) {
            if (err.response?.status === 404) {
                setError('Track number not found. Please check your track number and try again.');
            } else {
                setError('An error occurred while tracking your request. Please try again.');
            }
            setRequestData(null);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'text-yellow-300 bg-yellow-500/20 border-yellow-400/30';
            case 'accepted':
                return 'text-green-300 bg-green-500/20 border-green-400/30';
            case 'rejected':
                return 'text-red-300 bg-red-500/20 border-red-400/30';
            default:
                return 'text-gray-300 bg-gray-500/20 border-gray-400/30';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'accepted':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'rejected':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Head title="Track Attendance Request" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                {/* Background Animation */}
                <div className="fixed inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                </div>

                {/* Navigation */}
                <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 fixed w-full z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-20">
                            <div className="flex items-center">
                                <a href="/" className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-2xl font-bold text-white">Track Request</span>
                                </a>
                            </div>
                            <div className="flex items-center space-x-4">
                                <a 
                                    href="/attendance-request" 
                                    className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
                                >
                                    Submit Request
                                </a>
                                <a 
                                    href="/" 
                                    className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-200 hover:bg-blue-500/30 transition-all duration-300"
                                >
                                    Home
                                </a>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Track Your Request
                            </h1>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                Enter your 6-digit tracking number to check the status of your attendance request
                            </p>
                        </motion.div>

                        {/* Tracking Form */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl mb-8"
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="text-center">
                                    <label className="block text-white font-semibold mb-4 text-lg">
                                        Enter Your Tracking Number
                                    </label>
                                    <div className="max-w-md mx-auto">
                                        <input
                                            type="text"
                                            value={trackNumber}
                                            onChange={handleTrackNumberChange}
                                            className="w-full px-6 py-4 bg-white/10 border border-white/30 rounded-xl text-white text-center text-2xl font-mono tracking-widest placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300"
                                            placeholder="000000"
                                            maxLength="6"
                                            required
                                        />
                                        <p className="text-gray-400 text-sm mt-2">
                                            6-digit number provided when you submitted your request
                                        </p>
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-red-500/10 border border-red-400/30 rounded-xl p-4 text-center"
                                    >
                                        <p className="text-red-400">{error}</p>
                                    </motion.div>
                                )}

                                <div className="flex justify-center">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading || trackNumber.length !== 6}
                                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Tracking...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                                <span>Track Request</span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>

                        {/* Request Details */}
                        {requestData && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold text-white">Request Details</h2>
                                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border ${getStatusColor(requestData.status)}`}>
                                        {getStatusIcon(requestData.status)}
                                        <span className="font-semibold capitalize">
                                            {requestData.status === 'accepted' ? 'Approved' : 
                                             requestData.status === 'rejected' ? 'Rejected' : 
                                             'Pending Review'}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Employee Information */}
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-4">Employee Information</h3>
                                            <div className="space-y-3">
                                                <div>
                                                    <span className="text-gray-400 text-sm">Name</span>
                                                    <div className="text-white font-medium">{requestData.employee.name}</div>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400 text-sm">Employee ID</span>
                                                    <div className="text-white font-medium">{requestData.employee.employee_id}</div>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400 text-sm">Department</span>
                                                    <div className="text-white font-medium">{requestData.employee.department}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Request Information */}
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-4">Request Information</h3>
                                            <div className="space-y-3">
                                                <div>
                                                    <span className="text-gray-400 text-sm">Date</span>
                                                    <div className="text-white font-medium">
                                                        {new Date(requestData.date).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400 text-sm">Type</span>
                                                    <div className="text-white font-medium capitalize">
                                                        {requestData.type === 'late' ? 'Late Arrival' : 'Absent'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400 text-sm">Submitted</span>
                                                    <div className="text-white font-medium">
                                                        {new Date(requestData.submitted_at).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Reason */}
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold text-white mb-4">Reason</h3>
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                        <p className="text-gray-200 leading-relaxed">{requestData.reason}</p>
                                    </div>
                                </div>

                                {/* Review Information */}
                                {requestData.reviewed_at && (
                                    <div className="mt-8">
                                        <h3 className="text-lg font-semibold text-white mb-4">Review Information</h3>
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="text-gray-400 text-sm">Reviewed by</span>
                                                    <div className="text-white font-medium">{requestData.reviewer || 'Manager'}</div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-gray-400 text-sm">Reviewed on</span>
                                                    <div className="text-white font-medium">
                                                        {new Date(requestData.reviewed_at).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Timeline */}
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold text-white mb-4">Timeline</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                            <div>
                                                <div className="text-white font-medium">Request Submitted</div>
                                                <div className="text-gray-400 text-sm">
                                                    {new Date(requestData.submitted_at).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {requestData.reviewed_at ? (
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-3 h-3 rounded-full ${
                                                    requestData.status === 'accepted' ? 'bg-green-500' : 'bg-red-500'
                                                }`}></div>
                                                <div>
                                                    <div className="text-white font-medium">
                                                        Request {requestData.status === 'accepted' ? 'Approved' : 'Rejected'}
                                                    </div>
                                                    <div className="text-gray-400 text-sm">
                                                        {new Date(requestData.reviewed_at).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-4">
                                                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                                                <div>
                                                    <div className="text-white font-medium">Under Review</div>
                                                    <div className="text-gray-400 text-sm">Waiting for manager approval</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Help Section */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mt-8"
                        >
                            <h3 className="text-white font-semibold mb-3">Need Help?</h3>
                            <p className="text-gray-300 text-sm mb-4">
                                If you've lost your tracking number or need assistance, please contact your manager or HR department.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a
                                    href="/attendance-request"
                                    className="px-6 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all duration-300 text-center"
                                >
                                    Submit New Request
                                </a>
                                <a
                                    href="/"
                                    className="px-6 py-2 bg-gray-500/20 text-gray-300 rounded-lg hover:bg-gray-500/30 transition-all duration-300 text-center"
                                >
                                    Back to Home
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
} 