'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Leaf, Droplets, Recycle, Trophy, Target, ArrowRight } from 'lucide-react';
import { TruthScoreDial } from '@/components/score/TruthScoreDial';

// ── Mock impact data ──────────────────────────────────────────────────
const IMPACT_STATS = [
  { icon: Leaf,     label: 'CO₂ Saved',          value: '12.4',  unit: 'kg',      color: '#34D399', desc: 'vs. your previous choices' },
  { icon: Droplets, label: 'Water Conserved',     value: '840',   unit: 'litres',  color: '#60A5FA', desc: 'through better product picks' },
  { icon: Recycle,  label: 'Plastic Avoided',     value: '2.1',   unit: 'kg',      color: '#FBBF24', desc: 'by choosing minimal packaging' },
];

const TREND_DATA = [
  { month: 'Nov', avgScore: 3.2 },
  { month: 'Dec', avgScore: 3.8 },
  { month: 'Jan', avgScore: 4.5 },
  { month: 'Feb', avgScore: 5.1 },
  { month: 'Mar', avgScore: 5.8 },
  { month: 'Apr', avgScore: 6.4 },
];

const CHALLENGES = [
  {
    id: 'ch-1',
    title: 'Plastic-Free April',
    desc: 'Scan 5 products with zero plastic packaging this month',
    progress: 3,
    total: 5,
    reward: '🌊 Ocean Protector Badge',
    daysLeft: 14,
  },
  {
    id: 'ch-2',
    title: 'Score Climber',
    desc: 'Raise your average Truth Score above 7.0 over 30 days',
    progress: 6.4,
    total: 7.0,
    reward: '🦋 Climber Badge',
    daysLeft: 14,
    isScore: true,
  },
  {
    id: 'ch-3',
    title: 'Expert Learner',
    desc: 'Complete one expert consultation this month',
    progress: 0,
    total: 1,
    reward: '🎓 Expert Learner Badge',
    daysLeft: 14,
  },
];

const RECENT_SCANS = [
  { name: 'GreenEarth Shampoo', brand: 'Natural Organics Co.', score: 2.8, tier: 'ghost' as const },
  { name: 'EcoLeaf Shampoo Bar', brand: 'EcoLeaf Naturals', score: 8.4, tier: 'genuine' as const },
  { name: 'Maggi 2-Minute Noodles', brand: 'Nestlé', score: 4.1, tier: 'partial' as const },
];

export default function DashboardPage() {
  const [activeMetric, setActiveMetric] = useState<'avgScore' | 'co2' | 'plastic'>('avgScore');

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '5rem', minHeight: 'calc(100vh - 64px)' }}>
      <div className="container">

        {/* ── Header ── */}
        <div style={{ marginBottom: '2.5rem' }} className="animate-fade-in-up">
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Your Impact</p>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', marginTop: 4 }}>Impact Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
            Tracking your sustainable shopping journey
          </p>
        </div>

        {/* ── Impact stat cards ── */}
        <div
          className="animate-fade-in-up delay-100"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          {IMPACT_STATS.map(({ icon: Icon, label, value, unit, color, desc }) => (
            <div
              key={label}
              className="card"
              style={{
                padding: '1.5rem',
                borderTop: `3px solid ${color}`,
              }}
            >
              <Icon size={20} style={{ color, marginBottom: '0.75rem' }} />
              <p
                style={{
                  fontFamily: 'var(--font-data)',
                  fontWeight: 700,
                  fontSize: '2rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                }}
              >
                {value} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>{unit}</span>
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem', marginTop: 4 }}>{label}</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* ── Trend chart ── */}
        <div className="card animate-fade-in-up delay-200" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>6-Month Truth Score Trend</h2>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['avgScore'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveMetric(m)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 'var(--border-radius-pill)',
                    border: `1px solid ${activeMetric === m ? 'var(--color-truth-red)' : 'var(--surface-border)'}`,
                    background: activeMetric === m ? 'rgba(204,0,0,0.1)' : 'transparent',
                    color: activeMetric === m ? 'var(--color-truth-red)' : 'var(--text-muted)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  Avg Score
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="month"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={24}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--surface-card)',
                  border: '1px solid var(--surface-border)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: 'var(--text-primary)' }}
                itemStyle={{ color: '#CC0000' }}
              />
              <Line
                type="monotone"
                dataKey="avgScore"
                stroke="#CC0000"
                strokeWidth={2.5}
                dot={{ fill: '#CC0000', r: 4 }}
                activeDot={{ r: 6, fill: '#FF4444' }}
                name="Truth Score avg"
              />
            </LineChart>
          </ResponsiveContainer>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.75rem' }}>
            📈 Your avg score improved <strong style={{ color: 'var(--accent-leaf)' }}>+3.2 pts</strong> over 6 months
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* ── Challenges ── */}
          <div className="animate-fade-in-up delay-300">
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Target size={16} style={{ color: 'var(--color-truth-red)' }} /> Active Challenges
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {CHALLENGES.map((ch) => {
                const pct = ch.isScore
                  ? Math.min(100, ((ch.progress as number) / (ch.total as number)) * 100)
                  : Math.min(100, ((ch.progress as number) / (ch.total as number)) * 100);
                return (
                  <div key={ch.id} className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        {ch.title}
                      </p>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{ch.daysLeft}d left</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                      {ch.desc}
                    </p>
                    {/* Progress bar */}
                    <div style={{ background: 'var(--surface-elevated)', borderRadius: 'var(--border-radius-pill)', height: 6, overflow: 'hidden', marginBottom: '0.5rem' }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, var(--color-truth-red), #FF6B6B)',
                          borderRadius: 'var(--border-radius-pill)',
                          transition: 'width 1s ease',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {ch.isScore ? `${ch.progress} / ${ch.total}` : `${ch.progress} / ${ch.total}`}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--accent-leaf)' }}>{ch.reward}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Recent scans ── */}
          <div className="animate-fade-in-up delay-400">
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Trophy size={16} style={{ color: '#FBBF24' }} /> Recent Scans
            </h2>
            <div className="card" style={{ padding: '1.25rem' }}>
              {RECENT_SCANS.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 0',
                    borderBottom: i < RECENT_SCANS.length - 1 ? '1px solid var(--surface-border)' : 'none',
                  }}
                >
                  <TruthScoreDial score={s.score} size="sm" showLabel={false} animated={false} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.name}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.brand}</p>
                  </div>
                  <Link
                    href={`/product?id=demo`}
                    style={{ color: 'var(--text-muted)', flexShrink: 0 }}
                  >
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Link
                href="/scan"
                id="dashboard-scan-cta"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 20px',
                  borderRadius: 'var(--border-radius-md)',
                  background: 'var(--color-truth-red)',
                  color: 'white',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  transition: 'filter var(--transition-fast)',
                }}
                className="hover:brightness-110"
              >
                Scan New Product <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
