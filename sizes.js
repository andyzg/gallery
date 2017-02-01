var sizeOf = require('image-size');
var process = require('process');
var fs = require('fs');
var path = require('path');

var PHOTO_PATH = './photos/';

var config = {};

var directories = fs.readdirSync(PHOTO_PATH).filter(function(file) {
  return fs.statSync(path.join(PHOTO_PATH, file)).isDirectory();
});

for (var i = 0; i < directories.length; i++) {
  var dirName = PHOTO_PATH + directories[i];
  var photos = [];

  var files = fs.readdirSync(dirName);
  var settings = {};
  if (fs.existsSync(dirName + '/settings.json')) {
    var settings = JSON.parse(fs.readFileSync(dirName + '/settings.json'));
    if ('publish' in settings && !settings.publish) {
      continue;
    }
  }


  for (var j = 0; j < files.length; j++) {
    var filename = files[j];
    if (!filename.endsWith('jpg')) { continue; }

    var filePath = dirName + (dirName.endsWith('/') ? '' : '/') + filename;
    var dimensions = sizeOf(filePath);
    photos.push({
      width: dimensions.width,
      height: dimensions.height,
      path: filePath,
    });
  }

  config[directories[i]] = photos;
}

fs.writeFile('config.json', JSON.stringify(config));
