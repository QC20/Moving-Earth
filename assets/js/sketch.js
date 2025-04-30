/**
 * EarthViz.js - Interactive Earth Visualization using p5.js
 * 
 * This file implements a sphere visualization that responds to mouse movement,
 * creating an interactive "Earth" effect with dynamically generated noise patterns.
 * It uses p5.js global mode to keep compatibility with the original sketch structure.
 */

// Visualization parameters
let n = 75;               // Number of points in grid (controls resolution)
let azimuthOffset = 0;    // Rotation offset for sphere mapping
let diameter;             // Diameter of each circle in the grid
let r;                    // Radius of each circle
let centreX, centreY;     // Center coordinates of the visualization
let radius = 3;           // Base radius for noise calculation
let earthCanvas;          // Reference to the p5.js canvas

/**
 * P5.js setup function - runs once at the beginning
 * Initializes the canvas and sets up initial parameters
 */
function setup() {
  // Create a canvas that fits the window size while maintaining aspect ratio
  // Uses 95% of the smaller dimension to ensure it fits nicely on screen
  let size = min(windowWidth, windowHeight) * 0.95;
  earthCanvas = createCanvas(size, size);
  earthCanvas.parent('earth-container'); // Place canvas inside the container
  
  // Set color mode to HSB (Hue, Saturation, Brightness) with normalized values
  colorMode(HSB, 1);
  noStroke();
  
  // Calculate visualization parameters based on canvas size
  recalculateParameters();
}

/**
 * Recalculates dependent parameters when canvas size changes
 * Ensures visualization scales properly at different screen sizes
 */
function recalculateParameters() {
  diameter = width / n;     // Size of each circle based on canvas width
  r = diameter / 2;         // Radius of each circle
  centreX = width / 2;      // X center of visualization
  centreY = centreX;        // Y center of visualization (equal to X for perfect circle)
}

/**
 * P5.js windowResized function - runs when browser window is resized
 * Adjusts canvas and recalculates parameters to fit new screen dimensions
 */
function windowResized() {
  // Resize canvas to fit new window dimensions
  let size = min(windowWidth, windowHeight) * 0.95;
  resizeCanvas(size, size);
  
  // Recalculate dependent parameters
  recalculateParameters();
}

/**
 * P5.js draw function - runs every animation frame
 * Renders the Earth visualization with dynamic response to mouse position
 */
function draw() {
  // Update azimuth offset based on mouse X position
  // This creates rotation effect when moving mouse horizontally
  azimuthOffset += map(mouseX, 0, width, -1, 1) * 0.05;
  
  // Clear background to black each frame
  background(0);
  
  // Nested loops to create grid of points
  for(let i = 0; i < n; i++) {
    // Calculate X position and azimuth angle for spherical mapping
    let x = i * diameter + r - centreX;
    let azimuth = map(i, 0, n-1, 0, PI) + azimuthOffset;
    
    for(let j = 0; j < n; j++) {
      // Calculate Y position and inclination angle for spherical mapping
      let y = j * diameter + r - centreY;
      let inclination = map(j, 0, n-1, 0, PI);
      
      // Skip points outside the circular area (creates sphere boundary)
      if(x * x + y * y > width/2 * (width/2)) {
        continue;
      }
      
      // Convert to 3D sphere coordinates using polar transformation
      let nx = radius * sin(inclination) * cos(azimuth);
      let ny = radius * sin(inclination) * sin(azimuth);
      let nz = radius * cos(inclination);
      
      // Calculate Perlin noise at different scales for varied terrain effect
      let ns1 = noise(nx + 10, ny + 10, nz + 10);           // Large scale noise
      let ns2 = noise(nx / 2 + 10, ny / 2 + 10, nz / 2 + 10); // Medium scale noise
      let ns3 = noise(nx * 2 + 10, ny * 2 + 10, nz * 2 + 10); // Small scale noise
      
      // Threshold noise values to create binary patterns
      // This creates distinct land/water-like areas
      if(ns1 > 0.5) ns1 = 1; else ns1 = 0;
      if(ns2 > 0.5) ns2 = 1; else ns2 = 0;
      if(ns3 > 0.5) ns3 = 1; else ns3 = 0;
      
      // Average the three noise layers for final terrain pattern
      let ns = (ns1 + ns2 + ns3) / 3;
      
      // Apply mouse Y-controlled exponent to create contrast variation
      // Moving mouse vertically changes the terrain contrast
      ns = pow(ns, map(mouseY, 0, height, 5, 0));

      // Set fill color based on noise value (white to black)
      fill(0, 0, 1 - ns);
      
      // Draw circle at grid position with calculated brightness
      circle(x + centreX, y + centreY, diameter);
    }
  }
}