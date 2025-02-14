const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const outputBox = document.getElementById("outputBox");

let isDrawing = false;
let isUndoing = false;
let strokes = [];  // Stack for undo
let redoStack = [];  // Keep redo actions
let path = [];

function drawGrid() {
    const gridSizeW = canvas.width / 28; // Calculate grid size based on canvas width
    const gridSizeH = canvas.height / 28; // Calculate grid size based on canvas width
    ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
    ctx.lineWidth = 0.5;

    for (let x = gridSizeW; x < canvas.width; x += gridSizeW) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = gridSizeH; y < canvas.height; y += gridSizeH) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

canvas.addEventListener("mousedown", (event) => {
    console.log("mousedown event triggered"); // Add console log to verify event
    if (event.button === 0) { // Right click
        console.log("right-click event triggered"); // Add console log to verify event
        isDrawing = true;
        path = [];
        ctx.strokeStyle = "#4B4B4B"; // Change to graphite color
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(event.offsetX, event.offsetY);
    } else if (event.button === 2) { // Left click (Undo)
        console.log("left-click event triggered"); // Add console log to verify event
        if (strokes.length > 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid(); // Draw grid after clearing canvas
            strokes.pop(); // Remove last action
            redoStack = []; // Clear redo history
            redrawCanvas();
        }
    }
});

canvas.addEventListener("mousemove", (event) => {
    if (isDrawing) {
        console.log("pencil is drawing"); // Add console log to verify event
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        path.push({ x: event.offsetX, y: event.offsetY });
    }
});

canvas.addEventListener("mouseup", () => {
    if (isDrawing) {
        console.log("pencil stopped drawing"); // Add console log to verify event
        isDrawing = false;
        strokes.push([...path]);  // Save stroke for undo
    }
});

canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault(); // Prevent default right-click menu
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        submitDrawing();
    }
});

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(); // Draw grid after clearing canvas
    ctx.strokeStyle = "#4B4B4B";
    ctx.lineWidth = 5;
    strokes.forEach(stroke => {
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        stroke.forEach(point => {
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
        });
    });
}

// Convert the canvas drawing into a 28x28 matrix
function submitDrawing() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const grayScaleMatrix = [];

    for (let i = 0; i < 28; i++) {
        grayScaleMatrix[i] = [];
        for (let j = 0; j < 28; j++) {
            let total = 0;
            let count = 0;

            let startX = Math.floor((j / 28) * canvas.width);
            let startY = Math.floor((i / 28) * canvas.height);
            let endX = Math.floor(((j + 1) / 28) * canvas.width);
            let endY = Math.floor(((i + 1) / 28) * canvas.height);

            for (let x = startX; x < endX; x++) {
                for (let y = startY; y < endY; y++) {
                    let index = (y * canvas.width + x) * 4;
                    let pixel = imageData.data[index]; // Only taking R value (Grayscale)
                    total += (255 - pixel) / 255; // Normalize to 0-1
                    count++;
                }
            }

            grayScaleMatrix[i][j] = count ? total / count : 0;
        }
    }

    outputBox.value = JSON.stringify(grayScaleMatrix);
}

// Clear button
document.getElementById("clearCanvas").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(); // Draw grid after clearing canvas
    strokes = [];
    redoStack = [];
});

// Initial draw grid
drawGrid();
