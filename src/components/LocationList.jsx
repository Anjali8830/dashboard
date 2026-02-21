import React, { useMemo } from 'react';
import { LOCATION_FLAGS, DEPT_COLORS } from '../data/employees';

const COLORS = Object.values(DEPT_COLORS);

export default function LocationList({ employees }) {
  const locs = useMemo(() => {
    const map = {};
    employees.forEach(e => { map[e.location] = (map[e.location] || 0) + 1; });
    const sorted = Object.entries(map).sort(([, a], [, b]) => b - a);
    const max = sorted[0]?.[1] || 1;
    return sorted.map(([city, count]) => ({ city, count, pct: count / max * 100 }));
  }, [employees]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {locs.map(({ city, count, pct }, i) => (
        <div key={city} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18, width: 24, flexShrink: 0 }}>{LOCATION_FLAGS[city] || '📍'}</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{city}</span>
              <span style={{ fontSize: 12, color: 'var(--muted2)' }}>{count}</span>
            </div>
            <div style={{
              height: 4,
              background: 'var(--surface2)',
              borderRadius: 2,
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${pct}%`,
                background: COLORS[i % COLORS.length],
                borderRadius: 2,
                transition: 'width 1s cubic-bezier(.4,0,.2,1)',
              }}/>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
