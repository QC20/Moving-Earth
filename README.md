# Moving Earth: Interactive Planetary Experience

![Moving Earth Preview](/api/placeholder/800/400)

## Creative Concept

Moving Earth is an interactive visualization that simulates planetary terrain using Perlin noise algorithms and spherical mapping. It transforms mathematical patterns into visually compelling landscapes that respond to user interaction, creating an immersive experience that combines art, science, and interactive design.

The project explores the relationship between mathematical algorithms and natural phenomena, visualizing how small changes in parameters can produce dramatically different terrain patterns. This mirrors how planetary bodies throughout our universe display incredible diversity despite forming from similar processes.

## Features

- **Interactive Rotation**: Move your mouse horizontally to rotate the planet
- **Dynamic Terrain Contrast**: Move your mouse vertically to adjust terrain definition
- **Customizable Parameters**: 
  - Adjust resolution to balance detail vs performance
  - Control rotation speed
  - Choose between visual styles (Binary, Gradient, Colorful)
- **Responsive Design**: Adapts to different screen sizes and devices
- **Intuitive UI**: Elegant interface with expandable information panel

## How People Can Use It

### For Education

- **Teaching Geography**: Demonstrate how elevation maps work
- **Mathematics Visualization**: Show practical applications of trigonometry and noise functions
- **Interactive Exhibits**: Use in science centers to explain planetary formation

### For Creative Projects

- **Generative Art**: Capture unique terrain patterns as artwork
- **Music Visualization**: Connect to audio inputs to create responsive visual experiences
- **Ambient Displays**: Use as an atmospheric background for spaces

### For Meditation

- **Focus Object**: Watch the slowly rotating planet as a relaxation tool
- **Mindfulness Training**: Practice presence by observing the subtle terrain changes

## Examples for Continued Development

Here are some ways you could expand on this project:

### 1. Enhanced Terrain Generation

```javascript
// Advanced terrain generator with more octaves and fractal patterns
function generateTerrain(x, y, z) {
  let amplitude = 1.0;
  let frequency = 1.0;
  let maxValue = 0.0;
  let total = 0.0;
  
  // Use multiple octaves for more natural-looking terrain
  for (let i = 0; i < 6; i++) {
    total += noise(x * frequency, y * frequency, z * frequency) * amplitude;
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  
  return total / maxValue;
}
```

### 2. Atmospheric Effects

```javascript
// Add a glowing atmosphere around the planet
function drawAtmosphere() {
  push();
  blendMode(ADD);
  noFill();
  
  // Create multiple layers with different opacities
  for (let i = 0; i < 5; i++) {
    let atmosphereRadius = width * 0.5 + i * 10;
    let alpha = map(i, 0, 4, 0.1, 0.01);
    
    stroke(0.6, 0.7, 1, alpha); // Blue glow
    strokeWeight(20);
    circle(width/2, height/2, atmosphereRadius * 2);
  }
  
  pop();
}
```

### 3. Biome Visualization

```javascript
// Create different biomes based on elevation and latitude
function getBiomeColor(elevation, latitude) {
  // Polar regions
  if (abs(latitude) > 0.8) {
    return [0.6, 0.2, 0.9]; // White/blue for ice
  }
  
  // Oceans
  if (elevation < 0.4) {
    let depth = map(elevation, 0, 0.4, 0, 1);
    return [0.6, 0.7, map(depth, 0, 1, 0.3, 0.7)]; // Deeper blue for deeper water
  }
  
  // Desert near equator
  if (abs(latitude) < 0.2 && elevation > 0.5) {
    return [0.1, 0.8, 0.7]; // Tan/yellow for desert
  }
  
  // Grasslands
  if (elevation < 0.7) {
    return [0.3, 0.6, 0.5]; // Green for grasslands
  }
  
  // Mountains
  return [0, 0, map(elevation, 0.7, 1, 0.3, 0.1)]; // Gray/white for mountains
}
```

### 4. Day/Night Cycle

```javascript
// Implement a day/night cycle with lighting effects
function applySunlight(x, y, z, normalX, normalY, normalZ) {
  // Calculate sun position (changes over time)
  let sunX = sin(frameCount * 0.001);
  let sunY = 0;
  let sunZ = cos(frameCount * 0.001);
  
  // Calculate dot product for diffuse lighting
  let dotProduct = normalX * sunX + normalY * sunY + normalZ * sunZ;
  dotProduct = max(0.1, dotProduct); // Ambient light
  
  return dotProduct;
}
```

### 5. Data Visualization Integration

```javascript
// Map real-world data onto the planetary surface
function loadAndMapData() {
  // Example: loading climate data
  loadTable('global_temperature.csv', 'csv', 'header', function(data) {
    temperatureData = data;
    
    // Create a 2D array for easy lookup
    for (let row of data.rows) {
      let lat = parseInt(row.get('latitude'));
      let lon = parseInt(row.get('longitude'));
      let temp = parseFloat(row.get('temperature'));
      
      // Store in our lookup array
      temperatureMap[lat+90][lon+180] = temp;
    }
    
    dataLoaded = true;
  });
}