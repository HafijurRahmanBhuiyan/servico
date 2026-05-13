# Servico — Home Services on Demand (FNF Planet)

## Overview

A full-stack home-services marketplace ("Servico") for the Bangladesh market. Users can browse services (AC repair, cleaning, plumbing, etc.), book appointments, and pay via bKash/Nagad. Providers can manage jobs. Admins oversee users, providers, bookings, payments, promos, reviews, and site settings.

The frontend is a **React + Vite SPA** with **localStorage-based persistence** (no real backend connection in the active frontend code). The backend is **Django REST Framework + PostgreSQL** with JWT auth — fully built but not currently connected to the frontend's auth flow.

---

## Tech Stack

### Frontend (React SPA — `/src`)
| Concern | Choice |
|---------|--------|
| Framework | React 18.3 |
| Bundler | Vite 7.3 |
| Routing | react-router-dom 6.x |
| HTTP | Fetch API (no axios) |
| Styling | Tailwind CSS 3.4 |
| Icons | lucide-react 0.383 |
| State | React Context (AuthContext only) |
| Persistence | localStorage |
| Font | Plus Jakarta Sans (Google Fonts) |

### Backend (Django — `/backend`)
| Concern | Choice |
|---------|--------|
| Framework | Django 4.2 + DRF 3.15 |
| Auth | JWT (simplejwt) |
| Database | PostgreSQL |
| Payments | bKash Sandbox API + Nagad API |
| Queue | Celery + Redis |
| CORS | django-cors-headers |

---

## Project Structure

```
Online-Service-Portal-FNF-Planet/
├── index.html                     # Entry HTML (mounts #root)
├── package.json                   # Dependencies & scripts
├── vite.config.js                 # @ alias → ./src
├── tailwind.config.js             # primary=#059669, custom shadows/font
├── postcss.config.js
├── eslint.config.js
├── src/
│   ├── main.jsx                   # Renders <App />
│   ├── App.jsx                    # ALL routes defined here (BrowserRouter)
│   ├── index.css                  # Tailwind directives + .btn-primary / .btn-secondary / .input-field
│   ├── lib/
│   │   ├── api.js                 # API client helpers + mock data + localStorage CRUD
│   │   ├── AuthContext.jsx        # React context: signIn, signUp, signOut, changeAdminPassword
│   │   └── utils.js               # cn(), formatPrice(৳), formatNum(1.2k)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx         # Sticky public navbar (logo, links, auth dropdown)
│   │   │   └── Footer.jsx         # 5-column footer (brand, company, services, support, social)
│   │   └── services/
│   │       ├── ServiceCard.jsx    # Service grid card (image, rating, price, popular badge)
│   │       └── CategoryTile.jsx   # Category tile (icon, label)
│   ├── pages/
│   │   ├── HomePage.jsx           # Landing: hero carousel, search, categories, popular, CTA
│   │   ├── ServicesPage.jsx       # Browse + filter (search, category, sort)
│   │   ├── ServiceDetailPage.jsx  # Detail: gallery, description, FAQ, reviews, booking sidebar
│   │   ├── CategoryPage.jsx       # Services in a category
│   │   ├── BookingPage.jsx        # Booking form: contact, schedule, promo, payment, summary
│   │   ├── BecomeProviderPage.jsx # Provider application form
│   │   ├── LoginPage.jsx          # signIn(email, password)
│   │   ├── RegisterPage.jsx       # signUp(email, password, fullName, phone)
│   │   ├── ForgotPasswordPage.jsx # Email input (placeholder)
│   │   ├── AboutPage.jsx          # Mission, values, story
│   │   ├── ContactPage.jsx        # Contact info + form
│   │   ├── dashboard/
│   │   │   └── BookingsPage.jsx   # User's bookings list
│   │   ├── admin/
│   │   │   ├── AdminLoginPage.jsx         # Admin-only login
│   │   │   ├── AdminLayout.jsx            # Sidebar + topbar shell
│   │   │   ├── AdminDashboardHome.jsx     # KPIs, recent bookings, pending providers
│   │   │   ├── AdminUsersPage.jsx         # User mgmt (list, search, filter, suspend)
│   │   │   ├── AdminProvidersPage.jsx     # Provider app mgmt (approve/reject)
│   │   │   ├── AdminServicesPage.jsx      # CRUD services + modal form
│   │   │   ├── AdminCategoriesPage.jsx    # CRUD categories + modal form
│   │   │   ├── AdminBookingsPage.jsx      # Booking mgmt (status, assign provider)
│   │   │   ├── AdminReviewsPage.jsx       # Review moderation (publish/hide/delete)
│   │   │   ├── AdminPaymentsPage.jsx      # Payment tracking, refunds
│   │   │   ├── AdminPromosPage.jsx        # CRUD promo codes
│   │   │   └── AdminSettingsPage.jsx      # Site config + change admin password
│   │   └── provider/
│   │       ├── ProviderLayout.jsx         # Sidebar shell (checks approval status)
│   │       ├── PendingApprovalScreen.jsx  # "Under Review" or rejection screen
│   │       ├── ProviderDashboardHome.jsx  # KPIs, upcoming jobs, weekly chart
│   │       ├── ProviderJobsPage.jsx       # Accept/decline/complete jobs
│   │       ├── ProviderSchedulePage.jsx   # Weekly calendar + availability
│   │       ├── ProviderEarningsPage.jsx   # Earnings chart, payout request
│   │       ├── ProviderReviewsPage.jsx    # Reviews with reply
│   │       ├── ProviderProfilePage.jsx    # Edit profile, skills, docs
│   │       └── ProviderSettingsPage.jsx   # Notifications, payout info, password, deactivate
│   └── routes/
│       └── Router.jsx             # ⚠️ LEGACY — unused by App.jsx
└── backend/
    ├── manage.py
    ├── config/                    # Django settings, urls, wsgi
    ├── users/                     # Custom User model (email-based auth, roles)
    ├── services/                  # Category & Service models
    ├── bookings/                  # Booking model
    ├── providers/                 # ProviderApplication & ProviderEarning models
    ├── reviews/                   # Review model (auto-updates service rating)
    ├── promos/                    # PromoCode model
    ├── payments/                  # Payment model + bKash/Nagad integrations
    ├── admin_dashboard/           # Stats & settings views (no models)
    ├── seed_data.py               # Seeds 20 categories, 20 services, 4 promos, 1 admin
    └── requirements.txt
```

