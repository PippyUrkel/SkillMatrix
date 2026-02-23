"use client";

import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { darkTheme, lightTheme } from "./theme";

const emotionCache = createCache({ key: "mui", prepend: true });

// ─── Color mode context ────────────────────────────────────────────────────
type ColorMode = "dark" | "light";

interface ColorModeContextType {
    mode: ColorMode;
    toggleColorMode: () => void;
}

export const ColorModeContext = React.createContext<ColorModeContextType>({
    mode: "dark",
    toggleColorMode: () => { },
});

export function useColorMode() {
    return React.useContext(ColorModeContext);
}

// ─── Provider ──────────────────────────────────────────────────────────────
export default function ThemeRegistry({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mode, setMode] = React.useState<ColorMode>("dark");

    // Persist preference
    React.useEffect(() => {
        const saved = localStorage.getItem("skillmatrix-theme") as ColorMode | null;
        if (saved === "light" || saved === "dark") setMode(saved);
    }, []);

    const toggleColorMode = React.useCallback(() => {
        setMode((prev) => {
            const next = prev === "dark" ? "light" : "dark";
            localStorage.setItem("skillmatrix-theme", next);
            return next;
        });
    }, []);

    const theme = mode === "dark" ? darkTheme : lightTheme;

    return (
        <CacheProvider value={emotionCache}>
            <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </ColorModeContext.Provider>
        </CacheProvider>
    );
}
