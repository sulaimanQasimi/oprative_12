import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle } from 'lucide-react';

export default function Dashboard({ auth, stats }) {
    const colors = ['#4ade80', '#2563eb', '#f43f5e', '#a855f7'];

    // Sample data for charts
    const activityData = [
        { name: 'Mon', value: 20 },
        { name: 'Tue', value: 35 },
        { name: 'Wed', value: 25 },
        { name: 'Thu', value: 40 },
        { name: 'Fri', value: 30 },
        { name: 'Sat', value: 15 },
        { name: 'Sun', value: 10 },
    ];

    const pieData = [
        { name: 'In Stock', value: stats?.products_count || 30 },
        { name: 'Incoming', value: stats?.incoming_transfers_count || 15 },
        { name: 'Outgoing', value: stats?.outgoing_transfers_count || 10 },
    ];

    return (
        <>
            <Head title="Warehouse Dashboard" />

            <div className="py-6 bg-black text-green-400">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6 border-b border-green-900 pb-3">
                        <h1 className="text-2xl font-bold text-green-400">
                            CRITICAL SERVER STATUS: {auth.user.warehouse.name.toUpperCase()}
                        </h1>
                        <div className="flex items-center">
                            <div className="h-3 w-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            <span>ONLINE</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <Card className="bg-gray-900 border border-green-700 shadow-lg shadow-green-900/20">
                            <CardHeader className="pb-2 border-b border-green-900">
                                <CardTitle className="text-sm font-medium text-green-400">TOTAL PRODUCTS</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="text-3xl font-bold text-white">{stats?.products_count || 0}</div>
                                <div className="mt-2 text-xs text-green-500">+5% from last week</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-900 border border-green-700 shadow-lg shadow-green-900/20">
                            <CardHeader className="pb-2 border-b border-green-900">
                                <CardTitle className="text-sm font-medium text-green-400">INCOMING TRANSFERS</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="text-3xl font-bold text-white">{stats?.incoming_transfers_count || 0}</div>
                                <div className="mt-2 text-xs text-green-500">+2 pending approval</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-900 border border-green-700 shadow-lg shadow-green-900/20">
                            <CardHeader className="pb-2 border-b border-green-900">
                                <CardTitle className="text-sm font-medium text-green-400">OUTGOING TRANSFERS</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="text-3xl font-bold text-white">{stats?.outgoing_transfers_count || 0}</div>
                                <div className="mt-2 text-xs text-green-500">3 in transit</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <Card className="bg-gray-900 border border-green-700 shadow-lg shadow-green-900/20">
                            <CardHeader className="border-b border-green-900">
                                <CardTitle className="text-sm font-medium text-green-400">WAREHOUSE ACTIVITY</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 h-60">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={activityData}>
                                        <XAxis dataKey="name" stroke="#22c55e" />
                                        <YAxis stroke="#22c55e" />
                                        <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-900 border border-green-700 shadow-lg shadow-green-900/20">
                            <CardHeader className="border-b border-green-900">
                                <CardTitle className="text-sm font-medium text-green-400">INVENTORY DISTRIBUTION</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 h-60">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="value"
                                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="bg-gray-900 border border-green-700 shadow-lg shadow-green-900/20">
                        <CardHeader className="border-b border-green-900">
                            <CardTitle className="text-sm font-medium text-green-400">SYSTEM STATUS</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mt-4 flex justify-center">
                                <div className="rounded-full p-10 bg-gray-800 border-4 border-green-600 relative">
                                    <CheckCircle className="h-20 w-20 text-green-500" />
                                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-400 animate-spin"></div>
                                </div>
                            </div>
                            <div className="text-center mt-6 text-xl font-bold text-white">ALL SYSTEMS OPERATIONAL</div>
                        </CardContent>
                    </Card>

                    <Card className="mt-6 bg-gray-900 border border-green-700 shadow-lg shadow-green-900/20">
                        <CardHeader className="border-b border-green-900">
                            <CardTitle className="text-sm font-medium text-green-400">RECENT ACTIVITY LOG</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {stats?.recent_activities?.length > 0 ? (
                                <div className="space-y-4 mt-4">
                                    {stats.recent_activities.map((activity, index) => (
                                        <div key={index} className="flex items-center gap-4 p-3 border-b border-green-900 last:border-b-0">
                                            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <div>
                                                <p className="font-medium text-white">{activity.title}</p>
                                                <p className="text-sm text-green-500">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center py-8">
                                    <div className="h-3 w-3 bg-green-500 rounded-full mb-4 animate-pulse"></div>
                                    <p className="text-center text-green-500">No recent activity detected</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
