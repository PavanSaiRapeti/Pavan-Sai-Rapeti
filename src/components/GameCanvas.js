// src/GameCanvas.js  

import React, { useRef, useEffect } from 'react';  
import { Stage, Layer, Rect } from 'react-konva';  

const GameCanvas = () => {  
  const stageRef = useRef(null);  

  const handleMouseClick = (e) => {  
    const pos = stageRef.current.getPointerPosition();  
    console.log(`Clicked at x: ${pos.x}, y: ${pos.y}`);  
    // You can implement your projectile firing logic here based on the click position  
  };  

  useEffect(() => {  
    // Initialize game elements, like targets  
  }, []);  

  return (  
    <Stage  
      width={window.innerWidth}  
      height={window.innerHeight}  
      ref={stageRef}  
      onClick={handleMouseClick}  
    >  
      <Layer>  
        {/* Player's Projectile */}  
        <Rect  
          x={50}  
          y={window.innerHeight - 100}  
          width={20}  
          height={20}  
          fill="black"  
        />  
        
        {/* Targets */}  
        <Rect  
          x={300}  
          y={window.innerHeight - 120}  
          width={40}  
          height={40}  
          fill="black"  
        />  
        <Rect  
          x={350}  
          y={window.innerHeight - 180}  
          width={40}  
          height={40}  
          fill="black"  
        />  
      </Layer>  
    </Stage>  
  );  
};  

export default GameCanvas;