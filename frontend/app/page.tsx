"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { alpha } from "@mui/material/styles";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import MouseRoundedIcon from "@mui/icons-material/MouseRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import MilitaryTechRoundedIcon from "@mui/icons-material/MilitaryTechRounded";

const HeroScene = dynamic(() => import("@/components/HeroScene"), { ssr: false });
import ScrollReveal from "@/components/ScrollReveal";

const ScrollRibbon = dynamic(() => import("@/components/ScrollRibbon"), { ssr: false });

// ─── Trophy data ────────────────────────────────────────────────────────────

const trophies = [
  {
    icon: <EmojiEventsRoundedIcon sx={{ fontSize: 44 }} />,
    label: "Top Performer",
    detail: "Ranked #1 in React Mastery",
    color: "#ef4444",
    glowColor: "rgba(239,68,68,0.2)",
    delay: "0.3s",
  },
  {
    icon: <WorkspacePremiumRoundedIcon sx={{ fontSize: 44 }} />,
    label: "Skill Champion",
    detail: "15 skills at Advanced level",
    color: "#dc2626",
    glowColor: "rgba(220,38,38,0.2)",
    delay: "0.5s",
  },
  {
    icon: <MilitaryTechRoundedIcon sx={{ fontSize: 44 }} />,
    label: "Quiz Master",
    detail: "100% on 12 consecutive quizzes",
    color: "#b91c1c",
    glowColor: "rgba(185,28,28,0.2)",
    delay: "0.7s",
  },
];

// ─── Feature cards ──────────────────────────────────────────────────────────

const abilities = [
  {
    icon: <AutoGraphRoundedIcon sx={{ fontSize: 36 }} />,
    title: "Identify",
    subtitle: "your skill gaps",
    description: "AI-driven analysis maps your current abilities against industry standards in real time.",
    color: "#dc2626",
  },
  {
    icon: <SchoolRoundedIcon sx={{ fontSize: 36 }} />,
    title: "Learn",
    subtitle: "what matters",
    description: "Personalized paths cut through noise — only the courses that actually close your gaps.",
    color: "#ef4444",
  },
  {
    icon: <QuizRoundedIcon sx={{ fontSize: 36 }} />,
    title: "Prove",
    subtitle: "your growth",
    description: "Adaptive quizzes that evolve with you, validating real skill growth — not memorization.",
    color: "#f87171",
  },
  {
    icon: <TrendingUpRoundedIcon sx={{ fontSize: 36 }} />,
    title: "Track",
    subtitle: "everything",
    description: "Visual analytics dashboard shows exactly how far you've come and what's next.",
    color: "#b91c1c",
  },
];

