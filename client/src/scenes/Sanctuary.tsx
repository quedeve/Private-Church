import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

interface SanctuaryProps {
  onOpenDonation: () => void;
  onOpenConfession: () => void;
  isConfessionBusy?: boolean;
}

export const Sanctuary: React.FC<SanctuaryProps> = ({
  onOpenDonation,
  onOpenConfession,
  isConfessionBusy = false,
}) => {
  const donationGlowRef = useRef<THREE.PointLight>(null);
  const gloryLightRef = useRef<THREE.PointLight>(null);
  const candleRef1 = useRef<THREE.PointLight>(null);
  const candleRef2 = useRef<THREE.PointLight>(null);
  const oculusLightRef = useRef<THREE.SpotLight>(null);

  // Dynamic divine shimmer on the golden glory and candlelight
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (gloryLightRef.current) {
      gloryLightRef.current.intensity = 5.5 + Math.sin(t * 3.5) * 0.7 + Math.cos(t * 7) * 0.3;
    }
    if (donationGlowRef.current) {
      donationGlowRef.current.intensity = 2.2 + Math.sin(t * 2.5) * 0.4;
    }
    if (candleRef1.current) {
      candleRef1.current.intensity = 1.6 + Math.sin(t * 11) * 0.2 + Math.cos(t * 22) * 0.1;
    }
    if (candleRef2.current) {
      candleRef2.current.intensity = 1.6 + Math.cos(t * 13) * 0.2 + Math.sin(t * 19) * 0.1;
    }
  });

  // Generate 48 ornate golden radial rays for the Cathedra Petri style glory
  const gloryRays = useMemo(() => {
    const rays = [];
    const count = 48;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const length = 2.6 + (i % 3 === 0 ? 1.4 : i % 2 === 0 ? 0.8 : 0.2) + Math.sin(i * 1.5) * 0.3;
      const width = 0.08 + (i % 4 === 0 ? 0.04 : 0);
      rays.push({ angle, length, width, key: `ray-${i}` });
    }
    return rays;
  }, []);

  // Shared Materials
  const marbleWhite = useMemo(
    () => (
      <meshStandardMaterial
        color="#f8fafc"
        roughness={0.14}
        metalness={0.12}
      />
    ),
    []
  );

  const marbleGoldVein = useMemo(
    () => (
      <meshStandardMaterial
        color="#fef3c7"
        roughness={0.22}
        metalness={0.15}
      />
    ),
    []
  );

  const polishedFloor = useMemo(
    () => (
      <meshStandardMaterial
        color="#f1f5f9"
        roughness={0.12}
        metalness={0.2}
      />
    ),
    []
  );

  const parquetWoodFloor = useMemo(
    () => (
      <meshStandardMaterial
        color="#542a12"
        roughness={0.32}
        metalness={0.1}
      />
    ),
    []
  );

  const gildedGold = useMemo(
    () => (
      <meshStandardMaterial
        color="#fbbf24"
        emissive="#d97706"
        emissiveIntensity={0.25}
        metalness={0.88}
        roughness={0.18}
      />
    ),
    []
  );

  const richWalnut = useMemo(
    () => (
      <meshStandardMaterial
        color="#3d1b08"
        roughness={0.4}
        metalness={0.08}
      />
    ),
    []
  );

  const antiqueBrass = useMemo(
    () => (
      <meshStandardMaterial
        color="#d97706"
        metalness={0.82}
        roughness={0.28}
      />
    ),
    []
  );

  return (
    <group>
      {/* ========================================================================= */}
      {/* 1. LUMINOUS DIVINE LIGHTING & ATMOSPHERE */}
      {/* ========================================================================= */}

      {/* Bright warm ambient daylight */}
      <ambientLight intensity={1.5} color="#fffbeb" />

      {/* Radiant sky hemisphere light */}
      <hemisphereLight args={['#fef9c3', '#e2e8f0', 1.2]} />

      {/* Intense natural streaming sunlight entering from high clerestory windows */}
      <directionalLight
        position={[22, 36, 16]}
        intensity={3.4}
        color="#fef08a"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={120}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={35}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0005}
      />

      {/* Secondary fill daylight from opposite high windows */}
      <directionalLight position={[-18, 30, -10]} intensity={1.6} color="#fef3c7" />

      {/* Direct divine sunlight pouring through dome oculus */}
      <spotLight
        ref={oculusLightRef}
        position={[0, 28, -6]}
        target-position={[0, 0, -6]}
        angle={0.65}
        penumbra={0.7}
        intensity={4.2}
        color="#fffbeb"
        castShadow
      />

      {/* Apse glory divine radiant point light */}
      <pointLight
        ref={gloryLightRef}
        position={[0, 10.5, -21.8]}
        color="#fbbf24"
        intensity={6.0}
        distance={28}
      />

      {/* ========================================================================= */}
      {/* 2. HYBRID FLOOR: POLISHED MARBLE AISLES + WARM PARQUET HARDWOOD ACCENTS */}
      {/* ========================================================================= */}

      {/* Base Subfloor */}
      <mesh position={[0, -0.06, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 48]} />
        {polishedFloor}
      </mesh>

      {/* Left Seating Wing: Warm Parquet Hardwood Floor under Pews */}
      <group position={[-5.8, 0.005, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[6.2, 0.04, 40]} />
          {parquetWoodFloor}
        </mesh>
        {/* Carrara Marble Border Frame */}
        <mesh position={[-3.15, 0.015, 0]}>
          <boxGeometry args={[0.2, 0.045, 40]} />
          {marbleWhite}
        </mesh>
        <mesh position={[3.15, 0.015, 0]}>
          <boxGeometry args={[0.2, 0.045, 40]} />
          {marbleWhite}
        </mesh>
      </group>

      {/* Right Seating Wing: Warm Parquet Hardwood Floor under Pews */}
      <group position={[5.8, 0.005, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[6.2, 0.04, 40]} />
          {parquetWoodFloor}
        </mesh>
        <mesh position={[-3.15, 0.015, 0]}>
          <boxGeometry args={[0.2, 0.045, 40]} />
          {marbleWhite}
        </mesh>
        <mesh position={[3.15, 0.015, 0]}>
          <boxGeometry args={[0.2, 0.045, 40]} />
          {marbleWhite}
        </mesh>
      </group>

      {/* Central Marble Procession Walkway */}
      <mesh position={[0, 0.002, 0]} receiveShadow>
        <boxGeometry args={[5.0, 0.035, 44]} />
        {polishedFloor}
      </mesh>

      {/* SOLID 3D RAISED RED VELVET CEREMONIAL CARPET (ZERO Z-FIGHTING / NO WHITE FLASHING) */}
      <group position={[0, 0.035, 0]}>
        {/* Main Solid Velvet Slab with depth & thickness */}
        <mesh receiveShadow>
          <boxGeometry args={[4.4, 0.05, 43]} />
          <meshStandardMaterial
            color="#881337"
            roughness={0.75}
            metalness={0.05}
            polygonOffset
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
          />
        </mesh>

        {/* Gilded Gold Embroidered Edge Strips */}
        <mesh position={[-2.25, 0.01, 0]}>
          <boxGeometry args={[0.16, 0.06, 43]} />
          {gildedGold}
        </mesh>
        <mesh position={[2.25, 0.01, 0]}>
          <boxGeometry args={[0.16, 0.06, 43]} />
          {gildedGold}
        </mesh>

        {/* Vatican Porphyry & Gold Medallions spaced along the carpet */}
        {[-14, -8, -2, 4, 10, 16].map((z, idx) => (
          <group key={`carpet-medallion-${idx}`} position={[0, 0.032, z]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.0, 1.15, 32]} />
              {gildedGold}
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.98, 32]} />
              <meshStandardMaterial color="#450a0a" roughness={0.6} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.55, 8]} />
              {gildedGold}
            </mesh>
          </group>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* 3. COLOSSAL MARBLE COLUMNS WITH CORINTHIAN CAPITALS & ENTABLATURE */}
      {/* ========================================================================= */}
      {[-16, -10, -4, 2, 8, 14].map((zPos, idx) => (
        <group key={`col-pair-${idx}`}>
          {/* Left Colossal Column */}
          <group position={[-7.5, 0, zPos]}>
            <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.5, 2.2, 1.5]} />
              {marbleWhite}
            </mesh>
            <mesh position={[0, 2.25, 0]}>
              <boxGeometry args={[1.65, 0.15, 1.65]} />
              {gildedGold}
            </mesh>
            <mesh position={[0, 2.5, 0]}>
              <cylinderGeometry args={[0.65, 0.75, 0.35, 24]} />
              {marbleWhite}
            </mesh>
            <mesh position={[0, 8.5, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.55, 0.62, 11.5, 32]} />
              {marbleGoldVein}
            </mesh>
            <group position={[0, 14.5, 0]}>
              <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.75, 0.58, 0.5, 20]} />
                {gildedGold}
              </mesh>
              <mesh position={[0, 0.65, 0]}>
                <cylinderGeometry args={[0.9, 0.72, 0.5, 20]} />
                {gildedGold}
              </mesh>
              <mesh position={[0, 1.05, 0]}>
                <boxGeometry args={[1.5, 0.3, 1.5]} />
                {gildedGold}
              </mesh>
            </group>
          </group>

          {/* Right Colossal Column */}
          <group position={[7.5, 0, zPos]}>
            <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.5, 2.2, 1.5]} />
              {marbleWhite}
            </mesh>
            <mesh position={[0, 2.25, 0]}>
              <boxGeometry args={[1.65, 0.15, 1.65]} />
              {gildedGold}
            </mesh>
            <mesh position={[0, 2.5, 0]}>
              <cylinderGeometry args={[0.65, 0.75, 0.35, 24]} />
              {marbleWhite}
            </mesh>
            <mesh position={[0, 8.5, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.55, 0.62, 11.5, 32]} />
              {marbleGoldVein}
            </mesh>
            <group position={[0, 14.5, 0]}>
              <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.75, 0.58, 0.5, 20]} />
                {gildedGold}
              </mesh>
              <mesh position={[0, 0.65, 0]}>
                <cylinderGeometry args={[0.9, 0.72, 0.5, 20]} />
                {gildedGold}
              </mesh>
              <mesh position={[0, 1.05, 0]}>
                <boxGeometry args={[1.5, 0.3, 1.5]} />
                {gildedGold}
              </mesh>
            </group>
          </group>

          {/* Transverse Cross Archway across Nave */}
          <group position={[0, 16.5, zPos]}>
            <mesh castShadow>
              <boxGeometry args={[14.2, 0.6, 1.1]} />
              {marbleWhite}
            </mesh>
            <mesh position={[0, -0.32, 0]}>
              <boxGeometry args={[14.0, 0.1, 0.9]} />
              {gildedGold}
            </mesh>
          </group>
        </group>
      ))}

      {/* Continuous Classical Entablature (Architrave + Gilded Frieze + Dentil Cornice) */}
      <group position={[-7.5, 15.8, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.4, 0.5, 38]} />
          {marbleWhite}
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[1.6, 0.4, 38]} />
          {gildedGold}
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[1.8, 0.4, 38]} />
          {marbleWhite}
        </mesh>
      </group>
      <group position={[7.5, 15.8, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.4, 0.5, 38]} />
          {marbleWhite}
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[1.6, 0.4, 38]} />
          {gildedGold}
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[1.8, 0.4, 38]} />
          {marbleWhite}
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 4. VATICAN ACCESSORY: CARVED WALNUT WAINSCOTING & OIL PAINTINGS */}
      {/* ========================================================================= */}
      {/* Left Wall Wainscoting Paneling (Height 3.2m) */}
      <group position={[-12.2, 1.6, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[0.3, 3.2, 42]} />
          {richWalnut}
        </mesh>
        {/* Gilded Top Chair Rail */}
        <mesh position={[0.16, 1.55, 0]}>
          <boxGeometry args={[0.1, 0.14, 42]} />
          {gildedGold}
        </mesh>
        {/* Recessed Boiserie Moldings */}
        {[-14, -8, -2, 4, 10, 16].map((z, idx) => (
          <mesh key={`wainscot-panel-left-${idx}`} position={[0.16, 0, z]}>
            <boxGeometry args={[0.04, 2.2, 3.6]} />
            <meshStandardMaterial color="#2d1306" roughness={0.45} />
          </mesh>
        ))}
      </group>

      {/* Right Wall Wainscoting Paneling */}
      <group position={[12.2, 1.6, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[0.3, 3.2, 42]} />
          {richWalnut}
        </mesh>
        <mesh position={[-0.16, 1.55, 0]}>
          <boxGeometry args={[0.1, 0.14, 42]} />
          {gildedGold}
        </mesh>
        {[-14, -8, -2, 4, 10, 16].map((z, idx) => (
          <mesh key={`wainscot-panel-right-${idx}`} position={[-0.16, 0, z]}>
            <boxGeometry args={[0.04, 2.2, 3.6]} />
            <meshStandardMaterial color="#2d1306" roughness={0.45} />
          </mesh>
        ))}
      </group>

      {/* Framed Vatican Masterpiece Paintings along the Side Walls */}
      {[-12, -4, 4, 12].map((z, idx) => (
        <group key={`painting-pair-${idx}`}>
          {/* Left Wall Painting */}
          <group position={[-12.0, 5.5, z]}>
            {/* Gilded Baroque Frame */}
            <mesh castShadow>
              <boxGeometry args={[0.12, 2.8, 3.6]} />
              {gildedGold}
            </mesh>
            {/* Canvas Artwork */}
            <mesh position={[0.07, 0, 0]}>
              <boxGeometry args={[0.02, 2.4, 3.2]} />
              <meshStandardMaterial
                color={idx % 2 === 0 ? '#78350f' : '#1e3a8a'}
                roughness={0.7}
              />
            </mesh>
          </group>

          {/* Right Wall Painting */}
          <group position={[12.0, 5.5, z]}>
            <mesh castShadow>
              <boxGeometry args={[0.12, 2.8, 3.6]} />
              {gildedGold}
            </mesh>
            <mesh position={[-0.07, 0, 0]}>
              <boxGeometry args={[0.02, 2.4, 3.2]} />
              <meshStandardMaterial
                color={idx % 2 === 0 ? '#1e3a8a' : '#78350f'}
                roughness={0.7}
              />
            </mesh>
          </group>
        </group>
      ))}

      {/* ========================================================================= */}
      {/* 5. VATICAN ACCESSORY: HANGING BRASS SANCTUARY CHANDELIERS */}
      {/* ========================================================================= */}
      {[-10, -4, 2, 8, 14].map((z, idx) => (
        <group key={`chandelier-${idx}`} position={[0, 10.5, z]}>
          {/* Hanging Chain from Arch */}
          <mesh position={[0, 3.0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 6.0, 8]} />
            {antiqueBrass}
          </mesh>
          {/* Central Brass Crown / Core */}
          <mesh position={[0, 0, 0]} castShadow>
            <sphereGeometry args={[0.45, 16, 16]} />
            {antiqueBrass}
          </mesh>
          {/* Tiered Brass Rings */}
          <mesh position={[0, -0.3, 0]}>
            <torusGeometry args={[1.2, 0.08, 12, 24]} />
            {antiqueBrass}
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <torusGeometry args={[0.7, 0.06, 12, 24]} />
            {antiqueBrass}
          </mesh>

          {/* Candle Lights around the Chandelier Ring */}
          {[0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3].map(
            (ang, cIdx) => (
              <group
                key={`chan-candle-${cIdx}`}
                position={[Math.sin(ang) * 1.2, -0.1, Math.cos(ang) * 1.2]}
              >
                <mesh position={[0, 0.15, 0]}>
                  <cylinderGeometry args={[0.035, 0.035, 0.25, 8]} />
                  <meshStandardMaterial color="#fef3c7" />
                </mesh>
                <mesh position={[0, 0.3, 0]}>
                  <coneGeometry args={[0.04, 0.12, 8]} />
                  <meshBasicMaterial color="#fbbf24" />
                </mesh>
              </group>
            )
          )}

          {/* Warm Ambient Chandelier Glow */}
          <pointLight color="#f59e0b" intensity={1.2} distance={10} position={[0, 0, 0]} />
        </group>
      ))}

      {/* ========================================================================= */}
      {/* 6. VATICAN ACCESSORY: SCULPTED CARVED WALNUT PULPIT (AMBO) */}
      {/* Positioned on the right side of the chancel steps */}
      {/* ========================================================================= */}
      <group position={[5.4, 0, -14.2]}>
        {/* Sculpted Marble Plinth */}
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.3, 1.5, 1.2, 8]} />
          {marbleWhite}
        </mesh>
        {/* Octagonal Carved Walnut Pulpit Enclosure */}
        <mesh position={[0, 2.1, 0]} castShadow>
          <cylinderGeometry args={[1.35, 1.2, 1.8, 8, 1, true]} />
          {richWalnut}
        </mesh>
        <mesh position={[0, 3.02, 0]}>
          <cylinderGeometry args={[1.45, 1.35, 0.12, 8, 1, true]} />
          {gildedGold}
        </mesh>
        {/* Preaching Book Stand / Lectern */}
        <group position={[0, 3.25, -0.5]} rotation={[0.3, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.5, 0.08]} />
            {richWalnut}
          </mesh>
          <mesh position={[0, 0.05, 0.05]}>
            <boxGeometry args={[0.6, 0.35, 0.05]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.8} />
          </mesh>
        </group>
        {/* Overhead Sounding Board Canopy */}
        <group position={[0, 5.6, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[1.6, 1.7, 0.3, 8]} />
            {richWalnut}
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[1.5, 1.6, 0.1, 8]} />
            {gildedGold}
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <coneGeometry args={[0.4, 0.5, 8]} />
            {gildedGold}
          </mesh>
        </group>
      </group>

      {/* Holy Water Fonts (Stoups) near South Entrance */}
      <group position={[-3.2, 0, 19]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.35, 1.2, 12]} />
          {marbleWhite}
        </mesh>
        <mesh position={[0, 1.25, 0]} castShadow>
          <sphereGeometry args={[0.45, 16, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          {antiqueBrass}
        </mesh>
      </group>
      <group position={[3.2, 0, 19]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.35, 1.2, 12]} />
          {marbleWhite}
        </mesh>
        <mesh position={[0, 1.25, 0]} castShadow>
          <sphereGeometry args={[0.45, 16, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          {antiqueBrass}
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 7. HIGH CLEAR ARCHED CLERESTORY WINDOWS & VOLUMETRIC SUNLIGHT SHAFTS */}
      {/* ========================================================================= */}
      {[-12, -6, 0, 6, 12].map((z, idx) => (
        <group key={`win-bay-${idx}`}>
          {/* Left Arched Window */}
          <group position={[-12.4, 11, z]}>
            <mesh>
              <boxGeometry args={[0.3, 7.5, 3.2]} />
              {marbleWhite}
            </mesh>
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[3.0, 7.0]} />
              <meshBasicMaterial color="#ffffff" opacity={0.65} transparent />
            </mesh>
            <mesh position={[0.05, 0, 0]}>
              <boxGeometry args={[0.06, 6.8, 0.08]} />
              {gildedGold}
            </mesh>
            <mesh position={[0.05, 1.2, 0]}>
              <boxGeometry args={[0.06, 0.08, 2.9]} />
              {gildedGold}
            </mesh>

            <mesh position={[4.5, -4.5, -1.5]} rotation={[0.4, 0.3, -0.65]}>
              <cylinderGeometry args={[0.8, 4.2, 14, 16, 1, true]} />
              <meshBasicMaterial
                color="#fef08a"
                transparent
                opacity={0.075}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>

          {/* Right Arched Window */}
          <group position={[12.4, 11, z]}>
            <mesh>
              <boxGeometry args={[0.3, 7.5, 3.2]} />
              {marbleWhite}
            </mesh>
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[3.0, 7.0]} />
              <meshBasicMaterial color="#ffffff" opacity={0.65} transparent />
            </mesh>
            <mesh position={[-0.05, 0, 0]}>
              <boxGeometry args={[0.06, 6.8, 0.08]} />
              {gildedGold}
            </mesh>
            <mesh position={[-0.05, 1.2, 0]}>
              <boxGeometry args={[0.06, 0.08, 2.9]} />
              {gildedGold}
            </mesh>

            <mesh position={[-4.5, -4.5, -1.5]} rotation={[-0.4, -0.3, 0.65]}>
              <cylinderGeometry args={[0.8, 4.2, 14, 16, 1, true]} />
              <meshBasicMaterial
                color="#fef08a"
                transparent
                opacity={0.075}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
        </group>
      ))}

      {/* Outer Walls */}
      <mesh position={[-12.6, 9.5, 0]} receiveShadow>
        <boxGeometry args={[0.6, 19, 44]} />
        <meshStandardMaterial color="#fefce8" roughness={0.25} />
      </mesh>
      <mesh position={[12.6, 9.5, 0]} receiveShadow>
        <boxGeometry args={[0.6, 19, 44]} />
        <meshStandardMaterial color="#fefce8" roughness={0.25} />
      </mesh>
      <mesh position={[0, 9.5, 22]} receiveShadow>
        <boxGeometry args={[25, 19, 0.8]} />
        <meshStandardMaterial color="#fefce8" roughness={0.25} />
      </mesh>

      {/* ========================================================================= */}
      {/* 8. TOWERING COFFERED BARREL VAULT & COFFERED CEILING */}
      {/* ========================================================================= */}
      {[-15, -9, -3, 3, 9, 15].map((z, row) => (
        <group key={`vault-row-${row}`} position={[0, 18.2, z]}>
          <mesh castShadow>
            <boxGeometry args={[14.8, 0.8, 5.2]} />
            <meshStandardMaterial color="#fffbeb" roughness={0.2} />
          </mesh>
          {[-4.8, -1.6, 1.6, 4.8].map((x, col) => (
            <group key={`coffer-${col}`} position={[x, -0.15, 0]}>
              <mesh>
                <boxGeometry args={[2.5, 0.45, 3.8]} />
                {gildedGold}
              </mesh>
              <mesh position={[0, 0.15, 0]}>
                <boxGeometry args={[2.0, 0.4, 3.2]} />
                <meshStandardMaterial color="#451a03" roughness={0.4} />
              </mesh>
              <mesh position={[0, -0.05, 0]}>
                <cylinderGeometry args={[0.3, 0.4, 0.15, 8]} />
                {gildedGold}
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* ========================================================================= */}
      {/* 9. CENTRAL CROSSING & TOWERING COFFERED DOME OVERHEAD */}
      {/* ========================================================================= */}
      <group position={[0, 18.5, -6]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[8.2, 8.5, 3.8, 24, 1, true]} />
          {marbleWhite}
        </mesh>
        <mesh position={[0, 2.0, 0]}>
          <cylinderGeometry args={[8.8, 8.6, 0.45, 24, 1, true]} />
          {gildedGold}
        </mesh>

        {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4].map(
          (ang, i) => (
            <group key={`drum-win-${i}`} position={[Math.sin(ang) * 8.3, 0.2, Math.cos(ang) * 8.3]} rotation={[0, ang, 0]}>
              <mesh>
                <planeGeometry args={[1.8, 2.4]} />
                <meshBasicMaterial color="#ffffff" opacity={0.8} transparent />
              </mesh>
            </group>
          )
        )}

        <group position={[0, 2.2, 0]}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[8.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#fffbeb" roughness={0.2} side={THREE.BackSide} />
          </mesh>

          {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4].map(
            (ang, i) => (
              <group key={`dome-rib-${i}`} rotation={[0, ang, 0]}>
                <mesh position={[0, 4.2, 0]} rotation={[0, 0, 0]}>
                  <torusGeometry args={[7.8, 0.16, 8, 24, Math.PI / 2]} />
                  {gildedGold}
                </mesh>
              </group>
            )
          )}

          <group position={[0, 8.1, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.2, 2.2, 24]} />
              {gildedGold}
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[1.18, 24]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>

            <mesh position={[0, -5.5, 0]}>
              <cylinderGeometry args={[1.2, 3.8, 12, 16, 1, true]} />
              <meshBasicMaterial
                color="#fffbeb"
                transparent
                opacity={0.06}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 10. MONUMENTAL CENTRAL ARCHED APSE (NORTH END) */}
      {/* ========================================================================= */}
      <group position={[0, 0, -22]}>
        <mesh position={[0, 9.5, 0]} receiveShadow>
          <cylinderGeometry args={[8.8, 8.8, 19, 32, 1, true, Math.PI, Math.PI]} />
          <meshStandardMaterial color="#fefce8" roughness={0.25} side={THREE.BackSide} />
        </mesh>

        <mesh position={[0, 18.5, 0]} castShadow receiveShadow>
          <sphereGeometry args={[8.8, 32, 16, Math.PI, Math.PI, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#fffbeb" roughness={0.2} side={THREE.BackSide} />
        </mesh>

        <group position={[0, 18.5, 0]}>
          <mesh>
            <torusGeometry args={[8.8, 0.6, 12, 32, Math.PI]} />
            {gildedGold}
          </mesh>
        </group>

        {[-7, -3.5, 0, 3.5, 7].map((x, idx) => (
          <group key={`apse-pilaster-${idx}`} position={[x, 7.5, Math.cos((x / 8.8) * (Math.PI / 2)) * -6]}>
            <mesh>
              <boxGeometry args={[0.7, 15, 0.25]} />
              {marbleWhite}
            </mesh>
            <mesh position={[0, 7.6, 0]}>
              <boxGeometry args={[0.9, 0.45, 0.35]} />
              {gildedGold}
            </mesh>
          </group>
        ))}

        <mesh position={[0, 15.0, -4.5]} rotation={[0, Math.PI, 0]}>
          <cylinderGeometry args={[8.7, 8.7, 0.5, 32, 1, true, 0, Math.PI]} />
          {gildedGold}
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 11. THE DIVINE GLORY: GOLDEN SUNBURST RAYS & GLOWING OVAL STAINED GLASS */}
      {/* ========================================================================= */}
      <group position={[0, 10.5, -21.4]}>
        {gloryRays.map((r) => (
          <group key={r.key} rotation={[0, 0, r.angle]}>
            <mesh position={[0, r.length / 2 + 1.2, 0]} castShadow>
              <boxGeometry args={[r.width, r.length, 0.08]} />
              {gildedGold}
            </mesh>
            <mesh position={[0, r.length + 1.2, 0]}>
              <coneGeometry args={[r.width * 1.5, 0.4, 4]} />
              {gildedGold}
            </mesh>
          </group>
        ))}

        <mesh position={[0, 0, -0.05]}>
          <torusGeometry args={[1.7, 0.35, 16, 32]} />
          {gildedGold}
        </mesh>
        <mesh position={[0, 0, -0.08]}>
          <torusGeometry args={[2.1, 0.22, 16, 32]} />
          {gildedGold}
        </mesh>

        <group scale={[1.15, 1.6, 1.0]}>
          <mesh>
            <circleGeometry args={[1.35, 32]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
          <mesh position={[0, 0, -0.01]}>
            <ringGeometry args={[1.3, 1.6, 32]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
          <group position={[0, 0, 0.02]} scale={[0.6, 0.45, 0.6]}>
            <mesh>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[-0.45, 0.1, 0]} rotation={[0, 0, 0.35]}>
              <boxGeometry args={[0.7, 0.18, 0.05]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.45, 0.1, 0]} rotation={[0, 0, -0.35]}>
              <boxGeometry args={[0.7, 0.18, 0.05]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 12. BAROQUE HIGH ALTAR & CANDLESTICKS */}
      {/* ========================================================================= */}
      <group position={[0, 0, -18.2]}>
        <mesh position={[0, 0.25, 0]} receiveShadow>
          <boxGeometry args={[14, 0.5, 6.5]} />
          {marbleWhite}
        </mesh>
        <mesh position={[0, 0.65, -0.6]} receiveShadow>
          <boxGeometry args={[11, 0.4, 4.8]} />
          {marbleGoldVein}
        </mesh>
        <mesh position={[0, 1.05, -1.2]} receiveShadow>
          <boxGeometry args={[8.5, 0.4, 3.4]} />
          {marbleWhite}
        </mesh>

        <group position={[0, 1.9, -1.6]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[5.6, 1.3, 1.8]} />
            {marbleWhite}
          </mesh>
          <mesh position={[0, 0, 0.92]}>
            <boxGeometry args={[4.8, 0.9, 0.05]} />
            {gildedGold}
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[6.0, 0.14, 2.1]} />
            {marbleWhite}
          </mesh>
          <mesh position={[0, 0.78, 0]}>
            <boxGeometry args={[5.8, 0.04, 1.9]} />
            <meshStandardMaterial color="#ffffff" roughness={0.8} />
          </mesh>

          <group position={[0, 1.25, -0.4]}>
            <mesh castShadow>
              <boxGeometry args={[1.1, 1.1, 0.9]} />
              {gildedGold}
            </mesh>
            <mesh position={[0, 0.85, 0]} castShadow>
              <coneGeometry args={[0.7, 0.6, 4]} />
              {gildedGold}
            </mesh>
            <mesh position={[0, 1.3, 0]}>
              <boxGeometry args={[0.1, 0.4, 0.05]} />
              {gildedGold}
            </mesh>
            <mesh position={[0, 1.4, 0]}>
              <boxGeometry args={[0.3, 0.1, 0.05]} />
              {gildedGold}
            </mesh>
          </group>

          <group position={[-2.2, 1.2, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.06, 0.15, 0.7, 16]} />
              {gildedGold}
            </mesh>
            <mesh position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.35, 12]} />
              <meshStandardMaterial color="#fef3c7" />
            </mesh>
            <pointLight ref={candleRef1} color="#f59e0b" intensity={2.0} distance={5} position={[0, 0.7, 0]} />
          </group>

          <group position={[2.2, 1.2, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.06, 0.15, 0.7, 16]} />
              {gildedGold}
            </mesh>
            <mesh position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.35, 12]} />
              <meshStandardMaterial color="#fef3c7" />
            </mesh>
            <pointLight ref={candleRef2} color="#f59e0b" intensity={2.0} distance={5} position={[0, 0.7, 0]} />
          </group>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 13. CARVED WALNUT CONGREGATION PEWS — CORRECT FORWARD DIRECTION & WALKTHROUGH */}
      {/* Backrest positioned at +z so seats face North towards the Altar (-z) */}
      {/* ========================================================================= */}
      {[-12, -8, -4, 0, 4, 8, 12].map((z, rowIdx) => (
        <group key={`pew-row-${rowIdx}`}>
          {/* Left Pew Row (Passable / Walkthrough) */}
          <group position={[-5.6, 0.55, z]}>
            {/* Seat Board (Open towards North / -z) */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[5.2, 0.14, 0.82]} />
              {richWalnut}
            </mesh>
            {/* Molded Backrest placed at +z (Facing Altar at -z) */}
            <mesh position={[0, 0.5, 0.38]} castShadow receiveShadow>
              <boxGeometry args={[5.2, 0.9, 0.12]} />
              {richWalnut}
            </mesh>
            <mesh position={[0, 0.96, 0.38]}>
              <boxGeometry args={[5.3, 0.08, 0.16]} />
              {gildedGold}
            </mesh>
            {/* Carved Bench Ends */}
            <mesh position={[-2.55, 0.25, 0.05]} castShadow>
              <boxGeometry args={[0.16, 1.2, 0.95]} />
              {richWalnut}
            </mesh>
            <mesh position={[2.55, 0.25, 0.05]} castShadow>
              <boxGeometry args={[0.16, 1.2, 0.95]} />
              {richWalnut}
            </mesh>
            {/* Padded Kneeler at the Back */}
            <mesh position={[0, -0.32, 0.5]}>
              <boxGeometry args={[4.8, 0.1, 0.22]} />
              <meshStandardMaterial color="#881337" roughness={0.6} />
            </mesh>
          </group>

          {/* Right Pew Row (Passable / Walkthrough) */}
          <group position={[5.6, 0.55, z]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[5.2, 0.14, 0.82]} />
              {richWalnut}
            </mesh>
            {/* Molded Backrest placed at +z (Facing Altar at -z) */}
            <mesh position={[0, 0.5, 0.38]} castShadow receiveShadow>
              <boxGeometry args={[5.2, 0.9, 0.12]} />
              {richWalnut}
            </mesh>
            <mesh position={[0, 0.96, 0.38]}>
              <boxGeometry args={[5.3, 0.08, 0.16]} />
              {gildedGold}
            </mesh>
            <mesh position={[-2.55, 0.25, 0.05]} castShadow>
              <boxGeometry args={[0.16, 1.2, 0.95]} />
              {richWalnut}
            </mesh>
            <mesh position={[2.55, 0.25, 0.05]} castShadow>
              <boxGeometry args={[0.16, 1.2, 0.95]} />
              {richWalnut}
            </mesh>
            <mesh position={[0, -0.32, 0.5]}>
              <boxGeometry args={[4.8, 0.1, 0.22]} />
              <meshStandardMaterial color="#881337" roughness={0.6} />
            </mesh>
          </group>
        </group>
      ))}

      {/* ========================================================================= */}
      {/* 14. BAROQUE KOTAK PERSEMBAHAN (DONATION CHEST) */}
      {/* ========================================================================= */}
      <group
        position={[6.5, 0, -15]}
        onClick={(e) => {
          e.stopPropagation();
          onOpenDonation();
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <mesh position={[0, 0.45, 0]} receiveShadow>
          <cylinderGeometry args={[1.0, 1.25, 0.9, 20]} />
          {marbleWhite}
        </mesh>
        <mesh position={[0, 0.92, 0]}>
          <cylinderGeometry args={[1.2, 1.05, 0.15, 20]} />
          {gildedGold}
        </mesh>

        <mesh position={[0, 1.45, 0]} castShadow>
          <boxGeometry args={[1.35, 0.85, 1.0]} />
          {gildedGold}
        </mesh>
        <mesh position={[0, 1.45, 0]}>
          <boxGeometry args={[1.25, 0.75, 0.9]} />
          {richWalnut}
        </mesh>
        <mesh position={[0, 1.88, 0]}>
          <boxGeometry args={[0.55, 0.04, 0.08]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        <Float speed={2.8} rotationIntensity={0.4} floatIntensity={0.6}>
          <mesh position={[0, 2.35, 0]}>
            <torusGeometry args={[0.5, 0.04, 16, 32]} />
            <meshStandardMaterial color="#fef08a" emissive="#fbbf24" emissiveIntensity={1.5} />
          </mesh>
          <Text
            position={[0, 2.8, 0]}
            fontSize={0.28}
            color="#fbbf24"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.035}
            outlineColor="#0f172a"
          >
            KOTAK PERSEMBAHAN &amp; QRIS
          </Text>
          <Text
            position={[0, 2.52, 0]}
            fontSize={0.17}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.025}
            outlineColor="#000000"
          >
            [ Klik / Tap untuk Donasi ]
          </Text>
        </Float>

        <pointLight ref={donationGlowRef} color="#fbbf24" distance={6} position={[0, 1.9, 0]} />
      </group>

      {/* ========================================================================= */}
      {/* 15. BAROQUE BILIK PENGAKUAN DOSA (CONFESSION BOOTH) */}
      {/* ========================================================================= */}
      <group
        position={[-8.5, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onOpenConfession();
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 4.8, 2.6]} />
          {richWalnut}
        </mesh>
        <mesh position={[1.5, 2.4, 1.25]}>
          <boxGeometry args={[0.15, 4.6, 0.15]} />
          {gildedGold}
        </mesh>
        <mesh position={[-1.5, 2.4, 1.25]}>
          <boxGeometry args={[0.15, 4.6, 0.15]} />
          {gildedGold}
        </mesh>
        <mesh position={[0, 2.4, 1.25]}>
          <boxGeometry args={[0.15, 4.6, 0.15]} />
          {gildedGold}
        </mesh>

        <mesh position={[0, 4.95, 0]}>
          <boxGeometry args={[3.4, 0.35, 2.8]} />
          {gildedGold}
        </mesh>
        <mesh position={[0, 5.3, 0]}>
          <coneGeometry args={[1.8, 0.9, 4]} />
          {richWalnut}
        </mesh>

        <mesh position={[0.75, 2.2, 1.32]}>
          <planeGeometry args={[1.2, 3.8]} />
          <meshStandardMaterial color="#881337" roughness={0.7} />
        </mesh>
        <mesh position={[-0.75, 2.2, 1.32]}>
          <planeGeometry args={[1.2, 3.8]} />
          <meshStandardMaterial color="#881337" roughness={0.7} />
        </mesh>

        <group position={[0, 5.0, 1.35]}>
          <mesh>
            <boxGeometry args={[0.14, 0.7, 0.05]} />
            {gildedGold}
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.45, 0.14, 0.05]} />
            {gildedGold}
          </mesh>
        </group>

        <group position={[0, 5.8, 1.3]}>
          <mesh>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial
              color={isConfessionBusy ? '#ef4444' : '#10b981'}
              emissive={isConfessionBusy ? '#dc2626' : '#059669'}
              emissiveIntensity={2.0}
            />
          </mesh>
          <pointLight
            color={isConfessionBusy ? '#ef4444' : '#10b981'}
            intensity={2.5}
            distance={5}
          />
        </group>

        <Float speed={2.2} rotationIntensity={0.2} floatIntensity={0.5}>
          <Text
            position={[0, 6.4, 1.3]}
            fontSize={0.28}
            color="#fef3c7"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.035}
            outlineColor="#0f172a"
          >
            RUANG PENGAKUAN DOSA
          </Text>
          <Text
            position={[0, 6.05, 1.3]}
            fontSize={0.18}
            color={isConfessionBusy ? '#f87171' : '#a7f3d0'}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.025}
            outlineColor="#000000"
          >
            {isConfessionBusy ? '• Sedang Digunakan (Busy)' : '• Terbuka [ Klik untuk Masuk ]'}
          </Text>
        </Float>
      </group>
    </group>
  );
};
