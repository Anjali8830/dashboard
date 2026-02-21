import React, { useRef, useCallback, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

/* ─── Custom Cell Renderers ─────────────────────────────────── */

const EmployeeCell = ({ data }) => (
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: 2 }}>
    <div style={{ fontSize: 13, fontWeight: 500, color: '#f0f0f8', lineHeight: '18px', whiteSpace: 'nowrap' }}>
      {data.firstName} {data.lastName}
    </div>
    <div style={{ fontSize: 11, color: '#6b7280', lineHeight: '16px', whiteSpace: 'nowrap' }}>
      {data.position}
    </div>
  </div>
);

const DeptCell = ({ value }) => (
  <span style={{ fontSize: 13, color: '#9ca3af' }}>{value}</span>
);

const SalaryCell = ({ value }) => (
  <span style={{ fontWeight: 600, color: '#f0f0f8', fontSize: 13 }}>
    ${value.toLocaleString()}
  </span>
);

const RatingCell = ({ value }) => (
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: 3 }}>
    <div style={{ fontSize: 10, color: '#f0f0f8' }}>{value}</div>
  </div>
);

const SkillsCell = ({ value }) => (
  <div style={{
    display: 'flex', gap: 4, flexWrap: 'nowrap',
    alignItems: 'center', height: '100%', overflow: 'hidden'
  }}>
    {(value || []).slice(0, 2).map(s => (
      <span key={s} style={{
        fontSize: 10, padding: '2px 8px',
        borderRadius: 4,
        background: '#1e2229',
        color: '#9ca3af',
        border: '1px solid rgba(255,255,255,0.07)',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        lineHeight: '18px',
      }}>{s}</span>
    ))}
  </div>
);

const StatusCell = ({ value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: '100%' }}>
    <div style={{
      width: 7, height: 7, borderRadius: '50%',
      background: value ? '#00d4aa' : '#6b7280',
      boxShadow: value ? '0 0 6px #00d4aa' : 'none',
      flexShrink: 0,
    }} />
    <span style={{ fontSize: 12, color: value ? '#00d4aa' : '#6b7280' }}>
      {value ? 'Active' : 'Inactive'}
    </span>
  </div>
);

const EmailCell = ({ value }) => (
  <a href={`mailto:${value}`} style={{ color: '#7c6bff', fontSize: 12, textDecoration: 'none' }}
    onMouseEnter={e => e.target.style.textDecoration = 'underline'}
    onMouseLeave={e => e.target.style.textDecoration = 'none'}>
    {value}
  </a>
);

/* ─── Column Definitions ─────────────────────────────────── */

const buildColDefs = () => [
  {
    // Checkbox column — no header select-all
    checkboxSelection: true,
    showDisabledCheckboxes: true,
    width: 44,
    minWidth: 44,
    maxWidth: 44,
    pinned: 'left',
    resizable: false,
    sortable: false,
    filter: false,
    suppressMovable: true,
    headerName: '',
    field: '_check',
    lockPosition: true,
    headerCheckboxSelection: false,
  },
  {
    headerName: 'Employee',
    field: 'firstName',
    cellRenderer: EmployeeCell,
    minWidth: 190,
    flex: 1.6,
    filter: 'agTextColumnFilter',
    valueGetter: p => `${p.data.firstName} ${p.data.lastName}`,
    sortable: true,
    pinned: 'left',
  },
  {
    headerName: 'Department',
    field: 'department',
    cellRenderer: DeptCell,
    minWidth: 140,
    flex: 1,
    filter: 'agSetColumnFilter',
    sortable: true,
  },
  {
    headerName: 'Salary',
    field: 'salary',
    cellRenderer: SalaryCell,
    minWidth: 130,
    flex: 0.9,
    filter: 'agNumberColumnFilter',
    sortable: true,
    // no default sort
  },
  {
    headerName: 'Performance',
    field: 'performanceRating',
    cellRenderer: RatingCell,
    minWidth: 150,
    flex: 1,
    filter: 'agNumberColumnFilter',
    sortable: true,
  },
  {
    headerName: 'Projects',
    field: 'projectsCompleted',
    minWidth: 110,
    flex: 0.8,
    filter: 'agNumberColumnFilter',
    sortable: true,
    cellStyle: { color: '#f0f0f8', fontWeight: 500, fontSize: 13 },
  },
  {
    headerName: 'Location',
    field: 'location',
    minWidth: 130,
    flex: 0.9,
    filter: 'agSetColumnFilter',
    sortable: true,
    cellStyle: { color: '#9ca3af', fontSize: 13 },
  },
  {
    headerName: 'Email',
    field: 'email',
    cellRenderer: EmailCell,
    minWidth: 210,
    flex: 1.4,
    filter: 'agTextColumnFilter',
    sortable: false,
  },
  {
    headerName: 'Skills',
    field: 'skills',
    cellRenderer: SkillsCell,
    minWidth: 200,
    flex: 1.4,
    sortable: false,
    filter: false,
    wrapText: false,
    autoHeight: false,
    cellStyle: { display : "flex" },
  },
  {
    headerName: 'Hire Date',
    field: 'hireDate',
    minWidth: 120,
    flex: 0.9,
    sortable: true,
    filter: 'agDateColumnFilter',
    cellStyle: { color: '#9ca3af', fontSize: 12 },
  },
  {
    headerName: 'Status',
    field: 'isActive',
    cellRenderer: StatusCell,
    minWidth: 110,
    flex: 0.8,
    filter: 'agSetColumnFilter',
    sortable: true,
    filterValueGetter: p => p.data.isActive ? 'Active' : 'Inactive',
  },
];

