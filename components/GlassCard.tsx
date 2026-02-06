'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  blurIntensity?: 'light' | 'medium' | 'high';
  borderIntensity?: 'light' | 'medium' | 'high';
  gradient?: boolean;
  animateOnMount?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = '',
  hoverEffect = true,
  blurIntensity = 'medium',
  borderIntensity = 'medium',
  gradient = false,
  animateOnMount = true,
  onClick
}: GlassCardProps) {
  // Blur intensity mapping
  const blurMap = {
    light: 'backdrop-blur-sm',
    medium: 'backdrop-blur-md',
    high: 'backdrop-blur-xl'
  };

  // Border opacity mapping
  const borderMap = {
    light: 'border-white/10',
    medium: 'border-white/20',
    high: 'border-white/30'
  };

  // Gradient backgrounds
  const gradientBackground = gradient 
    ? 'bg-gradient-to-br from-white/10 via-white/5 to-white/[0.02]' 
    : 'bg-white/[0.05]';

  const hoverClasses = hoverEffect 
    ? 'hover:bg-white/[0.08] hover:border-white/30 hover:transform hover:-translate-y-1 hover:shadow-2xl' 
    : '';

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    hover: hoverEffect 
      ? { 
          y: -8,
          transition: { duration: 0.2, ease: "easeInOut" }
        }
      : {}
  };

  const MotionDiv = animateOnMount ? motion.div : 'div';

  const baseClasses = `
    relative rounded-2xl p-6
    ${gradientBackground}
    ${blurMap[blurIntensity]}
    ${borderMap[borderIntensity]}
    border
    shadow-lg
    transition-all duration-300
    ${hoverClasses}
    ${className}
  `;

  // Inner glow effect
  const InnerGlow = () => (
    <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/0 via-purple-500/10 to-pink-500/0 opacity-20 blur-lg" />
    </div>
  );

  // Reflection effect
  const ReflectionEffect = () => (
    <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-white/10 to-transparent rounded-t-2xl opacity-20" />
  );

  const CardContent = (
    <>
      <InnerGlow />
      <ReflectionEffect />
      <div className="relative z-10">
        {children}
      </div>
      {/* Ambient light effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 rounded-2xl blur-xl opacity-30 -z-10" />
    </>
  );

  if (animateOnMount) {
    return (
      <MotionDiv
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={cardVariants}
        className={baseClasses}
        onClick={onClick}
      >
        {CardContent}
      </MotionDiv>
    );
  }

  return (
    <div className={baseClasses} onClick={onClick}>
      {CardContent}
    </div>
  );
}

// GlassCard variations
export function GlassCardWithIcon({
  icon,
  title,
  description,
  actionText,
  onAction,
  variant = 'primary'
}: {
  icon: ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}) {
  const variantClasses = {
    primary: 'from-blue-500/20 to-purple-500/20 text-blue-300',
    secondary: 'from-gray-500/20 to-gray-700/20 text-gray-300',
    success: 'from-green-500/20 to-emerald-500/20 text-green-300',
    warning: 'from-yellow-500/20 to-orange-500/20 text-yellow-300',
    danger: 'from-red-500/20 to-pink-500/20 text-red-300'
  };

  return (
    <GlassCard>
      <div className="flex flex-col h-full">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${variantClasses[variant]} flex items-center justify-center mb-4`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 flex-grow">{description}</p>
        {actionText && (
          <button
            onClick={onAction}
            className={`mt-4 px-4 py-2 rounded-lg bg-gradient-to-r ${
              variant === 'primary' ? 'from-blue-500 to-purple-500' :
              variant === 'success' ? 'from-green-500 to-emerald-500' :
              variant === 'warning' ? 'from-yellow-500 to-orange-500' :
              variant === 'danger' ? 'from-red-500 to-pink-500' :
              'from-gray-500 to-gray-700'
            } text-white font-medium hover:opacity-90 transition-opacity`}
          >
            {actionText}
          </button>
        )}
      </div>
    </GlassCard>
  );
}

export function GlassStatCard({
  value,
  label,
  icon,
  trend,
  change,
  suffix
}: {
  value: string | number;
  label: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  change?: string;
  suffix?: string;
}) {
  const trendColors = {
    up: 'text-green-400 bg-green-500/10',
    down: 'text-red-400 bg-red-500/10',
    neutral: 'text-gray-400 bg-gray-500/10'
  };

  return (
    <GlassCard>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400 mb-1">{label}</p>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-white">{value}</span>
            {suffix && <span className="text-gray-400 ml-1">{suffix}</span>}
          </div>
          {change && trend && (
            <div className="flex items-center mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${trendColors[trend]}`}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {change}
              </span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </GlassCard>
  );
}

export function GlassButton({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  className = ''
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}) {
  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800',
    outline: 'bg-transparent border border-white/20 text-white hover:bg-white/10',
    ghost: 'bg-transparent text-white hover:bg-white/5'
  };

  const baseClasses = `
    rounded-xl font-medium
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    transition-all duration-300
    backdrop-blur-sm
    ${className}
  `;

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={baseClasses}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}