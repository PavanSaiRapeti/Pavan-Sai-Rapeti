/**
 * Scroll chapters:
 * hero → paper flies in (wavy) → stick flat → fly off (wavy) → career → desk.
 */
export const SCROLL_CHAPTERS = {
  entranceHoldEnd: 0,
  /** Poster starts the instant scroll begins (no blank gap after hero) */
  posterLiftStart: 0,
  /** Paper reaches the lens */
  posterStickEnd: 0.08,
  /** Short beat on the lens */
  posterHoldEnd: 0.1,
  posterFlyOffEnd: 0.15,
  /** Career corridor */
  careerFadeInStart: 0.12,
  careerFullStart: 0.17,
  careerFullEnd: 0.58,
  careerFadeOutEnd: 0.66,
  deskFadeStart: 0.66,
  deskFadeFull: 0.88,
  dinoUnlock: 0.94,
  /** Hero stays until poster is well into frame (overlap, no blank) */
  heroFadeEnd: 0.055,
};

export const DESK_WORLD_Z = -2.85;

export const CAMERA_KEYS = {
  entrance: { x: 0, y: 2.05, z: 10.55, rotX: 0 },
  throughPoster: { x: 0, y: 2.06, z: 9.35, rotX: 0 },
  careerEnd: { x: 0, y: 2.1, z: -0.4, rotX: 0 },
  desk: { x: 0, y: 7.6, z: DESK_WORLD_Z - 0.15, rotX: -Math.PI / 2 },
};

export const CAREER_CAMERA = {
  start: CAMERA_KEYS.entrance,
  end: CAMERA_KEYS.careerEnd,
};

export const POSTER_STICK_Z = 9.75;
export const POSTER_GATE_Z = POSTER_STICK_Z;

/** @deprecated desk uses straight lerp now */
export const DESK_ARC = {
  mid: { x: 0, y: 5.6, z: -1.4, rotX: -0.85 },
  end: CAMERA_KEYS.desk,
};

export function scrollVisibility(t, chapters = SCROLL_CHAPTERS) {
  const {
    careerFadeInStart: a,
    careerFullStart: b,
    careerFullEnd: c,
    careerFadeOutEnd: d,
  } = chapters;
  if (t <= a || t >= d) return 0;
  if (t < b) return (t - a) / (b - a);
  if (t > c) return 1 - (t - c) / (d - c);
  return 1;
}

function easeInOut(u) {
  return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
}

function easeOutCubic(u) {
  const x = THREE_CLAMP01(u);
  return 1 - Math.pow(1 - x, 3);
}

function easeInCubic(u) {
  const x = THREE_CLAMP01(u);
  return x * x * x;
}

export function lerpPose(a, b, u) {
  const e = easeInOut(THREE_CLAMP01(u));
  return {
    x: a.x + (b.x - a.x) * e,
    y: a.y + (b.y - a.y) * e,
    z: a.z + (b.z - a.z) * e,
    rotX: a.rotX + (b.rotX - a.rotX) * e,
  };
}

function THREE_CLAMP01(u) {
  return u < 0 ? 0 : u > 1 ? 1 : u;
}

export function posterLiftProgress(t, chapters = SCROLL_CHAPTERS) {
  if (t <= chapters.posterLiftStart) return 0;
  if (t >= chapters.posterStickEnd) return 1;
  return easeInOut(
    (t - chapters.posterLiftStart) /
      (chapters.posterStickEnd - chapters.posterLiftStart)
  );
}

/** 0 while on-lens beat; then 0→1 fly-off (scroll only). Symmetric for reverse. */
export function posterFlyOffProgress(t, chapters = SCROLL_CHAPTERS) {
  if (t <= chapters.posterHoldEnd) return 0;
  if (t >= chapters.posterFlyOffEnd) return 1;
  return easeInOut(
    (t - chapters.posterHoldEnd) /
      (chapters.posterFlyOffEnd - chapters.posterHoldEnd)
  );
}

export function posterStickProgress(t, chapters = SCROLL_CHAPTERS) {
  return posterLiftProgress(t, chapters);
}

/** Kept for imports — straight blend to desk. */
export function sampleDeskArc(u) {
  return lerpPose(CAMERA_KEYS.careerEnd, CAMERA_KEYS.desk, u);
}

/**
 * Camera: hold through stick+hold beat, then straight corridor → straight desk.
 */
export function sampleCameraAtScroll(t) {
  const ch = SCROLL_CHAPTERS;
  const k = CAMERA_KEYS;

  if (t <= ch.posterHoldEnd) {
    return { ...k.entrance };
  }
  if (t < ch.posterFlyOffEnd) {
    const u =
      (t - ch.posterHoldEnd) / (ch.posterFlyOffEnd - ch.posterHoldEnd);
    return lerpPose(k.entrance, k.throughPoster, u);
  }
  if (t < ch.careerFadeOutEnd) {
    const u =
      (t - ch.posterFlyOffEnd) / (ch.careerFadeOutEnd - ch.posterFlyOffEnd);
    return lerpPose(k.throughPoster, k.careerEnd, u);
  }
  const u =
    (t - ch.careerFadeOutEnd) / Math.max(0.001, 1 - ch.careerFadeOutEnd);
  return lerpPose(k.careerEnd, k.desk, u);
}
