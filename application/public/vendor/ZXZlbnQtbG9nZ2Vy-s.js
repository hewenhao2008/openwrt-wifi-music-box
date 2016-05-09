var owa_baseUrl = '//wifioner.com/';
var site_id = 'wifioner.com';
var owa_cmds = owa_cmds || [];
owa_cmds.push(['setLoggerEndpoint', owa_baseUrl + 'ZXZlbnQtbG9nZ2Vy']);
owa_cmds.push(['setSiteId', site_id]);
//owa_cmds.push(['trackClicks']);

OWA.tracker.prototype.getLoggerEndpoint = function() {
	var url = this.getOption('logger_endpoint') || this.getEndpoint() || OWA.getSetting('baseUrl');
	return url;
};
OWA.util.getCurrentUnixTimestamp = function() {
	return new Date().getTime();
};
OWA.tracker.prototype.addCustomVar = function(name, value, scope) {
	// TODO check value length
	// if (value.length > 65) {
	// OWA.debug('Custom variable name + value is too large. Must be less than 64 characters.');
	// return;
	// }
	switch (scope) {
	case'session':
		OWA.util.setState('b', name, value);
		OWA.debug('just set custom var on session.');
		break;
	case'visitor':
		OWA.util.setState('v', name, value);
		OWA.util.clearState('b', name);
		break;
	}
	this.setGlobalEventProperty(name, value);
};

(function(OWA) {
	var EventPrototype = OWA.event.prototype;
	OWA.event = function() {
		this.properties = {};
		this.id = '';
		this.set('timestamp', OWA.util.getCurrentUnixTimestamp());
	};
	OWA.event.prototype = OWA.util.clone(EventPrototype);
})(OWA);

(function(owa, owa_cmds) {	
	// Screen resolution info *** FIXED FIREFOX Screen interface of lazy loading issue ***
	if (window && window.screen) {
		var window_screen = {
			"availWidth" : window.screen.availWidth,
			"availHeight" : window.screen.availHeight,
			"availTop" : window.screen.availTop,
			"availLeft" : window.screen.availLeft,
			"pixelDepth" : window.screen.pixelDepth,
			"colorDepth" : window.screen.colorDepth,
			"width" : window.screen.width,
			"height" : window.screen.height
		};
		if (window.screen.orientation) {
			window_screen.orientation = {
				"onchange" : window.screen.orientation.onchange,
				"type" : window.screen.orientation.type,
				"angle" : window.screen.orientation.angle
			};
		}
		if (window.screen.top && window.screen.left) {
			window_screen.left = window.screen.left;
			window_screen.top = window.screen.top;			
		}
		owa_cmds.push(['addCustomVar', 'window_screen', JSON.stringify(window_screen), 'session']);
	}
})(OWA, owa_cmds);
