function reqListener() {
  new Gallery(JSON.parse(this.responseText), {
    domId: 'gallery',
    maxHeight: 250,
    spacing: 10
  });
}


window.onload = function() {
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", "config.json");
  oReq.send();
};
