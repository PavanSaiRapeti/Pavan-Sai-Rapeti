/** Shared checkerboard removal + image-ready helper for sprite textures (dino, fly guide, etc.). */

export function drawableDimensions(source) {
  if (!source) return { w: 0, h: 0 };
  if (typeof source.naturalWidth === "number" && source.naturalWidth > 0) {
    return { w: source.naturalWidth, h: source.naturalHeight };
  }
  if (typeof source.width === "number" && source.width > 0) {
    return { w: source.width, h: source.height };
  }
  return { w: 0, h: 0 };
}

export function subscribeDrawableReady(source, onReady) {
  if (!source) return () => {};
  let cancelled = false;
  const fire = () => {
    if (cancelled) return;
    const { w, h } = drawableDimensions(source);
    if (w > 0 && h > 0) onReady();
  };

  const { w, h } = drawableDimensions(source);
  if (w > 0 && h > 0) {
    queueMicrotask(fire);
    return () => {
      cancelled = true;
    };
  }

  if (source instanceof HTMLImageElement) {
    const onImg = () => fire();
    if (typeof source.decode === "function") {
      source.decode().then(onImg).catch(onImg);
    } else {
      source.addEventListener("load", onImg, { once: true });
      source.addEventListener("error", onImg, { once: true });
    }
    return () => {
      cancelled = true;
      source.removeEventListener("load", onImg);
      source.removeEventListener("error", onImg);
    };
  }

  queueMicrotask(fire);
  return () => {
    cancelled = true;
  };
}

export function stripMosaicBackground(source, bg) {
  if (bg && bg.apply === false) {
    return source;
  }
  const w = source.naturalWidth ?? source.width ?? 0;
  const h = source.naturalHeight ?? source.height ?? 0;
  if (!w || !h) return source;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return source;
  ctx.drawImage(source, 0, 0);
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;
  const maxSat =
    typeof bg?.maxSaturation === "number" && bg.maxSaturation >= 0
      ? bg.maxSaturation
      : 0.12;
  const minLum =
    typeof bg?.minLuminance === "number" &&
    bg.minLuminance >= 0 &&
    bg.minLuminance <= 1
      ? bg.minLuminance
      : 0.52;
  const keyDark =
    bg?.keyDarkChecker === true ||
    (typeof bg?.darkCheckerLuminanceMin === "number" &&
      typeof bg?.darkCheckerLuminanceMax === "number");
  const darkLumMin =
    typeof bg?.darkCheckerLuminanceMin === "number"
      ? bg.darkCheckerLuminanceMin
      : 0.28;
  const darkLumMax =
    typeof bg?.darkCheckerLuminanceMax === "number"
      ? bg.darkCheckerLuminanceMax
      : 0.5;
  const maxRgbSpread =
    typeof bg?.maxRgbSpreadForGrey === "number"
      ? bg.maxRgbSpreadForGrey
      : 0.055;
  const maxSatDark =
    typeof bg?.maxSaturationDark === "number"
      ? bg.maxSaturationDark
      : maxSat;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i] / 255;
    const g = d[i + 1] / 255;
    const b = d[i + 2] / 255;
    const mx = Math.max(r, g, b);
    const mn = Math.min(r, g, b);
    const sat = mx < 1e-5 ? 0 : (mx - mn) / mx;
    const lum = (r + g + b) / 3;
    const rgbSpread = mx - mn;
    let transparent = sat < maxSat && lum > minLum;
    if (!transparent && keyDark) {
      transparent =
        sat < maxSatDark &&
        lum >= darkLumMin &&
        lum <= darkLumMax &&
        rgbSpread <= maxRgbSpread;
    }
    if (transparent) {
      d[i + 3] = 0;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}
