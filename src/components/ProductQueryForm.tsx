import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { MessageCircle, Loader2, Send, CheckCircle2 } from "lucide-react";

interface Props {
  productId: string | number;
  productName: string;
}

const ProductQueryForm = ({ productId, productName }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill all fields.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("product_queries").insert([{
      product_id: String(productId),
      product_name: productName,
      customer_name: name.trim(),
      customer_email: email.trim(),
      query_message: message.trim(),
      status: "pending",
    }]);
    if (error) {
      toast.error("Failed to send query. Please try again.");
    } else {
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
    }
    setSubmitting(false);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center bg-green-50 border border-green-100 rounded-2xl">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
        </div>
        <p className="font-semibold text-gray-900">Query sent!</p>
        <p className="text-sm text-gray-500">We'll get back to you at your email shortly.</p>
        <button
          onClick={() => setSent(false)}
          className="text-sm text-blue-600 hover:underline mt-1"
        >
          Ask another question
        </button>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-lg text-gray-900 leading-tight">Ask a Question</h3>
          <p className="text-xs text-gray-500">We'll reply directly to your email</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Your Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:border-blue-400 transition-colors"
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:border-blue-400 transition-colors"
              placeholder="your@email.com"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Your Question *</label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:border-blue-400 transition-colors resize-none"
            placeholder={`Ask anything about the ${productName}...`}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Send Query
        </button>
      </form>
    </div>
  );
};

export default ProductQueryForm;
