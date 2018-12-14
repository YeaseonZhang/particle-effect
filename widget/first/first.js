var btn = document.querySelector('button');
var container = document.querySelector('.container');

html2canvas(btn).then(canvas => {
  container.appendChild(canvas);
});

