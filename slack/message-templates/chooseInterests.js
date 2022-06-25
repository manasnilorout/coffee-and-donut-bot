'use strict';

module.exports = {
    text: 'Choose your topic of interests!',
    blocks: [
		{
			"type": "section",
			"text": {
				"type": "plain_text",
				"text": "What are you passionate about? Choose at least 3 topics of interest from the drop-down.",
				"emoji": true
			}
		},
		{
			"type": "input",
			"element": {
				"type": "checkboxes",
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "Food :food_cd:",
							"emoji": true
						},
						"value": "food"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Sports :sports_cd:",
							"emoji": true
						},
						"value": "sports"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Travel :travel_cd:",
							"emoji": true
						},
						"value": "travel"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Art :arts_cd:",
							"emoji": true
						},
						"value": "art"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Fur Babies :furbabies_cd:",
							"emoji": true
						},
						"value": "furbabies"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Reading :reading_cd:",
							"emoji": true
						},
						"value": "reading"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Movies :movies_cd:",
							"emoji": true
						},
						"value": "movies"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Mindfullness :mindfulness_cd:",
							"emoji": true
						},
						"value": "mindfulness"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Games :gaming_cd:",
							"emoji": true
						},
						"value": "games"
					}
				],
				"action_id": "multi_static_select-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Interests",
				"emoji": true
			}
		}
	]
};
