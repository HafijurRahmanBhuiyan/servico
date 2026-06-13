# Servico — Home Services Marketplace

A full-stack home services marketplace connecting customers with local service providers. Customers can browse services, book appointments, make payments via **bKash / Nagad / Cash**, and leave reviews. Providers manage jobs, earnings, and schedules. Administrators oversee users, providers, bookings, transactions, and site settings from a dedicated dashboard.

---

## Features

### For Customers
- Browse services by category
- Book appointments with date/time selection and urgent scheduling
- Pay via **bKash** (OTP flow), **Nagad** (OTP flow), **Bank Transfer**, or **Cash**
- Apply promo codes for discounts
- Track booking status in the customer dashboard
- Leave reviews and ratings after service completion
- Chat with assigned providers

### For Providers
- Submit a provider application with NID verification, skills, and experience
- View and manage assigned jobs with status updates (accept, start, complete)
- Schedule management
- Track earnings with weekly breakdowns
- Respond to customer reviews
- Customize profile, avatar, and availability

### For Administrators
- Full admin dashboard with analytics (revenue, bookings, users, providers)
- Manage users, providers, services, categories, and promos
- View and filter all bookings with provider assignment via skill-matching UI
- Process payments with method-specific transaction cards (bKash, Nagad, Bank, Cash)
- Manage reviews (publish, hide, flag, delete)
- Site settings (visiting fee, VAT, tax rates, payment accounts)

---

## Tech Stack

| Layer       | Technology                                                  |
|-------------|-------------------------------------------------------------|
| **Frontend**  | React 18, Vite 7, Tailwind CSS 3, react-router-dom 6, lucide-react |
| **Backend**   | Django 4.2, Django REST Framework 3.15, JWT Auth (SimpleJWT) |
| **Database**  | PostgreSQL                                                  |
| **Payments**  | bKash Tokenized Checkout API, Nagad Payment Gateway API     |
| **Async**     | Celery + Redis (ready, not yet wired)                       |
| **Styling**   | Tailwind CSS with custom shadows, gradients, Jakarta Sans font |

---

## Project Structure

```
servico/
├── backend/                         # Django REST API
│   ├── config/                      # Settings, URLs, ASGI/WSGI
│   ├── users/                       # Custom user model, auth endpoints
│   ├── services/                    # Categories & services catalog
│   ├── bookings/                    # Booking lifecycle
│   ├── payments/                    # Payment models, gateway integrations
│   │   ├── bkash.py                 # bKash API client
│   │   └── nagad.py                 # Nagad API client
│   ├── providers/                   # Provider applications & earnings
│   ├── reviews/                     # Customer reviews
│   ├── chat/                        # Booking messaging
│   ├── promos/                      # Promo codes
│   └── admin_dashboard/             # Admin analytics & site settings
├── src/                             # React frontend
│   ├── lib/
│   │   ├── api.js                   # API client with JWT auto-refresh
│   │   ├── AuthContext.jsx          # Auth state management
│   │   └── utils.js                 # Helpers (cn, formatPrice, getAvatarUrl)
│   ├── components/
│   │   ├── layout/                  # Navbar, Footer
│   │   ├── services/                # ServiceCard, CategoryTile
│   │   ├── ChatBox.jsx
│   │   └── ProviderAvatar.jsx
│   └── pages/
│       ├── admin/                   # 11 admin dashboard pages
│       ├── provider/                # 9 provider portal pages
│       ├── dashboard/               # Customer booking dashboard
│       └── ...                      # Public pages (Home, Services, Booking, etc.)
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.10+ and **pip**
- **PostgreSQL** 14+
- A **bKash** merchant account (sandbox) and/or **Nagad** merchant account (optional for payment features)

---

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Create the PostgreSQL database
createdb servico_db

# 5. Configure environment variables
cp .env.example .env   # (create one if not present)
# Edit .env with your database credentials and payment gateway keys

# 6. Run migrations
python manage.py migrate

# 7. Create a superuser
python manage.py createsuperuser

# 8. Start the development server
python manage.py runserver
```

The backend API will be available at `http://localhost:8000/api/`.

---

### Frontend Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the Vite dev server
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

### Environment Variables

`backend/.env`:

```env
SECRET_KEY=your-django-secret-key
DEBUG=True

# Database
DB_NAME=servico_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# bKash Payment Gateway (sandbox)
BKASH_APP_KEY=your-bkash-app-key
BKASH_APP_SECRET=your-bkash-app-secret
BKASH_USERNAME=your-bkash-username
BKASH_PASSWORD=your-bkash-password
BKASH_BASE_URL=https://tokenized.sandbox.bka.sh/v1.2.0-beta

# Nagad Payment Gateway (sandbox)
NAGAD_MERCHANT_ID=your-nagad-merchant-id
NAGAD_MERCHANT_PRIVATE_KEY=your-nagad-private-key
NAGAD_BASE_URL=https://sandbox.mynagad.com:10080/remote-payment-gateway-1.0
```

---

## API Overview

The API is organized under `/api/` with JWT authentication. Key endpoints:

| Endpoint                      | Description                        |
|-------------------------------|------------------------------------|
| `POST /api/login/`            | Login, returns JWT tokens          |
| `POST /api/register/`         | Register a new customer account    |
| `GET /api/categories/`        | List service categories            |
| `GET /api/services/`          | List services (filterable)         |
| `GET /api/services/:id/`      | Service details with FAQ & steps   |
| `POST /api/bookings/`         | Create a booking                   |
| `GET /api/bookings/my/`       | Current user's bookings            |
| `POST /api/payments/bkash/initiate/` | Initiate a bKash payment    |
| `POST /api/payments/nagad/initiate/` | Initiate a Nagad payment    |
| `POST /api/payments/complete/` | Complete a payment                 |
| `POST /api/provider/application/` | Submit provider application    |
| `GET /api/admin/stats/`       | Admin dashboard statistics         |
| `GET /api/admin/bookings/`    | Admin: all bookings                |
| `GET /api/admin/payments/`    | Admin: all payments                |

See `src/lib/api.js` for the full list of API client functions.

---

## Payment Gateways

- **bKash**: Tokenized Checkout API with OTP verification flow. Users enter their bKash account number and PIN, receive an OTP, and confirm payment.
- **Nagad**: Remote Payment Gateway with similar OTP flow.
- **Cash**: On-delivery payment with no gateway integration.
- **Bank Transfer**: Manual bank transfer with reference tracking.

Gateway credentials are configured in `backend/.env` and integrated via `backend/payments/bkash.py` and `backend/payments/nagad.py`.

---

## License

MIT
