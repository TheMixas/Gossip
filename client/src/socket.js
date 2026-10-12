import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object

const URL = process.env.REACT_APP_REACT_ENV === 'production' ? 'https://gossip-server-c6dd76b8a875.herokuapp.com' : 'http://localhost:8080';
console.log("SOCKET URI: ", URL)
export const socket = io(URL, {
    withCredentials: true,
});