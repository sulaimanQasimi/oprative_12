import React from 'react';
import { Link } from '@inertiajs/react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="bg-white/90 backdrop-blur-sm shadow-md fixed w-full z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center">
                            <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 overflow-hidden rounded-lg">
                                    <img src="/images/logo.jpg" alt="لوگوی برند شما" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">برند شما</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="border-r border-gray-200 pr-4 flex items-center space-x-4">
                                <Link href="/admin/login" className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                    </svg>
                                    مدیر
                                </Link>
                                <Link href="/warehouse/login" className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                    </svg>
                                    گدام
                                </Link>
                                <Link href="/store/login" className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    فروشگاه
                                </Link>
                            </div>
                          
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white -z-10"></div>
                <div className="absolute -right-80 -top-80 w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-indigo-100/40 to-purple-100/40 blur-3xl -z-10"></div>
                <div className="absolute -left-80 top-40 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-indigo-100/40 to-blue-100/40 blur-3xl -z-10"></div>
                <div className="max-w-7xl mx-auto">
                    <div className="lg:flex items-center gap-12">
                        <div className="text-center lg:text-left lg:w-1/2">
                            <h1 className="text-5xl tracking-tight font-extrabold text-gray-900 sm:text-6xl md:text-7xl">
                                <span className="block">تجارت خود را متحول کنید</span>
                                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">با راه حل‌های ما</span>
                            </h1>
                            <p className="mt-6 text-xl text-gray-600 max-w-md mx-auto lg:mx-0">
                                عملیات خود را بهینه کنید، بهره‌وری را افزایش دهید و رشد را با پلتفرم نوآورانه ما هدایت کنید.
                            </p>
                        </div>
                        <div className="hidden lg:block lg:w-1/2 mt-10 lg:mt-0">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-xl transform rotate-3"></div>
                                <img src="/images/hero-image.jpg" alt="تصویر اصلی" className="relative rounded-xl shadow-xl z-10 object-cover w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
                            همه آنچه برای موفقیت نیاز دارید
                        </h2>
                        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                            راه‌حل‌های جامع برای نیازهای تجاری شما
                        </p>
                    </div>

                    <div className="mt-20 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Feature 1 */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                            <div className="h-48 overflow-hidden">
                                <img src="/images/feature1.jpg" alt="سرعت فوق‌العاده" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-8">
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 -mt-16 mb-6 ml-4 ring-4 ring-white">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">سرعت فوق‌العاده</h3>
                                <p className="mt-3 text-gray-600 leading-relaxed">
                                    عملکرد فوق‌العاده سریع را با پلتفرم بهینه‌سازی شده ما برای سرعت و کارایی تجربه کنید.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                            <div className="h-48 overflow-hidden">
                                <img src="/images/feature2.jpg" alt="امن و قابل اعتماد" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-8">
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 -mt-16 mb-6 ml-4 ring-4 ring-white">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">امن و قابل اعتماد</h3>
                                <p className="mt-3 text-gray-600 leading-relaxed">
                                    داده‌های شما با اقدامات امنیتی سطح سازمانی و زیرساخت قابل اعتماد ما محافظت می‌شود.
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                            <div className="h-48 overflow-hidden">
                                <img src="/images/feature3.jpg" alt="تحلیل و بینش" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-8">
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 -mt-16 mb-6 ml-4 ring-4 ring-white">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">تحلیل و بینش</h3>
                                <p className="mt-3 text-gray-600 leading-relaxed">
                                    با ابزارهای تحلیلی قدرتمند که بینش‌های قابل اجرا ارائه می‌دهند، تصمیمات مبتنی بر داده بگیرید.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Footer */}
            <footer className="bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center">
                        <div className="w-8 h-8 overflow-hidden rounded-lg mr-2">
                            <img src="/images/logo.jpg" alt="لوگوی برند شما" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">برند شما</span>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            دیزان و توسعه توسط تیم مولوی احمد عادل
                        </p>
                        <p className="text-sm text-gray-400 mt-4">
                            © ۲۰۲۴ برند شما. تمامی حقوق محفوظ است.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
