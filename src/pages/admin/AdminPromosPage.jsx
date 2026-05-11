import { useState, useEffect } from "react";
import { Plus, X, Power, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchPromos, addPromo, updatePromoStatus, deletePromo } from "@/lib/api";

export default function AdminPromosPage() {
  const [promos, setPromos] = useState([]);
  const [modal, setModal] = useState(false);

  useEffect(() => { fetchPromos().then(setPromos); }, []);

  const handleToggle = async (code, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    await updatePromoStatus(code, newStatus);
    setPromos((prev) => prev.map((p) => (p.code === code ? { ...p, status: newStatus } : p)));
  };

  const handleDelete = async (code) => {
    if (!confirm("Delete this promo code?")) return;
    await deletePromo(code);
    setPromos((prev) => prev.filter((p) => p.code !== code));
  };

  const handleCreate = async (data) => {
    await addPromo(data);
    setPromos((prev) => [{ ...data, used: 0, status: "active" }, ...prev]);
    setModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promo Codes</h1>
          <p className="mt-1 text-sm text-gray-500">Manage discount promotions</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary">
          <Plus className="mr-1.5 h-4 w-4" /> Create Promo
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="px-5 py-3">Code</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Value</th>
              <th className="px-5 py-3">Min Order</th>
              <th className="px-5 py-3">Max Uses</th>
              <th className="px-5 py-3">Used</th>
              <th className="px-5 py-3">Expiry</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promos.length === 0 && (
              <tr><td colSpan={9} className="px-5 py-12 text-center text-gray-400">No promo codes</td></tr>
            )}
            {promos.map((p) => (
              <tr key={p.code} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-5 py-3 font-mono text-sm font-bold">{p.code}</td>
                <td className="px-5 py-3 capitalize text-gray-500">{p.type}</td>
                <td className="px-5 py-3 font-semibold">{p.type === "percent" ? `${p.value}%` : `৳${p.value}`}</td>
                <td className="px-5 py-3 text-gray-500">{p.min_order ? `৳${p.min_order}` : "—"}</td>
                <td className="px-5 py-3 text-gray-500">{p.max_uses}</td>
                <td className="px-5 py-3 text-gray-500">{p.used}</td>
                <td className="px-5 py-3 text-gray-500">{p.expiry}</td>
                <td className="px-5 py-3">
                  <span className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-semibold",
                    p.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                  )}>
                    {p.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleToggle(p.code, p.status)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                      <Power className={cn("h-4 w-4", p.status === "active" ? "text-emerald-600" : "text-gray-400")} />
                    </button>
                    <button onClick={() => handleDelete(p.code)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && <CreatePromoModal onSave={handleCreate} onClose={() => setModal(false)} />}
    </div>
  );
}

function CreatePromoModal({ onSave, onClose }) {
  const [form, setForm] = useState({
    code: "",
    type: "percent",
    value: "",
    min_order: "",
    max_uses: "",
    expiry: "",
  });

  const handleCodeChange = (e) => {
    setForm({ ...form, code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "") });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      value: Number(form.value),
      min_order: Number(form.min_order) || 0,
      max_uses: Number(form.max_uses) || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-elevated" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Create Promo Code</h3>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Code</label>
            <input className="input-field font-mono uppercase" value={form.code} onChange={handleCodeChange} placeholder="e.g. SUMMER25" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Type</label>
              <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="percent">Percent (%)</option>
                <option value="flat">Flat (৳)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Value</label>
              <input type="number" className="input-field" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required min={1} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Min Order</label>
              <input type="number" className="input-field" value={form.min_order} onChange={(e) => setForm({ ...form, min_order: e.target.value })} min={0} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Max Uses</label>
              <input type="number" className="input-field" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} min={1} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Expiry Date</label>
            <input type="date" className="input-field" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} required />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
