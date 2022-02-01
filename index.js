document.addEventListener('DOMContentLoaded', (evt) => onload(evt));

function onload(evt) {
  const gameBoardLetters = [
    ['I', 'O', 'A', 'J', 'L', 'U', 'P', 'Q', 'F', 'Z', 'Y'],
    ['L', 'P', 'I', 'R', 'P', 'B', 'A', 'Q', 'A', 'L', 'T'],
    ['T', 'E', 'R', 'M', 'O', 'L', 'Y', 'Q', 'L', 'T', 'I'],
    ['C', 'N', 'O', 'O', 'O', 'A', 'P', 'O', 'C', 'C', 'C'],
    ['B', 'A', 'T', 'D', 'L', 'S', 'A', 'X', 'O', 'B', 'R'],
    ['T', 'I', 'E', 'E', 'R', 'T', 'L', 'X', 'N', 'B', 'A'],
    ['E', 'Y', 'R', 'L', 'E', 'E', 'O', 'L', 'S', 'U', 'L'],
    ['S', 'N', 'P', '3', 'P', 'R', 'O', 'H', 'F', 'B', 'O'],
    ['L', 'Y', 'N', 'O', 'Y', 'N', 'K', 'J', 'O', 'B', 'S'],
    ['A', 'C', 'Z', 'W', 'H', 'S', 'P', 'A', 'C', 'E', 'X'],
    ['G', 'F', 'D', 'R', 'A', 'G', 'O', 'N', 'Y', 'G', 'B']
  ];

  const words = [
    'blaster',
    'dragon',
    'falcon',
    'hyperloop',
    'model3',
    'openai',
    'paypal',
    'pretoria',
    'solarcity',
    'spacex',
    'tesla'
  ];

  const gameBoard = document.querySelector('.board');
  let wordsLiElements = [];
  let wordCounter = words.length;
  let guessedWords = [];

  gameBoard.addEventListener('touchstart', (evt) => touchStartHandler(evt), {
    passive: false
  });
  gameBoard.addEventListener('touchmove', (evt) => touchMoveHandler(evt), {
    passive: false
  });
  gameBoard.addEventListener('touchend', (evt) => touchEndHandler(evt), {
    passive: false
  });

  generateWordList(words);
  generateGameBoard(gameBoard, gameBoardLetters);

  const cellsOrRows = gameBoardLetters.length;
  const cellWidth = 32;
  let currentCellIdx = null;
  let currentRowIdx = null;
  let selectedCells = [];
  let guessWordArray = [];

  const coordinates = {
    x0: document.querySelector('.board').offsetLeft,
    y0: document.querySelector('.board').offsetTop,
    xStart: null,
    yStart: null,
    xEnd: null,
    yEnd: null,
    direction: null,
    setXStart(coord) {
      return (this.xStart = coord);
    },
    setYStart(coord) {
      return (this.yStart = coord);
    },
    setXEnd(coord) {
      return (this.xEnd = coord);
    },
    setYEnd(coord) {
      return (this.yEnd = coord);
    }
  };

  function generateGameBoard(board, lettersMatrix) {
    lettersMatrix.forEach((rowLetters, idx) => {
      let row = document.createElement('tr');
      row.id = `${idx}`;
      rowLetters.forEach((cellLetter, ind) => {
        let cell = document.createElement('td');
        cell.id = `${idx}_${ind}`;
        cell.innerText = cellLetter;
        row.appendChild(cell);
      });
      board.appendChild(row);
    });
  }

  function generateWordList(wordlist) {
    const listElement = document.querySelector('.words');
    wordlist.forEach((word) => {
      let li = document.createElement('li');
      li.innerText = word.toUpperCase();
      wordsLiElements.push(li);
      listElement.appendChild(li);
    });
  }

  function touchStartHandler(evt) {
    evt.preventDefault();
    evt.target.style = 'background-color: lightgreen';
    coordinates.setXStart(evt.changedTouches[0].pageX);
    coordinates.setYStart(evt.changedTouches[0].pageY);

    currentCellIdx = Math.floor(
      (coordinates.xStart - coordinates.x0) / cellWidth
    );
    currentRowIdx = Math.floor(
      (coordinates.yStart - coordinates.y0) / cellWidth
    );
    selectedCells.push(evt.target);
  }

  function touchMoveHandler(evt) {
    evt.preventDefault();
    if (coordinates.direction === null) {
      coordinates.direction = direction(
        coordinates.xStart,
        coordinates.yStart,
        evt.changedTouches[0].pageX,
        evt.changedTouches[0].pageY
      );
    }

    switch (coordinates.direction) {
      case 'right':
      case 'left':
        if (
          Math.floor(
            (evt.changedTouches[0].pageX - coordinates.x0) / cellWidth
          ) != currentCellIdx
        ) {
          currentCellIdx = Math.floor(
            (evt.changedTouches[0].pageX - coordinates.x0) / cellWidth
          );
          selectedInRow(evt.target.parentNode, currentCellIdx);
        }

        break;
      case 'up':
      case 'down':
        if (
          Math.floor(
            (evt.changedTouches[0].pageY - coordinates.y0) / cellWidth
          ) !== currentRowIdx
        ) {
          currentRowIdx = Math.floor(
            (evt.changedTouches[0].pageY - coordinates.y0) / cellWidth
          );

          selectedRows(currentRowIdx, currentCellIdx);
        }
        break;
    }
  }

  function touchEndHandler(evt) {
    evt.preventDefault();
    coordinates.setXEnd(evt.changedTouches[0].pageX);
    coordinates.setYEnd(evt.changedTouches[0].pageY);

    selectedCells.forEach((cell) => guessWordArray.push(cell.innerText));

    matchWord(words, wordsLiElements, guessWordArray.join('').toLowerCase());

    //restore
    coordinates.direction = null;
    selectedCells = [];
    guessWordArray = [];
  }

  function direction(xStart, yStart, xEnd, yEnd) {
    let moduleX, moduleY;
    let dX = xEnd - xStart;
    dX > 0 ? (moduleX = dX) : (moduleX = -dX);
    let dY = yEnd - yStart;
    dY > 0 ? (moduleY = dY) : (moduleY = -dY);

    if (moduleX > moduleY) {
      if (dX > 0) {
        return 'right';
      } else {
        return 'left';
      }
    } else {
      if (dY > 0) {
        return 'down';
      } else {
        return 'up';
      }
    }
  }

  function selectedRows(currentRowIdx, cell) {
    if (currentRowIdx >= 0 && currentRowIdx < cellsOrRows) {
      let rows = gameBoard.children;
      let row = rows[currentRowIdx];
      selectedCells.push(row.children[cell]);
      row.children[cell].style = 'background-color: lightgreen';
    }
  }

  function selectedInRow(row, currentCellIdx) {
    if (currentCellIdx < cellsOrRows && currentCellIdx >= 0) {
      selectedCells.push(row.children[currentCellIdx]);
      row.children[currentCellIdx].style = 'background-color: lightgreen';
    }
  }

  function matchWord(words, wordsLiElements, guessWord) {
    let idx = words.indexOf(guessWord);
    if (idx >= 0) {
      wordsLiElements[idx].classList.add('guessed');
      if (guessedWords.indexOf(guessWord) < 0) {
        guessedWords.push(guessWord);
        wordCounter--;
      }
      if (wordCounter === 0) {
        showCongrats();
      }
    } else {
      selectedCells.forEach((cell) => (cell.style = 'background-color: white'));
    }
  }
  function showCongrats() {
    let congrats = document.querySelector('.congrats');
    congrats.hidden = false;
    setTimeout(() => (congrats.hidden = 'true'), 1000);
  }
}
