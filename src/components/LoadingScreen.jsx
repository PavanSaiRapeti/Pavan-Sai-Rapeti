import Image from 'next/image';
import staticText from '../content/staticText.json';

/** Legacy simple loader; the home page uses RealmLoadingOverlay. */
const LoadingScreen = () => {
  const gif = staticText.loading?.animeGifSrc ?? "/images/myanime.gif";
  return (
    <div className="loading-screen">
      <p className="m-0 flex flex-col justify-center items-center fixed text-xl">
        <Image
          src={gif}
          alt={staticText.loading.imageAlt}
          width={100}
          height={100}
          unoptimized
        />
        {staticText.loading.label}
      </p>
    </div>
  );
};

export default LoadingScreen; 