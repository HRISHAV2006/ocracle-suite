'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Star, BadgeCheck, Clock, MessageSquare } from 'lucide-react';
import { ExpertCardSkeleton } from '@/components/ui/Skeleton';
import { ToastContainer } from '@/components/ui/Toast';
import { useExpert } from '@/hooks/useExperts';

// Fake reviews for the demo
const DEMO_REVIEWS = [
  { author: 'Sanya M.', rating: 5, date: 'Apr 2026', text: 'Priya was incredibly detailed — she found three undisclosed preservatives in my skincare brand that the label hid behind "fragrance".' },
  { author: 'Rajan K.', rating: 5, date: 'Mar 2026', text: 'Worth every rupee. Got a full carbon breakdown and alternative recommendations within 2 hours.' },
  { author: 'Deepa R.', rating: 4, date: 'Mar 2026', text: 'Very knowledgeable. Would have liked a PDF summary but the WhatsApp breakdown was excellent.' },
];

function ExpertProfileContent() {
  const searchParams = useSearchParams();
  const expertId = searchParams.get('id') || '';
  const { data: expert, isLoading } = useExpert(expertId);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; variant: 'info' }>>([]);

  if (isLoading) {
    return (
      <div className="container">
        <ExpertCardSkeleton />
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="container" style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Expert not found.</p>
        <Link href="/experts" style={{ color: 'var(--color-truth-red)' }}>← Back to Experts</Link>
      </div>
    );
  }

  function handleBook() {
    setToasts((p) => [
      ...p,
      {
        id: `toast-${Date.now()}`,
        message: `Redirecting to Razorpay checkout for ₹${expert!.consultationFee} consultation…`,
        variant: 'info',
      },
    ]);
  }

  return (
    <div className="container" style={{ maxWidth: 760 }}>
      {/* Back nav */}
      <Link
        href="/experts"
        id="expert-back-nav"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}
      >
        <ArrowLeft size={14} /> Back to Experts
      </Link>

      {/* Expert hero card */}
      <div
        className="card animate-fade-in-up"
        style={{
          padding: '2rem',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, rgba(26,18,15,0.9) 0%, rgba(26,18,15,0.7) 100%)',
          border: '1px solid rgba(52,211,153,0.15)',
        }}
      >
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-truth-red), #FF6B6B)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 700,
              color: 'white',
              fontFamily: 'var(--font-display)',
              flexShrink: 0,
            }}
          >
            {expert.name.charAt(0)}
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h1 style={{ fontSize: '1.5rem' }}>{expert.name}</h1>
              {expert.isVerified && (
                <BadgeCheck size={18} style={{ color: 'var(--accent-leaf)' }} />
              )}
            </div>

            {/* Stars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex' }}>
                {[1,2,3,4,5].map((i) => (
                  <Star
                    key={i}
                    size={13}
                    fill={i <= Math.round(expert.rating) ? '#FBBF24' : 'transparent'}
                    color={i <= Math.round(expert.rating) ? '#FBBF24' : 'rgba(255,255,255,0.2)'}
                  />
                ))}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {expert.rating.toFixed(1)} · {expert.reviewCount} reviews
              </span>
              <Clock size={11} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Responds {expert.responseTime}
              </span>
            </div>

            {/* Credentials */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {expert.credentials.map((c) => (
                <span
                  key={c}
                  style={{
                    fontSize: '0.7rem',
                    padding: '3px 10px',
                    borderRadius: 'var(--border-radius-pill)',
                    background: 'rgba(52,211,153,0.08)',
                    border: '1px solid rgba(52,211,153,0.2)',
                    color: 'var(--accent-leaf)',
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Book button */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <button
              id={`book-expert-${expert.id}`}
              onClick={handleBook}
              style={{
                padding: '12px 24px',
                borderRadius: 'var(--border-radius-md)',
                background: 'var(--color-truth-red)',
                color: 'white',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'filter var(--transition-fast)',
                boxShadow: '0 4px 16px rgba(204,0,0,0.3)',
                display: 'block',
                width: '100%',
              }}
              className="hover:brightness-110"
            >
              Book for ₹{expert.consultationFee}
            </button>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 6 }}>
              Money-back guarantee
            </p>
          </div>
        </div>
      </div>

      {/* Specializations */}
      <div className="card animate-fade-in-up delay-100" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Specializations</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {expert.specializations.map((s) => (
            <span
              key={s}
              style={{
                fontSize: '0.8rem',
                padding: '5px 14px',
                borderRadius: 'var(--border-radius-pill)',
                background: 'rgba(204,0,0,0.08)',
                border: '1px solid rgba(204,0,0,0.15)',
                color: 'var(--text-secondary)',
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="card animate-fade-in-up delay-200" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
          <MessageSquare size={16} style={{ color: 'var(--text-muted)' }} />
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Reviews</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {DEMO_REVIEWS.map((r, i) => (
            <div key={i} style={{ borderBottom: i < DEMO_REVIEWS.length - 1 ? '1px solid var(--surface-border)' : 'none', paddingBottom: i < DEMO_REVIEWS.length - 1 ? '1.25rem' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{r.author}</span>
                  <div style={{ display: 'flex' }}>
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} size={10} fill={i <= r.rating ? '#FBBF24' : 'transparent'} color={i <= r.rating ? '#FBBF24' : 'rgba(255,255,255,0.2)'} />
                    ))}
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{r.date}</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom book CTA */}
      <div style={{ textAlign: 'center' }}>
        <button
          id={`book-expert-bottom-${expert.id}`}
          onClick={handleBook}
          style={{
            padding: '14px 36px',
            borderRadius: 'var(--border-radius-md)',
            background: 'var(--color-truth-red)',
            color: 'white',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'filter var(--transition-fast)',
            boxShadow: '0 8px 32px rgba(204,0,0,0.4)',
          }}
          className="hover:brightness-110"
        >
          Book Consultation — ₹{expert.consultationFee}
        </button>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
          Secure payment via Razorpay · Full refund if unsatisfied
        </p>
      </div>

      <ToastContainer toasts={toasts} onClose={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
    </div>
  );
}

export default function ExpertProfilePage() {
  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '5rem', minHeight: 'calc(100vh - 64px)' }}>
      <Suspense fallback={<div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>}>
        <ExpertProfileContent />
      </Suspense>
    </div>
  );
}
