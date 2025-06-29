import React, { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    Package,
    Save,
    Hash,
    DollarSign,
    Sparkles,
    Info,
    Weight,
    AlertCircle,
    Barcode,
    Edit,
    Calculator,
    CheckCircle,
    Package2,
    Users
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
import { Badge } from "@/Components/ui/badge";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function CreateItem({ auth, purchase, products, permissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [calculatedQuantity, setCalculatedQuantity] = useState(0);
    const [calculatedTotal, setCalculatedTotal] = useState(0);
    const [manualTotal, setManualTotal] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        product_id: '',
        quantity: '',
        unit_type: '',
        price: '',
        notes: ''
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Update selected product when product_id changes
    useEffect(() => {
        if (data.product_id && products) {
            const product = products.find(p => p.id === parseInt(data.product_id));
            setSelectedProduct(product || null);
            setData(prevData => ({ ...prevData, unit_type: '', price: '', notes: '' }));
        } else {
            setSelectedProduct(null);
        }
    }, [data.product_id, products]);

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
        
        // Create submission data with calculated values
        const submissionData = {
            product_id: data.product_id,
            unit_type: data.unit_type,
            quantity: finalQuantity,
            price: data.price,
            total_price: finalTotal,
            notes: data.notes
        };

        // Use router.post directly with calculated data
        router.post(route('admin.purchases.items.store', purchase.id), submissionData, {
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
            currency: purchase.currency?.code || 'USD',
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
            <Head title={`${t("Add Item")} - ${purchase.invoice_number}`} />
            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
                .float-animation { animation: float 6s ease-in-out infinite; }
                .glass-effect { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); }
                .dark .glass-effect { background: rgba(0, 0, 0, 0.2); backdrop-filter: blur(10px); }
                .gradient-border {
                    background: linear-gradient(white, white) padding-box, linear-gradient(45deg, #22c55e, #16a34a) border-box;
                    border: 2px solid transparent;
                }
                .dark .gradient-border {
                    background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box, linear-gradient(45deg, #22c55e, #16a34a) border-box;
                }
            `}</style>

            <PageLoader isVisible={loading} icon={Package} color="green" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                <Navigation auth={auth} currentRoute="admin.purchases" />

                <div className="flex-1 flex flex-col overflow-hidden">
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
                                    <div className="absolute -inset-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 p-4 rounded-2xl shadow-2xl">
                                        <Package className="w-8 h-8 text-white" />
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-green-600 dark:text-green-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" /> {t("Add Purchase Item")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent"
                                    >
                                        {purchase.invoice_number}
                                    </motion.h1>
                                </div>
                            </div>

                            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7, duration: 0.4 }}>
                                <Link href={route("admin.purchases.show", purchase.id)}>
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-all duration-200 border-green-200 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20">
                                        <ArrowLeft className="h-4 w-4" /> {t("Back to Purchase")}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-green-300 dark:scrollbar-thumb-green-700 scrollbar-track-transparent p-8">
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}>
                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border max-w-4xl mx-auto">
                                <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                    <CardTitle className="flex items-center gap-3 text-2xl">
                                        <Package className="h-6 w-6 text-green-600" />
                                        {t("Add New Item")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {/* Product Selection */}
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.1, duration: 0.4 }}
                                            className="space-y-3"
                                        >
                                            <Label htmlFor="product_id" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                <Package className="w-5 h-5 text-green-500" />
                                                {t("Product")} *
                                            </Label>
                                            <Select value={data.product_id} onValueChange={(value) => setData('product_id', value)}>
                                                <SelectTrigger className={`h-14 text-lg border-2 transition-all duration-200 ${errors.product_id ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-green-300 focus:border-green-500'} bg-white dark:bg-slate-800`}>
                                                    <SelectValue placeholder={t("Select product")} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {products?.map((product) => (
                                                        <SelectItem key={product.id} value={product.id.toString()} className="p-4">
                                                            <div className="flex items-center space-x-4">
                                                                <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg">
                                                                    <Package className="h-5 w-5 text-green-600" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="font-semibold text-slate-800 dark:text-white">{product.name}</div>
                                                                    <div className="text-sm text-slate-500 flex items-center gap-2">
                                                                        <Barcode className="w-3 h-3" />
                                                                        {product.barcode || `ID: ${product.id}`}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.product_id && (
                                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.product_id}
                                                </motion.p>
                                            )}
                                        </motion.div>

                                        {/* Unit Type Selection */}
                                        {selectedProduct && (
                                            <motion.div
                                                initial={{ x: 20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.2, duration: 0.4 }}
                                                className="space-y-3"
                                            >
                                                <Label htmlFor="unit_type" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                    <Weight className="w-5 h-5 text-orange-500" />
                                                    {t("Unit Type")} *
                                                </Label>
                                                <Select value={data.unit_type} onValueChange={handleUnitTypeChange} disabled={!selectedProduct}>
                                                    <SelectTrigger className={`h-14 text-lg border-2 transition-all duration-200 ${errors.unit_type ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-orange-300 focus:border-orange-500'} ${!selectedProduct ? 'opacity-50 cursor-not-allowed' : 'bg-white dark:bg-slate-800'}`}>
                                                        <SelectValue placeholder={selectedProduct ? t("Select unit type") : t("Select product first")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {selectedProduct && getAvailableUnits(selectedProduct).length > 0 ? (
                                                            getAvailableUnits(selectedProduct).map((unit) => (
                                                                <SelectItem key={unit.type} value={unit.type} className="p-4">
                                                                    <div className="flex items-center space-x-4">
                                                                        <div className={`p-2 rounded-lg ${unit.type === 'wholesale' ? 'bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30' : 'bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30'}`}>
                                                                            <Weight className={`h-5 w-5 ${unit.type === 'wholesale' ? 'text-orange-600' : 'text-blue-600'}`} />
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
                                                            ))
                                                        ) : selectedProduct ? (
                                                            <SelectItem value="" disabled>
                                                                {t("No units configured for this product")}
                                                            </SelectItem>
                                                        ) : (
                                                            <SelectItem value="" disabled>
                                                                {t("Select product first")}
                                                            </SelectItem>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {errors.unit_type && (
                                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                        <AlertCircle className="w-4 h-4" />
                                                        {errors.unit_type}
                                                    </motion.p>
                                                )}
                                            </motion.div>
                                        )}

                                        {/* Unit Information Display */}
                                        <AnimatePresence>
                                            {selectedProduct && data.unit_type && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                                                        <Info className="h-5 w-5 text-blue-600" />
                                                        <AlertDescription className="text-blue-700 dark:text-blue-400 font-medium">
                                                            <div className="flex items-center justify-between">
                                                                <span>
                                                                    Selected unit: <strong>{data.unit_type}</strong>
                                                                    {data.unit_type === 'wholesale' && selectedProduct.whole_sale_unit_amount > 1 && (
                                                                        <span> (1 unit = {selectedProduct.whole_sale_unit_amount} pieces)</span>
                                                                    )}
                                                                    {data.unit_type === 'retail' && selectedProduct.retails_sale_unit_amount > 1 && (
                                                                        <span> (1 unit = {selectedProduct.retails_sale_unit_amount} pieces)</span>
                                                                    )}
                                                                </span>
                                                                <Badge variant="outline" className="text-blue-700">
                                                                    {formatCurrency(getUnitPrice(selectedProduct, data.unit_type))} per unit
                                                                </Badge>
                                                            </div>
                                                        </AlertDescription>
                                                    </Alert>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Quantity */}
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.3, duration: 0.4 }}
                                                className="space-y-3"
                                            >
                                                <Label htmlFor="quantity" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                    <Hash className="w-5 h-5 text-blue-500" />
                                                    {data.unit_type === 'wholesale' ? (
                                                        <>{t("Wholesale Quantity")} ({selectedProduct?.wholesaleUnit?.symbol || 'Units'}) *</>
                                                    ) : data.unit_type === 'retail' ? (
                                                        <>{t("Retail Quantity")} ({selectedProduct?.retailUnit?.symbol || 'Units'}) *</>
                                                    ) : (
                                                        <>{t("Quantity")} *</>
                                                    )}
                                                </Label>
                                                <div className="relative">
                                                    <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                    <Input
                                                        id="quantity"
                                                        type="number"
                                                        step="0.01"
                                                        min="0.01"
                                                        placeholder={data.unit_type ? `Enter ${data.unit_type} quantity` : t("Enter quantity")}
                                                        value={data.quantity}
                                                        onChange={(e) => setData('quantity', e.target.value)}
                                                        className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${errors.quantity ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-blue-300 focus:border-blue-500'} bg-white dark:bg-slate-800`}
                                                    />
                                                </div>
                                                {errors.quantity && (
                                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                        <AlertCircle className="w-4 h-4" />
                                                        {errors.quantity}
                                                    </motion.p>
                                                )}
                                            </motion.div>

                                            {/* Price */}
                                            <motion.div
                                                initial={{ x: 20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.4, duration: 0.4 }}
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
                                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                        <AlertCircle className="w-4 h-4" />
                                                        {errors.price}
                                                    </motion.p>
                                                )}
                                            </motion.div>
                                        </div>

                                        {/* Calculation Summary */}
                                        <AnimatePresence>
                                            {selectedProduct && data.unit_type && data.quantity > 0 && data.price > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                                                        <Info className="h-5 w-5 text-green-600" />
                                                        <AlertDescription className="text-green-700 dark:text-green-400 font-medium">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="text-sm font-medium">{t("Calculation Summary")}</span>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-xs">
                                                                    <strong>{t("Input")}:</strong> {data.quantity} × {formatCurrency(data.price)} = {formatCurrency(calculatedTotal)}
                                                                </p>
                                                                {data.unit_type === 'wholesale' && selectedProduct.whole_sale_unit_amount > 1 && (
                                                                    <p className="text-xs">
                                                                        <strong>{t("Database")}:</strong> {data.quantity} × {selectedProduct.whole_sale_unit_amount} = {calculatedQuantity} {t("units")}
                                                                    </p>
                                                                )}
                                                                {data.unit_type === 'retail' && selectedProduct.retails_sale_unit_amount > 1 && (
                                                                    <p className="text-xs">
                                                                        <strong>{t("Database")}:</strong> {data.quantity} × {selectedProduct.retails_sale_unit_amount} = {calculatedQuantity} {t("units")}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </AlertDescription>
                                                    </Alert>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Total Price */}
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.5, duration: 0.4 }}
                                            className="space-y-3"
                                        >
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="total_price" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                    <DollarSign className="w-5 h-5 text-purple-500" />
                                                    {t("Total Price")}
                                                </Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setManualTotal(!manualTotal)}
                                                    className="text-xs gap-1"
                                                >
                                                    {manualTotal ? (
                                                        <>
                                                            <Hash className="w-3 h-3" />
                                                            {t("Auto")}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Edit className="w-3 h-3" />
                                                            {t("Manual")}
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                            <div className="relative">
                                                <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                <Input
                                                    id="total_price"
                                                    type="number"
                                                    step="0.01"
                                                    value={data.total_price}
                                                    onChange={(e) => setData('total_price', e.target.value)}
                                                    readOnly={!manualTotal}
                                                    className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${!manualTotal ? 'bg-slate-50 dark:bg-slate-800 border-slate-200' : 'border-slate-200 hover:border-purple-300 focus:border-purple-500'} bg-white dark:bg-slate-800`}
                                                />
                                            </div>
                                            {!manualTotal && (
                                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Info className="w-3 h-3" />
                                                    {t("Automatically calculated based on quantity and price.")}
                                                </p>
                                            )}
                                        </motion.div>

                                        <div className="flex justify-end space-x-4 pt-6">
                                            <Link href={route("admin.purchases.show", purchase.id)}>
                                                <Button type="button" variant="outline" className="px-8 py-3">
                                                    {t("Cancel")}
                                                </Button>
                                            </Link>
                                            <Button type="submit" disabled={processing} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3">
                                                {processing ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                        {t("Saving...")}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="h-4 w-4 mr-2" />
                                                        {t("Add Item")}
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </main>
                </div>
            </motion.div>
        </>
    );
}
