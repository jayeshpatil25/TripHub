// src/components/ChatBox.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { useTripStore } from '../store/useTripStore';
import { formatDistanceToNow } from 'date-fns';

const ChatBox = () => {
    const { socket, messages, typingUsers, initSocketListeners, sendMessage, emitTyping, emitStopTyping } = useChatStore();
    const { authUser } = useAuthStore();
    const { trip } = useTripStore();

    const [newMessage, setNewMessage] = useState('');
    const inputRef = useRef();
    const typingTimeoutRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (trip && authUser) {
            initSocketListeners(trip._id, authUser);
        }
    }, [trip]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleInput = (e) => {
        setNewMessage(e.target.value);

        emitTyping(trip._id, authUser);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            emitStopTyping(trip._id, authUser);
        }, 1000);
    };

    const handleSend = () => {
        if (!newMessage.trim()) return;
        sendMessage(trip._id, newMessage.trim());

        setNewMessage('');
        emitStopTyping(trip._id, authUser);
    };

    return (
        <div className="bg-white shadow rounded-xl p-4 mt-6 max-h-[500px] overflow-y-auto flex flex-col">
            <h2 className="text-xl font-semibold mb-2 text-blue-600">💬 Group Chat</h2>

            <div className="flex-1 overflow-y-auto space-y-2 mb-3">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`p-2 rounded-md max-w-[75%] ${msg.sender._id === authUser._id ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'
                            }`}
                    >
                        <div className="text-sm font-medium text-gray-800">
                            {msg.senderName || 'User'} {/*  Use persisted name */}
                        </div>
                        <div className="text-gray-700 text-sm">{msg.text}</div>
                        <div className="text-xs text-gray-400 text-right">
                            {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {typingUsers.length > 0 && (
                <div className="text-xs text-gray-500 italic mb-2">
                    {typingUsers.join(', ')} typing...
                </div>
            )}

            <div className="flex items-center gap-2">
                <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={handleInput}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
