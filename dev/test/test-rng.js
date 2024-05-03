import { TEST_RNG } from '../util/TestRng.js';
const rand = new TEST_RNG();
const canvas = document.querySelector('canvas');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const ctx = canvas.getContext('2d');
ctx.fillRect(0, 0, canvasWidth, canvasHeight);
const canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
for (let p = 0; p < 100; p++) {
    let randC = 0;
    let mathC = 0;
    for (let i = 0; i < 100000; i++) {
        const randF = rand.nextFloat() * 100;
        const mathF = Math.random() * 100;
        if (randF < p)
            randC++;
        if (mathF < p)
            mathC++;
    }
    console.log(`p(${p}), rand(${randC / 100000}), math(${mathC / 100000})`);
}
const amount = 500;
const weight = 25000 / amount;
for (let y = 0; y < canvasHeight; y++) {
    for (let x = 0; x < canvasWidth / 2 - 5; x++) {
        const mathF = Math.random();
        drawPixel(x, y, 255 * mathF, 255 * mathF, 255 * mathF, 255);
    }
}
for (let y = 0; y < canvasHeight; y++) {
    for (let x = canvasWidth / 2 + 5; x < canvasWidth; x++) {
        const randF = rand.nextFloat();
        drawPixel(x, y, 255 * randF, 255 * randF, 255 * randF, 255);
    }
}
function drawPixel(x, y, r, g, b, a) {
    x = Math.floor(x);
    y = Math.floor(y);
    ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a / 255 + ')';
    ctx.fillRect(x, y, 1, 1);
}
function updateCanvas() {
    ctx.putImageData(canvasData, 0, 0);
}
