class Particle {
  constructor(x, y, size, speed, direction) {
    this.pos = createVector(x, y);
    let angle = atan2(direction.y, direction.x) + radians(random(-20, 20));
    this.vel = p5.Vector.fromAngle(angle).mult(speed);
    this.lifespan = 255;
    this.size = size;
    this.color = color(255, 150, 0, this.lifespan); // initial color with alpha
  }

  update() {
    this.pos.add(this.vel);
    this.lifespan -= 5;
    this.color.setAlpha(this.lifespan);
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  isDead() {
    return this.lifespan <= 0;
  }
}

export default Particle;
