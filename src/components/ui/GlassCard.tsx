// ============================================================================
// Carbon Compass — Glass Card Component
// ============================================================================

'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import React from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  variant?: 'default' | 'strong' | 'glow';
  glowColor?: 'green' | 'ocean' | 'amber' | 'violet';
  className?: string;
  hover?: boolean;
}

const glowColorMap = {
  green: 'rgba(52, 211, 153, 0.15)',
  ocean: 'rgba(56, 189, 248, 0.15)',
  amber: 'rgba(251, 191, 36, 0.15)',
  violet: 'rgba(167, 139, 250, 0.15)',
};

export default function GlassCard({
  children,
  variant = 'default',
  glowColor,
  className = '',
  hover = true,
  ...motionProps
}: GlassCardProps) {
  const baseClass = variant === 'strong' ? 'glass-strong' : 'glass-card';
  const glowStyle = glowColor
    ? { boxShadow: `0 0 30px ${glowColorMap[glowColor]}, 0 0 80px ${glowColorMap[glowColor].replace('0.15', '0.05')}` }
    : {};

  return (
    <motion.div
      className={`${baseClass} p-6 ${className}`}
      style={glowStyle}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
