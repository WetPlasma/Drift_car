# Drift Boss (React Three Fiber)

A 3D isometric driving game built to demonstrate **React Three Fiber** capabilities. The objective is to navigate a procedurally generated path using drift mechanics without falling off the platform.

This project implements a custom game loop, vector-based physics, and state management within a React environment.

---

## Architecture & Data Flow

### 1. `App.jsx` (State Container)

- **Role:** Acts as the root component and single source of truth for the game state.
- **Responsibilities:**
  - Manages `gameState` (`menu`, `playing`, `gameover`) and `score`.
  - Renders the 2D UI overlay (Score, Start Screen, Game Over Screen).
  - Passes callback functions (`triggerGameOver`, `updateScore`) down to the 3D scene.
- **Performance:** This component is optimized to re-render **only** when the score updates or the game state changes, ensuring the UI does not affect the 3D performance.

### 2. `Scene.jsx` (Environment Generation)

- **Role:** Handles level generation and lighting setup.
- **Logic:**
  - Uses a binary-style seed string (e.g., `"1110111"`) to determine road placement.
  - Iterates through the seed to generate an array of 3D coordinates.
  - Instantiates the static road meshes (`<CarGround />`) based on these coordinates.

### 3. `GameCar.jsx` (Physics & Logic)

- **Role:** The core game controller. Handles input, movement, and collision.
- **Performance:** Unlike `App.jsx`, this component is bound to the render loop and updates 60+ times per second.

---

## Core Mechanics

### 1. The Game Loop (`useFrame`)

React's default rendering behavior (updating only on state change) is insufficient for real-time games. We utilize `useFrame` from React Three Fiber to hook into the native 3D render loop.

- **UI Components:** Update discretely (event-driven).
- **3D Components:** Update continuously (every frame).

### 2. Physics Implementation

Instead of importing a heavy physics engine like Cannon.js, the game uses custom vector mathematics for lightweight performance.

- **Rotation:** Uses Linear Interpolation (`lerp`) to transition the car's rotation value. This prevents rigid snapping and creates a fluid "drift" effect.
- **Velocity:** Movement is calculated using trigonometric functions based on the car's current rotation angle:
  - `x += Math.sin(rotation) * speed`
  - `z += Math.cos(rotation) * speed`
  - This ensures the car moves in the direction it is facing, allowing for diagonal movement during turns.

### 3. Collision Detection

Collision is calculated spatially rather than using mesh-based intersection.

- **Algorithm:** On every frame, the code calculates the Euclidean distance between the car's position and the center of the nearest road tile.
- **Threshold:** If the distance exceeds the safety threshold (`3.5` units), the car is determined to be off the track, triggering the game-over callback.

### 4. Frame Rate Independence (`delta`)

To ensure consistent gameplay across devices with different refresh rates, all movement calculations are multiplied by `delta`.

- **Definition:** `delta` represents the time (in seconds) elapsed since the last frame.
- **Formula:** `Position = Position + (Speed * delta)`
- **Result:** A device running at 144 FPS and a device running at 30 FPS will move the object the exact same distance over 1 second.

---

## Controls

- **Hold Space:** Turn Right.
- **Release Space:** Turn Left/Go Straight.

## Setup & Execution

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## Asset Credits

- **3D Models:** Standard low-poly assets (`.glb` format).
- **Stack:** React, Three.js, React-Three-Fiber, Vite.
