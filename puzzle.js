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


//COLORS 
var pathColor = 0x95CFB7;
var wallColor = 0xFF823A;
var endColor = 0xF2F26F;
var playerColor = 0xF04155;
var playerBorder = 0xFFF7BD;
var lastAction = 'M';
var agencyCounter = 0;

var style = {
    font : 'bold italic 12px Arial',
    fill : '#ffffff',
    alpha : 0.1,
    stroke : '#4a1850',
    strokeThickness : 5,
    dropShadow : true,
    dropShadowColor : '#000000',
    dropShadowAngle : Math.PI / 6,
    dropShadowDistance : 6,
    wordWrap : true,
    wordWrapWidth : 440
}

var hintText = new PIXI.Text('This is a pixi text',style);

text.x = 30;
text.y = 90;

var stage = new PIXI.Container();







var startLocation, endLocation;  //LOCATION
var wallStartX, wallStartY, wallSize; // unclear
var endAngle;  //Rotation of hexagon
var playerWonHooray;
var mario,peach;
var marioLocation,peachLocation,marioOGLocation,peachOGLocation;

function setup() {
    renderer.backgroundColor = wallColor; //The background is the color of the wall
    buildMaze(); // renders the maze
    playerLocation = {'row':startLocation.row, 'column':startLocation.column}; //takes the columns from startLocation and put them into the array  playerLocation 
    console.log('playerLocation ' + playerLocation);
    playerWonHooray = false; //Definiton of win condition
    endAngle = -90;

    mario = new Player('Mario', 0x0DFF00, marioOGLocation, [37,38,39,40]); // L R U D
    peach = new Player('Peach', 0xff5256, peachOGLocation, [65,87,68,83]); // A W D S

}

function update() {
    graphics.clear(); //clears the graphics
    drawPath();
    drawEnd();
    //draws the players and stores their current location into variables
    marioLocation = mario.drawPlayer(); 
    peachLocation = peach.drawPlayer();
    //checks for win condition 
    checkWin(); 
}

  function onKeyDown(event) { //we know we're ignoring the arrays we crated for this. maybe later.

  switch (event.keyCode) {
        case 37: // Left Arrow
        mario.moveLeft();
        lastAction = 'M';
        // console.log('left');
        break;

        case 38: // Up Arrow
        mario.moveUp();
        lastAction = 'M';
        break;

        case 39: // Right Arrow
        mario.moveRight();
        lastAction = 'M';
        break;

        case 40: // Down Arrow
        mario.moveDown();
        lastAction = 'M';
        break;

        case 65: // Left
        peach.moveLeft();
        lastAction = 'P';
        break;

        case 68: // Right
        peach.moveRight();
        lastAction = 'P';
        break;

        case 87: // UP
        peach.moveUp();
        lastAction = 'P';
        break;

        case 83: // Down 
        peach.moveDown();
        lastAction = 'P';
        break;

        case 84: // T for Teleport -- Disable before production
        peach.teleport();
        lastAction = 'P';
        break;

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

        drawCircle(x, y, wallSize/3, this.playerColor, wallSize/12, playerBorder); //draw the player.
        deltaRow = 0;
        deltaColumn = 0;
        
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
        //Put a sound here? Consequences
        console.log('***BLOCKED***');
    }

    this.playerLocation = {
        'row': this.playerLocation.row + deltaRow,
        'column': this.playerLocation.column + deltaColumn
    }

    console.log('moved right');
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
        //Put a sound here? Consequences
        console.log('***BLOCKED***');
    }

    this.playerLocation = {
        'row': this.playerLocation.row + deltaRow,
        'column': this.playerLocation.column + deltaColumn
    }

    console.log('moved left');
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
        //Put a sound here? Consequences
        console.log('***BLOCKED***');
    }

    this.playerLocation = {
        'row': this.playerLocation.row + deltaRow,
        'column': this.playerLocation.column + deltaColumn
    }

    console.log('moved up');
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
        //Put a sound here? Consequences
        console.log('***BLOCKED***');
    }

    this.playerLocation = {
        'row': this.playerLocation.row + deltaRow,
        'column': this.playerLocation.column + deltaColumn
    }

    console.log('moved down');
    // console.log(playerLocation);
};

this.teleport = function () {
    var nr = getRandomArbitrary(0,10);
    var nc = getRandomArbitrary(0,12);
    if (isWall(nr, nc)) {
        this.teleport();
    }
    else {
        this.playerLocation = {
            'row': nr,
            'column': nc
        };

    }


    console.log('row: ' + this.playerLocation.row + ' column: ' + this.playerLocation.column );


}

}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function displayHint() {
        renderer.render(stage);
}

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
            var ch = maze[i];
            if (ch == 'A') {
                startLocation = {'row':r, 'column':c}; // Defines where ogLocation is. Writes down "this is start location"
                console.log('startLocation: ' + startLocation);
                marioOGLocation = {'row':r, 'column':c};
            } else if (ch == 'B') {
                endLocation = {'row':r, 'column':c}; // Defines where game ends. Not going to be peach anymore.
            } else if (ch == 'C') {
                cLocation = {'row':r, 'column':c}; // SOmething else
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
    if (playerWonHooray)
        return;

    //If player didn't win
    // var x = wallStartX + endLocation.column * wallSize + wallSize/2;
    // var y = wallStartY + endLocation.row * wallSize + wallSize/2;
    // endAngle -= 1;
    // drawPolygon(x, y, wallSize/3, 5, endAngle, endColor);
}




function isWall(r, c) { //this funciton checks if there's a wall, used in the moving action for the player and blocks it. 
var i = (r * columns) + c;
var ch = maze[i];
return ((ch != ' ') && (ch != 'A') && (ch != 'B') && (ch != 'C') && (ch != 'P'));
}

function checkWin() { //changes the conditions if the player won.
    if (playerWonHooray) // if already won, skip the rest of the function
        return;
    if ((marioLocation.column == peachLocation.column) && (marioLocation.row == peachLocation.row)) { //if they meet!
        if (lastAction == 'M') {
            peach.teleport();
            agencyCounter += 1;
            console.log('agencyCounter ' + agencyCounter);
            if (agencyCounter >= 4) {
                stage.addChild(hintText);
                displayHint();
            }
        } else if (lastAction == 'P') {
              // playerWonHooray = true;  
              playerBorder = playerColor;
              playerColor = endColor;
        pathColor = 0xE6BE8A ; //Changes the path color on victory, just to test - remove after (color is Pale Gold)

    }
}
}

