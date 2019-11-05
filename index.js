
//    TODONE
// Add hold
// Fix spawn location
// Make ghost be a position and not a color - allowing shading on spawn etc
// Implement ghost
// Potentially gain score from loops around central point
// Fix piece rotation with line pieces
// Check piece.isViable
// Use score checking loop for rotation positions
// Add score
// Seperate screens for menu / Title
// Start button
// Fix highscore placement
// Reset ghost after reset
// Add highscores using localStorage *1
// Art for each color of piece
// Optimize showOutput - Speed up with images
// Movement based on time to counter act optimization
// Add website surrounding canvas
// Make a 2x2 centre to better line up with spawn zones
// Change to use a 700x700 canvas

//      TODONT
// Potentially gain score from only lines around outside
//   if use this then move half the board in direction
// Add highscore using php *1
// Get list of what each board value means
//    - check data.js

//    TODO
// Make pieceList an object holding all variables and functions
// Use a better piece selection algorithm
// Speed up over time

// Find better font and clean up gamescreen
// Use ajax with php and text files for highscores *1
// Add init for endscreen and use game0
// Add direction indicator
// Art for board and background
// Sound effects


// #region - Setup

// Prevent arrow keys and space bar moving page about
window.addEventListener("keydown", function(e) {
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1)
      e.preventDefault();
}, false);


p5.disableFriendlyErrors = true;
let title, menu, game0;
let gameController;


function preload() {
  // Load images
  loadImages();
}


