'use strict';

module.exports = {
    text: 'Consent to connect with colleagues!',
    blocks: [
        {
            type: 'section',
            fields: [
                {
                    type: 'mrkdwn',
                    text: 'What kind of people would you like to connect with?'
                }
            ]
        },
        {
            type: 'actions',
            elements: [
                {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        emoji: true,
                        text: 'Like Me :likeme_cd:'
                    },
                    value: 'like_me'
                },
                {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        emoji: true,
                        text: 'Surprise Me :surpriseme_cd:'
                    },
                    value: 'random'
                }
            ]
        }
    ]
};
