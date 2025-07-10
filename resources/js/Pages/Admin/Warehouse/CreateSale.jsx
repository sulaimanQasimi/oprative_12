import React, { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Building2,
    ArrowLeft,
    TrendingDown,
    Package,
    DollarSign,
    Hash,
    Calculator,
    ShoppingCart,
    Save,
    AlertCircle,
    AlertTriangle,
    Weight,
    Package2,
    CheckCircle,
    Sparkles,
    Users,
    Plus,
    Trash2,
    Edit,
    X
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Badge } from "@/Components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function CreateSale({ auth, warehouse, warehouseProducts, customers }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [saleItems, setSaleItems] = useState([]);
    const [currentItem, setCurrentItem] = useState({
        product_id: '',
        batch_id: '',
        quantity: '',
        price: '',
        unit_type: ''
    });

    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        sale_items: [],
        notes: '',
    });

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Update selected customer when customer_id changes
    useEffect(() => {
        if (data.customer_id && customers) {
            const customer = customers.find(c => c.id === parseInt(data.customer_id));
            setSelectedCustomer(customer || null);
        } else {
            setSelectedCustomer(null);
        }
    }, [data.customer_id, customers]);

    // Update form data when sale items change
    useEffect(() => {
        setData('sale_items', saleItems);
    }, [saleItems]);

    const getSelectedProduct = (productId) => {
        // Ensure warehouseProducts is an array
        const products = Array.isArray(warehouseProducts) ? warehouseProducts : [];
        return products.find(p => p.id === parseInt(productId)) || null;
    };

    const getSelectedBatch = (productId, batchId) => {
        const product = getSelectedProduct(productId);
        return product?.available_batches?.find(b => b.id === parseInt(batchId)) || null;
    };

    const getAvailableUnits = (product, batch) => {
        const units = [];

        if (batch) {
            // Use batch unit information
            if (batch.unit_name && batch.unit_amount) {
                units.push({
                    type: 'batch_unit',
                    label: `${batch.unit_name} (${batch.remaining_quantity}/${batch.unit_amount} ${batch.unit_name})`,
                    amount: batch.unit_amount,
                    price: batch.wholesale_price || batch.retail_price || 0,
                    unit_name: batch.unit_name
                });
            }
        } else if (product) {
            // Fallback to product unit information if no batch
            if (product.unit && product.whole_sale_unit_amount) {
                units.push({
                    type: 'wholesale',
                    label: `${product.unit.name} (${product.unit.code})`,
                    amount: product.whole_sale_unit_amount,
                    price: product.wholesale_price
                });
            }

            if (product.unit) {
                units.push({
                    type: 'retail',
                    label: `${product.unit.name} (${product.unit.code})`,
                    amount: 1,
                    price: product.retail_price
                });
            }
        }

        return units;
    };

    const getAvailableStock = (product, unitType, batchId = null) => {
        if (!product) return 0;
        
        // If a specific batch is selected, use its remaining quantity
        if (batchId) {
            const batch = getSelectedBatch(product.id, batchId);
            if (batch) {
                let stock = batch.remaining_quantity || 0;
                if (unitType === 'batch_unit' && batch.unit_amount) {
                    stock = Math.floor(stock / batch.unit_amount);
                } else if (unitType === 'wholesale' && product.whole_sale_unit_amount) {
                    stock = Math.floor(stock / product.whole_sale_unit_amount);
                }
                return stock;
            }
            return 0;
        }
        
        // Otherwise, use total product stock
        let stock = product.stock_quantity || 0;
        if (unitType === 'wholesale' && product.whole_sale_unit_amount) {
            stock = Math.floor(stock / product.whole_sale_unit_amount);
        }
        return stock;
    };

    const calculateActualQuantity = (product, unitType, quantity, batch = null) => {
        let actualQuantity = parseFloat(quantity) || 0;
        
        if (unitType === 'batch_unit' && batch?.unit_amount) {
            actualQuantity = actualQuantity * batch.unit_amount;
        } else if (unitType === 'wholesale' && product?.whole_sale_unit_amount) {
            actualQuantity = actualQuantity * product.whole_sale_unit_amount;
        }
        
        return actualQuantity;
    };

    const addItemToSale = () => {
        const product = getSelectedProduct(currentItem.product_id);
        const batch = getSelectedBatch(currentItem.product_id, currentItem.batch_id);
        
        if (!product || !currentItem.quantity || !currentItem.price || !currentItem.batch_id) {
            return;
        }

        const actualQuantity = calculateActualQuantity(product, currentItem.unit_type, currentItem.quantity, batch);
        const totalPrice = actualQuantity * parseFloat(currentItem.price);

        const newItem = {
            id: Date.now(), // Temporary ID for frontend
            product_id: parseInt(currentItem.product_id),
            batch_id: parseInt(currentItem.batch_id),
            product: product,
            batch: batch,
            unit_type: currentItem.unit_type,
            entered_quantity: parseFloat(currentItem.quantity),
            actual_quantity: actualQuantity,
            unit_price: parseFloat(currentItem.price),
            total_price: currentItem.price*currentItem.quantity
        };

        setSaleItems([...saleItems, newItem]);
        
        // Reset current item
        setCurrentItem({
            product_id: '',
            batch_id: '',
            quantity: '',
            price: '',
            unit_type: 'batch_unit'
        });
    };

    const removeItemFromSale = (itemId) => {
        setSaleItems(saleItems.filter(item => item.id !== itemId));
    };

    const updateItemInSale = (itemId, updatedItem) => {
        setSaleItems(saleItems.map(item => 
            item.id === itemId ? { ...item, ...updatedItem } : item
        ));
    };

    const getTotalSaleAmount = () => {
        return saleItems.reduce((sum, item) => sum + item.total_price, 0);
    };

    const getTotalItems = () => {
        return saleItems.reduce((sum, item) => sum + item.entered_quantity, 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (saleItems.length === 0) {
            return;
        }

        setLoading(true);
        
        const submissionData = {
            customer_id: data.customer_id,
            sale_items: saleItems.map(item => ({
                product_id: item.product_id,
                batch_id: item.batch_id,
                quantity: item.actual_quantity,
                unit_price: item.unit_price,
                total_price: item.total_price
            })),
            notes: data.notes
        };

        router.post(route('admin.warehouses.sales.store', warehouse.id), submissionData, {
            onFinish: () => setLoading(false),
            onError: (errors) => {
                console.log('Submission errors:', errors);
                setLoading(false);
            },
            onSuccess: () => {
                setLoading(false);
            }
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AFN',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const currentProduct = getSelectedProduct(currentItem.product_id);
    const currentBatch = getSelectedBatch(currentItem.product_id, currentItem.batch_id);
    const currentAvailableStock = getAvailableStock(currentProduct, currentItem.unit_type, currentItem.batch_id);
    const currentStockWarning = currentItem.quantity && parseFloat(currentItem.quantity) > currentAvailableStock;

    return (
        <>
            <Head title={`${warehouse?.name} - ${t("Create Sale")}`}>
                <style>{`
                    @keyframes shimmer {
                        0% { background-position: -1000px 0; }
                        100% { background-position: 1000px 0; }
                    }

                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }

                    @keyframes pulse-glow {
                        0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
                        50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
                    }

                    .shimmer {
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                        background-size: 1000px 100%;
                        animation: shimmer 2s infinite;
                    }

                    .float-animation {
                        animation: float 6s ease-in-out infinite;
                    }

                    .pulse-glow {
                        animation: pulse-glow 2s ease-in-out infinite;
                    }

                    .glass-effect {
                        background: rgba(255, 255, 255, 0.1);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                    }

                    .dark .glass-effect {
                        background: rgba(0, 0, 0, 0.2);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    }

                    .gradient-border {
                        background: linear-gradient(white, white) padding-box,
                                    linear-gradient(45deg, #3b82f6, #6366f1) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #3b82f6, #6366f1) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={TrendingDown} color="blue" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.warehouses" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="glass-effect border-b border-white/20 dark:border-slate-700/50 py-6 px-8 sticky top-0 z-30"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative float-animation"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 p-4 rounded-2xl shadow-2xl">
                                        <ShoppingCart className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {warehouse?.name} - {t("Create Sale")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent"
                                    >
                                        {t("Create Sale")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Package className="w-4 h-4" />
                                        {t("Create a new sale with multiple products")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Link href={route("admin.warehouses.sales", warehouse.id)}>
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-all duration-200 border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Sales")}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="max-w-6xl mx-auto"
                            >
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Customer Selection */}
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.5 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                                        <Users className="h-6 w-6 text-white" />
                                                    </div>
                                                    {t("Customer Information")}
                                                    <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                        {t("Required")}
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8">
                                                <div className="space-y-3">
                                                    <Label htmlFor="customer_id" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                        <Users className="w-5 h-5 text-indigo-500" />
                                                        {t("Customer/Store")} *
                                                    </Label>
                                                    <Select
                                                        value={data.customer_id}
                                                        onValueChange={(value) => setData('customer_id', value)}
                                                    >
                                                        <SelectTrigger className={`h-14 text-lg border-2 transition-all duration-200 ${errors.customer_id ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-indigo-300 focus:border-indigo-500'} bg-white dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400`}>
                                                            <SelectValue placeholder={t("Select customer/store")} />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                            {customers && customers.length > 0 ? customers.map((customer) => (
                                                                                                                                    <SelectItem key={customer.id} value={customer.id.toString()} className="p-4 hover:bg-slate-100 dark:hover:bg-slate-700">
                                                                        <div className="flex items-center space-x-4">
                                                                            <div className="p-2 bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-lg">
                                                                                <Users className="h-5 w-5 text-indigo-600" />
                                                                            </div>
                                                                            <div>
                                                                                <div className="font-semibold text-slate-800 dark:text-white">{customer.name}</div>
                                                                                <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                                                {customer.email && (
                                                                                    <>
                                                                                        <span>{customer.email}</span>
                                                                                        {customer.phone && <span>•</span>}
                                                                                    </>
                                                                                )}
                                                                                {customer.phone && <span>{customer.phone}</span>}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </SelectItem>
                                                            )) : (
                                                                <SelectItem value="" disabled>
                                                                    {t("No customers available")}
                                                                </SelectItem>
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.customer_id && (
                                                        <motion.p
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="text-sm text-red-600 font-medium flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="w-4 h-4" />
                                                            {errors.customer_id}
                                                        </motion.p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Add Product Item */}
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.0, duration: 0.5 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                                                        <Plus className="h-6 w-6 text-white" />
                                                    </div>
                                                    {t("Add Product to Sale")}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8 space-y-6">
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    {/* Product Selection */}
                                                    <div className="space-y-3">
                                                        <Label className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <Package className="w-5 h-5 text-blue-500" />
                                                            {t("Product")} *
                                                        </Label>
                                                        <Select
                                                            value={currentItem.product_id}
                                                            onValueChange={(value) => setCurrentItem({...currentItem, product_id: value, batch_id: '', unit_type: 'batch_unit', price: ''})}
                                                        >
                                                            <SelectTrigger className="h-12 text-base border-2 border-slate-200 hover:border-blue-300 focus:border-blue-500 bg-white dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400">
                                                                <SelectValue placeholder={t("Select a product")} />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                                {Array.isArray(warehouseProducts) ? warehouseProducts.filter(p => !saleItems.some(item => item.product_id === p.id)).map((product) => (
                                                                    <SelectItem key={product.id} value={product.id.toString()} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700">
                                                                        <div className="flex items-center space-x-3">
                                                                            <Package className="h-4 w-4 text-blue-600" />
                                                                            <div>
                                                                                <div className="font-semibold text-slate-800 dark:text-white">{product.name}</div>
                                                                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                                                                    Stock: {product.stock_quantity} | Batches: {product.available_batches?.length || 0}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </SelectItem>
                                                                )) : (
                                                                    <SelectItem value="" disabled>
                                                                        No products available
                                                                    </SelectItem>
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* Batch Selection */}
                                                    <div className="space-y-3">
                                                        <Label className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <Package2 className="w-5 h-5 text-indigo-500" />
                                                            {t("Batch")} *
                                                        </Label>
                                                        <Select
                                                            value={currentItem.batch_id}
                                                            onValueChange={(value) => {
                                                                const batch = getSelectedBatch(currentItem.product_id, value);
                                                                let unitType = 'batch_unit';
                                                                let unitPrice = '';
                                                                
                                                                if (batch && batch.unit_name && batch.unit_amount) {
                                                                    unitPrice = (batch.wholesale_price || batch.retail_price || 0).toString();
                                                                }
                                                                
                                                                setCurrentItem({...currentItem, batch_id: value, unit_type: unitType, price: unitPrice});
                                                            }}
                                                            disabled={!currentItem.product_id}
                                                        >
                                                            <SelectTrigger className="h-12 text-base border-2 border-slate-200 hover:border-indigo-300 focus:border-indigo-500 bg-white dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400">
                                                                <SelectValue placeholder={currentItem.product_id ? t("Select a batch") : t("Select product first")} />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                                {currentProduct?.available_batches?.filter(batch => batch.remaining_quantity > 0).sort((a, b) => {
                                                                    // Sort: valid batches first, then expiring soon, expired last
                                                                    if (a.expiry_status === 'valid' && b.expiry_status !== 'valid') return -1;
                                                                    if (b.expiry_status === 'valid' && a.expiry_status !== 'valid') return 1;
                                                                    if (a.expiry_status === 'expiring_soon' && b.expiry_status === 'expired') return -1;
                                                                    if (b.expiry_status === 'expiring_soon' && a.expiry_status === 'expired') return 1;
                                                                    return 0;
                                                                }).map((batch) => (
                                                                    <SelectItem key={batch.id} value={batch.id.toString()} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700">
                                                                        <div className="flex items-center space-x-3">
                                                                            <Package2 className={`h-4 w-4 ${
                                                                                batch.expiry_status === 'expired' ? 'text-red-600' :
                                                                                batch.expiry_status === 'expiring_soon' ? 'text-orange-600' :
                                                                                'text-indigo-600'
                                                                            }`} />
                                                                            <div className="flex-1">
                                                                                <div className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                                                                                    {batch.reference_number}
                                                                                    {batch.expiry_status === 'expired' && (
                                                                                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Expired</span>
                                                                                    )}
                                                                                    {batch.expiry_status === 'expiring_soon' && (
                                                                                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                                                                                            {batch.days_to_expiry} days left
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                                <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                                                                                    <div>{t('Remaining')}: <span className="font-medium text-green-600">{batch.remaining_quantity/batch.unit_amount} {batch.unit_name}</span></div>
                                                                                    {batch.expire_date && (
                                                                                        <div>{t('Expires')}: {new Date(batch.expire_date).toLocaleDateString()}</div>
                                                                                    )}
                                                                                    {batch.notes && (
                                                                                        <div className="italic">{batch.notes}</div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </SelectItem>
                                                                )) || (
                                                                    <SelectItem value="" disabled>
                                                                        {currentItem.product_id ? t("No available batches") : t("Select product first")}
                                                                    </SelectItem>
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    {/* Unit Type - Auto-determined from batch */}
                                                    <div className="space-y-3">
                                                        <Label className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <Weight className="w-5 h-5 text-orange-500" />
                                                            {t("Unit Type")}
                                                        </Label>
                                                        <div className="h-12 flex items-center px-3 border-2 border-slate-200 bg-slate-50 dark:bg-slate-700 dark:border-slate-600 rounded-md">
                                                            <span className="text-slate-600 dark:text-slate-400">
                                                                {currentBatch && currentBatch.unit_name ? 
                                                                    `${currentBatch.remaining_quantity}/${currentBatch.unit_amount} ${currentBatch.unit_name}` : 
                                                                    t("Select batch to see unit")
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                    {/* Quantity */}
                                                    <div className="space-y-3">
                                                        <Label className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <Hash className="w-5 h-5 text-green-500" />
                                                            {t("Quantity")} *
                                                        </Label>
                                                        <Input
                                                        
                                                            type="number"
                                                            step="0.01"
                                                            min="0.01"
                                                            max={currentAvailableStock || undefined}
                                                            placeholder={t("Enter quantity")}
                                                            value={currentItem.quantity}
                                                            onChange={(e) => setCurrentItem({...currentItem, quantity: e.target.value})}
                                                            className={`dark:border-white h-12 text-base border-2 ${currentStockWarning ? 'border-red-500' : 'border-slate-200 hover:border-green-300 focus:border-green-500'} bg-white dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400`}
                                                        />
                                                        {currentProduct && currentItem.unit_type && currentItem.batch_id && (
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                Available from this batch: {currentBatch?.remaining_quantity}/{currentBatch?.unit_amount} {currentBatch?.unit_name}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Price */}
                                                    <div className="space-y-3">
                                                        <Label className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <DollarSign className="w-5 h-5 text-purple-500" />
                                                            {t("Unit Price")} *
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            placeholder={t("Enter price")}
                                                            value={currentItem.price}
                                                            onChange={(e) => setCurrentItem({...currentItem, price: e.target.value})}
                                                            className="h-12 dark:border-white text-base border-2 border-slate-200 hover:border-purple-300 focus:border-purple-500 bg-white dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
                                                        />
                                                    </div>

                                                    {/* Add Button */}
                                                    <div className="space-y-3">
                                                        <Label className="text-slate-700 dark:text-slate-300 font-semibold text-lg opacity-0">
                                                            {t("Add")}
                                                        </Label>
                                                        <Button
                                                            type="button"
                                                            onClick={addItemToSale}
                                                            disabled={!currentItem.product_id || !currentItem.batch_id || !currentItem.quantity || !currentItem.price || currentStockWarning}
                                                            className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white gap-2"
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                            {t("Add Item")}
                                                        </Button>
                                                    </div>
                                                </div>

                                                {currentStockWarning && (
                                                    <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                                        <AlertDescription className="text-red-700 dark:text-red-400">
                                                            Insufficient stock in this batch! Maximum available: {currentBatch?.remaining_quantity}/{currentBatch?.unit_amount} {currentBatch?.unit_name}
                                                        </AlertDescription>
                                                    </Alert>
                                                )}

                                                {/* Batch Information Display */}
                                                <AnimatePresence>
                                                    {currentBatch && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <Alert className={`border-2 ${
                                                                currentBatch.expiry_status === 'expired' ? 'border-red-200 bg-red-50 dark:bg-red-900/20' :
                                                                currentBatch.expiry_status === 'expiring_soon' ? 'border-orange-200 bg-orange-50 dark:bg-orange-900/20' :
                                                                'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
                                                            }`}>
                                                                <Package2 className={`h-5 w-5 ${
                                                                    currentBatch.expiry_status === 'expired' ? 'text-red-600' :
                                                                    currentBatch.expiry_status === 'expiring_soon' ? 'text-orange-600' :
                                                                    'text-blue-600'
                                                                }`} />
                                                                <AlertDescription className={`${
                                                                    currentBatch.expiry_status === 'expired' ? 'text-red-700 dark:text-red-400' :
                                                                    currentBatch.expiry_status === 'expiring_soon' ? 'text-orange-700 dark:text-orange-400' :
                                                                    'text-blue-700 dark:text-blue-400'
                                                                }`}>
                                                                    <div className="space-y-2">
                                                                        <div className="font-medium flex items-center gap-2">
                                                                            Selected Batch: {currentBatch.reference_number}
                                                                            {currentBatch.expiry_status === 'expired' && (
                                                                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold">EXPIRED</span>
                                                                            )}
                                                                            {currentBatch.expiry_status === 'expiring_soon' && (
                                                                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold">
                                                                                    EXPIRES IN {currentBatch.days_to_expiry} DAYS
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="text-sm">
                                                                            Remaining: <span className="font-medium">{currentBatch.remaining_quantity}</span> pieces
                                                                            {currentBatch.expire_date && (
                                                                                <span> | Expires: {new Date(currentBatch.expire_date).toLocaleDateString()}</span>
                                                                            )}
                                                                        </div>
                                                                        {currentBatch.notes && (
                                                                            <div className="text-sm italic">Notes: {currentBatch.notes}</div>
                                                                        )}
                                                                    </div>
                                                                </AlertDescription>
                                                            </Alert>
                                                        </motion.div>
                                                                                                                        )}
                                                                </AnimatePresence>

                                                                {/* Expired Batch Warning */}
                                                                <AnimatePresence>
                                                                    {currentBatch && currentBatch.expiry_status === 'expired' && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, height: 0 }}
                                                                            animate={{ opacity: 1, height: "auto" }}
                                                                            exit={{ opacity: 0, height: 0 }}
                                                                            transition={{ duration: 0.3 }}
                                                                        >
                                                                            <Alert className="border-red-300 bg-red-100 dark:bg-red-900/30">
                                                                                <AlertTriangle className="h-5 w-5 text-red-600" />
                                                                                <AlertDescription className="text-red-800 dark:text-red-300">
                                                                                    <div className="space-y-1">
                                                                                        <div className="font-bold">⚠️ WARNING: This batch has expired!</div>
                                                                                        <div className="text-sm">
                                                                                            Selling expired products may violate health and safety regulations. 
                                                                                            Please verify if this is appropriate for your business requirements.
                                                                                        </div>
                                                                                    </div>
                                                                                </AlertDescription>
                                                                            </Alert>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Sale Items List */}
                                    <AnimatePresence>
                                        {saleItems.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 20 }}
                                                transition={{ duration: 0.4 }}
                                            >
                                                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                                    <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50">
                                                        <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                                                <ShoppingCart className="h-6 w-6 text-white" />
                                                            </div>
                                                            {t("Sale Items")}
                                                            <Badge className="ml-auto bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                                {saleItems.length} {t("items")}
                                                            </Badge>
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="p-0">
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full">
                                                                <thead className="bg-slate-50 dark:bg-slate-800">
                                                                    <tr>
                                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">{t("Product")}</th>
                                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">{t("Batch")}</th>
                                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">{t("Unit Type")}</th>
                                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">{t("Quantity")}</th>
                                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">{t("Unit Price")}</th>
                                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">{t("Total")}</th>
                                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">{t("Actions")}</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                                                    {saleItems.map((item, index) => (
                                                                        <motion.tr
                                                                            key={item.id}
                                                                            initial={{ opacity: 0, y: 20 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            exit={{ opacity: 0, y: -20 }}
                                                                            transition={{ delay: index * 0.1 }}
                                                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                                                        >
                                                                            <td className="px-6 py-4">
                                                                                <div className="flex items-center gap-3">
                                                                                    <Package className="h-5 w-5 text-blue-600" />
                                                                                    <div>
                                                                                        <div className="font-semibold text-slate-800 dark:text-white">{item.product.name}</div>
                                                                                        <div className="text-sm text-slate-500 dark:text-slate-400">{item.product.barcode}</div>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-6 py-4">
                                                                                <div className="flex items-center gap-2">
                                                                                    <Package2 className="h-4 w-4 text-indigo-600" />
                                                                                    <div>
                                                                                        <div className="font-semibold text-slate-800 dark:text-white">
                                                                                            {item.batch?.reference_number || 'N/A'}
                                                                                        </div>
                                                                                        {item.batch?.expire_date && (
                                                                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                                                                Exp: {new Date(item.batch.expire_date).toLocaleDateString()}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-6 py-4">
                                                                                <Badge variant="outline" className="capitalize">
                                                                                    {item.unit_type === 'batch_unit' && item.batch?.unit_name ? 
                                                                                        `${item.batch.remaining_quantity}/${item.batch.unit_amount} ${item.batch.unit_name}` : 
                                                                                        item.unit_type
                                                                                    }
                                                                                </Badge>
                                                                            </td>
                                                                            <td className="px-6 py-4">
                                                                                <div className="flex flex-col">
                                                                                    <span className="font-semibold text-slate-800 dark:text-white">
                                                                                        {item.unit_type === 'batch_unit' && item.batch?.unit_name ? 
                                                                                            `${item.entered_quantity} ${item.batch.unit_name}` : 
                                                                                            `${item.entered_quantity} units`
                                                                                        }
                                                                                    </span>
                                                                                    <span className="text-sm text-slate-500 dark:text-slate-400">({item.actual_quantity} pieces)</span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-6 py-4 font-semibold text-slate-800 dark:text-white">
                                                                                {formatCurrency(item.unit_price)}
                                                                            </td>
                                                                            <td className="px-6 py-4 font-bold text-green-600 dark:text-green-400">
                                                                                {formatCurrency(item.total_price)}
                                                                            </td>
                                                                            <td className="px-6 py-4">
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={() => removeItemFromSale(item.id)}
                                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
                                                                                </Button>
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
                                    </AnimatePresence>

                                    {/* Sale Summary */}
                                    <AnimatePresence>
                                        {saleItems.length > 0 && selectedCustomer && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                                transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                                            >
                                                <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-blue-900/30 backdrop-blur-xl">
                                                    <CardHeader className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-b border-blue-200/50 dark:border-blue-700/50">
                                                        <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                                                <Calculator className="h-6 w-6 text-white" />
                                                            </div>
                                                            {t("Sale Summary")}
                                                            <Badge className="ml-auto bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                {t("Ready")}
                                                            </Badge>
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="p-8 space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                            <div className="text-center p-6 bg-white/70 dark:bg-slate-800/70 rounded-2xl shadow-lg border border-blue-200/50 dark:border-blue-700/50">
                                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 flex items-center justify-center gap-2">
                                                                    <Package className="w-4 h-4" />
                                                                    {t("Total Items")}
                                                                </p>
                                                                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                                                    {saleItems.length}
                                                                </p>
                                                                <p className="text-xs text-slate-500 mt-1">{t("products")}</p>
                                                            </div>
                                                            <div className="text-center p-6 bg-white/70 dark:bg-slate-800/70 rounded-2xl shadow-lg border border-blue-200/50 dark:border-blue-700/50">
                                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 flex items-center justify-center gap-2">
                                                                    <Hash className="w-4 h-4" />
                                                                    {t("Total Quantity")}
                                                                </p>
                                                                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                                                    {getTotalItems().toLocaleString()}
                                                                </p>
                                                                <p className="text-xs text-slate-500 mt-1">{t("pieces")}</p>
                                                            </div>
                                                            <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl shadow-lg border-2 border-blue-300 dark:border-blue-700">
                                                                <p className="text-sm text-blue-700 dark:text-blue-400 mb-2 flex items-center justify-center gap-2">
                                                                    <DollarSign className="w-4 h-4" />
                                                                    {t("Total Amount")}
                                                                </p>
                                                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                                                    {formatCurrency(getTotalSaleAmount())}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{t("Customer")}:</p>
                                                            <p className="font-semibold text-slate-800 dark:text-white">{selectedCustomer.name}</p>
                                                            {selectedCustomer.email && (
                                                                <p className="text-xs text-slate-500 dark:text-slate-400">{selectedCustomer.email}</p>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Notes */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.4, duration: 0.4 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardHeader>
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                    <Package2 className="w-6 h-6 text-purple-500" />
                                                    {t("Additional Notes")}
                                                    <Badge variant="secondary" className="text-xs">
                                                        {t("Optional")}
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Textarea
                                                    placeholder={t("Enter any additional notes about this sale...")}
                                                    value={data.notes}
                                                    onChange={(e) => setData('notes', e.target.value)}
                                                    rows={4}
                                                    className="resize-none text-lg border-2 border-slate-200 hover:border-purple-300 focus:border-purple-500 bg-white dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
                                                />
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Submit Button */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.5, duration: 0.4 }}
                                        className="flex justify-end space-x-6 pt-6"
                                    >
                                        <Link href={route("admin.warehouses.sales", warehouse.id)}>
                                                                                    <Button
                                            type="button"
                                            variant="outline"
                                            className="px-8 py-4 text-lg border-2 hover:scale-105 transition-all duration-200 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white"
                                        >
                                            {t("Cancel")}
                                        </Button>
                                        </Link>
                                        <Button
                                            type="submit"
                                            disabled={processing || !data.customer_id || saleItems.length === 0}
                                            className={`px-8 py-4 text-lg shadow-2xl transition-all duration-200 ${
                                                !data.customer_id || saleItems.length === 0
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 hover:scale-105 hover:shadow-3xl'
                                            } text-white`}
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                                    {t("Creating...")}
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-5 w-5 mr-3" />
                                                    {t("Create Sale")}
                                                </>
                                            )}
                                        </Button>
                                    </motion.div>
                                </form>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
}
