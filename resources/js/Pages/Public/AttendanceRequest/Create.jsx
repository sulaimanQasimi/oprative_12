import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function PublicAttendanceRequestCreate() {
    const [employee, setEmployee] = useState(null);
    const [loadingEmployee, setLoadingEmployee] = useState(false);
    const [employeeError, setEmployeeError] = useState('');
    
    const { data, setData, post, processing, errors, reset } = useForm({
        employee_id: '',
        date: '',
        type: 'absent',
        reason: '',
    });

    // Auto-set today's date as default
    useEffect(() => {
        setData('date', new Date().toISOString().split('T')[0]);
    }, []);

    const handleEmployeeIdChange = async (e) => {
        const employeeId = e.target.value;
        setData('employee_id', employeeId);
        setEmployee(null);
        setEmployeeError('');

        if (employeeId.length >= 3) {
            setLoadingEmployee(true);
            try {
                const response = await axios.post('/attendance-request/employee-info', {
                    employee_id: employeeId
                });
                
                if (response.data.success) {
                    setEmployee(response.data.employee);
                    setEmployeeError('');
                } else {
                    setEmployee(null);
                    setEmployeeError('Employee not found');
                }
            } catch (error) {
                setEmployee(null);
                if (error.response?.status === 404) {
                    console.log(error);
                    setEmployeeError('Employee not found with this ID');
                } else {
                    setEmployeeError('Error checking employee ID');
                }
            } finally {
                setLoadingEmployee(false);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!employee) {
            setEmployeeError('Please enter a valid Employee ID first');
            return;
        }
        post('/attendance-request');
    };

    return (
        <>
            <Head title="Attendance Justification Request" />
            
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
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-2xl font-bold text-white">Attendance Request</span>
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
                        {/* Header */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Attendance Justification Request
                            </h1>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                Submit your attendance justification request by providing your employee ID and details
                            </p>
                        </motion.div>

                        {/* Form */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
                        >
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Employee ID Section */}
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-white mb-6">Employee Information</h2>
                                    
                                    <div>
                                        <label className="block text-white font-semibold mb-3">
                                            Employee ID <span className="text-red-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={data.employee_id}
                                                onChange={handleEmployeeIdChange}
                                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300"
                                                placeholder="Enter your Employee ID"
                                                required
                                            />
                                            {loadingEmployee && (
                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                    <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                        </div>
                                        {employeeError && (
                                            <p className="text-red-400 text-sm mt-2">{employeeError}</p>
                                        )}
                                        {errors.employee_id && (
                                            <p className="text-red-400 text-sm mt-2">{errors.employee_id}</p>
                                        )}
                                    </div>

                                    {/* Employee Details Display */}
                                    {employee && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            transition={{ duration: 0.4 }}
                                            className="bg-green-500/10 border border-green-400/30 rounded-xl p-4"
                                        >
                                            <div className="flex items-center space-x-3 mb-3">
                                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-green-300 font-semibold">Employee Found</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-400">Name:</span>
                                                    <span className="text-white ml-2 font-medium">{employee.name}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Department:</span>
                                                    <span className="text-white ml-2 font-medium">{employee.department}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Email:</span>
                                                    <span className="text-white ml-2 font-medium">{employee.email}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Request Details Section */}
                                {employee && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="space-y-6"
                                    >
                                        <h2 className="text-2xl font-bold text-white mb-6">Request Details</h2>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Date */}
                                            <div>
                                                <label className="block text-white font-semibold mb-3">
                                                    Date <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    value={data.date}
                                                    onChange={(e) => setData('date', e.target.value)}
                                                    max={new Date().toISOString().split('T')[0]}
                                                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300"
                                                    required
                                                />
                                                {errors.date && (
                                                    <p className="text-red-400 text-sm mt-2">{errors.date}</p>
                                                )}
                                            </div>

                                            {/* Type */}
                                            <div>
                                                <label className="block text-white font-semibold mb-3">
                                                    Request Type <span className="text-red-400">*</span>
                                                </label>
                                                <select
                                                    value={data.type}
                                                    onChange={(e) => setData('type', e.target.value)}
                                                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300"
                                                    required
                                                >
                                                    <option value="absent" className="bg-gray-800">Absent</option>
                                                    <option value="late" className="bg-gray-800">Late Arrival</option>
                                                </select>
                                                {errors.type && (
                                                    <p className="text-red-400 text-sm mt-2">{errors.type}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Reason */}
                                        <div>
                                            <label className="block text-white font-semibold mb-3">
                                                Reason for Request <span className="text-red-400">*</span>
                                            </label>
                                            <textarea
                                                value={data.reason}
                                                onChange={(e) => setData('reason', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 resize-none"
                                                rows="6"
                                                placeholder="Please provide a detailed explanation for your absence or late arrival..."
                                                minLength="10"
                                                maxLength="1000"
                                                required
                                            />
                                            <div className="flex justify-between items-center mt-2">
                                                <div className="text-sm text-gray-400">
                                                    Minimum 10 characters required
                                                </div>
                                                <div className="text-sm text-gray-400">
                                                    {data.reason.length}/1000
                                                </div>
                                            </div>
                                            {errors.reason && (
                                                <p className="text-red-400 text-sm mt-2">{errors.reason}</p>
                                            )}
                                        </div>

                                        {/* Guidelines */}
                                        <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-6">
                                            <h3 className="text-blue-300 font-semibold mb-3 flex items-center">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Request Guidelines
                                            </h3>
                                            <ul className="text-blue-200 text-sm space-y-2">
                                                <li>• Provide honest and detailed reasons for your absence or late arrival</li>
                                                <li>• Requests can only be submitted for past dates, not future dates</li>
                                                <li>• You will receive a tracking number to monitor your request status</li>
                                                <li>• Your manager will review and approve/reject your request</li>
                                                <li>• Only one request per employee per date is allowed</li>
                                            </ul>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="flex justify-center">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="submit"
                                                disabled={processing || !employee}
                                                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
                                            >
                                                {processing ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        <span>Submitting Request...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                        </svg>
                                                        <span>Submit Request</span>
                                                    </>
                                                )}
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
} 