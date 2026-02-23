"use client";

import * as React from "react";
import Box from "@mui/material/Box";

type RevealDirection = "up" | "down" | "left" | "right" | "scale" | "none";

interface ScrollRevealProps {
    children: React.ReactNode;
    direction?: RevealDirection;
    delay?: number;
    duration?: number;
    distance?: number;
    once?: boolean;
    threshold?: number;
}

export default function ScrollReveal({
    children,
    direction = "up",
    delay = 0,
    duration = 0.7,
    distance = 60,
    once = true,
    threshold = 0.15,
}: ScrollRevealProps) {
    const ref = React.useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) observer.unobserve(el);
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin: "0px 0px -40px 0px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [once, threshold]);

    const getTransform = () => {
        if (isVisible) return "translate3d(0, 0, 0) scale(1)";
        switch (direction) {
            case "up":
                return `translate3d(0, ${distance}px, 0) scale(0.97)`;
            case "down":
                return `translate3d(0, -${distance}px, 0) scale(0.97)`;
            case "left":
                return `translate3d(${distance}px, 0, 0) scale(0.97)`;
            case "right":
                return `translate3d(-${distance}px, 0, 0) scale(0.97)`;
            case "scale":
                return "translate3d(0, 20px, 0) scale(0.85)";
            default:
                return "translate3d(0, 0, 0) scale(1)";
        }
    };

    return (
        <Box
            ref={ref}
            sx={{
                opacity: isVisible ? 1 : 0,
                transform: getTransform(),
                transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
                willChange: "opacity, transform",
            }}
        >
            {children}
        </Box>
    );
}
