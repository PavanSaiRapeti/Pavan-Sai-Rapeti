import { Html, Loader, Text } from '@react-three/drei';
import { Canvas, useLoader } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';
import { buildUrl } from '../../../utils/urlBuilder';
import { useSelector } from 'react-redux';
import { TextureLoader } from 'three';

const Room = () => {
  const paperRef =useRef();
  const [position, setPosition] = useState([-5, -0.4, 0]);
  const isScroll = useSelector(state => state.camera.isScroll);
  const texture = useLoader(TextureLoader, '/images/textures/resumeTexture.png');

  // Load the custom font
  const fontArray = [
    // {  text: "🌍", position: [0, 1.5, 0.1] , color : 'blue'},
    {  text: "PAVAN SAI RAPETI", position: [0, 0.7, 0.1] , color : 'blue'},
    {  text: "an artist paints a canvas.", position: [0, 0, 0.1], color : 'black'},
    // {  text: "Let's build something extraordinary.", position: [0, -0.1, 0.1], color : 'black'}
  ];

  return (
    <>
      {/* Floor (20m x 20m) */}
       
      {/* Stack of Papers with More Rotation */}
      <group position={[-5, -0.4, -1]} >
        {[...Array(3)].map((_, index) => (
          <mesh
            key={index}
            position={[0, index * 0.01, 0]} // Fixed position
            rotation={[0, index * 0.1, 0]} // Different rotation for each
          >
            <boxGeometry args={[1, 0.01, 1.3]} />
            <meshStandardMaterial map={texture} args={ [{transparent: false, color: '#FFDEAD'}]} />
          </mesh>
        ))}
        <pointLight position={[0, 1, 0]} intensity={0.5} />
        <pointLight position={[0, 2, 0]} intensity={0.5} />
        <pointLight position={[0, 3, 0]} intensity={0.5} />
      </group>
      <Text
        position={[-5, -0.1, -1.7]} // Position the text below the group
        rotation={[-Math.PI/2, 0, 0.2]}
        font={buildUrl("/fonts/child.ttf")}
        fontSize={0.15}
        textAlign="center"
        color="black"
      >
       Resume
      </Text>
      
      <mesh receiveShadow position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="white" />
       
        {fontArray.map((item, index) => (
        <Text
          key={index}
          position={item.position} // Position for each text segment
          rotation={[Math.PI, -Math.PI, Math.PI / 0.32]}
          font={buildUrl("/fonts/child.ttf")}// Use the font from the array
          fontSize={0.5}
          textAlign="center"
          color={item.color}
        >
          {item.text}
        </Text>
      ))}
      </mesh>

      {/* Walls (20m x 10m x 0.1m) */}
      <mesh position={[0, 5, -10]} receiveShadow>
        <boxGeometry args={[20, 10, 0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0, 5, 10]} receiveShadow>
        <boxGeometry args={[20, 10, 0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-10, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[20, 10, 0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[10, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[20, 10, 0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Grid on the floor (20m x 20m) */}
      {/* <gridHelper args={[20, 20, 'gray', 'gray']} position={[0, 0.01, 0]} /> */}
    </>
  );
};

export default Room;
