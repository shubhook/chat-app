# Chat App

A real-time chat application with room-based messaging built with React and WebSockets.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, TypeScript, WebSocket (ws)

## Getting Started

### Prerequisites

- Node.js (v18+)

### Installation

1. **Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   The WebSocket server runs on `ws://localhost:8080`

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The app runs on `http://localhost:5173`

## Features

- Real-time messaging via WebSockets
- Room-based chat (join specific rooms)
- System notifications when users join

## Project Structure

```
chat-app/
├── backend/
│   ├── src/
│   │   └── index.ts        # WebSocket server
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx         # Main React component
│   │   ├── App.css
│   │   ├── main.tsx        # Entry point
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
└── README.md
```
