'use strict';

module.exports = {
    text: 'Consent to connect with colleagues!',
    blocks: [
        {
            type: 'header',
            text: {
                type: 'plain_text',
                text: 'Consent to connect with colleagues!',
                emoji: false
            }
        },
        {
            type: 'section',
            fields: [
                {
                    type: 'mrkdwn',
                    text: 'Do you want to connect with random *colleagues* and get to know to know them individually?'
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
                        text: 'Opt In'
                    },
                    style: 'primary',
                    value: 'opt_me_in'
                },
                {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        emoji: true,
                        text: 'Opt Out'
                    },
                    style: 'danger',
                    value: 'opt_me_out'
                },
                {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        emoji: true,
                        text: 'Ask me later'
                    },
                    value: 'ask_me_later'
                }
            ]
        }
    ]
};
