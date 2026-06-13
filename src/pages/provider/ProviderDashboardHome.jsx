import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { cn, formatPrice } from "@/lib/utils";
import { fetchProviderBookings, fetchProviderEarnings, fetchProviderReviews, updateProviderBookingStatus } from "@/lib/api";
import ChatBox from "@/components/ChatBox";
import { CheckCircle, DollarSign, Star, Clock, Briefcase, Calendar, Phone, MessageSquare, X, Info } from "lucide-react";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  assigned: "bg-indigo-50 text-indigo-700",
  confirmed: "bg-blue-50 text-blue-700",
  accepted: "bg-emerald-50 text-emerald-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-600",
};

const statusBorder = {
  pending: "border-l-amber-400",
  assigned: "border-l-indigo-400",
  confirmed: "border-l-blue-400",
  accepted: "border-l-emerald-400",
  completed: "border-l-emerald-400",
  cancelled: "border-l-red-400",
};

export default function ProviderDashboardHome() {
  const { user, providerApplication } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [detailBooking, setDetailBooking] = useState(null);
  const [chatBooking, setChatBooking] = useState(null);

  const fetchBookingsData = useCallback(() => {
    if (!user) return;
    fetchProviderBookings("u2").then((data) => setBookings(Array.isArray(data) ? data : []));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchBookingsData();
    fetchProviderEarnings("u2").then((data) => setEarnings(data && typeof data === "object" && !data.detail ? data : null));
    fetchProviderReviews("u2").then(setReviews);
    const interval = setInterval(fetchBookingsData, 10000);
    return () => clearInterval(interval);
  }, [user, fetchBookingsData]);

  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const completedThisMonth = safeBookings.filter((b) => b.status === "completed").length;
  const totalEarnings = earnings?.total_earned ?? 0;
  const pendingJobs = safeBookings.filter((b) => b.status === "pending" || b.status === "assigned" || b.status === "accepted").length;

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  const upcomingJobs = safeBookings.filter((b) => b.status !== "completed" && b.status !== "cancelled").slice(0, 3);

  const handleMarkDone = async (id) => {
    await updateProviderBookingStatus(id, "completed");
    setBookings((prev) => (Array.isArray(prev) ? prev : []).map((b) => (b.id === id ? { ...b, status: "completed" } : b)));
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
              <div key={b.id} className={cn("relative px-5 py-4 border-l-4 hover:bg-gray-50/50 transition", statusBorder[b.status])}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-xl shadow-sm">
                      {b.icon || "🛠️"}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">{b.service_title}</div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-500">
                        <span className="font-medium text-gray-700">{b.customer_name}</span>
                        {b.phone && (
                          <span className="inline-flex items-center gap-1">
                            <a href={`tel:${b.phone}`} className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:shadow-sm transition" title={`Call ${b.customer_name}`}>
                              <Phone className="h-3.5 w-3.5" />
                            </a>
                            <div className="relative">
                              <button onClick={() => setChatBooking(b)} className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-sm transition" title={`Message ${b.customer_name}`}>
                                <MessageSquare className="h-3.5 w-3.5" />
                              </button>
                              {b.unread_messages > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-bold text-white">
                                  {b.unread_messages}
                                </span>
                              )}
                            </div>
                          </span>
                        )}
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-400">{b.date || b.scheduled_date} at {b.time || b.scheduled_time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={cn("rounded-full px-3 py-1 text-xs font-semibold capitalize shadow-sm", statusStyles[b.status])}>
                      {b.status === "confirmed" ? "assigned" : b.status}
                    </span>
                    <span className="text-base font-bold text-primary">{formatPrice(b.amount)}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <button onClick={() => setDetailBooking(b)} className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50 transition">
                        <Info className="inline h-3.5 w-3.5 mr-0.5" /> Details
                      </button>
                      {b.status === "accepted" && (
                        <button onClick={() => handleMarkDone(b.id)} className="rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:shadow-md transition">
                          Mark Done
                        </button>
                      )}
                    </div>
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
      {/* Chat Box */}
      {chatBooking && (
        <ChatBox booking={chatBooking} onClose={() => setChatBooking(null)} />
      )}

      {/* Booking Details Modal */}
      {detailBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setDetailBooking(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-elevated max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Booking Details</h3>
              <button onClick={() => setDetailBooking(null)} className="rounded-lg p-1 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>

            <div className="space-y-4 text-sm">
              {/* Customer */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Customer</h4>
                <p className="font-medium text-gray-900">{detailBooking.customer_name}</p>
                {detailBooking.phone && <p className="text-gray-500">{detailBooking.phone}</p>}
              </div>

              {/* Schedule */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Schedule</h4>
                <p className="text-gray-700">{detailBooking.date || detailBooking.scheduled_date} at {detailBooking.time || detailBooking.scheduled_time}</p>
              </div>

              {/* Address */}
              {detailBooking.address && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Address</h4>
                  <p className="text-gray-700">{detailBooking.address}</p>
                </div>
              )}

              {/* Notes */}
              {detailBooking.notes && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Notes</h4>
                  <p className="text-gray-700 italic">"{detailBooking.notes}"</p>
                </div>
              )}

              {/* Pricing */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Pricing</h4>
                <div className="space-y-1">
                  {detailBooking.service_charge !== undefined && (
                    <div className="flex justify-between text-gray-600"><span>Service Charge</span><span>{formatPrice(detailBooking.service_charge)}</span></div>
                  )}
                  {detailBooking.visiting_charge !== undefined && (
                    <div className="flex justify-between text-gray-600"><span>Visiting Charge</span><span>{formatPrice(detailBooking.visiting_charge)}</span></div>
                  )}
                  {detailBooking.urgent_fee > 0 && (
                    <div className="flex justify-between text-gray-600"><span>Urgent Fee</span><span>{formatPrice(detailBooking.urgent_fee)}</span></div>
                  )}
                  {detailBooking.discount_amount > 0 && (
                    <div className="flex justify-between text-gray-600"><span>Discount</span><span className="text-emerald-600">-{formatPrice(detailBooking.discount_amount)}</span></div>
                  )}
                  {detailBooking.vat > 0 && (
                    <div className="flex justify-between text-gray-600"><span>VAT</span><span>{formatPrice(detailBooking.vat)}</span></div>
                  )}
                  <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-1">
                    <span>Total</span><span className="text-primary">{formatPrice(detailBooking.total_amount || detailBooking.amount)}</span>
                  </div>
                </div>
              </div>

              {/* Payment */}
              {detailBooking.payment_method && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Payment</h4>
                  <p className="capitalize text-gray-700">{detailBooking.payment_method}</p>
                  {detailBooking.payment_status && (
                    <span className={cn("inline-block mt-1 rounded-full px-2 py-0.5 text-xs font-semibold", detailBooking.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>
                      {detailBooking.payment_status}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
