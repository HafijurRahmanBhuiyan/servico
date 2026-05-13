import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", referralCode: searchParams.get("ref") ?? "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    const { error: err } = await signUp(form.email, form.password, form.fullName, form.phone);
    setLoading(false);
    if (err) { setError(err); return; }
    navigate("/");
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-elevated">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 font-bold text-white shadow-glow text-xl">S</div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500">Join 100,000+ happy households.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          {[
            { label: "Full name", key: "fullName", type: "text", placeholder: "Hafijur Rahman" },
            { label: "Email", key: "email", type: "email", placeholder: "you@example.com" },
            { label: "Phone", key: "phone", type: "tel", placeholder: "01XXXXXXXXX" },
            { label: "Password", key: "password", type: "password", placeholder: "At least 6 characters" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="mb-1 block text-sm font-medium">{label}</label>
              <input type={type} required value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder} className="input-field" />
            </div>
          ))}
          <div>
            <label className="mb-1 block text-sm font-medium">Referral code <span className="text-gray-400">(optional)</span></label>
            <input value={form.referralCode} onChange={(e) => setForm({ ...form, referralCode: e.target.value.toUpperCase() })}
              placeholder="e.g. SERV1234" className="input-field font-mono" />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button disabled={loading} className="btn-primary w-full py-3">
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
