/*global describe, beforeEach, afterEach, it */
"use strict";
var should = require('chai').should(),
  request = require('request'),
  MongoConf = require('./mongoConf'),
  conf = new MongoConf();

conf.set('port', '17125');
var base_uri = "http://localhost:" + parseInt(conf.get('port'), 10);

var app = require('../app.js')(conf);

describe('SWK Plattform server', function () {
  beforeEach(function (done) {
    app.start(done);
  });

  afterEach(function (done) {
    app.stop(done);
  });

  it('responds on a GET for the home page', function (done) {
    request({uri: base_uri}, function (req, resp) {
      should.exist(resp);
      resp.statusCode.should.equal(200);
      done();
    });
  });

  it('responds with HTML on a GET for the home page', function (done) {
    request({uri: base_uri}, function (req, resp) {
      resp.headers['content-type'].should.contain('text/html');
      done();
    });
  });

  it('shows "Softwerkskammer" on the home page', function (done) {
    request({uri: base_uri}, function (req, resp) {
      resp.body.should.contain('Softwerkskammer');
      done();
    });
  });

  it('shows "log in" on the home page if no user is authenticated', function (done) {
    request({uri: base_uri}, function (req, resp) {
      resp.body.should.contain('log in');
      done();
    });
  });

  it('has events app', function (done) {
    request({uri: base_uri + '/events'}, function (req, res) {
      res.statusCode.should.equal(200);
      res.headers['content-type'].should.contain('text/html');
      res.body.should.contain('events');
      done();
    });
  });

  it('provides the style sheet', function (done) {
    var stylesheet_uri = base_uri + '/stylesheets/style.css';
    request({uri: stylesheet_uri}, function (req, resp) {
      resp.statusCode.should.equal(200);
      resp.headers['content-type'].should.contain('text/css');
      resp.body.should.contain('color:');
      done();
    });
  });
});