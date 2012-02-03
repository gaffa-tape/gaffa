
  module.exports = function(app) {
    return app.get('/', function(req, res) {
      console.log("/ hit with " + req.url + " from " + req.headers.host);
      return res.render("index", {
        layout: null
      });
    });
  };
