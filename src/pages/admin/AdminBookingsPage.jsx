import { useState, useEffect } from "react";
import { Search, Download } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { fetchProviderApplications } from "@/lib/api";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-600",
};

const STATUS_TABS = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [providers, setProviders] = useState([]);
  const [statusTab, setStatusTab] = useState("All");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("servico_bookings") || "[]");
    setBookings(stored);
    fetchProviderApplications().then((apps) =>
      setProviders(apps.filter((a) => a.status === "approved"))
    );
  }, []);

  const filtered = bookings.filter((b) => {
    const statusMatch = statusTab === "All" || b.status === statusTab.toLowerCase();
    const q = search.toLowerCase();
    const textMatch =
      !q ||
      (b.service?.title || "").toLowerCase().includes(q) ||
      (b.customer_name || b.name || "").toLowerCase().includes(q);
    const fromMatch = !dateFrom || (b.scheduled_date || b.date || "") >= dateFrom;
    const toMatch = !dateTo || (b.scheduled_date || b.date || "") <= dateTo;
    return statusMatch && textMatch && fromMatch && toMatch;
  });

  const totalRevenue = filtered
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + (b.total_amount || 0), 0);

  const handleStatusChange = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    const allBookings = JSON.parse(localStorage.getItem("servico_bookings") || "[]");
    const updated = allBookings.map((b) =>
      b.id === id ? { ...b, status: newStatus } : b
    );
    localStorage.setItem("servico_bookings", JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="mt-1 text-sm text-gray-500">Manage all service bookings</p>
        </div>
        <button onClick={() => alert("Export feature coming soon")} className="btn-secondary">
          <Download className="mr-1.5 h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input className="input-field pl-9" placeholder="Search customer or service..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <input type="date" className="input-field w-auto" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        <input type="date" className="input-field w-auto" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setStatusTab(t)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold transition",
              statusTab === t
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="px-5 py-3">#</th>
              <th className="px-5 py-3">Service</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Provider</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Time</th>
              <th className="px-5 py-3">Address</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={10} className="px-5 py-12 text-center text-gray-400">No bookings found</td></tr>
            )}
            {filtered.map((b, idx) => (
              <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-5 py-3 text-gray-400">{idx + 1}</td>
                <td className="px-5 py-3 font-medium">{b.service?.title || "—"}</td>
                <td className="px-5 py-3 text-gray-500">{b.customer_name || b.name || "—"}</td>
                <td className="px-5 py-3 text-gray-500">{b.provider_name || "—"}</td>
                <td className="px-5 py-3 text-gray-500">{b.scheduled_date || b.date || "—"}</td>
                <td className="px-5 py-3 text-gray-500">{b.scheduled_time || "—"}</td>
                <td className="px-5 py-3 text-gray-500 max-w-[120px] truncate">{b.address || "—"}</td>
                <td className="px-5 py-3">
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold capitalize", statusStyles[b.status] || "bg-gray-100 text-gray-600")}>
                    {b.status}
                  </span>
                </td>
                <td className="px-5 py-3 font-semibold text-primary">{formatPrice(b.total_amount || 0)}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-1.5">
                    {b.status === "pending" && (
                      <select
                        className="rounded-lg border border-gray-200 px-2 py-1 text-xs"
                        onChange={(e) => {
                          if (e.target.value) {
                            setBookings((prev) =>
                              prev.map((bb) =>
                                bb.id === b.id ? { ...bb, provider_name: e.target.value } : bb
                              )
                            );
                          }
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>Assign...</option>
                        {providers.map((p) => (
                          <option key={p.id} value={p.full_name}>{p.full_name}</option>
                        ))}
                      </select>
                    )}
                    {b.status === "confirmed" && (
                      <button onClick={() => handleStatusChange(b.id, "completed")} className="rounded-lg bg-emerald-600 px-2 py-1 text-xs font-semibold text-white hover:bg-emerald-700">
                        Complete
                      </button>
                    )}
                    {(b.status === "pending" || b.status === "confirmed") && (
                      <button onClick={() => handleStatusChange(b.id, "cancelled")} className="rounded-lg border border-red-300 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">
                        Cancel
                      </button>
                    )}
                    <button onClick={() => setExpandedId(expandedId === b.id ? null : b.id)} className="btn-secondary text-xs px-2 py-1">
                      {expandedId === b.id ? "Close" : "Details"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expanded details */}
      {expandedId && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-soft">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Booking Details</h3>
          {(() => {
            const b = bookings.find((x) => x.id === expandedId);
            if (!b) return null;
            return (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Notes:</span> <span className="text-gray-700">{b.notes || "N/A"}</span></div>
                <div><span className="text-gray-500">Payment Method:</span> <span className="text-gray-700">{b.payment_method || "N/A"}</span></div>
                <div><span className="text-gray-500">Promo Code:</span> <span className="text-gray-700">{b.promo_code || "None"}</span></div>
                <div><span className="text-gray-500">Amount:</span> <span className="font-semibold text-primary">{formatPrice(b.total_amount || 0)}</span></div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Summary */}
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-soft">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Total Revenue (filtered):</span>
          <span className="text-lg font-bold text-primary">{formatPrice(totalRevenue)}</span>
        </div>
      </div>
    </div>
  );
}
