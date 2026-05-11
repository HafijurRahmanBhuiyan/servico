import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Clock, Wallet } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { fetchProviderEarnings } from "@/lib/api";

const payoutStyles = {
  paid: "bg-emerald-50 text-emerald-700",
  processing: "bg-amber-50 text-amber-700",
  scheduled: "bg-blue-50 text-blue-700",
};

export default function ProviderEarningsPage() {
  const [data, setData] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchProviderEarnings("u2").then(setData); }, []);

  if (!data) return null;

  const totalEarned = data.total_earned;
  const thisMonth = data.this_month;
  const lastMonth = data.last_month;
  const pendingPayout = data.pending_payout;

  const maxWeek = Math.max(...data.weekly.map((w) => w.amount), 1);

  const handlePayout = () => {
    setToast("Payout request submitted. Processed within 2 business days.");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-elevated">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
          <p className="mt-1 text-sm text-gray-500">Track your income and payouts</p>
        </div>
        <button onClick={handlePayout} className="btn-primary">
          <Wallet className="mr-1.5 h-4 w-4" /> Request Payout
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-5 text-white shadow-elevated">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-2xl font-black">{formatPrice(totalEarned)}</div>
              <div className="mt-1 text-sm opacity-90">Total Earned</div>
            </div>
            <DollarSign className="h-5 w-5 opacity-60" />
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-5 text-white shadow-elevated">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-2xl font-black">{formatPrice(thisMonth)}</div>
              <div className="mt-1 text-sm opacity-90">This Month</div>
            </div>
            <TrendingUp className="h-5 w-5 opacity-60" />
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-5 text-white shadow-elevated">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-2xl font-black">{formatPrice(lastMonth)}</div>
              <div className="mt-1 text-sm opacity-90">Last Month</div>
            </div>
            <TrendingUp className="h-5 w-5 opacity-60" />
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-amber-400 p-5 text-white shadow-elevated">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-2xl font-black">{formatPrice(pendingPayout)}</div>
              <div className="mt-1 text-sm opacity-90">Pending Payout</div>
            </div>
            <Clock className="h-5 w-5 opacity-60" />
          </div>
        </div>
      </div>

      {/* Payout banner */}
      {pendingPayout > 0 ? (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-5 py-4 text-sm text-emerald-800">
          Your next payout of <strong>{formatPrice(pendingPayout)}</strong> is scheduled for <strong>May 17, 2025</strong>. Paid to your bKash/bank account.
        </div>
      ) : (
        <div className="rounded-2xl bg-gray-50 border border-gray-200 px-5 py-4 text-sm text-gray-500">
          No pending payouts. Complete more jobs to earn.
        </div>
      )}

      {/* Weekly bar chart */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-soft">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Weekly Earnings</h2>
        <div className="flex items-end justify-between gap-4 h-32">
          {data.weekly.map((w) => (
            <div key={w.week_label} className="flex flex-col items-center gap-2 flex-1">
              <span className="text-xs font-semibold text-gray-700">{formatPrice(w.amount)}</span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all"
                style={{ height: `${(w.amount / maxWeek) * 100}%`, minHeight: w.amount > 0 ? "8px" : "0" }}
              />
              <span className="text-[10px] text-gray-400">{w.week_label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Earnings table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="px-5 py-3">Booking ID</th>
              <th className="px-5 py-3">Service</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Gross</th>
              <th className="px-5 py-3">Fee (15%)</th>
              <th className="px-5 py-3">Net</th>
              <th className="px-5 py-3">Payout Status</th>
            </tr>
          </thead>
          <tbody>
            {data.transactions.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">No transactions</td></tr>
            )}
            {data.transactions.map((t) => (
              <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-5 py-3 font-mono text-xs text-gray-400">{t.booking_id}</td>
                <td className="px-5 py-3 font-medium">{t.service}</td>
                <td className="px-5 py-3 text-gray-500">{t.date}</td>
                <td className="px-5 py-3">{formatPrice(t.gross)}</td>
                <td className="px-5 py-3 text-red-500">{formatPrice(Math.round(t.gross * 0.15))}</td>
                <td className="px-5 py-3 font-semibold text-primary">{formatPrice(t.net)}</td>
                <td className="px-5 py-3">
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold capitalize", payoutStyles[t.payout_status])}>
                    {t.payout_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
