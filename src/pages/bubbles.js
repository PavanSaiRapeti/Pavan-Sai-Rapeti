import React from 'react';
import Bubble from '../components/reactComponent/Bubble';
import { Icon } from '../components/reactComponent/icons/Icon';
import staticText from '../content/staticText.json';

const Name = staticText.bubble.skillNames;
const skills = Name.map((name) => {
    return { icon: <Icon Name={name} />, name };
});

const generateUniqueSpawns = (count, maxWidth, maxHeight) => {
    const boxSize = 150; // Square box size
    const minDistance = boxSize; // Minimum distance between squares (no touching)
    const spawns = new Set();
    const grid = new Map(); // To store occupied cells

    const getGridKey = (x, y) => `${Math.floor(x / boxSize)}_${Math.floor(y / boxSize)}`;

    let attempts = 0;
    const maxAttempts = 10000; // Max attempts before stopping

    while (spawns.size < count && attempts < maxAttempts) {
        const x = Math.floor(Math.random() * (maxWidth - boxSize));
        const y = Math.floor(Math.random() * (maxHeight - boxSize));

        const valid = !checkSurroundingGrid(x, y, grid, minDistance);

        if (valid) {
            spawns.add(`${x},${y}`); // Add position to the set
            const gridKey = getGridKey(x, y);
            grid.set(gridKey, true);
        }

        attempts++;
    }

    if (attempts >= maxAttempts) {
        console.warn("Could not place all squares within given constraints.");
    }

    return Array.from(spawns).map(pos => {
        const [x, y] = pos.split(',').map(Number);
        return { x, y };
    });

    function checkSurroundingGrid(x, y, grid, minDistance) {
        const keysToCheck = [
            getGridKey(x, y),
            getGridKey(x + boxSize, y),
            getGridKey(x - boxSize, y),
            getGridKey(x, y + boxSize),
            getGridKey(x, y - boxSize)
        ];

        for (const key of keysToCheck) {
            if (grid.has(key)) {
                return true; // Found an overlap
            }
        }

        return false; // No overlap in neighboring cells
    }
};

const BubbleContainer = ({ bubbles }) => {
    const handleBubbleClick = (id) => {
        console.log(`Bubble ${id} clicked!`);
    };

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            {bubbles.map((bubble) => (
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
};

// Server-side rendering function
export async function getServerSideProps() {
    const bubbles = generateUniqueSpawns(Name.length, 900, 800).map((spawn, index) => ({
        id: index + 1,
        randomSpawn: spawn,
        floatHeightX: Math.random() * index + 5,
        floatHeightY: Math.random() * index + 1,
        skillIcon: skills[index % skills.length].icon,
        skillName: skills[index % skills.length].name,
    }));

    return {
        props: {
            bubbles, // Pass bubbles data to the component
        },
    };
}

export default BubbleContainer; 