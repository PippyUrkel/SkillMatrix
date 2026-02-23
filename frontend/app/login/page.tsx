"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // If already logged in, redirect
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) router.replace("/dashboard");
        });
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setSuccess(
                    "Account created! Check your email for a confirmation link, or if email confirmation is disabled, you can now log in."
                );
                setIsSignUp(false);
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.replace("/dashboard");
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center px-4">
            {/* Gradient mesh background */}
            <div className="gradient-mesh" />

            {/* Login card */}
            <div className="glass-card relative z-10 w-full max-w-md p-8 opacity-0 animate-fade-in-up">
                {/* Logo / Branding */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-7 w-7 text-primary"
                        >
                            <path d="M12 20V10" />
                            <path d="M18 20V4" />
                            <path d="M6 20v-4" />
                        </svg>
                    </div>
                    <h1 className="text-shimmer text-2xl font-bold tracking-tight">
                        SkillMatrix
                    </h1>
                    <p className="mt-1 text-sm text-muted">
                        {isSignUp
                            ? "Create your account to get started"
                            : "Sign in to your account"}
                    </p>
                </div>

                {/* Error / Success */}
                {error && (
                    <div className="mb-4 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger animate-fade-in-up">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 rounded-xl border border-success/20 bg-success/5 px-4 py-3 text-sm text-success animate-fade-in-up">
                        {success}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="opacity-0 animate-fade-in-up animate-delay-100">
                        <label
                            htmlFor="email"
                            className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full rounded-xl border border-input-border bg-input-bg px-4 py-3 text-sm text-foreground placeholder-muted transition-all duration-200 focus:border-input-focus focus:ring-2 focus:ring-primary-glow"
                        />
                    </div>

                    <div className="opacity-0 animate-fade-in-up animate-delay-200">
                        <label
                            htmlFor="password"
                            className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-input-border bg-input-bg px-4 py-3 text-sm text-foreground placeholder-muted transition-all duration-200 focus:border-input-focus focus:ring-2 focus:ring-primary-glow"
                        />
                    </div>

                    <div className="opacity-0 animate-fade-in-up animate-delay-300">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-glow w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    {isSignUp ? "Creating account…" : "Signing in…"}
                                </span>
                            ) : isSignUp ? (
                                "Create Account"
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </div>
                </form>

                {/* Toggle */}
                <div className="mt-6 text-center text-sm text-muted opacity-0 animate-fade-in-up animate-delay-400">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                        type="button"
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError("");
                            setSuccess("");
                        }}
                        className="font-medium text-primary transition-colors hover:text-primary-hover"
                    >
                        {isSignUp ? "Sign in" : "Sign up"}
                    </button>
                </div>
            </div>
        </div>
    );
}
