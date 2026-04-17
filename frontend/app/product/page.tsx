'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Leaf, Droplets, FlaskConical, Users } from 'lucide-react';
import { TruthScoreDial } from '@/components/score/TruthScoreDial';
import { SubScoreBar } from '@/components/score/SubScoreBar';
import { ScoreBadge } from '@/components/score/ScoreBadge';
import { ProductCard } from '@/components/product/ProductCard';
import { useAlternatives } from '@/hooks/useAlternatives';

// ── Mock product data for the demo ──────────────────────────────────
const NOW = new Date().toISOString();

const DEMO_PRODUCT = {
  id: 'demo',
  name: 'GreenEarth™ Shampoo',
  brand: 'Natural Organics Co.',
  category: 'personal-care' as const,
  barcode: '8901030890925',
  price: 299,
  createdAt: NOW,
  updatedAt: NOW,
  truthScore: {
    overall: 2.8,
    label: 'Ghost Label' as const,
    tier: 'ghost' as const,
    carbon: { label: 'Carbon Footprint' as const, score: 2.1, weight: 0.40 },
    water:  { label: 'Water Usage' as const,       score: 3.4, weight: 0.35 },
    toxicity: { label: 'Chemical Toxicity' as const, score: 2.9, weight: 0.25 },
    explanation: [
      'High microplastic content confirmed in Open Food Facts database',
      'Carbon footprint 340% above category baseline (Carbon Trust 2024)',
      'Contains 4 restricted substances flagged by EPD Online REACH list',
      'Plastic bottle uses virgin PET — no recycled content claimed',
    ],
    confidence: 0.91,
    isCached: false,
    scoredAt: NOW,
  },
  ingredients: [
    'Aqua', 'Sodium Laureth Sulfate', 'Cocamidopropyl Betaine',
    'Glycol Distearate', 'Dimethicone', 'Parfum', 'Citric Acid',
    'Methylisothiazolinone', 'Benzyl Alcohol', 'CI 42090',
  ],
};

const PILLARS = [
  { icon: Leaf,        label: 'Carbon Footprint',   score: 2.1, desc: '340% above category baseline. Manufacture relies on coal-heavy Indian grid with no offset programme.' },
  { icon: Droplets,    label: 'Water Usage',         score: 3.4, desc: 'Water-intensive surfactant production with no certified water stewardship (AWS) in supply chain.' },
  { icon: FlaskConical,label: 'Chemical Toxicity',   score: 2.9, desc: 'Methylisothiazolinone classified as Category 1 skin sensitizer (EU CLP). 3 additional restricted substances.' },
];

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || 'demo';
  const isDemo = id === 'demo' || id === 'mock-prod';
  const product = isDemo ? DEMO_PRODUCT : { ...DEMO_PRODUCT, id, name: `Product ${id}` };
  const score = product.truthScore;

  const { data: alternatives = [] } = useAlternatives(product.id);

  return (
    <div className="container" style={{ maxWidth: 800 }}>

      {/* Back */}
      <Link
        href="/scan"
        id="product-back-nav"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}
      >
        <ArrowLeft size={14} /> Back to Scanner
      </Link>

      {/* Product header */}
      <div className="card animate-fade-in-up" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Product image placeholder */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 'var(--border-radius-md)',
              background: 'var(--surface-elevated)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              flexShrink: 0,
            }}
          >
            🧴
          </div>

          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              {product.brand}
            </p>
            <h1 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', marginBottom: '0.5rem' }}>{product.name}</h1>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Barcode: <span style={{ fontFamily: 'var(--font-data)', color: 'var(--text-secondary)' }}>{product.barcode}</span>
              </span>
              {product.price && (
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-leaf)', fontFamily: 'var(--font-data)', fontWeight: 600 }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
              <ScoreBadge tier={score.tier} size="sm" />
            </div>
          </div>

          {/* Score dial */}
          <TruthScoreDial score={score.overall} animated size="lg" showLabel />
        </div>
      </div>

      {/* Sub-score breakdown */}
      <div className="card animate-fade-in-up delay-100" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Score Breakdown</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {PILLARS.map(({ icon: Icon, label, score: s, desc }) => (
            <div key={label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Icon size={14} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
              </div>
              <SubScoreBar label={label as 'Carbon Footprint' | 'Water Usage' | 'Chemical Toxicity'} score={s} />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Explanation */}
      <div
        className="card animate-fade-in-up delay-200"
        style={{
          padding: '1.75rem',
          marginBottom: '1.5rem',
          border: '1px solid rgba(229,62,62,0.15)',
          background: 'rgba(229,62,62,0.03)',
        }}
      >
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Why This Score?</h2>
        {score.explanation.map((bullet, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 10,
              padding: '8px 0',
              borderBottom: i < score.explanation.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}
          >
            <span style={{ color: 'var(--score-ghost)', flexShrink: 0, marginTop: 2 }}>•</span>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{bullet}</p>
          </div>
        ))}
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
          Scored from: Open Food Facts · EPD Online · Carbon Trust 2024 data · AI analysis by Claude
        </p>
      </div>

      {/* Ingredient list */}
      {product.ingredients && (
        <div className="card animate-fade-in-up delay-300" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Ingredients</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {product.ingredients.map((ing) => {
              const risky = ['Methylisothiazolinone', 'Benzyl Alcohol', 'Sodium Laureth Sulfate', 'Dimethicone'].includes(ing);
              return (
                <span
                  key={ing}
                  style={{
                    fontSize: '0.72rem',
                    padding: '3px 10px',
                    borderRadius: 'var(--border-radius-pill)',
                    background: risky ? 'rgba(229,62,62,0.1)' : 'var(--surface-elevated)',
                    border: `1px solid ${risky ? 'rgba(229,62,62,0.25)' : 'var(--surface-border)'}`,
                    color: risky ? 'var(--score-ghost)' : 'var(--text-muted)',
                  }}
                >
                  {ing}
                </span>
              );
            })}
          </div>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            🔴 Highlighted ingredients are flagged by EPD Online restricted substances list
          </p>
        </div>
      )}

      {/* Alternatives */}
      {alternatives.length > 0 && (
        <div className="animate-fade-in-up delay-400">
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            🌱 Genuinely Better Alternatives
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {alternatives.map((alt) => (
              <ProductCard key={alt.id} product={alt} showAlternativesBadge />
            ))}
          </div>
        </div>
      )}

      {/* Expert CTA */}
      <div
        className="card animate-fade-in-up delay-400"
        style={{
          marginTop: '2.5rem',
          padding: '1.75rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          background: 'linear-gradient(135deg, rgba(204,0,0,0.06) 0%, transparent 100%)',
          border: '1px solid rgba(204,0,0,0.1)',
        }}
      >
        <Users size={24} style={{ color: 'var(--color-truth-red)', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            Still unsure? Ask an expert.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Get a personalised deep-dive from a verified sustainability scientist for just ₹49.
          </p>
        </div>
        <Link
          href="/experts"
          id="product-expert-cta"
          style={{
            padding: '10px 20px',
            borderRadius: 'var(--border-radius-md)',
            background: 'var(--color-truth-red)',
            color: 'white',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '0.85rem',
            flexShrink: 0,
            transition: 'filter var(--transition-fast)',
          }}
          className="hover:brightness-110"
        >
          Ask Expert →
        </Link>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '5rem', minHeight: 'calc(100vh - 64px)' }}>
      <Suspense fallback={<div className="container" style={{ maxWidth: 800, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>}>
        <ProductDetailContent />
      </Suspense>
    </div>
  );
}
