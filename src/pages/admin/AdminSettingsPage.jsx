import { useState, useEffect } from "react";
import { Save, Shield, Smartphone, Landmark, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { fetchSiteSettings, updateSiteSettings } from "@/lib/api";

function Toast({ message, onClose }) {
  setTimeout(onClose, 3000);
  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-elevated">
      {message}
    </div>
  );
}

export default function AdminSettingsPage() {
  const { changeAdminPassword } = useAuth();
  const [identity, setIdentity] = useState({
    site_name: "Servico",
    tagline: "Home services, on demand.",
    support_email: "support@servico.com",
    support_phone: "+880-1700-000000",
  });
  const [fees, setFees] = useState({ visiting_fee: 150, urgent_surcharge: 100 });
  const [vat, setVat] = useState(5);
  const [accounts, setAccounts] = useState({ bkash_number: "", nagad_number: "", bank_account_number: "" });
  const [savedAccounts, setSavedAccounts] = useState({ bkash_number: "", nagad_number: "", bank_account_number: "" });
  const [editingField, setEditingField] = useState(null);
  const [maintenance, setMaintenance] = useState(false);
  const [toast, setToast] = useState(null);
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });

  useEffect(() => {
    fetchSiteSettings().then((data) => {
      if (data.site_name) setIdentity({ site_name: data.site_name, tagline: data.tagline, support_email: data.support_email, support_phone: data.support_phone });
      if (data.visiting_fee !== undefined) setFees({ visiting_fee: data.visiting_fee, urgent_surcharge: data.urgent_surcharge });
      if (data.vat_percent !== undefined) setVat(data.vat_percent);
      const accts = { bkash_number: data.bkash_number || "", nagad_number: data.nagad_number || "", bank_account_number: data.bank_account_number || "" };
      setAccounts(accts);
      setSavedAccounts(accts);
    });
  }, []);

  const handleSave = async () => {
    await updateSiteSettings({
      ...identity,
      visiting_fee: fees.visiting_fee,
      urgent_surcharge: fees.urgent_surcharge,
      vat_percent: vat,
      ...accounts,
    });
    setSavedAccounts({ ...accounts });
    setToast("Settings saved!");
    setTimeout(() => setToast(null), 3000);
  };

  const labels = { bkash_number: "bKash", nagad_number: "Nagad", bank_account_number: "Bank Account" };

  const handleSaveField = async (field) => {
    await updateSiteSettings({ [field]: accounts[field] });
    setSavedAccounts((prev) => ({ ...prev, [field]: accounts[field] }));
    setEditingField(null);
    setToast(`${labels[field]} number updated!`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCancelField = (field) => {
    setAccounts((prev) => ({ ...prev, [field]: savedAccounts[field] }));
    setEditingField(null);
  };

  const handleChangePassword = async () => {
    if (!password.current || !password.new || !password.confirm) {
      setToast("Please fill in all password fields");
      setTimeout(() => setToast(null), 3000);
      return;
    }
    if (password.new !== password.confirm) {
      setToast("New passwords do not match");
      setTimeout(() => setToast(null), 3000);
      return;
    }
    if (password.new.length < 6) {
      setToast("New password must be at least 6 characters");
      setTimeout(() => setToast(null), 3000);
      return;
    }
    const { error } = await changeAdminPassword(password.current, password.new);
    if (error) {
      setToast(error);
    } else {
      setToast("Password updated successfully!");
      setPassword({ current: "", new: "", confirm: "" });
    }
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

      {/* Account Information */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
        <h2 className="text-base font-bold text-gray-900 mb-4">Account Information</h2>
        <p className="mb-4 text-xs text-gray-500">Customer payments will be transferred to these accounts</p>
        <div className="space-y-4">

          {/* bKash */}
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-pink-500 shrink-0" />
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">bKash Number</label>
              {editingField === "bkash_number" ? (
                <div className="flex items-center gap-2">
                  <input className="input-field flex-1" placeholder="01XXXXXXXXX" value={accounts.bkash_number}
                    onChange={(e) => setAccounts({ ...accounts, bkash_number: e.target.value })}
                    autoFocus />
                  <button onClick={() => handleSaveField("bkash_number")} className="btn-primary text-sm px-3 py-1.5">Save</button>
                  <button onClick={() => handleCancelField("bkash_number")} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{accounts.bkash_number || <span className="text-gray-400 italic">Not set</span>}</span>
                  <button onClick={() => setEditingField("bkash_number")} className="text-xs text-emerald-600 hover:underline">Edit</button>
                </div>
              )}
            </div>
          </div>

          {/* Nagad */}
          <div className="flex items-center gap-3">
            <Landmark className="h-5 w-5 text-orange-500 shrink-0" />
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">Nagad Number</label>
              {editingField === "nagad_number" ? (
                <div className="flex items-center gap-2">
                  <input className="input-field flex-1" placeholder="01XXXXXXXXX" value={accounts.nagad_number}
                    onChange={(e) => setAccounts({ ...accounts, nagad_number: e.target.value })}
                    autoFocus />
                  <button onClick={() => handleSaveField("nagad_number")} className="btn-primary text-sm px-3 py-1.5">Save</button>
                  <button onClick={() => handleCancelField("nagad_number")} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{accounts.nagad_number || <span className="text-gray-400 italic">Not set</span>}</span>
                  <button onClick={() => setEditingField("nagad_number")} className="text-xs text-emerald-600 hover:underline">Edit</button>
                </div>
              )}
            </div>
          </div>

          {/* Bank Account */}
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-blue-500 shrink-0" />
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">Bank Account Number</label>
              {editingField === "bank_account_number" ? (
                <div className="flex items-center gap-2">
                  <input className="input-field flex-1" placeholder="Enter bank account number" value={accounts.bank_account_number}
                    onChange={(e) => setAccounts({ ...accounts, bank_account_number: e.target.value })}
                    autoFocus />
                  <button onClick={() => handleSaveField("bank_account_number")} className="btn-primary text-sm px-3 py-1.5">Save</button>
                  <button onClick={() => handleCancelField("bank_account_number")} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{accounts.bank_account_number || <span className="text-gray-400 italic">Not set</span>}</span>
                  <button onClick={() => setEditingField("bank_account_number")} className="text-xs text-emerald-600 hover:underline">Edit</button>
                </div>
              )}
            </div>
          </div>

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

      {/* Security */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-gray-500" />
          <h2 className="text-base font-bold text-gray-900">Security</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Current Password</label>
            <input type="password" className="input-field" value={password.current} onChange={(e) => setPassword({ ...password, current: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">New Password</label>
              <input type="password" className="input-field" value={password.new} onChange={(e) => setPassword({ ...password, new: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input type="password" className="input-field" value={password.confirm} onChange={(e) => setPassword({ ...password, confirm: e.target.value })} />
            </div>
          </div>
          <button onClick={handleChangePassword} className="btn-primary">
            <Save className="mr-1.5 h-4 w-4" /> Update Password
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
