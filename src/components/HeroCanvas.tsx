import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { lerp } from '@/lib/utils';

const VIOLET = '#7C5CFF';
const TEAL = '#2DD4BF';
const AMBER = '#F5A524';

/** Titik-titik acak di dalam cangkang bola — dibuat manual supaya tanpa dependensi tambahan. */
function useShellPoints(count: number, inner: number, outer: number) {
  return useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const r = inner + Math.random() * (outer - inner);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, [count, inner, outer]);
}

function ParticleField({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useShellPoints(count, 1.9, 3.4);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.035;
    ref.current.rotation.x += delta * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        sizeAttenuation
        color={new THREE.Color('#E6EDF3')}
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Bola terdistorsi + cangkang wireframe, keduanya reaktif ke gerak mouse. */
function Blob({ quality }: { quality: 'low' | 'high' }) {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const target = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    // Pointer sudah ternormalisasi -1..1 oleh R3F.
    target.current.x = state.pointer.y * 0.32;
    target.current.y = state.pointer.x * 0.5;

    g.rotation.x = lerp(g.rotation.x, target.current.x, 0.045);
    g.rotation.y = lerp(g.rotation.y, target.current.y + state.clock.elapsedTime * 0.08, 0.045);

    // Sedikit melayang mengikuti waktu.
    g.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.09;

    if (shell.current) {
      shell.current.rotation.z -= delta * 0.12;
      shell.current.rotation.x += delta * 0.06;
    }
  });

  return (
    <group ref={group}>
      {/* detail 16 ≈ 5.120 segitiga — sudah mulus untuk blob, sementara
          detail 48 berarti ~46.000 segitiga dan memberatkan main thread. */}
      <Icosahedron args={[1.28, quality === 'high' ? 16 : 8]}>
        {/* Warna aksen violet apa adanya; key light dibuat netral supaya
            violet-nya terbaca violet, bukan biru. */}
        <MeshDistortMaterial
          color={VIOLET}
          emissive={new THREE.Color('#2A1A5E')}
          emissiveIntensity={0.45}
          roughness={0.45}
          metalness={0.25}
          distort={0.42}
          speed={1.4}
        />
      </Icosahedron>

      <Icosahedron ref={shell} args={[1.85, 2]}>
        <meshBasicMaterial color={TEAL} wireframe transparent opacity={0.16} />
      </Icosahedron>

      <Torus args={[2.5, 0.006, 8, 96]} rotation={[Math.PI / 2.6, 0.4, 0]}>
        <meshBasicMaterial color={AMBER} transparent opacity={0.35} />
      </Torus>
    </group>
  );
}

/** Cahaya yang mengikuti kursor supaya highlight-nya terasa hidup. */
function PointerLight() {
  const ref = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.x = lerp(ref.current.position.x, state.pointer.x * 5, 0.06);
    ref.current.position.y = lerp(ref.current.position.y, state.pointer.y * 4, 0.06);
  });

  return <pointLight ref={ref} position={[3, 2, 4]} intensity={14} color={TEAL} distance={12} decay={2} />;
}

export interface HeroCanvasProps {
  /** 'low' dipakai di layar kecil: geometri & partikel dikurangi. */
  quality?: 'low' | 'high';
}

export default function HeroCanvas({ quality = 'high' }: HeroCanvasProps) {
  const dpr: [number, number] = quality === 'high' ? [1, 1.8] : [1, 1.25];

  return (
    <Canvas
      // `flat` = tanpa tone mapping ACES. Tanpa ini, violet #7C5CFF
      // ter-desaturasi jadi biru dan meleset dari palet.
      flat
      dpr={dpr}
      camera={{ position: [0, 0, 5.4], fov: 42 }}
      gl={{ antialias: quality === 'high', alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
    >
      {/* Tanpa background solid: alpha dibiarkan tembus supaya grid di belakang tetap terlihat. */}
      <fog attach="fog" args={['#08090D', 6, 12.5]} />

      <ambientLight intensity={0.7} />
      <directionalLight position={[-4, 4, 3]} intensity={1.3} color={'#E6EDF3'} />
      <PointerLight />

      <Blob quality={quality} />
      <ParticleField count={quality === 'high' ? 850 : 320} />
    </Canvas>
  );
}
