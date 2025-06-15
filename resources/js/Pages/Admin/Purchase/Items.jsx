import React, { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    Package,
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    Calculator,
    Hash,
    DollarSign,
    Sparkles,
    ShoppingCart,
    Search,
    Filter,
    Download,
    RefreshCw,
    BarChart3,
    ChevronDown,
    Calendar,
    Eye,
    Info
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Badge } from "@/Components/ui/badge";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Items({ auth, purchase, purchaseItems, products }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");
    const [filteredItems, setFilteredItems] = useState(purchaseItems || []);
    const [manualTotal, setManualTotal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [calculatedQuantity, setCalculatedQuantity] = useState(0);
    const [calculatedTotal, setCalculatedTotal] = useState(0);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        product_id: '',
        quantity: '',
        unit_type: '',
        price: '',
        total_price: ''
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Enhanced filtering logic
    useEffect(() => {
        let filtered = [...(purchaseItems || [])];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.product?.barcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.unit_type?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sorting
        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'product.name') {
                aValue = a.product?.name;
                bValue = b.product?.name;
            }

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredItems(filtered);
    }, [searchTerm, sortBy, sortOrder, purchaseItems]);

    // Update selected product when product_id changes
    useEffect(() => {
        if (data.product_id) {
            const product = products.find(p => p.id === parseInt(data.product_id));
            setSelectedProduct(product);
        } else {
            setSelectedProduct(null);
        }
    }, [data.product_id, products]);

    // Calculate actual quantity, total, and update form data
    useEffect(() => {
        if (selectedProduct && data.unit_type && data.quantity && data.price) {
            let actualQuantity = parseFloat(data.quantity) || 0;

            if (data.unit_type === 'wholesale' && selectedProduct.whole_sale_unit_amount) {
                actualQuantity = (parseFloat(data.quantity) || 0) * selectedProduct.whole_sale_unit_amount;
            }

            const total = actualQuantity * (parseFloat(data.price) || 0);

            setCalculatedQuantity(actualQuantity);
            setCalculatedTotal(total);

            if (!manualTotal) {
                setData('total_price', total.toFixed(2));
            }
        } else if (!manualTotal && data.quantity && data.price) {
            // Fallback for simple calculation when no unit type is selected
            const quantity = parseFloat(data.quantity) || 0;
            const price = parseFloat(data.price) || 0;
            const total = quantity * price;
            setCalculatedTotal(total);
            setData('total_price', total.toFixed(2));
        }
    }, [selectedProduct, data.unit_type, data.quantity, data.price, manualTotal]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: purchase.currency?.code || 'USD',
            minimumFractionDigits: 2,
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingItem) {
            put(route('admin.purchases.items.update', [purchase.id, editingItem.id]), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setEditingItem(null);
                    reset();
                    setManualTotal(false);
                }
            });
        } else {
            post(route('admin.purchases.items.store', purchase.id), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                    setManualTotal(false);
                }
            });
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setData({
            product_id: item.product_id.toString(),
            quantity: item.quantity.toString(),
            unit_type: item.unit_type || '',
            price: item.price.toString(),
            total_price: item.total_price.toString()
        });
        setManualTotal(true);
        setIsDialogOpen(true);
    };

    const handleDelete = (itemId) => {
        if (confirm(t('Are you sure you want to delete this item?'))) {
            router.delete(route('admin.purchases.items.destroy', [purchase.id, itemId]));
        }
    };

    const openCreateDialog = () => {
        setEditingItem(null);
        reset();
        setManualTotal(false);
        setIsDialogOpen(true);
    };

    const getTotalAmount = () => {
        return filteredItems.reduce((sum, item) => sum + parseFloat(item.total_price || 0), 0);
    };

    const getTotalQuantity = () => {
        return filteredItems.reduce((sum, item) => sum + parseFloat(item.quantity || 0), 0);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSortBy("created_at");
        setSortOrder("desc");
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
            <Head title={`${t("Purchase Items")} - ${purchase.invoice_number}`}>
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
                        0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
                        50% { box-shadow: 0 0 30px rgba(34, 197, 94, 0.6); }
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
                                    linear-gradient(45deg, #22c55e, #16a34a) border-box;
                        border: 2px solid transparent;
                    }
                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #22c55e, #16a34a) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={Package} color="green" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                <Navigation auth={auth} currentRoute="admin.purchases" />

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
                                    <div className="absolute -inset-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 p-4 rounded-2xl shadow-2xl">
                                        <Package className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-green-600 dark:text-green-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {t("Purchase Items Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent"
                                    >
                                        {purchase.invoice_number}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        {t("Manage items for this purchase order")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Button variant="outline" className="gap-2 hover:scale-105 transition-all duration-200 border-green-200 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20">
                                    <Download className="h-4 w-4" />
                                    {t("Export")}
                                </Button>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button onClick={openCreateDialog} className="gap-2 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 text-white hover:scale-105 transition-all duration-200 shadow-lg">
                                            <Plus className="h-4 w-4" />
                                            {t("Add Item")}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>
                                                {editingItem ? t("Edit Item") : t("Add New Item")}
                                            </DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="product_id">{t("Product")} *</Label>
                                                <Select
                                                    value={data.product_id}
                                                    onValueChange={(value) => setData('product_id', value)}
                                                >
                                                    <SelectTrigger className="h-12">
                                                        <SelectValue placeholder={t("Select product")} />
                                                    </SelectTrigger>
                                                    <SelectContent className="max-w-md">
                                                        {products?.map((product) => (
                                                            <SelectItem key={product.id} value={product.id.toString()} className="p-4">
                                                                <div className="flex items-center space-x-4">
                                                                    <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg">
                                                                        <Package className="h-5 w-5 text-green-600" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="font-semibold text-slate-800 dark:text-white">{product.name}</div>
                                                                        <div className="text-sm text-slate-500 flex items-center gap-2">
                                                                            {product.barcode && (
                                                                                <>
                                                                                    <Hash className="w-3 h-3" />
                                                                                    {product.barcode} •
                                                                                </>
                                                                            )}
                                                                            <Badge variant="outline" className="text-xs">
                                                                                ID: {product.id}
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.product_id && (
                                                    <p className="text-sm text-red-600">{errors.product_id}</p>
                                                )}
                                            </div>

                                            {/* Unit Type Selection */}
                                            {selectedProduct && (
                                                <div className="space-y-2">
                                                    <Label htmlFor="unit_type">{t("Unit Type")} *</Label>
                                                    <Select
                                                        value={data.unit_type}
                                                        onValueChange={(value) => {
                                                            setData('unit_type', value);
                                                            // Auto-fill price based on unit type
                                                            if (selectedProduct) {
                                                                const price = value === 'wholesale' ? selectedProduct.wholesale_price : selectedProduct.retail_price;
                                                                setData('price', (price || 0).toString());
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger className="h-12">
                                                            <SelectValue placeholder={t("Select unit type")} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {selectedProduct?.wholesaleUnit && selectedProduct.whole_sale_unit_amount && (
                                                                <SelectItem value="wholesale" className="p-4">
                                                                    <div className="flex items-center space-x-4">
                                                                        <div className="p-2 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-lg">
                                                                            <Package className="h-5 w-5 text-orange-600" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="font-semibold text-slate-800 dark:text-white">
                                                                                {selectedProduct.wholesaleUnit.name} ({selectedProduct.wholesaleUnit.symbol})
                                                                            </div>
                                                                            <div className="text-sm text-slate-500 flex items-center gap-2">
                                                                                <DollarSign className="w-3 h-3" />
                                                                                {formatCurrency(selectedProduct.wholesale_price)} per unit
                                                                                <Badge variant="secondary" className="text-xs">
                                                                                    {selectedProduct.whole_sale_unit_amount} pieces
                                                                                </Badge>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </SelectItem>
                                                            )}
                                                            {selectedProduct?.retailUnit && (
                                                                <SelectItem value="retail" className="p-4">
                                                                    <div className="flex items-center space-x-4">
                                                                        <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg">
                                                                            <Package className="h-5 w-5 text-blue-600" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="font-semibold text-slate-800 dark:text-white">
                                                                                {selectedProduct.retailUnit.name} ({selectedProduct.retailUnit.symbol})
                                                                            </div>
                                                                            <div className="text-sm text-slate-500 flex items-center gap-2">
                                                                                <DollarSign className="w-3 h-3" />
                                                                                {formatCurrency(selectedProduct.retail_price)} per unit
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </SelectItem>
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.unit_type && (
                                                        <p className="text-sm text-red-600">{errors.unit_type}</p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Calculation Info */}
                                            {selectedProduct && data.unit_type && data.quantity && data.price && (
                                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Info className="h-4 w-4 text-blue-600" />
                                                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                                            {t("Calculation Summary")}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-blue-600 dark:text-blue-400">
                                                        {data.unit_type === 'wholesale' && selectedProduct.whole_sale_unit_amount > 1 ? (
                                                            <p>
                                                                {data.quantity} × {selectedProduct.whole_sale_unit_amount} = {calculatedQuantity} {t("units")} × {formatCurrency(data.price)} = {formatCurrency(calculatedTotal)}
                                                            </p>
                                                        ) : (
                                                            <p>
                                                                {data.quantity} × {formatCurrency(data.price)} = {formatCurrency(calculatedTotal)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="quantity">{t("Quantity")} *</Label>
                                                    <Input
                                                        id="quantity"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        placeholder={t("Enter quantity")}
                                                        value={data.quantity}
                                                        onChange={(e) => setData('quantity', e.target.value)}
                                                    />
                                                    {errors.quantity && (
                                                        <p className="text-sm text-red-600">{errors.quantity}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="price">{t("Unit Price")} *</Label>
                                                    <Input
                                                        id="price"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        placeholder={t("Enter price")}
                                                        value={data.price}
                                                        onChange={(e) => setData('price', e.target.value)}
                                                    />
                                                    {errors.price && (
                                                        <p className="text-sm text-red-600">{errors.price}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="total_price">{t("Total Price")}</Label>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setManualTotal(!manualTotal)}
                                                        className="text-xs"
                                                    >
                                                        {manualTotal ? t("Auto Calculate") : t("Manual Entry")}
                                                    </Button>
                                                </div>
                                                <Input
                                                    id="total_price"
                                                    type="number"
                                                    step="0.01"
                                                    value={data.total_price}
                                                    onChange={(e) => setData('total_price', e.target.value)}
                                                    readOnly={!manualTotal}
                                                    className={!manualTotal ? "bg-slate-50 dark:bg-slate-800" : ""}
                                                />
                                                {!manualTotal && (
                                                    <p className="text-xs text-slate-500">
                                                        {selectedProduct && data.unit_type === 'wholesale' && selectedProduct.whole_sale_unit_amount > 1 
                                                            ? t("Automatically calculated with wholesale multiplier")
                                                            : t("Automatically calculated from quantity × price")
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex justify-end space-x-2 pt-4">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setIsDialogOpen(false)}
                                                >
                                                    {t("Cancel")}
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                                >
                                                    {processing ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            {t("Saving...")}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="h-4 w-4 mr-2" />
                                                            {editingItem ? t("Update") : t("Add Item")}
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>

                                <Link href={route("admin.purchases.show", purchase.id)}>
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-all duration-200 border-green-200 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Purchase")}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-green-300 dark:scrollbar-thumb-green-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="space-y-8"
                            >
                                {/* Enhanced Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.4 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border hover:scale-105 transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Total Items")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-green-600">
                                                            {filteredItems.length}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {t("Products")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl">
                                                        <Package className="h-8 w-8 text-green-600" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.0, duration: 0.4 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border hover:scale-105 transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Total Quantity")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-blue-600">
                                                            {getTotalQuantity().toLocaleString()}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {t("Units ordered")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl">
                                                        <Hash className="h-8 w-8 text-blue-600" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.1, duration: 0.4 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border hover:scale-105 transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                            {t("Total Amount")}
                                                        </p>
                                                        <p className="text-3xl font-bold text-purple-600">
                                                            {formatCurrency(getTotalAmount())}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {t("Purchase value")}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl">
                                                        <DollarSign className="h-8 w-8 text-purple-600" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.2, duration: 0.4 }}
                                    >
                                        <Card 
                                            className="border-0 shadow-2xl bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/40 dark:to-emerald-900/40 backdrop-blur-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
                                            onClick={openCreateDialog}
                                        >
                                            <CardContent className="p-6">
                                                <div className="flex flex-col items-center justify-center text-center">
                                                    <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-200">
                                                        <Plus className="h-8 w-8 text-white" />
                                                    </div>
                                                    <p className="text-lg font-bold text-green-700 dark:text-green-300 mb-1">
                                                        {t("Add New Item")}
                                                    </p>
                                                    <p className="text-xs text-green-600 dark:text-green-400">
                                                        {t("Click to add product")}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>

                                {/* Advanced Filters */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.3, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                                        <Filter className="h-5 w-5 text-white" />
                                                    </div>
                                                    {t("Search & Filter")}
                                                </CardTitle>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setShowFilters(!showFilters)}
                                                    className="gap-2"
                                                >
                                                    <Filter className="h-4 w-4" />
                                                    {showFilters ? t("Hide Filters") : t("Show Filters")}
                                                    <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            {/* Search Bar */}
                                            <div className="mb-4">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                    <Input
                                                        placeholder={t("Search by product name, barcode, or unit type...")}
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="pl-12 h-12 text-lg border-2 border-green-200 focus:border-green-500 rounded-xl"
                                                    />
                                                    {searchTerm && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setSearchTerm("")}
                                                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Advanced Filters */}
                                            <AnimatePresence>
                                                {showFilters && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                                            <div>
                                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                    {t("Sort By")}
                                                                </label>
                                                                <Select value={sortBy} onValueChange={setSortBy}>
                                                                    <SelectTrigger className="h-10">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="created_at">{t("Date Added")}</SelectItem>
                                                                        <SelectItem value="product.name">{t("Product Name")}</SelectItem>
                                                                        <SelectItem value="quantity">{t("Quantity")}</SelectItem>
                                                                        <SelectItem value="price">{t("Unit Price")}</SelectItem>
                                                                        <SelectItem value="total_price">{t("Total Price")}</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                    {t("Sort Order")}
                                                                </label>
                                                                <Select value={sortOrder} onValueChange={setSortOrder}>
                                                                    <SelectTrigger className="h-10">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="desc">{t("Descending")}</SelectItem>
                                                                        <SelectItem value="asc">{t("Ascending")}</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className="flex items-end">
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={clearFilters}
                                                                    className="w-full h-10 gap-2"
                                                                >
                                                                    <RefreshCw className="h-4 w-4" />
                                                                    {t("Clear Filters")}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Items Table */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.4, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                        <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                                    <Package className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Purchase Items")}
                                                <Badge variant="secondary" className="ml-auto">
                                                    {filteredItems.length} {t("of")} {purchaseItems.length}
                                                </Badge>
                                                <Button 
                                                    onClick={openCreateDialog}
                                                    className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                                                    size="sm"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                    {t("Add New Item")}
                                                </Button>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Product")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Quantity")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Unit Type")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Unit Price")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Total Price")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Actual Qty")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Date Added")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Actions")}
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {filteredItems.length > 0 ? (
                                                            filteredItems.map((item, index) => (
                                                                <TableRow
                                                                    key={item.id}
                                                                    className="hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors"
                                                                >
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg">
                                                                                <Package className="h-4 w-4 text-blue-600" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-semibold text-slate-800 dark:text-white">
                                                                                    {item.product?.name || 'N/A'}
                                                                                </p>
                                                                                <div className="flex items-center gap-2 mt-1">
                                                                                    {item.product?.barcode && (
                                                                                        <Badge variant="outline" className="text-xs">
                                                                                            {item.product.barcode}
                                                                                        </Badge>
                                                                                    )}
                                                                                    <Badge variant="outline" className="text-xs">
                                                                                        ID: {item.product?.id}
                                                                                    </Badge>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                                                            {parseFloat(item.quantity).toLocaleString()}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {item.unit_type ? (
                                                                            <Badge 
                                                                                variant="outline" 
                                                                                className={`${item.unit_type === 'wholesale' ? 'border-orange-300 text-orange-700 bg-orange-50' : 'border-blue-300 text-blue-700 bg-blue-50'}`}
                                                                            >
                                                                                {item.unit_type === 'wholesale' ? t('Wholesale') : t('Retail')}
                                                                            </Badge>
                                                                        ) : (
                                                                            <span className="text-sm text-slate-500">-</span>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell className="font-medium">
                                                                        {formatCurrency(item.price)}
                                                                    </TableCell>
                                                                    <TableCell className="font-bold text-green-600">
                                                                        {formatCurrency(item.total_price)}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {item.unit_type === 'wholesale' && item.product?.whole_sale_unit_amount ? (
                                                                            <div className="text-sm">
                                                                                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                                                                                    {(parseFloat(item.quantity) * item.product.whole_sale_unit_amount).toLocaleString()}
                                                                                </Badge>
                                                                                <p className="text-xs text-slate-500 mt-1">
                                                                                    {item.quantity} × {item.product.whole_sale_unit_amount}
                                                                                </p>
                                                                            </div>
                                                                        ) : (
                                                                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                                                                {parseFloat(item.quantity).toLocaleString()}
                                                                            </Badge>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                                                                        <div className="flex items-center gap-2">
                                                                            <Calendar className="h-4 w-4" />
                                                                            {formatDate(item.created_at)}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() => handleEdit(item)}
                                                                                className="h-8 w-8 p-0 hover:bg-green-50 hover:border-green-300"
                                                                            >
                                                                                <Edit className="h-4 w-4 text-green-600" />
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() => handleDelete(item.id)}
                                                                                className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-300"
                                                                            >
                                                                                <Trash2 className="h-4 w-4 text-red-600" />
                                                                            </Button>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan="8" className="h-32 text-center">
                                                                    <div className="flex flex-col items-center gap-4">
                                                                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                                            <Package className="h-8 w-8 text-slate-400" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                                                                {searchTerm ? t("No items match your search") : t("No items found")}
                                                                            </p>
                                                                            <p className="text-sm text-slate-500">
                                                                                {searchTerm ? t("Try adjusting your search terms") : t("Add items to this purchase order")}
                                                                            </p>
                                                                        </div>
                                                                        {!searchTerm && (
                                                                            <Button onClick={openCreateDialog} className="gap-2">
                                                                                <Plus className="h-4 w-4" />
                                                                                {t("Add First Item")}
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
} 