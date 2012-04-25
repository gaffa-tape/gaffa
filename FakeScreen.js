{
    "model": {
        "stuff": {
            "formatProps2": "ZOMFG I HAVE LE CHANGED!"
        }
    },
    "views": [
        {
            "type":"text",
			"properties": {
				"text": {
					"value":"Hey look a totaly different view, with data from that other view! "
				}
			}
        },
        {
            "type": "textbox",
            "properties": {
                "value": {
                    "binding": "stuff/formatProps1"
                }
            }
        },
        {
            "type": "textbox",
            "properties": {
                "value": {
                    "binding": "stuff/formatProps2"
                }
            }
        },
        {
            "type": "button",
            "actions": {
                "click": [
                    {
                        "type": "navigate",
                        "url": {
                            "value": "IntroScreen.js"
                        },
                        "model": {
                            "binding": null
                        }
                    }
                ]
            }
        }
    ]
}