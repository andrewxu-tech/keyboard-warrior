document.addEventListener("DOMContentLoaded", function(event) {
  let audios = document.getElementsByClassName('audio-to-load');
  window.setInterval(function() {
    console.log('inside setinterval');
    console.log(audios[0].readyState);
    console.log(audios[1].readyState);
    console.log(audios[2].readyState);
    console.log(audios[3].readyState);
    if (audios[0].readyState === audios[1].readyState === audios[2].readyState === audios[3].readyState === 4) {
      console.log('all audio loaded');
    }
  }, 100);
  // console.log(document.getElementsByClassName("mozart-accompaniment")[0].readyState);
  // console.log(document.getElementsByClassName("jasmine-accompaniment")[0].readyState);
  // console.log(document.getElementsByClassName("horse-accompaniment")[0].readyState);
  // console.log(document.getElementsByClassName("hamilton-accompaniment")[0].readyState);

  console.log('updated with condition');
  // console.log("Start: " + x.buffered.start(0) + " End: " + x.buffered.end(0));
  // console.log(x.readyState);
  // console.log(x.duration);

// ~~~META~~~
  let gameInProgress = false; // Whether or not they've pressed the start button
  let onMainMenu = false; //Whether or not they're on the main menu
  let timePassed = 0; // Since beginning of start of piece
  let noteCounter = 0; // The current note this game is on.
  let basicUnit = null; // The lowest tempo unit, in milliseconds.
  let currentNote = null; // DOM selector of the current falling note expected to being played.
  let audioSource = null; // The filename of the audio source
  let score = 0; // Number of notes they got right
  let almosts = 0; // Number of almost correct
  let wrongs = 0; // Number of notes they got wrong
  let piece = null; // The name of the piece.

//
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  window.location.replace("./mobile.html");
  }

// ~~~ONLOAD EVENTS~~~
  playSoundEffect('start-game');
  document.getElementsByTagName('h1')[0].classList.add('slide-from-left');
  document.getElementsByTagName('h2')[0].classList.add('slide-from-right');
  document.getElementsByClassName('background-flag')[0].classList.add('fall-from-top');
  document.getElementsByClassName('enter-button')[0].classList.add('slide-from-bottom');
  setTimeout(function() {
    document.getElementsByClassName('enter-button')[0].classList.remove('slide-from-bottom');
    document.getElementsByClassName('enter-button')[0].classList.add('pop');
  }, 3000)

// ~~~SETTING AUDIO~~~
  let keys = document.getElementsByClassName('key');
  let keysPressedStatus = {
  }

  let musicAudio = null;
  function playMusic(music) {
    let musicAudio = document.getElementsByClassName('music-playing')[0];
    musicAudio.setAttribute('src', `./sounds/${music}.mp3`);
    musicAudio.classList.add('music-playing');
    musicAudio.play();
  }

  function playSoundEffect(name) {
    let audioTag = document.createElement('audio');
    audioTag.setAttribute('src', `./sounds/${name}.mp3`);
    audioTag.play();
  }

// ~~~MAIN MENU~~~
  function reset() {
    timePassed = 0;
    noteCounter = 0;
    currentNote = null;
    score = 0;
    almosts = 0;
    wrongs = 0;
    displayNoteCounter = 0;
    correctnessDisplayCounter = 0;
    timingArrayRelative = [];
    timingArrayAbsolute = [6000];
    clearInterval(timePassedCounter);
    clearTimeout(endScreenTimeout);
    document.getElementsByClassName('score-span')[0].innerHTML = '';
    document.getElementsByClassName('back-to-main')[0].classList.add('hidden');
    document.getElementsByClassName('score')[0].classList.add('hidden');
    if (gameInProgress) {
      // console.log('pausing music', musicAudio);
      document.getElementsByClassName('music-playing')[0].pause();
      // console.log('paused music', musicAudio);
    };
    gameInProgress = false;
  }
// CHEVRONS MENU CHANGE
  let currentlyDisplayedPage = 'page1';
  let chevrons = document.getElementsByClassName('chevron');
  let pieceSelectPage1 = document.getElementsByClassName('page-1')[0];
  let pieceSelectPage2 = document.getElementsByClassName('page-2')[0];
  for (let i = 0; i < chevrons.length; i++) {
    chevrons[i].addEventListener('click', function() {
      playSoundEffect('chevron');
      if (currentlyDisplayedPage === 'page1') {
        pieceSelectPage1.classList.add('hidden');
        pieceSelectPage2.classList.remove('hidden');
        currentlyDisplayedPage = 'page2';
        // console.log(currentlyDisplayedPage);
      } else if (currentlyDisplayedPage === 'page2') {
        pieceSelectPage2.classList.add('hidden');
        pieceSelectPage1.classList.remove('hidden');
        currentlyDisplayedPage = 'page1';
        // console.log(currentlyDisplayedPage);
      };
    });
  };

//  DISPLAY THE MAIN MENU
  function displayMainMenu() {
    // console.log('displaying main menu')
    reset();
    onMainMenu = true;
    document.getElementsByClassName('start-button')[0].classList.remove('fade');
    document.getElementsByClassName('start-button')[0].classList.remove('hidden');
    document.getElementsByClassName('start-button')[0].classList.remove('disappear');
    document.getElementsByClassName('main-menu')[0].classList.remove('hidden');
    document.getElementsByClassName('main-menu')[0].classList.remove('fade');
    document.getElementsByClassName('main-menu')[0].classList.add('fall-from-top');
  };

// ~~~ENTER BUTTON~~~
  document.addEventListener('keyup', (event) => {
    if (event.keyCode === 13 && !gameInProgress && !onMainMenu) {
      document.getElementsByClassName('enter-button')[0].click();
    };
  });

  window.setTimeout(() => {
    document.getElementsByClassName('enter-button')[0].addEventListener('click', function() {
      _this = this;
      playSoundEffect('button');
      this.classList.remove('slide-from-bottom');
      this.classList.remove('pop');
      this.classList.add('disappear');
      document.getElementsByTagName('h1')[0].classList.remove('slide-from-left');
      document.getElementsByTagName('h2')[0].classList.remove('slide-from-right');
      document.getElementsByClassName('background-flag')[0].classList.remove('fall-from-top');
      document.getElementsByTagName('h1')[0].classList.add('fade');
      document.getElementsByTagName('h2')[0].classList.add('fade');
      document.getElementsByClassName('background-flag')[0].classList.add('become-top-bar');
      window.setTimeout(function() {
        document.getElementsByTagName('h1')[0].classList.remove('fade');
        document.getElementsByTagName('h2')[0].classList.remove('fade');
        document.getElementsByTagName('h1')[0].classList.add('hidden');
        document.getElementsByTagName('h2')[0].classList.add('hidden');
      }, 1000);
      window.setTimeout(function() {
        _this.classList.add('hidden');
      }, 2000);
      displayMainMenu();
    });
  }, 3000);

// ~~~MUSIC TIMING EVENTS~~~

  let timingArrayRelative = [];
  let timingArrayAbsoluteUnrounded = [6000]; //This determines the number of seconds after which the song should start. Min 2 secs.
  let timingArrayAbsolute = [6000];
  function calculateTimings() {
    for (let i = 0; i < Object.keys(piece).length; i++) {
      timingArrayRelative.push(piece[i][1] * basicUnit); //This determines the tempo and the initial delay.
    }
    timingArrayRelative.reduce(function(a, b, i) {return timingArrayAbsoluteUnrounded[i + 1] = a + b}, timingArrayAbsoluteUnrounded[0]); // Creates the timingArrayAbsoluteUnrounded
    timingArrayAbsolute = timingArrayAbsoluteUnrounded.map(function(x) {
      return (Math.round(x/10))*10;
    })
    // console.log('Absolute timing array:', timingArrayAbsoluteUnrounded);
    // console.log('Absolute timing array rounded', timingArrayAbsolute);
  };

// ~~~PIECE SELECTION~~~
  piecesSelection = document.getElementsByClassName('piece-selection');
  for (let i = 0; i < piecesSelection.length; i++) {
    piecesSelection[i].addEventListener('click', function() {
      playSoundEffect('piece-select');
      for (let i = 0; i < piecesSelection.length; i++) {
        piecesSelection[i].classList.remove('selected');
      };
      this.classList.add('selected');
      if (this.getAttribute('data-piece-name') === 'mozart') {
        piece = mozartArray;
        basicUnit = 500;
        audioSource = 'accomp';
        timingArrayAbsoluteUnrounded = [basicUnit * 12];
      } else if (this.getAttribute('data-piece-name') === 'bach') {
        piece = bachArray;
        basicUnit = 500;
        audioSource = 'bach';
        timingArrayAbsoluteUnrounded = [basicUnit * 16];
      } else if (this.getAttribute('data-piece-name') === 'hamilton') {
        piece = hamiltonArray;
        basicUnit = 375;
        audioSource = 'dear-theodosia';
        timingArrayAbsoluteUnrounded = [basicUnit * 32];
      } else if (this.getAttribute('data-piece-name') === 'mo-li-hua') {
        piece = jasmineArray;
        basicUnit = 1000;
        audioSource = 'mo-li-hua';
        timingArrayAbsoluteUnrounded = [basicUnit * 8];
      } else if (this.getAttribute('data-piece-name') === 'racing-horses') {
        piece = horseArray;
        basicUnit = 200;
        audioSource = 'racing-horses';
        timingArrayAbsoluteUnrounded = [basicUnit * 16];
      };
    });
  }

// ~~~START BUTTON~~~
  let timePassedCounter = null;
  let endScreenTimeout = null;
  document.getElementsByClassName('start-button')[0].addEventListener('click', function(){
    calculateTimings();
    document.getElementsByClassName('score-span')[0].innerHTML = ` : 0/${Object.keys(piece).length}`;
    document.getElementsByClassName('main-menu')[0].classList.remove('fall-from-top');
    document.getElementsByClassName('main-menu')[0].classList.add('fade');
    document.getElementsByClassName('start-button')[0].classList.add('disappear');
    _this = this;
    playSoundEffect('start-piece');
    window.setTimeout(function() {
      document.getElementsByClassName('start-button')[0].classList.add('hidden');
      document.getElementsByClassName('main-menu')[0].classList.add('hidden');
      playMusic(audioSource);
      onMainMenu = false;
      gameInProgress = true;
      _this.classList.add('hidden');
      document.getElementsByClassName('score')[0].classList.remove('hidden');
      document.getElementsByClassName('back-to-main')[0].classList.remove('hidden');
      timePassedCounter = setInterval(function() {
        if (timingArrayAbsolute[noteCounter] === timePassed) {
          // console.log(piece[noteCounter]); //This is what it does when the timing for the note has been reached.
          noteCounter++; // Increases the note timing
        };
        timePassed += 10;
      }, 10);
    }, 3000); // Changes the time passed between pressing Start and music starting

  // ~~~POST-GAME-SCREEN~~~
    let pieceLength = timingArrayAbsolute[timingArrayAbsolute.length - 1];
    endScreenTimeout = window.setTimeout(function() {
      document.getElementsByClassName('score')[0].classList.add('hidden');
      document.getElementsByClassName('back-to-main')[0].classList.add('hidden');
      scoreRatio = (score/Object.keys(piece).length) - (wrongs/Object.keys(piece).length)/4 - (almosts/8)/8;
      if (scoreRatio < 0.20) {
        playSoundEffect('fail');
        document.getElementsByClassName('message')[0].innerHTML = 'Fail.';
        document.getElementsByClassName('gif')[0].innerHTML = '<iframe src="https://giphy.com/embed/qCAKhpYsKt5wQ" width="480" height="218" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>';
        } else if (scoreRatio < 0.5) {
          playSoundEffect('fail');
          document.getElementsByClassName('message')[0].innerHTML = "Some potential";
          document.getElementsByClassName('gif')[0].innerHTML = '<iframe src="https://giphy.com/embed/9CVVNMnyszFWE" width="480" height="198" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>';
        } else if (scoreRatio < 0.8) {
          playSoundEffect('success');
          document.getElementsByClassName('message')[0].innerHTML = 'Quite good!';
          document.getElementsByClassName('gif')[0].innerHTML = '<iframe src="https://giphy.com/embed/6WiPyZEQopwIw" width="480" height="304" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>';
        } else {
          playSoundEffect('success');
          document.getElementsByClassName('message')[0].innerHTML = 'Excellent!';
          document.getElementsByClassName('gif')[0].innerHTML = '<iframe src="https://giphy.com/embed/mGj3SVN7xbPQ4" width="480" height="270" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>';
        }
        // console.log(scoreRatio);
        document.getElementsByClassName('post-game')[0].classList.remove('hidden');
        document.getElementsByClassName('post-game')[0].classList.remove('fade');
        document.getElementsByClassName('post-game')[0].classList.add('fall-from-top');
        document.getElementsByClassName('back-button')[0].classList.remove('disappear');
        document.getElementsByClassName('number-correct')[0].innerHTML = score;
        document.getElementsByClassName('total-notes')[0].innerHTML = Object.keys(piece).length;
        document.getElementsByClassName('number-almost')[0].innerHTML = almosts;
        document.getElementsByClassName('number-wrong')[0].innerHTML = wrongs;
    }, pieceLength + 3000);
  });


  // ~~~RESET BUTTON~~~
  document.getElementsByClassName('back-to-main')[0].addEventListener('click', function(){
    // console.log('back to main');
    playSoundEffect('back-to-main');
    displayMainMenu();
  })

  document.getElementsByClassName('back-button')[0].addEventListener('click', function() {
    playSoundEffect('button');
    this.classList.add('disappear');
    document.getElementsByClassName('post-game')[0].classList.remove('fall-from-top');
    document.getElementsByClassName('post-game')[0].classList.add('fade');
    window.setTimeout(function() {
      document.getElementsByClassName('post-game')[0].classList.add('hidden');
      displayMainMenu();
    }, 1000)
  })

// ~~~SCORING FUNCTIONS DISPLAY~~~
  function correctNote() {
    score++;
    document.getElementsByClassName('score-span')[0].innerHTML = ` : ${score}/${Object.keys(piece).length}`;
  };

  function wrongNote() {
    wrongs++;
  };

  function almostNote() {
    almosts++;
  }

  let correctnessDisplayCounter = null;
  setInterval(function() {
    correctnessDisplayCounter += 10;
  }, 10);
  function scoreDisplay(correctness) {
    correctnessDisplayCounter = 0;
    document.getElementsByClassName('display')[0].innerHTML = correctness;
    setInterval(function() {
      if (correctnessDisplayCounter >= 2000 ) {
        document.getElementsByClassName('display')[0].innerHTML = '';
      };
    }, 10);
  };

// ~~~NOTES FALLING DISPLAY~~~
  let displayNoteCounter = 0
  window.setInterval(function() {
    if (timePassed === timingArrayAbsolute[displayNoteCounter] - 2000 && displayNoteCounter < Object.keys(piece).length && gameInProgress) {
      let fallingNotesDiv = document.getElementsByClassName('falling-notes')[0];
      let fallingNotes = document.createElement('div');
      fallingNotesDiv.appendChild(fallingNotes);
      fallingNotes.classList.add('note');
      fallingNotes.classList.add(piece[displayNoteCounter][0]);
      fallingNotes.innerHTML = piece[displayNoteCounter][0].toUpperCase();
      displayNoteCounter++;
      window.setTimeout(function() {
        currentNote = fallingNotes;
      }, 2000 - (basicUnit / 3)); //This can be adjusted to a suitable time depending on the feeling when playing. It determins the window size of the current note. With / 3, the current window occurs 1/3 notes early,
    };
  }, 10);

// ~~~WIN CHECKING MECHANISM~~~
  function checkWin(keyName) { //Everything here is really subjective and depends on what it feels like to play - tactile experience?
    if (keyName === piece[noteCounter][0]){
      let correctTime = timingArrayAbsolute[noteCounter];
      // console.log(correctTime);
      // console.log(noteCounter);
      if(timePassed >= correctTime - (basicUnit / 4)) {
        // console.log('You got the note within 0.25 of basicUnit of the right time!');
        currentNote.classList.add('correct');
        correctNote();
        scoreDisplay('Perfect!');
        return;
      } else if(timePassed >= correctTime - (basicUnit / 3)) {
        // console.log('You got the note within 0.5 of basicUnit of the right time!');
        scoreDisplay('A bit too fast!');
        currentNote.classList.add('almost');
        almostNote();
        return;
      } else if(timePassed >= correctTime - 1000) {
        // console.log('You got the note within 1 second of the right time!');
        scoreDisplay('Too early!');
        wrongNote();
        return;
      }
      // console.log('You got the current note right, but over 1 second early.');
      scoreDisplay('Far too early!');
      wrongNote();
      return;
    } else if (noteCounter > 0 && keyName === piece[noteCounter - 1][0]){
      let correctTime = timingArrayAbsolute[noteCounter - 1];
      if(timePassed < correctTime + (basicUnit / 3)) {
        // console.log('You got the note within 0.25 of basicUnit late!');
        currentNote.classList.add('correct');
        correctNote();
        scoreDisplay('Perfect!');
        return;
      } else if (timePassed < correctTime + (basicUnit / 2)) {
        // console.log('You got the note within 0.5 of basicUnit late!');
        scoreDisplay('A bit too slow!');
        currentNote.classList.add('almost');
        almostNote();
        return;
      } else if(timePassed < correctTime + 1000) {
        // console.log('You got the note within 1 second late!');
        scoreDisplay('Far too slow!')
        wrongNote();
        return;
      } else {
        // console.log('Wrong note');
        scoreDisplay('Wrong note!');
        wrongNote();
        return;
      }
    }
    if (keyName === piece[noteCounter + 1][0]){
      // console.log('You skipped a note');
      scoreDisplay('Skipped a note!');
      wrongNote();
      return;
    } else {
      // console.log('Wrong note');
      scoreDisplay('Wrong note!');
      wrongNote();
      return;
    }
    if (keyName === piece[noteCounter + 2][0]) {
      // console.log('You skipped 2 notes');
      scoreDisplay('Skipped two notes!');
      wrongNote();
      return;
    } else {
      // console.log('Wrong note');
      scoreDisplay('Wrong note!');
      wrongNote();
      return;
    }
  }

// ~~~KEYDOWN AND KEYUP EVENTS~~~
  document.addEventListener('keydown', (event) => {
    const keyName = event.key.toLowerCase();
    if (!keysPressedStatus[keyName] && String(keyName).length === 1) {
      if(keyName.match(/[qwetyiop\]]/g)) {
        document.getElementsByClassName(keyName)[0].classList.add('top-row-pressed');
        document.getElementsByClassName(keyName)[1].classList.add('vibrating');
        document.getElementsByClassName(keyName)[2].setAttribute('style', 'background-color: white');
        playSoundEffect(keyName.toString());
        keysPressedStatus[keyName] = true;
        // console.log(timePassed);
        if(gameInProgress) {
          checkWin(keyName);
        };
      } else if(keyName.match(/[asdfghjkl\;\']/g)) {
        document.getElementsByClassName(keyName)[0].classList.add('bottom-row-pressed');
        document.getElementsByClassName(keyName)[1].classList.add('vibrating');
        document.getElementsByClassName(keyName)[2].setAttribute('style', 'background-color: white');
        playSoundEffect(keyName.toString());
        keysPressedStatus[keyName] = true;
        // console.log(timePassed);
        if(gameInProgress) {
          checkWin(keyName);
        };
      }
    }
  });

  document.addEventListener('keyup', (event) => {
    const keyName = event.key.toLowerCase();
    if (keyName.match(/[qawsedftgyhjikolp\;\'\]]/g) && String(keyName).length === 1) {
      document.getElementsByClassName(keyName)[0].classList.remove('top-row-pressed', 'bottom-row-pressed');
      document.getElementsByClassName(keyName)[1].classList.remove('vibrating');
      document.getElementsByClassName(keyName)[2].removeAttribute('style', 'background-color: white');
      keysPressedStatus[keyName] = false;
    }
  });

// ~~~THE PIECE~~~
  let jasmineArray = {
    0: ['h', 2], 1: ['h', 1], 2: ['k', 1], 3: ['l', 1], 4: ["'", 1],
    5: ["'", 1], 6: ['l', 1], 7: ['k', 2], 8: ['k', 1], 9: ['l', 1],
    10: ['k', 4], 11: ['h', 2], 12: ['h', 1], 13: ['k', 1], 14: ['l', 1],
    15: ["'", 1], 16: ["'", 1], 17: ['l', 1], 18: ['k', 2], 19: ['k', 1],
    20: ['l', 1], 21: ['k', 4], 22: ['k', 2], 23: ['k', 2], 24: ['k', 2],
    25: ['h', 1], 26: ['k', 1], 27: ['l', 2], 28: ['l', 2], 29: ['k', 4],
    30: ['h', 2], 31: ['g', 1], 32: ['h', 1], 33: ['k', 2], 34: ['h', 1],
    35: ['g', 1], 36: ['f', 2], 37: ['f', 1], 38: ['g', 1], 39: ['f', 4],
    40: ['h', 1], 41: ['g', 1], 42: ['f', 1], 43: ['h', 1], 44: ['g', 3],
    45: ['h', 1], 46: ['k', 2], 47: ['l', 1], 48: ["'", 1], 49: ['k', 4],
    50: ['h', 3], 51: ['k', 1], 52: ['g', 1], 53: ['h', 1], 54: ['f', 1],
    55: ['s', 1], 56: ['a', 4], 57: ['s', 2], 58: ['f', 2], 59: ['g', 3],
    60: ['h', 1], 61: ['f', 1], 62: ['g', 1], 63: ['f', 1], 64: ['s', 1],
    65: ['a', 4]
  }

  let hamiltonArray = {
    0: ['i', 2], 1: ['h', 1], 2: ['g', 0.5], 3: ['t', 1.5], 4: ['g', 1],
    5: ['s', 1], 6: ['s', 2], 7: ['l', 1], 8: ['i', 1], 9: ['i', 0.5],
    10: ['i', 0.5], 11: ['h', 5], 12: ['g', 0.5], 13: ['i', 1], 14: ['l', 1.5],
    15: ['i', 3], 16: ['i', 1], 17: ['i', 1], 18: ['h', 1], 19: ['g', 0.5],
    20: ['l', 1], 21: ['i', 1.5], 22: ['g', 1], 23: ['g', 1], 24: ['h', 1],
    25: ['i', 1], 26: ['g', 1], 27: ['g', 1], 28: ['g', 0.5], 29: ['g', 1.5],
    30: ['i', 2], 31: ['t', 4], 32: ['s', 0.5], 33: ['s', 0.5], 34: ['s', 1.5],
    35: ['h', 3.5], 36: ['g', 15], 37: ['i', 2], 38: ['h', 0.5], 39: ['g', 1],
    40: ['t', 1.5], 41: ['g', 1], 42: ['s', 1], 43: ['s', 2], 44: ['l', 1],
    45: ['i', 1], 46: ['i', 0.5], 47: ['i', 0.5], 48: ['h', 5], 49: ['g', 0.5],
    50: ['i', 1], 51: ['l', 1.5], 52: ['i', 3], 53: ['i', 1], 54: ['i', 0.5],
    55: ['h', 1], 56: ['g', 1], 57: ['l', 1.5], 58: ['i', 1], 59: ['h', 1],
    60: ['g', 1], 61: ['h', 2], 62: ['i', 8.5], 63: ['i', 0.5], 64: [';', 1],
    65: ['l', 0.5], 66: [';', 1.5], 67: ['l', 1], 68: [';', 1], 69: ['l', 1],
    70: ['i', 3], 71: ['g', 0.5], 72: ['g', 0.5], 73: [';', 0.5], 74: ['l', 1],
    75: ['i', 1.5], 76: ['h', 2], 77: ['g', 5], 78: ['s', 1], 79: ['s', 1],
    80: ['h', 0.5], 81: ['g', 0.5], 82: ['h', 2], 83: ['g', 1], 84: ['h', 1],
    85: ['g', 2], 86: ['h', 2], 87: ['g', 4], 88: ['s', 1], 89: ['s', 1],
    90: ['s', 1], 91: ['i', 1], 92: ['l', 0.5], 93: ['i', 3.5], 94: ['h', 1],
    95: ['g', 1], 96: ['h', 1], 97: ['i', 1], 98: ['l', 0.5], 99: ['i', 4.5],
    100: ['s', 1], 101: ['s', 1], 102: ['h', 1], 103: ['g', 1], 104: ['h', 1],
    105: ['g', 0.5], 106: ['h', 1.5], 107: ['s', 2], 108: ['h', 2],
    109: ['g', 4], 110: ['s', 1], 111: ['s', 1], 112: ['s', 1], 113: ['i', 1],
    114: ['l', 0.5], 115: ['i', 3.5], 116: ['h', 1], 117: ['g', 1],
    118: ['h', 1], 119: ['i', 1], 120: ['l', 0.5], 121: ['i', 1],
    122: ['i', 0.5], 123: ['l', 1], 124: [';', 1], 125: ['l', 1], 126: ['i', 1],
    127: ['h', 0.5], 128: ['h', 0.5], 129: ['g', 4], 130: ['s', 4],
    131: ['h', 4], 132: ['i', 5], 133: ['g', 9], 134: ['i', 1], 135: ['l', 1],
    136: [';', 1], 137: ['l', 1], 138: ['i', 1], 139: ['h', 0.5],
    140: ['h', 0.5], 141: ['g', 4], 142: ['s', 4], 143: ['h', 4], 144: ['i', 5],
    145: ['g', 19], 146: ['s', 4], 147: ['k', 4], 148: ['l', 5], 149: ['i', 9],
    150: ['i', 1], 151: ['l', 1], 152: [';', 1], 153: ['l', 1], 154: ['i', 1],
    155: ['h', 0.5], 156: ['h', 0.5], 157: ['g', 4], 158: ['s', 4],
    159: ['h', 4], 160: ['i', 5], 161: ['g', 23]
  };

  let bachArray = {
    0: ['i', 18], 1: [';', 1], 2: ['k', 0.5], 3: ['i', 0.5], 4: ['h', 1],
    5: ['g', 1], 6: ['t', 1], 7: ['g', 1], 8: ['t', 4], 9: ['d', 1],
    10: ['s', 3], 11: ['l', 9], 12: ['i', 1], 13: ['f', 1], 14: ['d', 1],
    15: ['h', 1], 16: ['y', 1], 17: ['l', 1], 18: ['k', 1], 19: ['k', 9],
    20: ['h', 1], 21: ['d', 1], 22: ['s', 1], 23: ['g', 1], 24: ['t', 1],
    25: ['k', 1], 26: ['i', 1], 27: ['i', 6], 28: ['o', 1], 29: ['l', 1],
    30: ['g', 2], 31: ['g', 0.5], 32: ['h', 0.5], 33: ['i', 2], 34: ['h', 1],
    35: ['h', 1], 36: ['g', 1], 37: ['t', 1], 38: ['d', 1], 39: ['d', 0.5],
    40: ['t', 0.5], 41: ['g', 3], 42: ['t', 1], 43: ['d', 1], 44: ['s', 8],
    45: ['t', 5], 46: ['g', 0.5], 47: ['t', 0.5], 48: ['d', 0.5],
    49: ['t', 0.5], 50: ['s', 1], 51: ['l', 6], 52: ['f', 2], 53: ['d', 2],
    54: [';', 3], 55: ['l', 1], 56: ['k', 1], 57: ['i', 1], 58: ['k', 4.5],
    59: ['i', 0.5], 60: ['h', 0.5], 61: ['g', 0.5], 62: ['t', 1], 63: ['d', 1],
    64: ['e', 1], 65: ['d', 1], 66: ['t', 3], 67: ['g', 1], 68: ['h', 3],
    69: ['i', 1], 70: ['k', 4], 71: ['i', 2], 72: ['h', 1], 73: ['g', 1],
    74: ['t', 1], 75: ['d', 1], 76: ['t', 1], 77: ['g', 0.5], 78: ['h', 0.5],
    79: ['g', 2], 80: ['d', 8], 81: ['g', 5], 82: ['i', 1], 83: ['h', 1],
    84: ['g', 1], 85: [';', 6], 86: ['l', 1], 87: ['o', 1], 88: ['i', 0.5],
    89: ['h', 0.5], 90: ['l', 1], 91: ['s', 2], 92: ['d', 3], 93: ['t', 0.5],
    94: ['g', 0.5], 95: ['t', 3], 96: ['d', 1], 97: ['s', 4], 98: ['g', 6],
    99: ['i', 1], 100: ['h', 1], 101: ['h', 6], 102: ['k', 1], 103: ['i', 1],
    104: ['i', 6], 105: ['l', 1], 106: ['k', 1], 107: ['k', 8], 108: ['s', 5],
    109: ['t', 1], 110: ['h', 1], 111: ['k', 1], 112: ['k', 1], 113: ['h', 1],
    114: ['i', 5], 115: ['k', 0.5], 116: ['l', 0.5], 117: ['g', 5],
    118: ['i', 1], 119: ['l', 1], 120: ["'", 1], 121: [';', 6], 122: ['g', 2],
    123: ['t', 1], 124: ['h', 1], 125: ['k', 4], 126: ['d', 2], 127: ['s', 2],
    128: ['h', 1], 129: ['i', 0.5], 130: ['k', 1.5], 131: ['i', 2],
    132: ['h', 1], 133: ['g', 0.5], 134: ['t', 0.5], 135: ['d', 2],
    136: ['t', 1], 137: ['g', 2], 138: ['t', 1], 139: ['g', 1], 140: ['g', 8]
  };

  let mozartArray = {
    0: ['d', 8], 1: ['g', 1], 2: ['f', 1], 3: ['d', 1], 4: ['f', 1],
    5: ['g', 3], 6: ['d', 1], 7: ['a', 8], 8: ['k', 6], 9: ['l', 1],
    10: ['k', 1], 11: ['i', 1], 12: ['h', 1], 13: ['g', 1], 14: ['t', 1],
    15: ['g', 3], 16: ['d', 1], 17: ['a', 8], 18 : ['f', 3], 19 : ['s', 1],
    20 : ['q', 2], 21 : ['s', 2], 22 : ['d', 2], 23 : ['f', 2], 24 : ['g', 3],
    25 : ['d', 1], 26 : ['k', 8], 27 : ['l', 1], 28 : ['k', 1], 29 : ['i', 1],
    30 : ['k', 1], 31 : ['i', 1], 32 : ['h', 1], 33 : ['y', 1], 34 : ['h', 1],
    35 : ['g', 1], 36 : ['f', 1], 37 : ['d', 1], 38 : ['f', 1], 39 : ['d', 3],
    40 : ['f', 0.5], 41 : ['d', 0.5], 42 : ['s', 2], 43 : ['g', 2],
    44 : ['t', 2], 45 : ['f', 2], 46 : ['d', 5], 47 : ['a', 1], 48 : ['d', 1],
    49 : ['g', 1], 50 : ['f', 1], 51 : ['s', 1], 52 : ['f', 1], 53 : ['h', 1],
    54 : ['g', 3], 55 : ['d', 1], 56 : ['a', 1], 57 : ['a', 1], 58 : ['s', 1],
    59 : ['d', 1], 60 : ['f', 1], 61 : ['g', 1], 62 : ['h', 1], 63 : ['i', 1],
    64 : ['k', 1], 65 : ['i', 1], 66 : ['k', 1], 67 : ['i', 1], 68 : ['l', 1],
    69 : ['k', 1], 70 : ['i', 1], 71 : ['k', 1], 72 : ['i', 1], 73 : ['h', 1],
    74 : ['g', 1], 75 : ['t', 1], 76 : ['g', 1], 77 : ['d', 1], 78 : ['g', 1],
    79 : ['d', 1], 80 : ['a', 8], 81 : ['f', 1], 82 : ['s', 1], 83 : ['f', 1],
    84 : ['s', 1], 85 : ['q', 1], 86 : ['s', 1], 87 : ['w', 1], 88 : ['s', 1],
    89 : ['e', 1], 90 : ['d', 1], 91 : ['f', 1], 92 : ['t', 1], 93 : ['g', 1],
    94 : ['d', 1], 95 : ['g', 1], 96 : ['d', 1], 97 : ['k', 5], 98 : [';', 1],
    99 : ['i', 1], 100 : ['k', 1], 101 : ['y', 1], 102 : ['h', 1],
    103 : ['f', 1], 104 : ['s', 1], 105 : ['a', 3], 106 : ['a', 1],
    107 : ['d', 1], 108 : ['s', 1], 109 : ['a', 1], 110 : ['s', 1],
    111 : ['s', 4], 112 : ['a', 4]
  };

  let horseArray = {
      0 : ['i', 6], 1 : ['t', 1], 2 : ['h', 1], 3 : ['i', 6], 4 : ['t', 1],
      5 : ['h', 1], 6 : ['i', 6], 7 : ['t', 1], 8 : ['h', 1], 9 : ['i', 6],
      10 : ['t', 1], 11 : ['h', 1], 12 : ['i', 1], 13 : ['h', 1],
      14 : ['t', 1], 15 : ['h', 1], 16 : ['i', 1], 17 : ['h', 1],
      18 : ['t', 1], 19 : ['h', 1], 20 : ['i', 1], 21 : ['h', 1],
      22 : ['t', 1], 23 : ['h', 1], 24 : ['i', 1], 25 : ['h', 1],
      26 : ['t', 1], 27 : ['h', 1], 28 : ['i', 2], 29 : ['h', 1],
      30 : ['i', 1], 31 : ['i', 2], 32 : ['h', 1], 33 : ['i', 1],
      34 : ['i', 2], 35 : ['h', 1], 36 : ['i', 1], 37 : ['i', 2],
      38 : ['h', 1], 39 : ['i', 1], 40 : ['q', 2], 41 : ['t', 2],
      42 : ['s', 2], 43 : ['q', 2], 44 : ['t', 2], 45 : ['i', 2], 46 : ['h', 2],
      47 : ['t', 2], 48 : ['d', 1], 49 : ['t', 1], 50 : ['d', 1],
      51 : ['s', 1], 52 : ['d', 1], 53 : ['t', 1], 54 : ['d', 1],
      55 : ['s', 1], 56 : ['d', 1], 57 : ['t', 1], 58 : ['d', 1],
      59 : ['s', 1], 60 : ['d', 1], 61 : ['t', 1], 62 : ['d', 1],
      63 : ['s', 1], 64 : ['q', 2], 65 : ['t', 2], 66 : ['s', 2], 67 : ['q', 2],
      68 : ['t', 2], 69 : ['i', 2], 70 : ['h', 2], 71 : ['t', 2], 72 : ['d', 1],
      73 : ['t', 1], 74 : ['d', 1], 75 : ['s', 1], 76 : ['d', 1],
      77 : ['t', 1], 78 : ['d', 1], 79 : ['s', 1], 80 : ['d', 1],
      81 : ['t', 1], 82 : ['d', 1], 83 : ['s', 1], 84 : ['d', 1],
      85 : ['t', 1], 86 : ['d', 1], 87 : ['s', 1], 88 : ['d', 6],
      89 : ['q', 1], 90 : ['s', 1], 91 : ['d', 6], 92 : ['q', 1],
      93 : ['s', 1], 94 : ['d', 6], 95 : ['q', 1], 96 : ['s', 1],
      97 : ['d', 6], 98 : ['q', 1], 99 : ['s', 1], 100 : ['d', 1],
      101 : ['t', 1], 102 : ['d', 1], 103 : ['s', 1], 104 : ['d', 1],
      105 : ['t', 1], 106 : ['d', 1], 107 : ['s', 1], 108 : ['d', 1],
      109 : ['t', 1], 110 : ['d', 1], 111 : ['s', 1], 112 : ['d', 1],
      113 : ['t', 1], 114 : ['d', 1], 115 : ['s', 1], 116 : ['d', 2],
      117 : ['s', 1], 118 : ['d', 1], 119 : ['d', 2], 120 : ['s', 1],
      121 : ['d', 1], 122 : ['d', 2], 123 : ['s', 1], 124 : ['d', 1],
      125 : ['d', 2], 126 : ['s', 1], 127 : ['d', 1], 128 : ['q', 4],
      129 : ['i', 4], 130 : ['h', 4], 131 : ['t', 4], 132 : ['d', 4],
      133 : ['h', 4], 134 : ['t', 4], 135 : ['s', 4], 136 : ['q', 4],
      137 : ['i', 4], 138 : ['h', 4], 139 : ['t', 4], 140 : ['d', 4],
      141 : ['h', 4], 142 : ['t', 4], 143 : ['s', 4], 144 : ['q', 6],
      145 : ['s', 1], 146 : ['d', 1], 147 : ['q', 6], 148 : ['s', 1],
      149 : ['d', 1], 150 : ['q', 6], 151 : ['s', 1], 152 : ['d', 1],
      153 : ['q', 6], 154 : ['s', 1], 155 : ['d', 1], 156 : ['q', 1],
      157 : ['d', 1], 158 : ['s', 1], 159 : ['d', 1], 160 : ['q', 1],
      161 : ['d', 1], 162 : ['s', 1], 163 : ['d', 1], 164 : ['q', 1],
      165 : ['d', 1], 166 : ['s', 1], 167 : ['d', 1], 168 : ['q', 1],
      169 : ['d', 1], 170 : ['s', 1], 171 : ['d', 1], 172 : ['q', 4],
      173 : ['q', 2], 174 : ['q', 2], 175 : ['q', 8], 176 : ['t', 4],
      177 : ['i', 3], 178 : ['l', 1], 179 : ['h', 6], 180 : ['t', 2],
      181 : ['h', 2], 182 : ['i', 2], 183 : ['l', 2], 184 : [']', 1],
      185 : ['l', 1], 186 : ['i', 8], 187 : ['t', 4], 188 : ['i', 3],
      189 : ['l', 1], 190 : ['h', 4], 191 : ['h', 2], 192 : ['t', 2],
      193 : ['d', 2], 194 : ['t', 2], 195 : ['i', 2], 196 : ['h', 2],
      197 : ['t', 8], 198 : ['h', 4], 199 : ['i', 3], 200 : ['l', 1],
      201 : ['s', 4], 202 : ['s', 2], 203 : ['q', 2], 204 : ['d', 2],
      205 : ['t', 2], 206 : ['i', 2], 207 : ['h', 2], 208 : ['t', 4],
      209 : ['t', 2], 210 : ['d', 2], 211 : ['s', 2], 212 : ['d', 2],
      213 : ['t', 2], 214 : ['h', 2], 215 : ['i', 4], 216 : ['q', 4],
      217 : ['d', 2], 218 : ['t', 2], 219 : ['s', 2], 220 : ['d', 1],
      221 : ['s', 1], 222 : ['q', 8], 223 : ['t', 2], 224 : ['t', 1],
      225 : ['t', 1], 226 : ['i', 2], 227 : ['l', 2], 228 : ['h', 2],
      229 : ['h', 1], 230 : ['h', 1], 231 : ['h', 2], 232 : ['t', 2],
      233 : ['h', 2], 234 : ['h', 1], 235 : ['i', 1], 236 : ['l', 2],
      237 : [';', 1], 238 : ['l', 1], 239 : ['i', 2], 240 : ['i', 1],
      241 : ['i', 1], 242 : ['i', 2], 243 : ['q', 2], 244 : ['t', 2],
      245 : ['t', 1], 246 : ['t', 1], 247 : ['i', 2], 248 : ['l', 2],
      249 : ['h', 2], 250 : ['h', 1], 251 : ['h', 1], 252 : ['h', 2],
      253 : ['t', 2], 254 : ['d', 2], 255 : ['d', 1], 256 : ['t', 1],
      257 : ['i', 2], 258 : ['h', 2], 259 : ['t', 2], 260 : ['t', 1],
      261 : ['h', 1], 262 : ['t', 2], 263 : ['q', 2], 264 : ['h', 2],
      265 : ['h', 1], 266 : ['h', 1], 267 : ['i', 2], 268 : ['l', 2],
      269 : ['s', 2], 270 : ['s', 1], 271 : ['s', 1], 272 : ['s', 2],
      273 : ['q', 2], 274 : ['d', 2], 275 : ['d', 1], 276 : ['t', 1],
      277 : ['i', 2], 278 : ['h', 2], 279 : ['t', 2], 280 : ['t', 1],
      281 : ['h', 1], 282 : ['t', 2], 283 : ['d', 2], 284 : ['s', 1],
      285 : ['q', 1], 286 : ['s', 1], 287 : ['d', 1], 288 : ['t', 1],
      289 : ['d', 1], 290 : ['t', 1], 291 : ['h', 1], 292 : ['i', 1],
      293 : ['h', 1], 294 : ['i', 1], 295 : ['l', 1], 296 : ['h', 1],
      297 : ['i', 1], 298 : ['h', 1], 299 : ['t', 1], 300 : ['d', 1],
      301 : ['t', 1], 302 : ['d', 1], 303 : ['s', 1], 304 : ['d', 1],
      305 : ['s', 1], 306 : ['q', 1], 307 : ['s', 1], 308 : ['q', 4],
      309 : ['i', 4]
    }

// Default selections for the starting piece.
  piece = jasmineArray;
  basicUnit = 1000;
  audioSource = 'mo-li-hua';
});
