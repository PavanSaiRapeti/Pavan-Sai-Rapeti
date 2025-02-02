import React, { useRef, useEffect } from 'react';
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, useHelper, useScroll } from "@react-three/drei";
import * as THREE from "three";
import { useDispatch, useSelector } from 'react-redux';
import { setCameraRef, setScroll } from '../../redux/actions/cameraActions';

const CameraRig = ({isDefaultCamera}) => {
  const scroll = useScroll();
  const cameraRef = useRef();
  const dispatch = useDispatch();
  const isScroll = useSelector((state) => state.camera.isScroll);
  console.log(isScroll);
  // useHelper(cameraRef, THREE.CameraHelper, 1);

  useEffect(() => {
    dispatch(setCameraRef(cameraRef.current));
    
  }, [dispatch]);

  useFrame(() => {
    const t = scroll.offset; // Scroll progress (0 to 1)
    
    if(t > 0 && !isScroll){
      console.log('t',t,'isScroll', isScroll);
      dispatch(setScroll(true));
    }
    if(t === 0 && isScroll){
      dispatch(setScroll(false));
    }
    // Interpolating camera position from top-down to front
    cameraRef.current.position.lerp(
      new THREE.Vector3(0, 7 - 5 * t, 10 * t), // Moves from (0,5,0) to (0,0,10)
      0.05
    );

    // Adjusting rotation to look forward
    cameraRef.current.rotation.x = -Math.PI / 2 + (Math.PI / 2) * t;
  });

  return (
    <PerspectiveCamera ref={cameraRef} makeDefault={isDefaultCamera} position={[0, 5, 0]} fov={50} />
  );
};

export default CameraRig;