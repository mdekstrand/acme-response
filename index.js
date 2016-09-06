"use strict";
const fs = require('fs-extra');
const path = require('path');
const async = require('async');

function makeAcmeResponse(baseDir, acme, callback) {
  var dir = path.join(baseDir, '.well-known', 'acme-challenge');
  var outfn = path.join(baseDir, '.well-known', 'acme-challenge', acme.challenge);
  async.series([
    async.apply(fs.ensureDir, dir),
    async.apply(fs.writeFile, outfn, acme.response + '\n')
  ], callback);
}

function loadAndMakeResponse(baseDir, acmeFile, callback) {
  const yaml = require('js-yaml');

  fs.access(acmeFile, fs.constants.R_OK, (err) => {
    if (err) {
      callback(null, false);
    } else {
      async.waterfall([
        (cb) => fs.readFile('foo', 'utf8', cb),
        (txt, cb) => {
          let acme = yaml.safeLoad(txt);
          makeAcmeResponse(baseDir, acme, cb);
        }
      ], callback);
    }
  });
}

makeAcmeResponse.fromFile = loadAndMakeResponse;

module.exports = makeAcmeResponse;
