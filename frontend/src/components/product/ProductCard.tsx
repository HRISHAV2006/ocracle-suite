'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, ExternalLink } from 'lucide-react';
import { ScoreBadge } from '@/components/score/ScoreBadge';
import { TruthScoreDial } from '@/components/score/TruthScoreDial';
import type { Product } from '@/types/product';
import type { ScoreTier } from '@/types/product';

interface ProductCardProps {
  product: Product;
  showAlternativesBadge?: boolean;
  onSave?: () => void;
  className?: string;
}

function getTier(score: number): ScoreTier {
  if (score < 4) return 'ghost';
  if (score < 7) return 'partial';
  if (score < 9) return 'genuine';
  return 'verified';
}

export function ProductCard({ product, showAlternativesBadge = false, onSave, className = '' }: ProductCardProps) {
  const score = product.truthScore?.overall ?? 0;
  const tier = getTier(score);

  return (
    <div
      className={`card group relative flex flex-col gap-4 p-5 transition-all duration-300 hover:-translate-y-1 ${className}`}
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      {/* Save button */}
      {onSave && (
        <button
          onClick={onSave}
          id={`save-product-${product.id}`}
          aria-label={`Save ${product.name} to wishlist`}
          className="absolute top-4 right-4 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'var(--surface-elevated)', color: 'var(--text-muted)' }}
        >
          <Bookmark size={14} />
        </button>
      )}

      {/* Header row */}
      <div className="flex gap-4 items-start">
        {/* Product image placeholder */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 'var(--border-radius-md)',
            background: 'var(--surface-elevated)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
          }}
        >
          {product.category === 'food-beverage' ? '🥗' :
           product.category === 'personal-care' ? '🧴' :
           product.category === 'household-cleaning' ? '🧹' : '📦'}
        </div>

        <div className="flex-1 min-w-0">
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {product.brand}
          </p>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {product.name}
          </h3>
          {product.price != null && (
            <p style={{ fontSize: '0.8rem', color: 'var(--accent-leaf)', fontFamily: 'var(--font-data)' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </p>
          )}
        </div>

        {/* Mini dial */}
        {product.truthScore && (
          <TruthScoreDial score={score} size="sm" showLabel={false} animated={false} />
        )}
      </div>

      {/* Score badge */}
      {product.truthScore && (
        <div className="flex items-center justify-between">
          <ScoreBadge tier={tier} size="sm" />
          {showAlternativesBadge && (
            <span
              style={{
                fontSize: '0.65rem',
                color: 'var(--accent-leaf)',
                background: 'rgba(52,211,153,0.1)',
                border: '1px solid rgba(52,211,153,0.2)',
                borderRadius: 'var(--border-radius-pill)',
                padding: '2px 8px',
              }}
            >
              ✓ Better alternative
            </span>
          )}
        </div>
      )}

      {/* CTA */}
      <Link
        href={`/product/${product.id}`}
        id={`view-product-${product.id}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          padding: '8px 16px',
          borderRadius: 'var(--border-radius-md)',
          background: 'var(--surface-elevated)',
          color: 'var(--text-secondary)',
          fontSize: '0.8rem',
          fontWeight: 500,
          transition: 'all var(--transition-fast)',
        }}
        className="hover:text-white hover:bg-red-900/30"
      >
        View Details
        <ExternalLink size={12} />
      </Link>
    </div>
  );
}
