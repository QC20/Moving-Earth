/**
 * CreditLink.js
 * 
 * Creates an interactive particle-based credit text that explodes when clicked
 * and redirects to a specified URL. The particles respond to mouse movement with
 * organic, physics-based animation.
 */

class CreditLink {
    /**
     * Constructor for the CreditLink component
     * @param {string} canvasId - ID of the canvas element to use
     * @param {string} redirectURL - URL to redirect to after explosion animation
     */
    constructor(canvasId, redirectURL) {
      // Canvas and context
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      
      // Particle system
      this.particles = [];
      
      // Animation state
      this.isExploding = false;
      this.explosionStartTime = 0;
      
      // Configuration
      this.redirectURL = redirectURL || 'https://jonaskjeldmand.vercel.app/';
      this.explosionDuration = 1500; // 1.5 seconds
      this.fadeOutDuration = 500;    // 0.5 seconds
      this.creditText = 'Jonas Kjeldmand Jensen';
      
      // Mouse tracking
      this.mouse = {
        x: null,
        y: null
      };
      
      // Bind methods to ensure correct 'this' context
      this.handleInteraction = this.handleInteraction.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.handleTouch = this.handleTouch.bind(this);
      this.animate = this.animate.bind(this);
      this.handleResize = this.handleResize.bind(this);
    }
    
    /**
     * Initialize the credit link system
     * Sets up event listeners and starts animation
     */
    init() {
      // Set canvas dimensions
      this.resizeCanvas();
      
      // Create particles from text
      this.createParticles();
      
      // Set up event listeners
      window.addEventListener('mousemove', this.handleInteraction);
      window.addEventListener('touchmove', this.handleInteraction, { passive: false });
      this.canvas.addEventListener('click', this.handleClick);
      this.canvas.addEventListener('touchend', this.handleTouch);
      
      // Start animation loop
      this.animate();
      
      return this;
    }
    
    /**
     * Updates canvas dimensions to match window size
     */
    resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
    
    /**
     * Handle window resize events
     * Resizes canvas and recreates particles
     */
    handleResize() {
      this.resizeCanvas();
      this.createParticles();
    }
    
    /**
     * Creates particles based on rendered text
     * Uses ImageData to determine particle positions
     */
    createParticles() {
      // Clear existing particles
      this.particles = [];
      
      // Calculate font size based on window width
      const fontSize = Math.min(window.innerWidth / 20, 28);
      this.ctx.font = `550 ${fontSize}px "Poppins", Arial, sans-serif`;
      this.ctx.fillStyle = 'white';
      
      // Measure text to position it in bottom right
      const metrics = this.ctx.measureText(this.creditText);
      const textWidth = metrics.width;
      
      const x = this.canvas.width - textWidth - 20;
      const y = this.canvas.height - 20;
      
      // Render text to canvas
      this.ctx.fillText(this.creditText, x, y);
      
      // Get image data to determine particle positions
      const data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      
      // Adjust particle density based on device pixel ratio
      const step = Math.max(1, Math.floor(3 * window.devicePixelRatio));
      
      // Create particles for each pixel of the text
      for (let y = 0; y < data.height; y += step) {
        for (let x = 0; x < data.width; x += step) {
          // Check alpha channel to find pixels that are part of the text
          if (data.data[(y * 4 * data.width) + (x * 4) + 3] > 200) {
            this.particles.push(new Particle(x, y));
          }
        }
      }
      
      // Clear canvas after creating particles
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Handles mouse/touch movement
     * Updates mouse position for particle interactions
     * @param {Event} event - Mouse or touch event
     */
    handleInteraction(event) {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
  
      if (event.type === 'mousemove') {
        this.mouse.x = (event.clientX - rect.left) * scaleX;
        this.mouse.y = (event.clientY - rect.top) * scaleY;
      } else if (event.type === 'touchmove') {
        this.mouse.x = (event.touches[0].clientX - rect.left) * scaleX;
        this.mouse.y = (event.touches[0].clientY - rect.top) * scaleY;
        event.preventDefault();
      }
    }
    
    /**
     * Handles mouse clicks
     * Triggers explosion animation if click is on text
     * @param {MouseEvent} event - Click event
     */
    handleClick(event) {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const clickX = (event.clientX - rect.left) * scaleX;
      const clickY = (event.clientY - rect.top) * scaleY;
  
      const textBounds = this.getTextBounds();
      if (clickX >= textBounds.x && clickX <= textBounds.x + textBounds.width &&
          clickY >= textBounds.y - textBounds.height && clickY <= textBounds.y) {
        this.startExplosion();
      }
    }
    
    /**
     * Handles touch events
     * Triggers explosion animation if touch is on text
     * @param {TouchEvent} event - Touch event
     */
    handleTouch(event) {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const touchX = (event.touches[0].clientX - rect.left) * scaleX;
      const touchY = (event.touches[0].clientY - rect.top) * scaleY;
  
      const textBounds = this.getTextBounds();
      if (touchX >= textBounds.x && touchX <= textBounds.x + textBounds.width &&
          touchY >= textBounds.y - textBounds.height && touchY <= textBounds.y) {
        this.startExplosion();
      }
    }
    
    /**
     * Calculates text boundaries for hit detection
     * @returns {Object} Object with x, y, width, height properties
     */
    getTextBounds() {
      const fontSize = Math.min(window.innerWidth / 20, 28);
      const metrics = this.ctx.measureText(this.creditText);
      
      return {
        x: this.canvas.width - metrics.width - 20,
        y: this.canvas.height - 20,
        width: metrics.width,
        height: fontSize * 1.2 // Approximate height based on font size
      };
    }
    
    /**
     * Starts the explosion animation
     * Triggers particle explosion and sets timer for redirection
     */
    startExplosion() {
      this.isExploding = true;
      this.explosionStartTime = Date.now();
      
      // Apply explosion velocity to each particle
      this.particles.forEach(particle => particle.explode());
      
      // Set timer to redirect after animation completes
      setTimeout(() => {
        window.location.href = this.redirectURL;
      }, this.explosionDuration);
    }
    
    /**
     * Animation loop
     * Updates and draws all particles each frame
     */
    animate() {
      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Current time for animation calculations
      const currentTime = Date.now();
      
      // Update and draw each particle
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].update(this.mouse.x, this.mouse.y, currentTime, this.isExploding, this.explosionStartTime, this.explosionDuration, this.fadeOutDuration);
        this.particles[i].draw(this.ctx);
      }
      
