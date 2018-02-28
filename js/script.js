var id = 'gallery';

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
  lazyload();
}


window.onload = function() {
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", "config.json");
  oReq.send();

  let igElem = document.getElementById('instagram');
  if (igElem.href === 'https://www.instagram.com/') {
    document.querySelector('div.footer').remove();
  }
};
