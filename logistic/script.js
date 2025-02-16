// script.js
const map = document.getElementById("map");
const mapImage = document.getElementById("map-image");
const infoBox = document.getElementById("info-box");
let zoomLevel = 1;
let paths = [];
let isDrawing = false;
let currentPath = null;
let startPoint = null;

// Coordinate Mapping (Real World -> Pixels)
const mapBounds = {
  north: 32.7172, // 32° 43' 06" N
  south: 14.5408, // 14° 32' 27" N
  west: -118.3667, // 118° 22' 00" W
  east: -86.7100 // 86° 42' 36" W
};

function screenToGeo(x, y) {
  const width = mapImage.clientWidth;
  const height = mapImage.clientHeight;
  const lat = mapBounds.north - (y / height) * (mapBounds.north - mapBounds.south);
  const lng = mapBounds.west + (x / width) * (mapBounds.east - mapBounds.west);
  return { lat, lng };
}

// Zoom Functionality
map.addEventListener("wheel", (event) => {
  event.preventDefault();
  const scaleAmount = event.deltaY > 0 ? 0.9 : 1.1;
  zoomLevel *= scaleAmount;
  map.style.transform = `scale(${zoomLevel})`;
});

// Path Creation (ALT + Click)
map.addEventListener("mousedown", (event) => {
  if (!event.altKey) return;
  event.preventDefault();
  
  const x = event.offsetX;
  const y = event.offsetY;
  const geoCoord = screenToGeo(x, y);

  if (!isDrawing) {
    isDrawing = true;
    startPoint = { x, y, geoCoord };
    currentPath = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    currentPath.setAttribute("class", "path");
    currentPath.setAttribute("points", `${x},${y}`);
    map.appendChild(currentPath);
  } else {
    let points = currentPath.getAttribute("points");
    points += ` ${x},${y}`;
    currentPath.setAttribute("points", points);
  }
});

// Releasing ALT Finishes Path
document.addEventListener("keyup", (event) => {
  if (event.key === "Alt" && isDrawing) {
    isDrawing = false;
    paths.push(currentPath);

    // Create Input Box at Start Point
    const inputBox = document.createElement("input");
    inputBox.style.position = "absolute";
    inputBox.style.left = `${startPoint.x}px`;
    inputBox.style.top = `${startPoint.y}px`;
    inputBox.style.transform = `scale(${zoomLevel})`;
    document.body.appendChild(inputBox);
    inputBox.focus();

    // Simulate API Query
    fetchFakeDatabase(startPoint.geoCoord).then((result) => {
      inputBox.value = result;
    });

    // On Enter, Move to Destination Input
    inputBox.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const destinationBox = document.createElement("input");
        destinationBox.style.position = "absolute";
        destinationBox.style.left = `${event.clientX}px`;
        destinationBox.style.top = `${event.clientY}px`;
        destinationBox.style.transform = `scale(${zoomLevel})`;
        document.body.appendChild(destinationBox);
        destinationBox.focus();

        fetchFakeDatabase(screenToGeo(event.clientX, event.clientY)).then((result) => {
          destinationBox.value = result;
        });

        destinationBox.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            document.body.removeChild(destinationBox);
          }
        });
      }
    });
  }
});

// Fake API Call for Location Name
function fetchFakeDatabase(coord) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.random() > 0.5 ? "City Name" : "");
    }, 1500);
  });
}

// Arrow Click Logic
map.addEventListener("click", (event) => {
  if (event.target.classList.contains("arrow")) {
    infoBox.style.left = `${event.clientX}px`;
    infoBox.style.top = `${event.clientY}px`;
    infoBox.classList.remove("hidden");

    document.getElementById("name").textContent = "Arrow 1";
    document.getElementById("origin").textContent = "Start City";
    document.getElementById("destination").textContent = "End City";
    document.getElementById("cargo").textContent = "Goods";
  }
});

// Hide Info Box with ESC
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    infoBox.classList.add("hidden");
  }
});

const popup = document.createElement("div");
popup.id = "popup";
document.body.appendChild(popup);

map.addEventListener("click", (event) => {
  const x = event.offsetX;
  const y = event.offsetY;
  popup.style.left = `${event.clientX + 10}px`;
  popup.style.top = `${event.clientY + 10}px`;
  popup.textContent = `Coordinates: (${x}, ${y})`;
  popup.style.display = "block";
  setTimeout(() => {
    popup.style.display = "none";
  }, 2000);
});
