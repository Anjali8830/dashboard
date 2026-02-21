import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DEPT_COLORS } from '../data/employees';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: 'var(--surface2)',
      border: '1px solid var(--border2)',
      borderRadius: 10, padding: '10px 14px',
      fontSize: 12,
    }}>
      <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{d.name}</div>
      <div style={{ color: 'var(--muted2)' }}>{d.count} employees</div>
      <div style={{ color: 'var(--muted2)' }}>${(d.payroll / 1000).toFixed(0)}k payroll</div>
    </div>
  );
};

export default function DeptChart({ employees }) {
  const data = useMemo(() => {
    const map = {};
    employees.forEach(e => {
      if (!map[e.department]) map[e.department] = { name: e.department, count: 0, payroll: 0 };
      map[e.department].count++;
      map[e.department].payroll += e.salary;
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [employees]);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 0, left: -28, bottom: 0 }} barSize={28}>
        <XAxis
          dataKey="name"
          tick={{ fill: 'var(--muted2)', fontSize: 11, fontFamily: 'DM Sans' }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--muted)', fontSize: 10, fontFamily: 'DM Sans' }}
          axisLine={false} tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map(d => (
            <Cell key={d.name} fill={DEPT_COLORS[d.name]} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
