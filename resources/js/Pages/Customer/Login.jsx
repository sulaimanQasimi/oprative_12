import React, { useEffect, useRef, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import anime from 'animejs';
import '@lottiefiles/lottie-player';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
    Lock,
    UserCircle,
    Key,
    Shield,
    ArrowRight,
    Eye,
    EyeOff,
    CheckCircle,
    ShoppingBag,
    Fingerprint,
    Loader2,
    ShieldCheck,
    CircleCheck,
    CircleAlert,
    AlertTriangle,
    Users
} from 'lucide-react';

// PageLoader component
const PageLoader = ({ isVisible }) => {
    return (
        <motion.div
            className="fixed inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-950 z-50 flex flex-col items-center justify-center overflow-hidden"
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
                        className="absolute bg-gradient-to-r from-blue-400/10 via-indigo-500/10 to-transparent h-[30vh] w-[100vw]"
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
                        className="absolute w-64 h-64 rounded-full bg-blue-600/5 filter blur-2xl"
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
                        className="absolute w-72 h-72 rounded-full bg-indigo-500/5 filter blur-2xl transform -translate-x-4 translate-y-4"
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
                            className="absolute h-full w-full rounded-full border-4 border-blue-300/10"
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
                            className="absolute h-[85%] w-[85%] rounded-full border-4 border-indigo-400/20"
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
                            className="absolute h-[70%] w-[70%] rounded-full border-4 border-blue-400/30"
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
                            className="absolute h-full w-full rounded-full border-4 border-r-blue-400 border-t-transparent border-l-transparent border-b-transparent"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute h-full w-full rounded-full border-4 border-b-indigo-400 border-t-transparent border-l-transparent border-r-transparent"
                            animate={{ rotate: -180 }}
                            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                        />

                        {/* Icon/logo in center */}
                        <motion.div
                            className="relative z-10 bg-gradient-to-br from-blue-500 to-indigo-600 h-20 w-20 rounded-2xl flex items-center justify-center shadow-xl"
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
                            <ShoppingBag className="h-10 w-10 text-white drop-shadow-lg" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default function Login() {
    const { t } = useLaravelReactI18n();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [authorized, setAuthorized] = useState(false);
    const [verificationStep, setVerificationStep] = useState(0); // 0: initial, 1: scanning, 2: verifying, 3: success/error
    const [verificationStatus, setVerificationStatus] = useState(''); // Message to display
    const formRef = useRef(null);
    const cardRef = useRef(null);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate fields before proceeding
        const hasErrors = Object.keys(errors).length > 0 || !data.email || !data.password;

        // Create authorization animation - show verification process
        setVerificationStatus(t('Scanning credentials...'));
        setVerificationStep(1);

        const verificationSteps = hasErrors
            ? [
                { step: 1, status: t('Scanning credentials...'), delay: 0 },
                { step: 2, status: t('Verifying identity...'), delay: 1200 },
                { step: 4, status: t('Access denied'), delay: 2400 } // Step 4 for error state
              ]
            : [
                { step: 1, status: t('Scanning credentials...'), delay: 0 },
                { step: 2, status: t('Verifying identity...'), delay: 1200 },
                { step: 3, status: t('Access granted'), delay: 2400 }
              ];

        // Animate through verification steps
        verificationSteps.forEach(item => {
            setTimeout(() => {
                setVerificationStep(item.step);
                setVerificationStatus(item.status);

                // Only set authorized if access is granted
                if (item.step === 3) {
                    setAuthorized(true);

                    // Animate the button
                    anime({
                        targets: '.auth-button',
                        backgroundColor: '#3b82f6',
                        scale: [1, 1.05, 1],
                        duration: 600
                    });
                }
            }, item.delay);
        });

        // Add slight delay before actual submission - only submit if no errors
        if (!hasErrors) {
            setTimeout(() => {
                post(route('customer.login'), {
                    onError: (errors) => {
                        // Reset verification state
                        setVerificationStep(0);
                        setAuthorized(false);

                        // Show error toast message
                        toast.error(errors.email || errors.password || t('Login failed. Please check your credentials.'), {
                            duration: 5000,
                            style: {
                                background: '#FEE2E2',
                                color: '#B91C1C',
                                fontWeight: 'bold',
                                padding: '16px',
                                borderRadius: '10px',
                            },
                            icon: '⚠️',
                        });

                        // Shake the form to indicate error
                        anime({
                            targets: formRef.current,
                            translateX: [0, -10, 10, -10, 10, 0],
                            duration: 400,
                            easing: 'easeInOutQuad'
                        });
                    }
                });
            }, 3000);
        } else {
            // Shake the form to indicate error
            setTimeout(() => {
                anime({
                    targets: formRef.current,
                    translateX: [0, -10, 10, -10, 10, 0],
                    duration: 400,
                    easing: 'easeInOutQuad'
                });
            }, 2600);
        }
    };

    // Simulate loading state
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    // Card animation effects
    useEffect(() => {
        if (!loading && cardRef.current) {
            anime({
                targets: cardRef.current,
                opacity: [0, 1],
                translateY: [30, 0],
                scale: [0.95, 1],
                easing: 'easeOutExpo',
                duration: 1000
            });
        }
    }, [loading]);

    // Input field animations
    useEffect(() => {
        if (!loading && formRef.current) {
            anime({
                targets: '.animate-input',
                opacity: [0, 1],
                translateY: [20, 0],
                delay: anime.stagger(150, {start: 300}),
                easing: 'easeOutExpo',
                duration: 800
            });
        }
    }, [loading]);

    return (
        <div className="flex min-h-screen overflow-hidden">
            <PageLoader isVisible={loading} />
            <Toaster position="top-center" reverseOrder={false} />
            <div className="flex flex-col justify-center flex-1 w-full px-6 py-12 mx-auto lg:px-8" dir="rtl">
                <Head title={t("Customer Login")} />
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm md:max-w-md lg:max-w-lg flex flex-col items-center">
                    {/* Logo and title */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="mb-5 p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20">
                            <Users className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-center text-gray-900">
                            {t("Welcome to Customer Portal")}
                        </h2>
                        <p className="mt-2 text-center text-gray-600">
                            {t("Login to access your account")}
                        </p>
                    </div>

                    {/* Form Card */}
                    <div
                        ref={cardRef}
                        className="w-full p-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                        {/* Show authentication steps if actively verifying */}
                        {verificationStep > 0 ? (
                            <div className="py-10">
                                <div className="flex flex-col items-center justify-center space-y-8">
                                    <div className="relative w-32 h-32">
                                        {verificationStep === 1 && (
                                            <motion.div
                                                className="absolute inset-0 flex items-center justify-center"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                            >
                                                <div className="p-3 bg-blue-100 rounded-full">
                                                    <Fingerprint className="w-24 h-24 text-blue-500" />
                                                </div>
                                                <motion.div
                                                    className="absolute top-0 left-0 w-full h-full border-4 border-blue-400 rounded-full"
                                                    animate={{
                                                        opacity: [0.1, 0.5, 0.1],
                                                        scale: [1, 1.2, 1],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                />
                                            </motion.div>
                                        )}

                                        {verificationStep === 2 && (
                                            <motion.div
                                                className="absolute inset-0 flex items-center justify-center"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                            >
                                                <div className="p-3 bg-yellow-100 rounded-full">
                                                    <ShieldCheck className="w-24 h-24 text-yellow-500" />
                                                </div>
                                                <motion.div
                                                    className="absolute inset-0 border-4 border-yellow-400 rounded-full border-t-transparent"
                                                    animate={{
                                                        rotate: 360
                                                    }}
                                                    transition={{
                                                        duration: 1.5,
                                                        repeat: Infinity,
                                                        ease: "linear"
                                                    }}
                                                />
                                            </motion.div>
                                        )}

                                        {verificationStep === 3 && (
                                            <motion.div
                                                className="absolute inset-0 flex items-center justify-center"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                            >
                                                <div className="p-3 bg-green-100 rounded-full">
                                                    <CircleCheck className="w-24 h-24 text-green-500" />
                                                </div>
                                                <motion.div
                                                    className="absolute inset-0 border-4 border-green-400 rounded-full"
                                                    animate={{
                                                        scale: [1, 1.1, 1],
                                                        opacity: [1, 0.8, 1],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                />
                                            </motion.div>
                                        )}

                                        {verificationStep === 4 && (
                                            <motion.div
                                                className="absolute inset-0 flex items-center justify-center"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                            >
                                                <div className="p-3 bg-red-100 rounded-full">
                                                    <AlertTriangle className="w-24 h-24 text-red-500" />
                                                </div>
                                                <motion.div
                                                    className="absolute inset-0 border-4 border-red-400 rounded-full"
                                                    animate={{
                                                        scale: [1, 1.1, 1],
                                                        opacity: [1, 0.6, 1],
                                                    }}
                                                    transition={{
                                                        duration: 0.5,
                                                        repeat: Infinity,
                                                        repeatType: "reverse",
                                                        ease: "easeInOut"
                                                    }}
                                                />
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="text-center">
                                        <h3 className="text-xl font-semibold mb-2">
                                            {verificationStatus}
                                        </h3>
                                        <p className="text-gray-600">
                                            {verificationStep === 1 && t("Please wait while we scan your credentials")}
                                            {verificationStep === 2 && t("Verifying your identity and permissions")}
                                            {verificationStep === 3 && t("Logged in successfully! Redirecting...")}
                                            {verificationStep === 4 && t("Incorrect email or password. Please try again.")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                        {t("Email address")}
                                    </label>
                                    <div className="relative mt-2">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                            <UserCircle className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            required
                                            className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                            placeholder={t("Enter your email")}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                            {t("Password")}
                                        </label>
                                        <div className="text-sm">
                                            <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">
                                                {t("Forgot password?")}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="relative mt-2">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                            <Key className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            required
                                            className="block w-full rounded-md border-0 py-3 pl-10 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                            placeholder={t("Enter your password")}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                            >
                                                {showPassword ?
                                                    <EyeOff className="h-5 w-5" /> :
                                                    <Eye className="h-5 w-5" />
                                                }
                                            </button>
                                        </div>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="remember"
                                        name="remember"
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={e => setData('remember', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                                    />
                                    <label htmlFor="remember" className="ml-3 block text-sm leading-6 text-gray-700">
                                        {t("Remember me")}
                                    </label>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className={`flex w-full justify-center items-center gap-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:from-blue-600 hover:to-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-300 ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                <span>{t("Signing in...")}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="h-5 w-5" />
                                                <span>{t("Sign in")}</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="mt-4 text-center">
                                    <p className="text-sm text-gray-600">
                                        {t("Don't have an account?")} {' '}
                                        <a href={route('customer.register')} className="font-semibold text-blue-600 hover:text-blue-500">
                                            {t("Register now")}
                                        </a>
                                    </p>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center text-gray-500 text-sm">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Shield className="h-4 w-4" />
                            <span>{t("Secure login")}</span>
                        </div>
                        <p>
                            {t("© 2023 Customer Portal. All rights reserved.")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
