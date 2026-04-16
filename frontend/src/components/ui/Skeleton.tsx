import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
  style?: React.CSSProperties;
}

const radiusMap = {
  sm:   'var(--border-radius-sm)',
  md:   'var(--border-radius-md)',
  lg:   'var(--border-radius-lg)',
  full: 'var(--border-radius-pill)',
};

export function Skeleton({
  width = '100%',
  height = 16,
  rounded = 'md',
  className = '',
  style,
}: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius: radiusMap[rounded],
        ...style,
      }}
    />
  );
}

/** Pre-built skeleton for a ProductCard */
export function ProductCardSkeleton() {
  return (
    <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <Skeleton width={56} height={56} rounded="md" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skeleton width="40%" height={10} />
          <Skeleton width="80%" height={16} />
          <Skeleton width="25%" height={12} />
        </div>
      </div>
      <Skeleton height={12} />
      <Skeleton height={36} rounded="md" />
    </div>
  );
}

/** Pre-built skeleton for an ExpertCard */
export function ExpertCardSkeleton() {
  return (
    <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <Skeleton width={48} height={48} rounded="full" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={10} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <Skeleton width={70} height={20} rounded="full" />
        <Skeleton width={90} height={20} rounded="full" />
      </div>
      <Skeleton height={12} />
      <Skeleton height={40} rounded="md" />
    </div>
  );
}
