'use strict';

const { WebClient } = require('@slack/web-api');

const {
    addUsersToGoogleSheet,
    addUserPreferenceToSheet,
    addUserInterestsToSheet
} = require('../integration-service/goggle-sheet-interpreter');
const {
    OPT_IN_OUT_PREFERENCE,
    SLACK_NATIVE,
    CONNECTION_PREFERENCE,
    INTERESTS_PREFERENCE
} = require('./slack-event-types');
const interactiveMessageAckBlock = require('./message-templates/interactiveMessageAckBlock');
const nodeCache = require('../helpers/nodeCache');

const web = new WebClient(process.env.BOT_TOKEN);

const postAMessage = (text, blocks, channel) => web.chat.postMessage({ text, blocks, channel });

const updateAMessage = (ts, text, blocks, channel) => web.chat.update({ ts, text, blocks, channel });

const checkForMessageInCache = (messageTs) => nodeCache.get(messageTs);

const ackMessage = async (ts, channel, blocks, text, overrideText) => {
    blocks.pop();
    blocks.push(interactiveMessageAckBlock(overrideText));
    await updateAMessage(ts, text, blocks, channel);
}

const handleMessageEvent = async (eventType, user, action, ts, channel) => {
    const { value, selected_options } = action;
    switch (eventType) {
        case OPT_IN_OUT_PREFERENCE: {
            if (ts && channel) {
                const { text, blocks } = require('./message-templates/optInOutPreference');
                await ackMessage(ts, channel, blocks, text);
            }
            if (value === 'opt_me_in') {
                await addUserPreferenceToSheet(user);
                await chooseInterests(user);
                break;
            }
            const { text, blocks } = require('./message-templates/optOut');
            await postAMessage(text, blocks, user);
            break;
        }
        case CONNECTION_PREFERENCE: {
            if (ts && channel) {
                const { text, blocks } = require('./message-templates/connectionPreference');
                await ackMessage(ts, channel, blocks, text);
            }
            if (value === 'like_me') {
                // Call UiP bot to connect with random person
                break;
            }
            const { text, blocks } = require('./message-templates/surpriseMe');
            await postAMessage(text, blocks, user);
            break;
        }
        case INTERESTS_PREFERENCE: {
            const minimumChoiceCount = 5;
            const interests = selected_options.map(so => so.value);
            if (interests.length < minimumChoiceCount) {
                break;
            }
            if (ts && channel) {
                const { text, blocks } = require('./message-templates/chooseInterests');
                const message = `You chose *${interests.join(', ')}*`;
                await ackMessage(ts, channel, blocks, text, message);
            }
            await addUserInterestsToSheet(user, interests);
            await checkConnectionPreference(user);
            break;
        }
        default: {
            console.log('Unhandled event received', eventType);
            break;
        }
    }

};

const checkConnectionPreference = async (userId) => {
    const { text, blocks } = require('./message-templates/connectionPreference');
    const { ok, ts } = await postAMessage(text, blocks, userId);
    if (ok) {
        nodeCache.set(ts, getPreferenceCacheObject(ts, userId, CONNECTION_PREFERENCE));
    }
};

const chooseInterests = async (userId) => {
    const { text, blocks } = require('./message-templates/chooseInterests');
    const { ok, ts } = await postAMessage(text, blocks, userId);
    if (ok) {
        nodeCache.set(ts, getPreferenceCacheObject(ts, userId, INTERESTS_PREFERENCE));
    }
};

const askForOptingInPreference = async (userId) => {
    const { text, blocks } = require('./message-templates/optInOutPreference');
    const { ok, ts } = await postAMessage(text, blocks, userId);
    if (ok) {
        nodeCache.set(ts, getPreferenceCacheObject(ts, userId, OPT_IN_OUT_PREFERENCE));
    }
};

const handleSlackEvent = async (eventType, payload) => {
    try {
        const { container, actions } = payload;
        switch (eventType) {
            case SLACK_NATIVE.BLOCK_ACTIONS:
                const { message_ts, channel_id } = container;
                const messageDetails = checkForMessageInCache(message_ts)// || { "userId": "U03LQPB0Q3W", "ts": "1656056324.025399", "type": "opt-in-out-preference", "recordedTimeStamp": 1656056327812 };
                if (messageDetails) {
                    await handleMessageEvent(messageDetails.type, messageDetails.userId, actions[0], message_ts, channel_id);
                }
                break;
            default:
                console.log('Unhandled event received', eventType);
        }
    } catch (err) {
        console.error('Oops something went wrong!!', err);
    }
};

const getPreferenceCacheObject = (ts, userId, type) => ({ userId, ts, type, recordedTimeStamp: new Date().getTime() });

module.exports = {
    addUsersToGoogleSheet: async () => {
        const users = await web.users.list();
        await addUsersToGoogleSheet(users.members)
    },
    postAMessage,
    handleSlackEvent,
    askForOptingInPreference,
    checkConnectionPreference,
    chooseInterests,
};
