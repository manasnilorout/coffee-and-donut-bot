require('dotenv').config();

const { connectWithRandomPeople } = require('./slack/slack-bot');
const { getRandomUsersFromDifferentInterests } = require('./integration-service/google-sheet-interpreter');

// const expChannelId = 'C03LQPS231A' 
const expChannelId = 'U03LQPB0Q3W'

const testMethod = async () => {
    const channel = expChannelId;

    try {
        const r = await connectWithRandomPeople('U03LQPB0Q3W');
        console.log('--------->', r);
    } catch (e) {
        console.log(e);
    }
};

testMethod();
