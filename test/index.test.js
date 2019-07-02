'use strict';
const Hapi = require('@hapi/hapi');
const plugin = require('../');
require('should');

describe('Status Route Plugin', () => {
	const server = new Hapi.Server({debug: {request: '*'}});


	it('should successfully load', async () => {
		await server.register({
			plugin,
			options: {
				version: '1.0.0'
			}
		});
	});

	it('should register routes', () => {
		const table = server.table();
		table.should.have.length(1);
		table[0].path.should.equal('/status');
	});

	it('should return version', async () => {
		const options = {
			method: 'GET',
			url: '/status'
		};
		const res = await server.inject(options);
		res.statusCode.should.equal(200);
		res.result.should.have.property('version', '1.0.0');
	});
});
