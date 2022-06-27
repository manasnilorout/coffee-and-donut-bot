'use strict';

module.exports = {
    text: 'Thanks for the response! You will not be connected with anyone.',
    blocks: [
        {
            type: 'header',
            text: {
                type: 'plain_text',
                text: 'Thanks for responding!',
                emoji: false
            }
        },
        {
            type: 'section',
            fields: [
                {
                    type: 'mrkdwn',
                    text: "We honur your response, you'll not be connected with anyone. If ever you change your mind just say `/coffee` in DM and I will try to connect with random or like minded people based on your preference."
                }
            ]
        }
    ]
};
