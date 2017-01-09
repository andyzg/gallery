var Gallery = (function() {

  var Gallery = function(config, opts) {
    this._config = config;
    this._domId = opts.domId;
    this._maxHeight = opts.maxHeight;
    this._spacing = opts.spacing;

    this.rootElem = document.getElementById(this._domId);

    var bounds = this.rootElem.getBoundingClientRect();
    this.currentWidth = bounds.right - bounds.left;

    this.render();
  };

  Gallery.prototype.render = function() {
    for (var section in this._config) {
      var section = this.createSection(section, this._config[section])
      this.rootElem.appendChild(section);
    }
  };

  Gallery.prototype.createSection = function(section, photoObjs) {
    var photos = photoObjs.map(function(p) { return new Photo(p); });
    var sectionElem = document.createElement('section');
    sectionElem.id = section;

    while (photos.length > 0) {
      var maxWidth = 0;
      var rowPhotos = [];

      while (true) {
        var photo = photos.pop();
        maxWidth += photo.getWidth(this._maxHeight) + this._spacing;

        if (maxWidth - this._spacing > this.currentWidth) {
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

    return sectionElem;
  };

  Gallery.prototype.createRow = function(section, photos, isIncomplete) {
    var rowElem = document.createElement('div');
    rowElem.className = 'section__row';
    rowElem.style.marginBottom = (this._spacing - 3) + 'px';

    // Calculate height of element
    var targetWidth = this.currentWidth - (photos.length - 1) * this._spacing;
    var sumWidth = 0;
    for (var i in photos) {
      sumWidth += photos[i].getWidth(this._maxHeight);
    }
    var aspectRatio = sumWidth / parseFloat(targetWidth);
    var finalHeight = this._maxHeight / aspectRatio;
    if (isIncomplete) {
      finalHeight = this._maxHeight;
    }


    for (var i = 0; i < photos.length; i++) {
      var photo = photos[i];
      var image = new Image();
      image.src = photo.getPath();
      image.style.width = photo.getWidth(finalHeight) + 'px';
      image.style.height = finalHeight + 'px';
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
