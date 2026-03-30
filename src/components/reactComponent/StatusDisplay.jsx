import React, { useEffect, useState } from 'react';
import staticText from '../../content/staticText.json';

const StatusDisplay = React.memo(() => {
    const [role, setRole] = useState(staticText.statusDisplay.roles[3]);

    useEffect(() => {
      const roles = staticText.statusDisplay.roles;
      let index = 0;
  
      const interval = setInterval(() => {
        setRole(roles[index]);
        index = (index + 1) % roles.length;
      }, 3000); // Change role every 3 seconds
  
      return () => clearInterval(interval); // Cleanup on unmount
    }, []);
    return (
        <div className="h-full text-center flex flex-col justify-center">
            <p className="text-gray-700 pt-10 text-[0.8rem]">
                {staticText.statusDisplay.availabilityLabel}
            </p>
            <h2 className="text-[7rem] font-logo leading-[1] ">
                {staticText.statusDisplay.introPrefix} <span className="text-black underline">{role}</span>
            </h2>
            <div className="text-gray-700 pt-10 text-center">
                <h3 className="text-[1.5rem] font-bold">{staticText.statusDisplay.footerTitle}</h3>
                <p className="text-[0.8rem] mt-4">
                    {staticText.statusDisplay.description}
                </p>
            </div>
            
        </div>
    );
});

export default StatusDisplay; 