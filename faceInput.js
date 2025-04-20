let faceLandmarks = [];
let openness = 0;
let direction = { x: 0, y: 0 };
let center = { x: 0, y: 0 };

function setupFaceMesh(video) {
  // Create FaceMesh instance and define where to fetch its model files
  const faceMesh = new FaceMesh({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
  });

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  faceMesh.onResults(gotResults);

  // Setup a frame loop that sends webcam frames to FaceMesh every cycle
  const cam = new Camera(video, {
    onFrame: async () => {
      await faceMesh.send({ image: video });
    },
    width: 640,
    height: 480
  });

  // Begin the frame loop
  cam.start();
}

function gotResults(results) {
  if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
    faceLandmarks = results.multiFaceLandmarks[0];
    center = getMouthCenter(faceLandmarks);
    openness = getMouthOpenness(faceLandmarks);
    direction = getMouthDirection(faceLandmarks);
  }
}

// Get center of mouth
function getMouthCenter(landmarks) {
  const top = landmarks[13];
  const bottom = landmarks[14];
  return {
    x: (top.x + bottom.x) / 2,
    y: (top.y + bottom.y) / 2
  };
}

// Calculate mouth openness ratio
function getMouthOpenness(landmarks) {
  const top = landmarks[13];
  const bottom = landmarks[14];
  const dx = bottom.x - top.x;
  const dy = bottom.y - top.y;
  const dz = bottom.z - top.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Get direction vector between upper/lower lips
function getMouthDirection(landmarks) {
  const top = landmarks[13];
  const bottom = landmarks[14];
  const dx = bottom.x - top.x;
  const dy = bottom.y - top.y;
  const dz = bottom.z - top.z;
  const mag = Math.sqrt(dx * dx + dy * dy + dz * dz);
  return { x: dx / mag, y: dy / mag, z: dz / mag };
}

export { setupFaceMesh, openness, direction, center };
