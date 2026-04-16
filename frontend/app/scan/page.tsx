'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ScanLine, Type, Hash, ArrowRight, Loader2 } from 'lucide-react';
import { TruthScoreDial } from '@/components/score/TruthScoreDial';
import { SubScoreBar } from '@/components/score/SubScoreBar';
import { ScoreBadge } from '@/components/score/ScoreBadge';
import { useUIStore } from '@/stores/uiStore';
import { useScanStore } from '@/stores/scanStore';
import { useTruthScore } from '@/hooks/useTruthScore';
import type { ScanMode } from '@/types/scan';


const MODES: { id: ScanMode; icon: typeof Hash; label: string; desc: string }[] = [
  { id: 'barcode', icon: Hash,     label: 'Barcode',     desc: 'EAN-13 / QR' },
  { id: 'ocr',     icon: ScanLine,  label: 'Image OCR',   desc: 'Upload photo' },
  { id: 'manual',  icon: Type,      label: 'Manual Text', desc: 'Type ingredients' },
];

export default function ScanPage() {
  const { scanMode, setScanMode } = useUIStore();
  const { currentScan, clearScan } = useScanStore();
  const { mutate: scan, isPending } = useTruthScore();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    clearScan();
    scan({ query: q, mode: scanMode });
  }

  const result = currentScan;

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: 620, margin: '0 auto' }}>

        {/* ── Header ──────────── */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }} className="animate-fade-in-up">
          <h1 style={{ marginBottom: '0.75rem' }}>Scan a Product</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Enter a barcode, paste ingredients, or describe the product to get your instant Truth Score.
          </p>
        </div>

        {/* ── Mode Selector ──── */}
        <div className="card animate-fade-in-up delay-100" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Choose scan method:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {MODES.map(({ id, icon: Icon, label, desc }) => {
              const active = scanMode === id;
              return (
                <button
                  key={id}
                  id={`mode-${id}`}
                  onClick={() => { setScanMode(id); inputRef.current?.focus(); }}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--border-radius-md)',
                    border: `1px solid ${active ? 'rgba(204,0,0,0.4)' : 'var(--surface-border)'}`,
                    background: active ? 'rgba(204,0,0,0.08)' : 'var(--surface-elevated)',
                    color: active ? 'var(--color-truth-red)' : 'var(--text-secondary)',
                    textAlign: 'center',
                    transition: 'all var(--transition-fast)',
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={20} style={{ margin: '0 auto 4px' }} />
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem' }}>{label}</p>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>{desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Input Form ──────── */}
        <form onSubmit={handleSubmit}>
          <div className="card animate-fade-in-up delay-200" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <label
              htmlFor="scan-input"
              style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}
            >
              {scanMode === 'barcode'
                ? 'Enter barcode (EAN-13) or product name:'
                : scanMode === 'ocr'
                ? 'Describe the product or paste ingredient label text:'
                : 'Paste or type the full ingredient list:'}
            </label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                ref={inputRef}
                id="scan-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  scanMode === 'barcode'
                    ? 'e.g. 8901030890925 or GreenEarth Shampoo'
                    : scanMode === 'ocr'
                    ? 'e.g. Aqua, Sodium Laureth Sulfate, …'
                    : 'Paste full ingredient list here…'
                }
                autoComplete="off"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--surface-border)',
                  background: 'var(--surface-bg)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color var(--transition-fast)',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(204,0,0,0.5)')}
                onBlur={(e) =>  (e.currentTarget.style.borderColor = 'var(--surface-border)')}
              />
              <button
                id="scan-submit-btn"
                type="submit"
                disabled={isPending || !query.trim()}
                style={{
                  padding: '12px 20px',
                  borderRadius: 'var(--border-radius-md)',
                  background: 'var(--color-truth-red)',
                  color: 'white',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  transition: 'filter var(--transition-fast)',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  opacity: (!query.trim()) ? 0.5 : 1,
                  cursor: (!query.trim()) ? 'not-allowed' : 'pointer',
                }}
                className="hover:brightness-110"
              >
                {isPending
                  ? <><Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> Scanning…</>
                  : <>Get Score <ArrowRight size={16} /></>
                }
              </button>
            </div>
          </div>

          <p
            className="animate-fade-in-up delay-300"
            style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}
          >
            🔒 Your scans are private. Brands cannot see or influence your results.
          </p>
        </form>

        {/* ── Loading State ─── */}
        {isPending && (
          <div
            className="card animate-fade-in-up"
            style={{ padding: '3rem 2rem', textAlign: 'center', marginBottom: '1.5rem' }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                border: '3px solid rgba(204,0,0,0.3)',
                borderTopColor: 'var(--color-truth-red)',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              Analysing…
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Cross-referencing Open Food Facts, EPD Online &amp; Carbon Trust
            </p>
          </div>
        )}

        {/* ── Result Card ──── */}
        {result && !isPending && (
          <div className="animate-fade-in-up">
            {/* Product info */}
            <div
              className="card"
              style={{
                padding: '2rem',
                border: '1px solid rgba(204,0,0,0.2)',
                boxShadow: '0 8px 48px rgba(204,0,0,0.12)',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Scan Result
                  </p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: 4 }}>
                    {result.productName}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{result.brand}</p>
                </div>
                <ScoreBadge tier={result.score.tier} size="sm" />
              </div>

              {/* Score dial */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <TruthScoreDial score={result.score.overall} animated size="lg" showLabel />
              </div>

              {/* Sub-scores */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <SubScoreBar label="Carbon Footprint"   score={result.score.carbon.score} />
                <SubScoreBar label="Water Usage"        score={result.score.water.score} />
                <SubScoreBar label="Chemical Toxicity"  score={result.score.toxicity.score} />
              </div>

              {/* Explanation */}
              <div
                style={{
                  padding: '0.875rem',
                  borderRadius: 'var(--border-radius-md)',
                  background: 'rgba(229,62,62,0.06)',
                  border: '1px solid rgba(229,62,62,0.1)',
                  marginBottom: '1.25rem',
                }}
              >
                {result.score.explanation.map((bullet, i) => (
                  <p
                    key={i}
                    style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.6, padding: '2px 0' }}
                  >
                    • {bullet}
                  </p>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link
                  href={`/product/${result.productId}`}
                  id="result-view-product"
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 'var(--border-radius-md)',
                    background: 'var(--color-truth-red)',
                    color: 'white',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textAlign: 'center',
                    transition: 'filter var(--transition-fast)',
                  }}
                  className="hover:brightness-110"
                >
                  Full Report →
                </Link>
                <Link
                  href="/experts"
                  id="result-ask-expert"
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 'var(--border-radius-md)',
                    border: '1px solid var(--surface-border)',
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                    textAlign: 'center',
                    transition: 'all var(--transition-fast)',
                  }}
                  className="hover:border-white/20 hover:text-white"
                >
                  Ask Expert ₹49
                </Link>
              </div>
            </div>

            {/* New scan CTA */}
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Not the right product?{' '}
              <button
                onClick={() => { clearScan(); setQuery(''); inputRef.current?.focus(); }}
                style={{ background: 'none', border: 'none', color: 'var(--color-truth-red)', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Scan another →
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
