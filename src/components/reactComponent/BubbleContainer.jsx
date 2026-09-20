import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import Bubble from "./Bubble";
import { Icon } from "./icons/Icon";
import staticText from "../../content/staticText.json";

const Name = staticText.bubble.skillNames;
const skills = Name.map((name) => ({
  icon: <Icon key={name} Name={name} />,
  name,
}));

/**
 * Spread bubbles across the full playfield on a jittered grid
 * (wider gaps than random packing).
 */
const generateSpreadSpawns = (count, maxWidth, maxHeight, boxSize) => {
  const pad = Math.max(12, Math.floor(Math.min(maxWidth, maxHeight) * 0.04));
  const usableW = Math.max(boxSize, maxWidth - 2 * pad - boxSize);
  const usableH = Math.max(boxSize, maxHeight - 2 * pad - boxSize);

  const cols = Math.max(3, Math.ceil(Math.sqrt(count * (maxWidth / Math.max(maxHeight, 1)))));
  const rows = Math.max(3, Math.ceil(count / cols));
  const cellW = usableW / Math.max(cols - 1, 1);
  const cellH = usableH / Math.max(rows - 1, 1);

  const slots = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      slots.push({ r, c });
    }
  }
  // Prefer outer-ish slots first so spread reads across the screen
  slots.sort((a, b) => {
    const da = Math.hypot(a.c - (cols - 1) / 2, a.r - (rows - 1) / 2);
    const db = Math.hypot(b.c - (cols - 1) / 2, b.r - (rows - 1) / 2);
    return db - da;
  });

  const spawns = [];
  const jitterX = cellW * 0.22;
  const jitterY = cellH * 0.22;

  for (let i = 0; i < count && i < slots.length; i += 1) {
    const { r, c } = slots[i];
    let x = pad + c * cellW + (Math.random() - 0.5) * jitterX;
    let y = pad + r * cellH + (Math.random() - 0.5) * jitterY;
    x = Math.max(pad, Math.min(maxWidth - boxSize - pad, x));
    y = Math.max(pad, Math.min(maxHeight - boxSize - pad, y));
    spawns.push({ x: Math.floor(x), y: Math.floor(y) });
  }

  // If grid ran short, fill remaining with spaced randoms
  const minDist = boxSize * 1.75;
  let attempts = 0;
  while (spawns.length < count && attempts < 8000) {
    attempts += 1;
    const x = pad + Math.floor(Math.random() * usableW);
    const y = pad + Math.floor(Math.random() * usableH);
    const cx = x + boxSize / 2;
    const cy = y + boxSize / 2;
    let ok = true;
    for (const p of spawns) {
      if (Math.hypot(cx - (p.x + boxSize / 2), cy - (p.y + boxSize / 2)) < minDist) {
        ok = false;
        break;
      }
    }
    if (ok) spawns.push({ x, y });
  }

  return spawns;
};

const BubbleContainer = React.memo(function BubbleContainer() {
  const rootRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const w = Math.max(240, Math.floor(el.clientWidth || el.getBoundingClientRect().width));
      const h = Math.max(200, Math.floor(el.clientHeight || el.getBoundingClientRect().height));
      setSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    };

    measure();
    // Second tick catches flex layout settling (skills sheet open)
    const raf = requestAnimationFrame(measure);

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => measure());
      ro.observe(el);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
    };
  }, []);

  const { bubbles, frameSize } = useMemo(() => {
    if (size.w < 40 || size.h < 40) {
      return { bubbles: [], frameSize: 96 };
    }
    const short = Math.min(size.w, size.h);
    // Slightly smaller bubbles → more room to spread
    const wideEnough = size.w >= 640 && short >= 480;
    const maxBox = wideEnough ? 148 : 110;
    const minBox = wideEnough ? 88 : 64;
    const divisor = wideEnough ? 5.1 : 6.2;
    const box = Math.max(
      minBox,
      Math.min(maxBox, Math.floor(short / divisor))
    );
    const spawns = generateSpreadSpawns(Name.length, size.w, size.h, box);
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
            onBubbleClick={() => {}}
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
