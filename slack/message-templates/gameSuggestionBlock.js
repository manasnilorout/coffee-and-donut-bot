'use strict';

const getFormalWord = (word) => word.charAt(0).toUpperCase() + word.slice(1);

module.exports = ({ name, link }) => ({
    text: 'Here\'s a game suggestion',
    blocks: [
        {
			"type": "divider"
		},
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: 'Hmm, Time for a game! Click on the button :arrow_right: '
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
