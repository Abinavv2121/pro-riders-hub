import { useState, useEffect, useRef } from "react";
import { supabase, DbProduct } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, X, Upload, Loader2, Package, Image as ImageIcon, Pencil } from "lucide-react";

const STOCK_STATUSES = ["In Stock", "Limited Stock", "Out of Stock"] as const;
const PRODUCT_TYPES = ["bike", "apparel", "accessory"] as const;
const TAGS = ["", "New Arrival", "Sale", "Pre-Owned"];

const CATEGORIES_BY_TYPE: Record<string, { key: string; label: string }[]> = {
  bike: [
    { key: "race-road",      label: "Race Road" },
    { key: "endurance-road", label: "Endurance Road" },
    { key: "gravel",         label: "Gravel" },
    { key: "mtb",            label: "MTB" },
    { key: "city-fitness",   label: "City / Fitness" },
    { key: "hybrid",         label: "Hybrid" },
    { key: "kids",           label: "Kids" },
    { key: "pre-owned",      label: "Pre-Owned" },
    { key: "restoration",    label: "Restoration" },
  ],
  apparel: [
    { key: "jerseys",    label: "Jerseys" },
    { key: "shorts",     label: "Shorts" },
    { key: "bib-shorts", label: "Bib Shorts" },
    { key: "gloves",     label: "Gloves" },
    { key: "arm-covers", label: "Arm Covers" },
    { key: "leg-covers", label: "Leg Covers" },
    { key: "shoes",      label: "Shoes" },
    { key: "shoe-covers",label: "Shoe Covers" },
  ],
  accessory: [
    { key: "helmets",         label: "Helmets" },
    { key: "lights",          label: "Lights" },
    { key: "bags",            label: "Bags" },
    { key: "hydration",       label: "Hydration" },
    { key: "car-racks",       label: "Car Racks" },
    { key: "training-tech",   label: "Training Tech" },
    { key: "indoor-training", label: "Indoor Training" },
  ],
};

const emptyForm = (): Omit<DbProduct, "id" | "created_at"> => ({
  name: "",
  brand: "",
  category: "",
  type: "bike",
  price: 0,
  original_price: undefined,
  description: "",
  images: [],
  specifications: {},
  stock_quantity: 0,
  stock_status: "In Stock",
  tag: "",
  size: "",
  color: "",
  is_active: true,
});

