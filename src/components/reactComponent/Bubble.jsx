import React, { useState, useEffect, useCallback } from "react";

const Bubble = React.memo(({
  randomSpawn,
  onBubbleClick,
  skillIcon,
  skillName,
  floatHeightX,
  floatHeightY,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const totalFrames = 9;
  const framesPerRow = 3;
  const [isClicked, setIsClicked] = useState(false);
  const [position] = useState({ x: randomSpawn.x, y: randomSpawn.y });
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = useCallback(() => {
    if (isClicked) return;
    setShowTooltip(false);
    setIsClicked(true);
    setIsAnimating(true);
    setCurrentFrame(5);
    onBubbleClick();
    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        if (prev < totalFrames - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsAnimating(false);
          return prev;
        }
      });
    }, 100);
  }, [isClicked, onBubbleClick]);

  const frameWidth = 150;
  const frameHeight = 150;

  const backgroundPositionX = -(currentFrame % framesPerRow) * frameWidth;
  const backgroundPositionY =
    -Math.floor(currentFrame / framesPerRow) * frameHeight;

  return (
    <div
      id={`bubble-${randomSpawn.x}-${randomSpawn.y}`}
      className={`absolute w-100 h-100 overlay ${
        isClicked ? "pointer-events-none" : "pointer-events-auto"
      } bubble-animation floating-bubble`}
      onClick={handleClick}
      style={{
        cursor: "pointer",
        position: "absolute",
        top: position.y ,
        left: position.x ,
      }}
      onMouseEnter={() => {
        setShowTooltip(true);
      }}
      onMouseLeave={() => {
        setShowTooltip(false);
      }}
    >
      <div className="flex flex-col justify-center items-center w-100 h-100">
        <div
          style={{
            width: frameWidth,
            height: frameHeight,
            backgroundImage: `url('/images/bubble.png')`,
            backgroundPosition: `${backgroundPositionX}px ${backgroundPositionY}px`,
            backgroundSize: `${frameWidth * framesPerRow}px ${
              frameHeight * 3
            }px`,
            opacity: 0.3,
          }}
        ></div>
        {!isAnimating && (
          <div className="w-100 h-100">
            <span className="text-6xl ">{!isClicked ? skillIcon : ""}</span>
          </div>
        )}
        {showTooltip && (
          <div className="pl-9 text-black text-sm rounded  opacity-50">
            {skillName}
          </div>
        )}
      </div>
    </div>
  );
});

export default Bubble;
