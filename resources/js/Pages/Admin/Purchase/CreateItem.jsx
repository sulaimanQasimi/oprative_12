import React, { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    ArrowRight,
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
    Users,
    Calendar,
    FileText,
    Plus,
    Trash2,
    Receipt,
    ShoppingCart,
    CreditCard,
    TrendingUp,
    X,
    Lock
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
import ApiSelect from "@/Components/ApiSelect";
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";
import PermissionButton from "@/Components/PermissionButton";

export default function CreateItem({ auth, purchase, products, units, permissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [calculatedQuantity, setCalculatedQuantity] = useState(0);
    const [calculatedTotal, setCalculatedTotal] = useState(0);
    const [manualTotal, setManualTotal] = useState(false);
    
    // Wizard state
    const [currentStep, setCurrentStep] = useState(1);

    const { data, setData, post, processing, errors } = useForm({
        product_id: '',
        unit_id: '',
        quantity: '',
        unit_type: '',
        price: '',
        notes: '',
        unit_amount: 1,
        is_wholesale: true,
        // Batch fields
        batch: {
            issue_date: '',
            expire_date: '',
            notes: ''
        }
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Permission check removed - now handled in UI

    // Reset form fields when product changes
    useEffect(() => {
        if (data.product_id && selectedProduct) {
            setData(prevData => ({ 
                ...prevData, 
                unit_type: 'wholesale', 
                price: '', 
                notes: ''
            }));
        } else if (!data.product_id) {
            setSelectedProduct(null);
        }
    }, [data.product_id, selectedProduct]);

    // Auto-set wholesale/retail based on unit amount
    useEffect(() => {
        const unitAmount = parseInt(data.unit_amount) || 1;
        const shouldBeWholesale = unitAmount > 1;
        
        if (data.is_wholesale !== shouldBeWholesale) {
            setData('is_wholesale', shouldBeWholesale);
        }
    }, [data.unit_amount]);

    // Calculate actual quantity and total
    useEffect(() => {
        if (selectedProduct && data.unit_type && data.quantity && data.price) {
            let actualQuantity = parseFloat(data.quantity) || 0;

            if (data.unit_amount && data.unit_amount > 1) {
                actualQuantity = (parseFloat(data.quantity) || 0) * data.unit_amount;
            }

            const itemTotal = actualQuantity * (parseFloat(data.price) || 0);
            const total = itemTotal;

            setCalculatedQuantity(actualQuantity);
            setCalculatedTotal(total);
        } else {
            setCalculatedQuantity(0);
            setCalculatedTotal(0);
        }
    }, [selectedProduct, data.unit_type, data.quantity, data.price, data.unit_amount]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: purchase.currency?.code || 'USD',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const getUnitPrice = (product) => {
        if (!product) return 0;
        return 0;
    };



    // Step validation
    const validateStep = (step) => {
        switch (step) {
            case 1:
                return data.product_id && data.unit_id && data.quantity && data.price && data.unit_amount;
            case 2:
                return true; // Batch info is optional
            default:
                return false;
        }
    };

    // Next step
    const nextStep = () => {
        if (validateStep(currentStep) && currentStep < 2) {
            setCurrentStep(currentStep + 1);
        }
    };

    // Previous step
    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        
        let finalQuantity = parseFloat(data.quantity) || 0;
        let unitPrice = parseFloat(data.price) || 0;
        let finalTotal = finalQuantity * unitPrice;
        
        const submissionData = {
            product_id: data.product_id,
            unit_id: data.unit_id,
            unit_type: data.unit_type,
            quantity: finalQuantity,
            price: data.price,
            total_price: finalTotal,
            notes: data.notes,
            unit_amount: data.unit_amount,
            is_wholesale: data.is_wholesale,
            batch: {
                issue_date: data.batch.issue_date || null,
                expire_date: data.batch.expire_date || null,
                notes: data.batch.notes || null
            }
        };

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

    const stepTitles = [
        t("Basic Information"),
        t("Summary & Notes")
    ];

    const stepIcons = [Package, DollarSign];

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
                    {!permissions.can_create_items ? (
                        <div className="flex-1 flex items-center justify-center">
                            <Card className="max-w-md mx-auto border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                                <CardContent className="p-8 text-center">
                                    <div className="mb-6">
                                        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                            <Lock className="h-8 w-8 text-red-500" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-3">
                                        {t("Access Denied")}
                                    </h3>
                                    <p className="text-red-600 dark:text-red-300 mb-6">
                                        {t("You don't have permission to create items for this purchase.")}
                                    </p>
                                    <Link href={route("admin.purchases.show", purchase.id)}>
                                        <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            {t("Back to Purchase")}
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <>
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
                                        {React.createElement(stepIcons[currentStep - 1], { className: "w-8 h-8 text-white" })}
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-green-600 dark:text-green-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" /> 
                                        {t("Step")} {currentStep} {t("of")} 2: {stepTitles[currentStep - 1]}
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
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-all dark:text-white duration-200 border-green-200 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20">
                                        <ArrowLeft className="h-4 w-4" /> {t("Back to Purchase")}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-green-300 dark:scrollbar-thumb-green-700 scrollbar-track-transparent p-8">
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}>
                            
                            {/* Global Steps Progress */}
                            <div className="max-w-6xl mx-auto mb-8">
                                <div className="flex items-center justify-between">
                                    {/* Step 1: Create Item (Current) */}
                                    <div className="flex items-center">
                                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg ring-4 ring-green-100 dark:ring-green-900">
                                            <Package className="w-7 h-7" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-lg font-bold text-green-600 dark:text-green-400">{t("Create Item")}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{t("Step 1 - Active")}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="w-24 h-1 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    
                                    {/* Step 2: Additional Costs */}
                                    <div className="flex items-center opacity-50">
                                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-400">
                                            <Receipt className="w-7 h-7" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-lg font-bold text-gray-400">{t("Additional Costs")}</p>
                                            <p className="text-sm text-gray-400">{t("Step 2 - Next")}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="w-24 h-1 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    
                                    {/* Step 3: Pricing */}
                                    <div className="flex items-center opacity-50">
                                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-400">
                                            <DollarSign className="w-7 h-7" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-lg font-bold text-gray-400">{t("Pricing")}</p>
                                            <p className="text-sm text-gray-400">{t("Step 3 - Final")}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>



                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border max-w-4xl mx-auto">
                                <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                    <CardTitle className="flex items-center gap-3 text-2xl">
                                        {React.createElement(stepIcons[currentStep - 1], { className: "h-6 w-6 text-green-600" })}
                                        {stepTitles[currentStep - 1]}
                                    </CardTitle>
                                    <CardDescription>
                                        {currentStep === 1 && t("Enter basic product information, quantities, and dates")}
                                        {currentStep === 2 && t("Add batch notes and review the item summary")}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        
                                                                                {/* Step 1: Basic Information */}
                                        {currentStep === 1 && (
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ duration: 0.4 }}
                                                className="space-y-8"
                                            >
                                                {/* Product Selection */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="product_id" className="text-gray-700 dark:text-gray-300 font-semibold text-lg flex items-center gap-2">
                                                        <Package className="w-5 h-5 text-green-500 dark:text-green-400" />
                                                        {t("Product")} *
                                                    </Label>
                                                    <ApiSelect
                                                        apiEndpoint="/api/products/select"
                                                        placeholder={t("Select product")}
                                                        searchPlaceholder={t("Search products...")}
                                                        icon={Package}
                                                        direction="ltr"
                                                        value={data.product_id}
                                                        onChange={(value, option) => {
                                                            setData('product_id', value);
                                                            if (option && option.product) {
                                                                setSelectedProduct(option.product);
                                                            }
                                                        }}
                                                        error={errors.product_id}
                                                        searchParam="search"
                                                        requireAuth={false}
                                                    />
                                                </div>

                                                {/* Unit Selection */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="unit_id" className="text-gray-700 dark:text-gray-300 font-semibold text-lg flex items-center gap-2">
                                                        <Weight className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                                                        {t("Unit")} *
                                                    </Label>
                                                    <ApiSelect
                                                        apiEndpoint="/api/units/select"
                                                        placeholder={t("Select unit")}
                                                        searchPlaceholder={t("Search units...")}
                                                        icon={Weight}
                                                        direction="ltr"
                                                        value={data.unit_id}
                                                        onChange={(value, option) => {
                                                            setData('unit_id', value);
                                                        }}
                                                        error={errors.unit_id}
                                                        searchParam="search"
                                                        requireAuth={false}
                                                    />
                                                </div>

                                                {/* Product Info Display */}
                                                {selectedProduct && (
                                                    <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                                                        <Info className="h-5 w-5 text-blue-600" />
                                                        <AlertDescription className="text-blue-700 dark:text-blue-400 font-medium">
                                                            <div className="flex items-center justify-between">
                                                                <span>
                                                                    {t('Product unit')}: <strong>{selectedProduct.unit ? selectedProduct.unit.name : t("No Unit")}</strong>
                                                                    {data.unit_amount > 1 && (
                                                                        <span> (1 unit = {data.unit_amount} pieces)</span>
                                                                    )}
                                                                </span>
                                                                <Badge variant="outline" className="text-blue-700">
                                                                    {formatCurrency(getUnitPrice(selectedProduct))} {t("per unit")}
                                                                </Badge>
                                                            </div>
                                                        </AlertDescription>
                                                    </Alert>
                                                )}

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                    {/* Quantity */}
                                                    <div className="space-y-3">
                                                        <Label htmlFor="quantity" className="text-gray-700 dark:text-gray-300 font-semibold text-lg flex items-center gap-2">
                                                            <Hash className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                                                            {t("Quantity")} ({units?.find(u => u.id.toString() === data.unit_id)?.code || selectedProduct?.unit?.code || 'Units'}) *
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
                                                                className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${errors.quantity ? 'border-red-500 ring-2 ring-red-200 dark:ring-red-800' : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400 focus:border-blue-500 dark:focus:border-blue-400'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                                                            />
                                                        </div>
                                                        {errors.quantity && (
                                                            <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.quantity}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Price */}
                                                    <div className="space-y-3">
                                                        <Label htmlFor="price" className="text-gray-700 dark:text-gray-300 font-semibold text-lg flex items-center gap-2">
                                                            <DollarSign className="w-5 h-5 text-green-500 dark:text-green-400" />
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
                                                                className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${errors.price ? 'border-red-500 ring-2 ring-red-200 dark:ring-red-800' : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-400 focus:border-green-500 dark:focus:border-green-400'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                                                            />
                                                        </div>
                                                        {errors.price && (
                                                            <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.price}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                    {/* Unit Amount */}
                                                    <div className="space-y-3">
                                                        <Label htmlFor="unit_amount" className="text-gray-700 dark:text-gray-300 font-semibold text-lg flex items-center gap-2">
                                                            <Calculator className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                                                            {t("Unit Amount")} *
                                                        </Label>
                                                        <div className="relative">
                                                            <Calculator className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                            <Input
                                                                id="unit_amount"
                                                                type="number"
                                                                step="1"
                                                                min="1"
                                                                placeholder={t("Enter unit amount")}
                                                                value={data.unit_amount}
                                                                onChange={(e) => setData('unit_amount', e.target.value)}
                                                                className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${errors.unit_amount ? 'border-red-500 ring-2 ring-red-200 dark:ring-red-800' : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400 focus:border-purple-500 dark:focus:border-purple-400'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                                                            />
                                                        </div>
                                                        {errors.unit_amount && (
                                                            <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.unit_amount}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Type Display */}
                                                    <div className="space-y-3">
                                                        <Label className="text-gray-700 dark:text-gray-300 font-semibold text-lg flex items-center gap-2">
                                                            <Package className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                                                            {t("Type")} ({t("Auto")})
                                                        </Label>
                                                        <div className="flex items-center space-x-4 h-14">
                                                            <Button
                                                                type="button"
                                                                variant={data.is_wholesale ? "default" : "outline"}
                                                                disabled
                                                                className={`flex-1 h-14 ${data.is_wholesale ? 'bg-orange-600 text-white' : 'border-orange-300 text-orange-600 bg-gray-50 dark:bg-gray-800'}`}
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                                {units?.find(u => u.id.toString() === data.unit_id)?.name || t("Wholesale")}
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant={!data.is_wholesale ? "default" : "outline"}
                                                                disabled
                                                                className={`flex-1 h-14 ${!data.is_wholesale ? 'bg-blue-600 text-white' : 'border-blue-300 text-blue-600 bg-gray-50 dark:bg-gray-800'}`}
                                                            >
                                                                <Package className="w-4 h-4 mr-2" />
                                                                {selectedProduct?.unit?.name || t("Retail")}
                                                            </Button>
                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                            <Info className="w-3 h-3" />
                                                            {t("Automatically set based on unit amount")}
                                                        </p>
                                                    </div>
                                                </div>

                                                                                        {/* Batch Dates */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Issue Date */}
                                            <div className="space-y-3">
                                                <Label htmlFor="batch_issue_date" className="text-gray-700 dark:text-gray-300 font-semibold text-lg flex items-center gap-2">
                                                    <Calendar className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                                                    {t("Issue Date")}
                                                </Label>
                                                <Input
                                                    id="batch_issue_date"
                                                    type="date"
                                                    value={data.batch.issue_date}
                                                    onChange={(e) => setData('batch', { ...data.batch, issue_date: e.target.value })}
                                                    className="h-14 text-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                                                />
                                            </div>

                                            {/* Expire Date */}
                                            <div className="space-y-3">
                                                <Label htmlFor="batch_expire_date" className="text-gray-700 dark:text-gray-300 font-semibold text-lg flex items-center gap-2">
                                                    <Calendar className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                                                    {t("Expire Date")}
                                                </Label>
                                                <Input
                                                    id="batch_expire_date"
                                                    type="date"
                                                    value={data.batch.expire_date}
                                                    onChange={(e) => setData('batch', { ...data.batch, expire_date: e.target.value })}
                                                    className="h-14 text-lg border-2 border-gray-300 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-400 focus:border-orange-500 dark:focus:border-orange-400"
                                                />
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        <div className="space-y-3">
                                            <Label htmlFor="notes" className="text-gray-700 dark:text-gray-300 font-semibold text-lg flex items-center gap-2">
                                                <FileText className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                                {t("Notes")}
                                            </Label>
                                            <Textarea
                                                id="notes"
                                                placeholder={t("Enter notes (optional)")}
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                className="min-h-[100px] border-2 border-gray-300 dark:border-gray-600 hover:border-slate-300 dark:hover:border-slate-400 focus:border-slate-500 dark:focus:border-slate-400 resize-none"
                                                rows={4}
                                            />
                                        </div>

                                                {/* Calculation Summary */}
                                                {selectedProduct && data.quantity > 0 && data.price > 0 && (
                                                    <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                                                        <Info className="h-5 w-5 text-green-600" />
                                                        <AlertDescription className="text-green-700 dark:text-green-400 font-medium">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="text-sm font-medium">{t("Calculation Summary")}</span>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-xs">
                                                                    <strong>{t("Input")}:</strong> {data.quantity} × {formatCurrency(data.price)} = {formatCurrency(data.quantity*data.price)}
                                                                </p>
                                                                {data.unit_amount > 1 && (
                                                                    <p className="text-xs">
                                                                        <strong>{t("Database")}:</strong> {data.quantity} × {data.unit_amount} = {calculatedQuantity} {units?.find(u => u.id.toString() === data.unit_id)?.code || selectedProduct?.unit?.code || 'units'}
                                                                    </p>
                                                                )}
                                                                <p className="text-xs">
                                                                    <strong>{t("Type")}:</strong> {data.is_wholesale ? t("Wholesale") : t("Retail")}
                                                                </p>
                                                            </div>
                                                        </AlertDescription>
                                                    </Alert>
                                                )}
                                            </motion.div>
                                        )}

                                        {/* Step 2: Summary & Notes */}
                                        {currentStep === 2 && (
                                            <motion.div
                                                initial={{ x: 20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ duration: 0.4 }}
                                                className="space-y-8"
                                            >
                                                                                                {/* Batch Notes */}
                                                <Card className="border-2 border-blue-200 dark:border-blue-800">
                                                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                                                        <CardTitle className="flex items-center gap-3 text-lg">
                                                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                                <FileText className="h-5 w-5 text-white" />
                                                            </div>
                                                                {t("Batch Notes")}
                                                        </CardTitle>
                                                        <CardDescription>
                                                                {t("Add any additional notes for this batch")}
                                                        </CardDescription>
                                                    </CardHeader>
                                                    <CardContent className="p-6">
                                                        <div className="space-y-3">
                                                            <Label htmlFor="batch_notes" className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
                                                                <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                                                {t("Batch Notes")}
                                                            </Label>
                                                            <Textarea
                                                                id="batch_notes"
                                                                placeholder={t("Enter batch-specific notes (optional)")}
                                                                value={data.batch.notes}
                                                                onChange={(e) => setData('batch', { ...data.batch, notes: e.target.value })}
                                                                className="min-h-[100px] border-2 border-gray-300 dark:border-gray-600 hover:border-slate-300 dark:hover:border-slate-400 focus:border-slate-500 dark:focus:border-slate-400 resize-none"
                                                                rows={4}
                                                            />
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                {/* Cost Summary */}
                                                <Card className="border-2 border-green-200 dark:border-green-800">
                                                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                                                        <CardTitle className="flex items-center gap-3 text-lg">
                                                            <Calculator className="h-6 w-6 text-green-600" />
                                                            {t("Total Cost Breakdown")}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="p-6">
                                                        <div className="space-y-4">
                                                            {/* Item Cost */}
                                                            <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                                <div className="flex items-center gap-2">
                                                                    <Package className="h-5 w-5 text-blue-600" />
                                                                    <span className="font-medium">{t("Item Cost")}</span>
                                                                </div>
                                                                <span className="text-xl font-bold text-blue-600">
                                                                    {formatCurrency(parseFloat(data.quantity || 0) * parseFloat(data.price || 0))}
                                                                </span>
                                                            </div>



                                                            {/* Total Cost */}
                                                            <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                                                                <div className="flex items-center gap-2">
                                                                    <Calculator className="h-6 w-6 text-green-600" />
                                                                    <span className="text-lg font-bold">{t("Total Cost")}</span>
                                                                </div>
                                                                <span className="text-2xl font-bold text-green-600">
                                                                    {formatCurrency(calculatedTotal)}
                                                                </span>
                                                            </div>

                                                            {/* Unit Information */}
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                                                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{t("Unit Amount")}</p>
                                                                    <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{data.unit_amount}</p>
                                                                </div>
                                                                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{t("Quantity")}</p>
                                                                    <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{data.quantity}</p>
                                                                </div>
                                                                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{t("Unit Cost")}</p>
                                                                    <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{formatCurrency(data.price)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        )}

                                        {/* Navigation Buttons */}
                                        <div className="flex justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-700">
                                            <div>
                                                {currentStep > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={prevStep}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <ArrowLeft className="h-4 w-4" />
                                                        {t("Previous")}
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <Link href={route("admin.purchases.show", purchase.id)}>
                                                    <Button type="button" variant="outline" className="px-6">
                                                        {t("Cancel")}
                                                    </Button>
                                                </Link>

                                                {currentStep < 2 ? (
                                                    <Button
                                                        type="button"
                                                        onClick={nextStep}
                                                        disabled={!validateStep(currentStep)}
                                                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white flex items-center gap-2"
                                                    >
                                                        {t("Next")}
                                                        <ArrowRight className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <Button 
                                                        type="submit" 
                                                        disabled={processing} 
                                                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3"
                                                    >
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
                                                )}
                                            </div>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </main>
                        </>
                    )}
                </div>
            </motion.div>
        </>
    );
}