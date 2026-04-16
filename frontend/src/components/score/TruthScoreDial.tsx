'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { ScoreTier } from '@/types/product';

interface TruthScoreDialProps {
  score: number;       // 0–10
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const TIER_CONFIG: Record<ScoreTier, { color: string; label: string; emoji: string }> = {
  ghost:    { color: '#E53E3E', label: 'Ghost Label',            emoji: '🔴' },
  partial:  { color: '#D97706', label: 'Partial Truth',          emoji: '🟡' },
  genuine:  { color: '#059669', label: 'Genuinely Sustainable',  emoji: '🟢' },
  verified: { color: '#065F46', label: 'Verified Clean',         emoji: '💚' },
};

function getTier(score: number): ScoreTier {
  if (score < 4)  return 'ghost';
  if (score < 7)  return 'partial';
  if (score < 9)  return 'genuine';
  return 'verified';
}

const SIZE_MAP = { sm: 80, md: 140, lg: 200 };

export function TruthScoreDial({
  score,
  animated = true,
  size = 'lg',
  showLabel = true,
  className = '',
}: TruthScoreDialProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const animFrameRef = useRef<number | null>(null);
  const tier = getTier(score);
  const config = TIER_CONFIG[tier];
  const dim = SIZE_MAP[size];

  // SVG circle math
  const radius = (dim / 2) * 0.78;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (displayScore / 10) * circumference;

  const strokeWidth = dim * 0.07;
  const center = dim / 2;
  const fontSize = size === 'lg' ? '2rem' : size === 'md' ? '1.25rem' : '0.9rem';
  const subFontSize = size === 'lg' ? '0.75rem' : '0.6rem';

  // Animate count-up
  useEffect(() => {
    if (!animated) return;
    const duration = 1200;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(parseFloat((eased * score).toFixed(1)));
      if (progress < 1) animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, [score, animated]);

  return (
    <div
      className={`flex flex-col items-center gap-2 ${className}`}
      role="img"
      aria-label={`Truth Score: ${score.toFixed(1)} out of 10 — ${config.label}`}
    >
      <div style={{ width: dim, height: dim, position: 'relative' }}>
        <svg width={dim} height={dim} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
          />
          {/* Score arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={config.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 50ms linear', filter: `drop-shadow(0 0 8px ${config.color}80)` }}
          />
        </svg>

        {/* Center text */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-data)',
              fontSize,
              fontWeight: 700,
              color: config.color,
              lineHeight: 1,
            }}
          >
            {displayScore.toFixed(1)}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: subFontSize,
              color: 'var(--text-muted)',
              marginTop: 2,
            }}
          >
            / 10
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="flex items-center gap-2 text-center">
          <span style={{ fontSize: size === 'sm' ? '0.85rem' : '1rem' }}>
            {config.emoji}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: config.color,
              fontSize: size === 'sm' ? '0.75rem' : size === 'md' ? '0.9rem' : '1rem',
            }}
          >
            {config.label}
          </span>
        </div>
      )}
    </div>
  );
}
