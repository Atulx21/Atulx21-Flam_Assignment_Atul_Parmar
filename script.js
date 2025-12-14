/**
 * FLAM INTERNSHIP ASSIGNMENT
 * Interactive Bézier Curve with Physics
 * -------------------------------------
 * Architecture:
 * 1. PhysicsPoint: Handles the spring/mass physics for P1 & P2.
 * 2. BezierCurve: Handles the mathematical curve generation B(t).
 * 3. Animation Loop: Orchestrates the rendering.
 */

// --- CONFIGURATION ---
const CONFIG = {
    lineColor: '#38bdf8',       // Light Blue (Tailwind Sky-400)
    pointColor: '#f472b6',      // Pink (Tailwind Pink-400)
    tangentColor: 'rgba(255, 255, 255, 0.3)', // Faint white
    springStiffness: 0.08,      // "k" in Hooke's law (Higher = Snappier)
    damping: 0.88,              // Friction (Lower = more slide/wobble)
    numSamples: 100,            // Smoothness of the curve
    tangentInterval: 12         // Draw a tangent every 12th point
};

// --- SETUP CANVAS ---
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Function to make canvas fit the container perfectly
function resizeCanvas() {
    // We set the internal resolution to match the display size
    // This prevents blurriness on high-DPI screens
    const container = document.querySelector('.container');
    canvas.width = 800;  // Fixed logic width
    canvas.height = 500; // Fixed logic height
    
    // Note: CSS controls the visual size, but these numbers control 
    // the coordinate system we draw on.
}
resizeCanvas();

// Mouse State (Starts in the center)
const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

// --- CLASS 1: THE PHYSICS POINT ---
// Represents a Control Point (P1 or P2) that has mass and velocity
class PhysicsPoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0; // Velocity X
        this.vy = 0; // Velocity Y
    }

    // This function runs every frame (60 times a second)
    update(targetX, targetY) {
        // 1. Distance to target
        const dx = targetX - this.x;
        const dy = targetY - this.y;

        // 2. Acceleration (Hooke's Law: F = kx)
        const ax = dx * CONFIG.springStiffness;
        const ay = dy * CONFIG.springStiffness;

        // 3. Update Velocity
        this.vx += ax;
        this.vy += ay;

        // 4. Apply Damping (Friction)
        this.vx *= CONFIG.damping;
        this.vy *= CONFIG.damping;

        // 5. Update Position
        this.x += this.vx;
        this.y += this.vy;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = CONFIG.pointColor;
        ctx.fill();
    }
}

// --- CLASS 2: THE BÉZIER MATH ---
class BezierCurve {
    constructor() {
        // Fixed Endpoints
        this.p0 = { x: 50, y: canvas.height / 2 };
        this.p3 = { x: canvas.width - 50, y: canvas.height / 2 };

        // Dynamic Control Points (Start at 1/3 and 2/3 of screen)
        this.p1 = new PhysicsPoint(canvas.width / 3, canvas.height / 2);
        this.p2 = new PhysicsPoint((canvas.width / 3) * 2, canvas.height / 2);
    }

    // The Magic Formula: B(t)
    calculatePoint(t) {
        const u = 1 - t; 
        const tt = t * t; 
        const uu = u * u; 
        const uuu = uu * u; 
        const ttt = tt * t; 

        // Cubic Bézier Formula
        let x = uuu * this.p0.x + 
                3 * uu * t * this.p1.x + 
                3 * u * tt * this.p2.x + 
                ttt * this.p3.x;

        let y = uuu * this.p0.y + 
                3 * uu * t * this.p1.y + 
                3 * u * tt * this.p2.y + 
                ttt * this.p3.y;

        return { x, y };
    }

    // Derivative Formula: B'(t) for Tangents
    calculateTangent(t) {
        const u = 1 - t;
        // B'(t) = 3(1-t)²(P1-P0) + 6(1-t)t(P2-P1) + 3t²(P3-P2)
        
        // Term 1
        let t1x = 3 * (u * u) * (this.p1.x - this.p0.x);
        let t1y = 3 * (u * u) * (this.p1.y - this.p0.y);

        // Term 2
        let t2x = 6 * u * t * (this.p2.x - this.p1.x);
        let t2y = 6 * u * t * (this.p2.y - this.p1.y);

        // Term 3
        let t3x = 3 * (t * t) * (this.p3.x - this.p2.x);
        let t3y = 3 * (t * t) * (this.p3.y - this.p2.y);

        let tx = t1x + t2x + t3x;
        let ty = t1y + t2y + t3y;

        // Normalize vector
        let len = Math.sqrt(tx*tx + ty*ty);
        if (len === 0) len = 1;
        return { x: tx/len, y: ty/len };
    }

    update() {
        // Update physics: P1 and P2 chase the mouse with offsets
        // P1 chases 100px to the LEFT of mouse
        this.p1.update(mouse.x - 100, mouse.y);
        // P2 chases 100px to the RIGHT of mouse
        this.p2.update(mouse.x + 100, mouse.y);
    }

    draw(ctx) {
        // Draw the main curve
        ctx.beginPath();
        ctx.moveTo(this.p0.x, this.p0.y);

        for (let i = 0; i <= CONFIG.numSamples; i++) {
            let t = i / CONFIG.numSamples;
            let pos = this.calculatePoint(t);
            ctx.lineTo(pos.x, pos.y);

            // Draw Tangents occasionally
            if (i % CONFIG.tangentInterval === 0 && i > 0 && i < CONFIG.numSamples) {
                let tan = this.calculateTangent(t);
                this.drawTangent(ctx, pos, tan);
            }
        }
        
        ctx.strokeStyle = CONFIG.lineColor;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round'; // Makes line ends smooth
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Draw Control Points (Visual Debugging)
        this.p1.draw(ctx);
        this.p2.draw(ctx);
        
        // Draw Skeleton (Dotted lines)
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(this.p0.x, this.p0.y);
        ctx.lineTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.lineTo(this.p3.x, this.p3.y);
        ctx.stroke();
        ctx.restore();
    }

    drawTangent(ctx, pos, tan) {
        ctx.save();
        ctx.strokeStyle = CONFIG.tangentColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Draw a line 15px in direction of tangent
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x + tan.x * 20, pos.y + tan.y * 20);
        ctx.stroke();
        ctx.restore();
    }
}

// --- MAIN EXECUTION ---
const curve = new BezierCurve();

// Track Mouse Position relative to canvas
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    mouse.x = (e.clientX - rect.left) * scaleX;
    mouse.y = (e.clientY - rect.top) * scaleY;
});

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    curve.update();
    curve.draw(ctx);

    requestAnimationFrame(animate);
}

// Start the engine
animate();