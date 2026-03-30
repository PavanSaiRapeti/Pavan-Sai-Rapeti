import React, { useMemo, useEffect } from 'react';
import Bubble from './Bubble';
import { Icon } from './icons/Icon';
import staticText from '../../content/staticText.json';

const Name = staticText.bubble.skillNames;
const skills = Name.map((name, index) => {
    return { icon: <Icon Name={name} />, name };
});

const generateUniqueSpawns = (count, maxWidth, maxHeight) => {
    const boxSize = 150;
    const minDistance = boxSize; // Ensuring no touching
    const spawns = [];

    let attempts = 0;
    const maxAttempts = 10000; // Prevent infinite loops

    while (spawns.length < count && attempts < maxAttempts) {
        const x = Math.floor(Math.random() * (maxWidth - boxSize));
        const y = Math.floor(Math.random() * (maxHeight - boxSize));
        let valid = true;

        // Check distance from all existing squares
        for (const pos of spawns) {
            const dx = Math.abs(pos.x - x);
            const dy = Math.abs(pos.y - y);
            if (dx < minDistance && dy < minDistance) {
                valid = false;
                break; // Found an overlap, retry
            }
        }

        if (valid) {
            spawns.push({ x, y });
        }

        attempts++;
    }

    if (attempts >= maxAttempts) {
        console.warn("Could not place all squares within given constraints.");
    }

    return spawns;
};

const bubbles =
generateUniqueSpawns(Name.length, 900, 700).map((spawn, index) => ({
        id: index + 1,
        randomSpawn: spawn,
        floatHeightX: Math.random() * index + 5,
        floatHeightY: Math.random() * index + 1,
        skillIcon: skills[index % skills.length].icon, 
        skillName: skills[index % skills.length].name,
    }))

const BubbleContainer = React.memo(() => {


    const handleBubbleClick = (id) => {
        console.log(`Bubble ${id} clicked!`);
    };

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            {bubbles.map(bubble => (
                <Bubble
                    key={bubble.id}
                    randomSpawn={bubble.randomSpawn}
                    onBubbleClick={() => handleBubbleClick(bubble.id)}
                    floatHeightX={bubble.floatHeightX}
                    floatHeightY={bubble.floatHeightY}
                    skillIcon={bubble.skillIcon}
                    skillName={bubble.skillName}
                />
            ))}
            <h2 className="text-[7rem] font-logo text-[#6f5e40] leading-[1] opacity-30">
               {staticText.bubble.heading}
            </h2>
            <span className='text-[0.7rem] text-black'>{staticText.bubble.joke}</span>
        </div>
    );
});

export default BubbleContainer;
