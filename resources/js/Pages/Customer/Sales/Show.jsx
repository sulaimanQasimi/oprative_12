import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import CustomerNavbar from '@/Components/CustomerNavbar';
import PageLoader from '@/Components/Admin/PageLoader';
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
    Sparkles,
    BanknoteIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Memoized animation variants to prevent re-creation
const animationVariants = {
    fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
    },
    slideIn: {
        hidden: { x: -20, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.4 } }
    },
    staggerChildren: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }
};

// Memoized status color function
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

// Memoized components for better performance
const SaleInfoCard = React.memo(({ sale, t }) => (
    <motion.div
        variants={animationVariants.slideIn}
        whileHover={{ y: -8, transition: { duration: 0.3 } }}
        className="col-span-2"
    >
        <Card className="col-span-2 shadow-2xl bg-gradient-to-br from-white via-violet-50/30 to-indigo-50/30 dark:from-gray-800 dark:via-violet-900/20 dark:to-indigo-900/20 backdrop-blur-xl border border-violet-200/50 dark:border-violet-800/50 overflow-hidden relative group">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Enhanced header bar */}
            <div className={`h-3 w-full bg-gradient-to-r ${getStatusColor(sale.status)} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            </div>
            
            <CardHeader className="pb-3 border-b border-violet-100/50 dark:border-violet-800/50 bg-gradient-to-r from-violet-50/50 to-indigo-50/50 dark:from-violet-900/20 dark:to-indigo-900/20">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center font-bold">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 mr-3 shadow-lg">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        {t('Sale Information')}
                    </CardTitle>
                    <Badge
                        className={`
                            ${sale.status === 'completed' ? 'bg-gradient-to-r from-emerald-500 to-green-400 text-white shadow-lg' :
                              sale.status === 'pending' ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-white shadow-lg' :
                              'bg-gradient-to-r from-red-500 to-rose-400 text-white shadow-lg'}
                            capitalize px-4 py-2 text-sm font-semibold shadow-lg transform hover:scale-105 transition-transform duration-200
                        `}
                    >
                        {sale.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <motion.div
                            whileHover={{ x: 8, transition: { duration: 0.2 } }}
                            className="flex items-start p-4 rounded-xl bg-gradient-to-r from-violet-50/50 to-indigo-50/50 dark:from-violet-900/20 dark:to-indigo-900/20 hover:from-violet-100/70 hover:to-indigo-100/70 dark:hover:from-violet-800/30 dark:hover:to-indigo-800/30 transition-all duration-300 border border-violet-200/30 dark:border-violet-700/30 shadow-sm hover:shadow-md"
                        >
                            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 mr-3 shadow-md">
                                <Calendar className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('Date')}</p>
                                <p className="font-semibold text-gray-900 dark:text-white text-lg">{sale.date}</p>
                            </div>
                        </motion.div>
                        <motion.div
                            whileHover={{ x: 8, transition: { duration: 0.2 } }}
                            className="flex items-start p-4 rounded-xl bg-gradient-to-r from-violet-50/50 to-indigo-50/50 dark:from-violet-900/20 dark:to-indigo-900/20 hover:from-violet-100/70 hover:to-indigo-100/70 dark:hover:from-violet-800/30 dark:hover:to-indigo-800/30 transition-all duration-300 border border-violet-200/30 dark:border-violet-700/30 shadow-sm hover:shadow-md"
                        >
                            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 mr-3 shadow-md">
                                <ShoppingCart className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('Reference')}</p>
                                <p className="font-semibold text-gray-900 dark:text-white text-lg">{sale.reference}</p>
                            </div>
                        </motion.div>
                        <motion.div
                            whileHover={{ x: 8, transition: { duration: 0.2 } }}
                            className="flex items-start p-4 rounded-xl bg-gradient-to-r from-violet-50/50 to-indigo-50/50 dark:from-violet-900/20 dark:to-indigo-900/20 hover:from-violet-100/70 hover:to-indigo-100/70 dark:hover:from-violet-800/30 dark:hover:to-indigo-800/30 transition-all duration-300 border border-violet-200/30 dark:border-violet-700/30 shadow-sm hover:shadow-md"
                        >
                            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 mr-3 shadow-md">
                                <CreditCard className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('Currency')}</p>
                                <p className="font-semibold text-gray-900 dark:text-white text-lg">
                                    {typeof sale.currency === 'object'
                                        ? sale.currency?.code || sale.currency?.symbol || '-'
                                        : String(sale.currency || '-')}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                    <div className="space-y-4">
                        <motion.div
                            whileHover={{ x: 8, transition: { duration: 0.2 } }}
                            className="flex items-start p-4 rounded-xl bg-gradient-to-r from-violet-50/50 to-indigo-50/50 dark:from-violet-900/20 dark:to-indigo-900/20 hover:from-violet-100/70 hover:to-indigo-100/70 dark:hover:from-violet-800/30 dark:hover:to-indigo-800/30 transition-all duration-300 border border-violet-200/30 dark:border-violet-700/30 shadow-sm hover:shadow-md"
                        >
                            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 mr-3 shadow-md">
                                <Clock className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('Created')}</p>
                                <p className="font-semibold text-gray-900 dark:text-white text-lg">{sale.created_at}</p>
                            </div>
                        </motion.div>
                        <motion.div
                            whileHover={{ x: 8, transition: { duration: 0.2 } }}
                            className="flex items-start p-4 rounded-xl bg-gradient-to-r from-violet-50/50 to-indigo-50/50 dark:from-violet-900/20 dark:to-indigo-900/20 hover:from-violet-100/70 hover:to-indigo-100/70 dark:hover:from-violet-800/30 dark:hover:to-indigo-800/30 transition-all duration-300 border border-violet-200/30 dark:border-violet-700/30 shadow-sm hover:shadow-md"
                        >
                            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 mr-3 shadow-md">
                                <Truck className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('Warehouse Confirmation')}</p>
                                <div className="font-semibold text-gray-900 dark:text-white text-lg">
                                    {sale.confirmed_by_warehouse ? (
                                        <motion.span
                                            className="flex items-center text-green-600"
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            transition={{ yoyo: 1, duration: 0.3 }}
                                        >
                                            <CheckCircle className="h-5 w-5 mr-2" /> {t('Confirmed')}
                                        </motion.span>
                                    ) : (
                                        <motion.span
                                            className="flex items-center text-amber-600"
                                            animate={{ opacity: [0.6, 1, 0.6] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                        >
                                            <XCircle className="h-5 w-5 mr-2" /> {t('Pending')}
                                        </motion.span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            whileHover={{ x: 8, transition: { duration: 0.2 } }}
                            className="flex items-start p-4 rounded-xl bg-gradient-to-r from-violet-50/50 to-indigo-50/50 dark:from-violet-900/20 dark:to-indigo-900/20 hover:from-violet-100/70 hover:to-indigo-100/70 dark:hover:from-violet-800/30 dark:hover:to-indigo-800/30 transition-all duration-300 border border-violet-200/30 dark:border-violet-700/30 shadow-sm hover:shadow-md"
                        >
                            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 mr-3 shadow-md">
                                <Package className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('Shop Confirmation')}</p>
                                <div className="font-semibold text-gray-900 dark:text-white text-lg">
                                    {sale.confirmed_by_shop ? (
                                        <motion.span
                                            className="flex items-center text-green-600"
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            transition={{ yoyo: 1, duration: 0.3 }}
                                        >
                                            <CheckCircle className="h-5 w-5 mr-2" /> {t('Confirmed')}
                                        </motion.span>
                                    ) : (
                                        <motion.span
                                            className="flex items-center text-amber-600"
                                            animate={{ opacity: [0.6, 1, 0.6] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                        >
                                            <XCircle className="h-5 w-5 mr-2" /> {t('Pending')}
                                        </motion.span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {sale.notes && (
                    <motion.div
                        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                        className="mt-6 p-4 bg-gradient-to-r from-violet-100/50 to-indigo-100/50 dark:from-violet-800/30 dark:to-indigo-800/30 rounded-xl border border-violet-200/50 dark:border-violet-700/50 shadow-sm"
                    >
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">{t('Notes')}</p>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">{sale.notes}</p>
                    </motion.div>
                )}
            </CardContent>
        </Card>
    </motion.div>
));

const CustomerInfoCard = React.memo(({ sale, t }) => (
    <motion.div
        variants={animationVariants.slideIn}
        whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
        <Card className="shadow-2xl bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-gray-800 dark:via-purple-900/20 dark:to-pink-900/20 backdrop-blur-xl border border-purple-200/50 dark:border-purple-800/50 overflow-hidden relative group">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Enhanced header bar */}
            <div className="h-3 w-full bg-gradient-to-r from-purple-500 to-pink-400 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            </div>
            
            <CardHeader className="pb-3 border-b border-purple-100/50 dark:border-purple-800/50 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20">
                <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center font-bold">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 mr-3 shadow-lg">
                        <User className="h-5 w-5 text-white" />
                    </div>
                    {t('Customer Information')}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <motion.div
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    className="flex items-start mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/30 dark:border-purple-700/30 shadow-sm"
                >
                    <Avatar className="h-12 w-12 mr-4 ring-4 ring-purple-300 dark:ring-purple-700 shadow-lg">
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold text-lg">
                            {sale.customer?.name ? sale.customer.name.charAt(0).toUpperCase() : 'C'}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-xl">{sale.customer?.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('Customer ID')}: {sale.customer?.id}</p>
                    </div>
                </motion.div>

                <div className="space-y-4">
                    {sale.customer?.email && (
                        <motion.div
                            whileHover={{ x: 8, transition: { duration: 0.2 } }}
                            className="flex items-start p-4 rounded-xl bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 hover:from-purple-100/70 hover:to-pink-100/70 dark:hover:from-purple-800/30 dark:hover:to-pink-800/30 transition-all duration-300 border border-purple-200/30 dark:border-purple-700/30 shadow-sm hover:shadow-md"
                        >
                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 mr-3 shadow-md">
                                <Mail className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('Email')}</p>
                                <p className="font-semibold text-gray-900 dark:text-white text-lg">{sale.customer.email}</p>
                            </div>
                        </motion.div>
                    )}

                    {sale.customer?.phone && (
                        <motion.div
                            whileHover={{ x: 8, transition: { duration: 0.2 } }}
                            className="flex items-start p-4 rounded-xl bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 hover:from-purple-100/70 hover:to-pink-100/70 dark:hover:from-purple-800/30 dark:hover:to-pink-800/30 transition-all duration-300 border border-purple-200/30 dark:border-purple-700/30 shadow-sm hover:shadow-md"
                        >
                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 mr-3 shadow-md">
                                <Phone className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('Phone')}</p>
                                <p className="font-semibold text-gray-900 dark:text-white text-lg">{sale.customer.phone}</p>
                            </div>
                        </motion.div>
                    )}

                    {sale.customer?.address && (
                        <motion.div
                            whileHover={{ x: 8, transition: { duration: 0.2 } }}
                            className="flex items-start p-4 rounded-xl bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 hover:from-purple-100/70 hover:to-pink-100/70 dark:hover:from-purple-800/30 dark:hover:to-pink-800/30 transition-all duration-300 border border-purple-200/30 dark:border-purple-700/30 shadow-sm hover:shadow-md"
                        >
                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 mr-3 shadow-md">
                                <MapPin className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('Address')}</p>
                                <p className="font-semibold text-gray-900 dark:text-white text-lg">{sale.customer.address}</p>
                            </div>
                        </motion.div>
                    )}

                    {sale.customer?.tax_number && (
                        <motion.div
                            whileHover={{ x: 8, transition: { duration: 0.2 } }}
                            className="flex items-start p-4 rounded-xl bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 hover:from-purple-100/70 hover:to-pink-100/70 dark:hover:from-purple-800/30 dark:hover:to-pink-800/30 transition-all duration-300 border border-purple-200/30 dark:border-purple-700/30 shadow-sm hover:shadow-md"
                        >
                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 mr-3 shadow-md">
                                <Building className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('Tax Number')}</p>
                                <p className="font-semibold text-gray-900 dark:text-white text-lg">{sale.customer.tax_number}</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </CardContent>
        </Card>
    </motion.div>
));

export default function Show({ auth, sale }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(false);
    const [isPrintMode, setIsPrintMode] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const { post, processing } = useForm();

    // Memoized sale data calculations
    const saleCalculations = useMemo(() => {
        const saleItems = sale?.sale_items || [];
        const payments = sale?.payments || [];
        
        return {
            totalItems: saleItems.length,
            totalQuantity: saleItems.reduce((sum, item) => sum + (item.quantity || 0), 0),
            averageUnitPrice: saleItems.length > 0 
                ? saleItems.reduce((sum, item) => sum + (item.unit_price || 0), 0) / saleItems.length 
                : 0,
            totalPayments: payments.reduce((sum, payment) => sum + (payment.amount || 0), 0),
            dueAmount: (sale?.total_amount || 0) - payments.reduce((sum, payment) => sum + (payment.amount || 0), 0)
        };
    }, [sale]);

    // Memoized event handlers to prevent re-renders
    const handleConfirmation = useCallback(() => {
        setLoading(true);
        post(route('customer.sales.confirm', sale.id), {
            onSuccess: () => {
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            }
        });
    }, [sale.id, post]);

    const handlePrint = useCallback(() => {
        setIsPrintMode(true);
        setTimeout(() => {
            window.print();
            setIsPrintMode(false);
        }, 100);
    }, []);

    const showPaymentModal = useCallback(() => {
        setIsPaymentModalOpen(true);
    }, []);

    const closePaymentModal = useCallback(() => {
        setIsPaymentModalOpen(false);
    }, []);

    const handlePaymentSubmit = useCallback(async (e) => {
        e.preventDefault();

        setLoading(true);
        post(route('customer.sales.payment', sale.id), {
            paymentAmount: e.target.paymentAmount.value,
            paymentDate: e.target.paymentDate.value,
            paymentNotes: e.target.paymentNotes.value,
        }, {
            onSuccess: () => {
                setLoading(false);
                setIsPaymentModalOpen(false);
            },
            onError: () => {
                setLoading(false);
            }
        });
    }, [sale.id, post]);

    return (
        <>
            <Head title={t(`Sale #${sale.reference}`)} />

            <PageLoader isVisible={loading} icon={ShoppingCart} color="violet" />

            <div className={`flex h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-indigo-950 dark:to-blue-950 ${isPrintMode ? 'print-mode' : ''}`}>
                {/* Sidebar - Hidden in print mode */}
                {!isPrintMode && (
                    <CustomerNavbar auth={auth} currentRoute="customer.sales.index" />
                )}

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-auto">
                    {/* Header - Hidden in print mode */}
                    {!isPrintMode && (
                        <motion.header
                            initial="hidden"
                            animate="visible"
                            variants={animationVariants.fadeIn}
                            className="bg-white dark:bg-gray-800 shadow-lg p-4 flex items-center justify-between relative overflow-hidden backdrop-blur-sm flex-shrink-0 border-b border-violet-100 dark:border-violet-900/30"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-50/90 via-indigo-50/80 to-white/90 dark:from-violet-950/90 dark:via-indigo-900/80 dark:to-gray-900/90 opacity-90"></div>
                            <motion.div
                                variants={animationVariants.slideIn}
                                className="flex items-center space-x-3 relative z-10"
                            >
                                <Link href={route('customer.sales.index')} className="flex items-center text-violet-600 hover:text-violet-800 transition-colors hover:scale-105 transform duration-200">
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    <span>{t('Back to Sales')}</span>
                                </Link>
                                <div className="h-4 w-px bg-violet-200 dark:bg-violet-700"></div>
                                <div className="relative">
                                    <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                        <ShoppingCart className="h-5 w-5 mr-2 text-violet-600" />
                                        {t('Sale Detail')}: <span className="text-violet-600 ml-1">{sale.reference}</span>
                                    </h1>
                                </div>
                            </motion.div>
                            <motion.div
                                variants={animationVariants.slideIn}
                                className="relative z-10 flex space-x-2"
                            >
                                {sale.status === 'pending' && saleCalculations.dueAmount > 0 && (
                                    <Button
                                        size="sm"
                                        className="bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105 transform"
                                        onClick={showPaymentModal}
                                        disabled={processing || loading}
                                    >
                                        <BanknoteIcon className="h-4 w-4 mr-1.5" />
                                        <span>{t('Add Payment')}</span>
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex items-center gap-1.5 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-900/30 dark:hover:text-violet-400 transition-all duration-200 shadow-sm hover:scale-105 transform"
                                    onClick={handlePrint}
                                >
                                    <Printer className="h-4 w-4" />
                                    <span>{t('Print Invoice')}</span>
                                </Button>
                                {sale.confirmed_by_warehouse && !sale.confirmed_by_shop && (
                                    <Button
                                        size="sm"
                                        className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105 transform"
                                        onClick={handleConfirmation}
                                        disabled={processing || loading}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-1.5" />
                                        <span>{t('Confirm Sale')}</span>
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
                                    <div className="text-3xl font-bold text-gray-900">{t('Company Name')}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-gray-900">{t('INVOICE')}</div>
                                    <div className="text-gray-600">{sale.reference}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content Section */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={animationVariants.staggerChildren}
                        className="flex-1 p-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-indigo-950 dark:to-blue-950"
                    >
                        {/* Sale Status and Info */}
                        <motion.div variants={animationVariants.fadeIn} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            <SaleInfoCard sale={sale} t={t} />
                            <CustomerInfoCard sale={sale} t={t} />
                        </motion.div>

                        {/* Sale Items */}
                        {sale.sale_items && sale.sale_items.length > 0 && (
                            <motion.div
                                variants={animationVariants.fadeIn}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                className="mb-6"
                            >
                                <Card className="shadow-2xl bg-gradient-to-br from-white via-teal-50/30 to-cyan-50/30 dark:from-gray-800 dark:via-teal-900/20 dark:to-cyan-900/20 backdrop-blur-xl border border-teal-200/50 dark:border-teal-800/50 overflow-hidden relative group">
                                    {/* Animated background gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    
                                    {/* Enhanced header bar */}
                                    <div className="h-3 w-full bg-gradient-to-r from-teal-500 to-cyan-400 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                                    </div>
                                    
                                    <CardHeader className="pb-3 border-b border-teal-100/50 dark:border-teal-800/50 bg-gradient-to-r from-teal-50/50 to-cyan-50/50 dark:from-teal-900/20 dark:to-cyan-900/20">
                                        <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center font-bold">
                                            <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 mr-3 shadow-lg">
                                                <Package className="h-5 w-5 text-white" />
                                            </div>
                                            {t('Sale Items')} ({saleCalculations.totalItems} items, {saleCalculations.totalQuantity} total quantity)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gradient-to-r from-teal-50/80 to-cyan-50/80 dark:from-teal-900/50 dark:to-cyan-900/50 rounded-t-lg">
                                                    <tr>
                                                        <th scope="col" className="px-4 py-4 w-16 rounded-tl-lg font-semibold">#</th>
                                                        <th scope="col" className="px-4 py-4 font-semibold">{t('Product')}</th>
                                                        <th scope="col" className="px-4 py-4 text-center font-semibold">{t('Unit')}</th>
                                                        <th scope="col" className="px-4 py-4 text-center font-semibold">{t('Quantity')}</th>
                                                        <th scope="col" className="px-4 py-4 text-center font-semibold">{t('Unit Price')}</th>
                                                        <th scope="col" className="px-4 py-4 text-right rounded-tr-lg font-semibold">{t('Total')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sale.sale_items.map((item, index) => (
                                                        <motion.tr
                                                            key={item.id || index}
                                                            className="bg-white/80 dark:bg-gray-800/80 border-b border-teal-100/50 dark:border-teal-800/50 hover:bg-teal-50/70 dark:hover:bg-teal-900/40 transition-all duration-300"
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.05, duration: 0.3 }}
                                                            whileHover={{ backgroundColor: 'rgba(20, 184, 166, 0.15)', scale: 1.005, boxShadow: '0 4px 12px rgba(20, 184, 166, 0.2)' }}
                                                        >
                                                            <td className="px-4 py-4 font-semibold text-gray-900 dark:text-white">{index + 1}</td>
                                                            <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">
                                                                <div className="flex items-center">
                                                                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 mr-3 shadow-sm">
                                                                        <Package className="h-4 w-4 text-white" />
                                                                    </div>
                                                                    {item.product?.name || 'Product'}
                                                                    {item.product?.barcode && (
                                                                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                                                            ({item.product.barcode})
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {item.batch && (
                                                                    <div className="mt-2 flex items-center space-x-2">
                                                                        <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 shadow-sm">
                                                                            <Package className="h-3 w-3 mr-1" />
                                                                            {item.batch.batch_number}
                                                                        </span>
                                                                        {item.batch.expiry_date && (
                                                                            <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium shadow-sm ${
                                                                                new Date(item.batch.expiry_date) < new Date() 
                                                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                                                                                    : Math.ceil((new Date(item.batch.expiry_date) - new Date()) / (1000 * 60 * 60 * 24)) <= 30
                                                                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                                                                                        : 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                                                                            }`}>
                                                                                <Clock className="h-3 w-3 mr-1" />
                                                                                {new Date(item.batch.expiry_date).toLocaleDateString()}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-4 text-center font-medium text-gray-700 dark:text-gray-300">{item.unit || '-'}</td>
                                                            <td className="px-4 py-4 text-center">
                                                                <span className="inline-block px-3 py-1.5 rounded-full bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 dark:from-teal-900/40 dark:to-cyan-900/40 dark:text-teal-300 font-semibold shadow-sm">
                                                                    {item.quantity/item.unit_amount || 0}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-4 text-center">
                                                                <span className="text-gray-800 dark:text-gray-200 font-medium">
                                                                    {typeof sale.currency === 'object'
                                                                        ? sale.currency?.code || sale.currency?.symbol || '-'
                                                                        : String(sale.currency || '-')} {parseFloat(item.unit_price || 0).toFixed(2)}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-4 text-right font-semibold">
                                                                <span className="text-teal-700 dark:text-teal-300">
                                                                    {typeof sale.currency === 'object'
                                                                        ? sale.currency?.code || sale.currency?.symbol || '-'
                                                                        : String(sale.currency || '-')} {parseFloat(item.total || 0).toFixed(2)}
                                                                </span>
                                                            </td>
                                                        </motion.tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr className="font-semibold text-gray-900 dark:text-white border-t-2 border-teal-200 dark:border-teal-800 bg-gradient-to-r from-teal-50/50 to-cyan-50/50 dark:from-teal-900/20 dark:to-cyan-900/20">
                                                        <td colSpan="5" className="px-4 py-4 text-right">{t('Subtotal')}:</td>
                                                        <td className="px-4 py-4 text-right font-bold">{typeof sale.currency === 'object'
                                                            ? sale.currency?.code || sale.currency?.symbol || '-'
                                                            : String(sale.currency || '-')} {parseFloat(sale.total || 0).toFixed(2)}</td>
                                                    </tr>
                                                    {sale.tax_percentage > 0 && (
                                                        <tr className="text-gray-900 dark:text-white bg-gradient-to-r from-teal-50/30 to-cyan-50/30 dark:from-teal-900/10 dark:to-cyan-900/10">
                                                            <td colSpan="5" className="px-4 py-3 text-right">{t('Tax')} ({sale.tax_percentage}%):</td>
                                                            <td className="px-4 py-3 text-right font-semibold">{typeof sale.currency === 'object'
                                                                ? sale.currency?.code || sale.currency?.symbol || '-'
                                                                : String(sale.currency || '-')} {parseFloat(sale.tax_amount || 0).toFixed(2)}</td>
                                                        </tr>
                                                    )}
                                                    {sale.discount_percentage > 0 && (
                                                        <tr className="text-gray-900 dark:text-white bg-gradient-to-r from-teal-50/30 to-cyan-50/30 dark:from-teal-900/10 dark:to-cyan-900/10">
                                                            <td colSpan="5" className="px-4 py-3 text-right">{t('Discount')} ({sale.discount_percentage}%):</td>
                                                            <td className="px-4 py-3 text-right text-pink-600 dark:text-pink-400 font-semibold">-{typeof sale.currency === 'object'
                                                                ? sale.currency?.code || sale.currency?.symbol || '-'
                                                                : String(sale.currency || '-')} {parseFloat(sale.discount_amount || 0).toFixed(2)}</td>
                                                        </tr>
                                                    )}
                                                    {sale.shipping_cost > 0 && (
                                                        <tr className="text-gray-900 dark:text-white bg-gradient-to-r from-teal-50/30 to-cyan-50/30 dark:from-teal-900/10 dark:to-cyan-900/10">
                                                            <td colSpan="5" className="px-4 py-3 text-right">{t('Shipping')}:</td>
                                                            <td className="px-4 py-3 text-right font-semibold">{typeof sale.currency === 'object'
                                                                ? sale.currency?.code || sale.currency?.symbol || '-'
                                                                : String(sale.currency || '-')} {parseFloat(sale.shipping_cost || 0).toFixed(2)}</td>
                                                        </tr>
                                                    )}
                                                    <motion.tr
                                                        className="font-bold text-gray-900 dark:text-white text-lg border-t-2 border-teal-200 dark:border-teal-800 bg-gradient-to-r from-teal-100/50 to-cyan-100/50 dark:from-teal-800/30 dark:to-cyan-800/30"
                                                        whileHover={{ scale: 1.01 }}
                                                    >
                                                        <td colSpan="5" className="px-4 py-4 text-right">{t('Total')}:</td>
                                                        <td className="px-4 py-4 text-right bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-r">
                                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-teal-400 dark:to-cyan-300 font-bold text-xl">
                                                                {typeof sale.currency === 'object'
                                                                    ? sale.currency?.code || sale.currency?.symbol || '-'
                                                                    : String(sale.currency || '-')} {parseFloat(sale.total_amount || 0).toFixed(2)}
                                                            </span>
                                                        </td>
                                                    </motion.tr>
                                                    <tr className="text-gray-900 dark:text-white bg-gradient-to-r from-teal-50/30 to-cyan-50/30 dark:from-teal-900/10 dark:to-cyan-900/10">
                                                        <td colSpan="5" className="px-4 py-3 text-right">{t('Paid Amount')}:</td>
                                                        <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-semibold">{typeof sale.currency === 'object'
                                                            ? sale.currency?.code || sale.currency?.symbol || '-'
                                                            : String(sale.currency || '-')} {parseFloat(sale.paid_amount || 0).toFixed(2)}</td>
                                                    </tr>
                                                    <motion.tr
                                                        className="font-semibold text-gray-900 dark:text-white bg-gradient-to-r from-amber-50/30 to-yellow-50/30 dark:from-amber-900/10 dark:to-yellow-900/10"
                                                        animate={{ backgroundColor: ['rgba(251, 191, 36, 0.1)', 'rgba(251, 191, 36, 0.2)', 'rgba(251, 191, 36, 0.1)'] }}
                                                        transition={{ repeat: Infinity, duration: 3 }}
                                                    >
                                                        <td colSpan="5" className="px-4 py-3 text-right">{t('Due Amount')}:</td>
                                                        <td className="px-4 py-3 text-right text-amber-600 dark:text-amber-400 font-bold">{typeof sale.currency === 'object'
                                                            ? sale.currency?.code || sale.currency?.symbol || '-'
                                                            : String(sale.currency || '-')} {parseFloat(saleCalculations.dueAmount || 0).toFixed(2)}</td>
                                                    </motion.tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Batch Information */}
                        {sale.sale_items && sale.sale_items.some(item => item.batch) && (
                            <motion.div
                                variants={animationVariants.fadeIn}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                className="mb-6"
                            >
                                {/* Batch Summary Card */}
                                <motion.div
                                    variants={animationVariants.slideIn}
                                    className="mb-4"
                                >
                                    <Card className="shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-orange-200 dark:border-orange-800 overflow-hidden">
                                        <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-amber-400"></div>
                                        <CardContent className="pt-4">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {(() => {
                                                    const itemsWithBatches = sale.sale_items.filter(item => item.batch);
                                                    const totalQuantity = itemsWithBatches.reduce((sum, item) => sum + (item.quantity || 0), 0);
                                                    const expiredItems = itemsWithBatches.filter(item => {
                                                        const expiryDate = item.batch?.expiry_date ? new Date(item.batch.expiry_date) : null;
                                                        return expiryDate && expiryDate < new Date();
                                                    });
                                                    const expiringSoonItems = itemsWithBatches.filter(item => {
                                                        const expiryDate = item.batch?.expiry_date ? new Date(item.batch.expiry_date) : null;
                                                        const today = new Date();
                                                        const daysUntilExpiry = expiryDate ? Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24)) : null;
                                                        return expiryDate && daysUntilExpiry <= 30 && daysUntilExpiry > 0;
                                                    });
                                                    const validItems = itemsWithBatches.filter(item => {
                                                        const expiryDate = item.batch?.expiry_date ? new Date(item.batch.expiry_date) : null;
                                                        const today = new Date();
                                                        const daysUntilExpiry = expiryDate ? Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24)) : null;
                                                        return !expiryDate || (daysUntilExpiry > 30);
                                                    });

                                                    return (
                                                        <>
                                                            <motion.div
                                                                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                                                className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20"
                                                            >
                                                                <Package className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                                                                <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                                                                    {itemsWithBatches.length}
                                                                </div>
                                                                <div className="text-sm text-orange-600 dark:text-orange-400">
                                                                    {t('Items with Batches')}
                                                                </div>
                                                            </motion.div>
                                                            <motion.div
                                                                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                                                className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20"
                                                            >
                                                                <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                                                                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                                                                    {validItems.length}
                                                                </div>
                                                                <div className="text-sm text-green-600 dark:text-green-400">
                                                                    {t('Valid Items')}
                                                                </div>
                                                            </motion.div>
                                                            <motion.div
                                                                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                                                className="text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20"
                                                            >
                                                                <Clock className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                                                                <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                                                                    {expiringSoonItems.length}
                                                                </div>
                                                                <div className="text-sm text-amber-600 dark:text-amber-400">
                                                                    {t('Expiring Soon')}
                                                                </div>
                                                            </motion.div>
                                                            <motion.div
                                                                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                                                className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20"
                                                            >
                                                                <XCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                                                                <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                                                                    {expiredItems.length}
                                                                </div>
                                                                <div className="text-sm text-red-600 dark:text-red-400">
                                                                    {t('Expired Items')}
                                                                </div>
                                                            </motion.div>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <Card className="shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-orange-100 dark:border-orange-900/30 overflow-hidden">
                                    <div className="h-2 w-full bg-gradient-to-r from-orange-500 to-amber-400"></div>
                                    <CardHeader className="pb-2 border-b border-orange-100 dark:border-orange-900/30">
                                        <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center">
                                            <Package className="h-4 w-4 mr-2 text-orange-500" />
                                            {t('Batch Information')} ({sale.sale_items.filter(item => item.batch).length} items with batches)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/40 dark:to-amber-900/40">
                                                    <tr>
                                                        <th scope="col" className="px-4 py-3 w-16 rounded-tl-lg">#</th>
                                                        <th scope="col" className="px-4 py-3">{t('Product')}</th>
                                                        <th scope="col" className="px-4 py-3 text-center">{t('Batch Number')}</th>
                                                        <th scope="col" className="px-4 py-3 text-center">{t('Wholesale Price')}</th>
                                                        <th scope="col" className="px-4 py-3 text-center">{t('Retail Price')}</th>
                                                        <th scope="col" className="px-4 py-3 text-center">{t('Expiry Date')}</th>
                                                        <th scope="col" className="px-4 py-3 text-center">{t('Status')}</th>
                                                        <th scope="col" className="px-4 py-3 text-right rounded-tr-lg">{t('Quantity')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sale.sale_items
                                                        .filter(item => item.batch)
                                                        .map((item, index) => {
                                                            const batch = item.batch;
                                                            const expiryDate = batch?.expiry_date ? new Date(batch.expiry_date) : null;
                                                            const today = new Date();
                                                            const daysUntilExpiry = expiryDate ? Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24)) : null;
                                                            
                                                            let expiryStatus = 'normal';
                                                            let statusColor = 'text-green-600 dark:text-green-400';
                                                            let statusBg = 'bg-green-100 dark:bg-green-900/40';
                                                            
                                                            if (expiryDate) {
                                                                if (expiryDate < today) {
                                                                    expiryStatus = 'expired';
                                                                    statusColor = 'text-red-600 dark:text-red-400';
                                                                    statusBg = 'bg-red-100 dark:bg-red-900/40';
                                                                } else if (daysUntilExpiry <= 30) {
                                                                    expiryStatus = 'expiring_soon';
                                                                    statusColor = 'text-amber-600 dark:text-amber-400';
                                                                    statusBg = 'bg-amber-100 dark:bg-amber-900/40';
                                                                }
                                                            }

                                                            return (
                                                                <motion.tr
                                                                    key={`${item.id}-${batch?.id}`}
                                                                    className="bg-white dark:bg-gray-800 border-b border-orange-100 dark:border-orange-900/30 hover:bg-orange-50/50 dark:hover:bg-orange-900/30"
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                                                    whileHover={{ backgroundColor: 'rgba(249, 115, 22, 0.1)', scale: 1.005 }}
                                                                >
                                                                    <td className="px-4 py-3">{index + 1}</td>
                                                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                                                        <div className="flex items-center">
                                                                            <Package className="h-4 w-4 text-orange-500 mr-2" />
                                                                            {item.product?.name || 'Product'}
                                                                            {item.product?.barcode && (
                                                                                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                                                                    ({item.product.barcode})
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-center">
                                                                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 font-medium">
                                                                            {batch?.batch_number || 'N/A'}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-center">
                                                                        <span className="text-gray-800 dark:text-gray-200">
                                                                            {typeof sale.currency === 'object'
                                                                                ? sale.currency?.code || sale.currency?.symbol || '-'
                                                                                : String(sale.currency || '-')} {parseFloat(batch?.wholesale_price || 0).toFixed(2)}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-center">
                                                                        <span className="text-gray-800 dark:text-gray-200">
                                                                            {typeof sale.currency === 'object'
                                                                                ? sale.currency?.code || sale.currency?.symbol || '-'
                                                                                : String(sale.currency || '-')} {parseFloat(batch?.retail_price || 0).toFixed(2)}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-center">
                                                                        {expiryDate ? (
                                                                            <div className="flex flex-col items-center">
                                                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                                                    {expiryDate.toLocaleDateString()}
                                                                                </span>
                                                                                {daysUntilExpiry !== null && (
                                                                                    <span className={`text-xs ${daysUntilExpiry < 0 ? 'text-red-600' : daysUntilExpiry <= 30 ? 'text-amber-600' : 'text-green-600'}`}>
                                                                                        {daysUntilExpiry < 0 
                                                                                            ? `${Math.abs(daysUntilExpiry)} days expired`
                                                                                            : daysUntilExpiry <= 30 
                                                                                                ? `${daysUntilExpiry} days left`
                                                                                                : `${daysUntilExpiry} days left`
                                                                                        }
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-gray-400 dark:text-gray-500">-</span>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-center">
                                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBg} ${statusColor}`}>
                                                                            {expiryStatus === 'expired' && <XCircle className="h-3 w-3 mr-1" />}
                                                                            {expiryStatus === 'expiring_soon' && <Clock className="h-3 w-3 mr-1" />}
                                                                            {expiryStatus === 'normal' && <CheckCircle className="h-3 w-3 mr-1" />}
                                                                            {expiryStatus === 'expired' ? t('Expired') : 
                                                                             expiryStatus === 'expiring_soon' ? t('Expiring Soon') : 
                                                                             t('Valid')}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-right font-medium">
                                                                        <span className="text-orange-700 dark:text-orange-300">
                                                                            {item.quantity/item.batch.unit_amount || 0} {item.batch.unit_name}
                                                                        </span>
                                                                    </td>
                                                                </motion.tr>
                                                            );
                                                        })}
                                                </tbody>
                                                <tfoot>
                                                    <tr className="font-semibold text-gray-900 dark:text-white border-t-2 border-orange-200 dark:border-orange-800">
                                                        <td colSpan="7" className="px-4 py-3 text-right">{t('Total Items with Batches')}:</td>
                                                        <td className="px-4 py-3 text-right text-orange-700 dark:text-orange-300">
                                                            {sale.sale_items.filter(item => item.batch).reduce((sum, item) => sum + (item.quantity || 0), 0)}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Empty State for No Batches */}
                        {sale.sale_items && sale.sale_items.length > 0 && !sale.sale_items.some(item => item.batch) && (
                            <motion.div
                                variants={animationVariants.fadeIn}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                className="mb-6"
                            >
                                <Card className="shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="h-2 w-full bg-gradient-to-r from-gray-400 to-gray-500"></div>
                                    <CardHeader className="pb-2 border-b border-gray-200 dark:border-gray-700">
                                        <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center">
                                            <Package className="h-4 w-4 mr-2 text-gray-500" />
                                            {t('Batch Information')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="text-center py-8">
                                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('No Batch Information')}</h3>
                                            <p className="text-gray-500 dark:text-gray-400">{t('None of the items in this sale have batch information associated with them.')}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Payment History */}
                        {sale.payments && sale.payments.length > 0 ? (
                            <motion.div
                                variants={animationVariants.fadeIn}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            >
                                <Card className="shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-emerald-100 dark:border-emerald-900/30 overflow-hidden">
                                    <div className="h-2 w-full bg-gradient-to-r from-emerald-500 to-green-400"></div>
                                    <CardHeader className="pb-2 border-b border-emerald-100 dark:border-emerald-900/30">
                                        <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center">
                                            <CreditCard className="h-4 w-4 mr-2 text-emerald-500" />
                                            {t('Payment History')} ({sale.payments.length} payments, {saleCalculations.totalPayments.toFixed(2)} total)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/40">
                                                    <tr>
                                                        <th scope="col" className="px-4 py-3 rounded-tl-lg">{t('Date')}</th>
                                                        <th scope="col" className="px-4 py-3">{t('Reference')}</th>
                                                        <th scope="col" className="px-4 py-3">{t('Payment Method')}</th>
                                                        <th scope="col" className="px-4 py-3 text-right rounded-tr-lg">{t('Amount')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-emerald-100 dark:divide-emerald-900/30">
                                                    {sale.payments.map((payment, index) => (
                                                        <motion.tr
                                                            key={payment.id}
                                                            className="bg-white dark:bg-gray-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/30"
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.05, duration: 0.3 }}
                                                            whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', scale: 1.005 }}
                                                        >
                                                            <td className="px-4 py-3 font-medium">{payment.payment_date || payment.date}</td>
                                                            <td className="px-4 py-3">{payment.reference || '-'}</td>
                                                            <td className="px-4 py-3">
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                                                                    {payment.payment_method || 'Manual'}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-right font-medium text-emerald-700 dark:text-emerald-300">
                                                                {typeof payment.currency === 'object'
                                                                    ? payment.currency?.code || payment.currency?.symbol
                                                                    : String(payment.currency || (typeof sale.currency === 'object'
                                                                        ? sale.currency?.code || sale.currency?.symbol
                                                                        : String(sale.currency || '-')))} {parseFloat(payment.amount).toFixed(2)}
                                                            </td>
                                                        </motion.tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 font-semibold">
                                                        <td colSpan="3" className="px-4 py-3 text-right">{t('Total Payments')}:</td>
                                                        <td className="px-4 py-3 text-right text-emerald-700 dark:text-emerald-300">
                                                            {typeof sale.currency === 'object'
                                                                ? sale.currency?.code || sale.currency?.symbol || '-'
                                                                : String(sale.currency || '-')} {parseFloat(saleCalculations.totalPayments).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div
                                variants={animationVariants.fadeIn}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            >
                                <Card className="shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="h-2 w-full bg-gradient-to-r from-gray-400 to-gray-500"></div>
                                    <CardHeader className="pb-2 border-b border-gray-200 dark:border-gray-700">
                                        <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center">
                                            <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                                            {t('Payment History')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="text-center py-8">
                                            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('No Payments Yet')}</h3>
                                            <p className="text-gray-500 dark:text-gray-400 mb-4">{t('No payments have been recorded for this sale.')}</p>
                                            {sale.status === 'pending' && saleCalculations.dueAmount > 0 && (
                                                <Button
                                                    size="sm"
                                                    className="bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white"
                                                    onClick={showPaymentModal}
                                                    disabled={processing || loading}
                                                >
                                                    <BanknoteIcon className="h-4 w-4 mr-1.5" />
                                                    <span>{t('Add First Payment')}</span>
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Empty State for No Sale Items */}
                        {(!sale.sale_items || sale.sale_items.length === 0) && (
                            <motion.div
                                variants={animationVariants.fadeIn}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                className="mb-6"
                            >
                                <Card className="shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="h-2 w-full bg-gradient-to-r from-gray-400 to-gray-500"></div>
                                    <CardHeader className="pb-2 border-b border-gray-200 dark:border-gray-700">
                                        <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center">
                                            <Package className="h-4 w-4 mr-2 text-gray-500" />
                                            {t('Sale Items')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="text-center py-8">
                                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('No Items Found')}</h3>
                                            <p className="text-gray-500 dark:text-gray-400">{t('This sale does not have any items associated with it.')}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Payment Modal */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-6 border w-1/2 shadow-xl rounded-lg bg-white">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                <BanknoteIcon className="h-6 w-6 mr-2 text-indigo-600" />
                                {t('Add Payment')}
                            </h3>
                            <button
                                onClick={closePaymentModal}
                                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handlePaymentSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700">
                                    {t('Amount')} ({t('Due')}: {typeof sale.currency === 'object'
                                        ? sale.currency?.code || sale.currency?.symbol || '-'
                                        : String(sale.currency || '-')} {parseFloat(sale.due_amount || 0).toFixed(2)})
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    id="paymentAmount"
                                    name="paymentAmount"
                                    max={sale.due_amount}
                                    required
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700">
                                    {t('Date')}
                                </label>
                                <input
                                    type="date"
                                    id="paymentDate"
                                    name="paymentDate"
                                    required
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="paymentNotes" className="block text-sm font-medium text-gray-700">
                                    {t('Notes')}
                                </label>
                                <textarea
                                    id="paymentNotes"
                                    name="paymentNotes"
                                    rows="3"
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={closePaymentModal}
                                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                >
                                    {t('Cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || loading}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                                >
                                    {t('Submit')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Print styles - Only applied when printing */}
            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                
                /* Enhanced card hover effects */
                .group:hover .group-hover\\:opacity-100 {
                    opacity: 1;
                }
                
                /* Glass morphism effect */
                .backdrop-blur-xl {
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                }
                
                /* Enhanced shadows */
                .shadow-2xl {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }
                
                /* Gradient text effect */
                .bg-clip-text {
                    -webkit-background-clip: text;
                    background-clip: text;
                }
                
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
                    
                    /* Enhanced print styling for cards */
                    .shadow-2xl {
                        box-shadow: none !important;
                        border: 1px solid #ddd !important;
                    }
                    
                    .bg-gradient-to-br {
                        background: none !important;
                    }
                    
                    .backdrop-blur-xl {
                        backdrop-filter: none !important;
                    }
                }
            `}</style>
        </>
    );
}
