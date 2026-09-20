import { Text } from "@react-three/drei/core/Text";
import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildUrl } from "../../../utils/urlBuilder";

/**
 * Cartoon roadside mailbox (red dome + wood post + flag up).
 * Built as simple meshes to match the illustration reference.
 */
export default function DeskMailbox({
  position = [2.15, -0.5, 1.75],
  onClick,
  onPointerEnter,
  onPointerOut,
}) {
  const groupRef = useRef(null);
  const flagRef = useRef(null);
  const font = buildUrl("/fonts/Logo.ttf");

  const domeGeo = useMemo(() => {
    const shape = new THREE.Shape();
    const w = 0.28;
    const h = 0.22;
    shape.moveTo(-w, 0);
    shape.lineTo(-w, h * 0.55);
    shape.quadraticCurveTo(-w, h, 0, h);
    shape.quadraticCurveTo(w, h, w, h * 0.55);
    shape.lineTo(w, 0);
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.42,
      bevelEnabled: false,
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (flagRef.current) {
      flagRef.current.rotation.z = 0.04 + Math.sin(t * 2.2) * 0.03;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      onPointerEnter={(e) => {
        e.stopPropagation();
        onPointerEnter?.(e);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onPointerOut?.(e);
      }}
    >
      {/* Wood post */}
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[0.09, 0.56, 0.09]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.85} />
      </mesh>
      {/* Post outline hint */}
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[0.1, 0.57, 0.1]} />
        <meshBasicMaterial color="#1a1a1a" wireframe transparent opacity={0.15} />
      </mesh>

      {/* Mailbox body group */}
      <group position={[0, 0.62, 0]} rotation={[0, -0.35, 0]}>
        {/* Domed body (extruded profile along depth) */}
        <mesh
          geometry={domeGeo}
          position={[0, 0, -0.21]}
          castShadow
        >
          <meshStandardMaterial color="#E53935" roughness={0.45} />
        </mesh>

        {/* Front door panel */}
        <mesh position={[0, 0.1, 0.215]}>
          <boxGeometry args={[0.48, 0.32, 0.02]} />
          <meshStandardMaterial color="#C62828" roughness={0.5} />
        </mesh>

        {/* Latch */}
        <mesh position={[0, 0.22, 0.23]}>
          <boxGeometry args={[0.06, 0.04, 0.03]} />
          <meshStandardMaterial color="#B0BEC5" metalness={0.6} roughness={0.35} />
        </mesh>

        {/* White name plate */}
        <mesh position={[0, 0.08, 0.232]}>
          <boxGeometry args={[0.28, 0.08, 0.01]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
        </mesh>
        <Text
          position={[0, 0.08, 0.24]}
          font={font}
          fontSize={0.035}
          color="#111111"
          anchorX="center"
          anchorY="middle"
          pointerEvents="none"
        >
          MAIL
        </Text>

        {/* Rivets */}
        {[-0.16, -0.05, 0.05, 0.16].map((x) => (
          <mesh key={x} position={[x, -0.02, 0.225]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshStandardMaterial color="#90A4AE" metalness={0.5} roughness={0.4} />
          </mesh>
        ))}

        {/* Flag (up) */}
        <group ref={flagRef} position={[0.26, 0.12, 0]}>
          <mesh position={[0.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.012, 0.012, 0.08, 8]} />
            <meshStandardMaterial color="#B0BEC5" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[0.1, 0.08, 0]}>
            <boxGeometry args={[0.12, 0.16, 0.02]} />
            <meshStandardMaterial color="#E53935" roughness={0.45} />
          </mesh>
        </group>
      </group>

      {/* Soft shadow disc on desk */}
      <mesh
        position={[0.02, 0.002, 0.02]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[0.22, 24]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
