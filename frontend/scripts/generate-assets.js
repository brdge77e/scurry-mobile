const fs = require('fs');
const { createCanvas } = require('canvas');

// Create a 1024x1024 canvas
const canvas = createCanvas(1024, 1024);
const ctx = canvas.getContext('2d');

// Fill background
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, 1024, 1024);

// Add text
ctx.fillStyle = '#000000';
ctx.font = 'bold 48px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('Scurry', 512, 512);

// Save as PNG
const buffer = canvas.toBuffer('image/png');

// Create assets directory if it doesn't exist
if (!fs.existsSync('./assets')) {
  fs.mkdirSync('./assets');
}

// Save the image in different sizes
fs.writeFileSync('./assets/icon.png', buffer);
fs.writeFileSync('./assets/splash.png', buffer);
fs.writeFileSync('./assets/adaptive-icon.png', buffer); 