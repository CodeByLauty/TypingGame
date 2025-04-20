async function getWords() {
    const MAX_AMOUNT = 60;
    const URL = `https://random-word-api.herokuapp.com/word?number=${MAX_AMOUNT}`;
    try {
        response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        return json
    } catch (error) {
        console.log("Error while fetching words from api", error.message);
    }

    return ["adventure", "belief", "circuit", "discovery", "energy", "focus", "gratitude","harmony", "illumination", "journey", "kindness", "logic", "momentum", "nature","optimism", "precision", "quest", "radiance", "synergy", "triumph", "unity","velocity", "wisdom", "zenith", "algorithm", "balance", "connection", "dream","electricity", "friction", "glow", "horizon", "inspiration", "justice", "knowledge","luminescence", "motion", "nexus", "opportunity", "possibility", "quantum","reflection", "spark", "threshold", "uplift", "vision", "wave", "x-ray", "yield","zephyr", "blueprint", "dynamo", "elevation", "fulcrum", "gauge", "hypothesis","insight", "key", "leap", "magnetism"]
}

async function formatWords(amountOfWords) {
    // Returns an array of words of size n
    const words = await getWords();
    return words.slice(0,amountOfWords);
}

function changeAmountOfWords() {
    // Handles the click event for changing the active word count button

    const activeButton = document.querySelector(".amount-of-words .active");
    activeButton.classList.remove("active");

    this.classList.add("active");

    this.removeEventListener("click", changeAmountOfWords);
    activeButton.addEventListener("click", changeAmountOfWords);

    restartGame();
}

async function initGame() {
    // Initializes a new game

    const gameDIV = document.querySelector(".game");
    const amountOfWords = parseInt(document.querySelector(".amount-of-words .active").textContent);
    const words = await formatWords(amountOfWords);

    words.forEach((word, i) => {
        const wordDIV = document.createElement("div");
        i == 0 ?
            wordDIV.className = "word active" :
            wordDIV.className = "word";
        wordDIV.setAttribute("length", word.length);
    
        Array.from(word).forEach((letter, j) => { 
            const letterDIV = document.createElement("div");
            i == 0 && j == 0 ? 
                letterDIV.className = "letter active" : 
                letterDIV.className = "letter";
            letterDIV.textContent = letter;
            letterDIV.setAttribute("index", j);
            wordDIV.appendChild(letterDIV);
        });
        gameDIV.appendChild(wordDIV);
    });

    const countDownDIV = document.createElement("strong");
    countDownDIV.textContent = 60;
    countDownDIV.className = "count text";
    gameDIV.appendChild(countDownDIV);
}

function deleteInnerContent(element) {
    while (element.firstElementChild) {
        element.removeChild(element.firstElementChild);
    }
}

function restartGame() {
        // Resets Game

        const gameDIV = document.querySelector(".game");
        deleteInnerContent(gameDIV);

        const gameINPUT = document.getElementById("game-input");
        gameINPUT.removeEventListener("keydown", handleKeyDown);
        gameINPUT.addEventListener("keydown", handleKeyDown);
        gameINPUT.removeEventListener("keydown", startTimer);
        gameINPUT.addEventListener("keydown", startTimer);

        initGame();

        recoverFocus();
}

function isSpecialKey(key) {
    // Returns true if key is an special key
    const specialKeys = [
        "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", 
        "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", 
        "Home", "End", "PageUp", "PageDown", 
        "Shift", "Control", "Alt", 
        "AltGraph", "Meta", "CapsLock", "NumLock", "ScrollLock", 
        "Tab", "Backspace", "Enter","Dead", "Insert", "Delete", " ", "Space", "Escape", 
        "PrintScreen", "Pause", 
        "`", "-", "=", "[", "]", "\\", "", "'", ",", ".", "/", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "{", "}", "|", ":", "\"", "<", ">", "?", "'", "°", 
        "Numpad0", "Numpad1", "Numpad2", "Numpad3", "Numpad4", "Numpad5", "Numpad6", "Numpad7", "Numpad8", "Numpad9", "NumpadAdd", "NumpadSubtract", "NumpadMultiply", "NumpadDivide", "NumpadDecimal", "NumpadEnter"];
    return specialKeys.includes(key);
}

