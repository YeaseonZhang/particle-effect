var btn = document.querySelector('button');
var ctx;

var colorInfoEle = document.querySelector('#colorInfo');
html2canvas(btn).then(canvas => {
  ctx = canvas.getContext('2d');

  createParticleCanvas();

  btn.addEventListener('click', e => {
    // 相对位置
    let localX = e.offsetX;
    let localY = e.offsetY;
    let rgbaColorArr = ctx.getImageData(localX, localY, 1, 1).data;

    let bcr = btn.getBoundingClientRect();
    // 绝对位置
    let globalX = bcr.left + localX;
    let globalY = bcr.top + localY;

    createParticleAtPoint(globalX, globalY, rgbaColorArr);
  });
});

// exploding particle effect
var ExplodingParticle = function () {
  this.animationDuration = 1000;

  this.speed = {
    x: -5 + Math.random() * 10,
    y: -5 + Math.random() * 10
  };

  // 粒子半径
  this.radius = 5 + Math.random() * 5;

  this.life = 30 + Math.random() * 10;
  this.remainingLife = this.life;

  this.draw = ctx => { // canvas 2d 对象
    let p = this;

    if (this.remainingLife > 0 && this.radius > 0) {
      ctx.beginPath();  // 创建路径
      ctx.arc(p.startX, p.startY, p.radius, 0, Math.PI * 2); // 画圆方法
      ctx.fillStyle = `rgba(${p.rgbArray[0]}, ${p.rgbArray[1]}, ${p.rgbArray[2]}, ${p.rgbArray[3]})`;
      ctx.fill(); // 填充当前图像

      // update
      p.remainingLife--;
      p.radius -= 0.25;
      p.startX += p.speed.x;
      p.startY += p.speed.y;
    }
  }
}

var particles = [];

function createParticleAtPoint(x, y, colorData) {
  let particle = new ExplodingParticle();
  particle.rgbArray = colorData;
  particle.startX = x;
  particle.startY = y;
  particle.startTime = Date.now();

  particles.push(particle);
}

var particleCanvas, particleCtx;

function createParticleCanvas() {
  particleCanvas = document.createElement('canvas');
  particleCtx = particleCanvas.getContext('2d');

  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;

  particleCanvas.style.position = 'absolute';
  particleCanvas.style.top = '0';
  particleCanvas.style.left = '0';

  // 确保置于顶层
  particleCanvas.style.zIndex = '1001';
  // 确保下面元素可点击
  particleCanvas.style.pointerEvents = 'none';

  document.body.appendChild(particleCanvas);
}

function update() {
  // clear out the old particles
  if (typeof particleCtx !== 'undefined') {
    particleCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  for(let i = 0; i < particles.length; i++) {
    particles[i].draw(particleCtx);
    console.log(particles[0]);

    if (i === particles.length - 1) {
      let percent = (Date.now() - particles[i].startTime) / particles[i].animationDuration;

      if (percent > 1) {
        particles = [];
      }
    }
  }

  window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);
