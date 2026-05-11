import { useState, useEffect } from "react";
import { Plus, X, Pencil, Trash2 } from "lucide-react";
import { fetchCategories, SERVICES } from "@/lib/api";

let nextCatId = 100;

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchCategories().then(setCategories); }, []);

  const getServiceCount = (catId) => SERVICES.filter((s) => s.category_id === catId).length;

  const handleSave = (data) => {
    if (editData) {
      setCategories((prev) => prev.map((c) => (c.id === editData.id ? { ...c, ...data } : c)));
    } else {
      setCategories((prev) => [...prev, { id: "c" + nextCatId++, ...data, image_url: "" }]);
    }
    setModal(null);
    setEditData(null);
  };

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setDeleteId(null);
  };

  const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">Manage service categories</p>
        </div>
        <button onClick={() => { setEditData(null); setModal("create"); }} className="btn-primary">
          <Plus className="mr-1.5 h-4 w-4" /> Add Category
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 lg:grid-cols-8">
        {categories.map((c) => (
          <div key={c.id} className="group relative rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-soft hover:shadow-elevated transition">
            <div className="text-3xl">{c.icon}</div>
            <div className="mt-2 text-sm font-medium text-gray-900">{c.label}</div>
            <div className="mt-0.5 text-xs text-gray-400">{getServiceCount(c.id)} services</div>
            <div className="mt-2 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => { setEditData(c); setModal("edit"); }} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-primary">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setDeleteId(c.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Category Modal */}
      {modal && (
        <CategoryModal
          data={editData}
          onSave={handleSave}
          onClose={() => { setModal(null); setEditData(null); }}
          slugify={slugify}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-elevated">
            <h3 className="text-lg font-bold text-gray-900">Delete Category?</h3>
            <p className="mt-2 text-sm text-gray-500">This will not delete associated services.</p>
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

function CategoryModal({ data, onSave, onClose, slugify }) {
  const [form, setForm] = useState({
    label: data?.label ?? "",
    icon: data?.icon ?? "📁",
    slug: data?.slug ?? "",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-elevated" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">{data ? "Edit Category" : "Add Category"}</h3>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Label</label>
            <input className="input-field" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value, slug: slugify(e.target.value) })} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Icon (emoji)</label>
            <input className="input-field" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Slug</label>
            <input className="input-field" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{data ? "Save" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
