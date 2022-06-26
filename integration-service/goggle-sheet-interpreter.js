'use strict';

const makeApiCall = require('../helpers/makeApiCall');
const { getRandomInt } = require('../helpers/helper');

const baseUrl = 'https://staging.cloud-elements.com/elements/api-v2/spreadsheets';
const spreadSheetId = '1GHigbP-YRCNfYR4wqnuvNQv5QJj31Y1IyjOkQsvUBQI';
const headers = {
    accept: 'application/json',
    Authorization: `User ${process.env.CE_USER}, Organization ${process.env.CE_ORG}, Element ${process.env.CE_GSHEET_ELEMENT_INSTANCE_TOKEN}`,
    'Content-Type': 'application/json'
};
const sheetConstants = {
    users: 'Slack-Users',
    preferences: 'Preferences',
    interests: 'Interests',
    questions: 'Questions',
    games: 'Games',
    userPreferencesCell: 'B1',
};

const constructObjectFromSheetsResponse = ({ values }) => {
    const keys = values[0];
    const tempObj = {};
    for (let i = 1; i < values.length; i++) {
        keys.forEach((k, ki) => {
            if (!tempObj[k]) tempObj[k] = [];
            if (values[i][ki]) tempObj[k].push(values[i][ki]);
        });
    }
    return tempObj;
}

const getUserPreferenceApiEndPoint = () => `${baseUrl}/${spreadSheetId}/worksheets/${sheetConstants.preferences}/rows/${sheetConstants.userPreferencesCell}`;
const getSheetMultiplesApiEndpoint = (sheetName) => `${baseUrl}/${spreadSheetId}/worksheets/${sheetName}/multiples`;
const getSpecificRowOfInterest = (rowNumber) => `${baseUrl}/${spreadSheetId}/worksheets/${sheetConstants.interests}/rows/B${rowNumber}`;

const getUsersOptedInFromSheet = async () => {
    const url = getUserPreferenceApiEndPoint();
    const response = await makeApiCall(url, undefined, headers);
    return response.data && response.data[0].split(',') || [];
};

const getUserInterests = async () => {
    const url = getSheetMultiplesApiEndpoint(sheetConstants.interests);
    const { values } = await makeApiCall(url, undefined, headers);
    const userIntrests = {};
    values.forEach(va => userIntrests[va[0]] = va[1] ? va[1].split(',') : []);
    return userIntrests;
};

const getSheetDetails = async (sheetName) => {
    const url = getSheetMultiplesApiEndpoint(sheetName);
    const response = await makeApiCall(url, undefined, headers);
    return constructObjectFromSheetsResponse(response);
};

const getARandomGame = async () => {
    const games = await getSheetDetails(sheetConstants.games);
    const randomIndex = getRandomInt(games.names.length + 1);
    return {
        name: games.names[randomIndex],
        link: games.links[randomIndex],
    }
};

const getARandomQuestion = async (category) => {
    const questions = await getSheetDetails(sheetConstants.questions);
    let context;
    if (category && questions[category]) {
        context = category;
    } else {
        context = Object.keys(questions)[getRandomInt(Object.keys(questions).length + 1)];
    }
    return {
        context,
        question: questions[context][getRandomInt(questions[context].length + 1)],
    };
};

module.exports = {
    addUsersToGoogleSheet: async (userObj) => {
        const url = getSheetMultiplesApiEndpoint(sheetConstants.users);

        const columns = Object.keys(userObj[0]);
        const values = [columns].concat(userObj.map(u => columns.map(c => u[c] && (typeof u[c] === 'string' ? u[c] : JSON.stringify(u[c])) || '')));

        const data = {
            majorDimension: 'ROWS',
            values
        };

        await makeApiCall(url, data, headers, 'post');
    },
    addUserPreferenceToSheet: async (user) => {
        const userPreferences = await getUsersOptedInFromSheet();
        if (userPreferences.indexOf(user) === -1) {
            userPreferences.push(user);
            const url = getUserPreferenceApiEndPoint();
            await makeApiCall(url, { data: [userPreferences.join(',')] }, headers, 'put');
        }
    },
    addUserInterestsToSheet: async (user, interests) => {
        const userInerests = await getUserInterests();
        for (let i = 0; i < interests.length; i++) {
            const usersWithSpecificInterest = userInerests[interests[i]];
            if (usersWithSpecificInterest && usersWithSpecificInterest.indexOf(user) === -1) {
                usersWithSpecificInterest.push(user);
                const specificInterestRowUrl = getSpecificRowOfInterest(Object.keys(userInerests).indexOf(interests[i]) + 1
                );
                await makeApiCall(specificInterestRowUrl, { data: [usersWithSpecificInterest.join(',')] }, headers, 'put');
            }
        }
    },
    constructObjectFromSheetsResponse,
    getARandomQuestion,
    getARandomGame,
};