const DEFAULT_COL_DEF = {
  resizable: true,
  suppressMovable: false,
};

/* ─── Toolbar — Delete only ─────────────────────────────────── */

function Toolbar({ selectedCount, onDelete, onExport }) {
  const hasSelection = selectedCount > 0;

  const btnBase = {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '7px 14px', borderRadius: 8,
    fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 500,
    cursor: 'pointer', border: 'none', transition: 'all 0.15s',
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 16px',
      background: hasSelection ? 'rgba(248,113,113,0.04)' : 'rgba(255,255,255,0.01)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      transition: 'background 0.2s',
      minHeight: 52,
    }}>

      {/* Left: selection count + delete */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {hasSelection ? (
          <>
            <span style={{
              fontSize: 12, fontWeight: 600, color: '#f87171',
              background: 'rgba(248,113,113,0.1)',
              padding: '4px 10px', borderRadius: 20,
              border: '1px solid rgba(248,113,113,0.2)',
            }}>
              {selectedCount} selected
            </span>
            <button
              onClick={onDelete}
              style={{
                ...btnBase,
                background: 'rgba(248,113,113,0.08)',
                color: '#f87171',
                border: '1px solid rgba(248,113,113,0.18)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.16)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.18)'; }}
            >
              🗑 Delete Selected
            </button>
          </>
        ) : (
          <span style={{ fontSize: 12, color: '#374151' }}>
            Check rows to select for deletion
          </span>
        )}
      </div>

      {/* Right: export */}
      <button
        onClick={onExport}
        style={{
          ...btnBase,
          background: 'rgba(255,255,255,0.04)',
          color: '#9ca3af',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#f0f0f8'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#9ca3af'; }}
      >
        ⬇ Export CSV
      </button>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────── */

export default function EmployeeGrid({ employees, quickFilter, onDelete }) {
  const gridRef = useRef(null);
  const [selectedCount, setSelectedCount] = useState(0);
  const [colDefs] = useState(buildColDefs);

  const onGridReady = useCallback(params => {
    params.api.sizeColumnsToFit();
  }, []);

  const onSelectionChanged = useCallback(() => {
    const count = gridRef.current?.api?.getSelectedRows()?.length || 0;
    setSelectedCount(count);
  }, []);

  const handleExport = useCallback(() => {
    gridRef.current?.api?.exportDataAsCsv({ fileName: 'employees.csv' });
  }, []);

  const handleDelete = useCallback(() => {
    const selected = gridRef.current?.api?.getSelectedRows() || [];
    if (!selected.length) return;
    if (window.confirm(`Delete ${selected.length} employee(s)? This cannot be undone.`)) {
      const ids = selected.map(r => r.id);
      // Remove from grid immediately
      gridRef.current?.api?.applyTransaction({ remove: selected });
      gridRef.current?.api?.deselectAll();
      setSelectedCount(0);
      // Propagate to parent so all charts update
      onDelete?.(ids);
    }
  }, [onDelete]);

  return (
    <>
      {/* Darken AG Grid filter dropdown */}
      <style>{`
        .ag-theme-quartz-dark .ag-menu {
          background-color: #0d0f14 !important;
          border: 1px solid rgba(255,255,255,0.09) !important;
        }
        .ag-theme-quartz-dark .ag-filter-body-wrapper,
        .ag-theme-quartz-dark .ag-filter-condition,
        .ag-theme-quartz-dark .ag-filter-apply-panel,
        .ag-theme-quartz-dark .ag-set-filter-list {
          background-color: #0d0f14 !important;
        }
        .ag-theme-quartz-dark .ag-menu-option:hover,
        .ag-theme-quartz-dark .ag-menu-option-active {
          background-color: rgba(124,107,255,0.1) !important;
        }
        .ag-theme-quartz-dark .ag-select-agg-func-popup,
        .ag-theme-quartz-dark .ag-popup-child {
          background: #0d0f14 !important;
        }
        .ag-theme-quartz-dark .ag-picker-field-wrapper {
          background: #13161d !important;
          border-color: rgba(255,255,255,0.1) !important;
        }
        .ag-theme-quartz-dark input.ag-input-field-input {
          background: #13161d !important;
          border-color: rgba(255,255,255,0.1) !important;
          color: #d1d5db !important;
        }
        .ag-theme-quartz-dark .ag-set-filter-item-checkbox .ag-checkbox-input-wrapper {
          background: #13161d !important;
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Toolbar
          selectedCount={selectedCount}
          onDelete={handleDelete}
          onExport={handleExport}
        />

        <div
          className="ag-theme-quartz-dark"
          style={{ height: 540, width: '100%', borderRadius: '0 0 var(--radius) var(--radius)', overflow: 'hidden' }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={employees}
            columnDefs={colDefs}
            defaultColDef={DEFAULT_COL_DEF}
            quickFilterText={quickFilter}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20, 50]}
            rowSelection="multiple"
            suppressRowClickSelection={true}
            enableCellTextSelection
            onGridReady={onGridReady}
            onSelectionChanged={onSelectionChanged}
            rowHeight={52}
            headerHeight={44}
            animateRows={true}
            suppressCellFocus={false}
            getRowId={p => String(p.data.id)}
          />
        </div>
      </div>
    </>
  );
}