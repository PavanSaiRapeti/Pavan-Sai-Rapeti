import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei/core/PerspectiveCamera";
import * as THREE from "three";

const DummyCamera = ({ isDefaultCamera }) => {
  const cameraRef = useRef();

  useFrame(() => {
    if (isDefaultCamera) {
      // Set the camera to a position that shows the entire scene
      cameraRef.current.lookAt(new THREE.Vector3(0, 0, 0));
    }
  });

  return (
    <PerspectiveCamera ref={cameraRef} makeDefault={isDefaultCamera} position={[0, 10, 10]} fov={75} />
  );
};

export default DummyCamera; 