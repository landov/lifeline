/*jshint esversion: 6 */

var matrix;             //Array of array 64 by 64 stores cell staus
var ctx;                //Canvas context
var startBtn;           //Reference to the start/stop buton
var randomBtn;          //Reference to the randomizer button
var clearBtn;           //Reference to the clear button
var started = false;    //Indicates that the simulation runs
var evalInterval;

//Creates an empty array of array 64 by 64
function createArray() {
    tempArray = new Array(63);
    for (let i = 0; i < 64; i++) {
        tempArray[i] = new Array(63);
    }
    return tempArray;
}

//Updates the canvas
function drawLife() {
    for (let x = 0; x < 64; x++) {
        for (let y = 0; y < 64; y++) {
            if (matrix[x][y]) {
                ctx.fillStyle = "lime";
            } else {
                ctx.fillStyle = "black";
            }
            ctx.fillRect(x * 8, y * 8, 8, 8);
        }
    }
}

//Fills the matrix with random values
function randomLife() {
    console.log("Random");
    d = new Date();
    for (let x = 0; x < 64; x++) {
        for (let y = 0; y < 64; y++) {
            matrix[x][y] = Math.floor(Math.random() * 2);
            //
        }
    }
    drawLife();
}

//Clears the matrix
function clearLife() {
    for (let x = 0; x < 64; x++) {
        for (let y = 0; y < 64; y++) {
            matrix[x][y] = 0;
            //
        }
    }
    drawLife();
}

//Evalcell
function evalCell(x, y) {
    if (matrix[x][y]) {
        matrix[x][y] = 0;
    } else {
        matrix[x][y] = 1;
    }

}

//Evaluating the current matrix and creates the next
function evalLife() {
    console.log("Evaluating");
    var nextMatrix = createArray();
    for (let x = 0; x < 64; x++) {
        for (let y = 0; y < 64; y++) {
            let status = 0;
            for (let i = x - 1; i <= x + 1; i++) {
                for (let j = y - 1; j <= y + 1; j++) {
                    if (matrix[i]) {
                        if (matrix[i][j]) {
                            status++;
                        }
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
           // console.log(x, y, status);
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
    //evalLife();
}


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
}

