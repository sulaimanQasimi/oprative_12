import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
import {
    Globe,
    ArrowLeft,
    Save,
    AlertCircle,
    CheckCircle,
    X,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Checkbox } from "@/Components/ui/checkbox";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Create({ auth }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        code: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.currencies.store"));
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
            <Head title={t("Add Currency")}>
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
                <Navigation auth={auth} currentRoute="admin.currencies" />

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
                                    {t("Add New Currency")}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Link href={route("admin.currencies.index")}>
                                <Button
                                    variant="outline"
                                    className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    {t("Back to List")}
                                </Button>
                            </Link>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-6 max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                        <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                            <Globe className="h-5 w-5 text-indigo-500" />
                                            {t("Currency Information")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        {Object.keys(errors).length > 0 && (
                                            <Alert
                                                variant="destructive"
                                                className="mb-6 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900"
                                            >
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>
                                                    {t(
                                                        "Please correct the errors below."
                                                    )}
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        <form
                                            onSubmit={handleSubmit}
                                            className="space-y-6"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Currency Name */}
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="name"
                                                        className="text-slate-800 dark:text-slate-200"
                                                    >
                                                        {t("Currency Name")}
                                                        <span className="text-red-500 ml-1">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        type="text"
                                                        value={data.name}
                                                        onChange={(e) =>
                                                            setData(
                                                                "name",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder={t(
                                                            "e.g. US Dollar"
                                                        )}
                                                        className={
                                                            errors.name
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                : ""
                                                        }
                                                    />
                                                    {errors.name && (
                                                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                                            {errors.name}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Currency Code */}
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="code"
                                                        className="text-slate-800 dark:text-slate-200"
                                                    >
                                                        {t("Currency Code")}
                                                        <span className="text-red-500 ml-1">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <Input
                                                        id="code"
                                                        type="text"
                                                        value={data.code}
                                                        onChange={(e) =>
                                                            setData(
                                                                "code",
                                                                e.target.value.toUpperCase()
                                                            )
                                                        }
                                                        placeholder={t(
                                                            "e.g. USD"
                                                        )}
                                                        maxLength={3}
                                                        className={`uppercase ${
                                                            errors.code
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                : ""
                                                        }`}
                                                    />
                                                    {errors.code ? (
                                                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                                            {errors.code}
                                                        </p>
                                                    ) : (
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {t(
                                                                "ISO 4217 currency code (3 letters)"
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex justify-end space-x-3">
                                                <Link
                                                    href={route(
                                                        "admin.currencies.index"
                                                    )}
                                                >
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                                                    >
                                                        <X className="h-4 w-4 mr-2" />
                                                        {t("Cancel")}
                                                    </Button>
                                                </Link>
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                                >
                                                    <Save className="h-4 w-4 mr-2" />
                                                    {processing
                                                        ? t("Saving...")
                                                        : t("Save Currency")}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
