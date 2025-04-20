import { setupFaceMesh, openness, direction, center } from './faceInput.js';
import Particle from './particle.js';

let video;
let particles = []; // Array for particles

// Lifecycle function: Automatically called once when the page loads
function setup() {
  // Create canvas
  createCanvas(640, 480);

  // Connect webcam
  video = createCapture(VIDEO); // Start capturing video from webcam
  video.size(width, height); // Match video dimensions to canvas size
  video.hide(); // Hide the default HTML video element
  setupFaceMesh(video.elt);
}

// Lifecycle function: Automatically repeats every frame (default 60 times per second)
function draw() {
  // Draw the video onto canvas
  image(video, 0, 0, width, height);

  if (openness > 0.03) {
    let size = map(openness, 0.01, 0.05, 4, 12);
    let speed = map(openness, 0.01, 0.05, 1, 4);
    let count = floor(map(openness, 0.01, 0.05, 1, 5));

    for (let i = 0; i < count; i++) {
      particles.push(
        new Particle(
          center.x * width,
          center.y * height,
          size,
          speed,
          direction
        )
      );
    }
  }

  if (particles.length > 300) {
    particles.splice(0, particles.length - 300);
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }

  // // If face detected
  // if (detections.length > 0) {
  //   const mouth = detections[0].parts.mouth;
  //   let center = getMouthCenter(mouth); // Calculate mouth center
  //   let openness = getNormalizedMouthOpenness(mouth); // Calculate openness ratio

  //   text(`Openness Ratio: ${nf(openness, 1, 3)}`, 10, height - 10);
  //   text(`FPS: ${floor(frameRate())}`, width - 60, height - 10);
  // }
}

window.setup = setup;
window.draw = draw;
