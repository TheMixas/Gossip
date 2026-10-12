
export let apiURL = process.env.REACT_APP_REACT_ENV === 'production' ? 'https://gossip-server-c6dd76b8a875.herokuapp.com' : 'http://localhost:8080';
export default {apiURL}
console.log("apiURL: ", apiURL)