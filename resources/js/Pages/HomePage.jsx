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
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50">
            {/* Animated Background Shapes */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-br from-blue-300/30 to-cyan-300/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-br from-yellow-300/30 to-orange-300/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md shadow-lg fixed w-full z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center">
                            <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 overflow-hidden rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-110 hover:rotate-3">
                                    <img src="/images/logo.jpg" alt="لوگوی برند شما" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 animate-gradient">برند شما</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-6 pr-2">
                                {auth?.web ? (
                                    <a target='_blank' href="/admin/" className="px-4 ml-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-white/20 w-0 group-hover:w-full transition-all duration-700"></div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                        </svg>
                                        <span>داشبورد مدیر</span>
                                    </a>
                                ) : (
                                    <a target='_blank' href="/admin/login" className="px-4 ml-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-white/20 w-0 group-hover:w-full transition-all duration-700"></div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                        </svg>
                                        <span>ورود مدیر</span>
                                    </a>
                                )}

                                {auth?.warehouse ? (
                                    <Link href="/warehouse/dashboard" className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-white/20 w-0 group-hover:w-full transition-all duration-700"></div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                        </svg>
                                        <span>داشبورد گدام</span>
                                    </Link>
                                ) : (
                                    <Link href="/warehouse/login" className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-white/20 w-0 group-hover:w-full transition-all duration-700"></div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                        </svg>
                                        <span>ورود گدام</span>
                                    </Link>
                                )}

                                {auth?.customer ? (
                                    <Link href="/customer/dashboard" className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-white/20 w-0 group-hover:w-full transition-all duration-700"></div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        <span>داشبورد فروشگاه</span>
                                    </Link>
                                ) : (
                                    <Link href="/customer/login" className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-white/20 w-0 group-hover:w-full transition-all duration-700"></div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        <span>ورود فروشگاه</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute -right-80 -top-80 w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-indigo-100/40 to-purple-100/40 blur-3xl -z-10"></div>
                <div className="absolute -left-80 top-40 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-indigo-100/40 to-blue-100/40 blur-3xl -z-10"></div>
                <div className="max-w-7xl mx-auto">
                    <div className="lg:flex items-center gap-12">
                        <div className="text-center lg:text-left lg:w-1/2">
                            <h1 className="fade-in opacity-0 transform translate-y-4 transition-all duration-700 text-5xl tracking-tight font-extrabold text-gray-900 sm:text-6xl md:text-7xl">
                                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-slow">تجارت خود را متحول کنید</span>
                                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 animate-gradient-slow">با راه حل‌های ما</span>
                            </h1>
                            <p className="fade-in opacity-0 transform translate-y-4 transition-all duration-700 mt-6 text-xl text-gray-600 max-w-md mx-auto lg:mx-0">
                                عملیات خود را بهینه کنید، بهره‌وری را افزایش دهید و رشد را با پلتفرم نوآورانه ما هدایت کنید.
                            </p>
                        </div>
                        <div className="hidden lg:block lg:w-1/2 mt-10 lg:mt-0 fade-in opacity-0 transform translate-y-4 transition-all duration-700">
                            <div className="relative">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl blur-sm opacity-75 animate-pulse"></div>
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-xl transform rotate-3"></div>
                                <img src="/images/hero-image.jpg" alt="تصویر اصلی"
                                     className="relative rounded-xl shadow-xl z-10 object-cover w-full transform transition-transform duration-500 hover:scale-105" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Animated Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
                    <div className="w-6 h-10 border-2 border-indigo-600 rounded-full flex justify-center">
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 animate-bounce-slow"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gradient-to-b from-white via-indigo-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center fade-in opacity-0 transform translate-y-4 transition-all duration-700">
                        <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-slow">
                            همه آنچه برای موفقیت نیاز دارید
                        </h2>
                        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                            راه‌حل‌های جامع برای نیازهای تجاری شما
                        </p>
                    </div>

                    <div className="mt-20 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Feature 1 */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-indigo-100 group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:border-pink-200 overflow-hidden fade-in opacity-0 transform translate-y-4 transition-all duration-700">
                            <div className="h-48 overflow-hidden">
                                <img src="/images/feature1.jpg" alt="سرعت فوق‌العاده" className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" />
                            </div>
                            <div className="p-8 relative">
                                <div className="absolute -top-8 left-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mt-6 group-hover:text-pink-600 transition-colors">سرعت فوق‌العاده</h3>
                                <p className="mt-3 text-gray-600 leading-relaxed">
                                    عملکرد فوق‌العاده سریع را با پلتفرم بهینه‌سازی شده ما برای سرعت و کارایی تجربه کنید.
                                </p>
                                <div className="w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 mt-4 group-hover:w-full transition-all duration-500"></div>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-indigo-100 group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:border-cyan-200 overflow-hidden fade-in opacity-0 transform translate-y-4 transition-all duration-700 animation-delay-200">
                            <div className="h-48 overflow-hidden">
                                <img src="/images/feature2.jpg" alt="امن و قابل اعتماد" className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" />
                            </div>
                            <div className="p-8 relative">
                                <div className="absolute -top-8 left-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mt-6 group-hover:text-cyan-600 transition-colors">امن و قابل اعتماد</h3>
                                <p className="mt-3 text-gray-600 leading-relaxed">
                                    داده‌های شما با اقدامات امنیتی سطح سازمانی و زیرساخت قابل اعتماد ما محافظت می‌شود.
                                </p>
                                <div className="w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 mt-4 group-hover:w-full transition-all duration-500"></div>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-indigo-100 group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:border-amber-200 overflow-hidden fade-in opacity-0 transform translate-y-4 transition-all duration-700 animation-delay-400">
                            <div className="h-48 overflow-hidden">
                                <img src="/images/feature3.jpg" alt="تحلیل و بینش" className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" />
                            </div>
                            <div className="p-8 relative">
                                <div className="absolute -top-8 left-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mt-6 group-hover:text-amber-600 transition-colors">تحلیل و بینش</h3>
                                <p className="mt-3 text-gray-600 leading-relaxed">
                                    با ابزارهای تحلیلی قدرتمند که بینش‌های قابل اجرا ارائه می‌دهند، تصمیمات مبتنی بر داده بگیرید.
                                </p>
                                <div className="w-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-600 mt-4 group-hover:w-full transition-all duration-500"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white border-t border-indigo-800">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center">
                        <div className="w-8 h-8 overflow-hidden rounded-lg mr-2 animate-spin-slow">
                            <img src="/images/logo.jpg" alt="لوگوی برند شما" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-pink-300 to-purple-300 animate-gradient mb-2">برند شما</span>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm flex items-center justify-center group">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-400 group-hover:text-pink-300 transition-colors transform group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            <span className="text-indigo-200 hover:text-white transition-colors relative inline-block">
                                دیزان و توسعه توسط تیم مولوی احمد عادل
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                            </span>
                        </p>
                        <p className="text-sm text-indigo-300 mt-4">
                            © ۲۰۲۴ برند شما. تمامی حقوق محفوظ است.
                        </p>
                    </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient-x"></div>
            </footer>

            {/* Add to style section */}
            <style jsx>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }

                @keyframes gradient {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }

                .animate-blob {
                    animation: blob 7s infinite;
                }

                .animation-delay-2000 {
                    animation-delay: 2s;
                }

                .animation-delay-4000 {
                    animation-delay: 4s;
                }

                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }

                .animate-gradient-slow {
                    background-size: 200% 200%;
                    animation: gradient 6s ease infinite;
                }

                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient 2s ease infinite;
                }

                .animate-bounce-slow {
                    animation: bounce 1.5s infinite;
                }

                .animate-spin-slow {
                    animation: spin 10s linear infinite;
                }

                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}
