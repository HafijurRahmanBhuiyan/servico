import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { cn, formatPrice } from "@/lib/utils";
import { fetchProviderBookings, fetchProviderEarnings, fetchProviderReviews, updateProviderBookingStatus } from "@/lib/api";
import { CheckCircle, DollarSign, Star, Clock, Briefcase, Calendar } from "lucide-react";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  accepted: "bg-blue-50 text-blue-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-600",
};

export default function ProviderDashboardHome() {
  const { user, providerApplication } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!user) return;
    fetchProviderBookings("u2").then(setBookings);
    fetchProviderEarnings("u2").then(setEarnings);
    fetchProviderReviews("u2").then(setReviews);
  }, [user]);

  const completedThisMonth = bookings.filter((b) => b.status === "completed").length;
  const totalEarnings = earnings?.total_earned ?? 0;
  const pendingJobs = bookings.filter((b) => b.status === "pending" || b.status === "accepted").length;

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  const upcomingJobs = bookings.filter((b) => b.status !== "completed" && b.status !== "cancelled").slice(0, 3);

  const handleMarkDone = async (id) => {
    await updateProviderBookingStatus(id, "completed");
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "completed" } : b)));
  };

  // Mock weekly earnings for bar chart
  const weekDays = [
    { label: "Mon", amount: 0 },
    { label: "Tue", amount: 450 },
    { label: "Wed", amount: 800 },
    { label: "Thu", amount: 300 },
    { label: "Fri", amount: 0 },
    { label: "Sat", amount: 1200 },
    { label: "Sun", amount: 600 },
  ];
  const maxAmount = Math.max(...weekDays.map((d) => d.amount), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {providerApplication?.full_name || user?.name || "Provider"}! 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">Here's what's happening with your work today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-5 text-white shadow-elevated">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-3xl font-black">{completedThisMonth}</div>
              <div className="mt-1 text-sm opacity-90">Jobs Completed</div>
            </div>
            <CheckCircle className="h-6 w-6 opacity-60" />
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-amber-400 p-5 text-white shadow-elevated">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-3xl font-black">{formatPrice(totalEarnings)}</div>
              <div className="mt-1 text-sm opacity-90">Total Earnings</div>
            </div>
            <DollarSign className="h-6 w-6 opacity-60" />
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-5 text-white shadow-elevated">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-3xl font-black">{avgRating}</div>
              <div className="mt-1 text-sm opacity-90">Avg Rating</div>
            </div>
            <Star className="h-6 w-6 opacity-60" />
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-red-500 to-red-400 p-5 text-white shadow-elevated">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-3xl font-black">{pendingJobs}</div>
              <div className="mt-1 text-sm opacity-90">Pending Jobs</div>
            </div>
            <Clock className="h-6 w-6 opacity-60" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Jobs */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-bold text-gray-900">Upcoming Jobs</h2>
            <button onClick={() => navigate("/provider/jobs")} className="text-xs font-medium text-primary hover:underline">View all</button>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingJobs.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-gray-400">No upcoming jobs</div>
            )}
            {upcomingJobs.map((b) => (
              <div key={b.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                      {b.icon || "🛠️"}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">{b.service_title}</div>
                      <div className="text-xs text-gray-500">{b.customer_name} • {b.date} at {b.time}</div>
                      <div className="text-xs text-gray-400">{b.area}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold capitalize", statusStyles[b.status])}>
                      {b.status}
                    </span>
                    <span className="text-sm font-bold text-primary">{formatPrice(b.amount)}</span>
                    {b.status === "accepted" && (
                      <button onClick={() => handleMarkDone(b.id)} className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700">
                        Mark as Done
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Weekly earnings bar chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-soft">
            <h2 className="text-sm font-bold text-gray-900 mb-4">This Week</h2>
            <div className="flex items-end justify-between gap-2 h-28">
              {weekDays.map((d) => (
                <div key={d.label} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className="w-full rounded-t-lg bg-emerald-500 transition-all"
                    style={{ height: `${(d.amount / maxAmount) * 100}%`, minHeight: d.amount > 0 ? "4px" : "0" }}
                  />
                  <span className="text-[10px] text-gray-400">{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top reviews */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-soft">
            <h2 className="text-sm font-bold text-gray-900 mb-3">Latest Reviews</h2>
            {reviews.slice(0, 2).map((r) => (
              <div key={r.id} className="mb-3 last:mb-0">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={cn("h-3 w-3", i < r.rating ? "fill-current" : "text-gray-300")} />
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-600 italic">"{r.text}"</p>
                <p className="mt-0.5 text-xs text-gray-400">— {r.customer_name}</p>
              </div>
            ))}
            {reviews.length === 0 && <p className="text-xs text-gray-400">No reviews yet</p>}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid gap-3 sm:grid-cols-3">
        <button onClick={() => navigate("/provider/profile")} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-soft hover:shadow-elevated transition text-left">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50"><Clock className="h-4 w-4 text-primary" /></div>
          <div className="text-sm font-semibold text-gray-900">Update Availability</div>
        </button>
        <button onClick={() => navigate("/provider/jobs")} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-soft hover:shadow-elevated transition text-left">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50"><Briefcase className="h-4 w-4 text-primary" /></div>
          <div className="text-sm font-semibold text-gray-900">View All Jobs</div>
        </button>
        <button onClick={() => navigate("/provider/earnings")} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-soft hover:shadow-elevated transition text-left">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50"><DollarSign className="h-4 w-4 text-primary" /></div>
          <div className="text-sm font-semibold text-gray-900">Withdraw Earnings</div>
        </button>
      </div>
    </div>
  );
}
