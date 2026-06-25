import { useState, useEffect } from "react";
import { supabase, ProductQuery } from "@/lib/supabase";
import { sendReplyEmail } from "@/lib/emailjs";
import { toast } from "sonner";
import { Loader2, MessageSquare, Send, CheckCircle2, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

type Filter = "all" | "pending" | "replied";

const QueriesManagement = () => {
  const [queries, setQueries] = useState<ProductQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [sendingId, setSendingId] = useState<string | null>(null);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("product_queries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load queries");
    else setQueries(data || []);
    setLoading(false);
  };

  const sendReply = async (query: ProductQuery) => {
    const reply = (replies[query.id!] || "").trim();
    if (!reply) {
      toast.error("Reply cannot be empty");
      return;
    }
    setSendingId(query.id!);
    const { error } = await supabase
      .from("product_queries")
      .update({
        admin_reply: reply,
        replied_at: new Date().toISOString(),
        status: "replied",
      })
      .eq("id", query.id!);
    if (error) {
      toast.error("Failed to send reply");
      setSendingId(null);
      return;
    }

    // Send email to customer
    try {
      await sendReplyEmail({
        to_email: query.customer_email,
        to_name: query.customer_name,
        product_name: query.product_name,
        reply_message: reply,
        subject: `Your query about ${query.product_name} — ProBikers Reply`,
      });
    } catch (err) {
      console.error("EmailJS error:", err);
      toast.error(`Reply saved, but email failed: ${String(err)}`);
    }

    toast.success("Reply sent!");
    setQueries((prev) =>
      prev.map((q) =>
        q.id === query.id
          ? { ...q, admin_reply: reply, status: "replied", replied_at: new Date().toISOString() }
          : q
      )
    );
    setReplies((r) => ({ ...r, [query.id!]: "" }));
    setExpandedId(null);
    setSendingId(null);
  };

  const filtered = queries.filter((q) => filter === "all" || q.status === filter);
  const pendingCount = queries.filter((q) => q.status === "pending").length;
  const repliedCount = queries.filter((q) => q.status === "replied").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Product Queries</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {queries.length} total — {pendingCount} pending, {repliedCount} replied
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{queries.length}</p>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Total Queries</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-700">{pendingCount}</p>
          <p className="text-xs text-amber-600 mt-0.5 font-medium">Awaiting Reply</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{repliedCount}</p>
          <p className="text-xs text-green-600 mt-0.5 font-medium">Replied</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(["all", "pending", "replied"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "pending" && pendingCount > 0 && (
              <span className="ml-1.5 bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Queries List */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading queries...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          <MessageSquare className="w-10 h-10 mb-3 opacity-50" />
          <p className="font-medium">No queries found</p>
          <p className="text-sm mt-1">Customer product questions will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((query) => {
            const isPending = query.status === "pending";
            const isExpanded = expandedId === query.id;

            return (
              <div
                key={query.id}
                className={`border rounded-xl overflow-hidden transition-all ${
                  isPending ? "border-amber-200 bg-white shadow-sm" : "border-gray-200 bg-gray-50"
                }`}
              >
                {/* Query Header */}
                <div className="p-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isPending ? "bg-amber-100" : "bg-green-100"
                    }`}>
                      {isPending
                        ? <Clock className="w-5 h-5 text-amber-600" />
                        : <CheckCircle2 className="w-5 h-5 text-green-600" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900">{query.customer_name}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          isPending ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                        }`}>
                          {isPending ? "Pending" : "Replied"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {query.customer_email} · <span className="font-medium text-gray-700">{query.product_name}</span>
                      </p>
                      <p className="text-sm text-gray-700 mt-1.5 line-clamp-2">{query.query_message}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-400 hidden sm:block">
                      {query.created_at
                        ? new Date(query.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                        : ""}
                    </span>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : query.id!)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Panel */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">
                    {/* Full query */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Customer Query</p>
                      <p className="text-sm text-gray-800">{query.query_message}</p>
                    </div>

                    {/* Existing reply */}
                    {query.admin_reply && (
                      <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                        <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
                          Your Reply
                          {query.replied_at && (
                            <span className="ml-2 font-normal text-green-500 normal-case">
                              · {new Date(query.replied_at).toLocaleDateString("en-IN")}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-green-800">{query.admin_reply}</p>
                      </div>
                    )}

                    {/* Reply form */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        {query.admin_reply ? "Update Reply" : "Write Reply"}
                      </label>
                      <textarea
                        rows={3}
                        value={replies[query.id!] || ""}
                        onChange={(e) =>
                          setReplies((r) => ({ ...r, [query.id!]: e.target.value }))
                        }
                        placeholder="Type your reply to the customer..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500 resize-none"
                      />
                      <Button
                        size="sm"
                        onClick={() => sendReply(query)}
                        disabled={sendingId === query.id}
                        className="mt-2 gap-2"
                      >
                        {sendingId === query.id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Send className="w-3.5 h-3.5" />}
                        Send Reply
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QueriesManagement;
