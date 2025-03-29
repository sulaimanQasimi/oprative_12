import React from 'react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
    const { currentLocale, setLocale, getLocales, loading } = useLaravelReactI18n();
    
    const languageNames = {
        en: 'English',
        es: 'Español',
        fr: 'Français',
        de: 'Deutsch',
        it: 'Italiano',
        pt: 'Português',
        ru: 'Русский',
        zh: '中文',
        ja: '日本語',
        ar: 'العربية',
        fa: 'فارسی'
    };

    const locales = getLocales();
    
    const handleLanguageChange = (locale) => {
        setLocale(locale);
    };
    
    return (
        <div className="relative">
            <div className="flex items-center gap-1 cursor-pointer group">
                <Globe className="h-5 w-5 text-gray-600" />
                <div className="peer flex items-center gap-1 text-sm">
                    <span className="font-medium">{languageNames[currentLocale()] || currentLocale()}</span>
                    <svg
                        className="h-4 w-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                        ></path>
                    </svg>
                </div>
                
                <div className="hidden absolute top-full right-0 pt-2 peer-hover:block hover:block z-50">
                    <div className="bg-white rounded-md shadow-lg py-1 min-w-[150px] border border-gray-200">
                        {loading ? (
                            <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                        ) : (
                            <>
                                {locales.map((locale) => (
                                    <button
                                        key={locale}
                                        onClick={() => handleLanguageChange(locale)}
                                        className={`block w-full text-left px-4 py-2 text-sm ${
                                            currentLocale() === locale
                                                ? 'bg-indigo-50 text-indigo-700 font-medium'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        {languageNames[locale] || locale}
                                    </button>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LanguageSwitcher; 