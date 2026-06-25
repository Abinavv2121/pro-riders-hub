import { useState, useEffect, useRef } from "react";
import { supabase, Sale } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, X, Upload, Loader2, Tag, ToggleLeft, ToggleRight, Image as ImageIcon } from "lucide-react";

const emptyForm = (): Omit<Sale, "id" | "created_at"> => ({
  title: "",
  description: "",
  discount_percentage: undefined,
  banner_image: "",
  valid_from: new Date().toISOString().slice(0, 10),
  valid_until: "",
  is_active: true,
});

const SalesManagement = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [submitting, setSubmitting] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load sales");
    else setSales(data || []);
    setLoading(false);
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBanner(true);
    try {
      const fileName = `banners/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(data.path);
      setForm((f) => ({ ...f, banner_image: urlData.publicUrl }));
      toast.success("Banner uploaded");
    } catch {
      toast.error("Upload failed. Paste a URL instead.");
    } finally {
      setUploadingBanner(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      toast.error("Title is required");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("sales").insert([{
      ...form,
      discount_percentage: form.discount_percentage || null,
      banner_image: form.banner_image || null,
      valid_until: form.valid_until || null,
    }]);
    if (error) {
      toast.error("Failed to create sale");
    } else {
      toast.success("Sale created");
      setForm(emptyForm());
      setShowForm(false);
      fetchSales();
    }
    setSubmitting(false);
  };

  const toggleActive = async (sale: Sale) => {
    const { error } = await supabase
      .from("sales")
      .update({ is_active: !sale.is_active })
      .eq("id", sale.id!);
    if (error) {
      toast.error("Failed to update sale");
    } else {
      toast.success(sale.is_active ? "Sale deactivated" : "Sale activated");
      setSales((s) => s.map((item) => item.id === sale.id ? { ...item, is_active: !item.is_active } : item));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this sale?")) return;
    const { error } = await supabase.from("sales").delete().eq("id", id);
    if (error) toast.error("Failed to delete sale");
    else {
      toast.success("Sale deleted");
      setSales((s) => s.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sales & Promotions</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {sales.filter((s) => s.is_active).length} active, {sales.length} total
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" /> New Sale
        </Button>
      </div>

      {/* Create Sale Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Create Sale</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Sale Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                  placeholder="e.g. Summer Sale 2025"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={form.description || ""}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500 resize-none"
                  placeholder="Sale details, terms, etc."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Discount %</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={form.discount_percentage || ""}
                  onChange={(e) => setForm((f) => ({ ...f, discount_percentage: parseInt(e.target.value) || undefined }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                  placeholder="e.g. 20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Valid From</label>
                  <input
                    type="date"
                    value={(form.valid_from || "").slice(0, 10)}
                    onChange={(e) => setForm((f) => ({ ...f, valid_from: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Valid Until</label>
                  <input
                    type="date"
                    value={(form.valid_until || "").slice(0, 10)}
                    onChange={(e) => setForm((f) => ({ ...f, valid_until: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                  />
                </div>
              </div>

              {/* Banner Image */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Banner Image</label>
                {form.banner_image && (
                  <div className="relative mb-2 rounded-lg overflow-hidden border border-gray-200 h-28">
                    <img src={form.banner_image} alt="Banner" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, banner_image: "" }))}
                      className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                {!form.banner_image && (
                  <div className="mb-2 rounded-lg border-2 border-dashed border-gray-200 h-20 flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
                <input
                  type="url"
                  value={form.banner_image || ""}
                  onChange={(e) => setForm((f) => ({ ...f, banner_image: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500 mb-2"
                  placeholder="Paste banner image URL..."
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingBanner}
                  className="gap-2 text-xs"
                >
                  {uploadingBanner ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  Upload Banner
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
                  className="flex items-center gap-2 text-sm"
                >
                  {form.is_active
                    ? <ToggleRight className="w-7 h-7 text-green-500" />
                    : <ToggleLeft className="w-7 h-7 text-gray-400" />}
                  <span className="font-medium text-gray-700">
                    {form.is_active ? "Active (visible on site)" : "Inactive"}
                  </span>
                </button>
              </div>

              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <Button type="submit" disabled={submitting} className="flex-1 gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Sale
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sales List */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading sales...
        </div>
      ) : sales.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          <Tag className="w-10 h-10 mb-3 opacity-50" />
          <p className="font-medium">No sales yet</p>
          <p className="text-sm mt-1">Click "New Sale" to create a promotion</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sales.map((sale) => (
            <div
              key={sale.id}
              className={`bg-white border rounded-xl p-5 flex gap-4 transition-all ${
                sale.is_active ? "border-green-200 shadow-sm" : "border-gray-200 opacity-60"
              }`}
            >
              {sale.banner_image && (
                <img
                  src={sale.banner_image}
                  alt={sale.title}
                  className="w-24 h-16 object-cover rounded-lg border border-gray-200 shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-gray-900">{sale.title}</h4>
                    {sale.description && <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{sale.description}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleActive(sale)}
                      title={sale.is_active ? "Deactivate" : "Activate"}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {sale.is_active
                        ? <ToggleRight className="w-6 h-6 text-green-500" />
                        : <ToggleLeft className="w-6 h-6 text-gray-400" />}
                    </button>
                    <button
                      onClick={() => handleDelete(sale.id!)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-2.5 text-xs text-gray-500">
                  {sale.discount_percentage && (
                    <span className="bg-red-50 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                      {sale.discount_percentage}% OFF
                    </span>
                  )}
                  {sale.valid_from && (
                    <span>From: {new Date(sale.valid_from).toLocaleDateString()}</span>
                  )}
                  {sale.valid_until && (
                    <span>Until: {new Date(sale.valid_until).toLocaleDateString()}</span>
                  )}
                  <span className={`font-semibold ${sale.is_active ? "text-green-600" : "text-gray-400"}`}>
                    {sale.is_active ? "● Active" : "● Inactive"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SalesManagement;
