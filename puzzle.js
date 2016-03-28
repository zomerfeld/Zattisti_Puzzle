//
// This program draws a maze with a player at one end and a shiny prize at the other.
// 

//
// The maze is represented by a string that is formatted into a grid.
// Each cell in the grid represents either:
// - the start point ('A');
// - the end point ('B');
// - a wall ('#').
// - a walkable empty space (' ').
//
//         --------------

// an attempt to get sound to work
// <script src="https://code.createjs.com/soundjs-0.6.2.min.js"></script></head>

// <body onload="loadSound();">
//   <button onclick="handleClick();" class="playSound">Play Sound</button>
// </body>


// var soundID = "Thunder";

var maze    = 'AC       # #'
+ ' # ### # #  '
+ ' ### # #### '
+ ' #     #    '
+ '## ##### ## '
+ '   #     #  '
+ '## ## ##### '
+ '       #    '
+ ' #### ## ###'
+ '    # #   P ';
            //         --------------


            var columns = 12;
            var rows = 10;

            var maze2   = 'AC   #   # #'
            + ' ## ##  ##  '
            + ' ### # #### '
            + '# ##  ##  # '
            + '## # ### ## '
            + '   #  #  #  '
            + '## ## ####  '
            + ' #  #  #  # '
            + ' # ##### # #'
            + '# ###B#   P ';
            //         --------------

            //B is the door



//COLORS 
var pathColor = 0xCBE0E0;
var wallColor = 0xff5256;
var playerColor = 0xBBDC2F;
var playerBorder = 0xCBE0E0;

var endColor = 0xF2F26F;

//SOUNDS
var soundtrack = new Audio("soundtrack.mp3");
var break1 = new Audio("break-1.aif");
var break2 = new Audio("break-2.aif");

// agency variables
var lastAction = 'M';
var agencyCounter = 0; // for testing purposes
var blockedCounter = 0; // counts hits on a wall by couple character in maze 2

var style = {
	font : '24px Avant Garde',
	fill : '#ffffff',
    // alpha : 1,
    // stroke : '#4a1850',
    // strokeThickness : 5,
    // dropShadow : true,
    // dropShadowColor : '#000000',
    // dropShadowAngle : Math.PI / 6,
    // dropShadowDistance : 6,
    wordWrap : true,
    wordWrapWidth : 440
}

//Text Settings
var hintText = new PIXI.Text('Is he the only one who can move?',style);
var stage = new PIXI.Container();

//Door
var texture = PIXI.Texture.fromImage('http://i.imgur.com/bMPXj3k.png');
var door = new PIXI.Sprite(texture);
door.scale.x = 0.5;
door.scale.y = 0.5;





var startLocation, endLocation;  //LOCATION
var wallStartX, wallStartY, wallSize; // unclear
var endAngle;  //Rotation of hexagon
var playerWonHooray;
var mario,peach;
var marioLocation,peachLocation,marioOGLocation,peachOGLocation,cLocation,cLocationOG;

//runs in the beginning.
function setup() { 
    renderer.backgroundColor = wallColor; //The background is the color of the wall
    hintText.anchor.set(0.5, 0.5);
    hintText.x = renderer.width/2;
    hintText.y = renderer.height - 22;

    buildMaze(); // renders the maze
    playerLocation = {'row':startLocation.row, 'column':startLocation.column}; //takes the columns from startLocation and put them into the array  playerLocation 
    console.log('playerLocation ' + playerLocation);
    playerWonHooray = false; //Definiton of win condition
    endAngle = -90;

    mario = new Player('Mario', 0x61B136, marioOGLocation, [37,38,39,40]); // L R U D
    peach = new Player('Peach', 0xFF4A76, peachOGLocation, [65,87,68,83]); // A W D S

// an attempt to get sound to work
    // loadSound(); // loads the sound


}


//runs continously 
function update() {
    graphics.clear(); //clears the graphics
    drawPath();
    drawEnd();
    //draws the players and stores their current location into variables
    if (playerWonHooray == false) {
    	marioLocation = mario.drawPlayer(); 
    	peachLocation = peach.drawPlayer();
    } else {
    	cLocation = couple.drawPlayer();
    }
    //checks for win condition 
    checkWin(); 
    // checks if you won the game
    checkEndGame();

     // console.log('***BLOCKED*** ' + blockedCounter);
 }

