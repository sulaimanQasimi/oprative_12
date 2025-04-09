import '../css/app.css';
import '../css/navbar3d.css';
// import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { LaravelReactI18nProvider } from 'laravel-react-i18n';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Disable browser back/forward navigation
if (typeof window !== 'undefined') {
    // Push initial state and set up prevention
    window.history.pushState(null, document.title, window.location.href);

    // Replace the popstate event handler
    window.addEventListener('popstate', function(event) {
        // Push state again to prevent navigation
        window.history.pushState(null, document.title, window.location.href);
        // Prevent default behavior
        event.preventDefault();
        return false;
    });

    // Disable back button in a different way for browsers that support it
    window.addEventListener('load', function() {
        // Push another state to ensure back button is caught
        window.history.pushState(null, document.title, window.location.href);
    });
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        if (import.meta.env.SSR) {
            hydrateRoot(
                el,
                <LaravelReactI18nProvider
                    locale={'fa'}
                    fallbackLocale={'fa'}
                    files={import.meta.glob('/lang/*.json', { eager: true })}
                >
                    <App {...props} />
                </LaravelReactI18nProvider>
            );
            return;
        }

        createRoot(el).render(
            <LaravelReactI18nProvider
                locale={'fa'}
                fallbackLocale={'fa'}
                files={import.meta.glob('/lang/*.json')}
            >
                <App {...props} />
            </LaravelReactI18nProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
