import { useTexture } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { Physics,RigidBody,SoftBody } from "@react-three/rapier";
import { useRef } from "react";
import { TextureLoader } from "three";
import * as THREE from'three';

const Newspaper = () => {
    const texture = useLoader(TextureLoader, '/images/textures/Postertexture.jpg'); // Add a newspaper texture
    const newspaperRef = useRef();
  
    useFrame(() => {
      if (newspaperRef.current) {
        // Apply slight movement to simulate flying
        // newspaperRef.current.position.x = Math.sin(Date.now() * 0.001) * 2;
        // newspaperRef.current.position.y = Math.cos(Date.now() * 0.001) * 2 + 2;
      }
    });
  
    return (
      <RigidBody ref={newspaperRef} mass={1} friction={0.1} restitution={0.2} type="dynamic">
        <mesh>
          <planeGeometry args={[2, 1]} />
          <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
        </mesh>
      </RigidBody>
    );
};

export default Newspaper;