import React from "react";
import dynamic from 'next/dynamic';

const Main = dynamic(() => import('../Main'), {
  ssr: false,
});

const MyCanva = ({ currentIndex }) => {
    return (
        <div className="flex flex-row w-full h-full">
            <div className="w-1/2">
                {/* Optional content can be added here */}
            </div>
            <div className="w-1/2">
                <Main />
            </div>
        </div>
    );
};

export default MyCanva;
