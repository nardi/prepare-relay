/*                                 == Helper functions ==                                   */

// Function that will be executed browser-side to continuously retrieve new data
var setContent = function(dest, id) {    
    var update = function() {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                dest(JSON.parse(xhr.responseText));
				update();
            }
        }
    
        xhr.open('GET', 'modules/relay.html.js?source=' + id, true);
        xhr.send();
    };
	update();
	// For debugging:
	// var elem = document.createElement('p');
	// elem.textContent = 'Registered as ' + id;
	// document.body.appendChild(elem);
};

// Function to generate a random n-digit number
var randomId = function(digits) {
	return Math.floor(Math.random() * (Math.pow(10, digits) - Math.pow(10, digits - 1)))
		+ Math.pow(10, digits - 1);
};

// Default function for setting the contents of an element specified by a CSS selector
var setSelectorContent = function(window, sel) {
	return eval('(function(data) { \
		window.document.querySelector("' + sel + '").textContent = data; \
	})');
};

/*                             === The main module code ===                                 */

var sources = {};

// Should be initialized with the current page's window as parameter.
// Returns a function that "relays" it's argument to a client side function. This function
// should be in as the first parameter ("dest"), and is executed verbatim (identical code) on
// the client side. Alternatively, you can pass in a CSS selector as dest to replace that
// element's content, and also provide a function to retrieve the data to pass along (if that
// suits your data source better).
module.exports = function(window) {
    return function(dest, get) {
		var set = dest;
		// If given a selector:
		if (typeof set !== 'function') {
			set = setSelectorContent(window, dest);
			var initial = get;
			if (typeof initial === 'function')
				initial = initial();
			set(initial);
		}
		
		// Queues for outgoing data and waiting recievers
		var _next = null,
		    _queue = [];
		var id = randomId(8);
		var source = {
			getData: function(next) {
				// Get data stored in queue, or wait for new data
				if (_queue.length > 0) {
					var data = _queue.pop();
					// For debugging:
					// console.log('Sending ' + data + ' to ' + id);
					next(null, data);
				} else if (!_next) {
					_next = next;
				} else {
					throw 'Already registered';
				}
			}
		};
        sources[id] = source;
        window.response.register(setContent, set, id);
        
        return function(data) {
			// Ensure we have data to relay
            if (typeof data === 'undefined') {
				if (typeof get === 'function')
					data = get();
				else
					return;
            }
            
			// Send data to registered client, or store in data queue
			if (_next) {
				// For debugging:
				// console.log('Sending ' + data + ' to ' + id);
				_next(null, data);
				_next = null;
			} else {
				_queue.push(data);
			}
        };
    };
};

module.exports.sources = sources;