// My test array of words because I can't seem to get an array of words from the API.

let dataArray = rawData.split("\n");
dataArray = dataArray.filter(line => line.includes(" ") !== true);
const myArrayOfWords = dataArray;

const remoteUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/"    // My remote Url
// Choose a random first word from the array of words and make it the current word.
let myRandomNumber = Math.floor(Math.random() * myArrayOfWords.length);
let currentWord = myArrayOfWords[myRandomNumber];
let numberOfPoints = 0;
let _APIword = {};
let _APIsynonyms = {};
let _APIantonyms = {};
let _APIdefinitions = {};
let _APInumberOfSynonyms = 0;
let _nextAPIword = {};
let _currentAPIsynonyms = {};
let _currentAPIantonyms = {};
let _currentAPIdefinitions = {};
let _currentNumberOfSynonyms = 0;
let _currentGame = 'synonym';
let _currentDifficulty = 'easy';
let _isTimer = false;
let _timerCounter = 60;
let darkTheme = false;
let _nextAudio = ''
let _currentAudio = ''
let optionsVisible = false;
let gameStarted = false;
infoFromAPI(currentWord)

// Gather up the Troops(HTML elements)
const myWordDisplay = document.querySelector('.gameTypeBar')
const gameDifficulty = document.querySelector('.difficulty')
const gameCircle = document.querySelector('.circle')
const gamePointScore = document.querySelector('.score')
const gamePointTitle = document.querySelector('.pointsTitle')
const gameInput = document.querySelector('.inputArea')
const middleArea = document.querySelector('.middleArea')
const middleAreaNextWord = document.querySelector('.middleAreaNextWord')
const listContainer = document.querySelector('.synonym-List')
const optionContainer = document.querySelector('.optionContainer')
const optionGameType = document.querySelector('.optionGameType')
const optionDifficulty = document.querySelector('.optionDifficulty')
const optionTimer = document.getElementById('timerSwitch')
const optionDark = document.getElementById('darkThemeSwtich')
const optionMenuButton = document.querySelector('.optionMenuButton')
const startButton = document.querySelector('.startButton')
const optionStartButton = document.querySelector('.optionStartButton')
const optionDifEasy = document.querySelector('.easy')
const optionDifMedium = document.querySelector('.medium')
const optionDifHard = document.querySelector('.hard')
const darkThemeSwtich = document.getElementById('darkThemeSwtich')
const timerSwitch = document.getElementById('timerSwitch')
//This bit is for playing the mp3 file
const audioButton = document.querySelector('.audioButton')
audioButton.innerHTML = 'Hear Word'
audioButton.addEventListener('click', () => {
    new Audio(_currentAudio).play()
})

optionMenuButton.addEventListener('click', hideShowOptions)
function hideShowOptions() {
    optionMenuButton.innerHTML == 'Options' ? optionMenuButton.innerHTML = 'Close Options' : optionMenuButton.innerHTML = 'Options'
    if (optionsVisible) {
        optionContainer.style.height = '0px'
        optionContainer.style.visibility = 'hidden'
        optionsVisible = false
    } else {
        optionContainer.style.height = '200px'
        optionContainer.style.visibility = 'visible'
        optionsVisible = true
    }
    if (!gameStarted) {
        if (startButton.style.visibility == '') {
            startButton.style.visibility = 'hidden'
        }else {
            startButton.style.visibility = ''
        }
    }
}
function getNewRandomWord() {
    myRandomNumber = Math.floor(Math.random() * myArrayOfWords.length)
    currentWord = myArrayOfWords[myRandomNumber]
}
function adjustMainWord(gameWord, gameMode) {
    myWordDisplay.innerHTML = gameWord
    gameDifficulty.innerHTML = gameMode
}
function setPoints(myPoints) {
    gameCircle.style.visibility = 'visible'
    gamePointTitle.innerHTML = 'Points:'
    gamePointScore.innerHTML = myPoints;
}
function removeElementsFromDOM(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}
function setUpNewWord() {
    _currentNumberOfSynonyms = _APInumberOfSynonyms
    _APInumberOfSynonyms = 0
    _currentAudio = _nextAudio
    _nextAPIword = _APIword
    _currentAPIsynonyms =_APIsynonyms
    _currentAPIantonyms = _APIantonyms
    _nextAPIdefinitions = _APIdefinitions
    _APIsynonyms = {};
    _APIantonyms = {};
    getNewRandomWord()
    infoFromAPI(currentWord)
}

function infoFromAPI(myWord) {
    const myURL = remoteUrl + myWord
    fetch(myURL, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then((apiReturn) => apiReturn.json())
    .then((response) => {
        // This gets the audio for the current word
        response[0].phonetics.forEach((phonetic) => {
            if (phonetic.audio != '') {
                _nextAudio = phonetic.audio
            }
        })
        // This gets the synonyms for the current word
        response.forEach(element => {
            element.meanings.forEach(e => {
                e.synonyms.forEach(s => {
                    if (!s.includes(" ")){
                        _APIsynonyms[s] = true;
                        // This code caused too many requests So I have to cut it out.
                        // fetch(`${remoteUrl}${s}`, {
                        //     method: "GET",
                        //     headers: {
                        //         'Content-Type': 'application/json',
                        //         'Accept': 'application/json'
                        //     },
                        // })
                        // .then(response => response.json())
                        // .then(mySynonymWord => {
                        //     try {
                        //         let myDef = mySynonymWord[0].meanings[0].definitions[0].definition
                        //         _APIsynonyms[s] = myDef;
                        //         _APInumberOfSynonyms ++;
                        //     } catch (e) {
                        //         delete _APIsynonyms[s]
                        //     }
                        // })
                    }
                })
            })
        });
        // this get the antonyms for the current word
        response.forEach(element => {
            element.meanings.forEach(e => {
                let myType = e.partOfSpeech
                e.antonyms.forEach(s => {
                    if (!s.includes(" ")){
                        _APIantonyms[s] = myType;
                    }
                })
            })
        })
    })
}

// BEGIN section is for game setup using Options *************************************
const synonymButton = document.querySelector('.selectSynonym')
const defintionButton = document.querySelector('.selecDefinition')

synonymButton.addEventListener('click', (e) => {
    if (e.target.id == '') {
        e.target.id = 'myGameType'
        defintionButton.id = ''
        _currentGame = 'synonym'
    }
})
defintionButton.addEventListener('click', (e) => {
    if (e.target.id == '') {
        e.target.id = 'myGameType'
        synonymButton.id = ''
        _currentGame = 'definition'
    }
})
function switchDificulty(button) {
    button.target.id ='myDificulty'
    _currentDifficulty = button.target.classList[0]
    switch (button.target.classList[0]) {
        case 'easy':
            optionDifMedium.id = ''
            optionDifHard.id = ''
        break
        case'medium':
            optionDifEasy.id = ''
            optionDifHard.id = ''
        break
        case 'hard':
            optionDifEasy.id = ''
            optionDifMedium.id = ''
        break
    }
}
optionDifEasy.addEventListener('click', switchDificulty)
optionDifMedium.addEventListener('click', switchDificulty)
optionDifHard.addEventListener('click', switchDificulty)

optionTimer.addEventListener('click', (e) => {
    _isTimer ? _isTimer = false : _isTimer = true
})
optionDark.addEventListener('click', (e) => {
    darkTheme ? darkTheme = false : darkTheme = true
})
// END section is for game setup using Options *************************************