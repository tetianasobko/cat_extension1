let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let mouse = { x: innerWidth / 2, y: innerHeight / 2 };
let countMethodInvoke = 0;
let sitCount = 1;

canvas.addEventListener("mousedown", (e) => {
  if (
    e.x >= cat.x + 40 ||
    e.x <= cat.x - 40 ||
    e.y >= cat.y + 40 ||
    e.y <= cat.y - 40
  ) {
    mouse.x = e.x;
    mouse.y = e.y;
  }
});

class Cat {
  constructor() {
    this.x = Math.floor(Math.random() * 100 + canvas.width);
    this.y = Math.floor(Math.random() * 100 + canvas.height);
    this.image = new Image();
    this.frame = 0;
    this.isLeft = true;
  }
  draw() {
    ctx.save();

    //use translate to move the cat
    ctx.translate(this.x, this.y);

    ctx.drawImage(this.image, -40, -40, 80, 80);
    ctx.restore();
  }

  driveToTarget() {
    //normalize vector
    let vecX = mouse.x - this.x;
    let vecY = mouse.y - this.y;
    let dist = Math.hypot(vecX, vecY);
    vecX /= dist;
    vecY /= dist;

    //set the frame rate
    countMethodInvoke += 1;
    if (countMethodInvoke % 9 == 0) {
      this.frame++;
    }

    //Prevent continuous x and y increment by checking if either vec == 0
    if (vecX != 0 || vecY != 0) {
      if (
        this.x >= mouse.x + 10 ||
        this.x <= mouse.x - 10 ||
        this.y >= mouse.y + 10 ||
        this.y <= mouse.y - 10
      ) {
        if (!this.direction()) {
          this.changeAction("walks", 7);
        }

        this.x += vecX * 1.25; //multiple VecX by n to increase speed
        this.y += vecY * 1.25; //multiple VecY by n to increase speed
      } else if (sitCount % 530 == 0) {
        if (this.frame == 17) {
          sitCount++;
        }

        this.changeAction("licks", 18);
      } else {
        sitCount++;

        this.changeAction("sits", 5);
      }
    }
  }

  changeAction(newAction, frameNumber) {
    this.frame %= frameNumber;

    if (this.isLeft) {
      this.image.src = `images/cat_${newAction}_left_${this.frame}.png`;
    } else {
      this.image.src = `images/cat_${newAction}_${this.frame}.png`;
    }
  }

  direction() {
    //get angle to mouse click
    let angle = Math.atan2(mouse.y - this.y, mouse.x - this.x)
    //converts rads to degrees and ensures we get numbers from 0-180
    let angleDedrees = Math.abs(angle * (180 / Math.PI));

    //checks whether the target is on the right or left side.
    this.isLeft = angleDedrees > 90;
  }
}

let cat = new Cat();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cat.draw();
  cat.driveToTarget();

  requestAnimationFrame(animate);
}

animate();