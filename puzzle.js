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
+ '    # #    B';
            //         --------------


            var columns = 12;
            var rows = 10;


//COLORS 
var pathColor = 0x95CFB7;
var wallColor = 0xFF823A;
var endColor = 0xF2F26F;
var playerColor = 0xF04155;
var playerBorder = 0xFFF7BD;

var startLocation, endLocation;  //LOCATION
var wallStartX, wallStartY, wallSize; // unclear
var endAngle;  //Rotation of hexagon
var playerWonHooray;
var mario,peach;

function setup() {
    renderer.backgroundColor = wallColor; //The background is the color of the wall
    buildMaze(); // renders the maze
    playerLocation = {'row':startLocation.row, 'column':startLocation.column}; //takes the columns from startLocation and put them into the array  playerLocation 
    console.log('playerLocation ' + playerLocation);
    playerWonHooray = false; //Definiton of win condition
    endAngle = -90;

    mario = new Player('Mario', 0x0DFF00, 'A', [37,38,39,40]); // L R U D
    peach = new Player('Peach', 0xff5256, 'B', [65,87,68,83]); // A W D S


}

function update() {
    graphics.clear(); //clears the graphics
    drawPath();
    drawEnd();
    mario.drawPlayer();
    peach.drawPlayer();
    checkWin(); 
}

    function onKeyDown(event) { //we know we're ignoring the arrays we crated for this. maybe later.

        switch (event.keyCode) {
        case 37: // Left Arrow
        mario.moveLeft();
        console.log('left');
        break;
        case 38: // Up Arrow
        mario.moveUp();
        break;
        case 39: // Right Arrow
        mario.moveRight();
        break;
        case 40: // Down Arrow
        mario.moveDown();
        break;
        case 65: // Left
        peach.moveLeft();
        break;
        case 68: // Right
        peach.moveRight();
        break;
        case 87: // UP
        peach.moveUp();
        break;
        case 83: // Down 
        peach.moveDown();
        break;

        // default:
        //     console.log (event.keyCode);
    }

    // Look at the location we want to move to. if it's out of bounds or
    // there's a wall, cancel the move.
    // var nr = playerLocation.row + deltaRow;
    // var nc = playerLocation.column + deltaColumn;
    // if (nr<0 || nr>=rows || nc<0 || nc>=columns || isWall(nr, nc)) {
    //     deltaRow = 0;
    //     deltaColumn = 0;
    //     //Put a sound here? Consequences
    // }

    // playerLocation = {
    //     'row': playerLocation.row + deltaRow,
    //     'column': playerLocation.column + deltaColumn
    // }
}

function Player(name, color, ogLocation, keys) {




    this.playerLocation = cLocation;
    this.name = name;
    this.color = color;
    this.ogLocation = ogLocation;
    this.keys = keys;
    console.log('name' + name + ' player color: ' + color + ' ogLocation: ' + ogLocation + ' keys: ' + keys);



    this.drawPlayer = function() {
        //centers the shape
        var x = wallStartX + playerLocation.column * wallSize + wallSize/2;
        var y = wallStartY + playerLocation.row * wallSize + wallSize/2;  

        drawCircle(x, y, wallSize/3, playerColor, wallSize/12, playerBorder); //draw the player.
        this.deltaRow = 0;
        this.deltaColumn = 0;
    };

    this.moveRight = function() {

        this.deltaColumn = +1;

    // Look at the location we want to move to. if it's out of bounds or
    // there's a wall, cancel the move.
    var nr = playerLocation.row + this.deltaRow;
    var nc = playerLocation.column + this.deltaColumn;
    if (nr<0 || nr>=rows || nc<0 || nc>=columns || isWall(nr, nc)) {
        this.deltaRow = 0;
        this.deltaColumn = 0;
        //Put a sound here? Consequences
        console.log('***BLOCKED***');
    }

    playerLocation = {
        'row': playerLocation.row + this.deltaRow,
        'column': playerLocation.column + this.deltaColumn
    }

    console.log('moved right');
    // console.log(playerLocation);
}

    this.moveLeft = function() {

        this.deltaColumn = -1;

    // Look at the location we want to move to. if it's out of bounds or
    // there's a wall, cancel the move.
    var nr = playerLocation.row + deltaRow;
    var nc = playerLocation.column + deltaColumn;
    if (nr<0 || nr>=rows || nc<0 || nc>=columns || isWall(nr, nc)) {
        deltaRow = 0;
        deltaColumn = 0;
        //Put a sound here? Consequences
        console.log('***BLOCKED***');
    }

    playerLocation = {
        'row': playerLocation.row + deltaRow,
        'column': playerLocation.column + deltaColumn
    }

    console.log('moved left');
    // console.log(playerLocation);
}

    this.moveUp = function() {

        this.deltaRow = -1;

    // Look at the location we want to move to. if it's out of bounds or
    // there's a wall, cancel the move.
    var nr = playerLocation.row + deltaRow;
    var nc = playerLocation.column + deltaColumn;
    if (nr<0 || nr>=rows || nc<0 || nc>=columns || isWall(nr, nc)) {
        deltaRow = 0;
        deltaColumn = 0;
        //Put a sound here? Consequences
        console.log('***BLOCKED***');
    }

    playerLocation = {
        'row': playerLocation.row + deltaRow,
        'column': playerLocation.column + deltaColumn
    }

    console.log('moved up');
    // console.log(playerLocation);
}

    this.moveDown = function() {

        this.deltaRow = +1;

    // Look at the location we want to move to. if it's out of bounds or
    // there's a wall, cancel the move.
    var nr = playerLocation.row + deltaRow;
    var nc = playerLocation.column + deltaColumn;
    if (nr<0 || nr>=rows || nc<0 || nc>=columns || isWall(nr, nc)) {
        deltaRow = 0;
        deltaColumn = 0;
        //Put a sound here? Consequences
        console.log('***BLOCKED***');
    }

    playerLocation = {
        'row': playerLocation.row + deltaRow,
        'column': playerLocation.column + deltaColumn
    }

    console.log('moved down');
    // console.log(playerLocation);
}

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
            } else if (ch == 'B') {
                endLocation = {'row':r, 'column':c}; // Defines where game ends. Not going to be peach anymore.
            } else if (ch == 'C') {
                cLocation = {'row':r, 'column':c}; // SOmething else
            } else if (ch == 'P') {
                peachLocation = {'row':r, 'column':c}; // Peach Start
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
    var x = wallStartX + endLocation.column * wallSize + wallSize/2;
    var y = wallStartY + endLocation.row * wallSize + wallSize/2;
    endAngle -= 1;
    drawPolygon(x, y, wallSize/3, 5, endAngle, endColor);
}

function drawPlayerZ(color) {
    //centers the shape
    var x = wallStartX + cLocation.column * wallSize + wallSize/2;
    var y = wallStartY + cLocation.row * wallSize + wallSize/2;  

    drawCircle(x, y, wallSize/3, color, wallSize/12, playerBorder); //draw the player.
}


function isWall(r, c) { //this funciton checks if there's a wall, used in the moving action for the player and blocks it. 
var i = (r * columns) + c;
var ch = maze[i];
return ((ch != ' ') && (ch != 'A') && (ch != 'B') && (ch != 'C') && (ch != 'P'));
}

function checkWin() { //changes the conditions if the player won.
    if (playerWonHooray)
        return;
    if ((playerLocation.row == endLocation.row) && (playerLocation.column == endLocation.column)) {
        playerWonHooray = true;
        playerBorder = playerColor;
        playerColor = endColor;
    }
}

