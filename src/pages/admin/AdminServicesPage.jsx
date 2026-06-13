import { useState, useEffect, useRef } from "react";
import { Search, Plus, X, Star, Upload, Trash2 } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { fetchServices, fetchCategories, createService, updateService, deleteService } from "@/lib/api";

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [modal, setModal] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchServices().then((data) => {
      setServices(data.map((s) => ({ ...s, category_id: s.category })));
    });
    fetchCategories().then(setCategories);
  }, []);

  const filtered = services.filter((s) => {
    const q = search.toLowerCase();
    const textMatch = !q || s.title.toLowerCase().includes(q) || s.subtitle.toLowerCase().includes(q);
    const catMatch = !catFilter || s.category_id === catFilter;
    return textMatch && catMatch;
  });

  const getCategoryName = (catId) => categories.find((c) => c.id === catId)?.label ?? "—";

  const handleTogglePopular = async (id) => {
    const svc = services.find((s) => s.id === id);
    await updateService(id, { is_popular: !svc.is_popular });
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_popular: !s.is_popular } : s))
    );
  };

  const handleDelete = async (id) => {
    await deleteService(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    setDeleteId(null);
  };

  const handleSave = async (formData) => {
    const payload = { ...formData, category: formData.category_id };
    if (editData) {
      const updated = await updateService(editData.id, payload);
      if (updated.error) { alert(updated.error); return; }
      setServices((prev) => prev.map((s) => (s.id === editData.id ? { ...updated, category_id: updated.category } : s)));
    } else {
      const created = await createService(payload);
      if (created.error) { alert(created.error); return; }
      setServices((prev) => [{ ...created, category_id: created.category }, ...prev]);
    }
    setModal(null);
    setEditData(null);
  };

  const openEdit = (svc) => {
    setEditData(svc);
    setModal("edit");
  };

  const openCreate = () => {
    setEditData(null);
    setModal("create");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="mt-1 text-sm text-gray-500">Manage all services on the platform</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="mr-1.5 h-4 w-4" /> Add Service
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input className="input-field pl-9" placeholder="Search services..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input-field w-auto" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="px-5 py-3">Image</th>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Price (BDT)</th>
              <th className="px-5 py-3">Rating</th>
              <th className="px-5 py-3">Reviews</th>
              <th className="px-5 py-3">Popular</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-400">No services found</td></tr>
            )}
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-5 py-3">
                  {s.image_url ? (
                    <img src={s.image_url} alt={s.title} className="h-10 w-10 rounded-lg object-cover" />
                  ) : (
                    <span className="text-xl">{s.icon || "📄"}</span>
                  )}
                </td>
                <td className="px-5 py-3 font-medium">{s.title}</td>
                <td className="px-5 py-3 text-gray-500">{getCategoryName(s.category_id)}</td>
                <td className="px-5 py-3 font-semibold">{formatPrice(s.price)}</td>
                <td className="px-5 py-3">
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-current" /> {s.rating}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">{s.review_count}</td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => handleTogglePopular(s.id)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold transition",
                      s.is_popular
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    )}
                  >
                    {s.is_popular ? "Yes" : "No"}
                  </button>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(s)} className="btn-secondary text-xs px-3 py-1">Edit</button>
                    <button onClick={() => setDeleteId(s.id)} className="rounded-lg border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <ServiceModal
          data={editData}
          categories={categories}
          onSave={handleSave}
          onClose={() => { setModal(null); setEditData(null); }}
        />
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-elevated">
            <h3 className="text-lg font-bold text-gray-900">Delete Service?</h3>
            <p className="mt-2 text-sm text-gray-500">This action cannot be undone.</p>
            <div className="mt-4 flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="btn-primary bg-gradient-to-r from-red-600 to-red-500">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ServiceModal({ data, categories, onSave, onClose }) {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [form, setForm] = useState({
    title: data?.title ?? "",
    subtitle: data?.subtitle ?? "",
    category_id: data?.category_id ?? categories[0]?.id ?? "",
    price: data?.price ?? "",
    duration: data?.duration ?? "",
    description: data?.description ?? "",
    includes: Array.isArray(data?.includes) ? data.includes.join("\n") : "",
    is_popular: data?.is_popular ?? false,
    badge: data?.badge ?? "",
  });

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      includes: form.includes
        ? form.includes.split("\n").map((s) => s.trim()).filter(Boolean)
        : [],
    };
    if (imageFile) {
      payload.image = imageFile;
      payload.icon = "";
    }
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-elevated max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">{data ? "Edit Service" : "Add Service"}</h3>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
              <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Subtitle</label>
              <input className="input-field" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
              <select className="input-field" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Price (BDT)</label>
              <input type="number" className="input-field" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min={0} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Duration</label>
              <input className="input-field" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Service Image</label>
              <div className="flex items-center gap-4">
                {(imagePreview || data?.image_url) && (
                  <div className="relative">
                    <img
                      src={imagePreview || data?.image_url}
                      alt="Preview"
                      className="h-20 w-20 rounded-xl border object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-0.5 text-white shadow"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                  <Upload className="h-4 w-4" />
                  {imageFile ? imageFile.name : "Choose file"}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-400">Upload a service image (JPEG, PNG, WebP)</p>
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
              <textarea className="input-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">What's Include</label>
              <textarea className="input-field" rows={4} value={form.includes}
                onChange={(e) => setForm({ ...form, includes: e.target.value })}
                placeholder={"Free consultation\n1 year warranty\nParts included"} />
              <p className="mt-1 text-xs text-gray-400">Enter each item on a new line</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Is Popular</label>
              <button
                type="button"
                onClick={() => setForm({ ...form, is_popular: !form.is_popular })}
                className={cn(
                  "relative h-6 w-11 rounded-full transition",
                  form.is_popular ? "bg-emerald-600" : "bg-gray-300"
                )}
              >
                <span className={cn(
                  "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition",
                  form.is_popular && "translate-x-5"
                )} />
              </button>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Badge</label>
              <input className="input-field" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="e.g. Most Booked" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{data ? "Save Changes" : "Create Service"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
