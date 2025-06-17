import React, { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Building2,
    ArrowLeft,
    ArrowRightLeft,
    Package,
    DollarSign,
    Hash,
    Calculator,
    ShoppingCart,
    Save,
    AlertCircle,
    Barcode,
    Weight,
    Package2,
    CheckCircle,
    Info,
    Sparkles
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

export default function CreateTransfer({ auth, warehouse, warehouses, warehouseProducts }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [calculatedQuantity, setCalculatedQuantity] = useState(0);
    const [calculatedTotal, setCalculatedTotal] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        product_id: '',
        to_warehouse_id: '',
        unit_type: '',
        quantity: '',
        price: '',
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

    // Update selected product when product_id changes
    useEffect(() => {
        if (data.product_id) {
            const product = warehouseProducts.find(p => p.id === parseInt(data.product_id));
            setSelectedProduct(product);
        } else {
            setSelectedProduct(null);
        }
    }, [data.product_id, warehouseProducts]);

    // Calculate actual quantity and total
    useEffect(() => {
        if (selectedProduct && data.unit_type && data.quantity && data.price) {
            let actualQuantity = parseFloat(data.quantity) || 0;

            if (data.unit_type === 'wholesale' && selectedProduct.whole_sale_unit_amount) {
                actualQuantity = (parseFloat(data.quantity) || 0) * selectedProduct.whole_sale_unit_amount;
            }

            const total = actualQuantity * (parseFloat(data.price) || 0);

            setCalculatedQuantity(actualQuantity);
            setCalculatedTotal(total);
        } else {
            setCalculatedQuantity(0);
            setCalculatedTotal(0);
        }
    }, [selectedProduct, data.unit_type, data.quantity, data.price]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Calculate final quantity based on unit type before submission
        let finalQuantity = parseFloat(data.quantity) || 0;
        let finalTotal = parseFloat(data.price) || 0;

        if (data.unit_type === 'wholesale' && selectedProduct?.whole_sale_unit_amount) {
            // For wholesale: multiply entered quantity by wholesale unit amount
            finalQuantity = finalQuantity * selectedProduct.whole_sale_unit_amount;
        }

        // Calculate total based on final quantity and price
        finalTotal = finalQuantity * (parseFloat(data.price) || 0);
        console.log('Original data:', data);

        console.log('Final quantity to submit:', finalQuantity);
        console.log('Final total to submit:', finalTotal);

        // Create submission data with calculated values
        const submissionData = {
            product_id: data.product_id,
            to_warehouse_id: data.to_warehouse_id,
            unit_type: data.unit_type,
            quantity: finalQuantity,
            price: data.price,
            total: finalTotal,
            notes: data.notes
        };
        // Use router.post directly with calculated data
        router.post(route('admin.warehouses.transfers.store', warehouse.id), submissionData, {
            onFinish: () => setLoading(false),
            onError: (errors) => {
                console.log('Submission errors:', errors);
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

    const getUnitPrice = (product, unitType) => {
        if (!product) return 0;

        switch (unitType) {
            case 'wholesale':
                return product.wholesale_price || 0;
            case 'retail':
                return product.retail_price || 0;
            default:
                return 0;
        }
    };

    const handleUnitTypeChange = (unitType) => {
        setData('unit_type', unitType);

        // Auto-fill price based on unit type
        if (selectedProduct) {
            const price = getUnitPrice(selectedProduct, unitType);
            setData('price', price.toString());
        }
    };

    const getAvailableUnits = (product) => {
        const units = [];

        if (product?.wholesaleUnit && product.whole_sale_unit_amount) {
            units.push({
                type: 'wholesale',
                label: `${product.wholesaleUnit.name} (${product.wholesaleUnit.symbol})`,
                amount: product.whole_sale_unit_amount,
                price: product.wholesale_price
            });
        }

        if (product?.retailUnit) {
            units.push({
                type: 'retail',
                label: `${product.retailUnit.name} (${product.retailUnit.symbol})`,
                amount: 1,
                price: product.retail_price
            });
        }

        return units;
    };

    return (
        <>
            <Head title={`${warehouse?.name} - ${t("Create Transfer")}`}>
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
                        0%, 100% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.3); }
                        50% { box-shadow: 0 0 30px rgba(147, 51, 234, 0.6); }
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
                                    linear-gradient(45deg, #9333ea, #7c3aed) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #9333ea, #7c3aed) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={ArrowRightLeft} color="purple" />

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
                                        <ArrowRightLeft className="w-8 h-8 text-white" />
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
                                        {warehouse?.name} - {t("Create Transfer")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent"
                                    >
                                        {t("New Transfer Record")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Package className="w-4 h-4" />
                                        {t("Create a new transfer transaction between warehouses")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Link href={route("admin.warehouses.transfers", warehouse.id)}>
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-all duration-200 border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Transfers")}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-purple-300 dark:scrollbar-thumb-purple-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="max-w-5xl mx-auto"
                            >
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Form Card */}
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.5 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                                                        <ArrowRightLeft className="h-6 w-6 text-white" />
                                            </div>
                                            {t("Transfer Details")}
                                                    <Badge variant="secondary" className="ml-auto bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                                        {t("Required")}
                                                    </Badge>
                                        </CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                                    {t("Fill in the details for the new transfer record with proper unit calculations")}
                                        </CardDescription>
                                    </CardHeader>
                                            <CardContent className="p-8 space-y-8">
                                                {/* Error Alert */}
                                                <AnimatePresence>
                                                    {Object.keys(errors).length > 0 && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                        >
                                                            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 pulse-glow">
                                                                <AlertCircle className="h-5 w-5 text-red-600" />
                                                                <AlertDescription className="text-red-700 dark:text-red-400 font-medium">
                                                                    {t("Please correct the errors below and try again.")}
                                                                </AlertDescription>
                                                            </Alert>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {/* Product Selection */}
                                                    <motion.div
                                                        initial={{ x: -20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: 1.0, duration: 0.4 }}
                                                        className="space-y-3"
                                                    >
                                                        <Label htmlFor="product_id" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <Package className="w-5 h-5 text-purple-500" />
                                                            {t("Product")} *
                                                    </Label>
                                                        <Select
                                                            value={data.product_id}
                                                            onValueChange={(value) => setData('product_id', value)}
                                                        >
                                                            <SelectTrigger className={`h-14 text-lg border-2 transition-all duration-200 ${errors.product_id ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-purple-300 focus:border-purple-500'} bg-white dark:bg-slate-800`}>
                                                                <SelectValue placeholder={t("Select a product to transfer")} />
                                                        </SelectTrigger>
                                                            <SelectContent className="max-w-md">
                                                            {warehouseProducts.map((product) => (
                                                                    <SelectItem key={product.id} value={product.id.toString()} className="p-4">
                                                                        <div className="flex items-center space-x-4">
                                                                            <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
                                                                                <Package className="h-5 w-5 text-purple-600" />
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <div className="font-semibold text-slate-800 dark:text-white">{product.name}</div>
                                                                                <div className="text-sm text-slate-500 flex items-center gap-2">
                                                                                    <Barcode className="w-3 h-3" />
                                                                                    {product.barcode || product.type}
                                                                                    <Badge variant="outline" className="ml-2">
                                                                                        Stock: {product.stock_quantity}
                                                                                    </Badge>
                                                                                </div>
                                                                            </div>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.product_id && (
                                                            <motion.p
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="text-sm text-red-600 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                            {errors.product_id}
                                                            </motion.p>
                                                    )}
                                                    </motion.div>

                                                {/* Destination Warehouse */}
                                                    <motion.div
                                                        initial={{ x: 20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: 1.1, duration: 0.4 }}
                                                        className="space-y-3"
                                                    >
                                                        <Label htmlFor="to_warehouse_id" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <Building2 className="w-5 h-5 text-pink-500" />
                                                            {t("Destination Warehouse")} *
                                                    </Label>
                                                        <Select
                                                            value={data.to_warehouse_id}
                                                            onValueChange={(value) => setData('to_warehouse_id', value)}
                                                        >
                                                            <SelectTrigger className={`h-14 text-lg border-2 transition-all duration-200 ${errors.to_warehouse_id ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-pink-300 focus:border-pink-500'} bg-white dark:bg-slate-800`}>
                                                            <SelectValue placeholder={t("Select destination warehouse")} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {warehouses.filter(w => w.id !== warehouse.id).map((w) => (
                                                                    <SelectItem key={w.id} value={w.id.toString()} className="p-4">
                                                                        <div className="flex items-center space-x-4">
                                                                            <div className="p-2 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-lg">
                                                                                <Building2 className="h-5 w-5 text-pink-600" />
                                                                            </div>
                                                                        <div>
                                                                                <div className="font-semibold text-slate-800 dark:text-white">{w.name}</div>
                                                                                <div className="text-sm text-slate-500 flex items-center gap-2">
                                                                                    <Hash className="w-3 h-3" />
                                                                                    Code: {w.code}
                                                                                </div>
                                                                            </div>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.to_warehouse_id && (
                                                            <motion.p
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="text-sm text-red-600 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                            {errors.to_warehouse_id}
                                                            </motion.p>
                                                    )}
                                                    </motion.div>
                                                </div>

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                    {/* Unit Type Selection */}
                                                    <motion.div
                                                        initial={{ x: -20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: 1.2, duration: 0.4 }}
                                                        className="space-y-3"
                                                    >
                                                        <Label htmlFor="unit_type" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <Weight className="w-5 h-5 text-emerald-500" />
                                                            {t("Unit Type")} *
                                                        </Label>
                                                        <Select
                                                            value={data.unit_type}
                                                            onValueChange={handleUnitTypeChange}
                                                            disabled={!selectedProduct}
                                                        >
                                                            <SelectTrigger className={`h-14 text-lg border-2 transition-all duration-200 ${errors.unit_type ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-emerald-300 focus:border-emerald-500'} ${!selectedProduct ? 'opacity-50 cursor-not-allowed' : 'bg-white dark:bg-slate-800'}`}>
                                                                <SelectValue placeholder={selectedProduct ? t("Select unit type") : t("Select product first")} />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {selectedProduct && getAvailableUnits(selectedProduct).map((unit) => (
                                                                    <SelectItem key={unit.type} value={unit.type} className="p-4">
                                                                        <div className="flex items-center space-x-4">
                                                                            <div className="p-2 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-lg">
                                                                                <Weight className="h-5 w-5 text-emerald-600" />
                                                                            </div>
                                                                            <div>
                                                                                <div className="font-semibold text-slate-800 dark:text-white">{unit.label}</div>
                                                                                <div className="text-sm text-slate-500 flex items-center gap-2">
                                                                                    <DollarSign className="w-3 h-3" />
                                                                                    {formatCurrency(unit.price)} per unit
                                                                                    {unit.amount > 1 && (
                                                                                        <Badge variant="secondary" className="text-xs">
                                                                                            {unit.amount} pieces
                                                                                        </Badge>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.unit_type && (
                                                            <motion.p
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="text-sm text-red-600 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.unit_type}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>

                                                {/* Quantity */}
                                                    <motion.div
                                                        initial={{ x: 20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: 1.3, duration: 0.4 }}
                                                        className="space-y-3"
                                                    >
                                                        <Label htmlFor="quantity" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <Hash className="w-5 h-5 text-blue-500" />
                                                            {t("Quantity")} *
                                                    </Label>
                                                        <div className="relative">
                                                            <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                    <Input
                                                        id="quantity"
                                                        type="number"
                                                                step="0.01"
                                                                min="0.01"
                                                                placeholder={t("Enter quantity")}
                                                        value={data.quantity}
                                                                onChange={(e) => setData('quantity', e.target.value)}
                                                                className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${errors.quantity ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-blue-300 focus:border-blue-500'} bg-white dark:bg-slate-800`}
                                                    />
                                                        </div>
                                                    {selectedProduct && (
                                                        <div className="flex items-center space-x-2">
                                                            <Badge variant="outline">
                                                                    {t("Available:")} {
                                                                    (data.unit_type === 'wholesale')?
                                                                        parseInt(selectedProduct.stock_quantity/selectedProduct.whole_sale_unit_amount)+ " " + selectedProduct.wholesaleUnit.name + " " + selectedProduct.stock_quantity%selectedProduct.whole_sale_unit_amount+" "+ selectedProduct.retailUnit.name
                                                                    :
                                                                        selectedProduct.stock_quantity + " " + t("units")
                                                                    } 
                                                                </Badge>
                                                        </div>
                                                    )}
                                                    {errors.quantity && (
                                                            <motion.p
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="text-sm text-red-600 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                            {errors.quantity}
                                                            </motion.p>
                                                    )}
                                                    </motion.div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-8">
                                                    {/* Price */}
                                                    <motion.div
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        transition={{ delay: 1.4, duration: 0.4 }}
                                                        className="space-y-3"
                                                    >
                                                        <Label htmlFor="price" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <DollarSign className="w-5 h-5 text-green-500" />
                                                            {t("Price per Unit")} *
                                                    </Label>
                                                        <div className="relative">
                                                            <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                    <Input
                                                        id="price"
                                                        type="number"
                                                                step="0.01"
                                                        min="0"
                                                                placeholder={t("Enter price")}
                                                        value={data.price}
                                                        onChange={(e) => setData('price', e.target.value)}
                                                                className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${errors.price ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-green-300 focus:border-green-500'} bg-white dark:bg-slate-800`}
                                                    />
                                                        </div>
                                                    {errors.price && (
                                                            <motion.p
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="text-sm text-red-600 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                            {errors.price}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>

                                                    {/* Notes */}
                                                    <motion.div
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        transition={{ delay: 1.5, duration: 0.4 }}
                                                        className="space-y-3"
                                                    >
                                                        <Label htmlFor="notes" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <Package2 className="w-5 h-5 text-purple-500" />
                                                            {t("Notes")}
                                                            <Badge variant="secondary" className="text-xs">
                                                                {t("Optional")}
                                                            </Badge>
                                                        </Label>
                                                        <Textarea
                                                            id="notes"
                                                            placeholder={t("Enter any additional notes about this transfer...")}
                                                            value={data.notes}
                                                            onChange={(e) => setData('notes', e.target.value)}
                                                            rows={4}
                                                            className={`resize-none text-lg border-2 transition-all duration-200 ${errors.notes ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-purple-300 focus:border-purple-500'} bg-white dark:bg-slate-800`}
                                                        />
                                                        {errors.notes && (
                                                            <motion.p
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="text-sm text-red-600 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.notes}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Calculation Summary */}
                                    <AnimatePresence>
                                        {selectedProduct && data.unit_type && data.quantity && data.price && (
                                                <motion.div
                                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                                transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                                            >
                                                <Card className="border-0 shadow-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-purple-900/30 backdrop-blur-xl">
                                                    <CardHeader className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-purple-200/50 dark:border-purple-700/50">
                                                        <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                                                                <Calculator className="h-6 w-6 text-white" />
                                                            </div>
                                                            {t("Transfer Summary")}
                                                            <Badge className="ml-auto bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                {t("Valid")}
                                                            </Badge>
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="p-8 space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                            <motion.div
                                                                whileHover={{ scale: 1.02 }}
                                                                className="text-center p-6 bg-white/70 dark:bg-slate-800/70 rounded-2xl shadow-lg border border-purple-200/50 dark:border-purple-700/50"
                                                            >
                                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 flex items-center justify-center gap-2">
                                                                    <Hash className="w-4 h-4" />
                                                                    {t("Actual Quantity")}
                                                                </p>
                                                                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                                                    {calculatedQuantity.toLocaleString()}
                                                                </p>
                                                                <p className="text-xs text-slate-500 mt-1">{t("units")}</p>
                                                            </motion.div>
                                                            <motion.div
                                                                whileHover={{ scale: 1.02 }}
                                                                className="text-center p-6 bg-white/70 dark:bg-slate-800/70 rounded-2xl shadow-lg border border-purple-200/50 dark:border-purple-700/50"
                                                            >
                                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 flex items-center justify-center gap-2">
                                                                    <DollarSign className="w-4 h-4" />
                                                                    {t("Price per Unit")}
                                                                </p>
                                                                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                                                    {formatCurrency(parseFloat(data.price) || 0)}
                                                                </p>
                                                            </motion.div>
                                                            <motion.div
                                                                whileHover={{ scale: 1.02 }}
                                                                className="text-center p-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl shadow-lg border-2 border-purple-300 dark:border-purple-700"
                                                            >
                                                                <p className="text-sm text-purple-700 dark:text-purple-400 mb-2 flex items-center justify-center gap-2">
                                                                    <Calculator className="w-4 h-4" />
                                                                    {t("Total Value")}
                                                                </p>
                                                                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                                                    {formatCurrency(calculatedTotal)}
                                                                </p>
                                                            </motion.div>
                                                        </div>
                                                        <AnimatePresence>
                                                            {data.unit_type === 'wholesale' && selectedProduct.whole_sale_unit_amount > 1 && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: "auto" }}
                                                                    exit={{ opacity: 0, height: 0 }}
                                                                >
                                                                    <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                                                                        <Package2 className="h-5 w-5 text-purple-600" />
                                                                        <AlertDescription className="text-purple-700 dark:text-purple-400 font-medium">
                                                                            <strong>{t("Wholesale unit multiplier applied")}:</strong> {data.quantity} × {selectedProduct.whole_sale_unit_amount} = {calculatedQuantity} {t("units")}
                                                        </AlertDescription>
                                                    </Alert>
                                                </motion.div>
                                            )}
                                                        </AnimatePresence>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Submit Button */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.6, duration: 0.4 }}
                                        className="flex justify-end space-x-6 pt-6"
                                    >
                                                <Link href={route("admin.warehouses.transfers", warehouse.id)}>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                className="px-8 py-4 text-lg border-2 hover:scale-105 transition-all duration-200"
                                                    >
                                                        {t("Cancel")}
                                                    </Button>
                                                </Link>
                                                <Button
                                                    type="submit"
                                            disabled={processing}
                                            className={`px-8 py-4 text-lg shadow-2xl transition-all duration-200 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 hover:scale-105 hover:shadow-3xl text-white`}
                                                >
                                                    {processing ? (
                                                        <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                                            {t("Creating...")}
                                                        </>
                                                    ) : (
                                                        <>
                                                    <Save className="h-5 w-5 mr-3" />
                                                            {t("Create Transfer")}
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
