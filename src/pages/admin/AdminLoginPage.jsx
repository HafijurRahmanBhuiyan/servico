import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const { user, signIn, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) navigate("/admin", { replace: true });
  }, [isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn(email, password);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
        return;
      }
      window.location.href = "/admin";
    } catch (err) {
      setError("Network error — is the backend running?");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-elevated">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 text-2xl font-black text-white shadow-glow">
            S
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Servico</h1>
          <p className="mt-1 text-sm text-gray-500">Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="admin@servico.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            <LogIn className="mr-2 h-4 w-4" />
            {loading ? "Signing in..." : "Sign in as Admin"}
          </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-sm font-medium text-gray-400 hover:text-primary transition"
            >
              ← Back to home
            </button>
          </div>
        </div>
      </div>
  );
}
