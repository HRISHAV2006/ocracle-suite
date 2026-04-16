'use client';

import React from 'react';
import { Star, Clock, BadgeCheck } from 'lucide-react';
import type { Expert } from '@/types/expert';

interface ExpertCardProps {
  expert: Expert;
  onBook: (expertId: string) => void;
  className?: string;
}

export function ExpertCard({ expert, onBook, className = '' }: ExpertCardProps) {
  return (
    <div
      className={`card flex flex-col gap-4 p-5 transition-all duration-300 hover:-translate-y-1 ${className}`}
    >
      {/* Header */}
      <div className="flex gap-3 items-start">
        {/* Avatar */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-truth-red), #FF6B6B)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'white',
            fontFamily: 'var(--font-display)',
          }}
        >
          {expert.name.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              {expert.name}
            </h3>
            {expert.isVerified && (
              <BadgeCheck size={14} style={{ color: 'var(--accent-leaf)', flexShrink: 0 }} />
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            <div className="flex">
              {[1,2,3,4,5].map((i) => (
                <Star
                  key={i}
                  size={10}
                  fill={i <= Math.round(expert.rating) ? '#FBBF24' : 'transparent'}
                  color={i <= Math.round(expert.rating) ? '#FBBF24' : 'rgba(255,255,255,0.2)'}
                />
              ))}
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {expert.rating.toFixed(1)} ({expert.reviewCount})
            </span>
          </div>
        </div>

        {/* Response time */}
        <div className="flex items-center gap-1" style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
          <Clock size={10} />
          <span>{expert.responseTime}</span>
        </div>
      </div>

      {/* Credentials */}
      <div className="flex flex-wrap gap-1">
        {expert.credentials.slice(0, 3).map((cred) => (
          <span
            key={cred}
            style={{
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              background: 'var(--surface-elevated)',
              borderRadius: 'var(--border-radius-pill)',
              padding: '2px 8px',
              border: '1px solid var(--surface-border)',
            }}
          >
            {cred}
          </span>
        ))}
      </div>

      {/* Specializations */}
      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        {expert.specializations.slice(0, 2).join(' · ')}
      </p>

      {/* CTA */}
      <button
        onClick={() => onBook(expert.id)}
        id={`book-expert-${expert.id}`}
        style={{
          padding: '10px 16px',
          borderRadius: 'var(--border-radius-md)',
          background: 'var(--color-truth-red)',
          color: 'white',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '0.85rem',
          transition: 'all var(--transition-fast)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
        className="hover:brightness-110 active:scale-95"
      >
        Consult for ₹{expert.consultationFee}
      </button>
    </div>
  );
}
