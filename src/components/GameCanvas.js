// src/GameCanvas.js  

import Matter from 'matter-js';
import React, { useRef, useEffect, useState } from 'react';  
import { Stage, Layer, Rect } from 'react-konva';  

const GameCanvas = () => {  
  const [birds, setBirds] = useState([]);
  const [targets, setTargets] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [birdPosition, setBirdPosition] = useState({ x: 100, y: 500 });
  const engine = useRef(Matter.Engine.create());
  const stageRef = useRef();

  useEffect(() => {
    // Create targets
    const target1 = Matter.Bodies.rectangle(600, 500, 50, 50, { isStatic: true });
    const target2 = Matter.Bodies.rectangle(650, 450, 50, 50, { isStatic: true });
    Matter.World.add(engine.current.world, [target1, target2]);
    setTargets([target1, target2]);

    // Run the engine
    Matter.Engine.run(engine.current);
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
  };

  const handleMouseUp = (e) => {
    if (isDragging) {
      const mousePos = stageRef.current.getPointerPosition();
      const force = {
        x: (birdPosition.x - mousePos.x) * 0.05,
        y: (birdPosition.y - mousePos.y) * 0.05,
      };
      const bird = Matter.Bodies.circle(birdPosition.x, birdPosition.y, 15);
      Matter.Body.applyForce(bird, bird.position, force);
      Matter.World.add(engine.current.world, bird);
      setBirds((prev) => [...prev, bird]);
      setIsDragging(false);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const mousePos = stageRef.current.getPointerPosition();
      setBirdPosition({ x: mousePos.x, y: mousePos.y });
    }
  };

  return (  
      <Stage
        width={800}
        height={600}
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <Layer>
          {/* Draw birds */}
          {birds.map((bird, index) => (
            <Circle key={index} x={bird.position.x} y={bird.position.y} radius={15} fill="black" />
          ))}
          {/* Draw targets */}
          {targets.map((target, index) => (
            <Rect
              key={index}
              x={target.position.x - 25}
              y={target.position.y - 25}
              width={50}
              height={50}
              fill="black"
            />
          ))}
          {/* Draw the slingshot */}
          <Rect x={80} y={500} width={10} height={50} fill="black" />
          <Rect x={90} y={500} width={10} height={50} fill="black" />
        </Layer>
      </Stage>
    );
};  

export default GameCanvas;