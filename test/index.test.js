'use strict';
var Hapi = require('hapi');
var status = require('../');
var should = require('should');

describe('Status Route Plugin', function () {
	var server = new Hapi.Server();
	server.connection();

	it('should successfully load', function (done) {
		server.register({
			register: status,
			options: {
				version: '1.0.0'
			}
		}, function (err) {
			should.not.exist(err);
			done();
		});
	});

	it('should register routes', function () {
		var table = server.connections[0].table();
		table.should.have.length(1);
		table[0].path.should.equal('/status');
	});

	it('should return version', function (done) {
		var options = {
			method: 'GET',
			url: '/status'
		};
		server.inject(options, function (res) {
			res.statusCode.should.equal(200);
			res.result.should.have.property('version', '1.0.0');
			done();
		});
	});
});
