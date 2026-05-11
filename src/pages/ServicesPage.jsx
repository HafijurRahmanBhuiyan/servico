import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import ServiceCard from "@/components/services/ServiceCard";
import { fetchCategories, fetchServices } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const q    = searchParams.get("q")    ?? "";
  const cat  = searchParams.get("cat")  ?? "";
  const sort = searchParams.get("sort") ?? "popular";

  useEffect(() => {
    Promise.all([fetchCategories(), fetchServices()]).then(([cats, svcs]) => {
      setCategories(cats);
      setServices(svcs);
      setLoading(false);
    });
  }, []);

  const set = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    setSearchParams(p);
  };

  const filtered = useMemo(() => {
    let out = [...services];
    if (cat) {
      const cId = categories.find((c) => c.slug === cat)?.id;
      if (cId) out = out.filter((s) => s.category_id === cId);
    }
    if (q.trim()) {
      const t = q.toLowerCase();
      out = out.filter((s) =>
        s.title.toLowerCase().includes(t) || (s.subtitle ?? "").toLowerCase().includes(t)
      );
    }
    if (sort === "price-asc")  out.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") out.sort((a, b) => b.price - a.price);
    else out.sort((a, b) => b.review_count - a.review_count);
    return out;
  }, [services, categories, q, cat, sort]);

  const activeCat = categories.find((c) => c.slug === cat);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {activeCat ? activeCat.label : "All Services"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {loading ? "Loading…" : `${filtered.length} services found`}
            {!loading && ` across ${categories.length} categories`}
          </p>
        </div>
        {activeCat && (
          <button onClick={() => set("cat", "")} className="text-sm text-gray-400 hover:text-gray-700 underline">
            Clear category
          </button>
        )}
      </div>

      {/* Search + Sort */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 shadow-soft min-w-[200px]">
          <Search className="h-4 w-4 shrink-0 text-gray-400" />
          <input
            value={q}
            onChange={(e) => set("q", e.target.value)}
            placeholder="Search services..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
          {q && (
            <button onClick={() => set("q", "")} className="text-gray-300 hover:text-gray-500 text-lg leading-none">×</button>
          )}
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-soft">
          <SlidersHorizontal className="h-4 w-4 text-gray-400 shrink-0" />
          <select
            value={sort}
            onChange={(e) => set("sort", e.target.value)}
            className="bg-transparent text-sm outline-none text-gray-700 cursor-pointer"
          >
            <option value="popular">Most popular</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* Category pills */}
      <div className="-mx-4 mb-8 mt-4 overflow-x-auto px-4 no-scrollbar">
        <div className="flex gap-2 pb-2">
          {[{ slug: "", label: "All", icon: "🏠" }, ...categories].map((c) => (
            <button
              key={c.slug ?? "all"}
              onClick={() => set("cat", c.slug ?? "")}
              className={cn(
                "shrink-0 flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition",
                (c.slug === "" ? cat === "" : cat === c.slug)
                  ? "border-primary bg-primary text-white shadow-soft"
                  : "border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50"
              )}
            >
              {c.icon && <span className="text-base leading-none">{c.icon}</span>}
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-soft">
          <div className="text-5xl">🔍</div>
          <h3 className="mt-4 text-lg font-semibold">No services found</h3>
          <p className="mt-1 text-sm text-gray-500">Try a different search or category.</p>
          <button
            onClick={() => setSearchParams({})}
            className="mt-4 text-sm font-medium text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
          <p className="mt-8 text-center text-sm text-gray-400">
            Showing {filtered.length} of {services.length} services
          </p>
        </>
      )}
    </div>
  );
}
