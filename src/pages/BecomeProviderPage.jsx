//Arman's Work
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Briefcase, Clock, DollarSign, Shield } from "lucide-react";
import { submitProviderApplication } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";

const SKILLS = ["AC Repair & Servicing","Plumbing","Electrical Work","Home Cleaning","Beauty & Spa","Painting","Carpentry","Car Wash","Appliance Repair","Pest Control","Gardening","Laptop / Computer Repair"];

export default function BecomeProviderPage() {
  const { user, refreshProviderApp } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", nid: "", address: "", experience_years: "1", skills: [], bio: "", availability: "full_time" });
  const [nidFile, setNidFile] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  const toggleSkill = (s) =>
    setForm((f) => ({ ...f, skills: f.skills.includes(s) ? f.skills.filter((x) => x !== s) : [...f.skills, s] }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.skills.length === 0) { alert("Select at least one skill."); return; }
    if (!user) { navigate("/login?redirect=/become-provider"); return; }
    setSubmitting(true);
    await submitProviderApplication({ userId: user.id, ...form, nid_file: nidFile, profile_picture: profilePic });
    setSubmitting(false);
    refreshProviderApp();
    navigate("/provider/dashboard");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-500 p-8 text-white sm:p-12">
        <h1 className="text-4xl font-bold">Earn with Servico</h1>
        <p className="mt-3 max-w-xl text-white/90">Join 500+ verified pros. Set your hours, choose your jobs, get paid weekly.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[[Briefcase,"Steady jobs","50+ service categories"],[DollarSign,"Weekly payouts","Automated bank transfer"],[Clock,"Flexible hours","Work when you want"],[Shield,"Insurance","Safety & legal support"]].map(([Icon, title, sub], i) => (
            <div key={i} className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
              <div className="mt-0.5 text-amber-300"><Icon className="h-5 w-5" /></div>
              <div><div className="font-semibold">{title}</div><div className="text-xs text-white/75">{sub}</div></div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-elevated">
        <h2 className="text-2xl font-bold">Apply to become a pro</h2>
        {!user && (
          <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm">
            <span className="font-medium">You need an account to apply. </span>
            <Link to="/register" className="text-primary underline">Create one free →</Link>
          </div>
        )}
        <form onSubmit={onSubmit} className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Full name</label>
              <input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Phone number</label>
              <input required value={form.phone} placeholder="01XXXXXXXXX" onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">NID number</label>
              <input required value={form.nid} onChange={(e) => setForm({ ...form, nid: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Upload NID <span className="text-gray-400">(PDF)</span></label>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-600 hover:border-emerald-300">
                <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setNidFile(e.target.files[0] || null)} />
                {nidFile ? nidFile.name : "Choose PDF file"}
              </label>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Years of experience</label>
              <select value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: e.target.value })} className="input-field">
                {["Less than 1","1","2","3","4","5","6–10","10+"].map((v) => <option key={v} value={v}>{v} {v === "1" ? "year" : "years"}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Work area / address</label>
            <textarea required rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field resize-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Skills <span className="text-gray-400">(select all that apply)</span></label>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((s) => (
                <button type="button" key={s} onClick={() => toggleSkill(s)}
                  className={cn("rounded-full border px-3 py-1.5 text-sm font-medium transition",
                    form.skills.includes(s) ? "border-primary bg-emerald-50 text-primary" : "border-gray-200 hover:border-emerald-300")}>
                  {form.skills.includes(s) && <CheckCircle2 className="mr-1.5 inline h-3.5 w-3.5" />}{s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Availability</label>
            <div className="flex gap-3">
              {[["full_time","Full time","Mon–Sun"],["part_time","Part time","Weekends only"],["flexible","Flexible","As needed"]].map(([val, label, sub]) => (
                <button type="button" key={val} onClick={() => setForm({ ...form, availability: val })}
                  className={cn("flex-1 rounded-xl border p-3 text-left transition",
                    form.availability === val ? "border-primary bg-emerald-50 ring-2 ring-emerald-100" : "border-gray-200 hover:border-emerald-300")}>
                  <div className="text-sm font-semibold">{label}</div>
                  <div className="text-xs text-gray-400">{sub}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Brief bio <span className="text-gray-400">(optional)</span></label>
            <textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell us about your experience..." className="input-field resize-none" />
          </div>
          <ProfilePictureUpload value={profilePic} onChange={setProfilePic} />
          <button disabled={submitting || !user} className="btn-primary w-full py-4 text-base">
            {submitting ? "Submitting..." : !user ? "Login to apply" : "Submit application"}
          </button>
          <p className="text-center text-xs text-gray-400">By applying, you agree to our Terms of Service and Provider Code of Conduct.</p>
        </form>
      </div>
    </div>
  );
}
