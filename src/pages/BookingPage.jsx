//Sohan's work

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Calendar, Clock, MapPin, Phone, Zap, X, Smartphone, Landmark } from "lucide-react";
import { fetchServiceById, createBooking, initiateBkashPayment, initiateNagadPayment, completePayment } from "@/lib/api";
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
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customer_name: "", phone: "", address: "", notes: "",
    scheduled_date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    scheduled_time: "10:00 AM", is_urgent: false, payment_method: "cash",
  });
  const [showBkashModal, setShowBkashModal] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [bkashStep, setBkashStep] = useState("form");
  const [bkashPhone, setBkashPhone] = useState("");
  const [bkashPin, setBkashPin] = useState("");
  const [bkashOtp, setBkashOtp] = useState("");
  const [bkashLoading, setBkashLoading] = useState(false);
  const [bkashError, setBkashError] = useState("");
  const [showNagadModal, setShowNagadModal] = useState(false);
  const [nagadStep, setNagadStep] = useState("form");
  const [nagadPhone, setNagadPhone] = useState("");
  const [nagadPin, setNagadPin] = useState("");
  const [nagadOtp, setNagadOtp] = useState("");
  const [nagadLoading, setNagadLoading] = useState(false);
  const [nagadError, setNagadError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchServiceById(id).then((s) => { if (!s) navigate("/services"); else setService(s); });
    if (user) setForm((f) => ({ ...f, customer_name: user.name }));
  }, [id, user, navigate]);

  if (!service) return <div className="flex min-h-[50vh] items-center justify-center text-sm text-gray-400">Loading...</div>;

  const price = Number(service.price);
  const visiting = 150;
  const urgentFee = form.is_urgent ? 100 : 0;
  const subtotal = price + visiting + urgentFee;
  const vat = Math.round(subtotal * 0.05);
  const total = subtotal + vat;

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const { error, booking } = await createBooking({
      service: service.id,
      ...form,
      service_charge: price,
      visiting_charge: visiting,
      urgent_fee: urgentFee,
      vat, discount_amount: 0, wallet_used: 0, total_amount: total,
    });
    setSubmitting(false);
    if (error) { alert(error); return; }
    if (form.payment_method === "bkash") {
      setCurrentBookingId(booking.id);
      setShowBkashModal(true);
    } else if (form.payment_method === "nagad") {
      setCurrentBookingId(booking.id);
      setShowNagadModal(true);
    } else if (form.payment_method === "cash") {
      await completePayment(booking.id, "cash", form.phone, "pending");
      navigate("/dashboard/bookings");
    } else {
      await completePayment(booking.id, form.payment_method, form.phone, "pending");
      navigate("/dashboard/bookings");
    }
  };

  const handleSendOtp = () => {
    const phoneRegex = /^01\d{9}$/;
    if (!bkashPhone || !phoneRegex.test(bkashPhone)) {
      setBkashError("Please enter a valid bKash account number (01XXXXXXXXX)");
      return;
    }
    if (!bkashPin || bkashPin.length < 4) {
      setBkashError("Please enter your bKash PIN");
      return;
    }
    setBkashError("");
    setBkashStep("otp");
  };

  const handleVerifyAndPay = async () => {
    if (!bkashOtp || bkashOtp.length < 4) {
      setBkashError("Please enter the OTP code sent to your bKash");
      return;
    }
    setBkashLoading(true);
    setBkashError("");

    try {
      const result = await initiateBkashPayment(currentBookingId);
      if (result.error) throw new Error(result.error);
      if (result.bkashURL) {
        window.location.href = result.bkashURL;
        return;
      }
    } catch {
      await completePayment(currentBookingId, "bkash", bkashPhone);
    }

    setBkashLoading(false);
    navigate("/dashboard/bookings?payment=success");
  };

  const resetBkashModal = () => {
    setShowBkashModal(false);
    setBkashStep("form");
    setBkashPhone("");
    setBkashPin("");
    setBkashOtp("");
    setBkashError("");
  };

  const handleNagadSendOtp = () => {
    const phoneRegex = /^01\d{9}$/;
    if (!nagadPhone || !phoneRegex.test(nagadPhone)) {
      setNagadError("Please enter a valid Nagad account number (01XXXXXXXXX)");
      return;
    }
    if (!nagadPin || nagadPin.length < 4) {
      setNagadError("Please enter your Nagad PIN");
      return;
    }
    setNagadError("");
    setNagadStep("otp");
  };

  const handleNagadVerifyAndPay = async () => {
    if (!nagadOtp || nagadOtp.length < 4) {
      setNagadError("Please enter the OTP code sent to your Nagad");
      return;
    }
    setNagadLoading(true);
    setNagadError("");

    try {
      const result = await initiateNagadPayment(currentBookingId);
      if (result.error) throw new Error(result.error);
      if (result.redirectURL) {
        window.location.href = result.redirectURL;
        return;
      }
    } catch {
      await completePayment(currentBookingId, "nagad", nagadPhone);
    }

    setNagadLoading(false);
    navigate("/dashboard/bookings?payment=success");
  };

  const resetNagadModal = () => {
    setShowNagadModal(false);
    setNagadStep("form");
    setNagadPhone("");
    setNagadPin("");
    setNagadOtp("");
    setNagadError("");
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

      {/* bKash Payment Modal */}
      {showBkashModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => { if (!bkashLoading && bkashStep !== "otp") resetBkashModal(); }}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-elevated" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-pink-500" />
                <h3 className="text-lg font-semibold">bKash Payment</h3>
              </div>
              {!bkashLoading && (
                <button onClick={resetBkashModal} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="mt-4 rounded-xl bg-gray-50 p-4 text-center">
              <div className="text-sm text-gray-500">Amount to Pay</div>
              <div className="text-2xl font-bold text-emerald-600">{formatPrice(total)}</div>
            </div>

            {bkashStep === "form" && (
              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">bKash Account Number</label>
                  <input type="tel" placeholder="01XXXXXXXXX" value={bkashPhone} maxLength={11}
                    onChange={(e) => { setBkashPhone(e.target.value); setBkashError(""); }}
                    className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">bKash PIN</label>
                  <input type="password" placeholder="Enter your PIN" value={bkashPin} maxLength={20}
                    onChange={(e) => { setBkashPin(e.target.value); setBkashError(""); }}
                    className="input-field" />
                </div>
                {bkashError && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{bkashError}</div>
                )}
                <button onClick={handleSendOtp}
                  className="mt-2 w-full rounded-2xl bg-gradient-to-r from-pink-600 to-pink-500 py-4 text-base font-semibold text-white shadow-soft transition hover:opacity-90">
                  Send OTP
                </button>
                <p className="text-center text-xs text-gray-400">An OTP will be sent to your bKash app</p>
              </div>
            )}

            {bkashStep === "otp" && (
              <div className="mt-5 space-y-4">
                <div className="rounded-lg bg-emerald-50 p-3 text-center text-sm text-emerald-700">
                  An OTP has been sent to <strong>{bkashPhone}</strong> via bKash app
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">OTP Verification Code</label>
                  <input type="text" inputMode="numeric" placeholder="Enter 4-digit OTP" value={bkashOtp} maxLength={6}
                    onChange={(e) => { setBkashOtp(e.target.value.replace(/\D/g, "")); setBkashError(""); }}
                    className="input-field text-center text-lg tracking-[0.5em]" disabled={bkashLoading} />
                </div>
                {bkashError && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{bkashError}</div>
                )}
                <button onClick={handleVerifyAndPay} disabled={bkashLoading}
                  className="mt-2 w-full rounded-2xl bg-gradient-to-r from-pink-600 to-pink-500 py-4 text-base font-semibold text-white shadow-soft transition hover:opacity-90 disabled:opacity-50">
                  {bkashLoading ? "Processing Payment..." : `Verify & Pay ${formatPrice(total)}`}
                </button>
                <button onClick={() => { setBkashStep("form"); setBkashOtp(""); setBkashError(""); }}
                  className="w-full text-center text-sm text-gray-500 hover:text-gray-700" disabled={bkashLoading}>
                  ← Change bKash account
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Nagad Payment Modal */}
      {showNagadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => { if (!nagadLoading && nagadStep !== "otp") resetNagadModal(); }}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-elevated" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Landmark className="h-5 w-5 text-orange-500" />
                <h3 className="text-lg font-semibold">Nagad Payment</h3>
              </div>
              {!nagadLoading && (
                <button onClick={resetNagadModal} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="mt-4 rounded-xl bg-gray-50 p-4 text-center">
              <div className="text-sm text-gray-500">Amount to Pay</div>
              <div className="text-2xl font-bold text-emerald-600">{formatPrice(total)}</div>
            </div>

            {nagadStep === "form" && (
              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Nagad Account Number</label>
                  <input type="tel" placeholder="01XXXXXXXXX" value={nagadPhone} maxLength={11}
                    onChange={(e) => { setNagadPhone(e.target.value); setNagadError(""); }}
                    className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Nagad PIN</label>
                  <input type="password" placeholder="Enter your PIN" value={nagadPin} maxLength={20}
                    onChange={(e) => { setNagadPin(e.target.value); setNagadError(""); }}
                    className="input-field" />
                </div>
                {nagadError && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{nagadError}</div>
                )}
                <button onClick={handleNagadSendOtp}
                  className="mt-2 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 py-4 text-base font-semibold text-white shadow-soft transition hover:opacity-90">
                  Send OTP
                </button>
                <p className="text-center text-xs text-gray-400">An OTP will be sent to your Nagad app</p>
              </div>
            )}

            {nagadStep === "otp" && (
              <div className="mt-5 space-y-4">
                <div className="rounded-lg bg-emerald-50 p-3 text-center text-sm text-emerald-700">
                  An OTP has been sent to <strong>{nagadPhone}</strong> via Nagad app
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">OTP Verification Code</label>
                  <input type="text" inputMode="numeric" placeholder="Enter 4-digit OTP" value={nagadOtp} maxLength={6}
                    onChange={(e) => { setNagadOtp(e.target.value.replace(/\D/g, "")); setNagadError(""); }}
                    className="input-field text-center text-lg tracking-[0.5em]" disabled={nagadLoading} />
                </div>
                {nagadError && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{nagadError}</div>
                )}
                <button onClick={handleNagadVerifyAndPay} disabled={nagadLoading}
                  className="mt-2 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 py-4 text-base font-semibold text-white shadow-soft transition hover:opacity-90 disabled:opacity-50">
                  {nagadLoading ? "Processing Payment..." : `Verify & Pay ${formatPrice(total)}`}
                </button>
                <button onClick={() => { setNagadStep("form"); setNagadOtp(""); setNagadError(""); }}
                  className="w-full text-center text-sm text-gray-500 hover:text-gray-700" disabled={nagadLoading}>
                  ← Change Nagad account
                </button>
              </div>
            )}
          </div>
        </div>
      )}
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
