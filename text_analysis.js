import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers";
env.allowLocalModels = false;

let pipe = null; // Global variable to hold the pipeline function
let score;
let sentiment;
let numberOfSwearWords;
let numberOfCapitalLetters,numberOfFullCapitalisedWords,totalNumOfWords;
let charCountDict, punctuationDict, mostRepeatedCharacters, longestRepeatCounter;
// const survey_questions = [
//     "How was your day?",
//     "What did you have for lunch?",
//     "What makes you happy?",
//     "(Previously: Sorry, we were unable to save your responses. Try again.) How was your day?",
//     "What makes you happy?",
//     "What makes you angry?",
//     "(Previously: Sorry, there was a problem with saving your responses. Please Try again.) How was your day?",
//     "What makes you angry?",
//     "How do you feel right now?",
//     "Feedback: (If you're kind of mad, feel free to be unhinged. We get it. But please go touch grass.) But if you're not, damn you're patient. But we appreciate any form of feedback."
// ]

// const survey_answers = [[
//     "not bad, managed to wake up early! :)",
//     "MICHELIN STAR POPIAHHHHH #win",
//     "make up and dress up just to go grab matcha #slay",
//     "not bad la",
//     "grab matcha while being pretty",
//     "slow things... played ml and it was stuck on loading JUST LIKE THIS",
//     "what u trying to do.. serious........",
//     "THIS  LOR WTF... STILL DARE ASK :|",
//     "WHATS EVEN GOING ONNN ANYMOREE...",
//     "fuck u la ask me touch grass.....THIS FKING SLOW EH, YOU touch grass instead.... "
// ],
// [
//     "ok",
//     "cup noodle",
//     "money",
//     "getting from good to ok to worse cos of this quiz",
//     "not this quiz",
//     "this quiz",
//     "terrible (because of this quiz. it’s my 4th time doing this.)",
//     "THIS. QUIZ.",
//     "scammed",
//     "I DID THIS QUIZ 4 TIMES. PLS DONT MAKE ME DO IT ONE MORE TIME OR ITS GNA B MY 13TH REASON. ISTG"
// ]];


