import React, { useEffect, useState, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import anime from 'animejs';

const ButtonAnimation = ({ children, color }) => {
    const buttonRef = useRef(null);

    const handleMouseEnter = () => {
        anime({
            targets: buttonRef.current,
            scale: 1.05,
            duration: 200,
            easing: 'easeOutElastic(1, .8)'
        });

        anime({
            targets: buttonRef.current.querySelector('.button-overlay'),
            opacity: 1,
            scale: [0.8, 1],
            duration: 400,
            easing: 'easeOutExpo'
        });

        anime({
            targets: buttonRef.current.querySelector('svg'),
            translateX: [-2, 0],
            rotate: [-5, 0],
            duration: 300,
            easing: 'easeOutCubic'
        });
    };

    const handleMouseLeave = () => {
        anime({
            targets: buttonRef.current,
            scale: 1,
            duration: 200,
            easing: 'easeOutCubic'
        });

        anime({
            targets: buttonRef.current.querySelector('.button-overlay'),
            opacity: 0,
            scale: 1.2,
            duration: 300,
            easing: 'easeOutExpo'
        });

        anime({
            targets: buttonRef.current.querySelector('svg'),
            translateX: 0,
            rotate: 0,
            duration: 200,
            easing: 'easeOutCubic'
        });
    };

    const handleClick = () => {
        anime({
            targets: buttonRef.current,
            scale: [1.05, 1],
            duration: 300,
            easing: 'easeOutElastic(1, .8)'
        });

        anime({
            targets: buttonRef.current.querySelector('.ripple'),
            scale: [0, 3],
            opacity: [1, 0],
            duration: 600,
            easing: 'easeOutExpo'
        });
    };

    return (
        <div
            ref={buttonRef}
            className={`relative overflow-hidden ${children.props.className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            <div className={`button-overlay absolute inset-0 rounded-md bg-black/10 opacity-0`}></div>
            <div className="ripple absolute inset-0 bg-white/20 rounded-full scale-0 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"></div>
            {children}
        </div>
    );
};

export default function HomePage({ auth }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const heroRef = useRef(null);
    const statsRef = useRef(null);
    const featuresRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);

        const fadeInElements = document.querySelectorAll('.fade-in');
        fadeInElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('opacity-100');
                element.classList.add('translate-y-0');
            }, 200 * index);
        });

        // Hero section animation
        anime({
            targets: '.hero-icon',
            scale: [0, 1],
            rotate: [-20, 0],
            opacity: [0, 1],
            duration: 1200,
            delay: 300,
            easing: 'easeOutElastic(1, .8)'
        });

        // Stats counter animation
        anime({
            targets: '.stat-number',
            innerHTML: [0, el => el.getAttribute('data-value')],
            duration: 2000,
            round: 1,
            easing: 'easeInOutExpo',
            delay: anime.stagger(200)
        });

        // Features animation
        anime({
            targets: '.feature-card',
            translateY: [50, 0],
            opacity: [0, 1],
            duration: 800,
            delay: anime.stagger(100),
            easing: 'easeOutCubic'
        });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <ParallaxProvider>
            <div className="min-h-screen bg-[#0A0F1C]">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute w-full h-full bg-[url('/images/grid.svg')] opacity-10" />
                <Parallax speed={-10}>
                    <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-float"></div>
                </Parallax>
                <Parallax speed={-5}>
                    <div className="absolute top-1/2 right-0 w-[40rem] h-[40rem] bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float-delayed"></div>
                </Parallax>
                <Parallax speed={-15}>
                    <div className="absolute bottom-0 left-1/4 w-[35rem] h-[35rem] bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                </Parallax>
            </div>

            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0A0F1C]/80 backdrop-blur-xl shadow-lg' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 hover:shadow-blue-500/25">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">سیستم مدیریت کوپراتیف</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex items-center"
                        >
                            <div className="flex items-center gap-3 pr-2">
                                {auth?.web ? (
                                    <ButtonAnimation>
                                        <Link href="/adminpanel/" className="group relative inline-flex items-center px-4 py-2.5 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white text-sm font-medium rounded-md shadow-md shadow-emerald-600/10">
                                            <svg className="w-[18px] h-[18px] mr-2 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            <span>پنل مدیریت</span>
                                        </Link>
                                    </ButtonAnimation>
                                ) : (
                                    <ButtonAnimation>
                                        <Link href="/adminpanel/login" className="group relative inline-flex items-center px-4 py-2.5 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white text-sm font-medium rounded-md shadow-md shadow-emerald-600/10">
                                            <svg className="w-[18px] h-[18px] mr-2 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            <span>ورود مدیر</span>
                                        </Link>
                                    </ButtonAnimation>
                                )}

                                {auth?.warehouse ? (
                                    <ButtonAnimation>
                                        <Link href="/warehouse/dashboard" className="group relative inline-flex items-center px-4 py-2.5 bg-gradient-to-br from-blue-600 to-blue-700 text-white text-sm font-medium rounded-md shadow-md shadow-blue-600/10">
                                            <svg className="w-[18px] h-[18px] mr-2 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                            </svg>
                                            <span>پنل انبار</span>
                                        </Link>
                                    </ButtonAnimation>
                                ) : (
                                    <ButtonAnimation>
                                        <Link href="/warehouse/login" className="group relative inline-flex items-center px-4 py-2.5 bg-gradient-to-br from-blue-600 to-blue-700 text-white text-sm font-medium rounded-md shadow-md shadow-blue-600/10">
                                            <svg className="w-[18px] h-[18px] mr-2 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            <span>ورود انبار</span>
                                        </Link>
                                    </ButtonAnimation>
                                )}

                                {auth?.customer ? (
                                    <ButtonAnimation>
                                        <Link href="/customer/dashboard" className="group relative inline-flex items-center px-4 py-2.5 bg-gradient-to-br from-orange-600 to-orange-700 text-white text-sm font-medium rounded-md shadow-md shadow-orange-600/10">
                                            <svg className="w-[18px] h-[18px] mr-2 text-orange-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            <span>پنل مشتری</span>
                                        </Link>
                                    </ButtonAnimation>
                                ) : (
                                    <ButtonAnimation>
                                        <Link href="/customer/login" className="group relative inline-flex items-center px-4 py-2.5 bg-gradient-to-br from-orange-600 to-orange-700 text-white text-sm font-medium rounded-md shadow-md shadow-orange-600/10">
                                            <svg className="w-[18px] h-[18px] mr-2 text-orange-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            <span>ورود مشتری</span>
                                        </Link>
                                    </ButtonAnimation>
                                )}

                                <ButtonAnimation>
                                    <Link href="/attendance-request" className="group relative inline-flex items-center px-4 py-2.5 bg-gradient-to-br from-purple-600 to-purple-700 text-white text-sm font-medium rounded-md shadow-md shadow-purple-600/10">
                                        <svg className="w-[18px] h-[18px] mr-2 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>درخواست توجیه حضور</span>
                                    </Link>
                                </ButtonAnimation>

                                <ButtonAnimation>
                                    <Link href="/attendance-request/track" className="group relative inline-flex items-center px-4 py-2.5 bg-gradient-to-br from-teal-600 to-teal-700 text-white text-sm font-medium rounded-md shadow-md shadow-teal-600/10">
                                        <svg className="w-[18px] h-[18px] mr-2 text-teal-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <span>پیگیری درخواست</span>
                                    </Link>
                                </ButtonAnimation>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center lg:text-right"
                        >
                                                        <div className="inline-block">
                                <div className="hero-icon w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto lg:mx-0 mb-8 shadow-2xl shadow-blue-500/25">
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                            </div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="text-5xl md:text-7xl font-bold mb-6"
                            >
                                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                سیستم مدیریت کوپراتیف
                                </span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.7 }}
                                className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed"
                            >
                            راه حل جامع برای مدیریت حرفه‌ای کوپراتیف، کنترل موجودی، فروش و گزارش‌گیری هوشمند
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.9 }}
                                className="flex flex-wrap gap-4 justify-center lg:justify-start"
                            >
                                <ButtonAnimation>
                                    <a href="#features" className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold flex items-center space-x-2">
                                        <span>مشاهده ویژگی‌ها</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </a>
                                </ButtonAnimation>
                                <ButtonAnimation>
                                    <a href="#contact" className="px-8 py-4 rounded-xl bg-white/10 text-white font-semibold flex items-center space-x-2 backdrop-blur-lg">
                                        <span>تماس با ما</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </a>
                                </ButtonAnimation>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="hidden lg:block"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
                                <div className="relative bg-gradient-to-br from-[#1a1f3c] to-[#2c1f47] rounded-3xl p-8 border border-white/10">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-6">
                                            <div className="h-24 bg-white/5 rounded-xl backdrop-blur-lg p-4 border border-white/10 flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="stat-number text-2xl font-bold text-white mb-1" data-value="1234">0</div>
                                                    <div className="text-sm text-gray-400">محصول ثبت شده</div>
                                                </div>
                                            </div>
                                            <div className="h-24 bg-white/5 rounded-xl backdrop-blur-lg p-4 border border-white/10 flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="stat-number text-2xl font-bold text-white mb-1" data-value="98">0</div>
                                                    <div className="text-sm text-gray-400">رضایت مشتریان</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-6 mt-12">
                                            <div className="h-24 bg-white/5 rounded-xl backdrop-blur-lg p-4 border border-white/10 flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="stat-number text-2xl font-bold text-white mb-1" data-value="567">0</div>
                                                    <div className="text-sm text-gray-400">کاربر فعال</div>
                                                </div>
                                            </div>
                                            <div className="h-24 bg-white/5 rounded-xl backdrop-blur-lg p-4 border border-white/10 flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-white mb-1">۲۴/۷</div>
                                                    <div className="text-sm text-gray-400">پشتیبانی آنلاین</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent"></div>
                <div className="max-w-7xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                ویژگی‌های کلیدی سیستم
                            </span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            تمام ابزارهای مورد نیاز برای مدیریت کامل و هوشمند انبار شما
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: "مدیریت موجودی",
                                description: "کنترل دقیق موجودی، ثبت ورود و خروج کالا، تنظیم حد مینیمم موجودی و هشدارهای خودکار",
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                ),
                                gradient: "from-blue-500 to-indigo-600"
                            },
                            {
                                title: "مدیریت فروش",
                                description: "ثبت فروش، صدور فاکتور، مدیریت مشتریان، قیمت‌گذاری خرده و عمده فروشی",
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                ),
                                gradient: "from-green-500 to-emerald-600"
                            },
                            {
                                title: "گزارش‌گیری مالی",
                                description: "گزارش‌های تفصیلی فروش، سود و زیان، تحلیل عملکرد و نمودارهای بصری",
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                ),
                                gradient: "from-purple-500 to-pink-600"
                            },
                            {
                                title: "مدیریت کاربران",
                                description: "کنترل دسترسی، مدیریت نقش‌ها، ثبت فعالیت‌ها و امنیت بالای سیستم",
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                ),
                                gradient: "from-orange-500 to-red-600"
                            },
                            {
                                title: "انتقال انبار",
                                description: "انتقال کالا بین انبارها، ردیابی حمل و نقل و هماهنگی بین واحدها",
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                ),
                                gradient: "from-cyan-500 to-blue-600"
                            },
                            {
                                title: "آنالیز آنی",
                                description: "داشبورد آنی، آمارهای لحظه‌ای، پیش‌بینی ترندها و تصمیم‌گیری هوشمند",
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                ),
                                gradient: "from-yellow-500 to-orange-600"
                            }
                        ].map((feature, index) => (
                            <Parallax speed={5} key={index}>
                                <div className="feature-card group relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl transition-all duration-300 group-hover:blur-2xl opacity-0 group-hover:opacity-100"></div>
                                    <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 h-full">
                                        <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300`}>
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                {feature.icon}
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                                        <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                                    </div>
                                </div>
                            </Parallax>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent"></div>
                <div className="max-w-7xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                ارتباط با ما
                            </span>
                        </h2>
                        <p className="text-xl text-gray-300">
                            برای اطلاعات بیشتر و مشاوره رایگان با ما در تماس باشید
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                title: "تلفن تماس",
                                info: ["2660787"],
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                ),
                                gradient: "from-green-500 to-emerald-600"
                            },
                            {
                                title: "ایمیل",
                                info: ["info@warehouse.com", "support@warehouse.com"],
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                ),
                                gradient: "from-blue-500 to-indigo-600"
                            },
                            {
                                title: "آدرس",
                                info: ["شهر نو چهاراهی اریانا"],
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                ),
                                gradient: "from-purple-500 to-pink-600"
                            },
                            {
                                title: "ساعات کاری",
                                info: ["شنبه تا پنجشنبه", "8:00 - 17:00"],
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                ),
                                gradient: "from-orange-500 to-red-600"
                            }
                        ].map((contact, index) => (
                            <Parallax speed={3} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl transition-all duration-300 group-hover:blur-2xl opacity-0 group-hover:opacity-100"></div>
                                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 h-full">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${contact.gradient} rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {contact.icon}
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-4 text-center">{contact.title}</h3>
                                    {contact.info.map((line, i) => (
                                        <p key={i} className="text-gray-300 text-sm text-center">{line}</p>
                                    ))}
                                </div>
                            </motion.div>
                            </Parallax>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative pt-20 pb-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-blue-900/10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12"
                    >
                        {/* Brand Section */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">سیستم مدیریت کوپراتیف</span>
                            </div>
                            <p className="text-gray-400">
                                راه حل هوشمند برای مدیریت حرفه‌ای کوپراتیف و کسب و کار شما
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                                    <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>
                                <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                                    <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                    </svg>
                                </a>
                                <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                                    <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.995 17.176c-.048.11-.144.18-.257.156-.67-.183-1.487-.276-2.47-.276-.98 0-1.798.093-2.47.276-.112.024-.208-.046-.257-.156a.27.27 0 01.052-.296c.649-.578 1.794-.934 2.674-.934.881 0 2.025.356 2.674.934a.27.27 0 01.052.296zM18.406 12c0 1.088-.244 2.138-.683 3.077-.466.996-1.13 1.834-1.977 2.482-.847.648-1.83 1.094-2.878 1.314-1.048.22-2.143.22-3.191 0-1.048-.22-2.031-.666-2.878-1.314-.847-.648-1.511-1.486-1.977-2.482A7.853 7.853 0 014.139 12c0-1.088.244-2.138.683-3.077.466-.996 1.13-1.834 1.977-2.482.847-.648 1.83-1.094 2.878-1.314 1.048-.22 2.143-.22 3.191 0 1.048.22 2.031.666 2.878 1.314.847.648 1.511 1.486 1.977 2.482.439.939.683 1.989.683 3.077z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-6">دسترسی سریع</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <Link href="/adminpanel/login" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span>ورود مدیر</span>
                                </Link>
                                <Link href="/warehouse/login" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                    <span>ورود انبار</span>
                                </Link>
                                <Link href="/customer/login" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    <span>ورود مشتری</span>
                                </Link>
                            </div>
                        </div>

                        {/* Services */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-6">خدمات</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <a href="#features" className="text-gray-400 hover:text-white transition-colors">مدیریت موجودی</a>
                                <a href="#features" className="text-gray-400 hover:text-white transition-colors">مدیریت فروش</a>
                                <a href="#features" className="text-gray-400 hover:text-white transition-colors">گزارش‌گیری</a>
                                <a href="#features" className="text-gray-400 hover:text-white transition-colors">پشتیبانی ۲۴/۷</a>
                            </div>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-6">تماس با ما</h3>
                            <div className="space-y-4">
                                <p className="text-gray-400 flex items-center space-x-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span>2660787</span>
                                </p>
                                <p className="text-gray-400 flex items-center space-x-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span>info@warehouse.com</span>
                                </p>
                                <p className="text-gray-400 flex items-center space-x-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>شهر نو چهاراهی اریانا</span>
                                </p>
                                <p className="text-gray-400 flex items-center space-x-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>شنبه تا پنجشنبه: 8:00 - 17:00</span>
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Copyright */}
                    <div className="border-t border-white/10 pt-8">
                        <div className="text-center">
                            <p className="text-gray-400 text-sm flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                                طراحی و توسعه توسط تیم مولوی احمد عادل
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                                © ۲۰۲۴ تمامی حقوق محفوظ است
                            </p>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Custom Styles */}
            <style jsx="true">{`
                @keyframes float {
                    0%, 100% { transform: translate(0px, 0px) scale(1); opacity: 0.8; }
                    33% { transform: translate(30px, -50px) scale(1.1); opacity: 1; }
                    66% { transform: translate(-20px, 20px) scale(0.9); opacity: 0.9; }
                }

                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-25px); }
                }

                .animate-float {
                    animation: float 15s ease-in-out infinite;
                }

                .animate-float-delayed {
                    animation: float 15s ease-in-out infinite;
                    animation-delay: 5s;
                }

                .animate-bounce-slow {
                    animation: bounce-slow 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }

                .animation-delay-200 { animation-delay: 0.2s; }
                .animation-delay-400 { animation-delay: 0.4s; }
                .animation-delay-600 { animation-delay: 0.6s; }
                .animation-delay-800 { animation-delay: 0.8s; }
                .animation-delay-1000 { animation-delay: 1s; }

                .fade-in {
                    transition: all 0.7s ease-out;
                }

                /* Custom Scrollbar Styles */
                ::-webkit-scrollbar {
                    width: 12px;
                    background: #0A0F1C;
                }

                ::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                }

                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #3B82F6, #8B5CF6);
                    border-radius: 8px;
                    border: 2px solid #0A0F1C;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #60A5FA, #A78BFA);
                }
            `}</style>
        </div>
        </ParallaxProvider>
    );
}
