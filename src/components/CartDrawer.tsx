import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { sendCustomerAutoReply } from "@/lib/emailjs";
import { supabase } from "@/lib/supabase";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CartDrawer = () => {
  const { items, removeItem, updateQuantity, clearCart, totalItems, isOpen, setIsOpen } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCartEnquiry = async () => {
    if (!user) {
      setIsOpen(false);
      navigate("/auth?redirect=/shop");
      return;
    }

    if (items.length === 0) return;

    setIsSubmitting(true);

    // Generate cart summary message
    const subject = `Cart Enquiry - ${totalItems} Items`;
    const message = items.map(item => `- ${item.name} (${item.brand}) | Color: ${item.color} | Size: ${item.size} | Qty: ${item.quantity}`).join('\n');

    try {
      // 1. Save to Supabase
      const { error: supabaseError } = await supabase
        .from('enquiries')
        .insert([{
          name: user.email?.split('@')[0] || 'Customer', // best effort extraction from email
          email: user.email,
          subject: subject,
          message: message
        }]);

      if (supabaseError) throw supabaseError;

      // 2. Send Email
      try {
        await sendCustomerAutoReply({
          to_name: user.email?.split('@')[0] || 'Customer',
          to_email: user.email!,
          subject: subject,
          message: message
        });
      } catch (emailError) {
        console.error("EmailJS Error:", emailError);
        toast.warning("Enquiry saved, but email notification failed.");
      }

      toast.success("Cart enquiry sent! We'll reply shortly.");
      clearCart();
      setIsOpen(false);
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Failed to send enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md bg-background border-border flex flex-col" aria-describedby="cart-description">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle id="cart-description" className="font-heading text-foreground flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Cart ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <ShoppingBag className="w-12 h-12 opacity-30" />
            <p className="font-heading text-sm uppercase tracking-wider">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-4 p-3 rounded-lg border border-white/10 bg-primary shadow-lg"
                  >
                    <div className="w-20 h-20 rounded-md bg-white flex items-center justify-center flex-shrink-0">
                      <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-white font-heading">{item.brand}</p>
                      <h4 className="font-heading font-bold text-black text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-white mt-0.5">{item.color} · {item.size}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded border border-white/30 flex items-center justify-center text-white hover:text-white/80 hover:border-white/60 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-heading font-semibold text-white w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded border border-white/30 flex items-center justify-center text-white hover:text-white/80 hover:border-white/60 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto w-7 h-7 rounded flex items-center justify-center text-black hover:text-red-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <Button
                className="w-full"
                size="lg"
                onClick={handleCartEnquiry}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Enquire About Cart"}
              </Button>
              <Button variant="ghost" size="sm" className="w-full text-black" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
