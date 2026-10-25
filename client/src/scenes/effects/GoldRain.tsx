import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GoldRainProps {
  position?: [number, number, number];
  count?: number;
  radius?: number;
  height?: number;
}

export const GoldRain: React.FC<GoldRainProps> = ({
  position = [0, 0, 0],
  count = 90,
  radius = 1.1,
  height = 9.5,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const lightningLightRef = useRef<THREE.PointLight>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  // Initialize random trajectory and spin state for each golden coin
  const coins = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 2 * radius,
      y: Math.random() * height + 1.6,
      z: (Math.random() - 0.5) * 2 * radius,
      speed: 2.5 + Math.random() * 2.2,
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      rotSpeedX: 3 + Math.random() * 5,
      rotSpeedY: 2 + Math.random() * 4,
      scale: 0.12 + Math.random() * 0.08,
    }));
  }, [count, radius, height]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    // 1. Update falling coin positions and tumbling rotations
    if (meshRef.current) {
      coins.forEach((coin, i) => {
        coin.y -= coin.speed * delta;
        if (coin.y < 1.7) {
          coin.y = height + 1.6 + Math.random() * 0.8;
          coin.x = (Math.random() - 0.5) * 2 * radius;
          coin.z = (Math.random() - 0.5) * 2 * radius;
        }

        coin.rotX += coin.rotSpeedX * delta;
        coin.rotY += coin.rotSpeedY * delta;

        dummy.position.set(coin.x, coin.y, coin.z);
        dummy.rotation.set(coin.rotX, coin.rotY, 0);
        dummy.scale.set(coin.scale, coin.scale * 0.25, coin.scale);
        dummy.updateMatrix();

        meshRef.current?.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }

    // 2. Divine lightning / gold light pulses and shimmering flashes
    if (lightningLightRef.current) {
      // Periodic divine shimmer with occasional bright lightning strike flare
      const flicker = Math.sin(t * 12) * 0.4 + Math.cos(t * 27) * 0.2;
      const strikeFlash = Math.random() > 0.94 ? 3.5 : 0;
      lightningLightRef.current.intensity = 2.4 + flicker + strikeFlash;
    }

    // 3. Subtle breathing opacity on vertical light beam
    if (beamRef.current) {
      const mat = beamRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = 0.12 + Math.sin(t * 3) * 0.04;
      }
    }
  });

  return (
    <group position={position}>
      {/* Golden Cylindrical Coins InstancedMesh */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.15, 12]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#d97706"
          emissiveIntensity={0.35}
          metalness={0.95}
          roughness={0.15}
        />
      </instancedMesh>

      {/* Heavenly Vertical Light Column streaming from above */}
      <mesh ref={beamRef} position={[0, height / 2 + 1.5, 0]}>
        <cylinderGeometry args={[radius * 0.6, radius * 1.35, height, 24, 1, true]} />
        <meshBasicMaterial
          color="#fef08a"
          transparent
          opacity={0.14}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Core Divine Light Beam */}
      <mesh position={[0, height / 2 + 1.5, 0]}>
        <cylinderGeometry args={[radius * 0.25, radius * 0.65, height, 16, 1, true]} />
        <meshBasicMaterial
          color="#fffbeb"
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Golden Lightning Spark Point Light */}
      <pointLight
        ref={lightningLightRef}
        color="#fbbf24"
        intensity={2.8}
        distance={7.5}
        position={[0, 2.5, 0]}
      />

      {/* Golden Shimmer Ring at Base */}
      <mesh position={[0, 1.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.5, radius * 1.1, 24]} />
        <meshBasicMaterial
          color="#fbbf24"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};
