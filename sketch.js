function setup() {
  createCanvas(400, 400);
  background(200);

  console.log('✅ p5.js loaded');

  if (ml5) {
    console.log('✅ ml5.js loaded');
  } else {
    console.warn('⚠️ ml5.js NOT loaded');
  }

  if (typeof THREE !== 'undefined') {
    console.log('✅ three.js loaded');
  } else {
    console.warn('⚠️ three.js NOT loaded');
  }
}
