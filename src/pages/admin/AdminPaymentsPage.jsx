import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Clock } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { fetchMockPayments, updatePaymentStatus } from "@/lib/api";

const METHOD_FILTERS = ["All", "Cash", "bKash", "Nagad", "Card"];
const statusStyles = {
  paid: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  refunded: "bg-red-50 text-red-600",
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [methodFilter, setMethodFilter] = useState("All");

  useEffect(() => { fetchMockPayments().then(setPayments); }, []);

  const filtered = payments.filter((p) => methodFilter === "All" || p.method === methodFilter);

  const totalRevenue = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const thisMonth = payments
    .filter((p) => p.status === "paid" && p.date >= "2025-04-01")
    .reduce((s, p) => s + p.amount, 0);
  const pendingPayouts = payments
    .filter((p) => p.status === "pending")
    .reduce((s, p) => s + p.amount, 0);

  const handleRefund = async (id) => {
    if (!confirm("Issue refund for this payment?")) return;
    await updatePaymentStatus(id, "refunded");
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status: "refunded" } : p)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="mt-1 text-sm text-gray-500">Track all transactions and revenue</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-5 text-white shadow-elevated">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-2xl font-black">{formatPrice(totalRevenue)}</div>
              <div className="mt-1 text-sm opacity-90">Total Revenue</div>
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
        <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-amber-400 p-5 text-white shadow-elevated">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-2xl font-black">{formatPrice(pendingPayouts)}</div>
              <div className="mt-1 text-sm opacity-90">Pending Payouts</div>
            </div>
            <Clock className="h-5 w-5 opacity-60" />
          </div>
        </div>
      </div>

      {/* Method Filter */}
      <div className="flex gap-2">
        {METHOD_FILTERS.map((m) => (
          <button
            key={m}
            onClick={() => setMethodFilter(m)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold transition",
              methodFilter === m
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            )}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="px-5 py-3">Booking ID</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Service</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Method</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-400">No payments found</td></tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-5 py-3 font-mono text-xs text-gray-400">{p.booking_id}</td>
                <td className="px-5 py-3 text-gray-500">{p.customer}</td>
                <td className="px-5 py-3 font-medium">{p.service}</td>
                <td className="px-5 py-3 font-semibold">{formatPrice(p.amount)}</td>
                <td className="px-5 py-3 text-gray-500">{p.method}</td>
                <td className="px-5 py-3">
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold capitalize", statusStyles[p.status] || "bg-gray-100 text-gray-600")}>
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">{p.date}</td>
                <td className="px-5 py-3">
                  {p.status === "paid" && (
                    <button onClick={() => handleRefund(p.id)} className="rounded-lg border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">
                      Issue Refund
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
