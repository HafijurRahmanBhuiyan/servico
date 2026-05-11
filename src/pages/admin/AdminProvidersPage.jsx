import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchProviderApplications, updateProviderStatus } from "@/lib/api";

const TABS = ["Pending", "Approved", "Rejected", "Suspended"];

function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-elevated">
      Provider approved successfully!
    </div>
  );
}

export default function AdminProvidersPage() {
  const [apps, setApps] = useState([]);
  const [tab, setTab] = useState("Pending");
  const [search, setSearch] = useState("");
  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchProviderApplications().then(setApps); }, []);

  const filtered = apps.filter((a) => {
    const statusMatch = a.status === tab.toLowerCase();
    const q = search.toLowerCase();
    const textMatch = !q || a.full_name.toLowerCase().includes(q) || a.skills.some((s) => s.toLowerCase().includes(q));
    return statusMatch && textMatch;
  });

  const handleApprove = async (id) => {
    await updateProviderStatus(id, "approved");
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status: "approved" } : a)));
    setToast(true);
    setTimeout(() => setToast(null), 3000);
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) return;
    await updateProviderStatus(id, "rejected");
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status: "rejected" } : a)));
    setRejectId(null);
    setRejectReason("");
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateProviderStatus(id, newStatus);
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
  };

  const getInitials = (name) => name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6">
      {toast && <Toast message="Provider approved successfully!" onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Service Providers</h1>
        <p className="mt-1 text-sm text-gray-500">Manage provider approvals and pipeline</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold transition",
              tab === t
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          className="input-field pl-9"
          placeholder="Search by name or skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-gray-400">
            No {tab.toLowerCase()} applications
          </div>
        )}
        {filtered.map((app) => (
          <div key={app.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-soft">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500 text-sm font-bold text-white">
                {getInitials(app.full_name)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{app.full_name}</h3>
                    <p className="text-sm text-gray-500">{app.phone}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                      app.status === "pending" && "bg-amber-50 text-amber-700",
                      app.status === "approved" && "bg-emerald-50 text-emerald-700",
                      app.status === "rejected" && "bg-red-50 text-red-600",
                      app.status === "suspended" && "bg-gray-100 text-gray-600",
                    )}>
                      {app.status}
                    </span>
                    <span className="text-xs text-gray-400">Applied: {app.applied_at}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {app.skills.map((s) => (
                    <span key={s} className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
                  <span>Experience: {app.experience_years} years</span>
                  <span>Availability: {app.availability}</span>
                  <span>Area: {app.address}</span>
                </div>

                {app.bio && (
                  <p className="mt-1.5 text-sm italic text-gray-400">"{app.bio}"</p>
                )}

                {/* Actions */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {tab === "Pending" && (
                    <>
                      <button onClick={() => handleApprove(app.id)} className="btn-primary text-sm px-4 py-1.5">
                        Approve
                      </button>
                      <button onClick={() => setRejectId(app.id)} className="rounded-lg border border-red-300 px-4 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                        Reject
                      </button>
                      <button onClick={() => alert("NID document viewer coming soon")} className="text-xs font-medium text-primary underline">
                        View NID
                      </button>
                    </>
                  )}
                  {tab === "Approved" && (
                    <>
                      <button onClick={() => handleStatusChange(app.id, "suspended")} className="rounded-lg border border-red-300 px-4 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                        Suspend
                      </button>
                      <button onClick={() => alert("Viewing provider profile...")} className="btn-secondary text-sm px-4 py-1.5">
                        View Profile
                      </button>
                    </>
                  )}
                  {tab === "Rejected" && (
                    <button onClick={() => handleStatusChange(app.id, "pending")} className="btn-secondary text-sm px-4 py-1.5">
                      Re-review
                    </button>
                  )}
                  {tab === "Suspended" && (
                    <button onClick={() => handleStatusChange(app.id, "approved")} className="btn-primary text-sm px-4 py-1.5">
                      Restore
                    </button>
                  )}
                </div>

                {/* Rejection reason input */}
                {rejectId === app.id && (
                  <div className="mt-3 space-y-2 rounded-xl border border-red-200 bg-red-50 p-3">
                    <textarea
                      className="input-field"
                      rows={2}
                      placeholder="Reason for rejection..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleReject(app.id)} disabled={!rejectReason.trim()} className="btn-primary bg-gradient-to-r from-red-600 to-red-500 px-4 py-1.5 text-sm disabled:opacity-50">
                        Confirm Reject
                      </button>
                      <button onClick={() => { setRejectId(null); setRejectReason(""); }} className="btn-secondary px-4 py-1.5 text-sm">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
