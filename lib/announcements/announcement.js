"use strict";

var markdown = require('markdown').markdown;
var moment = require('moment');

function Announcement(object) {
  if (object) {
    var now = object.fromDate || Date.now();
    this.fromDate = now;
    this.id = object.id;
    this.url = object.url.trim();
    this.title = object.title;
    this.message = object.message;
    this.author = object.author;
    this.thruDate = object.thruDate;
  }
  return this;
}

Announcement.prototype.isValid = function () {
  return !!this.id;
};

Announcement.prototype.readableDate = function () {
  return moment(this.fromDate).format('DD.MM.');
};

Announcement.prototype.messageHTML = function () {
  return markdown.toHTML(this.message.replace(/\r/g, ''));
};

Announcement.AnnouncementsUntilToday = function (announcements) {
  return announcements.filter(function (announcement) { return announcement.thruDate >= moment().unix(); });
};

Announcement.AnnouncementsExpired = function (announcements) {
  return announcements.filter(function (announcement) { return announcement.thruDate < moment().unix(); });
};

module.exports = Announcement;
