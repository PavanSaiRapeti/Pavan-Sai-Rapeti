import Head from "next/head";
import dynamic from "next/dynamic";
import staticText from "../content/staticText.json";
import PortraitRotatePrompt from "../components/PortraitRotatePrompt";
import RealmLoadingOverlay from "../components/RealmLoadingOverlay";
import { useRealmLoadGate, resolveRealmSweepMs } from "../hooks/useRealmLoadGate";
import { useMobilePortraitGate } from "../hooks/useMobilePortraitGate";
import useFullscreenShell from "../hooks/useFullscreenShell";

const Scene = dynamic(() => import("../components/three/Scene"), {
  ssr: false,
});

export default function Home() {
  const minSweepMs = resolveRealmSweepMs(staticText.loading);
  const { realmReady, loadPercent, onAssetsLoaded } = useRealmLoadGate(minSweepMs);
  const { showRotatePrompt } = useMobilePortraitGate();
  const gifPreload = staticText.loading?.animeGifSrc;
  useFullscreenShell();

  return (
    <div className="home-root">
      <Head>
        <title>{staticText.meta.title}</title>
        <meta name="description" content={staticText.meta.description} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <link rel="icon" href={process.env.NEXT_PUBLIC_FAVICON} />
        <link rel="apple-touch-icon" href="/images/favicon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link
          rel="preload"
          href="/fonts/child.ttf"
          as="font"
          type="font/ttf"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/Logo.ttf"
          as="font"
          type="font/ttf"
          crossOrigin=""
        />
        {gifPreload ? <link rel="preload" href={gifPreload} as="image" /> : null}
      </Head>
      <RealmLoadingOverlay visible={!realmReady} percent={loadPercent} />
      <PortraitRotatePrompt visible={showRotatePrompt} />
      <div className="home-scene-shell">
        <Scene onAssetsLoaded={onAssetsLoaded} />
      </div>
    </div>
  );
}