window.results = [
    [
        1,
        "How was your day?",
        "not bad, managed to wake up early! :)",
        "positive",
        0,
        [
            "n",
            "o",
            "t",
            "b",
            "a",
            "d",
            ",",
            "m",
            "g",
            "e",
            "w",
            "k",
            "u",
            "p",
            "r",
            "l",
            "y",
            "!",
            ":",
            ")"
        ],
        7
    ],
    [
        1,
        "What did you have for lunch?",
        "MICHELIN STAR POPIAHHHHH #win",
        "positive",
        22,
        [
            "M",
            "I",
            "C",
            "H",
            "E",
            "L",
            "N",
            "S",
            "T",
            "A",
            "R",
            "P",
            "O",
            "#",
            "w",
            "i",
            "n"
        ],
        4
    ],
    [
        1,
        "What makes you happy?",
        "make up and dress up just to go grab matcha #slay",
        "neutral",
        0,
        [
            "m",
            "a",
            "k",
            "e",
            "u",
            "p",
            "n",
            "d",
            "r",
            "s",
            "j",
            "t",
            "o",
            "g",
            "b",
            "c",
            "h",
            "#",
            "l",
            "y"
        ],
        11
    ],
    [
        1,
        "(Previously: Sorry, we were unable to save your responses. Try again.) How was your day?",
        "not bad la",
        "neutral",
        0,
        [
            "n",
            "o",
            "t",
            "b",
            "a",
            "d",
            "l"
        ],
        3
    ],
    [
        1,
        "What makes you happy?",
        "grab matcha while being pretty",
        "neutral",
        0,
        [
            "g",
            "r",
            "a",
            "b",
            "m",
            "t",
            "c",
            "h",
            "w",
            "i",
            "l",
            "e",
            "n",
            "p",
            "y"
        ],
        5
    ],
    [
        1,
        "What makes you angry?",
        "slow things... played ml and it was stuck on loading JUST LIKE THIS",
        "negative",
        12,
        [
            "s",
            "l",
            "o",
            "w",
            "t",
            "h",
            "i",
            "n",
            "g",
            ".",
            "p",
            "a",
            "y",
            "e",
            "d",
            "m",
            "u",
            "c",
            "k",
            "J",
            "U",
            "S",
            "T",
            "L",
            "I",
            "K",
            "E",
            "H"
        ],
        13
    ],
    [
        1,
        "(Previously: Sorry, there was a problem with saving your responses. Please Try again.) How was your day?",
        "what u trying to do.. serious........",
        "neutral",
        0,
        [
            "w",
            "h",
            "a",
            "t",
            "u",
            "r",
            "y",
            "i",
            "n",
            "g",
            "o",
            "d",
            ".",
            "s",
            "e"
        ],
        6
    ],
    [
        1,
        "What makes you angry?",
        "THIS  LOR WTF... STILL DARE ASK :|",
        "neutral",
        22,
        [
            "T",
            "H",
            "I",
            "S",
            "L",
            "O",
            "R",
            "W",
            "F",
            ".",
            "D",
            "A",
            "E",
            "K",
            ":",
            "|"
        ],
        6
    ],
    [
        1,
        "How do you feel right now?",
        "WHATS EVEN GOING ONNN ANYMOREE...",
        "negative",
        26,
        [
            "W",
            "H",
            "A",
            "T",
            "S",
            "E",
            "V",
            "N",
            "G",
            "O",
            "I",
            "Y",
            "M",
            "R",
            "."
        ],
        5
    ],
    [
        1,
        "Feedback: (If you're kind of mad, feel free to be unhinged. We get it. But please go touch grass.) But if you're not, damn you're patient. But we appreciate any form of feedback.",
        "fuck u la ask me touch grass.....THIS FKING SLOW EH, YOU touch grass instead.... ",
        "negative",
        18,
        [
            "f",
            "u",
            "c",
            "k",
            "l",
            "a",
            "s",
            "m",
            "e",
            "t",
            "o",
            "h",
            "g",
            "r",
            ".",
            "T",
            "H",
            "I",
            "S",
            "F",
            "K",
            "N",
            "G",
            "L",
            "O",
            "W",
            "E",
            ",",
            "Y",
            "U",
            "i",
            "n",
            "d"
        ],
        14
    ],
    [
        2,
        "How was your day?",
        "ok",
        "neutral",
        0,
        [
            "o",
            "k"
        ],
        1
    ],
    [
        2,
        "What did you have for lunch?",
        "cup noodle",
        "neutral",
        0,
        [
            "c",
            "u",
            "p",
            "n",
            "o",
            "d",
            "l",
            "e"
        ],
        2
    ],
    [
        2,
        "What makes you happy?",
        "money",
        "neutral",
        0,
        [
            "m",
            "o",
            "n",
            "e",
            "y"
        ],
        1
    ],
    [
        2,
        "(Previously: Sorry, we were unable to save your responses. Try again.) How was your day?",
        "getting from good to ok to worse cos of this quiz",
        "negative",
        0,
        [
            "g",
            "e",
            "t",
            "i",
            "n",
            "f",
            "r",
            "o",
            "m",
            "d",
            "k",
            "w",
            "s",
            "c",
            "h",
            "q",
            "u",
            "z"
        ],
        11
    ],
    [
        2,
        "What makes you happy?",
        "not this quiz",
        "negative",
        0,
        [
            "n",
            "o",
            "t",
            "h",
            "i",
            "s",
            "q",
            "u",
            "z"
        ],
        3
    ],
    [
        2,
        "What makes you angry?",
        "this quiz",
        "neutral",
        0,
        [
            "t",
            "h",
            "i",
            "s",
            "q",
            "u",
            "z"
        ],
        2
    ],
    [
        2,
        "(Previously: Sorry, there was a problem with saving your responses. Please Try again.) How was your day?",
        "terrible (because of this quiz. it’s my 4th time doing this.)",
        "negative",
        0,
        [
            "4",
            "t",
            "e",
            "r",
            "i",
            "b",
            "l",
            "(",
            "c",
            "a",
            "u",
            "s",
            "o",
            "f",
            "h",
            "q",
            "z",
            ".",
            "’",
            "m",
            "y",
            "d",
            "n",
            "g",
            ")"
        ],
        11
    ],
    [
        2,
        "What makes you angry?",
        "THIS. QUIZ.",
        "neutral",
        8,
        [
            "T",
            "H",
            "I",
            "S",
            ".",
            "Q",
            "U",
            "Z"
        ],
        2
    ],
    [
        2,
        "How do you feel right now?",
        "scammed",
        "negative",
        0,
        [
            "s",
            "c",
            "a",
            "m",
            "e",
            "d"
        ],
        1
    ],
    [
        2,
        "Feedback: (If you're kind of mad, feel free to be unhinged. We get it. But please go touch grass.) But if you're not, damn you're patient. But we appreciate any form of feedback.",
        "I DID THIS QUIZ 4 TIMES. PLS DONT MAKE ME DO IT ONE MORE TIME OR ITS GNA B MY 13TH REASON. ISTG",
        "negative",
        68,
        [
            "1",
            "3",
            "4",
            "I",
            "D",
            "T",
            "H",
            "S",
            "Q",
            "U",
            "Z",
            "M",
            "E",
            ".",
            "P",
            "L",
            "O",
            "N",
            "A",
            "K",
            "R",
            "G",
            "B",
            "Y"
        ],
        22
    ]
]

