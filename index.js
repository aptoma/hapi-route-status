'use strict';

var fs = require('fs');

exports.register = function (plugin, options, next) {
	var data = {version: options.version};
	options.pre = options.pre || [];

	if (!options.revisionFile) {
		return done(data);
	}

	fs.exists(options.revisionFile, function (exists) {
		if (!exists) {
			return done(data);
		}

		fs.readFile(options.revisionFile, {encoding: 'utf-8'}, function (err, rev) {
			if (err) {
				return next(err);
			}

			data.revision = rev.trim();
			done(data);
		});
	});

	function done(data) {
		plugin.route({
			method: 'GET',
			path: '/status',
			config: {
				auth: false,
				handler: function (req, reply) {
					reply(data);
				},
				pre: options.pre,
				description: 'Show status',
				tags: ['api']
			}
		});

		next();
	}
};

exports.register.attributes = {
	name: 'route-status'
};
