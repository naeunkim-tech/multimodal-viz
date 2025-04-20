class Particle {
  constructor(x, y, direction, settings) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(settings.speed);
    this.size = settings.size * map(abs(direction.z), 0, 0.5, 1, 1.8); // Modify size based on z-depth (mouth opening toward camera)
    this.lifespan = 255;
    this.lifespanDecay = settings.lifespanDecay;
    this.baseColor = settings.color;
    this.shapeSides = settings.shapeSides;
    this.concavity = settings.concavity;
  }

  update() {
    this.pos.add(this.vel);
    // this.vel.mult(0.98);
    this.lifespan -= this.lifespanDecay;
    // this.color.setAlpha(this.lifespan);
  }

  display() {
    noStroke();
    let c = color(this.baseColor);
    c.setAlpha(this.lifespan);
    fill(c);

    const sides = floor(this.shapeSides);
    if (sides < 3) {
      // circle
      ellipse(this.pos.x, this.pos.y, this.size);
    } else {
      // polygon
      this.drawStarPolygon(
        this.pos.x,
        this.pos.y,
        this.size / 2,
        sides,
        this.concavity
      );
    }
  }

  drawStarPolygon(x, y, radius, sides, concavity) {
    const innerRadius = radius * (1 - concavity);
    const totalPoints = sides * 2;

    beginShape();
    for (let i = 0; i < totalPoints; i++) {
      const isOuter = i % 2 === 0;
      const angle = (TWO_PI * i) / totalPoints;
      const r = isOuter ? radius : innerRadius;
      const vx = x + cos(angle) * r;
      const vy = y + sin(angle) * r;
      vertex(vx, vy);
    }
    endShape(CLOSE);
  }

  isDead() {
    return this.lifespan <= 0;
  }
}

export default Particle;
