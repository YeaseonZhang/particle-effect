var btn = document.querySelector('button');

var ctx;

var colorInfoEle = document.querySelector('#colorInfo');
var colorBlock = document.querySelector('#colorBlock');
html2canvas(btn).then(canvas => {
  ctx = canvas.getContext('2d');
  btn.addEventListener('click', getColorAtPoint);
});

function getColorAtPoint(e) {
  let x = e.offsetX;
  let y = e.offsetY;

  let rgbaColorArr = ctx.getImageData(x, y, 1, 1).data;

  console.log(rgbaColorArr);

  colorInfoEle.innerText = rgbaColorArr;
  colorBlock.style.backgroundColor = `rgba(${rgbaColorArr[0]}, ${rgbaColorArr[1]}, ${rgbaColorArr[2]}, ${rgbaColorArr[3]})`;
}
