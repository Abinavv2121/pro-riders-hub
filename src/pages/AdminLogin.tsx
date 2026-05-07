import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PageShell from "@/components/PageShell";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Using hardcoded credentials as requested by user
        if (email === "admin@gmail.com" && password === "admin@pass") {
            toast.success("Login successful");
            // Basic auth state saving for this simple implementation
            localStorage.setItem("adminAuth", "true");
            navigate("/admin/dashboard");
        } else {
            toast.error("Invalid credentials.");
        }
    };

    return (
        <PageShell>
            <div className="flex min-h-[60vh] items-center justify-center p-4">
                <div className="w-full max-w-md space-y-8 rounded-xl bg-[#FFFFFF] p-8 border border-[#000000]" style={{ boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold font-heading text-[#111827]">Admin Login</h2>
                        <p className="mt-2 text-sm text-[#6B7280] font-body">
                            Sign in to view customer enquiries
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address"
                                    className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg bg-[#F9FAFB] text-[#000000] placeholder:text-[#9CA3AF] font-body text-sm focus:outline-none focus:border-primary transition-colors duration-200"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg bg-[#F9FAFB] text-[#000000] placeholder:text-[#9CA3AF] font-body text-sm focus:outline-none focus:border-primary transition-colors duration-200"
                                    required
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>
                    </form>
                </div>
            </div>
        </PageShell>
    );
};

export default AdminLogin;
