import React from 'react';
import { Head } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Bell, MessageSquare, Send, User, Users, Package, TrendingUp, Settings, ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import Navigation from '@/Components/Warehouse/Navigation';

export default function Dashboard({ auth, stats }) {
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

    // Sample conversations
    const messages = [
        { id: 1, sender: 'John Smith', avatar: `https://ui-avatars.com/api/?name=John+Smith`, content: 'New shipment arriving tomorrow at 9 AM', time: '10:35 AM', isNew: true },
        { id: 2, sender: 'Sarah Lee', avatar: `https://ui-avatars.com/api/?name=Sarah+Lee`, content: 'Warehouse inspection scheduled for Friday', time: 'Yesterday', isNew: true },
        { id: 3, sender: 'Robert Chen', avatar: `https://ui-avatars.com/api/?name=Robert+Chen`, content: 'Inventory report has been submitted', time: '2 days ago', isNew: false },
    ];

    // Sample active users
    const activeUsers = [
        { id: 1, name: 'Emma Watson', avatar: `https://ui-avatars.com/api/?name=Emma+Watson`, status: 'online' },
        { id: 2, name: 'James Wilson', avatar: `https://ui-avatars.com/api/?name=James+Wilson`, status: 'online' },
        { id: 3, name: 'Lisa Thompson', avatar: `https://ui-avatars.com/api/?name=Lisa+Thompson`, status: 'away' },
    ];

    return (
        <>
            <Head title="Warehouse Dashboard" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-purple-900">
                <div className="grid grid-cols-12 min-h-screen">
                    {/* Sidebar */}
                    <div className="col-span-1">
                        <Navigation auth={auth} currentRoute="warehouse.dashboard" />
                    </div>

                    {/* Messages List */}
                    <div className="col-span-3 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold text-xl">Messages</h2>
                                <Button variant="ghost" size="icon">
                                    <Bell className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="mt-4 relative">
                                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search messages..."
                                    className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-100 dark:bg-gray-700 text-sm"
                                />
                            </div>
                        </div>

                        <div className="overflow-y-auto h-[calc(100vh-140px)]">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                                        message.isNew ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                                    }`}
                                >
                                    <div className="flex items-start space-x-3">
                                        <Avatar>
                                            <AvatarImage src={message.avatar} />
                                            <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-medium truncate">{message.sender}</h3>
                                                <span className="text-xs text-gray-500">{message.time}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">
                                                {message.content}
                                            </p>
                                        </div>
                                        {message.isNew && (
                                            <div className="h-3 w-3 bg-purple-600 rounded-full"></div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-5 flex flex-col">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={`https://ui-avatars.com/api/?name=Warehouse+Team`} />
                                        <AvatarFallback>WH</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="font-semibold text-lg">{auth.user.warehouse.name}</h2>
                                        <p className="text-sm text-gray-500">{stats?.products_count || 0} products · {stats?.incoming_transfers_count || 0} incoming · {stats?.outgoing_transfers_count || 0} outgoing</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm" as="a" href={route('warehouse.profile.edit')}>
                                        <User className="h-4 w-4 mr-2" />
                                        Profile
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
                            <div className="space-y-6">
                                {/* Stats Cards */}
                                <div className="grid grid-cols-3 gap-4">
                                    <Card className="shadow-sm bg-white dark:bg-gray-800 border-none">
                                        <CardContent className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-500">Products</span>
                                                <span className="text-2xl font-bold mt-1">{stats?.products_count || 0}</span>
                                                <span className="text-xs text-green-500 mt-1">+5% from last week</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="shadow-sm bg-white dark:bg-gray-800 border-none">
                                        <CardContent className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-500">Incoming</span>
                                                <span className="text-2xl font-bold mt-1">{stats?.incoming_transfers_count || 0}</span>
                                                <span className="text-xs text-green-500 mt-1">+2 pending approval</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="shadow-sm bg-white dark:bg-gray-800 border-none">
                                        <CardContent className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-500">Outgoing</span>
                                                <span className="text-2xl font-bold mt-1">{stats?.outgoing_transfers_count || 0}</span>
                                                <span className="text-xs text-green-500 mt-1">3 in transit</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Activity Chart */}
                                <Card className="shadow-sm bg-white dark:bg-gray-800 border-none">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-medium">Warehouse Activity</h3>
                                            <Button variant="ghost" size="sm" className="text-purple-600">
                                                Weekly
                                            </Button>
                                        </div>
                                        <div className="h-60">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={activityData}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                                    <YAxis axisLine={false} tickLine={false} />
                                                    <Tooltip />
                                                    <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Recent Activity */}
                                <Card className="shadow-sm bg-white dark:bg-gray-800 border-none">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-medium">Recent Activity</h3>
                                            <Button variant="ghost" size="sm" className="text-purple-600" as="a" href={route('warehouse.income')}>
                                                View All
                                            </Button>
                                        </div>
                                        {stats?.recent_activities?.length > 0 ? (
                                            <div className="space-y-4">
                                                {stats.recent_activities.map((activity, index) => (
                                                    <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600">
                                                            <Package className="h-4 w-4" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium">{activity.title}</p>
                                                            <p className="text-xs text-gray-500">{activity.time}</p>
                                                        </div>
                                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-6 text-gray-500">
                                                <p>No recent activity</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className="flex-1 py-2 px-4 rounded-full bg-gray-100 dark:bg-gray-700 mr-2"
                                />
                                <Button className="rounded-full p-2 bg-purple-600 hover:bg-purple-700">
                                    <Send className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Activity & Users */}
                    <div className="col-span-3 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="font-semibold text-xl">Active Users</h2>
                        </div>

                        <div className="p-4">
                            <div className="space-y-4">
                                {activeUsers.map(user => (
                                    <div key={user.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                                        <div className="relative">
                                            <Avatar>
                                                <AvatarImage src={user.avatar} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                                                user.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                                            }`}></span>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-sm">{user.name}</h3>
                                            <p className="text-xs text-gray-500 capitalize">{user.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                            <h2 className="font-semibold text-xl mb-4">Analytics</h2>
                            <Card className="shadow-sm border-none bg-gray-50 dark:bg-gray-700">
                                <CardContent className="p-4">
                                    <h3 className="text-sm font-medium mb-2">Activity Trend</h3>
                                    <div className="h-40">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={activityData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                                <YAxis axisLine={false} tickLine={false} />
                                                <Tooltip />
                                                <Line
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="#8b5cf6"
                                                    strokeWidth={2}
                                                    dot={{ r: 4 }}
                                                    activeDot={{ r: 6 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <Card className="shadow-sm border-none bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                                    <CardContent className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm opacity-80">Stock Status</span>
                                            <span className="text-2xl font-bold mt-1">85%</span>
                                            <span className="text-xs mt-1">Capacity utilized</span>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="shadow-sm border-none bg-gradient-to-br from-pink-500 to-rose-600 text-white">
                                    <CardContent className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm opacity-80">Performance</span>
                                            <span className="text-2xl font-bold mt-1">92%</span>
                                            <span className="text-xs mt-1">Efficiency rate</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
