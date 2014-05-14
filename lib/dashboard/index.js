"use strict";

var path = require('path');
var conf = require('nconf');
var beans = conf.get('beans');

var dashboardAPI = beans.get('dashboardAPI');

module.exports = function (app) {
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  app.get('/', function (req, res, next) {
    dashboardAPI.dataForDashboard(req.user.member.nickname(), function (err, result) {
      if (err) { return next(err); }
      res.render('index', result);
    });
  });

  return app;
};