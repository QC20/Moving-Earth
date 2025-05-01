/**
 * Main entry point for the application
 * 
 * This file initializes and connects the different components
 * of the application, serving as the orchestrator.
 */

// Main app object
const App = {
  // Component instances
  earthViz: null,
  creditLink: null,
  
  /**
   * Initialize the application
   * Sets up all components when the page is fully loaded
   */
  init: function() {
    console.log('Initializing application...');
    
    try {
      // Initialize credit link system
      this.creditLink = new CreditLink('credit-canvas', 'https://jonaskjeldmand.vercel.app/');
      this.creditLink.init();
      
      // Earth visualization is initialized by p5.js automatically
      // through the global functions in sketch.js
      
      console.log('Application initialized successfully');
    } catch (error) {
      console.error('Error initializing application:', error);
    }
  },
  
  /**
   * Handle window resize events
   * Ensures all components adjust to new viewport dimensions
   */
  handleResize: function() {
    try {
      if (this.creditLink) {
        this.creditLink.handleResize();
      }
      // Earth visualization handles resize through p5.js windowResized function
    } catch (error) {
      console.error('Error handling resize:', error);
    }
  }
};

// Wait for the page to fully load before initializing
window.addEventListener('load', function() {
  App.init();
});

// Handle window resizing
window.addEventListener('resize', function() {
  App.handleResize();
});