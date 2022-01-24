(function onload() {
  console.log();
  const gameBoardLetters = [
    ['L', 'R', 'H', 'H', 'G', 'X', 'D', 'E', 'O', 'J', 'B', 'M'],
    ['S', 'I', 'O', 'A', 'J', 'L', 'U', 'P', 'Q', 'F', 'Z', 'Y'],
    ['N', 'L', 'P', 'I', 'R', 'P', 'B', 'A', 'Q', 'A', 'L', 'T'],
    ['U', 'T', 'E', 'R', 'M', 'O', 'L', 'Y', 'Q', 'L', 'T', 'I'],
    ['T', 'C', 'N', 'O', 'O', 'O', 'A', 'P', 'O', 'C', 'C', 'C'],
    ['Y', 'B', 'A', 'T', 'D', 'L', 'S', 'A', 'X', 'O', 'B', 'R'],
    ['P', 'T', 'I', 'E', 'E', 'R', 'T', 'L', 'X', 'N', 'B', 'A'],
    ['C', 'E', 'Y', 'R', 'L', 'E', 'E', 'O', 'L', 'S', 'U', 'L'],
    ['R', 'S', 'N', 'P', '3', 'P', 'R', 'O', 'H', 'F', 'B', 'O'],
    ['P', 'L', 'Y', 'N', 'O', 'Y', 'N', 'K', 'J', 'O', 'B', 'S'],
    ['P', 'A', 'C', 'Z', 'W', 'H', 'S', 'P', 'A', 'C', 'E', 'X'],
    ['O', 'G', 'F', 'D', 'R', 'A', 'G', 'O', 'N', 'Y', 'G', 'B']
  ];

  const gameBoard = document.querySelector('.board');

  gameBoard.addEventListener('touchstart', (evt) => touchStartHandler(evt));
  gameBoard.addEventListener('touchmove', (evt) => touchMoveHandler(evt));
  gameBoard.addEventListener('touchend', (evt) => touchEndHandler(evt));

  generateGameBoard(gameBoard, gameBoardLetters);
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
  console.log(coordinates.x0);
  console.log(coordinates.y0);

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

  function touchStartHandler(evt) {
    console.log('start');
    evt.target.style = 'background-color: lightgreen';
    coordinates.setXStart(evt.changedTouches[0].pageX);
    coordinates.setYStart(evt.changedTouches[0].pageY);
    console.log(`coord xStart ${coordinates.xStart}`);
    console.log(`coord yStart ${coordinates.yStart}`);
  }

  function touchMoveHandler(evt) {
    if (coordinates.direction === null) {
      coordinates.direction = direction(
        coordinates.xStart,
        coordinates.yStart,
        evt.changedTouches[0].pageX,
        evt.changedTouches[0].pageY
      );
    }
  }

  function touchEndHandler(evt) {
    console.log(coordinates.direction);
    console.log('touch end');
    coordinates.setXEnd(evt.changedTouches[0].pageX);
    coordinates.setYEnd(evt.changedTouches[0].pageY);
    console.log(coordinates.xEnd);
    console.log(coordinates.yEnd);
    //restore
    coordinates.direction = null;
  }

  function direction(xStart, yStart, xEnd, yEnd) {
    let moduleX, moduleY;
    let dX = xEnd - xStart;
    dX > 0 ? (moduleX = dX) : (moduleX = -dX);
    let dY = yEnd - yStart;
    dY > 0 ? (moduleY = dY) : (moduleY = -dY);

    console.log('moduleX ' + moduleX);
    console.log('moduleY ' + moduleY);

    console.log('dx ' + dX);
    console.log('dy ' + dY);
    if (moduleX > moduleY) {
      if (dX > 0) {
        console.log('right');
        return 'right';
      } else {
        console.log('left');
        return 'left';
      }
    } else {
      if (dY > 0) {
        console.log('down');
        return 'down';
      } else {
        console.log('up');
        return 'up';
      }
    }
  }
})();
