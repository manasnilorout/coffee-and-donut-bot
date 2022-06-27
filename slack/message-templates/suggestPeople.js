'use strict';

const { getCapitalizedWord } = require('../../helpers/helper');

module.exports = (suggestions) => ({
    text: 'Surprise me! Suggestions.',
    blocks: suggestions.map(s => ({
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: `<@${s.user}> - *Preference* - *${getCapitalizedWord(s.interest)}* ${s.interestEmoji}`
        },
        accessory: {
            type: 'button',
            text: {
                type: 'plain_text',
                text: 'connect me',
                emoji: true
            },
            value: s.user,
            action_id: 'connect_me'
        }
    })),
});
