"use client";

import { memo, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 750 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  // generate positions ONCE — regenerating on re-render makes spots jump around
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, [count]);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.014;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.06;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#9d8bff"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

function WireSphere() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.03;
    ref.current.rotation.x += delta * 0.01;
  });
  return (
    <mesh ref={ref} position={[2.4, 0.4, -3]}>
      <icosahedronGeometry args={[3.6, 1]} />
      <meshBasicMaterial color="#7c5cff" wireframe transparent opacity={0.09} />
    </mesh>
  );
}

function HeroScene() {
  return (
    <div className="absolute inset-0" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Particles />
        <WireSphere />
      </Canvas>
    </div>
  );
}

export default memo(HeroScene);
