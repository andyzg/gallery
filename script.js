function reqListener() {
  var renderer = new SquareRenderer('gallery');
  var config = new Config(JSON.parse(this.responseText), {
    maxHeight: 400,
    spacing: 20,
    shuffle: true
  });

  renderer.render(config);

  /**
   * Ideally, the API looks like a factory pattern
   * var renderer = Gallery.createRenderer(data, config);
   * renderer.render('#id');
   */
}


window.onload = function() {
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", "config.json");
  oReq.send();
};
