# Keyboard Warrior

![Image of Title Screen](./readme-images/title-screen.png)

## Table of Contents

* [Links](#links)
* [Description](#description)
* [Technologies Used](#technologies-used)
* [Approach Taken](#approach-taken)
* [Code Examples](#code-examples)

## Play Online:

https://andrewxu.tech/keyboard-warrior/

## Game Instructions

**Press the right key on the keyboard when the falling circular note is in the middle of its corresponding white circle.**

## Technologies Used

- HTML 5
- CSS 3
- JavaScript
- Google Fonts
- GitHub
- Git
- HTML Audio
- Animation
- Pro Tools 11
- Sibelius 7

## Approach Taken

The basic premise of this rhythm game has already been explored in numerous existing games, but I set out to create the added complextiy of mimicking a piano keyboard with the QWERTY keyboard layout, as though overlaying a piano keyboard on top of the QWERTY keyboard and finding where the keys correspond. This included incorporating 24 different key strokes, specifically `Q`, `A`, `W`, `E`, `D`, `F`, `T`, `G`, `Y`, `H`, `J`, `I`, `K`, `O`, `L`, `P` ,`;` ,`'` , and `]`, far more than the average rhythm game. This added complexity allowed for the experience of playing the game to be more similar to the experience of playing a real instrument, since whereas in a typical rhythm game, like Guitar Hero, the notes produced have an arbitrary relationship with the key pressed, the letters on the keyboard in Keyboard Warrior are 1:1 mapped to their corresponding notes on the piano.

![Gameplay 1](./readme-images/gameplay1.png)

The synchronisation between the music and the player is such that the player is playing the melody of the song whilst an especially synthesised music plays in the background. The music needed to be custom-created due to needing to absolutely sync the BPM between the background music and the notes as they fall, since any discrepancy in the rhythm, even as small as 50 milliseconds, could be detectable by the player and render the game unplayable. The following images show the process of creating custom music.

![Custom music created for the game](./readme-images/sheetmusic.png)
![Custom music created for the game](./readme-images/protools.png)

The most nuanced aspect of the game is which notes played by the player should be considered "right" and which ones "wrong". Since it would basically be impossible to hit the key on the exact millisecond on which that note should be correct, or even within the nearest 50 milliseconds, there needed to be a "window" around the correct timing of the note in which the player could hit the note and still be considered "right". After a lot of experimenting, I have decided that in faster, more difficult songs where the notes were closer together, this "correctness window" could be as small as 100 milliseconds, whereas in easier songs where the notes are slower, this "correctness window" can be as long as 500 milliseconds. These values are calculated automatically in JavaScript depending on the speed of the song inputted. In other words, in reality the player needn't hit the key when the note is exactly at the center of its white circle, since that would be statistically nearly impossible - instead, there is a small margin around the white circle in which the player's key stroke would still be considered "correct", though this is visually undetectable except in the slowest, easiest songs. A satisfying animation is played when the player gets the note right.

![Getting a note perfectly right](./readme-images/perfect.png)

If the game only visually rewarded the player for getting the notes "right", it will be fairly unfulfilling and somewhat infuriating if the player hit a note *almost* right, but the game didn't acknowledge it. For this reason, around the "correctness window" there is a window for when the player plays the note *almost* on time. If a player gets a note almost right, the note changes colour, but does not play a satisfying animation.

![Getting a note almost right (in this case, a bit too fast)](./readme-images/almost.png)

## Code examples

Here are some of the code snippets in this project that I found the most interesting and challenging to write.

```javascript
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
```

This code snippet is used to decide how the game rewards a keystroke. It contains the conditions for which a key press would be considered correct, too early or too late. The `basicUnit` is used to calculate the window for correctness or wrongness, which changes depending on the speed of the song. It took a lot of experimenting to find timings that made the game feel the most rewarding to play.

_Example 2: A song object._

```javascript
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
    42 : ['s', 2], 43 : ['q', 2], 44 : ['t', 2], 45 : ['i', 2],
    46 : ['h', 2], 47 : ['t', 2], 48 : ['d', 1], 49 : ['t', 1],
    50 : ['d', 1], 51 : ['s', 1], 52 : ['d', 1], 53 : ['t', 1],
    54 : ['d', 1], 55 : ['s', 1], 56 : ['d', 1], 57 : ['t', 1],
    58 : ['d', 1], 59 : ['s', 1], 60 : ['d', 1], 61 : ['t', 1],
    62 : ['d', 1], 63 : ['s', 1], 64 : ['q', 2], 65 : ['t', 2],
    66 : ['s', 2], 67 : ['q', 2], 68 : ['t', 2], 69 : ['i', 2],
    70 : ['h', 2], 71 : ['t', 2], 72 : ['d', 1], 73 : ['t', 1],
    74 : ['d', 1], 75 : ['s', 1], 76 : ['d', 1], 77 : ['t', 1],
    78 : ['d', 1], 79 : ['s', 1], 80 : ['d', 1], 81 : ['t', 1],
    82 : ['d', 1], 83 : ['s', 1], 84 : ['d', 1], 85 : ['t', 1],
    86 : ['d', 1], 87 : ['s', 1], 88 : ['d', 6], 89 : ['q', 1],
    90 : ['s', 1], 91 : ['d', 6], 92 : ['q', 1], 93 : ['s', 1],
    94 : ['d', 6], 95 : ['q', 1], 96 : ['s', 1], 97 : ['d', 6],
    98 : ['q', 1], 99 : ['s', 1], 100 : ['d', 1], 101 : ['t', 1],
    102 : ['d', 1], 103 : ['s', 1], 104 : ['d', 1], 105 : ['t', 1],
    106 : ['d', 1], 107 : ['s', 1], 108 : ['d', 1], 109 : ['t', 1],
    110 : ['d', 1], 111 : ['s', 1], 112 : ['d', 1], 113 : ['t', 1],
    114 : ['d', 1], 115 : ['s', 1], 116 : ['d', 2], 117 : ['s', 1],
    118 : ['d', 1], 119 : ['d', 2], 120 : ['s', 1], 121 : ['d', 1],
    122 : ['d', 2], 123 : ['s', 1], 124 : ['d', 1], 125 : ['d', 2],
    126 : ['s', 1], 127 : ['d', 1], 128 : ['q', 4], 129 : ['i', 4],
    130 : ['h', 4], 131 : ['t', 4], 132 : ['d', 4], 133 : ['h', 4],
    134 : ['t', 4], 135 : ['s', 4], 136 : ['q', 4], 137 : ['i', 4],
    138 : ['h', 4], 139 : ['t', 4], 140 : ['d', 4], 141 : ['h', 4],
    142 : ['t', 4], 143 : ['s', 4], 144 : ['q', 6], 145 : ['s', 1],
    146 : ['d', 1], 147 : ['q', 6], 148 : ['s', 1], 149 : ['d', 1],
    150 : ['q', 6], 151 : ['s', 1], 152 : ['d', 1], 153 : ['q', 6],
    154 : ['s', 1], 155 : ['d', 1], 156 : ['q', 1], 157 : ['d', 1],
    158 : ['s', 1], 159 : ['d', 1], 160 : ['q', 1], 161 : ['d', 1],
    162 : ['s', 1], 163 : ['d', 1], 164 : ['q', 1], 165 : ['d', 1],
    166 : ['s', 1], 167 : ['d', 1], 168 : ['q', 1], 169 : ['d', 1],
    170 : ['s', 1], 171 : ['d', 1], 172 : ['q', 4], 173 : ['q', 2],
    174 : ['q', 2], 175 : ['q', 8], 176 : ['t', 4], 177 : ['i', 3],
    178 : ['l', 1], 179 : ['h', 6], 180 : ['t', 2], 181 : ['h', 2],
    182 : ['i', 2], 183 : ['l', 2], 184 : [']', 1], 185 : ['l', 1],
    186 : ['i', 8], 187 : ['t', 4], 188 : ['i', 3], 189 : ['l', 1],
    190 : ['h', 4], 191 : ['h', 2], 192 : ['t', 2], 193 : ['d', 2],
    194 : ['t', 2], 195 : ['i', 2], 196 : ['h', 2], 197 : ['t', 8],
    198 : ['h', 4], 199 : ['i', 3], 200 : ['l', 1], 201 : ['s', 4],
    202 : ['s', 2], 203 : ['q', 2], 204 : ['d', 2], 205 : ['t', 2],
    206 : ['i', 2], 207 : ['h', 2], 208 : ['t', 4], 209 : ['t', 2],
    210 : ['d', 2], 211 : ['s', 2], 212 : ['d', 2], 213 : ['t', 2],
    214 : ['h', 2], 215 : ['i', 4], 216 : ['q', 4], 217 : ['d', 2],
    218 : ['t', 2], 219 : ['s', 2], 220 : ['d', 1], 221 : ['s', 1],
    222 : ['q', 8], 223 : ['t', 2], 224 : ['t', 1], 225 : ['t', 1],
    226 : ['i', 2], 227 : ['l', 2], 228 : ['h', 2], 229 : ['h', 1],
    230 : ['h', 1], 231 : ['h', 2], 232 : ['t', 2], 233 : ['h', 2],
    234 : ['h', 1], 235 : ['i', 1], 236 : ['l', 2], 237 : [';', 1],
    238 : ['l', 1], 239 : ['i', 2], 240 : ['i', 1], 241 : ['i', 1],
    242 : ['i', 2], 243 : ['q', 2], 244 : ['t', 2], 245 : ['t', 1],
    246 : ['t', 1], 247 : ['i', 2], 248 : ['l', 2], 249 : ['h', 2],
    250 : ['h', 1], 251 : ['h', 1], 252 : ['h', 2], 253 : ['t', 2],
    254 : ['d', 2], 255 : ['d', 1], 256 : ['t', 1], 257 : ['i', 2],
    258 : ['h', 2], 259 : ['t', 2], 260 : ['t', 1], 261 : ['h', 1],
    262 : ['t', 2], 263 : ['q', 2], 264 : ['h', 2], 265 : ['h', 1],
    266 : ['h', 1], 267 : ['i', 2], 268 : ['l', 2], 269 : ['s', 2],
    270 : ['s', 1], 271 : ['s', 1], 272 : ['s', 2], 273 : ['q', 2],
    274 : ['d', 2], 275 : ['d', 1], 276 : ['t', 1], 277 : ['i', 2],
    278 : ['h', 2], 279 : ['t', 2], 280 : ['t', 1], 281 : ['h', 1],
    282 : ['t', 2], 283 : ['d', 2], 284 : ['s', 1], 285 : ['q', 1],
    286 : ['s', 1], 287 : ['d', 1], 288 : ['t', 1], 289 : ['d', 1],
    290 : ['t', 1], 291 : ['h', 1], 292 : ['i', 1], 293 : ['h', 1],
    294 : ['i', 1], 295 : ['l', 1], 296 : ['h', 1], 297 : ['i', 1],
    298 : ['h', 1], 299 : ['t', 1], 300 : ['d', 1], 301 : ['t', 1],
    302 : ['d', 1], 303 : ['s', 1], 304 : ['d', 1], 305 : ['s', 1],
    306 : ['q', 1], 307 : ['s', 1], 308 : ['q', 4], 309 : ['i', 4]
}
```

An oddity in the creation of this game in particular lead to one of the most repetitive parts of the development process: inputting every single note of every single song as keystroke-duration pairs. This lead to the creation of enormous objects, of which the following is an excerpt. This object is used to create the timing and key presses for the falling notes.
