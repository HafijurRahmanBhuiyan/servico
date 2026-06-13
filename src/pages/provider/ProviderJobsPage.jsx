import { useState, useEffect, useCallback } from "react";
import { Search, AlertTriangle, Phone, MessageSquare, X, Info, Calendar, Clock } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { fetchProviderBookings, updateProviderBookingStatus } from "@/lib/api";
import ChatBox from "@/components/ChatBox";

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
  const [detailBooking, setDetailBooking] = useState(null);
  const [chatBooking, setChatBooking] = useState(null);

  const fetchData = useCallback(() => { fetchProviderBookings("u2").then(setBookings); }, []);
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const filtered = bookings
    .filter((b) => {
      if (tab === "New Requests") return b.status === "pending" || b.status === "assigned";
      return b.status === tab.toLowerCase();
    })
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
          <div key={b.id} className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft hover:shadow-elevated transition">
            {/* Status accent bar */}
            <div className={cn("h-1 w-full", b.status === 'pending' || b.status === 'assigned' ? 'bg-amber-400' : b.status === 'accepted' ? 'bg-emerald-400' : b.status === 'completed' ? 'bg-emerald-400' : b.status === 'cancelled' ? 'bg-red-400' : 'bg-blue-400')} />

            {b.is_urgent && (
              <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 text-[10px] font-bold text-white shadow-sm">
                <AlertTriangle className="h-3 w-3" /> URGENT
              </span>
            )}

            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-2xl shadow-sm">
                    {b.icon || "🛠️"}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{b.service_title}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                      <span className="font-medium text-gray-700">{maskName(b.customer_name)}</span>
                      {b.phone && (
                        <span className="inline-flex items-center gap-1">
                          <a href={`tel:${b.phone}`} className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:shadow-sm transition" title={`Call ${b.customer_name}`}>
                            <Phone className="h-4 w-4" />
                          </a>
                          <div className="relative">
                            <button onClick={() => setChatBooking(b)} className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-sm transition" title={`Message ${b.customer_name}`}>
                              <MessageSquare className="h-4 w-4" />
                            </button>
                            {b.unread_messages > 0 && (
                              <span className="absolute -top-1 -right-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-bold text-white">
                                {b.unread_messages}
                              </span>
                            )}
                          </div>
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {b.date || b.scheduled_date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {b.time || b.scheduled_time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-xl font-black text-primary">{formatPrice(b.amount)}</span>

                  <button onClick={() => setDetailBooking(b)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50 transition">
                    <Info className="inline h-3.5 w-3.5 mr-1" /> Details
                  </button>

                  {tab === "New Requests" && (
                    <div className="flex gap-2 mt-1">
                      <button onClick={() => handleAccept(b.id)} className="rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition">
                        Accept Job
                      </button>
                      <button onClick={() => handleDecline(b.id)} className="rounded-lg border border-gray-200 px-4 py-1.5 text-sm font-semibold text-gray-600 hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition">
                        Decline
                      </button>
                    </div>
                  )}

                  {tab === "Accepted" && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      <button onClick={() => handleComplete(b.id)} className="rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition">
                        Mark Completed
                      </button>
                      {b.phone && (
                        <>
                          <a href={`tel:${b.phone}`} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:border-emerald-200 hover:text-emerald-600 hover:bg-emerald-50 transition">
                            <Phone className="h-4 w-4" /> Call
                          </a>
                          <div className="relative">
                            <button onClick={() => setChatBooking(b)} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition">
                              <MessageSquare className="h-4 w-4" /> Message
                            </button>
                            {b.unread_messages > 0 && (
                              <span className="absolute -top-2 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                                {b.unread_messages}
                              </span>
                            )}
                          </div>
                        </>
                      )}
                      <button onClick={() => alert("Directions coming soon")} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition">
                        Directions
                      </button>
                    </div>
                  )}

                  {tab === "Completed" && (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
                      {b.date || b.scheduled_date} • {formatPrice(b.amount)}
                    </span>
                  )}

                  {tab === "Cancelled" && (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 shadow-sm">
                      Cancelled
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
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