      // Continue animation loop
      requestAnimationFrame(this.animate);
    }
  }
  
  /**
   * Particle class for individual points in the credit text
   * Each particle has physics properties and can respond to mouse position
   */
  class Particle {
    /**
     * Creates a new particle
     * @param {number} x - Initial x position
     * @param {number} y - Initial y position
     */
    constructor(x, y) {
      // Position
      this.x = x;
      this.y = y;
      this.size = 1.25;
      
      // Original position (for return animation)
      this.baseX = x;
      this.baseY = y;
      
      // Physics properties
      this.density = (Math.random() * 10) + 1;
      this.velocity = { x: 0, y: 0 };
      
      // Visual properties
      this.alpha = 1;
      
      // Noise properties for organic movement
      this.noise = {
        x: Math.random() * 0.5 - 0.25,
        y: Math.random() * 0.5 - 0.25
      };
      this.noiseOffset = Math.random() * 1000;
    }
  
    /**
     * Draws the particle
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    draw(ctx) {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
  
    /**
     * Updates particle position and properties
     * @param {number} mouseX - Current mouse X position
     * @param {number} mouseY - Current mouse Y position
     * @param {number} currentTime - Current timestamp for animations
     * @param {boolean} isExploding - Whether explosion animation is active
     * @param {number} explosionStartTime - When explosion animation started
     * @param {number} explosionDuration - Total duration of explosion animation
     * @param {number} fadeOutDuration - Duration of fade out portion of animation
     */
    update(mouseX, mouseY, currentTime, isExploding, explosionStartTime, explosionDuration, fadeOutDuration) {
      // Handle explosion animation state
      if (isExploding) {
        // Continue explosion movement
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        
        // Calculate fade out based on elapsed time
        const elapsedTime = currentTime - explosionStartTime;
        if (elapsedTime > explosionDuration - fadeOutDuration) {
          this.alpha = 1 - (elapsedTime - (explosionDuration - fadeOutDuration)) / fadeOutDuration;
        }
        return;
      }
  
      // Regular interactive state - respond to mouse position
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 35; // Interaction radius (65% smaller than original)
  
      if (distance < maxDistance) {
        // Organic movement when near the mouse/touch
        const force = (maxDistance - distance) / maxDistance;
        const angle = Math.atan2(dy, dx);
        
        // Add noise to the movement for natural feel
        const noiseX = Math.sin(currentTime * 0.002 + this.noiseOffset) * this.noise.x;
        const noiseY = Math.cos(currentTime * 0.002 + this.noiseOffset) * this.noise.y;
        
        // Apply force and noise to velocity
        this.velocity.x += Math.cos(angle) * force * 0.1 + noiseX;
        this.velocity.y += Math.sin(angle) * force * 0.1 + noiseY;
        
        // Apply velocity with damping
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.x *= 0.9;
        this.velocity.y *= 0.9;
      } else {
        // Return to original position with easing when mouse is far away
        const returnForce = 0.05;
        this.velocity.x += (this.baseX - this.x) * returnForce;
        this.velocity.y += (this.baseY - this.y) * returnForce;
        
        // Apply velocity with damping
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.x *= 0.9;
        this.velocity.y *= 0.9;
      }
    }
  
    /**
     * Sets explosion velocity for the particle
     * Called when explosion animation starts
     */
    explode() {
      // Random angle for explosion direction
      const angle = Math.random() * Math.PI * 2;
      // Random speed with minimum threshold
      const speed = Math.random() * 5 + 2;
      
      // Set velocity based on angle and speed
      this.velocity.x = Math.cos(angle) * speed;
      this.velocity.y = Math.sin(angle) * speed;
    }
  }