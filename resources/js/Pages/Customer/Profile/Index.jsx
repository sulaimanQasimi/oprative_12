import React, { useState, useEffect, useRef } from "react";
import { Head, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import CustomerNavbar from "@/Components/CustomerNavbar";
import { toast } from "react-hot-toast";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { motion } from "framer-motion";
import anime from "animejs";
import {
    User,
    Key,
    Mail,
    Save,
    ChevronRight,
    RefreshCw,
    Shield,
    AlertCircle,
} from "lucide-react";

// PageLoader component
const PageLoader = ({ isVisible }) => {
    return (
        <motion.div
            className="fixed inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-950 z-50 flex flex-col items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? "all" : "none",
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            {/* Background patterns */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>

            {/* Animated light beams */}
            <div className="absolute w-full h-full overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-gradient-to-r from-blue-400/10 via-indigo-500/10 to-transparent h-[30vh] w-[100vw]"
                        style={{
                            top: `${10 + i * 20}%`,
                            left: "-100%",
                            transformOrigin: "left center",
                            rotate: `${-20 + i * 10}deg`,
                        }}
                        animate={{
                            left: ["100%", "-100%"],
                        }}
                        transition={{
                            duration: 15 + i * 2,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 3,
                        }}
                    />
                ))}
            </div>

            {/* Animated particles */}
            <div className="absolute inset-0">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                            width: Math.random() * 4 + 1,
                            height: Math.random() * 4 + 1,
                            x: `${Math.random() * 100}%`,
                            y: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.5 + 0.2,
                        }}
                        animate={{
                            y: [null, `${-Math.random() * 100 - 50}%`],
                            opacity: [null, 0],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 5,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Main animated container */}
                <motion.div
                    className="relative"
                    animate={{
                        scale: [0.95, 1.05, 0.95],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    {/* Pulsing background circles */}
                    <motion.div
                        className="absolute w-64 h-64 rounded-full bg-blue-600/5 filter blur-2xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute w-72 h-72 rounded-full bg-indigo-500/5 filter blur-2xl transform -translate-x-4 translate-y-4"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                        }}
                    />

                    {/* Animated logo/icon container */}
                    <div className="relative flex items-center justify-center h-40 w-40">
                        {/* Spinning rings */}
                        <motion.div
                            className="absolute h-full w-full rounded-full border-4 border-blue-300/10"
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 20,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                        />
                        <motion.div
                            className="absolute h-[85%] w-[85%] rounded-full border-4 border-indigo-400/20"
                            animate={{
                                rotate: -360,
                            }}
                            transition={{
                                duration: 15,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                        />
                        <motion.div
                            className="absolute h-[70%] w-[70%] rounded-full border-4 border-blue-400/30"
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 10,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                        />

                        {/* Spinner arcs */}
                        <motion.div
                            className="absolute h-full w-full rounded-full border-4 border-r-blue-400 border-t-transparent border-l-transparent border-b-transparent"
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 1.5,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                        />
                        <motion.div
                            className="absolute h-full w-full rounded-full border-4 border-b-indigo-400 border-t-transparent border-l-transparent border-r-transparent"
                            animate={{ rotate: -180 }}
                            transition={{
                                duration: 2,
                                ease: "easeInOut",
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                        />

                        {/* Icon/logo in center */}
                        <motion.div
                            className="relative z-10 bg-gradient-to-br from-blue-500 to-indigo-600 h-20 w-20 rounded-2xl flex items-center justify-center shadow-xl"
                            animate={{
                                rotate: [0, 10, 0, -10, 0],
                                scale: [1, 1.1, 1, 1.1, 1],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <User className="h-10 w-10 text-white drop-shadow-lg" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default function Profile({ auth }) {
    const { t } = useLaravelReactI18n();
    const { data, setData, patch, errors, processing } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const [activeTab, setActiveTab] = useState("personal");
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);

    // Refs for animation targets
    const headerRef = useRef(null);
    const formCardRef = useRef(null);
    const timelineRef = useRef(null);

    const updateProfile = (e) => {
        e.preventDefault();

        patch(route("customer.profile.update"), {
            onSuccess: () => {
                toast.success("Profile updated successfully");
                setData("current_password", "");
                setData("password", "");
                setData("password_confirmation", "");
            },
        });
    };

    // Initialize animations
    useEffect(() => {
        if (!isAnimated) {
            // Initialize the timeline
            timelineRef.current = anime.timeline({
                easing: "easeOutExpo",
                duration: 800,
            });

            // Animate header
            timelineRef.current.add({
                targets: headerRef.current,
                opacity: [0, 1],
                translateY: [-20, 0],
                duration: 600,
            });

            // Animate form card
            timelineRef.current.add(
                {
                    targets: formCardRef.current,
                    opacity: [0, 1],
                    translateY: [20, 0],
                    scale: [0.98, 1],
                    duration: 800,
                },
                "-=400"
            );

            setIsAnimated(true);
        }

        // Simulate loading
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [isAnimated]);

    return (
        <>
            <Head title={t("Profile")}>
                <style>{`
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    .animate-shimmer { animation: shimmer 3s infinite; }

                    .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
                        background-size: 14px 14px;
                    }

                    .dark .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                    }

                    .card-shine {
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 50%;
                        height: 100%;
                        background: linear-gradient(
                            to right,
                            rgba(255, 255, 255, 0) 0%,
                            rgba(255, 255, 255, 0.3) 50%,
                            rgba(255, 255, 255, 0) 100%
                        );
                    }

                    html, body {
                        overflow-x: hidden;
                        max-width: 100%;
                    }

                    .responsive-chart-container {
                        max-width: 100%;
                        overflow-x: hidden;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden max-w-full">
                {/* Sidebar */}
                <CustomerNavbar
                    auth={auth || { user: { name: "Customer" } }}
                    currentRoute="customer.profile.show"
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden max-w-full">
                    {/* Header */}
                    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-0.5">
                                    {t("Customer Portal")}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    {t("My Profile")}
                                </h1>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-6">
                            <div className="max-w-7xl mx-auto">
                                {/* Hero Section with Gradient Background */}
                                <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-xl p-10 mb-10 overflow-hidden">
                                    <div className="absolute inset-0 bg-pattern opacity-10"></div>
                                    <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-gradient-to-br from-pink-400 to-indigo-500 opacity-20 rounded-full blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-gradient-to-tr from-indigo-400 to-purple-500 opacity-20 rounded-full blur-3xl"></div>

                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div>
                                            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
                                                {t("Profile Settings")}
                                            </h1>
                                            <p className="text-indigo-100 text-lg max-w-2xl">
                                                {t(
                                                    "Manage your account information and security settings securely in one place."
                                                )}
                                            </p>
                                        </div>
                                        <div className="hidden md:flex items-center justify-center bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl border border-white border-opacity-20 shadow-lg">
                                            <User className="h-16 w-16 text-white opacity-80" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div ref={formCardRef} className="opacity-0">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Tabs */}
                                        <div className="lg:w-1/4">
                                            <div className="rounded-lg overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
                                                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                                                    <button
                                                        onClick={() =>
                                                            setActiveTab(
                                                                "personal"
                                                            )
                                                        }
                                                        className={`w-full flex items-center p-4 transition ${
                                                            activeTab ===
                                                            "personal"
                                                                ? "bg-indigo-600 text-white"
                                                                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                                        }`}
                                                    >
                                                        <div
                                                            className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                                                activeTab ===
                                                                "personal"
                                                                    ? "bg-indigo-500/20 text-white"
                                                                    : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                                                            }`}
                                                        >
                                                            <User className="w-5 h-5" />
                                                        </div>
                                                        <div className="ml-4 flex flex-col text-left">
                                                            <span className="font-medium">
                                                                {t(
                                                                    "Personal Information"
                                                                )}
                                                            </span>
                                                            <span
                                                                className={`text-xs ${
                                                                    activeTab ===
                                                                    "personal"
                                                                        ? "text-indigo-100"
                                                                        : "text-slate-500 dark:text-slate-400"
                                                                }`}
                                                            >
                                                                {t(
                                                                    "Update your name and email"
                                                                )}
                                                            </span>
                                                        </div>
                                                        <ChevronRight
                                                            className={`ml-auto w-5 h-5 ${
                                                                activeTab ===
                                                                "personal"
                                                                    ? "text-white"
                                                                    : "text-slate-400"
                                                            }`}
                                                        />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            setActiveTab(
                                                                "security"
                                                            )
                                                        }
                                                        className={`w-full flex items-center p-4 transition ${
                                                            activeTab ===
                                                            "security"
                                                                ? "bg-indigo-600 text-white"
                                                                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                                        }`}
                                                    >
                                                        <div
                                                            className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                                                activeTab ===
                                                                "security"
                                                                    ? "bg-indigo-500/20 text-white"
                                                                    : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                                                            }`}
                                                        >
                                                            <Shield className="w-5 h-5" />
                                                        </div>
                                                        <div className="ml-4 flex flex-col text-left">
                                                            <span className="font-medium">
                                                                {t("Security")}
                                                            </span>
                                                            <span
                                                                className={`text-xs ${
                                                                    activeTab ===
                                                                    "security"
                                                                        ? "text-indigo-100"
                                                                        : "text-slate-500 dark:text-slate-400"
                                                                }`}
                                                            >
                                                                {t(
                                                                    "Update your password"
                                                                )}
                                                            </span>
                                                        </div>
                                                        <ChevronRight
                                                            className={`ml-auto w-5 h-5 ${
                                                                activeTab ===
                                                                "security"
                                                                    ? "text-white"
                                                                    : "text-slate-400"
                                                            }`}
                                                        />
                                                    </button>
                                                </div>
                                                <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                                            </div>
                                        </div>

                                        {/* Form */}
                                        <div className="lg:w-3/4">
                                            <div className="rounded-lg overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
                                                <div className="p-6 border-b border-slate-200 dark:border-slate-800 relative">
                                                    <h3 className="text-lg font-medium flex items-center text-slate-900 dark:text-white">
                                                        {activeTab ===
                                                        "personal" ? (
                                                            <User className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                                                        ) : (
                                                            <Shield className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                                                        )}
                                                        {activeTab ===
                                                        "personal"
                                                            ? t(
                                                                  "Personal Information"
                                                              )
                                                            : t(
                                                                  "Security Settings"
                                                              )}
                                                    </h3>
                                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                                                </div>
                                                <div className="p-6">
                                                    <form
                                                        onSubmit={updateProfile}
                                                        className="space-y-6"
                                                    >
                                                        {activeTab ===
                                                            "personal" && (
                                                            <>
                                                                <div>
                                                                    <InputLabel
                                                                        htmlFor="name"
                                                                        value={t(
                                                                            "Name"
                                                                        )}
                                                                        className="text-sm font-medium text-slate-700 dark:text-slate-300"
                                                                    />
                                                                    <div className="relative mt-1 rounded-md shadow-sm">
                                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                            <User className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                                                                        </div>
                                                                        <TextInput
                                                                            id="name"
                                                                            className="mt-1 block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                                                                            value={
                                                                                data.name
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setData(
                                                                                    "name",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            required
                                                                            autoComplete="name"
                                                                        />
                                                                    </div>
                                                                    <InputError
                                                                        className="mt-2"
                                                                        message={
                                                                            errors.name
                                                                        }
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <InputLabel
                                                                        htmlFor="email"
                                                                        value={t(
                                                                            "Email"
                                                                        )}
                                                                        className="text-sm font-medium text-slate-700 dark:text-slate-300"
                                                                    />
                                                                    <div className="relative mt-1 rounded-md shadow-sm">
                                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                            <Mail className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                                                                        </div>
                                                                        <TextInput
                                                                            id="email"
                                                                            type="email"
                                                                            className="mt-1 block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                                                                            value={
                                                                                data.email
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setData(
                                                                                    "email",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            required
                                                                            autoComplete="email"
                                                                        />
                                                                    </div>
                                                                    <InputError
                                                                        className="mt-2"
                                                                        message={
                                                                            errors.email
                                                                        }
                                                                    />
                                                                </div>
                                                            </>
                                                        )}

                                                        {activeTab ===
                                                            "security" && (
                                                            <>
                                                                <div>
                                                                    <InputLabel
                                                                        htmlFor="current_password"
                                                                        value={t(
                                                                            "Current Password"
                                                                        )}
                                                                        className="text-sm font-medium text-slate-700 dark:text-slate-300"
                                                                    />
                                                                    <div className="relative mt-1 rounded-md shadow-sm">
                                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                            <Key className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                                                                        </div>
                                                                        <TextInput
                                                                            id="current_password"
                                                                            type="password"
                                                                            className="mt-1 block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                                                                            value={
                                                                                data.current_password
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setData(
                                                                                    "current_password",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            autoComplete="current-password"
                                                                        />
                                                                    </div>
                                                                    <InputError
                                                                        className="mt-2"
                                                                        message={
                                                                            errors.current_password
                                                                        }
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <InputLabel
                                                                        htmlFor="password"
                                                                        value={t(
                                                                            "New Password"
                                                                        )}
                                                                        className="text-sm font-medium text-slate-700 dark:text-slate-300"
                                                                    />
                                                                    <div className="relative mt-1 rounded-md shadow-sm">
                                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                            <Key className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                                                                        </div>
                                                                        <TextInput
                                                                            id="password"
                                                                            type="password"
                                                                            className="mt-1 block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                                                                            value={
                                                                                data.password
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setData(
                                                                                    "password",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            autoComplete="new-password"
                                                                        />
                                                                    </div>
                                                                    <InputError
                                                                        className="mt-2"
                                                                        message={
                                                                            errors.password
                                                                        }
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <InputLabel
                                                                        htmlFor="password_confirmation"
                                                                        value={t(
                                                                            "Confirm Password"
                                                                        )}
                                                                        className="text-sm font-medium text-slate-700 dark:text-slate-300"
                                                                    />
                                                                    <div className="relative mt-1 rounded-md shadow-sm">
                                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                            <Key className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                                                                        </div>
                                                                        <TextInput
                                                                            id="password_confirmation"
                                                                            type="password"
                                                                            className="mt-1 block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                                                                            value={
                                                                                data.password_confirmation
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setData(
                                                                                    "password_confirmation",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            autoComplete="new-password"
                                                                        />
                                                                    </div>
                                                                    <InputError
                                                                        className="mt-2"
                                                                        message={
                                                                            errors.password_confirmation
                                                                        }
                                                                    />
                                                                </div>
                                                            </>
                                                        )}

                                                        <div className="flex items-center justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
                                                            {processing && (
                                                                <RefreshCw className="w-5 h-5 mr-2 animate-spin text-indigo-600 dark:text-indigo-400" />
                                                            )}
                                                            <PrimaryButton
                                                                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-md"
                                                                disabled={
                                                                    processing
                                                                }
                                                            >
                                                                <Save className="w-4 h-4 mr-2" />
                                                                {t("Save")}
                                                            </PrimaryButton>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
