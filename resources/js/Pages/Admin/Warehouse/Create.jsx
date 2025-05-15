import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { Building2, ArrowLeft } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Switch } from "@/Components/ui/switch";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Create({ auth }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        code: "",
        description: "",
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.warehouses.store"));
    };

    // Simulate loading delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title={t("Create Warehouse")}>
                <style>{`
                    .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
                        background-size: 14px 14px;
                    }

                    .dark .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.warehouses" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-0.5">
                                    {t("Admin Panel")}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    {t("Create Warehouse")}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Link href={route("admin.warehouses.index")}>
                                <Button variant="outline" className="gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    {t("Back to List")}
                                </Button>
                            </Link>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-6">
                            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                                <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                        <Building2 className="h-5 w-5 text-indigo-500" />
                                        {t("Warehouse Information")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Name */}
                                            <div className="space-y-2">
                                                <Label htmlFor="name">
                                                    {t("Name")} <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData("name", e.target.value)
                                                    }
                                                    className={
                                                        errors.name
                                                            ? "border-red-500"
                                                            : ""
                                                    }
                                                />
                                                {errors.name && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.name}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Code */}
                                            <div className="space-y-2">
                                                <Label htmlFor="code">
                                                    {t("Code")} <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="code"
                                                    type="text"
                                                    value={data.code}
                                                    onChange={(e) =>
                                                        setData("code", e.target.value)
                                                    }
                                                    className={
                                                        errors.code
                                                            ? "border-red-500"
                                                            : ""
                                                    }
                                                />
                                                {errors.code && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.code}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Description */}
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="description">
                                                    {t("Description")}
                                                </Label>
                                                <Textarea
                                                    id="description"
                                                    value={data.description}
                                                    onChange={(e) =>
                                                        setData(
                                                            "description",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={
                                                        errors.description
                                                            ? "border-red-500"
                                                            : ""
                                                    }
                                                />
                                                {errors.description && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.description}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Status */}
                                            <div className="space-y-2">
                                                <Label htmlFor="is_active">
                                                    {t("Status")}
                                                </Label>
                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        id="is_active"
                                                        checked={data.is_active}
                                                        onCheckedChange={(checked) =>
                                                            setData(
                                                                "is_active",
                                                                checked
                                                            )
                                                        }
                                                    />
                                                    <Label htmlFor="is_active">
                                                        {t("Active")}
                                                    </Label>
                                                </div>
                                                {errors.is_active && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.is_active}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="flex justify-end">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                            >
                                                {processing
                                                    ? t("Creating...")
                                                    : t("Create Warehouse")}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
