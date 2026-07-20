import { useState, useEffect } from "react";
import { supabase, DbProduct } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Search,
  Tag,
  Loader2,
  X,
  Trash2,
  Percent,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

const formatPrice = (price: number) =>
  "Rs. " + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(price);

const SalesManagement = () => {
  // ── Search state ──
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DbProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // ── Selected product + offer ──
  const [selected, setSelected] = useState<DbProduct | null>(null);
  const [offerPercent, setOfferPercent] = useState<string>("");

  // ── Submitting ──
  const [submitting, setSubmitting] = useState(false);

  // ── Products currently on sale ──
  const [saleProducts, setSaleProducts] = useState<DbProduct[]>([]);
  const [loadingSale, setLoadingSale] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // ────────────────────────────────────────────
  // Fetch all products that are on sale
  // ────────────────────────────────────────────
  const fetchSaleProducts = async () => {
    setLoadingSale(true);
    const { data, error } = await supabase
      .from("db_products")
      .select("*")
      .eq("on_sale", true)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) toast.error("Failed to load sale products");
    else setSaleProducts(data || []);
    setLoadingSale(false);
  };

  useEffect(() => {
    fetchSaleProducts();
  }, []);

  // ────────────────────────────────────────────
  // Live product search
  // ────────────────────────────────────────────
  useEffect(() => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const { data, error } = await supabase
        .from("db_products")
        .select("*")
        .eq("is_active", true)
        .or(`name.ilike.%${query}%,brand.ilike.%${query}%`)
        .limit(8);

      if (!error && data) setSearchResults(data);
      setIsSearching(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // ────────────────────────────────────────────
  // Select a product from search results
  // ────────────────────────────────────────────
  const handleSelect = (product: DbProduct) => {
    setSelected(product);
    setQuery("");
    setSearchResults([]);
    setOfferPercent("");
  };

  // ────────────────────────────────────────────
  // Calculated sale price
  // ────────────────────────────────────────────
  const pct = parseFloat(offerPercent);
  const isValidPct = !isNaN(pct) && pct > 0 && pct < 100;

  // The "base" price to apply the discount on.
  // If the product already has an original_price (from a previous sale), use that.
  // Otherwise use the current price.
  const basePrice = selected
    ? selected.original_price && selected.original_price > selected.price
      ? selected.original_price
      : selected.price
    : 0;

  const salePrice = isValidPct ? Math.round(basePrice * (1 - pct / 100)) : null;

  // ────────────────────────────────────────────
  // Add to sale
  // ────────────────────────────────────────────
  const handleAddToSale = async () => {
    if (!selected || !isValidPct || salePrice === null) {
      toast.error("Select a product and enter a valid offer %");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase
      .from("db_products")
      .update({
        on_sale: true,
        original_price: basePrice,
        price: salePrice,
      })
      .eq("id", selected.id!);

    if (error) {
      toast.error("Failed to add product to sale");
    } else {
      toast.success(`${selected.name} added to sale at ${pct}% off!`);
      setSelected(null);
      setOfferPercent("");
      fetchSaleProducts();
    }
    setSubmitting(false);
  };

  // ────────────────────────────────────────────
  // Remove sale (restore original price)
  // ────────────────────────────────────────────
  const handleRemoveSale = async (product: DbProduct) => {
    if (!product.id) return;
    setRemovingId(product.id);

    const restoredPrice = product.original_price ?? product.price;

    const { error } = await supabase
      .from("db_products")
      .update({
        on_sale: false,
        price: restoredPrice,
        original_price: null,
      })
      .eq("id", product.id);

    if (error) {
      toast.error("Failed to remove sale");
    } else {
      toast.success(`Sale removed from ${product.name}. Price restored.`);
      setSaleProducts((prev) => prev.filter((p) => p.id !== product.id));
    }
    setRemovingId(null);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* ── Header ── */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Sales Management</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Search for a product, set an offer percentage, and add it to the sale page.
        </p>
      </div>

      {/* ── Product Search Panel ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5 shadow-sm">
        <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Add Product to Sale
        </p>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products by name or brand…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-300"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
          )}

          {/* Dropdown Results */}
          {searchResults.length > 0 && (
            <div className="absolute z-30 top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {searchResults.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-0"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain" />
                    ) : (
                      <ShoppingBag className="w-5 h-5 text-gray-400 m-auto mt-2.5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.brand} · {formatPrice(p.price)}</p>
                  </div>
                  {p.on_sale && (
                    <span className="text-[10px] font-bold uppercase bg-red-100 text-red-600 px-2 py-0.5 rounded-full shrink-0">
                      On Sale
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Product Card */}
        {selected && (
          <div className="border border-blue-200 bg-blue-50 rounded-xl p-4 flex gap-4 items-start">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200 shrink-0">
              {selected.images?.[0] ? (
                <img src={selected.images[0]} alt={selected.name} className="w-full h-full object-contain" />
              ) : (
                <ShoppingBag className="w-7 h-7 text-gray-400 m-auto mt-4" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-gray-900">{selected.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{selected.brand}</p>
                </div>
                <button
                  onClick={() => { setSelected(null); setOfferPercent(""); }}
                  className="text-gray-400 hover:text-gray-600 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-sm font-bold text-gray-700">{formatPrice(basePrice)}</span>
                {selected.on_sale && (
                  <span className="text-[10px] font-bold uppercase bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                    Already on Sale
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Offer % Input */}
        {selected && (
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-600 block">
              Offer Percentage (%)
            </label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={offerPercent}
                  onChange={(e) => setOfferPercent(e.target.value)}
                  placeholder="e.g. 20"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-9 text-sm focus:outline-none focus:border-gray-500"
                />
              </div>

              {/* Price Preview */}
              {isValidPct && salePrice !== null && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 shrink-0">
                  <span className="text-xs line-through text-gray-400">{formatPrice(basePrice)}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-sm font-bold text-green-700">{formatPrice(salePrice)}</span>
                  <span className="text-xs text-green-600 font-semibold">(-{pct}%)</span>
                </div>
              )}
            </div>

            <Button
              onClick={handleAddToSale}
              disabled={!isValidPct || submitting}
              className="w-full gap-2 bg-red-600 hover:bg-red-700 text-white"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4" />}
              Add to Sale
            </Button>
          </div>
        )}
      </div>

      {/* ── Current Sale Products ── */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-red-500" />
          Products Currently on Sale
          {saleProducts.length > 0 && (
            <span className="ml-1 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {saleProducts.length}
            </span>
          )}
        </h3>

        {loadingSale ? (
          <div className="flex items-center gap-2 text-gray-400 py-8 justify-center">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading…
          </div>
        ) : saleProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
            <Tag className="w-8 h-8 mb-2 opacity-40" />
            <p className="font-medium text-sm">No products on sale yet</p>
            <p className="text-xs mt-1">Search for a product above to add it to sale</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {saleProducts.map((product) => {
              const discount = product.original_price
                ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                : 0;
              return (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:border-red-200 hover:shadow-sm transition-all"
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain" />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-gray-300 m-auto mt-3.5" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{product.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{product.brand}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {product.original_price && (
                        <span className="text-xs line-through text-gray-400">
                          {formatPrice(product.original_price)}
                        </span>
                      )}
                      <span className="text-sm font-bold text-red-600">
                        {formatPrice(product.price)}
                      </span>
                      {discount > 0 && (
                        <span className="bg-red-100 text-red-600 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                          {discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Remove Sale */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveSale(product)}
                    disabled={removingId === product.id}
                    className="shrink-0 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-700 gap-1.5"
                  >
                    {removingId === product.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    Remove Sale
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesManagement;
