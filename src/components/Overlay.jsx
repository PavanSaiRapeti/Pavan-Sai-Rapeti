import React from 'react';
import { ToggleButton } from './common/ToggleButton';
import GameCanvas from './GameCanvas';

const Overlay = ({setCamera}) => {
  return (
    <div className='flex justify-center items-center flex-col gap-6'>
    <div className=" flex justify-center overlay pointer-events-auto">
      <button className="" onClick={() => { setCamera(prev => !prev); }}>
        Change View
      </button>
      <ToggleButton />
    </div>
    {/* <div style={{ backgroundColor: 'white', width: '80vw', height: '80vh' }}>
    <GameCanvas /> 
    </div> */}
    </div>
  );
};

export default Overlay;
