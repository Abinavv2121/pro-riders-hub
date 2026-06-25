import { useState, useEffect } from "react";
import { supabase, Order, OrderItem } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, ShoppingBag, CheckCircle2, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

type StatusFilter = "all" | "to_be_delivered" | "delivered";

const OrdersManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load orders");
    else setOrders(data || []);
    setLoading(false);
  };

  const markDelivered = async (order: Order) => {
    const { error } = await supabase
      .from("orders")
      .update({ order_status: "delivered" })
      .eq("id", order.id!);
    if (error) {
      toast.error("Failed to update order");
    } else {
      toast.success("Order marked as delivered");
      setOrders((prev) =>
        prev.map((o) => o.id === order.id ? { ...o, order_status: "delivered" } : o)
      );
    }
  };

  const filtered = orders.filter((o) => filter === "all" || o.order_status === filter);
  const pendingCount = orders.filter((o) => o.order_status === "to_be_delivered").length;
  const deliveredCount = orders.filter((o) => o.order_status === "delivered").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <p className="text-sm text-gray-500 mt-0.5">{orders.length} total — {pendingCount} pending, {deliveredCount} delivered</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Total Orders</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-700">{pendingCount}</p>
          <p className="text-xs text-amber-600 mt-0.5 font-medium">To Be Delivered</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{deliveredCount}</p>
          <p className="text-xs text-green-600 mt-0.5 font-medium">Delivered</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(["all", "to_be_delivered", "delivered"] as StatusFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f === "all" ? "All" : f === "to_be_delivered" ? "Pending" : "Delivered"}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading orders...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          <ShoppingBag className="w-10 h-10 mb-3 opacity-50" />
          <p className="font-medium">No orders found</p>
          <p className="text-sm mt-1">Orders placed by customers will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const isDelivered = order.order_status === "delivered";
            const isExpanded = expandedOrder === order.id;
            const items: OrderItem[] = Array.isArray(order.items) ? order.items : [];

            return (
              <div
                key={order.id}
                className={`border rounded-xl overflow-hidden transition-all ${
                  isDelivered
                    ? "border-gray-200 bg-gray-50 opacity-60"
                    : "border-amber-200 bg-white shadow-sm"
                }`}
              >
                {/* Order Header */}
                <div className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      isDelivered ? "bg-green-100" : "bg-amber-100"
                    }`}>
                      {isDelivered
                        ? <CheckCircle2 className="w-5 h-5 text-green-600" />
                        : <Clock className="w-5 h-5 text-amber-600" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{order.customer_name}</p>
                      <p className="text-xs text-gray-500">
                        {order.customer_phone}
                        {order.customer_email ? ` · ${order.customer_email}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="font-bold text-gray-900">₹{order.total_amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 uppercase">{order.payment_method}</p>
                    </div>
                    <span className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isDelivered ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {isDelivered ? "Delivered" : "Pending"}
                    </span>
                    <div className="flex items-center gap-2">
                      {!isDelivered && (
                        <Button
                          size="sm"
                          onClick={() => markDelivered(order)}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs gap-1.5 h-8"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
                        </Button>
                      )}
                      <button
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id!)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment</p>
                        <p className="font-medium text-gray-800 mt-0.5 uppercase">{order.payment_method}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</p>
                        <p className="font-bold text-gray-900 mt-0.5">₹{order.total_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</p>
                        <p className="font-medium text-gray-800 mt-0.5">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric"
                          }) : "—"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Delivery Address</p>
                      <p className="text-sm text-gray-700">{order.delivery_address}</p>
                    </div>

                    {items.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Items</p>
                        <div className="space-y-2">
                          {items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-2.5 border border-gray-100">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-10 rounded object-cover border border-gray-200 shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.brand} · {item.color} · {item.size}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-xs text-gray-500">×{item.quantity}</p>
                                {item.price && (
                                  <p className="text-sm font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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

export default OrdersManagement;