// //////////////////////////////////////


async function initializePipeline() {
    pipe = null;
    try {
        pipe = await pipeline('sentiment-analysis', 'Xenova/twitter-roberta-base-sentiment-latest');
        console.log('Pipeline initialized:', pipe);
    } catch (error) {
        console.error('Error initializing pipeline:', error);
        pipe = null;
    }
}

window.onload = async function() {


    // modal
    const modal = document.getElementById('intro-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const introTextElement = document.getElementById('intro-text');
    const textContent = introTextElement.innerText; 
    introTextElement.innerHTML = '';

  const chunkTextByWords = (text, chunkSize) => {
    const words = text.split(' '); 
    const chunks = [];

    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize).join(' ')); 
    }
    
    return chunks;
  };

  const spanElement = document.createElement('span');
  spanElement.innerText =  textContent.split('!')[0]+'!'; 
  introTextElement.appendChild(spanElement);
  introTextElement.appendChild(document.createElement('br'));

  const chunks = chunkTextByWords(textContent.split('!')[1], 15);
    chunks.forEach(chunk => {
        const spanElement = document.createElement('span');
        spanElement.innerText = chunk; 
        introTextElement.appendChild(spanElement);
        introTextElement.appendChild(document.createElement('br'));
      });

    const introTexts = document.querySelectorAll('#intro-text span');


    await initializePipeline();
    window.ready = true;
    console.log(window.results);
    document.dispatchEvent(new Event('modelReady'));
    
    // await runModelOnEachString(survey_answers);

    introTexts.forEach((spanElement, index) => {
        if(index===0){
            setTimeout(() => {
                spanElement.classList.add('start');
            }, 0); 
        }
        else{
            setTimeout(() => {
                spanElement.classList.add('start');
            },  (index) + 3000); 
        }
    });

    modal.style.display = 'flex';    
    closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    console.log('clear pipeline session and init a pipeline');


};

async function runSentimentAnalysis(text) {
    if (pipe) {
        try{
            const result = await pipe(text);
            return result;
        }
        catch(error){
            console.error('dw to work',error);
        }

    }
}

let textInput = document.querySelector("input[name='input_field']");
const enterSVGElement = document.querySelector('#input-field-container svg');

enterSVGElement.addEventListener("click",()=>{
    if(textInput.value.length>0){
        run_model();
    }
    else{
        window.interactionReady = false;
    }
})
textInput.addEventListener("keydown", (e)=>{
    if(e.keyCode === 13){
        if(textInput.value.length>0){
            run_model();
        }
        else{
            window.interactionReady = false;
        }
    }
});