---

## Routing (App.jsx — active router)

### Public Routes (wrapped in `Layout` → Navbar + Outlet + Footer)
| Path | Page | Description |
|------|------|-------------|
| `/` | HomePage | Landing page |
| `/services` | ServicesPage | Browse + filter |
| `/service/:id` | ServiceDetailPage | Service detail |
| `/category/:slug` | CategoryPage | Category filtered |
| `/booking/:id` | BookingPage | Create booking |
| `/become-provider` | BecomeProviderPage | Apply |
| `/login` | LoginPage | Sign in |
| `/register` | RegisterPage | Sign up |
| `/forgot-password` | ForgotPasswordPage | Reset |
| `/about` | AboutPage | Info |
| `/contact` | ContactPage | Contact |
| `/dashboard/bookings` | DashboardBookingsPage | My bookings |
| `*` | NotFound (inline) | 404 |

### Admin Routes (wrapped in `AdminProtectedRoute` — checks `isAdmin`)
| Path | Component |
|------|-----------|
| `/admin/login` | AdminLoginPage (no guard) |
| `/admin` | AdminLayout (sidebar) |
| `/admin` (index) | AdminDashboardHome |
| `/admin/users` | AdminUsersPage |
| `/admin/providers` | AdminProvidersPage |
| `/admin/services` | AdminServicesPage |
| `/admin/categories` | AdminCategoriesPage |
| `/admin/bookings` | AdminBookingsPage |
| `/admin/reviews` | AdminReviewsPage |
| `/admin/payments` | AdminPaymentsPage |
| `/admin/promos` | AdminPromosPage |
| `/admin/settings` | AdminSettingsPage |

### Provider Routes (wrapped in `ProviderProtectedRoute` — checks `isProvider`)
| Path | Component |
|------|-----------|
| `/provider` | ProviderLayout |
| `/provider/dashboard` | ProviderDashboardHome |
| `/provider/jobs` | ProviderJobsPage |
| `/provider/schedule` | ProviderSchedulePage |
| `/provider/earnings` | ProviderEarningsPage |
| `/provider/reviews` | ProviderReviewsPage |
| `/provider/profile` | ProviderProfilePage |
| `/provider/settings` | ProviderSettingsPage |

---

## AuthContext (`src/lib/AuthContext.jsx`)

The **only** React context. Provides:

### State
- `user` — `{ id, name, email, phone, role }` or `null`, persisted in `localStorage("servico_user")`

### Methods
- **`signIn(email, password)`** — 4-tier auth:
  1. Admin: `admin@servico.com` / stored password (default `admin123`)
  2. Provider demo: `hafijur@gmail.com` / `sohan123`
  3. Registered users in `localStorage("servico_registered_users")`
  4. Fallback: creates temp demo session
