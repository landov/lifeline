/*jshint esversion: 6 */

var matrix;             //Array of array stores cell staus
var nextMatrix;         //Array of array stores cell staus for next generation
var ctx;                //Canvas context
var startBtn;           //Reference to the start/stop buton
var randomBtn;          //Reference to the randomizer button
var clearBtn;           //Reference to the clear button
var started = false;    //Indicates that the simulation runs
var isMouseDown = false;
var evalInterval;
const matrixSize = 128;
const cellSize = 4;


//Creates an empty array of array 
function createArray() {
    tempArray = new Array(matrixSize + 2);
    for (let i = 0; i <= matrixSize + 1; i++) {
        tempArray[i] = new Array(matrixSize + 2);
    }
    return tempArray;
}

//Updates the canvas
function drawLife() {
    for (let x = 1; x <= matrixSize; x++) {
        for (let y = 1; y <= matrixSize; y++) {
            if (matrix[x][y]) {
                ctx.fillStyle = "lime";
            } else {
                ctx.fillStyle = "black";
            }
            ctx.fillRect((x - 1) * cellSize, (y - 1) * cellSize, cellSize, cellSize);
        }
    }
}

//Fills the matrix with random values
function randomLife() {
    console.log("Random");
    d = new Date();
    for (let x = 1; x <= matrixSize; x++) {
        for (let y = 1; y <= matrixSize; y++) {
            matrix[x][y] = Math.floor(Math.random() * 2);
            //
        }
    }
    drawLife();
}

//Clears the matrix
function clearLife() {
    matrix = createArray();
    drawLife();
}

//Evaulating the status of a single cell
function evalCell(x,y) {
    let status = 0;
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (matrix[i][j]) {
                status++;
            }
        }
    }
    if (matrix[x][y]) {
        status = status - 1;
        if (status < 2) {
            nextMatrix[x][y] = 0;
        } else if (status < 4) {
            nextMatrix[x][y] = 1;
        } else {
            nextMatrix[x][y] = 0;
        }
    } else {
        if (status == 3) {
            nextMatrix[x][y] = 1;
        } else {
            nextMatrix[x][y] = 0;
        }
    }
}

//Evaluating the current matrix and creates the next
function evalLife() {
    console.log("Evaluating");
    nextMatrix = createArray();
    for (let x = 1; x <= matrixSize; x++) {
        for (let y = 1; y <= matrixSize; y++) {
            evalCell(x,y);
        }
    }
    matrix = nextMatrix;
    drawLife();
}

//Starts or stops the simulation
function startStop() {
    started = !started;
    if (started) {
        startBtn.html("Stop");
        evalInterval = window.setInterval(evalLife, 200);
    } else {
        startBtn.html("Start");
        window.clearInterval(evalInterval);
    }
}

///---------------- Drawing functions
function setCell(event) {
    let rect = ctx.canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    x = Math.floor(x / cellSize) + 1
    y = Math.floor(y / cellSize) + 1;
    matrix[x][y] = 1;
    drawLife();
}

//
function mouseDown(event) {
    isMouseDown = true;
    setCell(ctx.canvas, event);
}

function mouseMove(event) {
    if (isMouseDown) { setCell(ctx.canvas, event) };
}
//---------------------------------------------------------


//Initialization
window.onload = function () {
    ctx = document.getElementById("lifeCanvas").getContext("2d");
    matrix = createArray();
    randomBtn = $("#randomBtn");
    randomBtn.on("click", randomLife);
    clearBtn = $("#clearBtn");
    clearBtn.on("click", clearLife);
    startBtn = $("#startBtn");
    startBtn.on("click", startStop);
    ctx.canvas.addEventListener("mousedown", function (e) {
        isMouseDown = true;
        setCell(e);
    });
    ctx.canvas.addEventListener("mousemove", function (e) {
        if (isMouseDown) { setCell(e) };
    });
    ctx.canvas.addEventListener("mouseup", function (e) {
        isMouseDown = false;
    });
    ctx.canvas.addEventListener("mouseout", function (e) {
        isMouseDown = false;
    });
}