function setup() {
  // Setup variables and canvas
  createCanvas(700, 700);
  noStroke();
  fill(255);

  // Title screen object
  title = {

    // #region - Variables

    screenName: "title",

    // #endregion


    // #region - Functions

    init: function() {
      // Called during setup
    },


    changeTo: function() {
      // Called when changed to
    },


    changeFrom: function() {
      // Called when changed from
    },


    update: function() {
      // Called each frame
    },


    show: function() {
      // Called each frame after update
      textSize(40);
      textAlign(CENTER);
      fill(255);
      noStroke();
      text("Tetris 360", width * 0.5, height * 0.5 + 20);
    },


    keyPressed: function() {
      // Input
      gameController.changeScreen(menu);
    },

    keyReleased: function() {
      // Input
    },

    mousePressed: function() {
      // Input
      gameController.changeScreen(menu);
    },

    // #endregion
  };


  // Menu screen object
  menu = {

    // #region - Variables

    screenName: "menu",
    buttonsStart: createVector(width * 0.5, height * 0.5 - 30),
    buttonsDifference: createVector(0, 100),
    buttonSize: createVector(175, 60),
    buttons: [
      {text: "play", func: function() {gameController.changeScreen(game0);}},
      {text: "back", func: function() {gameController.changeScreen(title);}}
    ],

    // #endregion


    // #region - Functions

    init: function() {
      // Called during setup
    },


    changeTo: function() {
      // Called when changed to
    },


    changeFrom: function() {
      // Called when changed from
    },


    update: function() {
      // Called each frame
    },


    show: function() {
      // Show title
      textSize(35);
      textAlign(CENTER);
      noStroke();
      fill(255);
      text("Tetris 360", width * 0.5, height * 0.5 - 150);

      // Show buttons
      textSize(25);
      for (let i = 0; i < this.buttons.length; i++) {
        let cx = this.buttonsStart.x + this.buttonsDifference.x * i;
        let cy = this.buttonsStart.y + this.buttonsDifference.y * i;

        stroke(255);
        noFill();
        if (mouseX > cx - this.buttonSize.x * 0.5
        && mouseX < cx + this.buttonSize.x * 0.5
        && mouseY > cy - this.buttonSize.y * 0.5
        && mouseY < cy + this.buttonSize.y * 0.5)
          fill(50);

        rect(
          cx - this.buttonSize.x * 0.5,
          cy - this.buttonSize.y * 0.5,
          this.buttonSize.x, this.buttonSize.y
        );

        fill(255);
        noStroke();
        text(this.buttons[i].text, cx, cy + 11);
      }
    },


    keyPressed: function() {
      // Input
    },

    keyReleased: function() {
      // Input
    },

    mousePressed: function() {
      // Input
      for (let i = 0; i < this.buttons.length; i++) {
        let cx = this.buttonsStart.x + this.buttonsDifference.x*i;
        let cy = this.buttonsStart.y + this.buttonsDifference.y*i;
        if (mouseX > cx - this.buttonSize.x * 0.5
        && mouseX < cx + this.buttonSize.x * 0.5
        && mouseY > cy - this.buttonSize.y * 0.5
        && mouseY < cy + this.buttonSize.y * 0.5)
          this.buttons[i].func();
      }
    }

    // #endregion
  };


  // Game screen object
  game0 = {

    // #region - Variables

    // Constant variables
    maxPiece: 7,
    pieceListAmount: 4,
    screenName: "game0",
    startButton: {
      pos: createVector(width - 120, height - 75),
      size: createVector(85, 50),
    },

    // Internal variables
    running: false,
    hasReset: true,
    score: 0,
    inputs: [false, false, false, false],
    pieceList: [[], [], [], []],
    spawnsValid: [true, true, true, true],
    holdPieceType: null,
    canHold: true,
    score: 0,
    highScores: null,


    // End screen object
    endScreen: {

      // #region - Variables

      pos: createVector(120, 60),
      size: createVector(width - 240, height - 120),

      inputBox: {
        pos: createVector(140 + (width - 240) - 180, 60 + 90),
        size: createVector(85, 40),
        text: "",
        selected: false,
        submitted: false,

        submit: function() {
          if (!this.submitted) {
            console.log("submitting");
            this.selected = false;
            this.submitted = true;

            if (game0.highScores == null)
              game0.highScores = [];

            let toPlaceAt = game0.highScores.length;
            for (let i = 0; i < game0.highScores.length; i++) {
              if (game0.score > game0.highScores[i].score) {
                toPlaceAt = i;
                break;
              }
            }

            console.log("placing score at " + toPlaceAt);
            game0.highScores.splice(toPlaceAt, 0, {"name": this.text, "score": game0.score});
            localStorage.setItem("highScores", JSON.stringify(game0.highScores));
          }
        }
      },

      // #endregion


      // #region - Functions

      show: function() {

        stroke(255); // Show main background
        fill(0);
        rect(this.pos.x, this.pos.y,
        this.size.x, this.size.y);
        noStroke();
        fill(255);

        textAlign(CENTER); // Show text
        textSize(35);
        text("Game Over", this.pos.x + this.size.x * 0.5,
        this.pos.y + 60);

        textAlign(LEFT);
        textSize(18);
        text("Score: " + game0.score, this.pos.x + this.size.x * 0.5 - 150,
        this.pos.y + 120);

        textSize(18); // Show highscores
        for (let i = 0; i < 10; i++) {
          let cx = this.pos.x + this.size.x * 0.5;
          let cy = this.pos.y + 160 + 32 * i;
          ellipse(cx - 150, cy, 10, 10);
          if (game0.highScores != null && game0.highScores.length > i) {
            textAlign(LEFT);
            text(game0.highScores[i].name, cx - 120, cy+8);
            textAlign(RIGHT);
            text(game0.highScores[i].score, cx + 120, cy+8);
          }
        }

        stroke(255); // Show input box
        noFill();
        textAlign(LEFT);
        rect(this.inputBox.pos.x, this.inputBox.pos.y,
        this.inputBox.size.x, this.inputBox.size.y);
        noStroke();
        fill(this.inputBox.text=="" ? 180 : 255);
        let outputText = this.inputBox.selected
        ? this.inputBox.text + (frameCount % 20 < 10 ? "|" : "")
        : this.inputBox.text=="" ? "Name..." : this.inputBox.text;
        text(outputText, this.inputBox.pos.x + 12 ,
        this.inputBox.pos.y + this.inputBox.size.y * 0.5 + 7);
      }

      // #endregion

    },


    // Board screen object
    board: {

      // #region - Variables

      // Constants variables
      pos: createVector(125, 125),
      size: createVector(20, 20),
      scale: createVector(width-250, height-250),

      // Internal variables
      game0: null,
      game: null,
      output: null,

      // #endregion


      // #region - Functions

      init: function() {
        // Initialize the board
      },


      reset: function() {
        // Setup board
        console.log("resetting board");
        this.game = [];
        this.output = [];
        for (let x = 0; x < this.size.x; x++) {
          this.game.push([]);
          this.output.push([]);
          for (let y = 0; y < this.size.y; y++) {
            this.game[x].push(0);
            this.output[x].push(0);
          }
        }

        // Setup centre
        this.game[int(this.size.x * 0.5) - 1][int(this.size.y * 0.5) - 1] = 1;
        this.game[int(this.size.x * 0.5)][int(this.size.y * 0.5) - 1] = 1;
        this.game[int(this.size.x * 0.5) - 1][int(this.size.y * 0.5)] = 1;
        this.game[int(this.size.x * 0.5)][int(this.size.y * 0.5)] = 1;
      },


      update: function() {
        // Called each frame
        this.updateSpawnsValid();
        this.updateOutput();
      },


      updateSpawnsValid: function() {
        // Update spawnsValid
        for (let dir = 0; dir < 4; dir++) {
          let spawnPos = this.getSpawnPos(dir);
          for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
              let nx = spawnPos.x + x;
              let ny = spawnPos.y + y;
              if (this.game[nx][ny] != 0)
                game0.spawnsValid[dir] = false;
            }
          }
        }
      },


      updateOutput: function() {
        // Update output with game
        for (let x = 0; x < this.size.x; x++) {
          for (let y = 0; y < this.size.y; y++) {
            this.output[x][y] = this.game[x][y];
          }
        }

        // Update outut with spawn areas
        for (let dir = 0; dir < 4; dir++) {
          let spawnPos = this.getSpawnPos(dir);
          for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
              let nx = spawnPos.x + x;
              let ny = spawnPos.y + y;
              if (this.output[nx][ny] == 0) {
                if (game0.spawnsValid[dir])
                  this.output[nx][ny] = 2;
                else this.output[nx][ny] = 3;
              }
            }
          }
        }

        // Update output with piece
        if (game0.running) {
          for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
              let px = game0.piece.pos.x + x;
              let py = game0.piece.pos.y + y;
              let val = pieces[game0.piece.type][game0.piece.rotation][x][y];
              if (val != 0) this.output[px][py] = val+imagesNonPieceLimit;
            }
          }
        }
      },


      showOutput: function() {
        // Show each cells in output
        let xDif = this.scale.x / this.size.x;
        let yDif = this.scale.y / this.size.y;
        for (let x = 0; x < this.size.x; x++) {
          for (let y = 0; y < this.size.y; y++) {
            let px = this.pos.x + x*xDif;
            let py = this.pos.y + y*yDif;
            image(images[this.output[x][y]], px + 1, py + 1, xDif - 2, yDif - 2);
          }
        }

        // Show ghost
        if (game0.piece.ghostPos != null) {
          noStroke();
          fill(100, 100, 100, 100);
          for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
              let bx = game0.piece.ghostPos.x + x;
              let by = game0.piece.ghostPos.y + y;
              let px = this.pos.x + bx * xDif;
              let py = this.pos.y + by * xDif;

              let val0 = pieces[game0.piece.type][game0.piece.rotation][x][y];
              if (val0 != 0) {
                let val1 = this.output[bx][by];
                if(val1 == 0)
                  rect(px, py, xDif, yDif);
              }
            }
          }
        }
      },


      scoreFromLoops: function() {
        // For every distance coming out from centre block
        for (let dist = 1; dist <= int(this.size.x * 0.5) - 1; dist++) {
          let x = int(this.size.x * 0.5) - dist - 1;
          let y = int(this.size.y * 0.5) - dist - 1;

          // Check if current distance is comspleted
          let completed = true;
          for (let dir = 0; dir < 4; dir++) {
            let offset = vectorFromDirection(dir);
            for (let i = 0; i < dist * 2 + 1; i++) {
              x += offset.x;
              y += offset.y;
              if (this.game[x][y] == 0)
                completed = false;
            }
          }

          // If completed then remove
          if (completed) {
            game0.score += (dist * dist) * 40;
            for (let dir = 0; dir < 4; dir++) {
              let offset = vectorFromDirection(dir);
              for (let i = 0; i < dist * 2 + 1; i++) {
                x += offset.x;
                y += offset.y;
                this.game[x][y] = 0;
              }
            }
          }
        }
      },


      getSpawnPos: function(direction) {
        // Return the top left corner of a spawn in a specific direction
        let offset = vectorFromDirection(direction);
        return createVector(
          int((game0.board.size.x * 0.5 - 2) * (1 - offset.x)),
          int((game0.board.size.y * 0.5 - 2) * (1 - offset.y))
        );
      },


      inBounds: function(x, y) {
        // Check whether a point is on the screen
        return x >= 0
        && x < this.size.x
        && y >= 0
        && y < this.size.y;
      },



      isViable: function(checkPiece, nx, ny, checkRotation) {
        // Check whether a piece at a position and rotation is viable
        for (let x = 0; x < 4; x++) {
          for (let y = 0; y < 4; y++) {
            let px = nx + x;
            let py = ny + y;
            let val = pieces[checkPiece][checkRotation][x][y];
            if (val != 0) {
              if (!this.inBounds(px, py)) return false;
              if (this.game[px][py] != 0) return false;
            }
          }
        }
        return true;
      },

      // #endregion

    },


    piece: {

      // #region - Variables

      // Constant variables
      moveLimit: 20,
      sprintLimit: 4,
      inputLimit: 10,

      // Internal variables
      type: null,
      direction: null,
      Rotation: null,
      pos: null,
      ghostPos: null,

      // Action variables
      toMove: false,
      toSprint: false,
      toPlace: false,

      // Timing variables
      moveTimer: null,
      inputTimer: null,

      // #endregion


      // #region - Functions

      init: function() {
        // Initialize
      },


      update: function() {
        // Called each frame
        this.updateMovement();
        this.updateGhostPos();
      },


      updateMovement: function() {
        // Move the piece based on input and timers
        if (this.toMove) {

          // Sideways movement based on input
          let dir = null;
          if (game0.inputs[(this.direction + 1) % 4]) dir = (this.direction + 1) % 4;
          if (game0.inputs[(this.direction + 3) % 4]) dir = (this.direction + 3) % 4;
          if (dir) {
            this.inputTimer += 60 / frameRate();
            if (this.inputTimer >= this.inputLimit) {
              let offset = vectorFromDirection(dir);
              this.move(offset.x, offset.y);
              this.inputTimer = 0;
            }
          } else this.inputTimer = 0;

          // forwards movement based on direction
          this.moveTimer += 60 / frameRate();
          this.toSprint = game0.inputs[this.direction];
          if ((this.toSprint && (this.moveTimer >= this.sprintLimit))
          || (!this.toSprint && (this.moveTimer >= this.moveLimit))) {
            let offset = vectorFromDirection(this.direction);

            // Try move if succesful set not to place
            if (this.move(offset.x, offset.y)) this.toPlace = false;

            // Couldnt move and to place
            else if (this.toPlace) this.place();

            // Couldnt move and not to place
            else this.toPlace = true;

            // Update timer
            this.moveTimer = 0;
          }
        }
      },


      updateGhostPos: function() {
        // Can potentially remove this check TODO check
        if (this.toMove) {
          console.log(this.toMove);

          // Update ghostPos
          let offset = vectorFromDirection(this.direction);
          this.ghostPos = this.pos.copy().sub(offset);
          let found = false;
          while (game0.board.isViable(this.type,
          this.ghostPos.x + offset.x,
          this.ghostPos.y + offset.y,
          this.rotation)) {
            this.ghostPos.add(offset);
            found = true;
          }
          if (!found) this.ghostPos = null;
        }
      },


      generateNew: function(givenDirection = null, count = 0, givenPiece = null) {
        // If 4th attempt at generating then fail all spawns are invalid
        if (count >= 4) {
          console.log("Could not generate");
          game0.lose();

        } else {
          // Use given direction otherwise next direction along
          let newDirection = givenDirection != null
            ? givenDirection
            : ((this.direction ? this.direction : 0) + 5) % 4;
          let newRotation = 0;

          // Use next piece in directions list
          let newType = givenPiece != null
            ? givenPiece
            : game0.pieceList[newDirection][0];

          // Check spawnPos
          let placed = false;
          if (game0.spawnsValid[(newDirection + 2) % 4]) {
            let distance = 0;
            let newPos = game0.board.getSpawnPos(newDirection);
            placed = game0.board.isViable(newType, newPos.x, newPos.y, newRotation);

            if (placed) {
              // Update directions pieceList
              game0.pieceList[newDirection].shift();
              game0.pieceList[newDirection].push(floor(random(game0.maxPiece)));

              // Set piece variables
              this.direction = newDirection;
              this.rotation = newRotation;
              this.type = newType;
              this.pos = newPos;
            }
          }

          // Try to place at next direction
          if (!placed)
            this.generateNew((newDirection + 1) % 4, count + 1);
        }
      },


      place: function() {
        // Place the current piece at the current place
        for (let x = 0; x < 4; x++) {
          for (let y = 0; y < 4; y++) {
            let px = this.pos.x + x;
            let py = this.pos.y + y;
            let val = pieces[this.type][this.rotation][x][y];
            if (val != 0) game0.board.game[px][py] = val+imagesNonPieceLimit;
          }
        }
        game0.canHold = true;
        game0.board.scoreFromLoops();
        game0.board.updateSpawnsValid();
        this.generateNew();
      },


      move: function(dx, dy) {c
        // Move the current piece
        if (game0.board.isViable(this.type, this.pos.x + dx, this.pos.y + dy, this.rotation)) {
          this.pos.x += dx;
          this.pos.y += dy;
          this.toPlace = false;
          return true;
        } return false;
      },


      rotate: function(difference) {
        // Check if new rotation is valid
        let newPos = null;
        let newRotation = (this.rotation + difference + 4) % 4;
        if (game0.board.isViable(this.type, this.pos.x, this.pos.y, newRotation))
          newPos = this.pos.copy();

        // Check in a loop up to 3 away for valid spaces
        if (newPos == null) {
          for (let dist = 1; dist < 3 && newPos == null; dist++) {
            let x = this.pos.x - dist;
            let y = this.pos.y - dist;
            for (let dir = 0; dir < 4 && newPos == null; dir++) {
              let offset = vectorFromDirection(dir);
              for (let i = 0; i < dist * 2 && newPos == null; i++) {
                x += offset.x;
                y += offset.y;
                if (game0.board.isViable(this.type, x, y, newRotation))
                newPos = createVector(x, y);
              }
            }
          }
        }

        // If found a successful position then place
        if (newPos != null) {
          this.pos = newPos;
          this.rotation = newRotation;
          this.toPlace = false;
          return true;
        } else return false;
      }

      // #endregion

    },

    // #endregion


    // #region - Functions

    init: function() {
      // Called during setup
      this.board.init();
      this.piece.init();
      this.board.reset();
    },


    changeTo: function() {
      // Called when changed to
      this.reset();
    },


    changeFrom: function() {
      // Called when changed from
      this.lose();
    },


    start: function() {
      // Setup game variables
      this.running = true;
      this.hasReset = false;
      this.score = 0;
      this.inputs = [false, false, false, false];
      this.pieceList = [[],[],[],[]];
      this.spawnsValid = [true, true, true, true];

      // Populate direction lists
      for (let i = 0; i < 4; i++)
        for (let o = 0; o < this.pieceListAmount; o++)
          this.pieceList[i].push(floor(random(this.maxPiece)));

      // Reset board and endscreen, generate a piece
      this.board.reset();
      this.piece.generateNew(1);
      this.endScreen.inputBox.submitted = false;

      // Reset piece movment variables
      this.piece.toMove = true;
      this.piece.toSprint = false;
      this.piece.toPlace = false;
      this.piece.moveTimer = 0;
      this.piece.inputTimer = 0;
      console.log("start");
    },


    reset: function() {
      // Reset board to untouched state - Mainly visual
      this.board.reset();
      this.inputs = [false, false, false, false];
      this.pieceList = [[],[],[],[]];
      this.spawnsValid = [true, true, true, true];
      this.hasReset = true;
    },


    lose: function() {
      // Caled when annot generate any pieces
      console.log("lost");
      this.running = false;
      this.highScores = JSON.parse(localStorage.getItem("highScores"));

      // Update piece variables
      this.piece.toMove = false;
      this.piece.toSprint = false;
      this.piece.toPlace = false;
      this.piece.moveTimer = 0;
      this.piece.inputTimer = 0;
      this.piece.ghostPos = null;
    },


    update: function() {
      // Called each frame
      this.piece.update();
      this.board.update();
    },


    show: function() {
      // Show board
      this.board.showOutput();

      // Show score
      textAlign(CENTER);
      textSize(20);
      noStroke();
      fill(255);
      text("Score: " + this.score, width - 80, 60);

      // Show hold and pieceList for each direction based on boardPos
      let pieceSpacing = 50;
      let pieceSize = 40;
      let pieceShowScale = 0.75;

      // Draw hold piece - Use piece spacing
      let pcx = pieceSpacing;
      let pcy = pieceSpacing;
      strokeWeight(1);
      stroke(255);
      noFill();
      rect(pcx - pieceSpacing * 0.5, pcy - pieceSpacing * 0.5, pieceSpacing, pieceSpacing);
      if (this.holdPieceType != null) {
        let dif = (pieceShowScale * pieceSpacing / 4);
        let pWidth = pieces[this.holdPieceType][4].length;
        let pHeight = pieces[this.holdPieceType][4][0].length;
        let ppx = pcx - dif * pWidth * 0.5;
        let ppy = pcy - dif * pHeight * 0.5;
        for (let x = 0; x < pWidth; x++) {
          for (let y = 0; y < pHeight; y++) {
            let val = pieces[this.holdPieceType][4][x][y];
            if (val != 0) image(images[val + imagesNonPieceLimit], ppx + x * dif, ppy + y * dif, dif, dif);
          }
        }
      }

      // Draw pieces in lists - Use piece size
      for (let i = 0; i < 4; i++) {
        let offset = vectorFromDirection((i + 2) % 4);
        let cx = this.board.pos.x + this.board.scale.x * 0.5
          + offset.x * (this.board.scale.x * 0.5 + pieceSpacing);
        let cy = this.board.pos.y + this.board.scale.y * 0.5
          + offset.y * (this.board.scale.y * 0.5 + pieceSpacing);

        // For each piece in pieceList
        let direction = vectorFromDirection((i + 3) % 4);
        for (let o = 0; o < this.pieceListAmount; o++) {
          let pcx = cx + (o - (this.pieceListAmount - 1) * 0.5) * pieceSpacing * direction.x;
          let pcy = cy + (o - (this.pieceListAmount - 1) * 0.5) * pieceSpacing * direction.y;

          // Show square - outlined if first
          let p0x = pcx - pieceSize * 0.5;
          let p0y = pcy - pieceSize * 0.5;
          if (o == 0) strokeWeight(3);
          else strokeWeight(1);
          stroke(255);
          noFill();
          rect(p0x, p0y, pieceSize, pieceSize);

          // Show piece
          if (this.running) {
            noStroke();
            let dif = (pieceShowScale * pieceSize / 4);
            let pWidth = pieces[this.pieceList[i][o]][4].length;
            let pHeight = pieces[this.pieceList[i][o]][4][0].length;
            let p1x = pcx - dif * pWidth * 0.5;
            let p1y = pcy - dif * pHeight * 0.5;
            for (let x = 0; x < pWidth; x++) {
              for (let y = 0; y < pHeight; y++) {
                let val = pieces[this.pieceList[i][o]][4][x][y];
                if (val != 0)
                  image(images[val+imagesNonPieceLimit], p1x + x*dif, p1y + y*dif, dif, dif);
              }
            }
          }
        }
      }

      // Show play button
      stroke(255);
      noFill();
      if (mouseX > this.startButton.pos.x
      &&mouseX < this.startButton.pos.x + this.startButton.size.x
      &&mouseY > this.startButton.pos.y
      &&mouseY < this.startButton.pos.y + this.startButton.size.y)
        fill(50);
      stroke(255);
      rect(this.startButton.pos.x, this.startButton.pos.y,
      this.startButton.size.x, this.startButton.size.y);

      // Show play button text
      textSize(20);
      textAlign(CENTER);
      noStroke();
      fill(255);
      text(this.running ? "Lose" : this.hasReset ? "Start" : "Reset",
      this.startButton.pos.x + this.startButton.size.x * 0.5,
      this.startButton.pos.y + this.startButton.size.y * 0.5+8);

      // If game ended and havent reset then show endscreen
      if (!this.running && !this.hasReset) this.endScreen.show();
    },


    keyPressed: function() {
      if (this.running) {
        if (keyCode == 90) // Rotation
          this.piece.rotate(1);

        else if (keyCode == 88)
          this.piece.rotate(-1);

        else if (keyCode == 67) { // Hold piece
          if (this.canHold) {
            let prevHoldPieceType = this.holdPieceType;
            this.holdPieceType = this.piece.type;
            this.piece.generateNew(this.piece.direction, 0, prevHoldPieceType);
            this.canHold = false;
          }

        } else if (keyCode == 32) { // Hard drop
          if (this.piece.ghostPos != null) {
            let dx = this.piece.ghostPos.x-this.piece.pos.x;
            let dy = this.piece.ghostPos.y-this.piece.pos.y;
            this.piece.move(dx, dy);
            this.piece.place();
          } else {
            console.log("no ghost");
          }

        } else if (keyCode >= 37 && keyCode <= 40) { // Movement
          let inputDirection = (keyCode-35)%4;
          this.inputs[inputDirection] = true;
          let offset = vectorFromDirection(inputDirection);
          if (inputDirection == (this.piece.direction+3)%4
          ||  inputDirection == (this.piece.direction+5)%4
          ) this.piece.move(offset.x, offset.y);
        }

      } else { // Type into input box
        if (!this.hasReset && this.endScreen.inputBox.selected && !this.endScreen.inputBox.submitted) {
            let allowed = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVQXYZ1234567890";
            if (allowed.includes(key) && this.endScreen.inputBox.text.length < 6)
              this.endScreen.inputBox.text += key;
            if (keyCode == 8)
              this.endScreen.inputBox.text = this.endScreen.inputBox.text.slice(0, -1);
            if (keyCode == 13 && this.endScreen.inputBox.text != "")
                this.endScreen.inputBox.submit();
        }
      }
    },

    keyReleased: function() {
      if (this.running) {

        // Movement
        if (keyCode >= 37 && keyCode <= 40) {
          let inputDirection = [39, 40, 37, 38].indexOf(keyCode);
          this.inputs[inputDirection] = false;
          this.piece.inputTimer = 0;
        }
      }
    },

    mousePressed: function() {
      // Check for play button
      if (mouseX > this.startButton.pos.x
      && mouseX < this.startButton.pos.x+this.startButton.size.x
      && mouseY > this.startButton.pos.y
      && mouseY < this.startButton.pos.y+this.startButton.size.y) {

        // Reset, start or lose based on game state
        if (!this.running) {
          if (!this.hasReset) this.reset();
          else this.start();
        } else this.lose();
      }

      // Select input box
      if (!this.running && !this.hasReset && !this.endScreen.inputBox.submitted) {
        this.endScreen.inputBox.selected = (
          mouseX > this.endScreen.inputBox.pos.x
        && mouseX < this.endScreen.inputBox.pos.x + this.endScreen.inputBox.size.x
        && mouseY > this.endScreen.inputBox.pos.y
        && mouseY < this.endScreen.inputBox.pos.y + this.endScreen.inputBox.size.y);
      }
    }

    // #endregion
  };


  // Main controller
  gameController = {

    // #region - Variables

    screens: [title, menu, game0],
    currentScreen: title,

    // #endregion


    // #region - Functions

    init: function() {
      // Called during setup
      for (let screen of this.screens)
        screen.init();
    },


    update: function() {
      // Called each frame
      if (this.currentScreen != null)
        this.currentScreen.update();
    },


    show: function() {
      // Called each frame after update
      if (this.currentScreen != null)
        this.currentScreen.show();
    },


    keyPressed: function() {
      // Input
      if (this.currentScreen != null)
        this.currentScreen.keyPressed();
    },

    keyReleased: function() {
      // Input
      if (this.currentScreen != null)
        this.currentScreen.keyReleased();
    },

    mousePressed: function() {
      // Input
      if (this.currentScreen != null)
        this.currentScreen.mousePressed();
    },


    changeScreen: function(screen) {
      // Change to a specific screen while calling correct functions
      this.currentScreen.changeFrom();
      this.currentScreen = screen;
      this.currentScreen.changeTo();
    }

    // #endregion
  };


  gameController.init();
}

// #endregion


// #region - Main

function draw() {
  // Called each frame
  background(0);
  gameController.update();
  gameController.show();
}


function keyPressed() {
  // Input
  if (gameController != null)
    gameController.keyPressed();
}

function keyReleased() {
  // Input
  if (gameController != null)
    gameController.keyReleased();
}

function mousePressed() {
  // Input
  if (gameController != null)
    gameController.mousePressed();
}


function vectorFromDirection(direction) {
  // Get direction vector from int (0 - 4)
  return createVector(
    int(cos(direction * PI * 0.5)),
    int(sin(direction * PI * 0.5))
  );
}

// #endregion
