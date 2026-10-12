// In production the server also serves this app, so API calls go to the same origin ("").
// During local development (npm start on :3000) the API runs separately on :8080.
export let apiURL = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '';
export default {apiURL}