//Key events 
  function onKeyDown(event) { //ignores the array we created in the player function for now.

  	switch (event.keyCode) {
        case 37: // Left Arrow
        // playSound();
        if (playerWonHooray == false) {mario.moveLeft();}
        if (playerWonHooray == true) {couple.moveLeft();}
        lastAction = 'M';
        // console.log('left');
        break;


        case 38: // Up Arrow
        if (playerWonHooray == false) {mario.moveUp();}
        if (playerWonHooray == true) {couple.moveUp();}
        lastAction = 'M';   
        break;

        case 39: // Right Arrow
        if (playerWonHooray == false) {mario.moveRight();}
        if (playerWonHooray == true) {couple.moveRight();}
        lastAction = 'M';
        break;

        case 40: // Down Arrow
        if (playerWonHooray == false) {mario.moveDown();}
        if (playerWonHooray == true) {couple.moveDown();}
        lastAction = 'M';
        break;

        case 65: // Left
        if (playerWonHooray == false) {peach.moveLeft();}
        if (playerWonHooray == true) {couple.moveLeft();}
        lastAction = 'P';
        break;

        case 68: // Right
        if (playerWonHooray == false) {peach.moveRight();}
        if (playerWonHooray == true) {couple.moveRight();}
        lastAction = 'P';
        break;

        case 87: // UP
        if (playerWonHooray == false) {peach.moveUp();}
        if (playerWonHooray == true) {couple.moveUp();}
        lastAction = 'P';
        break;

        case 83: // Down 
        if (playerWonHooray == false) {peach.moveDown();}
        if (playerWonHooray == true) {couple.moveDown();}
        lastAction = 'P';
        break;

        case 84: // T for Teleport -- Disable before production
        // peach.teleport();
        // lastAction = 'P';
        break;


        // case 77: // M for Change Maze
        // changeMaze(maze2);
        // break;

        // default:
        // console.log (event.keyCode);
    }


}

