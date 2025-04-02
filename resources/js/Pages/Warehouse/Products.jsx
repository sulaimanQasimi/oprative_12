import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Search, MessageSquare, Package, TrendingUp, Settings, ChevronRight, Plus, Filter } from 'lucide-react';

export default function Products({ auth, products }) {
    const [searchTerm, setSearchTerm] = useState('');

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

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-purple-900">
                <div className="grid grid-cols-10 min-h-screen">
                    {/* Sidebar */}
                    <div className="col-span-1 bg-white dark:bg-gray-800 shadow-md flex flex-col items-center py-6 space-y-8">
                        <div className="bg-purple-600 text-white p-2 rounded-xl">
                            <Package className="h-6 w-6" />
                        </div>
                        <nav className="flex flex-col items-center space-y-8 text-gray-500">
                            <Button variant="ghost" size="icon" className="text-purple-600" as="a" href={route('warehouse.dashboard')}>
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
                            <Button variant="ghost" size="icon" as="a" href={route('warehouse.profile.edit')}>
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

                    {/* Main Content */}
                    <div className="col-span-6 flex flex-col">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={`https://ui-avatars.com/api/?name=Warehouse+Products`} />
                                        <AvatarFallback>WP</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="font-semibold text-lg">Products</h2>
                                        <p className="text-sm text-gray-500">{auth.user.warehouse.name} • {products?.length || 0} products</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">
                                        <Filter className="h-4 w-4 mr-2" />
                                        Filter
                                    </Button>
                                    <Button size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Product
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
                            <div className="mb-6 relative">
                                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search products by name or barcode..."
                                    className="w-full py-2 pl-10 pr-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="space-y-4">
                                {filteredProducts && filteredProducts.length > 0 ? (
                                    filteredProducts.map(product => (
                                        <Card key={product.product_id} className="shadow-sm border-none">
                                            <CardContent className="p-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="h-12 w-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-purple-600">
                                                        <Package className="h-6 w-6" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <h3 className="font-medium">{product.product[0].name}</h3>
                                                            <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 py-1 px-2 rounded-full">
                                                                {product.net_quantity} in stock
                                                            </span>
                                                        </div>
                                                        <div className="mt-1 flex items-center text-sm text-gray-500">
                                                            <span className="mr-4">Barcode: {product.product[0].barcode || 'N/A'}</span>
                                                            <span>Price: ${product.income_price}</span>
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
                                        <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No products found</h3>
                                        <p className="text-gray-500">
                                            {searchTerm ? 'Try adjusting your search criteria' : 'Add products to your warehouse inventory'}
                                        </p>
                                        <Button className="mt-4">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Product
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Product Stats */}
                    <div className="col-span-3 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="font-semibold text-xl">Product Stats</h2>
                        </div>

                        <div className="p-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="shadow-sm border-none bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                                    <CardContent className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm opacity-80">Total Value</span>
                                            <span className="text-2xl font-bold mt-1">
                                                ${calculateTotalValue()}
                                            </span>
                                            <span className="text-xs mt-1">Inventory value</span>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="shadow-sm border-none bg-gradient-to-br from-pink-500 to-rose-600 text-white">
                                    <CardContent className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm opacity-80">Low Stock</span>
                                            <span className="text-2xl font-bold mt-1">
                                                {getLowStockCount()}
                                            </span>
                                            <span className="text-xs mt-1">Products to reorder</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="mt-4 shadow-sm border-none">
                                <CardContent className="p-4">
                                    <h3 className="font-medium mb-3">Categories</h3>
                                    {products && products.length > 0 ? (
                                        <div className="space-y-2">
                                            {getCategories().map((category, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <span className="text-sm">{category}</span>
                                                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                                        {products.filter(p => p.product[0].type === category ||
                                                            (!p.product[0].type && category === 'Uncategorized')).length}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 text-center py-2">No categories found</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
