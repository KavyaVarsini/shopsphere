import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3003");

export default socket;
