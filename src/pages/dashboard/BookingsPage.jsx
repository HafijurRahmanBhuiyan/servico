// Sohan's work

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { fetchUserBookings } from "@/lib/api";
import { formatPrice, cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-600",
};

export default function DashboardBookingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/dashboard/bookings");
      return;
    }

    fetchUserBookings(user.id).then((data) => {
      setBookings(data);
      setLoading(false);
    });
  }, [user, navigate]);

  const getServiceIcon = (booking) => booking.service?.icon ?? "🛠️";
  const getServiceTitle = (booking) => booking.service?.title ?? "Service";
  const getStatusStyle = (status) => statusStyles[status] ?? "bg-gray-100 text-gray-600";

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
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
              getStatusStyle(booking.status)
            )}
          >
            {booking.status}
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
    </div>
  );
}