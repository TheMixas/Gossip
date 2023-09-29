import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
//change back
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://llocalhost:8080';

export const socket = io(URL, {
    withCredentials: true,
});