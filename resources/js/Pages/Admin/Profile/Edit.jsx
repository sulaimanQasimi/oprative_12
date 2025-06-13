import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import {
    User,
    Mail,
    Key,
    Save,
    Trash2,
    Eye,
    EyeOff,
    ArrowLeft,
    Shield,
    Settings,
    Sparkles
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { motion } from 'framer-motion';
import Navigation from '@/Components/Admin/Navigation';
import PageLoader from '@/Components/Admin/PageLoader';

export default function Edit({ auth }) {
    const { t } = useLaravelReactI18n();
    const { user, status } = usePage().props;
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Profile form
    const { data: profileData, setData: setProfileData, patch: patchProfile, processing: profileProcessing, errors: profileErrors } = useForm({
        name: user.name || '',
        email: user.email || '',
    });

    // Password form
    const { data: passwordData, setData: setPasswordData, put: putPassword, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const updateProfile = (e) => {
        e.preventDefault();
        patchProfile(route('admin.profile.update'), {
            preserveScroll: true,
        });
    };

    const updatePassword = (e) => {
        e.preventDefault();
        putPassword(route('admin.profile.password.update'), {
            preserveScroll: true,
            onSuccess: () => resetPassword(),
        });
    };

    return (
        <>
            <Head title="Profile Settings">
                <style>{`
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
                                    linear-gradient(45deg, #3b82f6, #1d4ed8) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #3b82f6, #1d4ed8) border-box;
                    }

                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }

                    .float-animation {
                        animation: float 6s ease-in-out infinite;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={User} color="blue" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.profile.edit" />

                {/* Main Content */}
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
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-4 rounded-2xl shadow-2xl">
                                        <User className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {t("Account Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent"
                                    >
                                        {t("Profile Settings")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Settings className="w-4 h-4" />
                                        {t("Manage your account information and security")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Button 
                                    variant="outline" 
                                    onClick={() => window.history.back()}
                                    className="gap-2 hover:scale-105 transition-all duration-200"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    {t("Back")}
                                </Button>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="max-w-4xl mx-auto space-y-8"
                            >
                                {/* Status Messages */}
                                {status && (
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
                                    >
                                        <p className="text-green-800 dark:text-green-300">{status}</p>
                                    </motion.div>
                                )}

                                {/* Profile Information Card */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.9, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                        <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                    <User className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Profile Information")}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <form onSubmit={updateProfile} className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Name Field */}
                                                    <div>
                                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            {t("Name")}
                                                        </label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <User className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <Input
                                                                id="name"
                                                                type="text"
                                                                value={profileData.name}
                                                                onChange={(e) => setProfileData('name', e.target.value)}
                                                                className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                                                                required
                                                            />
                                                        </div>
                                                        {profileErrors.name && (
                                                            <p className="mt-2 text-sm text-red-600">{profileErrors.name}</p>
                                                        )}
                                                    </div>

                                                    {/* Email Field */}
                                                    <div>
                                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            {t("Email")}
                                                        </label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <Mail className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <Input
                                                                id="email"
                                                                type="email"
                                                                value={profileData.email}
                                                                onChange={(e) => setProfileData('email', e.target.value)}
                                                                className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                                                                required
                                                            />
                                                        </div>
                                                        {profileErrors.email && (
                                                            <p className="mt-2 text-sm text-red-600">{profileErrors.email}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex justify-end">
                                                    <Button
                                                        type="submit"
                                                        disabled={profileProcessing}
                                                        className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl"
                                                    >
                                                        <Save className="h-4 w-4" />
                                                        {profileProcessing ? t("Saving...") : t("Save Profile")}
                                                    </Button>
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Password Update Card */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.0, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                        <CardHeader className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                                                    <Key className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Update Password")}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <form onSubmit={updatePassword} className="space-y-6">
                                                {/* Current Password */}
                                                <div>
                                                    <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        {t("Current Password")}
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <Key className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <Input
                                                            id="current_password"
                                                            type={showCurrentPassword ? 'text' : 'password'}
                                                            value={passwordData.current_password}
                                                            onChange={(e) => setPasswordData('current_password', e.target.value)}
                                                            className="pl-10 pr-12 h-12 border-2 border-gray-200 focus:border-purple-500 rounded-xl"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                        >
                                                            {showCurrentPassword ? (
                                                                <EyeOff className="h-5 w-5 text-gray-400" />
                                                            ) : (
                                                                <Eye className="h-5 w-5 text-gray-400" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    {passwordErrors.current_password && (
                                                        <p className="mt-2 text-sm text-red-600">{passwordErrors.current_password}</p>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* New Password */}
                                                    <div>
                                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            {t("New Password")}
                                                        </label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <Shield className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <Input
                                                                id="password"
                                                                type={showNewPassword ? 'text' : 'password'}
                                                                value={passwordData.password}
                                                                onChange={(e) => setPasswordData('password', e.target.value)}
                                                                className="pl-10 pr-12 h-12 border-2 border-gray-200 focus:border-purple-500 rounded-xl"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                            >
                                                                {showNewPassword ? (
                                                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                                                ) : (
                                                                    <Eye className="h-5 w-5 text-gray-400" />
                                                                )}
                                                            </button>
                                                        </div>
                                                        {passwordErrors.password && (
                                                            <p className="mt-2 text-sm text-red-600">{passwordErrors.password}</p>
                                                        )}
                                                    </div>

                                                    {/* Confirm Password */}
                                                    <div>
                                                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            {t("Confirm Password")}
                                                        </label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <Shield className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <Input
                                                                id="password_confirmation"
                                                                type={showConfirmPassword ? 'text' : 'password'}
                                                                value={passwordData.password_confirmation}
                                                                onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                                                className="pl-10 pr-12 h-12 border-2 border-gray-200 focus:border-purple-500 rounded-xl"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                            >
                                                                {showConfirmPassword ? (
                                                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                                                ) : (
                                                                    <Eye className="h-5 w-5 text-gray-400" />
                                                                )}
                                                            </button>
                                                        </div>
                                                        {passwordErrors.password_confirmation && (
                                                            <p className="mt-2 text-sm text-red-600">{passwordErrors.password_confirmation}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex justify-end">
                                                    <Button
                                                        type="submit"
                                                        disabled={passwordProcessing}
                                                        className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl"
                                                    >
                                                        <Key className="h-4 w-4" />
                                                        {passwordProcessing ? t("Updating...") : t("Update Password")}
                                                    </Button>
                                                </div>
                                            </form>
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