'use strict';

const { WebClient } = require('@slack/web-api');

const {
    addUsersToGoogleSheet,
    addUserPreferenceToSheet,
    addUserInterestsToSheet,
    getARandomQuestion,
    getARandomGame,
    getRandomUsersFromDifferentInterests,
} = require('../integration-service/google-sheet-interpreter');
const {
    OPT_IN_OUT_PREFERENCE,
    SLACK_NATIVE,
    CONNECTION_PREFERENCE,
    INTERESTS_PREFERENCE,
    SLACK_COMMANDS,
} = require('./slack-event-types');
const interactiveMessageAckBlock = require('./message-templates/interactiveMessageAckBlock');
const buildQuestion = require('./message-templates/questionBlock');
const buildGameBlock = require('./message-templates/gameSuggestionBlock');
const nodeCache = require('../helpers/nodeCache');

const web = new WebClient(process.env.BOT_TOKEN);

const postAMessage = (text, blocks, channel) => web.chat.postMessage({ text, blocks, channel });

const updateAMessage = (ts, text, blocks, channel) => web.chat.update({ ts, text, blocks, channel });

const checkForMessageInCache = (messageTs) => nodeCache.get(messageTs);

const ackMessage = async (ts, channel, blocks, text, overrideText) => {
    const newBlocks = JSON.parse(JSON.stringify(blocks));
    newBlocks.pop();
    newBlocks.push(interactiveMessageAckBlock(overrideText));
    await updateAMessage(ts, text, newBlocks, channel);
}

const connectWithRandomPeople = async (user) => {
    const users = await getRandomUsersFromDifferentInterests(3, user);
    const { text, blocks } = require('./message-templates/suggestPeople')(users);
    await postAMessage(text, blocks, user);
};

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
            await connectWithRandomPeople(user);
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
                // Give a dummy frequency check question

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

const handleSlackCommand = async (command, payload) => {
    const { user_id, channel_id } = payload;
    switch (command) {
        case SLACK_COMMANDS.COFFEE: {
            await askForOptingInPreference(user_id);
            break;
        }
        case SLACK_COMMANDS.ASK_A_QUESTIONS: {
            const question = await getARandomQuestion(payload.text);
            const { text, blocks } = buildQuestion(question);
            await postAMessage(text, blocks, channel_id);
            break;
        }
        case SLACK_COMMANDS.SUGGEST_GAME: {
            const games = await getARandomGame();
            const { text, blocks } = buildGameBlock(games);
            await postAMessage(text, blocks, channel_id);
            break;
        }
        default: {
            console.log('Unhandled command received', payload);
            break;
        }
    }
};

const createDMBetweenTwoPeople = (primaryUser, connectedUser) => web.conversations.open({ users: `${primaryUser},${connectedUser}` });

const createDMBetweenTwoPeopleAndSayHi = async (primaryUser, connectedUser) => {
    const { channel } = await createDMBetweenTwoPeople(primaryUser, connectedUser);
    const { text, blocks } = require('./message-templates/connectedMessage');
    await postAMessage(text, blocks, channel.id);
};

const handleUncachedBlocakActionEvent = async (payload) => {
    const { user, actions } = payload;
    const primaryAction = actions[0];
    const { action_id, value } = primaryAction;
    switch (action_id) {
        case 'connect_me': {
            await createDMBetweenTwoPeopleAndSayHi(user.id, value);
            break;
        }
        default: {
            console.log('Unhandled block action.', payload);
            break;
        }
    }
};

const getEquivalentCommand = async (payload) => {
    console.log('Doing nothing with the shortcut', payload)
};

const handleSlackEvent = async (eventType, payload) => {
    try {
        const { container, actions, command } = payload;
        switch (eventType) {
            case SLACK_NATIVE.BLOCK_ACTIONS:
                const { message_ts, channel_id } = container;
                const messageDetails = checkForMessageInCache(message_ts);// || { "userId": "U03LQPB0Q3W", "ts": "1656056324.025399", "type": "opt-in-out-preference", "recordedTimeStamp": 1656056327812 };
                if (messageDetails) {
                    await handleMessageEvent(messageDetails.type, messageDetails.userId, actions[0], message_ts, channel_id);
                }
                await handleUncachedBlocakActionEvent(payload);
                break;
            case SLACK_NATIVE.SHORTCUT: {
                await getEquivalentCommand(payload);
                break;
            }
            case SLACK_NATIVE.COMMAND: {
                await handleSlackCommand(command, payload);
                break;
            }
            default:
                console.log('Unhandled event received', eventType);
                break;
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
    connectWithRandomPeople,
    createDMBetweenTwoPeople,
    createDMBetweenTwoPeopleAndSayHi,
};
