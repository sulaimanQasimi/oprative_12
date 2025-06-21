import React, { useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function HomePage({ auth }) {
    // Animation effect for the hero section elements
    useEffect(() => {
        const fadeInElements = document.querySelectorAll('.fade-in');
        fadeInElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('opacity-100');
                element.classList.add('translate-y-0');
            }, 200 * index);
        });
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float-delayed"></div>
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            </div>

            {/* Navigation */}
            <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 fixed w-full z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <span className="text-2xl font-bold text-white">سیستم مدیریت انبار</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-6 pr-2">
                                {auth?.web ? (
                                    <Link href="/adminpanel/" className="px-6 ml-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-white/10 w-0 group-hover:w-full transition-all duration-500"></div>
                                        <svg className="h-5 w-5 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        <span className="z-10">پنل مدیریت</span>
                                    </Link>
                                ) : (
                                    <Link href="/adminpanel/login" className="px-6 ml-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-white/10 w-0 group-hover:w-full transition-all duration-500"></div>
                                        <svg className="h-5 w-5 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        <span className="z-10">ورود مدیر</span>
                                    </Link>
                                )}

                                {auth?.warehouse ? (
                                    <Link href="/warehouse/dashboard" className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-white/10 w-0 group-hover:w-full transition-all duration-500"></div>
                                        <svg className="h-5 w-5 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                        </svg>
                                        <span className="z-10">پنل انبار</span>
                                    </Link>
                                ) : (
                                    <Link href="/warehouse/login" className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-white/10 w-0 group-hover:w-full transition-all duration-500"></div>
                                        <svg className="h-5 w-5 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        <span className="z-10">ورود انبار</span>
                                    </Link>
                                )}

                                {auth?.customer ? (
                                    <Link href="/customer/dashboard" className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-white/10 w-0 group-hover:w-full transition-all duration-500"></div>
                                        <svg className="h-5 w-5 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        <span className="z-10">پنل مشتری</span>
                                    </Link>
                                ) : (
                                    <Link href="/customer/login" className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-white/10 w-0 group-hover:w-full transition-all duration-500"></div>
                                        <svg className="h-5 w-5 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        <span className="z-10">ورود مشتری</span>
                                    </Link>
                                )}

                                <Link href="/attendance-request" className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-white/10 w-0 group-hover:w-full transition-all duration-500"></div>
                                    <svg className="h-5 w-5 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="z-10">درخواست توجیه حضور</span>
                                </Link>

                                <Link href="/attendance-request/track" className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-white/10 w-0 group-hover:w-full transition-all duration-500"></div>
                                    <svg className="h-5 w-5 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <span className="z-10">پیگیری درخواست</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="fade-in opacity-0 transform translate-y-4 transition-all duration-700">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce-slow">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                                سیستم مدیریت انبار
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                            راه حل جامع برای مدیریت حرفه‌ای انبار، کنترل موجودی، فروش و گزارش‌گیری هوشمند
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 fade-in opacity-0 transform translate-y-4 transition-all duration-700">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            ویژگی‌های کلیدی سیستم
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            تمام ابزارهای مورد نیاز برای مدیریت کامل و هوشمند انبار شما
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 - Inventory Management */}
                        <div className="fade-in opacity-0 transform translate-y-4 transition-all duration-700 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-blue-500/50 hover:scale-105 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">مدیریت موجودی</h3>
                            <p className="text-gray-300 leading-relaxed">
                                کنترل دقیق موجودی، ثبت ورود و خروج کالا، تنظیم حد مینیمم موجودی و هشدارهای خودکار
                            </p>
                        </div>

                        {/* Feature 2 - Sales Management */}
                        <div className="fade-in opacity-0 transform translate-y-4 transition-all duration-700 animation-delay-200 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-green-500/50 hover:scale-105 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">مدیریت فروش</h3>
                            <p className="text-gray-300 leading-relaxed">
                                ثبت فروش، صدور فاکتور، مدیریت مشتریان، قیمت‌گذاری خرده و عمده فروشی
                            </p>
                        </div>

                        {/* Feature 3 - Financial Reports */}
                        <div className="fade-in opacity-0 transform translate-y-4 transition-all duration-700 animation-delay-400 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-500/50 hover:scale-105 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">گزارش‌گیری مالی</h3>
                            <p className="text-gray-300 leading-relaxed">
                                گزارش‌های تفصیلی فروش، سود و زیان، تحلیل عملکرد و نمودارهای بصری
                            </p>
                        </div>

                        {/* Feature 4 - User Management */}
                        <div className="fade-in opacity-0 transform translate-y-4 transition-all duration-700 animation-delay-600 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-orange-500/50 hover:scale-105 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">مدیریت کاربران</h3>
                            <p className="text-gray-300 leading-relaxed">
                                کنترل دسترسی، مدیریت نقش‌ها، ثبت فعالیت‌ها و امنیت بالای سیستم
                            </p>
                        </div>

                        {/* Feature 5 - Warehouse Transfer */}
                        <div className="fade-in opacity-0 transform translate-y-4 transition-all duration-700 animation-delay-800 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-cyan-500/50 hover:scale-105 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">انتقال انبار</h3>
                            <p className="text-gray-300 leading-relaxed">
                                انتقال کالا بین انبارها، ردیابی حمل و نقل و هماهنگی بین واحدها
                            </p>
                        </div>

                        {/* Feature 6 - Real-time Analytics */}
                        <div className="fade-in opacity-0 transform translate-y-4 transition-all duration-700 animation-delay-1000 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-yellow-500/50 hover:scale-105 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">آنالیز آنی</h3>
                            <p className="text-gray-300 leading-relaxed">
                                داشبورد آنی، آمارهای لحظه‌ای، پیش‌بینی ترندها و تصمیم‌گیری هوشمند
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 fade-in opacity-0 transform translate-y-4 transition-all duration-700">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            ارتباط با ما
                        </h2>
                        <p className="text-xl text-gray-300">
                            برای اطلاعات بیشتر و مشاوره رایگان با ما در تماس باشید
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Phone */}
                        <div className="fade-in opacity-0 transform translate-y-4 transition-all duration-700 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center hover:scale-105 transition-all duration-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">تلفن تماس</h3>
                            <p className="text-gray-300 text-sm">021-88776655</p>
                            <p className="text-gray-300 text-sm">0912-3456789</p>
                        </div>

                        {/* Email */}
                        <div className="fade-in opacity-0 transform translate-y-4 transition-all duration-700 animation-delay-200 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center hover:scale-105 transition-all duration-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">ایمیل</h3>
                            <p className="text-gray-300 text-sm">info@warehouse.com</p>
                            <p className="text-gray-300 text-sm">support@warehouse.com</p>
                        </div>

                        {/* Address */}
                        <div className="fade-in opacity-0 transform translate-y-4 transition-all duration-700 animation-delay-400 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center hover:scale-105 transition-all duration-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">آدرس</h3>
                            <p className="text-gray-300 text-sm">تهران، خیابان ولیعصر</p>
                            <p className="text-gray-300 text-sm">پلاک 123، طبقه 4</p>
                        </div>

                        {/* Working Hours */}
                        <div className="fade-in opacity-0 transform translate-y-4 transition-all duration-700 animation-delay-600 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center hover:scale-105 transition-all duration-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">ساعات کاری</h3>
                            <p className="text-gray-300 text-sm">شنبه تا چهارشنبه</p>
                            <p className="text-gray-300 text-sm">8:00 - 17:00</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black/30 backdrop-blur-lg border-t border-white/20 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold text-white">سیستم مدیریت انبار</span>
                        </div>

                        <div className="mb-8">
                            <p className="text-gray-300 mb-4">
                                راه حل هوشمند برای مدیریت حرفه‌ای انبار و کسب و کار شما
                            </p>
                            <div className="flex justify-center space-x-6 flex-wrap gap-y-4">
                                <Link href="/adminpanel/login" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center space-x-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span>ورود مدیر</span>
                                </Link>
                                <Link href="/warehouse/login" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                    <span>ورود انبار</span>
                                </Link>
                                <Link href="/customer/login" className="text-orange-400 hover:text-orange-300 transition-colors flex items-center space-x-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    <span>ورود مشتری</span>
                                </Link>
                                <Link href="/attendance-request" className="text-purple-400 hover:text-purple-300 transition-colors flex items-center space-x-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>درخواست توجیه حضور</span>
                                </Link>
                                <Link href="/attendance-request/track" className="text-teal-400 hover:text-teal-300 transition-colors flex items-center space-x-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <span>پیگیری درخواست</span>
                                </Link>
                            </div>
                        </div>

                        <div className="border-t border-white/20 pt-8">
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
                    0%, 100% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }

                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-25px); }
                }

                .animate-float {
                    animation: float 8s ease-in-out infinite;
                }

                .animate-float-delayed {
                    animation: float 8s ease-in-out infinite;
                    animation-delay: 2s;
                }

                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }

                .animation-delay-200 { animation-delay: 0.2s; }
                .animation-delay-400 { animation-delay: 0.4s; }
                .animation-delay-600 { animation-delay: 0.6s; }
                .animation-delay-800 { animation-delay: 0.8s; }
                .animation-delay-1000 { animation-delay: 1s; }

                .fade-in {
                    transition: all 0.7s ease-out;
                }
            `}</style>
        </div>
    );
}
