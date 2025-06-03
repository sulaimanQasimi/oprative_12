import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    Save,
    DollarSign,
    Package,
    Barcode,
    Tag,
    Scale,
    Activity,
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

export default function Edit({ auth, product, units = [] }) {
    const { t } = useLaravelReactI18n();
    const { data, setData, put, processing, errors, reset } = useForm({
        type: product.type || "",
        name: product.name || "",
        barcode: product.barcode || "",
        purchase_price: product.purchase_price || "",
        wholesale_price: product.wholesale_price || "",
        retail_price: product.retail_price || "",
        is_activated: product.is_activated || false,
        is_in_stock: product.is_in_stock || false,
        is_shipped: product.is_shipped || false,
        is_trend: product.is_trend || false,
        wholesale_unit_id: product.wholesale_unit_id?.toString() || "",
        retail_unit_id: product.retail_unit_id?.toString() || "",
        whole_sale_unit_amount: product.whole_sale_unit_amount || "",
        retails_sale_unit_amount: product.retails_sale_unit_amount || "",
    });

    function submit(e) {
        e.preventDefault();
        put(route("admin.products.update", product.id));
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

                    <main className="flex-1 overflow-auto p-6">
                        <div className="max-w-4xl mx-auto">
                            <form onSubmit={submit} className="space-y-8">
                                {/* Basic Information */}
                                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                                        <CardTitle className="flex items-center gap-3 text-lg">
                                            <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            {t("Basic Information")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="type" className="flex items-center gap-2 text-sm font-medium">
                                                    <Tag className="h-4 w-4 text-gray-500" />
                                                    {t("Product Type")}
                                                </Label>
                                                <Input
                                                    id="type"
                                                    type="text"
                                                    value={data.type}
                                                    placeholder={t("Enter product type")}
                                                    onChange={(e) => setData("type", e.target.value)}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                                                />
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
                                                <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                                                    <Package className="h-4 w-4 text-gray-500" />
                                                    {t("Product Name")}
                                                </Label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    value={data.name}
                                                    placeholder={t("Enter product name")}
                                                    onChange={(e) => setData("name", e.target.value)}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
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
                                            <Label htmlFor="barcode" className="flex items-center gap-2 text-sm font-medium">
                                                <Barcode className="h-4 w-4 text-gray-500" />
                                                {t("Barcode")}
                                            </Label>
                                            <Input
                                                id="barcode"
                                                type="text"
                                                value={data.barcode}
                                                placeholder={t("Enter product barcode")}
                                                onChange={(e) => setData("barcode", e.target.value)}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
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

                                {/* Pricing Information */}
                                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                                        <CardTitle className="flex items-center gap-3 text-lg">
                                            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            {t("Pricing Information")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="purchase_price" className="flex items-center gap-2 text-sm font-medium">
                                                    <DollarSign className="h-4 w-4 text-gray-500" />
                                                    {t("Purchase Price")}
                                                </Label>
                                                <Input
                                                    id="purchase_price"
                                                    type="number"
                                                    step="0.01"
                                                    value={data.purchase_price}
                                                    placeholder="0.00"
                                                    onChange={(e) => setData("purchase_price", e.target.value)}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                                                />
                                                {errors.purchase_price && (
                                                    <div className="flex items-center gap-2 text-red-600 text-sm">
                                                        <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center">
                                                            <span className="text-xs">!</span>
                                                        </div>
                                                        {errors.purchase_price}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="wholesale_price" className="flex items-center gap-2 text-sm font-medium">
                                                    <DollarSign className="h-4 w-4 text-gray-500" />
                                                    {t("Wholesale Price")}
                                                </Label>
                                                <Input
                                                    id="wholesale_price"
                                                    type="number"
                                                    step="0.01"
                                                    value={data.wholesale_price}
                                                    placeholder="0.00"
                                                    onChange={(e) => setData("wholesale_price", e.target.value)}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                                                />
                                                {errors.wholesale_price && (
                                                    <div className="flex items-center gap-2 text-red-600 text-sm">
                                                        <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center">
                                                            <span className="text-xs">!</span>
                                                        </div>
                                                        {errors.wholesale_price}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="retail_price" className="flex items-center gap-2 text-sm font-medium">
                                                    <DollarSign className="h-4 w-4 text-gray-500" />
                                                    {t("Retail Price")}
                                                </Label>
                                                <Input
                                                    id="retail_price"
                                                    type="number"
                                                    step="0.01"
                                                    value={data.retail_price}
                                                    placeholder="0.00"
                                                    onChange={(e) => setData("retail_price", e.target.value)}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                                                />
                                                {errors.retail_price && (
                                                    <div className="flex items-center gap-2 text-red-600 text-sm">
                                                        <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center">
                                                            <span className="text-xs">!</span>
                                                        </div>
                                                        {errors.retail_price}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Unit Configuration */}
                                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                                        <CardTitle className="flex items-center gap-3 text-lg">
                                            <Scale className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            {t("Unit Configuration")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="wholesale_unit_id" className="flex items-center gap-2 text-sm font-medium">
                                                    <Scale className="h-4 w-4 text-gray-500" />
                                                    {t("Wholesale Unit")}
                                                </Label>
                                                <Select
                                                    value={data.wholesale_unit_id}
                                                    onValueChange={(value) => setData("wholesale_unit_id", value)}
                                                >
                                                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-purple-500/20">
                                                        <SelectValue placeholder={t("Select wholesale unit")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {units.map((unit) => (
                                                            <SelectItem key={unit.id} value={unit.id.toString()}>
                                                                {unit.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.wholesale_unit_id && (
                                                    <div className="flex items-center gap-2 text-red-600 text-sm">
                                                        <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center">
                                                            <span className="text-xs">!</span>
                                                        </div>
                                                        {errors.wholesale_unit_id}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="retail_unit_id" className="flex items-center gap-2 text-sm font-medium">
                                                    <Scale className="h-4 w-4 text-gray-500" />
                                                    {t("Retail Unit")}
                                                </Label>
                                                <Select
                                                    value={data.retail_unit_id}
                                                    onValueChange={(value) => setData("retail_unit_id", value)}
                                                >
                                                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-purple-500/20">
                                                        <SelectValue placeholder={t("Select retail unit")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {units.map((unit) => (
                                                            <SelectItem key={unit.id} value={unit.id.toString()}>
                                                                {unit.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.retail_unit_id && (
                                                    <div className="flex items-center gap-2 text-red-600 text-sm">
                                                        <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center">
                                                            <span className="text-xs">!</span>
                                                        </div>
                                                        {errors.retail_unit_id}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="whole_sale_unit_amount" className="flex items-center gap-2 text-sm font-medium">
                                                    <DollarSign className="h-4 w-4 text-gray-500" />
                                                    {t("Wholesale Unit Amount")}
                                                </Label>
                                                <Input
                                                    id="whole_sale_unit_amount"
                                                    type="number"
                                                    step="0.01"
                                                    value={data.whole_sale_unit_amount}
                                                    placeholder="0.00"
                                                    onChange={(e) => setData("whole_sale_unit_amount", e.target.value)}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-purple-500/20"
                                                />
                                                {errors.whole_sale_unit_amount && (
                                                    <div className="flex items-center gap-2 text-red-600 text-sm">
                                                        <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center">
                                                            <span className="text-xs">!</span>
                                                        </div>
                                                        {errors.whole_sale_unit_amount}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="retails_sale_unit_amount" className="flex items-center gap-2 text-sm font-medium">
                                                    <DollarSign className="h-4 w-4 text-gray-500" />
                                                    {t("Retail Unit Amount")}
                                                </Label>
                                                <Input
                                                    id="retails_sale_unit_amount"
                                                    type="number"
                                                    step="0.01"
                                                    value={data.retails_sale_unit_amount}
                                                    placeholder="0.00"
                                                    onChange={(e) => setData("retails_sale_unit_amount", e.target.value)}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-purple-500/20"
                                                />
                                                {errors.retails_sale_unit_amount && (
                                                    <div className="flex items-center gap-2 text-red-600 text-sm">
                                                        <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center">
                                                            <span className="text-xs">!</span>
                                                        </div>
                                                        {errors.retails_sale_unit_amount}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Status Configuration */}
                                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
                                        <CardTitle className="flex items-center gap-3 text-lg">
                                            <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                            {t("Status Configuration")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex items-center space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                                                <Checkbox
                                                    id="is_activated"
                                                    checked={data.is_activated}
                                                    onCheckedChange={(checked) => setData("is_activated", checked)}
                                                    className="scale-110"
                                                />
                                                <Label
                                                    htmlFor="is_activated"
                                                    className="text-sm font-medium cursor-pointer flex-1"
                                                >
                                                    {t("Product is Activated")}
                                                </Label>
                                            </div>

                                            <div className="flex items-center space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                                                <Checkbox
                                                    id="is_in_stock"
                                                    checked={data.is_in_stock}
                                                    onCheckedChange={(checked) => setData("is_in_stock", checked)}
                                                    className="scale-110"
                                                />
                                                <Label
                                                    htmlFor="is_in_stock"
                                                    className="text-sm font-medium cursor-pointer flex-1"
                                                >
                                                    {t("Product is in Stock")}
                                                </Label>
                                            </div>

                                            <div className="flex items-center space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                                                <Checkbox
                                                    id="is_shipped"
                                                    checked={data.is_shipped}
                                                    onCheckedChange={(checked) => setData("is_shipped", checked)}
                                                    className="scale-110"
                                                />
                                                <Label
                                                    htmlFor="is_shipped"
                                                    className="text-sm font-medium cursor-pointer flex-1"
                                                >
                                                    {t("Product is Shipped")}
                                                </Label>
                                            </div>

                                            <div className="flex items-center space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                                                <Checkbox
                                                    id="is_trend"
                                                    checked={data.is_trend}
                                                    onCheckedChange={(checked) => setData("is_trend", checked)}
                                                    className="scale-110"
                                                />
                                                <Label
                                                    htmlFor="is_trend"
                                                    className="text-sm font-medium cursor-pointer flex-1"
                                                >
                                                    {t("Product is Trending")}
                                                </Label>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-end space-x-4 pt-6">
                                    <Link href={route("admin.products.index")}>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="px-6 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                                        >
                                            {t("Cancel")}
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        {processing ? t("Updating...") : t("Update Product")}
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
