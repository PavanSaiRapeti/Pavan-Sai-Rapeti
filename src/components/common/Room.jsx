import {  Text } from '@react-three/drei';
import {  useLoader } from '@react-three/fiber';
import React, { useRef, useState } from 'react';
import { buildUrl } from '../../../utils/urlBuilder';
import { useSelector } from 'react-redux';
import { TextureLoader } from 'three';


const Room = () => {
  const paperRef =useRef();
  const [position, setPosition] = useState([-5, -0.4, 0]);
  const isScroll = useSelector(state => state.camera.isScroll);
  const [resumeTexture, aboutTexture] = useLoader(TextureLoader, ['/images/textures/resumeTexture.png', '/images/textures/aboutMe.png']);

  const fontArray = [
    {  text: "With ", position: [-2, 0.4, 0.1], color : '#1F2937'},
    {  text: " Five years ", position: [-0.8, 0.9, 0.1], color : '#ff9600'},
    {  text: " of forging", position: [1, 1.6, 0.1], color : '#1F2937'},
    {  text: "in the code's fierce flame,", position: [0, 0.7, 0.1], color : '#1F2937'},
    {  text: "I build robust solutions", position: [0, 0.2, 0.1], color : '#1F2937'},
    {  text: "where power meets the", position: [0, -0.3, 0.1], color : '#1F2937'},
    {  text: "game.", position: [0, -0.8, 0.1], color : '#1F2937'},
  ];

  return (
    <>
      <group position={[-4.9, -0.5, -0.9]} >
        {[...Array(3)].map((_, index) => (
          <mesh
            key={index}
            position={[0, index * 0.01, 0]} 
            rotation={[0, index * 0.1, 0]} 
          >
            <boxGeometry args={[1, 0.01, 1.3]} />
            <meshStandardMaterial map={resumeTexture} args={ [{transparent: false, color: '#FFDEAD'}]} />
          </mesh>
        ))}
        <pointLight position={[0, 1, 0]} intensity={0.5} />
        <pointLight position={[0, 2, 0]} intensity={0.5} />
        <pointLight position={[0, 3, 0]} intensity={0.5} />
      </group>
      <mesh
            position={[-2, -0.3, -0.9]} 
            rotation={[-Math.PI/2, 0, 0.1]} 
          >
             <planeGeometry args={[aboutTexture.image.width*0.003, aboutTexture.image.height*0.003]} />
            <meshStandardMaterial map={aboutTexture} args={ [{transparent: true , color: '#dcdddf'}]} />
      </mesh>
      <Text
        position={[-5, -0.4, -1.7]} 
        rotation={[-Math.PI/2, 0, 0.2]}
        font={buildUrl("/fonts/child.ttf")}
        fontSize={0.15}
        textAlign="center"
        color="black"
      >
       Resume
      </Text>
      <group position={[-4, -0.3, 1]} rotation={[-Math.PI/2, 0, -0.3]}>
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[1.5, 1.8, 0.01]} />
          <meshStandardMaterial color="yellow" />
        </mesh>
        <mesh position={[0, 0.05, 0.01]} rotation={[0, 0, 0]}>
          <planeGeometry args={[1.3, 1.3]} />
          <meshStandardMaterial map={resumeTexture} args={ [{transparent: true, color: 'black'}]} />
        </mesh>
        <Text
        position={[0, -0.75, 0.02]} 
        rotation={[0, 0, 0]}
        font={buildUrl("/fonts/child.ttf")}
        fontSize={0.15}
        textAlign="center"
        color="black"
      >
       Hobbies
      </Text>
      </group>
      <mesh receiveShadow position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial />
        {fontArray.map((item, index) => (<Text
          key={index}
          position={item.position} 
          rotation={[Math.PI, -Math.PI, Math.PI / 0.32]}
          font={buildUrl("/fonts/child.ttf")}
          fontSize={0.4}
          textAlign="center"
          color={item.color}
        >
          {item.text}
        </Text>
      ))}
      </mesh>

    </>
  );
};

export default Room;
