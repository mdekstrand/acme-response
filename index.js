"use strict";
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const async = require('async');

function makeAcmeResponse(acme, baseDir, callback) {
  var dir = path.join(baseDir, '.well-known', 'acme-challenge');
  var outfn = path.join(baseDir, '.well-known', 'acme-challenge', acme.challenge);
  async.series([
    async.apply(mkdirp, dir),
    async.apply(fs.writeFile, outfn, acme.response + '\n')
  ], callback);
}

function loadAndMakeResponse(acmeFile, baseDir, callback) {
  const yaml = require('js-yaml');

  fs.access(acmeFile, fs.R_OK, (err) => {
    if (err) {
      callback(null, false);
    } else {
      async.waterfall([
        (cb) => fs.readFile(acmeFile, 'utf8', cb),
        (txt, cb) => {
          let acme = yaml.safeLoad(txt);
          makeAcmeResponse(acme, baseDir, cb);
        }
      ], callback);
    }
  });
}

makeAcmeResponse.fromFile = loadAndMakeResponse;

module.exports = makeAcmeResponse;
