import { useState } from "react";
import { Save, Bell, Wallet, Shield, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

function Toast({ message, onClose }) {
  setTimeout(onClose, 3000);
  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-elevated">
      {message}
    </div>
  );
}

export default function ProviderSettingsPage() {
  const [toast, setToast] = useState(null);
  const [notifications, setNotifications] = useState({
    new_jobs: true,
    reminders: true,
    payouts: true,
    promotions: false,
  });
  const [payout, setPayout] = useState({ bkash: "", bank_account: "", bank_name: "" });
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleNotif = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your account preferences</p>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-gray-500" />
          <h2 className="text-base font-bold text-gray-900">Notification Preferences</h2>
        </div>
        <div className="space-y-4">
          {[
            { key: "new_jobs", label: "New job request notifications" },
            { key: "reminders", label: "Booking reminders (1 hr before)" },
            { key: "payouts", label: "Payout notifications" },
            { key: "promotions", label: "Promotional emails from Servico" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{item.label}</span>
              <button
                onClick={() => toggleNotif(item.key)}
                className={cn("relative h-6 w-11 rounded-full transition", notifications[item.key] ? "bg-emerald-600" : "bg-gray-300")}
              >
                <span className={cn("absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition", notifications[item.key] && "translate-x-5")} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment / Payout Settings */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="h-5 w-5 text-gray-500" />
          <h2 className="text-base font-bold text-gray-900">Payment / Payout Settings</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">bKash Number</label>
            <input className="input-field" placeholder="01XXXXXXXXX" value={payout.bkash} onChange={(e) => setPayout({ ...payout, bkash: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Bank Account Number</label>
              <input className="input-field" value={payout.bank_account} onChange={(e) => setPayout({ ...payout, bank_account: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Bank Name</label>
              <select className="input-field" value={payout.bank_name} onChange={(e) => setPayout({ ...payout, bank_name: e.target.value })}>
                <option value="">Select bank</option>
                <option value="Dutch Bangla">Dutch Bangla</option>
                <option value="BRAC">BRAC</option>
                <option value="Islami Bank">Islami Bank</option>
                <option value="City Bank">City Bank</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
          <button onClick={() => showToast("Payout info saved!")} className="btn-primary">
            <Save className="mr-1.5 h-4 w-4" /> Save Payout Info
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
              <label className="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
              <input type="password" className="input-field" value={password.confirm} onChange={(e) => setPassword({ ...password, confirm: e.target.value })} />
            </div>
          </div>
          <button onClick={() => showToast("Password updated!")} className="btn-primary">
            <Save className="mr-1.5 h-4 w-4" /> Update Password
          </button>
          <p className="text-xs text-gray-400">For account issues, contact support@servico.com</p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <h2 className="text-base font-bold text-red-600">Danger Zone</h2>
        </div>
        {!confirmDeactivate ? (
          <button onClick={() => setConfirmDeactivate(true)} className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
            Deactivate Account
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-700">Are you sure? This will pause your provider account.</p>
            <div className="flex gap-3">
              <button onClick={() => { showToast("Account deactivated. Contact support to reactivate."); setConfirmDeactivate(false); }} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
                Confirm Deactivate
              </button>
              <button onClick={() => setConfirmDeactivate(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
