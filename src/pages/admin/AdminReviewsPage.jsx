import { useState, useEffect } from "react";
import { Star, Eye, EyeOff, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchMockReviews, updateReviewStatus, deleteReview } from "@/lib/api";

const RATING_FILTERS = ["All", "5", "4", "3", "2", "1"];
const STATUS_FILTERS = ["All", "Published", "Hidden"];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [ratingFilter, setRatingFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => { fetchMockReviews().then(setReviews); }, []);

  const filtered = reviews.filter((r) => {
    const ratingMatch = ratingFilter === "All" || r.rating === Number(ratingFilter);
    const statusMatch =
      statusFilter === "All" ||
      (statusFilter === "Published" && r.status === "published") ||
      (statusFilter === "Hidden" && r.status === "hidden");
    return ratingMatch && statusMatch;
  });

  const handleToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "published" ? "hidden" : "published";
    await updateReviewStatus(id, newStatus);
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
  };

  const handleDelete = async (id) => {
    await deleteReview(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={cn("h-3.5 w-3.5", i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300")} />
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="mt-1 text-sm text-gray-500">Manage all customer reviews</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">Rating:</span>
          {RATING_FILTERS.map((r) => (
            <button
              key={r}
              onClick={() => setRatingFilter(r)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition",
                ratingFilter === r
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              )}
            >
              {r === "All" ? "All" : r + "★"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">Status:</span>
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition",
                statusFilter === s
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="px-5 py-3">Service</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Rating</th>
              <th className="px-5 py-3">Review</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">No reviews found</td></tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id} className={cn("border-b border-gray-50 hover:bg-gray-50", r.status === "hidden" && "opacity-60")}>
                <td className="px-5 py-3 font-medium">{r.service_title}</td>
                <td className="px-5 py-3 text-gray-500">{r.customer_name}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">{renderStars(r.rating)}</div>
                </td>
                <td className="px-5 py-3 text-gray-500 max-w-[200px] truncate">{r.text}</td>
                <td className="px-5 py-3 text-gray-500">{r.date}</td>
                <td className="px-5 py-3">
                  <span className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-semibold",
                    r.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"
                  )}>
                    {r.status === "published" ? "Published" : "Hidden"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleToggle(r.id, r.status)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-primary" title={r.status === "published" ? "Hide" : "Show"}>
                      {r.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button onClick={() => handleDelete(r.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
