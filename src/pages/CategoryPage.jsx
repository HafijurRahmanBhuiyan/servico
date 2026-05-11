import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ServiceCard from "@/components/services/ServiceCard";
import { fetchCategories, fetchServices } from "@/lib/api";

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setImgError(false);
    Promise.all([fetchCategories(), fetchServices({ categorySlug: slug })]).then(([cats, svcs]) => {
      setCategory(cats.find((c) => c.slug === slug) ?? null);
      setServices(svcs);
      setLoading(false);
    });
  }, [slug]);

  return (
    <div>
      {/* Category Hero Banner */}
      {category && (
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-emerald-700 to-emerald-500 sm:h-56">
          {category.image_url && !imgError ? (
            <img
              src={category.image_url}
              alt={category.label}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-emerald-900/60" />
          <div className="absolute inset-0 flex items-center px-6 sm:px-10">
            <div className="flex items-center gap-4 text-white">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-4xl border border-white/30">
                {category.icon}
              </div>
              <div>
                <div className="text-xs font-medium text-white/70 uppercase tracking-wider">Category</div>
                <h1 className="text-3xl font-black sm:text-4xl">{category.label}</h1>
                <p className="mt-0.5 text-sm text-white/80">
                  {loading ? "Loading…" : `${services.length} service${services.length !== 1 ? "s" : ""} available`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <Link to="/services" className="hover:text-gray-700">Services</Link>
          <span>/</span>
          <span className="text-gray-700">{category?.label ?? slug}</span>
        </nav>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-soft">
            <div className="text-5xl">🔍</div>
            <h3 className="mt-4 text-lg font-semibold">No services in this category yet</h3>
            <Link to="/services" className="mt-4 inline-block text-sm text-primary hover:underline">
              Browse all services
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        )}
      </div>
    </div>
  );
}
