var Gallery = (function() {

  var WIDTH = 1000;

  var Gallery = function(config, opts) {
    this._config = config;
    this._minHeight = opts.minHeight;
    this._maxHeight = opts.maxHeight;
    this._spacing = opts.spacing;

    this.render();
  };

  Gallery.prototype.render = function() {
    for (var section in this._config) {
      this.renderSection(section, this._config[section]);
    }
  };

  Gallery.prototype.renderSection = function(section, photoObjs) {
    var photos = photoObjs.map(function(p) { return new Photo(p); });
    var sectionElem = document.getElementById(section);
    console.log(sectionElem);

    while (photos.length > 0) {
      var minWidth = 0;
      var maxWidth = 0;
      var rowPhotos = [];

      while (true) {
        var photo = photos.pop();
        minWidth += photo.getWidth(this._minHeight) + this._spacing;
        maxWidth += photo.getWidth(this._maxHeight) + this._spacing;

        if (maxWidth - this._spacing > WIDTH) {
          sectionElem.appendChild(this.createRow(section, rowPhotos));
          break;
        }
        rowPhotos.push(photo);

        if (photos.length === 0) {
          sectionElem.appendChild(this.createRow(section, rowPhotos, true));
          break;
        }
      }

    }
  };

  Gallery.prototype.createRow = function(section, photos, isIncomplete) {
    var rowElem = document.createElement('div');
    rowElem.className = 'section__row';
    rowElem.style.marginBottom = (this._spacing - 3) + 'px';

    // Calculate height of element
    var targetWidth = WIDTH - (photos.length - 1) * this._spacing;
    var sumWidth = 0;
    for (var i in photos) {
      sumWidth += photos[i].getWidth(this._maxHeight);
    }
    var aspectRatio = sumWidth / parseFloat(targetWidth);
    var finalHeight = this._maxHeight / aspectRatio;


    for (var i = 0; i < photos.length; i++) {
      var photo = photos[i];
      console.log(photo);
      var image = new Image(photo.getWidth(finalHeight), finalHeight);
      image.src = photo.getPath();
      if (i !== 0) {
        image.style.marginLeft = this._spacing + 'px';
      }
      rowElem.appendChild(image);
    }
    return rowElem;
  };

  var Photo = function(p) {
    this._path = p.path;
    this._width = p.width;
    this._height = p.height;

    this._aspectRatio = this._width / parseFloat(this._height);
  };

  Photo.prototype.getWidth = function(height) {
    return height * this._aspectRatio;
  };

  Photo.prototype.getHeight = function(width) {
    return width / this._aspectRatio;
  };

  Photo.prototype.getPath = function() {
    return this._path;
  };

  return Gallery;

})();