- **`signUp(email, password, fullName, phone)`** — stores in `localStorage("servico_registered_users")`, auto-logs in
- **`signOut()`** — clears `servico_user` from localStorage
- **`changeAdminPassword(current, new)`** — writes `localStorage("servico_admin_password")`

### Derived
- `isAdmin` — `user?.role === "admin"`
- `isProvider` — `!!providerApplication`
- `providerStatus` — `providerApplication?.status`
- `providerApplication` — from `getProviderAppByUserId(user.id)`

### Exported helpers
- `getRegisteredUsers()` — reads `servico_registered_users` from localStorage

---

## API Layer (`src/lib/api.js`)

### Base URL
`http://localhost:8000/api`

### Auth helpers
- `getToken()`, `setTokens()`, `clearTokens()`
- `refreshAccessToken()` — POST `/token/refresh/`
- `authFetch(url, options)` — auto-attaches Bearer token, auto-refreshes on 401

### Exported functions

**Auth:**
```js
apiLogin(email, password)                  // POST /login/
apiRegister(email, password, fullName, phone, referralCode) // POST /register/
apiForgotPassword(email)                   // placeholder (console.log)
```

**Categories:**
```js
fetchCategories()                          // GET /categories/
```

**Services:**
```js
fetchServices({ popular, categorySlug })   // GET /services/
fetchServiceById(id)                       // GET /services/{id}/
fetchServiceReviews(serviceId)             // GET /services/{id}/reviews/
```

**Promos:**
```js
validatePromoCode(code, orderTotal)        // POST /promos/validate/ (auth)
```

**Bookings:**
```js
createBooking(data)                        // POST /bookings/ (auth)
fetchUserBookings()                        // GET /bookings/my/ (auth)
```

**Provider:**
```js
submitProviderApplication(data)            // POST /provider/application/ (auth)
getProviderApplication()                   // GET /provider/application/ (auth)
```

**Payments:**
```js
initiateBkashPayment(bookingId)            // POST /payments/bkash/initiate/
initiateNagadPayment(bookingId)            // POST /payments/nagad/initiate/
```

**Admin APIs:**
```js
fetchAdminStats()                          // GET /admin/stats/ (auth)
fetchMockUsers()                           // localStorage + mock array merged
updateUserStatus(id, status)               // localStorage (registered) or mock array
fetchProviderApplications()                // GET /admin/providers/
updateProviderStatus(id, status, reason)   // PATCH /admin/providers/{id}/
fetchAdminBookings()                       // GET /admin/bookings/
fetchMockPayments()                        // GET /admin/payments/
updatePaymentStatus(id, status)            // PATCH /admin/payments/{id}/
fetchMockReviews()                         // GET /admin/reviews/
updateReviewStatus(id, status)             // PATCH /admin/reviews/{id}/
deleteReview(id)                           // DELETE /admin/reviews/{id}/
fetchPromos()                              // GET /admin/promos/
addPromo(data)                             // POST /admin/promos/
updatePromoStatus(code, status)            // PATCH /admin/promos/{code}/
deletePromo(code)                          // DELETE /admin/promos/{code}/
```

**Provider APIs:**
```js
fetchProviderBookings()                    // GET /provider/jobs/
updateProviderBookingStatus(id, status)    // PATCH /provider/jobs/{id}/status/
fetchProviderEarnings()                    // GET /provider/earnings/
fetchProviderReviews()                     // stub, returns []
```

### Mock data in api.js
- `delay(ms = 300)` — async sleep for mock latency
- `mockUsers` — 6 hardcoded users (m1-m6)
- `getProviderAppByUserId(userId)` — always returns null

---

## localStorage Keys

| Key | Type | Used By | Purpose |
|-----|------|---------|---------|
| `servico_user` | JSON `{id,name,email,phone,role}` | AuthContext | Current session |
| `servico_registered_users` | JSON array | AuthContext, AdminUsersPage | All registered users |
| `servico_admin_password` | string | AuthContext | Admin password override |
| `access_token` | string | api.js | JWT access token |
| `refresh_token` | string | api.js | JWT refresh token |

---

## Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@servico.com | admin123 (default, changeable via Settings) |
| Provider (demo) | hafijur@gmail.com | sohan123 |

---

## Styling System

