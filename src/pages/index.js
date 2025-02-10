import Head from 'next/head';
import Scene from '../components/three/Scene';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Pavan sai Rapeti</title>
        <link rel="icon" href="/images/favicon.png" />
      </Head>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
        <Scene />
      </div>
    </div>
  );
}
