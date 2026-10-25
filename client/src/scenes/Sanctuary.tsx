import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import { LAYOUT } from './layout';
import { GoldRain } from './effects/GoldRain';
import {
  createMarbleTexture,
  createParquetTexture,
  createPlasterTexture,
} from './materials';

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
  const gloryLightRef = useRef<THREE.PointLight>(null);
  const candleRef1 = useRef<THREE.PointLight>(null);
  const candleRef2 = useRef<THREE.PointLight>(null);
  const oculusLightRef = useRef<THREE.SpotLight>(null);

  // Initialize Realistic Procedural Textures
  const marbleTex = useMemo(() => createMarbleTexture(), []);
  const parquetTex = useMemo(() => createParquetTexture(), []);
  const plasterTex = useMemo(() => createPlasterTexture(), []);

  // Dynamic divine shimmer on the golden glory and candlelight
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (gloryLightRef.current) {
      gloryLightRef.current.intensity = 5.5 + Math.sin(t * 3.5) * 0.7 + Math.cos(t * 7) * 0.3;
    }
    if (candleRef1.current) {
      candleRef1.current.intensity = 1.6 + Math.sin(t * 11) * 0.2 + Math.cos(t * 22) * 0.1;
    }
    if (candleRef2.current) {
      candleRef2.current.intensity = 1.6 + Math.cos(t * 13) * 0.2 + Math.sin(t * 19) * 0.1;
    }
  });

  // Generate 48 ornate golden radial rays for the Cathedra Petri glory
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

  // Realistic PBR Materials
  const marbleFloorMat = useMemo(
    () => (
      <meshStandardMaterial
        map={marbleTex}
        color="#ffffff"
        roughness={0.08}
        metalness={0.22}
      />
    ),
    [marbleTex]
  );

  const marbleSolidMat = useMemo(
    () => (
      <meshStandardMaterial
        map={marbleTex}
        color="#f8fafc"
        roughness={0.16}
        metalness={0.12}
      />
    ),
    [marbleTex]
  );

  const plasterWallMat = useMemo(
    () => (
      <meshStandardMaterial
        map={plasterTex}
        color="#fefce8"
        roughness={0.48}
        metalness={0.05}
      />
    ),
    [plasterTex]
  );

  const parquetWoodFloorMat = useMemo(
    () => (
      <meshStandardMaterial
        map={parquetTex}
        color="#542a12"
        roughness={0.28}
        metalness={0.1}
      />
    ),
    [parquetTex]
  );

  const gildedGoldMat = useMemo(
    () => (
      <meshStandardMaterial
        color="#fbbf24"
        emissive="#d97706"
        emissiveIntensity={0.28}
        metalness={0.92}
        roughness={0.15}
      />
    ),
    []
  );

  const richWalnutMat = useMemo(
    () => (
      <meshStandardMaterial
        color="#3d1b08"
        roughness={0.4}
        metalness={0.08}
      />
    ),
    []
  );

  const antiqueBrassMat = useMemo(
    () => (
      <meshStandardMaterial
        color="#d97706"
        metalness={0.85}
        roughness={0.25}
      />
    ),
    []
  );

  return (
    <group>
      {/* ========================================================================= */}
      {/* 1. LUMINOUS DIVINE LIGHTING & ATMOSPHERE */}
      {/* ========================================================================= */}
      <ambientLight intensity={1.5} color="#fffbeb" />
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
      {/* 2. REALISTIC 3D NON-OVERLAPPING FLOOR PARTITION */}
      {/* Polished Carrara Marble Aisles + Recessed Italian Walnut Parquet */}
      {/* ========================================================================= */}

      {/* Main High-Gloss Carrara Marble Floor */}
      <mesh position={[0, -0.06, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 48]} />
        {marbleFloorMat}
      </mesh>

      {/* Left Seating Wing: Recessed Italian Parquet Hardwood Floor */}
      <group position={[-5.5, -0.006, 0]}>
        {/* Recessed Parquet Field */}
        <mesh receiveShadow>
          <boxGeometry args={[4.8, 0.04, 38]} />
          {parquetWoodFloorMat}
        </mesh>
        {/* Marble Border Stringer Framing */}
        <mesh position={[-2.45, 0.015, 0]}>
          <boxGeometry args={[0.16, 0.045, 38]} />
          {marbleSolidMat}
        </mesh>
        <mesh position={[2.45, 0.015, 0]}>
          <boxGeometry args={[0.16, 0.045, 38]} />
          {marbleSolidMat}
        </mesh>
      </group>

      {/* Right Seating Wing: Recessed Italian Parquet Hardwood Floor */}
      <group position={[5.5, -0.006, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[4.8, 0.04, 38]} />
          {parquetWoodFloorMat}
        </mesh>
        <mesh position={[-2.45, 0.015, 0]}>
          <boxGeometry args={[0.16, 0.045, 38]} />
          {marbleSolidMat}
        </mesh>
        <mesh position={[2.45, 0.015, 0]}>
          <boxGeometry args={[0.16, 0.045, 38]} />
          {marbleSolidMat}
        </mesh>
      </group>

      {/* Central Marble Procession Walkway */}
      <mesh position={[0, 0.002, 0]} receiveShadow>
        <boxGeometry args={[4.6, 0.035, 44]} />
        {marbleFloorMat}
      </mesh>

      {/* SOLID 3D RAISED RED VELVET CEREMONIAL CARPET (ZERO Z-FIGHTING) */}
      <group position={[0, 0.035, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[4.2, 0.05, 43]} />
          <meshStandardMaterial
            color="#881337"
            roughness={0.75}
            metalness={0.05}
            polygonOffset
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
          />
        </mesh>
        <mesh position={[-2.15, 0.01, 0]}>
          <boxGeometry args={[0.14, 0.06, 43]} />
          {gildedGoldMat}
        </mesh>
        <mesh position={[2.15, 0.01, 0]}>
          <boxGeometry args={[0.14, 0.06, 43]} />
          {gildedGoldMat}
        </mesh>

        {/* Vatican Porphyry & Gold Medallions */}
        {[-14, -8, -2, 4, 10, 16].map((z, idx) => (
          <group key={`carpet-medallion-${idx}`} position={[0, 0.032, z]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.9, 1.05, 32]} />
              {gildedGoldMat}
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.88, 32]} />
              <meshStandardMaterial color="#450a0a" roughness={0.6} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.48, 8]} />
              {gildedGoldMat}
            </mesh>
          </group>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* 3. COLOSSAL MARBLE COLUMNS & ENTABLATURE (POSITIONED CLEAR OF PEWS) */}
      {/* ========================================================================= */}
      {LAYOUT.columns.rowsZ.map((zPos, idx) => (
        <group key={`col-pair-${idx}`}>
          {/* Left Colossal Column */}
          <group position={[LAYOUT.columns.leftX, 0, zPos]}>
            <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.5, 2.2, 1.5]} />
              {marbleSolidMat}
            </mesh>
            <mesh position={[0, 2.25, 0]}>
              <boxGeometry args={[1.65, 0.15, 1.65]} />
              {gildedGoldMat}
            </mesh>
            <mesh position={[0, 2.5, 0]}>
              <cylinderGeometry args={[0.65, 0.75, 0.35, 24]} />
              {marbleSolidMat}
            </mesh>
            <mesh position={[0, 8.5, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.55, 0.62, 11.5, 32]} />
              {marbleSolidMat}
            </mesh>
            <group position={[0, 14.5, 0]}>
              <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.75, 0.58, 0.5, 20]} />
                {gildedGoldMat}
              </mesh>
              <mesh position={[0, 0.65, 0]}>
                <cylinderGeometry args={[0.9, 0.72, 0.5, 20]} />
                {gildedGoldMat}
              </mesh>
              <mesh position={[0, 1.05, 0]}>
                <boxGeometry args={[1.5, 0.3, 1.5]} />
                {gildedGoldMat}
              </mesh>
            </group>
          </group>

          {/* Right Colossal Column */}
          <group position={[LAYOUT.columns.rightX, 0, zPos]}>
            <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.5, 2.2, 1.5]} />
              {marbleSolidMat}
            </mesh>
            <mesh position={[0, 2.25, 0]}>
              <boxGeometry args={[1.65, 0.15, 1.65]} />
              {gildedGoldMat}
            </mesh>
            <mesh position={[0, 2.5, 0]}>
              <cylinderGeometry args={[0.65, 0.75, 0.35, 24]} />
              {marbleSolidMat}
            </mesh>
            <mesh position={[0, 8.5, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.55, 0.62, 11.5, 32]} />
              {marbleSolidMat}
            </mesh>
            <group position={[0, 14.5, 0]}>
              <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.75, 0.58, 0.5, 20]} />
                {gildedGoldMat}
              </mesh>
              <mesh position={[0, 0.65, 0]}>
                <cylinderGeometry args={[0.9, 0.72, 0.5, 20]} />
                {gildedGoldMat}
              </mesh>
              <mesh position={[0, 1.05, 0]}>
                <boxGeometry args={[1.5, 0.3, 1.5]} />
                {gildedGoldMat}
              </mesh>
            </group>
          </group>

          {/* Transverse Cross Archway */}
          <group position={[0, 16.5, zPos]}>
            <mesh castShadow>
              <boxGeometry args={[14.2, 0.6, 1.1]} />
              {marbleSolidMat}
            </mesh>
            <mesh position={[0, -0.32, 0]}>
              <boxGeometry args={[14.0, 0.1, 0.9]} />
              {gildedGoldMat}
            </mesh>
          </group>
        </group>
      ))}

      {/* Classical Entablature Beams */}
      <group position={[-7.5, 15.8, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.4, 0.5, 38]} />
          {marbleSolidMat}
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[1.6, 0.4, 38]} />
          {gildedGoldMat}
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[1.8, 0.4, 38]} />
          {marbleSolidMat}
        </mesh>
      </group>
      <group position={[7.5, 15.8, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.4, 0.5, 38]} />
          {marbleSolidMat}
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[1.6, 0.4, 38]} />
          {gildedGoldMat}
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[1.8, 0.4, 38]} />
          {marbleSolidMat}
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 4. REALISTIC 3D ARCHITECTURAL RELIEF WALLS (WAINSCOTING & BOISERIE) */}
      {/* ========================================================================= */}
      {/* Left Wall Structure with Travertine Baseboard & Wainscoting */}
      <group position={[-12.2, 0, 0]}>
        {/* Travertine Baseboard Skirting */}
        <mesh position={[0, 0.35, 0]} receiveShadow>
          <boxGeometry args={[0.35, 0.7, 44]} />
          {marbleSolidMat}
        </mesh>
        {/* Carved Walnut Wainscoting */}
        <mesh position={[0, 1.8, 0]} receiveShadow>
          <boxGeometry args={[0.3, 2.5, 42]} />
          {richWalnutMat}
        </mesh>
        <mesh position={[0.16, 3.1, 0]}>
          <boxGeometry args={[0.1, 0.14, 42]} />
          {gildedGoldMat}
        </mesh>
        {/* Recessed Boiserie Moldings */}
        {[-14, -8, -2, 4, 10, 16].map((z, idx) => (
          <mesh key={`wainscot-left-${idx}`} position={[0.16, 1.8, z]}>
            <boxGeometry args={[0.04, 1.8, 3.6]} />
            <meshStandardMaterial color="#2d1306" roughness={0.45} />
          </mesh>
        ))}
      </group>

      {/* Right Wall Structure */}
      <group position={[12.2, 0, 0]}>
        <mesh position={[0, 0.35, 0]} receiveShadow>
          <boxGeometry args={[0.35, 0.7, 44]} />
          {marbleSolidMat}
        </mesh>
        <mesh position={[0, 1.8, 0]} receiveShadow>
          <boxGeometry args={[0.3, 2.5, 42]} />
          {richWalnutMat}
        </mesh>
        <mesh position={[-0.16, 3.1, 0]}>
          <boxGeometry args={[0.1, 0.14, 42]} />
          {gildedGoldMat}
        </mesh>
        {[-14, -8, -2, 4, 10, 16].map((z, idx) => (
          <mesh key={`wainscot-right-${idx}`} position={[-0.16, 1.8, z]}>
            <boxGeometry args={[0.04, 1.8, 3.6]} />
            <meshStandardMaterial color="#2d1306" roughness={0.45} />
          </mesh>
        ))}
      </group>

      {/* Framed Vatican Masterpiece Paintings along the Side Walls */}
      {[-8, -2, 4, 10].map((z, idx) => (
        <group key={`painting-pair-${idx}`}>
          <group position={[-12.0, 5.5, z]}>
            <mesh castShadow>
              <boxGeometry args={[0.12, 2.8, 3.6]} />
              {gildedGoldMat}
            </mesh>
            <mesh position={[0.07, 0, 0]}>
              <boxGeometry args={[0.02, 2.4, 3.2]} />
              <meshStandardMaterial
                color={idx % 2 === 0 ? '#78350f' : '#1e3a8a'}
                roughness={0.7}
              />
            </mesh>
          </group>

          <group position={[12.0, 5.5, z]}>
            <mesh castShadow>
              <boxGeometry args={[0.12, 2.8, 3.6]} />
              {gildedGoldMat}
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

      {/* Hanging Brass Sanctuary Chandeliers */}
      {[-10, -4, 2, 8, 14].map((z, idx) => (
        <group key={`chandelier-${idx}`} position={[0, 10.5, z]}>
          <mesh position={[0, 3.0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 6.0, 8]} />
            {antiqueBrassMat}
          </mesh>
          <mesh position={[0, 0, 0]} castShadow>
            <sphereGeometry args={[0.45, 16, 16]} />
            {antiqueBrassMat}
          </mesh>
          <mesh position={[0, -0.3, 0]}>
            <torusGeometry args={[1.2, 0.08, 12, 24]} />
            {antiqueBrassMat}
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <torusGeometry args={[0.7, 0.06, 12, 24]} />
            {antiqueBrassMat}
          </mesh>

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
          <pointLight color="#f59e0b" intensity={1.2} distance={10} position={[0, 0, 0]} />
        </group>
      ))}

      {/* ========================================================================= */}
      {/* 5. PREACHING PULPIT (AMBO) POSITIONED FLUSH TO RIGHT WALL */}
      {/* ========================================================================= */}
      <group position={[LAYOUT.pulpitAmbo.x, 0, LAYOUT.pulpitAmbo.z]}>
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.3, 1.5, 1.2, 8]} />
          {marbleSolidMat}
        </mesh>
        <mesh position={[0, 2.1, 0]} castShadow>
          <cylinderGeometry args={[1.35, 1.2, 1.8, 8, 1, true]} />
          {richWalnutMat}
        </mesh>
        <mesh position={[0, 3.02, 0]}>
          <cylinderGeometry args={[1.45, 1.35, 0.12, 8, 1, true]} />
          {gildedGoldMat}
        </mesh>
        <group position={[-0.3, 3.25, -0.3]} rotation={[0.3, -0.2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.5, 0.08]} />
            {richWalnutMat}
          </mesh>
          <mesh position={[0, 0.05, 0.05]}>
            <boxGeometry args={[0.6, 0.35, 0.05]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.8} />
          </mesh>
        </group>
        <group position={[0, 5.6, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[1.6, 1.7, 0.3, 8]} />
            {richWalnutMat}
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[1.5, 1.6, 0.1, 8]} />
            {gildedGoldMat}
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <coneGeometry args={[0.4, 0.5, 8]} />
            {gildedGoldMat}
          </mesh>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 6. HIGH CLEAR ARCHED WINDOWS & VOLUMETRIC SUNLIGHT SHAFTS */}
      {/* ========================================================================= */}
      {[-12, -6, 0, 6, 12].map((z, idx) => (
        <group key={`win-bay-${idx}`}>
          <group position={[-12.4, 11, z]}>
            <mesh>
              <boxGeometry args={[0.3, 7.5, 3.2]} />
              {marbleSolidMat}
            </mesh>
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[3.0, 7.0]} />
              <meshBasicMaterial color="#ffffff" opacity={0.65} transparent />
            </mesh>
            <mesh position={[0.05, 0, 0]}>
              <boxGeometry args={[0.06, 6.8, 0.08]} />
              {gildedGoldMat}
            </mesh>
            <mesh position={[0.05, 1.2, 0]}>
              <boxGeometry args={[0.06, 0.08, 2.9]} />
              {gildedGoldMat}
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

          <group position={[12.4, 11, z]}>
            <mesh>
              <boxGeometry args={[0.3, 7.5, 3.2]} />
              {marbleSolidMat}
            </mesh>
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[3.0, 7.0]} />
              <meshBasicMaterial color="#ffffff" opacity={0.65} transparent />
            </mesh>
            <mesh position={[-0.05, 0, 0]}>
              <boxGeometry args={[0.06, 6.8, 0.08]} />
              {gildedGoldMat}
            </mesh>
            <mesh position={[-0.05, 1.2, 0]}>
              <boxGeometry args={[0.06, 0.08, 2.9]} />
              {gildedGoldMat}
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

      {/* Outer Walls with Realistic Venetian Stucco Plaster Texture */}
      <mesh position={[-12.6, 9.5, 0]} receiveShadow>
        <boxGeometry args={[0.6, 19, 44]} />
        {plasterWallMat}
      </mesh>
      <mesh position={[12.6, 9.5, 0]} receiveShadow>
        <boxGeometry args={[0.6, 19, 44]} />
        {plasterWallMat}
      </mesh>
      <mesh position={[0, 9.5, 22]} receiveShadow>
        <boxGeometry args={[25, 19, 0.8]} />
        {plasterWallMat}
      </mesh>

      {/* ========================================================================= */}
      {/* 7. TOWERING COFFERED BARREL VAULT & COFFERED CEILING */}
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
                {gildedGoldMat}
              </mesh>
              <mesh position={[0, 0.15, 0]}>
                <boxGeometry args={[2.0, 0.4, 3.2]} />
                <meshStandardMaterial color="#451a03" roughness={0.4} />
              </mesh>
              <mesh position={[0, -0.05, 0]}>
                <cylinderGeometry args={[0.3, 0.4, 0.15, 8]} />
                {gildedGoldMat}
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* ========================================================================= */}
      {/* 8. CENTRAL CROSSING & TOWERING COFFERED DOME OVERHEAD */}
      {/* ========================================================================= */}
      <group position={[0, 18.5, -6]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[8.2, 8.5, 3.8, 24, 1, true]} />
          {marbleSolidMat}
        </mesh>
        <mesh position={[0, 2.0, 0]}>
          <cylinderGeometry args={[8.8, 8.6, 0.45, 24, 1, true]} />
          {gildedGoldMat}
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
                  {gildedGoldMat}
                </mesh>
              </group>
            )
          )}

          <group position={[0, 8.1, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.2, 2.2, 24]} />
              {gildedGoldMat}
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
      {/* 9. MONUMENTAL CENTRAL ARCHED APSE (NORTH END) */}
      {/* ========================================================================= */}
      <group position={[0, 0, -22]}>
        <mesh position={[0, 9.5, 0]} receiveShadow>
          <cylinderGeometry args={[8.8, 8.8, 19, 32, 1, true, Math.PI, Math.PI]} />
          {plasterWallMat}
        </mesh>
        <mesh position={[0, 18.5, 0]} castShadow receiveShadow>
          <sphereGeometry args={[8.8, 32, 16, Math.PI, Math.PI, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#fffbeb" roughness={0.2} side={THREE.BackSide} />
        </mesh>
        <group position={[0, 18.5, 0]}>
          <mesh>
            <torusGeometry args={[8.8, 0.6, 12, 32, Math.PI]} />
            {gildedGoldMat}
          </mesh>
        </group>
        {[-7, -3.5, 0, 3.5, 7].map((x, idx) => (
          <group key={`apse-pilaster-${idx}`} position={[x, 7.5, Math.cos((x / 8.8) * (Math.PI / 2)) * -6]}>
            <mesh>
              <boxGeometry args={[0.7, 15, 0.25]} />
              {marbleSolidMat}
            </mesh>
            <mesh position={[0, 7.6, 0]}>
              <boxGeometry args={[0.9, 0.45, 0.35]} />
              {gildedGoldMat}
            </mesh>
          </group>
        ))}
        <mesh position={[0, 15.0, -4.5]} rotation={[0, Math.PI, 0]}>
          <cylinderGeometry args={[8.7, 8.7, 0.5, 32, 1, true, 0, Math.PI]} />
          {gildedGoldMat}
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 10. THE DIVINE GLORY: GOLDEN SUNBURST RAYS & GLOWING OVAL STAINED GLASS */}
      {/* ========================================================================= */}
      <group position={[0, 10.5, -21.4]}>
        {gloryRays.map((r) => (
          <group key={r.key} rotation={[0, 0, r.angle]}>
            <mesh position={[0, r.length / 2 + 1.2, 0]} castShadow>
              <boxGeometry args={[r.width, r.length, 0.08]} />
              {gildedGoldMat}
            </mesh>
            <mesh position={[0, r.length + 1.2, 0]}>
              <coneGeometry args={[r.width * 1.5, 0.4, 4]} />
              {gildedGoldMat}
            </mesh>
          </group>
        ))}
        <mesh position={[0, 0, -0.05]}>
          <torusGeometry args={[1.7, 0.35, 16, 32]} />
          {gildedGoldMat}
        </mesh>
        <mesh position={[0, 0, -0.08]}>
          <torusGeometry args={[2.1, 0.22, 16, 32]} />
          {gildedGoldMat}
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
      {/* 11. BAROQUE HIGH ALTAR & CANDLESTICKS */}
      {/* ========================================================================= */}
      <group position={[LAYOUT.highAltar.x, LAYOUT.highAltar.y, LAYOUT.highAltar.z]}>
        <mesh position={[0, 0.25, 0]} receiveShadow>
          <boxGeometry args={[14, 0.5, 6.5]} />
          {marbleSolidMat}
        </mesh>
        <mesh position={[0, 0.65, -0.6]} receiveShadow>
          <boxGeometry args={[11, 0.4, 4.8]} />
          {marbleSolidMat}
        </mesh>
        <mesh position={[0, 1.05, -1.2]} receiveShadow>
          <boxGeometry args={[8.5, 0.4, 3.4]} />
          {marbleSolidMat}
        </mesh>

        <group position={[0, 1.9, -1.6]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[5.6, 1.3, 1.8]} />
            {marbleSolidMat}
          </mesh>
          <mesh position={[0, 0, 0.92]}>
            <boxGeometry args={[4.8, 0.9, 0.05]} />
            {gildedGoldMat}
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[6.0, 0.14, 2.1]} />
            {marbleSolidMat}
          </mesh>
          <mesh position={[0, 0.78, 0]}>
            <boxGeometry args={[5.8, 0.04, 1.9]} />
            <meshStandardMaterial color="#ffffff" roughness={0.8} />
          </mesh>

          <group position={[0, 1.25, -0.4]}>
            <mesh castShadow>
              <boxGeometry args={[1.1, 1.1, 0.9]} />
              {gildedGoldMat}
            </mesh>
            <mesh position={[0, 0.85, 0]} castShadow>
              <coneGeometry args={[0.7, 0.6, 4]} />
              {gildedGoldMat}
            </mesh>
            <mesh position={[0, 1.3, 0]}>
              <boxGeometry args={[0.1, 0.4, 0.05]} />
              {gildedGoldMat}
            </mesh>
            <mesh position={[0, 1.4, 0]}>
              <boxGeometry args={[0.3, 0.1, 0.05]} />
              {gildedGoldMat}
            </mesh>
          </group>

          <group position={[-2.2, 1.2, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.06, 0.15, 0.7, 16]} />
              {gildedGoldMat}
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
              {gildedGoldMat}
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
      {/* 12. CARVED WALNUT CONGREGATION PEWS — ZERO OVERLAP & FORWARD FACING */}
      {/* 4.0m width, perfectly positioned between columns and central aisle */}
      {/* ========================================================================= */}
      {LAYOUT.pews.rowsZ.map((z, rowIdx) => (
        <group key={`pew-row-${rowIdx}`}>
          {/* Left Pew Row */}
          <group position={[LAYOUT.pews.leftX, 0.55, z]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[LAYOUT.pews.width, 0.14, LAYOUT.pews.depth]} />
              {richWalnutMat}
            </mesh>
            {/* Molded Backrest placed at +z (Facing North towards Altar) */}
            <mesh position={[0, 0.5, 0.38]} castShadow receiveShadow>
              <boxGeometry args={[LAYOUT.pews.width, 0.9, 0.12]} />
              {richWalnutMat}
            </mesh>
            <mesh position={[0, 0.96, 0.38]}>
              <boxGeometry args={[LAYOUT.pews.width + 0.1, 0.08, 0.16]} />
              {gildedGoldMat}
            </mesh>
            <mesh position={[-LAYOUT.pews.width / 2 + 0.08, 0.25, 0.05]} castShadow>
              <boxGeometry args={[0.16, 1.2, 0.95]} />
              {richWalnutMat}
            </mesh>
            <mesh position={[LAYOUT.pews.width / 2 - 0.08, 0.25, 0.05]} castShadow>
              <boxGeometry args={[0.16, 1.2, 0.95]} />
              {richWalnutMat}
            </mesh>
            <mesh position={[0, -0.32, 0.5]}>
              <boxGeometry args={[LAYOUT.pews.width - 0.4, 0.1, 0.22]} />
              <meshStandardMaterial color="#881337" roughness={0.6} />
            </mesh>
          </group>

          {/* Right Pew Row */}
          <group position={[LAYOUT.pews.rightX, 0.55, z]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[LAYOUT.pews.width, 0.14, LAYOUT.pews.depth]} />
              {richWalnutMat}
            </mesh>
            <mesh position={[0, 0.5, 0.38]} castShadow receiveShadow>
              <boxGeometry args={[LAYOUT.pews.width, 0.9, 0.12]} />
              {richWalnutMat}
            </mesh>
            <mesh position={[0, 0.96, 0.38]}>
              <boxGeometry args={[LAYOUT.pews.width + 0.1, 0.08, 0.16]} />
              {gildedGoldMat}
            </mesh>
            <mesh position={[-LAYOUT.pews.width / 2 + 0.08, 0.25, 0.05]} castShadow>
              <boxGeometry args={[0.16, 1.2, 0.95]} />
              {richWalnutMat}
            </mesh>
            <mesh position={[LAYOUT.pews.width / 2 - 0.08, 0.25, 0.05]} castShadow>
              <boxGeometry args={[0.16, 1.2, 0.95]} />
              {richWalnutMat}
            </mesh>
            <mesh position={[0, -0.32, 0.5]}>
              <boxGeometry args={[LAYOUT.pews.width - 0.4, 0.1, 0.22]} />
              <meshStandardMaterial color="#881337" roughness={0.6} />
            </mesh>
          </group>
        </group>
      ))}

      {/* ========================================================================= */}
      {/* 13. DONATION DAIS: IN FRONT OF ALTAR WITH GOLD RAIN & DIVINE LIGHTNING */}
      {/* Centered at x: 0, z: -12.5 with zero overlap on aisle or steps */}
      {/* ========================================================================= */}
      <group
        position={[LAYOUT.donationDais.x, LAYOUT.donationDais.y, LAYOUT.donationDais.z]}
        onClick={(e) => {
          e.stopPropagation();
          onOpenDonation();
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        {/* Tiered Circular Sculpted Marble Dais */}
        <mesh position={[0, 0.2, 0]} receiveShadow>
          <cylinderGeometry args={[1.35, 1.55, 0.4, 24]} />
          {marbleSolidMat}
        </mesh>
        <mesh position={[0, 0.42, 0]} receiveShadow>
          <cylinderGeometry args={[1.1, 1.25, 0.15, 24]} />
          {gildedGoldMat}
        </mesh>

        {/* Sculpted Marble Pedestal Base */}
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.65, 0.85, 0.75, 16]} />
          {marbleSolidMat}
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.85, 0.7, 0.12, 16]} />
          {gildedGoldMat}
        </mesh>

        {/* Gilded Baroque Offering Casket */}
        <mesh position={[0, 1.55, 0]} castShadow>
          <boxGeometry args={[1.25, 0.65, 0.85]} />
          {gildedGoldMat}
        </mesh>
        <mesh position={[0, 1.55, 0]}>
          <boxGeometry args={[1.15, 0.55, 0.75]} />
          {richWalnutMat}
        </mesh>
        {/* Offering Slot */}
        <mesh position={[0, 1.88, 0]}>
          <boxGeometry args={[0.55, 0.04, 0.08]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* Animated Falling Gold Rain, Vertical Light Beam, and Lightning Sparks */}
        <GoldRain position={[0, 0, 0]} count={100} radius={0.9} height={10.5} />

        {/* Floating Halo & Inscription */}
        <Float speed={2.8} rotationIntensity={0.3} floatIntensity={0.5}>
          <mesh position={[0, 2.5, 0]}>
            <torusGeometry args={[0.5, 0.04, 16, 32]} />
            <meshStandardMaterial color="#fef08a" emissive="#fbbf24" emissiveIntensity={1.5} />
          </mesh>
          <Text
            position={[0, 3.0, 0]}
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
            position={[0, 2.7, 0]}
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
      </group>

      {/* ========================================================================= */}
      {/* 14. PRIVATE CONFESSION BOOTH: IN FRONT BESIDE ALTAR FLUSH TO LEFT WALL */}
      {/* Located at x: -9.8, z: -14.5 rotated 90 deg so door faces the nave */}
      {/* ========================================================================= */}
      <group
        position={[LAYOUT.confessionBooth.x, LAYOUT.confessionBooth.y, LAYOUT.confessionBooth.z]}
        rotation={[0, LAYOUT.confessionBooth.rotationY, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onOpenConfession();
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        {/* Carved Dark Walnut Baroque Booth Structure */}
        <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[LAYOUT.confessionBooth.depth, 4.8, LAYOUT.confessionBooth.width]} />
          {richWalnutMat}
        </mesh>
        {/* Gilded Moldings along the Pillars and Corners */}
        <mesh position={[1.5, 2.4, 1.25]}>
          <boxGeometry args={[0.15, 4.6, 0.15]} />
          {gildedGoldMat}
        </mesh>
        <mesh position={[-1.5, 2.4, 1.25]}>
          <boxGeometry args={[0.15, 4.6, 0.15]} />
          {gildedGoldMat}
        </mesh>
        <mesh position={[0, 2.4, 1.25]}>
          <boxGeometry args={[0.15, 4.6, 0.15]} />
          {gildedGoldMat}
        </mesh>

        {/* Sculpted Baroque Pediment / Crown */}
        <mesh position={[0, 4.95, 0]}>
          <boxGeometry args={[LAYOUT.confessionBooth.depth + 0.2, 0.35, LAYOUT.confessionBooth.width + 0.2]} />
          {gildedGoldMat}
        </mesh>
        <mesh position={[0, 5.3, 0]}>
          <coneGeometry args={[1.8, 0.9, 4]} />
          {richWalnutMat}
        </mesh>

        {/* Red Damask Velvet Curtains */}
        <mesh position={[0.75, 2.2, 1.32]}>
          <planeGeometry args={[1.2, 3.8]} />
          <meshStandardMaterial color="#881337" roughness={0.7} />
        </mesh>
        <mesh position={[-0.75, 2.2, 1.32]}>
          <planeGeometry args={[1.2, 3.8]} />
          <meshStandardMaterial color="#881337" roughness={0.7} />
        </mesh>

        {/* Gilded Cross on Header */}
        <group position={[0, 5.0, 1.35]}>
          <mesh>
            <boxGeometry args={[0.14, 0.7, 0.05]} />
            {gildedGoldMat}
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.45, 0.14, 0.05]} />
            {gildedGoldMat}
          </mesh>
        </group>

        {/* Brass Status Lantern Indicator */}
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

        {/* Floating Divine Inscription */}
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

      {/* Holy Water Fonts (Stoups) near South Entrance */}
      <group position={[-3.2, 0, 19]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.35, 1.2, 12]} />
          {marbleSolidMat}
        </mesh>
        <mesh position={[0, 1.25, 0]} castShadow>
          <sphereGeometry args={[0.45, 16, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          {antiqueBrassMat}
        </mesh>
      </group>
      <group position={[3.2, 0, 19]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.35, 1.2, 12]} />
          {marbleSolidMat}
        </mesh>
        <mesh position={[0, 1.25, 0]} castShadow>
          <sphereGeometry args={[0.45, 16, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          {antiqueBrassMat}
        </mesh>
      </group>
    </group>
  );
};
