import React, { useEffect, useRef, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import anime from 'animejs';
import '@lottiefiles/lottie-player';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const scannerRef = useRef(null);
    const containerRef = useRef(null);
    const faceScanRef = useRef(null);
    const [authorized, setAuthorized] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create authorization animation
        setAuthorized(true);

        // Animate the form submission with anime.js
        anime({
            targets: '#login-container',
            translateY: [0, 5, 0],
            duration: 300,
            easing: 'easeInOutQuad',
        });

        // Simulate scanning complete
        const scanComplete = anime.timeline({
            easing: 'easeOutExpo',
        });

        scanComplete
            .add({
                targets: '.face-outline path',
                strokeDashoffset: [anime.setDashoffset, 0],
                easing: 'easeInOutQuad',
                duration: 1000,
                delay: function(el, i) { return i * 250 },
            })
            .add({
                targets: '.scan-status',
                innerHTML: ['SCANNING...', 'IDENTITY CONFIRMED'],
                duration: 800,
                color: ['#22c55e', '#10b981'],
                easing: 'easeInOutQuad',
            })
            .add({
                targets: '.auth-button',
                backgroundColor: '#10b981',
                duration: 400,
            }, '-=400');

        // Add slight delay before actual submission
        setTimeout(() => {
            post(route('warehouse.login'));
        }, 1500);
    };

    useEffect(() => {
        // Scanner animation effect
        const scannerEffect = () => {
            if (!scannerRef.current) return;

            anime({
                targets: scannerRef.current,
                top: ['0%', '100%'],
                opacity: [1, 0],
                easing: 'easeInOutQuad',
                duration: 2000,
                complete: function() {
                    if (scannerRef.current) {
                        scannerRef.current.style.top = '0%';
                    }
                }
            });
        };

        // Grid animation
        const animateGrid = () => {
            if (!faceScanRef.current) return;

            anime({
                targets: '.face-grid',
                opacity: [0, 0.6],
                easing: 'easeInOutQuad',
                duration: 1000,
                delay: 500
            });

            // Animate grid lines appearing one by one
            anime({
                targets: '.grid-cell',
                opacity: [0, 1],
                easing: 'easeInOutQuad',
                duration: 50,
                delay: anime.stagger(10),
            });
        };

        // Background matrix effect
        const createMatrixEffect = () => {
            const canvas = document.getElementById('matrix-canvas');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const characters = "01";
            const fontSize = 14;
            const columns = canvas.width / fontSize;

            const drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
            }

            function drawMatrix() {
                ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#22c55e20"; // Light green with transparency
                ctx.font = `${fontSize}px monospace`;

                for (let i = 0; i < drops.length; i++) {
                    const text = characters[Math.floor(Math.random() * characters.length)];
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }

                    drops[i]++;
                }
            }

            const matrixInterval = setInterval(drawMatrix, 100);
            return () => clearInterval(matrixInterval);
        };

        // Animate text typing in terminal style
        const typeText = () => {
            anime({
                targets: '.typing-text',
                innerHTML: [
                    '',
                    'ACCESSING SECURE WAREHOUSE TERMINAL...',
                    'WAREHOUSE MANAGEMENT SYSTEM • SECURE ACCESS TERMINAL'
                ],
                easing: 'steps(50)',
                duration: 2000,
                delay: 500
            });
        };

        // Container animation
        if (containerRef.current) {
            anime({
                targets: containerRef.current,
                translateY: [50, 0],
                opacity: [0, 1],
                easing: 'easeOutExpo',
                duration: 1000
            });
        }

        // Pulse animation for the face outline
        const pulseFace = () => {
            anime({
                targets: '.face-outline',
                scale: [1, 1.02, 1],
                opacity: [1, 0.8, 1],
                easing: 'easeInOutSine',
                duration: 2000,
                loop: true
            });
        };

        // Start animations
        scannerEffect();
        animateGrid();
        typeText();
        pulseFace();
        const cleanupMatrix = createMatrixEffect();

        // Set interval for scanner
        const scanInterval = setInterval(scannerEffect, 4000);

        // Clean up
        return () => {
            clearInterval(scanInterval);
            if (cleanupMatrix) cleanupMatrix();
        };
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            <Head title="Warehouse Login" />

            {/* Matrix background effect */}
            <canvas id="matrix-canvas" className="absolute inset-0 z-0"></canvas>

            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-radial from-green-900/20 via-black to-black z-0"></div>

            {/* Grid lines */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 z-0"></div>

            {/* Login container */}
            <div
                id="login-container"
                ref={containerRef}
                className="relative w-full max-w-5xl mx-6 z-10"
                style={{ opacity: 0 }}
            >
                {/* Tech frame */}
                <div className="border-2 border-green-500/50 bg-black/80 p-px rounded-lg relative">
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-green-400"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-green-400"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-green-400"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-green-400"></div>

                    {/* Header */}
                    <div className="tech-header bg-gradient-to-r from-green-600 to-transparent p-2 flex items-center pl-8 relative">
                        <h1 className="text-xl md:text-3xl font-bold text-black m-0 tracking-widest">LOG IN</h1>
                        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-transparent to-green-600 skew-x-[-30deg] origin-top-right transform translate-x-6"></div>
                    </div>

                    <div className="p-4 md:p-8 flex flex-col md:flex-row">
                        {/* Left panel - Face recognition mockup */}
                        <div className="w-full md:w-1/3 flex flex-col items-center justify-center mb-8 md:mb-0 relative">
                            <div className="w-48 h-48 border-2 border-green-500/50 flex items-center justify-center relative bg-black/50">
                                {/* Animated face scan graphics */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-32 h-32 border-2 border-green-500/20 rounded-full animate-pulse"></div>
                                    <div className="w-40 h-40 border border-green-500/10 rounded-full absolute animate-ping" style={{animationDuration: '3s'}}></div>
                                </div>

                                <div ref={faceScanRef} className="face-outline w-32 h-40 border-2 border-green-500/70 relative z-20">
                                    <svg className="absolute inset-0 w-full h-full text-green-500/70" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                                        <path fill="none" stroke="currentColor" strokeWidth="1" d="M 50,10 C 30,10 20,30 20,50 C 20,70 25,90 50,110 C 75,90 80,70 80,50 C 80,30 70,10 50,10 Z" />
                                        <path fill="none" stroke="currentColor" strokeWidth="0.5" d="M 30,40 L 45,50 L 55,50 L 70,40" />
                                        <path fill="none" stroke="currentColor" strokeWidth="0.5" d="M 30,60 C 40,70 60,70 70,60" />
                                        <path fill="none" stroke="currentColor" strokeWidth="0.5" d="M 40,30 L 40,40 L 30,40" />
                                        <path fill="none" stroke="currentColor" strokeWidth="0.5" d="M 60,30 L 60,40 L 70,40" />
                                        <path fill="none" stroke="currentColor" strokeWidth="0.5" d="M 50,50 L 50,70" />
                                    </svg>

                                    {/* Face grid overlay */}
                                    <div className="face-grid absolute inset-0 opacity-0 transition-opacity duration-1000">
                                        <div className="grid grid-cols-6 grid-rows-8 gap-px h-full w-full">
                                            {[...Array(48)].map((_, i) => (
                                                <div key={i} className="grid-cell border border-green-400/30 opacity-0"></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Scanner line */}
                                <div
                                    ref={scannerRef}
                                    className="scan-line absolute left-0 w-full h-0.5 bg-green-400 blur-sm transition-all duration-1500 opacity-0"
                                    style={{ boxShadow: '0 0 10px 2px #22c55e' }}
                                ></div>

                                {/* Corner accents */}
                                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-400"></div>
                                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-green-400"></div>
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-green-400"></div>
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-400"></div>
                            </div>

                            <div className="mt-4 text-center">
                                <div className="scan-status text-green-500 text-xs mb-1">SCANNING...</div>
                                <div className="text-green-500/50 text-[10px]">WAREHOUSE ACCESS CLEARANCE</div>
                            </div>

                            {/* Lottie Animation for scanning process */}
                            <div className="mt-4">
                                <lottie-player
                                    src="https://assets7.lottiefiles.com/packages/lf20_q8ND1K.json"
                                    background="transparent"
                                    speed="1"
                                    style={{ width: '100px', height: '40px' }}
                                    loop
                                    autoplay
                                ></lottie-player>
                            </div>
                        </div>

                        {/* Right panel - Login form */}
                        <div className="w-full md:w-2/3 flex flex-col justify-center md:pl-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <div className="tech-input-header bg-gradient-to-r from-green-600 to-transparent p-1 flex justify-between items-center">
                                        <span className="text-black font-bold tracking-wider text-sm">USERNAME</span>
                                        <div className="w-12 h-full bg-gradient-to-l from-transparent to-green-600 skew-x-[-30deg] transform translate-x-4"></div>
                                    </div>
                                    <div className="relative mt-1 group">
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full bg-black/50 border-2 border-green-500/30 text-green-500 px-4 py-3 focus:outline-none focus:border-green-400 placeholder-green-700 transition-all duration-300 group-hover:border-green-400/50"
                                            placeholder="Enter username"
                                            required
                                        />
                                        <div className="absolute top-0 right-0 h-full w-3 bg-green-500/20 flex flex-col justify-between py-1">
                                            <div className="w-full h-1 bg-green-500/50"></div>
                                            <div className="w-full h-1 bg-green-500/30"></div>
                                            <div className="w-full h-1 bg-green-500/50"></div>
                                        </div>
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <div className="tech-input-header bg-gradient-to-r from-green-600 to-transparent p-1 flex justify-between items-center">
                                        <span className="text-black font-bold tracking-wider text-sm">PASSWORD</span>
                                        <div className="w-12 h-full bg-gradient-to-l from-transparent to-green-600 skew-x-[-30deg] transform translate-x-4"></div>
                                    </div>
                                    <div className="relative mt-1 group">
                                        <input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full bg-black/50 border-2 border-green-500/30 text-green-500 px-4 py-3 focus:outline-none focus:border-green-400 transition-all duration-300 group-hover:border-green-400/50"
                                            placeholder="••••••••••••••"
                                            required
                                        />
                                        <div className="absolute top-0 right-0 h-full w-3 bg-green-500/20 flex flex-col justify-between py-1">
                                            <div className="w-full h-1 bg-green-500/50"></div>
                                            <div className="w-full h-1 bg-green-500/30"></div>
                                            <div className="w-full h-1 bg-green-500/50"></div>
                                        </div>
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center cursor-pointer group">
                                        <div className="relative mr-3 w-4 h-4 border border-green-500 flex items-center justify-center transition-all duration-300 group-hover:border-green-400">
                                            {data.remember && (
                                                <div className="absolute inset-0.5 bg-green-500"></div>
                                            )}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                        />
                                        <span className="text-green-500 text-xs tracking-wider">REMAIN CONNECTED</span>
                                    </label>

                                    <button
                                        type="submit"
                                        disabled={processing || authorized}
                                        className="auth-button tech-button relative bg-green-600 text-black px-10 py-2 font-bold tracking-widest text-sm hover:bg-green-500 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                                    >
                                        {/* Button accents */}
                                        <div className="absolute inset-y-0 left-0 w-1 bg-green-700"></div>
                                        <div className="absolute inset-y-0 right-0 w-1 bg-green-700"></div>
                                        <div className="absolute inset-x-0 top-0 h-0.5 bg-green-300"></div>
                                        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-green-300"></div>
                                        <div className="relative flex items-center">
                                            {processing ? (
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : null}
                                            {processing ? 'AUTHORIZING' : 'AUTHORIZE'}
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-4 text-green-500/60 text-[10px] tracking-widest typing-text">
                    ACCESSING SECURE WAREHOUSE TERMINAL...
                </div>
            </div>

            {/* Custom CSS */}
            <style jsx>{`
                .bg-gradient-radial {
                    background-image: radial-gradient(var(--tw-gradient-stops));
                }

                .bg-grid-pattern {
                    background-image:
                        linear-gradient(to right, rgba(46, 204, 113, 0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(46, 204, 113, 0.1) 1px, transparent 1px);
                    background-size: 20px 20px;
                }

                .grid-appear {
                    opacity: 0.6;
                }

                .tech-button:hover::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.1);
                }

                @keyframes typing {
                    from { width: 0 }
                    to { width: 100% }
                }
            `}</style>
        </div>
    );
}