function Player(name, color, ogLocation, keys) {

	this.playerLocation = ogLocation;
	this.name = name;
	this.playerColor = color;
	this.ogLocation = ogLocation;
	this.keys = keys;
	console.log('name' + name + ' player color: ' + color + ' ogLocation: ' + ogLocation + ' keys: ' + keys);


    this.drawPlayer = function() { //Draws the player
        //centers the shape
        var x = wallStartX + this.playerLocation.column * wallSize + wallSize/2;
        var y = wallStartY + this.playerLocation.row * wallSize + wallSize/2;  

        if (this.name == 'Couple') {
            drawCircle(x, y, wallSize/3 - 5, mario.playerColor, wallSize/12 - 5, this.playerColor); //draw the player.
            drawCircle(x + 20, y, wallSize/3 - 5, peach.playerColor, wallSize/12 - 5, this.playerColor); //draw the player.
        }
        else {
        drawCircle(x, y, wallSize/3, this.playerColor, wallSize/12, this.playerColor); //draw the player.
    }
    deltaRow = 0;
    deltaColumn = 0;
    // soundtrack.play();

        // console.log("row: " + this.playerLocation.row + "column: " + this.playerLocation.column); // prints the current location
        return this.playerLocation; //returns the location to the variables


    };

    this.moveRight = function() {
    	deltaColumn = +1;

    // Look at the location we want to move to. if it's out of bounds or
    // there's a wall, cancel the move.
    var nr = this.playerLocation.row + deltaRow;
    var nc = this.playerLocation.column + deltaColumn;
    if (nr<0 || nr>=rows || nc<0 || nc>=columns || isWall(nr, nc)) {
    	deltaRow = 0;
    	deltaColumn = 0;
    	blockedCounter += 1;
        break1.play(); // plays blocked sound
    // console.log('***BLOCKED***');
    if (blockedCounter > 1 && playerWonHooray == true) {
		// console.log('y new ' + nr);
		// console.log('x new ' + nc);
		var formulaWallReplace = nr * columns + nc; // formula that is used to create the walls
		// console.log('wall to replace ' + formulaWallReplace);
		maze = maze.replaceAt(formulaWallReplace, " "); // replace old maze with new maze that has broken wall
		buildMaze(); // rebuilds maze once wall is broken
        break2.play(); // plays wall break sound
	}

} else {
    	blockedCounter = 0; // resets blockedCounter if player moves sucessfully
    }

    this.playerLocation = {
    	'row': this.playerLocation.row + deltaRow,
    	'column': this.playerLocation.column + deltaColumn
    }

    // console.log('moved right');
    // console.log(playerLocation);
};


this.moveLeft = function() {

	deltaColumn = -1;

    // Look at the location we want to move to. if it's out of bounds or
    // there's a wall, cancel the move.
    var nr = this.playerLocation.row + deltaRow;
    var nc = this.playerLocation.column + deltaColumn;
    if (nr<0 || nr>=rows || nc<0 || nc>=columns || isWall(nr, nc)) {
    	deltaRow = 0;
    	deltaColumn = 0;
    	blockedCounter += 1;
        break1.play(); // plays blocked sound
    // console.log('***BLOCKED***');
    if (blockedCounter > 6 && playerWonHooray == true) {
		// console.log('y new ' + nr);
		// console.log('x new ' + nc);
		var formulaWallReplace = nr * columns + nc; // formula that is used to create the walls
		// console.log('wall to replace ' + formulaWallReplace);
		maze = maze.replaceAt(formulaWallReplace, " "); // replace old maze with new maze that has broken wall
		buildMaze(); // rebuilds maze once wall is broken
        break2.play(); // plays wall break sound
	}

} else {
    	blockedCounter = 0; // resets blockedCounter if player moves sucessfully
    }

    this.playerLocation = {
    	'row': this.playerLocation.row + deltaRow,
    	'column': this.playerLocation.column + deltaColumn
    }

    // console.log('moved right');
    // console.log(playerLocation);
};


this.moveUp = function() {

	deltaRow = -1;

    // Look at the location we want to move to. if it's out of bounds or
    // there's a wall, cancel the move.
    var nr = this.playerLocation.row + deltaRow;
    var nc = this.playerLocation.column + deltaColumn;
    if (nr<0 || nr>=rows || nc<0 || nc>=columns || isWall(nr, nc)) {
    	deltaRow = 0;
    	deltaColumn = 0;
    	blockedCounter += 1;
        break1.play(); // plays blocked sound
      // console.log('***BLOCKED***');
      if (blockedCounter > 6 && playerWonHooray == true) {
		// console.log('y new ' + nr);
		// console.log('x new ' + nc);
		var formulaWallReplace = nr * columns + nc; // formula that is used to create the walls
		// console.log('wall to replace ' + formulaWallReplace);
		maze = maze.replaceAt(formulaWallReplace, " "); // replace old maze with new maze that has broken wall
		buildMaze(); // rebuilds maze once wall is broken
        break2.play(); // plays wall break sound
	}

} else {
    	blockedCounter = 0; // resets blockedCounter if player moves sucessfully
    }

    this.playerLocation = {
    	'row': this.playerLocation.row + deltaRow,
    	'column': this.playerLocation.column + deltaColumn
    }

    // console.log('moved right');
    // console.log(playerLocation);
};


this.moveDown = function() {

	deltaRow = +1;

    // Look at the location we want to move to. if it's out of bounds or
    // there's a wall, cancel the move.
    var nr = this.playerLocation.row + deltaRow;
    var nc = this.playerLocation.column + deltaColumn;
    if (nr<0 || nr>=rows || nc<0 || nc>=columns || isWall(nr, nc)) {
    	deltaRow = 0;
    	deltaColumn = 0;
    	blockedCounter += 1;
        break1.play(); // plays blocked sound
        // console.log('***BLOCKED***');
        if (blockedCounter > 6 && playerWonHooray == true) {
		// console.log('y new ' + nr);
		// console.log('x new ' + nc);
		var formulaWallReplace = nr * columns + nc; // formula that is used to create the walls
		// console.log('wall to replace ' + formulaWallReplace);
		maze = maze.replaceAt(formulaWallReplace, " "); // replace old maze with new maze that has broken wall
		buildMaze(); // rebuilds maze once wall is broken
        break2.play(); // plays wall break sound
	}

} else {
    	blockedCounter = 0; // resets blockedCounter if player moves sucessfully
    }

    this.playerLocation = {
    	'row': this.playerLocation.row + deltaRow,
    	'column': this.playerLocation.column + deltaColumn
    }

    // console.log('moved right');
    // console.log(playerLocation);
};

this.teleport = function () {
	var nr = getRandomArbitrary(0,10);
	var nc = getRandomArbitrary(0,12);
	if (isWall(nr, nc) || (nr == mario.playerLocation.row && nc == mario.playerLocation.column) ) {
		this.teleport();
	}
	else {
		this.playerLocation = {
			'row': nr,
			'column': nc
		};

	}

	// console.log('row: ' + this.playerLocation.row + ' column: ' + this.playerLocation.column );


}

}

