import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Clock, Phone, Building, Hash, User, Calendar, Search, Copy, Check, Banknote, Smartphone, Landmark, Receipt, ArrowRightLeft } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { fetchMockPayments, updatePaymentStatus } from "@/lib/api";

const now = new Date();
const thisMonthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

const METHOD_FILTERS = ["All", "bKash", "Nagad", "Bank", "Cash"];
const statusStyles = {
  paid: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  failed: "bg-red-50 text-red-600",
  refunded: "bg-red-50 text-red-600",
  cancelled: "bg-gray-100 text-gray-600",
};

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handleCopy} className="shrink-0 rounded-md p-1 hover:bg-white/20 transition-colors">
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

function InfoRow({ icon: Icon, label, value, copy }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 text-xs opacity-80">
        {Icon && <Icon className="h-3 w-3 shrink-0" />}
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-1 text-xs font-semibold">
        <span className="truncate max-w-[180px]">{value}</span>
        {copy && <CopyButton text={value} />}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-white/20" />;
}

function BkashCard({ payment }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#E2136E] to-[#C0105E] p-5 text-white shadow-elevated">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          <span className="font-black text-sm tracking-wider uppercase">bKash</span>
        </div>
        <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", statusStyles[payment.status] || "bg-white/20 text-white")}>
          {payment.status}
        </span>
      </div>
      <div className="text-center py-3">
        <div className="text-3xl font-black">{formatPrice(payment.amount)}</div>
        <div className="text-xs opacity-80 mt-0.5">Amount Paid</div>
      </div>
      <Divider />
      <div className="space-y-2 mt-3">
        <InfoRow icon={Phone} label="From" value={payment.customer_phone || payment.customer_name} copy />
        <InfoRow icon={Building} label="To" value={payment.merchant_account || "Merchant"} copy />
        <InfoRow icon={Hash} label="TrxID" value={payment.gateway_transaction_id || "—"} copy />
        <InfoRow icon={Receipt} label="Reference" value={payment.gateway_payment_id || "—"} copy />
        <InfoRow icon={Calendar} label="Date" value={payment.created_at?.slice(0, 16).replace("T", " ")} />
        <InfoRow icon={User} label="Customer" value={payment.customer_name} />
        <InfoRow icon={Building} label="Service" value={payment.service_title} />
      </div>
    </div>
  );
}

function NagadCard({ payment }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#F68B1E] to-[#E07710] p-5 text-white shadow-elevated">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          <span className="font-black text-sm tracking-wider uppercase">Nagad</span>
        </div>
        <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", statusStyles[payment.status] || "bg-white/20 text-white")}>
          {payment.status}
        </span>
      </div>
      <div className="text-center py-3">
        <div className="text-3xl font-black">{formatPrice(payment.amount)}</div>
        <div className="text-xs opacity-80 mt-0.5">Amount Paid</div>
      </div>
      <Divider />
      <div className="space-y-2 mt-3">
        <InfoRow icon={Phone} label="From" value={payment.customer_phone || payment.customer_name} copy />
        <InfoRow icon={Building} label="Merchant" value={payment.merchant_account || "Merchant"} copy />
        <InfoRow icon={Hash} label="Order ID" value={payment.gateway_payment_id || `#${payment.booking}`} copy />
        <InfoRow icon={Receipt} label="Payment Ref" value={payment.gateway_transaction_id || "—"} copy />
        <InfoRow icon={Calendar} label="Date" value={payment.created_at?.slice(0, 16).replace("T", " ")} />
        <InfoRow icon={User} label="Customer" value={payment.customer_name} />
        <InfoRow icon={Building} label="Service" value={payment.service_title} />
      </div>
    </div>
  );
}

function BankCard({ payment }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#1E3A5F] to-[#15294A] p-5 text-white shadow-elevated">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Landmark className="h-5 w-5" />
          <span className="font-black text-sm tracking-wider uppercase">Bank Transfer</span>
        </div>
        <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", statusStyles[payment.status] || "bg-white/20 text-white")}>
          {payment.status}
        </span>
      </div>
      <div className="text-center py-3">
        <div className="text-3xl font-black">{formatPrice(payment.amount)}</div>
        <div className="text-xs opacity-80 mt-0.5">Amount Transferred</div>
      </div>
      <Divider />
      <div className="space-y-2 mt-3">
        <InfoRow icon={Building} label="Account" value={payment.merchant_account || "—"} copy />
        <InfoRow icon={Hash} label="Transaction Ref" value={payment.gateway_transaction_id || "—"} copy />
        <InfoRow icon={User} label="Sender" value={payment.customer_name} />
        <InfoRow icon={Phone} label="Phone" value={payment.customer_phone || "—"} copy />
        <InfoRow icon={Calendar} label="Date" value={payment.created_at?.slice(0, 16).replace("T", " ")} />
        <InfoRow icon={Building} label="Service" value={payment.service_title} />
        {payment.booking_address && (
          <InfoRow icon={Building} label="Address" value={payment.booking_address} />
        )}
      </div>
    </div>
  );
}

