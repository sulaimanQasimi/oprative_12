import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';

export default function HomePage({ auth }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* Static Background Orbs */}
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
                
                {/* Moving Circles */}
                <div className="absolute bottom-10 left-0 w-16 h-16 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-sm animate-move-horizontal"></div>
                <div className="absolute top-20 right-0 w-12 h-12 bg-gradient-to-r from-pink-400/15 to-orange-400/15 rounded-full blur-sm animate-move-vertical" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-gradient-to-r from-emerald-400/25 to-teal-400/25 rounded-full blur-sm animate-move-diagonal" style={{animationDelay: '2.5s'}}></div>
                <div className="absolute top-1/4 left-1/3 w-6 h-6 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-full blur-sm animate-move-circular" style={{animationDelay: '3s'}}></div>
                <div className="absolute bottom-1/2 left-10 w-10 h-10 bg-gradient-to-r from-indigo-400/15 to-blue-400/15 rounded-full blur-sm animate-move-bounce" style={{animationDelay: '4s'}}></div>
                <div className="absolute top-1/3 right-1/3 w-14 h-14 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-sm animate-move-float" style={{animationDelay: '1.5s'}}></div>
                <div className="absolute bottom-20 right-20 w-7 h-7 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-sm animate-move-zigzag" style={{animationDelay: '5s'}}></div>
                
                {/* Floating Particles */}
                <div className="absolute top-10 left-1/4 w-3 h-3 bg-white/10 rounded-full animate-particle-float" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-blue-400/30 rounded-full animate-particle-float" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-purple-400/20 rounded-full animate-particle-float" style={{animationDelay: '3.5s'}}></div>
                <div className="absolute bottom-10 left-1/3 w-3 h-3 bg-emerald-400/25 rounded-full animate-particle-float" style={{animationDelay: '1.8s'}}></div>
            </div>

            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-500 ${
                isScrolled 
                    ? 'bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl' 
                    : 'bg-transparent'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold text-white">سیستم مدیریت کوپراتیف</span>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-3">
                            {auth?.web ? (
                                <Link href="/adminpanel/" className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors duration-200 shadow-sm">
                                    پنل مدیریت
                                </Link>
                            ) : (
                                <Link href="/adminpanel/login" className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors duration-200 shadow-sm">
                                    ورود مدیر
                                </Link>
                            )}

                            {auth?.warehouse ? (
                                <Link href="/warehouse/dashboard" className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200 shadow-sm">
                                    پنل انبار
                                </Link>
                            ) : (
                                <Link href="/warehouse/login" className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200 shadow-sm">
                                    ورود انبار
                                </Link>
                            )}

                            {auth?.customer ? (
                                <Link href="/customer/dashboard" className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-md transition-colors duration-200 shadow-sm">
                                    پنل مشتری
                                </Link>
                            ) : (
                                <Link href="/customer/login" className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-md transition-colors duration-200 shadow-sm">
                                    ورود مشتری
                                </Link>
                            )}

                            <Link href="/attendance-request" className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors duration-200 shadow-sm">
                                درخواست توجیه حضور
                            </Link>

                            <Link href="/attendance-request/track" className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-md transition-colors duration-200 shadow-sm">
                                پیگیری درخواست
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={toggleMobileMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 transition-colors duration-200"
                            >
                                <span className="sr-only">منوی اصلی</span>
                                {isMobileMenuOpen ? (
                                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                        <div className="px-2 pt-2 pb-3 space-y-2 bg-slate-800/95 backdrop-blur-xl rounded-lg mt-2 border border-slate-700/50">
                            {auth?.web ? (
                                <Link href="/adminpanel/" className="block px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors duration-200">
                                    پنل مدیریت
                                </Link>
                            ) : (
                                <Link href="/adminpanel/login" className="block px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors duration-200">
                                    ورود مدیر
                                </Link>
                            )}

                            {auth?.warehouse ? (
                                <Link href="/warehouse/dashboard" className="block px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200">
                                    پنل انبار
                                </Link>
                            ) : (
                                <Link href="/warehouse/login" className="block px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200">
                                    ورود انبار
                                </Link>
                            )}

                            {auth?.customer ? (
                                <Link href="/customer/dashboard" className="block px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-md transition-colors duration-200">
                                    پنل مشتری
                                </Link>
                            ) : (
                                <Link href="/customer/login" className="block px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-md transition-colors duration-200">
                                    ورود مشتری
                                </Link>
                            )}

                            <Link href="/attendance-request" className="block px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors duration-200">
                                درخواست توجیه حضور
                            </Link>

                            <Link href="/attendance-request/track" className="block px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-md transition-colors duration-200">
                                پیگیری درخواست
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl transform hover:scale-105 transition-all duration-500 animate-pulse">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-fade-in">
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                سیستم مدیریت کوپراتیف
                            </span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-delay">
                            راه حل جامع و هوشمند برای مدیریت حرفه‌ای کوپراتیف‌ها با امکانات پیشرفته کنترل موجودی، 
                            مدیریت فروش، گزارش‌گیری تحلیلی و پشتیبانی ۲۴ ساعته
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-delay-2">
                            <a href="#features" className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
                                <span className="relative z-10 flex items-center">
                                    مشاهده ویژگی‌ها
                                    <svg className="w-5 h-5 mr-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </a>
                            
                            <a href="#contact" className="group relative px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 text-white font-semibold rounded-xl backdrop-blur-lg transition-all duration-300 transform hover:scale-105 border border-slate-700/50 hover:border-slate-600/50">
                                <span className="relative z-10 flex items-center">
                                    تماس با ما
                                    <svg className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-delay-3">
                        <div className="text-center group">
                            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 transition-all duration-300 transform group-hover:scale-105 group-hover:border-blue-500/50">
                                <div className="text-3xl font-bold text-blue-400 mb-2">1,234</div>
                                <div className="text-sm text-slate-400">محصول ثبت شده</div>
                            </div>
                        </div>
                        <div className="text-center group">
                            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 transition-all duration-300 transform group-hover:scale-105 group-hover:border-emerald-500/50">
                                <div className="text-3xl font-bold text-emerald-400 mb-2">98%</div>
                                <div className="text-sm text-slate-400">رضایت مشتریان</div>
                            </div>
                        </div>
                        <div className="text-center group">
                            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 transition-all duration-300 transform group-hover:scale-105 group-hover:border-purple-500/50">
                                <div className="text-3xl font-bold text-purple-400 mb-2">567</div>
                                <div className="text-sm text-slate-400">کاربر فعال</div>
                            </div>
                        </div>
                        <div className="text-center group">
                            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 transition-all duration-300 transform group-hover:scale-105 group-hover:border-orange-500/50">
                                <div className="text-3xl font-bold text-orange-400 mb-2">24/7</div>
                                <div className="text-sm text-slate-400">پشتیبانی آنلاین</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-800/20 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                ویژگی‌های کلیدی سیستم
                            </span>
                        </h2>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                            تمام ابزارهای مورد نیاز برای مدیریت کامل و هوشمند کوپراتیف شما
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: "مدیریت موجودی",
                                description: "کنترل دقیق موجودی، ثبت ورود و خروج کالا، تنظیم حد مینیمم موجودی و هشدارهای خودکار",
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                ),
                                gradient: "from-blue-500 to-indigo-600",
                                hoverColor: "hover:border-blue-500/50"
                            },
                            {
                                title: "مدیریت فروش",
                                description: "ثبت فروش، صدور فاکتور، مدیریت مشتریان، قیمت‌گذاری خرده و عمده فروشی",
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                ),
                                gradient: "from-emerald-500 to-green-600",
                                hoverColor: "hover:border-emerald-500/50"
                            },
                            {
                                title: "گزارش‌گیری مالی",
                                description: "گزارش‌های تفصیلی فروش، سود و زیان، تحلیل عملکرد و نمودارهای بصری",
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                ),
                                gradient: "from-purple-500 to-pink-600",
                                hoverColor: "hover:border-purple-500/50"
                            },
                            {
                                title: "مدیریت کاربران",
                                description: "کنترل دسترسی، مدیریت نقش‌ها، ثبت فعالیت‌ها و امنیت بالای سیستم",
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                ),
                                gradient: "from-orange-500 to-red-600",
                                hoverColor: "hover:border-orange-500/50"
                            },
                            {
                                title: "انتقال انبار",
                                description: "انتقال کالا بین انبارها، ردیابی حمل و نقل و هماهنگی بین واحدها",
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                ),
                                gradient: "from-cyan-500 to-blue-600",
                                hoverColor: "hover:border-cyan-500/50"
                            },
                            {
                                title: "آنالیز هوشمند",
                                description: "داشبورد آنی، آمارهای لحظه‌ای، پیش‌بینی ترندها و تصمیم‌گیری هوشمند",
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                ),
                                gradient: "from-yellow-500 to-orange-600",
                                hoverColor: "hover:border-yellow-500/50"
                            }
                        ].map((feature, index) => (
                            <div key={index} className={`group relative transform transition-all duration-500 hover:scale-105 animate-fade-in-stagger`} style={{animationDelay: `${index * 0.1}s`}}>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl transition-all duration-300 group-hover:blur-2xl opacity-0 group-hover:opacity-100"></div>
                                <div className={`relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 ${feature.hoverColor} transition-all duration-300 h-full`}>
                                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-all duration-300`}>
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {feature.icon}
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">{feature.title}</h3>
                                    <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-800/20 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                ارتباط با ما
                            </span>
                        </h2>
                        <p className="text-xl text-slate-300">
                            برای اطلاعات بیشتر و مشاوره رایگان با ما در تماس باشید
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                title: "تلفن تماس",
                                info: "2660787",
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                ),
                                gradient: "from-emerald-500 to-green-600",
                                hoverColor: "hover:border-emerald-500/50"
                            },
                            {
                                title: "ایمیل",
                                info: "info@warehouse.com",
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                ),
                                gradient: "from-blue-500 to-indigo-600",
                                hoverColor: "hover:border-blue-500/50"
                            },
                            {
                                title: "آدرس",
                                info: "شهر نو چهاراهی اریانا",
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                ),
                                gradient: "from-purple-500 to-pink-600",
                                hoverColor: "hover:border-purple-500/50"
                            },
                            {
                                title: "ساعات کاری",
                                info: "شنبه تا پنجشنبه: 8:00 - 17:00",
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                ),
                                gradient: "from-orange-500 to-red-600",
                                hoverColor: "hover:border-orange-500/50"
                            }
                        ].map((contact, index) => (
                            <div key={index} className={`group relative transform transition-all duration-500 hover:scale-105 animate-fade-in-stagger`} style={{animationDelay: `${index * 0.1}s`}}>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl transition-all duration-300 group-hover:blur-2xl opacity-0 group-hover:opacity-100"></div>
                                <div className={`relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 ${contact.hoverColor} transition-all duration-300 h-full text-center`}>
                                    <div className={`w-16 h-16 bg-gradient-to-br ${contact.gradient} rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 transition-all duration-300`}>
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {contact.icon}
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">{contact.title}</h3>
                                    <p className="text-slate-300">{contact.info}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900/80 backdrop-blur-xl border-t border-slate-700/50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Brand */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <span className="text-2xl font-bold text-white">سیستم مدیریت کوپراتیف</span>
                            </div>
                            <p className="text-slate-400 leading-relaxed max-w-md">
                                راه حل هوشمند برای مدیریت حرفه‌ای کوپراتیف و کسب و کار شما با امکانات پیشرفته و پشتیبانی مستمر
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-6">دسترسی سریع</h3>
                            <div className="space-y-3">
                                <Link href="/adminpanel/login" className="block text-slate-400 hover:text-white transition-colors duration-300 hover:translate-x-1 transform">
                                    ورود مدیر
                                </Link>
                                <Link href="/warehouse/login" className="block text-slate-400 hover:text-white transition-colors duration-300 hover:translate-x-1 transform">
                                    ورود انبار
                                </Link>
                                <Link href="/customer/login" className="block text-slate-400 hover:text-white transition-colors duration-300 hover:translate-x-1 transform">
                                    ورود مشتری
                                </Link>
                                <Link href="/attendance-request" className="block text-slate-400 hover:text-white transition-colors duration-300 hover:translate-x-1 transform">
                                    درخواست حضور
                                </Link>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-6">اطلاعات تماس</h3>
                            <div className="space-y-3">
                                <p className="text-slate-400 hover:text-white transition-colors duration-300">تلفن: 2660787</p>
                                <p className="text-slate-400 hover:text-white transition-colors duration-300">ایمیل: info@warehouse.com</p>
                                <p className="text-slate-400 hover:text-white transition-colors duration-300">آدرس: شهر نو چهاراهی اریانا</p>
                                <p className="text-slate-400 hover:text-white transition-colors duration-300">ساعات کاری: شنبه تا پنجشنبه 8:00 - 17:00</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-700/50 mt-12 pt-8 text-center">
                        <p className="text-slate-400">
                            © 2024 سیستم مدیریت کوپراتیف. تمامی حقوق محفوظ است.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fade-in-stagger {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes move-horizontal {
                    0% { transform: translateX(-100vw); }
                    100% { transform: translateX(100vw); }
                }

                @keyframes move-vertical {
                    0% { transform: translateY(-50px); }
                    50% { transform: translateY(50px); }
                    100% { transform: translateY(-50px); }
                }

                @keyframes move-diagonal {
                    0% { transform: translate(-50px, -50px); }
                    25% { transform: translate(50px, -50px); }
                    50% { transform: translate(50px, 50px); }
                    75% { transform: translate(-50px, 50px); }
                    100% { transform: translate(-50px, -50px); }
                }

                @keyframes move-circular {
                    0% { transform: rotate(0deg) translateX(30px) rotate(0deg); }
                    100% { transform: rotate(360deg) translateX(30px) rotate(-360deg); }
                }

                @keyframes move-bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-30px); }
                    60% { transform: translateY(-15px); }
                }

                @keyframes move-float {
                    0% { transform: translateY(0) rotate(0deg); }
                    33% { transform: translateY(-20px) rotate(5deg); }
                    66% { transform: translateY(10px) rotate(-5deg); }
                    100% { transform: translateY(0) rotate(0deg); }
                }

                @keyframes move-zigzag {
                    0% { transform: translate(0, 0); }
                    25% { transform: translate(30px, -30px); }
                    50% { transform: translate(0, -60px); }
                    75% { transform: translate(-30px, -30px); }
                    100% { transform: translate(0, 0); }
                }

                @keyframes particle-float {
                    0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
                    50% { transform: translateY(-20px) scale(1.1); opacity: 0.6; }
                }

                .animate-fade-in {
                    animation: fade-in 0.8s ease-out;
                }

                .animate-fade-in-delay {
                    animation: fade-in 0.8s ease-out 0.2s both;
                }

                .animate-fade-in-delay-2 {
                    animation: fade-in 0.8s ease-out 0.4s both;
                }

                .animate-fade-in-delay-3 {
                    animation: fade-in 0.8s ease-out 0.6s both;
                }

                .animate-fade-in-stagger {
                    animation: fade-in-stagger 0.6s ease-out both;
                }

                .animate-move-horizontal {
                    animation: move-horizontal 15s linear infinite;
                }

                .animate-move-vertical {
                    animation: move-vertical 8s ease-in-out infinite;
                }

                .animate-move-diagonal {
                    animation: move-diagonal 12s ease-in-out infinite;
                }

                .animate-move-circular {
                    animation: move-circular 10s linear infinite;
                }

                .animate-move-bounce {
                    animation: move-bounce 3s ease-in-out infinite;
                }

                .animate-move-float {
                    animation: move-float 6s ease-in-out infinite;
                }

                .animate-move-zigzag {
                    animation: move-zigzag 8s ease-in-out infinite;
                }

                .animate-particle-float {
                    animation: particle-float 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
