import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Search, User, TrendingUp, ChevronRight, Plus, Calendar, Clock, Filter, FileText, Download, ArrowUpRight } from 'lucide-react';
import Navigation from '@/Components/Warehouse/Navigation';

export default function Income({ auth, income }) {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter income records based on search term
    const filteredIncome = income && income.length
        ? income.filter(record =>
            (record.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.source?.toLowerCase().includes(searchTerm.toLowerCase()))
          )
        : [];

    // Calculate total income value
    const totalIncomeValue = income?.reduce((sum, record) => sum + record.amount, 0) || 0;

    // Calculate this month's income
    const thisMonthIncome = income?.filter(i => {
        const date = new Date(i.date);
        const now = new Date();
        return date.getMonth() === now.getMonth() &&
               date.getFullYear() === now.getFullYear();
    }).reduce((sum, i) => sum + i.amount, 0) || 0;

    // Calculate last month's income
    const lastMonthIncome = income?.filter(i => {
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
    }).reduce((sum, i) => sum + i.amount, 0) || 0;

    // Calculate income change percentage
    const incomeChangePercent = lastMonthIncome ?
        ((thisMonthIncome - lastMonthIncome) / lastMonthIncome * 100) : 0;

    // Get unique sources and their totals
    const sourceTotals = income && income.length ?
        Array.from(new Set(income.map(i => i.source)))
            .map(source => ({
                name: source,
                total: income.filter(i => i.source === source)
                    .reduce((sum, i) => sum + i.amount, 0)
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5) : [];

    return (
        <>
            <Head title="Warehouse Income" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-purple-900">
                <div className="grid grid-cols-12 min-h-screen">
                    {/* Sidebar */}
                    <div className="col-span-1">
                        <Navigation auth={auth} currentRoute="warehouse.income" />
                    </div>

                    {/* Main Content */}
                    <div className="col-span-11 flex flex-col">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={`https://ui-avatars.com/api/?name=Warehouse+Income`} />
                                        <AvatarFallback>WI</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="font-semibold text-lg">Income Transactions</h2>
                                        <p className="text-sm text-gray-500">{auth.user.warehouse.name} • {income?.length || 0} transactions • ${totalIncomeValue.toFixed(2)} total</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">
                                        <Filter className="h-4 w-4 mr-2" />
                                        Filter
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Download className="h-4 w-4 mr-2" />
                                        Export
                                    </Button>
                                    <Button size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        New Transaction
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
                            <div className="grid grid-cols-4 gap-4 mb-6">
                                <Card className="shadow-sm bg-gradient-to-br from-green-500 to-emerald-600 text-white border-none">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-white/80">Total Income</span>
                                            <ArrowUpRight className="h-5 w-5 text-white/80" />
                                        </div>
                                        <div className="text-2xl font-bold">${totalIncomeValue.toFixed(2)}</div>
                                        <div className="mt-1 text-xs text-white/80">All time transactions</div>
                                    </CardContent>
                                </Card>

                                <Card className="shadow-sm bg-white dark:bg-gray-800 border-none">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-500">This Month</span>
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <div className="text-2xl font-bold text-green-600">${thisMonthIncome.toFixed(2)}</div>
                                        <div className="mt-1 text-xs text-gray-500 flex items-center">
                                            {incomeChangePercent > 0 ? (
                                                <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                                            ) : (
                                                <ChevronRight className="h-3 w-3 mr-1" />
                                            )}
                                            <span>{Math.abs(incomeChangePercent).toFixed(1)}% from last month</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="shadow-sm bg-white dark:bg-gray-800 border-none">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-500">Transactions</span>
                                            <FileText className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <div className="text-2xl font-bold">{income?.length || 0}</div>
                                        <div className="mt-1 text-xs text-gray-500">Total transactions recorded</div>
                                    </CardContent>
                                </Card>

                                <Card className="shadow-sm bg-white dark:bg-gray-800 border-none">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-500">Avg. Transaction</span>
                                            <TrendingUp className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <div className="text-2xl font-bold text-green-600">
                                            ${income && income.length ? (totalIncomeValue / income.length).toFixed(2) : '0.00'}
                                        </div>
                                        <div className="mt-1 text-xs text-gray-500">Average income per transaction</div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid grid-cols-3 gap-6 mb-6">
                                <div className="col-span-2">
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
                                                                {record.notes && (
                                                                    <p className="mt-2 text-xs text-gray-500">
                                                                        {record.notes}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <Button variant="ghost" size="sm">
                                                                <ChevronRight className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
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

                                <div className="space-y-6">
                                    <Card className="shadow-sm border-none">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg">Top Income Sources</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            {sourceTotals.length > 0 ? (
                                                <div className="space-y-4">
                                                    {sourceTotals.map((source, index) => (
                                                        <div key={index} className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-3">
                                                                <div className={`h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600`}>
                                                                    <span className="text-xs font-medium">{index + 1}</span>
                                                                </div>
                                                                <span className="font-medium">{source.name}</span>
                                                            </div>
                                                            <span className="text-green-600 font-semibold">${source.total.toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-center py-4 text-gray-500">No data available</p>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card className="shadow-sm border-none">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg">Monthly Overview</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                                                    <p className="text-xs text-gray-500 mb-1">This Month</p>
                                                    <p className="font-semibold text-green-600">
                                                        ${thisMonthIncome.toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                                                    <p className="text-xs text-gray-500 mb-1">Last Month</p>
                                                    <p className="font-semibold text-green-600">
                                                        ${lastMonthIncome.toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
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

                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
                                                <div className="space-y-2">
                                                    {income && income.length > 0 ? income.slice(0, 3).map((record, idx) => (
                                                        <div key={idx} className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                                                            <span className="truncate max-w-[120px]">{record.reference}</span>
                                                            <span className="text-green-600">${record.amount.toFixed(2)}</span>
                                                        </div>
                                                    )) : (
                                                        <p className="text-sm text-gray-500 text-center">No recent activity</p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