//randomized a number between the min and max 
function getRandomArbitrary(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

//shows the hint
function displayHint() {
	renderer.render(stage);
}

// // an attempt to get sound to work
// // loads sound file
// function loadSound () {
//   createjs.Sound.registerSound("assets/thunder.mp3", soundID);
// }

// // an attempt to get sound to work
// // plays sound file
// function playSound () {
//   createjs.Sound.play(soundID);
// }



function buildMaze() { //Runs once in setup

    // Calculate the best-fit size of a wall block based on the canvas size
    // and number of columns or rows in the grid.
    wallSize = Math.min(renderer.width/(columns+2), renderer.height/(rows+2));

    // Calculate the starting position when drawing the maze.
    wallStartX = (renderer.width - (wallSize*columns)) / 2;
    wallStartY = (renderer.height - (wallSize*rows)) / 2;

    // Find the start and end locations.
    for (var r=0; r<rows; r++) {
    	for (var c=0; c<columns; c++) {
    		var i = (r * columns) + c;
    		// console.log('location ' + i);

    		var ch = maze[i];
    		if (ch == 'A') {
                startLocation = {'row':r, 'column':c}; // Defines where ogLocation is. Writes down "this is start location"
                // console.log('startLocation: ' + startLocation);
                marioOGLocation = {'row':r, 'column':c};
            } else if (ch == 'B') { //the door
                endLocation = {'row':r, 'column':c}; // Defines where game ends. Not going to be peach anymore.
            } else if (ch == 'C') {
                // cLocationOG = {'row':r, 'column':c}; // Something else
            } else if (ch == 'P') {
                peachOGLocation = {'row':r, 'column':c}; // Peach Start
            }
        }
    }
}

function drawPath() {
    for (var r=0; r<rows; r++) { //for all the rows
        for (var c=0; c<columns; c++) { //and all columns - meaning every spot
        	var i = (r * columns) + c;


        	var ch = maze[i];
            // The start and end locations are also on the path,
            // so check for them too.
            if (ch==' ' || ch=='A' || ch=='B' || ch=='P' || ch=='C') { //if space, draw the path. 
            	var x = wallStartX + c * wallSize;
            	var y = wallStartY + r * wallSize;
            	drawRect(x, y, wallSize, wallSize, pathColor);
            }
        }
    }
}

function drawEnd() {
    //if playerwon
    if (playerWonHooray) { //display door
    	door.anchor.x = 0.5;
    	door.anchor.y = 0.5;
    	door.position.x = wallStartX + endLocation.column * wallSize + wallSize/2; 
    	door.position.y = wallStartY + endLocation.row * wallSize + wallSize/2;
    	stage.addChild(door);


    	return;
    }


    //If player didn't win
    // var x = wallStartX + endLocation.column * wallSize + wallSize/2;
    // var y = wallStartY + endLocation.row * wallSize + wallSize/2;
    // endAngle -= 1;
    // drawPolygon(x, y, wallSize/3, 5, endAngle, endColor);
}


//this funciton checks if there's a wall in a specific location.
//used in the moving action for the player and blocks it. 

function isWall(r, c) { 
	var i = (r * columns) + c;
	var ch = maze[i];
	return ((ch != ' ') && (ch != 'A') && (ch != 'B') && (ch != 'C') && (ch != 'P'));
}

//changes the conditions if the player won.
function checkWin() { 
    if (playerWonHooray) // if already won, skip the rest of the function
    	return;
    if ((marioLocation.column == peachLocation.column) && (marioLocation.row == peachLocation.row)) { //if they meet!
        if (lastAction == 'M') { //If Mario moved last. 
        	peach.teleport();
        	agencyCounter += 1;
        	console.log('agencyCounter ' + agencyCounter);
        	if (agencyCounter >= 4) {
        		stage.addChild(hintText);
        		displayHint();
        	}
        	if (agencyCounter >=8) {
                hintText.setText('seriously Dude. WhAt iS up?'); //Changes the text on the screen. 

            }
        } else if (lastAction == 'P') { //if Peach moved last
            // playerBorder = playerColor; // change the border to the player color
            // playerColor = 0xff8C00;

            pathColor = 0xE6BE8A ; //Changes the path color on victory, just to test - remove after (color is Pale Gold)
            changeMaze(maze2);
            playerWonHooray = true;  
            cLocationOG = marioLocation; //puts the couple location where they touched.
            couple = new Player('Couple', 0xf8f8ff, cLocationOG, [37,38,39,40]); // L R U D
            hintText.text = " ";

        }   
    }
}

// Checks if you're at the door and you're the couple.
function checkEndGame() {
 if ((playerWonHooray) && (couple.playerLocation.row == 9) && (couple.playerLocation.column == 5)) {
   stage.addChild(hintText);
   displayHint();
   hintText.setText('Congrats you won!');
        // console.log('you won');
    }
}

//changes the maze to the another maze
//takes the new maze variable as input
var changeMaze = function(newMaze) {
    maze = newMaze; //changes the maze variable to hold another maze
    buildMaze(); //rebuilds the maze



}

String.prototype.replaceAt=function(index, character) {
	return this.substr(0, index) + character + this.substr(index+character.length);
}

