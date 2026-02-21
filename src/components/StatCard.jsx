import React from 'react';

export default function StatCard({ icon, value, label, badge, badgeUp, accentColor, glowColor, delay = 0 }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '22px',
      position: 'relative',
      overflow: 'hidden',
      animation: `fadeUp 0.5s ease ${delay}s both`,
      transition: 'transform 0.2s, border-color 0.2s',
      cursor: 'default',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      {/* Corner glow */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 80, height: 80,
        borderRadius: '0 var(--radius) 0 80px',
        background: glowColor || accentColor,
        opacity: 0.06,
        pointerEvents: 'none',
      }}/>

      {/* Icon */}
      <div style={{
        width: 40, height: 40,
        borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18,
        marginBottom: 16,
        background: `${accentColor}18`,
        color: accentColor,
      }}>{icon}</div>

      {/* Value */}
      <div style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: 30,
        fontWeight: 700,
        lineHeight: 1,
        marginBottom: 4,
        color: 'var(--text)',
      }}>{value}</div>

      <div style={{ fontSize: 12, color: 'var(--muted2)' }}>{label}</div>

      {badge && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 3,
          fontSize: 11, fontWeight: 500,
          padding: '3px 8px',
          borderRadius: 20,
          marginTop: 10,
          background: badgeUp ? 'rgba(0,212,170,0.12)' : 'rgba(255,107,157,0.12)',
          color: badgeUp ? 'var(--accent3)' : 'var(--accent2)',
        }}>{badge}</div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
