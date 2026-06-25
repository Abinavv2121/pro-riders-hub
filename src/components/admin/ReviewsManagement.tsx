import { useEffect, useState } from "react";
import { supabase, ProductReview } from "@/lib/supabase";
import { sendReplyEmail } from "@/lib/emailjs";
import { toast } from "sonner";
import { Star, Loader2, Send, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const StarDisplay = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} className={`w-3.5 h-3.5 ${rating >= s ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
    ))}
  </div>
);

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("product_reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load reviews.");
    setReviews(data || []);
    setLoading(false);
  };

  const handleReply = async (review: ProductReview) => {
    const reply = replyText[review.id!]?.trim();
    if (!reply) {
      toast.error("Please enter a reply.");
      return;
    }
    setSending((s) => ({ ...s, [review.id!]: true }));

    const { error } = await supabase
      .from("product_reviews")
      .update({ admin_reply: reply, replied_at: new Date().toISOString() })
      .eq("id", review.id!);

    if (error) {
      toast.error("Failed to save reply.");
      setSending((s) => ({ ...s, [review.id!]: false }));
      return;
    }

    // Send email to customer
    try {
      await sendReplyEmail({
        to_email: review.customer_email,
        to_name: review.customer_name,
        product_name: review.product_name,
        reply_message: reply,
        subject: `Your review of ${review.product_name} — ProBikers Reply`,
      });
    } catch (err) {
      console.error("EmailJS error:", err);
      toast.error(`Reply saved, but email failed: ${String(err)}`);
    }

    toast.success("Reply sent!");
    setReplyText((r) => ({ ...r, [review.id!]: "" }));
    setSending((s) => ({ ...s, [review.id!]: false }));
    fetchReviews();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 py-12 justify-center">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading reviews...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
          <p className="text-sm text-gray-500 mt-0.5">{reviews.length} total review{reviews.length !== 1 ? "s" : ""}</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchReviews} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-400">
          <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              {/* Review header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-semibold text-gray-900">{review.customer_name}</p>
                    <StarDisplay rating={review.rating} />
                    {review.admin_reply && (
                      <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                        Replied
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {review.customer_email} · {new Date(review.created_at!).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold text-gray-500">Product</p>
                  <p className="text-sm font-medium text-gray-800 max-w-[160px] truncate">{review.product_name}</p>
                </div>
              </div>

              {/* Review text */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed">{review.review_text}</p>
              </div>

              {/* Existing reply */}
              {review.admin_reply && (
                <div className="pl-4 border-l-2 border-blue-400 bg-blue-50 rounded-r-lg py-2 pr-3">
                  <p className="text-xs font-bold text-blue-700 mb-1">Your Reply</p>
                  <p className="text-sm text-gray-700">{review.admin_reply}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {review.replied_at && new Date(review.replied_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              )}

              {/* Reply form */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {review.admin_reply ? "Update Reply" : "Reply to Customer"}
                </label>
                <textarea
                  rows={3}
                  value={replyText[review.id!] || ""}
                  onChange={(e) => setReplyText((r) => ({ ...r, [review.id!]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400 resize-none"
                  placeholder={review.admin_reply ? "Write an updated reply..." : "Write a reply to this review..."}
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => handleReply(review)}
                    disabled={sending[review.id!] || !replyText[review.id!]?.trim()}
                    className="gap-2"
                  >
                    {sending[review.id!] ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Send Reply
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsManagement;
