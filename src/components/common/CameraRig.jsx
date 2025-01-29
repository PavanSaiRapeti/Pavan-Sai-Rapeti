import React, { useRef, useEffect } from 'react';
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, useHelper, useScroll } from "@react-three/drei";
import * as THREE from "three";
import { useDispatch } from 'react-redux';
import { setCameraRef } from '../../redux/actions/cameraActions';

const CameraRig = () => {
  const scroll = useScroll();
  const cameraRef = useRef();
  const dispatch = useDispatch();

  useHelper(cameraRef, THREE.CameraHelper, 1);

  useEffect(() => {
    dispatch(setCameraRef(cameraRef.current));
  }, [dispatch]);

  useFrame(() => {
    const t = scroll.offset; // Scroll progress (0 to 1)

    // Interpolating camera position from top-down to front
    cameraRef.current.position.lerp(
      new THREE.Vector3(0, 7 - 5 * t, 10 * t), // Moves from (0,5,0) to (0,0,10)
      0.05
    );

    // Adjusting rotation to look forward
    cameraRef.current.rotation.x = -Math.PI / 2 + (Math.PI / 2) * t;
  });

  return (
    <PerspectiveCamera ref={cameraRef} makeDefault={true} position={[0, 5, 0]} fov={50} />
  );
};

export default CameraRig;