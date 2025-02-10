import React, { useRef, useEffect } from 'react';
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { useDispatch } from 'react-redux';
import { setCameraRef } from '../../redux/actions/cameraActions';

const DummyCamera = ({ isDefaultCamera }) => {
  const cameraRef = useRef();
  const dispatch = useDispatch();


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