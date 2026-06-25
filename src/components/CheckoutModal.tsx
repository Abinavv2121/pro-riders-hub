import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import type { CartItem } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { X, Loader2, Truck, Smartphone, MapPin, Phone, User, CheckCircle2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { bikes } from "@/data/bikes";
import { products } from "@/data/products";

interface Props {
  open: boolean;
  onClose: () => void;
}

type PaymentMethod = "cod" | "upi";

const getItemPrice = (item: CartItem): number =>
  item.price ??
  bikes.find((b) => b.id === item.id)?.price ??
  products.find((p) => p.id === item.id)?.price ??
  0;

const CheckoutModal = ({ open, onClose }: Props) => {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + getItemPrice(item) * item.quantity,
    0
  );

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setPayment("cod");
    setSuccess(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error("Please fill all required fields.");
      return;
    }
    if (phone.length < 10) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    setSubmitting(true);
    try {
    const orderItems = items.map((item) => {
      const price = getItemPrice(item);
      return {
        id: item.id,
        name: item.name,
        brand: item.brand,
        image: item.image,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        price,
      };
    });

    const orderPayload: Record<string, unknown> = {
      customer_name: name.trim(),
      customer_email: email.trim() || null,
      customer_phone: phone.trim(),
      delivery_address: address.trim(),
      items: orderItems,
      total_amount: total,
      payment_method: payment,
      order_status: "to_be_delivered",
      ...(user?.id ? { user_id: user.id } : {}),
    };

    let { error } = await supabase.from("orders").insert([orderPayload]);

    // If the user_id column hasn't been migrated yet, retry without it
    if (error && (error.code === "42703" || error.message?.includes("user_id"))) {
      const { user_id: _removed, ...payloadWithoutUserId } = orderPayload;
      const { error: retryError } = await supabase.from("orders").insert([payloadWithoutUserId]);
      error = retryError;
    }

    if (error) {
      toast.error("Failed to place order. Please try again.");
    } else {
      // Deduct stock for DB products
      const dbItems = items.filter((i) => i.dbProductId);
      for (const item of dbItems) {
        const { data } = await supabase
          .from("db_products")
          .select("stock_quantity")
          .eq("id", item.dbProductId!)
          .maybeSingle();
        if (data) {
          const newQty = Math.max(0, data.stock_quantity - item.quantity);
          const newStatus =
            newQty === 0 ? "Out of Stock" : newQty <= 5 ? "Limited Stock" : "In Stock";
          await supabase
            .from("db_products")
            .update({ stock_quantity: newQty, stock_status: newStatus })
            .eq("id", item.dbProductId!);
        }
      }
      setSuccess(true);
      clearCart();
    }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="text-lg font-bold text-gray-900">
                {success ? "Order Placed!" : "Checkout"}
              </h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success State */}
            {success ? (
              <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-9 h-9 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Thank you, {name}!</h3>
                <p className="text-gray-500 text-sm mb-1">Your order has been placed successfully.</p>
                <p className="text-gray-400 text-xs mb-6">
                  Payment method: <span className="font-semibold uppercase text-gray-600">{payment}</span>
                </p>
                <Button onClick={handleClose} className="w-full">Back to Shopping</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5" /> Order Summary
                  </p>
                  <div className="space-y-2">
                    {items.map((item) => {
                      const price = getItemPrice(item);
                      return (
                        <div key={item.id} className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.color} · {item.size} · ×{item.quantity}</p>
                          </div>
                          {price > 0 && (
                            <p className="text-sm font-semibold text-gray-900 shrink-0">
                              ₹{(price * item.quantity).toLocaleString()}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {total > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-bold text-gray-900 text-lg">₹{total.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-500"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-500"
                      placeholder="10-digit mobile number"
                      maxLength={10}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email (optional)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-500"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Delivery Address *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-500 resize-none"
                      placeholder="Full delivery address..."
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPayment("cod")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        payment === "cod"
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <Truck className="w-6 h-6" />
                      <span className="text-sm font-semibold">Cash on Delivery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPayment("upi")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        payment === "upi"
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <Smartphone className="w-6 h-6" />
                      <span className="text-sm font-semibold">UPI Payment</span>
                    </button>
                  </div>

                  {payment === "upi" && (
                    <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                      <p className="text-xs font-semibold text-blue-700 mb-1">UPI ID</p>
                      <p className="text-base font-bold text-blue-900 tracking-wide">probikers@upi</p>
                      <p className="text-xs text-blue-600 mt-1">Pay and mention your order to our team</p>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={submitting || items.length === 0}
                  className="w-full gap-2 h-12 text-base"
                >
                  {submitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Placing Order...</>
                  ) : (
                    <>Place Order{total > 0 ? ` · ₹${total.toLocaleString()}` : ""}</>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;
