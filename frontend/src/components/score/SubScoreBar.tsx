'use client';

import React from 'react';
import { Leaf, Droplets, FlaskConical } from 'lucide-react';

interface SubScoreBarProps {
  label: 'Carbon Footprint' | 'Water Usage' | 'Chemical Toxicity';
  score: number; // 0–10
  animated?: boolean;
  className?: string;
}

const LABEL_CONFIG = {
  'Carbon Footprint': {
    Icon: Leaf,
    color: '#34D399',
    unit: 'CO₂',
  },
  'Water Usage': {
    Icon: Droplets,
    color: '#60A5FA',
    unit: 'H₂O',
  },
  'Chemical Toxicity': {
    Icon: FlaskConical,
    color: '#FBBF24',
    unit: 'TOX',
  },
};

export function SubScoreBar({ label, score, animated = true, className = '' }: SubScoreBarProps) {
  const config = LABEL_CONFIG[label];
  const { Icon, color } = config;
  const percentage = (score / 10) * 100;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={14} style={{ color }} />
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
            }}
          >
            {label}
          </span>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-data)',
            fontSize: '0.85rem',
            fontWeight: 700,
            color,
          }}
        >
          {score.toFixed(1)}
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 6,
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 'var(--border-radius-pill)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            borderRadius: 'var(--border-radius-pill)',
            transition: animated ? 'width 1s ease 0.3s' : 'none',
            boxShadow: `0 0 8px ${color}40`,
          }}
        />
      </div>
    </div>
  );
}
