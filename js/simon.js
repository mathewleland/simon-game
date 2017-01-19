let answers = [],
    attempts = [],
    strict = false,
    sounds = {
        red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
        yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
        blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
        green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
    },
    speed = 900,
    steps = 0;
const colors = ["red", "yellow", "blue", "green"],
    original = {
        red: "#E91E63",
        yellow: "#FFEB3B",
        blue: "#03A9F4",
        green: "#009688"
    };

$(document).ready(() => {
    $('#newGame').click(newGame);
    $('#red').click(() => {
        press('red', player = true)
    });
    $('#blue').click(() => {
        press('blue', player = true)
    });
    $('#yellow').click(() => {
        press('yellow', player = true)
    });
    $('#green').click(() => {
        press('green', player = true)
    });
});

function newGame() {
    attempts = [];
    updateSteps();
    resetInfo();
    answers.push(colors.newColor());
    playMoves();
}

function updateSteps() {
    document.getElementById('stepNumber').innerHTML = answers.length;
}

function playMoves() {
    let i = 0;
    if (answers.length < 6) {
        speed = 950;
    } else if (answers.length < 11) {
        speed = 700;
    } else if (answers.length < 20) {
        speed = 600;
    } else {
        winner();
        return;
    }

    const playSounds = window.setInterval(() => {
        if (i >= answers.length - 1) {
            clearInterval(playSounds);
        }
        press(answers[i]);
        i++;
    }, speed);
}

function winner() {
    document.getElementById('info').style.color = 'blue';
    updateInfo("That's Twenty!")
    answers = [];
}

function press(id, player = false) {
    // lighten the color on the button
    document.getElementById(id).style.backgroundColor = 'white';
    document.getElementById(id).style.boxShadow = '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)';
    window.setTimeout(() => {
        document.getElementById(id).style.backgroundColor = original[id];
        document.getElementById(id).style.boxShadow = '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)';
    }, 400);

    //play audio
    var sound = sounds[id];
    sound.play();

    //if it is a human player, add to their attempts and check as you play
    if (player === true) {
        if (answers.length == 0) return;
        attempts.push(id);

        if (answers.checkCurrent(attempts)) {
            if (answers.length == attempts.length) {
                updateSteps();
                setTimeout(function() {
                    answers.push(colors.newColor());
                    attempts = [];
                    playMoves();
                }, 1000);
            }
        } else { //answers != attempts
            if (document.getElementById('strict').checked) { //STRICT
                answers = [];
                attempts = [];
                updateInfo("Sorry, that is incorrect.  Please start a new game");
            } else { //not strict
                attempts = [];
                updateInfo("Sorry that is incorrect; Watch again.")
                setTimeout(() => {
                    resetInfo();
                    playMoves();
                }, 2000);
            }
        }
    }
}

function updateInfo(message) {
    document.getElementById('info').innerHTML = message;
    document.getElementById('info').style.visibility = 'visible';
}

function resetInfo() {
    document.getElementById('info').innerHTML = '';
    document.getElementById('info').style.visibility = 'hidden';
}


//checks to see if all elements in array match correct array (so far)
Array.prototype.checkCurrent = function(guesses) {
    if (!guesses) return false;

    if (guesses.length != this.length) {
        var soFar = this.slice(0, guesses.length);
    } else return this.equals(guesses);

    return (soFar.equals(guesses));
}

Array.prototype.newColor = function() {
    return this[Math.floor(Math.random() * this.length)];
}

Array.prototype.equals = function(array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (let i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        } else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
