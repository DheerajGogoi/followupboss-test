const express = require('express');
const cors = require('cors');
const ejs = require('ejs');
const router_routes = require('./routes/route');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

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