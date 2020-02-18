// height of the canvas
const Width = 600;
// width of the canvas
const Height = 600;


const edgeDraw = function(tourEdge = [0, 0]) {
	const p0 = vertex[tourEdge[0]];
	const p1 = vertex[tourEdge[1]];
	stroke(255, 0, 0);
	strokeWeight(2);
	line(Width * p0.x, Height * p0.y, Width * p1.x, Height * p1.y);
};

const pointDraw = function(p = new Point()) {
	fill(color(255,255,255));
	stroke(255, 0, 0);
	strokeWeight(2);
	//noStroke();
	circle(Width * p.x, Height * p.y, 7);
};

const tourDraw = function() {
	tourEdge(tour).map(edgeDraw);
	vertex.map(pointDraw);
};

let iter = 0;
const step = 100;
let running = false;
function setup() {
	createCanvas(Width, Height);
	//frameRate(10);
	drawIter();
	drawPage();
}

function debuggingPause() {
	if (this.value === "Pause") {
		running = false;
		this.value = "Continue";
		document.getElementById("debuggingPause").value="Continue";
	} else {
		running = true;
		this.value = "Pause";
		document.getElementById("debuggingPause").value="Pause";
	}
}
function debuggingReset() {
	tour = bestTour;
	drawIter();
	drawPage();
}

function drawIter() {
	document.getElementById('debuggingIter').innerHTML = "";
	document.getElementById('debuggingIter').innerHTML += "Iter: " + iter + " ";
	document.getElementById('debuggingIter').innerHTML += "Temperature: " + temperature + "</br>";
}

function drawPage() {
	const cost = tourCost(tour);
	if (cost < bestCost) {
		bestCost = cost;
		bestTour = tour;
	}
	document.getElementById('debuggingText').innerHTML = "";
	document.getElementById('debuggingText').innerHTML += "Tour cost: " + tourCost(tour) + "</br>";
	document.getElementById('debuggingText').innerHTML += "Best cost: " + bestCost + "</br>";
	background(200, 200, 200);
	tourDraw();
}

function draw() {
	if (running) {
		drawIter();
		let twoOptBool = false;
		for (let i=0; i<step; i++) {
			iter++;
			if (twoOpt()) {
				twoOptBool = true;
			}
		}
		if (twoOptBool) {
			drawPage();
		}
	}
}