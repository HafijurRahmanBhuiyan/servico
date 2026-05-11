//Sohan's work


import { useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "general", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: POST /contact
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSent(true);
  };

  if (sent) return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <div className="text-6xl">✅</div>
      <h1 className="mt-5 text-2xl font-bold">Message received!</h1>
      <p className="mt-2 text-gray-500">We'll get back to you at <strong>{form.email}</strong> within 24 hours.</p>
      <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "general", message: "" }); }}
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
        <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-elevated">
          <h2 className="text-lg font-bold">Send us a message</h2>
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
          {[{ label: "Name", key: "name", type: "text" }, { label: "Email", key: "email", type: "email" }].map(({ label, key, type }) => (
            <div key={key}>
              <label className="mb-1 block text-sm font-medium">{label}</label>
              <input required type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="input-field" />
            </div>
          ))}
          <div>
            <label className="mb-1 block text-sm font-medium">Message</label>
            <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Describe your issue..." className="input-field resize-none" />
          </div>
          <button disabled={loading} className="btn-primary w-full py-3">
            {loading ? "Sending..." : "Send message"}
          </button>
        </form>
      </div>
    </div>
  );
}
