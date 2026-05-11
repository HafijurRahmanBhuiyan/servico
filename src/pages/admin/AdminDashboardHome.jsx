import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Calendar, DollarSign, Clock, PlusCircle, Settings, Tag, Wrench, LayoutGrid } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import {
  fetchServices, fetchMockUsers, fetchProviderApplications, updateProviderStatus, SERVICES
} from "@/lib/api";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-600",
};

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 rounded-2xl px-5 py-3 shadow-elevated text-sm font-semibold",
      type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
    )}>
      {message}
    </div>
  );
}

export default function AdminDashboardHome() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [applications, setApplications] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchMockUsers().then(setUsers);
    fetchServices().then(setServices);
    fetchProviderApplications().then(setApplications);
    const stored = JSON.parse(localStorage.getItem("servico_bookings") || "[]");
    setBookings(stored);
  }, []);

  const pendingApps = applications.filter((a) => a.status === "pending");
  const totalRevenue = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + (b.total_amount || 0), 0);
  const recentBookings = [...bookings].reverse().slice(0, 8);

  const handleApprove = async (id) => {
    await updateProviderStatus(id, "approved");
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status:"approved" } : a));
    setToast({ message: "Provider approved successfully!", type: "success" });
  };

  const handleReject = async (id) => {
    await updateProviderStatus(id, "rejected");
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status:"rejected" } : a));
    setToast({ message: "Provider rejected.", type: "success" });
  };

  const stats = [
    { label: "Total Users", value: users.length, icon: Users, gradient: "from-emerald-600 to-emerald-500" },
    { label: "Total Bookings", value: bookings.length, icon: Calendar, gradient: "from-emerald-600 to-emerald-500" },
    { label: "Total Revenue (BDT)", value: formatPrice(totalRevenue), icon: DollarSign, gradient: "from-amber-500 to-amber-400" },
    { label: "Pending Approvals", value: pendingApps.length, icon: Clock, gradient: "from-red-500 to-red-400" },
  ];

  const quickLinks = [
    { label: "Add Service", icon: Wrench, path: "/admin/services", desc: "Create a new service" },
    { label: "Add Category", icon: LayoutGrid, path: "/admin/categories", desc: "New service category" },
    { label: "Add Promo Code", icon: Tag, path: "/admin/promos", desc: "Create promotion" },
    { label: "Site Settings", icon: Settings, path: "/admin/settings", desc: "Configure site" },
  ];

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your platform</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={cn("rounded-2xl p-6 text-white shadow-elevated bg-gradient-to-br", s.gradient)}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-3xl font-black">{s.value}</div>
                <div className="mt-1 text-sm opacity-90">{s.label}</div>
              </div>
              <s.icon className="h-6 w-6 opacity-60" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-soft transition hover:shadow-elevated text-left"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{link.label}</div>
                <div className="text-xs text-gray-500">{link.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Bookings */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-bold text-gray-900">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-xs font-medium text-primary hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3">Service</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">No bookings yet</td></tr>
                )}
                {recentBookings.map((b) => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium">{b.service?.title ?? "—"}</td>
                    <td className="px-5 py-3 text-gray-500">{b.customer_name || b.name || "—"}</td>
                    <td className="px-5 py-3 text-gray-500">{b.scheduled_date || b.date || "—"}</td>
                    <td className="px-5 py-3">
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold capitalize", statusStyles[b.status] || "bg-gray-100 text-gray-600")}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-primary">{formatPrice(b.total_amount || 0)}</td>
                    <td className="px-5 py-3">
                      <button className="btn-secondary text-xs px-3 py-1" onClick={() => navigate("/admin/bookings")}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Provider Applications */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-bold text-gray-900">Pending Applications</h2>
            <Link to="/admin/providers" className="text-xs font-medium text-primary hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {pendingApps.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-gray-400">No pending applications</div>
            )}
            {pendingApps.slice(0, 5).map((app) => (
              <div key={app.id} className="px-5 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold">{app.full_name}</div>
                    <div className="mt-0.5 text-xs text-gray-500">{app.skills?.join(", ")}</div>
                    <div className="mt-0.5 text-xs text-gray-400">Applied: {app.applied_at}</div>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleApprove(app.id)}
                      className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(app.id)}
                      className="rounded-lg border border-red-300 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
