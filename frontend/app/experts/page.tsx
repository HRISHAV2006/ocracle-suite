'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import { ExpertCard } from '@/components/expert/ExpertCard';
import { ExpertCardSkeleton } from '@/components/ui/Skeleton';
import { useExperts, MOCK_EXPERTS } from '@/hooks/useExperts';
import { ToastContainer } from '@/components/ui/Toast';

const SPECIALIZATIONS = [
  'All',
  'Carbon',
  'Water',
  'Toxicology',
  'Food',
  'Packaging',
  'Social Impact',
];

export default function ExpertsPage() {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; variant: 'success' | 'info' }>>([]);

  const filter = activeFilter === 'All' ? undefined : activeFilter;
  const { data: experts = MOCK_EXPERTS, isLoading } = useExperts(filter);

  function handleBook(expertId: string) {
    const expert = experts.find((e) => e.id === expertId);
    setToasts((prev) => [
      ...prev,
      {
        id: `toast-${Date.now()}`,
        message: `Booking consultation with ${expert?.name ?? 'expert'}… (payment integration coming soon)`,
        variant: 'info',
      },
    ]);
  }

  return (
    <div style={{ paddingTop: '3rem', paddingBottom: '5rem', minHeight: 'calc(100vh - 64px)' }}>
      <div className="container">

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="animate-fade-in-up">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 'var(--border-radius-pill)',
              background: 'rgba(52,211,153,0.1)',
              border: '1px solid rgba(52,211,153,0.2)',
              marginBottom: '1.25rem',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-leaf)', display: 'inline-block' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-leaf)', fontWeight: 600 }}>
              Verified Sustainability Experts
            </span>
          </div>
          <h1 style={{ marginBottom: '0.75rem' }}>Meet Our Experts</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 500, margin: '0 auto' }}>
            PhD-level sustainability scientists who verify every Truth Score. Book a 1:1 consultation for ₹49.
          </p>
        </div>

        {/* ── Filter chips ── */}
        <div
          className="animate-fade-in-up delay-100"
          style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2.5rem' }}
        >
          {SPECIALIZATIONS.map((s) => {
            const active = s === activeFilter;
            return (
              <button
                key={s}
                id={`filter-${s.toLowerCase().replace(' ', '-')}`}
                onClick={() => setActiveFilter(s)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 'var(--border-radius-pill)',
                  border: `1px solid ${active ? 'var(--color-truth-red)' : 'var(--surface-border)'}`,
                  background: active ? 'rgba(204,0,0,0.1)' : 'transparent',
                  color: active ? 'var(--color-truth-red)' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: active ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {s}
              </button>
            );
          })}
        </div>

        {/* ── Expert grid ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <ExpertCardSkeleton key={i} />)
            : experts.map((expert, i) => (
                <div key={expert.id} className={`animate-fade-in-up delay-${(i % 4) * 100 + 100}`}>
                  <ExpertCard expert={expert} onBook={handleBook} />
                </div>
              ))}
        </div>

        {/* ── Expert Register CTA ── */}
        <div
          className="card animate-fade-in-up"
          style={{
            marginTop: '4rem',
            padding: '2.5rem',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(52,211,153,0.06) 0%, rgba(26,18,15,0.8) 100%)',
            border: '1px solid rgba(52,211,153,0.1)',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🎓</div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Are you a sustainability expert?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 420, margin: '0 auto 1.5rem' }}>
            Join our verified panel. Earn ₹49 per consultation while helping consumers make better choices.
          </p>
          <Link
            href="/expert-register"
            id="expert-register-cta"
            style={{
              display: 'inline-block',
              padding: '12px 28px',
              borderRadius: 'var(--border-radius-md)',
              background: 'var(--accent-leaf)',
              color: '#000',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '0.9rem',
              transition: 'filter var(--transition-fast)',
            }}
            className="hover:brightness-110"
          >
            Apply as Expert →
          </Link>
        </div>
      </div>

      <ToastContainer toasts={toasts} onClose={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
    </div>
  );
}
