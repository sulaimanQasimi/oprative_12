import React from "react";
import { motion } from "framer-motion";
import { Settings, Cog } from "lucide-react";

const PageLoader = ({ isVisible, icon: Icon = Settings, color = "indigo" }) => {
    const colorConfig = {
        indigo: {
            primary: "indigo-600",
            secondary: "indigo-500",
            tertiary: "indigo-400",
            light: "indigo-300",
            background: "indigo-500/5"
        },
        green: {
            primary: "green-600",
            secondary: "green-500",
            tertiary: "green-400",
            light: "green-300",
            background: "green-500/5"
        },
        blue: {
            primary: "blue-600",
            secondary: "blue-500",
            tertiary: "blue-400",
            light: "blue-300",
            background: "blue-500/5"
        },
        purple: {
            primary: "purple-600",
            secondary: "purple-500",
            tertiary: "purple-400",
            light: "purple-300",
            background: "purple-500/5"
        }
    };

    const currentColor = colorConfig[color] || colorConfig.indigo;

    return (
        <motion.div
            className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50 flex flex-col items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? "all" : "none",
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            {/* Background patterns */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>

            {/* Animated light beams */}
            <div className="absolute w-full h-full overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={`absolute bg-gradient-to-r from-${currentColor.tertiary}/10 via-${currentColor.secondary}/10 to-transparent h-[30vh] w-[100vw]`}
                        style={{
                            top: `${10 + i * 20}%`,
                            left: "-100%",
                            transformOrigin: "left center",
                            rotate: `${-20 + i * 10}deg`,
                        }}
                        animate={{
                            left: ["100%", "-100%"],
                        }}
                        transition={{
                            duration: 15 + i * 2,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 3,
                        }}
                    />
                ))}
            </div>

            {/* Animated particles */}
            <div className="absolute inset-0">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                            width: Math.random() * 4 + 1,
                            height: Math.random() * 4 + 1,
                            x: `${Math.random() * 100}%`,
                            y: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.5 + 0.2,
                        }}
                        animate={{
                            y: [null, `${-Math.random() * 100 - 50}%`],
                            opacity: [null, 0],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 5,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Main animated container */}
                <motion.div
                    className="relative"
                    animate={{
                        scale: [0.95, 1.05, 0.95],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    {/* Pulsing background circles */}
                    <motion.div
                        className={`absolute w-64 h-64 rounded-full bg-${currentColor.primary}/5 filter blur-2xl`}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className={`absolute w-72 h-72 rounded-full bg-${currentColor.secondary}/5 filter blur-2xl transform -translate-x-4 translate-y-4`}
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                        }}
                    />

                    {/* Animated logo/icon container */}
                    <div className="relative flex items-center justify-center h-40 w-40">
                        {/* Spinning rings */}
                        <motion.div
                            className={`absolute h-full w-full rounded-full border-4 border-${currentColor.light}/10`}
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 20,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                        />
                        <motion.div
                            className={`absolute h-[85%] w-[85%] rounded-full border-4 border-${currentColor.tertiary}/20`}
                            animate={{
                                rotate: -360,
                            }}
                            transition={{
                                duration: 15,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                        />
                        <motion.div
                            className={`absolute h-[70%] w-[70%] rounded-full border-4 border-${currentColor.secondary}/30`}
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 10,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                        />

                        {/* Spinner arcs */}
                        <motion.div
                            className={`absolute h-full w-full rounded-full border-4 border-r-${currentColor.tertiary} border-t-transparent border-l-transparent border-b-transparent`}
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 1.5,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                        />
                        <motion.div
                            className={`absolute h-full w-full rounded-full border-4 border-b-${currentColor.secondary} border-t-transparent border-l-transparent border-r-transparent`}
                            animate={{ rotate: -180 }}
                            transition={{
                                duration: 2,
                                ease: "easeInOut",
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                        />

                        {/* Icon/logo in center */}
                        <motion.div
                            className={`relative z-10 bg-gradient-to-br from-${currentColor.secondary} to-${currentColor.primary} h-20 w-20 rounded-2xl flex items-center justify-center shadow-xl`}
                            animate={{
                                rotate: [0, 10, 0, -10, 0],
                                scale: [1, 1.1, 1, 1.1, 1],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <Icon className="h-10 w-10 text-white drop-shadow-lg" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default PageLoader;