const ProductsManagement = () => {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [submitting, setSubmitting] = useState(false);
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("db_products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load products");
    else setProducts(data || []);
    setLoading(false);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(data.path);
      setForm((f) => ({ ...f, images: [...f.images, urlData.publicUrl] }));
      toast.success("Image uploaded");
    } catch {
      toast.error("Image upload failed. Paste a URL instead.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const addImageUrl = () => {
    if (!imageUrl.trim()) return;
    setForm((f) => ({ ...f, images: [...f.images, imageUrl.trim()] }));
    setImageUrl("");
  };

  const removeImage = (idx: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const addSpec = () => {
    if (!specKey.trim() || !specValue.trim()) return;
    setForm((f) => ({ ...f, specifications: { ...f.specifications, [specKey.trim()]: specValue.trim() } }));
    setSpecKey("");
    setSpecValue("");
  };

  const removeSpec = (key: string) => {
    setForm((f) => {
      const specs = { ...f.specifications };
      delete specs[key];
      return { ...f, specifications: specs };
    });
  };

  const openEdit = (p: DbProduct) => {
    setEditingId(p.id!);
    setForm({
      name: p.name,
      brand: p.brand,
      category: p.category,
      type: p.type,
      price: p.price,
      original_price: p.original_price,
      description: p.description || "",
      images: p.images,
      specifications: p.specifications,
      stock_quantity: p.stock_quantity,
      stock_status: p.stock_status,
      tag: p.tag || "",
      size: p.size || "",
      color: p.color || "",
      is_active: p.is_active ?? true,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm());
    setSpecKey("");
    setSpecValue("");
    setImageUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.brand || !form.category || form.price <= 0) {
      toast.error("Please fill all required fields.");
      return;
    }
    setSubmitting(true);
    const payload = { ...form, tag: form.tag || null, original_price: form.original_price || null };

    if (editingId) {
      const { error } = await supabase.from("db_products").update(payload).eq("id", editingId);
      if (error) {
        toast.error("Failed to update product");
      } else {
        toast.success("Product updated successfully");
        setProducts((prev) => prev.map((p) => p.id === editingId ? { ...p, ...payload } : p));
        closeForm();
      }
    } else {
      const { error } = await supabase.from("db_products").insert([payload]);
      if (error) {
        toast.error("Failed to create product");
      } else {
        toast.success("Product created successfully");
        closeForm();
        fetchProducts();
      }
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("db_products").delete().eq("id", id);
    if (error) toast.error("Failed to delete product");
    else {
      toast.success("Product deleted");
      setProducts((p) => p.filter((pr) => pr.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} products in database</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      {/* Create Product Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 overflow-y-auto py-8">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 my-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? "Edit Product" : "Create New Product"}</h3>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                    placeholder="e.g. Trek Domane SL5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Brand *</label>
                  <input
                    type="text"
                    required
                    value={form.brand}
                    onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                    placeholder="e.g. Trek"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Type *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as DbProduct["type"], category: "" }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500 bg-white"
                  >
                    {PRODUCT_TYPES.map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500 bg-white"
                  >
                    <option value="">Select category</option>
                    {(CATEGORIES_BY_TYPE[form.type] || []).map(({ key, label }) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.price || ""}
                    onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Original Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.original_price || ""}
                    onChange={(e) => setForm((f) => ({ ...f, original_price: parseFloat(e.target.value) || undefined }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                    placeholder="For showing discount"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Size</label>
                  <input
                    type="text"
                    value={form.size || ""}
                    onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                    placeholder="S / M / L / XL"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Color</label>
                  <input
                    type="text"
                    value={form.color || ""}
                    onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                    placeholder="e.g. Matte Black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tag</label>
                  <select
                    value={form.tag || ""}
                    onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500 bg-white"
                  >
                    {TAGS.map((t) => <option key={t} value={t}>{t || "None"}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Stock Quantity</label>
                  <input
                    type="number"
                    min={0}
                    value={form.stock_quantity}
                    onChange={(e) => setForm((f) => ({ ...f, stock_quantity: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Stock Status</label>
                  <select
                    value={form.stock_status}
                    onChange={(e) => setForm((f) => ({ ...f, stock_status: e.target.value as DbProduct["stock_status"] }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500 bg-white"
                  >
                    {STOCK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={form.description || ""}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500 resize-none"
                  placeholder="Product description..."
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Product Images</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg border border-gray-200 overflow-hidden group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                  {form.images.length === 0 && (
                    <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                    placeholder="Paste image URL..."
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImageUrl())}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addImageUrl}>Add URL</Button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageFileUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="gap-2"
                  >
                    {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    Upload File
                  </Button>
                  <span className="text-xs text-gray-400">Requires 'product-images' bucket in Supabase Storage</span>
                </div>
              </div>

              {/* Specifications */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Specifications</label>
                {Object.entries(form.specifications).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-medium text-gray-700 w-32 shrink-0">{k}</span>
                    <span className="text-xs text-gray-600 flex-1">{v}</span>
                    <button type="button" onClick={() => removeSpec(k)} className="text-red-400 hover:text-red-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-gray-500"
                    placeholder="Key (e.g. Frame)"
                  />
                  <input
                    type="text"
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-gray-500"
                    placeholder="Value (e.g. Carbon)"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addSpec}>Add</Button>
                </div>
              </div>

              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <Button type="submit" disabled={submitting} className="flex-1 gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? "Update Product" : "Create Product"}
                </Button>
                <Button type="button" variant="outline" onClick={closeForm}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products List */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          <Package className="w-10 h-10 mb-3 opacity-50" />
          <p className="font-medium">No products yet</p>
          <p className="text-sm mt-1">Click "Add Product" to create your first product</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Product</th>
                  <th className="text-left p-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Type</th>
                  <th className="text-left p-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Price</th>
                  <th className="text-left p-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Stock</th>
                  <th className="text-left p-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Status</th>
                  <th className="text-right p-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {p.images[0] ? (
                          <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{p.name}</p>
                          <p className="text-xs text-gray-500">{p.brand} · {CATEGORIES_BY_TYPE[p.type]?.find(c => c.key === p.category)?.label ?? p.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                        {p.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-gray-900">₹{p.price.toLocaleString()}</span>
                      {p.original_price && (
                        <span className="text-xs text-gray-400 line-through ml-1">₹{p.original_price.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-700">{p.stock_quantity}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        p.stock_status === "In Stock"
                          ? "bg-green-50 text-green-700"
                          : p.stock_status === "Limited Stock"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-red-50 text-red-700"
                      }`}>
                        {p.stock_status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id!)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
