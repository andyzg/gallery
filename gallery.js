class Config {
  constructor(config, opts) {
    this.data = config;
    this.maxHeight = opts.maxHeight;
    this.spacing = opts.spacing;
    this.layout = opts.layout;
    this.shuffle = opts.shuffle;
  };

  photos(album) {
    return this.data[album];
  }
}

class Renderer {
  constructor(domId) {
    this._rootElem = document.getElementById(domId);
    var bounds = this._rootElem.getBoundingClientRect();
    this._currentWidth = bounds.right - bounds.left;
  }

  render(config) {}
}

class HorizontalRenderer extends Renderer {
  render(config) {
    for (var section in config.data) {
      var section = this.createSection(config, section, config.photos(section))
      this.rootElem().appendChild(section);
    }
  }

  rootElem() {
    return this._rootElem;
  }

  createSection(config, section, photoObjs) {
    var photos = photoObjs.map(function(p) { return new Photo(p); });
    if (config.shuffle) {
      shuffle(photos);
    }
    var sectionElem = document.createElement('section');
    sectionElem.id = section;

    var header = document.createElement('h3');
    header.innerHTML = section;
    sectionElem.appendChild(header);

    while (photos.length > 0) {
      var maxWidth = config.spacing * -1;
      var rowPhotos = [];

      while (true) {
        var photo = photos.pop();
        maxWidth += photo.width(config.maxHeight) + config.spacing;
        rowPhotos.push(photo);
        if (maxWidth - config.spacing > this._currentWidth) {
          sectionElem.appendChild(this.createRow(config, section, rowPhotos));
          break;
        }

        if (photos.length === 0) {
          sectionElem.appendChild(this.createRow(config, section, rowPhotos, true));
          break;
        }
      }
    }

    return sectionElem;
  }

  createRow(config, section, photos, isIncomplete=false) {
    var rowElem = document.createElement('div');
    rowElem.className = 'sectionrow';
    rowElem.style.marginBottom = (config.spacing - 3) + 'px';

    // Calculate height of element
    var targetWidth = this._currentWidth - (photos.length - 1) * config.spacing;
    var sumWidth = 0;
    for (var i in photos) {
      sumWidth += photos[i].width(config.maxHeight);
    }
    var aspectRatio = sumWidth / parseFloat(targetWidth);
    var finalHeight = config.maxHeight / aspectRatio;
    if (isIncomplete) {
      finalHeight = config.maxHeight;
    }


    for (var i = 0; i < photos.length; i++) {
      var photo = photos[i];
      var image = new Image();
      image.src = photo.src();
      image.style.width = photo.width(finalHeight) + 'px';
      image.style.height = finalHeight + 'px';
      if (i !== 0) {
        image.style.marginLeft = config.spacing + 'px';
      }
      rowElem.appendChild(image);
    }
    return rowElem;
  }
}


class Photo {
  constructor(p) {
    this.path = p.path;
    this._width = p.width;
    this._height = p.height;

    this.aspectRatio = this._width / parseFloat(this._height);
  };

  src() {
    return this.path;
  }

  width(height) {
    return height * this.aspectRatio;
  }

  height(width) {
    return width / this.aspectRatio;
  }
}

//
// Helpers
//

/**
 * http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
 * Shuffles array in place. ES6 version
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
  for (let i = a.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
}
