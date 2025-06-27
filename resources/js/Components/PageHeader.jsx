import { motion } from "framer-motion";
import { EditIcon, Sparkles, User } from "lucide-react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import BackButton from "@/Components/BackButton";
import { Link } from "@inertiajs/react";

export default function PageHeader({ 
    title, 
    subtitle, 
    category,
    icon: IconComponent = EditIcon, 
    backButtonLink, 
    actions,
    className = "" 
}) {
    const { t } = useLaravelReactI18n();

    return (
        <>
            <style>{`
                .float-animation {
                    animation: float 6s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }

                .glass-effect {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .dark .glass-effect {
                    background: rgba(0, 0, 0, 0.2);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
            `}</style>
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className={`glass-effect border-b border-white/20 dark:border-slate-700/50 py-6 px-8 sticky top-0 z-30 ${className}`}
            >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                        className="relative float-animation"
                    >
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-2xl blur-lg opacity-60"></div>
                        <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 p-4 rounded-2xl shadow-2xl">
                            <IconComponent className="w-8 h-8 text-white" />
                            <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                        </div>
                    </motion.div>
                    <div>
                        {category && (
                            <motion.p
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.4 }}
                                className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-2"
                            >
                                <Sparkles className="w-4 h-4" />
                                {category}
                            </motion.p>
                        )}
                        <motion.h1
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                            className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent"
                        >
                            {title}
                        </motion.h1>
                        {subtitle && (
                            <motion.p
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.4 }}
                                className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                            >
                                <User className="w-4 h-4" />
                                {subtitle}
                            </motion.p>
                        )}
                    </div>
                </div>

                {(backButtonLink || actions) && (
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.4 }}
                        className="flex items-center space-x-3"
                    >
                        {actions || <BackButton link={backButtonLink} />}
                    </motion.div>
                )}
            </div>
        </motion.header>
        </>
    );
}