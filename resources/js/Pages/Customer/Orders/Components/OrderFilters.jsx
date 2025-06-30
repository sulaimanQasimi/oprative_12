import React, { useState } from 'react';

export default function OrderFilters({ filters, filterOptions, onFilterChange, onSortChange, onPerPageChange }) {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="mb-6 bg-gradient-to-br from-white/80 to-indigo-50/50 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-100/50 overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
            <div className="p-4 border-b border-indigo-100/50 flex justify-between items-center bg-gradient-to-r from-purple-50 to-indigo-50">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                    </div>
                    Filters
                </h3>
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 hover:text-indigo-700 transition-all duration-200 group"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transform transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
            {showFilters && (
                <div className="p-6 space-y-6 bg-gradient-to-br from-white to-indigo-50/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {/* Date Range Filter */}
                        <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Date Range
                            </label>
                            <div className="relative">
                                <select
                                    value={filters.dateRange}
                                    onChange={(e) => onFilterChange('dateRange', e.target.value)}
                                    className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pl-4 pr-10 py-3 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-200 text-gray-700"
                                >
                                    <option value="all">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="week">This Week</option>
                                    <option value="month">This Month</option>
                                    <option value="year">This Year</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-indigo-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Order Number Search */}
                        <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Order Number
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={filters.searchQuery}
                                    onChange={(e) => onFilterChange('searchQuery', e.target.value)}
                                    placeholder="Search by order number..."
                                    className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pl-11 pr-4 py-3 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-200"
                                />
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <div className="p-1.5 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                Status
                            </label>
                            <div className="relative">
                                <select
                                    value={filters.statusFilter}
                                    onChange={(e) => onFilterChange('statusFilter', e.target.value)}
                                    className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pl-4 pr-10 py-3 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-200 text-gray-700"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-indigo-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Sort By */}
                        <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                </svg>
                                Sort By
                            </label>
                            <div className="relative">
                                <select
                                    value={filters.sortField}
                                    onChange={(e) => onFilterChange('sortField', e.target.value)}
                                    className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pl-4 pr-10 py-3 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-200 text-gray-700"
                                >
                                    <option value="created_at">Date</option>
                                    <option value="total_amount">Amount</option>
                                    <option value="order_status">Status</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-indigo-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Per Page */}
                        <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                                Per Page
                            </label>
                            <div className="relative">
                                <select
                                    value={filters.per_page}
                                    onChange={(e) => onPerPageChange(parseInt(e.target.value))}
                                    className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pl-4 pr-10 py-3 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-200 text-gray-700"
                                >
                                    {filterOptions?.per_page_options?.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-indigo-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 