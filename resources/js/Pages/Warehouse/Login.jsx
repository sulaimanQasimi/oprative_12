import React, { useEffect, useRef, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import anime from 'animejs';
import '@lottiefiles/lottie-player';
import { motion } from 'framer-motion';
import { 
    Lock, 
    UserCircle, 
    Key, 
    Shield, 
    ArrowRight, 
    Eye, 
    EyeOff,
    CheckCircle,
    BarChart3,
    Fingerprint,
    Loader2,
    ShieldCheck,
    CircleCheck,
    CircleAlert,
    AlertTriangle
} from 'lucide-react';

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
                            <BarChart3 className="h-10 w-10 text-white drop-shadow-lg" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
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
        setVerificationStatus('Scanning credentials...');
        setVerificationStep(1);
        
        const verificationSteps = hasErrors
            ? [
                { step: 1, status: 'Scanning credentials...', delay: 0 },
                { step: 2, status: 'Verifying identity...', delay: 1200 },
                { step: 4, status: 'Access denied', delay: 2400 } // Step 4 for error state
              ]
            : [
                { step: 1, status: 'Scanning credentials...', delay: 0 },
                { step: 2, status: 'Verifying identity...', delay: 1200 },
                { step: 3, status: 'Access granted', delay: 2400 }
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
                        backgroundColor: '#10b981',
                        scale: [1, 1.05, 1],
                        duration: 600
                    });
                }
            }, item.delay);
        });

        // Add slight delay before actual submission - only submit if no errors
        if (!hasErrors) {
            setTimeout(() => {
                post(route('warehouse.login'));
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
        <>
            <Head title="Warehouse Login">
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
                        background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                        background-size: 14px 14px;
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
                    
                    .card-shine-slow {
                        animation: shimmer 8s infinite;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
                {/* Background elements */}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] z-0"></div>
                
                {/* Animated background elements */}
                <div className="absolute -left-40 -top-40 w-96 h-96 bg-emerald-900/10 rounded-full filter blur-3xl animate-pulse"></div>
                <div className="absolute right-20 top-10 w-72 h-72 bg-teal-900/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '15s' }}></div>
                <div className="absolute -right-40 -bottom-40 w-80 h-80 bg-green-900/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '20s', animationDelay: '2s' }}></div>
                <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-lime-900/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '18s', animationDelay: '1s' }}></div>

                {/* Login Card */}
                <motion.div 
                    ref={cardRef}
                    className="relative w-full max-w-lg mx-6 z-10 opacity-0"
                    style={{ perspective: '1000px' }}
                >
                    <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/90 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80 relative">
                        <div className="card-shine card-shine-slow"></div>
                        
                        {/* Card Header */}
                        <div className="p-6 border-b border-slate-800/50 flex flex-col items-start relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500"></div>
                            
                            <div className="flex items-center mb-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 p-0.5 mr-4 relative">
                                    <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-pulse"></div>
                                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                                        <Fingerprint className="h-6 w-6 text-emerald-400" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-white">Warehouse Management</h1>
                                    <p className="text-slate-400 text-sm">Secure Access Terminal</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Card Content */}
                        <div className="p-6 pt-8">
                            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                                {/* Email field */}
                                <div className="animate-input">
                                    <div className="mb-2 flex items-center">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mr-3 border border-emerald-500/20">
                                            <UserCircle className="h-4 w-4 text-emerald-400" />
                                        </div>
                                        <label className="block text-sm font-medium text-slate-200">
                                            Username
                                        </label>
                                    </div>
                                    <div className="relative group mt-2" dir='ltr'>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full bg-slate-900/80 border border-slate-700 focus:border-emerald-500 text-slate-200 rounded-lg px-4 py-3 
                                            placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none transition-all duration-200"
                                            placeholder="Enter your username"
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 opacity-0 group-focus-within:opacity-100 transition-all duration-300"></div>
                                        </div>
                                    </div>
                                    {errors.email && (
                                        <p className="text-rose-500 text-xs mt-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password field */}
                                <div className="animate-input">
                                    <div className="mb-2 flex items-center">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mr-3 border border-emerald-500/20">
                                            <Key className="h-4 w-4 text-emerald-400" />
                                        </div>
                                        <label className="block text-sm font-medium text-slate-200">
                                            Password
                                        </label>
                                    </div>
                                    <div className="relative group mt-2" dir='ltr'>
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full bg-slate-900/80 border border-slate-700 focus:border-emerald-500 text-slate-200 rounded-lg px-4 py-3 
                                            placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none transition-all duration-200"
                                            placeholder="••••••••••••••"
                                            required
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-emerald-400 transition-colors duration-200"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-rose-500 text-xs mt-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Remember me toggle */}
                                <div className="flex items-center justify-between animate-input">
                                    <label className="flex items-center cursor-pointer group">
                                        <div className="relative flex items-center justify-center mr-3 w-5 h-5 border border-slate-600 rounded-md group-hover:border-emerald-400 transition-colors duration-200">
                                            {data.remember && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-emerald-500 rounded-md">
                                                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                        />
                                        <span className="text-slate-300 text-sm">Remember me</span>
                                    </label>
                                </div>

                                {/* Verification status */}
                                <div className="animate-input mt-2">
                                    <div className={`h-12 flex items-center ${verificationStep > 0 ? 'justify-center' : 'justify-start'} p-2 rounded-lg border ${verificationStep === 0 ? 'border-transparent' : 'border-slate-700/50 bg-slate-800/30'} transition-all duration-300`}>
                                        {verificationStep === 0 && (
                                            <span className="text-sm font-medium text-slate-500">Ready to authenticate</span>
                                        )}
                                        
                                        {verificationStep === 1 && (
                                            <div className="flex items-center space-x-3">
                                                <div className="relative flex items-center justify-center w-6 h-6">
                                                    <Loader2 className="h-6 w-6 text-emerald-500 animate-spin" />
                                                </div>
                                                <span className="text-sm font-medium text-emerald-400">{verificationStatus}</span>
                                            </div>
                                        )}
                                        
                                        {verificationStep === 2 && (
                                            <div className="flex items-center space-x-3">
                                                <div className="relative flex items-center justify-center w-6 h-6">
                                                    <div className="h-6 w-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                                                    <ShieldCheck className="h-3 w-3 text-emerald-400 absolute" />
                                                </div>
                                                <span className="text-sm font-medium text-emerald-400">{verificationStatus}</span>
                                            </div>
                                        )}
                                        
                                        {verificationStep === 3 && (
                                            <div className="flex items-center space-x-3">
                                                <div className="relative flex items-center justify-center w-6 h-6">
                                                    <CircleCheck className="h-6 w-6 text-emerald-500" />
                                                </div>
                                                <span className="text-sm font-medium text-emerald-400">{verificationStatus}</span>
                                            </div>
                                        )}
                                        
                                        {verificationStep === 4 && (
                                            <div className="flex items-center space-x-3">
                                                <div className="relative flex items-center justify-center w-6 h-6">
                                                    <CircleAlert className="h-6 w-6 text-rose-500" />
                                                </div>
                                                <span className="text-sm font-medium text-rose-500">{verificationStatus}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Submit button */}
                                <div className="animate-input pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing || authorized}
                                        className="auth-button w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 
                                        text-white font-medium rounded-lg py-3 px-4 transition-all duration-300 shadow-lg shadow-emerald-500/20
                                        flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 w-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Authorizing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Shield className="h-5 w-5" />
                                                <span>Sign In</span>
                                                <ArrowRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                        {/* Card Footer */}
                        <div className="py-4 px-6 border-t border-slate-800/50 bg-slate-900/50">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-slate-500 flex items-center">
                                    <Lock className="h-3 w-3 mr-1.5 text-emerald-500" />
                                    Secure Connection
                                </p>
                                <div className="flex items-center">
                                    <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></div>
                                    <span className="text-xs text-emerald-400">System Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* System Status */}
                    <div className="mt-4 text-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2, duration: 1 }}
                            className="inline-flex items-center px-3 py-1.5 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full"
                        >
                            <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                            <span className="text-xs text-slate-400">Warehouse Management System • v1.0</span>
                        </motion.div>
                    </div>
                </motion.div>
                
                {/* Add light effect to bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-emerald-900/10 to-transparent"></div>
            </div>
        </>
    );
}
