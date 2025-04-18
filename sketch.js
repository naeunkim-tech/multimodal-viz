let video;
let faceapi;
let detections = []; // Variable for face detection
let particles = []; // Array for particles

function setup() {
  // Create canvas
  createCanvas(640, 480);

  // Connect webcam
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide(); // Hide the default HTML video element

  // Options for face expression detection
  const options = {
    withLandmarks: true, // Extract facial landmarks
    withExpressions: false, // Enable emotion prediction
    withDescriptors: false // Disable descriptor mode
  };

  // Load the faceApi model
  faceapi = ml5.faceApi(video, options, modelReady);
}

function modelReady() {
  console.log('😎 faceApi model loaded!');
  faceapi.detect(gotResults); // Initial detection call
}

function gotResults(err, result) {
  if (err) {
    console.error(err);
    return;
  }

  detections = result; // Store detection results
  faceapi.detect(gotResults); // Loop detection

  // If face detected
  if (detections.length > 0) {
    const mouth = detections[0].parts.mouth;

    let center = getMouthCenter(mouth); // Calculate mouth center
    let openness = getNormalizedMouthOpenness(mouth); // Calculate openness ratio

    // Skip particle generation when mouth is nearly closed
    if (openness < 0.31) return;

    let size = map(openness, 0.18, 0.35, 4, 12); // Map openness range (0.18~0.35) → size range (4~12)
    let speed = map(openness, 0.18, 0.35, 1, 4); // Map openness range (0.18~0.35) → speed range (1~4)
    let count = floor(map(openness, 0.18, 0.35, 1, 5)); // Map openness range (0.18~0.35) → number of particles created per frame (1~5)

    for (let i = 0; i < count; i++) {
      particles.push(new Particle(center.x, center.y, size, speed));
    }

    // Limit total particle count (to prevent particle overload & performance drop)
    if (particles.length > 300) {
      particles.splice(0, particles.length - 300);
    }
  }
}

function draw() {
  // Draw the video onto canvas
  image(video, 0, 0, width, height);

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }

  // If face detected
  if (detections.length > 0) {
    const mouth = detections[0].parts.mouth;
    let center = getMouthCenter(mouth); // Calculate mouth center
    let openness = getNormalizedMouthOpenness(mouth); // Calculate openness ratio

    text(`Openness Ratio: ${nf(openness, 1, 3)}`, 10, height - 10);
    text(`FPS: ${floor(frameRate())}`, width - 60, height - 10);
  }
}

// Get center of mouth
function getMouthCenter(mouthPoints) {
  let xSum = 0,
    ySum = 0;
  for (let pt of mouthPoints) {
    xSum += pt._x;
    ySum += pt._y;
  }
  return {
    x: xSum / mouthPoints.length,
    y: ySum / mouthPoints.length
  };
}

// Calculate mouth openness ratio
function getNormalizedMouthOpenness(mouthPoints) {
  const topLip = mouthPoints[13];
  const bottomLip = mouthPoints[17];
  const leftCorner = mouthPoints[0];
  const rightCorner = mouthPoints[6];

  if (topLip && bottomLip && leftCorner && rightCorner) {
    const vertical = dist(topLip._x, topLip._y, bottomLip._x, bottomLip._y);
    const horizontal = dist(
      leftCorner._x,
      leftCorner._y,
      rightCorner._x,
      rightCorner._y
    );
    return vertical / horizontal;
  } else {
    return 0; // fallback if data is missing
  }
}

class Particle {
  constructor(x, y, size, speed) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 3)); // random direction
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
