import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import { UserProfile } from '../types';

interface PlayerControllerProps {
  profile: UserProfile;
  onPositionChange?: (pos: { x: number; y: number; z: number; rotationY: number }) => void;
  onNearDonation?: (near: boolean) => void;
  onNearConfession?: (near: boolean) => void;
  mobileJoystick?: { x: number; y: number } | null;
  mobileLookDelta?: { x: number; y: number } | null;
  isLocked?: boolean;
}

export const PlayerController: React.FC<PlayerControllerProps> = ({
  profile,
  onPositionChange,
  onNearDonation,
  onNearConfession,
  mobileJoystick,
  mobileLookDelta,
}) => {
  const { camera } = useThree();
  const playerGroupRef = useRef<THREE.Group>(null);

  // Keyboard state
  const keys = useRef<{ [key: string]: boolean }>({});
  const position = useRef(new THREE.Vector3(0, 0, 14));
  const velocity = useRef(new THREE.Vector3());
  const rotationY = useRef(Math.PI);
  const lastBroadcast = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    const speed = 7.0;
    const moveVector = new THREE.Vector3();

    // 1. Desktop keyboard input
    if (keys.current['KeyW'] || keys.current['ArrowUp']) moveVector.z -= 1;
    if (keys.current['KeyS'] || keys.current['ArrowDown']) moveVector.z += 1;
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) moveVector.x -= 1;
    if (keys.current['KeyD'] || keys.current['ArrowRight']) moveVector.x += 1;

    // 2. Mobile joystick input
    if (mobileJoystick && (mobileJoystick.x !== 0 || mobileJoystick.y !== 0)) {
      moveVector.x += mobileJoystick.x;
      moveVector.z -= mobileJoystick.y;
    }

    // Apply camera orientation to movement vector
    if (moveVector.lengthSq() > 0) {
      moveVector.normalize();

      // Camera yaw
      const euler = new THREE.Euler(0, 0, 0, 'YXZ');
      euler.setFromQuaternion(camera.quaternion);
      euler.x = 0;
      euler.z = 0;

      moveVector.applyEuler(euler);
      velocity.current.copy(moveVector).multiplyScalar(speed * delta);
      position.current.add(velocity.current);

      // Rotate avatar towards movement direction
      rotationY.current = Math.atan2(moveVector.x, moveVector.z);
    }

    // 3. Collision Boundaries (Keep inside Sanctuary Nave & Prevent clipping)
    position.current.x = THREE.MathUtils.clamp(position.current.x, -9.5, 9.5);
    position.current.z = THREE.MathUtils.clamp(position.current.z, -18.5, 18.5);

    // Prevent clipping into main altar block
    if (position.current.z < -15.5 && Math.abs(position.current.x) < 7.0) {
      position.current.z = -15.5;
    }

    // Update avatar mesh position
    if (playerGroupRef.current) {
      playerGroupRef.current.position.copy(position.current);
      playerGroupRef.current.rotation.y = rotationY.current;
    }

    // Update First/Third-person Camera follow
    camera.position.x = position.current.x;
    camera.position.y = 1.7; // Eye height
    camera.position.z = position.current.z;

    // Proximity triggers: Donation Box (x: 5.5, z: -13)
    const distToDonation = position.current.distanceTo(new THREE.Vector3(5.5, 0, -13));
    if (onNearDonation) {
      onNearDonation(distToDonation < 3.2);
    }

    // Proximity triggers: Confession Booth (x: -7.5, z: 2)
    const distToConfession = position.current.distanceTo(new THREE.Vector3(-7.5, 0, 2));
    if (onNearConfession) {
      onNearConfession(distToConfession < 3.5);
    }

    // Broadcast position to Colyseus multiplayer on ~60ms throttle
    const now = performance.now();
    if (now - lastBroadcast.current > 60) {
      lastBroadcast.current = now;
      if (onPositionChange) {
        onPositionChange({
          x: position.current.x,
          y: position.current.y,
          z: position.current.z,
          rotationY: rotationY.current,
        });
      }
    }
  });

  return (
    <>
      <PointerLockControls />

      {/* Local Player Avatar Visual */}
      <group ref={playerGroupRef} position={[0, 0, 14]}>
        {/* Floating Billboard Name Tag & Pastor Badge */}
        <Billboard position={[0, 2.3, 0]}>
          <Text
            fontSize={0.22}
            color={profile.isPastor ? '#fbbf24' : '#ffffff'}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="#0f172a"
          >
            {profile.isPastor ? `✝ Pastor ${profile.displayName}` : profile.displayName}
          </Text>
          <Text
            position={[0, -0.2, 0]}
            fontSize={0.14}
            color={profile.isPastor ? '#f59e0b' : '#94a3b8'}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {profile.isPastor ? '[ Gembala / Pastor ]' : '[ Jemaat / Visitor ]'}
          </Text>
        </Billboard>

        {/* Character Body Model */}
        {/* Head */}
        <mesh position={[0, 1.55, 0]} castShadow>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.5} />
        </mesh>
        {/* Hair / Headwear */}
        <mesh position={[0, 1.68, -0.04]}>
          <sphereGeometry args={[0.23, 16, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>

        {/* Torso / Robe */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.35, 1.1, 16]} />
          <meshStandardMaterial color={profile.avatarColor || '#3b82f6'} roughness={0.6} />
        </mesh>

        {/* Pastor Stole / Vestment (Golden embroidered scarf) */}
        {profile.isPastor && (
          <group position={[0, 0.92, 0.05]}>
            {/* Left stole band */}
            <mesh position={[-0.14, -0.1, 0.22]}>
              <boxGeometry args={[0.09, 0.8, 0.04]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.3} />
            </mesh>
            {/* Right stole band */}
            <mesh position={[0.14, -0.1, 0.22]}>
              <boxGeometry args={[0.09, 0.8, 0.04]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.3} />
            </mesh>
          </group>
        )}

        {/* Hands */}
        <mesh position={[-0.32, 0.85, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#fed7aa" />
        </mesh>
        <mesh position={[0.32, 0.85, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#fed7aa" />
        </mesh>

        {/* Feet / Shadow Base */}
        <mesh position={[-0.12, 0.15, 0]}>
          <cylinderGeometry args={[0.09, 0.1, 0.3, 12]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.12, 0.15, 0]}>
          <cylinderGeometry args={[0.09, 0.1, 0.3, 12]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>
    </>
  );
};
