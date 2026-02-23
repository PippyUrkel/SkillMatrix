"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { alpha, useTheme } from "@mui/material/styles";

import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PlayCircleFilledRoundedIcon from "@mui/icons-material/PlayCircleFilledRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import BookRoundedIcon from "@mui/icons-material/BookRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import BrushRoundedIcon from "@mui/icons-material/BrushRounded";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

// ─── Mock Data ──────────────────────────────────────────────────────────────

const stats = [
    {
        label: "Courses Completed",
        value: 72,
        suffix: "%",
        icon: <SchoolRoundedIcon />,
        color: "#dc2626",
        type: "circular" as const,
    },
    {
        label: "Skills Assessed",
        value: 24,
        suffix: "",
        icon: <AutoGraphRoundedIcon />,
        color: "#0284c7",
        type: "number" as const,
    },
    {
        label: "Avg Quiz Score",
        value: 85,
        suffix: "%",
        icon: <QuizRoundedIcon />,
        color: "#16a34a",
        type: "progress" as const,
    },
    {
        label: "Learning Streak",
        value: 14,
        suffix: " days",
        icon: <LocalFireDepartmentRoundedIcon />,
        color: "#d97706",
        type: "number" as const,
    },
];

const courseProgress = [
    { name: "React Advanced Patterns", progress: 88, category: "Frontend", status: "In Progress" },
    { name: "Python for Data Science", progress: 65, category: "Data", status: "In Progress" },
    { name: "System Design Fundamentals", progress: 42, category: "Architecture", status: "In Progress" },
    { name: "TypeScript Mastery", progress: 100, category: "Frontend", status: "Completed" },
    { name: "AWS Cloud Practitioner", progress: 31, category: "Cloud", status: "In Progress" },
];

const recentActivity = [
    { action: "Completed quiz", detail: "React Hooks — scored 92%", time: "2 hours ago", icon: <CheckCircleRoundedIcon />, color: "#16a34a" },
    { action: "Started course", detail: "AWS Cloud Practitioner", time: "5 hours ago", icon: <PlayCircleFilledRoundedIcon />, color: "#dc2626" },
    { action: "Earned badge", detail: "TypeScript Expert", time: "1 day ago", icon: <EmojiEventsRoundedIcon />, color: "#d97706" },
    { action: "Submitted quiz", detail: "Python Basics — scored 88%", time: "2 days ago", icon: <CheckCircleRoundedIcon />, color: "#0284c7" },
    { action: "Resumed course", detail: "System Design Fundamentals", time: "3 days ago", icon: <PlayCircleFilledRoundedIcon />, color: "#78716c" },
];

const skills = [
    { name: "React", level: 90, color: "#dc2626" },
    { name: "TypeScript", level: 85, color: "#0284c7" },
    { name: "Python", level: 72, color: "#16a34a" },
    { name: "System Design", level: 55, color: "#d97706" },
    { name: "AWS", level: 40, color: "#ea580c" },
    { name: "Docker", level: 60, color: "#0369a1" },
    { name: "SQL", level: 78, color: "#059669" },
    { name: "GraphQL", level: 45, color: "#b91c1c" },
];

const quickActions = [
    {
        title: "Start a Quiz",
        description: "Test your knowledge with targeted assessments",
        icon: <QuizRoundedIcon sx={{ fontSize: 28 }} />,
        color: "#dc2626",
    },
    {
        title: "Resume Course",
        description: "Continue where you left off",
        icon: <PlayCircleFilledRoundedIcon sx={{ fontSize: 28 }} />,
        color: "#16a34a",
    },
    {
        title: "Browse Catalog",
        description: "Discover new courses and learning paths",
        icon: <ExploreRoundedIcon sx={{ fontSize: 28 }} />,
        color: "#0284c7",
    },
];

// ─── Circular Progress with Label ───────────────────────────────────────────

function CircularProgressWithLabel({ value, color }: { value: number; color: string }) {
    return (
        <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
                variant="determinate"
                value={100}
                size={72}
                thickness={4}
                sx={{ color: alpha(color, 0.12), position: "absolute" }}
            />
            <CircularProgress
                variant="determinate"
                value={value}
                size={72}
                thickness={4}
                sx={{
                    color: color,
                    "& .MuiCircularProgress-circle": { strokeLinecap: "round" },
                }}
            />
            <Box
                sx={{
                    inset: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18, color: "text.primary" }}>
                    {value}%
                </Typography>
            </Box>
        </Box>
    );
}

// ─── Category Icon Helper ───────────────────────────────────────────────────

