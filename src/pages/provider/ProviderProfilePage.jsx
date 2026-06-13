import { useState, useRef } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Shield, Star, Camera, Save, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateProviderApplication, updateProviderAvatar } from "@/lib/api";
import ProviderAvatar from "@/components/ProviderAvatar";
import Cropper from "react-easy-crop";
import { ZoomIn, ZoomOut, Check, X } from "lucide-react";

const SKILLS = ["AC Repair & Servicing","Plumbing","Electrical Work","Home Cleaning","Beauty & Spa","Painting","Carpentry","Car Wash","Appliance Repair","Pest Control","Gardening","Laptop / Computer Repair"];

function Toast({ message, onClose }) {
  setTimeout(onClose, 3000);
  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-elevated">
      {message}
    </div>
  );
}

export default function ProviderProfilePage() {
  const { user, providerApplication, refreshProviderApp } = useAuth();
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);

  const [personal, setPersonal] = useState({
    full_name: providerApplication?.full_name || user?.name || "",
    phone: providerApplication?.phone || user?.phone || "",
    address: providerApplication?.address || "",
    bio: providerApplication?.bio || "",
  });
  const [skills, setSkills] = useState(providerApplication?.skills || []);
  const [availability, setAvailability] = useState(providerApplication?.availability || "full_time");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleSkill = (s) =>
    setSkills((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const doSave = async (data, msg) => {
    setSaving(true);
    const result = await updateProviderApplication(data);
    setSaving(false);
    if (result.error) { setToast(result.error); setTimeout(() => setToast(null), 3000); return; }
    refreshProviderApp();
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState(null);

  const handleCropSave = async () => {
    if (!cropImageSrc || !croppedPixels) return;
    const image = new Image();
    image.src = cropImageSrc;
    await new Promise((resolve) => { image.onload = resolve; });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const size = Math.min(croppedPixels.width, croppedPixels.height);
    canvas.width = size;
    canvas.height = size;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(image, croppedPixels.x, croppedPixels.y, croppedPixels.width, croppedPixels.height, 0, 0, size, size);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
      setSaving(true);
      const result = await updateProviderAvatar(file);
      setSaving(false);
      if (result.error) { setToast(result.error); setTimeout(() => setToast(null), 3000); return; }
      setShowCrop(false);
      setCropImageSrc(null);
      refreshProviderApp();
      setToast("Profile picture updated!");
      setTimeout(() => setToast(null), 3000);
    }, "image/jpeg", 0.95);
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your public profile and account details</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - Profile Card */}
        <div className="lg:sticky lg:top-6 self-start space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-soft">
            <ProviderAvatar avatar={providerApplication?.avatar} name={providerApplication?.full_name || user?.name} size="2xl" className="mx-auto" />
            <button onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  setCropImageSrc(reader.result);
                  setShowCrop(true);
                };
                reader.readAsDataURL(file);
              };
              input.click();
            }} className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-primary mx-auto cursor-pointer">
              <Camera className="h-3.5 w-3.5" /> Change Photo
            </button>
            <h2 className="mt-3 text-xl font-bold text-gray-900">{providerApplication?.full_name || user?.name}</h2>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <Shield className="h-3 w-3" /> Verified Pro
            </span>
            <div className="mt-3 flex items-center justify-center gap-1 text-amber-400">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={cn("h-3.5 w-3.5", i < 5 ? "fill-current" : "text-gray-300")} />
              ))}
              <span className="ml-1 text-xs text-gray-500">(4.8)</span>
            </div>
            <p className="mt-2 text-xs text-gray-400">Member since {providerApplication?.applied_at || "2025"}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {skills.map((s) => (
                <span key={s} className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">{s}</span>
              ))}
            </div>
            <div className="mt-3 text-xs text-gray-500 capitalize">
              {availability === "full_time" ? "Full time" : availability === "part_time" ? "Part time" : "Flexible"}
            </div>
          </div>
        </div>

        {/* Right column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
            <h2 className="text-base font-bold text-gray-900 mb-4">Personal Info</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                  <input className="input-field" value={personal.full_name} onChange={(e) => setPersonal({ ...personal, full_name: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                  <input className="input-field" value={personal.phone} onChange={(e) => setPersonal({ ...personal, phone: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Work Area / Address</label>
                <textarea className="input-field" rows={2} value={personal.address} onChange={(e) => setPersonal({ ...personal, address: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Bio <span className="text-gray-400">({personal.bio.length}/300)</span></label>
                <textarea className="input-field" rows={3} maxLength={300} value={personal.bio} onChange={(e) => setPersonal({ ...personal, bio: e.target.value })} />
              </div>
              <button onClick={() => doSave(personal, "Profile saved!")} disabled={saving} className="btn-primary">
                <Save className="mr-1.5 h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Skills */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
            <h2 className="text-base font-bold text-gray-900 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((s) => (
                <button key={s} type="button" onClick={() => toggleSkill(s)}
                  className={cn("rounded-full border px-3 py-1.5 text-sm font-medium transition",
                    skills.includes(s) ? "border-primary bg-emerald-50 text-primary" : "border-gray-200 hover:border-emerald-300"
                  )}>
                  {skills.includes(s) && <CheckCircle2 className="mr-1.5 inline h-3.5 w-3.5" />}{s}
                </button>
              ))}
            </div>
            <button onClick={() => doSave({ skills }, "Skills updated!")} disabled={saving} className="btn-primary mt-4">
              <Save className="mr-1.5 h-4 w-4" /> {saving ? "Saving..." : "Update Skills"}
            </button>
          </div>

          {/* Availability */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
            <h2 className="text-base font-bold text-gray-900 mb-4">Availability</h2>
            <div className="flex gap-3">
              {[["full_time","Full time","Mon–Sun"],["part_time","Part time","Weekends only"],["flexible","Flexible","As needed"]].map(([val, label, sub]) => (
                <button key={val} type="button" onClick={() => setAvailability(val)}
                  className={cn("flex-1 rounded-xl border p-3 text-left transition",
                    availability === val ? "border-primary bg-emerald-50 ring-2 ring-emerald-100" : "border-gray-200 hover:border-emerald-300"
                  )}>
                  <div className="text-sm font-semibold">{label}</div>
                  <div className="text-xs text-gray-400">{sub}</div>
                </button>
              ))}
            </div>
            <button onClick={() => doSave({ availability }, "Availability saved!")} disabled={saving} className="btn-primary mt-4">
              <Save className="mr-1.5 h-4 w-4" /> {saving ? "Saving..." : "Save Availability"}
            </button>
          </div>

          {/* Documents */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
            <h2 className="text-base font-bold text-gray-900 mb-4">Documents</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-gray-500">NID:</span>
                <span className="font-mono text-gray-700">
                  {providerApplication?.nid_number
                    ? providerApplication.nid_number.slice(0, 8) + "****"
                    : "Not provided"}
                  <span className="ml-2 text-gray-400"><Shield className="inline h-3.5 w-3.5" /></span>
                </span>
              </div>
              <div>
                <span className="text-gray-500">Experience:</span>
                <span className="ml-2 text-gray-700">{providerApplication?.experience_years || 0} years</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-400">Contact support to update documents</p>
          </div>
        </div>
      </div>

      {showCrop && cropImageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setShowCrop(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-elevated overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
              <h3 className="text-base font-bold text-gray-900">Adjust your picture</h3>
              <button type="button" onClick={() => setShowCrop(false)} className="rounded-lg p-1 hover:bg-gray-100 transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative h-72 w-full bg-gray-900">
              <Cropper
                image={cropImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, pixels) => setCroppedPixels(pixels)}
              />
            </div>
            <div className="flex items-center gap-3 px-5 py-4">
              <ZoomOut className="h-4 w-4 text-gray-400 shrink-0" />
              <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-emerald-600" />
              <ZoomIn className="h-4 w-4 text-gray-400 shrink-0" />
            </div>
            <div className="flex gap-3 border-t border-gray-100 px-5 py-3">
              <button type="button" onClick={() => setShowCrop(false)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button type="button" onClick={handleCropSave} disabled={saving} className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition flex items-center justify-center gap-1.5 disabled:opacity-50">
                <Check className="h-4 w-4" /> {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
