const express = require('express');
const cors = require('cors');
const ejs = require('ejs');
const rateLimiter = require("express-rate-limit");
const router_routes = require('./routes/route');

require('dotenv').config();

const app = express();

// Create a store to hold the requests in a queue
const requestQueue = [];
// Apply rate limiting middleware with custom handler
const limiter = rateLimiter({
    max: 4,
    windowMs: 1000 * 60,
    handler: (req, res, next) => {
        requestQueue.push({ req, res, next });
    },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(limiter);
// Define a background process to handle the queued requests
setInterval(() => {
    if (requestQueue.length > 0) {
        // Process the oldest request from the queue
        const { req, res, next } = requestQueue.shift();
        limiter.resetKey(req.ip); // Reset the rate limit for the processed request
        limiter(req, res, next);
    }
}, 1000); // Process one request per second

app.listen(process.env.PORT, () => {
    console.log(`Server started at ${process.env.PORT}`);
});

app.get('/', (req, res) => {
    res.redirect('/path/index');
});

app.get('/test', (req, res) => {
    res.send('Testing');
});

// END POINTS
app.use('/path', router_routes);