import Head from 'next/head';
import CartoonEnvironment from '../components/three/CartoonEnvironment';

export default function Home() {
  return (
    <div>
      <Head>
      <title>Pavan sai Rapeti</title>
      <link rel="icon" href="/images/favicon.png" />
      </Head>
      <h1>Welcome to My Next.js and Three.js App</h1>
      <CartoonEnvironment />
    </div>
  );
}
