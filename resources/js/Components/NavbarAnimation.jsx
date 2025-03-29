import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function NavbarAnimation({ height = 80 }) {
    const containerRef = useRef(null);
    const [isThreeSupported, setIsThreeSupported] = useState(true);
    
    useEffect(() => {
        // Check if Three.js is supported
        try {
            if (!window.WebGLRenderingContext) {
                console.warn("WebGL not supported. Using fallback.");
                setIsThreeSupported(false);
                return;
            }
            
            // Try to create a context
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) {
                console.warn("WebGL not supported. Using fallback.");
                setIsThreeSupported(false);
                return;
            }
        } catch (e) {
            console.warn("WebGL error:", e);
            setIsThreeSupported(false);
            return;
        }
        
        if (!containerRef.current) return;
        
        // Create scene
        const scene = new THREE.Scene();
        
        // Create camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / height, 0.1, 1000);
        camera.position.z = 5;
        
        // Create renderer
        const renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        renderer.setSize(window.innerWidth, height);
        renderer.setClearColor(0x000000, 0);
        containerRef.current.appendChild(renderer.domElement);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Create particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 500;
        const posArray = new Float32Array(particlesCount * 3);
        
        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
        });
        
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);
        
        // Create gradient background
        const gradientGeometry = new THREE.PlaneGeometry(20, 4);
        const gradientMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color1: { value: new THREE.Color(0x1a2980) },
                color2: { value: new THREE.Color(0x26d0ce) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color1;
                uniform vec3 color2;
                varying vec2 vUv;
                void main() {
                    gl_FragColor = vec4(mix(color1, color2, vUv.x), 0.7);
                }
            `,
            transparent: true,
        });
        
        const gradientMesh = new THREE.Mesh(gradientGeometry, gradientMaterial);
        gradientMesh.position.z = -2;
        scene.add(gradientMesh);
        
        // Add mouse movement effect
        let mouseX = 0;
        let mouseY = 0;
        
        const onDocumentMouseMove = (event) => {
            mouseX = (event.clientX - window.innerWidth / 2) / 100;
            mouseY = (event.clientY - window.innerHeight / 2) / 100;
        };
        
        document.addEventListener('mousemove', onDocumentMouseMove);
        
        // Animation loop
        const animate = () => {
            particlesMesh.rotation.x += 0.0005;
            particlesMesh.rotation.y += 0.0005;
            
            // Add subtle movement based on mouse position
            particlesMesh.rotation.y += mouseX * 0.0001;
            particlesMesh.rotation.x += mouseY * 0.0001;
            
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        
        animate();
        
        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / height;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, height);
        };
        
        window.addEventListener('resize', handleResize);
        
        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousemove', onDocumentMouseMove);
            
            if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
                containerRef.current.removeChild(renderer.domElement);
            }
            
            // Dispose resources
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            gradientGeometry.dispose();
            gradientMaterial.dispose();
            renderer.dispose();
        };
    }, [height]);
    
    if (!isThreeSupported) {
        return <div className="navbar-3d-fallback" style={{ height: `${height}px` }} />;
    }
    
    return (
        <div 
            ref={containerRef} 
            className="navbar-3d-container" 
            style={{ height: `${height}px` }}
        />
    );
} 