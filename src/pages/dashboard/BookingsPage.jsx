// Sohan's work

import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, ArrowRight, Phone, MessageSquare, Star, X, Briefcase, Award, Shield } from "lucide-react";
import { fetchUserBookings, fetchProviderProfile, submitReview } from "@/lib/api";
import ChatBox from "@/components/ChatBox";
import ProviderAvatar from "@/components/ProviderAvatar";
import { formatPrice, cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  assigned: "bg-blue-50 text-blue-700",
  confirmed: "bg-blue-50 text-blue-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-600",
};

export default function DashboardBookingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewProvider, setViewProvider] = useState(null);
  const [providerProfile, setProviderProfile] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 0, text: "" });
  const [submitting, setSubmitting] = useState(false);
  const [chatBooking, setChatBooking] = useState(null);

  const fetchData = useCallback(() => {
    if (!user) return;
    fetchUserBookings(user.id).then((data) => {
      setBookings(data);
      setLoading(false);
    });
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/dashboard/bookings");
      return;
    }
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData, navigate]);

  const getServiceIcon = (booking) => booking.service?.icon ?? "🛠️";
  const getServiceTitle = (booking) => booking.service?.title ?? "Service";
  const getStatusStyle = (status) => statusStyles[status] ?? "bg-gray-100 text-gray-600";

  const openProviderProfile = async (booking) => {
    const pid = booking.provider;
    if (!pid) return;
    setViewProvider(booking);
    setProviderProfile(null);
    setReviewForm({ rating: 0, text: "" });
    const profile = await fetchProviderProfile(pid);
    setProviderProfile(profile);
  };

  const handleReviewSubmit = async (booking) => {
    if (!reviewForm.rating || !reviewForm.text.trim()) return;
    setSubmitting(true);
    const result = await submitReview({
      service: booking.service?.id,
      booking: booking.id,
      rating: reviewForm.rating,
      text: reviewForm.text,
    });
    setSubmitting(false);
    if (result.error) { alert(result.error); return; }
    alert("Review submitted! Thank you.");
    setViewProvider(null);
    setProviderProfile(null);
  };

  const renderSkeletons = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="rounded-3xl border border-gray-200 bg-white p-16 text-center shadow-soft">
      <div className="text-6xl">📋</div>
      <h3 className="mt-4 text-xl font-bold">No bookings yet</h3>
      <p className="mt-2 text-sm text-gray-500">
        Book your first service and it'll show up here.
      </p>
      <Link to="/services" className="mt-5 inline-block btn-primary px-8 py-3">
        Browse Services
      </Link>
    </div>
  );

  const renderBookingCard = (booking) => (
    <div
      key={booking.id}
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-soft transition hover:shadow-elevated"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
            {getServiceIcon(booking)}
          </div>

          <div>
            <h3 className="font-semibold">{getServiceTitle(booking)}</h3>

            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {booking.scheduled_date}
              </span>

              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {booking.scheduled_time}
              </span>

              {booking.address && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {booking.address.slice(0, 30)}…
                </span>
              )}
            </div>

            {booking.provider_name && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-500">Provider:</span>
                <span className="text-sm font-medium text-gray-900">{booking.provider_name}</span>
                {booking.provider_phone && (
                  <>
                    <a
                      href={`tel:${booking.provider_phone}`}
                      className="rounded-lg border border-gray-200 p-1.5 text-emerald-600 hover:bg-emerald-50 transition"
                      title={`Call ${booking.provider_name}`}
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                    <div className="relative">
                      <button
                        onClick={() => setChatBooking(booking)}
                        className="rounded-lg border border-gray-200 p-1.5 text-blue-600 hover:bg-blue-50 transition"
                        title={`Message ${booking.provider_name}`}
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                      </button>
                      {booking.unread_messages > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                          {booking.unread_messages}
                        </span>
                      )}
                    </div>
                  </>
                )}
                <button
                  onClick={() => openProviderProfile(booking)}
                  className="rounded-lg border border-gray-200 px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition"
                >
                  View Provider
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
              getStatusStyle(booking.status)
            )}
          >
            {booking.status === "assigned" ? "confirmed" : booking.status}
          </span>

          <span className="text-sm font-bold text-primary">
            {formatPrice(booking.total_amount ?? 0)}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage your service appointments.
        </p>
      </div>

      {loading && renderSkeletons()}

      {!loading && bookings.length === 0 && renderEmptyState()}

      {!loading && bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((booking) => renderBookingCard(booking))}
        </div>
      )}

      <div className="mt-8">
        <Link
          to="/services"
          className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowRight className="h-4 w-4" />
          Book another service
        </Link>
      </div>

      {/* View Provider Modal */}
      {viewProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => { setViewProvider(null); setProviderProfile(null); }}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-elevated max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Provider Profile</h3>
              <button onClick={() => { setViewProvider(null); setProviderProfile(null); }} className="rounded-lg p-1 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>

            {!providerProfile ? (
              <div className="py-10 text-center text-sm text-gray-400">Loading...</div>
            ) : (
              <>
                {/* Header */}
                <div className="flex flex-col items-center pb-4 border-b border-gray-100">
                  <ProviderAvatar avatar={providerProfile.avatar} name={providerProfile.full_name} size="xl" />
                  <h2 className="mt-3 text-xl font-bold text-gray-900">{providerProfile.full_name}</h2>
                  <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                    {providerProfile.average_rating > 0 && (
                      <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-500 fill-current" /> {providerProfile.average_rating}</span>
                    )}
                    <span>{providerProfile.total_jobs} jobs completed</span>
                  </div>
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-700">
                    <Shield className="h-3 w-3" /> Verified Pro
                  </span>
                </div>

                {/* Details */}
                <div className="mt-4 space-y-3 text-sm">
                  {providerProfile.phone && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                      <a href={`tel:${providerProfile.phone}`} className="text-emerald-600 hover:underline">{providerProfile.phone}</a>
                    </div>
                  )}
                  {providerProfile.experience_years && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Briefcase className="h-4 w-4 text-gray-400 shrink-0" />
                      <span>{providerProfile.experience_years} years experience</span>
                    </div>
                  )}
                  {providerProfile.availability && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Award className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="capitalize">{providerProfile.availability.replace("_", " ")}</span>
                    </div>
                  )}
                  {providerProfile.total_earnings > 0 && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <span className="text-gray-400 shrink-0">💰</span>
                      <span>{formatPrice(providerProfile.total_earnings)} total earnings</span>
                    </div>
                  )}
                </div>

                {/* Skills */}
                {Array.isArray(providerProfile.skills) && providerProfile.skills.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-700">Skills</h4>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {providerProfile.skills.map((s) => (
                        <span key={s} className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bio */}
                {providerProfile.bio && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-700">Bio</h4>
                    <p className="mt-1 text-sm text-gray-500 italic">"{providerProfile.bio}"</p>
                  </div>
                )}

                {/* Review Form */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Rate & Review</h4>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: star })}>
                        <Star className={cn("h-6 w-6 transition", star <= reviewForm.rating ? "fill-amber-400 text-amber-400" : "text-gray-300")} />
                      </button>
                    ))}
                    {reviewForm.rating > 0 && <span className="ml-2 text-xs text-gray-400">({reviewForm.rating}/5)</span>}
                  </div>

                  <textarea
                    className="input-field mb-3"
                    rows={3}
                    placeholder="Share your experience with this provider..."
                    value={reviewForm.text}
                    onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                  />

                  <button
                    onClick={() => handleReviewSubmit(viewProvider)}
                    disabled={submitting || !reviewForm.rating || !reviewForm.text.trim()}
                    className="btn-primary w-full"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Chat Box */}
      {chatBooking && (
        <ChatBox booking={chatBooking} onClose={() => setChatBooking(null)} />
      )}
    </div>
  );
}