import React from 'react';
import { Head } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { User, Package, TrendingUp, ChevronRight, DollarSign, Layers, AlertTriangle, TrendingDown, BarChart3, ArrowUp, ArrowDown, Percent, RefreshCcw } from 'lucide-react';
import { Link } from '@inertiajs/react';
import Navigation from '@/Components/Warehouse/Navigation';

export default function Dashboard({ auth, stats }) {
    // Format currency values
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(value);
    };

    // Format percent values
    const formatPercent = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 1
        }).format(value/100);
    };

    // Colors for pie chart
    const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

    // Simplified pie chart data from top-selling products
    const pieData = stats?.top_selling_products?.map(product => ({
        name: product.name,
        value: product.qty_sold
    })) || [];

    return (
        <>
            <Head title="Warehouse Dashboard" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-purple-900">
                <div className="grid grid-cols-12 min-h-screen">
                    {/* Sidebar */}
                    <div className="col-span-1">
                        <Navigation auth={auth} currentRoute="warehouse.dashboard" />
                    </div>

                    {/* Main Content */}
                    <div className="col-span-11 flex flex-col">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={`https://ui-avatars.com/api/?name=Warehouse+Team`} />
                                        <AvatarFallback>WH</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="font-semibold text-lg">{auth.user.warehouse.name}</h2>
                                        <p className="text-sm text-gray-500">{stats?.products_count || 0} products · {stats?.total_stock || 0} total items · {formatCurrency(stats?.total_inventory_value || 0)} inventory value</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm" as="a" href={route('warehouse.products')}>
                                        <Package className="h-4 w-4 mr-2" />
                                        View Products
                                    </Button>
                                    <Button variant="outline" size="sm" as="a" href={route('warehouse.profile.edit')}>
                                        <User className="h-4 w-4 mr-2" />
                                        Profile
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
                            <div className="space-y-6">
                                {/* Key Stats Row */}
                                <div className="grid grid-cols-5 gap-4">
                                    <Card className="shadow-sm bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-none">
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-white/80">Total Stock</span>
                                                <Layers className="h-5 w-5 text-white/80" />
                                            </div>
                                            <div className="text-2xl font-bold">{stats?.total_stock || 0}</div>
                                            <div className="mt-1 text-xs text-white/80">
                                                {stats?.low_stock_count > 0 ? (
                                                    <div className="flex items-center">
                                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                                        <span>{stats.low_stock_count} products low on stock</span>
                                                    </div>
                                                ) : (
                                                    <span>Inventory levels good</span>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="shadow-sm bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-none">
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-white/80">Inventory Value</span>
                                                <DollarSign className="h-5 w-5 text-white/80" />
                                            </div>
                                            <div className="text-2xl font-bold">{formatCurrency(stats?.total_inventory_value || 0)}</div>
                                            <div className="mt-1 text-xs text-white/80">
                                                <div className="flex items-center">
                                                    <ArrowUp className="h-3 w-3 mr-1" />
                                                    <span>+5% from last month</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="shadow-sm bg-gradient-to-br from-pink-500 to-rose-600 text-white border-none">
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-white/80">Total Sales</span>
                                                <TrendingUp className="h-5 w-5 text-white/80" />
                                            </div>
                                            <div className="text-2xl font-bold">{formatCurrency(stats?.total_outcome_value || 0)}</div>
                                            <div className="mt-1 text-xs text-white/80">
                                                <div className="flex items-center">
                                                    <span>{stats?.total_outcome_quantity || 0} units sold</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="shadow-sm bg-gradient-to-br from-amber-500 to-orange-600 text-white border-none">
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-white/80">Total Profit</span>
                                                <TrendingUp className="h-5 w-5 text-white/80" />
                                            </div>
                                            <div className="text-2xl font-bold">{formatCurrency(stats?.total_profit || 0)}</div>
                                            <div className="mt-1 text-xs text-white/80">
                                                <div className="flex items-center">
                                                    <Percent className="h-3 w-3 mr-1" />
                                                    <span>Margin: {stats?.profit_margin?.toFixed(1) || 0}%</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="shadow-sm bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-none">
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-white/80">Turnover Rate</span>
                                                <RefreshCcw className="h-5 w-5 text-white/80" />
                                            </div>
                                            <div className="text-2xl font-bold">{stats?.inventory_turnover?.toFixed(2) || 0}</div>
                                            <div className="mt-1 text-xs text-white/80">
                                                <div className="flex items-center">
                                                    <ArrowUp className="h-3 w-3 mr-1" />
                                                    <span>Higher is better</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Charts Row */}
                                <div className="grid grid-cols-2 gap-6">
                                    {/* Monthly Sales Chart */}
                                    <Card className="shadow-sm bg-white dark:bg-gray-800 border-none">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg">Monthly Sales (Current Year)</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <div className="h-80">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={stats?.monthly_sales || []}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                                        <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                                                        <Tooltip
                                                            formatter={(value) => [`$${value.toFixed(2)}`, 'Sales']}
                                                            labelFormatter={(label) => `Month: ${label}`}
                                                        />
                                                        <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Top Products Chart */}
                                    <Card className="shadow-sm bg-white dark:bg-gray-800 border-none">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg">Top Selling Products</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="h-80 flex items-center justify-center">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <PieChart>
                                                            <Pie
                                                                data={pieData}
                                                                cx="50%"
                                                                cy="50%"
                                                                labelLine={false}
                                                                outerRadius={80}
                                                                fill="#8884d8"
                                                                dataKey="value"
                                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                            >
                                                                {pieData.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                                ))}
                                                            </Pie>
                                                            <Tooltip formatter={(value) => [`${value} units`, 'Quantity Sold']} />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium mb-2">Top 5 Products</h3>
                                                    <div className="space-y-3">
                                                        {stats?.top_selling_products?.map((product, index) => (
                                                            <div key={product.product_id} className="flex items-center gap-2">
                                                                <div
                                                                    className="w-3 h-3 rounded-full"
                                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                                ></div>
                                                                <div className="flex-1 text-sm">
                                                                    <div className="font-medium truncate">{product.name}</div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {product.qty_sold} units · {formatCurrency(product.revenue)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Activity and Recent Products Row */}
                                <div className="grid grid-cols-2 gap-6">
                                    {/* Daily Activity Chart */}
                                    <Card className="shadow-sm bg-white dark:bg-gray-800 border-none">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg">Daily Activity (Last 7 Days)</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <div className="h-60">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={stats?.daily_activity}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                                        <YAxis axisLine={false} tickLine={false} />
                                                        <Tooltip formatter={(value) => [`${value} transactions`]} />
                                                        <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Recent Products Activity */}
                                    <Card className="shadow-sm bg-white dark:bg-gray-800 border-none">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg">Recent Product Movement</CardTitle>
                                                <Button variant="ghost" size="sm" className="text-purple-600" as="a" href={route('warehouse.products')}>
                                                    View All
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <div className="space-y-4">
                                                {stats?.recent_product_movement?.length > 0 ? (
                                                    stats.recent_product_movement.map((product) => (
                                                        <div key={product.product_id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                                            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600">
                                                                <Package className="h-4 w-4" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium">{product.name}</p>
                                                                <div className="flex items-center mt-1">
                                                                    <span className="text-xs text-green-600 mr-3">
                                                                        <ArrowUp className="inline h-3 w-3 mr-0.5" />
                                                                        In: {product.income_quantity}
                                                                    </span>
                                                                    <span className="text-xs text-rose-600 mr-3">
                                                                        <ArrowDown className="inline h-3 w-3 mr-0.5" />
                                                                        Out: {product.outcome_quantity}
                                                                    </span>
                                                                    <span className="text-xs text-gray-500">
                                                                        Stock: {product.net_quantity}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {product.last_updated}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-6 text-gray-500">
                                                        <p>No recent product activity</p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Recent Activity */}
                                <Card className="shadow-sm bg-white dark:bg-gray-800 border-none">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg">Recent Transactions</CardTitle>
                                            <div className="flex space-x-2">
                                                <Button variant="ghost" size="sm" className="text-purple-600" as="a" href={route('warehouse.income')}>
                                                    View Income
                                                </Button>
                                                <Button variant="ghost" size="sm" className="text-purple-600" as="a" href={route('warehouse.outcome')}>
                                                    View Outcome
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        {stats?.recent_activities?.length > 0 ? (
                                            <div className="space-y-4">
                                                {stats.recent_activities.map((activity, index) => (
                                                    <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                                            activity.type === 'income'
                                                                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                                                : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
                                                        }`}>
                                                            {activity.type === 'income'
                                                                ? <TrendingUp className="h-4 w-4" />
                                                                : <TrendingDown className="h-4 w-4" />
                                                            }
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium">{activity.title}</p>
                                                            <p className="text-xs text-gray-500">{activity.time}</p>
                                                        </div>
                                                        <div className={`text-sm font-medium ${
                                                            activity.type === 'income'
                                                                ? 'text-green-600'
                                                                : 'text-rose-600'
                                                        }`}>
                                                            {activity.type === 'income' ? '+' : '-'}{formatCurrency(activity.amount)}
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
                    </div>
                </div>
            </div>
        </>
    );
}