function checkLetters(key) {
    // Checks if the key pressed is correct

    const wordActiveDIV = document.querySelector(".word.active");
    const letterActiveDIV = document.querySelector(".letter.active");

    if (letterActiveDIV == null) {
        document.querySelector(".before-active").classList.remove("before-active");
        const letterOvertypedDIV = document.createElement("div");
        letterOvertypedDIV.className = "letter incorrect before-active";
        letterOvertypedDIV.textContent = key;
        letterOvertypedDIV.setAttribute("index", wordActiveDIV.textContent.length);
        wordActiveDIV.appendChild(letterOvertypedDIV);
        return
    }

    letterActiveDIV.classList.add(letterActiveDIV.textContent == key ? "correct" : "incorrect");
    letterActiveDIV.classList.remove("active");
    
    const letterIndex = parseInt(letterActiveDIV.getAttribute("index"));
    const wordLength = parseInt(wordActiveDIV.getAttribute("length"));

    if (letterActiveDIV.classList.contains("correct") && letterIndex == wordLength - 1 && !wordActiveDIV.nextElementSibling.classList.contains("word")) return gameOver();

    if (letterIndex == wordLength - 1) {
        letterActiveDIV.classList.add("before-active");
        return
    }

    if (letterIndex < wordLength - 1) {
        letterActiveDIV.nextElementSibling.classList.add("active")
        return
    }

}

function spacebarLogic() {
    // Manage when spacebar is pressed

    const wordActiveDIV = document.querySelector(".word.active")

    if (wordActiveDIV.firstElementChild.classList.contains("active")) return // returns if its the first letter

    if (!wordActiveDIV.nextElementSibling.classList.contains("word")) return gameOver() // returns if there are no more words

    const letterActiveDIV = document.querySelector(".letter.active") || document.querySelector(".letter.before-active")
    letterActiveDIV.classList.remove("before-active", "active")
    wordActiveDIV.classList.remove("active")
    wordActiveDIV.nextElementSibling.classList.add("active")
    wordActiveDIV.nextElementSibling.firstElementChild.classList.add("active")

    let typedCorrectly = true
    for (const letterDIV of wordActiveDIV.children) {
        if (!letterDIV.classList.contains("correct")) {
            typedCorrectly = false;
            break;
        } 
    }

    if (typedCorrectly) {
        wordActiveDIV.classList.remove("typed-wrong")
        wordActiveDIV.classList.add("typed")
    } else {
        wordActiveDIV.classList.add("typed-wrong")
    }

}

function backspaceLogic() {
    // Manages when backspace is pressed

    const wordActiveDIV = document.querySelector(".word.active");
    const letterActiveDIV = document.querySelector(".letter.active") || document.querySelector(".letter.before-active");

    if (!wordActiveDIV.previousElementSibling && !letterActiveDIV.previousElementSibling) return; // returns if its the first letter and first word

    if (!letterActiveDIV.previousElementSibling && wordActiveDIV.previousElementSibling.classList.contains("typed")) return; // returns if its the first letter and the previous word was is correctly typed

    const letterIndex = parseInt(letterActiveDIV.getAttribute("index"));
    const wordLength = parseInt(wordActiveDIV.getAttribute("length"));

    if (letterIndex == 0) {
        wordActiveDIV.classList.remove("active");
        letterActiveDIV.classList.remove("active", "before-active");

        wordActiveDIV.previousElementSibling.classList.add("active");
        wordActiveDIV.previousElementSibling.classList.remove("typed-wrong");

        const previousWordLength = wordActiveDIV.previousElementSibling.textContent.length;
        if (previousWordLength  > parseInt(wordActiveDIV.previousElementSibling.getAttribute("length"))) {
            wordActiveDIV.previousElementSibling.children[previousWordLength - 1].classList.add("before-active");
            return;
        }

        for (letterDIV of wordActiveDIV.previousElementSibling.children) {
            if (!letterDIV.nextElementSibling) {
                letterDIV.classList.add("before-active");
                return
            }

            if (letterDIV.nextElementSibling.className == "letter") {
                letterDIV.nextElementSibling.classList.add("active");
                return;
            }
        }
    } 

    if (letterIndex <= wordLength - 1) {
        if (letterActiveDIV.classList.contains("before-active")) {
            letterActiveDIV.classList.remove("before-active", "correct", "incorrect");
            letterActiveDIV.classList.add("active");
            return;
        }

        letterActiveDIV.classList.remove("active");
        letterActiveDIV.previousElementSibling.classList.remove("correct", "incorrect");
        letterActiveDIV.previousElementSibling.classList.add("active");
        return;
    }

    if (letterIndex > wordLength - 1) {
        letterActiveDIV.previousElementSibling.classList.add("before-active");
        letterActiveDIV.remove();
        return;
    }
}

