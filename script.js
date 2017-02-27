var COLUMNS = 'columns';
var ROWS = 'rows';
var SQUARES = 'squares';
var id = 'gallery';

/** To customize the layout, CHANGE THE layoutStyle VARIABLE TO BE
* COLUMNS: Column style layout
* SQUARES: Square style layout, similar to Instagram
* ROWS: Row style layout
***/
var layoutStyle = ROWS;
var configuration = {
  spacing: 10,
  shuffle: true,
  columns: 3,
  maxHeight: 400
}

function reqListener() {
  var renderer
  switch (layoutStyle) {
    case COLUMNS:
      renderer = new VerticalRenderer(id);
      break;
    case ROWS:
      renderer = new HorizontalRenderer(id);
      break;
    case SQUARES:
      renderer = new SquareRenderer(id);
      break;
  }
  var config = new Config(JSON.parse(this.responseText), configuration);
  renderer.render(config);
}


window.onload = function() {
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", "config.json");
  oReq.send();
};
