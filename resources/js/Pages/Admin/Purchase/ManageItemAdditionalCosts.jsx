import React, { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    Package,
    Save,
    DollarSign,
    Plus,
    Trash2,
    Receipt,
    Edit3,
    AlertCircle,
    TrendingUp,
    FileText,
    Info,
    Calculator,
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
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { motion } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";
import BackButton from "@/Components/BackButton";

export default function ManageItemAdditionalCosts({ auth, purchase, item, additionalCosts = [], permissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [editingCost, setEditingCost] = useState(null);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);

    const { data: addData, setData: setAddData, post, processing: addProcessing, errors: addErrors, reset: resetAdd } = useForm({
        name: '',
        amount: '',
        description: ''
    });

    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({
        name: '',
        amount: '',
        description: ''
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: purchase.currency?.code || 'USD',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const getTotalAdditionalCosts = () => {
        return additionalCosts.reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0);
    };

    const getTotalItemCost = () => {
        return parseFloat(item.total_price || 0) + getTotalAdditionalCosts();
    };

    const handleAddCost = (e) => {
        e.preventDefault();
        post(route('admin.purchases.items.additional-costs.store', [purchase.id, item.id]), {
            onSuccess: () => {
                resetAdd();
                setShowAddDialog(false);
            },
            onError: () => {
                // Keep dialog open on error
            }
        });
    };

    const handleEditCost = (cost) => {
        setEditingCost(cost);
        setEditData({
            name: cost.name,
            amount: cost.amount,
            description: cost.description || ''
        });
        setShowEditDialog(true);
    };

    const handleUpdateCost = (e) => {
        e.preventDefault();
        put(route('admin.purchases.items.additional-costs.update', [purchase.id, item.id, editingCost.id]), {
            onSuccess: () => {
                resetEdit();
                setEditingCost(null);
                setShowEditDialog(false);
            },
            onError: () => {
                // Keep dialog open on error
            }
        });
    };

    const handleDeleteCost = (cost) => {
        if (confirm(t('Are you sure you want to delete this additional cost?'))) {
            router.delete(route('admin.purchases.items.additional-costs.destroy', [purchase.id, item.id, cost.id]));
        }
    };

    return (
        <>
            <Head title={`${t("Manage Additional Costs")} - ${purchase.invoice_number}`} />
            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
                .float-animation { animation: float 6s ease-in-out infinite; }
                .glass-effect { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); }
                .dark .glass-effect { background: rgba(0, 0, 0, 0.2); backdrop-filter: blur(10px); }
                .gradient-border {
                    background: linear-gradient(white, white) padding-box, linear-gradient(45deg, #f59e0b, #d97706) border-box;
                    border: 2px solid transparent;
                }
                .dark .gradient-border {
                    background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box, linear-gradient(45deg, #f59e0b, #d97706) border-box;
                }
            `}</style>

            <PageLoader isVisible={loading} icon={Receipt} color="orange" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
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
                                    <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 p-4 rounded-2xl shadow-2xl">
                                        <Receipt className="w-8 h-8 text-white" />
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1 flex items-center gap-2"
                                    >
                                        <Package className="w-4 h-4" />
                                        {t("Item Additional Costs")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent"
                                    >
                                        {item.product?.name}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400"
                                    >
                                        {t("Purchase")}: {purchase.invoice_number}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7, duration: 0.4 }} className="flex items-center gap-3">
                                <Button 
                                    onClick={() => setShowAddDialog(true)}
                                    className="gap-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700 hover:scale-105 transition-all duration-200 shadow-lg"
                                >
                                    <Plus className="h-4 w-4" />
                                    {t("Create Cost")}
                                </Button>
                                <BackButton link={route("admin.purchases.show", purchase.id)} />
                            </motion.div>
                        </div>
                    </motion.header>

                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-orange-300 dark:scrollbar-thumb-orange-700 scrollbar-track-transparent p-8">
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}>
                            
                            {/* Item Summary */}
                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border max-w-6xl mx-auto mb-8">
                                <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                    <CardTitle className="flex items-center gap-3 text-xl">
                                        <Package className="h-6 w-6 text-blue-600" />
                                        {t("Item Details")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{t("Product")}</p>
                                            <p className="text-lg font-bold text-blue-800 dark:text-blue-200">{item.product?.name}</p>
                                            <p className="text-xs text-blue-500">{item.product?.barcode}</p>
                                        </div>
                                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">{t("Quantity")}</p>
                                            <p className="text-lg font-bold text-green-800 dark:text-green-200">
                                                {(item.quantity / item.unit_amount).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">{t("Unit Price")}</p>
                                            <p className="text-lg font-bold text-purple-800 dark:text-purple-200">{formatCurrency(item.price)}</p>
                                        </div>
                                        <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                            <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">{t("Item Total")}</p>
                                            <p className="text-lg font-bold text-orange-800 dark:text-orange-200">{formatCurrency(item.total_price)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Additional Costs Management */}
                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border max-w-6xl mx-auto mb-8">
                                <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="flex items-center gap-3 text-xl">
                                                <Receipt className="h-6 w-6 text-orange-600" />
                                                {t("Additional Costs")}
                                                <Badge variant="secondary" className="ml-2">
                                                    {additionalCosts.length} {t("costs")}
                                                </Badge>
                                            </CardTitle>
                                            <CardDescription className="mt-2">
                                                {t("Manage additional costs specific to this purchase item")}
                                            </CardDescription>
                                        </div>
                                        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                                            <DialogTrigger asChild>
                                                <Button className="gap-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700">
                                                    <Plus className="h-4 w-4" />
                                                    {t("Add Cost")}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[525px]">
                                                <form onSubmit={handleAddCost}>
                                                    <DialogHeader>
                                                        <DialogTitle className="flex items-center gap-2">
                                                            <Plus className="h-5 w-5 text-orange-600" />
                                                            {t("Add Additional Cost")}
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            {t("Add a new additional cost for this purchase item.")}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="name">{t("Cost Name")} *</Label>
                                                            <Input
                                                                id="name"
                                                                placeholder={t("e.g., Shipping, Tax, etc.")}
                                                                value={addData.name}
                                                                onChange={(e) => setAddData('name', e.target.value)}
                                                                className={addErrors.name ? 'border-red-500' : ''}
                                                            />
                                                            {addErrors.name && (
                                                                <p className="text-sm text-red-600 flex items-center gap-1">
                                                                    <AlertCircle className="w-4 h-4" />
                                                                    {addErrors.name}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="amount">{t("Amount")} *</Label>
                                                            <div className="relative">
                                                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                                <Input
                                                                    id="amount"
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0"
                                                                    placeholder="0.00"
                                                                    value={addData.amount}
                                                                    onChange={(e) => setAddData('amount', e.target.value)}
                                                                    className={`pl-10 ${addErrors.amount ? 'border-red-500' : ''}`}
                                                                />
                                                            </div>
                                                            {addErrors.amount && (
                                                                <p className="text-sm text-red-600 flex items-center gap-1">
                                                                    <AlertCircle className="w-4 h-4" />
                                                                    {addErrors.amount}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="description">{t("Description")}</Label>
                                                            <Textarea
                                                                id="description"
                                                                placeholder={t("Optional description")}
                                                                value={addData.description}
                                                                onChange={(e) => setAddData('description', e.target.value)}
                                                                rows={3}
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => {
                                                                setShowAddDialog(false);
                                                                resetAdd();
                                                            }}
                                                        >
                                                            {t("Cancel")}
                                                        </Button>
                                                        <Button
                                                            type="submit"
                                                            disabled={addProcessing}
                                                            className="bg-orange-600 hover:bg-orange-700"
                                                        >
                                                            {addProcessing ? (
                                                                <>
                                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                                    {t("Adding...")}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Save className="h-4 w-4 mr-2" />
                                                                    {t("Add Cost")}
                                                                </>
                                                            )}
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {additionalCosts.length > 0 ? (
                                        <div className="space-y-0">
                                            {additionalCosts.map((cost, index) => (
                                                <div key={cost.id} className={`flex items-center justify-between p-6 ${index < additionalCosts.length - 1 ? 'border-b border-slate-200 dark:border-slate-700' : ''} hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors`}>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <Receipt className="h-5 w-5 text-orange-600" />
                                                            <h3 className="font-semibold text-lg">{cost.name}</h3>
                                                        </div>
                                                        {cost.description && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{cost.description}</p>
                                                        )}
                                                        <p className="text-xs text-gray-500">
                                                            {t("Added")}: {new Date(cost.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right">
                                                            <p className="text-2xl font-bold text-orange-600">
                                                                {formatCurrency(cost.amount)}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleEditCost(cost)}
                                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            >
                                                                <Edit3 className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteCost(cost)}
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="mb-4">
                                                <Receipt className="h-16 w-16 text-gray-400 mx-auto" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                                {t("No Additional Costs")}
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-500 mb-4">
                                                {t("This item has no additional costs yet.")}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Cost Summary */}
                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border max-w-6xl mx-auto">
                                <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                    <CardTitle className="flex items-center gap-3 text-xl">
                                        <Calculator className="h-6 w-6 text-green-600" />
                                        {t("Cost Summary")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <span className="font-medium text-blue-800 dark:text-blue-200">{t("Item Total")}</span>
                                            <span className="text-xl font-bold text-blue-600">{formatCurrency(item.total_price)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                            <span className="font-medium text-orange-800 dark:text-orange-200">{t("Additional Costs")}</span>
                                            <span className="text-xl font-bold text-orange-600">{formatCurrency(getTotalAdditionalCosts())}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                                            <span className="text-lg font-bold text-green-800 dark:text-green-200">{t("Total Item Cost")}</span>
                                            <span className="text-2xl font-bold text-green-600">{formatCurrency(getTotalItemCost())}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Edit Dialog */}
                            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                                <DialogContent className="sm:max-w-[525px]">
                                    <form onSubmit={handleUpdateCost}>
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2">
                                                <Edit3 className="h-5 w-5 text-blue-600" />
                                                {t("Edit Additional Cost")}
                                            </DialogTitle>
                                            <DialogDescription>
                                                {t("Update the additional cost information.")}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="edit_name">{t("Cost Name")} *</Label>
                                                <Input
                                                    id="edit_name"
                                                    placeholder={t("e.g., Shipping, Tax, etc.")}
                                                    value={editData.name}
                                                    onChange={(e) => setEditData('name', e.target.value)}
                                                    className={editErrors.name ? 'border-red-500' : ''}
                                                />
                                                {editErrors.name && (
                                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                                        <AlertCircle className="w-4 h-4" />
                                                        {editErrors.name}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit_amount">{t("Amount")} *</Label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                    <Input
                                                        id="edit_amount"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        placeholder="0.00"
                                                        value={editData.amount}
                                                        onChange={(e) => setEditData('amount', e.target.value)}
                                                        className={`pl-10 ${editErrors.amount ? 'border-red-500' : ''}`}
                                                    />
                                                </div>
                                                {editErrors.amount && (
                                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                                        <AlertCircle className="w-4 h-4" />
                                                        {editErrors.amount}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit_description">{t("Description")}</Label>
                                                <Textarea
                                                    id="edit_description"
                                                    placeholder={t("Optional description")}
                                                    value={editData.description}
                                                    onChange={(e) => setEditData('description', e.target.value)}
                                                    rows={3}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setShowEditDialog(false);
                                                    setEditingCost(null);
                                                    resetEdit();
                                                }}
                                            >
                                                {t("Cancel")}
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={editProcessing}
                                                className="bg-blue-600 hover:bg-blue-700"
                                            >
                                                {editProcessing ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                        {t("Updating...")}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="h-4 w-4 mr-2" />
                                                        {t("Update Cost")}
                                                    </>
                                                )}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </motion.div>
                    </main>
                </div>
            </motion.div>
        </>
    );
} 