function CashCard({ payment }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-5 text-white shadow-elevated">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Banknote className="h-5 w-5" />
          <span className="font-black text-sm tracking-wider uppercase">Cash Payment</span>
        </div>
        <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", statusStyles[payment.status] || "bg-white/20 text-white")}>
          {payment.status}
        </span>
      </div>
      <div className="text-center py-3">
        <div className="text-3xl font-black">{formatPrice(payment.amount)}</div>
        <div className="text-xs opacity-80 mt-0.5">Amount Due</div>
      </div>
      <Divider />
      <div className="space-y-2 mt-3">
        <InfoRow icon={User} label="Customer" value={payment.customer_name} />
        <InfoRow icon={Phone} label="Phone" value={payment.customer_phone || "—"} copy />
        <InfoRow icon={Building} label="Service" value={payment.service_title} />
        <InfoRow icon={Calendar} label="Service Date" value={payment.booking_date || "—"} />
        {payment.booking_address && (
          <InfoRow icon={Building} label="Address" value={payment.booking_address} />
        )}
        <InfoRow icon={Receipt} label="Reference" value={payment.gateway_transaction_id || "—"} copy />
        <InfoRow icon={Calendar} label="Created" value={payment.created_at?.slice(0, 16).replace("T", " ")} />
      </div>
    </div>
  );
}

function DefaultCard({ payment }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold capitalize text-gray-900">{payment.method} Payment</span>
        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", statusStyles[payment.status] || "bg-gray-100 text-gray-600")}>
          {payment.status}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black text-gray-900">{formatPrice(payment.amount)}</span>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        {payment.customer_name} &middot; {payment.service_title}
      </div>
    </div>
  );
}

function MethodCard({ payment }) {
  const method = payment.method;
  if (method === "bkash") return <BkashCard payment={payment} />;
  if (method === "nagad") return <NagadCard payment={payment} />;
  if (method === "card") return <BankCard payment={payment} />;
  if (method === "cash") return <CashCard payment={payment} />;
  return <DefaultCard payment={payment} />;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [methodFilter, setMethodFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => { fetchMockPayments().then(setPayments); }, []);

  const filtered = payments.filter((p) => {
    const methodMatch = methodFilter === "All" || p.method === methodFilter.toLowerCase();
    const q = search.toLowerCase();
    const textMatch = !q || p.customer_name?.toLowerCase().includes(q) || p.service_title?.toLowerCase().includes(q) || p.gateway_transaction_id?.toLowerCase().includes(q) || p.gateway_payment_id?.toLowerCase().includes(q);
    return methodMatch && textMatch;
  });

  const paidPayments = payments.filter((p) => p.status === "paid");
  const totalRevenue = paidPayments.reduce((s, p) => s + Number(p.amount), 0);
  const thisMonth = paidPayments
    .filter((p) => (p.created_at?.slice(0, 10) || "") >= thisMonthStart)
    .reduce((s, p) => s + Number(p.amount), 0);
  const pendingPayouts = payments
    .filter((p) => p.status === "pending")
    .reduce((s, p) => s + Number(p.amount), 0);

  const handleRefund = async (id) => {
    if (!confirm("Issue refund for this payment?")) return;
    await updatePaymentStatus(id, "refunded");
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status: "refunded" } : p)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="mt-1 text-sm text-gray-500">View all payment transactions with method-specific details</p>
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

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
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
        <div className="relative max-w-xs ml-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            className="input-field pl-9 py-1.5 text-sm"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Transaction Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.length === 0 && (
          <div className="col-span-full rounded-2xl border border-gray-200 bg-white p-12 text-center text-gray-400">
            No transactions found
          </div>
        )}
        {filtered.map((payment) => (
          <div key={payment.id} className="relative group">
            <MethodCard payment={payment} />
            {payment.status === "paid" && (
              <div className="mt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleRefund(payment.id)}
                  className="rounded-lg border border-red-300 bg-white px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  Issue Refund
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
