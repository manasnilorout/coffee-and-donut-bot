'use strict';

module.exports = {
	blocks: [
		{
			"type": "divider"
		},
        {
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "How often do you want to connect ?"
			},
			"accessory": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "select one option",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "Weekly",
							"emoji": true
						},
						"value": "w"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Monthly",
							"emoji": true
						},
						"value": "m"
					}
				],
				"action_id": "multi_static_select-action"
			}
		}
	]
};
