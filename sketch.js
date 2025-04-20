import { setupFaceMesh, openness, direction, center } from './faceInput.js';
import Particle from './particle.js';

let video;
let particles = []; // Array for particles
let sizeSlider,
  speedSlider,
  colorPicker,
  shapeSlider,
  concavitySlider,
  countSlider,
  lifespanSlider;

// Lifecycle function: Automatically called once when the page loads
function setup() {
  // Create canvas
  const canvas = createCanvas(640, 480);
  canvas.parent('canvas-container');

  // Connect webcam
  video = createCapture(VIDEO); // Start capturing video from webcam
  video.size(width, height); // Match video dimensions to canvas size
  video.hide(); // Hide the default HTML video element
  setupFaceMesh(video.elt);

  // Particle control UI
  const uiContainer = createDiv().id('ui-container');

  sizeSlider = createSlider(1, 20, 8, 1).parent(uiContainer);
  createSpan(' Size').parent(uiContainer);

  speedSlider = createSlider(0.1, 10, 3, 0.1).parent(uiContainer);
  createSpan(' Speed').parent(uiContainer);

  colorPicker = createColorPicker('#ff9600').parent(uiContainer);
  createSpan(' Color').parent(uiContainer);

  shapeSlider = createSlider(0, 10, 0, 1).parent(uiContainer);
  createSpan(' Shape (sides)').parent(uiContainer);

  concavitySlider = createSlider(0, 1, 0, 0.05).parent(uiContainer);
  createSpan(' Concavity (0=smooth, 1=sharp)').parent(uiContainer);

  countSlider = createSlider(1, 20, 5, 1).parent(uiContainer);
  createSpan(' Count (particles per frame)').parent(uiContainer);

  lifespanSlider = createSlider(1, 10, 4, 1).parent(uiContainer);
  createSpan(' Lifespan decay (higher = faster)').parent(uiContainer);
}

// Lifecycle function: Automatically repeats every frame (default 60 times per second)
function draw() {
  // Draw the video onto canvas
  image(video, 0, 0, width, height);

  if (openness > 0.03) {
    const count = countSlider.value();

    const settings = {
      size: sizeSlider.value(),
      speed: speedSlider.value(),
      color: colorPicker.color(),
      shapeSides: shapeSlider.value(),
      concavity: concavitySlider.value(),
      lifespanDecay: lifespanSlider.value()
    };

    for (let i = 0; i < count; i++) {
      particles.push(
        new Particle(center.x * width, center.y * height, direction, settings)
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
}

window.setup = setup;
window.draw = draw;
