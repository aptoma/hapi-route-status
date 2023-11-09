'use strict';
const promisify = require('util').promisify;
const fs = require('fs');
const readFile = promisify(fs.readFile);

module.exports = {
	name: 'route-status',
	async register(server, options) {
		const data = {version: options.version};
		options.pre = options.pre || [];

		const cb = typeof options.callback === 'function' ? options.callback : (data) => data;

		if (!options.revisionFile) {
			return done(data);
		}

		const ex = await exists(options.revisionFile);
		if (!ex) {
			return done(data);
		}

		const rev = await readFile(options.revisionFile, {encoding: 'utf-8'});
		data.revision = rev.trim();

		return done(data);

		function done(data) {
			server.route({
				method: 'GET',
				path: '/status',
				config: {
					auth: false,
					handler() {
						return cb(data);
					},
					pre: options.pre,
					description: 'Show status'
				}
			});
		}
	}
};

const exists = (path) => new Promise((resolve) => {
	fs.exists(path, (exists) => {
		resolve(exists);
	});
});
