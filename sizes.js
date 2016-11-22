var sizeOf = require('image-size');
var process = require('process');
var fs = require('fs');
var path = require('path');

var config = {};

var directories = fs.readdirSync('./').filter(function(file) {
  return fs.statSync(path.join('./', file)).isDirectory();
});

for (var i = 0; i < directories.length; i++) {
  var dirName = directories[i];
  var photos = [];

  var files = fs.readdirSync(dirName);
  if (files.indexOf('settings.json') === -1) {
    continue;
  }

  var settings = JSON.parse(fs.readFileSync(dirName + '/settings.json'));
  if ('publish' in settings && !settings.publish) {
    continue;
  }


  for (var j = 0; j < files.length; j++) {
    var filename = files[j];
    if (!filename.endsWith('jpg')) { continue; }

    var filePath = dirName + (dirName.endsWith('/') ? '' : '/') + filename;
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
