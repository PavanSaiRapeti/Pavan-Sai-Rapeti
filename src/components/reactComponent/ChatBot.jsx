// ChatBot.js
import React, { useState, useEffect, useRef } from 'react';
import WritingAnimation from './Skills';
import staticText from '../../content/staticText.json';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [isNull, setIsNull] = useState(true);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const handleSend = () => {
        if (input.trim()) {
            setMessages([...messages, { text: input, sender: 'user' }]);
            setInput('');
            // Simulate a bot response
            setTimeout(() => {
                setMessages(prevMessages => [...prevMessages, { text: staticText.chatBot.defaultBotResponse, sender: 'bot' }]);
            }, 1000);
        }
    };

    // Scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        if(messages.length > 0){
            setIsNull(false);
        }
    }, [messages]);

    return (
        <div className="overlay pointer-events-auto flex flex-col justify-center w-full h-full">
            <div className="overflow-y-auto mb-4 h-1/2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        <span className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
                            {msg.text}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={staticText.chatBot.inputPlaceholder}
                    className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={handleSend} className="p-2 bg-[#F96E2A] text-white rounded-r-lg">
                    {staticText.chatBot.sendButton}
                </button>
            </div>
            {/* <WritingAnimation />  */}
        </div>
    );
};

export default ChatBot;