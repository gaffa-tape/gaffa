module.exports = function (app) {

	// Get Resource Collection
	app.get('/products', function (req, res) {
		var gaffaModel = { model: {}, views: [], behaviours: [] };
		gaffaModel.model = [
				{ id: 1, name: "MacBook Air", price: "$1000.00" },
				{ id: 2, name: "MacBook Pro", price: "$1600.00" },
				{ id: 3, name: "MacBook", price: "$900.00" }			
		];
						
		return res.json(gaffaModel);
	});

	// Get Resource Collection (Filtered)
	app.get("/products/:filter", function (req, res) {
		// TODO: Paging / Filter
		return res.json({});
	});

	// Get Resource
	app.get("/products/:id", function (req, res) {
		var id = parseInt(req.params.id)
		var gaffaModel = { model: {}, views: [], behaviours: [] };
		gaffaModel.model = { id: id, name: "MacBook Air", price: "$" + (id * 567) };
		return res.json(gaffaModel);
	});
	
	// Create Resource
	app.post("/products", function (req, res) {
		return res.json({});
	});

	// Update Resource
	app.put("/products/:id", function (req, res) {
		return res.json({});
	});
	
	// Delete Resource
	app.del("/products/:id", function (req, res) {
		return res.json(null);
	});
};