'use client';

import React from 'react';
import Link from 'next/link';
import { ScanLine, LayoutDashboard, Users, Crown, Menu, X } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useUserStore } from '@/stores/userStore';

const NAV_LINKS = [
  { href: '/scan',      label: 'Scan',      Icon: ScanLine },
  { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/experts',   label: 'Experts',   Icon: Users },
  { href: '/premium',   label: 'Premium',   Icon: Crown },
];

export function Header() {
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { user, isPremium } = useUserStore();

  return (
    <header
      className="glass sticky top-0 z-50"
      style={{ borderBottom: '1px solid var(--surface-border)' }}
    >
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          id="header-logo"
          className="flex items-center gap-3"
          style={{ textDecoration: 'none' }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--color-truth-red)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '0.85rem',
              color: 'white',
            }}
          >
            OC
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.1rem',
              color: 'var(--text-primary)',
            }}
          >
            OCRacle
          </span>
          {isPremium && (
            <span
              style={{
                fontSize: '0.6rem',
                padding: '2px 6px',
                background: 'linear-gradient(135deg, #D97706, #FBBF24)',
                color: '#000',
                borderRadius: 'var(--border-radius-pill)',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
              }}
            >
              PRO
            </span>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              id={`nav-${label.toLowerCase()}`}
              className="flex items-center gap-1.5 transition-colors duration-200"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
              }}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA + User */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-truth-red), #FF6B6B)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              {user.displayName?.charAt(0) ?? 'U'}
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                id="nav-login"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  padding: '6px 14px',
                }}
              >
                Log in
              </Link>
              <Link
                href="/scan"
                id="nav-scan-cta"
                style={{
                  padding: '8px 18px',
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
                Scan Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          id="mobile-menu-toggle"
          aria-label="Toggle mobile menu"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav drawer */}
      {isMobileMenuOpen && (
        <nav
          className="md:hidden glass border-t"
          style={{ borderColor: 'var(--surface-border)' }}
        >
          <div className="container py-4 flex flex-col gap-3">
            {NAV_LINKS.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                id={`mobile-nav-${label.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 py-2"
                style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            <Link
              href="/scan"
              id="mobile-nav-scan-cta"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                marginTop: 8,
                padding: '12px',
                borderRadius: 'var(--border-radius-md)',
                background: 'var(--color-truth-red)',
                color: 'white',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                textAlign: 'center',
              }}
            >
              Scan Now — Free
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