function getCategoryIcon(category: string) {
    switch (category) {
        case "Frontend": return <CodeRoundedIcon sx={{ fontSize: 16 }} />;
        case "Data": return <StorageRoundedIcon sx={{ fontSize: 16 }} />;
        case "Architecture": return <BrushRoundedIcon sx={{ fontSize: 16 }} />;
        case "Cloud": return <SecurityRoundedIcon sx={{ fontSize: 16 }} />;
        default: return <BookRoundedIcon sx={{ fontSize: 16 }} />;
    }
}

// ─── Dashboard Page ─────────────────────────────────────────────────────────

export default function DashboardPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: "auto" }}>
            {/* Welcome */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, color: "text.primary" }}>
                    Welcome back 👋
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", fontSize: 15 }}>
                    Here&apos;s your skill development overview. Keep up the great work!
                </Typography>
            </Box>

            {/* ─── Stat Cards ──────────────────────────────────────────────────── */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {stats.map((stat) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={stat.label}>
                        <Card
                            sx={{
                                height: "100%",
                                position: "relative",
                                overflow: "hidden",
                                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: `0 12px 40px ${alpha(stat.color, isDark ? 0.15 : 0.1)}`,
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: 3,
                                    background: `linear-gradient(90deg, ${stat.color}, ${alpha(stat.color, 0.3)})`,
                                }}
                            />
                            <CardContent sx={{ p: 3, display: "flex", alignItems: "center", gap: 2.5 }}>
                                {stat.type === "circular" ? (
                                    <CircularProgressWithLabel value={stat.value} color={stat.color} />
                                ) : (
                                    <Box
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: 3,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            bgcolor: alpha(stat.color, isDark ? 0.1 : 0.08),
                                            border: `1px solid ${alpha(stat.color, isDark ? 0.2 : 0.12)}`,
                                            color: stat.color,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {stat.icon}
                                    </Box>
                                )}
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: "text.secondary",
                                            fontWeight: 600,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.08em",
                                            fontSize: 11,
                                        }}
                                    >
                                        {stat.label}
                                    </Typography>
                                    {stat.type !== "circular" && (
                                        <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.3, lineHeight: 1.2, color: "text.primary" }}>
                                            {stat.value}
                                            <Typography component="span" sx={{ fontSize: 16, fontWeight: 500, color: "text.secondary" }}>
                                                {stat.suffix}
                                            </Typography>
                                        </Typography>
                                    )}
                                    {stat.type === "progress" && (
                                        <LinearProgress
                                            variant="determinate"
                                            value={stat.value}
                                            sx={{
                                                mt: 1.5,
                                                height: 6,
                                                bgcolor: alpha(stat.color, 0.08),
                                                "& .MuiLinearProgress-bar": { bgcolor: stat.color },
                                            }}
                                        />
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* ─── Middle Row: Course Progress + Recent Activity ────────────── */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, lg: 7 }}>
                    <Card sx={{ height: "100%" }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <Box
                                        sx={{
                                            width: 36, height: 36, borderRadius: 2,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            bgcolor: alpha("#dc2626", isDark ? 0.1 : 0.08),
                                            border: `1px solid ${alpha("#dc2626", isDark ? 0.2 : 0.12)}`,
                                        }}
                                    >
                                        <TrendingUpRoundedIcon sx={{ color: "#dc2626", fontSize: 20 }} />
                                    </Box>
                                    <Typography variant="h6" sx={{ fontSize: 17 }}>Course Progress</Typography>
                                </Box>
                                <Button
                                    size="small"
                                    endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
                                    sx={{ color: "primary.main", fontSize: 13 }}
                                >
                                    View All
                                </Button>
                            </Box>

                            {courseProgress.map((course, i) => (
                                <Box key={course.name}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1, mt: i > 0 ? 2 : 0 }}>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", fontSize: 14 }}>
                                                    {course.name}
                                                </Typography>
                                                <Chip
                                                    size="small"
                                                    icon={getCategoryIcon(course.category)}
                                                    label={course.category}
                                                    sx={{
                                                        height: 22, fontSize: 11, fontWeight: 500,
                                                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                        color: "text.secondary",
                                                        "& .MuiChip-icon": { color: "text.secondary", ml: 0.5 },
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={course.progress}
                                                    sx={{
                                                        flex: 1, height: 8, borderRadius: 4,
                                                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                        "& .MuiLinearProgress-bar": {
                                                            borderRadius: 4,
                                                            bgcolor:
                                                                course.progress === 100 ? "#16a34a"
                                                                    : course.progress > 70 ? "#dc2626"
                                                                        : course.progress > 50 ? "#0284c7"
                                                                            : "#d97706",
                                                        },
                                                    }}
                                                />
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: course.progress === 100 ? "#16a34a" : "text.secondary",
                                                        minWidth: 38, textAlign: "right",
                                                    }}
                                                >
                                                    {course.progress}%
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    {i < courseProgress.length - 1 && <Divider sx={{ mt: 1.5 }} />}
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, lg: 5 }}>
                    <Card sx={{ height: "100%" }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                                <Box
                                    sx={{
                                        width: 36, height: 36, borderRadius: 2,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        bgcolor: alpha("#78716c", isDark ? 0.1 : 0.08),
                                        border: `1px solid ${alpha("#78716c", isDark ? 0.2 : 0.12)}`,
                                    }}
                                >
                                    <AccessTimeRoundedIcon sx={{ color: "#78716c", fontSize: 20 }} />
                                </Box>
                                <Typography variant="h6" sx={{ fontSize: 17 }}>Recent Activity</Typography>
                            </Box>

                            <List disablePadding>
                                {recentActivity.map((item, i) => (
                                    <React.Fragment key={i}>
                                        <ListItem disablePadding sx={{ py: 1.2, px: 0, display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                                            <ListItemIcon sx={{ minWidth: 36, mt: 0.3, "& .MuiSvgIcon-root": { fontSize: 20, color: item.color } }}>
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", fontSize: 13 }}>
                                                        {item.action}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontSize: 12.5, color: "text.secondary" }}>
                                                            {item.detail}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ fontSize: 11, color: alpha(theme.palette.text.secondary, 0.6) }}>
                                                            {item.time}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                        {i < recentActivity.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* ─── Bottom Row: Skills + Quick Actions ──────────────────────── */}
            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, lg: 7 }}>
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                                <Box
                                    sx={{
                                        width: 36, height: 36, borderRadius: 2,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        bgcolor: alpha("#0284c7", isDark ? 0.1 : 0.08),
                                        border: `1px solid ${alpha("#0284c7", isDark ? 0.2 : 0.12)}`,
                                    }}
                                >
                                    <StarRoundedIcon sx={{ color: "#0284c7", fontSize: 20 }} />
                                </Box>
                                <Typography variant="h6" sx={{ fontSize: 17 }}>Skill Overview</Typography>
                            </Box>

                            <Grid container spacing={1.5}>
                                {skills.map((skill) => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={skill.name}>
                                        <Box
                                            sx={{
                                                p: 1.5, borderRadius: 2,
                                                bgcolor: alpha(skill.color, isDark ? 0.04 : 0.03),
                                                border: `1px solid ${alpha(skill.color, isDark ? 0.08 : 0.06)}`,
                                                transition: "all 0.2s ease",
                                                "&:hover": {
                                                    bgcolor: alpha(skill.color, isDark ? 0.08 : 0.06),
                                                    borderColor: alpha(skill.color, isDark ? 0.15 : 0.1),
                                                },
                                            }}
                                        >
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", fontSize: 13 }}>
                                                    {skill.name}
                                                </Typography>
                                                <Chip
                                                    size="small"
                                                    label={skill.level >= 80 ? "Advanced" : skill.level >= 60 ? "Intermediate" : "Beginner"}
                                                    sx={{
                                                        height: 20, fontSize: 10, fontWeight: 600,
                                                        bgcolor: alpha(skill.color, 0.12),
                                                        color: skill.color,
                                                    }}
                                                />
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={skill.level}
                                                sx={{
                                                    height: 6, borderRadius: 3,
                                                    bgcolor: alpha(skill.color, 0.08),
                                                    "& .MuiLinearProgress-bar": { borderRadius: 3, bgcolor: skill.color },
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, lg: 5 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, height: "100%" }}>
                        {quickActions.map((action) => (
                            <Card
                                key={action.title}
                                sx={{
                                    flex: 1,
                                    cursor: "pointer",
                                    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                                    "&:hover": {
                                        transform: "translateY(-3px)",
                                        boxShadow: `0 8px 32px ${alpha(action.color, isDark ? 0.15 : 0.1)}`,
                                        borderColor: alpha(action.color, 0.2),
                                    },
                                }}
                            >
                                <CardContent
                                    sx={{
                                        p: 3,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2.5,
                                        height: "100%",
                                        background: `linear-gradient(135deg, ${alpha(action.color, isDark ? 0.08 : 0.04)}, transparent)`,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 52, height: 52, borderRadius: 3,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            bgcolor: alpha(action.color, isDark ? 0.12 : 0.08),
                                            border: `1px solid ${alpha(action.color, isDark ? 0.2 : 0.12)}`,
                                            color: action.color,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {action.icon}
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.3, fontSize: 15 }}>
                                            {action.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontSize: 13 }}>
                                            {action.description}
                                        </Typography>
                                    </Box>
                                    <ArrowForwardRoundedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
