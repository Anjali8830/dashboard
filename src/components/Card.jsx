import React from 'react';

export default function Card({ title, subtitle, action, children, style = {}, delay = 0 }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '22px',
      animation: `fadeUp 0.5s ease ${delay}s both`,
      ...style,
    }}>
      {(title || action) && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          marginBottom: 20,
        }}>
          <div>
            {title && (
              <div style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 600, fontSize: 14,
                letterSpacing: 0.1,
                color: 'var(--text)',
              }}>{title}</div>
            )}
            {subtitle && (
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>{subtitle}</div>
            )}
          </div>
          {action && action}
        </div>
      )}
      {children}
    </div>
  );
}
