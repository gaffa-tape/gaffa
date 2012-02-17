(function() {
  var express = require("express"),
	  app = module.exports = express.createServer();

  app.configure(function() {
    app.set("views", "" + __dirname + "/views");
    app.set("view engine", "jade");
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static("" + __dirname + "/public"));
    app.use(express.logger("short"));
    app.use(express.favicon("" + __dirname + "/public/img/favicon.ico"));
    return app.use(app.router);
  });

  app.configure('development', function() {
    app.use(express.errorHandler({
      dumpExceptions: true
    }));
    return app.set('view options', {
      pretty: true
    });
  });

  require("./routes/site")(app);
  require("./routes/products")(app);

  app.listen(3000);

  console.log("port " + (app.address().port) + " in " + app.settings.env + " mode");

}).call(this);