function handleKeyDown(e) {
    gameLogic(e);
}

function gameLogic(event) {
    // Manages the logic of the game
    
    if (event.key != "Tab") event.preventDefault(); // Prevents default funtionality of all keys except Tab
    if (event.key == " ") spacebarLogic();
    if (event.key == "Backspace") backspaceLogic();
    if (isSpecialKey(event.key)) return; // returns if the key is an special key

    checkLetters(event.key);
}

function gameOver() {
    // Ends the game and shows the results

    const gameDIV = document.querySelector(".game");

    const wordDIVS = document.querySelectorAll(".word");
    const letterDIVS = document.querySelectorAll(".letter");
    const countDownDIV = document.querySelector(".count");
    const time = parseInt(countDownDIV.textContent);

    let wpm = 0;
    let totalCharacters = 0;
    let correctCharacters = 0
    let incorrectCharacters = 0;
    let extraCharacters = 0;
    let accuracy = 0;

    wordDIVS.forEach((wordDIV) => {
        if (wordDIV.classList.contains("typed")) wpm += 1;
        totalCharacters += parseInt(wordDIV.getAttribute("length"));
    })

    letterDIVS.forEach((letterDIV) => {
        if (letterDIV.classList.contains("correct")) correctCharacters += 1;
        if (letterDIV.classList.contains("incorrect")) incorrectCharacters += 1;

        const letterIndex = parseInt(letterDIV.getAttribute("index"));
        if (letterIndex > parseInt(letterDIV.parentElement.getAttribute("length")) - 1) extraCharacters += 1;
    })

    if (time != 0) {
        wpm = parseInt(wpm / (60 - time) * 60)
    }
    accuracy = parseInt(correctCharacters / (correctCharacters + incorrectCharacters + extraCharacters) * 100)

    const gameINPUT = document.getElementById("game-input");
    gameINPUT.removeEventListener("blur", handleBlur);
    gameINPUT.removeEventListener("keydown", handleKeyDown);

    const resultsDIV = document.createElement("div");
    resultsDIV.className = "results";
            
    const wpmDIV = document.createElement("div");
    wpmDIV.className = "wpm";
    const wpmText = document.createElement("strong");
    wpmText.className = "text";
     wpmText.textContent = "WPM";
    const wpmIcon = document.createElement("p");
    wpmIcon.className = "icon";
    wpmIcon.textContent = wpm;
    wpmDIV.appendChild(wpmText);
    wpmDIV.appendChild(wpmIcon);
    resultsDIV.appendChild(wpmDIV);
            
    const charactersDIV = document.createElement("div");
    charactersDIV.className = "characters";
            
    const sections = [
        { className: "total-characters", text: "Total characters", value: totalCharacters },
        { className: "extra-characters", text: "Extra characters", value: extraCharacters },
        { className: "correct-characters", text: "Correct", value: correctCharacters },
        { className: "incorrect-characters", text: "Incorrect", value: incorrectCharacters },
    ];
            
    sections.forEach((section) => {
        const sectionDIV = document.createElement("div");
        sectionDIV.className = section.className;
            
        const sectionText = document.createElement("strong");
        sectionText.className = "text";
        sectionText.textContent = section.text;
            
        const sectionIcon = document.createElement("p");
        sectionIcon.className = "icon";
        sectionIcon.textContent = section.value;
            
        sectionDIV.appendChild(sectionText);
        sectionDIV.appendChild(sectionIcon);
        charactersDIV.appendChild(sectionDIV);
    });
            
    resultsDIV.appendChild(charactersDIV);
            
    const accuracyDIV = document.createElement("div");
    accuracyDIV.className = "accuracy";
    const accuracyText = document.createElement("strong");
    accuracyText.className = "text";
    accuracyText.textContent = "Accuracy";
    const accuracyIcon = document.createElement("p");
    accuracyIcon.className = "icon";
    accuracyIcon.textContent = `${accuracy}%`;
    accuracyDIV.appendChild(accuracyText);
    accuracyDIV.appendChild(accuracyIcon);
    resultsDIV.appendChild(accuracyDIV);
    

    stopTimer();

    deleteInnerContent(gameDIV);
    gameDIV.appendChild(resultsDIV);
}

