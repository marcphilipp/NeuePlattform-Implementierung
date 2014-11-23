'use strict';
var moment = require('moment-timezone');

var beans = require('nconf').get('beans');
var misc = beans.get('misc');
var validation = beans.get('validation');
var statusmessage = beans.get('statusmessage');
var Member = beans.get('member');

var app = misc.expressAppIn(__dirname);

app.get('/participate', function (req, res) {
  var participation = {
    member: req.user.member,
    user: {
      privateaddress: 'Morgenstr. 41\n76131 Karlsruhe\nDeutschland',
      billingaddress: 'Same',
      tshirtsize: 'L'
    },
    room: 'double',
    nights: 2
  };
  var roomOptions = [
    {id: 'single', name: 'Single', two: 214, three: 329, four: 412},
    {id: 'double', name: 'Double shared …', shareable: true, two: 174, three: 269, four: 332},
    {id: 'junior', name: 'Junior shared …', shareable: true, two: 168, three: 260, four: 320},
    {id: 'juniorAlone', name: 'Junior (exclusive)', two: 236, three: 362, four: 456}
  ];
  res.render('participate', {participation: participation, roomOptions: roomOptions});
});

app.post('/participate', function (req, res) {
  console.log(req.body);
  res.redirect('participate');
});

app.get('/editmember', function (req, res, next) {
  if (req.user.member) {
    // return res.redirect('/');
    console.log("Found member: " + req.user.member.displayName());
  }

  var member = req.user.member || new Member().initFromSessionUser(req.user);
  res.render('member', {member: member});

});

module.exports = app;
