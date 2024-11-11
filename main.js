import './style.css'
import * as WORLD from './world.js';
import * as LOGIC from './logic.js';

let codeSize = 0, numColors = 0, numTries = 0, isRepeatAllowed = false;

function validate_input() {
    codeSize = document.getElementById('codeSize').value;
    numColors = document.getElementById('numColors').value;
    numTries = document.getElementById('numTries').value;
    isRepeatAllowed = document.getElementById('allowDuplicates').checked;

    if(codeSize < 4 || codeSize > 8) {
        alert('Secret code size must be between 4 and 8!');
        return;
    }

    if(numColors < 4 || numColors > 12) {
        alert('Number of colors must be between 4 and 12!');
        return;
    }

    if(numColors < codeSize && !isRepeatAllowed) {
        alert('Number of colors must be greater than or equal to secret code size when no repetition is allowed!');
        return;
    }

    if(numTries < 10 || numTries > 20) {
        alert('Number of tries must be between 10 and 20!');
        return;
    }

    const menu = document.getElementById('menu');
    const buttons = document.getElementById('buttonsDiv');

    menu.style.display = 'none';
    buttons.style.display = 'none';

    play_game();
}

function play_game() {    
    WORLD.init_world(codeSize, numColors, numTries);
    WORLD.animate();
    LOGIC.start_game(numColors, codeSize, numTries, isRepeatAllowed);
}

const element = document.getElementById('startBtn');
element.addEventListener('click', validate_input);