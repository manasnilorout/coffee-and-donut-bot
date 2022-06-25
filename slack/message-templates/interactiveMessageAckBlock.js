'use strict';

module.exports = (message = 'Your preference is accepted') => ({
    type: 'section',
    fields: [
        {
            type: 'mrkdwn',
            text: `_${message}_`,
        }
    ]
});
