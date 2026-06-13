import { useState, useEffect } from "react";
import { Search, X, Star, Briefcase, MapPin, Phone, Mail, Award, Clock, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchProviderApplications, updateProviderStatus } from "@/lib/api";
import ProviderAvatar from "@/components/ProviderAvatar";

const TABS = ["All", "Pending", "Approved", "Rejected", "Suspended"];

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
  const [viewProfileId, setViewProfileId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchProviderApplications().then(setApps); }, []);

  const filtered = apps.filter((a) => {
    const statusMatch = tab === "All" || a.status === tab.toLowerCase();
    const q = search.toLowerCase();
    const textMatch = !q || a.full_name.toLowerCase().includes(q) || (a.skills || []).some((s) => s.toLowerCase().includes(q));
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
            {tab === "All" ? "No applications found" : `No ${tab.toLowerCase()} applications`}
          </div>
        )}
        {filtered.map((app) => (
          <div key={app.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-soft">
            <div className="flex items-start gap-4">
              <ProviderAvatar avatar={app.avatar} name={app.full_name} size="lg" />

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
                  {(app.skills || []).map((s) => (
                    <span key={s} className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
                  <span>Experience: {app.experience_years} years</span>
                  <span>Availability: {app.availability}</span>
                  <span>Area: {app.address}</span>
                  <span>NID: {app.nid_number}</span>
                </div>

                {app.bio && (
                  <p className="mt-1.5 text-sm italic text-gray-400">"{app.bio}"</p>
                )}

                {/* Actions */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {(tab === "Pending" || (tab === "All" && app.status === "pending")) && (
                    <>
                      <button onClick={() => handleApprove(app.id)} className="btn-primary text-sm px-4 py-1.5">
                        Approve
                      </button>
                      <button onClick={() => setRejectId(app.id)} className="rounded-lg border border-red-300 px-4 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                        Reject
                      </button>
                      {app.nid_file ? (
                        <a href={app.nid_file} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary underline">
                          View NID
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">No NID file</span>
                      )}
                    </>
                  )}
                  {(tab === "Approved" || (tab === "All" && app.status === "approved")) && (
                    <>
                      <button onClick={() => handleStatusChange(app.id, "suspended")} className="rounded-lg border border-red-300 px-4 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                        Suspend
                      </button>
                      <button onClick={() => setViewProfileId(app.id)} className="btn-secondary text-sm px-4 py-1.5">
                        View Profile
                      </button>
                    </>
                  )}
                  {(tab === "Rejected" || (tab === "All" && app.status === "rejected")) && (
                    <button onClick={() => handleStatusChange(app.id, "pending")} className="btn-secondary text-sm px-4 py-1.5">
                      Re-review
                    </button>
                  )}
                  {(tab === "Suspended" || (tab === "All" && app.status === "suspended")) && (
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

      {/* View Profile Modal */}
      {viewProfileId && (() => {
        const app = apps.find((a) => a.id === viewProfileId);
        if (!app) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setViewProfileId(null)}>
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-elevated max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Provider Profile</h3>
                <button onClick={() => setViewProfileId(null)} className="rounded-lg p-1 hover:bg-gray-100"><X className="h-5 w-5" /></button>
              </div>

              <div className="flex flex-col items-center pb-4 border-b border-gray-100">
                <ProviderAvatar avatar={app.avatar} name={app.full_name} size="xl" />
                <h2 className="mt-3 text-xl font-bold text-gray-900">{app.full_name}</h2>
                {app.total_jobs > 0 && (
                  <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-500 fill-current" /> {app.average_rating}</span>
                    <span>{app.total_jobs} jobs completed</span>
                  </div>
                )}
                <span className={cn(
                  "mt-2 rounded-full px-3 py-0.5 text-xs font-semibold capitalize",
                  app.status === "approved" && "bg-emerald-50 text-emerald-700",
                  app.status === "pending" && "bg-amber-50 text-amber-700",
                  app.status === "rejected" && "bg-red-50 text-red-600",
                  app.status === "suspended" && "bg-gray-100 text-gray-600",
                )}>{app.status}</span>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400" /> {app.user?.email || "—"}
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400" /> {app.phone}
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" /> {app.address}
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <FileText className="h-4 w-4 text-gray-400" /> NID: {app.nid_number}
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Briefcase className="h-4 w-4 text-gray-400" /> Experience: {app.experience_years} years
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="h-4 w-4 text-gray-400" /> Availability: {app.availability}
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Award className="h-4 w-4 text-gray-400" /> Earnings: ৳{Number(app.total_earnings).toLocaleString()}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700">Skills</h4>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {(app.skills || []).map((s) => (
                    <span key={s} className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">{s}</span>
                  ))}
                </div>
              </div>

              {app.bio && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700">Bio</h4>
                  <p className="mt-1 text-sm text-gray-500 italic">"{app.bio}"</p>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                <span>Applied: {app.applied_at}</span>
                {app.nid_file && (
                  <a href={app.nid_file} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline">View NID Document</a>
                )}
              </div>

              {app.reject_reason && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
                  <h4 className="text-xs font-semibold text-red-700">Rejection Reason</h4>
                  <p className="mt-0.5 text-sm text-red-600">{app.reject_reason}</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
