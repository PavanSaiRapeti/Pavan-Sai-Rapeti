import { useScroll } from '@react-three/drei';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setScroll } from '../../redux/actions/cameraActions';

const ScrollBlink = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [bounceHeight, setBounceHeight] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isVisible) {
            const bounceInterval = setInterval(() => {
                setBounceHeight((prevHeight) => (prevHeight === 0 ? -20 : 0));
            }, 400);

            return () => clearInterval(bounceInterval);
        }
    }, [isVisible]);

    if (!isVisible) return null;
    return (
        <div style={{
            zIndex:'100',
            position: "absolute",
            bottom: "3%",
            right: "50%",
            transform: `translateY(${bounceHeight}px)`,
            transition: 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
            animation: 'bounce 1s infinite alternate ease-in-out',
            shapeRendering: 'crispEdges', 
            textRendering: 'optimizeLegibility', 
            imageRendering: 'pixelated'
        }}>
            <svg width={25} xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 267 512.46">
                <path fillRule="nonzero" d="M133.5 0c36.67 0 70.05 15.03 94.25 39.21l.06.07C251.99 63.47 267 96.84 267 133.5v151.22c0 36.67-15.03 70.04-39.21 94.24l-.06.06c-24.2 24.18-57.57 39.19-94.23 39.19-36.67 0-70.05-15.02-94.25-39.21l-.06-.06C15.01 354.74 0 321.37 0 284.72V133.5c0-36.67 15.03-70.04 39.21-94.25l.06-.06C63.47 15.02 96.84 0 133.5 0zM98.79 447.32l34.7 34.72 34.77-34.72 15.16 15.24-49.98 49.9-49.89-49.9 15.24-15.24zm34.71-130.89c12.5 0 22.74-10.23 22.74-22.73v-30.34c0-12.51-10.24-22.74-22.74-22.74-12.5 0-22.73 10.23-22.73 22.74v30.34c0 12.5 10.23 22.73 22.73 22.73zm0-294.87c-30.81 0-58.8 12.59-79.05 32.85-20.31 20.3-32.89 48.29-32.89 79.09v151.22c0 30.8 12.58 58.79 32.85 79.05 20.29 20.3 48.28 32.88 79.09 32.88 30.81 0 58.8-12.58 79.05-32.85 20.3-20.29 32.89-48.28 32.89-79.08V133.5c0-30.8-12.59-58.79-32.85-79.05-20.29-20.3-48.28-32.89-79.09-32.89z" />
            </svg>
        </div>
    );
};

export default ScrollBlink;
