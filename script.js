// Get the game container element
const gameContainer = document.getElementById('game-container');

// Create a canvas element to render the game
const canvas = document.createElement('canvas');
canvas.width = 330; // Set the canvas width to match your game's dimensions
canvas.height = 330; // Set the canvas height to match your game's dimensions
gameContainer.appendChild(canvas);

// Get the canvas context
const ctx = canvas.getContext('2d');

// Initialize Pygame (you'll need to include the Pygame library in your HTML file)
const pygame = require('pygame');

// Initialize the game
pygame.init();

// Set screen dimensions
const screen_width = 330;
const screen_height = 330;

// Set title
pygame.display.set_caption("Candle Game");

// Set colors
const black = '#000';
const red = '#FF0000';
const green = '#00FF00';
const gold = '#FFD700';
const yellow = '#FFFF00';

// Set candle dimensions
const red_candle_width = 50;
const green_candle_height = 50;

// Set key dimensions
const key_width = 100;
const key_height = 50;

// Initialize candles
const red_candles = [
  new pygame.Rect(3, 58, red_candle_width, 104),
  new pygame.Rect(58, 3, red_candle_width, 159),
  new pygame.Rect(3, 223, red_candle_width, 104),
  new pygame.Rect(113, 168, red_candle_width, 104),
  new pygame.Rect(168, 3, red_candle_width, 104),
  new pygame.Rect(223, 58, red_candle_width, 159),
  new pygame.Rect(278, 223, red_candle_width, 104)
];

const green_candles = [
  new pygame.Rect(3, 168, 104, green_candle_height),
  new pygame.Rect(168, 223, 104, green_candle_height),
  new pygame.Rect(58, 278, 104, green_candle_height),
  new pygame.Rect(223, 3, 104, green_candle_height)
];

// Initialize key
const key = new pygame.Rect(113, 113, key_width, key_height);

// Load key image
const key_image = new Image();
key_image.src = 'key.png';
key_image.onload = () => {
  key_image.width = key_width;
  key_image.height = key_height;
};

// Selected element
let selected_element = null;

// Dragging
let dragging = false;

// Offset for dragging
let offset_x = 0;
let offset_y = 0;

// Start time
let start_time = 0;

// Game loop
function gameLoop() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  for (let x = 0; x < screen_width; x += 55) {
    if (x % 165 === 0) {
      ctx.strokeStyle = gold;
      ctx.lineWidth = 2;
    } else {
      ctx.strokeStyle = yellow;
      ctx.lineWidth = 1;
    }
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, screen_height);
    ctx.stroke();
  }
  for (let y = 0; y < screen_height; y += 55) {
    if (y % 165 === 0) {
      ctx.strokeStyle = gold;
      ctx.lineWidth = 2;
    } else {
      ctx.strokeStyle = yellow;
      ctx.lineWidth = 1;
    }
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(screen_width, y);
    ctx.stroke();
  }

  // Draw the candles and key
  for (const candle of red_candles) {
    ctx.strokeStyle = black;
    ctx.lineWidth = 2;
    ctx.strokeRect(candle.x - 2, candle.y - 2, candle.width + 4, candle.height + 4);
ctx.fillStyle = red;
    ctx.fillRect(candle.x, candle.y, candle.width, candle.height);
  }
  for (const candle of green_candles) {
    ctx.strokeStyle = black;
    ctx.lineWidth = 2;
    ctx.strokeRect(candle.x - 2, candle.y - 2, candle.width + 4, candle.height + 4);
    ctx.fillStyle = green;
    ctx.fillRect(candle.x, candle.y, candle.width, candle.height);
  }
  ctx.strokeStyle = black;
  ctx.lineWidth = 2;
  ctx.strokeRect(key.x - 2, key.y - 2, key.width + 4, key.height + 4);
  ctx.drawImage(key_image, key.x, key.y, key.width, key.height);

  // Handle user input
  const mouse_x = canvas.offsetLeft + event.clientX;
  const mouse_y = canvas.offsetTop + event.clientY;
  if (dragging) {
    for (const candle of red_candles.concat(green_candles).concat([key])) {
      if (candle.contains(mouse_x, mouse_y)) {
        selected_element = candle;
        offset_x = candle.x - mouse_x;
        offset_y = candle.y - mouse_y;
        break;
      }
    }
  }

  // Update the game state
  if (selected_element === key && selected_element.x > 220) {
    const end_time = Date.now() / 1000;
    const time_taken = end_time - start_time;
    ctx.fillStyle = green;
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'iddle';
    ctx.fillText('You Win!', canvas.width / 2, canvas.height / 2 - 32);
    ctx.fillText(`Time taken: ${time_taken.toFixed(2)} seconds`, canvas.width / 2, canvas.height / 2);
    return;
  }

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

// Add event listeners for user input
canvas.addEventListener('mousedown', (event) => {
  start_time = Date.now() / 1000;
  dragging = true;
});

canvas.addEventListener('mousemove', (event) => {
  if (dragging) {
    const mouse_x = canvas.offsetLeft + event.clientX;
    const mouse_y = canvas.offsetTop + event.clientY;
    if (selected_element) {
      const new_x = mouse_x + offset_x;
      const new_y = mouse_y + offset_y;
      if (selected_element === key) {
        new_x = selected_element.x;
      } else if (green_candles.includes(selected_element)) {
        new_y = selected_element.y;
      }
      if (new_x < 0) {
        new_x = 0;
      } else if (new_x + selected_element.width > screen_width) {
        new_x = screen_width - selected_element.width;
      }
      if (new_y < 0) {
        new_y = 0;
      } else if (new_y + selected_element.height > screen_height) {
        new_y = screen_height - selected_element.height;
      }
      for (const candle of red_candles.concat(green_candles).concat([key])) {
        if (candle!== selected_element && candle.contains(new_x, new_y)) {
          break;
        }
       else {
        selected_element.x = new_x;
        selected_element.y = new_y;
      }}
    }
  }
});

canvas.addEventListener('mouseup', () => {
  dragging = false;
  selected_element = null;
});