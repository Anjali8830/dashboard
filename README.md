# PeopleOS — Employee Management Dashboard

A modern HR dashboard built with **React + Vite** and **AG Grid Community**.

## Tech Stack

| Layer       | Library              |
|-------------|----------------------|
| Framework   | React 18 + Vite 5    |
| Data Grid   | AG Grid React v31    |
| Charts      | Recharts v2          |
| Icons       | Lucide React         |
| Fonts       | Syne + DM Sans (Google Fonts) |

## Features

- **4 KPI stat cards** — total, active employees, avg salary, avg performance
- **Department bar chart** — headcount + payroll per team (Recharts)
- **Performance scatter plot** — rating vs projects, colored by department
- **Salary area chart** — distribution across $20k bands
- **Hiring timeline** — new hires per year
- **Top performers leaderboard** — ranked by rating
- **Location breakdown** — office headcount by city
- **AG Grid table** with:
  - Custom cell renderers (avatar, dept chips, star ratings, skill tags, status dot)
  - Column sorting, resizing, reordering
  - Text quick-filter (search bar)
  - Set + number column filters (right-click header)
  - Pagination (10/20/50 per page)
  - Multi-row selection
  - CSV export via AG Grid API
  - Dark theme styled to match dashboard

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173

# Build for production
npm run build
```

## Project Structure

```
src/
├── data/
│   └── employees.js       # Employee data + color constants
├── components/
│   ├── Sidebar.jsx         # Icon sidebar nav
│   ├── StatCard.jsx        # KPI card with glow accent
│   ├── Card.jsx            # Generic card wrapper
│   ├── DeptChart.jsx       # Recharts bar chart
│   ├── PerformanceScatter.jsx  # Recharts scatter
│   ├── SalaryChart.jsx     # Recharts area chart
│   ├── HiringChart.jsx     # Recharts area chart
│   ├── TopPerformers.jsx   # Leaderboard component
│   ├── LocationList.jsx    # City bar list
│   └── EmployeeGrid.jsx    # AG Grid table (main feature)
├── App.jsx                 # Layout + state management
├── main.jsx                # React entry point
└── index.css               # Global styles + AG Grid overrides
```

## Customization

- **Colors**: Edit CSS variables in `src/index.css`
- **AG Grid columns**: Edit `COL_DEFS` in `EmployeeGrid.jsx`
- **Data**: Replace `src/data/employees.js` with your API call
