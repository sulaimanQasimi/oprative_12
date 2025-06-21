import React from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function PublicAttendanceRequestSuccess({ attendanceRequest }) {
    const copyTrackNumber = () => {
        navigator.clipboard.writeText(attendanceRequest.track_number);
        // You could add a toast notification here
    };

    return (
        <>
            <Head title="Request Submitted Successfully" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                {/* Background Animation */}
                <div className="fixed inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
                </div>

                {/* Navigation */}
                <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 fixed w-full z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-20">
                            <div className="flex items-center">
                                <a href="/" className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-2xl font-bold text-white">Request Submitted</span>
                                </a>
                            </div>
                            <div className="flex items-center space-x-4">
                                <a 
                                    href="/attendance-request/track" 
                                    className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
                                >
                                    Track Request
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
                        {/* Success Animation */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                                type: "spring",
                                stiffness: 200,
                                damping: 20,
                                duration: 0.6 
                            }}
                            className="text-center mb-12"
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                <motion.svg 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3, duration: 0.4 }}
                                    className="w-12 h-12 text-white" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </motion.svg>
                            </div>
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="text-4xl md:text-5xl font-bold text-white mb-4"
                            >
                                Request Submitted Successfully!
                            </motion.h1>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="text-xl text-gray-300"
                            >
                                Your attendance justification request has been submitted for review
                            </motion.p>
                        </motion.div>

                        {/* Track Number Section */}
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl mb-8"
                        >
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-white mb-6">Your Tracking Number</h2>
                                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-400/30">
                                    <div className="flex items-center justify-center space-x-4">
                                        <div className="text-4xl font-mono font-bold text-blue-300 tracking-wider">
                                            {attendanceRequest.track_number}
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={copyTrackNumber}
                                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all duration-300 group"
                                            title="Copy to clipboard"
                                        >
                                            <svg className="w-5 h-5 text-blue-300 group-hover:text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </motion.button>
                                    </div>
                                    <p className="text-blue-200 text-sm mt-3">
                                        Save this number to track your request status
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Request Summary */}
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl mb-8"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">Request Summary</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-gray-400 text-sm">Employee</span>
                                        <div className="text-white font-semibold">{attendanceRequest.employee.full_name}</div>
                                        <div className="text-gray-300 text-sm">ID: {attendanceRequest.employee.employee_id}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-sm">Department</span>
                                        <div className="text-white font-semibold">{attendanceRequest.employee.department}</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-gray-400 text-sm">Date</span>
                                        <div className="text-white font-semibold">
                                            {new Date(attendanceRequest.date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-sm">Request Type</span>
                                        <div className="text-white font-semibold capitalize">
                                            {attendanceRequest.type === 'late' ? 'Late Arrival' : 'Absent'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6">
                                <span className="text-gray-400 text-sm">Status</span>
                                <div className="flex items-center space-x-2 mt-1">
                                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                                    <span className="text-yellow-300 font-semibold">Pending Review</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Next Steps */}
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">What Happens Next?</h2>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-4">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-white text-sm font-bold">1</span>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">Manager Review</h3>
                                        <p className="text-gray-300 text-sm">Your manager will review your request and the provided justification</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-white text-sm font-bold">2</span>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">Decision</h3>
                                        <p className="text-gray-300 text-sm">Your request will be approved or rejected with feedback</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-white text-sm font-bold">3</span>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">Track Status</h3>
                                        <p className="text-gray-300 text-sm">Use your tracking number to check the status anytime</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.9, duration: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
                        >
                            <a
                                href="/attendance-request/track"
                                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 text-center"
                            >
                                Track Your Request
                            </a>
                            <a
                                href="/attendance-request"
                                className="px-8 py-4 bg-white/10 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transform hover:scale-105 transition-all duration-300 text-center"
                            >
                                Submit Another Request
                            </a>
                            <a
                                href="/"
                                className="px-8 py-4 bg-gray-600/30 border border-gray-500/30 text-gray-200 font-semibold rounded-xl hover:bg-gray-600/40 transform hover:scale-105 transition-all duration-300 text-center"
                            >
                                Return to Home
                            </a>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
} 