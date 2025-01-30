import React, { useRef, useEffect } from 'react';
import { useFrame, useLoader } from "@react-three/fiber";
import { useScroll, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { TextureLoader } from 'three';

const PaperAnm = () => {
  const paperRef = useRef();
  const scroll = useScroll();
  const texture = useLoader(TextureLoader, '/images/textures/Postertexture.jpg'); // Load the texture

  useFrame(() => {
    const t = scroll.offset; 
    const current = paperRef.current;
     // Scroll progress (0 to 1)

    // Interpolating paper position from floor to screen
    const targetPosition = new THREE.Vector3(1 * (1 - t), 2 * t, 9.67 * t);
    current.position.lerp(targetPosition, 0.05);

    const axis = new THREE.Vector3( 0 , 0, 0).normalize(); 
    current.rotateOnAxis(axis, 0);
  });

  return (
    <mesh ref={paperRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <planeGeometry args={[0.21, 0.297 ]} />
      <meshStandardMaterial map={texture} side={THREE.DoubleSide} /> {/* Apply the texture */}
    </mesh>
  );
};

export default PaperAnm;
