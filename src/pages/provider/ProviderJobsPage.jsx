import { useState, useEffect } from "react";
import { Search, AlertTriangle } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { fetchProviderBookings, updateProviderBookingStatus } from "@/lib/api";

const TABS = ["New Requests", "Accepted", "Completed", "Cancelled"];

function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-elevated">
      {message}
    </div>
  );
}

export default function ProviderJobsPage() {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState("New Requests");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date");
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchProviderBookings("u2").then(setBookings); }, []);

  const tabKey = tab === "New Requests" ? "pending" : tab.toLowerCase();

  const filtered = bookings
    .filter((b) => b.status === tabKey)
    .filter((b) => !search || b.service_title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price") return b.amount - a.amount;
      return new Date(b.date) - new Date(a.date);
    });

  const handleAccept = async (id) => {
    await updateProviderBookingStatus(id, "accepted");
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "accepted" } : b)));
    setToast("Job accepted!");
    setTimeout(() => setToast(null), 3000);
  };

  const handleDecline = async (id) => {
    await updateProviderBookingStatus(id, "cancelled");
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
  };

  const handleComplete = async (id) => {
    await updateProviderBookingStatus(id, "completed");
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "completed" } : b)));
  };

  const maskName = (name) => {
    const parts = name.split(" ");
    if (parts.length >= 2) return parts[0] + " " + parts[1][0] + ".";
    return parts[0];
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Available Jobs</h1>
        <p className="mt-1 text-sm text-gray-500">Browse and manage your service requests</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold transition",
              tab === t ? "bg-emerald-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Search + Sort */}
      <div className="flex flex-wrap gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input className="input-field pl-9" placeholder="Search by service..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input-field w-auto" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="date">Date (newest)</option>
          <option value="price">Price (high-low)</option>
        </select>
      </div>

      {/* Job cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-gray-400">
            No {tab.toLowerCase()} jobs
          </div>
        )}
        {filtered.map((b) => (
          <div key={b.id} className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-soft">
            {b.is_urgent && (
              <span className="absolute -top-2 -right-2 flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
                <AlertTriangle className="h-3 w-3" /> URGENT
              </span>
            )}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                  {b.icon || "🛠️"}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{b.service_title}</h3>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                      Service
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">{maskName(b.customer_name)}</p>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-400">
                    <span>{b.date}</span>
                    <span>{b.time}</span>
                    <span>{b.area}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-lg font-bold text-primary">{formatPrice(b.amount)}</span>

                {tab === "New Requests" && (
                  <div className="flex gap-2">
                    <button onClick={() => handleAccept(b.id)} className="btn-primary text-sm px-4 py-1.5">Accept Job</button>
                    <button onClick={() => handleDecline(b.id)} className="btn-secondary text-sm px-4 py-1.5">Decline</button>
                  </div>
                )}

                {tab === "Accepted" && (
                  <div className="flex gap-2">
                    <button onClick={() => handleComplete(b.id)} className="btn-primary text-sm px-4 py-1.5">Mark Completed</button>
                    <button onClick={() => alert("Contact feature coming soon")} className="btn-secondary text-sm px-3 py-1.5">Contact</button>
                    <button onClick={() => alert("Directions coming soon")} className="btn-secondary text-sm px-3 py-1.5">Directions</button>
                  </div>
                )}

                {tab === "Completed" && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {b.date} • {formatPrice(b.amount)}
                  </span>
                )}

                {tab === "Cancelled" && (
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                    Cancelled
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
