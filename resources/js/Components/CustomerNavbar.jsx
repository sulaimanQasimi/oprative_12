import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    Home, 
    Package, 
    ShoppingCart, 
    Plus, 
    BarChart, 
    CreditCard, 
    FileText, 
    LogOut, 
    Menu, 
    X, 
    ChevronDown,
    Mail,
    Bell,
    Search,
    Settings,
    User,
    HelpCircle
} from 'lucide-react';

export default function CustomerNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { auth, permissions = [] } = usePage().props;
    
    const profileDropdownRef = useRef(null);
    const notificationsRef = useRef(null);
    const searchRef = useRef(null);

    // Sample notifications (replace with real data)
    const notifications = [
        { id: 1, message: "Your order #12345 has been shipped", isRead: false, time: "2 hours ago" },
        { id: 2, message: "New product added to inventory", isRead: true, time: "1 day ago" },
        { id: 3, message: "Payment received for invoice #INV-001", isRead: true, time: "3 days ago" },
    ];

    const menuItems = [
        {
            name: 'Dashboard',
            route: 'customer.dashboard',
            icon: Home,
            permission: 'customer.view_dashboard'
        },
        {
            name: 'Stock Products',
            route: 'customer.stock-products',
            icon: Package,
            permission: 'customer.view_stock'
        },
        {
            name: 'Orders',
            route: 'customer.orders',
            icon: ShoppingCart,
            permission: 'customer.view_orders',
        },
        {
            name: 'Create Order',
            route: 'customer.create_orders',
            icon: Plus,
            permission: 'customer.create_orders'
        },
        {
            name: 'Move form Warehouse to Store',
            route: 'customer.sales.index',
            icon: BarChart,
            permission: 'customer.view_sales'
        },
        {
            name: 'Bank Accounts',
            route: 'customer.accounts.index',
            icon: CreditCard,
            permission: 'customer.view_accounts'
        },
        {
            name: 'Reports',
            route: 'customer.reports',
            icon: FileText,
            permission: 'customer.view_reports',
        }
    ];

    const hasPermission = (permission) => {
        // Check permissions from Inertia props first (from middleware)
        if (permissions && permissions.includes(permission)) {
            return true;
        }
        
        // Fallback to checking user permissions directly
        if (auth.user && auth.user.permissions && auth.user.permissions.includes(permission)) {
            return true;
        }
        
        // Check if user has role with permission
        if (auth.user && auth.user.roles) {
            return auth.user.roles.some(role => 
                role.permissions && role.permissions.includes(permission)
            );
        }
        
        // If no specific permission required or for development
        if (permission === undefined || process.env.NODE_ENV === 'development') {
            return true;
        }
        
        return false;
    };

    // Filter menu items based on permissions
    const filteredMenuItems = menuItems.filter(item => hasPermission(item.permission));

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setNotificationsOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        // Implement search functionality here
        console.log('Searching for:', searchQuery);
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-xl mb-6 transition-all duration-300 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        {/* Logo/Brand */}
                        <div className="flex-shrink-0 flex items-center">
                            <div className="flex items-center gap-3 transition-transform duration-300 hover:scale-105">
                                <div className="p-2.5 bg-white/10 backdrop-blur-sm shadow-lg transform transition-all duration-300 hover:shadow-xl hover:rotate-3 rounded-lg">
                                    <Package className="h-5 w-5 text-white transform transition-transform hover:scale-110" />
                                </div>
                                <span className="text-base font-semibold text-white hover:text-white/90 transition-all duration-500">
                                    Customer Portal
                                </span>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:ml-8 md:flex md:space-x-2">
                            {filteredMenuItems.length > 0 ? (
                                filteredMenuItems.map((item) => (
                                    <div key={item.route} className="relative group">
                                        {item.submenu ? (
                                            <div className="inline-flex items-center px-3 py-2 text-sm transition-all duration-200 ease-in-out cursor-pointer group">
                                                <item.icon className="h-5 w-5 mr-2" />
                                                <span className="font-medium text-white/80 group-hover:text-white">{item.name}</span>
                                                <ChevronDown className="h-4 w-4 ml-1 text-white/60 transform transition-transform group-hover:rotate-180" />
                                                
                                                {/* Submenu */}
                                                <div className="absolute left-0 z-10 mt-7 w-56 origin-top-left bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1">
                                                    <div className="py-1">
                                                        {item.submenu.map((subitem) => (
                                                            <Link
                                                                key={subitem.id || `${subitem.route}-${subitem.name}`}
                                                                href={route(subitem.route)}
                                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                {subitem.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <Link
                                                href={route(item.route)}
                                                className={`inline-flex items-center px-3 py-2 text-sm transition-all duration-200 ease-in-out rounded ${
                                                    route().current(item.route)
                                                        ? 'bg-white/20 text-white shadow-lg'
                                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                <item.icon className="h-5 w-5 mr-2" />
                                                <span className="font-medium">{item.name}</span>
                                            </Link>
                                        )}
                                    </div>
                                ))
                            ) : (
                                // Display default menu items if no filtered items (development or fallback)
                                menuItems.map((item) => (
                                    <div key={item.route} className="relative group">
                                        {item.submenu ? (
                                            <div className="inline-flex items-center px-3 py-2 text-sm transition-all duration-200 ease-in-out cursor-pointer group">
                                                <item.icon className="h-5 w-5 mr-2" />
                                                <span className="font-medium text-white/80 group-hover:text-white">{item.name}</span>
                                                <ChevronDown className="h-4 w-4 ml-1 text-white/60 transform transition-transform group-hover:rotate-180" />
                                                
                                                {/* Submenu */}
                                                <div className="absolute left-0 z-10 mt-7 w-56 origin-top-left bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1">
                                                    <div className="py-1">
                                                        {item.submenu.map((subitem) => (
                                                            <Link
                                                                key={subitem.id || `${subitem.route}-${subitem.name}`}
                                                                href={route(subitem.route)}
                                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                {subitem.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <Link
                                                href={route(item.route)}
                                                className={`inline-flex items-center px-3 py-2 text-sm transition-all duration-200 ease-in-out rounded ${
                                                    route().current(item.route)
                                                        ? 'bg-white/20 text-white shadow-lg'
                                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                <item.icon className="h-5 w-5 mr-2" />
                                                <span className="font-medium">{item.name}</span>
                                            </Link>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <div ref={searchRef} className="relative">
                            <button 
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                            >
                                <Search className="h-5 w-5" />
                            </button>
                            
                            {searchOpen && (
                                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl p-2 z-10">
                                    <form onSubmit={handleSearch} className="flex">
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-l-lg focus:outline-none focus:ring focus:border-blue-300"
                                        />
                                        <button 
                                            type="submit"
                                            className="bg-blue-600 text-white px-3 py-2 rounded-r-lg hover:bg-blue-700"
                                        >
                                            <Search className="h-4 w-4" />
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                        
                        {/* Notifications */}
                        <div ref={notificationsRef} className="relative">
                            <button 
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors relative"
                            >
                                <Bell className="h-5 w-5" />
                                {notifications.some(n => !n.isRead) && (
                                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                                )}
                            </button>
                            
                            {notificationsOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-10">
                                    <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium flex justify-between items-center">
                                        <span>Notifications</span>
                                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                                            {notifications.filter(n => !n.isRead).length} new
                                        </span>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((notification) => (
                                                <div 
                                                    key={notification.id}
                                                    className={`p-3 border-b hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <p className={`text-sm ${!notification.isRead ? 'font-medium' : ''}`}>
                                                            {notification.message}
                                                        </p>
                                                        {!notification.isRead && (
                                                            <span className="h-2 w-2 bg-blue-600 rounded-full mt-1"></span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-gray-500">
                                                No notifications
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-2 bg-gray-50 text-center">
                                        <button className="text-sm text-blue-600 hover:text-blue-800">
                                            Mark all as read
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Profile Menu */}
                        <div ref={profileDropdownRef} className="relative">
                            <button
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                className={`flex items-center gap-3 p-2 text-sm transition-all duration-200 hover:bg-white/10 focus:outline-none rounded-lg ${
                                    route().current('customer.profile.show') || profileDropdownOpen ? 'bg-white/20 shadow-lg' : ''
                                }`}
                            >
                                <div className="relative">
                                    <div className="h-10 w-10 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 hover:scale-105 hover:rotate-3 rounded-lg">
                                        <span className="text-white font-semibold text-lg">
                                            {auth.user?.name?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
                                </div>
                                <div className="hidden md:block">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-white">{auth.user?.name || 'User'}</span>
                                        <ChevronDown className={`h-4 w-4 text-white/60 transform transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                    <div className="flex items-center gap-1 text-white/80">
                                        <Mail className="h-3 w-3" />
                                        <span className="text-xs truncate max-w-[150px]">{auth.user?.email || 'user@example.com'}</span>
                                    </div>
                                </div>
                            </button>
                            
                            {profileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl overflow-hidden z-10">
                                    <div className="border-b px-4 py-3">
                                        <p className="text-sm font-medium text-gray-900">{auth.user?.name || 'User'}</p>
                                        <p className="text-xs text-gray-500 truncate">{auth.user?.email || 'user@example.com'}</p>
                                    </div>
                                    <div className="py-1">
                                        <Link
                                            href={route('customer.profile.show')}
                                            className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center gap-2"
                                        >
                                            <User className="h-4 w-4" />
                                            <span>Your Profile</span>
                                        </Link>
                                        <Link
                                            href={route('customer.settings')}
                                            className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center gap-2"
                                        >
                                            <Settings className="h-4 w-4" />
                                            <span>Settings</span>
                                        </Link>
                                        <Link
                                            href={route('customer.help')}
                                            className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center gap-2"
                                        >
                                            <HelpCircle className="h-4 w-4" />
                                            <span>Help & Support</span>
                                        </Link>
                                        <form method="POST" action={route('customer.logout')}>
                                            <button
                                                type="submit"
                                                className="flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center gap-2"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span>Sign out</span>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isOpen ? (
                                    <X className="block h-6 w-6" />
                                ) : (
                                    <Menu className="block h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-gray-900/95 backdrop-blur-lg fixed w-full z-50 animate-fade-in-down">
                    <div className="px-2 pt-2 pb-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
                        {/* Mobile search */}
                        <div className="px-3 py-2">
                            <form onSubmit={handleSearch} className="flex">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-l-lg focus:outline-none focus:ring focus:border-blue-300 text-gray-800"
                                />
                                <button 
                                    type="submit"
                                    className="bg-blue-600 text-white px-3 py-2 rounded-r-lg hover:bg-blue-700"
                                >
                                    <Search className="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                        
                        {(filteredMenuItems.length > 0 ? filteredMenuItems : menuItems).map((item) => (
                            <div key={item.route}>
                                {item.submenu ? (
                                    <div className="space-y-1">
                                        <div className="block px-3 py-2 rounded-md text-base font-medium text-white bg-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <item.icon className="h-5 w-5" />
                                                <span>{item.name}</span>
                                            </div>
                                            <ChevronDown className="h-4 w-4" />
                                        </div>
                                        <div className="pl-4 space-y-1 border-l border-white/10 ml-4">
                                            {item.submenu.map((subitem) => (
                                                <Link
                                                    key={subitem.id || `${subitem.route}-${subitem.name}`}
                                                    href={route(subitem.route)}
                                                    className="block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:bg-white/10 transition duration-150 ease-in-out"
                                                >
                                                    {subitem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        href={route(item.route)}
                                        className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition duration-150 ease-in-out flex items-center gap-2 ${
                                            route().current(item.route)
                                                ? 'bg-white/15 text-white'
                                                : 'text-white/80'
                                        }`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                )}
                            </div>
                        ))}
                        
                        {/* Mobile profile links */}
                        <div className="border-t border-white/10 pt-4">
                            <Link
                                href={route('customer.profile.show')}
                                className="block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:bg-white/10 transition duration-150 ease-in-out flex items-center gap-2"
                            >
                                <User className="h-5 w-5" />
                                <span>Your Profile</span>
                            </Link>
                            <Link
                                href={route('customer.settings')}
                                className="block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:bg-white/10 transition duration-150 ease-in-out flex items-center gap-2"
                            >
                                <Settings className="h-5 w-5" />
                                <span>Settings</span>
                            </Link>
                            <Link
                                href={route('customer.help')}
                                className="block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:bg-white/10 transition duration-150 ease-in-out flex items-center gap-2"
                            >
                                <HelpCircle className="h-5 w-5" />
                                <span>Help & Support</span>
                            </Link>
                        </div>
                        
                        <form method="POST" action={route('customer.logout')} className="block">
                            <button
                                type="submit"
                                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 transition duration-150 ease-in-out flex items-center gap-2"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Sign out</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </nav>
    );
} 