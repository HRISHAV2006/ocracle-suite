'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, UploadCloud, GraduationCap, Building2 } from 'lucide-react';
import { ToastContainer } from '@/components/ui/Toast';

export default function ExpertRegisterPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; variant: 'success' | 'info' }>>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(4); // Success step
    }, 1500);
  };

  return (
    <div style={{ paddingTop: '3rem', paddingBottom: '6rem', minHeight: 'calc(100vh - 64px)' }}>
      <div className="container" style={{ maxWidth: 640 }}>
        {step < 4 && (
          <Link
            href="/experts"
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
            <ArrowLeft size={16} /> Back to Experts
          </Link>
        )}

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }} className="animate-fade-in-up">
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
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-leaf)', fontWeight: 600 }}>
              Join OCRacle
            </span>
          </div>
          <h1 style={{ marginBottom: '0.75rem' }}>Apply as an Expert</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
            Help consumers see through greenwashing. Earn ₹49 per consultation.
          </p>
        </div>

        {/* ── Progress ── */}
        {step < 4 && (
          <div className="animate-fade-in-up delay-100" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 12, left: 0, right: 0, height: 2, background: 'var(--surface-border)', zIndex: 0 }} />
            <div style={{ position: 'absolute', top: 12, left: 0, width: `${((step - 1) / 2) * 100}%`, height: 2, background: 'var(--accent-leaf)', zIndex: 0, transition: 'width 0.3s ease' }} />
            
            {[1, 2, 3].map((s) => (
              <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 1 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: step >= s ? 'var(--accent-leaf)' : 'var(--surface-bg)',
                    border: `2px solid ${step >= s ? 'var(--accent-leaf)' : 'var(--surface-border)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: step >= s ? '#000' : 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {step > s ? <CheckCircle2 size={14} /> : s}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Form ── */}
        <div className="card animate-fade-in-up delay-200" style={{ padding: '2.5rem' }}>
          {step === 4 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(52,211,153,0.1)', color: 'var(--accent-leaf)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <CheckCircle2 size={32} />
              </div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Application Submitted!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: 400, margin: '0 auto 2rem' }}>
                Our team will review your credentials and verify your status within 2-3 business days. We will notify you via email once approved.
              </p>
              <Link
                href="/experts"
                style={{
                  display: 'inline-block',
                  padding: '12px 28px',
                  borderRadius: 'var(--border-radius-md)',
                  background: 'var(--surface-elevated)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                Return to Experts Page
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Building2 size={18} style={{ color: 'var(--text-muted)' }} /> Basic Information
                  </h3>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Full Name *</label>
                    <input required type="text" placeholder="Dr. Jane Doe" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Professional Email *</label>
                    <input required type="email" placeholder="jane.doe@university.edu" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>LinkedIn Profile / Portfolio Link</label>
                    <input type="url" placeholder="https://linkedin.com/in/..." style={inputStyle} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <GraduationCap size={18} style={{ color: 'var(--text-muted)' }} /> Expertise & Credentials
                  </h3>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Primary Specialization *</label>
                    <select required style={inputStyle}>
                      <option value="" disabled>Select your primary field</option>
                      <option>Carbon Footprint Analysis</option>
                      <option>Water Resource Management</option>
                      <option>Toxicology & Chemistry</option>
                      <option>Food Systems & Agriculture</option>
                      <option>Packaging & Circular Economy</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Highest Degree / Certification *</label>
                    <input required type="text" placeholder="e.g. PhD in Environmental Science" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Current Affiliation</label>
                    <input required type="text" placeholder="e.g. University of Example or Independent Consultant" style={inputStyle} />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <UploadCloud size={18} style={{ color: 'var(--text-muted)' }} /> Verification Documents
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    To maintain trust, OCRacle manually verifies every expert. Please upload your CV and proof of highest credential.
                  </p>
                  
                  <div
                    style={{
                      border: '2px dashed var(--surface-border)',
                      borderRadius: 'var(--border-radius-md)',
                      padding: '3rem 2rem',
                      textAlign: 'center',
                      background: 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setToasts(p => [...p, { id: Date.now().toString(), message: 'File upload dialog would open here.', variant: 'info' }]);
                    }}
                  >
                    <UploadCloud size={28} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>Click to upload files</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PDF, JPG, or PNG (Max 5MB)</p>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    style={{
                      padding: '12px 24px',
                      borderRadius: 'var(--border-radius-md)',
                      border: '1px solid var(--surface-border)',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    borderRadius: 'var(--border-radius-md)',
                    background: 'var(--accent-leaf)',
                    color: '#000',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                    border: 'none',
                  }}
                >
                  {isSubmitting ? 'Submitting...' : step === 3 ? 'Submit Application' : 'Continue'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <ToastContainer toasts={toasts} onClose={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 'var(--border-radius-md)',
  border: '1px solid var(--surface-border)',
  background: 'var(--surface-bg)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color var(--transition-fast)',
};
