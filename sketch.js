let chars = [];
let numberOfCapitalLetters;
let sentiment;
let totalNumOfWords;

let grid;
let cols, rows;
let resolution = 10;
let noiseOffsetX, noiseOffsetY;
let revealedCells = new Set();
let toRevealCells = [];

let inkThreshold;

let noiseLevelX;
let noiseLevelY;

let overlapAmount = -4;

let r1;
let r2;
let g1;
let g2;
let b1;
let b2;
let newToReveal = [];
let gradientStart, gradientEnd;

let maxRange;
let currentIndex = 0;
let interaction = false;

let timers = [];
let drawingTimers = [];
let textField = document.getElementById('input-field-container');
let currentSet;
document.addEventListener('modelReady', () => {
  if (window.ready && interaction === false) {
    // console.log('sentiment: ', sentiment);
    //console.log('score: ', score);
    // console.log('number of swear words: ', numberOfSwearWords);
    // console.log('number of capital letters: ', numberOfCapitalLetters);
    //console.log('number of full capitalised words: ', numberOfFullCapitalisedWords);
    //console.log('number of words: ', totalNumOfWords);
    //console.log('dictionary for characters and their counts: ', charCountDict);
    // console.log('dictionary for punctuation and their counts: ', punctuationDict);
    // console.log('the most repeated character(s) and their counts: ', mostRepeatedCharacters, longestRepeatCounter);
    //console.log('chars: ', chars);
    // console.log(chars);
    
    // chars= chars;
     // To keep track of which result we're currently processing
    let i = window.results[currentIndex%window.results.length]; 

    currentSet = i[0];
    survey_question = i[1];
    survey_string = i[2];
    chars = i[5];
    numberOfCapitalLetters = i[4];
    sentiment = i[3];
    totalNumOfWords = i[6];
    score = i[7];
    updateList(currentSet, survey_question, survey_string, sentiment, numberOfCapitalLetters, chars, totalNumOfWords,score);
    drawShape();
    drawShapeWithRotation();
  }
});

document.addEventListener('interactionReady', () => {
  if (window.interactionReady && interaction === true) {
    let i = window.interactionResults;

    survey_question = i[0];
    survey_string = i[1];
    chars = i[4];
    numberOfCapitalLetters = i[3];
    sentiment = i[2];
    totalNumOfWords = i[5];
    score = i[6];

    updateList("0",survey_question, survey_string, sentiment, numberOfCapitalLetters, chars, totalNumOfWords, score);
    drawShape();
  }
});

function setup() {
  console.log('setup');
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);

  cols = floor(width / resolution);
  rows = floor(height / resolution);

  grid = make2DArray(cols, rows);

  noiseOffsetX = random(1000);
  noiseOffsetY = random(1000);
}


function draw() {
    background(0);
    textSize(resolution);
    // textFont('Garamond');
    textFont('Source Code Pro');
    // textStyle(BOLD);

    fill(255);

    if (window.ready && chars.length > 0) {
      if (interaction === true && !window.interactionReady &&textField.style.display=='block' ) {
        var elementsX = 30;
        var elementsY = 10;
        noStroke();
        removeGlow();

        let charset = ['waiting','for','your','text',"......","you're",'quite','slow',"don't",'you','think','?'];
        for (let x = 0; x < elementsX + 1; x++) {
          for (let y = 0; y < elementsY; y++) {
            let posX = map(x, 0, elementsX, 0, width*2.5);
            let magY = map(sin(radians(posX + frameCount)), -1, 1, -height*.5, height/2);
            let posY = map(y, 0, elementsY, -magY, magY);
            push();
            translate(posX+100, height / 2 + posY);  // Move to calculated position
            if(charset[x] == "waiting" ){
              textSize(40);
              textStyle(ITALIC);
              rotate(-170);
            }
            else if(charset[x] == "quite" ){
              textSize(30);
            }
            else if(charset[x] == "slow"){
              textSize(random(70,80));
              textStyle(BOLD);
            }
            else if(charset[x] == "?"){
              textSize(random(20,100));
              rotate(-100);
            }
            else{textSize(15);}
            text(charset[x],0, 0);  // Draw the circle
            pop();
          }
        }
        return;
        }

        console.log('drawing');
        
        let offsetX = (width - (cols * resolution)) / 2;
        let offsetY = (height - (rows * resolution)) / 2;

        if (revealedCells.size === 0) {
            let centerX = floor(cols / 2);
            let centerY = floor(rows / 2);
            toRevealCells.push([centerX, centerY]); 
        } 

        for (let key of revealedCells.keys()) {
            let [i, j] = key.split(",").map(Number);
            drawAscii(i, j, offsetX, offsetY);
        }
        
        // let newToReveal=[];

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
                neighbors = shuffleArray(neighbors);
                let numToAdd = max(1, floor(random(1, neighbors.length + 1)));  
                newToReveal.push(...neighbors.slice(0, numToAdd));
            }
        }
        toRevealCells = [...newToReveal];

    }



}

