import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--surface2)', border: '1px solid var(--border2)',
      borderRadius: 10, padding: '8px 12px', fontSize: 12,
    }}>
      <div style={{ color: 'var(--muted2)' }}>{payload[0].payload.year}</div>
      <div style={{ color: 'var(--text)', fontWeight: 600 }}>{payload[0].value} hired</div>
    </div>
  );
};

export default function HiringChart({ employees }) {
  const data = useMemo(() => {
    const map = {};
    employees.forEach(e => {
      const y = new Date(e.hireDate).getFullYear();
      map[y] = (map[y] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => +a - +b)
      .map(([year, count]) => ({ year, count }));
  }, [employees]);

  return (
    <ResponsiveContainer width="100%" height={140}>
      <AreaChart data={data} margin={{ top: 8, right: 4, left: -28, bottom: 0 }}>
        <defs>
          <linearGradient id="hiringGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#00d4aa" stopOpacity={0.35}/>
            <stop offset="95%" stopColor="#00d4aa" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis
          dataKey="year"
          tick={{ fill: 'var(--muted)', fontSize: 10, fontFamily: 'DM Sans' }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--muted)', fontSize: 10, fontFamily: 'DM Sans' }}
          axisLine={false} tickLine={false} allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0,212,170,0.15)', strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#00d4aa"
          strokeWidth={2}
          fill="url(#hiringGrad)"
          dot={{ fill: '#00d4aa', r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#00d4aa', stroke: 'var(--surface)', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
