'use strict';

const getFormalWord = (word) => word.charAt(0).toUpperCase() + word.slice(1);

module.exports = ({context, question}) => ({
    text: 'A question for initiating conversation',
    blocks: [
        {
            type: 'header',
            text: {
                type: 'plain_text',
                text: `Context: "${getFormalWord(context)}"`,
                emoji: false
            }
        },
        {
            type: 'section',
            fields: [
                {
                    type: 'mrkdwn',
                    text: question,
                }
            ]
        }
    ]
});
