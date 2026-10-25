import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

interface SanctuaryProps {
  onOpenDonation: () => void;
  onOpenConfession: () => void;
  isConfessionBusy?: boolean;
  playerPos?: [number, number, number];
}

export const Sanctuary: React.FC<SanctuaryProps> = ({
  onOpenDonation,
  onOpenConfession,
  isConfessionBusy = false,
}) => {
  const donationGlowRef = useRef<THREE.PointLight>(null);
  const candleRef1 = useRef<THREE.PointLight>(null);
  const candleRef2 = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Subtle flickering candlelight
    if (candleRef1.current) {
      candleRef1.current.intensity = 1.8 + Math.sin(t * 10) * 0.2 + Math.cos(t * 23) * 0.15;
    }
    if (candleRef2.current) {
      candleRef2.current.intensity = 1.8 + Math.cos(t * 12) * 0.2 + Math.sin(t * 19) * 0.15;
    }
    if (donationGlowRef.current) {
      donationGlowRef.current.intensity = 2.0 + Math.sin(t * 3) * 0.5;
    }
  });

  return (
    <group>
      {/* Ambient and Environmental Lighting */}
      <ambientLight intensity={0.6} color="#c7d2fe" />
      <directionalLight
        position={[10, 20, 15]}
        intensity={1.2}
        color="#fef3c7"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Main Floor (Stone & Marble tiles) */}
      <mesh position={[0, -0.05, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 40]} />
        <meshStandardMaterial color="#1a1c26" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Red Carpet Center Aisle */}
      <mesh position={[0, 0.01, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 38]} />
        <meshStandardMaterial color="#881337" roughness={0.7} />
      </mesh>

      {/* Outer Walls */}
      {/* Front Altar Wall (North) */}
      <mesh position={[0, 7, -20]} receiveShadow>
        <boxGeometry args={[22, 14, 1]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      {/* Back Entrance Wall (South) */}
      <mesh position={[0, 7, 20]} receiveShadow>
        <boxGeometry args={[22, 14, 1]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      {/* Left Wall (West) */}
      <mesh position={[-11, 7, 0]} receiveShadow>
        <boxGeometry args={[1, 14, 40]} />
        <meshStandardMaterial color="#111827" roughness={0.8} />
      </mesh>
      {/* Right Wall (East) */}
      <mesh position={[11, 7, 0]} receiveShadow>
        <boxGeometry args={[1, 14, 40]} />
        <meshStandardMaterial color="#111827" roughness={0.8} />
      </mesh>

      {/* High Vaulted Ceiling */}
      <mesh position={[0, 14, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 40]} />
        <meshStandardMaterial color="#0b0f19" roughness={0.9} />
      </mesh>

      {/* Gothic Pillars flanking Aisle */}
      {[-8, -4, 0, 4, 8, 12].map((zPos, idx) => (
        <group key={`pillars-${idx}`}>
          {/* Left Pillar */}
          <mesh position={[-6, 7, zPos]} castShadow receiveShadow>
            <cylinderGeometry args={[0.45, 0.55, 14, 12]} />
            <meshStandardMaterial color="#334155" roughness={0.5} />
          </mesh>
          {/* Right Pillar */}
          <mesh position={[6, 7, zPos]} castShadow receiveShadow>
            <cylinderGeometry args={[0.45, 0.55, 14, 12]} />
            <meshStandardMaterial color="#334155" roughness={0.5} />
          </mesh>
          {/* Cross Beam */}
          <mesh position={[0, 13.5, zPos]}>
            <boxGeometry args={[12.5, 0.5, 0.5]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      ))}

      {/* Front Altar Platform (z = -16 to -19) */}
      <mesh position={[0, 0.3, -16.5]} receiveShadow>
        <boxGeometry args={[16, 0.6, 6]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.7, -17.5]} receiveShadow>
        <boxGeometry args={[12, 0.4, 4]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
      </mesh>

      {/* Altar Table */}
      <mesh position={[0, 1.6, -17]} castShadow receiveShadow>
        <boxGeometry args={[5, 1.4, 1.8]} />
        <meshStandardMaterial color="#451a03" roughness={0.4} />
      </mesh>
      {/* Altar White Cloth */}
      <mesh position={[0, 2.32, -17]}>
        <boxGeometry args={[5.2, 0.05, 1.9]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>

      {/* Glowing Golden Cross on Altar Wall */}
      <group position={[0, 7.5, -19.4]}>
        {/* Vertical Beam */}
        <mesh castShadow>
          <boxGeometry args={[0.6, 5.5, 0.2]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.6} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Horizontal Beam */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[3.2, 0.6, 0.2]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.6} metalness={0.8} roughness={0.2} />
        </mesh>
        <pointLight color="#f59e0b" intensity={3.5} distance={12} />
      </group>

      {/* Stained Glass Window Backlight */}
      <group position={[0, 8.5, -19.48]}>
        <mesh>
          <circleGeometry args={[2.8, 32]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <pointLight color="#60a5fa" intensity={2} distance={15} position={[0, 0, 1]} />
      </group>

      {/* Altar Candles */}
      <group position={[-1.8, 2.4, -17]}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 12]} />
          <meshStandardMaterial color="#fef08a" />
        </mesh>
        <pointLight ref={candleRef1} color="#f59e0b" intensity={2.0} distance={4} position={[0, 0.7, 0]} />
      </group>
      <group position={[1.8, 2.4, -17]}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 12]} />
          <meshStandardMaterial color="#fef08a" />
        </mesh>
        <pointLight ref={candleRef2} color="#f59e0b" intensity={2.0} distance={4} position={[0, 0.7, 0]} />
      </group>

      {/* Church Congregation Pews (Benches) */}
      {[-8, -5, -2, 1, 4, 7].map((z, rowIdx) => (
        <group key={`pew-row-${rowIdx}`}>
          {/* Left Pew */}
          <group position={[-4.5, 0.45, z]}>
            {/* Seat */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[4.2, 0.15, 0.8]} />
              <meshStandardMaterial color="#3b1d11" roughness={0.6} />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, 0.45, -0.35]} castShadow receiveShadow>
              <boxGeometry args={[4.2, 0.8, 0.1]} />
              <meshStandardMaterial color="#3b1d11" roughness={0.6} />
            </mesh>
            {/* Legs */}
            <mesh position={[-1.9, -0.22, 0]}>
              <boxGeometry args={[0.15, 0.45, 0.8]} />
              <meshStandardMaterial color="#221008" />
            </mesh>
            <mesh position={[1.9, -0.22, 0]}>
              <boxGeometry args={[0.15, 0.45, 0.8]} />
              <meshStandardMaterial color="#221008" />
            </mesh>
          </group>

          {/* Right Pew */}
          <group position={[4.5, 0.45, z]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[4.2, 0.15, 0.8]} />
              <meshStandardMaterial color="#3b1d11" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.45, -0.35]} castShadow receiveShadow>
              <boxGeometry args={[4.2, 0.8, 0.1]} />
              <meshStandardMaterial color="#3b1d11" roughness={0.6} />
            </mesh>
            <mesh position={[-1.9, -0.22, 0]}>
              <boxGeometry args={[0.15, 0.45, 0.8]} />
              <meshStandardMaterial color="#221008" />
            </mesh>
            <mesh position={[1.9, -0.22, 0]}>
              <boxGeometry args={[0.15, 0.45, 0.8]} />
              <meshStandardMaterial color="#221008" />
            </mesh>
          </group>
        </group>
      ))}

      {/* ============================================================ */}
      {/* INTERACTIVE OBJECT: DONATION / PERSEMBAHAN ALTAR CHEST */}
      {/* Positioned on the right side of the front altar */}
      {/* ============================================================ */}
      <group
        position={[5.5, 0, -13]}
        onClick={(e) => {
          e.stopPropagation();
          onOpenDonation();
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        {/* Pedestal */}
        <mesh position={[0, 0.4, 0]} receiveShadow>
          <cylinderGeometry args={[0.9, 1.1, 0.8, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.2} roughness={0.6} />
        </mesh>

        {/* Golden Chest */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[1.2, 0.7, 0.9]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Chest Slot */}
        <mesh position={[0, 1.46, 0]}>
          <boxGeometry args={[0.5, 0.05, 0.08]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* Floating Halo & Label */}
        <Float speed={2.5} rotationIntensity={0.5} floatIntensity={0.8}>
          <mesh position={[0, 1.9, 0]}>
            <torusGeometry args={[0.45, 0.04, 16, 32]} />
            <meshStandardMaterial color="#fef08a" emissive="#fbbf24" emissiveIntensity={1.2} />
          </mesh>
          <Text
            position={[0, 2.3, 0]}
            fontSize={0.26}
            color="#fbbf24"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="#000000"
          >
            KOTAK PERSEMBAHAN / DONATION
          </Text>
          <Text
            position={[0, 2.05, 0]}
            fontSize={0.16}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            [ Klik / Tap untuk Donasi ]
          </Text>
        </Float>

        <pointLight ref={donationGlowRef} color="#fbbf24" distance={5} position={[0, 1.5, 0]} />
      </group>

      {/* ============================================================ */}
      {/* INTERACTIVE OBJECT: CONFESSION ROOM / BOOTH */}
      {/* Positioned on the left side of the sanctuary */}
      {/* ============================================================ */}
      <group
        position={[-7.5, 0, 2]}
        onClick={(e) => {
          e.stopPropagation();
          onOpenConfession();
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        {/* Booth Main Wooden Structure */}
        <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 4.4, 2.4]} />
          <meshStandardMaterial color="#2d150b" roughness={0.7} />
        </mesh>
        {/* Interior Partition */}
        <mesh position={[0, 2.2, 0]}>
          <boxGeometry args={[0.1, 4.2, 2.2]} />
          <meshStandardMaterial color="#1f0d07" />
        </mesh>
        {/* Roof Crown */}
        <mesh position={[0, 4.5, 0]}>
          <coneGeometry args={[1.7, 0.8, 4]} />
          <meshStandardMaterial color="#1a0c06" />
        </mesh>

        {/* Red Velvet Curtain / Doorway */}
        <mesh position={[0.7, 2.0, 1.22]}>
          <planeGeometry args={[1.0, 3.4]} />
          <meshStandardMaterial color="#7f1d1d" roughness={0.8} />
        </mesh>
        <mesh position={[-0.7, 2.0, 1.22]}>
          <planeGeometry args={[1.0, 3.4]} />
          <meshStandardMaterial color="#7f1d1d" roughness={0.8} />
        </mesh>

        {/* Small Golden Cross on Booth Header */}
        <group position={[0, 4.1, 1.22]}>
          <mesh>
            <boxGeometry args={[0.12, 0.6, 0.05]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[0.4, 0.12, 0.05]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* Booth Status Light Indicator (Green = Available, Red = Busy) */}
        <group position={[0, 4.8, 1.2]}>
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial
              color={isConfessionBusy ? '#ef4444' : '#10b981'}
              emissive={isConfessionBusy ? '#dc2626' : '#059669'}
              emissiveIntensity={1.5}
            />
          </mesh>
          <pointLight
            color={isConfessionBusy ? '#ef4444' : '#10b981'}
            intensity={2}
            distance={4}
          />
        </group>

        {/* Floating Label */}
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
          <Text
            position={[0, 5.3, 1.2]}
            fontSize={0.26}
            color="#e0e7ff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="#000000"
          >
            RUANG PENGAKUAN DOSA
          </Text>
          <Text
            position={[0, 5.0, 1.2]}
            fontSize={0.16}
            color={isConfessionBusy ? '#f87171' : '#a7f3d0'}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {isConfessionBusy ? '• Sedang Digunakan (Busy)' : '• Terbuka [ Klik untuk Masuk ]'}
          </Text>
        </Float>
      </group>
    </group>
  );
};
