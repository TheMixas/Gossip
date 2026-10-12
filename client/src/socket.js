import { io } from 'socket.io-client';

// undefined = connect to the same origin that served the page (production).
const URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : undefined;

export const socket = io(URL, {
    withCredentials: true,
});
