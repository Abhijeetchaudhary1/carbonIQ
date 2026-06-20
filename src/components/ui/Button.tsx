// ============================================================================
// Carbon Compass — Button Component
// ============================================================================

'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  href?: string;
}

const variants = {
  primary:
    'bg-green-primary text-bg-primary font-semibold hover:brightness-110 shadow-[0_0_20px_rgba(52,211,153,0.2)]',
  secondary:
    'bg-bg-card border border-border text-text-primary hover:bg-bg-card-hover hover:border-border-hover',
  ghost:
    'bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5',
  outline:
    'bg-transparent border border-border text-text-primary hover:border-green-primary/50 hover:text-green-primary',
};

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-sm rounded-xl',
  lg: 'px-8 py-4 text-base rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  href,
  className = '',
  ...props
}: ButtonProps) {
  const classes = `${variants[variant]} ${sizes[size]} inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`;

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={classes}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
