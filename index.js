'use strict';
require('dotenv').config();

const express = require('express');
const { urlencoded, json } = require('body-parser');
const app = express();
const port = process.env.PORT || 5001;

app.use(urlencoded({ extended: true }));
app.use(json());

const { handleSlackEvent, askForOptingInPreference } = require('./slack/slack-bot');

app.get('/', function (req, res) {
    res.json({
        app: require('./package.json'),
        time: new Date().toISOString(),
    })
});

app.post('/slack-events', async (req, res) => {
    console.log(req.body);
    if (req.body && req.body.payload) {
        const payload = JSON.parse(req.body.payload);
        handleSlackEvent(payload.type, payload);
    }
    res.json({ success: true });
});

app.post('/ask-preference/:userId', async (req, res) => {
    await askForOptingInPreference(req.params.userId);
    return res.json({ success: true });
});

app.listen(port, () => console.log(`App started on port: ${port}`));