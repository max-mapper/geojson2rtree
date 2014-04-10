#!/usr/bin/env node

var fs = require('fs')
var gj2rt = require('./')

var gj = gj2rt(function(feature) {
  feature.id = feature.properties.BLDG_ID
  return feature
}, function(err, rtree) {
  if (err) return console.error(err)
  console.log(JSON.stringify(rtree))
})

var input = process.stdin

if (process.stdin.isTTY) {
  input = fs.createReadStream(process.argv[2])
}

input.pipe(gj)