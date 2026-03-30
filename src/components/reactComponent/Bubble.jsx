import React, { useState, useCallback, useMemo, isValidElement, cloneElement } from "react";
import { useRealmPlayKick } from "../../context/RealmCursorContext";

const Bubble = React.memo(function Bubble({
  randomSpawn,
  onBubbleClick,
  skillIcon,
  skillName,
  floatHeightX: _floatHeightX,
  floatHeightY: _floatHeightY,
  frameSize = 150,
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const totalFrames = 9;
  const framesPerRow = 3;
  const [isClicked, setIsClicked] = useState(false);
  const [position] = useState({ x: randomSpawn.x, y: randomSpawn.y });
  const [showTooltip, setShowTooltip] = useState(false);
  const playKickRealm = useRealmPlayKick();

  const handleClick = useCallback(() => {
    playKickRealm({ skipCursorGate: true });
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
  }, [isClicked, onBubbleClick, playKickRealm]);

  const frameWidth = frameSize;
  const frameHeight = frameSize;

  const backgroundPositionX = -(currentFrame % framesPerRow) * frameWidth;
  const backgroundPositionY =
    -Math.floor(currentFrame / framesPerRow) * frameHeight;

  /** SVG skill icons scale with bubble frame (Icon forwards width/height to SVG). */
  const iconSvgPx = useMemo(
    () => Math.round(Math.min(70, Math.max(26, frameSize * 0.46))),
    [frameSize]
  );

  const scaledSkillIcon = useMemo(() => {
    if (!skillIcon || !isValidElement(skillIcon)) return skillIcon;
    return cloneElement(skillIcon, {
      width: String(iconSvgPx),
      height: String(iconSvgPx),
      layout: "center",
    });
  }, [skillIcon, iconSvgPx]);

  const spriteStyle = useMemo(
    () => ({
      position: "absolute",
      inset: 0,
      width: frameWidth,
      height: frameHeight,
      backgroundImage: `url('/images/bubble.png')`,
      backgroundPosition: `${backgroundPositionX}px ${backgroundPositionY}px`,
      backgroundSize: `${frameWidth * framesPerRow}px ${frameHeight * 3}px`,
      opacity: 0.3,
      pointerEvents: "none",
    }),
    [
      backgroundPositionX,
      backgroundPositionY,
      frameHeight,
      frameWidth,
      framesPerRow,
    ]
  );

  return (
    <div
      id={`bubble-${randomSpawn.x}-${randomSpawn.y}`}
      className={`bubble-hitbox absolute overlay bubble-animation floating-bubble ${
        isClicked ? "pointer-events-none" : "pointer-events-auto"
      }`}
      onClick={handleClick}
      style={{
        top: position.y,
        left: position.x,
        width: frameWidth,
        height: frameHeight,
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className="relative h-full w-full"
        style={{ width: frameWidth, height: frameHeight }}
      >
        <div aria-hidden style={spriteStyle} />
        {!isAnimating && (
          <div
            className="bubble-icon-layer absolute inset-0 overflow-hidden"
            style={{ zIndex: 1, pointerEvents: "none" }}
          >
            {!isClicked ? (
              <div className="bubble-skill-icon">{scaledSkillIcon}</div>
            ) : null}
          </div>
        )}
        {showTooltip && !isClicked ? (
          <div
            className="absolute left-1/2 top-full z-[2] mt-1 -translate-x-1/2 whitespace-nowrap rounded px-1 text-sm text-black opacity-60"
            style={{ pointerEvents: "none" }}
          >
            {skillName}
          </div>
        ) : null}
      </div>
    </div>
  );
});

export default Bubble;
