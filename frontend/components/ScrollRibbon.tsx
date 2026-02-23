"use client";

import * as React from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Halftone shader material ─────────────────────────────────────────── */

class HalftoneMaterial extends THREE.ShaderMaterial {
    constructor(color: string, opacity: number) {
        super({
            transparent: true,
            side: THREE.DoubleSide,
            uniforms: {
                uColor: { value: new THREE.Color(color) },
                uOpacity: { value: opacity },
                uScale: { value: 120.0 },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 uColor;
                uniform float uOpacity;
                uniform float uScale;
                varying vec2 vUv;
                void main() {
                    vec2 grid = fract(vUv * uScale);
                    float d = distance(grid, vec2(0.5));
                    float dot = smoothstep(0.35, 0.25, d);
                    gl_FragColor = vec4(uColor, uOpacity * dot);
                }
            `,
        });
    }
}

extend({ HalftoneMaterial });

/* ─── Scroll-reactive ribbon — wild sweeping path ──────────────────────── */

function Ribbon() {
    const meshRef = React.useRef<THREE.Mesh>(null);
    const matRef = React.useRef<THREE.MeshBasicMaterial>(null);
    const scrollProgress = React.useRef(0);

    const { geometry, totalVertices } = React.useMemo(() => {
        const points: THREE.Vector3[] = [];
        const segments = 300;
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            // Wild sweeping path — wide X swings, varying Z depth
            const x =
                Math.sin(t * Math.PI * 4) * 6 +
                Math.cos(t * Math.PI * 7) * 2;
            const y = 10 - t * 22;
            const z =
                Math.cos(t * Math.PI * 3) * 3 +
                Math.sin(t * Math.PI * 5.5) * 1.5 - 6;
            points.push(new THREE.Vector3(x, y, z));
        }

        const curve = new THREE.CatmullRomCurve3(points);
        const geo = new THREE.TubeGeometry(curve, 400, 0.07, 8, false);
        const total = geo.index ? geo.index.count : geo.attributes.position.count;

        return { geometry: geo, totalVertices: total };
    }, []);

    React.useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            scrollProgress.current = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useFrame(() => {
        if (!meshRef.current || !meshRef.current.geometry) return;

        const progress = scrollProgress.current;
        const drawCount = Math.floor(progress * totalVertices);
        meshRef.current.geometry.setDrawRange(0, drawCount);

        meshRef.current.rotation.y = Math.sin(Date.now() * 0.0003) * 0.03;

        if (matRef.current) {
            (matRef.current as any).uniforms.uOpacity.value = Math.min(progress * 3, 0.4);
        }
    });

    return (
        <mesh ref={meshRef} geometry={geometry}>
            {/* @ts-ignore */}
            <halftoneMaterial ref={matRef} args={["#991b1b", 0]} />
        </mesh>
    );
}

/* ─── Secondary ribbon — different wild path ───────────────────────────── */

function SecondaryRibbon() {
    const meshRef = React.useRef<THREE.Mesh>(null);
    const matRef = React.useRef<THREE.MeshBasicMaterial>(null);
    const scrollProgress = React.useRef(0);

    const { geometry, totalVertices } = React.useMemo(() => {
        const points: THREE.Vector3[] = [];
        const segments = 300;
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            // Opposite sweep pattern from primary ribbon
            const x =
                Math.cos(t * Math.PI * 3.5) * 7 +
                Math.sin(t * Math.PI * 6) * 1.5;
            const y = 10 - t * 22;
            const z =
                Math.sin(t * Math.PI * 4) * 2 +
                Math.cos(t * Math.PI * 2) * 2 - 7;
            points.push(new THREE.Vector3(x, y, z));
        }

        const curve = new THREE.CatmullRomCurve3(points);
        const geo = new THREE.TubeGeometry(curve, 400, 0.035, 6, false);
        const total = geo.index ? geo.index.count : geo.attributes.position.count;

        return { geometry: geo, totalVertices: total };
    }, []);

    React.useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            scrollProgress.current = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useFrame(() => {
        if (!meshRef.current || !meshRef.current.geometry) return;

        const progress = Math.max(0, scrollProgress.current - 0.05) / 0.95;
        const drawCount = Math.floor(progress * totalVertices);
        meshRef.current.geometry.setDrawRange(0, drawCount);

        meshRef.current.rotation.y = Math.sin(Date.now() * 0.0004) * 0.04;

        if (matRef.current) {
            (matRef.current as any).uniforms.uOpacity.value = Math.min(progress * 3, 0.3);
        }
    });

    return (
        <mesh ref={meshRef} geometry={geometry}>
            {/* @ts-ignore */}
            <halftoneMaterial ref={matRef} args={["#b91c1c", 0]} />
        </mesh>
    );
}

/* ─── Floating particles that appear on scroll ─────────────────────────── */

function ScrollParticles({ count = 80 }: { count?: number }) {
    const meshRef = React.useRef<THREE.Points>(null);
    const matRef = React.useRef<THREE.PointsMaterial>(null);
    const scrollProgress = React.useRef(0);

    const positions = React.useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 16;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 24;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 5;
        }
        return pos;
    }, [count]);

    const geoRef = React.useRef<THREE.BufferGeometry>(null);

    React.useEffect(() => {
        if (geoRef.current) {
            geoRef.current.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        }
    }, [positions]);

    React.useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            scrollProgress.current = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useFrame((state) => {
        if (!meshRef.current || !matRef.current) return;
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.01;
        matRef.current.opacity = Math.min(scrollProgress.current * 2, 0.35);
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry ref={geoRef} />
            <pointsMaterial
                ref={matRef}
                color="#dca526ff"
                size={0.06}
                transparent
                opacity={0}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}

/* ─── Main scroll scene — z-index: -1 to go behind everything ─────────── */

export default function ScrollRibbon() {
    return (
        <Canvas
            camera={{ position: [0, 0, 8], fov: 50 }}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 1,
            }}
            gl={{ antialias: true, alpha: true }}
        >
            <ambientLight intensity={0.2} />
            <Ribbon />
            <SecondaryRibbon />
            <ScrollParticles />
        </Canvas>
    );
}
