import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import Bubble from "./Bubble";
import { Icon } from "./icons/Icon";
import staticText from "../../content/staticText.json";

const Name = staticText.bubble.skillNames;
const skills = Name.map((name) => {
  return { icon: <Icon key={name} Name={name} />, name };
});

const generateUniqueSpawns = (count, maxWidth, maxHeight, boxSize) => {
  const spawns = [];
  let attempts = 0;
  const maxAttempts = 28000;
  /** Keep bubbles inside the playfield: float animation uses ~10px translate + tooltip/subpixel */
  const pad = Math.min(
    16,
    Math.max(8, Math.floor(Math.min(maxWidth, maxHeight) * 0.05))
  );
  const innerW = Math.max(boxSize, maxWidth - 2 * pad);
  const innerH = Math.max(boxSize, maxHeight - 2 * pad);
  const xSpan = Math.max(1, innerW - boxSize);
  const ySpan = Math.max(1, innerH - boxSize);

  /**
   * Minimum center-to-center distance so bubbles don’t cluster (old rule only blocked a small axis box).
   * Ease off slightly when the playfield is tight so all skills can still spawn.
   */
  const minSide = Math.min(innerW, innerH);
  const loose = boxSize * 1.4;
  const tightPack = Math.max(boxSize * 1.08, (minSide / Math.sqrt(count + 3)) * 1.15);
  const minCenterDistClamped = Math.min(loose, Math.max(tightPack, boxSize * 1.22));

  const half = boxSize / 2;

  while (spawns.length < count && attempts < maxAttempts) {
    const x = pad + Math.floor(Math.random() * xSpan);
    const y = pad + Math.floor(Math.random() * ySpan);
    const cx = x + half;
    const cy = y + half;
    let valid = true;
    for (const pos of spawns) {
      const d = Math.hypot(cx - (pos.x + half), cy - (pos.y + half));
      if (d < minCenterDistClamped) {
        valid = false;
        break;
      }
    }
    if (valid) spawns.push({ x, y });
    attempts += 1;
  }

  if (attempts >= maxAttempts) {
    console.warn("Could not place all squares within given constraints.");
  }
  return spawns;
};

const BubbleContainer = React.memo(function BubbleContainer() {
  const rootRef = useRef(null);
  const [size, setSize] = useState({ w: 480, h: 380 });

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr) return;
      setSize({
        w: Math.max(240, Math.floor(cr.width)),
        h: Math.max(200, Math.floor(cr.height)),
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { bubbles, frameSize } = useMemo(() => {
    const short = Math.min(size.w, size.h);
    const wideEnough = size.w >= 640 && short >= 480;
    const maxBox = wideEnough ? 176 : 130;
    const minBox = wideEnough ? 112 : 72;
    const divisor = wideEnough ? 4.15 : 5.5;
    const box = Math.max(
      minBox,
      Math.min(maxBox, Math.floor(short / divisor))
    );
    const spawns = generateUniqueSpawns(Name.length, size.w, size.h, box);
    const list = spawns.map((spawn, index) => ({
      id: index + 1,
      randomSpawn: spawn,
      floatHeightX: Math.random() * index + 5,
      floatHeightY: Math.random() * index + 1,
      skillIcon: skills[index % skills.length].icon,
      skillName: skills[index % skills.length].name,
    }));
    return { bubbles: list, frameSize: box };
  }, [size]);

  const handleBubbleClick = (id) => {
    console.log(`Bubble ${id} clicked!`);
  };

  return (
    <div className="bubble-playfield flex h-full min-h-0 w-full max-w-full flex-col items-center justify-start overflow-hidden md:justify-center">
      <div
        ref={rootRef}
        className="bubble-playfield-inner relative mx-auto min-h-0 w-full max-w-full flex-1 overflow-hidden"
      >
        {bubbles.map((bubble) => (
          <Bubble
            key={bubble.id}
            randomSpawn={bubble.randomSpawn}
            onBubbleClick={() => handleBubbleClick(bubble.id)}
            floatHeightX={bubble.floatHeightX}
            floatHeightY={bubble.floatHeightY}
            skillIcon={bubble.skillIcon}
            skillName={bubble.skillName}
            frameSize={frameSize}
          />
        ))}
      </div>
      <div className="bubble-footer flex w-full max-w-full min-w-0 shrink-0 flex-col items-center gap-1 px-2 pt-2 pb-3 text-center">
        <h2 className="bubble-heading font-logo w-full max-w-full min-w-0 break-words text-[#6f5e40] leading-[1.05] opacity-30">
          {staticText.bubble.heading}
        </h2>
        <span className="bubble-joke text-black max-w-full min-w-0 break-words text-balance">
          {staticText.bubble.joke}
        </span>
      </div>
    </div>
  );
});

export default BubbleContainer;