function generatePattern() {
  let centerX = cols / 4;
  let centerY = rows / 2;

  for (let i = 0; i < floor(cols / 2); i++) {
    for (let j = 0; j < rows; j++) {
      let distToCenter = dist(i, j, centerX, centerY);
      let gradient = map(distToCenter, 0, cols / 2, 1, 0.2);

      let noiseValue = noise(
        i * noiseLevelX + noiseOffsetX,
        j * noiseLevelY + noiseOffsetY
      );
      let combinedValue = gradient * (noiseValue + 0.55);

      grid[i][j] = combinedValue > inkThreshold ? 1 : 0;
    }
  }

}


function updateNoiseLevels(sentiment, score) {
  switch (sentiment) {
    case 'positive':
      noiseLevelX = 0.05;
      noiseLevelY = 0.05;

      r1 = round(255 * score);     
      console.log(r1); 
      g1 = round(13 * score);        
      b1 = round(2 * score);        

      r2 = round(253 * score);    
      g2 = round(233 * score);      
      b2 = round(38 * score);        
      break;

    case 'neutral':
      noiseLevelX = 0.1;
      noiseLevelY = 0.1;

      r1 = 10;        
      g1 = 250;      
      b1 = 161;        

      r2 = 1;      
      g2 = 130;     
      b2 = 250;   
      break;

    case 'negative':
      noiseLevelX = 0.55;
      noiseLevelY = 0.55;

      r1 = 255;      
      g1 = 0;        
      b1 = 0;      

      r2 = 255;       
      g2 = 0;        
      b2 = 0;      
      break;
  }
  gradientStart = color(r1, g1, b1); 
  gradientEnd = color(r2, g2, b2);
}


function updateInkThreshold(totalNumOfWords) {
  inkThreshold = map(totalNumOfWords, 1, 10, 0.95, 0.75);
  inkThreshold = constrain(inkThreshold, 0.75, 0.95);
}


function updateResolutionBasedOnCapitalizedWords(numOfCapitalizedWords) {
    const minResolution = 10; 
    const maxResolution = 30;

    resolution = map(numOfCapitalizedWords, 0, 10, minResolution, maxResolution);
    
    resolution = constrain(resolution, minResolution, maxResolution);
}


function shiftPatternToCenter() {
  let maxDistFromCenter = 0;
  for (let i = 0; i < floor(cols / 2); i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 1) {
        let currentDist = floor(abs(cols / 2 - i));
        maxDistFromCenter = max(maxDistFromCenter, currentDist);
      }
    }
  }
    
  let shiftAmount = floor(cols / 2 - maxDistFromCenter) - overlapAmount;

  for (let i = floor(cols / 2 - 1); i >= 0; i--) {
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
  for (let i = 0; i < floor(cols / 2); i++) {
    for (let j = 0; j < rows; j++) {
      grid[cols - i - 1][j] = grid[i][j];
    }
  }
}

function glow(glowColor, blurriness){
  drawingContext.shadowBlur = blurriness;
  drawingContext.shadowColor = glowColor;
}
function removeGlow() {
  drawingContext.shadowBlur = 0;      
  drawingContext.shadowColor = 'transparent'; 
}

function drawAscii(i, j, offsetX, offsetY) { 
  let gradientFactor = j / rows;
  let gradientColor = lerpColor(gradientStart, gradientEnd, gradientFactor);
  fill(gradientColor);
  glow(gradientColor, 60);
  let charIndex = floor(random(chars.length));  
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
  return array;
}

function shuffle2DArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; 
  }

  for (let row of array) {
    for (let i = row.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [row[i], row[j]] = [row[j], row[i]];  
    }
  }

  return array;
}


function keyPressed() {
  if (keyIsDown(32)) { // space
    clearAllTimeouts();
    updateList("0","N.A", "N.A", "N.A", "N.A","N.A", "N.A","N.A");
    drawShape();
  } 

  if(keyIsDown(50)){ // 2
    toggleTextField();
  }
  if(keyIsDown(51)){//3
    currentIndex=0;
    clearAllTimeouts();
    let i = window.results[currentIndex%window.results.length]; 
    currentSet = i[0];
    survey_question = i[1];
    survey_string = i[2];
    chars = i[5];
    numberOfCapitalLetters = i[4];
    sentiment = i[3];
    totalNumOfWords = i[6];
    score = i[7];

    updateList(currentSet, survey_question, survey_string, sentiment, numberOfCapitalLetters, chars, totalNumOfWords,score);    
    drawShapeWithRotation();
  } 
}


