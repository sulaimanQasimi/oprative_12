import React, { useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardFooter, CardHeader } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    ArrowLeft,
    Edit,
    Trash2,
    Package,
    Calendar,
    Clock,
    User,
    FileText,
    Tag,
    DollarSign,
    ShoppingCart,
    Clipboard,
    ArrowDownRight
} from 'lucide-react';
import Navigation from '@/Components/Warehouse/Navigation';

export default function OutcomeDetails({ auth, outcome, relatedOutcome }) {
    // Debugging
    console.log("Outcome details:", outcome);
    console.log("Related outcome:", relatedOutcome);

    // Animation references
    const containerRef = useRef(null);

    return (
        <>
            <Head title={`Transaction: ${outcome.reference}`} />

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="warehouse.outcome" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center space-x-4">
                            <Link
                                href={route('warehouse.outcome')}
                                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-0.5">Outcome Transaction Details</span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    {outcome.reference}
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="sm" className="rounded-full border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20">
                                <Trash2 className="h-4 w-4 mr-1.5" />
                                <span>Delete</span>
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-full border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                                <Edit className="h-4 w-4 mr-1.5" />
                                <span>Edit</span>
                            </Button>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main
                        ref={containerRef}
                        className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent px-6 py-6"
                    >
                        <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Outcome Details Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="lg:col-span-2"
                                >
                                    <Card className="border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                                        <CardHeader className="bg-rose-50 dark:bg-rose-900/10 border-b border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="h-12 w-12 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center flex-shrink-0">
                                                    <TrendingUp className="h-6 w-6 text-rose-600 dark:text-rose-400 rotate-180" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                                        Outcome Transaction
                                                    </h2>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center mt-1">
                                                        <Tag className="h-3.5 w-3.5 mr-1" />
                                                        Reference: {outcome.reference}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 rounded-full text-sm px-3 py-1 border-0">
                                                <ArrowDownRight className="h-3.5 w-3.5 mr-1.5" />
                                                Outcome
                                            </Badge>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Amount */}
                                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <DollarSign className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount</span>
                                                    </div>
                                                    <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">${outcome.amount.toFixed(2)}</p>
                                                </div>

                                                {/* Date Information */}
                                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Date & Time</span>
                                                    </div>
                                                    <p className="text-lg font-semibold text-slate-800 dark:text-white">{outcome.date}</p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                        <Clock className="h-3.5 w-3.5 inline mr-1 text-slate-400" />
                                                        {outcome.formatted_date || outcome.created_at}
                                                    </p>
                                                </div>

                                                {/* Product Information */}
                                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Product Destination</span>
                                                    </div>
                                                    <p className="text-lg font-semibold text-slate-800 dark:text-white">{outcome.destination}</p>
                                                    {outcome.product_details && (
                                                        <div className="mt-2 text-sm">
                                                            <p className="text-slate-500 dark:text-slate-400">
                                                                SKU: {outcome.product_details.sku}
                                                            </p>
                                                            {outcome.product_details.category && (
                                                                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                                                                    Category: {outcome.product_details.category}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Quantity and Price */}
                                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <ShoppingCart className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Quantity & Price</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="text-lg font-semibold text-slate-800 dark:text-white">{outcome.quantity} units</p>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                                                Unit Price: ${outcome.price ? outcome.price.toFixed(2) : (outcome.amount / outcome.quantity).toFixed(2)}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">Total Value</p>
                                                            <p className="text-lg font-semibold text-rose-600 dark:text-rose-400">${outcome.amount.toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Notes Section */}
                                            {outcome.notes && (
                                                <div className="mt-6 bg-amber-50 dark:bg-amber-900/10 rounded-lg p-4 border border-amber-200 dark:border-amber-900/50">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                                        <span className="text-sm font-medium text-amber-800 dark:text-amber-300">Notes</span>
                                                    </div>
                                                    <p className="text-sm text-amber-700 dark:text-amber-300/80">{outcome.notes}</p>
                                                </div>
                                            )}

                                            {/* Created by */}
                                            {outcome.created_by && (
                                                <div className="mt-6 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-4">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4" />
                                                        <span>Created by {outcome.created_by.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4" />
                                                        <span>Last updated {outcome.updated_at || outcome.created_at}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                        <CardFooter className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between">
                                            <Link href={route('warehouse.outcome')}>
                                                <Button variant="outline" size="sm" className="text-slate-700 border-slate-300 dark:text-slate-300 dark:border-slate-600">
                                                    <ArrowLeft className="h-4 w-4 mr-1.5" />
                                                    Back to Outcome
                                                </Button>
                                            </Link>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" className="text-slate-700 border-slate-300 dark:text-slate-300 dark:border-slate-600">
                                                    <Clipboard className="h-4 w-4 mr-1.5" />
                                                    Export
                                                </Button>
                                                <Button size="sm" className="bg-rose-500 hover:bg-rose-600 text-white">
                                                    <Edit className="h-4 w-4 mr-1.5" />
                                                    Edit Details
                                                </Button>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </motion.div>

                                {/* Sidebar Cards */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                    className="space-y-6"
                                >
                                    {/* Product Stock Information */}
                                    {outcome.product_details && (
                                        <Card className="border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                                            <CardHeader className="bg-purple-50 dark:bg-purple-900/10 border-b border-slate-200 dark:border-slate-800 p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                                                        <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                                            Product Information
                                                        </h3>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            Current stock and pricing
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4">
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">Product Name</p>
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{outcome.product_details.name}</p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">Current Stock</p>
                                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{outcome.product_details.current_stock} units</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">Unit Price</p>
                                                            <p className="text-sm font-medium text-slate-900 dark:text-white">${outcome.product_details.unit_price}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 p-3">
                                                <Button variant="outline" size="sm" className="w-full text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-900/50 dark:hover:bg-purple-900/20">
                                                    View Product Details
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    )}

                                    {/* Related Outcome Transactions */}
                                    {relatedOutcome && relatedOutcome.length > 0 && (
                                        <Card className="border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                                            <CardHeader className="bg-blue-50 dark:bg-blue-900/10 border-b border-slate-200 dark:border-slate-800 p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                                        <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 rotate-180" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                                            Related Outcome
                                                        </h3>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            For same product
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                                                    {relatedOutcome.map((record) => (
                                                        <Link
                                                            key={record.id}
                                                            href={route('warehouse.outcome.show', { outcome: record.id })}
                                                            className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                                        >
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{record.reference}</p>
                                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                                        {record.created_at} • {record.quantity} units
                                                                    </p>
                                                                </div>
                                                                <p className="text-sm font-medium text-rose-600 dark:text-rose-400">${record.amount.toFixed(2)}</p>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </CardContent>
                                            <CardFooter className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 p-3">
                                                <Button variant="outline" size="sm" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-900/50 dark:hover:bg-blue-900/20">
                                                    View All Related Transactions
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    )}

                                    {/* Actions Card */}
                                    <Card className="border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                                        <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 p-4">
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                                Actions
                                            </h3>
                                        </CardHeader>
                                        <CardContent className="p-4 space-y-3">
                                            <Button variant="outline" className="w-full justify-start text-slate-700 dark:text-slate-300">
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit Transaction
                                            </Button>
                                            <Button variant="outline" className="w-full justify-start text-slate-700 dark:text-slate-300">
                                                <Clipboard className="h-4 w-4 mr-2" />
                                                Export Details
                                            </Button>
                                            <Button variant="outline" className="w-full justify-start text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 border-rose-200 dark:border-rose-900/50">
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete Transaction
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
