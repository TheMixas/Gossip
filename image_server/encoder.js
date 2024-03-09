require('dotenv').config()
let username = process.env.AUTH_USER;
let password = process.env.AUTH_PASS;
let encodedCredentials = btoa(`${username}:${password}`);
console.log(encodedCredentials);