async function clearShape() {
  let activeGrids = [];
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 1) {
        activeGrids.push([i, j]);
      }
    }
  }
  if (activeGrids.length === 0) {
    return;
  }
  activeGrids = shuffle2DArray(activeGrids);
  let batchSize = 20;

  timers.push(setTimeout(()=>{
  for (let i = 0; i < activeGrids.length; i += batchSize) {
    timers.push(setTimeout(() => {
      let batch = activeGrids.slice(i, i + batchSize);
      if(batch.length>0){
        batch.forEach(([x, y]) => {
          grid[x][y] = 0;  
        });
  
      }

      if (activeGrids.length > 0) {
        clearShape();  
      }
    }, i)); 
  }
},100));

}

function drawShape() {

  newToReveal=[];
  toRevealCells = [];
  grid = make2DArray(cols, rows);
  noiseOffsetX = random(1000);
  noiseOffsetY = random(1000);

  updateNoiseLevels(sentiment,score); 
  updateInkThreshold(totalNumOfWords || 0);
  updateResolutionBasedOnCapitalizedWords(numberOfCapitalLetters || 0);
  generatePattern();
  shiftPatternToCenter();
  mirrorPattern();

}
function drawShapeWithRotation() {

  drawShape();
  if(interaction === false){
    drawingTimers.push(setTimeout(()=>{
      currentIndex++;
      let i = window.results[currentIndex%window.results.length]; 

  
      currentSet = i[0];
      survey_question = i[1];
      survey_string = i[2];
      chars = i[5];
      numberOfCapitalLetters = i[4];
      sentiment = i[3];
      totalNumOfWords = i[6];
      score = i[7];

      clearShape();
      drawingTimers.push(setTimeout(()=>{
        for (var i = 0; i < timers.length; i++)
          {
              clearTimeout(timers[i]);
        }
        drawShapeWithRotation();
        updateList(currentSet,survey_question, survey_string, sentiment, numberOfCapitalLetters, chars, totalNumOfWords,score);
  
      },1000));
    },4000));
  }
  else{
    updateList("0","N.A", "N.A", "N.A", "N.A","N.A", "N.A","N.A");
  }


  
}

function updateList(currentSet,survey_question, text,sentiment,numberOfCapitalLetters,chars,totalNumOfWords,score) {
  document.getElementById("CurrentSet").textContent = ' #'+currentSet+")";
  document.getElementById("surveyQuestion").textContent = survey_question; 
  document.getElementById("textValue").textContent = text; 
  document.getElementById("sentimentValue").textContent = sentiment; 
  document.getElementById("capitalLettersCount").textContent = numberOfCapitalLetters; 
  document.getElementById("charsValue").textContent = chars; 
  document.getElementById("totalWordsCount").textContent = totalNumOfWords; 
  document.getElementById("sentimentScore").textContent = parseFloat(score.toPrecision(4));
}



function enterFullscreen() {
  fullscreen(!fullscreen());
}


function windowResized() {
  resizeCanvas(width, height);
  cols = floor(width / resolution);  
  rows = floor(height / resolution); 
  clearAllTimeouts();
  drawShape(); 
}
  

function toggleTextField() {
  const textField = document.getElementById('input-field-container');

  if (textField.style.display === 'none') {
    textField.style.display = 'block';
    console.log('toggled');
    interaction = true;
    clearAllTimeouts();
    updateList("0","N.A", "N.A", "N.A", "N.A","N.A", "N.A","N.A");

  } else {
    textField.style.display = 'none'; 
    interaction = false;
    

    clearAllTimeouts();
    let i = window.results[currentIndex%window.results.length]; 
    currentSet = i[0];
    survey_question = i[1];
    survey_string = i[2];
    chars = i[5];
    numberOfCapitalLetters = i[4];
    sentiment = i[3];
    totalNumOfWords = i[6];
    score = i[7];

    updateList(currentSet,survey_question, survey_string, sentiment, numberOfCapitalLetters, chars, totalNumOfWords,score);    
    drawShapeWithRotation();
  }
}

function clearAllTimeouts(){
  for (var i = 0; i < timers.length; i++)
    {
        clearTimeout(timers[i]);
  }
  for (var i = 0; i < drawingTimers.length; i++)
    {
        clearTimeout(drawingTimers[i]);
  }
}