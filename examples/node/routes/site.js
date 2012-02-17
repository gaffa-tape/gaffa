module.exports = function(app) {
	app.get('/', function(req, res) {
		console.log("/ hit with " + req.url + " from " + req.headers.host);
		return res.render("index", {
			layout: null
		});
	});
	app.get('/index', function(req, res) {
		var gaffaModel = { model: {}, views: [], behaviours: []};
		var data = {
			page: {
				isVisibleHeading: false,
				isVisibleDetails: false,
				heading: "Index Heading"			
			},
			products: [] 
		};
		gaffaModel.model = data;
				
		var navigationView = {
            type: "nav",
            properties: {
                text: { value: "gaffa.js" },
                fixed: { value: true }
            }
		};

		var headingView = {
            type: "container",
            properties: {
                classes: { value: "main" }
            },
            views: {
                content: [
	                {
	                    type: "container",
	                    properties: {
	                        classes: { value: "row" }
	                    },
	                    views: {
	                        content: [
	                            {
	                                type: "container",  
	                                properties: {
	                                    classes: { value: "span12" }
	                                },
	                                views: {
	                                    content: [
	                                        {
	                                            type: "heading",
	                                            properties: {
	                                                text: { binding: "main/page/heading" },
	                                                visible: { binding: "main/page/isVisibleHeading" }
	                                            }
	                                        },
		                                    ["<p>some text for the sake of it</p>"]
	                                    ]
	                                }
	                            }
	                        ]
	                    }
	                },
	                {
	                    type: "container",
	                    properties: {
	                        classes: { value: "row" }
	                    },
	                    views: {
	                        content: [
	                            {
	                                type: "container",  
	                                properties: {
	                                    classes: { value: "span12" }
	                                },
	                                views: {
	                                    content: [
	                                        {
	                                            type: "button",
	                                            properties: {
	                                                text: { value: "Toggle Heading" }
	                                            },
                                                actions:{
                                                    click:[
                                                        {
                                                            type: "toggle",
                                                            bindings: {
                                                                toggle: { binding: "main/page/isVisibleHeading" }
                                                            }
                                                        }   
                                                    ]
                                                }
	                                        }
	                                    ]
	                                }
	                            }
	                        ]
	                    }
	                }
                ]
            }
        };

		gaffaModel.views.push(navigationView);
		gaffaModel.views.push(headingView);
		
		return res.json(gaffaModel);
	});
};
