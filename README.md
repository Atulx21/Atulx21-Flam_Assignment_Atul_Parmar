# Interactive Bézier Curve with Physics

**FLAM Internship Assignment Submission**

## 📋 Project Overview
This project implements an interactive cubic Bézier curve that responds to mouse input with a custom spring-damping physics engine. The curve simulates a flexible rope, utilizing vector mathematics to create smooth, natural motion as control points react to cursor movement.

## 🎯 Assignment Compliance Checklist
✅ **Bézier Curve Math** - Manual implementation of the cubic Bézier formula B(t).  
✅ **Tangent Visualization** - Derivative B'(t) computed and rendered to visualize slope.  
✅ **Spring-Damping Physics** - Custom physics engine using Hooke's Law and drag forces.  
✅ **Real-time Interaction** - High-performance 60 FPS animation loop.  
✅ **Zero Dependencies** - Pure Vanilla JavaScript with no external libraries.  
✅ **Clean Architecture** - Modular, class-based design with strict separation of concerns.

## 🔬 Mathematical Implementation

### 1. Cubic Bézier Curve Formula
The curve is generated using the explicit parametric equation for four control points (P₀, P₁, P₂, P₃):

`B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃`

* **P₀, P₃**: Fixed endpoints (static anchors).
* **P₁, P₂**: Dynamic control points driven by the physics engine.
* **Sampling**: The curve is interpolated at 100 discrete steps (`t` from 0.0 to 1.0).

### 2. Tangent Vector Calculation
To visualize the instantaneous direction of the curve, I calculated the first derivative:

`B'(t) = 3(1-t)²(P₁-P₀) + 6(1-t)t(P₂-P₁) + 3t²(P₃-P₂)`

These vectors are normalized to unit length and rendered as faint white lines perpendicular to the curve path at regular intervals.

### 3. Physics Engine (Spring-Mass-Damper)
The control points (P₁ and P₂) are driven by a force-based simulation that exactly matches the assignment requirement:

`Acceleration = -k * (Position - Target) - Damping * Velocity`

**Implementation Details:**
```javascript
// Step 1: Calculate displacement
const dx = this.x - targetX;  // dx = (Position - Target)
const dy = this.y - targetY;  // dy = (Position - Target)

// Step 2: Calculate spring force
const springFx = -k * dx;     // Spring force = -k * (Position - Target)
const springFy = -k * dy;

// Step 3: Calculate damping force
const dampFx = -damping * this.vx;  // Damping force = -damping * Velocity
const dampFy = -damping * this.vy;

// Step 4: Total acceleration (assuming mass = 1)
const ax = springFx + dampFx;
const ay = springFy + dampFy;
```

* **Spring Force:** `-k * (CurrentPosition - TargetPosition)`
   * Pulls the point towards the mouse cursor (with offset).
* **Damping Force:** `-d * Velocity`
   * Applies drag/friction to stabilize the system and prevent infinite oscillation.

**Tuned Parameters:**
* **Stiffness (k):** `0.1` – Provides a snappy, responsive feel.
* **Damping:** `0.12` – Tuned to settle the simulation quickly without "jelly" effects.

## 🏗️ Code Architecture

### File Structure
```text
project/
├── index.html      # Structure & Canvas setup
├── style.css       # Dark mode UI & Responsive layout
├── script.js       # Physics engine & Bézier logic
└── README.md       # This documentation
```

### Class Design
1. **PhysicsPoint**: Encapsulates spring-mass-damper physics for P₁ and P₂.
2. **BezierCurve**: Handles mathematical curve generation and rendering.
3. **Animation Loop**: Orchestrates real-time updates at 60 FPS.

## 🎨 Visual Design
* **Curve**: Light blue (#38bdf8) with rounded line caps
* **Control Points**: Pink (#f472b6) circular markers
* **Skeleton**: Dashed white lines (10% opacity) showing control polygon
* **Tangents**: White directional vectors (30% opacity)
* **Background**: Gradient slate (#0f172a → #1e293b)

## 🚀 Setup & Usage

### Prerequisites
* **Dependencies**: None (0kb external assets)
* Modern web browser with HTML5 Canvas support
* **Optional**: Live Server extension for VS Code (for development)

### Running the Project
1. Clone or download the repository
2. Open `index.html` in any modern browser
3. Move your mouse over the canvas to interact with the curve

**Alternative (Development):**
```bash
# Using VS Code Live Server
1. Install "Live Server" extension
2. Right-click index.html → "Open with Live Server"
```

## 📐 Technical Specifications

### Performance
* **Frame Rate**: Locked at 60 FPS via `requestAnimationFrame`
* **Canvas Resolution**: 800×500 (internal coordinates)
* **Curve Sampling**: 100 points per frame
* **Tangent Density**: Every 12th sample point

### Physics Parameters (Configurable in `script.js`)
```javascript
const CONFIG = {
    springStiffness: 0.1,    // Spring constant (k)
    damping: 0.12,           // Damping coefficient
    pointOffset: 100,        // Control point offset from cursor
    numSamples: 100,         // Curve resolution
    tangentInterval: 12      // Tangent render frequency
};
```

### Browser Compatibility
* ✅ Chrome 90+
* ✅ Firefox 88+
* ✅ Safari 14+
* ✅ Edge 90+

## 🧪 Testing & Validation

### Mathematical Accuracy
* Curve passes through fixed endpoints (P₀, P₃)
* Tangent vectors correctly represent curve derivative
* Physics simulation converges to stable equilibrium

### Interactive Behavior
* Control points smoothly follow mouse with realistic lag
* No jittering or unstable oscillations
* Responsive across different mouse speeds

## 📝 Implementation Notes

### Key Design Decisions
1. **Force-Based Physics**: Uses acceleration integration (Euler method) rather than position interpolation for more realistic motion.
2. **Normalized Tangents**: All tangent vectors are unit length for consistent visualization.
3. **Responsive Canvas**: Mouse coordinates are scaled to handle different canvas display sizes.
4. **Modular Configuration**: All tunable parameters centralized in `CONFIG` object.

### Known Limitations
* Euler integration may accumulate error over very long sessions (not noticeable in practice)
* Canvas fixed at 800×500 internal resolution (scales visually but not in logic)
* No touch device support (mouse events only)

## 🎓 Learning Outcomes
This project demonstrates:
* Parametric curve mathematics and derivatives
* Classical mechanics (Hooke's Law, damping)
* Real-time animation techniques
* Object-oriented JavaScript architecture
* HTML5 Canvas API proficiency

---

**Note**: This implementation uses zero external libraries. All mathematics, physics, and rendering are implemented from scratch using vanilla JavaScript and the HTML5 Canvas API.