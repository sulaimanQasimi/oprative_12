import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Separator } from '@/Components/ui/separator';
import { ArrowLeft, Edit, Trash2, Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function Show({ auth, product, permissions }) {
    const { delete: destroy } = useForm();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this product?')) {
            destroy(route('admin.products.destroy', product.id));
        }
    };

    const getCategoryPath = (category) => {
        if (!category) return 'No Category';
        
        const path = [];
        let current = category;
        
        while (current) {
            path.unshift(current.name);
            current = current.parent;
        }
        
        return path.join(' > ');
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Product Details</h2>}
        >
            <Head title="Product Details" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href={route('admin.products.index')}
                                        className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back to Products
                                    </Link>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    {permissions.update_product && (
                                        <Link href={route('admin.products.edit', product.id)}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edit
                                            </Button>
                                        </Link>
                                    )}
                                    
                                    {permissions.delete_product && (
                                        <Button 
                                            variant="destructive" 
                                            size="sm"
                                            onClick={handleDelete}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Product Information */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Basic Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Eye className="w-5 h-5 mr-2" />
                                            Basic Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Name</label>
                                            <p className="text-lg font-semibold">{product.name}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Type</label>
                                            <Badge variant="secondary">{product.type}</Badge>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Barcode</label>
                                            <p className="text-sm">{product.barcode || 'No barcode'}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Status</label>
                                            <Badge variant={product.status ? "default" : "secondary"}>
                                                {product.status ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Category & Unit Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Category & Unit</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Category</label>
                                            <p className="text-sm">
                                                {getCategoryPath(product.category)}
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Unit</label>
                                            <p className="text-sm">{product.unit?.name || 'No unit assigned'}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Timestamps */}
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Timestamps</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Created At</label>
                                            <p className="text-sm">{formatDate(product.created_at)}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Updated At</label>
                                            <p className="text-sm">{formatDate(product.updated_at)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 