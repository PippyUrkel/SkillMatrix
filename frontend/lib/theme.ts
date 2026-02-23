"use client";

import { createTheme } from "@mui/material/styles";

/* ─── Soft color palette ─────────────────────────────────────────────────────
   Slate / teal base instead of harsh purple. Warm neutrals for light mode.  */

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
                        backgroundColor: "rgba(45, 212, 191, 0.10)",
                        "&:hover": { backgroundColor: "rgba(45, 212, 191, 0.16)" },
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
        primary: { main: "#2dd4bf", light: "#5eead4", dark: "#14b8a6" },       // teal
        secondary: { main: "#94a3b8", light: "#cbd5e1", dark: "#64748b" },     // slate
        error: { main: "#f87171" },
        success: { main: "#4ade80" },
        warning: { main: "#fbbf24" },
        info: { main: "#38bdf8" },
        background: { default: "#0f1117", paper: "#171923" },
        text: { primary: "#e2e8f0", secondary: "#94a3b8" },
        divider: "rgba(255,255,255,0.06)",
    },
    components: {
        ...shared.components,
        MuiCard: {
            styleOverrides: {
                root: {
                    background: "rgba(23, 25, 35, 0.80)",
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
                    background: "rgba(15, 17, 23, 0.96)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    borderRight: "1px solid rgba(255,255,255,0.06)",
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: "rgba(23, 25, 35, 0.80)",
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
        primary: { main: "#0d9488", light: "#14b8a6", dark: "#0f766e" },       // teal
        secondary: { main: "#64748b", light: "#94a3b8", dark: "#475569" },     // slate
        error: { main: "#ef4444" },
        success: { main: "#16a34a" },
        warning: { main: "#d97706" },
        info: { main: "#0284c7" },
        background: { default: "#f8fafc", paper: "#ffffff" },
        text: { primary: "#1e293b", secondary: "#64748b" },
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
