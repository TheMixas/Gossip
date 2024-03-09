const express = require('express');
require('dotenv').config()
const auth = require('basic-auth');

const app = express();
const port = process.env.PORT || 5001;


// Allow only specific IP addresses
const devWhiteList = ['127.0.0.1', 'localhost'];
const prodWhiteList = ['https://gossip-server-c6dd76b8a875.herokuapp.com'];

const whitelist = process.env.NODE_ENV === 'production' ? prodWhiteList : devWhiteList;

//Create a middleware to allow only allowsa request with they secret key
function checkAuth(req, res, next) {
    const credentials = auth(req);
    console.log('credentials', credentials);
    if (credentials && credentials.name === process.env.AUTH_USER && credentials.pass === process.env.AUTH_PASS) {
        next();
    } else {
        res.status(401).send('Access denied, bad auth');
    }
}

app.use(checkAuth);

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.listen(port, () =>
    console.log(`Server is running on port ${port}`)
)

