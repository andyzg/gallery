var sizeOf = require('image-size');
var process = require('process');
var fs = require('fs');

var config = {};

for (var i = 2; i < process.argv.length; i++) {
  var dirName = process.argv[i];
  var photos = [];

  var files = fs.readdirSync(dirName);
  for (var j = 0; j < files.length; j++) {
    var filename = files[j];
    if (!filename.endsWith('jpg')) { continue; }

    var filePath = dirName + '/' + filename;
    var dimensions = sizeOf(filePath);
    photos.push({
      width: dimensions.width,
      height: dimensions.height,
      path: filePath
    });
  }

  config[dirName] = photos;
}

fs.writeFile('config.json', JSON.stringify(config));
