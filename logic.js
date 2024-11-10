import * as WORLD from './world.js';

const timeFrame = 1000 / 60;
let gameIntervalId;

const ballColors = ['red', 'green', 'indigo', 'yellow', 'purple', 'white', 
                    'orange', 'fuchsia', 'maroon', 'teal', 'hot_pink', 'black'];
const keyColors = ['R', 'G', 'I', 'Y', 'P', 'W',
                   'O', 'F', 'M', 'T', 'H', 'B'];

let selColors = [], selColorsKeys = [];


const pinColors = ['white', 'black'];

let secretCode, currTry = 0, currSlot = 0, numSlots = 4;
const guess = new Map();

function check_submitted_guess(secretCode, guess) {
    let result = [];

    for(let i = 0; i < secretCode.length; i++) {
        // Check for exact matches
        if(secretCode[i] === guess[i]) {
            result.push(pinColors[1]);
            continue;
        }
        // Check for color matches only when exact matches are not found
        for(let j = 0; j < secretCode.length; j++) {
            if(secretCode[i] === guess[j] && i !== j) {
                result.push(pinColors[0]);
                break;
            }
        }
    }

    return result;
}

function generate_random_code(numColors, size, isRepeatAllowed) {
    let code = [];
    let colorsAvail = ballColors.slice(), keyAvail = keyColors.slice();

    for(let i = 0; i < numColors; i++) {
        // Select random color from available colors
        let index = Math.floor(Math.random() * colorsAvail.length);
        selColors.push(colorsAvail[index]);
        selColorsKeys.push(keyAvail[index]);
        
        // Display selected color in div
        let x = document.getElementById("info_color_".concat(colorsAvail[index]));
        x.style.display = 'block';

        colorsAvail.splice(index, 1);
        keyAvail.splice(index, 1);
    }

    let x = document.getElementById("helpDiv");
    x.style.display = 'block';

    // Generate code with or without repetition
    if(isRepeatAllowed) {
        for(let i = 0; i < size; i++) {
            code.push(selColors[Math.floor(Math.random() * numColors)]);
        }
    }
    else {
        colorsAvail = selColors.slice();
        for(let i = 0; i < size; i++) {
            let index = Math.floor(Math.random() * colorsAvail.length);
            code.push(colorsAvail[index]);
            colorsAvail.splice(index, 1);
        }
    }

    return code;
}

export function start_game(numColors, codeSize, numTries, isRepeatAllowed) {
    numSlots = codeSize;
    secretCode = generate_random_code(numColors, codeSize, isRepeatAllowed);
    gameIntervalId = setInterval(game_loop(numColors, numTries), timeFrame)
}

export function game_loop(numColors, numTries) {   
    // Add event listener for keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if(e.code.includes('Digit')) {
            for(let i = 0; i < numSlots; i++) {
                if(e.code === `Digit${i + 1}`) {
                    console.log(`Spot ${i + 1} selected`);
                    currSlot = i;
                    break;
                }
            }
        }
        else if(e.code === 'Enter') {
            if(guess.size == numSlots) {
                let guessSorted = [];
                for(let i = 0; i < numSlots; i++) {
                    guessSorted.push(guess.get(i));
                }              
                let result = check_submitted_guess(secretCode, guessSorted);
                
                WORLD.add_clue_pins(result, currTry);

                // Stop game if player wins
                if(result.length == numSlots && result.every((val) => val == pinColors[1])) {
                    alert('You win! It took you ' + (currTry + 1) + ' tries to win! Refresh the page to start a new game.');
                    clearInterval(gameIntervalId);
                    return;
                }

                // Stop game if player loses
                if(currTry == numTries - 1) {
                    alert('You lost... The secret code was ' + secretCode + '. Refresh the page to start a new game.');
                    clearInterval(gameIntervalId);
                    return;
                }

                guess.clear();
                currTry++;
            }
            else {
                alert('Please fill all slots before submitting your guess!');
            }
        }
        else if(e.code.includes('Key')){
            for(let i = 0; i < numColors; i++) {
                if(e.code === `Key${selColorsKeys[i]}`) {
                    if(!guess.has(currSlot)) {
                        guess.set(currSlot, selColors[i]);
                        WORLD.add_guess_ball(selColors[i], currTry, currSlot);
                    }
                    else {
                        // Remove previous guess
                        WORLD.remove_guess_ball(currTry, currSlot);
                        guess.delete(currSlot);

                        // Add new guess
                        guess.set(currSlot, selColors[i]);
                        WORLD.add_guess_ball(selColors[i], currTry, currSlot);
                    }
                    break;
                }
            }
        }
    });
}