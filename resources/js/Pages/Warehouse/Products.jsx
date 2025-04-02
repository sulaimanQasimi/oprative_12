import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardFooter } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Search, MessageSquare, Package, TrendingUp, Settings, ChevronRight, Plus, Filter, ArrowUpRight, ArrowDownRight, BarChart3, Layers, PieChart } from 'lucide-react';

export default function Products({ auth, products }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState('grid');

    // Filter products based on search term
    const filteredProducts = products && products.length
        ? products.filter(product =>
            product.product[0].name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.product[0].barcode?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];

    // Calculate total inventory value
    const calculateTotalValue = () => {
        if (!products || products.length === 0) return 0;
        return products.reduce((sum, product) => {
            return sum + (product.net_quantity * product.income_price);
        }, 0).toFixed(2);
    };

    // Count low stock products
    const getLowStockCount = () => {
        if (!products || products.length === 0) return 0;
        return products.filter(product => product.net_quantity < 10).length;
    };

    // Get unique product types for categories
    const getCategories = () => {
        if (!products || products.length === 0) return [];
        return Array.from(new Set(products.map(p => p.product[0].type || 'Uncategorized')));
    };

    return (
        <>
            <Head title="Warehouse Products" />

            <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
                {/* Sidebar */}
                <div className="w-16 flex-shrink-0 bg-white dark:bg-gray-800 shadow-lg z-10">
                    <div className="h-full flex flex-col items-center justify-between py-6">
                        <div className="flex flex-col items-center space-y-8">
                            <div className="bg-purple-600 text-white p-2 rounded-xl">
                                <Package className="h-6 w-6" />
                            </div>
                            <nav className="flex flex-col items-center space-y-8">
                                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20" as="a" href={route('warehouse.dashboard')}>
                                    <MessageSquare className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-purple-600 bg-purple-100 dark:bg-purple-900/20" as="a" href={route('warehouse.products')}>
                                    <Package className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20" as="a" href={route('warehouse.income')}>
                                    <TrendingUp className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20" as="a" href={route('warehouse.outcome')}>
                                    <TrendingUp className="h-5 w-5 rotate-180" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20" as="a" href={route('warehouse.profile.edit')}>
                                    <Settings className="h-5 w-5" />
                                </Button>
                            </nav>
                        </div>
                        <Avatar className="border-2 border-purple-200 dark:border-purple-900/40">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${auth.user.name}&background=8b5cf6&color=fff`} />
                            <AvatarFallback className="bg-purple-600 text-white">{auth.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Products</h1>
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800">
                                {products?.length || 0} items
                            </Badge>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="relative w-64">
                                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full py-2 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-purple-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Product
                            </Button>
                        </div>
                    </header>

                    {/* Dashboard Summary */}
                    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
                        <div className="grid grid-cols-4 gap-4">
                            <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-0 shadow-lg">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">Total Value</span>
                                        <div className="p-2 bg-white/20 rounded-lg">
                                            <BarChart3 className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold mt-1">${calculateTotalValue()}</div>
                                    <div className="mt-3 text-xs flex items-center text-white/80">
                                        <ArrowUpRight className="h-3 w-3 mr-1" />
                                        <span>Up 12% from last month</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0 shadow-lg">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">Total Products</span>
                                        <div className="p-2 bg-white/20 rounded-lg">
                                            <Layers className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold mt-1">{products?.length || 0}</div>
                                    <div className="mt-3 text-xs flex items-center text-white/80">
                                        <ArrowUpRight className="h-3 w-3 mr-1" />
                                        <span>Added 5 this month</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white border-0 shadow-lg">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">Low Stock</span>
                                        <div className="p-2 bg-white/20 rounded-lg">
                                            <ArrowDownRight className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold mt-1">{getLowStockCount()}</div>
                                    <div className="mt-3 text-xs flex items-center text-white/80">
                                        <ArrowDownRight className="h-3 w-3 mr-1" />
                                        <span>Critical items need restock</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0 shadow-lg">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">Categories</span>
                                        <div className="p-2 bg-white/20 rounded-lg">
                                            <PieChart className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold mt-1">{getCategories().length}</div>
                                    <div className="mt-3 text-xs flex items-center text-white/80">
                                        <span>Product classifications</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Main Content Section */}
                    <div className="flex-1 overflow-auto p-6 bg-gray-100 dark:bg-gray-900">
                        <div className="mb-6 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                {searchTerm ? `Search Results: "${searchTerm}"` : 'All Products'}
                            </h2>
                            <Tabs defaultValue="grid" className="w-auto">
                                <TabsList className="bg-white dark:bg-gray-800">
                                    <TabsTrigger value="grid" active={view === 'grid'} onClick={setView}>Grid</TabsTrigger>
                                    <TabsTrigger value="list" active={view === 'list'} onClick={setView}>List</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <TabsContent value="grid" activeValue={view} className="mt-0">
                            {filteredProducts && filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredProducts.map(product => (
                                        <Card key={product.product_id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                                            <div className="h-3 bg-purple-600" />
                                            <CardContent className="p-6">
                                                <div className="flex items-start">
                                                    <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 mr-4">
                                                        <Package className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-lg text-gray-900 dark:text-white">{product.product[0].name}</h3>
                                                        <div className="mt-1 flex flex-wrap gap-2">
                                                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                                                ID: {product.product_id}
                                                            </Badge>
                                                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                                                Barcode: {product.product[0].barcode || 'N/A'}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-6 grid grid-cols-2 gap-4">
                                                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Stock</p>
                                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{product.net_quantity}</p>
                                                    </div>
                                                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">${product.income_price}</p>
                                                    </div>
                                                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Incoming</p>
                                                        <p className="text-lg font-semibold text-green-600">{product.income_quantity}</p>
                                                    </div>
                                                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Outgoing</p>
                                                        <p className="text-lg font-semibold text-rose-600">{product.outcome_quantity}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="bg-gray-50 dark:bg-gray-800 px-6 py-4 flex justify-between">
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    Total: ${(product.net_quantity * product.income_price).toFixed(2)}
                                                </span>
                                                <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                                                    View Details
                                                    <ChevronRight className="h-4 w-4 ml-1" />
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-10 text-center">
                                    <div className="inline-flex h-20 w-20 rounded-full bg-purple-100 dark:bg-purple-900/30 items-center justify-center mb-6">
                                        <Package className="h-10 w-10 text-purple-600" />
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
                                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                                        {searchTerm ? 'Try adjusting your search criteria or check for typos.' : 'Your warehouse inventory is empty. Add products to get started.'}
                                    </p>
                                    <Button className="bg-purple-600 hover:bg-purple-700">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add First Product
                                    </Button>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="list" activeValue={view} className="mt-0">
                            {filteredProducts && filteredProducts.length > 0 ? (
                                <Card className="border-0 shadow-md overflow-hidden">
                                    <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 border-b border-gray-200 dark:border-gray-700 grid grid-cols-12 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        <div className="col-span-4">Product Name</div>
                                        <div className="col-span-1 text-center">ID</div>
                                        <div className="col-span-1 text-center">Stock</div>
                                        <div className="col-span-1 text-center">Price</div>
                                        <div className="col-span-1 text-center">Incoming</div>
                                        <div className="col-span-1 text-center">Outgoing</div>
                                        <div className="col-span-2 text-center">Value</div>
                                        <div className="col-span-1"></div>
                                    </div>
                                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {filteredProducts.map(product => (
                                            <div key={product.product_id} className="px-6 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 grid grid-cols-12 items-center">
                                                <div className="col-span-4 flex items-center">
                                                    <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 mr-3">
                                                        <Package className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-900 dark:text-white">{product.product[0].name}</h3>
                                                        <p className="text-xs text-gray-500">Barcode: {product.product[0].barcode || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="col-span-1 text-center text-sm text-gray-600 dark:text-gray-300">{product.product_id}</div>
                                                <div className="col-span-1 text-center">
                                                    <Badge className={`${product.net_quantity < 10 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}>
                                                        {product.net_quantity}
                                                    </Badge>
                                                </div>
                                                <div className="col-span-1 text-center font-medium text-gray-900 dark:text-white">${product.income_price}</div>
                                                <div className="col-span-1 text-center text-green-600">{product.income_quantity}</div>
                                                <div className="col-span-1 text-center text-rose-600">{product.outcome_quantity}</div>
                                                <div className="col-span-2 text-center font-medium text-gray-900 dark:text-white">${(product.net_quantity * product.income_price).toFixed(2)}</div>
                                                <div className="col-span-1 text-right">
                                                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-purple-600">
                                                        <ChevronRight className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            ) : (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-10 text-center">
                                    <div className="inline-flex h-20 w-20 rounded-full bg-purple-100 dark:bg-purple-900/30 items-center justify-center mb-6">
                                        <Package className="h-10 w-10 text-purple-600" />
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
                                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                                        {searchTerm ? 'Try adjusting your search criteria or check for typos.' : 'Your warehouse inventory is empty. Add products to get started.'}
                                    </p>
                                    <Button className="bg-purple-600 hover:bg-purple-700">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add First Product
                                    </Button>
                                </div>
                            )}
                        </TabsContent>
                    </div>
                </div>
            </div>
        </>
    );
}