### Tailwind Config
- **Primary color**: `emerald-600` (#059669), `primary-dark` (#047857)
- **Shadows**: `soft` (card), `elevated` (modals), `glow` (primary elements)
- **Font**: `'Plus Jakarta Sans', sans-serif`
- **Currency**: BDT (৳)

### Custom CSS Classes (`index.css`)
- **`btn-primary`** — green gradient bg, rounded-2xl, white text, hover darken
- **`btn-secondary`** — white bg, border, shadow-soft
- **`input-field`** — white bg, border, rounded-xl, focus:ring-emerald

---

## Backend Models (Django)

### `users.User`
Extends `AbstractBaseUser + PermissionsMixin`. Fields: `email` (USERNAME_FIELD), `full_name`, `phone`, `role` (customer/provider/admin), `status` (active/suspended/banned), `avatar`, `referral_code`, `referred_by` (self FK), `is_active`, `is_staff`, `date_joined`.

### `services.Category`
Fields: `slug` (unique), `label`, `icon`, `image_url`, `is_active`, `sort_order`.

### `services.Service`
Fields: `category` (FK), `title`, `subtitle`, `icon`, `image_url`, `gallery` (JSON), `price`, `duration`, `description`, `long_description`, `includes` (JSON), `is_popular`, `badge`, `is_active`, `rating`, `review_count`, `provider_stats` (JSON), timestamps.

### `services.ServiceFAQ` / `ServiceProcessStep`
Ordered Q&A and process steps for each service.

### `bookings.Booking`
Fields: `customer` (FK User), `service` (FK Service), `provider` (FK ProviderApplication), contact info, schedule, price breakdown (service_charge, visiting_charge, urgent_fee, discount, vat, total), `status` (pending→confirmed→accepted→in_progress→completed/cancelled), `payment_method` (cash/bkash/nagad/card), `payment_status`.

### `providers.ProviderApplication`
Fields: `user` (OneToOneField User), contact info, `nid_number`, `experience_years`, `skills` (JSON), `bio`, `availability`, `status` (pending/approved/rejected/suspended), `reject_reason`, `avatar`, `total_jobs`, `total_earnings`, `average_rating`.

### `providers.ProviderEarning`
Fields: `provider` (FK), `week_label`, `amount`, `status`, period dates.

### `reviews.Review`
Fields: `customer` (FK User), `service` (FK Service), `booking` (OneToOneField Booking), `rating` (1-5), `text`, `status` (published/hidden/flagged).
Signals auto-update Service.rating and Service.review_count on save/delete.

### `promos.PromoCode`
Fields: `code` (unique), `type` (percent/flat), `value`, `min_order`, `max_uses`, `used_count`, `expiry`, `status`. Method: `is_valid()`.

### `payments.Payment`
Fields: `booking` (OneToOneField), `customer` (FK), `method`, `amount`, `status`, gateway IDs/responses.

---

## Key Flows

### User Registration → Admin Users Page (localStorage-only)
1. User fills `/register` form → `AuthContext.signUp(email, password, fullName, phone)`
2. New user object saved to `localStorage("servico_registered_users")`
3. User auto-logged in, redirected to `/`
4. Admin logs in → navigates to `/admin/users`
5. `AdminUsersPage` calls `fetchMockUsers()` which reads localStorage + merges with mock array
6. Registered users appear first with blue "New" badge

### Provider Flow
1. User registers → navigates to `/become-provider`
2. Submits application → `submitProviderApplication(data)` → POST to backend
3. Admin sees application in `/admin/providers` → approves/rejects
4. Provider accesses `/provider/*` dashboard

### Booking Flow
1. User finds service → clicks "Book Now" → `/booking/:id`
2. Fills contact, schedule, promo code, payment method
3. Submits → `createBooking(data)` → POST to backend
4. Booking appears in user's `/dashboard/bookings` and admin's `/admin/bookings`

---

## Seed Data

Running `python manage.py seed_data` creates:
- 20 categories (AC Repair, Cleaning, Beauty, Electrical, Plumbing, etc.)
- 20 services with descriptions, pricing, and "includes" lists
- 4 promo codes (WELCOME20, FLAT100, SAVE50, PRO10)
- 1 admin superuser: `admin@servico.com` / `admin123`

---

## Scripts

### Frontend
```bash
npm run dev       # Start Vite dev server (port 5173)
npm run build     # Production build
npm run preview   # Preview production build
```

### Backend
```bash
python manage.py runserver
python manage.py migrate
python manage.py seed_data
python manage.py createsuperuser
```

---

## Notes

- The frontend's `src/routes/Router.jsx` and `src/layout/Root.jsx` / `src/components/ui/Header/` / `src/components/ui/Footer/` / `src/pages/frontend/` are **legacy/unused** — they were from an older routing approach.
- The active routing is entirely in `App.jsx` using `react-router-dom` v6.
- The frontend auth and user management are **localStorage-based** (no backend calls for auth). The API functions like `apiLogin`, `apiRegister` exist but aren't used by `AuthContext`.
- The backend has full bKash and Nagad payment gateway integrations (sandbox mode).
- All prices are in BDT (৳). Timezone is Asia/Dhaka.
