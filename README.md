# Servico — Home Services on Demand

A production-ready, full-stack home services marketplace that connects customers with vetted local service providers. Customers discover and book services such as AC servicing, deep cleaning, repairs, beauty, and more — then pay instantly via **bKash**, **Nagad**, **bank transfer**, or **cash**. Providers manage their jobs, schedules, earnings, and reviews, while administrators run the entire business from a dedicated dashboard.

- **Live frontend:** <https://servico-frontend-0fl0.onrender.com>
- **Live API:** <https://servico-backend-0vdn.onrender.com/api/>
- **Repository:** <https://github.com/HafijurRahmanBhuiyan/servico>

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Authentication & Roles](#authentication--roles)
- [Payments](#payments)
- [Media Uploads](#media-uploads)
- [Deployment](#deployment)
- [License](#license)

---

## Features

### For Customers

- Browse and filter services by category, popularity, and search keywords
- Service detail pages with pricing, duration, FAQs, and process steps
- Book appointments with preferred date/time, notes, and optional phone field
- Choose **urgent** scheduling where available
- Pay online via **bKash** (OTP flow), **Nagad** (OTP flow), **Bank Transfer**, or **Cash**
- Apply **promo codes** for instant discounts at checkout
- Track every booking from a personal dashboard with live status updates
- Leave ratings and reviews after completed services
- Chat in real time with the provider assigned to a booking
- Refer friends with a built-in referral-code system

### For Service Providers

- Apply through a guided application: NID verification, skills, experience, and profile picture (with avatar cropping)
- View jobs assigned to you and update statuses (accepted, in progress, completed)
- Schedule management and availability settings
- Earnings dashboard with weekly breakdowns and payout status
- Respond to customer reviews
- Customize your public profile, avatar, and bio
- End-to-end booking messaging with customers

### For Administrators

- Analytics dashboard: revenue, new/cancelled bookings, registered users, and active providers
- Manage services, categories (with emoji icons), providers, and users
- Assign providers to bookings via a skill-matching interface and control booking statuses
- Process transactions with method-specific cards (bKash, Nagad, Bank, Cash) and approve pending payments
- Moderate reviews (publish, hide, flag, delete)
- Manage promo codes with percentage/amount/usage limits
- Site-wide settings: visiting fee, VAT, tax rates, and payment account details
- Handle customer support messages from a dedicated inbox

---

## Tech Stack

| Layer        | Technology                                                                 |
|--------------|----------------------------------------------------------------------------|
| **Frontend** | React 18, Vite 7, Tailwind CSS 3, React Router 6, lucide-react, react-easy-crop |
| **Backend**  | Django 4.2, Django REST Framework 3.15, SimpleJWT, django-filter, CORS headers |
| **Database** | PostgreSQL 14+                                                             |
| **Payments** | bKash Tokenized Checkout API, Nagad Remote Payment Gateway, pycryptodome    |
| **Async**    | Celery + Redis (installed, ready to wire into booking/payment flows)        |
| **Auth**     | Custom `User` model, JWT access/refresh with automatic client-side refresh  |
| **Styling**  | Tailwind CSS with custom shadows, gradients, Jakarta Sans font              |

---

## Architecture

```
                        ┌─────────────────────────────────────────────────┐
                        │              React SPA (Vite)                   │
                        │  Public · Customer · Provider · Admin portals   │
                        └───────────────▲─────────────────────────────────┘
                                        │  JWT (Authorization: Bearer)
                                        │  JSON over HTTPS
                        ┌───────────────┴─────────────────────────────────┐
                        │             Django REST Framework               │
                        │  users · services · bookings · payments ·       │
                        │  providers · reviews · promos · chat ·          │
                        │  admin_dashboard · support                      │
                        └───────────────▲─────────────────────────────────┘
                                        │
                        ┌───────────────┴───────────────┬─────────────────┐
                        │         PostgreSQL            │   Media files   │
                        │         (bookings)            │  (/media/...)   │
                        └────────────────────────────────┴─────────────────┘
```

Three role-gated portals share one backend:

- **Customer** — browsing, booking, payments, reviews, chat
- **Provider** — applications, jobs, earnings, scheduling
- **Admin** — moderation, analytics, site settings

---

## Project Structure

```
servico/
├── backend/                         # Django REST API
│   ├── config/                      # Settings, root URLconf, WSGI/ASGI
│   ├── users/                       # Custom user model, auth, registration
│   ├── services/                    # Categories, services, FAQs, process steps
│   ├── bookings/                    # Booking lifecycle, provider job actions
│   ├── payments/                    # Payment models + gateway clients
│   │   ├── bkash.py                 # bKash Tokenized Checkout client
│   │   └── nagad.py                 # Nagad Remote Payment client
│   ├── providers/                   # Applications, profiles, earnings
│   ├── reviews/                     # Customer reviews & moderation
│   ├── chat/                        # Booking-level messaging
│   ├── promos/                      # Promo code discounts
│   ├── admin_dashboard/             # Admin analytics & site settings
│   ├── support/                     # Customer support tickets
│   ├── media/                       # Uploaded images & NID documents
│   └── requirements.txt
├── src/                             # React frontend
│   ├── lib/
│   │   ├── api.js                   # API client, JWT auto-refresh, FormData helpers
│   │   ├── AuthContext.jsx          # Auth/session state (persists across refresh)
│   │   └── utils.js                 # cn(), formatPrice(), resolveMediaUrl(), getAvatarUrl()
│   ├── components/                  # Layout, services, ChatBox, ProviderAvatar, uploads
│   └── pages/
│       ├── admin/                   # 13 admin dashboard pages
│       ├── provider/                # 9 provider portal pages
│       ├── dashboard/               # Customer booking dashboard
│       ├── frontend/                # Public site (About, Home)
│       └── ...                      # Home, Services, Booking, Auth, etc.
├── .env.example                     # Frontend environment template (Vite)
├── package.json
└── vite.config.js
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.10+ and **pip**
- **PostgreSQL** 14+ running locally
- Optional — a **bKash** and/or **Nagad** merchant account (sandbox) for live payment flows

### 1. Backend Setup

```bash
# Navigate to the backend
cd backend

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate            # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Create the database
createdb servico_db

# Configure environment variables
cp .env.example .env                # If .env.example is absent, create .env (see below)

# Run migrations
python manage.py migrate

# Create an admin account
python manage.py createsuperuser

# Start the API (available at http://localhost:8000/api/)
python manage.py runserver
```

> The backend reads all configuration from a `.env` file placed inside `backend/`. See [Environment Variables](#environment-variables).

### 2. Frontend Setup

```bash
# From the project root, install dependencies
npm install

# Configure the API base URL (see .env.example)
cp .env.example .env

# Start the Vite dev server (available at http://localhost:5173)
npm run dev
```

The frontend proxies API calls to `VITE_API_URL`. Both servers must be running for full functionality.

```bash
# Production build + preview
npm run build
npm run preview
```

---

## Environment Variables

### Frontend (`/.env`)

| Variable          | Default                     | Description                                   |
|-------------------|-----------------------------|-----------------------------------------------|
| `VITE_API_URL`    | `http://localhost:8000/api` | Backend API base URL (no trailing slash)      |
| `VITE_MEDIA_URL`  | `http://localhost:8000`     | Backend root URL used to resolve media files  |

### Backend (`/backend/.env`)

| Variable                  | Description                                     |
|---------------------------|-------------------------------------------------|
| `SECRET_KEY`              | Django secret key (keep private)                |
| `DEBUG`                   | `True` for development, `False` in production   |
| `ALLOWED_HOSTS`           | Comma-separated hostnames                       |
| `DB_NAME`/`DB_USER`/`DB_PASSWORD`/`DB_HOST`/`DB_PORT` | PostgreSQL connection |
| `CORS_ALLOWED_ORIGINS`    | Comma-separated frontend origins                |
| `BKASH_APP_KEY`/`BKASH_APP_SECRET`/`BKASH_USERNAME`/`BKASH_PASSWORD`/`BKASH_BASE_URL` | bKash merchant credentials (sandbox) |
| `NAGAD_MERCHANT_ID`/`NAGAD_MERCHANT_PRIVATE_KEY`/`NAGAD_BASE_URL` | Nagad merchant credentials (sandbox) |

> Never commit real credentials. Production secrets are injected as environment variables at deploy time.

---

## API Overview

All endpoints live under `/api/` and default to JWT authentication. Send authenticated requests with:

```
Authorization: Bearer <access_token>
```

### Auth & Users

| Method | Endpoint                             | Description                        |
|--------|--------------------------------------|------------------------------------|
| POST   | `/api/register/`                     | Create a customer account          |
| POST   | `/api/login/`                        | Login; returns tokens + user       |
| POST   | `/api/token/refresh/`                | Exchange refresh token for a new access token |
| GET    | `/api/me/`                           | Current user profile               |
| POST   | `/api/me/change-password/`           | Change current user's password     |
| GET    | `/api/admin/users/`                  | List customers (admin)             |

### Catalog

| Method | Endpoint                  | Description                                   |
|--------|---------------------------|-----------------------------------------------|
| GET    | `/api/categories/`        | List categories (incl. icon, image)           |
| GET    | `/api/categories/<slug>/` | Category detail                               |
| POST   | `/api/categories/`        | Create category (admin)                       |
| PATCH/DELETE | `/api/categories/<slug>/` | Update/delete category (admin)          |
| GET    | `/api/services/`          | List services — filter by `popular`, `category_slug`, search |
| GET    | `/api/services/<id>/`     | Service detail with FAQ & process steps       |
| POST   | `/api/services/`          | Create service with image (admin)             |
| PATCH/DELETE | `/api/services/<id>/` | Update/delete service (admin)            |

### Bookings & Jobs

| Method | Endpoint                              | Description                              |
|--------|---------------------------------------|------------------------------------------|
| POST   | `/api/bookings/`                      | Create a booking (with promo validation) |
| GET    | `/api/bookings/my/`                   | Current customer's bookings              |
| GET    | `/api/provider/jobs/`                 | Jobs assigned to the provider            |
| POST   | `/api/provider/jobs/<id>/status/`     | Provider updates job status              |
| GET    | `/api/admin/bookings/`                | All bookings with filters (admin)        |
| GET/PATCH | `/api/admin/bookings/<id>/`       | Booking detail/assign provider (admin)   |

### Payments

| Method | Endpoint                              | Description                              |
|--------|---------------------------------------|------------------------------------------|
| POST   | `/api/payments/bkash/initiate/`       | Start a bKash tokenized payment          |
| POST   | `/api/payments/bkash/callback/`       | bKash server callback                    |
| POST   | `/api/payments/nagad/initiate/`       | Start a Nagad payment                    |
| POST   | `/api/payments/nagad/callback/`       | Nagad server callback                    |
| POST   | `/api/payments/complete/`             | Mark a booking paid (cash/bank)          |
| GET    | `/api/admin/payments/`                | All transactions (admin)                 |
| GET/PATCH | `/api/admin/payments/<id>/`       | Transaction detail/status (admin)        |

### Providers

| Method | Endpoint                          | Description                                  |
|--------|-----------------------------------|----------------------------------------------|
| POST   | `/api/provider/application/`      | Submit provider application (multipart)      |
| GET    | `/api/provider/application/`      | Current user's application + profile         |
| PATCH  | `/api/provider/application/`      | Update profile (incl. avatar upload)         |
| GET    | `/api/providers/<id>/`            | Public provider profile                      |
| GET    | `/api/provider/earnings/`         | Provider earnings dashboard data             |
| GET    | `/api/admin/providers/`           | List applications, filter by status (admin)  |
| GET/PATCH | `/api/admin/providers/<id>/`  | Review/approve/reject application (admin)    |

### Reviews

| Method | Endpoint                                   | Description                          |
|--------|--------------------------------------------|--------------------------------------|
| GET    | `/api/services/<service_id>/reviews/`      | Reviews for a service                |
| GET    | `/api/providers/<provider_id>/reviews/`    | Reviews for a provider               |
| POST   | `/api/reviews/`                            | Submit a review                      |
| GET    | `/api/admin/reviews/`                      | All reviews for moderation (admin)   |
| GET/PATCH/DELETE | `/api/admin/reviews/<id>/`       | Moderate/delete review (admin)       |

### Chat, Promos & Support

| Method | Endpoint                              | Description                            |
|--------|---------------------------------------|----------------------------------------|
| GET/POST | `/api/chat/<booking_id>/messages/`  | Fetch/send messages for a booking      |
| POST   | `/api/chat/<booking_id>/mark-read/`   | Mark messages as read                  |
| GET    | `/api/chat/conversations/`            | List the user's conversations          |
| POST   | `/api/promos/validate/`               | Validate a promo code at checkout      |
| POST   | `/api/admin/promos/`                  | Create a promo code (admin)            |
| GET/PATCH/DELETE | `/api/admin/promos/<code>/` | Manage promo code (admin)              |
| POST   | `/api/support/messages/`              | Send a support ticket                  |
| GET    | `/api/admin/support/`                 | List support tickets (admin)           |

The complete client surface is implemented in `src/lib/api.js` and used across all pages.

---

## Authentication & Roles

- JWT **access tokens** live for **1 day**; **refresh tokens** for **30 days**.
- The frontend stores tokens in `localStorage`, attaches them via an `authFetch` wrapper, and automatically **refreshes expired access tokens** using the refresh endpoint.
- `AuthContext` restores the session on page reload, so logins survive refreshes without re-authentication.
- **Roles:** `customer`, `provider`, and `admin`. Providers are elevated to `provider` only when an admin approves their application.

---

## Payments

- **bKash** — Tokenized Checkout with OTP verification: enter account + PIN, receive OTP, confirm. Integration in `backend/payments/bkash.py`.
- **Nagad** — Remote Payment Gateway with a signed request flow. Integration in `backend/payments/nagad.py`.
- **Bank Transfer** — manual confirmation tracked by the admin.
- **Cash** — marked paid at completion.

Gateway credentials live in `backend/.env`. The admin panel renders method-specific transaction cards and can approve pending payments.

---

## Media Uploads

Service images and provider profile pictures (including NID documents) are stored under `backend/media/` and served from `/media/`:

- **Development:** Django's dev server serves media when `DEBUG=True`.
- **Production:** media is served by Django itself (`/media/<path>`) even with `DEBUG=False`, so uploaded images render correctly.
- The API returns **absolute media URLs** (e.g. `https://api.example.com/media/...`) so the frontend never needs to guess the origin. The frontend also resolves relative paths through `resolveMediaUrl()`/`getAvatarUrl()`.
- Provider avatars use a built-in crop flow (`react-easy-crop`) before upload.

> Note for ephemeral hosts (e.g. Render's free tier): a server-side upload is stored on the instance's filesystem and persists until the next deploy/restart. For durable file storage, point `MEDIA_ROOT` at an object store (S3/Cloudinary).

---

## Deployment

The project deploys to Render as two services:

1. **Backend** (`servico-backend`) — run `python manage.py migrate` as the build command and start with `gunicorn config.wsgi`. Set every backend env var (listed above) in the service dashboard with `DEBUG=False`.
2. **Frontend** (`servico-frontend`) — a static site built with `npm run build`. Set `VITE_API_URL` and `VITE_MEDIA_URL` to the deployed backend URL, **before** building — Vite variables are inlined at build time.

If URLs change after a build, redeploy the frontend so new image/API links take effect.

---

## License

MIT — free to use, modify, and distribute.