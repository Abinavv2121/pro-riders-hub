import { useEffect, useState } from "react";
import { supabase, ProductReview } from "@/lib/supabase";
import { toast } from "sonner";
import { Star, X, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  productId: string;
  productName: string;
}

const StarInput = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-6 h-6 ${(hovered || value) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        </button>
      ))}
    </div>
  );
};

const StarDisplay = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} className={`w-4 h-4 ${rating >= s ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
    ))}
  </div>
);

const ReviewSection = ({ productId, productName }: Props) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    setReviews(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || rating === 0 || !text.trim()) {
      toast.error("Please fill all fields and select a rating.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("product_reviews").insert([{
      product_id: productId,
      product_name: productName,
      customer_name: name.trim(),
      customer_email: email.trim(),
      rating,
      review_text: text.trim(),
    }]);
    if (error) {
      toast.error("Failed to submit review.");
    } else {
      toast.success("Review submitted! Thank you.");
      setName(""); setEmail(""); setRating(0); setText("");
      setShowForm(false);
      fetchReviews();
    }
    setSubmitting(false);
  };

  const avgRating = reviews.length
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-black text-foreground uppercase tracking-tight">
            Customer Reviews
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <StarDisplay rating={Math.round(avgRating)} />
              <span className="text-sm font-semibold text-foreground">{avgRating}</span>
              <span className="text-sm text-muted-foreground">({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span>
            </div>
          )}
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} variant="outline" className="gap-2">
            <MessageSquare className="w-4 h-4" /> Write a Review
          </Button>
        )}
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="border border-border rounded-xl p-6 bg-muted/30"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-base">Write a Review</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-foreground"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-foreground"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Rating *</label>
                <StarInput value={rating} onChange={setRating} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Review *</label>
                <textarea
                  required
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-foreground resize-none"
                  placeholder="Share your experience with this product..."
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={submitting} className="gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit Review
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground py-6">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground border border-dashed border-border rounded-xl">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-medium">No reviews yet</p>
          <p className="text-xs mt-1">Be the first to review this product</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="border border-border rounded-xl p-5 bg-background">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-sm text-foreground">{r.customer_name}</p>
                  <StarDisplay rating={r.rating} />
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(r.created_at!).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              <p className="mt-3 text-sm text-foreground leading-relaxed">{r.review_text}</p>
              {r.admin_reply && (
                <div className="mt-3 pl-4 border-l-2 border-primary bg-primary/5 rounded-r-lg py-2 pr-3">
                  <p className="text-xs font-bold text-primary mb-1">ProBikers Team</p>
                  <p className="text-sm text-foreground">{r.admin_reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
