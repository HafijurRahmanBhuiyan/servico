import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Shield, Clock, Star, ChevronRight } from "lucide-react";
import ServiceCard from "@/components/services/ServiceCard";
import CategoryTile from "@/components/services/CategoryTile";
import { fetchCategories, fetchServices } from "@/lib/api";

// Hero service images carousel
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",  // cleaning
  "https://images.unsplash.com/photo-1631083211623-41e64ce3f74b?w=900&q=80", // AC
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=900&q=80", // grooming
  "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=900&q=80",   // CCTV
];

export default function HomePage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [categories, setCategories] = useState([]);
  const [popular, setPopular] = useState([]);
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    fetchCategories().then(setCategories);
    fetchServices({ popular: true }).then((s) => setPopular(s.slice(0, 8)));
  }, []);

  // Rotate hero background image
  useEffect(() => {
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_IMAGES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/services?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pb-20 pt-16 text-white min-h-[520px]">
        {/* Background images with crossfade */}
        {HERO_IMAGES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === heroIdx ? 1 : 0 }}
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-emerald-900/75" />
          </div>
        ))}
        {/* Dot pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                Trusted by 100,000+ households in Bangladesh
              </span>
              <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Home services,<br />
                <span className="text-amber-400">on demand.</span>
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/85">
                Book verified pros for AC repair, cleaning, beauty, plumbing & more — at your doorstep, when you need them.
              </p>
              <form onSubmit={handleSearch} className="mt-8 flex max-w-lg items-center gap-2 rounded-2xl bg-white p-2 shadow-elevated">
                <Search className="ml-2 h-5 w-5 shrink-0 text-gray-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="What service do you need today?"
                  className="flex-1 bg-transparent py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400"
                />
                <button type="submit" className="shrink-0 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:opacity-90 transition">
                  Search
                </button>
              </form>
              <div className="mt-6 flex flex-wrap gap-5 text-sm text-white/80">
                <span className="flex items-center gap-2"><Shield className="h-4 w-4" /> Verified pros</span>
                <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> Same-day service</span>
                <span className="flex items-center gap-2"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.8 avg rating</span>
              </div>
            </div>

            {/* Category quick-links */}
            <div className="hidden grid-cols-3 gap-3 lg:grid">
              {["🧹 Cleaning", "❄️ AC Repair", "💆 Beauty", "⚡ Electrical", "🔧 Plumbing", "📷 CCTV", "📦 Moving", "💈 Grooming", "🌿 Gardening"].map((e, i) => {
                const [icon, ...rest] = e.split(" ");
                return (
                  <div key={i} className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/20 bg-white/10 text-3xl backdrop-blur-sm transition hover:bg-white/20 cursor-pointer"
                    onClick={() => navigate(`/services?q=${encodeURIComponent(rest.join(" "))}`)}>
                    <span>{icon}</span>
                    <span className="text-xs font-medium text-white/80">{rest.join(" ")}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hero dots indicator */}
        <div className="relative mt-8 flex justify-center gap-1.5">
          {HERO_IMAGES.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)}
              className={`h-1.5 rounded-full transition-all ${i === heroIdx ? "w-6 bg-amber-400" : "w-1.5 bg-white/40"}`} />
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Browse by category</h2>
            <p className="mt-1 text-sm text-gray-500">16 categories, 30+ services</p>
          </div>
          <button onClick={() => navigate("/services")} className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View all <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
          {categories.map((c) => <CategoryTile key={c.id} category={c} />)}
        </div>
      </section>

      {/* ── Popular services ── */}
      <section className="bg-gray-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold">Most booked this week</h2>
              <p className="mt-1 text-sm text-gray-500">Top-rated services chosen by thousands</p>
            </div>
            <button onClick={() => navigate("/services")} className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6">
        <h2 className="text-2xl font-bold">How Servico works</h2>
        <p className="mt-2 text-sm text-gray-500">Get help in 3 simple steps</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            { n: "01", t: "Pick a service", d: "Browse 30+ services across 16 categories. Read real customer reviews.", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80" },
            { n: "02", t: "Book a slot", d: "Choose date, time, and address. Pay online or cash on delivery.", img: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&q=80" },
            { n: "03", t: "Sit back & relax", d: "A verified pro arrives at your doorstep. Rate after completion.", img: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80" },
          ].map((s) => (
            <div key={s.n} className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft hover:shadow-elevated transition-shadow">
              <div className="relative h-32 overflow-hidden">
                <img src={s.img} alt={s.t} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-emerald-900/60" />
                <div className="absolute left-4 bottom-3 text-5xl font-black leading-none text-white/20">{s.n}</div>
                <div className="absolute left-4 bottom-4 text-sm font-bold text-white">{s.t}</div>
              </div>
              <div className="p-4">
                <p className="text-sm leading-relaxed text-gray-500">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-gray-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold">Why 100,000+ families choose Servico</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">We obsess over the details so you don't have to.</p>
              <ul className="mt-6 space-y-4">
                {[
                  ["Background-verified pros", "Every professional is ID-verified and background-checked."],
                  ["Transparent pricing", "Fixed prices upfront. No hidden charges, ever."],
                  ["100% satisfaction guarantee", "Not happy? We'll redo it free or give a full refund."],
                  ["24/7 customer support", "Real humans available around the clock."],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                      <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    </span>
                    <div>
                      <div className="text-sm font-semibold">{t}</div>
                      <div className="text-sm text-gray-500">{d}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[["100k+", "Happy customers"], ["30+", "Services offered"], ["500+", "Verified pros"], ["4.8★", "Average rating"]].map(([v, l]) => (
                <div key={l} className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-6 text-white shadow-elevated">
                  <div className="text-3xl font-black">{v}</div>
                  <div className="mt-1 text-sm opacity-90">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── New Services Spotlight ── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-6">
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 mb-2">NEW</span>
          <h2 className="text-2xl font-bold">Now available on Servico</h2>
          <p className="mt-1 text-sm text-gray-500">Brand new service categories just launched</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "📷", label: "Security & CCTV", slug: "security", img: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=500&q=80", desc: "Camera installation & smart locks" },
            { icon: "📦", label: "Moving & Shifting", slug: "moving", img: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=500&q=80", desc: "Home & office relocation" },
            { icon: "💈", label: "Men's Grooming", slug: "men-grooming", img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80", desc: "Haircut & shave at home" },
            { icon: "🌡️", label: "Water Heater", slug: "water-heater", img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80", desc: "Repair & installation" },
          ].map((item) => (
            <button key={item.slug} onClick={() => navigate(`/category/${item.slug}`)}
              className="group relative overflow-hidden rounded-2xl shadow-soft hover:shadow-elevated transition-all hover:-translate-y-1 text-left">
              <div className="relative h-36">
                <img src={item.img} alt={item.label} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className="absolute top-3 left-3 text-2xl">{item.icon}</span>
                <div className="absolute bottom-3 left-3">
                  <div className="text-sm font-bold text-white">{item.label}</div>
                  <div className="text-xs text-white/70">{item.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="relative overflow-hidden grid items-center gap-8 rounded-3xl bg-gradient-to-r from-emerald-700 to-emerald-500 p-8 text-white shadow-elevated sm:grid-cols-[1fr_auto] sm:p-10">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div>
            <h2 className="text-2xl font-bold">Become a Servico Pro</h2>
            <p className="mt-2 text-sm text-white/90">Earn flexibly on your own schedule. Join 500+ verified pros serving customers across Dhaka.</p>
          </div>
          <button onClick={() => navigate("/become-provider")}
            className="shrink-0 rounded-full bg-white px-6 py-3 text-sm font-bold text-emerald-700 transition hover:opacity-90 hover:scale-105">
            Start earning →
          </button>
        </div>
      </section>
    </div>
  );
}
