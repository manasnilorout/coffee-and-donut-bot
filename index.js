'use strict';
require('dotenv').config();

const express = require('express');
const { urlencoded, json } = require('body-parser');
const app = express();
const port = process.env.PORT || 5001;

app.use(urlencoded({ extended: true }));
app.use(json());

const { handleSlackEvent, askForOptingInPreference, createDMBetweenTwoPeople } = require('./slack/slack-bot');

app.get('/', function (req, res) {
    res.json({
        app: require('./package.json'),
        time: new Date().toISOString(),
    })
});

app.post('/slack-events', async (req, res) => {
    // console.log(req.body);
    if (req.body && req.body.payload) {
        const payload = JSON.parse(req.body.payload);
        handleSlackEvent(payload.type, payload);
    } else if (req.body && req.body.command){
        handleSlackEvent('command', req.body);
    }
    res.json({ success: true });
});

app.post('/start-a-dm/:user1/:user2', async (req, res) => {
    return res.json(await createDMBetweenTwoPeople(req.params.user1, req.params.user2).catch(e => e));
});

app.post('/ask-preference/:userId', async (req, res) => {
    await askForOptingInPreference(req.params.userId);
    return res.json({ success: true });
});

app.listen(port, () => console.log(`App started on port: ${port}`));