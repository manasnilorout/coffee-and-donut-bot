'use strict';

const express = require('express');
const app = express();

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

app.listen(3000, () => console.log('App started on port: 3000'));