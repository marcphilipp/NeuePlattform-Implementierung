"use strict";

var moment = require('moment');
var markdown = require('markdown').markdown;
var conf = require('nconf');
var misc = conf.get('beans').get('misc');

function Activity(object) {
  if (object) {
    this.id = object.id;
    this.url = object.url.trim();
    this.title = object.title;
    this.description = object.description;
    this.assignedGroup = object.assignedGroup;
    this.location = object.location;
    this.direction = object.direction;
    this.startDate = object.startDate;
    this.startTime = object.startTime;
    this.startUnix = moment(object.startDate + " " + object.startTime, 'D.M.YYYY H:m').unix();
    this.endDate = object.endDate;
    this.endTime = object.endTime;
    this.color = object.color;
    this.registeredMembers = misc.toArray(object.registeredMembers);
  } else {
    this.color = 'aus Gruppe';
  }
  return this;
}

Activity.prototype.descriptionHTML = function () {
  return markdown.toHTML(this.description.replace(/\r/g, ''));
};

Activity.prototype.directionHTML = function () {
  return markdown.toHTML(this.direction.replace(/\r/g, ''));
};

Activity.prototype.groupName = function (groups) {
  for (var i in groups) {
    if (groups[i].id === this.assignedGroup) { return groups[i].longName; }
  }
  return "";
};

Activity.prototype.month = function () {
  return moment.unix(this.startUnix).month();
};

Activity.prototype.addMemberId = function (memberId) {
  if (!this.registeredMembers) {
    this.registeredMembers = [];
  }
  if (this.registeredMembers.indexOf(memberId) === -1) {
    this.registeredMembers.push(memberId);
  }
};

Activity.prototype.removeMemberId = function (memberId) {
  if (this.registeredMembers === undefined) {
    return;
  }
  var index = this.registeredMembers.indexOf(memberId);
  if (index > -1) {
    this.registeredMembers.splice(index, 1);
  }
};

Activity.prototype.year = function () {
  return moment.unix(this.startUnix).year();
};

Activity.prototype.endUnix = function () {
  var date = this.endDate ? this.endDate : this.startDate;
  var time = this.endTime ? this.endTime : this.startTime;
  return moment(date + " " + time, 'D.M.YYYY H:m').unix();
};

Activity.prototype.colorFrom = function (groupsColors, allColors) {
  if (this.color === 'aus Gruppe') {
    return groupsColors[this.assignedGroup];
  }
  for (var i in allColors) {
    if (allColors[i].id === this.color) {
      return allColors[i].color;
    }
  }
  return '#353535';
};

Activity.prototype.asCalendarEvent = function (groupsColors, allColors) {
  return {
    title: this.title,
    start: this.startUnix,
    end: this.endUnix(),
    url: '/activities/' + encodeURIComponent(this.url),
    activity: this,
    className: 'verySmall',
    dayOfWeek: moment.unix(this.startUnix).day(),
    color: this.colorFrom(groupsColors, allColors)
  };
};

module.exports = Activity;
