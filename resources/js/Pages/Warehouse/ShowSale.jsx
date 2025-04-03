import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import {
    ShoppingCart,
    ChevronRight,
    ArrowLeft,
    Calendar,
    Clock,
    Download,
    Printer,
    User,
    Building,
    Phone,
    Mail,
    MapPin,
    CreditCard,
    Package,
    CheckCircle,
    XCircle,
    Truck,
    Sparkles
} from 'lucide-react';
import Navigation from '@/Components/Warehouse/Navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Define animation variants
const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
};

const slideIn = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4 } }
};

const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function ShowSale({ auth, sale }) {
    const [loading, setLoading] = useState(false);
    const [isPrintMode, setIsPrintMode] = useState(false);

    const { post, processing } = useForm();

    // Handle sale confirmation by warehouse
    const handleConfirmation = () => {
        setLoading(true);
        post(route('warehouse.sales.confirm', sale.id), {
            onSuccess: () => {
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            }
        });
    };

    // Handle print invoice
    const handlePrint = () => {
        setIsPrintMode(true);
        setTimeout(() => {
            window.print();
            setIsPrintMode(false);
        }, 100);
    };

    // Generate colors based on status
    const getStatusColor = (status) => {
        switch(status) {
            case 'completed':
                return 'from-emerald-500 to-green-400';
            case 'pending':
                return 'from-amber-500 to-yellow-400';
            default:
                return 'from-red-500 to-rose-400';
        }
    };

    return (
        <>
            <Head title={`Sale #${sale.reference}`} />

            <div className={`flex h-screen bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-indigo-950 ${isPrintMode ? 'print-mode' : ''}`}>
                {/* Sidebar - Hidden in print mode */}
                {!isPrintMode && (
                    <Navigation auth={auth} currentRoute="warehouse.sales" />
                )}

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-auto">
                    {/* Header - Hidden in print mode */}
                    {!isPrintMode && (
                        <motion.header
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="bg-white dark:bg-gray-800 shadow-lg p-4 flex items-center justify-between relative overflow-hidden backdrop-blur-sm flex-shrink-0 border-b border-indigo-100 dark:border-indigo-900/30"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/90 via-blue-50/80 to-white/90 dark:from-indigo-950/90 dark:via-blue-900/80 dark:to-gray-900/90 opacity-90"></div>
                            <motion.div
                                variants={slideIn}
                                className="flex items-center space-x-3 relative z-10"
                            >
                                <Link href={route('warehouse.sales')} className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors hover:scale-105 transform duration-200">
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    <span>Back to Sales</span>
                                </Link>
                                <div className="h-4 w-px bg-indigo-200 dark:bg-indigo-700"></div>
                                <div className="relative">
                                    <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                        <ShoppingCart className="h-5 w-5 mr-2 text-indigo-600" />
                                        Sale Detail: <span className="text-indigo-600 ml-1">{sale.reference}</span>
                                    </h1>
                                </div>
                            </motion.div>
                            <motion.div
                                variants={slideIn}
                                className="relative z-10 flex space-x-2"
                            >
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex items-center gap-1.5 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-all duration-200 shadow-sm hover:scale-105 transform"
                                    onClick={handlePrint}
                                >
                                    <Printer className="h-4 w-4" />
                                    <span>Print Invoice</span>
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex items-center gap-1.5 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-all duration-200 shadow-sm hover:scale-105 transform"
                                >
                                    <Download className="h-4 w-4" />
                                    <span>Download PDF</span>
                                </Button>
                                {!sale.confirmed_by_warehouse && (
                                    <Button
                                        size="sm"
                                        className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105 transform"
                                        onClick={handleConfirmation}
                                        disabled={processing || loading}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-1.5" />
                                        <span>Confirm Sale</span>
                                    </Button>
                                )}
                            </motion.div>
                        </motion.header>
                    )}

                    {/* Print Header - Only shown in print mode */}
                    {isPrintMode && (
                        <div className="print-header p-4 border-b">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="text-3xl font-bold text-gray-900">Company Name</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-gray-900">INVOICE</div>
                                    <div className="text-gray-600">{sale.reference}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content Section */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerChildren}
                        className="flex-1 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-indigo-950"
                    >
                        {/* Sale Status and Info */}
                        <motion.div variants={fadeIn} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            <motion.div
                                variants={slideIn}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className="col-span-2"
                            >
                                <Card className="col-span-2 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-indigo-100 dark:border-indigo-900/30 overflow-hidden">
                                    <div className={`h-1 w-full bg-gradient-to-r ${getStatusColor(sale.status)}`}></div>
                                    <CardHeader className="pb-2 border-b border-indigo-100 dark:border-indigo-900/30">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center">
                                                <Sparkles className="h-4 w-4 mr-2 text-indigo-500" />
                                                Sale Information
                                            </CardTitle>
                                            <Badge
                                                className={`
                                                    ${sale.status === 'completed' ? 'bg-gradient-to-r from-emerald-500 to-green-400 text-white' :
                                                      sale.status === 'pending' ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-white' :
                                                      'bg-gradient-to-r from-red-500 to-rose-400 text-white'}
                                                    capitalize shadow-sm px-3
                                                `}
                                            >
                                                {sale.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-4">
                                                <motion.div
                                                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                                    className="flex items-start p-3 rounded-lg hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                                                >
                                                    <Calendar className="h-5 w-5 text-indigo-600 mt-0.5 mr-2" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">{sale.date}</p>
                                                    </div>
                                                </motion.div>
                                                <motion.div
                                                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                                    className="flex items-start p-3 rounded-lg hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                                                >
                                                    <ShoppingCart className="h-5 w-5 text-indigo-600 mt-0.5 mr-2" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Reference</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">{sale.reference}</p>
                                                    </div>
                                                </motion.div>
                                                <motion.div
                                                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                                    className="flex items-start p-3 rounded-lg hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                                                >
                                                    <CreditCard className="h-5 w-5 text-indigo-600 mt-0.5 mr-2" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Currency</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">{sale.currency}</p>
                                                    </div>
                                                </motion.div>
                                            </div>
                                            <div className="space-y-4">
                                                <motion.div
                                                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                                    className="flex items-start p-3 rounded-lg hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                                                >
                                                    <Clock className="h-5 w-5 text-indigo-600 mt-0.5 mr-2" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">{sale.created_at}</p>
                                                    </div>
                                                </motion.div>
                                                <motion.div
                                                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                                    className="flex items-start p-3 rounded-lg hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                                                >
                                                    <Truck className="h-5 w-5 text-indigo-600 mt-0.5 mr-2" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Warehouse Confirmation</p>
                                                        <div className="font-medium text-gray-900 dark:text-white">
                                                            {sale.confirmed_by_warehouse ? (
                                                                <motion.span
                                                                    className="flex items-center text-green-600"
                                                                    initial={{ scale: 0.8 }}
                                                                    animate={{ scale: 1 }}
                                                                    transition={{ yoyo: 1, duration: 0.3 }}
                                                                >
                                                                    <CheckCircle className="h-4 w-4 mr-1" /> Confirmed
                                                                </motion.span>
                                                            ) : (
                                                                <motion.span
                                                                    className="flex items-center text-amber-600"
                                                                    animate={{ opacity: [0.6, 1, 0.6] }}
                                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                                >
                                                                    <XCircle className="h-4 w-4 mr-1" /> Pending
                                                                </motion.span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                                <motion.div
                                                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                                    className="flex items-start p-3 rounded-lg hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                                                >
                                                    <Package className="h-5 w-5 text-indigo-600 mt-0.5 mr-2" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Items Count</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">{sale.items_count} items</p>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        </div>

                                        {sale.notes && (
                                            <motion.div
                                                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                                                className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800"
                                            >
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                                                <p className="text-gray-700 dark:text-gray-300">{sale.notes}</p>
                                            </motion.div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div
                                variants={slideIn}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <Card className="shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-indigo-100 dark:border-indigo-900/30 overflow-hidden">
                                    <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-purple-400"></div>
                                    <CardHeader className="pb-2 border-b border-indigo-100 dark:border-indigo-900/30">
                                        <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center">
                                            <User className="h-4 w-4 mr-2 text-violet-500" />
                                            Customer Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <motion.div
                                            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                            className="flex items-start mb-4"
                                        >
                                            <Avatar className="h-10 w-10 mr-3 ring-2 ring-violet-300 dark:ring-violet-700">
                                                <AvatarFallback className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
                                                    {sale.customer.name ? sale.customer.name.charAt(0).toUpperCase() : 'C'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-white">{sale.customer.name}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Customer ID: {sale.customer.id}</p>
                                            </div>
                                        </motion.div>

                                        <div className="space-y-3">
                                            {sale.customer.email && (
                                                <motion.div
                                                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                                    className="flex items-start p-2 rounded-lg hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                                                >
                                                    <Mail className="h-4 w-4 text-violet-500 mt-0.5 mr-2" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">{sale.customer.email}</p>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {sale.customer.phone && (
                                                <motion.div
                                                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                                    className="flex items-start p-2 rounded-lg hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                                                >
                                                    <Phone className="h-4 w-4 text-violet-500 mt-0.5 mr-2" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">{sale.customer.phone}</p>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {sale.customer.address && (
                                                <motion.div
                                                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                                    className="flex items-start p-2 rounded-lg hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                                                >
                                                    <MapPin className="h-4 w-4 text-violet-500 mt-0.5 mr-2" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">{sale.customer.address}</p>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {sale.customer.tax_number && (
                                                <motion.div
                                                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                                    className="flex items-start p-2 rounded-lg hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                                                >
                                                    <Building className="h-4 w-4 text-violet-500 mt-0.5 mr-2" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Tax Number</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">{sale.customer.tax_number}</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>

                        {/* Sale Items */}
                        <motion.div
                            variants={fadeIn}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="mb-6"
                        >
                            <Card className="shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-indigo-100 dark:border-indigo-900/30 overflow-hidden">
                                <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                                <CardHeader className="pb-2 border-b border-indigo-100 dark:border-indigo-900/30">
                                    <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center">
                                        <Package className="h-4 w-4 mr-2 text-blue-500" />
                                        Sale Items
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40">
                                                <tr>
                                                    <th scope="col" className="px-4 py-3 w-16">#</th>
                                                    <th scope="col" className="px-4 py-3">Product</th>
                                                    <th scope="col" className="px-4 py-3 text-center">Unit</th>
                                                    <th scope="col" className="px-4 py-3 text-center">Quantity</th>
                                                    <th scope="col" className="px-4 py-3 text-center">Unit Price</th>
                                                    <th scope="col" className="px-4 py-3 text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sale.sale_items.map((item, index) => (
                                                    <motion.tr
                                                        key={item.id}
                                                        className="bg-white dark:bg-gray-800 border-b border-indigo-100 dark:border-indigo-900/30 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/30"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05, duration: 0.3 }}
                                                        whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', scale: 1.005 }}
                                                    >
                                                        <td className="px-4 py-3">{index + 1}</td>
                                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                                            <div className="flex items-center">
                                                                <Package className="h-4 w-4 text-blue-500 mr-2" />
                                                                {item.product.name}
                                                                {item.product.barcode && (
                                                                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                                                        ({item.product.barcode})
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">{item.unit || '-'}</td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                                                                {item.quantity}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className="text-gray-800 dark:text-gray-200">
                                                                {sale.currency} {parseFloat(item.unit_price).toFixed(2)}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-medium">
                                                            <span className="text-indigo-700 dark:text-indigo-300">
                                                                {sale.currency} {parseFloat(item.total).toFixed(2)}
                                                            </span>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="font-semibold text-gray-900 dark:text-white border-t-2 border-indigo-200 dark:border-indigo-800">
                                                    <td colSpan="5" className="px-4 py-3 text-right">Subtotal:</td>
                                                    <td className="px-4 py-3 text-right">{sale.currency} {parseFloat(sale.total_amount).toFixed(2)}</td>
                                                </tr>
                                                {sale.tax_percentage > 0 && (
                                                    <tr className="text-gray-900 dark:text-white">
                                                        <td colSpan="5" className="px-4 py-3 text-right">Tax ({sale.tax_percentage}%):</td>
                                                        <td className="px-4 py-3 text-right">{sale.currency} {parseFloat(sale.tax_amount).toFixed(2)}</td>
                                                    </tr>
                                                )}
                                                {sale.discount_percentage > 0 && (
                                                    <tr className="text-gray-900 dark:text-white">
                                                        <td colSpan="5" className="px-4 py-3 text-right">Discount ({sale.discount_percentage}%):</td>
                                                        <td className="px-4 py-3 text-right text-red-600 dark:text-red-400">-{sale.currency} {parseFloat(sale.discount_amount).toFixed(2)}</td>
                                                    </tr>
                                                )}
                                                {sale.shipping_cost > 0 && (
                                                    <tr className="text-gray-900 dark:text-white">
                                                        <td colSpan="5" className="px-4 py-3 text-right">Shipping:</td>
                                                        <td className="px-4 py-3 text-right">{sale.currency} {parseFloat(sale.shipping_cost).toFixed(2)}</td>
                                                    </tr>
                                                )}
                                                <motion.tr
                                                    className="font-bold text-gray-900 dark:text-white text-lg border-t-2 border-indigo-200 dark:border-indigo-800"
                                                    whileHover={{ scale: 1.01 }}
                                                >
                                                    <td colSpan="5" className="px-4 py-3 text-right">Total:</td>
                                                    <td className="px-4 py-3 text-right bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-r">
                                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-300">
                                                            {sale.currency} {parseFloat(sale.total_amount).toFixed(2)}
                                                        </span>
                                                    </td>
                                                </motion.tr>
                                                <tr className="text-gray-900 dark:text-white">
                                                    <td colSpan="5" className="px-4 py-3 text-right">Paid Amount:</td>
                                                    <td className="px-4 py-3 text-right text-green-600 dark:text-green-400">{sale.currency} {parseFloat(sale.paid_amount).toFixed(2)}</td>
                                                </tr>
                                                <motion.tr
                                                    className="font-semibold text-gray-900 dark:text-white"
                                                    animate={{ backgroundColor: ['rgba(99, 102, 241, 0.05)', 'rgba(99, 102, 241, 0.1)', 'rgba(99, 102, 241, 0.05)'] }}
                                                    transition={{ repeat: Infinity, duration: 3 }}
                                                >
                                                    <td colSpan="5" className="px-4 py-3 text-right">Due Amount:</td>
                                                    <td className="px-4 py-3 text-right text-amber-600 dark:text-amber-400">{sale.currency} {parseFloat(sale.due_amount).toFixed(2)}</td>
                                                </motion.tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Payment History */}
                        {sale.payments && sale.payments.length > 0 && (
                            <motion.div
                                variants={fadeIn}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <Card className="shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-indigo-100 dark:border-indigo-900/30 overflow-hidden">
                                    <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-green-400"></div>
                                    <CardHeader className="pb-2 border-b border-indigo-100 dark:border-indigo-900/30">
                                        <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center">
                                            <CreditCard className="h-4 w-4 mr-2 text-emerald-500" />
                                            Payment History
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/40">
                                                    <tr>
                                                        <th scope="col" className="px-4 py-3">Date</th>
                                                        <th scope="col" className="px-4 py-3">Reference</th>
                                                        <th scope="col" className="px-4 py-3">Payment Method</th>
                                                        <th scope="col" className="px-4 py-3 text-right">Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sale.payments.map((payment, index) => (
                                                        <motion.tr
                                                            key={payment.id}
                                                            className="bg-white dark:bg-gray-800 border-b border-indigo-100 dark:border-indigo-900/30 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/30"
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.05, duration: 0.3 }}
                                                            whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', scale: 1.005 }}
                                                        >
                                                            <td className="px-4 py-3">{payment.payment_date}</td>
                                                            <td className="px-4 py-3">{payment.reference || '-'}</td>
                                                            <td className="px-4 py-3 capitalize">
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                                                                    {payment.payment_method}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-right font-medium text-emerald-700 dark:text-emerald-300">
                                                                {payment.currency} {parseFloat(payment.amount).toFixed(2)}
                                                            </td>
                                                        </motion.tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Print styles - Only applied when printing */}
            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print-mode, .print-mode * {
                        visibility: visible;
                    }
                    .print-mode {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .no-print {
                        display: none !important;
                    }

                    /* A4 styling */
                    @page {
                        size: A4;
                        margin: 15mm;
                    }

                    /* Typography enhancements for print */
                    html, body {
                        font-size: 12pt;
                        color: #000;
                    }
                    h1 {
                        font-size: 18pt;
                    }
                    h2 {
                        font-size: 16pt;
                    }
                    h3 {
                        font-size: 14pt;
                    }

                    /* Layout specific */
                    .print-header {
                        margin-bottom: 20mm;
                    }

                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }

                    table th {
                        background-color: #f3f4f6 !important;
                        -webkit-print-color-adjust: exact;
                        color-adjust: exact;
                    }

                    table th, table td {
                        border: 1px solid #ddd;
                        padding: 8px;
                    }
                }
            `}</style>
        </>
    );
}
