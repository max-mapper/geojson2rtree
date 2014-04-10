var Terraformer = require('terraformer')
var GeoStore = require('terraformer-geostore').GeoStore
var RTree = require('terraformer-rtree').RTree
var MemoryStore = require('terraformer-geostore-memory').Memory

var through = require('through2')
var combiner = require('stream-combiner')
 
var JSONStream = require('JSONStream')
 
module.exports = function(onFeature, cb) {
  var index = new RTree()
  var store = new GeoStore({
    store: new MemoryStore({ name: "data" }),
    index: index
  })

  var features = JSONStream.parse(['features', true])

  var formatter = through.obj(write, end)
  var count = 0
  function write(obj, enc, next) {
    if (onFeature) obj = onFeature(obj)
    if (++count % 1000 === 0) console.error(count)
    store.add(obj, function(err) {
      // ignore errs
      next()
    })
  }
  
  function end(next) {
    index.serialize(function (err, data) {
      next()
      cb(err, data)
    })
  }
  
  return combiner(features, formatter)
}
