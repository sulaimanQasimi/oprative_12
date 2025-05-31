import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Edit({ auth, unit }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: unit.name,
        code: unit.code,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        put(route("admin.units.update", unit.id), {
            onFinish: () => setLoading(false),
        });
    };

    return (
        <>
            <Head title={t("Edit Unit")}>
                <style>{`
                    @keyframes shimmer {
                        0% {
                            transform: translateX(-100%);
                        }
                        100% {
                            transform: translateX(100%);
                        }
                    }
                    .animate-shimmer {
                        animation: shimmer 3s infinite;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.units" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-0.5">
                                    {t("Admin Panel")}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                                    {t("Edit Unit")}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Button
                                variant="outline"
                                className="border-slate-200 dark:border-slate-800"
                                onClick={() => window.history.back()}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {t("Back")}
                            </Button>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="max-w-2xl mx-auto"
                            >
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-6">
                                        {/* Name */}
                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                {t("Name")}
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
                                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
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
                                                {t("Code")}
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
                                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                        : ""
                                                }
                                            />
                                            {errors.code && (
                                                <p className="text-sm text-red-500">
                                                    {errors.code}
                                                </p>
                                            )}
                                        </div>

                                        {/* Submit Button */}
                                        <div className="flex justify-end">
                                            <Button
                                                type="submit"
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                                disabled={processing}
                                            >
                                                <Save className="h-4 w-4 mr-2" />
                                                {t("Save")}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
