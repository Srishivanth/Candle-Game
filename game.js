let redCandles = [];
let greenCandles = [];
let key;
let keyImage;
let selectedElement = null;
let offsetX, offsetY;
let startTime, block = false;
let endTime;

function preload() {
  keyImage = loadImage('key.png'); // Ensure the image file is named 'key.png' and is in the same directory
}

function setup() {
  createCanvas(330, 330);
  redCandles = [
    new Candle(3, 58, 50, 104, 'red'),
    new Candle(58, 3, 50, 159, 'red'),
    new Candle(3, 223, 50, 104, 'red'),
    new Candle(113, 168, 50, 104, 'red'),
    new Candle(168, 3, 50, 104, 'red'),
    new Candle(223, 58, 50, 159, 'red'),
    new Candle(278, 223, 50, 104, 'red')
  ];

  greenCandles = [
    new Candle(3, 168, 104, 50, 'green'),
    new Candle(168, 223, 104, 50, 'green'),
    new Candle(58, 278, 104, 50, 'green'),
    new Candle(223, 3, 104, 50, 'green')
  ];

  key = new Candle(113, 113, 100, 50, 'key');
}

function draw() {
  background(0);
  drawGrid();

  for (let candle of redCandles) {
    candle.show();
  }

  for (let candle of greenCandles) {
    candle.show();
  }

  key.show();

  if (selectedElement) {
    let newX = mouseX + offsetX;
    let newY = mouseY + offsetY;

    if (selectedElement.color === 'red') {
      newX = selectedElement.x;
    } else if (selectedElement.color === 'green' || selectedElement.color === 'key') {
      newY = selectedElement.y;
    }

    newX = constrain(newX, 0, width - selectedElement.w);
    newY = constrain(newY, 0, height - selectedElement.h);

    if (!checkCollision(newX, newY, selectedElement.w, selectedElement.h, selectedElement)) {
      selectedElement.x = newX;
      selectedElement.y = newY;
    }

    if (selectedElement.color === 'key' && selectedElement.x + selectedElement.w >= width) {
      endTime = millis();
      noLoop();
      displayWinMessage();
    }
  }
}

function mousePressed() {
  if (!block) {
    startTime = millis();
    block = true;
  }
  for (let candle of redCandles.concat(greenCandles)) {
    if (candle.contains(mouseX, mouseY)) {
      selectedElement = candle;
      offsetX = candle.x - mouseX;
      offsetY = candle.y - mouseY;
      break;
    }
  }

  if (key.contains(mouseX, mouseY)) {
    selectedElement = key;
    offsetX = key.x - mouseX;
    offsetY = key.y - mouseY;
  }
}

function mouseReleased() {
  selectedElement = null;
}

function touchStarted() {
  if (!block) {
    startTime = millis();
    block = true;
  }
  for (let candle of redCandles.concat(greenCandles)) {
    if (candle.contains(touchX, touchY)) {
      selectedElement = candle;
      offsetX = candle.x - touchX;
      offsetY = candle.y - touchY;
      return false; // Prevent default action
    }
  }

  if (key.contains(touchX, touchY)) {
    selectedElement = key;
    offsetX = key.x - touchX;
    offsetY = key.y - touchY;
    return false; // Prevent default action
  }
  return false; // Prevent default action
}

function touchMoved() {
  if (selectedElement) {
    let newX = touchX + offsetX;
    let newY = touchY + offsetY;

    if (selectedElement.color === 'red') {
      newX = selectedElement.x;
    } else if (selectedElement.color === 'green' || selectedElement.color === 'key') {
      newY = selectedElement.y;
    }

    newX = constrain(newX, 0, width - selectedElement.w);
    newY = constrain(newY, 0, height - selectedElement.h);

    if (!checkCollision(newX, newY, selectedElement.w, selectedElement.h, selectedElement)) {
      selectedElement.x = newX;
      selectedElement.y = newY;
    }

    if (selectedElement.color === 'key' && selectedElement.x + selectedElement.w >= width) {
      endTime = millis();
      noLoop();
      displayWinMessage();
    }
  }
  return false; // Prevent default action
}

function touchEnded() {
  selectedElement = null;
}

class Candle {
  constructor(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
  }

  show() {
    stroke(0);
    if (this.color === 'key') {
      image(keyImage, this.x, this.y, this.w, this.h);
    } else {
      fill(this.color === 'red' ? color(255, 0, 0) : this.color === 'green' ? color(0, 255, 0) : color(255, 215, 0));
      rect(this.x, this.y, this.w, this.h);
    }
  }

  contains(px, py) {
    return px > this.x && px < this.x + this.w && py > this.y && py < this.y + this.h;
  }
}

function drawGrid() {
  stroke(255, 255, 0);
  for (let x = 0; x < width; x += 55) {
    strokeWeight(x % 165 === 0 ? 2 : 1);
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += 55) {
    strokeWeight(y % 165 === 0 ? 2 : 1);
    line(0, y, width, y);
  }
}

function checkCollision(x, y, w, h, exclude) {
  for (let candle of redCandles.concat(greenCandles).concat(key)) {
    if (candle !== exclude && x < candle.x + candle.w && x + w > candle.x && y < candle.y + candle.h && y + h > candle.y) {
      return true;
    }
  }
  return false;
}

function displayWinMessage() {
  background(0);
  textSize(32);
  fill(0, 255, 0);
  textAlign(CENTER);
  text('You Win!', width / 2, height / 2 - 16);
  textSize(16);
  text(`Time taken: ${(endTime - startTime) / 1000} seconds`, width / 2, height / 2 + 16);
}
