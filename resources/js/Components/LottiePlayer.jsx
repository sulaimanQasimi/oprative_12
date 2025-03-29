import React, { useState, useEffect } from 'react';
import '@lottiefiles/lottie-player';

/**
 * A React wrapper for the lottie-player web component with offline support
 * 
 * @param {Object} props - Component props
 * @param {string} props.src - Path to the animation JSON file (local or remote)
 * @param {string} props.background - Background color (default: "transparent")
 * @param {string} props.speed - Animation speed (default: "1")
 * @param {Object} props.style - CSS styles object
 * @param {string} props.className - CSS class names
 * @param {boolean} props.loop - Whether to loop the animation (default: true)
 * @param {boolean} props.autoplay - Whether to autoplay the animation (default: true)
 * @param {boolean} props.controls - Whether to show controls (default: false)
 * @param {string} props.fallbackSrc - Path to a fallback animation if the main one fails
 * @returns {React.ReactElement} Lottie animation player component
 */
const LottiePlayer = ({ 
    src, 
    background = "transparent", 
    speed = "1", 
    style,
    className = "",
    loop = true, 
    autoplay = true,
    controls = false,
    fallbackSrc = "/animations/sales-animation.json"
}) => {
    const [localSrc, setLocalSrc] = useState(src);
    const [hasError, setHasError] = useState(false);
    
    useEffect(() => {
        // Ensure the web component is properly defined
        if (typeof document !== 'undefined') {
            import('@lottiefiles/lottie-player');
            
            // Fallback to local animation if remote URL fails
            if (src.startsWith('http')) {
                const checkRemoteFile = async () => {
                    try {
                        const response = await fetch(src, { method: 'HEAD' });
                        if (!response.ok) {
                            console.warn(`Remote animation could not be loaded: ${src}, using fallback`);
                            setLocalSrc(fallbackSrc);
                            setHasError(true);
                        }
                    } catch (err) {
                        console.warn(`Error loading remote animation: ${err.message}, using fallback`);
                        setLocalSrc(fallbackSrc);
                        setHasError(true);
                    }
                };
                
                checkRemoteFile();
            }
        }
    }, [src, fallbackSrc]);
    
    return React.createElement('lottie-player', {
        src: localSrc,
        background,
        speed,
        style,
        className,
        loop: loop ? '' : null,
        autoplay: autoplay ? '' : null,
        controls: controls ? '' : null,
    });
};

export default LottiePlayer; 