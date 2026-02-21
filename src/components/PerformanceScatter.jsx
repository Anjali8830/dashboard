import React from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { DEPT_COLORS } from '../data/employees';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: 'var(--surface2)', border: '1px solid var(--border2)',
      borderRadius: 10, padding: '10px 14px', fontSize: 12,
    }}>
      <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{d.name}</div>
      <div style={{ color: 'var(--muted2)' }}>Rating: {d.x}</div>
      <div style={{ color: 'var(--muted2)' }}>Projects: {d.y}</div>
      <div style={{ color: DEPT_COLORS[d.dept], marginTop: 2 }}>{d.dept}</div>
    </div>
  );
};

export default function PerformanceScatter({ employees }) {
  // Group by dept for colored scatter series
  const depts = [...new Set(employees.map(e => e.department))];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <ScatterChart margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" />
        <XAxis
          dataKey="x" name="Performance" type="number"
          domain={[3.5, 5]} tick={{ fill: 'var(--muted)', fontSize: 10, fontFamily: 'DM Sans' }}
          axisLine={false} tickLine={false} label={{ value: 'Rating →', position: 'insideBottomRight', offset: -4, fill: 'var(--muted)', fontSize: 10 }}
        />
        <YAxis
          dataKey="y" name="Projects" type="number"
          tick={{ fill: 'var(--muted)', fontSize: 10, fontFamily: 'DM Sans' }}
          axisLine={false} tickLine={false}
          label={{ value: 'Projects', angle: -90, position: 'insideLeft', fill: 'var(--muted)', fontSize: 10 }}
        />
        <ZAxis range={[60, 60]} />
        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '4 4', stroke: 'rgba(255,255,255,0.1)' }} />
        {depts.map(dept => (
          <Scatter
            key={dept}
            name={dept}
            data={employees.filter(e => e.department === dept).map(e => ({
              x: e.performanceRating,
              y: e.projectsCompleted,
              name: `${e.firstName} ${e.lastName}`,
              dept: e.department,
            }))}
            fill={DEPT_COLORS[dept]}
            fillOpacity={0.8}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
