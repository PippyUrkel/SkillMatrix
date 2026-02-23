"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line } from "@react-three/drei";
import * as THREE from "three";

/* ─── Floating geometric shapes — reactive to typing ───────────────────── */

const FLASH_COLORS = ["#00ffff", "#ff00ff", "#00ff88", "#ff6600", "#facc15"];

function FloatingGeo({
    position,
    color,
    size,
    speed,
    geo,
    pulse,
}: {
    position: [number, number, number];
    color: string;
    size: number;
    speed: number;
    geo: "icosahedron" | "octahedron" | "dodecahedron";
    pulse: number;
}) {
    const meshRef = React.useRef<THREE.Mesh>(null);
    const matRef = React.useRef<THREE.MeshBasicMaterial>(null);
    const lastPulse = React.useRef(pulse);
    const bounceVelocity = React.useRef(0);
    const bounceOffset = React.useRef(0);
    const flashT = React.useRef(0); // 0 = no flash, 1 = full flash
    const baseColor = React.useMemo(() => new THREE.Color(color), [color]);
    const flashColor = React.useRef(new THREE.Color(color));

    useFrame(() => {
        if (!meshRef.current || !matRef.current) return;

        // Detect new pulse → kick bounce + color flash
        if (pulse !== lastPulse.current) {
            const direction = Math.random() > 0.5 ? 1 : -1;
            bounceVelocity.current = direction * (0.06 + Math.random() * 0.04);
            // Pick a random flash color
            flashColor.current.set(FLASH_COLORS[pulse % FLASH_COLORS.length]);
            flashT.current = 1;
            lastPulse.current = pulse;
        }

        // Spring physics — gentler
        bounceOffset.current += bounceVelocity.current;
        bounceVelocity.current *= 0.9;
        bounceOffset.current *= 0.92;

        meshRef.current.position.y = position[1] + bounceOffset.current;

        // Scale pop: brief expansion that decays
        const scalePop = 1 + flashT.current * 0.15;
        meshRef.current.scale.setScalar(scalePop);

        // Color flash: lerp from flash color back to base
        flashT.current *= 0.92;
        matRef.current.color.copy(flashColor.current).lerp(baseColor, 1 - flashT.current);
        matRef.current.opacity = 0.3 + flashT.current * 0.5;

        // Slow continuous rotation
        meshRef.current.rotation.x += 0.003 * speed;
        meshRef.current.rotation.y += 0.005 * speed;
        meshRef.current.rotation.z += 0.002 * speed;
    });

    const geoElement =
        geo === "icosahedron" ? (
            <icosahedronGeometry args={[size, 0]} />
        ) : geo === "octahedron" ? (
            <octahedronGeometry args={[size, 0]} />
        ) : (
            <dodecahedronGeometry args={[size, 0]} />
        );

    return (
        <Float speed={speed} rotationIntensity={0.3} floatIntensity={1.2}>
            <mesh ref={meshRef} position={position}>
                {geoElement}
                <meshBasicMaterial
                    ref={matRef}
                    color={color}
                    wireframe
                    transparent
                    opacity={0.35}
                />
            </mesh>
        </Float>
    );
}

/* ─── Particle field ───────────────────────────────────────────────────── */

function ParticleField({ count = 300 }: { count?: number }) {
    const mesh = React.useRef<THREE.Points>(null);
    const positions = React.useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }
        return pos;
    }, [count]);

    const geoRef = React.useRef<THREE.BufferGeometry>(null);

    React.useEffect(() => {
        if (geoRef.current) {
            geoRef.current.setAttribute(
                "position",
                new THREE.BufferAttribute(positions, 3)
            );
        }
    }, [positions]);

    useFrame((state) => {
        if (!mesh.current) return;
        mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
        mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry ref={geoRef} />
            <pointsMaterial
                color="#facc15"
                size={0.04}
                transparent
                opacity={0.5}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}

/* ─── Connection lines between nodes ───────────────────────────────────── */

function ConnectionLines() {
    const linesRef = React.useRef<THREE.Group>(null);
    const nodes = React.useMemo(() => {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i < 12; i++) {
            pts.push(
                new THREE.Vector3(
                    (Math.random() - 0.5) * 8,
                    (Math.random() - 0.5) * 6,
                    (Math.random() - 0.5) * 4
                )
            );
        }
        return pts;
    }, []);

    const lines = React.useMemo(() => {
        const result: [THREE.Vector3, THREE.Vector3][] = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (nodes[i].distanceTo(nodes[j]) < 5) {
                    result.push([nodes[i], nodes[j]]);
                }
            }
        }
        return result;
    }, [nodes]);

    useFrame((state) => {
        if (linesRef.current) {
            linesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
        }
    });

    return (
        <group ref={linesRef}>
            {nodes.map((pos, i) => (
                <Float key={i} speed={1 + Math.random()} floatIntensity={0.3}>
                    <mesh position={pos}>
                        <sphereGeometry args={[0.06, 16, 16]} />
                        <meshBasicMaterial color="#eab308" transparent opacity={0.8} />
                    </mesh>
                </Float>
            ))}
            {lines.map(([a, b], i) => (
                <Line
                    key={i}
                    points={[a.toArray(), b.toArray()]}
                    color="#eab308"
                    transparent
                    opacity={0.1}
                    lineWidth={1}
                />
            ))}
        </group>
    );
}

/* ─── Animated ring ────────────────────────────────────────────────────── */

function AnimatedRing({
    radius,
    color,
    speed,
}: {
    radius: number;
    color: string;
    speed: number;
}) {
    const ref = React.useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.x = state.clock.elapsedTime * speed;
            ref.current.rotation.z = state.clock.elapsedTime * speed * 0.5;
        }
    });

    return (
        <mesh ref={ref}>
            <torusGeometry args={[radius, 0.015, 16, 100]} />
            <meshBasicMaterial color={color} transparent opacity={0.15} />
        </mesh>
    );
}

/* ─── Main 3D Scene ────────────────────────────────────────────────────── */

export default function HeroScene({ pulse = 0 }: { pulse?: number }) {
    return (
        <Canvas
            camera={{ position: [0, 0, 8], fov: 50 }}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
            }}
            gl={{ antialias: true, alpha: true }}
        >
            <ambientLight intensity={0.3} />
            <pointLight position={[-3, 2, 4]} intensity={0.6} color="#facc15" />
            <pointLight position={[3, -2, 2]} intensity={0.3} color="#eab308" />

            {/* Floating wireframe geometries */}
            <FloatingGeo position={[-3.5, 1.5, -2]} color="#facc15" size={1.0} speed={1.5} geo="icosahedron" pulse={pulse} />
            <FloatingGeo position={[3, -1, -3]} color="#eab308" size={0.7} speed={2} geo="octahedron" pulse={pulse} />
            <FloatingGeo position={[0, 2.5, -4]} color="#fde047" size={0.5} speed={1} geo="dodecahedron" pulse={pulse} />
            <FloatingGeo position={[-2, -2, -1]} color="#fbbf24" size={0.4} speed={2.5} geo="icosahedron" pulse={pulse} />
            <FloatingGeo position={[4, 1, -5]} color="#f59e0b" size={0.8} speed={1.2} geo="octahedron" pulse={pulse} />

            <ParticleField count={250} />
            <ConnectionLines />

            {/* Animated rings */}
            <AnimatedRing radius={3} color="#facc15" speed={0.15} />
            <AnimatedRing radius={4.5} color="#eab308" speed={-0.1} />
            <AnimatedRing radius={2} color="#fbbf24" speed={0.2} />
        </Canvas>
    );
}
