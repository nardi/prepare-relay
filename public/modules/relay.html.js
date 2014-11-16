// A simple html.js page that tries to return data from a source, and waits until it is
// available.

var relay = require('../../index.js');
// Parse querystring
var query = require('url').parse(request.url, true).query;
// If a valid source is specified...
if (query && query.source && relay.sources && query.source in relay.sources) {
	// Relay data
	try {
		var data = relay.sources[query.source].getData.sync();
		response.end(JSON.stringify(data));
	} catch (e) {
		response.statusCode = 500;
		response.end();
	}
} else {
	// Else eh... error?
	response.statusCode = 500;
	response.end();
}