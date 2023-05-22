const express = require('express');
const cors = require('cors');
const ejs = require('ejs');
const rateLimiter = require("express-rate-limit");
const router_routes = require('./routes/route');

require('dotenv').config();

const app = express();

const limiter = rateLimiter({
    max: 4,
    windowMs: 1000,
    message: "Too many request from this IP, please try again in few seconds."
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.listen(process.env.PORT, function () {
    console.log(`Server started at ${process.env.PORT}`);
});

app.get('/', limiter, (req, res) => {
    res.redirect('/path/index');
});

// END POINTS
app.use('/path', limiter, router_routes);