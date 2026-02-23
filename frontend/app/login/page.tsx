"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { alpha } from "@mui/material/styles";

import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";

const HeroScene = dynamic(() => import("@/components/HeroScene"), { ssr: false });

const features = [
    { icon: <AutoGraphRoundedIcon />, text: "AI-powered skill gap analysis" },
    { icon: <SchoolRoundedIcon />, text: "Personalized learning paths" },
    { icon: <EmojiEventsRoundedIcon />, text: "Track your progress & earn badges" },
];

export default function LoginPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [pulseCount, setPulseCount] = useState(0);

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
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setSuccess("Account created! Check your email for a confirmation link.");
                setIsSignUp(false);
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                router.replace("/dashboard");
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const inputSx = {
        "& .MuiOutlinedInput-root": {
            bgcolor: "rgba(255,255,255,0.03)",
            borderRadius: 3,
            "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
            "&:hover fieldset": { borderColor: "rgba(220,38,38,0.3)" },
            "&.Mui-focused fieldset": { borderColor: "#dc2626" },
        },
        "& .MuiInputLabel-root": { color: "#78716c" },
        "& .MuiOutlinedInput-input": { color: "#e7e5e4" },
        "& .MuiInputAdornment-root .MuiSvgIcon-root": { color: "#57534e", fontSize: 20 },
    };

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                bgcolor: "#0c0a09",
                color: "#e7e5e4",
            }}
        >
            {/* ─── Left: Branding panel with 3D scene ──────────────────────── */}
            <Box
                sx={{
                    display: { xs: "none", md: "flex" },
                    width: "50%",
                    position: "relative",
                    flexDirection: "column",
                    justifyContent: "center",
                    overflow: "hidden",
                }}
            >
                {/* 3D Background */}
                <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
                    <HeroScene pulse={pulseCount} />
                </Box>

                {/* Overlay */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 1,
                        background:
                            "radial-gradient(ellipse at center, rgba(12,10,9,0.3) 0%, rgba(12,10,9,0.7) 70%, rgba(12,10,9,0.95) 100%)",
                    }}
                />

                {/* Content */}
                <Box sx={{ position: "relative", zIndex: 2, px: { md: 6, lg: 10 }, py: 6 }}>
                    {/* Logo */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 8 }}>
                        <Box
                            sx={{
                                width: 42,
                                height: 42,
                                borderRadius: 2.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "rgba(220,38,38,0.12)",
                                border: "1px solid rgba(220,38,38,0.25)",
                            }}
                        >
                            <BarChartRoundedIcon sx={{ color: "#dc2626", fontSize: 24 }} />
                        </Box>
                        <Typography sx={{ fontWeight: 700, fontSize: 22, letterSpacing: "-0.02em" }}>
                            Skill<Box component="span" sx={{ color: "#dc2626" }}>Matrix</Box>
                        </Typography>
                    </Box>

                    {/* Tagline */}
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            fontSize: { md: 36, lg: 44 },
                            lineHeight: 1.15,
                            letterSpacing: "-0.03em",
                            mb: 2,
                        }}
                    >
                        Your skills,{" "}
                        <Box
                            component="span"
                            sx={{
                                background: "linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            mapped & mastered
                        </Box>
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 16,
                            color: "#78716c",
                            lineHeight: 1.7,
                            maxWidth: 400,
                            mb: 5,
                        }}
                    >
                        Join thousands of learners using AI to identify skill gaps
                        and build personalized learning paths.
                    </Typography>

                    {/* Feature highlights */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {features.map((f) => (
                            <Box
                                key={f.text}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    px: 2.5,
                                    py: 1.5,
                                    borderRadius: 3,
                                    bgcolor: "rgba(28,25,23,0.5)",
                                    border: "1px solid rgba(255,255,255,0.04)",
                                    backdropFilter: "blur(12px)",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        bgcolor: "rgba(220,38,38,0.04)",
                                        borderColor: "rgba(220,38,38,0.15)",
                                    },
                                }}
                            >
                                <Box sx={{ color: "#dc2626" }}>{f.icon}</Box>
                                <Typography sx={{ fontSize: 14, color: "#a8a29e" }}>{f.text}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* ─── Right: Auth form ────────────────────────────────────────── */}
            <Box
                sx={{
                    width: { xs: "100%", md: "50%" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: { xs: 3, sm: 6 },
                    position: "relative",
                }}
            >
                {/* Subtle glow behind form */}
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 500,
                        height: 500,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(220,38,38,0.04), transparent 70%)",
                        pointerEvents: "none",
                    }}
                />

                <Box
                    sx={{
                        width: "100%",
                        maxWidth: 420,
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    {/* Mobile logo */}
                    <Box
                        sx={{
                            display: { xs: "flex", md: "none" },
                            alignItems: "center",
                            gap: 1.5,
                            mb: 4,
                            justifyContent: "center",
                        }}
                    >
                        <Box
                            sx={{
                                width: 38,
                                height: 38,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "rgba(220,38,38,0.12)",
                                border: "1px solid rgba(220,38,38,0.25)",
                            }}
                        >
                            <BarChartRoundedIcon sx={{ color: "#dc2626", fontSize: 22 }} />
                        </Box>
                        <Typography sx={{ fontWeight: 700, fontSize: 20 }}>
                            Skill<Box component="span" sx={{ color: "#dc2626" }}>Matrix</Box>
                        </Typography>
                    </Box>

                    {/* Header */}
                    <Box sx={{ mb: 4 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                fontSize: 28,
                                letterSpacing: "-0.02em",
                                mb: 1,
                            }}
                        >
                            {isSignUp ? "Create your account" : "Welcome back"}
                        </Typography>
                        <Typography sx={{ color: "#78716c", fontSize: 15 }}>
                            {isSignUp
                                ? "Start your skill development journey"
                                : "Sign in to continue your learning path"}
                        </Typography>
                    </Box>

                    {/* Alerts */}
                    {error && (
                        <Alert
                            severity="error"
                            onClose={() => setError("")}
                            sx={{
                                mb: 3,
                                borderRadius: 3,
                                bgcolor: "rgba(220,38,38,0.08)",
                                border: "1px solid rgba(220,38,38,0.2)",
                                color: "#fca5a5",
                                "& .MuiAlert-icon": { color: "#f87171" },
                            }}
                        >
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert
                            severity="success"
                            onClose={() => setSuccess("")}
                            sx={{
                                mb: 3,
                                borderRadius: 3,
                                bgcolor: "rgba(34,197,94,0.08)",
                                border: "1px solid rgba(34,197,94,0.2)",
                                color: "#86efac",
                                "& .MuiAlert-icon": { color: "#4ade80" },
                            }}
                        >
                            {success}
                        </Alert>
                    )}

                    {/* Form */}
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email address"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setPulseCount((c) => c + 1); }}
                            placeholder="you@example.com"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailRoundedIcon />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{ ...inputSx, mb: 2.5 }}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            required
                            inputProps={{ minLength: 6 }}
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setPulseCount((c) => c + 1); }}
                            placeholder="••••••••"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockRoundedIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                sx={{ color: "#57534e" }}
                                            >
                                                {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{ ...inputSx, mb: 3.5 }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            endIcon={loading ? undefined : <ArrowForwardRoundedIcon />}
                            sx={{
                                py: 1.6,
                                fontSize: 15,
                                fontWeight: 700,
                                borderRadius: 3,
                                bgcolor: "#dc2626",
                                "&:hover": { bgcolor: "#b91c1c", transform: "translateY(-1px)" },
                                "&:disabled": { bgcolor: "rgba(220,38,38,0.3)" },
                                boxShadow: "0 0 30px rgba(220,38,38,0.25)",
                                transition: "all 0.3s ease",
                            }}
                        >
                            {loading ? (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <CircularProgress size={18} sx={{ color: "#ffffff" }} />
                                    {isSignUp ? "Creating account…" : "Signing in…"}
                                </Box>
                            ) : isSignUp ? (
                                "Create Account"
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </Box>

                    {/* Divider */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            my: 3.5,
                        }}
                    >
                        <Box sx={{ flex: 1, height: 1, bgcolor: "rgba(255,255,255,0.06)" }} />
                        <Typography sx={{ fontSize: 12, color: "#57534e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            {isSignUp ? "Already a member?" : "New here?"}
                        </Typography>
                        <Box sx={{ flex: 1, height: 1, bgcolor: "rgba(255,255,255,0.06)" }} />
                    </Box>

                    {/* Toggle */}
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError("");
                            setSuccess("");
                        }}
                        sx={{
                            py: 1.4,
                            fontSize: 14,
                            fontWeight: 600,
                            borderRadius: 3,
                            borderColor: "rgba(255,255,255,0.08)",
                            color: "#a8a29e",
                            "&:hover": {
                                borderColor: "rgba(220,38,38,0.3)",
                                color: "#dc2626",
                                bgcolor: "rgba(220,38,38,0.04)",
                            },
                            transition: "all 0.3s ease",
                        }}
                    >
                        {isSignUp ? "Sign in to existing account" : "Create a new account"}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
