module.exports = (app) ->
	app.get '/', (req, res) ->
		console.log "/ hit with #{req.url} from #{req.headers.host}"
		res.render "index", { layout: null }