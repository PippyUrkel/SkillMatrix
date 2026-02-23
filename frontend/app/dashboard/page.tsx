"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const cards = [
    {
        title: "Skill Analysis",
        description: "Discover your strengths and areas for growth",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
            </svg>
        ),
        color: "from-indigo-500/20 to-indigo-600/5",
        ringColor: "ring-indigo-500/20",
        iconColor: "text-indigo-400",
    },
    {
        title: "Take a Quiz",
        description: "Test your knowledge with targeted assessments",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
        ),
        color: "from-violet-500/20 to-violet-600/5",
        ringColor: "ring-violet-500/20",
        iconColor: "text-violet-400",
    },
    {
        title: "My Profile",
        description: "Manage your learning profile and progress",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
        ),
        color: "from-fuchsia-500/20 to-fuchsia-600/5",
        ringColor: "ring-fuchsia-500/20",
        iconColor: "text-fuchsia-400",
    },
    {
        title: "Learning Paths",
        description: "Curated resources to close your skill gaps",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
            </svg>
        ),
        color: "from-cyan-500/20 to-cyan-600/5",
        ringColor: "ring-cyan-500/20",
        iconColor: "text-cyan-400",
    },
];

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                router.replace("/login");
            } else {
                setUser(session.user);
                setLoading(false);
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                router.replace("/login");
            } else {
                setUser(session.user);
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace("/login");
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            {/* Background */}
            <div className="gradient-mesh" />

            {/* Navbar */}
            <nav className="relative z-10 border-b border-card-border bg-card/50 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                                <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold tracking-tight">
                            Skill<span className="text-primary">Matrix</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="hidden text-sm text-muted sm:inline-block">
                            {user?.email}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="rounded-xl border border-card-border bg-card/50 px-4 py-2 text-sm font-medium text-muted transition-all duration-200 hover:border-danger/30 hover:text-danger"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="relative z-10 mx-auto max-w-6xl px-6 py-12">
                {/* Welcome */}
                <div className="mb-10 opacity-0 animate-fade-in-up">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Welcome back
                        {user?.email && (
                            <span className="text-primary">
                                , {user.email.split("@")[0]}
                            </span>
                        )}
                    </h1>
                    <p className="mt-2 text-muted">
                        Here&apos;s your skill development overview. Pick an area to get
                        started.
                    </p>
                </div>

                {/* Cards grid */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card, i) => (
                        <button
                            key={card.title}
                            className={`glass-card group relative overflow-hidden p-6 text-left opacity-0 animate-fade-in-up transition-all duration-300 hover:-translate-y-1 hover:border-white/10`}
                            style={{ animationDelay: `${(i + 1) * 100}ms` }}
                        >
                            {/* Gradient accent */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                            />

                            <div className="relative z-10">
                                <div
                                    className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${card.iconColor} ring-1 ${card.ringColor} bg-white/[0.03]`}
                                >
                                    {card.icon}
                                </div>
                                <h3 className="text-base font-semibold text-foreground">
                                    {card.title}
                                </h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                                    {card.description}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Stats placeholder */}
                <div className="mt-10 grid gap-5 sm:grid-cols-3 opacity-0 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
                    {[
                        { label: "Skills Assessed", value: "—", sub: "Take your first quiz" },
                        { label: "Current Level", value: "—", sub: "Complete an analysis" },
                        { label: "Learning Streak", value: "0 days", sub: "Start learning today" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="glass-card flex flex-col items-center px-6 py-8 text-center"
                        >
                            <p className="text-xs font-medium uppercase tracking-wider text-muted">
                                {stat.label}
                            </p>
                            <p className="mt-2 text-3xl font-bold text-foreground">
                                {stat.value}
                            </p>
                            <p className="mt-1 text-sm text-muted">{stat.sub}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
