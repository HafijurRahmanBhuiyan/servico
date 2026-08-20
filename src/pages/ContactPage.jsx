import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, LogIn } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { sendSupportMessage } from "@/lib/api";

export default function ContactPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    subject: "general",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await sendSupportMessage(form.subject, form.message);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSent(true);
  };

  if (sent) return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <div className="text-6xl">✅</div>
      <h1 className="mt-5 text-2xl font-bold">Message received!</h1>
      <p className="mt-2 text-gray-500">We'll get back to you at <strong>{user.email}</strong> within 24 hours.</p>
      <button onClick={() => { setSent(false); setForm({ subject: "general", message: "" }); }}
        className="btn-secondary mt-6">Send another message</button>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold">Get in touch</h1>
      <p className="mt-2 text-gray-500">We'd love to hear from you. Reach out anytime.</p>
      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          {[
            { icon: Phone, label: "Phone / WhatsApp", value: "+880 1700-000000", sub: "Mon–Sun, 8am–10pm" },
            { icon: Mail, label: "Email", value: "hello@servico.xyz", sub: "Reply within 24 hours" },
            { icon: MapPin, label: "Office", value: "Gulshan-2, Dhaka 1212", sub: "Walk-ins welcome" },
            { icon: Clock, label: "Support hours", value: "8:00 AM – 10:00 PM", sub: "Every day" },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-soft">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-gray-400">{label}</div>
                <div className="font-semibold">{value}</div>
                <div className="text-xs text-gray-400">{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {!user ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white p-10 shadow-elevated text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-primary mb-4">
              <LogIn className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold">Login required</h2>
            <p className="mt-2 text-sm text-gray-500 max-w-xs">
              Please log in to send us a message. This helps us track your request and respond promptly.
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/login?redirect=/contact" className="btn-primary px-6 py-2.5">
                Log in
              </Link>
              <Link to="/register?redirect=/contact" className="btn-secondary px-6 py-2.5">
                Create account
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-elevated">
            <h2 className="text-lg font-bold">Send us a message</h2>

            <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 text-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-gray-400">{user.email}</div>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Subject</label>
              <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field">
                <option value="general">General inquiry</option>
                <option value="booking">Booking issue</option>
                <option value="provider">Provider support</option>
                <option value="complaint">Complaint</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Message</label>
              <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Describe your issue..." className="input-field resize-none" />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <button disabled={loading} className="btn-primary w-full py-3">
              {loading ? "Sending..." : "Send message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
