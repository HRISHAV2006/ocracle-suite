import type { Metadata } from 'next';
import Link from 'next/link';
import { TruthScoreDial } from '@/components/score/TruthScoreDial';
import { SubScoreBar } from '@/components/score/SubScoreBar';
import { ScoreBadge } from '@/components/score/ScoreBadge';

export const metadata: Metadata = {
  title: 'OCRacle — The Ghost Label Detector | AI-Powered Greenwashing Detector',
  description:
    'Get an instant, unbiased Truth Score (0–10) for any consumer product. Exposing greenwashing, one scan at a time.',
};

// ── Demo data for hero section ──────────────────────────────
const DEMO_SCORE = {
  overall: 2.8,
  tier: 'ghost' as const,
  carbon: { label: 'Carbon Footprint' as const, score: 2.1, weight: 0.40 },
  water:  { label: 'Water Usage' as const,       score: 3.4, weight: 0.35 },
  toxicity:{ label: 'Chemical Toxicity' as const, score: 2.9, weight: 0.25 },
  explanation: [
    'High microplastic content confirmed in Open Food Facts database',
    'Carbon footprint 340% above category baseline (Carbon Trust 2024)',
    'Contains 4 restricted substances flagged by EPD Online',
  ],
};

const STATS = [
  { value: '1.5M+', label: 'Products Indexed' },
  { value: '<3s',   label: 'Truth Score Speed' },
  { value: '0',     label: 'Brand Payments Accepted' },
  { value: '10K+',  label: 'Greenwashers Exposed' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: '📸',
    title: 'Scan the Label',
    desc: 'Point your camera at any barcode or ingredient list. Works on 1.5M+ products.',
  },
  {
    step: '02',
    icon: '🔬',
    title: 'AI Analyses the Truth',
    desc: 'Claude AI cross-references Open Food Facts, EPD, and Carbon Trust databases instantly.',
  },
  {
    step: '03',
    icon: '📊',
    title: 'Get Your Truth Score',
    desc: 'A clear 0–10 score with sub-scores for Carbon, Water, and Toxicity — in under 3 seconds.',
  },
  {
    step: '04',
    icon: '🌱',
    title: 'Switch to Better',
    desc: 'See 3–5 genuinely sustainable alternatives ranked by Truth Score and price proximity.',
  },
];

const TRUST_BADGES = [
  { label: 'Open Food Facts', color: '#34D399' },
  { label: 'EPD Online', color: '#60A5FA' },
  { label: 'Carbon Trust', color: '#FBBF24' },
  { label: 'Claude AI', color: '#A78BFA' },
];

