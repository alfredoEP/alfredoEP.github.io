// script.js
const canvas = document.getElementById("mechanismCanvas");
const ctx = canvas.getContext("2d");
const toggleButton = document.getElementById("toggleRotation");

// Initial configuration
const points = [
    { x: 200, y: 250, fixed: true, color: "black" }, // Fixed Point A
    { x: 400, y: 250, fixed: true, color: "black" }, // Fixed Point B
    { x: 200, y: 200, fixed: false, color: "red" },  // Movable Point C
    { x: 350, y: 100, fixed: false, color: "blue" }, // Movable Point D
];

// Link lengths (rigid distances)
const linkAC = getDistance(points[0], points[2]); // Fixed length AC
const linkCD = getDistance(points[2], points[3]); // Fixed length CD
const linkDB = getDistance(points[3], points[1]); // Fixed length DB

let draggingPoint = null;
let isRotating = false;
let angle = 0; // Rotation angle in radians
let lastTime = 0;

// Compute distance between two points
function getDistance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

// Adjust point `p2` to maintain the fixed distance `length` from point `p1`
function enforceDistance(p1, p2, length) {
    const currentDist = getDistance(p1, p2);
    const adjustmentFactor = length / currentDist;
    p2.x = p1.x + (p2.x - p1.x) * adjustmentFactor;
    p2.y = p1.y + (p2.y - p1.y) * adjustmentFactor;
}

// Enforce rigid linkages for all connections
function enforceConstraints() {
    // Keep Point C rigidly linked to Point A
    enforceDistance(points[0], points[2], linkAC);

    // Keep Point D rigidly linked to Point C
    enforceDistance(points[2], points[3], linkCD);

    // Keep Point D rigidly linked to Point B
    enforceDistance(points[1], points[3], linkDB);
}

// Draw the mechanism
function drawMechanism() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw lines connecting the points
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y); // Fixed Point A
    ctx.lineTo(points[2].x, points[2].y); // Movable Point C
    ctx.lineTo(points[3].x, points[3].y); // Movable Point D
    ctx.lineTo(points[1].x, points[1].y); // Fixed Point B
    ctx.closePath();
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw points
    points.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = point.color;
        ctx.fill();
    });
}

// Handle rotation
function rotatePointC(timestamp) {
    if (!isRotating) return;

    if (lastTime === 0) lastTime = timestamp;
    const elapsed = timestamp - lastTime;

    // Angular velocity: 15 RPM = 15 * 2π / 60 radians/second
    const angularVelocity = (15 * 2 * Math.PI) / 60;
    angle += angularVelocity * (elapsed / 1000); // Increment angle based on elapsed time

    // Update Point C's position
    points[2].x = points[0].x + linkAC * Math.cos(angle);
    points[2].y = points[0].y + linkAC * Math.sin(angle);

    // Enforce constraints for the rest of the mechanism
    enforceConstraints();
    drawMechanism();

    lastTime = timestamp;
    requestAnimationFrame(rotatePointC);
}

// Toggle rotation
toggleButton.addEventListener("click", () => {
    isRotating = !isRotating;
    toggleButton.textContent = isRotating ? "Stop Rotation" : "Start Rotation";

    if (isRotating) {
        lastTime = 0;
        requestAnimationFrame(rotatePointC);
    }
});

// Dragging logic
canvas.addEventListener("mousedown", (e) => {
    if (isRotating) return; // Disable dragging during rotation

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    draggingPoint = points.find(
        (point) =>
            !point.fixed &&
            Math.sqrt((mouseX - point.x) ** 2 + (mouseY - point.y) ** 2) < 10
    );
});

canvas.addEventListener("mousemove", (e) => {
    if (isRotating || !draggingPoint) return;

    const rect = canvas.getBoundingClientRect();
    draggingPoint.x = e.clientX - rect.left;
    draggingPoint.y = e.clientY - rect.top;

    // Enforce constraints after moving
    enforceConstraints();
    drawMechanism();
});

canvas.addEventListener("mouseup", () => (draggingPoint = null));
canvas.addEventListener("mouseleave", () => (draggingPoint = null));

// Initial draw
enforceConstraints();
drawMechanism();
