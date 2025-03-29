import React from 'react';
import { useLaravelReactI18n } from 'laravel-react-i18n';

const TranslationDemo = () => {
    const { t, tChoice, currentLocale, getLocales } = useLaravelReactI18n();
    
    // Examples for simple translations
    const simpleExamples = [
        'My Sales',
        'Total Sales',
        'Search',
        'Date'
    ];
    
    // Examples for translations with replacements
    const replacementExamples = [
        { key: 'Hello, :name!', replacements: { name: 'User' } },
        { key: 'You have :count message(s)', replacements: { count: 5 } }
    ];
    
    // Examples for plural translations
    const pluralExamples = [
        { key: 'There is one sale|There are many sales', count: 1 },
        { key: 'There is one sale|There are many sales', count: 5 },
        { key: '{0} No results found|{1} One result found|[2,*] :count results found', count: 0 },
        { key: '{0} No results found|{1} One result found|[2,*] :count results found', count: 1 },
        { key: '{0} No results found|{1} One result found|[2,*] :count results found', count: 10 }
    ];
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Translation Demo</h2>
            
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Current Locale: {currentLocale()}</h3>
                <p className="text-sm text-gray-600">Available Locales: {getLocales().join(', ')}</p>
            </div>
            
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Simple Translations</h3>
                <ul className="space-y-1">
                    {simpleExamples.map((example, index) => (
                        <li key={index} className="border-b border-gray-100 pb-1">
                            <span className="text-gray-600 mr-2">{example}:</span>
                            <span className="font-medium">{t(example)}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Translations with Replacements</h3>
                <ul className="space-y-1">
                    {replacementExamples.map((example, index) => (
                        <li key={index} className="border-b border-gray-100 pb-1">
                            <span className="text-gray-600 mr-2">{example.key}:</span>
                            <span className="font-medium">{t(example.key, example.replacements)}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div>
                <h3 className="text-lg font-semibold mb-2">Plural Translations</h3>
                <ul className="space-y-1">
                    {pluralExamples.map((example, index) => (
                        <li key={index} className="border-b border-gray-100 pb-1">
                            <span className="text-gray-600 mr-2">{`${example.key} (count: ${example.count}):`}</span>
                            <span className="font-medium">{tChoice(example.key, example.count)}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TranslationDemo; 