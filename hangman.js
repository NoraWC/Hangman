/* Hangman project
* Nora Coates
* Finished and Uploaded on Thursday, October 26th, 2017
*/

var WORD = "huge"; //the word to be guessed; undefined when picked from list

var WORD_LIST = ["huge", "nutmeg", "chefapron"]; //list of words to pick WORD from

var WALDO = ""; //the displayed word, starting as blanks and with letters substituted in as the user plays

var ABC = " abcdefghijklmnopqrstuvwxyz";

var LIVES = 0;

var CORRECT_LETTERS = 0;

var GUESSED_LETTERS = ""; //stores all guessed letters

function makeStringOf(num, char) {
    var str = "";
    for(var i = 0; i < num; i ++) {
        str += char;
    }
    str += " ";
    return str;
}

function pickWord() {
    var arr = ["Easy", "Middle", "Hard"];
    for (var z = 0; z < 3; z++) {
        if (arr[z] === document.getElementById('diff_list').value) {
            WORD = WORD_LIST[z];
        }
    }
}

function newGame() {
    //resets ABC
    ABC = " abcdefghijklmnopqrstuvwxyz";
    //resets list of available letters
    setUpList();

    pickWord();
    //WORD = WORD_LIST[pickWord()];//undefined
    //resets waldo
    WALDO = makeStringOf(WORD.length, '_ ');
    document.getElementById("letterGuess").innerHTML = WALDO;
    //resets lives
    LIVES = 5;
    //resets list of guessed letters
    GUESSED_LETTERS = "";
    returnLives();
    //rests count of correct guesses
    CORRECT_LETTERS = 0;
    //resets win/loss message
    checkLoss();
}


function isLetter(guess) {
    var chance = 0; //counts how many guesses were used
    if (guess !== " ") {//if a letter was entered and a game has been started
        for (var i = 0; i < WORD.length; i ++) {
            if(guess === WORD[i]) { // if the guessed letter is the same as this index of WORD

                //saves the location of the guess
                var letterSpot = WORD.indexOf(guess)*2;

                //stores all of WALDO before where the guess should be
                var before = WALDO.slice(0, letterSpot);

                //stores all of WALDO after where the guess should be
                var after = WALDO.slice(letterSpot+1, WALDO.length);

                //concatenates the stuff before the guess with the guess, and then the stuff after the guess
                WALDO = before + WORD[i] + after;
                CORRECT_LETTERS +=1;//adds one to the correct guess counter
            } else { //if the guessed letter isn't at this spot in WORD
                chance ++; //add one to the chance counter
            }
        }
        GUESSED_LETTERS += guess; //add the guessed letter to the string GUESSED_LETTERS
        if (chance >= WORD.length) { //if the guessed letter was not in WORD at all
            LIVES = LIVES - 1; //take away one life

        }
    }
    //removes the guess from the ABC string
    cleanABC(guess);
    //shows waldo and all guessed letters to the user
    returnLetters();
    //update the lives counter
    returnLives();
}


function cleanABC(letter) { //removes guessed letters from ABC and thus the list from which one guesses letters
    var len = ABC.length; //stores the length of ABC
    for(var i = 0; i < len; i++) {
        if (letter === ABC[i]) { //if the value plugged in is at this index of ABC

            //ABC is changed to all bits before the letter and all bits after, with a space instead of the letter
            ABC = ABC.slice(0,i) + " " + ABC.slice(i+1, ABC.length);
        }
    }
    //resubmits ABC to the list
    setUpList();
}

function returnLetters() {
    //plugs in WALDO and the guessed letters to their respective divs
    document.getElementById("letterGuess").innerHTML = WALDO;
    document.getElementById("listOfGuesses").innerHTML = "Already Guessed Letters: " + GUESSED_LETTERS;
}


function checkLoss() {
    //checks win or loss condition
    var returnVal;
    var janitor = "abcdefghijklmnopqrstuvwxyz";
    if (CORRECT_LETTERS === WORD.length) {
        returnVal = true;
        for (var x = 0; x < GUESSED_LETTERS.length; x ++) {
            GUESSED_LETTERS = charOut(GUESSED_LETTERS, janitor[x]);
        }
        returnLetters();
    } else {
        returnVal = false;
    }
    return returnVal;
}


function charOut(str, char) {
    /* returns the given string, without the given character
    * modified from JS-problems 11-20
     */
    for(var x = 0; x < str.length-1; x++) {
        if(str[x] === char) {
            //if this char is a star
            str = str.substring(0, x-1) + str.substring(x+1, str.length);
        }

    }
    return str;
}


function returnLives() { //checks status of lives
    var janitor = "abcdefghijklmnopqrstuvwxyz";
    if (LIVES === 0) { //if the user lost
        //returns a lose message
        document.getElementById("livesLeft").innerHTML = "Game Over! The word was: " + WORD + ". Click 'start the game' to play again.";
        //and make ABC into just spaces so they can't keep playing
        for (var i = 0; i < ABC.length; i ++) {
            cleanABC(janitor[i]);
        }
        //remove all letters from GUESSED_LETTERS
        for (var z = 0; z < GUESSED_LETTERS.length; z ++) {
            GUESSED_LETTERS = charOut(GUESSED_LETTERS, janitor[z]);
        }
        returnLetters();
    } else if (LIVES === -1) { //if the game hasn't officially started yet
        //tell them to start
        document.getElementById("livesLeft").innerHTML = "Choose a difficulty and click 'start the game' to play!";

    } else { //if they still have lives left
        //display the number of lives they have left
        document.getElementById("livesLeft").innerHTML = "You have " + LIVES + " lives left.";
        if (checkLoss() === true) { //if they won
            //display a win message
            document.getElementById("livesLeft").innerHTML = "You won! Click 'start the game' to play again.";
        }
    }
}

function setUpList() {// pushes the value of ABC to the list the user chooses their guess from
    var final = "<select id = 'list' title = 'list'>";
    for (var i = 0; i < 26; i ++ ) {
        final += "<option value = '" + ABC[i] + "'>" + ABC[i] + "</option>";
    }
    final += "</select>";
    document.getElementById('list').innerHTML = final;
}
