import React, { useState, useMemo } from 'react';
import StatCard from './components/StatCard';
import Card from './components/Card';
import DeptChart from './components/DeptChart';
import PerformanceScatter from './components/PerformanceScatter';
import SalaryChart from './components/SalaryChart';
import HiringChart from './components/HiringChart';
import TopPerformers from './components/TopPerformers';
import LocationList from './components/LocationList';
import EmployeeGrid from './components/EmployeeGrid';

import { employees as initialEmployees } from './data/employees';

/* ─── Helpers ──────────────────────────────────── */

function avg(arr, key) {
  if (!arr.length) return '0.00';
  return (arr.reduce((s, e) => s + e[key], 0) / arr.length).toFixed(2);
}

function avgSalary(arr) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((s, e) => s + e.salary, 0) / arr.length);
}

/* ─── Inline UI helpers ─────────────────────────── */

const Divider = () => (
  <div style={{ borderTop: '1px solid var(--border)', margin: '14px 0' }} />
);

const SummaryRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 7 }}>
    <span style={{ color: 'var(--muted2)' }}>{label}</span>
    <span style={{ color: 'var(--text)', fontWeight: 500 }}>{value}</span>
  </div>
);

const Pill = ({ children }) => (
  <span style={{
    fontSize: 11, padding: '4px 10px', borderRadius: 20,
    background: 'var(--surface2)', color: 'var(--muted2)',
    border: '1px solid var(--border)', cursor: 'pointer',
  }}>{children}</span>
);

/* ─── App ─────────────────────────────────────────── */

