import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    Save,
    Package,
    Barcode,
    Tag,
    Scale,
    Activity,
    Plus,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Checkbox } from "@/Components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import Navigation from "@/Components/Admin/Navigation";

export default function Edit({ auth, product, units = [], categories = [], permissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    
    const { data, setData, put, processing, errors, reset } = useForm({
        type: product.type || "product",
        name: product.name || "",
        barcode: product.barcode || "",
        category_id: product.category_id?.toString() || "",
        unit_id: product.unit_id?.toString() || "",
        status: product.status ?? true,
    });

    const { data: categoryData, setData: setCategoryData, post: postCategory, processing: categoryProcessing, errors: categoryErrors, reset: resetCategory } = useForm({
        general_name: "",
        sub_name: "",
        final_name: "",
    });

    function submit(e) {
        e.preventDefault();
        put(route("admin.products.update", product.id));
    }

    function submitCategory(e) {
        e.preventDefault();
        postCategory(route("admin.categories.store"), {
            onSuccess: () => {
                resetCategory();
                setShowCategoryForm(false);
                // Refresh the page to get updated categories
                window.location.reload();
            },
        });
    }

    return (
        <>
            <Head title={t("Edit Product")} />

            <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
                <Navigation auth={auth} currentRoute="admin.products" />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="bg-white dark:bg-gray-900 shadow border-b border-gray-200 dark:border-gray-800">
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href={route("admin.products.index")}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                    >
                                        <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    </Link>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {t("Edit Product")}
                                        </h1>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {t("Update product information")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-950">
                        <div className="max-w-4xl mx-auto">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Basic Information */}
                                <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
                                    <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                                        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
                                            <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            {t("Basic Information")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="type" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                    {t("Product Type")}
                                                </Label>
                                                <Select
                                                    value={data.type}
                                                    onValueChange={(value) => setData("type", value)}
                                                >
                                                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20">
                                                        <SelectValue placeholder={t("Select product type")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="product">{t("Product")}</SelectItem>
                                                        <SelectItem value="service">{t("Service")}</SelectItem>
                                                        <SelectItem value="material">{t("Material")}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.type && (
                                                    <div className="flex items-center gap-2 text-red-600 text-sm">
                                                        <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center">
                                                            <span className="text-xs">!</span>
                                                        </div>
                                                        {errors.type}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    <Package className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                    {t("Product Name")}
                                                </Label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    value={data.name}
                                                    placeholder={t("Enter product name")}
                                                    onChange={(e) => setData("name", e.target.value)}
                                                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                                                />
                                                {errors.name && (
                                                    <div className="flex items-center gap-2 text-red-600 text-sm">
                                                        <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center">
                                                            <span className="text-xs">!</span>
                                                        </div>
                                                        {errors.name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="barcode" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                <Barcode className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                {t("Barcode")}
                                            </Label>
                                            <Input
                                                id="barcode"
                                                type="text"
                                                value={data.barcode}
                                                placeholder={t("Enter product barcode")}
                                                onChange={(e) => setData("barcode", e.target.value)}
                                                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                                            />
                                            {errors.barcode && (
                                                <div className="flex items-center gap-2 text-red-600 text-sm">
                                                    <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center">
                                                        <span className="text-xs">!</span>
                                                    </div>
                                                    {errors.barcode}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Category and Unit Information */}
                                <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
                                    <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                                        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
                                            <Tag className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            {t("Category & Unit")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="category_id" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                    {t("Category")}
                                                </Label>
                                                                                                <div className="space-y-3">
                                                    <Select
                                                        value={data.category_id}
                                                        onValueChange={(value) => setData("category_id", value)}
                                                    >
                                                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 focus:ring-green-500/20 dark:focus:ring-green-400/20">
                                                            <SelectValue placeholder={t("Select category")} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="">{t("No Category")}</SelectItem>
                                                            {categories.filter(cat => cat.level === 3).map((category) => (
                                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                                    {category.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => setShowCategoryForm(!showCategoryForm)}
                                                        className="w-full h-10 text-sm border-dashed border-2 border-green-200 hover:border-green-400 hover:bg-green-50 dark:border-green-700 dark:hover:border-green-600 dark:hover:bg-green-900/20"
                                                    >
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        {showCategoryForm ? t("Cancel Category Creation") : t("Create New Category")}
                                                    </Button>
                                                </div>
                                                
                                                {showCategoryForm && (
                                                    <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200 dark:border-green-700">
                                                        <form onSubmit={submitCategory} className="space-y-4">
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                <div>
                                                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                        {t("General Category")} *
                                                                    </Label>
                                                                    <Input
                                                                        value={categoryData.general_name}
                                                                        onChange={(e) => setCategoryData("general_name", e.target.value)}
                                                                        placeholder={t("e.g., Electronics")}
                                                                        className="mt-1 h-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                                                                    />
                                                                    {categoryErrors.general_name && (
                                                                        <p className="text-sm text-red-600 mt-1">{categoryErrors.general_name}</p>
                                                                    )}
                                                                </div>
                                                                
                                                                <div>
                                                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                        {t("Sub Category")} *
                                                                    </Label>
                                                                    <Input
                                                                        value={categoryData.sub_name}
                                                                        onChange={(e) => setCategoryData("sub_name", e.target.value)}
                                                                        placeholder={t("e.g., Computers")}
                                                                        className="mt-1 h-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                                                                    />
                                                                    {categoryErrors.sub_name && (
                                                                        <p className="text-sm text-red-600 mt-1">{categoryErrors.sub_name}</p>
                                                                    )}
                                                                </div>
                                                                
                                                                <div>
                                                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                        {t("Final Category")} *
                                                                    </Label>
                                                                    <Input
                                                                        value={categoryData.final_name}
                                                                        onChange={(e) => setCategoryData("final_name", e.target.value)}
                                                                        placeholder={t("e.g., Laptops")}
                                                                        className="mt-1 h-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                                                                    />
                                                                    {categoryErrors.final_name && (
                                                                        <p className="text-sm text-red-600 mt-1">{categoryErrors.final_name}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex justify-end space-x-2">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    onClick={() => setShowCategoryForm(false)}
                                                                    className="h-9 px-4"
                                                                >
                                                                    {t("Cancel")}
                                                                </Button>
                                                                <Button
                                                                    type="submit"
                                                                    disabled={categoryProcessing}
                                                                    className="h-9 px-4 bg-green-600 hover:bg-green-700"
                                                                >
                                                                    {categoryProcessing ? (
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                            {t("Creating...")}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex items-center gap-2">
                                                                            <Plus className="w-4 h-4" />
                                                                            {t("Create Category")}
                                                                        </div>
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                )}
                                                {errors.category_id && (
                                                    <div className="flex items-center gap-2 text-red-600 text-sm">
                                                        <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center">
                                                            <span className="text-xs">!</span>
                                                        </div>
                                                        {errors.category_id}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="unit_id" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    <Scale className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                    {t("Unit")}
                                                </Label>
                                                <Select
                                                    value={data.unit_id}
                                                    onValueChange={(value) => setData("unit_id", value)}
                                                >
                                                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 focus:ring-green-500/20 dark:focus:ring-green-400/20">
                                                        <SelectValue placeholder={t("Select unit")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="">{t("No Unit")}</SelectItem>
                                                        {units.map((unit) => (
                                                            <SelectItem key={unit.id} value={unit.id.toString()}>
                                                                {unit.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.unit_id && (
                                                    <div className="flex items-center gap-2 text-red-600 text-sm">
                                                        <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center">
                                                            <span className="text-xs">!</span>
                                                        </div>
                                                        {errors.unit_id}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Status */}
                                <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
                                    <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                                        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
                                            <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            {t("Status")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="status"
                                                checked={data.status}
                                                onCheckedChange={(checked) => setData("status", checked)}
                                                className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                            />
                                            <Label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {t("Active Status")}
                                            </Label>
                                        </div>
                                        {errors.status && (
                                            <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                                                <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center">
                                                    <span className="text-xs">!</span>
                                                </div>
                                                {errors.status}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Submit Button */}
                                <div className="flex justify-end space-x-4">
                                    <Link href={route("admin.products.index")}>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="px-6 py-2"
                                        >
                                            {t("Cancel")}
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                                    >
                                        {processing ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                {t("Updating...")}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Save className="w-4 h-4" />
                                                {t("Update Product")}
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
