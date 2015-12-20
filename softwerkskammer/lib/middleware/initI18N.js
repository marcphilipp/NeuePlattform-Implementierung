'use strict';

var i18n = require('i18next');
var middleware = require('i18next-express-middleware');
var Backend = require('i18next-node-fs-backend');
var jade = require('jade');
var path = require('path');

module.exports = function initI18N(languages, abspath) {
  var JadePostProcessor = {
    name: 'jade',
    type: 'postProcessor',
    process: function (val, key, opts) {
      return jade.compile(val, opts)();
    }
  };
  var langs = languages.split(',');
  i18n
    .use(Backend)
    .use(middleware.LanguageDetector)
    .use(JadePostProcessor)
    .init({
      debug: false,
      supportedLngs: langs,
      preload: langs,
      fallbackLng: langs[0],
      returnObjects: true,
      joinArrays: '\n',
      backend: {
        loadPath: path.join(abspath || '', 'locales/{{ns}}-{{lng}}.json')
      },
      detection: {
        order: ['session'],
        lookupSession: 'language'
      }
    });
  return middleware.handle(i18n, {});
}