export default function App() {
  // Employees in state so delete propagates to every chart
  const [employees, setEmployees] = useState(initialEmployees);

  const [search, setSearch]       = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  /* Derived data — all recompute when employees change */
  const activeCount = useMemo(() => employees.filter(e => e.isActive).length, [employees]);

  const totalPayroll = useMemo(
    () => employees.reduce((s, e) => s + e.salary, 0),
    [employees]
  );

  const topDept = useMemo(() => {
    if (!employees.length) return ['—', 0];
    const map = {};
    employees.forEach(e => { map[e.department] = (map[e.department] || 0) + e.salary; });
    return Object.entries(map).sort(([, a], [, b]) => b - a)[0];
  }, [employees]);

  const medSalary = useMemo(() => {
    const sorted = [...employees].map(e => e.salary).sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)] || 0;
  }, [employees]);

  const filtered = useMemo(
    () => employees.filter(e => !deptFilter || e.department === deptFilter),
    [employees, deptFilter]
  );

  /* Delete handler — removes by IDs, updates state → all charts re-render */
  const handleDelete = useCallback => {
    // wrapped as a real callback below
  };

  const onDeleteEmployees = (ids) => {
    setEmployees(prev => prev.filter(e => !ids.includes(e.id)));
  };

  const exportCSV = () => {
    const headers = ['ID','First','Last','Email','Department','Position','Salary','Location','Rating','Projects','Active','Hire Date'];
    const rows = employees.map(e => [e.id, e.firstName, e.lastName, e.email, e.department, e.position, e.salary, e.location, e.performanceRating, e.projectsCompleted, e.isActive, e.hireDate]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'employees.csv';
    a.click();
  };

  const DEPTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];

  return (
    <>
      {/* Global BG gradient */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 60% 40% at 20% 10%, rgba(124,107,255,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 50% 35% at 80% 80%, rgba(255,107,157,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 40% 30% at 50% 50%, rgba(0,212,170,0.04) 0%, transparent 60%)
        `,
      }} />

      <div style={{ display: 'flex', position: 'relative', zIndex: 1 }}>

        <main style={{ marginLeft: 68, padding: '30px 28px', width: 'calc(100% - 68px)', minHeight: '100vh' }}>

          {/* ── Header ── */}
          <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--text)', letterSpacing: -0.3 }}>
                People Dashboard
              </h1>
              <p style={{ color: 'var(--muted2)', fontSize: 12, marginTop: 2 }}>
                Saturday, Feb 21 2026 · {employees.length} team members across {DEPTS.length} departments
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Search */}
              <div style={{ position: 'relative' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search employees..."
                  style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 10, padding: '8px 14px 8px 32px',
                    color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', fontSize: 13,
                    width: 220, outline: 'none', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              {/* Dept filter */}
              <select
                value={deptFilter}
                onChange={e => setDeptFilter(e.target.value)}
                style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  color: 'var(--muted2)', borderRadius: 10, padding: '8px 12px',
                  fontSize: 13, fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', outline: 'none',
                }}
              >
                <option value="">All Departments</option>
                {DEPTS.map(d => <option key={d}>{d}</option>)}
              </select>

              <button onClick={exportCSV} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 10,
                background: 'var(--surface)', border: '1px solid var(--border)',
                color: 'var(--muted2)', fontFamily: 'DM Sans, sans-serif', fontSize: 13,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted2)'; }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export CSV
              </button>

              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent2), var(--accent4))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 600, color: '#fff', cursor: 'pointer',
              }}>HR</div>
            </div>
          </header>

          {/* ── Stat Cards — reactive to employee state ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
            <StatCard icon="👥" value={employees.length} label="Total Employees" badge="↑ 4 this quarter" badgeUp accentColor="var(--accent)" delay={0.05} />
            <StatCard icon="✅" value={activeCount} label="Active Employees" badge={`${Math.round(activeCount / Math.max(employees.length, 1) * 100)}% retention`} badgeUp accentColor="var(--accent3)" delay={0.1} />
            <StatCard icon="💰" value={employees.length ? `$${(avgSalary(employees) / 1000).toFixed(1)}k` : '—'} label="Avg. Salary" badge="↑ 3.2% YoY" badgeUp accentColor="var(--accent2)" delay={0.15} />
            <StatCard icon="⭐" value={avg(employees, 'performanceRating')} label="Avg. Performance" badge="↑ 0.3 vs last yr" badgeUp accentColor="var(--accent4)" delay={0.2} />
          </div>

          {/* ── Charts Row 1 ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 300px', gap: 14, marginBottom: 14 }}>
            <Card title="Department Breakdown" subtitle="Headcount & payroll per team" delay={0.25} action={<Pill>By count</Pill>}>
              <DeptChart employees={filtered} />
              <Divider />
              <SummaryRow label="Total payroll" value={`$${(totalPayroll / 1000).toFixed(0)}k / yr`} />
              <SummaryRow label="Highest paid dept" value={`${topDept[0]} · $${(topDept[1] / 1000).toFixed(0)}k`} />
            </Card>

            <Card title="Performance vs Output" subtitle="Rating plotted against projects completed" delay={0.3}>
              <PerformanceScatter employees={filtered} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
                {['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'].map(d => (
                  <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--muted2)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: { Engineering: '#7c6bff', Marketing: '#ff6b9d', Sales: '#00d4aa', HR: '#ffb547', Finance: '#63b3ed' }[d] }} />
                    {d}
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Top Performers" subtitle="Ranked by rating" delay={0.35} action={<Pill>2026 Q1</Pill>}>
              <TopPerformers employees={filtered} />
            </Card>
          </div>

          {/* ── Charts Row 2 ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
            <Card title="Salary Distribution" subtitle="Frequency across $20k bands" delay={0.4}>
              <SalaryChart employees={filtered} />
              <Divider />
              <SummaryRow label="Lowest salary"  value={employees.length ? `$${Math.min(...employees.map(e => e.salary)).toLocaleString()}` : '—'} />
              <SummaryRow label="Median salary"  value={employees.length ? `$${medSalary.toLocaleString()}` : '—'} />
              <SummaryRow label="Highest salary" value={employees.length ? `$${Math.max(...employees.map(e => e.salary)).toLocaleString()}` : '—'} />
            </Card>

            <Card title="Hiring Timeline" subtitle="New hires per year" delay={0.45}>
              <HiringChart employees={employees} />
              <Divider />
              <SummaryRow label="Most active year" value="2021 · 4 hires" />
              <SummaryRow label="Avg. tenure" value="3.8 years" />
              <SummaryRow label="Total headcount" value={`${employees.length} employees`} />
            </Card>

            <Card title="Office Locations" subtitle="Headcount by city" delay={0.5}>
              <LocationList employees={filtered} />
            </Card>
          </div>

          {/* ── AG Grid Table ── */}
          <Card
            title=""
            subtitle={`${filtered.length} records · click headers to sort · right-click for column filters`}
            delay={0.55}
            style={{ padding: 0 }}
          >
            <div style={{ padding: '18px 20px 0' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>
                All Employees
              </div>
              
            </div>
            <EmployeeGrid
              employees={filtered}
              quickFilter={search}
              onDelete={onDeleteEmployees}
            />
          </Card>

        </main>
      </div>
    </>
  );
}