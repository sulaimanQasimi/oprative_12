import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Search, Bell, MessageSquare, Send, User, Users, Package, TrendingUp, Settings, ChevronRight, Plus, Mail, Phone } from 'lucide-react';

export default function WarehouseUsers({ auth, users }) {
    const [searchTerm, setSearchTerm] = useState('');

    // Sample messages for the sidebar (these would come from the backend in a real app)
    const messages = [
        { id: 1, sender: 'John Smith', avatar: `https://ui-avatars.com/api/?name=John+Smith`, content: 'New shipment arriving tomorrow at 9 AM', time: '10:35 AM', isNew: true },
        { id: 2, sender: 'Sarah Lee', avatar: `https://ui-avatars.com/api/?name=Sarah+Lee`, content: 'Warehouse inspection scheduled for Friday', time: 'Yesterday', isNew: true },
        { id: 3, sender: 'Robert Chen', avatar: `https://ui-avatars.com/api/?name=Robert+Chen`, content: 'Inventory report has been submitted', time: '2 days ago', isNew: false },
    ];

    // Sample active users for the right sidebar
    const activeUsers = [
        { id: 1, name: 'Emma Watson', avatar: `https://ui-avatars.com/api/?name=Emma+Watson`, status: 'online' },
        { id: 2, name: 'James Wilson', avatar: `https://ui-avatars.com/api/?name=James+Wilson`, status: 'online' },
        { id: 3, name: 'Lisa Thompson', avatar: `https://ui-avatars.com/api/?name=Lisa+Thompson`, status: 'away' },
    ];

    // Filter users based on search term
    const filteredUsers = users && users.length
        ? users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()))
          )
        : [];

    // User roles count for stats
    const getRoleCount = (role) => {
        return users?.filter(user => user.role === role).length || 0;
    };

    return (
        <>
            <Head title="Warehouse Users" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-purple-900">
                <div className="grid grid-cols-12 min-h-screen">
                    {/* Sidebar */}
                    <div className="col-span-1 bg-white dark:bg-gray-800 shadow-md flex flex-col items-center py-6 space-y-8">
                        <div className="bg-purple-600 text-white p-2 rounded-xl">
                            <Package className="h-6 w-6" />
                        </div>
                        <nav className="flex flex-col items-center space-y-8 text-gray-500">
                            <Button variant="ghost" size="icon" as="a" href={route('warehouse.dashboard')}>
                                <MessageSquare className="h-6 w-6" />
                            </Button>
                            <Button variant="ghost" size="icon" as="a" href={route('warehouse.products')}>
                                <Package className="h-6 w-6" />
                            </Button>
                            <Button variant="ghost" size="icon" as="a" href={route('warehouse.income')}>
                                <TrendingUp className="h-6 w-6" />
                            </Button>
                            <Button variant="ghost" size="icon" as="a" href={route('warehouse.outcome')}>
                                <TrendingUp className="h-6 w-6 rotate-180" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-purple-600" as="a" href={route('warehouse.users')}>
                                <Users className="h-6 w-6" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Settings className="h-6 w-6" />
                            </Button>
                        </nav>
                        <div className="mt-auto">
                            <Avatar>
                                <AvatarImage src={`https://ui-avatars.com/api/?name=${auth.user.name}`} />
                                <AvatarFallback>{auth.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
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
                                        <AvatarImage src={`https://ui-avatars.com/api/?name=Warehouse+Users`} />
                                        <AvatarFallback>WU</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="font-semibold text-lg">Warehouse Team</h2>
                                        <p className="text-sm text-gray-500">{auth.user.warehouse.name} • {users?.length || 0} team members</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Team Member
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
                            <div className="mb-6 relative">
                                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email or role..."
                                    className="w-full py-2 pl-10 pr-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="space-y-4">
                                {filteredUsers && filteredUsers.length > 0 ? (
                                    filteredUsers.map(user => (
                                        <Card key={user.id} className="shadow-sm border-none">
                                            <CardContent className="p-4">
                                                <div className="flex items-center space-x-4">
                                                    <Avatar>
                                                        <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}`} />
                                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <h3 className="font-medium">{user.name}</h3>
                                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                                user.role === 'admin'
                                                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                                                                    : user.role === 'manager'
                                                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                                                            }`}>
                                                                {user.role || 'Staff'}
                                                            </span>
                                                        </div>
                                                        <div className="mt-1 flex items-center text-sm text-gray-500">
                                                            <span className="flex items-center mr-4">
                                                                <Mail className="h-3 w-3 mr-1" />
                                                                {user.email}
                                                            </span>
                                                            {user.phone && (
                                                                <span className="flex items-center">
                                                                    <Phone className="h-3 w-3 mr-1" />
                                                                    {user.phone}
                                                                </span>
                                                            )}
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
                                        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No users found</h3>
                                        <p className="text-gray-500">
                                            {searchTerm ? 'Try adjusting your search criteria' : 'Add team members to your warehouse'}
                                        </p>
                                        <Button className="mt-4">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Team Member
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
                            <h2 className="font-semibold text-xl mb-4">Team Statistics</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="shadow-sm border-none bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                                    <CardContent className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm opacity-80">Admins</span>
                                            <span className="text-2xl font-bold mt-1">
                                                {getRoleCount('admin')}
                                            </span>
                                            <span className="text-xs mt-1">Full access</span>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="shadow-sm border-none bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                                    <CardContent className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm opacity-80">Managers</span>
                                            <span className="text-2xl font-bold mt-1">
                                                {getRoleCount('manager')}
                                            </span>
                                            <span className="text-xs mt-1">Limited access</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="mt-4 shadow-sm border-none">
                                <CardContent className="p-4">
                                    <h3 className="font-medium mb-3">Role Distribution</h3>
                                    {users && users.length > 0 ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Admins</span>
                                                <span className="text-xs bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full text-purple-800 dark:text-purple-300">
                                                    {getRoleCount('admin')}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Managers</span>
                                                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full text-blue-800 dark:text-blue-300">
                                                    {getRoleCount('manager')}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Staff</span>
                                                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                                    {getRoleCount('staff')}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 text-center py-2">No users found</p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="mt-4 shadow-sm border-none">
                                <CardContent className="p-4">
                                    <h3 className="font-medium mb-3">Recent Activities</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start space-x-3">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm">Sarah Lee joined the team</p>
                                                <p className="text-xs text-gray-500">2 days ago</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                                                <Settings className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm">John Smith changed permissions</p>
                                                <p className="text-xs text-gray-500">1 week ago</p>
                                            </div>
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
