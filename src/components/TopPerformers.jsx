import React, { useMemo } from 'react';
import { AVATAR_COLORS, DEPT_COLORS } from '../data/employees';

function initials(f, l) { return (f[0] + l[0]).toUpperCase(); }
function avatarColor(id) { return AVATAR_COLORS[id % AVATAR_COLORS.length]; }

const RANK_STYLES = {
  0: { color: '#ffb547', emoji: '🥇' },
  1: { color: '#9ca3af', emoji: '🥈' },
  2: { color: '#cd7f32', emoji: '🥉' },
};

export default function TopPerformers({ employees }) {
  const top = useMemo(
    () => [...employees].sort((a, b) => b.performanceRating - a.performanceRating).slice(0, 5),
    [employees]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {top.map((e, i) => (
        <div
          key={e.id}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px',
            borderRadius: 10,
            background: 'var(--surface2)',
            border: '1px solid transparent',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={ev => ev.currentTarget.style.borderColor = 'var(--border2)'}
          onMouseLeave={ev => ev.currentTarget.style.borderColor = 'transparent'}
        >
          {/* Rank */}
          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: i < 3 ? 18 : 14,
            fontWeight: 700,
            color: RANK_STYLES[i]?.color || 'var(--muted)',
            width: 28, textAlign: 'center',
            flexShrink: 0,
          }}>
            {i < 3 ? RANK_STYLES[i].emoji : i + 1}
          </div>

          {/* Avatar */}
          <div style={{
            width: 32, height: 32,
            borderRadius: 8,
            background: avatarColor(e.id),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff',
            flexShrink: 0,
          }}>
            {initials(e.firstName, e.lastName)}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {e.firstName} {e.lastName}
            </div>
            <div style={{ fontSize: 11, color: DEPT_COLORS[e.department], marginTop: 1 }}>
              {e.department}
            </div>
          </div>

          {/* Score */}
          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 17, fontWeight: 700,
            color: 'var(--accent3)',
            flexShrink: 0,
          }}>
            {e.performanceRating}
          </div>
        </div>
      ))}
    </div>
  );
}
