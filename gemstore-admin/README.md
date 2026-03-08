# Gemstore Admin

Admin dashboard frontend for moderating the Gemstore marketplace.

## Tech Stack

- React 19
- Vite 7
- React Icons
- Sonner (toast notifications)

## Features

- Admin login with JWT token storage in `localStorage`
- Dashboard statistics overview
- User management
  - Search users
  - Filter by status
  - Update user status and role
- Listing moderation
  - Search listings
  - Filter by status
  - Update listing status
- Report management
  - Filter by report status/type
  - Review reports
  - Set resolution status, action taken, and admin notes

## Project Structure

```text
src/
  api/            # API calls (auth, admin, reports)
  components/     # Shared UI components/layout
  hooks/          # Custom hooks (admin auth)
  pages/          # Dashboard, users, listings, reports, login
  styles/         # CSS modules for admin and login UI
```

## Prerequisites

- Node.js 18+ (recommended)
- npm
- Running Gemstore backend API

## Setup

```bash
npm install
npm run dev
```

App runs on Vite default URL (usually `http://localhost:5173`).

## Available Scripts

- `npm run dev` - start development server
- `npm run build` - create production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## Backend/API Configuration

Base URL is currently hardcoded in:

- `src/api/config.js`

```js
export const API_BASE_URL = 'http://localhost:8080';
```

Update this value to match your backend environment.

## Authentication Notes

- Auth token is stored as `adminToken` in `localStorage`
- Non-admin users are denied access
- `401` responses clear token and redirect to login

## Main API Endpoints Used

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/admin/stats`
- `GET /api/admin/users`
- `PATCH /api/admin/users/{id}/status/{status}`
- `PATCH /api/admin/users/{id}/role/{role}`
- `GET /api/admin/listings`
- `PATCH /api/admin/listings/{id}/status/{status}`
- `GET /api/v1/reports/admin`
- `PUT /api/v1/reports/admin/{id}`
- `GET /api/v1/reports/admin/pending-count`
