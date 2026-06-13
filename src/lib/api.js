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

function toFormData(data) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null) continue;
    if (k === 'includes' || k === 'gallery' || k === 'provider_stats') {
      fd.append(k, JSON.stringify(v));
    } else {
      fd.append(k, v);
    }
  }
  return fd;
}

function hasFile(data) {
  return Object.values(data).some((v) => v instanceof File || v instanceof Blob);
}

export async function createService(data) {
  const body = hasFile(data) ? toFormData(data) : JSON.stringify(data);
  const res = await authFetch(`${BASE_URL}/services/`, {
    method: 'POST',
    body,
  });
  const json = await res.json();
  if (!res.ok) return { error: Object.values(json).flat().join(' ') };
  return json;
}

export async function updateService(id, data) {
  const body = hasFile(data) ? toFormData(data) : JSON.stringify(data);
  const res = await authFetch(`${BASE_URL}/services/${id}/`, {
    method: 'PATCH',
    body,
  });
  const json = await res.json();
  if (!res.ok) return { error: Object.values(json).flat().join(' ') };
  return json;
}

export async function deleteService(id) {
  const res = await authFetch(`${BASE_URL}/services/${id}/`, {
    method: 'DELETE',
  });
  if (!res.ok) return { error: 'Delete failed' };
  return {};
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
  const hasNid = data.nid_file instanceof File;
  const hasPic = data.profile_picture instanceof File;
  const body = (hasNid || hasPic) ? (() => {
    const fd = new FormData();
    fd.append('full_name', data.full_name);
    fd.append('phone', data.phone);
    fd.append('nid_number', data.nid);
    fd.append('address', data.address);
    fd.append('experience_years', data.experience_years);
    fd.append('skills', JSON.stringify(data.skills));
    fd.append('bio', data.bio);
    fd.append('availability', data.availability);
    if (hasNid) fd.append('nid_file', data.nid_file);
    if (hasPic) fd.append('avatar', data.profile_picture);
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

export async function completePayment(bookingId, method, phone = "", status = "paid") {
  const res = await authFetch(`${BASE_URL}/payments/complete/`, {
    method: 'POST',
    body: JSON.stringify({ booking_id: bookingId, method, phone, status }),
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error || 'Payment completion failed' };
  return data;
}

export async function fetchMyProviderApplication() {
  const res = await authFetch(`${BASE_URL}/provider/application/`);
  if (!res.ok) return null;
  return res.json();
}

export async function updateProviderApplication(data) {
  const res = await authFetch(`${BASE_URL}/provider/application/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) return { error: Object.values(json).flat().join(' ') };
  return json;
}

export async function updateProviderAvatar(file) {
  const fd = new FormData();
  fd.append('avatar', file);
  const res = await authFetch(`${BASE_URL}/provider/application/`, {
    method: 'PATCH',
    body: fd,
  });
  const json = await res.json();
  if (!res.ok) return { error: Object.values(json).flat().join(' ') };
  return json;
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

export async function assignBookingProvider(bookingId, providerId) {
  const res = await authFetch(`${BASE_URL}/admin/bookings/${bookingId}/`, {
    method: 'PATCH',
    body: JSON.stringify({ provider: providerId, status: 'assigned' }),
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error || data.detail || 'Failed to assign provider' };
  return data;
}

export async function updateBookingStatus(bookingId, status) {
  const res = await authFetch(`${BASE_URL}/admin/bookings/${bookingId}/`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error || data.detail || 'Failed to update status' };
  return data;
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
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : data.results || [];
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
  if (!res.ok) return null;
  return res.json();
}

export async function fetchProviderReviews(providerId) {
  const res = await authFetch(`${BASE_URL}/providers/${providerId}/reviews/`);
  const data = await res.json();
  return data.results || data;
}

export async function fetchProviderProfile(providerId) {
  const res = await fetch(`${BASE_URL}/providers/${providerId}/`);
  if (!res.ok) return null;
  return res.json();
}

export async function submitReview(data) {
  const res = await authFetch(`${BASE_URL}/reviews/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) return { error: Object.values(json).flat().join(' ') };
  return json;
}

// ─── Chat / Messaging ─────────────────────────────────────────────────────

export async function fetchMessages(bookingId) {
  const res = await authFetch(`${BASE_URL}/chat/${bookingId}/messages/`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || data;
}

export async function sendMessage(bookingId, message) {
  const res = await authFetch(`${BASE_URL}/chat/${bookingId}/messages/`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
  return res.json();
}

export async function markMessagesRead(bookingId) {
  await authFetch(`${BASE_URL}/chat/${bookingId}/mark-read/`, {
    method: 'PATCH',
  });
}

export async function fetchConversations() {
  const res = await authFetch(`${BASE_URL}/chat/conversations/`);
  if (!res.ok) return [];
  return res.json();
}

// ─── Site Settings ─────────────────────────────────────────────────────────

export async function fetchSiteSettings() {
  const res = await authFetch(`${BASE_URL}/admin/settings/`);
  return res.json();
}

export async function updateSiteSettings(data) {
  const res = await authFetch(`${BASE_URL}/admin/settings/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.json();
}
