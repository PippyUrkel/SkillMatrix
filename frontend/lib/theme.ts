"use client";

import { createTheme } from "@mui/material/styles";

/* ─── Dark red / crimson palette ─────────────────────────────────────────────
   Deep warm reds with neutral slates. Rich but not garish.                   */

const shared = {
    shape: { borderRadius: 16 },
    typography: {
        fontFamily: "var(--font-geist-sans), Inter, system-ui, sans-serif",
        h4: { fontWeight: 700, letterSpacing: "-0.02em" },
        h5: { fontWeight: 700, letterSpacing: "-0.01em" },
        h6: { fontWeight: 600 },
        subtitle1: { fontWeight: 500 },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none" as const,
                    fontWeight: 600,
                    borderRadius: 12,
                    padding: "10px 20px",
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: { borderRadius: 8, height: 8 },
                bar: { borderRadius: 8 },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: { fontWeight: 500, borderRadius: 8 },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    margin: "2px 8px",
                    "&.Mui-selected": {
                        backgroundColor: "rgba(220, 38, 38, 0.10)",
                        "&:hover": { backgroundColor: "rgba(220, 38, 38, 0.16)" },
                    },
                    "&:hover": { backgroundColor: "rgba(128,128,128,0.06)" },
                },
            },
        },
    },
};

// ─── Dark theme ─────────────────────────────────────────────────────────────
export const darkTheme = createTheme({
    ...shared,
    palette: {
        mode: "dark",
        primary: { main: "#dc2626", light: "#ef4444", dark: "#b91c1c" },       // red
        secondary: { main: "#94a3b8", light: "#cbd5e1", dark: "#64748b" },     // slate
        error: { main: "#f87171" },
        success: { main: "#4ade80" },
        warning: { main: "#fbbf24" },
        info: { main: "#38bdf8" },
        background: { default: "#0c0a09", paper: "#1c1917" },                  // stone-950/900
        text: { primary: "#e7e5e4", secondary: "#a8a29e" },                    // stone-200/400
        divider: "rgba(255,255,255,0.06)",
    },
    components: {
        ...shared.components,
        MuiCard: {
            styleOverrides: {
                root: {
                    background: "rgba(28, 25, 23, 0.80)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 20,
                    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    background: "rgba(12, 10, 9, 0.96)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    borderRight: "1px solid rgba(255,255,255,0.06)",
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: "rgba(28, 25, 23, 0.80)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    boxShadow: "none",
                },
            },
        },
    },
});

// ─── Light theme ────────────────────────────────────────────────────────────
export const lightTheme = createTheme({
    ...shared,
    palette: {
        mode: "light",
        primary: { main: "#b91c1c", light: "#dc2626", dark: "#991b1b" },       // red-700
        secondary: { main: "#64748b", light: "#94a3b8", dark: "#475569" },     // slate
        error: { main: "#ef4444" },
        success: { main: "#16a34a" },
        warning: { main: "#d97706" },
        info: { main: "#0284c7" },
        background: { default: "#fafaf9", paper: "#ffffff" },                  // stone-50
        text: { primary: "#1c1917", secondary: "#78716c" },                    // stone-900/500
        divider: "rgba(0,0,0,0.08)",
    },
    components: {
        ...shared.components,
        MuiCard: {
            styleOverrides: {
                root: {
                    background: "#ffffff",
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderRadius: 20,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
                    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    background: "#ffffff",
                    borderRight: "1px solid rgba(0,0,0,0.08)",
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                    boxShadow: "none",
                },
            },
        },
    },
});
