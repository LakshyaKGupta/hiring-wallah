'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

interface MagneticElement {
  element: HTMLElement;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function CursorEffect() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const magneticElementsRef = useRef<MagneticElement[]>([]);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [magnetPos, setMagnetPos] = useState({ x: 0, y: 0 });
  const particleIdRef = useRef(0);

  // Initialize canvas for particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track mouse movement for cursor + particles + spotlight
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setCursorPos({ x: e.clientX, y: e.clientY });

      // Create trailing particles
      if (Math.random() > 0.7) {
        particlesRef.current.push({
          id: particleIdRef.current++,
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4 - 2,
          life: 1,
          maxLife: 1,
        });
      }

      // Update magnetic attraction
      const elements = magneticElementsRef.current;
      let closestIdx = -1;
      let closestDist = 150;

      for (let i = 0; i < elements.length; i++) {
        const elem = elements[i];
        const elemCenterX = elem.x + elem.width / 2;
        const elemCenterY = elem.y + elem.height / 2;
        const dist = Math.hypot(e.clientX - elemCenterX, e.clientY - elemCenterY);

        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      }

      if (closestIdx !== -1) {
        const elem = elements[closestIdx];
        const elemCenterX = elem.x + elem.width / 2;
        const elemCenterY = elem.y + elem.height / 2;
        setMagnetPos({ x: elemCenterX, y: elemCenterY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Register interactive elements for magnetic effect
  useEffect(() => {
    const updateMagneticElements = () => {
      const elements = document.querySelectorAll(
        'button, a, [role="button"], input, textarea, select, .interactive'
      );

      magneticElementsRef.current = Array.from(elements)
        .filter((el) => {
          const style = window.getComputedStyle(el);
          return style.pointerEvents !== 'none';
        })
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            element: el as HTMLElement,
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY,
            width: rect.width,
            height: rect.height,
          };
        });
    };

    updateMagneticElements();
    window.addEventListener('resize', updateMagneticElements);
    const timer = setTimeout(updateMagneticElements, 500);

    return () => {
      window.removeEventListener('resize', updateMagneticElements);
      clearTimeout(timer);
    };
  }, []);

  // Particle animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.life -= 0.02;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.1;

        if (particle.life <= 0) return false;

        const alpha = particle.life * 0.6;
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          6
        );
        gradient.addColorStop(0, `rgba(0, 103, 255, ${alpha})`);
        gradient.addColorStop(1, `rgba(0, 103, 255, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(particle.x - 6, particle.y - 6, 12, 12);

        return true;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Render spotlight effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.style.boxShadow = `radial-gradient(circle 300px at ${cursorPos.x}px ${cursorPos.y}px, rgba(0, 103, 255, 0.1) 0%, transparent 70%)`;
  }, [cursorPos]);

  return (
    <>
      <svg className="hidden">
        <defs>
          <filter id="cursor-spotlight">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
          <radialGradient id="spotlight-glow">
            <stop offset="0%" stopColor="rgba(0, 103, 255, 0.3)" />
            <stop offset="100%" stopColor="rgba(0, 103, 255, 0)" />
          </radialGradient>
        </defs>
      </svg>

      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-40"
        style={{ top: 0, left: 0 }}
      />

      <div
        className="fixed inset-0 pointer-events-none z-30"
        style={{
          background: `radial-gradient(circle 300px at ${cursorPos.x}px ${cursorPos.y}px, rgba(0, 103, 255, 0.08) 0%, transparent 70%)`,
        }}
      />

      <motion.div
        ref={cursorRef}
        className="fixed w-8 h-8 pointer-events-none z-50"
        style={{
          left: cursorPos.x - 16,
          top: cursorPos.y - 16,
          mixBlendMode: 'screen',
        }}
        animate={{
          x: magnetPos.x ? magnetPos.x - cursorPos.x : 0,
          y: magnetPos.y ? magnetPos.y - cursorPos.y : 0,
          scale: magnetPos.x ? 1.2 : 1,
        }}
        transition={{
          type: 'spring',
          damping: 15,
          mass: 0.8,
          stiffness: 150,
        }}
      >
        <div className="relative w-full h-full">
          <div
            className="absolute inset-0 rounded-full border-2 border-blue-500"
            style={{
              boxShadow: '0 0 20px rgba(0, 103, 255, 0.6)',
              animation: 'pulse 2s infinite',
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-2 h-2 rounded-full bg-blue-400"
              style={{
                boxShadow: '0 0 12px rgba(0, 103, 255, 0.8)',
              }}
            />
          </div>

          {magnetPos.x && (
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: '1px solid rgba(0, 103, 255, 0.4)',
                animation: 'spin 3s linear infinite',
              }}
            />
          )}
        </div>
      </motion.div>

      <div
        className="fixed inset-0 pointer-events-none z-25"
        style={{
          background: `radial-gradient(circle 100px at ${cursorPos.x}px ${cursorPos.y}px, rgba(0, 103, 255, 0.15) 0%, transparent 100%)`,
          filter: 'blur(30px)',
        }}
      />

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(0, 103, 255, 0.6),
              0 0 40px rgba(0, 103, 255, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(0, 103, 255, 0.8),
              0 0 60px rgba(0, 103, 255, 0.4);
          }
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
    </>
  );
}
