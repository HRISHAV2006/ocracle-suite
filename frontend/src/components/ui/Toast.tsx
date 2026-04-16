'use client';

import React, { useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastProps {
  id: string;
  message: string;
  variant?: ToastVariant;
  duration?: number; // ms
  onClose: (id: string) => void;
}

const variantConfig: Record<ToastVariant, { icon: React.ReactNode; color: string; bg: string }> = {
  success: {
    icon: <CheckCircle size={16} />,
    color: 'var(--accent-leaf)',
    bg: 'rgba(52,211,153,0.1)',
  },
  error: {
    icon: <XCircle size={16} />,
    color: 'var(--score-ghost)',
    bg: 'rgba(229,62,62,0.1)',
  },
  info: {
    icon: <Info size={16} />,
    color: '#60A5FA',
    bg: 'rgba(96,165,250,0.1)',
  },
};

export function Toast({ id, message, variant = 'info', duration = 4000, onClose }: ToastProps) {
  const close = useCallback(() => onClose(id), [id, onClose]);

  useEffect(() => {
    const timer = setTimeout(close, duration);
    return () => clearTimeout(timer);
  }, [close, duration]);

  const cfg = variantConfig[variant];

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 16px',
        borderRadius: 'var(--border-radius-md)',
        background: 'var(--surface-card)',
        border: `1px solid ${cfg.color}40`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        color: cfg.color,
        fontSize: '0.85rem',
        fontFamily: 'var(--font-body)',
        minWidth: 280,
        maxWidth: 400,
        backdropFilter: 'blur(12px)',
        animation: 'fadeInUp 0.25s ease',
      }}
    >
      <span style={{ flexShrink: 0 }}>{cfg.icon}</span>
      <span style={{ flex: 1, color: 'var(--text-secondary)' }}>{message}</span>
      <button
        onClick={close}
        aria-label="Dismiss"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ── Toast Container (portal-less, fixed bottom-right) ─────────────────
interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; variant?: ToastVariant }>;
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;
  return (
    <div
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onClose={onClose} />
      ))}
    </div>
  );
}
