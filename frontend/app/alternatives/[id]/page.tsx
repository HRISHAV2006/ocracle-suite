'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpDown } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { useAlternatives } from '@/hooks/useAlternatives';

export default function AlternativesPage({ params }: { params: { id: string } }) {
  const { data: alternatives = [], isLoading } = useAlternatives(params.id);

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '5rem', minHeight: 'calc(100vh - 64px)' }}>
      <div className="container" style={{ maxWidth: 860 }}>
        {/* Navigation */}
        <Link
          href={`/product/${params.id}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            marginBottom: '2rem',
            transition: 'color var(--transition-fast)',
          }}
          className="hover:text-white"
        >
          <ArrowLeft size={16} /> Back to Product
        </Link>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }} className="animate-fade-in-up">
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', marginBottom: '0.5rem' }}>Better Alternatives</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
            Products with higher Truth Scores matched to your scanned item. Switch to these genuinely sustainable choices.
          </p>
        </div>

        {/* Action bar */}
        <div className="animate-fade-in-up delay-100" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Found <strong style={{ color: 'var(--text-primary)' }}>{alternatives.length}</strong> alternatives
          </p>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            <ArrowUpDown size={14} /> Sort by Truth Score
          </button>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card animate-fade-in-up" style={{ padding: '2rem', height: 200 }}>
                {/* Simple skeleton */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 'var(--border-radius-md)', background: 'var(--surface-border)', animation: 'pulse 2s infinite' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ width: '40%', height: 12, background: 'var(--surface-border)', borderRadius: 4, animation: 'pulse 2s infinite' }} />
                    <div style={{ width: '80%', height: 16, background: 'var(--surface-border)', borderRadius: 4, animation: 'pulse 2s infinite' }} />
                  </div>
                </div>
                <div style={{ width: '100%', height: 28, background: 'var(--surface-border)', borderRadius: 4, animation: 'pulse 2s infinite' }} />
              </div>
            ))
          ) : (
            alternatives.map((product, i) => (
              <div key={product.id} className={`animate-fade-in-up delay-${(i % 3) * 100 + 100}`}>
                <ProductCard product={product} showAlternativesBadge={true} onSave={() => console.log('Saved', product.id)} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
