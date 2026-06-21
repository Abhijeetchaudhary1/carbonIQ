// ============================================================================
// Carbon Compass — 3D Earth Visualization (Photorealistic + Interactive)
// ============================================================================

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TreePine, Train, Droplets, Recycle, Zap } from 'lucide-react';
import Image from 'next/image';

const orbitingCards = [
  { icon: TreePine, label: 'Plant Trees', sub: '+120 pts', color: '#34D399', position: { top: '5%', left: '-5%' } },
  { icon: Train, label: 'Use Public Transport', sub: '+80 pts', color: '#38BDF8', position: { top: '8%', right: '-8%' } },
  { icon: Zap, label: 'Save Energy', sub: '+70 pts', color: '#FBBF24', position: { bottom: '25%', left: '-12%' } },
  { icon: Recycle, label: 'Reduce Plastic', sub: '+60 pts', color: '#FB923C', position: { bottom: '12%', right: '-8%' } },
  { icon: Droplets, label: 'Save Water', sub: '+90 pts', color: '#A78BFA', position: { bottom: '42%', right: '-15%' } },
];

// Floating leaf component
function FloatingLeaf({ delay, style }: { delay: number; style: React.CSSProperties }) {
  return (
    <motion.div
      className="absolute w-3 h-3 pointer-events-none"
      style={style}
      initial={{ opacity: 0, y: 0, rotate: 0 }}
      animate={{
        opacity: [0, 0.7, 0.7, 0],
        y: [-20, -60, -100, -140],
        x: [0, 15, -10, 20],
        rotate: [0, 45, -30, 60],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path
          d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 13.5C2 15.5 3.75 17.25 3.75 17.25C7 8 17 8 17 8Z"
          fill="#34D399"
          opacity="0.6"
        />
      </svg>
    </motion.div>
  );
}

export default function EarthVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number>(0);
  const autoAngle = useRef(0);
  const [autoRotation, setAutoRotation] = useState(0);

  // Continuous auto-rotation + floating
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (!isDragging) {
        // Apply inertia decay
        velocity.current.x *= 0.96;
        velocity.current.y *= 0.96;

        // Apply velocity to rotation
        if (Math.abs(velocity.current.x) > 0.1 || Math.abs(velocity.current.y) > 0.1) {
          setRotation(prev => ({
            x: prev.x + velocity.current.x * delta,
            y: prev.y + velocity.current.y * delta,
          }));
        }

        // Auto-rotate slowly
        autoAngle.current += delta * 12; // degrees per second
        setAutoRotation(autoAngle.current);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isDragging]);

  // Drag handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
    velocity.current = { x: 0, y: 0 };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };

    // Store velocity for inertia
    velocity.current = { x: -dy * 3, y: dx * 3 };

    setRotation(prev => ({
      x: Math.max(-40, Math.min(40, prev.x - dy * 0.4)),
      y: prev.y + dx * 0.4,
    }));
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Total Y rotation combines manual drag + auto-rotate
  const totalRotateY = rotation.y + (isDragging ? 0 : autoRotation);
  const totalRotateX = rotation.x;

  // Floating bob offset
  const bobY = Math.sin(autoRotation * 0.05) * 6;
  const bobX = Math.cos(autoRotation * 0.03) * 3;

  return (
    <div
      ref={containerRef}
      className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] md:w-[440px] md:h-[440px] lg:w-[500px] lg:h-[500px] select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); }}
    >
      {/* Deep atmospheric glow - outer */}
      <div className="absolute inset-[-30%] rounded-full opacity-40 animate-breathe"
        style={{
          background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, rgba(52,211,153,0.08) 30%, transparent 70%)',
        }}
      />

      {/* Inner atmospheric glow */}
      <div className="absolute inset-[-15%] rounded-full opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(16,185,129,0.08) 40%, transparent 65%)',
        }}
      />

      {/* Subtle rotating light rays */}
      <div className="absolute inset-[-10%] rounded-full opacity-20"
        style={{
          background: 'conic-gradient(from 200deg, transparent 0%, rgba(56,189,248,0.1) 10%, transparent 20%, rgba(52,211,153,0.08) 30%, transparent 40%, transparent 100%)',
          transform: `rotate(${autoRotation * 0.2}deg)`,
        }}
      />

      {/* Earth Globe Container - handles floating bob */}
      <div
        className="absolute inset-[8%]"
        style={{
          transform: `translate(${bobX}px, ${bobY}px)`,
          transition: isDragging ? 'none' : 'transform 0.1s linear',
        }}
      >
        {/* Earth Globe - handles rotation */}
        <div
          className="w-full h-full rounded-full overflow-hidden cursor-grab active:cursor-grabbing"
          style={{
            transform: `perspective(800px) rotateX(${totalRotateX}deg) rotateY(${totalRotateY}deg) scale(${isHovered ? 1.04 : 1})`,
            transition: isDragging ? 'none' : 'transform 0.05s linear, scale 0.3s ease',
            boxShadow: `
              0 0 80px rgba(56, 189, 248, 0.15),
              0 0 160px rgba(52, 211, 153, 0.08),
              inset -30px -20px 60px rgba(0, 0, 0, 0.5),
              inset 10px 10px 40px rgba(255, 255, 255, 0.05)
            `,
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Earth texture image */}
          <Image
            src="/earth.png"
            alt="Earth"
            fill
            className="object-cover pointer-events-none"
            priority
            draggable={false}
            sizes="(max-width: 640px) 320px, (max-width: 768px) 380px, (max-width: 1024px) 440px, 500px"
          />

          {/* Atmospheric rim light overlay */}
          <div className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: `
                radial-gradient(circle at 25% 25%, rgba(255,255,255,0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(56,189,248,0.15) 0%, transparent 40%),
                radial-gradient(circle at 15% 85%, rgba(52,211,153,0.1) 0%, transparent 35%)
              `,
            }}
          />

          {/* Specular highlight */}
          <div className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.12) 0%, transparent 35%)',
            }}
          />

          {/* Edge shadow for depth */}
          <div className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              boxShadow: 'inset 0 0 60px 20px rgba(0,0,0,0.3)',
            }}
          />
        </div>
      </div>

      {/* Orbiting Action Cards */}
      {orbitingCards.map((card, i) => (
        <motion.div
          key={card.label}
          className="absolute z-20"
          style={card.position as React.CSSProperties}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + i * 0.15, duration: 0.5, ease: 'easeOut' }}
        >
          <motion.div
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl border whitespace-nowrap"
            style={{
              background: 'rgba(10, 10, 10, 0.7)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 20px ${card.color}10`,
            }}
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
            whileHover={{ scale: 1.05, borderColor: `${card.color}40` }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${card.color}20` }}
            >
              <card.icon className="w-3.5 h-3.5" style={{ color: card.color }} />
            </div>
            <div>
              <p className="text-xs font-medium text-white/90 leading-tight">{card.label}</p>
              <p className="text-[10px] font-medium leading-tight" style={{ color: card.color }}>
                {card.sub}
              </p>
            </div>
          </motion.div>

          {/* Connecting dot */}
          <svg
            className="absolute pointer-events-none"
            style={{
              width: '10px',
              height: '10px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              overflow: 'visible',
            }}
          >
            <circle cx="0" cy="0" r="2.5" fill={card.color} opacity="0.6">
              <animate
                attributeName="opacity"
                values="0.3;0.8;0.3"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </motion.div>
      ))}

      {/* Floating leaves */}
      <FloatingLeaf delay={0} style={{ top: '20%', right: '5%' }} />
      <FloatingLeaf delay={2.5} style={{ top: '60%', right: '0%' }} />
      <FloatingLeaf delay={5} style={{ top: '40%', left: '2%' }} />
    </div>
  );
}
