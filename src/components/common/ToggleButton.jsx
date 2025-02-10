import React, { useState } from 'react';

export const ToggleButton = () => {
  const [active, setActive] = useState('projects');

  const buttons = [
    { label: 'PROJECTS', value: 'projects' },
    { label: 'EXPERIENCE', value: 'experience' },
    { label: 'CERTIFICATES', value: 'certificates' },
    { label: 'ABOUT ME', value: 'aboutMe' },
  ];

  return (
    <div className="flex bg-gray-200 rounded-full p-1">
      {buttons.map(button => (
        <button
          key={button.value}
          className={`flex-1 py-2 px-4 rounded-full font-bold transition-colors ${
            active === button.value ? 'bg-gray-800 text-white' : 'text-gray-800'
          }`}
          onClick={() => setActive(button.value)}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};
