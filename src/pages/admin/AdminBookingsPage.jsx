import { useState, useEffect, useCallback } from "react";
import { Search, Download, RefreshCw, Calendar, Phone, X, Mail, MapPin, User } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { fetchAdminBookings, fetchProviderApplications, assignBookingProvider, updateBookingStatus, fetchCategories } from "@/lib/api";

const STATUS_TABS = ["All", "Pending", "Assigned", "Confirmed", "Completed", "Cancelled"];

const statusStyles = {
  pending:   "bg-amber-50 text-amber-700",
  assigned:  "bg-indigo-50 text-indigo-700",
  confirmed: "bg-blue-50 text-blue-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-600",
};

const paymentMethodLabel = {
  cash:  "💵 Cash",
  bkash: "📱 bKash",
  nagad: "💳 Nagad",
  card:  "🏦 Card",
};

// ── helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        statusStyles[status] ?? "bg-gray-100 text-gray-600"
      )}
    >
      {status ?? "—"}
    </span>
  );
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4 shadow-soft",
        accent
          ? "border-emerald-100 bg-gradient-to-br from-emerald-600 to-emerald-500 text-white"
          : "border-gray-200 bg-white"
      )}
    >
      <div className={cn("text-2xl font-black", accent ? "text-white" : "text-gray-900")}>
        {value}
      </div>
      <div className={cn("mt-0.5 text-xs font-medium", accent ? "text-emerald-100" : "text-gray-500")}>
        {label}
      </div>
      {sub && (
        <div className={cn("mt-1 text-xs", accent ? "text-emerald-200" : "text-gray-400")}>
          {sub}
        </div>
      )}
    </div>
  );
}

