import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "@/components/PageShell";
import { supabase, Enquiry } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check basic auth
        const isAuth = localStorage.getItem("adminAuth");
        if (isAuth !== "true") {
            navigate("/admin");
            return;
        }

        fetchEnquiries();
    }, [navigate]);

    const fetchEnquiries = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("enquiries")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setEnquiries(data || []);
        } catch (error) {
            console.error("Error fetching enquiries:", error);
            toast.error("Failed to load enquiries.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminAuth");
        navigate("/admin");
        toast.success("Logged out successfully");
    };

    return (
        <PageShell>
            <div className="container mx-auto px-5 md:px-8 space-section min-h-[70vh]">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-heading font-bold">Admin Dashboard</h1>
                    <Button variant="outline" onClick={handleLogout}>Logout</Button>
                </div>

                {loading ? (
                    <div className="text-center py-10">Loading enquiries...</div>
                ) : enquiries.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground border rounded-lg bg-card">No enquiries found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted border-b border-border text-sm font-heading">
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Subject</th>
                                    <th className="p-4 w-1/3">Message</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enquiries.map((enq) => (
                                    <tr key={enq.id} className="border-b border-border hover:bg-muted/50 transition-colors text-sm font-body">
                                        <td className="p-4 text-muted-foreground whitespace-nowrap">
                                            {new Date(enq.created_at || "").toLocaleDateString()}
                                        </td>
                                        <td className="p-4 font-medium">{enq.name}</td>
                                        <td className="p-4 text-muted-foreground">{enq.email}</td>
                                        <td className="p-4">{enq.subject || "-"}</td>
                                        <td className="p-4 text-muted-foreground break-words max-w-xs">{enq.message}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </PageShell>
    );
};

export default AdminDashboard;
