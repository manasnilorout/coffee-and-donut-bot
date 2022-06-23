'use strict';

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('/', function (req, res) {
    res.json({
        app: require('./package.json'),
        time: new Date().toISOString(),
    })
});

app.post('/slack-events', function (req, res) {
    console.log(req.body);
    res.json({success: true});
});

app.listen(port, () => console.log(`App started on port: ${port}`));