import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers";
env.allowLocalModels = false;

let model_output;
let textInput = document.querySelector("input[name='input_field']");
// textInput.addEventListener("change", run_model);
textInput.addEventListener("change", run_model);
textInput.addEventListener("keydown", (e)=>{
    if(e.keyCode === 13){
        run_model();
    }
});

const pipe = await pipeline('sentiment-analysis', 'Xenova/twitter-roberta-base-sentiment-latest');

async function run_model() {
    console.log('run_model');
    window.ready = false;
    const text = textInput.value;
    model_output = await pipe(text);
    window.sentiment = model_output[0].label;
    window.score = model_output[0].score;
    window.numberOfSwearWords = swearProcess(text);
    [window.numberOfCapitalLetters, window.numberOfFullCapitalisedWords, window.totalNumOfWords] = capsProcess(text);
    [window.charCountDict, window.punctuationDict, window.mostRepeatedCharacters, window.longestRepeatCounter] = repetitionProcess(text);
    window.chars = Object.keys(window.charCountDict);
    // Signal that data is ready
    window.ready = true;
    document.dispatchEvent(new Event('modelReady'));
    
}


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
            if (char.toUpperCase() === char && isNaN(char)) {  // counts uppercase characters
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