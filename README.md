prepare-relay
=============

Simple push messaging from server to client using prepare.js.

### How to use:

In your server's root directory:

    npm install prepare-relay

Then in a script executed on the server:

    var relay = require('prepare-relay')(window);
    
    var renderText = function(text) {
		var elem = document.createElement('p');
		elem.textContent = text;
		document.appendChild(elem);
    };
    
    var relayText = relay(renderText);
    setTimeout(function(){ relayText('Boo!'); }, 5000);
    // 'Boo!' appears on the user's page after 5 seconds
  