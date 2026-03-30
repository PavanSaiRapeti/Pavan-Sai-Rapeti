import React, { useEffect, useState } from "react";
import staticText from "../../content/staticText.json";

const StatusDisplay = React.memo(function StatusDisplay() {
  const [role, setRole] = useState(staticText.statusDisplay.roles[3]);

  useEffect(() => {
    const roles = staticText.statusDisplay.roles;
    let index = 0;

    const interval = setInterval(() => {
      setRole(roles[index]);
      index = (index + 1) % roles.length;
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="status-display-root h-full min-h-0 text-center flex flex-col justify-center px-2 py-3 md:px-6 md:py-4 overflow-y-auto">
      <p className="status-availability text-gray-700 pt-1 md:pt-10 text-[clamp(0.7rem,2.8vw,0.8rem)]">
        {staticText.statusDisplay.availabilityLabel}
      </p>
      <h2 className="status-role-heading font-logo leading-[1.05] mt-1.5 md:mt-4 px-1 break-words">
        <span className="status-intro">{staticText.statusDisplay.introPrefix}</span>{" "}
        <span className="text-black underline decoration-2 underline-offset-4">{role}</span>
      </h2>
      <div className="status-body-block text-gray-700 pt-4 md:pt-10 text-center max-w-2xl mx-auto">
        <h3 className="status-footer-title font-bold text-[clamp(1rem,4vw,1.5rem)]">
          {staticText.statusDisplay.footerTitle}
        </h3>
        <p className="status-description text-[clamp(0.75rem,2.6vw,0.8rem)] mt-3 md:mt-4 leading-relaxed">
          {staticText.statusDisplay.description}
        </p>
      </div>
    </div>
  );
});

export default StatusDisplay;
