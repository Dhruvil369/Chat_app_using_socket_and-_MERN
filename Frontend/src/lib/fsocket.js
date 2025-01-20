import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5173";

// Initialize the Socket.IO client
export const socket = io(SOCKET_URL, {
  autoConnect: false, // Disable auto-connect to manage connections explicitly
  withCredentials: true, // Allow cross-origin cookies for authentication
});

// Handle connection events
socket.on("connect", () => {
  console.log("Connected to WebSocket server:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected from WebSocket server:", reason);
});

socket.on("connect_error", (error) => {
  console.error("WebSocket connection error:", error);
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
