import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { ADMIN_SESSION_KEY } from "@/pages/AdminLogin";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingBag,
  MessageSquare,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
  Wrench,
  Calendar,
} from "lucide-react";
import ProductsManagement from "@/components/admin/ProductsManagement";
import SalesManagement from "@/components/admin/SalesManagement";
import OrdersManagement from "@/components/admin/OrdersManagement";
import QueriesManagement from "@/components/admin/QueriesManagement";
import ReviewsManagement from "@/components/admin/ReviewsManagement";
import ServicesManagement from "@/components/admin/ServicesManagement";
import EventsManagement from "@/components/admin/EventsManagement";

type Section = "overview" | "products" | "sales" | "orders" | "queries" | "reviews" | "services" | "events";

interface Stats {
  products: number;
  activeSales: number;
  pendingOrders: number;
  openQueries: number;
  pendingServices: number;
}

const NAV = [
  { id: "overview" as Section, label: "Overview", icon: LayoutDashboard },
  { id: "products" as Section, label: "Products", icon: Package },
  { id: "sales" as Section, label: "Sales", icon: Tag },
  { id: "orders" as Section, label: "Orders", icon: ShoppingBag },
  { id: "services" as Section, label: "Services", icon: Wrench },
  { id: "queries" as Section, label: "Queries", icon: MessageSquare },
  { id: "reviews" as Section, label: "Reviews", icon: Star },
  { id: "events" as Section, label: "Community Events", icon: Calendar },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<Stats>({ products: 0, activeSales: 0, pendingOrders: 0, openQueries: 0, pendingServices: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem(ADMIN_SESSION_KEY) !== "true") {
      navigate("/admin");
    } else {
      fetchStats();
    }
  }, [navigate]);

  const fetchStats = async () => {
    setLoadingStats(true);
    const [productsRes, salesRes, ordersRes, queriesRes, servicesRes] = await Promise.all([
      supabase.from("db_products").select("id", { count: "exact" }),
      supabase.from("sales").select("id", { count: "exact" }).eq("is_active", true),
      supabase.from("orders").select("id", { count: "exact" }).eq("order_status", "to_be_delivered"),
      supabase.from("product_queries").select("id", { count: "exact" }).eq("status", "pending"),
      supabase.from("service_requests").select("id", { count: "exact" }).neq("status", "delivered"),
    ]);
    setStats({
      products: productsRes.count ?? 0,
      activeSales: salesRes.count ?? 0,
      pendingOrders: ordersRes.count ?? 0,
      openQueries: queriesRes.count ?? 0,
      pendingServices: servicesRes.count ?? 0,
    });
    setLoadingStats(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    toast.success("Logged out");
    navigate("/admin");
  };

  const handleNav = (id: Section) => {
    setSection(id);
    setSidebarOpen(false);
    if (id === "overview") fetchStats();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen z-40 w-64 bg-gray-900 flex flex-col transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:z-auto lg:shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-bold text-lg leading-tight">ProBikers</p>
              <p className="text-gray-400 text-xs mt-0.5">Admin Panel</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                section === id
                  ? "bg-white/15 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/8"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
              {id === "orders" && stats.pendingOrders > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                  {stats.pendingOrders}
                </span>
              )}
              {id === "services" && stats.pendingServices > 0 && (
                <span className="ml-auto bg-blue-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                  {stats.pendingServices}
                </span>
              )}
              {id === "queries" && stats.openQueries > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                  {stats.openQueries}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/8 transition-all"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold text-gray-900">
            {NAV.find((n) => n.id === section)?.label}
          </h1>
          <a href="/" target="_blank" rel="noopener noreferrer" className="ml-auto text-xs text-gray-400 hover:text-gray-600 transition-colors">
            View Website →
          </a>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {section === "overview" && (
            <OverviewSection stats={stats} loading={loadingStats} onNavigate={handleNav} />
          )}
          {section === "products" && <ProductsManagement />}
          {section === "sales" && <SalesManagement />}
          {section === "orders" && <OrdersManagement />}
          {section === "services" && <ServicesManagement />}
          {section === "queries" && <QueriesManagement />}
          {section === "reviews" && <ReviewsManagement />}
          {section === "events" && <EventsManagement />}
        </main>
      </div>
    </div>
  );
};

/* ─────────────────────────── Overview Section ─────────────────────────── */

const OverviewSection = ({
  stats,
  loading,
  onNavigate,
}: {
  stats: Stats;
  loading: boolean;
  onNavigate: (s: Section) => void;
}) => {
  const cards = [
    {
      label: "Products in DB",
      value: stats.products,
      icon: Package,
      color: "blue",
      section: "products" as Section,
    },
    {
      label: "Active Sales",
      value: stats.activeSales,
      icon: Tag,
      color: "purple",
      section: "sales" as Section,
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      color: "amber",
      section: "orders" as Section,
    },
    {
      label: "Pending Services",
      value: stats.pendingServices,
      icon: Wrench,
      color: "indigo",
      section: "services" as Section,
    },
    {
      label: "Open Queries",
      value: stats.openQueries,
      icon: AlertCircle,
      color: "red",
      section: "queries" as Section,
    },
  ];

  const colorMap: Record<string, { bg: string; icon: string; text: string }> = {
    blue: { bg: "bg-blue-50", icon: "text-blue-600", text: "text-blue-700" },
    purple: { bg: "bg-purple-50", icon: "text-purple-600", text: "text-purple-700" },
    amber: { bg: "bg-amber-50", icon: "text-amber-600", text: "text-amber-700" },
    indigo: { bg: "bg-indigo-50", icon: "text-indigo-600", text: "text-indigo-700" },
    red: { bg: "bg-red-50", icon: "text-red-600", text: "text-red-700" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 font-heading">Dashboard Overview</h2>
        <p className="text-sm text-gray-500 mt-0.5 font-body">Welcome back, Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map(({ label, value, icon: Icon, color, section }) => {
          const c = colorMap[color];
          return (
            <button
              key={label}
              onClick={() => onNavigate(section)}
              className="bg-white border border-gray-200 rounded-xl p-5 text-left hover:shadow-md transition-all hover:-translate-y-0.5 group"
            >
              <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${c.icon}`} />
              </div>
              {loading ? (
                <div className="h-8 bg-gray-100 rounded animate-pulse mb-1" />
              ) : (
                <p className={`text-3xl font-bold ${c.text} font-heading`}>{value}</p>
              )}
              <p className="text-xs font-medium text-gray-500 mt-1 group-hover:text-gray-700 transition-colors font-body">{label}</p>
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide font-heading">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Add Product", icon: Package, section: "products" as Section },
            { label: "New Sale", icon: Tag, section: "sales" as Section },
            { label: "View Orders", icon: ShoppingBag, section: "orders" as Section },
            { label: "Services", icon: Wrench, section: "services" as Section },
            { label: "Queries", icon: MessageSquare, section: "queries" as Section },
          ].map(({ label, icon: Icon, section }) => (
            <button
              key={label}
              onClick={() => onNavigate(section)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <Icon className="w-6 h-6 text-gray-600" />
              <span className="text-xs font-medium text-gray-700 font-body">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-yellow-400" />
          <span className="font-semibold text-sm">Getting Started</span>
        </div>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            Create products in the Products section — they'll appear in the shop
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            Upload active sales to display promotions on the homepage
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            Mark orders as Delivered once shipped to customers
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            Reply to customer product queries from the Queries section
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
