function reqListener() {
  var renderer = new HorizontalRenderer('gallery');
  var config = new Config(JSON.parse(this.responseText), {
    layout: 'grid',
    maxHeight: 250,
    spacing: 10
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
