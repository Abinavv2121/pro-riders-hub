import { useState, useEffect } from "react";
import { supabase, ServiceRequest } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Loader2,
  Wrench,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  User,
  Phone,
  Mail,
  Calendar,
  Bike,
  ExternalLink,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type StatusFilter = "all" | "pending" | "completed";

const STATUS_OPTIONS = [
  { value: "received", label: "Received", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "diagnosing", label: "Diagnosing", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { value: "awaiting-approval", label: "Awaiting Approval", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { value: "in-service", label: "In Service", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "ready", label: "Ready to Collect", color: "bg-green-50 text-green-700 border-green-200" },
  { value: "delivered", label: "Delivered & Done", color: "bg-gray-100 text-gray-700 border-gray-300" },
];

const ServicesManagement = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("service_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }
      setRequests(data || []);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load service requests from database.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("service_requests")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      toast.success(`Status updated to ${newStatus}`);
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus as any } : r))
      );
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to update service request status.");
    }
  };

  const markAsDone = (id: string) => {
    updateStatus(id, "delivered");
  };

  // Filtering
  const filtered = requests.filter((r) => {
    // Status Filter
    if (filter === "pending" && r.status === "delivered") return false;
    if (filter === "completed" && r.status !== "delivered") return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = r.customer_name?.toLowerCase().includes(q);
      const emailMatch = r.customer_email?.toLowerCase().includes(q);
      const brandMatch = r.bike_brand?.toLowerCase().includes(q);
      const modelMatch = r.bike_model?.toLowerCase().includes(q);
      const packageMatch = r.package_name?.toLowerCase().includes(q);
      return nameMatch || emailMatch || brandMatch || modelMatch || packageMatch;
    }

    return true;
  });

  const pendingCount = requests.filter((r) => r.status !== "delivered").length;
  const completedCount = requests.filter((r) => r.status === "delivered").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-heading">Service Orders</h2>
          <p className="text-sm text-gray-500 mt-0.5 font-body">
            {requests.length} total — {pendingCount} pending, {completedCount} completed
          </p>
        </div>
        <Button onClick={fetchRequests} variant="outline" size="sm" className="w-fit">
          Refresh List
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
          <p className="text-xs text-gray-500 mt-0.5 font-medium uppercase tracking-wider">Total Requests</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-blue-700">{pendingCount}</p>
          <p className="text-xs text-blue-600 mt-0.5 font-medium uppercase tracking-wider font-body">Pending Services</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-green-700">{completedCount}</p>
          <p className="text-xs text-green-600 mt-0.5 font-medium uppercase tracking-wider font-body">Completed</p>
        </div>
      </div>

      {/* Controls: Filter and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(["all", "pending", "completed"] as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors font-heading ${
                filter === f
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f === "all" ? "All" : f === "pending" ? "Pending" : "Completed"}
              {f === "pending" && pendingCount > 0 && (
                <span className="ml-1.5 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer, bike, or package..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border rounded-lg text-sm w-full bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading service requests...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-white shadow-sm">
          <Wrench className="w-10 h-10 mb-3 opacity-50 text-gray-500" />
          <p className="font-semibold text-gray-700 font-heading">No service requests found</p>
          <p className="text-sm mt-1 text-gray-500 font-body">Customer bike servicing requests will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => {
            const isCompleted = req.status === "delivered";
            const isExpanded = expandedRequest === req.id;
            const currentStatusOption = STATUS_OPTIONS.find((o) => o.value === req.status) || STATUS_OPTIONS[0];

            return (
              <div
                key={req.id}
                className={`border rounded-xl bg-white overflow-hidden shadow-sm transition-all ${
                  isCompleted ? "border-gray-200" : "border-blue-100 ring-1 ring-blue-50/50"
                }`}
              >
                {/* Request Header Summary */}
                <div
                  onClick={() => setExpandedRequest(isExpanded ? null : req.id!)}
                  className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center flex-wrap gap-2.5">
                      <span className="font-semibold text-gray-900 text-base font-heading">
                        {req.customer_name}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${currentStatusOption.color} font-body`}
                      >
                        {currentStatusOption.label}
                      </span>
                      {req.priority_booking && (
                        <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 text-[10px] font-bold rounded-full font-body uppercase tracking-wider">
                          Priority
                        </span>
                      )}
                      {req.pickup_delivery && (
                        <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 text-[10px] font-bold rounded-full font-body uppercase tracking-wider">
                          Pickup/Delivery
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 font-body mt-1">
                      <span className="flex items-center gap-1">
                        <Wrench className="w-3.5 h-3.5 text-gray-400" />
                        {req.package_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {req.service_date} ({req.service_time_slot})
                      </span>
                      <span className="flex items-center gap-1">
                        <Bike className="w-3.5 h-3.5 text-gray-400" />
                        {req.bike_brand} {req.bike_model}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-4">
                    <div className="text-left lg:text-right">
                      <p className="text-sm text-gray-500 font-medium font-body">Total Bill</p>
                      <p className="text-lg font-black text-gray-900 font-heading">
                        ₹{Number(req.total_price).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {/* Done Button */}
                      {!isCompleted && (
                        <Button
                          onClick={() => markAsDone(req.id!)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold font-heading text-xs uppercase px-4 h-9"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1.5" />
                          Done
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedRequest(isExpanded ? null : req.id!)}
                        className="text-gray-500 hover:text-gray-800 p-2"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50/50 p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Customer Info Card */}
                      <div className="bg-white border rounded-xl p-4 space-y-3 shadow-sm">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-heading flex items-center gap-1">
                          <User className="w-3.5 h-3.5" /> Customer Info
                        </h4>
                        <div className="space-y-2 text-sm text-gray-700 font-body">
                          <p className="font-semibold text-gray-900">{req.customer_name}</p>
                          <p className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <a href={`tel:${req.customer_phone}`} className="hover:underline text-blue-600">
                              {req.customer_phone}
                            </a>
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <a href={`mailto:${req.customer_email}`} className="hover:underline text-blue-600 break-all">
                              {req.customer_email}
                            </a>
                          </p>
                        </div>
                      </div>

                      {/* Bike & Issue Card */}
                      <div className="bg-white border rounded-xl p-4 space-y-3 shadow-sm md:col-span-2 lg:col-span-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-heading flex items-center gap-1">
                          <Bike className="w-3.5 h-3.5" /> Bike & Problem Details
                        </h4>
                        <div className="space-y-2 text-sm text-gray-700 font-body">
                          <p>
                            <span className="font-semibold text-gray-900">Bike:</span>{" "}
                            {req.bike_brand || "N/A"} {req.bike_model || "N/A"}
                          </p>
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-gray-600 italic">
                            "{req.problem_description}"
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Photos & Invoice section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Bike Photos */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-heading">
                          Uploaded Photos ({req.bike_photos?.length || 0})
                        </h4>
                        {req.bike_photos && req.bike_photos.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {req.bike_photos.map((url, idx) => (
                              <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative w-20 h-20 border rounded-lg overflow-hidden block bg-gray-100 hover:ring-2 hover:ring-gray-900 transition-all shadow-sm"
                              >
                                <img
                                  src={url}
                                  alt={`Bike issue ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </a>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 italic font-body">No photos uploaded by customer</p>
                        )}
                      </div>

                      {/* Invoice Link */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-heading">
                          Purchase Invoice
                        </h4>
                        {req.invoice_url ? (
                          <a
                            href={req.invoice_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline bg-white border px-3.5 py-2 rounded-lg shadow-sm"
                          >
                            View Invoice Document <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <p className="text-xs text-gray-500 italic font-body">No invoice document attached</p>
                        )}
                      </div>
                    </div>

                    {/* Status Management Bar */}
                    <div className="bg-white border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                      <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 font-heading">
                          Update Service Status
                        </p>
                        <p className="text-xs text-gray-500 font-body">
                          Change the progress status. Customer's order updates instantly.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <select
                          value={req.status}
                          onChange={(e) => updateStatus(req.id!, e.target.value)}
                          className="text-sm font-semibold border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 border-gray-300"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>

                        {!isCompleted && (
                          <Button
                            onClick={() => markAsDone(req.id!)}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold font-heading text-xs uppercase px-4 h-9 shadow-sm"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                            Mark Completed
                          </Button>
                        )}
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
  );
};

export default ServicesManagement;