export default function LandingPage() {
  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* ── HERO ──────────────────────────────────── */}
      <section
        style={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background radial glow */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '20%',
            left: '60%',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(204,0,0,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '10%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />

        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '4rem',
              alignItems: 'center',
            }}
          >
            {/* Left: Copy */}
            <div className="animate-fade-in-up" style={{ maxWidth: 560 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 14px',
                  borderRadius: 'var(--border-radius-pill)',
                  background: 'rgba(204,0,0,0.1)',
                  border: '1px solid rgba(204,0,0,0.2)',
                  marginBottom: '1.5rem',
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#CC0000', display: 'inline-block' }} />
                <span style={{ fontSize: '0.75rem', color: '#CC0000', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                  AI-Powered Greenwashing Detector
                </span>
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  marginBottom: '1.25rem',
                  lineHeight: 1.1,
                }}
              >
                Stop Trusting{' '}
                <span className="gradient-text-red">Ghost Labels.</span>
                <br />
                Scan the Truth.
              </h1>

              <p
                style={{
                  fontSize: '1.1rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  marginBottom: '2rem',
                  maxWidth: 480,
                }}
              >
                OCRacle gives you an instant, unbiased{' '}
                <strong style={{ color: 'var(--text-primary)' }}>Truth Score (0–10)</strong> for any
                consumer product — powered by peer-reviewed public databases.
                Brands cannot pay for higher scores. Ever.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                <Link
                  href="/scan"
                  id="hero-scan-cta"
                  style={{
                    padding: '14px 28px',
                    borderRadius: 'var(--border-radius-md)',
                    background: 'var(--color-truth-red)',
                    color: 'white',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    transition: 'filter var(--transition-fast)',
                    boxShadow: '0 4px 24px rgba(204,0,0,0.4)',
                  }}
                  className="hover:brightness-110"
                >
                  Scan a Product — Free →
                </Link>
                <Link
                  href="/experts"
                  id="hero-experts-cta"
                  style={{
                    padding: '14px 28px',
                    borderRadius: 'var(--border-radius-md)',
                    border: '1px solid var(--surface-border)',
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                    fontSize: '1rem',
                    background: 'transparent',
                    transition: 'all var(--transition-fast)',
                  }}
                  className="hover:border-white/20 hover:text-white"
                >
                  Meet Our Experts
                </Link>
              </div>

              {/* Trust badges */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Powered by:</span>
                {TRUST_BADGES.map((b) => (
                  <span
                    key={b.label}
                    style={{
                      fontSize: '0.7rem',
                      padding: '3px 10px',
                      borderRadius: 'var(--border-radius-pill)',
                      border: `1px solid ${b.color}40`,
                      color: b.color,
                      background: `${b.color}0D`,
                    }}
                  >
                    {b.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Demo Score Card */}
            <div
              className="animate-fade-in-up delay-200"
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div
                className="card"
                style={{
                  padding: '2rem',
                  maxWidth: 360,
                  width: '100%',
                  border: '1px solid rgba(229,62,62,0.2)',
                  boxShadow: '0 8px 48px rgba(229,62,62,0.12)',
                }}
              >
                {/* Product mock */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Example Scan Result
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: 'var(--text-primary)',
                      marginTop: 4,
                    }}
                  >
                    GreenEarth™ Shampoo
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Natural Organics Co.</p>
                </div>

                {/* Score dial */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <TruthScoreDial
                    score={DEMO_SCORE.overall}
                    animated
                    size="lg"
                    showLabel
                  />
                </div>

                {/* Sub-scores */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <SubScoreBar label="Carbon Footprint" score={DEMO_SCORE.carbon.score} />
                  <SubScoreBar label="Water Usage"      score={DEMO_SCORE.water.score} />
                  <SubScoreBar label="Chemical Toxicity" score={DEMO_SCORE.toxicity.score} />
                </div>

                {/* Explanation bullets */}
                <div
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--border-radius-md)',
                    background: 'rgba(229,62,62,0.06)',
                    border: '1px solid rgba(229,62,62,0.1)',
                  }}
                >
                  {DEMO_SCORE.explanation.map((bullet, i) => (
                    <p
                      key={i}
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.5,
                        padding: '2px 0',
                      }}
                    >
                      • {bullet}
                    </p>
                  ))}
                </div>

                <Link
                  href="/scan"
                  id="demo-card-scan-cta"
                  style={{
                    display: 'block',
                    marginTop: '1rem',
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
                  Scan Your Products →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────── */}
      <section style={{ borderTop: '1px solid var(--surface-border)', borderBottom: '1px solid var(--surface-border)', padding: '2rem 0' }}>
        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
          }}
        >
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '2rem',
                  color: 'var(--text-primary)',
                  marginBottom: '0.25rem',
                }}
              >
                {value}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────── */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ marginBottom: '0.75rem' }}>
              Truth Score in{' '}
              <span className="gradient-text">4 Steps</span>
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto' }}>
              From scan to verified truth — in under 3 seconds.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {HOW_IT_WORKS.map(({ step, icon, title, desc }, i) => (
              <div
                key={step}
                className={`card p-6 animate-fade-in-up delay-${i * 100 + 100}`}
                style={{ position: 'relative' }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    fontFamily: 'var(--font-data)',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  {step}
                </div>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCORE LEGEND ──────────────────────────── */}
      <section
        style={{
          padding: '5rem 0',
          background: 'linear-gradient(180deg, transparent 0%, rgba(26,18,15,0.6) 100%)',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2>The Truth Score Scale</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Four clear tiers. No brand can buy a better score.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            {[
              { score: 2.8, tier: 'ghost' as const,    range: '0.0 – 3.9', desc: 'Confirmed greenwashing' },
              { score: 5.5, tier: 'partial' as const,  range: '4.0 – 6.9', desc: 'Mixed environmental claims' },
              { score: 7.8, tier: 'genuine' as const,  range: '7.0 – 8.9', desc: 'Strong eco credentials' },
              { score: 9.5, tier: 'verified' as const, range: '9.0 – 10.0', desc: 'Exceptional sustainability' },
            ].map(({ score, tier, range, desc }) => (
              <div
                key={tier}
                className="card flex flex-col items-center gap-4 p-6 text-center"
              >
                <TruthScoreDial score={score} size="sm" showLabel={false} animated={false} />
                <ScoreBadge tier={tier} size="sm" />
                <div>
                  <p
                    style={{
                      fontFamily: 'var(--font-data)',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      marginBottom: 4,
                    }}
                  >
                    {range}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────── */}
      <section style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="container">
          <div
            className="card"
            style={{
              padding: '4rem 2rem',
              background: 'linear-gradient(135deg, rgba(204,0,0,0.08) 0%, rgba(26,18,15,0.8) 100%)',
              border: '1px solid rgba(204,0,0,0.15)',
              maxWidth: 640,
              margin: '0 auto',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌿</div>
            <h2 style={{ marginBottom: '1rem' }}>
              Ready to scan your first product?
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                marginBottom: '2rem',
                maxWidth: 400,
                margin: '0 auto 2rem',
              }}
            >
              Join thousands of consumers making genuinely sustainable choices.
              Free forever — no credit card required.
            </p>
            <Link
              href="/scan"
              id="final-cta-scan"
              style={{
                display: 'inline-block',
                padding: '16px 40px',
                borderRadius: 'var(--border-radius-md)',
                background: 'var(--color-truth-red)',
                color: 'white',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1.1rem',
                boxShadow: '0 8px 32px rgba(204,0,0,0.4)',
                transition: 'filter var(--transition-fast)',
              }}
              className="hover:brightness-110"
            >
              Start Scanning — Free →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid var(--surface-border)',
          padding: '2rem 0',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: 'var(--color-truth-red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem',
                fontWeight: 800,
                color: 'white',
                fontFamily: 'var(--font-display)',
              }}
            >
              OC
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              OCRacle
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            © 2026 OCRacle. MIT License. Built to make sustainable shopping easy. 🌱
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy', 'Ethics Policy', 'API'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(' ', '-')}`}
                style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                className="hover:text-white transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
