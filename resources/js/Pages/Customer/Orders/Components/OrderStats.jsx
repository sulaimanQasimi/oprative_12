import React from 'react';

export default function OrderStats({ stats }) {
    return (
        <div className="bg-gradient-to-r from-purple-600/90 to-indigo-600/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 lg:p-8 mb-8 relative overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
            <div className="absolute inset-0 bg-grid-white/10 animate-pulse"></div>
            <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            سفارشات مشتری
                        </h2>
                        <p className="text-indigo-100">Manage and track all your orders in one place</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex-1 min-w-[160px] hover:bg-white/20 transition-colors duration-200">
                            <span className="block text-2xl font-bold text-white mb-1">{stats.total_orders}</span>
                            <span className="text-indigo-100 text-sm">Total Orders</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex-1 min-w-[160px] hover:bg-white/20 transition-colors duration-200">
                            <span className="block text-2xl font-bold text-white mb-1">؋{Number(stats.total_amount).toFixed(2)}</span>
                            <span className="text-indigo-100 text-sm">Total Spent</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 