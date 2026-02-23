"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useColorMode } from "@/lib/ThemeRegistry";
import type { User } from "@supabase/supabase-js";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/DashboardRounded";
import SchoolIcon from "@mui/icons-material/SchoolRounded";
import ExploreIcon from "@mui/icons-material/ExploreRounded";
import AnalyticsIcon from "@mui/icons-material/AnalyticsRounded";
import QuizIcon from "@mui/icons-material/QuizRounded";
import EmojiEventsIcon from "@mui/icons-material/EmojiEventsRounded";
import SettingsIcon from "@mui/icons-material/SettingsRounded";
import LogoutIcon from "@mui/icons-material/LogoutRounded";
import BarChartIcon from "@mui/icons-material/BarChartRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";

const DRAWER_WIDTH = 270;

const navItems = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { label: "My Courses", icon: <SchoolIcon />, path: "/dashboard/courses" },
    { label: "Course Exploration", icon: <ExploreIcon />, path: "/dashboard/explore" },
    { label: "Skill Analysis", icon: <AnalyticsIcon />, path: "/dashboard/analysis" },
    { label: "Quizzes", icon: <QuizIcon />, path: "/dashboard/quizzes" },
    { label: "Achievements", icon: <EmojiEventsIcon />, path: "/dashboard/achievements" },
    { label: "Account Settings", icon: <SettingsIcon />, path: "/dashboard/settings" },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
    const { mode, toggleColorMode } = useColorMode();

    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
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
            <Box
                sx={{
                    display: "flex",
                    minHeight: "100vh",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "background.default",
                }}
            >
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        border: "3px solid",
                        borderColor: "primary.main",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        "@keyframes spin": {
                            "0%": { transform: "rotate(0deg)" },
                            "100%": { transform: "rotate(360deg)" },
                        },
                    }}
                />
            </Box>
        );
    }

    const username = user?.email?.split("@")[0] || "User";
    const avatarLetter = username.charAt(0).toUpperCase();
    const isDark = mode === "dark";

    const drawerContent = (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", pt: 1 }}>
            {/* Logo */}
            <Box sx={{ px: 2.5, py: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: isDark ? "rgba(45,212,191,0.10)" : "rgba(13,148,136,0.08)",
                        border: `1px solid ${isDark ? "rgba(45,212,191,0.2)" : "rgba(13,148,136,0.15)"}`,
                    }}
                >
                    <BarChartIcon sx={{ color: "primary.main", fontSize: 24 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
                    Skill
                    <Box component="span" sx={{ color: "primary.main" }}>
                        Matrix
                    </Box>
                </Typography>
            </Box>

            <Divider sx={{ mx: 2, mb: 1 }} />

            {/* User info */}
            <Box sx={{ px: 2, py: 1.5, mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                        sx={{
                            width: 38,
                            height: 38,
                            bgcolor: "primary.main",
                            color: isDark ? "#0f1117" : "#ffffff",
                            fontSize: 16,
                            fontWeight: 700,
                        }}
                    >
                        {avatarLetter}
                    </Avatar>
                    <Box sx={{ overflow: "hidden" }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                            {username}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: "text.secondary",
                                display: "block",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: 160,
                            }}
                        >
                            {user?.email}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ mx: 2, mb: 1 }} />

            {/* Navigation */}
            <List sx={{ flex: 1, px: 1, py: 0.5 }}>
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <ListItemButton
                            key={item.label}
                            selected={isActive}
                            onClick={() => {
                                router.push(item.path);
                                if (isMobile) setMobileOpen(false);
                            }}
                            sx={{
                                py: 1.2,
                                mb: 0.3,
                                "& .MuiListItemIcon-root": {
                                    color: isActive ? "primary.main" : "text.secondary",
                                    minWidth: 40,
                                },
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{
                                    fontSize: 14,
                                    fontWeight: isActive ? 600 : 400,
                                    color: isActive ? "text.primary" : "text.secondary",
                                }}
                            />
                            {isActive && (
                                <Box
                                    sx={{
                                        width: 4,
                                        height: 20,
                                        borderRadius: 2,
                                        bgcolor: "primary.main",
                                        position: "absolute",
                                        right: 12,
                                    }}
                                />
                            )}
                        </ListItemButton>
                    );
                })}
            </List>

            {/* Bottom: theme toggle + logout */}
            <Box sx={{ px: 2, pb: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                <Tooltip title={isDark ? "Switch to light mode" : "Switch to dark mode"} placement="right">
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={isDark ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
                        onClick={toggleColorMode}
                        sx={{
                            borderColor: "divider",
                            color: "text.secondary",
                            "&:hover": {
                                borderColor: "primary.main",
                                color: "primary.main",
                                bgcolor: isDark ? "rgba(45,212,191,0.06)" : "rgba(13,148,136,0.04)",
                            },
                        }}
                    >
                        {isDark ? "Light Mode" : "Dark Mode"}
                    </Button>
                </Tooltip>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{
                        borderColor: "divider",
                        color: "text.secondary",
                        "&:hover": {
                            borderColor: "error.main",
                            color: "error.main",
                            bgcolor: isDark ? "rgba(248,113,113,0.06)" : "rgba(239,68,68,0.04)",
                        },
                    }}
                >
                    Sign Out
                </Button>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
            {/* Soft background blobs — only in dark mode */}
            {isDark && (
                <Box
                    sx={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 0,
                        overflow: "hidden",
                        pointerEvents: "none",
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: "-40%",
                            left: "-20%",
                            width: "80%",
                            height: "80%",
                            background: "radial-gradient(ellipse, rgba(45,212,191,0.06), transparent 70%)",
                            animation: "floatBlob 15s ease-in-out infinite",
                        },
                        "&::after": {
                            content: '""',
                            position: "absolute",
                            bottom: "-30%",
                            right: "-20%",
                            width: "70%",
                            height: "70%",
                            background: "radial-gradient(ellipse, rgba(56,189,248,0.05), transparent 70%)",
                            animation: "floatBlob 18s ease-in-out infinite reverse",
                        },
                        "@keyframes floatBlob": {
                            "0%, 100%": { transform: "translate(0,0) scale(1)" },
                            "33%": { transform: "translate(5%,8%) scale(1.05)" },
                            "66%": { transform: "translate(-3%,-5%) scale(0.95)" },
                        },
                    }}
                />
            )}

            {/* Mobile AppBar */}
            {isMobile && (
                <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <BarChartIcon sx={{ mr: 1, color: "primary.main" }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
                            Skill
                            <Box component="span" sx={{ color: "primary.main" }}>Matrix</Box>
                        </Typography>
                        <IconButton color="inherit" onClick={toggleColorMode}>
                            {isDark ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
                        </IconButton>
                    </Toolbar>
                </AppBar>
            )}

            {/* Sidebar */}
            {isMobile ? (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{ "& .MuiDrawer-paper": { width: DRAWER_WIDTH } }}
                >
                    {drawerContent}
                </Drawer>
            ) : (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: DRAWER_WIDTH,
                        flexShrink: 0,
                        "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    position: "relative",
                    zIndex: 1,
                    mt: isMobile ? "64px" : 0,
                    overflow: "auto",
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
