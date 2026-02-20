import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "@/components/PageShell";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { supabase, Enquiry } from "@/lib/supabase";
import { toast } from "sonner";
import { ShoppingBag, Calendar, Mail } from "lucide-react";

const UserDashboard = () => {
    const { user, loading: authLoading, signOut } = useAuth();
    const navigate = useNavigate();
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate("/auth");
        } else if (user) {
            fetchUserEnquiries(user.email!);
        }
    }, [user, authLoading, navigate]);

    const fetchUserEnquiries = async (email: string) => {
        try {
            const { data, error } = await supabase
                .from("enquiries")
                .select("*")
                .eq("email", email)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setEnquiries(data || []);
        } catch (error) {
            console.error("Error fetching user enquiries:", error);
            toast.error("Failed to load your enquiries.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await signOut();
        navigate("/");
        toast.success("Logged out successfully");
    };

    if (authLoading || (!user && loading)) {
        return <PageShell><div className="container mx-auto px-5 min-h-[60vh] flex items-center justify-center">Loading...</div></PageShell>;
    }

    return (
        <PageShell>
            <div className="container mx-auto px-5 md:px-8 space-section min-h-[70vh]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">My Account</h1>
                        <div className="flex items-center gap-2 text-muted-foreground font-body">
                            <Mail className="w-4 h-4" />
                            <span>{user?.email}</span>
                        </div>
                    </div>
                    <Button variant="outline" onClick={handleLogout}>Log Out</Button>
                </div>

                <div>
                    <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                        My Enquiries
                    </h2>

                    {loading ? (
                        <div className="text-center py-10">Loading your enquiries...</div>
                    ) : enquiries.length === 0 ? (
                        <div className="text-center py-12 px-4 border border-border rounded-xl bg-card">
                            <p className="text-muted-foreground font-body mb-4">You haven't made any enquiries yet.</p>
                            <Button onClick={() => navigate("/shop")}>Browse Shop</Button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {enquiries.map((enq) => (
                                <div key={enq.id} className="p-6 border border-border rounded-xl bg-card hover:border-border/80 transition-colors">
                                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                        <h3 className="font-heading font-bold text-lg">{enq.subject || "General Enquiry"}</h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(enq.created_at || "").toLocaleDateString()}
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground font-body text-sm line-clamp-3 bg-muted/30 p-4 rounded-lg">
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
