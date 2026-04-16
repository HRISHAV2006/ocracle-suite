'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ScanLine, BarChart3, Users, History, Crown, Check, Zap } from 'lucide-react';
import { ToastContainer } from '@/components/ui/Toast';

const FREE_FEATURES = [
  'Unlimited product scans',
  'Carbon, Water & Toxicity sub-scores',
  'AI explanation bullets',
  '3 alternative suggestions per scan',
  'Scan history (last 10)',
];

const PREMIUM_FEATURES = [
  'Everything in Free',
  'Full ingredient deep-dive',
  'Unlimited scan history',
  'Priority expert consultations',
  'Impact dashboard & challenges',
  'Share-your-score social cards',
  'Early access to new features',
  'Ad-free experience',
];

const PLAN_PERKS = [
  { icon: ScanLine,   title: 'Faster Scans',        desc: 'Priority AI processing — results in under 1 second' },
  { icon: BarChart3,  title: 'Full Analytics',       desc: 'Personal impact charts and 12-month trend history' },
  { icon: Users,      title: 'Expert Priority',      desc: 'Skip the queue with priority expert consultation slots' },
  { icon: History,    title: 'Full History',         desc: 'Every scan you\'ve ever done, searchable and exportable' },
];

export default function PremiumPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; variant: 'success' | 'info' }>>([]);

  const monthlyPrice = billingCycle === 'monthly' ? 99 : 79;
  const savingsPct = 20;

  function handleUpgrade() {
    setToasts((p) => [...p, {
      id: `toast-${Date.now()}`,
      message: 'Redirecting to Stripe checkout… (payment integration coming soon)',
      variant: 'info',
    }]);
  }

  return (
    <div style={{ paddingTop: '3rem', paddingBottom: '6rem', minHeight: 'calc(100vh - 64px)' }}>
      <div className="container" style={{ maxWidth: 860 }}>

        {/* ── Hero ── */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }} className="animate-fade-in-up">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 'var(--border-radius-pill)',
              background: 'linear-gradient(135deg, rgba(217,119,6,0.15), rgba(251,191,36,0.1))',
              border: '1px solid rgba(251,191,36,0.25)',
              marginBottom: '1.25rem',
            }}
          >
            <Crown size={12} style={{ color: '#FBBF24' }} />
            <span style={{ fontSize: '0.75rem', color: '#FBBF24', fontWeight: 600 }}>
              OCRacle Premium
            </span>
          </div>
          <h1 style={{ marginBottom: '0.75rem' }}>
            Go Premium.{' '}
            <span className="gradient-text">Scan Deeper.</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 500, margin: '0 auto' }}>
            Unlock the full power of OCRacle for ₹{monthlyPrice}/month — less than a cup of coffee.
          </p>
        </div>

        {/* ── Billing toggle ── */}
        <div
          className="animate-fade-in-up delay-100"
          style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: '2.5rem' }}
        >
          <div
            style={{
              display: 'inline-flex',
              borderRadius: 'var(--border-radius-pill)',
              border: '1px solid var(--surface-border)',
              overflow: 'hidden',
            }}
          >
            {(['monthly', 'yearly'] as const).map((cycle) => {
              const active = billingCycle === cycle;
              return (
                <button
                  key={cycle}
                  id={`billing-${cycle}`}
                  onClick={() => setBillingCycle(cycle)}
                  style={{
                    padding: '8px 20px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: active ? 'var(--color-truth-red)' : 'transparent',
                    color: active ? 'white' : 'var(--text-muted)',
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'all var(--transition-fast)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {cycle === 'monthly' ? 'Monthly' : 'Yearly'}
                  {cycle === 'yearly' && (
                    <span
                      style={{
                        fontSize: '0.65rem',
                        padding: '2px 6px',
                        borderRadius: 'var(--border-radius-pill)',
                        background: 'rgba(52,211,153,0.2)',
                        color: 'var(--accent-leaf)',
                        fontWeight: 700,
                      }}
                    >
                      -{savingsPct}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Pricing cards ── */}
        <div
          className="animate-fade-in-up delay-200"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3.5rem',
          }}
        >
          {/* Free */}
          <div className="card" style={{ padding: '2rem' }}>
            <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Free</p>
            <p style={{ fontFamily: 'var(--font-data)', fontWeight: 700, fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              ₹0
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>Forever free</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {FREE_FEATURES.map((f) => (
                <li key={f} style={{ display: 'flex', gap: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', alignItems: 'flex-start' }}>
                  <Check size={14} style={{ color: 'var(--accent-leaf)', flexShrink: 0, marginTop: 2 }} />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/scan"
              id="plan-free-cta"
              style={{
                display: 'block',
                padding: '12px',
                borderRadius: 'var(--border-radius-md)',
                border: '1px solid var(--surface-border)',
                color: 'var(--text-secondary)',
                textAlign: 'center',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              Continue Free →
            </Link>
          </div>

          {/* Premium */}
          <div
            className="card"
            style={{
              padding: '2rem',
              border: '2px solid rgba(204,0,0,0.4)',
              background: 'linear-gradient(135deg, rgba(204,0,0,0.06) 0%, rgba(26,18,15,0.95) 100%)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Popular badge */}
            <div
              style={{
                position: 'absolute',
                top: 16,
                right: -28,
                background: 'var(--color-truth-red)',
                color: 'white',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '4px 36px',
                transform: 'rotate(45deg)',
                letterSpacing: '0.05em',
              }}
            >
              POPULAR
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem' }}>
              <Crown size={14} style={{ color: '#FBBF24' }} />
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FBBF24' }}>Premium</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: '0.25rem' }}>
              <p style={{ fontFamily: 'var(--font-data)', fontWeight: 700, fontSize: '2.5rem', color: 'var(--text-primary)' }}>
                ₹{monthlyPrice}
              </p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/mo</span>
            </div>
            {billingCycle === 'yearly' && (
              <p style={{ fontSize: '0.72rem', color: 'var(--accent-leaf)', marginBottom: '0.25rem' }}>
                Save ₹{(99 - monthlyPrice) * 12}/year vs monthly
              </p>
            )}
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
              Billed {billingCycle === 'monthly' ? 'monthly' : `₹${monthlyPrice * 12}/year`}
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {PREMIUM_FEATURES.map((f) => (
                <li key={f} style={{ display: 'flex', gap: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', alignItems: 'flex-start' }}>
                  <Check size={14} style={{ color: '#FBBF24', flexShrink: 0, marginTop: 2 }} />
                  {f}
                </li>
              ))}
            </ul>

            <button
              id="plan-premium-cta"
              onClick={handleUpgrade}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 'var(--border-radius-md)',
                background: 'var(--color-truth-red)',
                color: 'white',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'filter var(--transition-fast)',
                boxShadow: '0 6px 24px rgba(204,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                border: 'none',
              }}
              className="hover:brightness-110"
            >
              <Zap size={16} /> Upgrade to Premium
            </button>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
              Cancel anytime · Instant activation · 7-day refund guarantee
            </p>
          </div>
        </div>

        {/* ── Premium perks grid ── */}
        <div className="animate-fade-in-up delay-300">
          <h2 style={{ textAlign: 'center', fontSize: '1.3rem', marginBottom: '2rem' }}>What you unlock</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {PLAN_PERKS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card" style={{ padding: '1.5rem' }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--border-radius-md)',
                    background: 'rgba(204,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.75rem',
                  }}
                >
                  <Icon size={16} style={{ color: 'var(--color-truth-red)' }} />
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 4 }}>{title}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Ethics note ── */}
        <div
          className="animate-fade-in-up delay-400"
          style={{
            marginTop: '3rem',
            padding: '1.25rem',
            borderRadius: 'var(--border-radius-md)',
            background: 'rgba(52,211,153,0.05)',
            border: '1px solid rgba(52,211,153,0.1)',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            🌿 <strong style={{ color: 'var(--accent-leaf)' }}>Premium never buys a better score.</strong> All Truth Scores are calculated from peer-reviewed public databases only. Brands cannot influence ratings, ever.
          </p>
        </div>
      </div>

      <ToastContainer toasts={toasts} onClose={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
    </div>
  );
}
