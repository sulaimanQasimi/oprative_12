import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';

export default function Dashboard({ auth, stats }) {
    return (
        <DashboardLayout user={auth.user}>
            <Head title="Warehouse Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold mb-6">
                        {auth.user.warehouse.name} Dashboard
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.products_count || 0}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Incoming Transfers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.incoming_transfers_count || 0}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Outgoing Transfers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.outgoing_transfers_count || 0}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {stats?.recent_activities?.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.recent_activities.map((activity, index) => (
                                        <div key={index} className="flex items-center gap-4 p-3 border-b last:border-b-0">
                                            <div>
                                                <p className="font-medium">{activity.title}</p>
                                                <p className="text-sm text-gray-500">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center py-4 text-gray-500">No recent activity found</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
