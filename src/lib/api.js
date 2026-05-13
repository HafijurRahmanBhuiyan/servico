const BASE_URL = 'http://localhost:8000/api';

// ─── Auth token helpers ────────────────────────────────────────────────────

function getToken() {
  return localStorage.getItem('access_token');
}

function setTokens(access, refresh) {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
}

function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('servico_user');
}

async function refreshAccessToken() {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) return null;
  const res = await fetch(`${BASE_URL}/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) { clearTokens(); return null; }
  const data = await res.json();
  localStorage.setItem('access_token', data.access);
  return data.access;
}

async function authFetch(url, options = {}) {
  let token = getToken();
  const isFormData = options.body instanceof FormData;
  const headers = { ...(isFormData ? {} : { 'Content-Type': 'application/json' }), ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  let res = await fetch(url, { ...options, headers });
  if (res.status === 401) {
    token = await refreshAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      res = await fetch(url, { ...options, headers });
    }
  }
  return res;
}

// ─── Auth ─────────────────────────────────────────────────────────────────

export async function apiLogin(email, password) {
  const res = await fetch(`${BASE_URL}/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) return { error: data.detail || 'Login failed' };
  setTokens(data.access, data.refresh);
  localStorage.setItem('servico_user', JSON.stringify(data.user));
  return { error: null, user: data.user };
}

export async function apiRegister(email, password, fullName, phone, referralCode = '') {
  const res = await fetch(`${BASE_URL}/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, full_name: fullName, phone, referral_code_used: referralCode }),
  });
  const data = await res.json();
  if (!res.ok) return { error: Object.values(data).flat().join(' ') };
  return { error: null };
}

export async function apiForgotPassword(email) {
  console.log('Password reset for:', email);
  return { error: null };
}

// ─── Categories ───────────────────────────────────────────────────────────

export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/categories/`);
  const data = await res.json();
  return data.results || data;
}

// ─── Services ─────────────────────────────────────────────────────────────

export async function fetchServices({ popular, categorySlug } = {}) {
  const params = new URLSearchParams();
  if (popular) params.set('is_popular', 'true');
  if (categorySlug) params.set('category__slug', categorySlug);
  const res = await fetch(`${BASE_URL}/services/?${params}`);
  const data = await res.json();
  return data.results || data;
}

