import React from 'react';

const apps = [
    { name: 'Messages', color: 'bg-red-500' },
    { name: 'Photos', color: 'bg-green-500' },
    { name: 'Music', color: 'bg-blue-500' },
    { name: 'Settings', color: 'bg-gray-500' },
    { name: 'Browser', color: 'bg-yellow-500' },
    { name: 'Games', color: 'bg-purple-500' },
];

const PixelPhone = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="relative w-1/2 h-3/4 bg-black rounded-lg shadow-lg">
                {/* Screen */}
                <div className="absolute top-4 left-4 right-4 bottom-16 bg-black rounded-lg border-4 border-gray-600">
                    {/* App Icons */}
                    <div className="grid grid-cols-3 gap-2 p-2">
                        {apps.map((app, index) => (
                            <div
                                key={index}
                                className={`flex items-center justify-center h-12 ${app.color} rounded-lg text-white font-bold`}
                            >
                                {app.name}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Home Button */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-gray-600 rounded-full"></div>
                {/* Speaker */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-gray-600 rounded-full"></div>
                {/* Camera */}
                <div className="absolute top-2 right-4 w-4 h-4 bg-gray-600 rounded-full"></div>
            </div>
            {/* Hand Holding the Phone */}
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-20 w-32 h-32">
                <div className="relative w-full h-full">
                    {/* Palm */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-10 bg-brown-600 rounded-t-full"></div>
                    {/* Fingers */}
                    <div className="absolute left-0 w-4 h-12 bg-brown-600 rounded-full"></div>
                    <div className="absolute left-5 w-4 h-12 bg-brown-600 rounded-full"></div>
                    <div className="absolute left-10 w-4 h-12 bg-brown-600 rounded-full"></div>
                    <div className="absolute left-15 w-4 h-12 bg-brown-600 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default PixelPhone;