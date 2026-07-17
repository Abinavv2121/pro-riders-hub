import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "@/components/PageShell";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { supabase, Enquiry, Order } from "@/lib/supabase";
import { toast } from "sonner";
import { ShoppingBag, Calendar, Mail, Package, ChevronDown, ChevronUp, Truck, CheckCircle2 } from "lucide-react";

const UserDashboard = () => {
    const { user, loading: authLoading, signOut } = useAuth();
    const navigate = useNavigate();
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate("/auth");
        } else if (user) {
            fetchData(user.email!, user.id);
        }
    }, [user, authLoading, navigate]);

    const fetchData = async (email: string, userId: string) => {
        try {
            const [enquiryRes, orderRes] = await Promise.all([
                supabase
                    .from("enquiries")
                    .select("*")
                    .eq("email", email)
                    .order("created_at", { ascending: false }),
                supabase
                    .from("orders")
                    .select("*")
                    .eq("user_id", userId)
                    .order("created_at", { ascending: false }),
            ]);
            if (enquiryRes.error) throw enquiryRes.error;
            if (orderRes.error && orderRes.error.code !== "42703" && !orderRes.error.message?.includes("user_id")) throw orderRes.error;
            setEnquiries(enquiryRes.data || []);
            setOrders(orderRes.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load your profile data.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await signOut();
        navigate("/");
        toast.success("Logged out successfully");
    };

    if (authLoading || loading) {
        return <PageShell><div className="container mx-auto px-5 min-h-[60vh] flex items-center justify-center">Loading...</div></PageShell>;
    }

    return (
        <PageShell>
            <div className="container mx-auto px-5 md:px-8 space-section min-h-[70vh]">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">My Account</h1>
                        <div className="flex items-center gap-2 text-muted-foreground font-body">
                            <Mail className="w-4 h-4" />
                            <span>{user?.email}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => navigate("/shop")}>Browse Shop</Button>
                        <Button variant="outline" onClick={handleLogout}>Log Out</Button>
                    </div>
                </div>

                {/* My Orders */}
                <div className="mb-14">
                    <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary" />
                        My Orders
                        {orders.length > 0 && (
                            <span className="ml-2 bg-primary/10 text-primary text-sm font-semibold px-2.5 py-0.5 rounded-full">
                                {orders.length}
                            </span>
                        )}
                    </h2>

                    {loading ? (
                        <div className="text-center py-10">Loading your orders...</div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-12 px-4 border border-gray-200 rounded-xl bg-white">
                            <Package className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                            <p className="text-muted-foreground font-body mb-4">You haven't placed any orders yet.</p>
                            <Button onClick={() => navigate("/shop")}>Start Shopping</Button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {orders.map((order) => {
                                const isExpanded = expandedOrder === order.id;
                                const itemsArr = Array.isArray(order.items) ? order.items : [];
                                const date = order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
                                return (
                                    <div key={order.id} className="border border-gray-200 rounded-xl bg-white overflow-hidden">
                                        {/* Order summary row */}
                                        <div
                                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                                            onClick={() => setExpandedOrder(isExpanded ? null : (order.id ?? null))}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-0.5">Order</span>
                                                    <span className="font-heading font-bold text-sm truncate max-w-[140px]">#{order.id?.slice(-8).toUpperCase()}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-0.5">Date</span>
                                                    <span className="font-heading font-semibold text-sm flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{date}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-0.5">Total</span>
                                                    <span className="font-heading font-bold text-sm">₹{order.total_amount?.toLocaleString("en-IN")}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                                                    order.order_status === "delivered"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-amber-100 text-amber-700"
                                                }`}>
                                                    {order.order_status === "delivered"
                                                        ? <><CheckCircle2 className="w-3.5 h-3.5" /> Delivered</>
                                                        : <><Truck className="w-3.5 h-3.5" /> To Be Delivered</>
                                                    }
                                                </span>
                                                {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                            </div>
                                        </div>

                                        {/* Expanded details */}
                                        {isExpanded && (
                                            <div className="border-t border-gray-200 px-5 py-4 bg-gray-50 space-y-4">
                                                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-heading block mb-0.5">Delivery Address</span>
                                                        <p className="font-body text-foreground">{order.delivery_address}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-heading block mb-0.5">Payment</span>
                                                        <p className="font-body text-foreground uppercase font-semibold">{order.payment_method}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-heading block mb-2">Items ({itemsArr.length})</span>
                                                    <div className="space-y-2">
                                                        {itemsArr.map((item: { id?: string | number; name?: string; brand?: string; image?: string; color?: string; size?: string; quantity?: number; price?: number }, idx: number) => (
                                                            <div key={idx} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3">
                                                                {item.image && (
                                                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded-md bg-white border border-gray-200 shrink-0" />
                                                                )}
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-heading font-bold text-sm truncate">{item.name}</p>
                                                                    <p className="text-xs text-muted-foreground">{item.brand} · {item.color} · {item.size} · ×{item.quantity}</p>
                                                                </div>
                                                                {item.price && (
                                                                    <span className="text-sm font-semibold shrink-0">₹{((item.price ?? 0) * (item.quantity ?? 1)).toLocaleString("en-IN")}</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* My Enquiries */}
                <div>
                    <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                        My Enquiries
                    </h2>

                    {loading ? (
                        <div className="text-center py-10">Loading your enquiries...</div>
                    ) : enquiries.length === 0 ? (
                        <div className="text-center py-12 px-4 border border-gray-200 rounded-xl bg-white">
                            <p className="text-muted-foreground font-body mb-4">You haven't made any enquiries yet.</p>
                            <Button onClick={() => navigate("/shop")}>Browse Shop</Button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {enquiries.map((enq) => (
                                <div key={enq.id} className="p-6 border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-colors">
                                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                        <h3 className="font-heading font-bold text-lg">{enq.subject || "General Enquiry"}</h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(enq.created_at || "").toLocaleDateString()}
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground font-body text-sm line-clamp-3 bg-gray-50 p-4 rounded-lg">
                                        {enq.message}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PageShell>
    );
};

export default UserDashboard;
