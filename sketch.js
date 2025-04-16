// 비디오 및 얼굴 인식 관련 변수 선언 / Declare video and face detection variables
let video;
let faceapi;
let detections = [];
let particles = []; // 입자 배열 / Array for particles

function setup() {
  // 캔버스 생성 / Create the canvas
  createCanvas(640, 480);

  // 카메라 연결 / Connect webcam
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide(); // HTML 요소로 영상이 보이지 않게 숨김 / Hide the default video element

  // [4] 얼굴 감정 분석 모델 옵션 설정 / Set options for face expression detection
  const options = {
    withLandmarks: true, // 얼굴 포인트 추출 / Extract facial landmarks
    withExpressions: false, // 감정 분석 활성화 / Enable emotion prediction
    withDescriptors: false // 얼굴 인식 ID 활성화 / Disable descriptor mode
  };

  // [5] faceapi 모델 로드 / Load the faceApi model
  faceapi = ml5.faceApi(video, options, modelReady);
}

function modelReady() {
  console.log('😎 faceApi model loaded!');
  faceapi.detect(gotResults); // 최초 탐지 호출 / Initial detection call
}

function gotResults(err, result) {
  if (err) {
    console.error(err);
    return;
  }

  detections = result; // 결과 저장 / Store detection results
  faceapi.detect(gotResults); // 재탐지 반복 / Continuous detection
}

function draw() {
  // 카메라 영상을 캔버스에 출력 / Draw the video onto the canvas
  image(video, 0, 0, width, height);

  // 얼굴 탐지 성공 시 / If face detected
  if (detections.length > 0) {
    const mouth = detections[0].parts.mouth;

    // 입 중심 좌표 계산 / Calculate mouth center
    let center = getMouthCenter(mouth);

    // 입자 추가 / Add particle
    particles.push(new Particle(center.x, center.y));
  }

  // 입자 업데이트 및 출력 / Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
}

// 🧠 입 좌표 평균으로 중심 구하기 / Get center of mouth
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

// 💨 입자 클래스 / Particle class
class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 3)); // 랜덤 방향 / random direction
    this.lifespan = 255; // 생명력 / lifespan
    this.size = random(5, 10);
    this.color = color(255, 150, 0, this.lifespan); // 주황빛 입자 / orange-ish particle
  }

  update() {
    this.pos.add(this.vel);
    this.lifespan -= 4;
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
