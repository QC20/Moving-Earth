let n = 75;
let azimuthOffset = 0;


let diameter, r, centreX, centreY, centre, radius;


function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 1);
  noStroke();
  //frameRate(10);
  
  diameter = width / n;
  r = diameter / 2;
  centreX = width / 2;
  centreY = centreX;
  radius = 3;
}

function draw() {

  azimuthOffset += map(mouseX, 0, width, -1, 1) * 0.05;
  background(0);
  
  for(let i = 0; i < n; i++){
    let x = i * diameter + r - centreX;
    let azimuth = map(i, 0, n-1, 0, PI) + azimuthOffset; 
    for(let j = 0; j < n; j++){
      let y = j * diameter + r - centreY;
      let inclination = map(j, 0, n-1, 0, PI);
      if(x * x + y * y > width/2 * (width/2)){
        continue;
      }
      
      // polar coordinates of a sphere
      let nx = radius * sin(inclination) * cos(azimuth);
      let ny = radius * sin(inclination) * sin(azimuth);
      let nz = radius * cos(inclination);
      
      let ns1 = noise(nx + 10, ny + 10, nz + 10);
      let ns2 = noise(nx / 2 + 10, ny / 2 + 10, nz / 2 + 10);
      let ns3 = noise(nx * 2 + 10, ny * 2 + 10, nz * 2 + 10);
			
			if(ns1 > 0.5){
				ns1 = 1;
			}else{
				ns1 = 0;
			}
			
			if(ns2 > 0.5){
				ns2 = 1;
			}else{
				ns2 = 0;
			}
			
			if(ns3 > 0.5){
				ns3 = 1;
			}else{
				ns3 = 0;
			}
			
			let ns = (ns1 + ns2 + ns3) / 3;
			ns = pow(ns, map(mouseY, 0, height, 5, 0));

			fill(0, 0,1- ns);
			
      
      circle(x + centreX, y + centreY, diameter);
      
    }
  }
}