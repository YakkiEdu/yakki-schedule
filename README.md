# YAKKI School Schedule (יאקקי מערכת שעות)

Automatic school timetable generator with Hebrew UI.

## Features

- **Automatic scheduling** — constraint-based algorithm generates optimal timetables
- **Hebrew RTL interface** — native Hebrew UI
- **Class management** — configure classes, subjects, hours per week
- **Teacher constraints** — day off preferences, subject assignments
- **Group splitting** — support for divided classes (English, CS, etc.)
- **Lesson preferences** — paired lessons, morning/afternoon preferences
- **Print-ready output** — export schedules for printing

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Backend:** Rust (Actix-web)
- **Algorithm:** CSP solver with local search optimization

## Project Structure

```
yakki-schedule/
├── frontend/          # React application
├── backend/           # Rust API server
└── docs/              # Documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- Rust 1.70+
- pnpm (recommended) or npm

### Development

```bash
# Frontend
cd frontend
pnpm install
pnpm dev

# Backend
cd backend
cargo run
```

## License

MIT

## Author

YakkiEdu Team
