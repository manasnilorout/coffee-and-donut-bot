'use strict';

module.exports = {
    text: 'Consent to connect with colleagues!',
    blocks: [
        {
			"type": "divider"
		},
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
                        text: 'Like Me :woman-with-bunny-ears-partying:'
                    },
                    style: 'primary',
                    value: 'like_me'
                },
                {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        emoji: true,
                        text: 'Surprise Me :sparkles:'
                    },
                    style: 'danger',
                    value: 'random'
                }
            ]
        }
    ]
};
