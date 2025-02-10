import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import * as THREE from "three";
import Newspaper from './Newspaper';
import { useFrame } from '@react-three/fiber';

const PaperAnm = () => {
  const paperRef = useRef();
  const isScrollToBtm = useSelector(state => state.camera.isScrollToBtm);

  // Define the points, speeds, and rotations
  const points = [
    { position: new THREE.Vector3(0.4, 1.1, 8.65), speed: 0.3, rotation: new THREE.Euler(4.8, 5.6, 1.6) }, 
    { position: new THREE.Vector3(0.3, -10.1, 8.5), speed: 0.3, rotation: new THREE.Euler(4.8, 5.6, 1.6) },// tp
    { position: new THREE.Vector3(0.2, 2.05, 8.65), speed: 0.8, rotation: new THREE.Euler(5.5, 5.6, 0.6) }, // tp1
    { position: new THREE.Vector3(-0.1, 2.15, 9.7), speed: 0.2, rotation: new THREE.Euler(4.8, 8, 1.5) }, // tp2
  ];
  let currentPoint = 0;

  useFrame(() => {
    if (!paperRef.current) return;

    if (isScrollToBtm && currentPoint < points.length) {
      const target = points[currentPoint];
      const position = paperRef.current.position;
      const rotation = paperRef.current.rotation;
      const speed = target.speed;

      // Move towards the target point
      position.lerp(target.position, speed);

      // Rotate towards the target rotation
      rotation.x += (target.rotation.x - rotation.x) * speed;
      rotation.y += (target.rotation.y - rotation.y) * speed;
      rotation.z += (target.rotation.z - rotation.z) * speed;

      // Check if the object is close to the target point
      if (position.distanceTo(target.position) < 0.01) {
        currentPoint += 1; // Move to the next point
      }
    } else if (!isScrollToBtm) {
      // Return to initial position and rotation if not scrolling to bottom
      paperRef.current.position.lerp(new THREE.Vector3(8, 2.2, 9.1), 0.09);
      paperRef.current.rotation.set(4.6, 6.6, 1.6);
      currentPoint = 0; // Reset to start when not scrolling
    }
  });

  return (
    <mesh ref={paperRef} position={[10, 2.2, 9.1]} rotation={[4.6, 6.6, 1.6]} >
      <Newspaper />
    </mesh>
  );
};

export default PaperAnm;
