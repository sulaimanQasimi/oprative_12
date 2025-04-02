import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Search, Bell, MessageSquare, Send, User, Users, Package, TrendingUp, Settings, ChevronRight, Plus, Calendar, Clock } from 'lucide-react';
import Navigation from '@/Components/Warehouse/Navigation';

export default function Income({ auth, income }) {
    const [searchTerm, setSearchTerm] = useState('');

    // Sample messages for the sidebar (these would come from the backend in a real app)
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

    // Filter income records based on search term
    const filteredIncome = income && income.length
        ? income.filter(record =>
            record.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.source.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];

    // Calculate total income value
    const totalIncomeValue = income?.reduce((sum, record) => sum + record.amount, 0) || 0;

    return (
        <>
            <Head title="Warehouse Income" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-purple-900">
                <div className="grid grid-cols-12 min-h-screen">
                    {/* Sidebar */}
                    <div className="col-span-1">
                        <Navigation auth={auth} currentRoute="warehouse.income" />
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
                                        <AvatarImage src={`https://ui-avatars.com/api/?name=Warehouse+Income`} />
                                        <AvatarFallback>WI</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="font-semibold text-lg">Income Transactions</h2>
                                        <p className="text-sm text-gray-500">{auth.user.warehouse.name} • {income?.length || 0} transactions</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        New Transaction
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
                            <div className="mb-6 relative">
                                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by reference or source..."
                                    className="w-full py-2 pl-10 pr-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="space-y-4">
                                {filteredIncome && filteredIncome.length > 0 ? (
                                    filteredIncome.map(record => (
                                        <Card key={record.id} className="shadow-sm border-none">
                                            <CardContent className="p-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600">
                                                        <TrendingUp className="h-6 w-6" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <h3 className="font-medium">{record.reference}</h3>
                                                            <span className="text-lg font-semibold text-green-600">
                                                                +${record.amount.toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <div className="mt-1 flex items-center text-sm text-gray-500">
                                                            <span className="flex items-center mr-4">
                                                                <Calendar className="h-3 w-3 mr-1" />
                                                                {record.date}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <User className="h-3 w-3 mr-1" />
                                                                {record.source}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm">
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No income transactions found</h3>
                                        <p className="text-gray-500">
                                            {searchTerm ? 'Try adjusting your search criteria' : 'Add income transactions to track your inventory'}
                                        </p>
                                        <Button className="mt-4">
                                            <Plus className="h-4 w-4 mr-2" />
                                            New Transaction
                                        </Button>
                                    </div>
                                )}
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
                            <h2 className="font-semibold text-xl mb-4">Income Statistics</h2>
                            <div className="grid grid-cols-1 gap-4">
                                <Card className="shadow-sm border-none bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                                    <CardContent className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm opacity-80">Total Income</span>
                                            <span className="text-2xl font-bold mt-1">
                                                ${totalIncomeValue.toFixed(2)}
                                            </span>
                                            <span className="text-xs mt-1">All time transactions</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="mt-4 shadow-sm border-none">
                                <CardContent className="p-4">
                                    <h3 className="font-medium mb-3">Recent Sources</h3>
                                    {income && income.length > 0 ? (
                                        <div className="space-y-2">
                                            {Array.from(new Set(income.map(i => i.source))).slice(0, 5).map((source, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <span className="text-sm">{source}</span>
                                                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                                        ${income.filter(i => i.source === source)
                                                            .reduce((sum, i) => sum + i.amount, 0)
                                                            .toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 text-center py-2">No sources found</p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="mt-4 shadow-sm border-none">
                                <CardContent className="p-4">
                                    <h3 className="font-medium mb-3">Monthly Overview</h3>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-1">This Month</p>
                                            <p className="font-semibold text-green-600">
                                                ${income?.filter(i => {
                                                    const date = new Date(i.date);
                                                    const now = new Date();
                                                    return date.getMonth() === now.getMonth() &&
                                                           date.getFullYear() === now.getFullYear();
                                                }).reduce((sum, i) => sum + i.amount, 0).toFixed(2) || '0.00'}
                                            </p>
                                        </div>
                                        <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-1">Last Month</p>
                                            <p className="font-semibold text-green-600">
                                                ${income?.filter(i => {
                                                    const date = new Date(i.date);
                                                    const now = new Date();
                                                    let lastMonth = now.getMonth() - 1;
                                                    let year = now.getFullYear();
                                                    if (lastMonth < 0) {
                                                        lastMonth = 11;
                                                        year--;
                                                    }
                                                    return date.getMonth() === lastMonth &&
                                                           date.getFullYear() === year;
                                                }).reduce((sum, i) => sum + i.amount, 0).toFixed(2) || '0.00'}
                                            </p>
                                        </div>
                                        <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-1">This Year</p>
                                            <p className="font-semibold text-green-600">
                                                ${income?.filter(i => {
                                                    const date = new Date(i.date);
                                                    const now = new Date();
                                                    return date.getFullYear() === now.getFullYear();
                                                }).reduce((sum, i) => sum + i.amount, 0).toFixed(2) || '0.00'}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
