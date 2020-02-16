// height of the canvas
const Width = 600;
// width of the canvas
const Height = 600;



const numPoints = 50;

const Point = class {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
	static Distance(p1 = new Point(), p2 = new Point()) {
		return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
	}
	static NewRandom() {
		return new Point(Math.random(), Math.random());
	}
};

let vertex = [];
// generate points
for (let i=0; i<numPoints; i++) {
	vertex.push(Point.NewRandom())
}

// calculate edge cost
let edge = [];
for (let i1=0; i1<vertex.length; i1++) {
	let dist = [];
	for (let i2=0; i2<vertex.length; i2++) {
		dist.push(+Infinity);
	}
	edge.push(dist);
}
for (let i1=0; i1<vertex.length; i1++) {
	for (let i2=i1; i2<vertex.length; i2++) {
		const dist = Point.Distance(vertex[i1], vertex[i2]);
		edge[i1][i2] = dist;
		edge[i2][i1] = dist;
	}
}
console.log("Graph generated");

const tourEdge = function(tour = []) {
	let tourEdge = [];
	for (let i=0; i<tour.length-1; i++) {
		tourEdge.push([tour[i], tour[i+1]]);
	}
	tourEdge.push([tour[tour.length-1], tour[0]]);
	return tourEdge;
};

const edgeCost = function(tourEdge = [0, 0]) {
	return edge[tourEdge[0]][tourEdge[1]];
};

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
	strokeWeight(1);
	//noStroke();
	circle(Width * p.x, Height * p.y, 5);
};

const tourCost = function(tour = []) {
	return (tourEdge(tour).map(edgeCost)).reduce((a, b) => a+b)
};

// random tour
let tour = [];
for (let i=0; i<vertex.length; i++) {
	tour.push(i);
}

const tourDraw = function() {
	tourEdge(tour).map(edgeDraw);
	vertex.map(pointDraw);
};


let temperature = 1;
const tempDecay = 1/100;

let bestTour = tour;
let bestCost = tourCost(bestTour);

const twoOpt = function() {
	// choose 2 random edges
	let i11 = -1;
	let i12 = -1;
	let i21 = -1;
	let i22 = -1;
	while (true) {
		i11 = Math.floor(Math.random() * tour.length);
		i21 = Math.floor(Math.random() * tour.length);
		i12 = (i11 + 1) % tour.length;
		i22 = (i21 + 1) % tour.length;
		if (i11 != i21 && i12 != i21 && i11 != i22 && i12 != i22) {
			break;
		}
	}
	// calculate cost of the new tour
	let newTour = [];
	for (let i=i12; i != i21; i = (i+1)%tour.length) {
		newTour.push(tour[i]);
	}
	newTour.push(tour[i21]);
	for (let i=i11; i != i22; i = (i+ tour.length-1)%tour.length) {
		newTour.push(tour[i]);
	}
	newTour.push(tour[i22]);
	
	const cost = tourCost(tour);
	const newCost = tourCost(newTour);
	// decision
	let newTourAccept = false;
	const exploreCost = (newCost - cost) / cost;
	if (exploreCost < 0) {
		newTourAccept = true;
		tour = newTour;
	} else {
		const exploreProb = Math.exp(- exploreCost / temperature);
		if (Math.random() < exploreProb) {
			console.log("Iter:", iter, " Explore a tour with prob:", exploreProb);
			newTourAccept = true;
			tour = newTour;
		}
	}
	// decay temperature
	temperature = temperature * (1-tempDecay);
	return newTourAccept;
};

let iter = 0;
const step = 1;
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