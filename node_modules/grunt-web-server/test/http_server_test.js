'use strict';

var grunt = require('grunt');

exports.web_server = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {
    test.expect(1);
    test.done();
  },
  custom_options: function(test) {
    test.expect(1);
    test.done();
  },
};