function recoverFocus() {
    // Manages focus on game input

    const gameINPUT = document.getElementById("game-input");
    gameINPUT.focus();

    const gameDIV = document.querySelector(".game");
    gameDIV.classList.remove("not-in-game");

    const regainFocusDIV = document.querySelector(".press-key-to-focus");
    regainFocusDIV ? regainFocusDIV.remove() : 0;
}

function handleBlur() {   
    // Handles Blur on game input

    const gameDIV = document.querySelector(".game");
    gameDIV.classList.add("not-in-game");

    const regainFocusDIV = document.createElement("strong");
    regainFocusDIV.textContent = "press any key to continue";
    regainFocusDIV.className = "press-key-to-focus text";
    gameDIV.appendChild(regainFocusDIV);
    
    window.removeEventListener("keydown", recoverFocus);
    window.addEventListener("keydown", recoverFocus);

    const count = document.querySelector(".count").textContent;
    if (count != 60) stopTimer();

    this.addEventListener("keydown", startTimer);
}

function countDown() {
    // Counts down until it reaches cero

    const countDownDIV = document.querySelector(".count");
    countDownDIV.textContent = parseInt(countDownDIV.textContent) - 1;
    
    if (countDownDIV.textContent == 0) {
        gameOver();
    }
}

function startTimer() {
    // Starts countdown

    if (document.activeElement != this) return // returns if the input has no focus

    const gameINPUT = document.getElementById("game-input");
    gameINPUT.removeEventListener("keydown", startTimer);

    clockInterval = setInterval(countDown, 1000);
}

function stopTimer() {
    // Stops de countdown

    clearInterval(clockInterval);
}

// Init a new game
initGame()

// Add Event Listeners

const gameINPUT = document.getElementById("game-input");
gameINPUT.addEventListener("keydown", handleKeyDown);
gameINPUT.addEventListener("blur", handleBlur);
gameINPUT.addEventListener("keydown", startTimer);


gameINPUTFocus = true
window.addEventListener("blur", () => {
    if (document.activeElement === gameINPUT) {
        gameINPUTFocus = true
    } else {
        gameINPUTFocus = false
    }
})
window.addEventListener("focus", () => {
    if (gameINPUTFocus) {
        gameINPUT.focus()
        recoverFocus()
    }
})

const gameOptionButtons = document.querySelectorAll(".amount-of-words .button");
gameOptionButtons.forEach((button) => {
    button.addEventListener("click", changeAmountOfWords);
})

const restartGameButton = document.getElementById("restart-game");
restartGameButton.addEventListener("click", restartGame);