import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--surface2)', border: '1px solid var(--border2)',
      borderRadius: 10, padding: '8px 12px', fontSize: 12,
    }}>
      <div style={{ color: 'var(--muted2)' }}>{payload[0].payload.range}</div>
      <div style={{ color: 'var(--text)', fontWeight: 600 }}>{payload[0].value} employees</div>
    </div>
  );
};

export default function SalaryChart({ employees }) {
  const data = useMemo(() => {
    const buckets = Array.from({ length: 8 }, (_, i) => ({
      range: `$${50 + i * 20}k`,
      count: 0,
    }));
    employees.forEach(e => {
      const idx = Math.min(Math.floor((e.salary - 50000) / 20000), 7);
      if (idx >= 0) buckets[idx].count++;
    });
    return buckets;
  }, [employees]);

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 8, right: 4, left: -28, bottom: 0 }}>
        <defs>
          <linearGradient id="salGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7c6bff" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#7c6bff" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis
          dataKey="range"
          tick={{ fill: 'var(--muted)', fontSize: 10, fontFamily: 'DM Sans' }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--muted)', fontSize: 10, fontFamily: 'DM Sans' }}
          axisLine={false} tickLine={false} allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(124,107,255,0.2)', strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#7c6bff"
          strokeWidth={2}
          fill="url(#salGrad)"
          dot={{ fill: '#7c6bff', r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#7c6bff', stroke: 'var(--surface)', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
