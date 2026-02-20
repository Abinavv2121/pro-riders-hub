import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get("redirect") || "/dashboard";

    const handleAuth = async (action: "login" | "signup", e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please enter both email and password");
            return;
        }

        setLoading(true);
        let error = null;

        try {
            if (action === "signup") {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                error = signUpError;
                if (!error) toast.success("Account created successfully! You can now log in.");
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                error = signInError;
                if (!error) {
                    toast.success("Welcome back!");
                    navigate(redirect);
                }
            }
        } catch (err: any) {
            error = err;
        }

        if (error) {
            console.error("Supabase Auth Error:", error);
            toast.error(error.message || "An error occurred during authentication.");
        }

        setLoading(false);
    };

    return (
        <PageShell>
            <div className="container mx-auto px-5 flex items-center justify-center min-h-[70vh]">
                <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-sm">
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-heading font-bold">Welcome Back</h2>
                                <p className="text-sm text-muted-foreground font-body mt-2">Enter your email to sign in</p>
                            </div>
                            <form onSubmit={(e) => handleAuth("login", e)} className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-sm font-body focus:border-primary focus:outline-none transition-colors"
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-sm font-body focus:border-primary focus:outline-none transition-colors"
                                    required
                                />
                                <Button className="w-full" size="lg" disabled={loading}>
                                    {loading ? "Signing in..." : "Sign In"}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="signup">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-heading font-bold">Create an Account</h2>
                                <p className="text-sm text-muted-foreground font-body mt-2">Join us to manage your enquiries</p>
                            </div>
                            <form onSubmit={(e) => handleAuth("signup", e)} className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-sm font-body focus:border-primary focus:outline-none transition-colors"
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-sm font-body focus:border-primary focus:outline-none transition-colors"
                                    required
                                    minLength={6}
                                />
                                <Button className="w-full" size="lg" disabled={loading}>
                                    {loading ? "Creating account..." : "Sign Up"}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </PageShell>
    );
};

export default Auth;
