import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import CustomerNavbar from '@/Components/CustomerNavbar';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import {
    CreditCard,
    Save,
    ArrowLeft,
    User,
    ClipboardCheck,
    Home,
    Check,
    AlertCircle,
    FileText,
    Info
} from 'lucide-react';

// Import the lottie player package if not already loaded
import '@lottiefiles/lottie-player';

// Create a React wrapper component for the lottie-player
const LottiePlayer = ({ src, background = "transparent", speed = "1", style, loop = true, autoplay = true, hover = false }) => {
    useEffect(() => {
        // Ensure the web component is properly defined
        if (typeof document !== 'undefined') {
            import('@lottiefiles/lottie-player');
        }
    }, []);

    return React.createElement('lottie-player', {
        src,
        background,
        speed,
        style,
        loop: loop ? '' : null,
        autoplay: autoplay ? '' : null,
        hover: hover ? '' : null
    });
};

export default function CreateAccount({ auth }) {
    const { t } = useLaravelReactI18n();
    const [formErrors, setFormErrors] = useState({});
    const [animeLoaded, setAnimeLoaded] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        id_number: '',
        address: '',
    });

    useEffect(() => {
        // Load and initialize anime.js when the component mounts
        const loadAnime = async () => {
            try {
                const animeModule = await import('animejs');
                const anime = animeModule.default;
                setAnimeLoaded(true);

                // Initialize animations for the account form
                anime({
                    targets: '.account-form',
                    opacity: [0, 1],
                    translateY: [20, 0],
                    easing: 'easeOutExpo',
                    duration: 800
                });

                // Initialize animations for the info card
                anime({
                    targets: '.info-card',
                    opacity: [0, 1],
                    translateX: [20, 0],
                    easing: 'easeOutExpo',
                    delay: 300,
                    duration: 800
                });

                // Enhanced info item animations with staggered reveal
                anime({
                    targets: '.info-item',
                    opacity: [0, 1],
                    translateY: [20, 0],
                    delay: anime.stagger(150, { start: 500 }),
                    easing: 'easeOutCubic',
                    duration: 800,
                    complete: function () {
                        // Add pulse animation to Lottie containers after they appear
                        anime({
                            targets: '.info-item .flex-shrink-0',
                            scale: [0.95, 1],
                            opacity: [0.8, 1],
                            duration: 1200,
                            easing: 'easeOutElastic(1, .6)'
                        });
                    }
                });

                // Enhanced icon presence on page load with a subtle animation
                anime({
                    targets: '.icon-wrapper',
                    scale: [0.9, 1],
                    opacity: [0.5, 1],
                    rotate: ['-5deg', '0deg'],
                    duration: 600,
                    delay: anime.stagger(100, { start: 300 }),
                    easing: 'spring(1, 80, 10, 0)'
                });
            } catch (error) {
                console.error('Failed to load anime.js:', error);
            }
        };

        loadAnime();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('customer.accounts.store'), {
            onSuccess: () => {
                reset('name', 'id_number', 'address');
            },
        });
    };

    const handleFieldFocus = (e) => {
        if (!animeLoaded) return;

        const target = e.target;
        const formGroup = target.closest('.form-group');

        if (formGroup) {
            const iconWrapper = formGroup.querySelector('.icon-wrapper');
            const label = formGroup.querySelector('label');

            // Apply focus animations
            if (window.anime) {
                if (iconWrapper) {
                    window.anime({
                        targets: iconWrapper,
                        scale: [1, 1.2],
                        rotate: ['0deg', '8deg', '0deg'],
                        duration: 600,
                        easing: 'spring(1, 80, 10, 0)'
                    });
                }

                if (label) {
                    window.anime({
                        targets: label,
                        translateY: [0, -2],
                        color: ['#374151', '#4f46e5'],
                        fontWeight: [400, 500],
                        duration: 300,
                        easing: 'easeOutCubic'
                    });
                }
            }
        }
    };

    const handleFieldBlur = (e) => {
        if (!animeLoaded) return;

        const target = e.target;
        const formGroup = target.closest('.form-group');

        if (formGroup) {
            const iconWrapper = formGroup.querySelector('.icon-wrapper');
            const label = formGroup.querySelector('label');

            // Reset animations
            if (window.anime) {
                if (iconWrapper) {
                    window.anime({
                        targets: iconWrapper,
                        scale: 1,
                        rotate: '0deg',
                        duration: 500,
                        easing: 'easeOutCubic'
                    });
                }

                if (label && target.value === '') {
                    window.anime({
                        targets: label,
                        translateY: [-2, 0],
                        color: '#374151',
                        fontWeight: 400,
                        duration: 300,
                        easing: 'easeOutCubic'
                    });
                }
            }
        }
    };

    return (
        <>
            <Head title={t('Create Account')} />

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden max-w-full">
                {/* Sidebar */}
                <CustomerNavbar
                    auth={auth || {user: {name: 'Customer'}}}
                    currentRoute="customer.accounts.create"
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden max-w-full">
                    {/* Header */}
                    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center space-x-4">
                            <Link
                                href={route('customer.accounts.index')}
                                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
                            >
                                <ArrowLeft className="h-6 w-6" />
                            </Link>
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-0.5">
                                    {t("Customer Portal")}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    {t("Create New Account")}
                                </h1>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-6">
                            <div className="max-w-7xl mx-auto">
                                {/* Hero Section with Gradient Background */}
                                <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-xl p-8 mb-8 overflow-hidden">
                                    <div className="absolute inset-0 bg-pattern opacity-10"></div>
                                    <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-gradient-to-br from-pink-400 to-indigo-500 opacity-20 rounded-full blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-gradient-to-tr from-indigo-400 to-purple-500 opacity-20 rounded-full blur-3xl"></div>

                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div>
                                            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
                                                {t('Create New Bank Account')}
                                            </h1>
                                            <p className="text-indigo-100 text-lg max-w-2xl">
                                                {t('Enter all required information to set up your new bank account.')}
                                            </p>
                                        </div>
                                        <div className="hidden md:flex items-center justify-center bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl border border-white border-opacity-20 shadow-lg">
                                            <CreditCard className="h-16 w-16 text-white opacity-80" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                    <div className="md:col-span-2">
                                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden account-form">
                                            <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-r from-gray-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                                                    <FileText className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                                                    {t('Account Information')}
                                                </h3>
                                            </div>
                                            <div className="p-8">
                                                <form onSubmit={handleSubmit} className="space-y-6">
                                                    {/* Account Name Field */}
                                                    <div className="form-group">
                                                        <div className="flex items-center mb-1">
                                                            <div className="icon-wrapper flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 mr-2">
                                                                <CreditCard className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                            </div>
                                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200">
                                                                {t('Account Name')} <span className="text-red-500">*</span>
                                                            </label>
                                                        </div>
                                                        <div className="mt-1 form-field-wrapper">
                                                            <div className="relative rounded-md shadow-sm">
                                                                <input
                                                                    type="text"
                                                                    id="name"
                                                                    name="name"
                                                                    value={data.name}
                                                                    onChange={e => setData('name', e.target.value)}
                                                                    onFocus={handleFieldFocus}
                                                                    onBlur={handleFieldBlur}
                                                                    className="block w-full px-4 py-3 border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base transition-all duration-200 form-input"
                                                                    placeholder={t('Enter your account name')}
                                                                    required
                                                                />
                                                            </div>
                                                            {errors.name && (
                                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* ID Number Field */}
                                                    <div className="form-group">
                                                        <div className="flex items-center mb-1">
                                                            <div className="icon-wrapper flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-900/50 mr-2">
                                                                <User className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                                            </div>
                                                            <label htmlFor="id_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200">
                                                                {t('ID Number')} <span className="text-red-500">*</span>
                                                            </label>
                                                        </div>
                                                        <div className="mt-1 form-field-wrapper">
                                                            <div className="relative rounded-md shadow-sm">
                                                                <input
                                                                    type="text"
                                                                    id="id_number"
                                                                    name="id_number"
                                                                    value={data.id_number}
                                                                    onChange={e => setData('id_number', e.target.value)}
                                                                    onFocus={handleFieldFocus}
                                                                    onBlur={handleFieldBlur}
                                                                    className="block w-full px-4 py-3 border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base transition-all duration-200 form-input"
                                                                    placeholder={t('Enter your ID number')}
                                                                    required
                                                                />
                                                            </div>
                                                            {errors.id_number && (
                                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.id_number}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Address Field */}
                                                    <div className="form-group">
                                                        <div className="flex items-center mb-1">
                                                            <div className="icon-wrapper flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-pink-100 dark:bg-pink-900/50 mr-2">
                                                                <Home className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                                                            </div>
                                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200">
                                                                {t('Address')} <span className="text-red-500">*</span>
                                                            </label>
                                                        </div>
                                                        <div className="mt-1 form-field-wrapper">
                                                            <div className="relative rounded-md shadow-sm">
                                                                <textarea
                                                                    id="address"
                                                                    name="address"
                                                                    rows="3"
                                                                    value={data.address}
                                                                    onChange={e => setData('address', e.target.value)}
                                                                    onFocus={handleFieldFocus}
                                                                    onBlur={handleFieldBlur}
                                                                    className="block w-full px-4 py-3 border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base transition-all duration-200 form-textarea"
                                                                    placeholder={t('Enter your address')}
                                                                    required
                                                                />
                                                            </div>
                                                            {errors.address && (
                                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.address}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex items-center justify-end pt-4 space-x-4">
                                                        <Link
                                                            href={route('customer.accounts.index')}
                                                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                                                        >
                                                            {t('Cancel')}
                                                        </Link>

                                                        <button
                                                            type="submit"
                                                            disabled={processing}
                                                            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md shadow-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center space-x-2"
                                                        >
                                                            <Save className="h-5 w-5" />
                                                            <span>{processing ? t('Submitting...') : t('Create Account')}</span>
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-1">
                                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden sticky top-6 info-card">
                                            <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-r from-gray-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
                                                <h3 className="text-lg font-medium text-gray-800 dark:text-white flex items-center">
                                                    <Info className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                                                    {t('Information')}
                                                </h3>
                                            </div>
                                            <div className="p-6 bg-gradient-to-br from-white to-indigo-50/30 dark:from-slate-900 dark:to-indigo-950/30">
                                                <div className="space-y-6">
                                                    <div className="flex items-start info-item">
                                                        <div className="flex-shrink-0 w-16 h-16 mr-2">
                                                            <LottiePlayer
                                                                src="/js/lottie/approval-animation.json"
                                                                background="transparent"
                                                                speed="1"
                                                                style={{ width: '4rem', height: '4rem' }}
                                                                hover
                                                                loop
                                                            />
                                                        </div>
                                                        <div className="ml-2">
                                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{t('Approval Required')}</h4>
                                                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t('All new accounts require approval by an administrator before they become active.')}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start info-item">
                                                        <div className="flex-shrink-0 w-16 h-16 mr-2">
                                                            <LottiePlayer
                                                                src="/js/lottie/account-number-animation.json"
                                                                background="transparent"
                                                                speed="1"
                                                                style={{ width: '4rem', height: '4rem' }}
                                                                hover
                                                                loop
                                                            />
                                                        </div>
                                                        <div className="ml-2">
                                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{t('Account Number')}</h4>
                                                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t('A unique account number will be automatically generated for your account.')}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start info-item">
                                                        <div className="flex-shrink-0 w-16 h-16 mr-2">
                                                            <LottiePlayer
                                                                src="/js/lottie/privacy-animation.json"
                                                                background="transparent"
                                                                speed="1"
                                                                style={{ width: '4rem', height: '4rem' }}
                                                                hover
                                                                loop
                                                            />
                                                        </div>
                                                        <div className="ml-2">
                                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{t('Privacy')}</h4>
                                                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t('Your account information is securely stored and only accessible by authorized personnel.')}</p>
                                                        </div>
                                                    </div>
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

            <style jsx="true">{`
                /* Enhanced animations */
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }

                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }

                .form-input:focus, .form-textarea:focus {
                    transition: all 0.3s ease;
                    transform: scale(1.01);
                }

                .form-button-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
                }

                .form-button-secondary:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }

                /* Improved background patterns */
                .bg-pattern {
                    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E");
                }

                /* Field wrapper and focus effects */
                .form-field-wrapper {
                    position: relative;
                    transition: all 0.3s ease;
                }

                .form-field-wrapper:focus-within {
                    transform: translateY(-1px);
                }

                .form-group {
                    position: relative;
                }

                /* Enhanced icon styling */
                .icon-wrapper {
                    position: relative;
                    z-index: 10;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
                    width: 2rem;
                    height: 2rem;
                    border: 2px solid white;
                    box-shadow: 0 0 10px rgba(99, 102, 241, 0.2);
                }

                /* Animate the icon and label together */
                .form-group:focus-within .flex.items-center.mb-1 {
                    transform: translateY(-2px);
                }

                .form-group:focus-within .icon-wrapper {
                    transform: scale(1.1);
                    box-shadow: 0 3px 10px rgba(99, 102, 241, 0.15);
                }

                /* Improved icon emphasis */
                .icon-wrapper svg {
                    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
                    transition: all 0.3s ease;
                }

                .form-group:hover .icon-wrapper svg {
                    filter: drop-shadow(0 2px 4px rgba(99, 102, 241, 0.3));
                }

                /* Icon animations */
                .form-group:focus-within .icon-wrapper svg {
                    transform: scale(1.1);
                }

                /* Label animations */
                .form-group:focus-within label {
                    color: #4f46e5;
                    transform: translateY(-1px);
                    font-weight: 500;
                }

                /* Input animations */
                .form-input:focus, .form-textarea:focus {
                    border-color: #a5b4fc;
                    box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.08);
                }

                /* Floating labels effect */
                .form-input::placeholder, .form-textarea::placeholder {
                    transition: opacity 0.3s ease;
                }

                .form-input:focus::placeholder, .form-textarea:focus::placeholder {
                    opacity: 0.5;
                }

                /* Add pulse animation to icons for better visibility */
                @keyframes iconPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.2); }
                    50% { box-shadow: 0 0 0 8px rgba(99, 102, 241, 0); }
                }

                .form-group:focus-within .icon-wrapper {
                    animation: iconPulse 2s infinite;
                }

                /* Connected label and icon effect */
                .flex.items-center.mb-1:after {
                    content: '';
                    position: absolute;
                    top: 1.75rem;
                    left: 1rem;
                    height: 0;
                    width: 1px;
                    background: linear-gradient(180deg, rgba(99, 102, 241, 0.3), transparent);
                    transition: all 0.3s ease;
                    opacity: 0;
                }

                .form-group:hover .flex.items-center.mb-1:after {
                    height: 12px;
                    opacity: 1;
                }

                /* Info card animations and styling */
                .info-item {
                    transition: all 0.3s ease;
                    border-radius: 0.75rem;
                    padding: 0.75rem;
                    margin-bottom: 0.5rem;
                    border: 1px solid transparent;
                }

                .info-item:hover {
                    background-color: rgba(249, 250, 251, 0.7);
                    border-color: rgba(99, 102, 241, 0.1);
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }

                .info-item .ml-2 {
                    transition: all 0.3s ease;
                }

                .info-item:hover .ml-2 {
                    transform: translateX(5px);
                }

                .info-item h4 {
                    transition: all 0.3s ease;
                }

                .info-item:hover h4 {
                    color: #4338ca;
                }

                .info-item lottie-player {
                    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
                    transition: all 0.3s ease;
                }

                /* Ensures the Lottie players don't overflow on mobile */
                @media (max-width: 640px) {
                    .info-item {
                        align-items: center;
                    }

                    .info-item .flex-shrink-0 {
                        width: 3rem;
                        height: 3rem;
                    }

                    .info-item lottie-player {
                        width: 3rem !important;
                        height: 3rem !important;
                    }
                }
            `}</style>
        </>
    );
}
