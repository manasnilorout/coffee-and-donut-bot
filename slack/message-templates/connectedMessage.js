'use strict';

module.exports = {
    text: 'Connected you here!',
    blocks: [
        {
			"type": "divider"
		},
        {
            type: 'section',
            fields: [
                {
                    type: 'mrkdwn',
                    text: "*Hey guys!*\nI have connected you both here!\nFeel free to talk anything.\nIf you want a kick start let me know by typing `/ask_a_question` and I'll pop a question for you.\nYou can also start playing a online game, I can suggest you one when you type `/suggest_game`\nHappy chatting!"
                }
            ]
        }
    ]
};
