import React, { useEffect, useState } from 'react';
import staticText from '../../content/staticText.json';


const WritingAnimation = ({  speed = 100 }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentSkillIndex, setCurrentSkillIndex] = useState(0);

    useEffect(() => {
        if (currentSkillIndex < skills.length) {
            let index = 0;
            const skill = skills[currentSkillIndex];
            const intervalId = setInterval(() => {
                if (index < skill.length) {
                    setDisplayedText((prev) => prev + skill.charAt(index));
                    index++;
                } else {
                    clearInterval(intervalId);
                    // Move to the next skill after a short delay
                    setTimeout(() => {
                        setDisplayedText(''); // Clear the text
                        setCurrentSkillIndex((prev) => prev + 1); // Move to the next skill
                    }, 1000); // Delay before showing the next skill
                }
            }, speed);

            return () => clearInterval(intervalId);
        }
    }, [currentSkillIndex, skills, speed]);

    return (
        <div className="text-2xl font-mono">
            {staticText.skills.typingIntro}
            <span className="animate-pulse">|</span> {/* Cursor effect */}
        </div>
    );
};

export default WritingAnimation;