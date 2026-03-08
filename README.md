<div align="center">

# 💎 GemStore Admin

### Marketplace Moderation Dashboard

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)

The React + Vite admin dashboard for moderating the **GemStore** marketplace — manage users, listings, and reports from a single interface.

[Related Repos](#-related-repositories) · [Getting Started](#-getting-started) · [API Reference](#-api-endpoints)

</div>

---

## 📦 Related Repositories

| Repository | Description |
|---|---|
| [gemstore-backend](https://github.com/mnmmusharraf/gemstore-backend) | Spring Boot backend API |
| [gemstore-web](https://github.com/mnmmusharraf/gemstore-web) | React user-facing application |
| [gemstore-ml-service](https://github.com/mnmmusharraf/gemstore-ml-service) | FastAPI ML price prediction service |

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 + Vite 7 |
| Icons | React Icons |
| Notifications | Sonner |

---

## ✨ Features

### Auth
- Admin login with JWT
- Non-admin users denied access
- Auto-logout and redirect on `401`

### Dashboard
- Marketplace statistics overview

### User Management
- Search users by name or email
- Filter by status
- Update user status and role

### Listing Moderation
- Search listings
- Filter by status
- Update listing status

### Report Management
- Filter reports by status and type
- Review individual reports
- Set resolution status, action taken, and admin notes
- Pending report count badge

---

## 📁 Project Structure

```
src/
├── api/          # API clients (auth, admin, reports)
├── components/   # Shared UI components and layout
├── hooks/        # Custom hooks (admin auth)
├── pages/        # Dashboard, Users, Listings, Reports, Login
└── styles/       # CSS modules for admin and login UI
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm
- [GemStore Backend](https://github.com/mnmmusharraf/gemstore-backend) running on `http://localhost:8080`

---

### 1. Clone the repository

```bash
git clone https://github.com/mnmmusharraf/gemstore-admin
cd gemstore-admin
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the dev server

```bash
npm run dev
```

Open the URL printed by Vite — usually `http://localhost:5173`.

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start local development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## ⚙️ Configuration

The backend URL is hardcoded in `src/api/config.js`:

```js
export const API_BASE_URL = 'http://localhost:8080';
```

Update this value to match your backend environment before building.

---

## 🔒 Auth Notes

- JWT token is stored in `localStorage` under the key `adminToken`
- Only users with the `ADMIN` role can access the dashboard
- On any `401` response, the token is cleared and the user is redirected to login

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/me` | Get current admin user |
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/users` | List all users |
| PATCH | `/api/admin/users/{id}/status/{status}` | Update user status |
| PATCH | `/api/admin/users/{id}/role/{role}` | Update user role |
| GET | `/api/admin/listings` | List all listings |
| PATCH | `/api/admin/listings/{id}/status/{status}` | Update listing status |
| GET | `/api/v1/reports/admin` | List all reports |
| PUT | `/api/v1/reports/admin/{id}` | Resolve a report |
| GET | `/api/v1/reports/admin/pending-count` | Get pending report count |
