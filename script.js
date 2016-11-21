function reqListener() {
  new Gallery(JSON.parse(this.responseText), {
    minHeight: 150,
    maxHeight: 300,
    spacing: 10
  });
}


window.onload = function() {
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", "config.json");
  oReq.send();
};
