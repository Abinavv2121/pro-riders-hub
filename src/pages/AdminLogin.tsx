import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PageShell from "@/components/PageShell";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string;

export const ADMIN_SESSION_KEY = "prh_admin_session";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionStorage.getItem(ADMIN_SESSION_KEY) === "true") {
            navigate("/admin/dashboard");
        }
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please enter both email and password");
            return;
        }
        setLoading(true);
        await new Promise((r) => setTimeout(r, 400));

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
            toast.success("Login successful");
            navigate("/admin/dashboard");
        } else {
            toast.error("Invalid admin credentials");
        }
        setLoading(false);
    };

    return (
        <PageShell>
            <div className="flex min-h-[60vh] items-center justify-center p-4">
                <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 border border-black" style={{ boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold font-heading text-[#111827]">Admin Login</h2>
                        <p className="mt-2 text-sm text-[#6B7280] font-body">Sign in to manage your store</p>
                    </div>
                    <form className="space-y-4" onSubmit={handleLogin}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Admin email"
                            className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg bg-[#F9FAFB] text-black placeholder:text-[#9CA3AF] font-body text-sm focus:outline-none focus:border-primary transition-colors"
                            required
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg bg-[#F9FAFB] text-black placeholder:text-[#9CA3AF] font-body text-sm focus:outline-none focus:border-primary transition-colors"
                            required
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </div>
            </div>
        </PageShell>
    );
};

export default AdminLogin;
