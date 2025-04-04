import React, { useState, useEffect, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import Navigation from '@/Components/Warehouse/Navigation';
import { toast } from 'react-hot-toast';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { motion } from 'framer-motion';
import anime from 'animejs';
import { User, Key, Mail, Save, ChevronRight, RefreshCw, Shield, AlertCircle } from 'lucide-react';

// PageLoader component
const PageLoader = ({ isVisible }) => {
    return (
        <motion.div
            className="fixed inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 z-50 flex flex-col items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? 'all' : 'none'
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            {/* Background patterns */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>

            {/* Animated light beams */}
            <div className="absolute w-full h-full overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-gradient-to-r from-emerald-400/10 via-teal-500/10 to-transparent h-[30vh] w-[100vw]"
                        style={{
                            top: `${10 + i * 20}%`,
                            left: '-100%',
                            transformOrigin: 'left center',
                            rotate: `${-20 + i * 10}deg`,
                        }}
                        animate={{
                            left: ['100%', '-100%'],
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
                        ease: "easeInOut"
                    }}
                >
                    {/* Pulsing background circles */}
                    <motion.div
                        className="absolute w-64 h-64 rounded-full bg-emerald-600/5 filter blur-2xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute w-72 h-72 rounded-full bg-teal-500/5 filter blur-2xl transform -translate-x-4 translate-y-4"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                    />

                    {/* Animated logo/icon container */}
                    <div className="relative flex items-center justify-center h-40 w-40">
                        {/* Spinning rings */}
                        <motion.div
                            className="absolute h-full w-full rounded-full border-4 border-emerald-300/10"
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 20,
                                ease: "linear",
                                repeat: Infinity
                            }}
                        />
                        <motion.div
                            className="absolute h-[85%] w-[85%] rounded-full border-4 border-teal-400/20"
                            animate={{
                                rotate: -360,
                            }}
                            transition={{
                                duration: 15,
                                ease: "linear",
                                repeat: Infinity
                            }}
                        />
                        <motion.div
                            className="absolute h-[70%] w-[70%] rounded-full border-4 border-emerald-400/30"
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 10,
                                ease: "linear",
                                repeat: Infinity
                            }}
                        />

                        {/* Spinner arcs */}
                        <motion.div
                            className="absolute h-full w-full rounded-full border-4 border-r-emerald-400 border-t-transparent border-l-transparent border-b-transparent"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute h-full w-full rounded-full border-4 border-b-teal-400 border-t-transparent border-l-transparent border-r-transparent"
                            animate={{ rotate: -180 }}
                            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                        />

                        {/* Icon/logo in center */}
                        <motion.div
                            className="relative z-10 bg-gradient-to-br from-emerald-500 to-teal-600 h-20 w-20 rounded-2xl flex items-center justify-center shadow-xl"
                            animate={{
                                rotate: [0, 10, 0, -10, 0],
                                scale: [1, 1.1, 1, 1.1, 1]
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut"
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
    const { data, setData, patch, errors, processing } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    
    // Refs for animation targets
    const headerRef = useRef(null);
    const formCardRef = useRef(null);
    const timelineRef = useRef(null);

    const updateProfile = (e) => {
        e.preventDefault();

        patch(route('warehouse.profile.update'), {
            onSuccess: () => {
                toast.success('Profile updated successfully');
                setData('current_password', '');
                setData('password', '');
                setData('password_confirmation', '');
            },
        });
    };

    // Initialize animations
    useEffect(() => {
        if (!isAnimated) {
            // Initialize the timeline
            timelineRef.current = anime.timeline({
                easing: 'easeOutExpo',
                duration: 800
            });

            // Animate header
            timelineRef.current.add({
                targets: headerRef.current,
                opacity: [0, 1],
                translateY: [-20, 0],
                duration: 600
            });

            // Animate form card
            timelineRef.current.add({
                targets: formCardRef.current,
                opacity: [0, 1],
                translateY: [20, 0],
                scale: [0.98, 1],
                duration: 800
            }, '-=400');

            setIsAnimated(true);
        }
    }, [isAnimated]);

    // Simulate loading delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title="Profile">
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
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="warehouse.profile.edit" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header ref={headerRef} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-0.5">Account Settings</span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    Profile
                                    <Badge variant="outline" className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 rounded-full">
                                        {auth.user.name}
                                    </Badge>
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button size="sm" variant="outline" className="rounded-full border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                                <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
                                <span className="text-slate-600 dark:text-slate-400">Refresh</span>
                            </Button>
                            <Button size="sm" className="bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md rounded-full px-4">
                                <Save className="h-4 w-4 mr-1.5" />
                                <span>Save Changes</span>
                            </Button>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent py-12">
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                            <motion.div 
                                ref={formCardRef}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="relative bg-white dark:bg-slate-900 shadow-md rounded-2xl overflow-hidden"
                            >
                                {/* Background decorative elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-bl-full transform -translate-y-20 translate-x-20 z-0 opacity-70"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-50/50 dark:bg-teal-900/10 rounded-tr-full transform translate-y-20 -translate-x-20 z-0 opacity-70"></div>
                                
                                {/* Card shine effect */}
                                <div className="card-shine"></div>
                                
                                <CardHeader className="relative z-10 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 px-8 py-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                <User className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                                                Profile Information
                                            </CardTitle>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                Update your account's profile information and email address.
                                            </p>
                                        </div>
                                        <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                                            <Shield className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-8 relative z-10">
                                    <form onSubmit={updateProfile} className="space-y-7">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.4, delay: 0.1 }}
                                                className="space-y-6"
                                            >
                                                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700/50">
                                                    <h3 className="text-md font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                                        <User className="h-4.5 w-4.5 text-emerald-500 dark:text-emerald-400" />
                                                        User Information
                                                    </h3>
                                                    
                                                    <div className="space-y-5">
                                                        <div>
                                                            <InputLabel htmlFor="name" value="Name" className="text-slate-700 dark:text-slate-300" />
                                                            <div className="relative mt-1.5">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <User className="h-4 w-4 text-slate-400" />
                                                                </div>
                                                                <TextInput
                                                                    id="name"
                                                                    className="pl-10 w-full bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg"
                                                                    value={data.name}
                                                                    onChange={(e) => setData('name', e.target.value)}
                                                                    required
                                                                    autoComplete="name"
                                                                />
                                                            </div>
                                                            <InputError className="mt-2" message={errors.name} />
                                                        </div>

                                                        <div>
                                                            <InputLabel htmlFor="email" value="Email" className="text-slate-700 dark:text-slate-300" />
                                                            <div className="relative mt-1.5">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <Mail className="h-4 w-4 text-slate-400" />
                                                                </div>
                                                                <TextInput
                                                                    id="email"
                                                                    type="email"
                                                                    className="pl-10 w-full bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg"
                                                                    value={data.email}
                                                                    onChange={(e) => setData('email', e.target.value)}
                                                                    required
                                                                    autoComplete="email"
                                                                />
                                                            </div>
                                                            <InputError className="mt-2" message={errors.email} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.4, delay: 0.2 }}
                                                className="space-y-6"
                                            >
                                                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700/50">
                                                    <h3 className="text-md font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                                        <Key className="h-4.5 w-4.5 text-emerald-500 dark:text-emerald-400" />
                                                        Password Update
                                                    </h3>
                                                    
                                                    <div className="space-y-5">
                                                        <div>
                                                            <InputLabel htmlFor="current_password" value="Current Password" className="text-slate-700 dark:text-slate-300" />
                                                            <div className="relative mt-1.5">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <Key className="h-4 w-4 text-slate-400" />
                                                                </div>
                                                                <TextInput
                                                                    id="current_password"
                                                                    type="password"
                                                                    className="pl-10 w-full bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg"
                                                                    value={data.current_password}
                                                                    onChange={(e) => setData('current_password', e.target.value)}
                                                                    autoComplete="current-password"
                                                                />
                                                            </div>
                                                            <InputError className="mt-2" message={errors.current_password} />
                                                        </div>

                                                        <div>
                                                            <InputLabel htmlFor="password" value="New Password" className="text-slate-700 dark:text-slate-300" />
                                                            <div className="relative mt-1.5">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <Key className="h-4 w-4 text-slate-400" />
                                                                </div>
                                                                <TextInput
                                                                    id="password"
                                                                    type="password"
                                                                    className="pl-10 w-full bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg"
                                                                    value={data.password}
                                                                    onChange={(e) => setData('password', e.target.value)}
                                                                    autoComplete="new-password"
                                                                />
                                                            </div>
                                                            <InputError className="mt-2" message={errors.password} />
                                                        </div>

                                                        <div>
                                                            <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-slate-700 dark:text-slate-300" />
                                                            <div className="relative mt-1.5">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <Key className="h-4 w-4 text-slate-400" />
                                                                </div>
                                                                <TextInput
                                                                    id="password_confirmation"
                                                                    type="password"
                                                                    className="pl-10 w-full bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg"
                                                                    value={data.password_confirmation}
                                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                                    autoComplete="new-password"
                                                                />
                                                            </div>
                                                            <InputError className="mt-2" message={errors.password_confirmation} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>

                                        <div className="bg-slate-50/80 dark:bg-slate-800/30 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50 flex items-center gap-3 mt-6">
                                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-600 dark:text-amber-400">
                                                <AlertCircle className="h-5 w-5" />
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Ensure your account is using a long, random password to stay secure.
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-end gap-4 pt-4">
                                            <Button 
                                                type="button" 
                                                variant="outline"
                                                className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md rounded-lg px-5"
                                            >
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Changes
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
