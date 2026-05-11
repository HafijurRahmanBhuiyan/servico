import { useState } from "react";
import { Save } from "lucide-react";
import { cn } from "@/lib/utils";

function Toast({ message, onClose }) {
  setTimeout(onClose, 3000);
  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-elevated">
      {message}
    </div>
  );
}

export default function AdminSettingsPage() {
  const [identity, setIdentity] = useState({
    site_name: "Servico",
    tagline: "Home services, on demand.",
    support_email: "support@servico.com",
    support_phone: "+880-1700-000000",
  });
  const [fees, setFees] = useState({ visiting_fee: 150, urgent_surcharge: 100 });
  const [vat, setVat] = useState(5);
  const [maintenance, setMaintenance] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSave = () => {
    setToast("Settings saved!");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Configure global site settings</p>
      </div>

      {/* Site Identity */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
        <h2 className="text-base font-bold text-gray-900 mb-4">Site Identity</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Site Name</label>
            <input className="input-field" value={identity.site_name} onChange={(e) => setIdentity({ ...identity, site_name: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Tagline</label>
            <input className="input-field" value={identity.tagline} onChange={(e) => setIdentity({ ...identity, tagline: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Support Email</label>
              <input className="input-field" value={identity.support_email} onChange={(e) => setIdentity({ ...identity, support_email: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Support Phone</label>
              <input className="input-field" value={identity.support_phone} onChange={(e) => setIdentity({ ...identity, support_phone: e.target.value })} />
            </div>
          </div>
        </div>
      </div>

      {/* Visiting Fee */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
        <h2 className="text-base font-bold text-gray-900 mb-4">Visiting Fee</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Visiting Fee (BDT)</label>
            <input type="number" className="input-field" value={fees.visiting_fee} onChange={(e) => setFees({ ...fees, visiting_fee: Number(e.target.value) })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Urgent Surcharge (BDT)</label>
            <input type="number" className="input-field" value={fees.urgent_surcharge} onChange={(e) => setFees({ ...fees, urgent_surcharge: Number(e.target.value) })} />
          </div>
        </div>
      </div>

      {/* VAT / Tax */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
        <h2 className="text-base font-bold text-gray-900 mb-4">VAT / Tax</h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">VAT Rate (%)</label>
          <input type="number" className="input-field max-w-xs" value={vat} onChange={(e) => setVat(Number(e.target.value))} min={0} max={100} step={0.1} />
        </div>
      </div>

      {/* Maintenance Mode */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Maintenance Mode</h2>
            <p className="mt-1 text-xs text-gray-500">Warning: Enabling this will show a maintenance page to all users</p>
          </div>
          <button
            onClick={() => setMaintenance(!maintenance)}
            className={cn("relative h-6 w-11 rounded-full transition", maintenance ? "bg-emerald-600" : "bg-gray-300")}
          >
            <span className={cn("absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition", maintenance && "translate-x-5")} />
          </button>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-primary">
          <Save className="mr-1.5 h-4 w-4" /> Save Settings
        </button>
      </div>
    </div>
  );
}
