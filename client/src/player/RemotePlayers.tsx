import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import { RemotePlayer } from '../types';

interface RemotePlayersProps {
  players: RemotePlayer[];
}

export const RemotePlayers: React.FC<RemotePlayersProps> = ({ players }) => {
  return (
    <group>
      {players.map((player) => (
        <InterpolatedRemoteAvatar key={player.id} player={player} />
      ))}
    </group>
  );
};

const InterpolatedRemoteAvatar: React.FC<{ player: RemotePlayer }> = ({ player }) => {
  const groupRef = useRef<THREE.Group>(null);
  const targetPos = useRef(new THREE.Vector3(player.x, player.y, player.z));

  // Update target when network state updates
  targetPos.current.set(player.x, player.y, player.z);

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Smooth linear interpolation (lerp) to avoid stepped jitter
      groupRef.current.position.lerp(targetPos.current, Math.min(1, delta * 12));

      // Smooth rotation lerp
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        player.rotationY,
        Math.min(1, delta * 10)
      );
    }
  });

  return (
    <group ref={groupRef} position={[player.x, player.y, player.z]}>
      {/* Floating Name & Role Billboard */}
      <Billboard position={[0, 2.3, 0]}>
        <Text
          fontSize={0.2}
          color={player.isPastor ? '#fbbf24' : '#ffffff'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#0f172a"
        >
          {player.isPastor ? `✝ Pastor ${player.displayName}` : player.displayName}
        </Text>
        <Text
          position={[0, -0.18, 0]}
          fontSize={0.13}
          color={player.isPastor ? '#f59e0b' : '#94a3b8'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {player.isPastor ? '[ Gembala / Pastor ]' : '[ Jemaat / Visitor ]'}
        </Text>
      </Billboard>

      {/* Avatar Head */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.5} />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 1.68, -0.04]}>
        <sphereGeometry args={[0.23, 16, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>

      {/* Robe / Torso */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.35, 1.1, 16]} />
        <meshStandardMaterial color={player.avatarColor || '#64748b'} roughness={0.6} />
      </mesh>

      {/* Pastor Scarf/Stole */}
      {player.isPastor && (
        <group position={[0, 0.92, 0.05]}>
          <mesh position={[-0.14, -0.1, 0.22]}>
            <boxGeometry args={[0.09, 0.8, 0.04]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.3} />
          </mesh>
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

      {/* Feet */}
      <mesh position={[-0.12, 0.15, 0]}>
        <cylinderGeometry args={[0.09, 0.1, 0.3, 12]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.12, 0.15, 0]}>
        <cylinderGeometry args={[0.09, 0.1, 0.3, 12]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  );
};