export async function fetchServiceById(id) {
  const res = await fetch(`${BASE_URL}/services/${id}/`);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchServiceReviews(serviceId) {
  const res = await fetch(`${BASE_URL}/services/${serviceId}/reviews/`);
  const data = await res.json();
  return data.results || data;
}

// ─── Promo Codes ──────────────────────────────────────────────────────────

export async function validatePromoCode(code, orderTotal = 0) {
  const res = await authFetch(`${BASE_URL}/promos/validate/`, {
    method: 'POST',
    body: JSON.stringify({ code, order_total: orderTotal }),
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error || 'Invalid promo code' };
  return data;
}

// ─── Bookings ─────────────────────────────────────────────────────────────

export async function createBooking(data) {
  const res = await authFetch(`${BASE_URL}/bookings/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) return { error: Object.values(json).flat().join(' ') };
  return { error: null, booking: json };
}

export async function fetchUserBookings() {
  const res = await authFetch(`${BASE_URL}/bookings/my/`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || data;
}

// ─── Provider Application ─────────────────────────────────────────────────

export async function submitProviderApplication(data) {
  const hasFile = data.nid_file instanceof File;
  const body = hasFile ? (() => {
    const fd = new FormData();
    fd.append('full_name', data.full_name);
    fd.append('phone', data.phone);
    fd.append('nid_number', data.nid);
    fd.append('address', data.address);
    fd.append('experience_years', data.experience_years);
    fd.append('skills', JSON.stringify(data.skills));
    fd.append('bio', data.bio);
    fd.append('availability', data.availability);
    fd.append('nid_file', data.nid_file);
    return fd;
  })() : JSON.stringify({
    full_name: data.full_name,
    phone: data.phone,
    nid_number: data.nid,
    address: data.address,
    experience_years: data.experience_years,
    skills: data.skills,
    bio: data.bio,
    availability: data.availability,
  });

  const res = await authFetch(`${BASE_URL}/provider/application/`, {
    method: 'POST',
    body,
  });
  const json = await res.json();
  if (!res.ok) return { error: Object.values(json).flat().join(' ') };
  return { error: null };
}

export async function getProviderApplication() {
  const res = await authFetch(`${BASE_URL}/provider/application/`);
  if (!res.ok) return null;
  return res.json();
}

// ─── bKash Payment ────────────────────────────────────────────────────────

export async function initiateBkashPayment(bookingId) {
  const res = await authFetch(`${BASE_URL}/payments/bkash/initiate/`, {
    method: 'POST',
    body: JSON.stringify({ booking_id: bookingId }),
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error || 'bKash initiation failed' };
  return data;
}

// ─── Nagad Payment ────────────────────────────────────────────────────────

export async function initiateNagadPayment(bookingId) {
  const res = await authFetch(`${BASE_URL}/payments/nagad/initiate/`, {
    method: 'POST',
    body: JSON.stringify({ booking_id: bookingId }),
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error || 'Nagad initiation failed' };
  return data;
}

export async function fetchMyProviderApplication() {
  const res = await authFetch(`${BASE_URL}/provider/application/`);
  if (!res.ok) return null;
  return res.json();
}

// ─── Admin APIs ───────────────────────────────────────────────────────────

export async function fetchAdminStats() {
  const res = await authFetch(`${BASE_URL}/admin/stats/`);
  return res.json();
}

export async function fetchMockUsers() {
  const res = await authFetch(`${BASE_URL}/admin/users/`);
  if (!res.ok) return [];
  const data = await res.json();
  const list = data.results || data;
  return list.map((u) => ({
    ...u,
    name: u.full_name,
    joined_at: u.date_joined?.slice(0, 10),
    source: "registered",
  }));
}

export async function updateUserStatus(id, status) {
  const res = await authFetch(`${BASE_URL}/admin/users/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function fetchProviderApplications() {
  const res = await authFetch(`${BASE_URL}/admin/providers/`);
  const data = await res.json();
  return data.results || data;
}

export async function updateProviderStatus(id, status, rejectReason = '') {
  const res = await authFetch(`${BASE_URL}/admin/providers/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({ status, reject_reason: rejectReason }),
  });
  return res.json();
}

export async function fetchAdminBookings() {
  const res = await authFetch(`${BASE_URL}/admin/bookings/`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || data;
}

export async function fetchMockPayments() {
  const res = await authFetch(`${BASE_URL}/admin/payments/`);
  const data = await res.json();
  return data.results || data;
}

export async function updatePaymentStatus(id, status) {
  const res = await authFetch(`${BASE_URL}/admin/payments/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function fetchMockReviews() {
  const res = await authFetch(`${BASE_URL}/admin/reviews/`);
  const data = await res.json();
  return data.results || data;
}

export async function updateReviewStatus(id, status) {
  const res = await authFetch(`${BASE_URL}/admin/reviews/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function deleteReview(id) {
  await authFetch(`${BASE_URL}/admin/reviews/${id}/`, { method: 'DELETE' });
}

export async function fetchPromos() {
  const res = await authFetch(`${BASE_URL}/admin/promos/`);
  const data = await res.json();
  return data.results || data;
}

export async function addPromo(data) {
  const res = await authFetch(`${BASE_URL}/admin/promos/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updatePromoStatus(code, status) {
  const res = await authFetch(`${BASE_URL}/admin/promos/${code}/`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function deletePromo(code) {
  await authFetch(`${BASE_URL}/admin/promos/${code}/`, { method: 'DELETE' });
}

// ─── Provider Dashboard APIs ──────────────────────────────────────────────

export async function fetchProviderBookings() {
  const res = await authFetch(`${BASE_URL}/provider/jobs/`);
  const data = await res.json();
  return data.results || data;
}

export async function updateProviderBookingStatus(bookingId, status) {
  const res = await authFetch(`${BASE_URL}/provider/jobs/${bookingId}/status/`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function fetchProviderEarnings() {
  const res = await authFetch(`${BASE_URL}/provider/earnings/`);
  return res.json();
}

export async function fetchProviderReviews() {
  const res = await authFetch(`${BASE_URL}/services/`);
  return [];
}
