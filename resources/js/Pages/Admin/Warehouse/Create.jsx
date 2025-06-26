import React, { useState, useEffect, useRef } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
import anime from "animejs";
import {
    Building2,
    ArrowLeft,
    Save,
    AlertCircle,
    CheckCircle,
    MapPin,
    Package,
    Users,
    Settings,
    Zap,
    Shield,
    Activity,
    Info,
    FileText,
    Hash,
    Building,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Switch } from "@/Components/ui/switch";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";
import { Checkbox } from "@/Components/ui/checkbox";

export default function Create({ auth, permissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);

    // Refs for animation targets
    const headerRef = useRef(null);
    const formRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        code: "",
        description: "",
        location: "",
        capacity: "",
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.warehouses.store"));
    };

    // Initialize animations
    useEffect(() => {
        if (!isAnimated) {
            // Animate header
            anime({
                targets: headerRef.current,
                opacity: [0, 1],
                translateY: [-30, 0],
                duration: 800,
                easing: "easeOutExpo",
            });

            // Animate form
            anime({
                targets: formRef.current,
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 700,
                easing: "easeOutExpo",
                delay: 200,
            });

            setIsAnimated(true);
        }
    }, [isAnimated]);

    // Simulate loading delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title={t("Create Warehouse")}>
                <style>{`
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    .animate-shimmer {
                        animation: shimmer 3s infinite;
                    }
                    .bg-grid-pattern {
                        background-image:
                            linear-gradient(to right, rgba(0, 0, 0, 0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
                        background-size: 20px 20px;
                    }
                    .dark .bg-grid-pattern {
                        background-image:
                            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
                    }
                    .glass-effect {
                        backdrop-filter: blur(20px);
                        background: rgba(255, 255, 255, 0.9);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                    }
                    .dark .glass-effect {
                        background: rgba(2, 6, 23, 0.98);
                        border: 1px solid rgba(148, 163, 184, 0.15);
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
                    }
                    .form-card {
                        transition: all 0.3s ease;
                    }
                    .form-card:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                    }
                    .dark .form-card:hover {
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    }
                    .header-icon-container {
                        background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
                        border: 1px solid rgba(148, 163, 184, 0.15);
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                    }
                    .dark .header-icon-container {
                        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                        border: 1px solid rgba(148, 163, 184, 0.25);
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.15);
                    }
                    .header-glow {
                        background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
                        opacity: 0.3;
                    }
                    .dark .header-glow {
                        background: linear-gradient(135deg, #60a5fa 0%, #8b5cf6 100%);
                        opacity: 0.4;
                    }
                    .form-section {
                        transition: all 0.2s ease;
                    }
                    .form-section:hover {
                        background: rgba(248, 250, 252, 0.5);
                    }
                    .dark .form-section:hover {
                        background: rgba(15, 23, 42, 0.3);
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 bg-grid-pattern overflow-hidden">
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.warehouses" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Enhanced Header */}
                    <header
                        ref={headerRef}
                        className="glass-effect border-b border-slate-200/50 dark:border-slate-700/50 py-6 px-8 sticky top-0 z-40 bg-white/95 dark:bg-slate-900"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                                <div className="relative">
                                    <div className="absolute -inset-1 header-glow rounded-lg blur"></div>
                                    <div className="relative header-icon-container p-3 rounded-lg shadow-sm">
                                        <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                            {t("Warehouse Management")}
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700 shadow-sm"
                                        >
                                            <Activity className="h-3 w-3 mr-1" />
                                            {t("Create Mode")}
                                        </Badge>
                                    </div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                        {t("Create Warehouse")}
                                    </h1>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                                        {t(
                                            "Add a new warehouse facility to your system"
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Link href={route("admin.warehouses.index")}>
                                    <Button
                                        variant="outline"
                                        className="shadow-sm border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        {t("Back to List")}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <div
                                ref={formRef}
                                className="max-w-4xl mx-auto space-y-8"
                            >
                                {/* Form Card */}
                                <Card className="form-card border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
                                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-b border-slate-200/50 dark:border-slate-700/50 pb-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                                    <Building2 className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                                                        {t(
                                                            "Warehouse Information"
                                                        )}
                                                    </CardTitle>
                                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                                                        {t(
                                                            "Fill in the details for your new warehouse facility"
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700 shadow-sm"
                                            >
                                                <Info className="h-3 w-3 mr-1" />
                                                {t("Required Fields")}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <form
                                            onSubmit={handleSubmit}
                                            className="space-y-8"
                                        >
                                            {/* Basic Information Section */}
                                            <div className="space-y-6">
                                                <div className="flex items-center space-x-2 mb-4 p-3 rounded-lg form-section">
                                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-sm">
                                                        <FileText className="h-4 w-4 text-white" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                        {t("Basic Information")}
                                                    </h3>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Name */}
                                                    <div className="space-y-3">
                                                        <Label
                                                            htmlFor="name"
                                                            className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"
                                                        >
                                                            <Building className="h-4 w-4 text-blue-500" />
                                                            {t(
                                                                "Warehouse Name"
                                                            )}{" "}
                                                            <span className="text-red-500">
                                                                *
                                                            </span>
                                                        </Label>
                                                        <Input
                                                            id="name"
                                                            type="text"
                                                            placeholder={t(
                                                                "Enter warehouse name"
                                                            )}
                                                            value={data.name}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "name",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={`transition-all duration-200 bg-white/50 dark:bg-slate-800/50 ${
                                                                errors.name
                                                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                                                    : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                                                            }`}
                                                        />
                                                        {errors.name && (
                                                            <motion.p
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: -10,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                className="text-sm text-red-500 flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="h-3 w-3" />
                                                                {errors.name}
                                                            </motion.p>
                                                        )}
                                                    </div>

                                                    {/* Code */}
                                                    <div className="space-y-3">
                                                        <Label
                                                            htmlFor="code"
                                                            className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"
                                                        >
                                                            <Hash className="h-4 w-4 text-green-500" />
                                                            {t(
                                                                "Warehouse Code"
                                                            )}{" "}
                                                            <span className="text-red-500">
                                                                *
                                                            </span>
                                                        </Label>
                                                        <Input
                                                            id="code"
                                                            type="text"
                                                            placeholder={t(
                                                                "Enter unique warehouse code"
                                                            )}
                                                            value={data.code}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "code",
                                                                    e.target.value.toUpperCase()
                                                                )
                                                            }
                                                            className={`transition-all duration-200 font-mono bg-white/50 dark:bg-slate-800/50 ${
                                                                errors.code
                                                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                                                    : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                                                            }`}
                                                        />
                                                        {errors.code && (
                                                            <motion.p
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: -10,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                className="text-sm text-red-500 flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="h-3 w-3" />
                                                                {errors.code}
                                                            </motion.p>
                                                        )}
                                                    </div>

                                                    {/* Location */}
                                                    <div className="space-y-3">
                                                        <Label
                                                            htmlFor="location"
                                                            className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"
                                                        >
                                                            <MapPin className="h-4 w-4 text-orange-500" />
                                                            {t("Location")}
                                                        </Label>
                                                        <Input
                                                            id="location"
                                                            type="text"
                                                            placeholder={t(
                                                                "Enter warehouse location"
                                                            )}
                                                            value={
                                                                data.location
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "location",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={`transition-all duration-200 bg-white/50 dark:bg-slate-800/50 ${
                                                                errors.location
                                                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                                                    : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                                                            }`}
                                                        />
                                                        {errors.location && (
                                                            <motion.p
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: -10,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                className="text-sm text-red-500 flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="h-3 w-3" />
                                                                {
                                                                    errors.location
                                                                }
                                                            </motion.p>
                                                        )}
                                                    </div>

                                                    {/* Capacity */}
                                                    <div className="space-y-3">
                                                        <Label
                                                            htmlFor="capacity"
                                                            className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"
                                                        >
                                                            <Package className="h-4 w-4 text-purple-500" />
                                                            {t(
                                                                "Storage Capacity"
                                                            )}
                                                        </Label>
                                                        <Input
                                                            id="capacity"
                                                            type="number"
                                                            placeholder={t(
                                                                "Enter storage capacity"
                                                            )}
                                                            value={
                                                                data.capacity
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "capacity",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={`transition-all duration-200 bg-white/50 dark:bg-slate-800/50 ${
                                                                errors.capacity
                                                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                                                    : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                                                            }`}
                                                        />
                                                        {errors.capacity && (
                                                            <motion.p
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: -10,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                className="text-sm text-red-500 flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="h-3 w-3" />
                                                                {
                                                                    errors.capacity
                                                                }
                                                            </motion.p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <div className="space-y-3">
                                                    <Label
                                                        htmlFor="description"
                                                        className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"
                                                    >
                                                        <FileText className="h-4 w-4 text-indigo-500" />
                                                        {t("Description")}
                                                    </Label>
                                                    <Textarea
                                                        id="description"
                                                        placeholder={t(
                                                            "Enter warehouse description (optional)"
                                                        )}
                                                        value={data.description}
                                                        onChange={(e) =>
                                                            setData(
                                                                "description",
                                                                e.target.value
                                                            )
                                                        }
                                                        rows={4}
                                                        className={`transition-all duration-200 resize-none bg-white/50 dark:bg-slate-800/50 ${
                                                            errors.description
                                                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                                                : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                                                        }`}
                                                    />
                                                    {errors.description && (
                                                        <motion.p
                                                            initial={{
                                                                opacity: 0,
                                                                y: -10,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                y: 0,
                                                            }}
                                                            className="text-sm text-red-500 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.description}
                                                        </motion.p>
                                                    )}
                                                </div>
                                            </div>

                                            <Separator className="my-8 bg-slate-200 dark:bg-slate-700" />

                                            {/* Settings Section */}
                                            <div className="space-y-6">
                                                <div className="flex items-center space-x-2 mb-4 p-3 rounded-lg form-section">
                                                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-sm">
                                                        <Settings className="h-4 w-4 text-white" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                        {t(
                                                            "Warehouse Settings"
                                                        )}
                                                    </h3>
                                                </div>

                                                {/* Status */}
                                                <div className="space-y-3">
                                                    <Label
                                                        htmlFor="is_active"
                                                        className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"
                                                    >
                                                        <Activity className="h-4 w-4 text-green-500" />
                                                        {t("Warehouse Status")}
                                                    </Label>
                                                    <div className="flex items-center space-x-4 p-4 bg-slate-50/80 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
                                                        <div className="flex items-center space-x-4">
                                                            <Checkbox
                                                                id="is_active"
                                                                checked={
                                                                    data.is_active
                                                                }
                                                                onCheckedChange={(
                                                                    checked
                                                                ) =>
                                                                    setData(
                                                                        "is_active",
                                                                        checked
                                                                    )
                                                                }
                                                                className={`${
                                                                    data.is_active
                                                                        ? "border-green-500 bg-green-500 hover:bg-green-600"
                                                                        : "border-red-500 bg-red-500 hover:bg-red-600"
                                                                }`}
                                                            />
                                                            <div className="flex items-center space-x-2">
                                                                {data.is_active ? (
                                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                                ) : (
                                                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                                                )}
                                                                <span
                                                                    className={`text-sm ml-2 font-medium ${
                                                                        data.is_active
                                                                            ? "text-green-700 dark:text-green-400"
                                                                            : "text-red-700 dark:text-red-400"
                                                                    }`}
                                                                >
                                                                    {data.is_active
                                                                        ? t(
                                                                              "Active"
                                                                          )
                                                                        : t(
                                                                              "Inactive"
                                                                          )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {data.is_active
                                                                ? t(
                                                                      "Warehouse is operational and can be used"
                                                                  )
                                                                : t(
                                                                      "Warehouse is disabled and cannot be used"
                                                                  )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator className="my-8 bg-slate-200 dark:bg-slate-700" />

                                            {/* Action Buttons */}
                                            <div className="flex items-center justify-between pt-6">
                                                <Link
                                                    href={route(
                                                        "admin.warehouses.index"
                                                    )}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        className="shadow-sm border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                                    >
                                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                                        {t("Cancel")}
                                                    </Button>
                                                </Link>
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white shadow-lg min-w-[120px]"
                                                >
                                                    {processing ? (
                                                        <div className="flex items-center space-x-2">
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                            <span>
                                                                {t(
                                                                    "Creating..."
                                                                )}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center space-x-2">
                                                            <Save className="h-4 w-4" />
                                                            <span>
                                                                {t(
                                                                    "Create Warehouse"
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
