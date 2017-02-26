class Config {
  constructor(config, opts) {
    this.data = config;
    this.maxHeight = opts.maxHeight;
    this.spacing = opts.spacing;
    this.shuffle = opts.shuffle;
    this.columns = opts.columns;
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

  getPhotos(config, photos) {
    var photoObjs = photos.map((p) => { return new Photo(p); });
    if (config.shuffle) {
      shuffle(photoObjs);
    }
    return photoObjs
  }

  rootElem() {
    return this._rootElem;
  }

  createHeader(title) {
    var sectionElem = document.createElement('section');
    sectionElem.id = title;
    var header = document.createElement('h3');
    header.innerHTML = title;
    sectionElem.appendChild(header);
    return sectionElem;
  }
}

class VerticalRenderer extends Renderer {
  render(config) {
    for (var section in config.data) {
      var section = this.createSection(config,
        section,
        this.getPhotos(config, config.photos(section)));
      this.rootElem().appendChild(section);
    }
  }

  createSection(config, section, photos) {
    var sectionElem = this.createHeader(section);
    var length = config.columns
    var width = (this._currentWidth - config.spacing * (config.columns-1)) * 1.0 / config.columns;

    var stacks = [];
    for (var i = 0; i < config.columns; i++) {
      stacks.push([]);
    }
    var heights = new Array(config.columns).fill(0);


    for (var i = 0; i < photos.length; i++) {
      var nextPhoto = photos[i];
      var index = this.getSmallestStack(heights);
      stacks[index].push(nextPhoto);
      heights[index] += nextPhoto.height(width);
    }

    var columnElements = document.createElement('div');
    columnElements.style.columnCount = config.columns;
    columnElements.style.columnGap = config.spacing + 'px';

    for (var i = 0; i < stacks.length; i++) {
      var column = document.createElement('div');
      for (var j = 0; j < stacks[i].length; j++) {
        column.appendChild(this.createPhotoElement(stacks[i][j], width, config));
      }
      column.style.width = width + 'px';
      columnElements.appendChild(column);
    }

    sectionElem.appendChild(columnElements);

    return sectionElem;
  }

  createPhotoElement(photo, width, config) {
    var image = new Image();

    image.src = photo.src();
    image.style.width = width + 'px';
    image.style.height = photo.height(width) + 'px';
    image.style.marginBottom = config.spacing + 'px';
    image.onload = onImageLoad;

    return image;
  }

  getSmallestStack(stack) {
    var smallestIndex = 0;
    var minHeight = Number.MAX_VALUE;
    for (var i = 0; i < stack.length; i++) {
      if (stack[i] === 0) {
        return i;
      }

      if (stack[i] < minHeight) {
        smallestIndex = i;
        minHeight = stack[i];
      }
    }
    return smallestIndex;
  }
}

class SquareRenderer extends Renderer {
  render(config) {
    for (var section in config.data) {
      var section = this.createSection(config,
        section,
        this.getPhotos(config, config.photos(section)));
      this.rootElem().appendChild(section);
    }
  }

  createSection(config, section, photos) {
    var sectionElem = this.createHeader(section);

    // In column format, we want to precompute the height of each cell, so that
    // the last row can have a matching width and align itself to rows above.
    var length = config.columns ||
      Math.ceil((this._currentWidth + config.spacing) / (config.maxHeight + config.spacing));
    var height = this.calculateHeight(config, length);

    while (photos.length > 0) {
      var rowPhotos = [];

      for (var i = 0; i < length; i++) {
        if (photos.length === 0) {
          break;
        }

        rowPhotos.push(photos.pop());
      }
      sectionElem.appendChild(this.createRow(config, section, rowPhotos, height));
    }

    return sectionElem;
  }

  createRow(config, section, photos, height) {
    var rowElem = document.createElement('div');
    rowElem.className = 'sectionrow';
    rowElem.style.marginBottom = config.spacing + 'px';

    for (var i = 0; i < photos.length; i++) {
      var photo = photos[i];
      var image = document.createElement('div');

      image.style.backgroundImage = "url('" + photo.src() + "')";
      image.style.backgroundRepeat = 'no-repeat';
      image.style.backgroundPosition = 'center';
      image.style.backgroundSize = 'cover'

      image.style.width = height + 'px';
      image.style.height = height + 'px';
      image.style.display = 'inline-block';

      // Only apply margins to second to last.
      if (i !== 0) {
        image.style.marginLeft = config.spacing + 'px';
      }
      rowElem.appendChild(image);
    }
    return rowElem;
  }

  calculateHeight(config, length) {
    if (config.columns) {
      return (this._currentWidth - (config.columns-1) * config.spacing) / config.columns;
    }
    return (this._currentWidth - (length-1) * config.spacing) / length;
  }
}

class HorizontalRenderer extends Renderer {
  render(config) {
    for (var section in config.data) {
      var section = this.createSection(config,
        section,
        this.getPhotos(config, config.photos(section)));
      this.rootElem().appendChild(section);
    }
  }

  createSection(config, section, photos) {
    var photos = photoObjs.map((p) => { return new Photo(p); });
    if (config.shuffle) {
      shuffle(photos);
    }
    var sectionElem = this.createHeader(section);

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
    rowElem.style.marginBottom = config.spacing + 'px';

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
      // If it barely reaches the max height, it looks like an error. So let's
      // just add a ton of padding by reducing the height of the row.
      if (sumWidth > targetWidth * 9 / 10) {
        finalHeight = this._maxHeight * 0.9;
      }
    }


    for (var i = 0; i < photos.length; i++) {
      var photo = photos[i];
      var image = new Image();
      image.src = photo.src();
      image.style.width = photo.width(finalHeight) + 'px';
      image.style.height = finalHeight + 'px';
      image.onload = onImageLoad;
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

function onImageLoad() {
  debugger;
  this.classList.add('img-loaded');
}