function Toast({ message }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-elevated">
      {message}
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export default function AdminBookingsPage() {
  const [bookings, setBookings]     = useState([]);
  const [providers, setProviders]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [statusTab, setStatusTab]   = useState("All");
  const [search, setSearch]         = useState("");
  const [dateFrom, setDateFrom]     = useState("");
  const [dateTo, setDateTo]         = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [assigningId, setAssigningId] = useState(null);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [toast, setToast] = useState(null);

  // ── load data ────────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    const [bkgs, apps, cats] = await Promise.all([
      fetchAdminBookings(),
      fetchProviderApplications(),
      fetchCategories(),
    ]);
    setBookings(bkgs);
    setProviders(Array.isArray(apps) ? apps.filter((a) => a.status === "approved") : []);
    setCategories(Array.isArray(cats) ? cats : []);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── filtering ─────────────────────────────────────────────────────────────
  const filtered = bookings.filter((b) => {
    const tabMatch =
      statusTab === "All" || b.status === statusTab.toLowerCase();

    const q = search.toLowerCase();
    const textMatch =
      !q ||
      (b.service?.title  ?? "").toLowerCase().includes(q) ||
      (b.customer_name   ?? "").toLowerCase().includes(q) ||
      (b.phone           ?? "").includes(q) ||
      (b.address         ?? "").toLowerCase().includes(q);

    const fromMatch = !dateFrom || (b.scheduled_date ?? "") >= dateFrom;
    const toMatch   = !dateTo   || (b.scheduled_date ?? "") <= dateTo;

    return tabMatch && textMatch && fromMatch && toMatch;
  });

  // ── stats ──────────────────────────────────────────────────────────────────
  const totalRevenue   = bookings.filter((b) => b.status === "completed").reduce((s, b) => s + (b.total_amount ?? 0), 0);
  const pendingCount   = bookings.filter((b) => b.status === "pending").length;
  const completedCount = bookings.filter((b) => b.status === "completed").length;

  // ── status change (persisted to backend) ──────────────────────────────────
  const handleStatusChange = async (id, newStatus) => {
    setToast(null);
    const result = await updateBookingStatus(id, newStatus);
    if (result.error) {
      setToast(result.error);
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setBookings((prev) => prev.map((b) => (b.id === id ? result : b)));
    setToast(`Status updated to "${newStatus}"`);
    setTimeout(() => setToast(null), 3000);
  };

  // ── assign provider ───────────────────────────────────────────────────────
  const handleAssignProvider = async (bookingId, providerId) => {
    setAssigningId(null);
    setToast(null);
    const result = await assignBookingProvider(bookingId, providerId);
    if (result.error) {
      setToast(result.error);
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? result : b)));
    setToast(`Assigned: ${result.provider_name || "Provider assigned"}`);
    setTimeout(() => setToast(null), 3000);
  };

  // ── export CSV ─────────────────────────────────────────────────────────────
  const exportCSV = () => {
    const headers = [
      "ID", "Service", "Customer", "Phone", "Address",
      "Date", "Time", "Status", "Payment Method",
      "Service Charge", "Visiting Charge", "Discount", "VAT", "Total",
      "Promo Code", "Provider", "Created At",
    ];
    const rows = filtered.map((b) => [
      b.id,
      b.service?.title ?? "",
      b.customer_name ?? "",
      b.phone ?? "",
      (b.address ?? "").replace(/,/g, " "),
      b.scheduled_date ?? "",
      b.scheduled_time ?? "",
      b.status ?? "",
      b.payment_method ?? "",
      b.service_charge ?? 0,
      b.visiting_charge ?? 0,
      b.discount_amount ?? 0,
      b.vat ?? 0,
      b.total_amount ?? 0,
      b.promo_code ?? "",
      b.provider_name ?? "",
      b.created_at ?? "",
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {toast && <Toast message={toast} />}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            All customer bookings — saved when a user confirms a service
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="btn-secondary flex items-center gap-1.5 px-3 py-2 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
          <button
            onClick={exportCSV}
            className="btn-secondary flex items-center gap-1.5 px-3 py-2 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total bookings"    value={bookings.length}  />
        <StatCard label="Pending"           value={pendingCount}     sub="awaiting action" />
        <StatCard label="Completed"         value={completedCount}   sub="finished jobs" />
        <StatCard label="Total revenue"     value={formatPrice(totalRevenue)} accent sub="completed only" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-48 flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            className="input-field pl-9"
            placeholder="Search customer, service, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <input
            type="date"
            className="input-field w-auto text-sm"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <span className="text-gray-400 text-xs">to</span>
          <input
            type="date"
            className="input-field w-auto text-sm"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
          {filtered.length} booking{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((t) => {
          const count =
            t === "All"
              ? bookings.length
              : bookings.filter((b) => b.status === t.toLowerCase()).length;
          return (
            <button
              key={t}
              onClick={() => setStatusTab(t)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition",
                statusTab === t
                  ? "bg-emerald-600 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              )}
            >
              {t}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  statusTab === t ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft">
        {loading ? (
          <div className="divide-y divide-gray-100">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="h-3 w-6 animate-pulse rounded bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-40 animate-pulse rounded bg-gray-200" />
                  <div className="h-2.5 w-28 animate-pulse rounded bg-gray-100" />
                </div>
                <div className="h-6 w-16 animate-pulse rounded-full bg-gray-100" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <span className="text-4xl">📋</span>
                        <span className="text-sm">
                          {search || statusTab !== "All" || dateFrom || dateTo
                            ? "No bookings match your filters"
                            : "No bookings yet — they will appear here when users book a service"}
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
                {filtered.map((b, idx) => (
                  <>
                    <tr
                      key={b.id}
                      className={cn(
                        "border-b border-gray-50 transition hover:bg-gray-50/60",
                        expandedId === b.id && "bg-emerald-50/30"
                      )}
                    >
                      {/* # */}
                      <td className="px-4 py-3 text-xs text-gray-400 font-mono">
                        {idx + 1}
                      </td>

                      {/* Service */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{b.service?.icon ?? "🛠️"}</span>
                          <div>
                            <div className="font-medium text-gray-900 leading-tight">
                              {b.service?.title ?? "—"}
                            </div>
                            {b.is_urgent && (
                              <span className="text-[10px] font-semibold text-amber-600">
                                ⚡ Urgent
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3">
                        <button onClick={() => setCustomerProfile(b)} className="font-medium text-gray-900 leading-tight hover:text-emerald-600 transition text-left">
                          {b.customer_name || "—"}
                        </button>
                        <div className="text-xs text-gray-400">{b.phone || ""}</div>
                      </td>

                      {/* Date & Time */}
                      <td className="px-4 py-3 text-gray-500">
                        <div className="text-xs font-medium">{b.scheduled_date || "—"}</div>
                        <div className="text-xs text-gray-400">{b.scheduled_time || ""}</div>
                      </td>

                      {/* Payment method */}
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {paymentMethodLabel[b.payment_method] ?? b.payment_method ?? "—"}
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3 font-semibold text-emerald-700">
                        {formatPrice(b.total_amount ?? 0)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge status={b.status} />
                      </td>

                      {/* Provider */}
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {b.provider_name ?? (
                          <span className="text-gray-300">Unassigned</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-1.5">

                          {/* Assign provider (only when pending) */}
                          {b.status === "pending" && (
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setAssigningId(assigningId === b.id ? null : b.id)
                                }
                                className="rounded-lg border border-gray-200 px-2 py-1 text-xs bg-white hover:bg-gray-50"
                              >
                                {assigningId === b.id ? "Cancel" : "Assign"}
                              </button>

                              {assigningId === b.id && (() => {
                                const serviceCat = b.service?.category;
                                const cat = categories.find((c) => c.id === serviceCat);
                                const catLabel = cat?.label?.toLowerCase() || "";
                                const serviceTitle = (b.service?.title || "").toLowerCase();
                                const hasTarget = catLabel || serviceTitle;
                                const matchingProviders = hasTarget
                                  ? providers.filter((p) =>
                                      Array.isArray(p.skills) &&
                                      p.skills.some((s) => {
                                        const skill = s.toLowerCase();
                                        return (catLabel && (skill === catLabel || skill.includes(catLabel) || catLabel.includes(skill))) ||
                                               (serviceTitle && (serviceTitle.includes(skill) || skill.includes(serviceTitle)));
                                      })
                                    )
                                  : providers;

                                return (
                                <>
                                  <div
                                    className="fixed inset-0 z-40 bg-black/50"
                                    onClick={() => setAssigningId(null)}
                                  />
                                  <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                                    <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white shadow-elevated max-h-[70vh] overflow-y-auto pointer-events-auto">
                                    {matchingProviders.length === 0 ? (
                                      <div className="p-4 text-center text-xs text-gray-400">
                                        {catLabel ? "No providers match this service category" : "No approved providers"}
                                      </div>
                                    ) : (
                                      <>
                                        <div className="sticky top-0 bg-white border-b border-gray-100 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                          {cat?.label || "Service"}: {b.service?.title ?? "—"}
                                        </div>
                                        {matchingProviders.map((p) => (
                                          <div
                                            key={p.id}
                                            className="group flex items-center gap-2 border-b border-gray-100 p-3 last:border-b-0"
                                          >
                                            <button
                                              onClick={() => handleAssignProvider(b.id, p.id)}
                                              className="flex-1 text-left"
                                            >
                                              <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-900 text-sm">
                                                  {p.full_name}
                                                </span>
                                                {p.experience_years && (
                                                  <span className="text-[11px] text-gray-400">
                                                    {p.experience_years} yrs
                                                  </span>
                                                )}
                                              </div>
                                              <div className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                                                {Array.isArray(p.skills) && p.skills.length > 0
                                                  ? `Skills: ${p.skills.join(", ")}`
                                                  : "No skills listed"}
                                              </div>
                                              {p.phone && (
                                                <div className="mt-0.5 text-xs text-gray-400">
                                                  📞 {p.phone}
                                                </div>
                                              )}
                                            </button>
                                            {p.phone && (
                                              <a
                                                href={`tel:${p.phone}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="shrink-0 rounded-lg border border-gray-200 bg-white p-2 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition"
                                                title={`Call ${p.full_name}`}
                                              >
                                                <Phone className="h-4 w-4" />
                                              </a>
                                            )}
                                          </div>
                                        ))}
                                      </>
                                    )}
                                  </div>
                                </div>
                                </>
                                );
                              })()}
                            </div>
                          )}

                          {/* Confirm */}
                          {(b.status === "pending" || b.status === "assigned") && (
                            <button
                              onClick={() => handleStatusChange(b.id, "confirmed")}
                              className="rounded-lg bg-blue-600 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                            >
                              Confirm
                            </button>
                          )}

                          {/* Complete */}
                          {b.status === "confirmed" && (
                            <button
                              onClick={() => handleStatusChange(b.id, "completed")}
                              className="rounded-lg bg-emerald-600 px-2 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                            >
                              Complete
                            </button>
                          )}

                          {/* Cancel */}
                          {(b.status === "pending" || b.status === "assigned" || b.status === "confirmed") && (
                            <button
                              onClick={() => handleStatusChange(b.id, "cancelled")}
                              className="rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                            >
                              Cancel
                            </button>
                          )}

                          {/* Details toggle */}
                          <button
                            onClick={() =>
                              setExpandedId(expandedId === b.id ? null : b.id)
                            }
                            className="btn-secondary px-2 py-1 text-xs"
                          >
                            {expandedId === b.id ? "Close" : "Details"}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {expandedId === b.id && (
                      <tr key={b.id + "_detail"} className="bg-emerald-50/20">
                        <td colSpan={9} className="px-6 py-4">
                          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3 lg:grid-cols-4">
                            <Detail label="Address"        value={b.address || "N/A"} />
                            <Detail label="Notes"          value={b.notes || "None"} />
                            <Detail label="Promo Code"     value={b.promo_code || "None"} />
                            <Detail label="Service Charge" value={formatPrice(b.service_charge ?? 0)} />
                            <Detail label="Visiting Fee"   value={formatPrice(b.visiting_charge ?? 0)} />
                            <Detail label="Urgent Fee"     value={formatPrice(b.urgent_fee ?? 0)} />
                            <Detail label="Discount"       value={formatPrice(b.discount_amount ?? 0)} />
                            <Detail label="VAT (5%)"       value={formatPrice(b.vat ?? 0)} />
                            <Detail label="Total"          value={formatPrice(b.total_amount ?? 0)} bold />
                            <Detail label="Payment"        value={paymentMethodLabel[b.payment_method] ?? b.payment_method ?? "—"} />
                            <Detail label="Payment Status" value={b.payment_status ?? "unpaid"} />
                            <Detail label="Booked At"      value={b.created_at ? new Date(b.created_at).toLocaleString("en-BD") : "—"} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Revenue footer */}
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-soft">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Revenue from filtered view (completed only):
          </span>
          <span className="text-lg font-bold text-emerald-700">
            {formatPrice(
              filtered
                .filter((b) => b.status === "completed")
                .reduce((s, b) => s + (b.total_amount ?? 0), 0)
            )}
          </span>
        </div>
      </div>

      {/* Customer Profile Modal */}
      {customerProfile && (() => {
        const c = customerProfile;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setCustomerProfile(null)}>
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-elevated" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Customer Profile</h3>
                <button onClick={() => setCustomerProfile(null)} className="rounded-lg p-1 hover:bg-gray-100"><X className="h-5 w-5" /></button>
              </div>
              <div className="flex flex-col items-center pb-4 border-b border-gray-100">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500 text-lg font-bold text-white">
                  {(c.customer_name || "U")[0]?.toUpperCase()}
                </div>
                <h2 className="mt-3 text-lg font-bold text-gray-900">{c.customer_name || "—"}</h2>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                  {c.customer_email ? (
                    <a href={`mailto:${c.customer_email}`} className="text-emerald-600 hover:underline truncate">{c.customer_email}</a>
                  ) : <span>—</span>}
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                  {c.phone ? (
                    <a href={`tel:${c.phone}`} className="text-emerald-600 hover:underline">{c.phone}</a>
                  ) : <span>—</span>}
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>{c.address || "—"}</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
                Customer ID: {c.customer ?? "—"} &middot; Booked: {c.scheduled_date || "—"}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function Detail({ label, value, bold }) {
  return (
    <div>
      <span className="text-gray-400">{label}: </span>
      <span className={cn("text-gray-700", bold && "font-bold text-emerald-700")}>
        {value}
      </span>
    </div>
  );
}
