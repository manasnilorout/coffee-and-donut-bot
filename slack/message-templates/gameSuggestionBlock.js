'use strict';

const getFormalWord = (word) => word.charAt(0).toUpperCase() + word.slice(1);

module.exports = ({ name, link }) => ({
    text: 'Here\'s a game suggestion',
    blocks: [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: 'Hmm, time for a game! Here\'s a suggestion'
            },
            accessory: {
                type: 'button',
                text: {
                    type: 'plain_text',
                    text: name,
                    emoji: true
                },
                value: 'game',
                url: link,
                action_id: 'button-action'
            }
        }
    ]
});
