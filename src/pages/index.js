import Head from "next/head";
import dynamic from "next/dynamic";
import staticText from "../content/staticText.json";
import RealmLoadingOverlay from "../components/RealmLoadingOverlay";
import { useRealmLoadGate, resolveRealmSweepMs } from "../hooks/useRealmLoadGate";

const Scene = dynamic(() => import("../components/three/Scene"), {
  ssr: false,
});

export default function Home() {
  const minSweepMs = resolveRealmSweepMs(staticText.loading);
  const { realmReady, loadPercent, onAssetsLoaded } = useRealmLoadGate(minSweepMs);
  const gifPreload = staticText.loading?.animeGifSrc;

  return (
    <div>
      <Head>
        <title>{staticText.meta.title}</title>
        <meta name="description" content={staticText.meta.description} />
        <link rel="icon" href={process.env.NEXT_PUBLIC_FAVICON} />
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
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Scene onAssetsLoaded={onAssetsLoaded} />
      </div>
    </div>
  );
}
