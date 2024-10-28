
let chars = []; 

let grid;
let cols, rows;
let resolution = 10;  
let noiseOffsetX, noiseOffsetY;
let revealedCells = new Set();
let toRevealCells = [];

let inkThreshold = 0.75;

let noiseLevelX = 0.15;
let noiseLevelY = 0.15;

let overlapAmount = -4;

let r = 255;
let g = 255;
let b = 255;

function setup() {

  createCanvas(windowWidth, windowHeight);
  textSize(resolution);  
  textAlign(CENTER, CENTER);  
  cols = floor(width / resolution);
  rows = floor(height / resolution);
  grid = make2DArray(cols, rows);
  
  nameField = createInput('')
  nameField.id('text_input')
  nameField.attribute('placeholder', 'Your Message')
  nameField.position((windowWidth/2 - 250), windowHeight/2 + 200)
  nameField.size(500)
  
  // Populate ASCII characters from 32 to 126
  //for (let i = 32; i < 127; i++) {
    //chars.push(String.fromCharCode(i));
  //}
  
  chars.push();

  noiseOffsetX = random(1000);
  noiseOffsetY = random(1000);

  generatePattern();
  shiftPatternToCenter();
  mirrorPattern();
}

function draw() {
  background(0);
  
  textFont('Garamond');
  textSize(9);
  textStyle(BOLD);
  fill (r, g, b);
  
  // Calculate the offset to center the grid
  let offsetX = (width - (cols * resolution)) / 2;
  let offsetY = (height - (rows * resolution)) / 2;

  // Draw revealed cells with ASCII characters
  for (let key of revealedCells.keys()) {
    let [i, j] = key.split(",").map(Number);
    drawAscii(i, j, offsetX, offsetY);
  }

  if (revealedCells.size === 0) {
    let centerX = floor(cols / 2);
    let centerY = floor(rows / 2);
    toRevealCells.push([centerX, centerY]);
  }

  let newToReveal = [];
  for (let [i, j] of toRevealCells) {
    if (!revealedCells.has(`${i},${j}`) && grid[i][j] == 1) {
      drawAscii(i, j, offsetX, offsetY);
      revealedCells.add(`${i},${j}`);

      let neighbors = [];
      for (let dx = -4; dx <= 4; dx++) {
        for (let dy = -4; dy <= 4; dy++) {
          let ni = i + dx;
          let nj = j + dy;
          if (ni >= 0 && ni < cols && nj >= 0 && nj < rows) {
            if (!revealedCells.has(`${ni},${nj}`) && grid[ni][nj] == 1) {
              neighbors.push([ni, nj]);
            }
          }
        }
      }
      shuffleArray(neighbors);
      let numToAdd = floor(random(1, neighbors.length + 1));
      newToReveal.push(...neighbors.slice(0, numToAdd));
    }
  }

  toRevealCells = [...new Set(newToReveal)];

  if (toRevealCells.length == 0) {
    noLoop();
  }
}

function generatePattern() {
  let centerX = cols / 4;
  let centerY = rows / 2;

  for (let i = 0; i < cols / 2; i++) {
    for (let j = 0; j < rows; j++) {
      let distToCenter = dist(i, j, centerX, centerY);
      let gradient = map(distToCenter, 0, cols / 2, 1, 0.2);

      let noiseValue = noise(
        i * noiseLevelX + noiseOffsetX,
        j * noiseLevelY + noiseOffsetY
      );
      let combinedValue = gradient * (noiseValue + 0.5);

      grid[i][j] = combinedValue > inkThreshold ? 1 : 0;
    }
  }
}

function shiftPatternToCenter() {
  let maxDistFromCenter = 0;
  for (let i = 0; i < cols / 2; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 1) {
        let currentDist = abs(cols / 2 - i);
        maxDistFromCenter = max(maxDistFromCenter, currentDist);
      }
    }
  }

  let shiftAmount = floor(cols / 2 - maxDistFromCenter) - overlapAmount;

  for (let i = cols / 2 - 1; i >= 0; i--) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 1) {
        let newI = i + shiftAmount;
        if (newI >= 0 && newI < cols) {
          grid[newI][j] = 1;
          grid[i][j] = 0;
        }
      }
    }
  }
}

function mirrorPattern() {
  for (let i = 0; i < cols / 2; i++) {
    for (let j = 0; j < rows; j++) {
      grid[cols - i - 1][j] = grid[i][j];
    }
  }
}

function drawAscii(i, j, offsetX, offsetY) {
  let charIndex = floor(random(chars.length));  // Random character from populated ASCII
  let asciiChar = grid[i][j] == 1 ? chars[charIndex] : ' '; 
  text(asciiChar, i * resolution + offsetX + resolution / 2, j * resolution + offsetY + resolution / 2);
}

function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows).fill(0);
  }
  return arr;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function keyPressed() {
  if (keyIsDown(32)) {
    drawShape();
  } else if (key === "f") {
    enterFullscreen();
  } else if (keyIsDown(49)){
    r = 161;
    g = 0;
    b = 14;
    
    drawShape();
  } else if (keyIsDown(50)){
    r = 1;
    g = 115;
    b = 92;
    
    drawShape();
  } else if (keyIsDown(51)){
    r = 104;
    g = 71;
    b = 141;
    
    drawShape();
  } else if (keyIsDown(13)){
    
    let characters = nameField.value();
    chars = ([...characters].filter(x => x!== ''));
    
    chars = [... new Set(chars)];
  }
}

function drawShape(){
  revealedCells.clear();  
    toRevealCells = [];     
    grid = make2DArray(cols, rows);  
    noiseOffsetX = random(1000); 
    noiseOffsetY = random(1000);
    generatePattern();  
    shiftPatternToCenter(); 
    mirrorPattern(); 
    loop();  
}

function enterFullscreen() {
  fullscreen(!fullscreen());
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = floor(width / resolution);  // Recalculate cols on resize
  rows = floor(height / resolution);  // Recalculate rows on resize
  grid = make2DArray(cols, rows);     // Reset the grid
  noiseOffsetX = random(1000);        // Re-randomize noise offsets
  noiseOffsetY = random(1000);
  generatePattern();                   // Regenerate the pattern
  shiftPatternToCenter();              // Shift the pattern
  mirrorPattern();                     // Mirror the pattern
}
