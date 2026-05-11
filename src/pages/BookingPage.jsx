//Sohan's work

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Calendar, Clock, MapPin, Phone, Zap, Tag } from "lucide-react";
import { fetchServiceById, validatePromoCode, createBooking } from "@/lib/api";
import { formatPrice, cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";

const PAYMENT_METHODS = [
  { id: "cash", label: "Cash on delivery", icon: "💵" },
  { id: "bkash", label: "bKash", icon: "📱" },
  { id: "nagad", label: "Nagad", icon: "💳" },
  { id: "card", label: "Card (SSLCommerz)", icon: "🏦" },
];

export default function BookingPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(null);
  const [checkingPromo, setCheckingPromo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customer_name: "", phone: "", address: "", notes: "",
    scheduled_date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    scheduled_time: "10:00 AM", is_urgent: false, payment_method: "cash",
  });

  useEffect(() => {
    if (!id) return;
    fetchServiceById(id).then((s) => { if (!s) navigate("/services"); else setService(s); });
    if (user) setForm((f) => ({ ...f, customer_name: user.name }));
  }, [id, user, navigate]);

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    setCheckingPromo(true);
    const result = await validatePromoCode(promoCode.toUpperCase());
    setCheckingPromo(false);
    if (result.error || !result.type) { alert(result.error ?? "Invalid promo code"); return; }
    setPromoApplied({ code: promoCode.toUpperCase(), ...result });
  };

  if (!service) return <div className="flex min-h-[50vh] items-center justify-center text-sm text-gray-400">Loading...</div>;

  const visiting = 150;
  const urgentFee = form.is_urgent ? 100 : 0;
  const subtotal = service.price + visiting + urgentFee;
  const promoDiscount = promoApplied
    ? promoApplied.type === "percent" ? Math.round((subtotal * promoApplied.value) / 100) : Math.min(promoApplied.value, subtotal)
    : 0;
  const vat = Math.round((subtotal - promoDiscount) * 0.05);
  const total = subtotal - promoDiscount + vat;

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await createBooking({
      customer_id: user.id, service_id: service.id, status: "pending",
      ...form,
      service_charge: service.price, visiting_charge: visiting + urgentFee,
      vat, discount_amount: promoDiscount, wallet_used: 0, total_amount: total,
      promo_code: promoApplied?.code ?? null,
    });
    setSubmitting(false);
    if (error) { alert(error); return; }
    navigate("/dashboard/bookings");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link to={`/service/${service.id}`} className="text-sm text-gray-400 hover:text-gray-700">← Back to service</Link>
      <h1 className="mt-3 text-3xl font-bold">Confirm your booking</h1>

      <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-5">

          {/* Contact */}
          <Section title="Contact details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name">
                <input required value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className="input-field" />
              </Field>
              <Field label="Phone">
                <input required value={form.phone} placeholder="01XXXXXXXXX" onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
              </Field>
            </div>
            <Field label="Service address">
              <textarea required rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field resize-none" />
            </Field>
          </Section>

          {/* Schedule */}
          <Section title="Schedule">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date">
                <input type="date" required min={new Date().toISOString().slice(0, 10)} value={form.scheduled_date}
                  onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} className="input-field" />
              </Field>
              <Field label="Preferred time">
                <select value={form.scheduled_time} onChange={(e) => setForm({ ...form, scheduled_time: e.target.value })} className="input-field">
                  {["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
            </div>
            <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-3">
              <input type="checkbox" checked={form.is_urgent} onChange={(e) => setForm({ ...form, is_urgent: e.target.checked })} className="h-4 w-4 accent-primary" />
              <Zap className="h-4 w-4 text-amber-500" />
              <div>
                <div className="text-sm font-medium">Urgent booking</div>
                <div className="text-xs text-gray-400">Priority response +৳100</div>
              </div>
            </label>
            <Field label="Notes (optional)" className="mt-3">
              <textarea rows={2} value={form.notes} placeholder="Anything the pro should know?"
                onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field resize-none" />
            </Field>
          </Section>

          {/* Promo */}
          <Section title="Promo code">
            {promoApplied ? (
              <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3">
                <div>
                  <div className="text-sm font-semibold text-emerald-700">✓ {promoApplied.code} applied</div>
                  <div className="text-xs text-gray-400">You save {formatPrice(promoDiscount)}</div>
                </div>
                <button type="button" onClick={() => { setPromoApplied(null); setPromoCode(""); }} className="text-xs text-red-500 hover:underline">Remove</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input value={promoCode} placeholder="Enter promo code"
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())} className="input-field flex-1 font-mono text-sm" />
                <button type="button" onClick={applyPromo} disabled={checkingPromo || !promoCode.trim()}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold hover:bg-gray-100 disabled:opacity-50">
                  {checkingPromo ? "..." : "Apply"}
                </button>
              </div>
            )}
          </Section>

          {/* Payment */}
          <Section title="Payment method">
            <div className="grid gap-3 sm:grid-cols-2">
              {PAYMENT_METHODS.map((m) => (
                <button type="button" key={m.id} onClick={() => setForm({ ...form, payment_method: m.id })}
                  className={cn("flex items-center gap-3 rounded-xl border p-3 text-left transition",
                    form.payment_method === m.id ? "border-primary bg-emerald-50 ring-2 ring-emerald-200" : "border-gray-200 hover:border-emerald-300")}>
                  <span className="text-2xl">{m.icon}</span>
                  <span className="text-sm font-medium">{m.label}</span>
                </button>
              ))}
            </div>
          </Section>
        </div>

        {/* Summary */}
        <aside>
          <div className="sticky top-24 rounded-3xl border border-gray-200 bg-white p-6 shadow-elevated">
            <h3 className="text-lg font-semibold">Order summary</h3>
            <div className="mt-4 flex gap-3 rounded-xl bg-gray-50 p-3">
              <div className="text-3xl">{service.icon ?? "🛠️"}</div>
              <div>
                <div className="text-sm font-semibold">{service.title}</div>
                <div className="text-xs text-gray-400">{service.duration}</div>
              </div>
            </div>
            <dl className="mt-5 space-y-2 text-sm">
              <PriceLine label="Service charge" value={formatPrice(service.price)} />
              <PriceLine label="Visiting charge" value={formatPrice(visiting)} />
              {urgentFee > 0 && <PriceLine label="Urgent fee" value={formatPrice(urgentFee)} />}
              {promoDiscount > 0 && <PriceLine label="Promo discount" value={`−${formatPrice(promoDiscount)}`} className="text-emerald-600" />}
              <PriceLine label="VAT (5%)" value={formatPrice(vat)} />
              <div className="my-2 border-t border-gray-100" />
              <div className="flex items-center justify-between text-base font-bold">
                <dt>Total</dt>
                <dd className="text-primary">{formatPrice(total)}</dd>
              </div>
            </dl>
            <button disabled={submitting}
              className="mt-5 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 py-4 text-base font-semibold text-white shadow-soft transition hover:opacity-90 disabled:opacity-50">
              {submitting ? "Confirming..." : "Confirm booking"}
            </button>
            <p className="mt-3 text-center text-xs text-gray-400">By confirming, you agree to our terms of service.</p>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-soft">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children, className }) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

function PriceLine({ label, value, className }) {
  return (
    <div className={cn("flex justify-between", className)}>
      <dt className="text-gray-500">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
