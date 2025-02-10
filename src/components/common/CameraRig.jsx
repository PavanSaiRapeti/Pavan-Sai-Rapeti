import React, { useRef, useEffect } from 'react';
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, useScroll } from "@react-three/drei";
import * as THREE from "three";
import { useDispatch, useSelector } from 'react-redux';
import { setCameraRef, setScroll, setScrollBtm } from '../../redux/actions/cameraActions';

const CameraRig = ({ isDefaultCamera }) => {
  const scroll = useScroll();
  const cameraRef = useRef();
  const dispatch = useDispatch();
  const {isScroll,isScrollToBtm} = useSelector((state) => state.camera);

  const targetPosition = new THREE.Vector3();
  const targetRotation = new THREE.Euler();


  useFrame(() => {
    const t = scroll.offset; 

    if ((t > 0 && !isScroll) || (t === 0 && isScroll)) {
      dispatch(setScroll(t > 0));
    }
    if((t>0.95 && !isScrollToBtm ) || (t < 0.98 && isScroll)){
      dispatch(setScrollBtm(t>0.98));
    }

    targetPosition.set(0, 7 - 5 * t, 10 * t);
    targetRotation.set(-Math.PI / 2 + (Math.PI / 2) * t, 0, 0);

    cameraRef.current.position.lerp(targetPosition, 0.05);
    cameraRef.current.rotation.x = targetRotation.x;
  });

  return (
    <PerspectiveCamera ref={cameraRef} makeDefault={isDefaultCamera} position={[0, 5, 0]} fov={50} />
  );
};

export default CameraRig; 