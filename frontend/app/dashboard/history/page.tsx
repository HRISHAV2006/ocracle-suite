'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Search, Trash2 } from 'lucide-react';
import { useScanStore } from '@/stores/scanStore';
import { TruthScoreDial } from '@/components/score/TruthScoreDial';
import { ScoreBadge } from '@/components/score/ScoreBadge';

export default function HistoryPage() {
  const { scanHistory, clearHistory } = useScanStore();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredHistory = scanHistory.filter(
    (item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productBrand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '5rem', minHeight: 'calc(100vh - 64px)' }}>
      <div className="container" style={{ maxWidth: 860 }}>
        {/* Navigation */}
        <Link
          href="/dashboard"
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
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }} className="animate-fade-in-up">
          <div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>Scan History</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
              Your past scans and truth scores.
            </p>
          </div>
          {scanHistory.length > 0 && (
            <button
              onClick={clearHistory}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 'var(--border-radius-pill)',
                border: '1px solid var(--surface-border)',
                background: 'transparent',
                color: 'var(--color-truth-red)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              className="hover:bg-red-900/10 hover:border-red-500/30"
            >
              <Trash2 size={14} /> Clear History
            </button>
          )}
        </div>

        {/* Search */}
        <div className="animate-fade-in-up delay-100" style={{ position: 'relative', marginBottom: '2rem' }}>
          <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by product or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 42px',
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
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--surface-border)')}
          />
        </div>

        {/* List */}
        <div className="animate-fade-in-up delay-200">
          {filteredHistory.length === 0 ? (
            <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <Clock size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 4 }}>
                No scans found
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                {searchTerm ? 'Try a different search term.' : 'You haven\'t scanned any products yet.'}
              </p>
              {!searchTerm && (
                <Link
                  href="/scan"
                  style={{
                    display: 'inline-block',
                    padding: '10px 24px',
                    borderRadius: 'var(--border-radius-md)',
                    background: 'var(--color-truth-red)',
                    color: 'white',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    transition: 'filter var(--transition-fast)',
                  }}
                  className="hover:brightness-110"
                >
                  Start Scanning
                </Link>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredHistory.map((item) => (
                <Link
                  key={item.scanId}
                  href={`/product?id=${item.productId}`}
                  className="card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.25rem',
                    textDecoration: 'none',
                    transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
                  }}
                  // Using hover styles indirectly
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
                >
                  <TruthScoreDial score={item.overallScore} size="sm" showLabel={false} animated={false} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.productName}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.productBrand}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                    <ScoreBadge tier={item.tier as "ghost" | "partial" | "genuine" | "verified"} size="sm" />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-data)' }}>
                      {new Date(item.scannedAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
