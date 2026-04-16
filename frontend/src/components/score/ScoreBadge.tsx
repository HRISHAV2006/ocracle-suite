'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { ScoreTier } from '@/types/product';

interface ScoreBadgeProps {
  tier: ScoreTier;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const BADGE_CONFIG: Record<ScoreTier, { label: string; icon: React.ElementType; bg: string; border: string; text: string }> = {
  ghost:    { label: 'Ghost Label',           icon: AlertCircle,  bg: 'rgba(229,62,62,0.12)',    border: 'rgba(229,62,62,0.3)',   text: '#E53E3E' },
  partial:  { label: 'Partial Truth',         icon: AlertTriangle,bg: 'rgba(217,119,6,0.12)',    border: 'rgba(217,119,6,0.3)',   text: '#D97706' },
  genuine:  { label: 'Genuinely Sustainable', icon: CheckCircle2, bg: 'rgba(5,150,105,0.12)',    border: 'rgba(5,150,105,0.3)',   text: '#059669' },
  verified: { label: 'Verified Clean',        icon: ShieldCheck,  bg: 'rgba(52,211,153,0.12)',   border: 'rgba(52,211,153,0.3)',  text: '#34D399' },
};

const SIZE_MAP = {
  sm: { padding: '2px 8px', fontSize: '0.7rem', iconSize: 12 },
  md: { padding: '4px 12px', fontSize: '0.8rem', iconSize: 14 },
  lg: { padding: '6px 16px', fontSize: '0.9rem', iconSize: 16 },
};

export function ScoreBadge({ tier, size = 'md', className = '' }: ScoreBadgeProps) {
  const config = BADGE_CONFIG[tier];
  const sizeStyle = SIZE_MAP[size];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium ${className}`}
      style={{
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        color: config.text,
        background: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: 'var(--border-radius-pill)',
        fontFamily: 'var(--font-display)',
      }}
    >
      <Icon size={sizeStyle.iconSize} />
      {config.label}
    </span>
  );
}
