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

	it('should support callback to modify data', async () => {
		const srv = new Hapi.Server({debug: {request: '*'}});
		await srv.register({
			plugin,
			options: {
				version: '1.0.0',
				callback: (data) => {
					data.count = n;
					return data;
				}
			}
		});
		let n = 1;
		const options = {
			method: 'GET',
			url: '/status'
		};

		let res = await srv.inject(options);
		res.statusCode.should.equal(200);
		res.result.should.have.property('version', '1.0.0');
		res.result.should.have.property('count', 1);

		n = 2;
		res = await srv.inject(options);
		res.statusCode.should.equal(200);
		res.result.should.have.property('version', '1.0.0');
		res.result.should.have.property('count', 2);
	});
});
