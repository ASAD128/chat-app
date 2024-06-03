"use client";

import React, { useState } from 'react';

export default function Home() {
    // State to manage the conversation history
    const [messageHistory, setMessageHistory] = useState([]);
    const [response, setResponse] = useState(''); // Added state for response

    // Function to handle user input and update the conversation history
    const askTheAl = async (query) => {
        try {
            // Make a POST request to the /api/openai endpoint
            const apiResponse = await fetch('/api/openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }), // Sending user input as 'query'
            });

            // Parse the JSON response
            const data = await apiResponse.json();

            // Update the state with the response
            setResponse(data.response);

            // Update conversation history with user query and AI response
            setMessageHistory([
                ...messageHistory,
                { sender: 'User', content: query },
                { sender: 'Assistant', content: data.response },
            ]);
        } catch (error) {
            console.error('Error making API call:', error);
            // Handle the error as needed
        }
    };

    return (
        <div className="client h-screen flex flex-col items-center justify-center bg-blue-100 text-black">
            {/* Conversation History */}
            <div className="bg-white p-4 mb-4 w-full max-w-lg rounded-md">

                {/* Map through message history and render each message */}
                {messageHistory.map((message, index) => (
                    <div key={index} className="mb-2">
                        <p className={`text-gray-600 font-bold`}>{message.sender}:</p>
                        <p className={`bg-${message.sender === 'User' ? 'gray' : 'blue'}-200 rounded-md p-2`}>
                            {message.content}
                        </p>
                    </div>
                ))}
            </div>

            {/* Big textarea */}
            <textarea
                className="border border-gray-300 p-2 mb-2 w-full max-w-lg rounded-md text-black"
                placeholder="Type your message..."
                style={{ resize: 'none' }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const userInput = e.target.value;
                        askTheAl(userInput);
                        e.target.value = '';
                    }
                }}
            ></textarea>

            {/* Ask the AI button */}
            <button
                className="bg-blue-500 text-white p-2 rounded-md w-full max-w-lg mb-4"
                onClick={() => {
                    const userInput = document.querySelector('textarea').value;
                    askTheAl(userInput);
                }}
            >
                Ask the AI
            </button>
        </div>
    );
}