// ─── Home Page ──────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();
  const [checking, setChecking] = React.useState(true);
  const [hoveredCard, setHoveredCard] = React.useState<number | null>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/dashboard");
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  if (checking) {
    return (
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#0c0a09",
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            border: "3px solid #dc2626",
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

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0c0a09", color: "#e7e5e4", overflow: "hidden", position: "relative" }}>
      {/* Scroll-reactive 3D ribbon background */}
      <ScrollRibbon />
      {/* ═══════════════════════════════════════════════════════════════════
          HERO SECTION — Left text + Right trophies
          ═══════════════════════════════════════════════════════════════════ */}
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 3D Canvas Background */}
        <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <HeroScene />
        </Box>

        {/* Dark gradient overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(12,10,9,0.2) 0%, rgba(12,10,9,0.65) 60%, rgba(12,10,9,0.95) 100%)",
          }}
        />

        {/* Navbar */}
        <Box
          component="nav"
          sx={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 3, md: 6 },
            py: 2.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
            <Typography sx={{ fontWeight: 700, fontSize: 20, letterSpacing: "-0.02em" }}>
              Skill<Box component="span" sx={{ color: "#dc2626" }}>Matrix</Box>
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              variant="text"
              onClick={() => router.push("/login")}
              sx={{
                color: "#a8a29e",
                fontWeight: 500,
                "&:hover": { color: "#e7e5e4", bgcolor: "rgba(255,255,255,0.04)" },
              }}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              onClick={() => router.push("/login")}
              sx={{
                bgcolor: "#dc2626",
                "&:hover": { bgcolor: "#b91c1c" },
                boxShadow: "0 0 24px rgba(220,38,38,0.3)",
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>

        {/* Hero Content — split layout */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            flex: 1,
            display: "flex",
            alignItems: "center",
            px: { xs: 3, md: 6, lg: 10 },
            pb: 8,
          }}
        >
          <Grid container spacing={4} alignItems="center">
            {/* ── Left: Text ──────────────────────────────────────────── */}
            <Grid size={{ xs: 12, md: 6 }}>
              {/* Pill badge */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 0.6,
                  borderRadius: 10,
                  bgcolor: "rgba(220,38,38,0.08)",
                  border: "1px solid rgba(220,38,38,0.2)",
                  mb: 3.5,
                  animation: "fadeInDown 0.8s ease-out",
                  "@keyframes fadeInDown": {
                    from: { opacity: 0, transform: "translateY(-16px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "#dc2626",
                    animation: "pulse 2s ease-in-out infinite",
                    "@keyframes pulse": {
                      "0%, 100%": { opacity: 1, transform: "scale(1)" },
                      "50%": { opacity: 0.5, transform: "scale(1.5)" },
                    },
                  }}
                />
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#dc2626",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  AI-Powered Skill Intelligence
                </Typography>
              </Box>

              {/* Headline */}
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: 40, sm: 52, md: 64, lg: 76 },
                  lineHeight: 1.05,
                  letterSpacing: "-0.04em",
                  mb: 2.5,
                  animation: "fadeInUp 0.8s ease-out 0.2s both",
                  "@keyframes fadeInUp": {
                    from: { opacity: 0, transform: "translateY(24px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                Map your skills.
                <br />
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Master what matters.
                </Box>
              </Typography>

              {/* Sub-headline */}
              <Typography
                sx={{
                  fontSize: { xs: 15, md: 18 },
                  fontWeight: 400,
                  color: "#a8a29e",
                  lineHeight: 1.7,
                  maxWidth: 500,
                  mb: 4,
                  animation: "fadeInUp 0.8s ease-out 0.4s both",
                }}
              >
                SkillMatrix uses intelligent analysis to find your gaps,
                build your path, and track your growth — so you spend time
                learning, not guessing.
              </Typography>

              {/* CTA buttons */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  animation: "fadeInUp 0.8s ease-out 0.6s both",
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardRoundedIcon />}
                  onClick={() => router.push("/login")}
                  sx={{
                    px: 4.5,
                    py: 1.8,
                    fontSize: 16,
                    fontWeight: 700,
                    bgcolor: "#dc2626",
                    borderRadius: 3,
                    "&:hover": {
                      bgcolor: "#b91c1c",
                      transform: "translateY(-2px)",
                    },
                    boxShadow: "0 0 40px rgba(220,38,38,0.35), 0 8px 32px rgba(0,0,0,0.3)",
                    transition: "all 0.3s ease",
                  }}
                >
                  Start Your Analysis
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  sx={{
                    px: 4.5,
                    py: 1.8,
                    fontSize: 16,
                    fontWeight: 600,
                    borderRadius: 3,
                    borderColor: "rgba(255,255,255,0.12)",
                    color: "#a8a29e",
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.25)",
                      color: "#e7e5e4",
                      transform: "translateY(-2px)",
                      bgcolor: "rgba(255,255,255,0.03)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  See How It Works
                </Button>
              </Box>
            </Grid>

            {/* ── Right: Video + Trophies ───────────────────────────── */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  pl: { md: 1 },
                  pt: { xs: 4, md: 0 },
                }}
              >
                {/* YouTube Video Embed */}
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    paddingTop: "56.25%", // 16:9 aspect ratio
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.4), 0 0 60px rgba(220,38,38,0.08)",
                    animation: "fadeInRight 0.6s ease-out 0.2s both",
                    "@keyframes fadeInRight": {
                      from: { opacity: 0, transform: "translateX(40px)" },
                      to: { opacity: 1, transform: "translateX(0)" },
                    },
                  }}
                >
                  <Box
                    component="iframe"
                    src="https://www.youtube.com/embed/75d_29QWELk?autoplay=1&mute=1&loop=1&playlist=75d_29QWELk&controls=0&showinfo=0&rel=0&modestbranding=1"
                    title="SkillMatrix Demo"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                  />
                </Box>

                {/* Trophies row — compact badges below the video */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    flexWrap: "wrap",
                    animation: "fadeInRight 0.6s ease-out 0.5s both",
                  }}
                >
                  {trophies.map((trophy) => (
                    <Box
                      key={trophy.label}
                      sx={{
                        flex: 1,
                        minWidth: 120,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        px: 2,
                        py: 1.5,
                        borderRadius: 3,
                        bgcolor: "rgba(28,25,23,0.6)",
                        backdropFilter: "blur(20px)",
                        border: `1px solid ${alpha(trophy.color, 0.12)}`,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: alpha(trophy.color, 0.3),
                          boxShadow: `0 4px 20px ${trophy.glowColor}`,
                          bgcolor: alpha(trophy.color, 0.04),
                        },
                      }}
                    >
                      <Box sx={{ color: trophy.color, display: "flex", flexShrink: 0 }}>
                        {React.cloneElement(trophy.icon, { sx: { fontSize: 24 } })}
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: 12, color: "#e7e5e4", lineHeight: 1.3 }}>
                          {trophy.label}
                        </Typography>
                        <Typography sx={{ fontSize: 10, color: "#78716c", lineHeight: 1.3 }}>
                          {trophy.detail}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Scroll indicator */}
        <Box
          sx={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
            animation: "bounce 2s ease-in-out infinite",
            "@keyframes bounce": {
              "0%, 100%": { transform: "translateX(-50%) translateY(0)" },
              "50%": { transform: "translateX(-50%) translateY(8px)" },
            },
          }}
        >
          <MouseRoundedIcon sx={{ fontSize: 20, color: "#78716c" }} />
          <KeyboardArrowDownRoundedIcon sx={{ fontSize: 18, color: "#78716c" }} />
        </Box>
      </Box>

      {/* ═══════════════════════════════════════════════════════════════════
          HOW IT WORKS — Interactive cards
          ═══════════════════════════════════════════════════════════════════ */}
      <Box
        id="how-it-works"
        sx={{
          position: "relative",
          zIndex: 2,
          py: { xs: 10, md: 16 },
          px: { xs: 3, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <ScrollReveal direction="up" duration={0.8}>
            <Box sx={{ textAlign: "center", mb: { xs: 6, md: 10 } }}>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#dc2626",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  mb: 2,
                }}
              >
                How it works
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: 30, md: 44 },
                  letterSpacing: "-0.03em",
                  lineHeight: 1.15,
                  mb: 2,
                }}
              >
                Four steps to{" "}
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(135deg, #dc2626, #ef4444)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  mastery
                </Box>
              </Typography>
              <Typography sx={{ color: "#78716c", fontSize: 16, maxWidth: 480, mx: "auto" }}>
                No fluff. No busy-work. Just what you need to grow.
              </Typography>
            </Box>
          </ScrollReveal>

          <Grid container spacing={3}>
            {abilities.map((item, i) => {
              const isHovered = hoveredCard === i;
              return (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.title}>
                  <ScrollReveal direction={i % 2 === 0 ? "left" : "right"} delay={i * 0.12} distance={50}>
                    <Box
                      onMouseEnter={() => setHoveredCard(i)}
                      onMouseLeave={() => setHoveredCard(null)}
                      sx={{
                        position: "relative",
                        p: 4,
                        borderRadius: 5,
                        border: "1px solid",
                        borderColor: isHovered
                          ? alpha(item.color, 0.3)
                          : "rgba(255,255,255,0.06)",
                        bgcolor: isHovered
                          ? alpha(item.color, 0.04)
                          : "rgba(28,25,23,0.5)",
                        backdropFilter: "blur(16px)",
                        cursor: "pointer",
                        transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                        transform: isHovered ? "translateY(-8px) scale(1.02)" : "none",
                        boxShadow: isHovered
                          ? `0 20px 60px ${alpha(item.color, 0.2)}, 0 0 0 1px ${alpha(item.color, 0.1)}`
                          : "none",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 2,
                          background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`,
                          opacity: isHovered ? 1 : 0,
                          transition: "opacity 0.4s ease",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 64,
                          fontWeight: 900,
                          lineHeight: 1,
                          color: alpha(item.color, isHovered ? 0.15 : 0.06),
                          position: "absolute",
                          top: 12,
                          right: 16,
                          transition: "color 0.4s ease",
                          userSelect: "none",
                        }}
                      >
                        0{i + 1}
                      </Typography>

                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 3,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: alpha(item.color, isHovered ? 0.15 : 0.08),
                          border: `1px solid ${alpha(item.color, isHovered ? 0.3 : 0.15)}`,
                          color: item.color,
                          mb: 3,
                          transition: "all 0.4s ease",
                          transform: isHovered ? "scale(1.1)" : "none",
                        }}
                      >
                        {item.icon}
                      </Box>

                      <Typography variant="h5" sx={{ fontWeight: 800, fontSize: 22, mb: 0.5, color: "#e7e5e4" }}>
                        {item.title}
                      </Typography>
                      <Typography sx={{ fontSize: 15, fontWeight: 500, color: item.color, mb: 1.5 }}>
                        {item.subtitle}
                      </Typography>
                      <Typography sx={{ fontSize: 14, color: "#78716c", lineHeight: 1.7 }}>
                        {item.description}
                      </Typography>
                    </Box>
                  </ScrollReveal>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════════════════════════════
          STATS STRIP — scroll-revealed counters
          ═══════════════════════════════════════════════════════════════════ */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          py: { xs: 6, md: 10 },
          borderTop: "1px solid rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <Container maxWidth="md">
          <Grid container spacing={4}>
            {[
              { value: "10K+", label: "Active Learners", color: "#dc2626" },
              { value: "500+", label: "Courses Available", color: "#ef4444" },
              { value: "95%", label: "Success Rate", color: "#f87171" },
              { value: "50+", label: "Skill Categories", color: "#b91c1c" },
            ].map((stat, i) => (
              <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
                <ScrollReveal direction="scale" delay={i * 0.1} duration={0.6}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      sx={{
                        fontWeight: 900,
                        fontSize: { xs: 32, md: 44 },
                        letterSpacing: "-0.03em",
                        color: stat.color,
                        lineHeight: 1,
                        mb: 0.5,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: "#78716c", fontWeight: 500 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </ScrollReveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════════════════════════════
          BOTTOM CTA — enhanced with animated gradient border
          ═══════════════════════════════════════════════════════════════════ */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          py: { xs: 12, md: 18 },
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(220,38,38,0.1), transparent 60%)",
            pointerEvents: "none",
          }}
        />

        <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
          <ScrollReveal direction="scale" duration={0.8}>
            <Box
              sx={{
                position: "relative",
                p: { xs: 5, md: 7 },
                borderRadius: 5,
                bgcolor: "rgba(28,25,23,0.4)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.06)",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: -1,
                  borderRadius: 5,
                  padding: 1,
                  background: "linear-gradient(135deg, rgba(220,38,38,0.3), transparent 40%, transparent 60%, rgba(250,204,21,0.2))",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  pointerEvents: "none",
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#dc2626",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  mb: 2,
                }}
              >
                Get Started Today
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: 26, md: 38 },
                  letterSpacing: "-0.03em",
                  lineHeight: 1.2,
                  mb: 2,
                }}
              >
                Ready to see where you stand?
              </Typography>
              <Typography sx={{ color: "#78716c", fontSize: 15, mb: 4, maxWidth: 380, mx: "auto" }}>
                It takes 5 minutes to run your first analysis. No credit card — no strings.
              </Typography>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={() => router.push("/login")}
                sx={{
                  px: 5,
                  py: 1.8,
                  fontSize: 16,
                  fontWeight: 700,
                  bgcolor: "#dc2626",
                  borderRadius: 3,
                  "&:hover": {
                    bgcolor: "#b91c1c",
                    transform: "translateY(-2px)",
                  },
                  boxShadow: "0 0 40px rgba(220,38,38,0.3), 0 8px 24px rgba(0,0,0,0.3)",
                  transition: "all 0.3s ease",
                }}
              >
                Get Started Free
              </Button>
            </Box>
          </ScrollReveal>
        </Container>
      </Box>

      {/* Footer */}
      <ScrollReveal direction="up" delay={0.1} distance={30}>
        <Box
          component="footer"
          sx={{
            py: 4,
            textAlign: "center",
            borderTop: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
            <BarChartRoundedIcon sx={{ color: "#dc2626", fontSize: 18 }} />
            <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
              Skill<Box component="span" sx={{ color: "#dc2626" }}>Matrix</Box>
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 12, color: "#57534e" }}>
            © {new Date().getFullYear()} SkillMatrix. Built for learners, by learners.
          </Typography>
        </Box>
      </ScrollReveal>
    </Box>
  );
}
