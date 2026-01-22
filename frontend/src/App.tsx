import React, { useState, useRef, useEffect } from 'react';
import { Send, LogOut, Users } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: Date;
}

export default function ChatApp() {
  const socketRef = useRef<WebSocket | null>(null);


  const [roomCode, setRoomCode] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = () => {
    if (!roomCode.trim() || !username.trim()) return;
    setCurrentRoom(roomCode);
    setIsJoined(true);

    const ws = new WebSocket("ws://localhost:8080");
    socketRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: { roomId: roomCode, username }
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse (event.data);
      setMessages(prev => [...prev,{
        id: Date.now(),
        text: data.message,
        sender: data.type === "system" ? "system" : data.sender,
        timestamp: new Date()
      }]);
    };
  };

  const handleLeave = () => {
    socketRef.current?.close();
    setIsJoined(false);
    setMessages([]);
  };

  const handleSend = () => {
    if (!message.trim() || !socketRef.current) return;

    socketRef.current.send(JSON.stringify({
      type: "chat",
      payload: {
        roomId: currentRoom,
        message,
        username
      }
    }));

    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleSend();
  }
};


  if (!isJoined) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#D9ECBA' }}
      >
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-5">
          <h1 className="text-xl font-semibold text-gray-700">Join Room</h1>

          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none"
          />

          <input
            placeholder="Room code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none"
          />

          <button
            onClick={handleJoin}
            className="w-full bg-[#b7db8a] text-gray-800 py-2 rounded-lg hover:bg-[#a5cf73]"
          >
            Join
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex justify-center p-4"
      style={{ backgroundColor: '#D9ECBA' }}
    >
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-md flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2 text-gray-600">
            <Users size={18} />
            <span>Room: {currentRoom}</span>
          </div>

          <button
            onClick={handleLeave}
            className="flex items-center gap-2 text-red-500 hover:text-red-600"
          >
            <LogOut size={18} /> Leave
          </button>
        </div>

        {/* Messages */}
        <div
          className="flex-1  overflow-y-auto p-6 space-y-4"
          style={{ backgroundColor: '#edf6dd' }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === username
                  ? 'justify-end'
                  : msg.sender === 'system'
                  ? 'justify-center'
                  : 'justify-start'
              }`}
            >
              {msg.sender === 'system' ? (
                <span className="text-xs text-gray-400">
                  {msg.text}
                </span>
              ) : (
                <div
                  className={`max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                    msg.sender === username
                      ? 'bg-[#b7db8a] text-gray-800'
                      : 'bg-white text-gray-700'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <span className="text-[10px] opacity-70 mt-1 block text-right">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t flex gap-3 bg-white">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
          />


          <button
            onClick={handleSend}
            className="bg-[#b7db8a] text-gray-800 p-3 rounded-full hover:bg-[#a5cf73]"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}