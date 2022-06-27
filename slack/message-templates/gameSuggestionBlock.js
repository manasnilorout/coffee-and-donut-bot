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
                text: 'Time to play a Fun Game! Click on the button to the right :arrow_right: '
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
