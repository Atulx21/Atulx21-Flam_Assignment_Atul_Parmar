/**
 * FLAM INTERNSHIP ASSIGNMENT
 * Interactive Bézier Curve with Physics
 */

// --- CONFIGURATION ---
const CONFIG = {
    lineColor: '#38bdf8',           // Light Blue
    pointColor: '#f472b6',          // Pink
    tangentColor: 'rgba(255, 255, 255, 0.3)', 
    springStiffness: 0.08,          // "k" value
    damping: 0.88,                  // Friction
    numSamples: 100,
    tangentInterval: 12
};

// --- SETUP CANVAS ---
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = 800;
    canvas.height = 500;
}
resizeCanvas();

// Global Mouse State
const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Debug Text
    ctx.fillStyle = "white";
    ctx.fillText("Setup Complete. Ready for Physics.", 50, 50);

    requestAnimationFrame(animate);
}

// Start Loop
animate();