import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err, role } = await signIn(email, password);
    setLoading(false);
    if (err) { setError(err); return; }
    if (role === "admin") { navigate("/admin"); return; }
    navigate(redirect);
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-elevated">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 font-bold text-white shadow-glow text-xl">S</div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to manage your bookings.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input-field" />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button disabled={loading} className="btn-primary w-full py-3">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="mt-3 text-right">
          <Link to="/forgot-password" className="text-xs text-gray-400 hover:text-primary">Forgot password?</Link>
        </div>
        <p className="mt-5 text-center text-sm text-gray-500">
          New here? <Link to="/register" className="font-medium text-primary hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
