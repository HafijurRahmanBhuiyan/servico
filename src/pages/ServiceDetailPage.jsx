//Arman's Work
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Star, Clock, Check, Shield, ChevronDown, ChevronLeft, ChevronRight, Award, Briefcase, ThumbsUp } from "lucide-react";
import { fetchServiceById, fetchServiceReviews } from "@/lib/api";
import { formatPrice, formatNum, cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!id) return;
    Promise.all([fetchServiceById(id), fetchServiceReviews(id)]).then(([svc, rvs]) => {
      setService(svc);
      setReviews(rvs);
      setLoading(false);
      setActiveImg(0);
    });
  }, [id]);

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-10"><div className="h-96 animate-pulse rounded-2xl bg-gray-100" /></div>;
  if (!service) return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <div className="text-6xl">🤷</div>
      <h1 className="mt-4 text-2xl font-bold">Service not found</h1>
      <Link to="/services" className="mt-4 inline-block text-primary hover:underline">Browse services</Link>
    </div>
  );

  const allImages = [service.image_url, ...(service.gallery || [])].filter(Boolean);
  const hasMultipleImages = allImages.length > 1;

  const onBook = () => {
    if (!user) navigate(`/login?redirect=/booking/${service.id}`);
    else navigate(`/booking/${service.id}`);
  };

  const prevImg = () => setActiveImg(i => (i - 1 + allImages.length) % allImages.length);
  const nextImg = () => setActiveImg(i => (i + 1) % allImages.length);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-2 text-xs text-gray-400">
        <Link to="/" className="hover:text-gray-700">Home</Link> /
        <Link to="/services" className="hover:text-gray-700">Services</Link> /
        <span className="text-gray-700">{service.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          {/* Image Gallery */}
          <div className="relative overflow-hidden rounded-3xl bg-gray-100">
            {service.image_url
              ? <img src={allImages[activeImg]} alt={service.title} className="h-72 w-full object-cover sm:h-[420px] transition-opacity duration-300" />
              : <div className="flex h-72 items-center justify-center text-9xl sm:h-96">{service.icon}</div>
            }
            {/* Badge */}
            {service.badge && (
              <span className="absolute top-4 left-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow">
                ⭐ {service.badge}
              </span>
            )}
            {/* Nav arrows */}
            {hasMultipleImages && (
              <>
                <button onClick={prevImg} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow backdrop-blur hover:bg-white">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={nextImg} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow backdrop-blur hover:bg-white">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {hasMultipleImages && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {allImages.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={cn("flex-shrink-0 overflow-hidden rounded-xl border-2 transition", activeImg === i ? "border-emerald-500" : "border-transparent opacity-60 hover:opacity-100")}>
                  <img src={img} alt="" className="h-16 w-24 object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Title + meta */}
          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{service.title}</h1>
          {service.subtitle && <p className="mt-2 text-gray-500">{service.subtitle}</p>}

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-800">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {service.rating} ({formatNum(service.review_count)} reviews)
            </span>
            {service.duration && (
              <span className="flex items-center gap-1.5 text-gray-500"><Clock className="h-4 w-4" /> {service.duration}</span>
            )}
            {service.is_popular && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">🔥 Popular</span>
            )}
          </div>

          {/* Provider Stats */}
          {service.provider_stats && (
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-emerald-50 p-4 text-center">
                <Briefcase className="mx-auto h-5 w-5 text-emerald-600" />
                <div className="mt-1 text-xl font-black text-emerald-700">{formatNum(service.provider_stats.jobs_done)}+</div>
                <div className="text-xs text-emerald-600">Jobs Done</div>
              </div>
              <div className="rounded-2xl bg-blue-50 p-4 text-center">
                <Award className="mx-auto h-5 w-5 text-blue-600" />
                <div className="mt-1 text-xl font-black text-blue-700">{service.provider_stats.experience_years} yrs</div>
                <div className="text-xs text-blue-600">Experience</div>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4 text-center">
                <ThumbsUp className="mx-auto h-5 w-5 text-amber-600" />
                <div className="mt-1 text-xl font-black text-amber-700">{service.provider_stats.satisfaction}%</div>
                <div className="text-xs text-amber-600">Satisfaction</div>
              </div>
            </div>
          )}

          {/* Description */}
          {service.description && (
            <section className="mt-8">
              <h2 className="text-xl font-bold">About this service</h2>
              <p className="mt-3 leading-relaxed text-gray-600">{service.long_description || service.description}</p>
            </section>
          )}

          {/* What's included */}
          {service.includes?.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-bold">What's included</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {service.includes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" /> {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* How it works */}
          {service.process?.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-bold">How it works</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {service.process.map((step) => (
                  <div key={step.step} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                      {step.step}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{step.title}</div>
                      <div className="mt-0.5 text-xs text-gray-500">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          {service.faq?.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-bold">Frequently asked questions</h2>
              <div className="mt-4 space-y-3">
                {service.faq.map((faq, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold">
                      {faq.q}
                      <ChevronDown className={cn("h-5 w-5 shrink-0 transition", openFaq === i && "rotate-180")} />
                    </button>
                    {openFaq === i && <div className="px-5 pb-4 text-sm text-gray-500">{faq.a}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-bold">Customer reviews</h2>
              <div className="mt-4 space-y-3">
                {reviews.map((r) => (
                  <div key={r.id} className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="flex items-center gap-3">
                      {r.avatar ? (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                          {r.avatar}
                        </div>
                      ) : null}
                      <div>
                        <div className="text-sm font-semibold">{r.author || "Customer"}</div>
                        <div className="mt-0.5 flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={cn("h-3.5 w-3.5", i < r.rating ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
                          ))}
                        </div>
                      </div>
                      <div className="ml-auto text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}</div>
                    </div>
                    {r.comment && <p className="mt-3 text-sm text-gray-600 leading-relaxed">{r.comment}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Booking card */}
        <aside>
          <div className="sticky top-24 rounded-3xl border border-gray-200 bg-white p-6 shadow-elevated">
            <div className="text-xs uppercase tracking-wider text-gray-400">Starts from</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-4xl font-black text-primary">{formatPrice(service.price)}</span>
              <span className="text-sm text-gray-400">+ visiting charge</span>
            </div>
            <button onClick={onBook}
              className="mt-5 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 py-4 text-base font-semibold text-white shadow-soft transition hover:opacity-90">
              Book now
            </button>
            <div className="mt-6 space-y-3 text-sm text-gray-500">
              <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-500" /> Verified pro guarantee</div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Free re-service if not satisfied</div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-emerald-500" /> Same-day slots available</div>
            </div>

            {/* Quick includes summary */}
            {service.includes?.length > 0 && (
              <div className="mt-6 border-t border-gray-100 pt-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Includes</div>
                <ul className="space-y-2">
                  {service.includes.slice(0, 4).map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" /> {item}
                    </li>
                  ))}
                  {service.includes.length > 4 && (
                    <li className="text-xs text-emerald-600 font-medium">+{service.includes.length - 4} more included</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
