require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

const dns = require('dns');
const port = 3000;

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }));

const arr = [];

app.post('/api/shorturl', (req, res) => {
    const url = req.body.url;

  
    const { hostname } = new URL(url);

    dns.lookup(hostname, (err, address, family) => {
        if (err) {
            res.json({ error: 'Invalid URL' });
            return;
        }

        if (!arr.includes(url)) {
            arr.push(url);
            res.json({
                original_url: url,
                short_url: arr.indexOf(url)
            });
        } else {
            res.json({
                original_url: url,
                short_url: arr.indexOf(url)
            });
        }
    });
});

app.get('/api/shorturl/:number', (req, res) => {
    let number = req.params.number;

    if (arr[number]) {
        res.redirect(arr[number]);
    } else {
        res.json({
            "error": "No URL has been found"
        });
    }
});

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
    res.json({ greeting: 'hello API' });
});

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
