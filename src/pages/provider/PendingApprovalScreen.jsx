import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function PendingApprovalScreen() {
  const { providerStatus, providerApplication } = useAuth();
  const isRejected = providerStatus === "rejected";

  if (isRejected) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <div className="text-8xl">❌</div>
        <h1 className="mt-5 text-2xl font-bold text-gray-900">Application Not Approved</h1>
        <p className="mt-2 text-gray-500">Unfortunately your application wasn't approved at this time.</p>
        {providerApplication?.rejection_reason && (
          <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            Reason: {providerApplication.rejection_reason}
          </div>
        )}
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link to="/become-provider" className="btn-primary px-6 py-3">Apply Again</Link>
          <Link to="/contact" className="btn-secondary px-6 py-3">Contact Support</Link>
        </div>
      </div>
    );
  }

  // Pending state
  return (
    <div className="mx-auto max-w-xl py-20 text-center">
      <div className="text-8xl">⏳</div>
      <h1 className="mt-5 text-2xl font-bold text-gray-900">Application Under Review</h1>
      <p className="mt-2 text-gray-500">
        Our team is reviewing your application. You'll be notified once approved — usually within 24 hours.
      </p>

      {/* Progress stepper */}
      <div className="mt-10 flex items-center justify-center gap-0">
        <div className="flex flex-col items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white font-bold">✓</div>
          <span className="mt-2 text-xs font-medium text-emerald-600">Submitted</span>
        </div>
        <div className="h-0.5 w-16 bg-emerald-300" />
        <div className="flex flex-col items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-white font-bold animate-pulse">
            <span className="h-3 w-3 rounded-full bg-white" />
          </div>
          <span className="mt-2 text-xs font-medium text-amber-500">Under Review</span>
        </div>
        <div className="h-0.5 w-16 bg-gray-300" />
        <div className="flex flex-col items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-400 font-bold">✓</div>
          <span className="mt-2 text-xs font-medium text-gray-400">Activated</span>
        </div>
      </div>

      {/* Skills */}
      {providerApplication?.skills?.length > 0 && (
        <div className="mt-8">
          <p className="text-sm font-medium text-gray-500 mb-2">Applied skills:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {providerApplication.skills.map((s) => (
              <span key={s} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">{s}</span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 space-x-4">
        <Link to="/contact" className="text-sm font-medium text-primary hover:underline">Need help?</Link>
        <Link to="/" className="btn-secondary px-6 py-3">Back to Home</Link>
      </div>
    </div>
  );
}
