import { useState } from "react";
import { Link } from "react-router-dom";
import { apiForgotPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await apiForgotPassword(email);
    setLoading(false);
    setSent(true);
  };

  if (sent) return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <div className="text-5xl">📧</div>
      <h1 className="mt-4 text-2xl font-bold">Check your email</h1>
      <p className="mt-2 text-sm text-gray-500">We sent a reset link to <strong>{email}</strong>.</p>
      <Link to="/login" className="mt-5 inline-block text-sm text-primary hover:underline">Back to login</Link>
    </div>
  );

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-elevated">
        <div className="text-4xl">🔑</div>
        <h1 className="mt-3 text-2xl font-bold">Forgot password?</h1>
        <p className="mt-1 text-sm text-gray-500">Enter your email and we'll send a reset link.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-field" />
          </div>
          <button disabled={loading} className="btn-primary w-full py-3">
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-gray-500">
          Remembered it? <Link to="/login" className="font-medium text-primary hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
