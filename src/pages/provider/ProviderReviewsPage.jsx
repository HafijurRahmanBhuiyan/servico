import { useState, useEffect } from "react";
import { Star, MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchProviderReviews } from "@/lib/api";

const RATING_FILTERS = ["All", "5", "4", "3", "2", "1"];
const SORT_OPTIONS = ["Newest", "Highest", "Lowest"];

export default function ProviderReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [ratingFilter, setRatingFilter] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [replyText, setReplyText] = useState({});
  const [replies, setReplies] = useState({});

  useEffect(() => { fetchProviderReviews("u2").then(setReviews); }, []);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach((r) => { if (r.rating >= 1 && r.rating <= 5) ratingCounts[5 - r.rating]++; });

  const filtered = reviews
    .filter((r) => ratingFilter === "All" || r.rating === Number(ratingFilter))
    .sort((a, b) => {
      if (sort === "Highest") return b.rating - a.rating;
      if (sort === "Lowest") return a.rating - b.rating;
      return new Date(b.date) - new Date(a.date);
    });

  const handleReply = (id) => {
    if (!replyText[id]?.trim()) return;
    setReplies((prev) => ({ ...prev, [id]: replyText[id] }));
    setReplyText((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
        <p className="mt-1 text-sm text-gray-500">See what customers are saying</p>
      </div>

      {/* Overall rating summary */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-start gap-8">
          <div className="text-center">
            <div className="text-5xl font-black text-emerald-600">{avgRating}</div>
            <div className="mt-1 flex items-center justify-center gap-0.5 text-amber-400">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={cn("h-4 w-4", i < Math.round(Number(avgRating)) ? "fill-current" : "text-gray-300")} />
              ))}
            </div>
            <div className="mt-1 text-xs text-gray-500">Based on {reviews.length} reviews</div>
          </div>
          <div className="flex-1 space-y-1.5 min-w-[200px]">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              const pct = reviews.length ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-6 text-right text-gray-500">{star}★</span>
                  <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-6 text-gray-400">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">Rating:</span>
          {RATING_FILTERS.map((r) => (
            <button
              key={r}
              onClick={() => setRatingFilter(r)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition",
                ratingFilter === r ? "bg-emerald-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              )}
            >
              {r === "All" ? "All" : r + "★"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">Sort:</span>
          {SORT_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition",
                sort === s ? "bg-emerald-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Review cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-gray-400">No reviews found</div>
        )}
        {filtered.map((r) => (
          <div key={r.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500 text-xs font-bold text-white">
                  {r.customer_name[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{r.customer_name}</div>
                  <div className="text-xs text-gray-400">{r.date}</div>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700">
                {r.service_title}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={cn("h-3.5 w-3.5", i < r.rating ? "fill-current" : "text-gray-300")} />
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-600">{r.text}</p>

            {/* Reply */}
            {replies[r.id] && (
              <div className="mt-3 rounded-xl bg-gray-50 p-3 text-sm">
                <span className="text-xs font-semibold text-gray-500">Your reply:</span>
                <p className="mt-1 text-gray-700">{replies[r.id]}</p>
              </div>
            )}

            {!replies[r.id] && (
              <div className="mt-3">
                {replyText[r.id] !== undefined ? (
                  <div className="flex gap-2">
                    <input
                      className="input-field text-sm flex-1"
                      placeholder="Write a reply..."
                      value={replyText[r.id] || ""}
                      onChange={(e) => setReplyText((prev) => ({ ...prev, [r.id]: e.target.value }))}
                    />
                    <button onClick={() => handleReply(r.id)} className="btn-primary px-3 py-1 text-sm">
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setReplyText((prev) => ({ ...prev, [r.id]: "" }))} className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-primary">
                    <MessageSquare className="h-3.5 w-3.5" /> Reply
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
