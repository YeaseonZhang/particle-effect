var ctx;
var btn = document.querySelector('button');
var colorInfoEle = document.querySelector('#colorInfo');

html2canvas(btn).then(canvas => {
  ctx = canvas.getContext('2d');

  createParticleCanvas();

  let reductionFactor = 17;

  btn.addEventListener('click', e => {
    let width = btn.offsetWidth;
    let height = btn.offsetHeight;
    let colorData = ctx.getImageData(0, 0, width, height).data;

    let count = 0;

    for (let localX = 0; localX < width; localX++) {
      for (let localY = 0; localY < height; localY++) {
        if (count % reductionFactor === 0) {
          let index = (localY * width + localX) * 4;
          let rgbaColorArr = colorData.slice(index, index + 4);

          let bcr = btn.getBoundingClientRect();
          let globalX = bcr.left + localX;
          let globalY = bcr.top + localY;

          createParticleAtPoint(globalX, globalY, rgbaColorArr);
        }
      }
      count++;
    }
  });
});

// exploding particle effect
var ExplodingParticle = function () {
  this.animationDuration = 1000;

  this.speed = {
    x: -5 + Math.random() * 10,
    y: -5 + Math.random() * 10
  };

  this.radius = 5 + Math.random() * 5;

  this.life = 30 + Math.random() * 10;
  this.remainingLife = this.life;

  this.draw = ctx => {
    let p = this;

    if (this.remainingLife > 0 && this.radius > 0) {
      ctx.beginPath();
      ctx.arc(p.startX, p.startY, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(
        ${this.rgbArray[0]},
        ${this.rgbArray[1]},
        ${this.rgbArray[2]},
        ${this.rgbArray[3]}
      )`;
      ctx.fill();

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
  console.log('click');
  let particle = new ExplodingParticle();
  particle.rgbArray = colorData;
  particle.startX = x;
  particle.startY = y;
  particle.startTime = Date.now();

  particles.push(particle);
}

var particleCanvas, particleCtx;

function createParticleCanvas() {
  // create our canvas
  particleCanvas = document.createElement('canvas');
  particleCtx = particleCanvas.getContext('2d');

  //  size canvas
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;

  // position canvas
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

    // simple way to clean up if ths last particle is done animating
    if (i === particles.length - 1) {
      btn.style.display = 'none';
      let percent = (Date.now() - particles[i].startTime) / particles[i].animationDuration;
      if (percent > 1) {
        particles = [];
      }
    }
  }

  window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);
