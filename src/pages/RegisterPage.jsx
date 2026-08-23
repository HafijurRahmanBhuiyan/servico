import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import PasswordInput from "@/components/PasswordInput";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const mismatch = form.confirmPassword.length > 0 && form.confirmPassword !== form.password;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (mismatch) { setError("Does not match"); return; }
    setLoading(true);
    const { error: err } = await signUp(form.email, form.password, form.fullName, form.phone);
    setLoading(false);
    if (err) { setError(err); return; }
    navigate(redirect);
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
            { label: "Confirm Password", key: "confirmPassword", type: "password", placeholder: "Re-enter your password" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="mb-1 block text-sm font-medium">{label}</label>
              {type === "password" ? (
                <PasswordInput required value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  aria-invalid={key === "confirmPassword" && mismatch || undefined} />
              ) : (
                <input type={type} required value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder} className="input-field" />
              )}
              {key === "confirmPassword" && mismatch && (
                <p className="mt-1 text-xs text-red-500">Does not match</p>
              )}
            </div>
          ))}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button disabled={loading || mismatch} className="btn-primary w-full py-3">
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
