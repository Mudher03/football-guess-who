import { io } from 'socket.io-client';

// In dev, Vite proxies socket.io → localhost:3001
// In production, connect to the same origin as the page
const URL = import.meta.env.DEV
  ? 'http://localhost:3001'
  : window.location.origin;

export const socket = io(URL, {
  autoConnect: false,  // we connect manually at the right moment
});