async function run_model() {
    console.log('run_model');
    window.interactionReady = false;
    const text = textInput.value;
    const model_output = await runSentimentAnalysis(text);

    sentiment = model_output[0].label;
    score = model_output[0].score;
    numberOfSwearWords = swearProcess(text);
    [numberOfCapitalLetters, numberOfFullCapitalisedWords, totalNumOfWords] = capsProcess(text);
    [charCountDict, punctuationDict, mostRepeatedCharacters, longestRepeatCounter] = repetitionProcess(text);

    chars = Object.keys(charCountDict);

    const result = [
        "N.A",
        text,
        sentiment,
        numberOfCapitalLetters,
        chars,
        totalNumOfWords
    ];
    window.interactionResults = result;
    
    // Signal that data is ready
    window.interactionReady = true;
    document.dispatchEvent(new Event('interactionReady'));
    
}

/////////////////////////////////////////////////////////////////



async function runModelOnEachString(arrs) {

    window.results = [];

    for (const [index_set,strings] of arrs.entries()){
        for (const [index, text] of strings.entries()) {
            console.log('Processing:', text);

            window.ready = false;

            // Sentiment Analysis
            const model_output = await runSentimentAnalysis(text);
            sentiment = model_output[0].label;
            score = model_output[0].score;
            numberOfSwearWords = swearProcess(text);
            [numberOfCapitalLetters, numberOfFullCapitalisedWords, totalNumOfWords] = capsProcess(text);
            [charCountDict, punctuationDict, mostRepeatedCharacters, longestRepeatCounter] = repetitionProcess(text);

            chars = Object.keys(charCountDict);


            const result = [
                index_set+1,
                survey_questions[index],
                text,
                sentiment,
                numberOfCapitalLetters,
                chars,
                totalNumOfWords
            ];
            window.results.push(result);

        }
    }
    window.ready = true;
    console.log(window.results);
    document.dispatchEvent(new Event('modelReady'));
}




// 

function swearProcess(text) { // for now this returns number of swear words
    const sgSwearWords = ["knn", "kanina", "cb", "chibai", "chi bai", "lan jiao", "lj", "na bei", "nb", "fuck", "fk", "walao"];
    // const swearDict = Object.fromEntries(sgSwearWords.map(word => [word, 0])); 

    //do we need a dict or just count number of swear words?
    let numberOfSwearWords = 0;

    text.split(/\s+/).forEach(word => {
        const lowerWord = word.toLowerCase();
        sgSwearWords.forEach(swearWord => {
            if (lowerWord.includes(swearWord)) {
                // swearDict[swearWord] += 1;
                numberOfSwearWords += 1;
            }
        });
    });

    return numberOfSwearWords;
}

function capsProcess(text) {
    let numberOfCapitalLetters = 0;
    let numberOfFullCapitalisedWords = 0;
    text = text.replace(/[^a-zA-Z ]+/g, '').replace('/ {2,}/', ' '); // remove punctuations
    const words = text.split(" ").filter(x => x !== ''); // in case there is an empty string returned by split function
    const totalNumOfWords = words.length;

    words.forEach(word => {
        if (word === word.toUpperCase()) {
            numberOfFullCapitalisedWords += 1;
        }
        for (const char of word) {
            if (char.toUpperCase() === char) {  // counts uppercase characters
                numberOfCapitalLetters += 1;
            }
        }
    });

    return [numberOfCapitalLetters, numberOfFullCapitalisedWords, totalNumOfWords ];
}

function repetitionProcess(text) {
    const charCountDict = {};

    for (const word of text.split(/\s+/)) {
        for (const char of word) {
            charCountDict[char] = (charCountDict[char] || 0) + 1;
        }
    }

    const longestRepeatCounter = Math.max(...Object.values(charCountDict), 0);
    const mostRepeatedCharacters = [];
    Object.keys(charCountDict).map((key) => {
        if (charCountDict[key] === longestRepeatCounter) {
            mostRepeatedCharacters.push(key);
        }
    }
    )
    const punctuationDict = punctuationsPresent(charCountDict);

    return [charCountDict, punctuationDict, mostRepeatedCharacters, longestRepeatCounter];
}

function punctuationsPresent(charCountDict) {
    const punctuationMarks = [',', '.', '!', '?', ';', ':', '-', '_', '(', ')', '[', ']', '{', '}', '"', "'"];
    const punctuationDict = {};

    punctuationMarks.forEach(mark => {
        punctuationDict[mark] = charCountDict[mark] || 0;
    });

    return punctuationDict;
}